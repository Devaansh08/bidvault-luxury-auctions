import { Link } from 'react-router-dom'
import { ROUTES } from '../utils/constants'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="relative mb-8">
        <p className="text-[10rem] font-bold text-muted/30 leading-none select-none">404</p>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-7xl">🔨</span>
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-3">Page Not Found</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        This page may have been removed, renamed, or never existed. Let's get you back on track.
      </p>
      <div className="flex gap-4">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all shadow-glow"
        >
          <ArrowLeft className="w-4 h-4" /> Go Home
        </Link>
        <Link
          to={ROUTES.AUCTIONS}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card font-medium text-sm hover:bg-muted transition-all"
        >
          Browse Auctions
        </Link>
      </div>
    </div>
  )
}
