import AuctionCard from './AuctionCard'
import { cn } from '../../utils/helpers'

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-muted" />
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
        </div>
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <div className="h-2 bg-muted rounded w-16" />
            <div className="h-6 bg-muted rounded w-24" />
          </div>
          <div className="h-3 bg-muted rounded w-12" />
        </div>
      </div>
    </div>
  )
}

export default function AuctionGrid({ auctions = [], loading = false, columns = 3 }) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  if (loading) {
    return (
      <div className={cn('grid gap-5', gridCols[columns])}>
        {Array.from({ length: columns * 2 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (!loading && auctions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">🔨</div>
        <h3 className="text-lg font-semibold mb-2">No auctions found</h3>
        <p className="text-muted-foreground text-sm">Try adjusting your filters or check back later.</p>
      </div>
    )
  }

  return (
    <div className={cn('grid gap-5', gridCols[columns])}>
      {auctions.map((auction, i) => (
        <AuctionCard key={auction._id} auction={auction} index={i} />
      ))}
    </div>
  )
}
