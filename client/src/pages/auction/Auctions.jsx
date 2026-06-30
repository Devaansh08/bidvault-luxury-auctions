import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setFilters, selectAuctionFilters } from '../../store/auctionSlice'
import { useAuctions } from '../../hooks/useAuctions'
import AuctionGrid from '../../components/auction/AuctionGrid'
import { AUCTION_CATEGORIES, SORT_OPTIONS, PAGINATION_LIMIT } from '../../utils/constants'
import { debounce } from '../../utils/helpers'
import { cn } from '../../utils/helpers'

export default function Auctions() {
  const dispatch = useDispatch()
  const filters = useSelector(selectAuctionFilters)
  const [searchParams, setSearchParams] = useSearchParams()
  const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '')
  const [page, setPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Sync URL search param on mount
  useEffect(() => {
    const q = searchParams.get('search')
    if (q) dispatch(setFilters({ search: q }))
    const cat = searchParams.get('category')
    if (cat) dispatch(setFilters({ category: cat }))
  }, []) // eslint-disable-line

  const { data, isLoading } = useAuctions({ ...filters, page })

  const debouncedSearch = useCallback(
    debounce((val) => {
      dispatch(setFilters({ search: val }))
      setPage(1)
    }, 400),
    [dispatch],
  )

  const handleSearchChange = (e) => {
    setLocalSearch(e.target.value)
    debouncedSearch(e.target.value)
  }

  const handleCategory = (cat) => {
    dispatch(setFilters({ category: cat }))
    setPage(1)
  }

  const handleSort = (sort) => {
    dispatch(setFilters({ sort }))
    setPage(1)
  }

  const clearFilters = () => {
    setLocalSearch('')
    dispatch(setFilters({ search: '', category: '', sort: 'endDate:asc' }))
    setPage(1)
  }

  const hasActiveFilters = filters.search || filters.category || filters.sort !== 'endDate:asc'
  const totalPages = Math.ceil((data?.total ?? 0) / PAGINATION_LIMIT)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Browse Auctions</h1>
        <p className="text-muted-foreground mt-1">
          {data?.total ?? 0} auctions available
        </p>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            id="auction-search"
            type="text"
            value={localSearch}
            onChange={handleSearchChange}
            placeholder="Search by title, description…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
          {localSearch && (
            <button
              onClick={() => { setLocalSearch(''); dispatch(setFilters({ search: '' })) }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={filters.sort}
          onChange={(e) => handleSort(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Filter toggle mobile */}
        <button
          onClick={() => setFiltersOpen((o) => !o)}
          className={cn(
            'sm:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors',
            filtersOpen ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card',
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-destructive/30 text-destructive text-sm hover:bg-destructive/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Category pills — desktop always visible, mobile toggle */}
      <div className={cn('mb-8 flex flex-wrap gap-2', !filtersOpen && 'hidden sm:flex')}>
        {AUCTION_CATEGORIES.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => handleCategory(value)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
              filters.category === value
                ? 'bg-primary text-primary-foreground border-primary shadow-glow'
                : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <AuctionGrid auctions={data?.auctions ?? []} loading={isLoading} columns={3} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium disabled:opacity-40 hover:bg-muted transition-colors"
          >
            Previous
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = i + Math.max(1, page - 2)
              if (p > totalPages) return null
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
                    page === p ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-muted',
                  )}
                >
                  {p}
                </button>
              )
            })}
          </div>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium disabled:opacity-40 hover:bg-muted transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
