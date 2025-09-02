import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    port: 5173, // client dev port
    proxy: {
      '/api/vet': {
        target: 'http://localhost:4000',  // vet-api
        changeOrigin: true,
        rewrite: p => p.replace(/^\/api\/vet/, '')
      },
      '/api/shop': {
        target: 'http://localhost:5000',  // shop-api
        changeOrigin: true,
        rewrite: p => p.replace(/^\/api\/shop/, '')
      }
    }
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
