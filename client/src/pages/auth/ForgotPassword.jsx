import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import { authService } from '../../services/authService'
import { isValidEmail } from '../../utils/validators'
import { ROUTES } from '../../utils/constants'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValidEmail(email)) { setError('Enter a valid email address'); return }
    setLoading(true)
    try {
      await authService.forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-xl font-bold mb-2">Check your email</h2>
        <p className="text-muted-foreground text-sm mb-6">
          We've sent a password reset link to <strong>{email}</strong>
        </p>
        <Link to={ROUTES.LOGIN} className="text-primary font-medium hover:underline text-sm">
          ← Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-card-hover">
      <Link to={ROUTES.LOGIN} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to sign in
      </Link>
      <h2 className="text-2xl font-bold mb-1">Forgot password?</h2>
      <p className="text-muted-foreground text-sm mb-6">Enter your email and we'll send a reset link.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" htmlFor="fp-email">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              id="fp-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null) }}
              placeholder="you@example.com"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 bg-background transition-all ${
                error ? 'border-destructive focus:ring-destructive/30' : 'border-border focus:ring-primary/30 focus:border-primary'
              }`}
            />
          </div>
          {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all shadow-glow disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : 'Send Reset Link'}
        </button>
      </form>
    </div>
  )
}
