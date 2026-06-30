import { useState, useRef } from 'react'
import { Loader2, Gavel, TrendingUp, AlertCircle } from 'lucide-react'
import { formatCurrency } from '../../utils/formatters'
import { validateBid } from '../../utils/validators'
import { MIN_BID_INCREMENT } from '../../utils/constants'
import { cn } from '../../utils/helpers'

const quickAmounts = [500, 1000, 5000, 10000]

export default function BidForm({ currentBid = 0, onSubmit, disabled = false }) {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  const minBid = currentBid + MIN_BID_INCREMENT

  const handleSubmit = async (e) => {
    e.preventDefault()
    const parsed = Number(amount)
    const err = validateBid(parsed, currentBid)
    if (err) { setError(err); return }

    setError(null)
    setLoading(true)
    try {
      await onSubmit(parsed)
      setAmount('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place bid')
    } finally {
      setLoading(false)
    }
  }

  const handleQuick = (val) => {
    const total = currentBid + val
    setAmount(String(total))
    setError(null)
    inputRef.current?.focus()
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
          <Gavel className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">Place Your Bid</h3>
          <p className="text-xs text-muted-foreground">
            Minimum: <span className="text-primary font-semibold">{formatCurrency(minBid)}</span>
          </p>
        </div>
      </div>

      {/* Current bid display */}
      <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Current Bid</span>
        <span className="text-2xl font-bold text-gradient">{formatCurrency(currentBid)}</span>
      </div>

      {/* Quick amounts */}
      <div>
        <p className="text-xs text-muted-foreground mb-2 font-medium">Quick amounts</p>
        <div className="grid grid-cols-4 gap-2">
          {quickAmounts.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => handleQuick(val)}
              disabled={disabled}
              className="py-1.5 px-2 rounded-lg border border-border text-xs font-medium hover:border-primary hover:bg-primary/5 hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +{formatCurrency(val, true)}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Your Bid Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₹</span>
            <input
              ref={inputRef}
              type="number"
              min={minBid}
              step={MIN_BID_INCREMENT}
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setError(null) }}
              placeholder={minBid.toString()}
              disabled={disabled}
              className={cn(
                'w-full pl-8 pr-4 py-2.5 rounded-xl border bg-background text-sm font-medium transition-all focus:outline-none focus:ring-2',
                error
                  ? 'border-destructive focus:ring-destructive/30 text-destructive'
                  : 'border-border focus:ring-primary/30 focus:border-primary',
                disabled && 'opacity-50 cursor-not-allowed',
              )}
            />
          </div>
          {error && (
            <div className="flex items-center gap-1.5 mt-1.5 text-destructive text-xs">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <button
          id="place-bid-btn"
          type="submit"
          disabled={disabled || loading || !amount}
          className={cn(
            'w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2',
            'bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-glow-lg',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
          )}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Placing Bid…
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4" />
              Place Bid {amount ? `(${formatCurrency(Number(amount))})` : ''}
            </>
          )}
        </button>
      </form>

      <p className="text-xs text-muted-foreground text-center">
        By placing a bid you agree to our terms. All bids are final.
      </p>
    </div>
  )
}
