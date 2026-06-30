import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated, selectUser, selectAuthInitialized } from '../store/authSlice'
import { ROUTES } from '../utils/constants'
import { getInitials } from '../utils/formatters'
import { useAuth } from '../hooks/useAuth'
import { ShieldCheck, User, LayoutDashboard, LogOut, ArrowRight } from 'lucide-react'
import LoadingSpinner from '../components/shared/LoadingSpinner'

export default function GuestRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectUser)
  const initialized = useSelector(selectAuthInitialized)
  const { logout } = useAuth()
  const navigate = useNavigate()

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // When someone is already logged in into system, show their active profile summary
  // because auth/login & signup pages are strictly for guest users
  if (isAuthenticated && user) {
    return (
      <div className="w-full max-w-md mx-auto p-6 rounded-3xl border border-border bg-card shadow-card-hover text-center space-y-6 animate-in">
        <div className="w-16 h-16 mx-auto rounded-3xl gradient-primary flex items-center justify-center text-white text-xl font-extrabold shadow-glow">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-3xl" />
          ) : (
            getInitials(user.name)
          )}
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20 mb-2">
            <ShieldCheck className="w-4 h-4" /> Active Authenticated Session
          </span>
          <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
          <p className="text-xs text-primary font-semibold mt-0.5">{user.email}</p>
        </div>

        <div className="p-4 rounded-2xl bg-muted/40 border border-border text-xs text-muted-foreground leading-relaxed">
          You are currently logged into the system. Login and Registration options are only available for guest users.
        </div>

        <div className="space-y-2.5 pt-2">
          <Link
            to={ROUTES.PROFILE}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-glow hover:bg-primary/90 transition-all"
          >
            <User className="w-4 h-4" /> Go to Profile Settings <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to={ROUTES.DASHBOARD}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-border bg-card hover:bg-muted font-semibold text-sm transition-all"
          >
            <LayoutDashboard className="w-4 h-4 text-primary" /> View Collector Dashboard
          </Link>

          <button
            onClick={async () => {
              await logout()
              navigate(ROUTES.LOGIN)
            }}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-destructive hover:bg-destructive/10 text-xs font-bold transition-all mt-2"
          >
            <LogOut className="w-4 h-4" /> Sign out & Switch Account
          </button>
        </div>
      </div>
    )
  }

  return <Outlet />
}
