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

// --- CORS (wildcard test, allow everything)
app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}))
app.options('*', cors())  // handle preflight

// --- Stripe webhook BEFORE parsers (raw body)
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)

// --- regular middleware AFTER webhook
app.use(express.json())
app.use(cookieParser())

// --- routes
app.get('/', (_req, res) => res.send('API is Working'))
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
