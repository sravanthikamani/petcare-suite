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

// --- one-time init
let inited = false
async function init() {
  if (inited) return
  await connectDB()
  await connectCloudinary()
  inited = true
}
await init()

// --- CORS: allow only your frontend + local dev
const allowList = [
  'http://localhost:5173',
  'https://petcare-suite-client.vercel.app',
]

app.use(
  cors({
    origin: function (origin, callback) {
      // allow REST tools or server-to-server
      if (!origin) return callback(null, true)
      if (allowList.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  })
)

// preflight (OPTIONS)
app.options('*', cors())

// --- Stripe webhook BEFORE JSON/body parser
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)

// --- middleware
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

// --- local dev only
if (process.env.VERCEL !== '1') {
  const port = process.env.PORT || 5000
  app.listen(port, () =>
    console.log(`shop-api running at http://localhost:${port}`)
  )
}

export default app
