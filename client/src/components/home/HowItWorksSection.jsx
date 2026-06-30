import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Search, Lock, Cpu, ShieldCheck, CheckCircle2, ArrowRight, Heart, Sparkles, PlusCircle } from 'lucide-react'
import { ROUTES } from '../../utils/constants'

export default function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Find Your Must-Have',
      icon: Search,
      badge: 'Curated & Verified',
      color: 'from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
      description:
        'Browse through curated, verified listings. Whether you’re looking for a rare collectible, a piece of gear, or your next big investment, finding what you love is the easy part.',
    },
    {
      number: '02',
      title: 'Set Your "Happy Price"',
      icon: Lock,
      badge: 'Secret Maximum',
      color: 'from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30',
      description:
        'This is where the magic happens. Instead of babysitting the auction, you just tell our platform the absolute maximum you are willing to pay.',
      calloutTitle: 'Your Secret is Safe',
      calloutDesc: 'Nobody else can see your maximum bid. It’s locked away securely.',
    },
    {
      number: '03',
      title: 'Let Your Auto-Bidder Do the Heavy Lifting',
      icon: Cpu,
      badge: 'Smart Automation',
      color: 'from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
      description:
        'Once you set your limit, you can walk away, grab a coffee, or go to sleep. Our smart automation takes over, bidding on your behalf in small, incremental steps—only when someone else tries to outbid you.',
      calloutTitle: 'The Smart Benefit',
      calloutDesc: 'If the auction ends and the bidding only reached half of your maximum, you win the item at that lower price! You never pay more than necessary.',
    },
    {
      number: '04',
      title: 'Zero-Stress Closings',
      icon: ShieldCheck,
      badge: 'Anti-Sniper Clock',
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      description:
        'We hate sniper bots as much as you do. To keep things fair and human, if someone places a bid in the final moments, the clock gets a tiny extension. This gives everyone a real, fair shot.',
    },
    {
      number: '05',
      title: 'Fast, Secure Finish',
      icon: CheckCircle2,
      badge: 'Instant Escrow',
      color: 'from-rose-500/20 to-red-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30',
      description:
        'If you’re the highest bidder when the clock runs out—congratulations! You’ll get an instant notification, and our secure checkout process will guide you through payment and shipping setup in just a few clicks.',
    },
  ]

  const reasons = [
    {
      title: 'Fair Play First',
      desc: 'Our automation is built to give everyday people a fair advantage, eliminating unfair bidding monopolies.',
    },
    {
      title: 'Time-Saving',
      desc: 'You spend minutes setting up a bid, not hours watching a screen.',
    },
    {
      title: 'Total Control',
      desc: 'You set the boundaries. The system respects your budget, perfectly and automatically.',
    },
  ]

  return (
    <section id="how-it-works" className="py-24 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" /> Automation & Fair Play
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            We’ve taken the adrenaline of a live auction and paired it with the effortless ease of automation. No stressful last-second typing, no staying up until 3 AM to protect your bid.
          </motion.p>
          <p className="font-semibold text-foreground text-sm uppercase tracking-widest pt-2">
            Here is how we make buying and selling a breeze:
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`rounded-3xl border border-border bg-card p-7 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-all ${
                  idx === 2 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-black text-muted-foreground/30 font-mono">{step.number}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border bg-gradient-to-r ${step.color}`}>
                      {step.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold leading-snug">{step.title}</h3>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>

                {step.calloutTitle && (
                  <div className="p-4 rounded-2xl bg-muted/50 border border-border/80 space-y-1">
                    <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" /> {step.calloutTitle}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.calloutDesc}</p>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Community Reasons Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-8 sm:p-12 space-y-8 shadow-sm"
        >
          <div className="text-center max-w-xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-2">
              <Heart className="w-4 h-4 fill-primary text-primary" /> Why Our Community Loves It
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold">Built for Fairness, Time & Control</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reasons.map((r, i) => (
              <div key={r.title} className="p-5 rounded-2xl bg-background/80 border border-border space-y-2">
                <div className="w-8 h-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </div>
                <h4 className="font-bold text-base">{r.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Banner inside How It Works */}
          <div className="pt-6 border-t border-border/60 text-center space-y-5">
            <h4 className="text-xl sm:text-2xl font-bold">Ready to skip the stress and start winning?</h4>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to={ROUTES.AUCTIONS}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-glow hover:bg-primary/90 transition-all hover:-translate-y-0.5"
              >
                Browse Live Auctions <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to={ROUTES.CREATE_AUCTION}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl border border-border bg-card text-foreground font-bold text-sm hover:bg-muted transition-all hover:-translate-y-0.5"
              >
                <PlusCircle className="w-4 h-4 text-primary" /> List Your Item
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
