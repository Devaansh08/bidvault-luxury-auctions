import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { userService } from '../../services/userService'
import { formatDate, getInitials } from '../../utils/formatters'
import { Search, ShieldAlert, KeyRound, Gavel, FilePlus, RefreshCw, Eye, Trophy, Truck, MapPin } from 'lucide-react'
import LoadingSpinner from '../../components/shared/LoadingSpinner'

export default function UserActivities() {
  const [filter, setFilter] = useState('all')

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-activities'],
    queryFn: async () => {
      const { data } = await userService.getUserActivities()
      return data
    },
  })

  const activities = data?.activities || []

  const filteredActivities = activities.filter((act) => {
    if (filter === 'all') return true
    return act.type === filter
  })

  const getIcon = (type) => {
    switch (type) {
      case 'winner':
        return <Trophy className="w-4 h-4 text-amber-500 animate-bounce" />
      case 'login':
        return <KeyRound className="w-4 h-4 text-emerald-500" />
      case 'bid':
        return <Gavel className="w-4 h-4 text-amber-500" />
      case 'auction':
        return <FilePlus className="w-4 h-4 text-purple-500" />
      default:
        return <Eye className="w-4 h-4 text-primary" />
    }
  }

  const getBadgeClass = (type) => {
    switch (type) {
      case 'winner':
        return 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 font-bold'
      case 'login':
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
      case 'bid':
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
      case 'auction':
        return 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
      default:
        return 'bg-primary/10 text-primary border border-primary/20'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            User Activity & Winning Orders Monitor
            <span className="px-2.5 py-0.5 rounded-full text-xs bg-primary text-primary-foreground">
              {activities.length} Real-Time Events
            </span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitor authentication history, live bids, auction winners, shipping dispatch addresses, and item listings.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card text-xs font-semibold hover:bg-muted transition-all shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Logs
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap bg-muted/50 p-1.5 rounded-2xl border border-border gap-1 w-full sm:w-max">
        {[
          { id: 'all', label: '🌐 All Activities' },
          { id: 'winner', label: '🏆 Winning Orders & Shipping' },
          { id: 'login', label: '🔐 Logins & Auth' },
          { id: 'bid', label: '🔨 Bids Placed' },
          { id: 'auction', label: '📦 Auctions Created' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filter === t.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : filteredActivities.length === 0 ? (
        <div className="p-12 border border-dashed border-border rounded-3xl bg-card text-center text-muted-foreground">
          <ShieldAlert className="w-10 h-10 mx-auto mb-3 text-muted-foreground/60" />
          <h3 className="font-bold text-base text-foreground">No records found</h3>
          <p className="text-xs text-muted-foreground mt-1">No activity events found under this specific filter category.</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="divide-y divide-border">
            {filteredActivities.map((act) => (
              <div
                key={act._id}
                className={`p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-colors ${
                  act.type === 'winner' ? 'bg-amber-500/5 hover:bg-amber-500/10' : 'hover:bg-muted/20'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white text-sm font-extrabold shrink-0 shadow-sm ${
                    act.type === 'winner' ? 'bg-amber-500 text-amber-950' : 'gradient-primary'
                  }`}>
                    {act.type === 'winner' ? '🏆' : getInitials(act.user?.name ?? 'U')}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{act.user?.name ?? 'Unknown User'}</span>
                      <span className="text-xs text-muted-foreground hidden sm:inline">•</span>
                      <span className="text-xs text-primary font-semibold">{act.user?.email}</span>
                    </div>
                    
                    <p className="text-sm text-foreground leading-relaxed font-medium">
                      {act.details}
                    </p>

                    {act.type === 'winner' && (
                      <div className="mt-2.5 p-3 rounded-xl bg-background border border-amber-500/30 flex flex-wrap items-center gap-4 text-xs font-semibold text-muted-foreground">
                        <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                          <Truck className="w-4 h-4" /> Priority Courier Dispatch
                        </span>
                        <span className="flex items-center gap-1.5 text-foreground">
                          <MapPin className="w-4 h-4 text-primary" /> Verified Shipping Address Attached
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-start gap-2.5 shrink-0">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${getBadgeClass(act.type)}`}>
                    {getIcon(act.type)}
                    <span className="uppercase tracking-wider">{act.type === 'winner' ? 'Won & Dispatched' : act.type}</span>
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {formatDate(act.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
