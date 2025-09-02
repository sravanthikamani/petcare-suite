import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    port: 5174,
    proxy: {
      '/api/vet': {
        target: 'http://localhost:5000',  // vet-api
        changeOrigin: true,
        rewrite: p => p.replace(/^\/api\/vet/, '')
      },
      '/api/shop': {
        target: 'http://localhost:4000',  // shop-api
        changeOrigin: true,
        rewrite: p => p.replace(/^\/api\/shop/, '')
      }
    }
  },
  plugins: [react()],
})
