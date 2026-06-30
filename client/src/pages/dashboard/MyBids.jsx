import { Link } from 'react-router-dom'
import { TrendingUp, Crown, Clock } from 'lucide-react'
import { useMyBids } from '../../hooks/useAuctions'
import { formatCurrency, formatDateTime } from '../../utils/formatters'
import { ROUTES } from '../../utils/constants'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import { cn } from '../../utils/helpers'

export default function MyBids() {
  const { data: bids, isLoading } = useMyBids()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Bids</h1>
        <p className="text-muted-foreground text-sm mt-1">Auctions you have bid on</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : (bids ?? []).length === 0 ? (
        <div className="text-center py-20 text-muted-foreground rounded-2xl border border-dashed border-border">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-semibold text-lg mb-2">No bids placed yet</p>
          <p className="text-sm mb-6">Browse auctions and place your first bid!</p>
          <Link to={ROUTES.AUCTIONS} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium">
            Browse Auctions
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bids.map((bid) => (
            <Link
              key={bid._id}
              to={ROUTES.AUCTION(bid.auction?._id)}
              className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-card-hover transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-muted overflow-hidden shrink-0">
                {bid.auction?.image && (
                  <img src={bid.auction.image} alt={bid.auction.title} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate group-hover:text-primary transition-colors">
                  {bid.auction?.title}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {formatDateTime(bid.createdAt)}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-sm">{formatCurrency(bid.amount)}</p>
                <span
                  className={cn(
                    'text-[10px] font-semibold flex items-center gap-1 justify-end mt-0.5',
                    bid.isTopBid ? 'text-green-500' : 'text-muted-foreground',
                  )}
                >
                  {bid.isTopBid && <Crown className="w-3 h-3" />}
                  {bid.isTopBid ? 'Leading' : 'Outbid'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
