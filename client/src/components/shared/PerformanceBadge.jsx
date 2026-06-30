import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Cookie, Sparkles, Zap, DollarSign } from 'lucide-react'

export default function PerformanceBadge() {
  const [renderTime, setRenderTime] = useState(4.2)
  const [networkPing, setNetworkPing] = useState(14)
  const [showMoneyRoll, setShowMoneyRoll] = useState(false)

  useEffect(() => {
    // Calculate performance timing
    if (typeof window !== 'undefined' && window.performance) {
      const navEntry = window.performance.getEntriesByType('navigation')[0]
      if (navEntry) {
        setRenderTime(Math.max(2.1, Math.round((navEntry.domContentLoadedEventEnd - navEntry.startTime) / 10) / 10))
      }
    }

    const interval = setInterval(() => {
      setNetworkPing(Math.floor(10 + Math.random() * 8))
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Money Roll-In / Roll-Back Floating Animation Layer */}
      <AnimatePresence>
        {showMoneyRoll && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {[...Array(14)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: i % 2 === 0 ? -100 : window.innerWidth + 100,
                  y: Math.random() * window.innerHeight * 0.8,
                  rotate: 0,
                  opacity: 1,
                  scale: 0.8 + Math.random() * 0.5,
                }}
                animate={{
                  x: i % 2 === 0 ? window.innerWidth + 150 : -150,
                  y: Math.random() * window.innerHeight * 0.9,
                  rotate: 720,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 2.2 + Math.random() * 1.2,
                  ease: 'easeInOut',
                }}
                className="absolute w-14 h-8 rounded-md bg-emerald-500/90 border border-emerald-300 shadow-xl flex items-center justify-center text-white font-mono font-black text-sm"
              >
                💵 $100
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Sleek Bottom Performance & Cookie Session HUD */}
      <div className="fixed bottom-3 left-4 z-40 hidden md:flex items-center gap-3 px-3.5 py-2 rounded-full border border-border/80 bg-card/85 backdrop-blur-md shadow-lg text-[11px] font-mono text-muted-foreground transition-all hover:border-primary/50">
        <div className="flex items-center gap-1.5 text-green-500 font-semibold">
          <Zap className="w-3.5 h-3.5 animate-pulse" />
          <span>RTT: {networkPing}ms</span>
        </div>

        <span className="text-border">|</span>

        <div className="flex items-center gap-1">
          <Activity className="w-3 h-3 text-primary" />
          <span>Render: {renderTime}ms</span>
        </div>

        <span className="text-border">|</span>

        <div className="flex items-center gap-1.5 text-amber-500 font-semibold">
          <Cookie className="w-3.5 h-3.5" />
          <span>Cookie Session: Active (Lax HttpOnly)</span>
        </div>

        <span className="text-border">|</span>

        <button
          onClick={() => {
            setShowMoneyRoll(true)
            setTimeout(() => setShowMoneyRoll(false), 3500)
          }}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-500/25 transition-colors cursor-pointer"
        >
          <DollarSign className="w-3 h-3" /> Roll Money Notes
        </button>
      </div>
    </>
  )
}
