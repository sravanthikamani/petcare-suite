import app from '../server.js'

// Vercel serverless function handler
export default async function handler(req, res) {
  // The app initialization is already handled in server.js
  return app(req, res)
}