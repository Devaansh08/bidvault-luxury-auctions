import { Link } from 'react-router-dom'
import { Plus, ExternalLink, Trash2 } from 'lucide-react'
import { useMyAuctions } from '../../hooks/useAuctions'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { AUCTION_STATUS_COLOR, AUCTION_STATUS_LABEL, ROUTES } from '../../utils/constants'
import { cn } from '../../utils/helpers'
import LoadingSpinner from '../../components/shared/LoadingSpinner'

export default function MyAuctions() {
  const { data: auctions, isLoading } = useMyAuctions()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Auctions</h1>
          <p className="text-muted-foreground text-sm mt-1">{auctions?.length ?? 0} total auctions</p>
        </div>
        <Link
          to={ROUTES.CREATE_AUCTION}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-glow"
        >
          <Plus className="w-4 h-4" /> New Auction
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : (auctions ?? []).length === 0 ? (
        <div className="text-center py-20 text-muted-foreground rounded-2xl border border-dashed border-border">
          <div className="text-5xl mb-4">🔨</div>
          <p className="font-semibold text-lg mb-2">No auctions yet</p>
          <p className="text-sm mb-6">Create your first auction and start selling</p>
          <Link to={ROUTES.CREATE_AUCTION} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium">
            <Plus className="w-4 h-4" /> Create Auction
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Item</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Bid</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Ends</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {auctions.map((a) => (
                <tr key={a._id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden shrink-0">
                        {a.image && <img src={a.image} alt={a.title} className="w-full h-full object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate max-w-[160px]">{a.title}</p>
                        <p className="text-xs text-muted-foreground">{a.totalBids ?? 0} bids</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium border', AUCTION_STATUS_COLOR[a.status])}>
                      {AUCTION_STATUS_LABEL[a.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {formatCurrency(a.currentBid ?? a.startingBid ?? 0)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground text-xs hidden md:table-cell">
                    {formatDate(a.endDate)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={ROUTES.AUCTION(a._id)} className="text-muted-foreground hover:text-foreground">
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
