import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Loader2, Check } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { validateSignup, getPasswordStrength } from '../../utils/validators'
import { ROUTES } from '../../utils/constants'
import { cn } from '../../utils/helpers'

export default function Signup() {
  const navigate = useNavigate()
  const { signup } = useAuth()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)

  const strength = getPasswordStrength(form.password)

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setErrors((err) => ({ ...err, [e.target.name]: undefined }))
    setApiError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateSignup(form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      await signup(form)
      navigate(ROUTES.DASHBOARD, { replace: true })
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', icon: User, placeholder: 'John Doe', autoComplete: 'name' },
    { name: 'email', label: 'Email', type: 'email', icon: Mail, placeholder: 'you@example.com', autoComplete: 'email' },
    { name: 'password', label: 'Password', type: showPass ? 'text' : 'password', icon: Lock, placeholder: '••••••••', autoComplete: 'new-password' },
    { name: 'confirmPassword', label: 'Confirm Password', type: showPass ? 'text' : 'password', icon: Lock, placeholder: '••••••••', autoComplete: 'new-password' },
  ]

  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-card-hover">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Create your account</h2>
        <p className="text-muted-foreground text-sm mt-1">Join BidVault and start bidding today</p>
      </div>

      {apiError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" />{apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ name, label, type, icon: Icon, placeholder, autoComplete }) => (
          <div key={name}>
            <label className="block text-sm font-medium mb-1.5" htmlFor={name}>{label}</label>
            <div className="relative">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                id={name}
                name={name}
                type={type}
                autoComplete={autoComplete}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className={cn(
                  'w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-background',
                  errors[name]
                    ? 'border-destructive focus:ring-destructive/30'
                    : 'border-border focus:ring-primary/30 focus:border-primary',
                )}
              />
              {(name === 'password' || name === 'confirmPassword') && (
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
            </div>
            {errors[name] && <p className="text-xs text-destructive mt-1">{errors[name]}</p>}

            {/* Password strength */}
            {name === 'password' && form.password && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        'h-1 flex-1 rounded-full transition-all',
                        i <= strength.score ? strength.color : 'bg-muted',
                      )}
                    />
                  ))}
                </div>
                {strength.label && (
                  <p className="text-xs text-muted-foreground">
                    Strength: <span className="font-medium text-foreground">{strength.label}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        ))}

        <button
          id="signup-submit-btn"
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all shadow-glow hover:shadow-glow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</> : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-primary font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  )
}
