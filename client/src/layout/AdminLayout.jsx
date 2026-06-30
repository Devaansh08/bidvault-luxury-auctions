import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Gavel, BarChart3 } from 'lucide-react'
import { cn } from '../utils/helpers'
import MotionBackground from '../components/shared/MotionBackground'

const adminLinks = [
  { to: '/admin', end: true, icon: BarChart3, label: 'Overview' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/auctions', icon: Gavel, label: 'Auctions' },
  { to: '/admin/activities', icon: LayoutDashboard, label: 'User Activities' },
]

export default function AdminLayout() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-transparent relative">
      <MotionBackground />
      {/* Sidebar */}
      <aside className="w-60 border-r border-border bg-card shrink-0 p-4 space-y-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
          Admin Panel
        </p>
        {adminLinks.map(({ to, end, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
