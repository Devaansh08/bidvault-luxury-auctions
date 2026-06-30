import express from 'express'
import {
  getAuctions,
  getAuctionById,
  createAuction,
  placeBid,
  getStats,
  getWinner,
  deleteAuction,
  seedDummyAuctions,
} from '../controllers/auctionController.js'
import { getMyAuctions, getMyBids } from '../controllers/userController.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()

router.get('/', getAuctions)
router.get('/stats', getStats)
router.get('/seed-dummy', seedDummyAuctions)
router.post('/seed-dummy', seedDummyAuctions)
router.get('/myauction', protect, getMyAuctions)
router.get('/mybids', protect, getMyBids)
router.get('/:id', getAuctionById)
router.get('/:id/winner', getWinner)
router.post('/', protect, createAuction)
router.post('/:id/bid', protect, placeBid)
router.delete('/:id', protect, adminOnly, deleteAuction)

export default router
