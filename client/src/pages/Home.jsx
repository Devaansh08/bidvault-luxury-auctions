import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Gavel, Shield, Zap, Globe, TrendingUp, Star, Clock } from 'lucide-react'
import { ROUTES, AUCTION_CATEGORIES } from '../utils/constants'
import { useAuctions } from '../hooks/useAuctions'
import AuctionGrid from '../components/auction/AuctionGrid'
import HowItWorksSection from '../components/home/HowItWorksSection'

const stats = [
  { label: 'Active Auctions', value: '2,400+', icon: Gavel },
  { label: 'Registered Users', value: '15,000+', icon: Globe },
  { label: 'Bids Placed', value: '98,000+', icon: TrendingUp },
  { label: 'Items Sold', value: '8,500+', icon: Star },
]

const features = [
  {
    icon: Zap,
    title: 'Real-Time Bidding',
    desc: 'Instant bid updates powered by Socket.io. See every bid as it happens.',
  },
  {
    icon: Shield,
    title: 'Secure & Trusted',
    desc: 'JWT authentication, encrypted connections, and monitored for fraud.',
  },
  {
    icon: Clock,
    title: 'Live Countdowns',
    desc: 'Precise countdown timers down to the second so you never miss an auction.',
  },
  {
    icon: Globe,
    title: 'Cloud-Powered',
    desc: 'Cloudinary CDN for fast image delivery. Available everywhere, 24/7.',
  },
]

const categories = AUCTION_CATEGORIES.slice(1, 7)

function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 px-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-auction-500/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Live auctions happening right now
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6"
        >
          The Future of{' '}
          <span className="text-gradient">Online Auctions</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Bid on unique items, collectibles, art, and more — with real-time updates
          and a seamless experience built for serious bidders.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to={ROUTES.AUCTIONS}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-glow hover:shadow-glow-lg hover:-translate-y-0.5"
          >
            Browse Auctions
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to={ROUTES.SIGNUP}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-muted transition-all hover:-translate-y-0.5"
          >
            Create Account — It's Free
          </Link>
        </motion.div>

        {/* Floating trust tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-12"
        >
          {['No hidden fees', 'Instant notifications', 'Secure payments', '24/7 support'].map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function StatsSection() {
  return (
    <section className="py-14 border-y border-border bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ label, value, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-gradient">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedAuctions() {
  const { data, isLoading } = useAuctions({ sort: 'endDate:asc', page: 1 })

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Live Auctions</h2>
            <p className="text-muted-foreground mt-1">Bidding ends soon — don't miss out</p>
          </div>
          <Link
            to={ROUTES.AUCTIONS}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <AuctionGrid
          auctions={data?.auctions?.slice(0, 6) ?? []}
          loading={isLoading}
          columns={3}
        />
      </div>
    </section>
  )
}

function CategoriesSection() {
  const categoryIcons = ['🎨', '💻', '💍', '👗', '🚗', '📚']

  return (
    <section className="py-16 px-4 bg-card/20 border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Browse by Category</h2>
          <p className="text-muted-foreground mt-2">Find exactly what you're looking for</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.value}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`${ROUTES.AUCTIONS}?category=${cat.value}`}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all group"
              >
                <span className="text-3xl">{categoryIcons[i]}</span>
                <span className="text-sm font-medium text-center group-hover:text-primary transition-colors">
                  {cat.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section id="how-it-works" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Why Choose BidVault?</h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Built from the ground up with modern technology for the best auction experience.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-card-hover transition-all group"
            >
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-glow group-hover:shadow-glow-lg transition-shadow">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-10 md:p-16 text-center shadow-glow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-auction-700 opacity-80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Bidding?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
              Join thousands of bidders already on BidVault. Create your free account and place your first bid in minutes.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to={ROUTES.SIGNUP}
                className="px-6 py-3 rounded-xl bg-white text-primary font-semibold text-sm hover:bg-white/90 transition-all shadow-lg hover:-translate-y-0.5"
              >
                Get Started Free
              </Link>
              <Link
                to={ROUTES.AUCTIONS}
                className="px-6 py-3 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-all"
              >
                Browse Auctions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <title>BidVault — Premium Real-Time Auctions</title>
      <HeroSection />
      <StatsSection />
      <FeaturedAuctions />
      <CategoriesSection />
      <HowItWorksSection />
      <CTASection />
    </>
  )
}
