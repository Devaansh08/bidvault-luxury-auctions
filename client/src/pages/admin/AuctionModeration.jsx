import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { auctionService } from '../../services/auctionService'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { AUCTION_STATUS_COLOR, AUCTION_STATUS_LABEL } from '../../utils/constants'
import { Trash2, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { cn } from '../../utils/helpers'
import LoadingSpinner from '../../components/shared/LoadingSpinner'

export default function AuctionModeration() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-auctions'],
    queryFn: async () => {
      const { data } = await auctionService.getAuctions({ page: 1 })
      return data
    },
  })

  const deleteAuction = useMutation({
    mutationFn: (id) => auctionService.deleteAuction(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-auctions'] }); toast.success('Auction deleted') },
    onError: () => toast.error('Failed to delete auction'),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Auction Moderation</h1>
        <span className="text-sm text-muted-foreground">{data?.total ?? 0} auctions</span>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Auction</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Bid</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Ends</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(data?.auctions ?? []).map((a) => (
                <tr key={a._id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium truncate max-w-[180px]">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.totalBids ?? 0} bids</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium border', AUCTION_STATUS_COLOR[a.status])}>
                      {AUCTION_STATUS_LABEL[a.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{formatCurrency(a.currentBid ?? a.startingBid ?? 0)}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground text-xs hidden md:table-cell">{formatDate(a.endDate)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/auction/${a._id}`} className="text-muted-foreground hover:text-foreground"><ExternalLink className="w-4 h-4" /></Link>
                      <button
                        onClick={() => { if (confirm('Delete this auction?')) deleteAuction.mutate(a._id) }}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      ><Trash2 className="w-4 h-4" /></button>
                    </div>
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
