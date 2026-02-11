import axios from 'axios'

const api = axios.create({
    baseURL: '',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Auth
export const getMe = () => api.get('/auth/me')
export const logout = () => api.post('/auth/logout')

// Folders
export const listFolders = (parentId = null) =>
    api.get('/api/folders', { params: { parentId } })

// Check access
export const checkUrl = (url) =>
    api.get('/api/check-url', { params: { url } })

export const checkAccess = (folderId) =>
    api.get(`/api/check-access/${folderId}`)

// Copy
export const startCopy = (sourceUrl, destFolderId, excludedStrings, createNewFolder) =>
    api.post('/api/copy', { sourceUrl, destFolderId, excludedStrings, createNewFolder })

export const getCopyStatus = (jobId) =>
    api.get(`/api/copy-status/${jobId}`)

// SSE for real-time progress
export const connectCopyProgress = (jobId, onMessage, onError) => {
    const eventSource = new EventSource(`/api/copy-progress/${jobId}`)
    eventSource.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data)
            onMessage(data)
        } catch (e) {
            console.error('SSE parse error:', e)
        }
    }
    eventSource.onerror = (err) => {
        if (onError) onError(err)
        eventSource.close()
    }
    return eventSource
}

export default api
