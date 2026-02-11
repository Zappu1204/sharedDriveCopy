import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0', 'localhost:3000', 'drivecopy.app'],
    proxy: {
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // SSE needs these settings to work through proxy
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            // Keep connection alive for SSE
            if (req.url && req.url.includes('copy-progress')) {
              proxyReq.setHeader('Cache-Control', 'no-cache')
              proxyReq.setHeader('Connection', 'keep-alive')
            }
          })
        },
      },
    },
  },
})
