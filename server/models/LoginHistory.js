import mongoose from 'mongoose'

const loginHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    ip: String,
    device: String,
    location: String,
  },
  { timestamps: true },
)

export const LoginHistory = mongoose.models.LoginHistory || mongoose.model('LoginHistory', loginHistorySchema)
