// client/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(async () => {
  // Force Tailwind to use WASM (no native oxide needed on Vercel)
  process.env.TAILWIND_DISABLE_OXIDE = '1'

  // Dynamically import the plugin AFTER setting the env var
  const tailwind = (await import('@tailwindcss/vite')).default

  return {
    server: {
      port: 5173, // dev only; ignored on build
      proxy: {
        '/api/vet': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          rewrite: p => p.replace(/^\/api\/vet/, '')
        },
        '/api/shop': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          rewrite: p => p.replace(/^\/api\/shop/, '')
        }
      }
    },
    plugins: [react(), tailwind()],
  }
})
