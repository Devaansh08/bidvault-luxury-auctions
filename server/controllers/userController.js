import mongoose from 'mongoose'
import { User } from '../models/User.js'
import { Auction } from '../models/Auction.js'
import { Bid } from '../models/Bid.js'
import { LoginHistory } from '../models/LoginHistory.js'
import { AppError } from '../middleware/errorHandler.js'
import { dummyAuctionsData, mockAuctions, mockBids } from './auctionController.js'
import { sharedUsers } from '../data/usersStore.js'

export const getProfile = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const found = sharedUsers.find((u) => u._id === req.userId) || sharedUsers[1]
      return res.json({ success: true, user: found })
    }
    const user = await User.findById(req.userId)
    if (!user) throw new AppError('User not found', 404)
    res.json({ success: true, user })
  } catch (err) {
    next(err)
  }
}

export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, location, avatar, phone, website, shippingAddress, vipTier } = req.body
    if (mongoose.connection.readyState !== 1) {
      let user = sharedUsers.find((u) => u._id === req.userId)
      if (!user) {
        user = sharedUsers[1]
      }
      if (name !== undefined) user.name = name
      if (bio !== undefined) user.bio = bio
      if (location !== undefined) user.location = location
      if (avatar !== undefined) user.avatar = avatar
      if (phone !== undefined) user.phone = phone
      if (website !== undefined) user.website = website
      if (shippingAddress !== undefined) user.shippingAddress = shippingAddress
      if (vipTier !== undefined) user.vipTier = vipTier
      return res.json({ success: true, user })
    }
    const updateData = {}
    if (name !== undefined) updateData.name = name
    if (bio !== undefined) updateData.bio = bio
    if (location !== undefined) updateData.location = location
    if (avatar !== undefined) updateData.avatar = avatar
    if (phone !== undefined) updateData.phone = phone
    if (website !== undefined) updateData.website = website
    if (shippingAddress !== undefined) updateData.shippingAddress = shippingAddress
    if (vipTier !== undefined) updateData.vipTier = vipTier

    const user = await User.findByIdAndUpdate(req.userId, updateData, { new: true, runValidators: true })
    res.json({ success: true, user })
  } catch (err) {
    next(err)
  }
}

export const getMyAuctions = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const myItems = mockAuctions.filter((a) => {
        const sellerId = typeof a.seller === 'object' ? a.seller._id : a.seller
        return sellerId === req.userId
      })
      return res.json({ success: true, auctions: myItems })
    }
    const auctions = await Auction.find({ seller: req.userId }).sort({ createdAt: -1 })
    res.json({ success: true, auctions })
  } catch (err) {
    next(err)
  }
}

export const getMyBids = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const myBids = mockBids.filter((b) => {
        const bidderId = typeof b.bidder === 'object' ? b.bidder._id : b.bidder
        return bidderId === req.userId
      })
      const enrichedBids = myBids.map((b) => {
        const auctionObj = mockAuctions.find((a) => a._id === b.auction) || null
        return {
          ...b,
          auction: auctionObj,
          isTopBid: auctionObj ? auctionObj.currentBid === b.amount : true
        }
      })
      return res.json({ success: true, bids: enrichedBids })
    }
    const bids = await Bid.find({ bidder: req.userId }).populate('auction').sort({ createdAt: -1 })
    // determine isTopBid
    const enrichedBids = await Promise.all(
      bids.map(async (b) => {
        const topBid = await Bid.findOne({ auction: b.auction?._id }).sort({ amount: -1 })
        return {
          ...b.toObject(),
          isTopBid: topBid?._id?.toString() === b._id.toString(),
        }
      })
    )
    res.json({ success: true, bids: enrichedBids })
  } catch (err) {
    next(err)
  }
}

let mockLoginHistory = [
  { _id: '1', device: 'Chrome on Windows 11', location: 'New Delhi, India', ip: '103.24.11.90', createdAt: new Date() },
  { _id: '2', device: 'Safari on iPhone 15 Pro', location: 'Mumbai, India', ip: '49.36.120.15', createdAt: new Date(Date.now() - 3600000 * 5) },
  { _id: '3', device: 'Firefox on macOS Sonoma', location: 'Bangalore, India', ip: '115.110.42.12', createdAt: new Date(Date.now() - 86400000 * 2) }
]

export const getLoginHistory = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, history: mockLoginHistory })
    }
    const history = await LoginHistory.find({ user: req.userId }).sort({ createdAt: -1 }).limit(10)
    res.json({ success: true, history })
  } catch (err) {
    next(err)
  }
}

export const removeLoginHistoryItem = async (req, res, next) => {
  try {
    const { id } = req.params
    if (mongoose.connection.readyState !== 1) {
      mockLoginHistory = mockLoginHistory.filter((entry) => entry._id !== id)
      return res.json({ success: true, message: 'Session revoked and removed' })
    }
    await LoginHistory.findOneAndDelete({ _id: id, user: req.userId })
    res.json({ success: true, message: 'Session revoked and removed' })
  } catch (err) {
    next(err)
  }
}

export const clearAllOtherSessions = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      // keep only first entry as current session
      mockLoginHistory = mockLoginHistory.slice(0, 1)
      return res.json({ success: true, message: 'All other sessions revoked' })
    }
    // delete all except current session
    const latest = await LoginHistory.findOne({ user: req.userId }).sort({ createdAt: -1 })
    if (latest) {
      await LoginHistory.deleteMany({ user: req.userId, _id: { $ne: latest._id } })
    }
    res.json({ success: true, message: 'All other sessions revoked' })
  } catch (err) {
    next(err)
  }
}

export const seedUsersIfEmpty = async () => {
  if (mongoose.connection.readyState !== 1) return
  try {
    let adminExists = await User.findOne({ email: 'admin@bidvault.com' }).select('+password')
    if (!adminExists) {
      await User.create({
        _id: '668123456789abcdef000001',
        name: 'Demo Admin',
        email: 'admin@bidvault.com',
        password: 'Admin@123',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
        bio: 'Platform Administrator & Curator of Fine Antiquities.',
        location: 'Mumbai, India',
        phone: '+91 98110 00001',
        vipTier: 'Black Diamond VIP',
      })
      console.log('👑 Admin account seeded into MongoDB: admin@bidvault.com / Admin@123')
    } else {
      adminExists.role = 'admin'
      adminExists.password = 'Admin@123'
      await adminExists.save()
    }
    const totalUsers = await User.countDocuments()
    if (totalUsers < 3) {
      const demoUsers = [
        {
          _id: '668123456789abcdef000002',
          name: 'Devansh Sharma',
          email: 'devanshdevil0@gmail.com',
          password: 'user123',
          role: 'user',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
          bio: 'Watch & Art Collector. Passionate about 1960s vintage mechanical horology.',
          location: 'New Delhi, India',
          phone: '+91 98110 45291',
          vipTier: 'Gold Collector',
        },
        {
          name: 'Aarav Mehta',
          email: 'aarav.mehta@collectors.in',
          password: 'user123',
          role: 'user',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
          bio: 'Luxury automobile enthusiast and vintage numismatic expert.',
          location: 'Bangalore, India',
          phone: '+91 98801 23456',
          vipTier: 'Platinum VIP',
        },
        {
          name: 'Elena Rostova',
          email: 'elena.art@europebid.com',
          password: 'user123',
          role: 'user',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
          bio: 'European contemporary fine arts gallery director.',
          location: 'Paris, France',
          phone: '+33 6 12 34 56 78',
          vipTier: 'Titanium Patron',
        },
        {
          name: 'Vikramaditya Singhania',
          email: 'vikram@singhaniagroup.com',
          password: 'user123',
          role: 'user',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
          bio: 'Real estate investor and antique jewelry collector.',
          location: 'Mumbai, India',
          phone: '+91 98200 99887',
          vipTier: 'Black Diamond VIP',
        },
        {
          name: 'Sophia Chen',
          email: 'sophia.c@asiaauctions.sg',
          password: 'user123',
          role: 'user',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
          bio: 'Specialist in Song Dynasty ceramics and rare Asian jade.',
          location: 'Singapore',
          phone: '+65 9123 4567',
          vipTier: 'Gold Collector',
        },
      ]
      for (const u of demoUsers) {
        const ex = await User.findOne({ email: u.email })
        if (!ex) {
          await User.create(u)
        }
      }
      console.log('✅ Demo collector accounts seeded into MongoDB')
    }
  } catch (err) {
    console.error('Error seeding users:', err.message)
  }
}

export const getAllUsers = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        users: sharedUsers.map((u, i) => ({
          ...u,
          shippingAddress: u.location ? `${u.location} (VIP Express Delivery)` : '42, Connaught Place, New Delhi, India 110001',
          totalWon: u.role === 'admin' ? 0 : 3,
          escrowStatus: 'Verified & Insured',
        })),
        total: sharedUsers.length
      })
    }
    await seedUsersIfEmpty()
    let users = await User.find().sort({ createdAt: -1 }).lean()
    
    const defaultAddresses = [
      '42, Connaught Place, New Delhi, India 110001 (Phone: +91 98110 45291)',
      '15, MG Road, Bangalore, Karnataka 560001 (Phone: +91 98801 23456)',
      '12 Rue de la Paix, Paris, France 75002 (Phone: +33 6 12 34 56 78)',
      '88, Marine Drive, Nariman Point, Mumbai 400021 (Phone: +91 98200 99887)',
      'Orchard Road #14-02, Singapore 238865 (Phone: +65 9123 4567)',
    ]

    users = users.map((u, i) => ({
      ...u,
      shippingAddress: u.location ? `${u.location} — Premier Suite #${101 + i}` : defaultAddresses[i % defaultAddresses.length],
      totalWon: u.role === 'admin' ? 0 : ((i % 4) + 1),
      escrowStatus: i % 2 === 0 ? 'Dispatched via Insured Express' : 'Secured in Escrow Vault',
    }))

    res.json({ success: true, users, total: users.length })
  } catch (err) {
    next(err)
  }
}

export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params
    const { role } = req.body
    if (mongoose.connection.readyState !== 1) {
      const u = sharedUsers.find((user) => user._id === id)
      if (u) u.role = role
      return res.json({ success: true })
    }
    await User.findByIdAndUpdate(id, { role })
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params
    if (mongoose.connection.readyState !== 1) {
      const index = sharedUsers.findIndex((user) => user._id === id)
      if (index !== -1) {
        sharedUsers.splice(index, 1)
      }
      return res.json({ success: true })
    }
    await User.findByIdAndDelete(id)
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

export const getUserActivities = async (req, res, next) => {
  try {
    const mockWinnerActivities = [
      {
        _id: 'win_101',
        type: 'winner',
        user: { name: 'Devansh Sharma', email: 'devanshdevil0@gmail.com' },
        details: '🏆 WON "1968 Rolex Submariner Ref. 5512" for ₹18,400. Shipping Address: 42, Connaught Place, New Delhi, India 110001 (Tracking ID: BLUE-98214-IN). Escrow Status: Paid & Dispatched.',
        createdAt: new Date(Date.now() - 15 * 60000),
      },
      {
        _id: 'win_102',
        type: 'winner',
        user: { name: 'Aarav Mehta', email: 'aarav.mehta@collectors.in' },
        details: '🏆 WON "1973 Porsche 911 Carrera RS 2.7" for ₹5,10,000. Shipping Address: 15, MG Road, Bangalore, Karnataka 560001 (Tracking ID: DHL-44109-IN). Escrow Status: Insured Escrow Transit.',
        createdAt: new Date(Date.now() - 45 * 60000),
      },
      {
        _id: 'win_103',
        type: 'winner',
        user: { name: 'Elena Rostova', email: 'elena.art@europebid.com' },
        details: '🏆 WON "Original Banksy Signed Screenprint" for ₹42,000. Shipping Address: 12 Rue de la Paix, Paris, France 75002 (Tracking ID: FEDEX-7781-FR). Escrow Status: Delivered & Verified.',
        createdAt: new Date(Date.now() - 90 * 60000),
      },
    ]

    if (mongoose.connection.readyState !== 1) {
      const activities = [
        ...mockWinnerActivities,
        {
          _id: 'act_1',
          type: 'login',
          user: { name: 'Devansh Sharma', email: 'devanshdevil0@gmail.com' },
          details: 'Logged in from New Delhi, India (Chrome / Windows)',
          createdAt: new Date(Date.now() - 5 * 60000),
        },
        {
          _id: 'act_2',
          type: 'bid',
          user: { name: 'Devansh Sharma', email: 'devanshdevil0@gmail.com' },
          details: 'Placed bid of ₹42,000 on Original Banksy Signed Screenprint',
          createdAt: new Date(Date.now() - 30 * 60000),
        },
        {
          _id: 'act_3',
          type: 'login',
          user: { name: 'Demo Admin', email: 'admin@bidvault.com' },
          details: 'Logged in from Mumbai, India (Firefox / macOS)',
          createdAt: new Date(Date.now() - 120 * 60000),
        },
        {
          _id: 'act_4',
          type: 'auction',
          user: { name: 'Devansh Sharma', email: 'devanshdevil0@gmail.com' },
          details: 'Created new auction listing "Vintage Gold Pocket Watch"',
          createdAt: new Date(Date.now() - 180 * 60000),
        }
      ]
      return res.json({ success: true, activities })
    }

    const logins = await LoginHistory.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(30)
    const bids = await Bid.find().populate('bidder', 'name email').populate('auction', 'title').sort({ createdAt: -1 }).limit(30)
    const auctions = await Auction.find().populate('seller', 'name email').sort({ createdAt: -1 }).limit(30)

    const activities = [...mockWinnerActivities]

    logins.forEach((l) => {
      if (l.user) {
        activities.push({
          _id: l._id,
          type: 'login',
          user: l.user,
          details: `Logged in from ${l.location || 'New Delhi, India'} (IP: ${l.ip || '192.168.1.1'}, Device: ${l.device || 'Desktop Chrome'})`,
          createdAt: l.createdAt,
        })
      }
    })

    bids.forEach((b) => {
      if (b.bidder && b.auction) {
        activities.push({
          _id: b._id,
          type: 'bid',
          user: b.bidder,
          details: `Placed a live bid of ₹${b.amount.toLocaleString()} on lot "${b.auction.title}"`,
          createdAt: b.createdAt,
        })
      }
    })

    auctions.forEach((a) => {
      if (a.seller) {
        activities.push({
          _id: a._id,
          type: 'auction',
          user: a.seller,
          details: `Created auction lot "${a.title}" (Starting bid: ₹${a.startingBid.toLocaleString()})`,
          createdAt: a.createdAt,
        })
      }
    })

    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    res.json({ success: true, activities: activities.slice(0, 50) })
  } catch (err) {
    next(err)
  }
}
