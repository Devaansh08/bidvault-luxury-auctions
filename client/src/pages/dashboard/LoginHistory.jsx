import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '../../services/userService'
import { formatDateTime } from '../../utils/formatters'
import { MapPin, Monitor, Clock, Shield, Trash2, LogOut, AlertTriangle, CheckCircle2 } from 'lucide-react'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import { toast } from 'sonner'

export default function LoginHistory() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['login-history'],
    queryFn: async () => {
      const { data } = await userService.getLoginHistory()
      return data.history
    },
  })

  const removeMutation = useMutation({
    mutationFn: (id) => userService.removeLoginHistoryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['login-history'] })
      toast.success('Session revoked and removed from history')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to remove session')
    },
  })

  const clearAllMutation = useMutation({
    mutationFn: () => userService.clearAllOtherSessions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['login-history'] })
      toast.success('All other sessions revoked successfully!')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to clear sessions')
    },
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-sm">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Login History & Active Sessions</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Manage devices that have accessed your account</p>
          </div>
        </div>

        {(data ?? []).length > 1 && (
          <button
            onClick={() => clearAllMutation.mutate()}
            disabled={clearAllMutation.isPending}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-destructive/40 text-destructive hover:bg-destructive/10 font-semibold text-sm transition-all disabled:opacity-50 shrink-0"
          >
            <LogOut className="w-4 h-4" /> Revoke All Other Sessions
          </button>
        )}
      </div>

      {/* Security Banner */}
      <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3 text-sm text-amber-600 dark:text-amber-400">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold">Notice an unfamiliar location or device?</strong>
          <p className="text-xs mt-0.5 opacity-90 leading-relaxed">
            If someone else accessed your account from another device or location, immediately click <strong>Revoke & Remove</strong> next to that session below and change your account password to lock out any unauthorized access.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : (data ?? []).length === 0 ? (
        <div className="text-center py-20 text-muted-foreground rounded-2xl border border-dashed border-border">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-semibold">No login history</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden shadow-sm">
          {data.map((entry, i) => {
            const isCurrent = i === 0
            return (
              <div key={entry._id ?? i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-muted/20 transition-colors">
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isCurrent ? 'gradient-primary text-white shadow-glow' : 'bg-muted text-muted-foreground'
                  }`}>
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{entry.device ?? 'Unknown device'}</p>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-green-500/15 text-green-500 text-[10px] font-bold flex items-center gap-1 border border-green-500/30">
                          <CheckCircle2 className="w-3 h-3" /> Current Session
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                      {entry.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-primary" /> {entry.location}
                        </span>
                      )}
                      {entry.ip && (
                        <span className="font-mono bg-muted px-2 py-0.5 rounded">IP: {entry.ip}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {formatDateTime(entry.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {!isCurrent && (
                  <div className="sm:text-right shrink-0">
                    <button
                      onClick={() => removeMutation.mutate(entry._id)}
                      disabled={removeMutation.isPending}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 text-xs font-semibold transition-all disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Revoke & Remove
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
