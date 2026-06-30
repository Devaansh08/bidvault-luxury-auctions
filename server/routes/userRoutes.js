import express from 'express'
import {
  getProfile,
  updateProfile,
  getLoginHistory,
  removeLoginHistoryItem,
  clearAllOtherSessions,
} from '../controllers/userController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/', protect, getProfile)
router.patch('/', protect, updateProfile)
router.get('/login-history', protect, getLoginHistory)
router.delete('/login-history/all-others', protect, clearAllOtherSessions)
router.delete('/login-history/:id', protect, removeLoginHistoryItem)

export default router
