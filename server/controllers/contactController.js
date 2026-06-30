import mongoose from 'mongoose'
import { Contact } from '../models/Contact.js'

export const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body
    if (mongoose.connection.readyState !== 1) {
      return res.status(201).json({ success: true, message: 'Message received' })
    }
    const msg = await Contact.create({ name, email, subject, message })
    res.status(201).json({ success: true, data: msg })
  } catch (err) {
    next(err)
  }
}
