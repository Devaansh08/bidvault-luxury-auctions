import express from 'express'
import { signup, login, logout, getMe, getDispatchedEmails, sendTestEmail } from '../controllers/authController.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/register', signup)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', getMe)
router.get('/emails', getDispatchedEmails)
router.post('/test-email', sendTestEmail)

export default router
