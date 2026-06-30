import { Outlet, Link } from 'react-router-dom'
import { Gavel } from 'lucide-react'
import MotionBackground from '../components/shared/MotionBackground'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-transparent relative flex flex-col">
      <MotionBackground />
      {/* Header */}
      <header className="p-6">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Gavel className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gradient">BidVault</span>
        </Link>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-in">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} BidVault · 
        <Link to="/contact" className="ml-1 hover:text-foreground transition-colors">Contact</Link>
      </footer>
    </div>
  )
}
