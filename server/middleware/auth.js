import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { User } from '../models/User.js'
import { sharedUsers } from '../data/usersStore.js'
import { AppError } from './errorHandler.js'

export async function protect(req, res, next) {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1]
    if (!token) throw new AppError('Not authenticated', 401)

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    req.userId = decoded.userId

    if (mongoose.connection.readyState !== 1) {
      const user = sharedUsers.find((u) => u._id === req.userId)
      req.user = user || sharedUsers[1]
    } else {
      const user = await User.findById(req.userId)
      if (!user) throw new AppError('User not found', 404)
      req.user = user
    }
    next()
  } catch (err) {
    next(new AppError('Not authenticated', 401))
  }
}

export function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return next(new AppError('Admin access required', 403))
  }
  next()
}
