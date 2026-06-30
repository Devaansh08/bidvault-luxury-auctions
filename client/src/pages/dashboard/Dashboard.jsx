import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Gavel, TrendingUp, DollarSign, Plus, ArrowRight, Clock, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { selectUser } from '../../store/authSlice'
import { useMyAuctions, useMyBids } from '../../hooks/useAuctions'
import { formatCurrency, getCountdown } from '../../utils/formatters'
import { ROUTES, AUCTION_STATUS_COLOR, AUCTION_STATUS_LABEL } from '../../utils/constants'
import { cn } from '../../utils/helpers'
import LoadingSpinner from '../../components/shared/LoadingSpinner'

function StatCard({ icon: Icon, label, value, color = 'text-primary', loading }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
      <div className={cn('w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0', color === 'text-amber-500' ? 'bg-amber-500/10' : 'bg-primary/10')}>
        <Icon className={cn('w-6 h-6', color)} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        {loading ? (
          <div className="h-6 w-16 bg-muted rounded animate-pulse mt-1" />
        ) : (
          <p className="text-2xl font-bold mt-0.5">{value}</p>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const user = useSelector(selectUser)
  const { data: myAuctions, isLoading: aLoading } = useMyAuctions()
  const { data: myBids, isLoading: bLoading } = useMyBids()

  const activeAuctions = myAuctions?.filter((a) => a.status === 'active') ?? []
  const winningBids = myBids?.filter((b) => b.isTopBid) ?? []

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
          <span className="text-gradient">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Here's what's happening with your auctions today.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Gavel} label="My Auctions" value={myAuctions?.length ?? 0} loading={aLoading} />
        <StatCard icon={TrendingUp} label="Active Bids" value={winningBids.length} loading={bLoading} />
        <StatCard icon={DollarSign} label="Live Now" value={activeAuctions.length} color="text-amber-500" loading={aLoading} />
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          to={ROUTES.CREATE_AUCTION}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-glow"
        >
          <Plus className="w-4 h-4" /> Create Auction
        </Link>
        <Link
          to={ROUTES.AUCTIONS}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-medium hover:bg-muted transition-colors"
        >
          <TrendingUp className="w-4 h-4" /> Browse Auctions
        </Link>
        <Link
          to={ROUTES.PROFILE}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary/30 bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors shadow-sm"
        >
          <User className="w-4 h-4" /> Profile Settings
        </Link>
      </div>

      {/* My recent auctions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">My Recent Auctions</h2>
          <Link to={ROUTES.MY_AUCTIONS} className="text-xs text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {aLoading ? (
          <div className="flex justify-center py-10"><LoadingSpinner /></div>
        ) : (myAuctions ?? []).length === 0 ? (
          <div className="text-center py-10 text-muted-foreground rounded-2xl border border-dashed border-border">
            <Gavel className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No auctions yet</p>
            <p className="text-sm">Create your first auction to get started</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
            {(myAuctions ?? []).slice(0, 5).map((a) => {
              const cd = getCountdown(a.endDate)
              return (
                <Link
                  key={a._id}
                  to={ROUTES.AUCTION(a._id)}
                  className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-muted overflow-hidden shrink-0">
                    {a.image && <img src={a.image} alt={a.title} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.totalBids ?? 0} bids</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-sm">{formatCurrency(a.currentBid ?? a.startingBid ?? 0)}</p>
                    <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full border font-medium', AUCTION_STATUS_COLOR[a.status])}>
                      {AUCTION_STATUS_LABEL[a.status]}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* My active bids */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">My Active Bids</h2>
          <Link to={ROUTES.MY_BIDS} className="text-xs text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {bLoading ? (
          <div className="flex justify-center py-10"><LoadingSpinner /></div>
        ) : winningBids.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground rounded-2xl border border-dashed border-border">
            <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No active bids</p>
            <p className="text-sm">Start bidding on auctions to see them here</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
            {winningBids.slice(0, 5).map((bid) => (
              <Link
                key={bid._id}
                to={ROUTES.AUCTION(bid.auction?._id)}
                className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{bid.auction?.title}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{bid.auction?.status === 'active' ? 'Live' : 'Ended'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm text-gradient">{formatCurrency(bid.amount)}</p>
                  <p className="text-[10px] text-green-500 font-medium">Leading ↑</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
