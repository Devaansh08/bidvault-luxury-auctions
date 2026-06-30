// Server main entrypoint loaded & verified for real-time winning users & shipping
import 'dotenv/config'

import http from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import app from './app.js'
import { initSocket } from './socket/index.js'
import { seedUsersIfEmpty } from './controllers/userController.js'

const PORT = process.env.PORT || 3000
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/auction'

// Create HTTP server
const httpServer = http.createServer(app)

// Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
})

// Initialize socket handlers
initSocket(io)

mongoose
  .connect(MONGO_URL)
  .then(async () => {
    console.log('✅ MongoDB connected successfully')
    await seedUsersIfEmpty()
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    })
  })
  .catch(async (err) => {
    console.error('❌ MongoDB connection error:', err.message)
    if (MONGO_URL.includes('mongodb+srv://')) {
      console.log('\n⚠️  TIP FOR MONGODB ATLAS:')
      console.log('1. Log into https://cloud.mongodb.com/')
      console.log('2. Go to "Network Access" on the left sidebar')
      console.log('3. Click "Add IP Address" -> "Allow Access From Anywhere" (0.0.0.0/0)\n')
    }
    // Attempt fallback to local mongodb if cloud fails
    if (MONGO_URL !== 'mongodb://localhost:27017/auction') {
      console.log('🔄 Attempting fallback connection to local MongoDB (mongodb://localhost:27017/auction)...')
      try {
        await mongoose.connect('mongodb://localhost:27017/auction')
        console.log('✅ Connected to local MongoDB')
        await seedUsersIfEmpty()
      } catch (localErr) {
        console.log('⚠️  Could not connect to local MongoDB either. Starting server in API-only mode.')
      }
    }
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    })
  })

// Graceful shutdown
process.on('SIGTERM', () => {
  httpServer.close(() => {
    mongoose.connection.close()
    process.exit(0)
  })
})
