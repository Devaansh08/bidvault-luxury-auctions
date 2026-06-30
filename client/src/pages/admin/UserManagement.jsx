import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '../../services/userService'
import { formatDate, getInitials } from '../../utils/formatters'
import { Search, Shield, Trash2, Trophy, MapPin, CheckCircle2 } from 'lucide-react'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import { toast } from 'sonner'

export default function UserManagement() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page, search],
    queryFn: async () => {
      const { data } = await userService.getAllUsers({ page, search })
      return data
    },
  })

  const updateRole = useMutation({
    mutationFn: ({ id, role }) => userService.updateUserRole(id, role),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('Role updated') },
    onError: () => toast.error('Failed to update role'),
  })

  const deleteUser = useMutation({
    mutationFn: (id) => userService.deleteUser(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('User deleted') },
    onError: () => toast.error('Failed to delete user'),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management & Shipping Directory</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage collector accounts, monitor shipping addresses, won items, and escrow statuses.
          </p>
        </div>
        <span className="px-3.5 py-1.5 rounded-full bg-primary/15 text-primary text-xs font-bold w-max">
          {data?.total ?? 0} Registered Collectors
        </span>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search collectors by name or email…"
          className="w-full max-w-sm pl-10 pr-4 py-2 rounded-xl border border-border bg-card text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : (
        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground font-extrabold">
                <tr>
                  <th className="text-left px-5 py-4">Collector</th>
                  <th className="text-left px-5 py-4 hidden lg:table-cell">Shipping Address & Contact</th>
                  <th className="text-left px-5 py-4">Won Items</th>
                  <th className="text-left px-5 py-4">Escrow Status</th>
                  <th className="text-left px-5 py-4">Role</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(data?.users ?? []).map((u) => (
                  <tr key={u._id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                          {getInitials(u.name)}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{u.name}</p>
                          <p className="text-xs text-primary font-medium">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell max-w-xs">
                      <div className="flex items-start gap-2 text-xs text-muted-foreground font-medium">
                        <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{u.shippingAddress || '42, Connaught Place, New Delhi, India 110001'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs border border-amber-500/20">
                        <Trophy className="w-3.5 h-3.5" /> {u.totalWon ?? 0} Lots Won
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" /> {u.escrowStatus || 'Verified & Insured'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={u.role}
                        onChange={(e) => updateRole.mutate({ id: u._id, role: e.target.value })}
                        className="text-xs font-bold px-3 py-1.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => { if (confirm('Delete this user?')) deleteUser.mutate(u._id) }}
                        className="p-2 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
