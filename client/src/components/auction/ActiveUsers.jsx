import { Users, Wifi, WifiOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getInitials } from '../../utils/formatters'
import { cn } from '../../utils/helpers'

export default function ActiveUsers({ activeUsers = [], isConnected = false }) {
  const visible = activeUsers.slice(0, 5)
  const extra = activeUsers.length - visible.length

  return (
    <div className="flex items-center gap-3">
      {/* Connection status */}
      <div className={cn('flex items-center gap-1.5 text-xs', isConnected ? 'text-green-500' : 'text-muted-foreground')}>
        {isConnected ? (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <Wifi className="w-3 h-3" />
            <span>Live</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3" />
            <span>Reconnecting…</span>
          </>
        )}
      </div>

      {/* Active user avatars */}
      {activeUsers.length > 0 && (
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-2">
            <AnimatePresence>
              {visible.map((u, i) => (
                <motion.div
                  key={u._id ?? i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  title={u.name}
                  className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-semibold border-2 border-background ring-0"
                >
                  {getInitials(u.name)}
                </motion.div>
              ))}
            </AnimatePresence>
            {extra > 0 && (
              <div className="w-7 h-7 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-[10px] font-semibold border-2 border-background">
                +{extra}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="w-3 h-3" />
            <span>{activeUsers.length} watching</span>
          </div>
        </div>
      )}
    </div>
  )
}
