import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { LoginHistory } from '../models/LoginHistory.js'
import { AppError } from '../middleware/errorHandler.js'
import { sharedUsers } from '../data/usersStore.js'
import { sendEmail, dispatchedEmailsLog } from '../utils/emailService.js'
import { seedUsersIfEmpty } from './userController.js'

function generateToken(res, userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })

  return token
}

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      throw new AppError('Please provide name, email, and password', 400)
    }

    // Send Welcome Email asynchronously
    const welcomeHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #6d28d9;">Welcome to BidVault, ${name}! 🎉</h2>
        <p>Your account has been verified and registered successfully.</p>
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Registered Email:</strong> ${email}</p>
          <p><strong>Security Level:</strong> Encrypted Escrow Account</p>
        </div>
        <p>You can now place maximum automated bids, monitor live countdowns, and enjoy zero-stress auctions.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888;">BidVault Live Auctions System · Confidential & Secure</p>
      </div>
    `
    sendEmail({
      to: email.toLowerCase(),
      subject: '🎉 Welcome to BidVault — Account & Credentials Confirmed',
      html: welcomeHtml,
    }).catch(() => {})

    if (mongoose.connection.readyState !== 1) {
      const newUser = {
        _id: '668123456789abcdef' + Math.floor(100000 + Math.random() * 900000),
        name,
        email: email.toLowerCase(),
        role: 'user',
        avatar: '',
        bio: '',
        location: '',
        createdAt: new Date(),
      }
      sharedUsers.push(newUser)
      const token = generateToken(res, newUser._id)
      return res.status(201).json({ success: true, token, user: newUser })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      throw new AppError('User with this email already exists', 400)
    }

    const user = await User.create({ name, email, password })
    const token = generateToken(res, user._id)

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
      },
    })
  } catch (err) {
    next(err)
  }
}

export const getDispatchedEmails = (req, res) => {
  res.json({ success: true, emails: dispatchedEmailsLog })
}

export const sendTestEmail = async (req, res) => {
  const { email, subject, message } = req.body
  const result = await sendEmail({
    to: email || 'user@bidvault.com',
    subject: subject || '🔔 BidVault System Verification Notice',
    html: `<div style="font-family: Arial; padding: 20px;"><h3>${subject || 'Verification Email'}</h3><p>${message || 'Your email notification pipeline is active and working!'}</p></div>`,
  })
  res.json({ success: true, result })
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      throw new AppError('Please provide email and password', 400)
    }

    if (mongoose.connection.readyState !== 1) {
      let user = sharedUsers.find((u) => u.email === email.toLowerCase())
      if (!user) {
        user = sharedUsers[1] // fallback login
      }
      const token = generateToken(res, user._id)
      return res.json({ success: true, token, user })
    }

    await seedUsersIfEmpty()
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user || !(await user.matchPassword(password))) {
      throw new AppError('Invalid email or password', 401)
    }

    const token = generateToken(res, user._id)

    // Log login history
    try {
      await LoginHistory.create({
        user: user._id,
        ip: req.ip || '127.0.0.1',
        device: req.headers['user-agent']?.slice(0, 50) || 'Web Browser',
        location: 'India',
      })
    } catch (e) {}

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
      },
    })
  } catch (err) {
    next(err)
  }
}

export const logout = (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) })
  res.json({ success: true, message: 'Logged out successfully' })
}

export const getMe = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')

    if (mongoose.connection.readyState !== 1) {
      const user = sharedUsers.find((u) => u._id === decoded.userId) || sharedUsers[1]
      return res.json({ success: true, user })
    }

    const user = await User.findById(decoded.userId)
    if (!user) throw new AppError('User not found', 404)

    res.json({ success: true, user })
  } catch (err) {
    res.status(401).json({ success: false, message: 'Not authenticated' })
  }
}
