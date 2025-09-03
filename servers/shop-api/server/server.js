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

// --- one-time init (ok for serverless cold starts)
let inited = false
async function init() {
  if (inited) return
  await connectDB()
  await connectCloudinary()
  inited = true
}
await init()

// --- CORS: allow your frontends (NOT the API URL)
const allowList = [
  'http://localhost:5173',
  'https://petcare-suite-client.vercel.app',
  // add others if you have them:
  // 'https://petcare-suite-admin.vercel.app',
  // 'https://petcare-suite-frontend.vercel.app',
]
const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true) // server-to-server/CLI
    const ok = allowList.includes(origin) || /\.vercel\.app$/.test(origin) // previews
    if (ok) {
      cb(null, origin)   // ✅ return the origin string (not just true/false)
    } else {
      cb(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}

// --- Stripe webhook BEFORE parsers (raw body)
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)

// --- regular middleware AFTER webhook
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

// --- routes
app.get('/', (_req, res) => res.send('API is Working'))

// ✅ CORS test route (add this here)
app.get("/test-cors", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.json({ message: "CORS headers test" })
})
app.use('/api/user', userRouter)
app.use('/api/seller', sellerRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)

// --- local dev only; NEVER listen on Vercel
if (process.env.VERCEL !== '1') {
  const port = process.env.PORT || 5000
  app.listen(port, () => console.log(`shop-api on http://localhost:${port}`))
}

export default app
