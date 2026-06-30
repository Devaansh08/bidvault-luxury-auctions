import express from 'express'
import { getAllUsers, updateUserRole, deleteUser, getUserActivities } from '../controllers/userController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()

router.get('/users', protect, adminOnly, getAllUsers)
router.patch('/users/:id/role', protect, adminOnly, updateUserRole)
router.delete('/users/:id', protect, adminOnly, deleteUser)
router.get('/activities', protect, adminOnly, getUserActivities)

export default router
