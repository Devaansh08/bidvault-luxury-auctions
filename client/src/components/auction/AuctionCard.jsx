import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Users, TrendingUp, ImageOff } from 'lucide-react'
import { useState } from 'react'
import CountdownTimer from './CountdownTimer'
import { formatCurrency, getInitials } from '../../utils/formatters'
import { AUCTION_STATUS_COLOR, AUCTION_STATUS_LABEL, ROUTES } from '../../utils/constants'
import { cn } from '../../utils/helpers'

export default function AuctionCard({ auction, index = 0 }) {
  const [imgError, setImgError] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  const {
    _id,
    title,
    description,
    image,
    currentBid,
    startingBid,
    totalBids = 0,
    endDate,
    category,
    status = 'active',
    seller,
  } = auction

  const bid = currentBid ?? startingBid ?? 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group"
    >
      <Link to={ROUTES.AUCTION(_id)} className="block">
        <div className="rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-card-hover hover:-translate-y-1">
          {/* Image */}
          <div className="relative aspect-[4/3] bg-muted overflow-hidden">
            <img
              src={
                imgError || !image
                  ? {
                      vehicles: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=65&auto=format',
                      art: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&q=65&auto=format',
                      jewelry: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=65&auto=format',
                      electronics: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=65&auto=format',
                      fashion: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=65&auto=format',
                      antiques: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&q=65&auto=format',
                    }[category] || 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=500&q=65&auto=format'
                  : image.includes('unsplash.com') && !image.includes('&w=') ? `${image}?w=500&q=65&auto=format` : image
              }
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                if (!imgError) setImgError(true)
              }}
              loading="lazy"
              decoding="async"
            />

            {/* Status badge */}
            <div className="absolute top-3 left-3">
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-semibold border',
                  AUCTION_STATUS_COLOR[status],
                )}
              >
                {status === 'active' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse" />}
                {AUCTION_STATUS_LABEL[status]}
              </span>
            </div>

            {/* Category */}
            <div className="absolute top-3 right-10">
              <span className="px-2 py-0.5 rounded-full text-xs bg-background/80 backdrop-blur-sm border border-border/50 text-foreground">
                {category}
              </span>
            </div>

            {/* Wishlist */}
            <button
              onClick={(e) => {
                e.preventDefault()
                setWishlisted((w) => !w)
              }}
              aria-label="Toggle wishlist"
              className={cn(
                'absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center transition-colors hover:bg-background',
                wishlisted ? 'text-destructive' : 'text-muted-foreground',
              )}
            >
              <Heart className={cn('w-4 h-4', wishlisted && 'fill-destructive')} />
            </button>

            {/* Countdown overlay */}
            {status === 'active' && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
                <CountdownTimer endDate={endDate} compact />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <div>
              <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {title}
              </h3>
              {description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{description}</p>
              )}
            </div>

            {/* Bid info */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  {totalBids > 0 ? 'Current Bid' : 'Starting Bid'}
                </p>
                <p className="text-xl font-bold text-gradient">{formatCurrency(bid)}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="w-3.5 h-3.5" />
                <span>{totalBids} {totalBids === 1 ? 'bid' : 'bids'}</span>
              </div>
            </div>

            {/* Seller */}
            {seller && (
              <div className="flex items-center gap-2 pt-1 border-t border-border">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">
                  {getInitials(seller.name)}
                </div>
                <span className="text-xs text-muted-foreground truncate">{seller.name}</span>
                {totalBids > 5 && (
                  <span className="ml-auto flex items-center gap-0.5 text-[10px] text-amber-500 font-medium">
                    <TrendingUp className="w-3 h-3" /> Hot
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
