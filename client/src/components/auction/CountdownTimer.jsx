import { useState, useEffect } from 'react'
import { getCountdown } from '../../utils/formatters'
import { cn } from '../../utils/helpers'
import { Clock } from 'lucide-react'

function TimeUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="min-w-[2.25rem] h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
        <span className="text-lg font-bold text-primary font-mono tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{label}</span>
    </div>
  )
}

export default function CountdownTimer({ endDate, onExpire, compact = false }) {
  const [countdown, setCountdown] = useState(() => getCountdown(endDate))

  useEffect(() => {
    if (countdown.expired) {
      onExpire?.()
      return
    }

    const interval = setInterval(() => {
      const next = getCountdown(endDate)
      setCountdown(next)
      if (next.expired) {
        clearInterval(interval)
        onExpire?.()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [endDate, onExpire, countdown.expired])

  if (countdown.expired) {
    return (
      <div className={cn('flex items-center gap-1.5 text-muted-foreground', compact ? 'text-xs' : 'text-sm')}>
        <Clock className="w-3.5 h-3.5" />
        <span>Auction ended</span>
      </div>
    )
  }

  if (compact) {
    const { days, hours, minutes, seconds } = countdown
    const label =
      days > 0
        ? `${days}d ${hours}h left`
        : hours > 0
        ? `${hours}h ${minutes}m left`
        : `${minutes}m ${seconds}s left`

    const urgency = countdown.totalSeconds < 3600

    return (
      <div
        className={cn(
          'flex items-center gap-1.5 text-xs font-medium',
          urgency ? 'text-destructive animate-pulse' : 'text-amber-500',
        )}
      >
        <Clock className="w-3 h-3" />
        <span>{label}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {countdown.days > 0 && <TimeUnit value={countdown.days} label="Days" />}
      <TimeUnit value={countdown.hours} label="Hrs" />
      <span className="text-primary font-bold text-lg -mt-4">:</span>
      <TimeUnit value={countdown.minutes} label="Min" />
      <span className="text-primary font-bold text-lg -mt-4">:</span>
      <TimeUnit value={countdown.seconds} label="Sec" />
    </div>
  )
}
