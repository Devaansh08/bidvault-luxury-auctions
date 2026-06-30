import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Crown } from 'lucide-react'
import { formatCurrency, formatDateTime, getInitials } from '../../utils/formatters'
import { cn } from '../../utils/helpers'

function BidRow({ bid, index, isTop }) {
  return (
    <motion.div
      key={bid._id}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors',
        isTop ? 'bg-primary/8 border border-primary/20' : 'hover:bg-muted/60',
      )}
    >
      {/* Rank */}
      <div className={cn(
        'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
        isTop ? 'gradient-primary text-white shadow-glow' : 'bg-muted text-muted-foreground',
      )}>
        {isTop ? <Crown className="w-3.5 h-3.5" /> : index + 1}
      </div>

      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
        {getInitials(bid.bidder?.name ?? 'U')}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{bid.bidder?.name ?? 'Anonymous'}</p>
        <p className="text-[10px] text-muted-foreground">{formatDateTime(bid.createdAt)}</p>
      </div>

      {/* Amount */}
      <div className="text-right shrink-0">
        <p className={cn('text-sm font-bold', isTop ? 'text-gradient' : 'text-foreground')}>
          {formatCurrency(bid.amount)}
        </p>
      </div>
    </motion.div>
  )
}

export default function BidHistory({ bids = [], loading = false }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  if (bids.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
        <TrendingUp className="w-10 h-10 mb-3 opacity-30" />
        <p className="font-medium">No bids yet</p>
        <p className="text-sm">Be the first to place a bid!</p>
      </div>
    )
  }

  return (
    <div className="space-y-1.5 max-h-96 overflow-y-auto no-scrollbar pr-1">
      <AnimatePresence initial={false}>
        {bids.map((bid, i) => (
          <BidRow key={bid._id ?? i} bid={bid} index={i} isTop={i === 0} />
        ))}
      </AnimatePresence>
    </div>
  )
}
