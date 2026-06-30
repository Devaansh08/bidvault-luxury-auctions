import mongoose from 'mongoose'
import { Auction } from '../models/Auction.js'
import { Bid } from '../models/Bid.js'
import { User } from '../models/User.js'
import { AppError } from '../middleware/errorHandler.js'

// Dummy Auctions across all categories
export const dummyAuctionsData = [
  {
    _id: '668123456789abcdef100001',
    title: '1968 Rolex Submariner Ref. 5512',
    description: 'An exceptional, museum-grade Vintage Rolex Submariner Reference 5512 with four-line matte dial and pointed crown guards. Complete with original box and service papers.',
    category: 'jewelry',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    startingBid: 12500,
    currentBid: 18400,
    totalBids: 14,
    endDate: new Date(Date.now() + 60 * 1000), // Expires in 1 minute
    seller: { _id: '668123456789abcdef000001', name: 'Vintage Vault' },
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 10),
  },
  {
    _id: '668123456789abcdef100002',
    title: 'Original Banksy Signed Screenprint',
    description: 'Rare limited edition numbered screenprint by elusive street artist Banksy. Comes with Pest Control Certificate of Authenticity.',
    category: 'art',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80',
    startingBid: 25000,
    currentBid: 42000,
    totalBids: 28,
    endDate: new Date(Date.now() + 120 * 1000), // Expires in 2 minutes
    seller: { _id: '668123456789abcdef000001', name: 'Sotheby Fine Art' },
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 15),
  },
  {
    _id: '668123456789abcdef100003',
    title: 'Apple MacBook Pro M3 Max (128GB RAM)',
    description: 'Custom built MacBook Pro 16-inch M3 Max chip with 16-core CPU, 40-core GPU, 128GB unified memory and 4TB SSD storage. Pristine condition with AppleCare+.',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    startingBid: 2800,
    currentBid: 3450,
    totalBids: 9,
    endDate: new Date(Date.now() - 5 * 60 * 1000), // ALREADY ENDED (For winner testing!)
    seller: { _id: '668123456789abcdef000001', name: 'Tech Curator' },
    status: 'ended',
    createdAt: new Date(Date.now() - 3600000 * 5),
  },
  {
    _id: '668123456789abcdef100004',
    title: '1967 Shelby GT500 Fastback Mustang',
    description: 'Fully restored numbers-matching 1967 Shelby Mustang GT500 with 428 Police Interceptor V8 engine. Concours winning restoration.',
    category: 'vehicles',
    image: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800&q=80',
    startingBid: 150000,
    currentBid: 210000,
    totalBids: 22,
    endDate: new Date(Date.now() + 86400000 * 6),
    seller: { _id: '668123456789abcdef000001', name: 'Apex Motors' },
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 20),
  },
  {
    _id: '668123456789abcdef100005',
    title: 'Hermès Birkin 30 Togo Leather Gold Hardware',
    description: 'Authentic brand new in box Hermès Birkin 30cm in classic Etoupe Togo leather with full Gold Hardware. Full box, receipt, clochette and raincoat included.',
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
    startingBid: 18000,
    currentBid: 23500,
    totalBids: 17,
    endDate: new Date(Date.now() + 90 * 1000), // Expires in 1.5 minutes
    seller: { _id: '668123456789abcdef000001', name: 'Luxe Wardrobe' },
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 12),
  },
  {
    _id: '668123456789abcdef100006',
    title: 'Luxury Architectural Penthouse Villa',
    description: 'Overlooking the ocean, this 5,500 sq ft modern architectural masterpiece features floor-to-ceiling glass, infinity pool, and smart home automation.',
    category: 'real-estate',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    startingBid: 1200000,
    currentBid: 1550000,
    totalBids: 7,
    endDate: new Date(Date.now() + 86400000 * 10),
    seller: { _id: '668123456789abcdef000001', name: 'Prime Estates' },
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 24),
  },
  {
    _id: '668123456789abcdef100007',
    title: 'Michael Jordan 1997 Game-Worn Signed Jersey',
    description: 'Authentic Chicago Bulls red away jersey worn by Michael Jordan during the historic 1996-97 NBA championship season. Accompanied by MeiGray photokey.',
    category: 'sports',
    image: 'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=800&q=80',
    startingBid: 45000,
    currentBid: 68000,
    totalBids: 31,
    endDate: new Date(Date.now() - 10 * 60 * 1000), // ALREADY ENDED (For winner testing!)
    seller: { _id: '668123456789abcdef000001', name: 'Legends Memorabilia' },
    status: 'ended',
    createdAt: new Date(Date.now() - 3600000 * 8),
  },
  {
    _id: '668123456789abcdef100008',
    title: '1623 First Folio William Shakespeare Fragment',
    description: 'An original verified leaf from Mr. William Shakespeares Comedies, Histories, & Tragedies printed by Isaac Jaggard and Ed. Blount in 1623.',
    category: 'books',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
    startingBid: 8500,
    currentBid: 14200,
    totalBids: 19,
    endDate: new Date(Date.now() + 86400000 * 4.5),
    seller: { _id: '668123456789abcdef000001', name: 'Antiquarian Rare Books' },
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 18),
  },
  {
    _id: '668123456789abcdef100009',
    title: '1959 Gibson Les Paul Standard "Burst"',
    description: 'The holy grail of vintage electric guitars. Incredible flame maple top with original PAF humbuckers and cherry sunburst finish.',
    category: 'music',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
    startingBid: 85000,
    currentBid: 110000,
    totalBids: 19,
    endDate: new Date(Date.now() + 86400000 * 2.5),
    seller: { _id: '668123456789abcdef000001', name: 'Vintage Vault' },
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 14),
  },
  {
    _id: '668123456789abcdef100010',
    title: '18th Century Louis XV Giltwood Console Table',
    description: 'Exquisite French Rococo giltwood wall console featuring serpentine marble top and intricate floral and foliate carving.',
    category: 'antiques',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80',
    startingBid: 9500,
    currentBid: 13000,
    totalBids: 11,
    endDate: new Date(Date.now() + 86400000 * 7),
    seller: { _id: '668123456789abcdef000001', name: 'Heritage Antiques' },
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 22),
  },
  {
    _id: '668123456789abcdef100011',
    title: 'Premium Apple Vision Pro (Developer Edition)',
    description: 'Exclusive Apple Vision Pro Developer Kit. Features dual micro-OLED displays, spatial audio, and futuristic hand-tracking interface.',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&q=80',
    startingBid: 4200,
    currentBid: 5100,
    totalBids: 15,
    endDate: new Date(Date.now() + 110 * 1000), // Expires in 1.8 minutes
    seller: { _id: '668123456789abcdef000001', name: 'Tech Labs' },
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 4),
  },
  {
    _id: '668123456789abcdef100012',
    title: '14K White Gold Sapphire Drop Earrings',
    description: 'Beautiful pair of drop earrings featuring royal blue sapphires surrounded by round brilliant cut diamonds in 14K white gold.',
    category: 'jewelry',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
    startingBid: 3200,
    currentBid: 4100,
    totalBids: 8,
    endDate: new Date(Date.now() + 86400000 * 4),
    seller: { _id: '668123456789abcdef000001', name: 'Luxe Jewelers' },
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 2),
  },
  {
    _id: '668123456789abcdef100013',
    title: '1970s Rare Vintage Electric Bass Guitar',
    description: 'Classic 1970s vintage electric bass guitar with stunning maple fretboard and deep wood grain finish. Perfect operational condition.',
    category: 'music',
    image: 'https://images.unsplash.com/photo-1485686531765-ba63b07845a7?w=800&q=80',
    startingBid: 1900,
    currentBid: 2450,
    totalBids: 11,
    endDate: new Date(Date.now() + 86400000 * 3),
    seller: { _id: '668123456789abcdef000001', name: 'Melody Shop' },
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 5),
  },
  {
    _id: '668123456789abcdef100014',
    title: '1930 Vintage First Edition Leather Book',
    description: 'Gorgeous collector-grade leather bound volume. Hand-stitched gold leaf pages and premium ribbed spine binding.',
    category: 'books',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&q=80',
    startingBid: 800,
    currentBid: 1250,
    totalBids: 7,
    endDate: new Date(Date.now() + 86400000 * 6),
    seller: { _id: '668123456789abcdef000001', name: 'Antiquarian Rare Books' },
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 20),
  },
  {
    _id: '668123456789abcdef100015',
    title: '19th Century Antique French Brass Clock',
    description: 'Immaculate brass ornate table clock from France. Fully operational mechanism with pendulum and key included.',
    category: 'antiques',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&q=80',
    startingBid: 1400,
    currentBid: 2200,
    totalBids: 13,
    endDate: new Date(Date.now() + 86400000 * 5),
    seller: { _id: '668123456789abcdef000001', name: 'Heritage Antiques' },
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 18),
  },
  {
    _id: '668123456789abcdef100016',
    title: 'Salvador Dalí Signed Lithograph (1974)',
    description: 'Limited edition hand-signed color lithograph by Surrealist master Salvador Dalí. Frame and Pest Control CoA included.',
    category: 'art',
    image: 'https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?w=800&q=80',
    startingBid: 3200,
    currentBid: 4100,
    totalBids: 10,
    endDate: new Date(Date.now() + 86400000 * 4),
    seller: { _id: '668123456789abcdef000001', name: 'Sotheby Fine Art' },
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 3),
  },
  {
    _id: '668123456789abcdef100017',
    title: '1973 Porsche 911 Carrera RS 2.7',
    description: 'Iconic Grand Prix White Porsche 911 Carrera RS with green lettering. Matching numbers, fully documented restoration.',
    category: 'vehicles',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    startingBid: 420000,
    currentBid: 510000,
    totalBids: 19,
    endDate: new Date(Date.now() + 86400000 * 8),
    seller: { _id: '668123456789abcdef000001', name: 'Apex Motors' },
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 14),
  },
  {
    _id: '668123456789abcdef100018',
    title: 'Vintage Chanel Classic Double Flap Bag',
    description: 'Authentic 1990s Chanel medium classic double flap shoulder bag in black quilted lambskin leather with 24K gold plated hardware.',
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    startingBid: 4500,
    currentBid: 5800,
    totalBids: 12,
    endDate: new Date(Date.now() + 86400000 * 3),
    seller: { _id: '668123456789abcdef000001', name: 'Luxe Wardrobe' },
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 5),
  },
  {
    _id: '668123456789abcdef100019',
    title: 'Modern Alpine Minimalist Ski Chalet',
    description: 'Stunning ski-in/ski-out timber chalet in Zermatt. Floor-to-ceiling glass offering direct Matterhorn views.',
    category: 'real-estate',
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80',
    startingBid: 2800000,
    currentBid: 3200000,
    totalBids: 6,
    endDate: new Date(Date.now() + 86400000 * 12),
    seller: { _id: '668123456789abcdef000001', name: 'Prime Estates' },
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 10),
  },
  {
    _id: '668123456789abcdef100020',
    title: 'Muhammad Ali Signed Boxing Gloves',
    description: 'Everlast red boxing gloves hand-signed by the Greatest of All Time, Muhammad Ali. Authenticated by PSA/DNA.',
    category: 'sports',
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80',
    startingBid: 3500,
    currentBid: 4900,
    totalBids: 14,
    endDate: new Date(Date.now() + 86400000 * 5),
    seller: { _id: '668123456789abcdef000001', name: 'Legends Memorabilia' },
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 4),
  }
]

export let mockAuctions = [...dummyAuctionsData]

export let mockBids = [
  {
    _id: 'bid101',
    auction: '668123456789abcdef100001',
    bidder: { _id: '668123456789abcdef000002', name: 'Devansh Sharma', avatar: '' },
    amount: 18400,
    createdAt: new Date(Date.now() - 1800000),
  },
  {
    _id: 'bid102',
    auction: '668123456789abcdef100001',
    bidder: { _id: 'user999', name: 'Alex Collector', avatar: '' },
    amount: 17500,
    createdAt: new Date(Date.now() - 3600000),
  }
]

export const getAuctions = async (req, res, next) => {
  try {
    const { category, sort, search, status = 'active', page = 1, limit = 12 } = req.query

    if (mongoose.connection.readyState !== 1) {
      // Auto expire finished items
      const now = new Date()
      mockAuctions.forEach((a) => {
        if (a.status === 'active' && new Date(a.endDate) < now) {
          a.status = 'ended'
        }
      })

      let filtered = [...mockAuctions]
      if (status && status !== 'all') filtered = filtered.filter((a) => a.status === status)
      if (category && category !== 'all') filtered = filtered.filter((a) => a.category === category)
      if (search) filtered = filtered.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()))
      
      // Sort
      if (sort === 'endDate:asc' || sort === 'ending_soon') filtered.sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
      else if (sort === 'createdAt:desc' || sort === 'newest') filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      else if (sort === 'currentBid:desc') filtered.sort((a, b) => b.currentBid - a.currentBid)
      else if (sort === 'currentBid:asc') filtered.sort((a, b) => a.currentBid - b.currentBid)
      else if (sort === 'totalBids:desc') filtered.sort((a, b) => b.totalBids - a.totalBids)

      return res.json({
        success: true,
        auctions: filtered,
        total: filtered.length,
        pages: 1,
        page: Number(page),
      })
    }

    // Auto expire finished items in MongoDB
    await Auction.updateMany({ status: 'active', endDate: { $lt: new Date() } }, { $set: { status: 'ended' } })

    const query = {}
    if (status && status !== 'all') query.status = status
    if (category && category !== 'all') query.category = category
    if (search) query.title = { $regex: search, $options: 'i' }

    let sortObj = { createdAt: -1 }
    if (sort === 'endDate:asc' || sort === 'ending_soon') sortObj = { endDate: 1 }
    else if (sort === 'createdAt:desc' || sort === 'newest') sortObj = { createdAt: -1 }
    else if (sort === 'currentBid:desc') sortObj = { currentBid: -1 }
    else if (sort === 'currentBid:asc') sortObj = { currentBid: 1 }
    else if (sort === 'totalBids:desc') sortObj = { totalBids: -1 }

    // If MongoDB database is empty, auto-seed with dummy catalog items
    const totalInDb = await Auction.countDocuments()
    if (totalInDb === 0) {
      const seedItems = dummyAuctionsData.map((d) => ({
        title: d.title,
        description: d.description,
        category: d.category,
        image: d.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        startingBid: d.startingBid,
        currentBid: d.currentBid,
        totalBids: d.totalBids || 0,
        endDate: d.endDate,
        seller: '668123456789abcdef000001',
        status: d.status || 'active',
      }))
      await Auction.insertMany(seedItems).catch(() => {})
    }

    const skip = (Number(page) - 1) * Number(limit)
    const [auctions, total] = await Promise.all([
      Auction.find(query).populate('seller', 'name avatar').sort(sortObj).skip(skip).limit(Number(limit)),
      Auction.countDocuments(query),
    ])

    // Ensure every auction always has a valid image URL
    const fallbackMap = {
      vehicles: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
      art: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80',
      jewelry: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      electronics: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
      fashion: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
      'real-estate': 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80',
    }

    const formattedAuctions = auctions.map((a) => {
      const doc = a.toObject ? a.toObject() : { ...a }
      if (!doc.image || doc.image.trim() === '') {
        doc.image = fallbackMap[doc.category] || 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800&q=80'
      }
      return doc
    })

    res.json({
      success: true,
      auctions: formattedAuctions,
      total,
      pages: Math.ceil(total / Number(limit)),
      page: Number(page),
    })
  } catch (err) {
    next(err)
  }
}

export const getAuctionById = async (req, res, next) => {
  try {
    const { id } = req.params
    if (mongoose.connection.readyState !== 1) {
      const found = mockAuctions.find((a) => a._id === id) || mockAuctions[0]
      const auctionBids = mockBids.filter((b) => b.auction === id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      return res.json({ success: true, auction: found, bids: auctionBids })
    }

    const auction = await Auction.findById(id).populate('seller', 'name avatar bio location')
    if (!auction) throw new AppError('Auction not found', 404)

    const bids = await Bid.find({ auction: id }).populate('bidder', 'name avatar').sort({ createdAt: -1 })

    res.json({ success: true, auction, bids })
  } catch (err) {
    next(err)
  }
}

export const createAuction = async (req, res, next) => {
  try {
    const { title, description, category, image, startingBid, endDate } = req.body
    if (mongoose.connection.readyState !== 1) {
      const newAuction = {
        _id: '668123456789abcdef' + Math.floor(100000 + Math.random() * 900000),
        title,
        description,
        category,
        image,
        startingBid: Number(startingBid),
        currentBid: Number(startingBid),
        totalBids: 0,
        endDate: new Date(endDate),
        seller: { _id: req.userId || '668123456789abcdef000002', name: 'Devansh Sharma' },
        status: 'active',
        createdAt: new Date(),
      }
      mockAuctions.unshift(newAuction)
      return res.status(201).json({ success: true, auction: newAuction })
    }

    const auction = await Auction.create({
      title,
      description,
      category,
      image,
      startingBid: Number(startingBid),
      endDate: new Date(endDate),
      seller: req.userId,
    })

    res.status(201).json({ success: true, auction })
  } catch (err) {
    next(err)
  }
}

export const placeBid = async (req, res, next) => {
  try {
    const { id } = req.params
    const { amount } = req.body

    if (mongoose.connection.readyState !== 1) {
      const found = mockAuctions.find((a) => a._id === id) || mockAuctions[0]
      if (Number(amount) <= found.currentBid) {
        throw new AppError(`Bid must be higher than ₹${found.currentBid}`, 400)
      }
      if (found.seller._id === req.userId) {
        throw new AppError('You cannot bid on your own auction', 400)
      }
      found.currentBid = Number(amount)
      found.totalBids += 1

      const newBid = {
        _id: 'bid_' + Math.floor(100000 + Math.random() * 900000),
        auction: id,
        bidder: { _id: req.userId || '668123456789abcdef000002', name: req.user?.name || 'Devansh Sharma', avatar: '' },
        amount: Number(amount),
        createdAt: new Date(),
      }
      mockBids.unshift(newBid)

      return res.status(201).json({ success: true, bid: newBid, currentBid: found.currentBid })
    }

    const auction = await Auction.findById(id)
    if (!auction || auction.status !== 'active') throw new AppError('Auction is not active', 400)
    if (new Date() > new Date(auction.endDate)) throw new AppError('Auction has already ended', 400)
    if (Number(amount) <= auction.currentBid) throw new AppError(`Bid must be higher than current bid (₹${auction.currentBid})`, 400)
    if (auction.seller.toString() === req.userId) throw new AppError('You cannot bid on your own auction', 400)

    const bid = await Bid.create({ auction: id, bidder: req.userId, amount: Number(amount) })
    auction.currentBid = Number(amount)
    auction.totalBids += 1
    await auction.save()

    const populatedBid = await Bid.findById(bid._id).populate('bidder', 'name avatar')

    res.status(201).json({ success: true, bid: populatedBid, currentBid: auction.currentBid })
  } catch (err) {
    next(err)
  }
}

export const getStats = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        totalAuctions: mockAuctions.length,
        activeAuctions: mockAuctions.length,
        totalUsers: 48,
        totalBids: 93 + mockBids.length,
      })
    }

    const [totalAuctions, activeAuctions, totalBids, totalUsers] = await Promise.all([
      Auction.countDocuments(),
      Auction.countDocuments({ status: 'active' }),
      Bid.countDocuments(),
      User.countDocuments(),
    ])

    res.json({ success: true, totalAuctions, activeAuctions, totalUsers, totalBids })
  } catch (err) {
    next(err)
  }
}

export const getWinner = async (req, res, next) => {
  try {
    const { id } = req.params
    if (mongoose.connection.readyState !== 1) {
      const found = mockAuctions.find((a) => a._id === id) || mockAuctions[0]
      return res.json({
        success: true,
        auction: found,
        winner: { _id: '668123456789abcdef000002', name: 'Devansh Sharma', email: 'devanshdevil0@gmail.com' },
        winningBid: { amount: found.currentBid, createdAt: new Date() }
      })
    }

    const auction = await Auction.findById(id).populate('winner', 'name email avatar')
    const winningBid = await Bid.findOne({ auction: id }).sort({ amount: -1 })
    res.json({ success: true, auction, winner: auction?.winner, winningBid })
  } catch (err) {
    next(err)
  }
}

export const deleteAuction = async (req, res, next) => {
  try {
    const { id } = req.params
    if (mongoose.connection.readyState !== 1) {
      mockAuctions = mockAuctions.filter((a) => a._id !== id)
      return res.json({ success: true })
    }
    await Auction.findByIdAndDelete(id)
    await Bid.deleteMany({ auction: id })
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

// API endpoint to seed dummy items across all categories
export const seedDummyAuctions = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      // In-memory reset/seed
      mockAuctions = [...dummyAuctionsData]
      return res.json({
        success: true,
        message: 'Dummy auctions seeded into fallback memory across all 10 categories!',
        count: mockAuctions.length,
        auctions: mockAuctions,
      })
    }

    // In MongoDB Atlas
    // Find a default seller or create one
    let sellerId = req.userId
    if (!sellerId) {
      const firstUser = await mongoose.model('User').findOne()
      sellerId = firstUser ? firstUser._id : new mongoose.Types.ObjectId()
    }

    const preparedData = dummyAuctionsData.map(item => ({
      ...item,
      _id: new mongoose.Types.ObjectId(),
      seller: sellerId,
    }))

    await Auction.insertMany(preparedData)

    res.json({
      success: true,
      message: 'Successfully inserted dummy auctions into MongoDB database across all categories!',
      count: preparedData.length,
    })
  } catch (err) {
    next(err)
  }
}
