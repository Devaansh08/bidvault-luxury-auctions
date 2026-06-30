import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  Gavel, Search, Bell, User, LogOut, LayoutDashboard,
  Plus, Menu, X, Sun, Moon, Shield, Heart, Clock, ChevronDown,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { selectIsAuthenticated, selectUser, selectIsAdmin } from '../../store/authSlice'
import { toggleTheme, selectTheme, setMobileMenuOpen, selectMobileMenuOpen } from '../../store/uiSlice'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../utils/helpers'
import { ROUTES } from '../../utils/constants'
import { getInitials } from '../../utils/formatters'

const navLinks = [
  { to: ROUTES.AUCTIONS, label: 'Browse Auctions' },
  { to: '/#how-it-works', label: 'How It Works' },
  { to: ROUTES.CONTACT, label: 'Contact' },
]

const userMenuItems = (isAdmin) => [
  { icon: LayoutDashboard, label: 'Dashboard', to: ROUTES.DASHBOARD },
  { icon: User, label: 'Profile Settings', to: ROUTES.PROFILE },
  { icon: Gavel, label: 'My Auctions', to: ROUTES.MY_AUCTIONS },
  { icon: Heart, label: 'My Bids', to: ROUTES.MY_BIDS },
  { icon: Clock, label: 'Login History', to: ROUTES.LOGIN_HISTORY },
  ...(isAdmin ? [{ icon: Shield, label: 'Admin Panel', to: ROUTES.ADMIN }] : []),
]

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectUser)
  const isAdmin = useSelector(selectIsAdmin)
  const theme = useSelector(selectTheme)
  const mobileOpen = useSelector(selectMobileMenuOpen)
  const { logout } = useAuth()

  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`${ROUTES.AUCTIONS}?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleLogout = async () => {
    setUserMenuOpen(false)
    await logout()
    navigate(ROUTES.HOME)
  }

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm'
            : 'bg-background/60 backdrop-blur-md border-b border-transparent',
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link to={ROUTES.HOME} className="flex items-center gap-2.5 shrink-0 group mr-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
                <Gavel className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-gradient leading-tight">BidVault</span>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest hidden sm:block">Live Auctions</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                    )
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm ml-2">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search auctions…"
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>
            </form>

            <div className="flex items-center gap-2 ml-auto">
              {/* Theme toggle */}
              <button
                onClick={() => dispatch(toggleTheme())}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {isAuthenticated ? (
                <>
                  {/* Create auction CTA */}
                  <Link
                    to={ROUTES.CREATE_AUCTION}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-glow hover:shadow-glow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create</span>
                  </Link>

                  {/* User menu */}
                  <div className="relative">
                    <button
                      id="user-menu-btn"
                      onClick={() => setUserMenuOpen((o) => !o)}
                      className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-white shadow-sm overflow-hidden border border-primary/30">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover" />
                        ) : (
                          getInitials(user?.name)
                        )}
                      </div>
                      <ChevronDown
                        className={cn(
                          'w-3.5 h-3.5 text-muted-foreground transition-transform hidden sm:block',
                          userMenuOpen && 'rotate-180',
                        )}
                      />
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.97 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-12 w-56 rounded-xl border border-border bg-card shadow-card-hover z-50 p-1.5"
                          >
                            {/* User info */}
                            <div className="px-3 py-2 mb-1 border-b border-border">
                              <p className="font-semibold text-sm truncate">{user?.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                            </div>

                            {userMenuItems(isAdmin).map(({ icon: Icon, label, to }) => (
                              <Link
                                key={to}
                                to={to}
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                              >
                                <Icon className="w-4 h-4" />
                                {label}
                              </Link>
                            ))}

                            <div className="border-t border-border mt-1 pt-1">
                              <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                              >
                                <LogOut className="w-4 h-4" />
                                Sign out
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to={ROUTES.LOGIN}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    to={ROUTES.SIGNUP}
                    className="px-3 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-glow"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                onClick={() => dispatch(setMobileMenuOpen(!mobileOpen))}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-border bg-card"
            >
              <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
                {/* Mobile search */}
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search auctions…"
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </form>

                {navLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => dispatch(setMobileMenuOpen(false))}
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    {label}
                  </Link>
                ))}

                {isAuthenticated ? (
                  <>
                    <Link
                      to={ROUTES.CREATE_AUCTION}
                      onClick={() => dispatch(setMobileMenuOpen(false))}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" /> Create Auction
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full py-2.5 rounded-lg text-sm font-medium text-destructive border border-destructive/30 hover:bg-destructive/10 transition-colors"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      to={ROUTES.LOGIN}
                      onClick={() => dispatch(setMobileMenuOpen(false))}
                      className="py-2.5 rounded-lg text-sm font-medium text-center border border-border hover:bg-muted transition-colors"
                    >
                      Sign in
                    </Link>
                    <Link
                      to={ROUTES.SIGNUP}
                      onClick={() => dispatch(setMobileMenuOpen(false))}
                      className="py-2.5 rounded-lg text-sm font-medium text-center bg-primary text-primary-foreground"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
