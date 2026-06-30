import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ArrowLeft, Share2, Flag, ImageOff, Package, User, Trophy, ShoppingCart, CreditCard, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useAuction, usePlaceBid } from '../../hooks/useAuctions'
import { useSocket } from '../../hooks/useSocket'
import { selectIsAuthenticated, selectUser } from '../../store/authSlice'
import { selectCurrentAuction } from '../../store/auctionSlice'
import BidForm from '../../components/auction/BidForm'
import BidHistory from '../../components/auction/BidHistory'
import CountdownTimer from '../../components/auction/CountdownTimer'
import ActiveUsers from '../../components/auction/ActiveUsers'
import CheckoutModal from '../../components/auction/CheckoutModal'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import { formatCurrency, formatDateTime, getInitials } from '../../utils/formatters'
import { AUCTION_STATUS_COLOR, AUCTION_STATUS_LABEL, ROUTES } from '../../utils/constants'
import { cn } from '../../utils/helpers'
import { toast } from 'sonner'

export default function ViewAuction() {
  const { id } = useParams()
  const { data: auction, isLoading, isError } = useAuction(id)
  const currentUser = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const [imgError, setImgError] = useState(false)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [isPaid, setIsPaid] = useState(false)

  const { activeUsers, isConnected } = useSocket(id)
  const placeBid = usePlaceBid(id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  if (isError || !auction) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold mb-2">Auction Not Found</h2>
        <p className="text-muted-foreground mb-6">This auction may have been removed or the link is incorrect.</p>
        <Link to={ROUTES.AUCTIONS} className="text-primary hover:underline font-medium">
          Browse all auctions →
        </Link>
      </div>
    )
  }

  const isOwner = currentUser?._id === auction.seller?._id
  const isTimerExpired = new Date() > new Date(auction.endDate)
  const isEnded = auction.status === 'ended' || auction.status === 'cancelled' || isTimerExpired
  const canBid = isAuthenticated && !isOwner && !isEnded

  const topBid = auction.bids?.[0]
  const isWinner = isEnded && currentUser && (topBid?.bidder?._id === currentUser._id || topBid?.bidder?.name === currentUser.name)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        auction={auction}
        winningAmount={auction.currentBid ?? auction.startingBid ?? 0}
        onPaymentSuccess={() => {
          setIsPaid(true)
          setShowCheckoutModal(false)
        }}
      />

      {/* Back */}
      <Link
        to={ROUTES.AUCTIONS}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Auctions
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left — Image + details */}
        <div className="lg:col-span-3 space-y-6">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-muted"
          >
            {imgError || !auction.image ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-3">
                <ImageOff className="w-16 h-16 opacity-30" />
                <span className="text-sm">No image provided</span>
              </div>
            ) : (
              <img
                src={auction.image}
                alt={auction.title}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            )}
          </motion.div>

          {/* Details card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-border bg-card p-6 space-y-5"
          >
            {/* Status + category */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold border', isEnded ? AUCTION_STATUS_COLOR.ended : AUCTION_STATUS_COLOR[auction.status])}>
                {!isEnded && auction.status === 'active' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse" />}
                {isEnded ? 'Ended' : AUCTION_STATUS_LABEL[auction.status]}
              </span>
              <span className="px-2.5 py-1 rounded-full border border-border text-xs text-muted-foreground">
                {auction.category}
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-bold">{auction.title}</h1>
              <p className="text-muted-foreground mt-3 leading-relaxed text-sm">{auction.description}</p>
            </div>

            {/* Seller info */}
            <div className="flex items-center gap-3 pt-2 border-t border-border">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
                {getInitials(auction.seller?.name)}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Listed by</p>
                <p className="text-sm font-medium">{auction.seller?.name ?? 'Unknown'}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-muted-foreground">Listed on</p>
                <p className="text-xs font-medium">{formatDateTime(auction.createdAt)}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  toast.success('Auction link copied to clipboard!')
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
              {!isOwner && (
                <button
                  type="button"
                  onClick={() => toast.info('Item reported for moderation review')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-destructive/30 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Flag className="w-4 h-4" /> Report
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right — Bid + history */}
        <div className="lg:col-span-2 space-y-4">
          {/* Winner Celebration Banner */}
          {isWinner && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent p-5 space-y-4 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl gradient-gold flex items-center justify-center text-white shadow-glow shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">🎉 Congratulations!</span>
                  <h3 className="font-bold text-lg leading-tight">You Won This Auction!</h3>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Your leading bid of <strong className="text-foreground font-semibold">{formatCurrency(auction.currentBid)}</strong> secured this item.
              </p>
              <div className="pt-1">
                {isPaid ? (
                  <div className="w-full py-3 rounded-xl bg-green-500/20 text-green-500 font-bold text-sm flex items-center justify-center gap-2 border border-green-500/30">
                    <CheckCircle2 className="w-4 h-4" /> Paid & Order Confirmed
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCheckoutModal(true)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl gradient-gold text-white font-bold text-sm shadow-glow hover:opacity-95 transition-opacity"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Cart & Pay Now
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Countdown */}
          {!isEnded && auction.status === 'active' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">Ends In</p>
              <CountdownTimer endDate={auction.endDate} />
            </motion.div>
          )}

          {/* Bid stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border bg-card p-5 space-y-3"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                  {auction.totalBids > 0 ? 'Current Bid' : 'Starting Bid'}
                </p>
                <p className="text-3xl font-bold text-gradient mt-0.5">
                  {formatCurrency(auction.currentBid ?? auction.startingBid ?? 0)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Total Bids</p>
                <p className="text-3xl font-bold mt-0.5">{auction.totalBids ?? 0}</p>
              </div>
            </div>

            {/* Active users */}
            <div className="pt-2 border-t border-border">
              <ActiveUsers activeUsers={activeUsers} isConnected={isConnected} />
            </div>
          </motion.div>

          {/* Bid form */}
          {canBid && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <BidForm
                currentBid={auction.currentBid ?? auction.startingBid ?? 0}
                onSubmit={(amount) => placeBid.mutateAsync(amount)}
                disabled={placeBid.isPending}
              />
            </motion.div>
          )}

          {!isAuthenticated && (
            <div className="rounded-2xl border border-border bg-card p-5 text-center">
              <p className="text-sm text-muted-foreground mb-3">Sign in to place a bid</p>
              <Link
                to={ROUTES.LOGIN}
                className="inline-block px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}

          {isOwner && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-600 dark:text-amber-400">
              This is your auction. You cannot bid on your own listings.
            </div>
          )}

          {isEnded && !isWinner && (
            <div className="rounded-2xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground text-center">
              This auction has ended.{' '}
              <Link to={ROUTES.AUCTION(id) + '/winner'} className="text-primary hover:underline">
                View winner →
              </Link>
            </div>
          )}

          {/* Bid history */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <h3 className="font-semibold text-sm mb-4">Bid History</h3>
            <BidHistory bids={auction.bids ?? []} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
