import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2, Sparkles, Shield } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { validateLogin } from '../../utils/validators'
import { ROUTES } from '../../utils/constants'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const from = location.state?.from?.pathname || ROUTES.DASHBOARD

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setErrors((err) => ({ ...err, [e.target.name]: undefined }))
    setApiError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateLogin(form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      await login(form)
      navigate(from, { replace: true })
    } catch (err) {
      setApiError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-card-hover">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Welcome back</h2>
        <p className="text-muted-foreground text-sm mt-1">Sign in to your BidVault account</p>
      </div>

      {apiError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {/* Demo Credentials Quick Fill */}
      <div className="mb-6 p-3.5 rounded-2xl bg-primary/5 border border-primary/20 space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
          <Sparkles className="w-4 h-4" /> 1-Click Demo Login Credentials
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setForm({ email: 'admin@bidvault.com', password: 'Admin@123' })
              setErrors({})
            }}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-card border border-border hover:border-primary/50 text-xs font-semibold text-foreground transition-all shadow-sm"
          >
            <Shield className="w-3.5 h-3.5 text-amber-500" /> Admin Access
          </button>
          <button
            type="button"
            onClick={() => {
              setForm({ email: 'devanshdevil0@gmail.com', password: 'user123' })
              setErrors({})
            }}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-card border border-border hover:border-primary/50 text-xs font-semibold text-foreground transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" /> VIP Collector
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1.5" htmlFor="email">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-destructive focus:ring-destructive/30'
                  : 'border-border focus:ring-primary/30 focus:border-primary'
              } bg-background`}
            />
          </div>
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <Link to={ROUTES.FORGOT_PASSWORD} className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              id="password"
              name="password"
              type={showPass ? 'text' : 'password'}
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                errors.password
                  ? 'border-destructive focus:ring-destructive/30'
                  : 'border-border focus:ring-primary/30 focus:border-primary'
              } bg-background`}
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
        </div>

        <button
          id="login-submit-btn"
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all shadow-glow hover:shadow-glow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Don't have an account?{' '}
        <Link to={ROUTES.SIGNUP} className="text-primary font-medium hover:underline">
          Create one free
        </Link>
      </p>
    </div>
  )
}
