import app from '../server.js'
import { createServer } from 'http'

// Wrap Express in a request handler for Vercel
export default function handler(req, res) {
  return app(req, res)
}
