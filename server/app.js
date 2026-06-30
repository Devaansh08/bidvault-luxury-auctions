import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import { errorHandler } from './middleware/errorHandler.js'

import authRoutes from './routes/authRoutes.js'
import auctionRoutes from './routes/auctionRoutes.js'
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import contactRoutes from './routes/contactRoutes.js'

const app = express()

// Security
app.use(helmet())
app.use(compression())

// Rate limiting
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500, standardHeaders: true }))

// CORS
app.use(cors({
  origin: process.env.ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}))

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Mount Routes (Direct and /api prefixed for dual compatibility)
const apiRouter = express.Router()
apiRouter.use('/auth', authRoutes)
apiRouter.use('/auction', auctionRoutes)
apiRouter.use('/user', userRoutes)
apiRouter.use('/admin', adminRoutes)
apiRouter.use('/upload', uploadRoutes)
apiRouter.use('/contact', contactRoutes)
app.use('/api', apiRouter)

app.use('/auth', authRoutes)
app.use('/auction', auctionRoutes)
app.use('/user', userRoutes)
app.use('/admin', adminRoutes)
app.use('/upload', uploadRoutes)
app.use('/contact', contactRoutes)

// Health check
app.get(['/health', '/api/health'], (req, res) => res.json({ status: 'ok', uptime: process.uptime() }))

// 404
app.use((req, res) => res.status(404).json({ message: 'Route not found' }))

// Error handler
app.use(errorHandler)

export default app
