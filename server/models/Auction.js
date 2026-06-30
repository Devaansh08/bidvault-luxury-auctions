import mongoose from 'mongoose'

const auctionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an auction title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      index: true,
    },
    image: {
      type: String,
      required: [true, 'Please provide an item photo URL'],
    },
    startingBid: {
      type: Number,
      required: [true, 'Please specify a starting bid'],
      min: 0,
    },
    currentBid: {
      type: Number,
      default: function () {
        return this.startingBid
      },
    },
    totalBids: {
      type: Number,
      default: 0,
    },
    endDate: {
      type: Date,
      required: [true, 'Please specify an end date'],
      index: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    winningBid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bid',
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'ended', 'cancelled'],
      default: 'active',
      index: true,
    },
  },
  { timestamps: true },
)

export const Auction = mongoose.models.Auction || mongoose.model('Auction', auctionSchema)
