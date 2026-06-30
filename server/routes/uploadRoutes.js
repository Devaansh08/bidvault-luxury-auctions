import express from 'express'
import crypto from 'crypto'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/signature', protect, (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'demo'
  const apiKey = process.env.CLOUDINARY_API_KEY || '123456'
  const apiSecret = process.env.CLOUDINARY_API_SECRET || 'secret'

  const stringToSign = `timestamp=${timestamp}${apiSecret}`
  const signature = crypto.createHash('sha1').update(stringToSign).digest('hex')

  res.json({ success: true, timestamp, signature, cloudName, apiKey })
})

export default router
