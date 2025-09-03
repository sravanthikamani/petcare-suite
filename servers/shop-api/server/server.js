import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import connectDB from './configs/db.js'
import 'dotenv/config'
import userRouter from './routes/userRoute.js'
import sellerRouter from './routes/sellerRoute.js'
import connectCloudinary from './configs/cloudinary.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import addressRouter from './routes/addressRoute.js'
import orderRouter from './routes/orderRoute.js'
import { stripeWebhooks } from './controllers/orderController.js'

const app = express()

// --- one-time init (with error handling)
let inited = false
async function init() {
  if (inited) return
  try {
    await connectDB()
    await connectCloudinary()
    inited = true
    console.log('Database and Cloudinary connected successfully')
  } catch (error) {
    console.error('Initialization error:', error)
    // Don't throw - let the request continue but log the error
  }
}

// Initialize immediately when module loads
init()

// --- CORS: allow only your frontend + local dev
const allowList = [
  'http://localhost:5173',
  'https://petcare-suite-client.vercel.app',
]

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    if (allowList.includes(origin)) {
      return callback(null, true)
    }
    
    console.log('CORS blocked origin:', origin)
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  // ...existing code...
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
// ...existing code...
  exposedHeaders: ['Set-Cookie']
}

app.use(cors(corsOptions))

// Handle preflight requests for all routes
app.options('*', cors(corsOptions))

// --- Stripe webhook BEFORE JSON/body parser
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)

// --- middleware
app.use(express.json())
app.use(cookieParser())

// --- routes
app.get('/', (_req, res) => res.json({ 
  message: 'API is Working', 
  timestamp: new Date().toISOString(),
  initialized: inited 
}))
app.get('/api/cors-test', (req, res) => {
  res.json({ cors: req.headers.origin });
});
app.use('/api/user', userRouter)
app.use('/api/seller', sellerRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.message,err.stack)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

// --- local dev only
if (process.env.VERCEL !== '1') {
  const port = process.env.PORT || 5000
  app.listen(port, () =>
    console.log(`shop-api running at http://localhost:${port}`)
  )
}

// filepath: c:\Users\ADMIN\Downloads\petcare-suite\servers\shop-api\server\server.js
// ...existing code...
export default app
// For Vercel serverless
export const config = {
  api: {
    bodyParser: false, // Needed for Stripe raw body
  },
}