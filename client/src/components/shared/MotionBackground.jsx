import { motion } from 'framer-motion'

export default function MotionBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-background transition-colors duration-500">
      {/* Dynamic luxury dotted grid mesh overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgb(156,176,128,0.25)_1.5px,transparent_1.5px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_65%,transparent_100%)] opacity-70 dark:opacity-40" />

      {/* Orb 1 - Soft Pistachio Sage (#9CB080 / rgb(156, 176, 128)) */}
      <motion.div
        animate={{
          x: [0, 140, -80, 0],
          y: [0, -90, 110, 0],
          scale: [1, 1.35, 0.9, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-24 -left-24 w-[650px] h-[650px] rounded-full bg-[rgb(156,176,128)]/25 dark:bg-[rgb(156,176,128)]/15 blur-[120px]"
      />

      {/* Orb 2 - Forest Moss Green (#618764 / rgb(97, 135, 100)) */}
      <motion.div
        animate={{
          x: [0, -130, 90, 0],
          y: [0, 120, -100, 0],
          scale: [1, 1.25, 0.85, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 -right-36 w-[700px] h-[700px] rounded-full bg-[rgb(97,135,100)]/20 dark:bg-[rgb(97,135,100)]/15 blur-[130px]"
      />

      {/* Orb 3 - Deep Pine Green (#2B5748 / rgb(43, 87, 72)) */}
      <motion.div
        animate={{
          x: [0, 100, -110, 0],
          y: [0, -100, 80, 0],
          scale: [1, 1.4, 0.95, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[rgb(43,87,72)]/25 dark:bg-[rgb(43,87,72)]/20 blur-[135px]"
      />

      {/* Orb 4 - Charcoal Slate Ambient Sphere (#273338 / rgb(39, 51, 56)) */}
      <motion.div
        animate={{
          x: [0, -80, 80, 0],
          y: [0, 80, -80, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-32 right-1/3 w-[550px] h-[550px] rounded-full bg-[rgb(39,51,56)]/15 dark:bg-[rgb(156,176,128)]/10 blur-[130px]"
      />

      {/* Eye-Catching Framer Motion Bouncing & Floating Luxury Cards / Symbols */}
      {[
        { icon: '🔨', label: 'Horology Lots', top: '16%', left: '7%', delay: 0, bounceDuration: 4.2, driftDuration: 19 },
        { icon: '💎', label: 'Flawless Gems', top: '28%', right: '8%', delay: 1.2, bounceDuration: 3.8, driftDuration: 22 },
        { icon: '⏳', label: 'Live Escrow', top: '65%', left: '10%', delay: 2.5, bounceDuration: 4.5, driftDuration: 24 },
        { icon: '👑', label: 'Black Diamond VIP', top: '75%', right: '12%', delay: 0.8, bounceDuration: 3.6, driftDuration: 20 },
        { icon: '🏛️', label: 'Prestige Vault', top: '48%', left: '85%', delay: 1.8, bounceDuration: 4.0, driftDuration: 23 },
        { icon: '✨', label: 'Verified Curated', top: '88%', left: '48%', delay: 3.0, bounceDuration: 3.5, driftDuration: 18 },
      ].map((item, idx) => (
        <motion.div
          key={idx}
          style={{ top: item.top, left: item.left, right: item.right }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.35, 0.75, 0.35],
            y: [0, -32, 0],
            rotate: [-4, 6, -4],
            scale: [0.95, 1.06, 0.95],
          }}
          transition={{
            duration: item.bounceDuration,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
            delay: item.delay,
          }}
          className="absolute select-none hidden md:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-card/65 dark:bg-card/55 backdrop-blur-md border border-[rgb(156,176,128)]/30 dark:border-[rgb(156,176,128)]/20 shadow-lg"
        >
          <span className="text-xl drop-shadow-sm">{item.icon}</span>
          <span className="text-[11px] font-extrabold tracking-wide uppercase text-foreground/80 dark:text-[rgb(156,176,128)]">
            {item.label}
          </span>
        </motion.div>
      ))}

      {/* Subtle Floating Sage Particles */}
      {[
        { top: '22%', left: '35%', size: '8px', delay: 0 },
        { top: '42%', left: '62%', size: '12px', delay: 1.5 },
        { top: '78%', left: '25%', size: '10px', delay: 0.7 },
        { top: '15%', left: '78%', size: '6px', delay: 2.2 },
        { top: '82%', left: '80%', size: '9px', delay: 1.1 },
      ].map((particle, idx) => (
        <motion.div
          key={`p-${idx}`}
          style={{ top: particle.top, left: particle.left, width: particle.size, height: particle.size }}
          animate={{
            y: [0, -45, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 5 + idx * 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: particle.delay,
          }}
          className="absolute rounded-full bg-[rgb(156,176,128)] blur-[1px] shadow-[0_0_10px_rgb(156,176,128)]"
        />
      ))}
    </div>
  )
}
