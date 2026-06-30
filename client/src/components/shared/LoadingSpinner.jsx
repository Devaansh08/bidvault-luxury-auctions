import { cn } from '../../utils/helpers'
import { Loader2 } from 'lucide-react'

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
  xl: 'w-14 h-14',
}

export default function LoadingSpinner({ size = 'md', className }) {
  return (
    <Loader2
      className={cn('animate-spin text-primary', sizes[size], className)}
      aria-label="Loading..."
    />
  )
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-glow-lg animate-pulse">
          <LoadingSpinner size="lg" className="text-white" />
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">Loading…</p>
      </div>
    </div>
  )
}

export function InlineLoader({ text = 'Loading…' }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground text-sm">
      <LoadingSpinner size="sm" />
      <span>{text}</span>
    </div>
  )
}
