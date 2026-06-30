import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { auctionService } from '../../services/auctionService'
import { Crown, Trophy, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatCurrency, formatDateTime, getInitials } from '../../utils/formatters'
import { ROUTES } from '../../utils/constants'
import LoadingSpinner from '../../components/shared/LoadingSpinner'

export default function AuctionWinner() {
  const { id } = useParams()
  const { data, isLoading } = useQuery({
    queryKey: ['auction-winner', id],
    queryFn: async () => {
      const { data } = await auctionService.getWinner(id)
      return data
    },
    enabled: !!id,
  })

  if (isLoading) return <div className="flex justify-center py-20"><LoadingSpinner size="xl" /></div>

  const winner = data?.winner
  const winningBid = data?.winningBid

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <Link to={ROUTES.AUCTIONS} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-10 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Browse Auctions
      </Link>

      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.6 }}
        className="w-24 h-24 rounded-full gradient-gold flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_hsl(43,96%,56%,0.5)]"
      >
        <Trophy className="w-12 h-12 text-white" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <p className="text-sm font-medium text-amber-500 uppercase tracking-wider mb-2">Auction Ended</p>
        <h1 className="text-4xl font-bold mb-2">We Have a Winner! 🎉</h1>
        <p className="text-muted-foreground">{data?.auction?.title}</p>
      </motion.div>

      {winner ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="mt-10 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-8"
        >
          <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-glow">
            {getInitials(winner.name)}
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Crown className="w-5 h-5 text-amber-500" />
            <h2 className="text-2xl font-bold">{winner.name}</h2>
          </div>
          <p className="text-muted-foreground text-sm mb-6">{winner.email}</p>
          <div className="inline-flex flex-col items-center gap-1">
            <p className="text-sm text-muted-foreground">Winning Bid</p>
            <p className="text-4xl font-bold text-gradient-gold">{formatCurrency(winningBid?.amount ?? 0)}</p>
            <p className="text-xs text-muted-foreground">{formatDateTime(winningBid?.createdAt)}</p>
          </div>
        </motion.div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-muted-foreground">
          <p className="font-medium">No bids were placed on this auction.</p>
        </div>
      )}
    </div>
  )
}
