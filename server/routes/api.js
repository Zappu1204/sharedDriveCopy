const express = require('express');
const { google } = require('googleapis');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Store for SSE connections and copy progress
const copyJobs = new Map();

// Auth middleware
function requireAuth(req, res, next) {
    if (!req.session.tokens || !req.session.user) {
        return res.status(401).json({ error: 'Not authenticated. Please login first.' });
    }
    next();
}

// Create Drive client from session tokens
function makeDriveClient(tokens) {
    const oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );
    oAuth2Client.setCredentials(tokens);
    return google.drive({ version: 'v3', auth: oAuth2Client });
}

// Extract folder ID from Google Drive URL
function extractFolderIdFromUrl(url) {
    if (!url) return null;
    // Match folder IDs from various Google Drive URL formats
    const patterns = [
        /\/folders\/([a-zA-Z0-9_-]{10,})/,
        /id=([a-zA-Z0-9_-]{10,})/,
        /\/d\/([a-zA-Z0-9_-]{10,})/,
        /^([a-zA-Z0-9_-]{10,})$/, // raw ID
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    // Fallback: match any long alphanumeric string
    const fallback = url.match(/[-\w]{25,}/);
    return fallback ? fallback[0] : null;
}

// GET /api/check-access/:folderId - Check access to a folder
router.get('/check-access/:folderId', requireAuth, async (req, res) => {
    try {
        const drive = makeDriveClient(req.session.tokens);
        const { folderId } = req.params;

        // Get basic folder info (works for Viewer access)
        const response = await drive.files.get({
            fileId: folderId,
            fields: 'id, name, mimeType, owners, shared, capabilities(canCopy, canEdit, canShare)',
            supportsAllDrives: true,
        });

        const folder = response.data;

        if (folder.mimeType !== 'application/vnd.google-apps.folder') {
            return res.status(400).json({ error: 'The provided ID is not a folder.' });
        }

        // Try to get permissions (may fail for non-owner, that's OK)
        let permissions = [];
        try {
            const permRes = await drive.permissions.list({
                fileId: folderId,
                fields: 'permissions(emailAddress, role, type, displayName)',
                supportsAllDrives: true,
            });
            permissions = permRes.data.permissions || [];
        } catch (permErr) {
            // Permissions listing not allowed — user likely only has viewer access
            // This is fine, we can still proceed
            console.log('Could not list permissions (viewer-only access):', permErr.message);
        }

        // Count items in folder
        const countRes = await drive.files.list({
            q: `'${folderId}' in parents and trashed = false`,
            fields: 'files(id)',
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
            pageSize: 1000,
        });

        res.json({
            id: folder.id,
            name: folder.name,
            owners: folder.owners || [],
            shared: folder.shared,
            capabilities: folder.capabilities || {},
            permissions,
            itemCount: countRes.data.files ? countRes.data.files.length : 0,
            userEmail: req.session.user.email,
        });
    } catch (err) {
        if (err.code === 404) {
            return res.status(404).json({ error: 'Folder not found. Please check the link.' });
        }
        if (err.code === 403) {
            return res.status(403).json({ error: 'You do not have access to this folder. Ask the owner to share it with you.' });
        }
        console.error('Check access error:', err.message);
        res.status(500).json({ error: `Failed to check access: ${err.message}` });
    }
});

// GET /api/check-url - Validate and extract folder ID from URL
router.get('/check-url', requireAuth, (req, res) => {
    const { url } = req.query;
    const folderId = extractFolderIdFromUrl(url);
    if (!folderId) {
        return res.status(400).json({ error: 'Invalid Google Drive URL. Cannot extract folder ID.' });
    }
    res.json({ folderId });
});

// GET /api/folders - List user's folders (tree view)
router.get('/folders', requireAuth, async (req, res) => {
    try {
        const drive = makeDriveClient(req.session.tokens);
        const { parentId } = req.query;

        const query = parentId
            ? `'${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`
            : `'root' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`;

        const folders = [];
        let pageToken = null;

        do {
            const response = await drive.files.list({
                q: query,
                fields: 'files(id, name, mimeType), nextPageToken',
                orderBy: 'name',
                pageSize: 100,
                pageToken,
            });

            if (response.data.files) {
                folders.push(...response.data.files);
            }
            pageToken = response.data.nextPageToken;
        } while (pageToken);

        res.json({ folders });
    } catch (err) {
        console.error('List folders error:', err.message);
        res.status(500).json({ error: `Failed to list folders: ${err.message}` });
    }
});

// POST /api/copy - Start copy operation (supports multiple source URLs)
router.post('/copy', requireAuth, async (req, res) => {
    const { sourceUrls, sourceUrl, destFolderId, excludedStrings = [], createNewFolder } = req.body;

    // Support both array (new) and single string (legacy)
    let urls = [];
    if (Array.isArray(sourceUrls) && sourceUrls.length) {
        urls = sourceUrls;
    } else if (sourceUrl) {
        urls = [sourceUrl];
    }

    // Extract folder IDs
    const sourceFolderIds = [];
    for (const url of urls) {
        const fid = extractFolderIdFromUrl(url);
        if (!fid) {
            return res.status(400).json({ error: `Invalid URL: ${url.slice(0, 80)}` });
        }
        sourceFolderIds.push(fid);
    }

    if (!sourceFolderIds.length) {
        return res.status(400).json({ error: 'No valid source URLs provided.' });
    }

    // Create job ID
    const jobId = uuidv4();

    // Initialize job
    copyJobs.set(jobId, {
        status: 'running',
        totalFiles: 0,
        copiedFiles: 0,
        skippedFiles: 0,
        errorFiles: 0,
        totalSize: 0,
        logs: [],
        startTime: Date.now(),
        sseClients: [],
    });

    // Return job ID immediately
    res.json({ jobId });

    // Start copy in background
    const drive = makeDriveClient(req.session.tokens);
    runCopyJob(drive, jobId, sourceFolderIds, destFolderId, excludedStrings, createNewFolder);
});

// GET /api/copy-progress/:jobId - SSE endpoint for progress
router.get('/copy-progress/:jobId', (req, res) => {
    const { jobId } = req.params;
    const job = copyJobs.get(jobId);

    if (!job) {
        return res.status(404).json({ error: 'Job not found' });
    }

    // Setup SSE
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': process.env.CLIENT_URL || 'http://localhost:5173',
        'Access-Control-Allow-Credentials': 'true',
    });

    // Send current state
    res.write(`data: ${JSON.stringify({
        type: 'status',
        ...getJobStatus(job),
    })}\n\n`);

    // Send all existing logs
    for (const log of job.logs) {
        res.write(`data: ${JSON.stringify({ type: 'log', ...log })}\n\n`);
    }

    // Register client
    job.sseClients.push(res);

    // Cleanup on close
    req.on('close', () => {
        const index = job.sseClients.indexOf(res);
        if (index > -1) job.sseClients.splice(index, 1);
    });
});

// GET /api/copy-status/:jobId - Get copy job status (polling fallback)
router.get('/copy-status/:jobId', (req, res) => {
    const { jobId } = req.params;
    const job = copyJobs.get(jobId);

    if (!job) {
        return res.status(404).json({ error: 'Job not found' });
    }

    res.json(getJobStatus(job));
});

function getJobStatus(job) {
    return {
        status: job.status,
        totalFiles: job.totalFiles,
        copiedFiles: job.copiedFiles,
        skippedFiles: job.skippedFiles,
        errorFiles: job.errorFiles,
        totalSize: job.totalSize,
        elapsed: Date.now() - job.startTime,
        error: job.error || null,
        destFolderId: job.destFolderId || null,
    };
}

function sendSSE(job, data) {
    const message = `data: ${JSON.stringify(data)}\n\n`;
    for (const client of job.sseClients) {
        try {
            client.write(message);
        } catch (e) {
            // Client disconnected
        }
    }
}

function addLog(job, level, message, details = null) {
    const log = { level, message, details, time: Date.now() };
    job.logs.push(log);
    sendSSE(job, { type: 'log', ...log });
}

// Recursive copy logic — supports multiple source folders
async function runCopyJob(drive, jobId, sourceFolderIds, destFolderId, excludedStrings, createNewFolder) {
    const job = copyJobs.get(jobId);
    if (!job) return;

    try {
        const totalSources = sourceFolderIds.length;
        addLog(job, 'info', `🔍 Checking ${totalSources} source folder(s)...`);

        // 1. Gather info for all source folders
        const sourceFolders = [];
        for (let i = 0; i < sourceFolderIds.length; i++) {
            const fid = sourceFolderIds[i];
            try {
                const res = await drive.files.get({
                    fileId: fid,
                    fields: 'id, name, owners',
                    supportsAllDrives: true,
                });
                sourceFolders.push(res.data);
                addLog(job, 'success', `📂 [${i + 1}/${totalSources}] Source: "${res.data.name}"`);
            } catch (e) {
                addLog(job, 'error', `❌ [${i + 1}/${totalSources}] Cannot access folder ID: ${fid}`);
                // Skip this folder but continue with others
            }
        }

        if (!sourceFolders.length) {
            job.status = 'error';
            job.error = 'Cannot access any source folder. Please check permissions.';
            addLog(job, 'error', job.error);
            sendSSE(job, { type: 'status', ...getJobStatus(job) });
            return;
        }

        // 2. Count total files across all sources
        addLog(job, 'info', '📊 Counting files...');
        let grandTotal = 0;
        for (const sf of sourceFolders) {
            const count = await countFilesRecursive(drive, sf.id, excludedStrings);
            grandTotal += count;
        }
        job.totalFiles = grandTotal;
        addLog(job, 'info', `📊 Total items to copy: ${grandTotal} (from ${sourceFolders.length} folder(s))`);
        sendSSE(job, { type: 'status', ...getJobStatus(job) });

        // 3. Copy each source folder
        for (let i = 0; i < sourceFolders.length; i++) {
            const sf = sourceFolders[i];
            const prefix = sourceFolders.length > 1 ? `[${i + 1}/${sourceFolders.length}] ` : '';

            // Determine destination for this source
            let finalDestId = destFolderId;
            if (createNewFolder || !destFolderId) {
                addLog(job, 'info', `${prefix}📁 Creating destination folder for "${sf.name}"...`);
                try {
                    const destFolder = await drive.files.create({
                        requestBody: {
                            name: `[Copy] ${sf.name}`,
                            mimeType: 'application/vnd.google-apps.folder',
                            parents: destFolderId ? [destFolderId] : ['root'],
                        },
                        fields: 'id, name',
                    });
                    finalDestId = destFolder.data.id;
                    addLog(job, 'success', `${prefix}📁 Created: "${destFolder.data.name}"`);
                } catch (e) {
                    addLog(job, 'error', `${prefix}❌ Failed to create destination: ${e.message}`);
                    continue; // Skip this source, try next
                }
            }

            // Save the last dest folder ID for the "Open in Drive" button
            job.destFolderId = finalDestId;

            // Copy recursively
            addLog(job, 'info', `${prefix}🚀 Copying "${sf.name}"...`);
            await copyFolderRecursive(drive, job, sf.id, finalDestId, excludedStrings, '');
            addLog(job, 'success', `${prefix}✅ Done copying "${sf.name}"`);
        }

        // 4. Complete
        job.status = 'completed';
        const elapsed = ((Date.now() - job.startTime) / 1000).toFixed(1);
        const sizeMB = (job.totalSize / (1024 * 1024)).toFixed(2);
        addLog(job, 'success', `✅ All done! ${job.copiedFiles} files copied (${sizeMB} MB) in ${elapsed}s`);
        if (job.skippedFiles > 0) {
            addLog(job, 'warning', `⚠️ ${job.skippedFiles} files skipped (excluded)`);
        }
        if (job.errorFiles > 0) {
            addLog(job, 'warning', `❌ ${job.errorFiles} files failed`);
        }
        sendSSE(job, { type: 'status', ...getJobStatus(job) });

    } catch (err) {
        job.status = 'error';
        job.error = `Copy failed: ${err.message}`;
        addLog(job, 'error', job.error);
        sendSSE(job, { type: 'status', ...getJobStatus(job) });
    }
}

async function countFilesRecursive(drive, folderId, excludedStrings) {
    let count = 0;
    let pageToken = null;

    do {
        const res = await drive.files.list({
            q: `'${folderId}' in parents and trashed = false`,
            fields: 'files(id, name, mimeType), nextPageToken',
            pageToken,
            pageSize: 1000,
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
        });

        for (const file of res.data.files || []) {
            // Check exclude
            if (excludedStrings && excludedStrings.length > 0) {
                if (excludedStrings.some(s => s && file.name.includes(s))) continue;
            }

            if (file.mimeType === 'application/vnd.google-apps.folder') {
                count += 1; // count the folder itself
                count += await countFilesRecursive(drive, file.id, excludedStrings);
            } else {
                count += 1;
            }
        }

        pageToken = res.data.nextPageToken;
    } while (pageToken);

    return count;
}

async function copyFolderRecursive(drive, job, sourceFolderId, destParentId, excludedStrings, indent) {
    let pageToken = null;

    do {
        const res = await drive.files.list({
            q: `'${sourceFolderId}' in parents and trashed = false`,
            fields: 'files(id, name, mimeType, size), nextPageToken',
            orderBy: 'name',
            pageToken,
            pageSize: 100,
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
        });

        for (const file of res.data.files || []) {
            // Check exclude
            if (excludedStrings && excludedStrings.length > 0) {
                if (excludedStrings.some(s => s && file.name.includes(s))) {
                    job.skippedFiles += 1;
                    addLog(job, 'warning', `${indent}⏭️ Skipped: "${file.name}" (excluded)`);
                    sendSSE(job, { type: 'status', ...getJobStatus(job) });
                    continue;
                }
            }

            if (file.mimeType === 'application/vnd.google-apps.folder') {
                // Create subfolder
                addLog(job, 'info', `${indent}📂 Entering folder: "${file.name}"`);
                try {
                    const newFolder = await drive.files.create({
                        requestBody: {
                            name: file.name,
                            mimeType: 'application/vnd.google-apps.folder',
                            parents: [destParentId],
                        },
                        fields: 'id',
                    });
                    job.copiedFiles += 1;
                    sendSSE(job, { type: 'status', ...getJobStatus(job) });

                    // Recurse into subfolder
                    await copyFolderRecursive(drive, job, file.id, newFolder.data.id, excludedStrings, indent + '  ');
                } catch (e) {
                    job.errorFiles += 1;
                    addLog(job, 'error', `${indent}❌ Failed to create folder "${file.name}": ${e.message}`);
                    sendSSE(job, { type: 'status', ...getJobStatus(job) });
                }
            } else {
                // Copy file
                try {
                    await drive.files.copy({
                        fileId: file.id,
                        requestBody: { parents: [destParentId] },
                        supportsAllDrives: true,
                    });

                    const fileSize = parseInt(file.size || '0', 10);
                    job.totalSize += fileSize;
                    job.copiedFiles += 1;

                    const sizeMB = (fileSize / (1024 * 1024)).toFixed(2);
                    addLog(job, 'success', `${indent}✅ "${file.name}" (${sizeMB} MB)`);
                    sendSSE(job, { type: 'status', ...getJobStatus(job) });
                } catch (e) {
                    job.errorFiles += 1;
                    addLog(job, 'error', `${indent}❌ "${file.name}": ${e.message}`);
                    sendSSE(job, { type: 'status', ...getJobStatus(job) });
                }
            }
        }

        pageToken = res.data.nextPageToken;
    } while (pageToken);
}

module.exports = router;
