const express = require('express');
const { google } = require('googleapis');
const router = express.Router();

const SCOPES = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
];

function getOAuth2Client() {
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );
}

// GET /auth/google - Redirect to Google OAuth
router.get('/google', (req, res) => {
    const oAuth2Client = getOAuth2Client();
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent',
    });
    res.redirect(authUrl);
});

// GET /auth/google/callback - Handle OAuth callback
router.get('/google/callback', async (req, res) => {
    const { code, error } = req.query;

    if (error) {
        console.error('OAuth error:', error);
        return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}?error=auth_failed`);
    }

    if (!code) {
        return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}?error=no_code`);
    }

    try {
        const oAuth2Client = getOAuth2Client();
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        // Get user info
        const oauth2 = google.oauth2({ version: 'v2', auth: oAuth2Client });
        const userInfo = await oauth2.userinfo.get();

        // Store in session
        req.session.tokens = tokens;
        req.session.user = {
            email: userInfo.data.email,
            name: userInfo.data.name,
            picture: userInfo.data.picture,
        };

        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}?auth=success`);
    } catch (err) {
        console.error('OAuth callback error:', err);
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}?error=token_exchange_failed`);
    }
});

// GET /auth/me - Get current user info
router.get('/me', (req, res) => {
    if (!req.session.user || !req.session.tokens) {
        return res.status(401).json({ authenticated: false });
    }
    res.json({
        authenticated: true,
        user: req.session.user,
    });
});

// POST /auth/logout - Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to logout' });
        }
        res.json({ success: true });
    });
});

module.exports = router;
