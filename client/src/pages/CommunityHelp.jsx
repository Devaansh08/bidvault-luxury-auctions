import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HelpCircle,
  Users,
  BookOpen,
  ShieldCheck,
  MessageSquare,
  Search,
  Award,
  CheckCircle,
  Sparkles,
  PhoneCall,
  Mail,
  FileText,
  ChevronDown,
  ArrowRight,
  Gavel,
  Clock,
  DollarSign,
  HeartHandshake
} from 'lucide-react'

const seoKeywords = [
  'Online Auction Help',
  'Live Bidding Support',
  'Verified Antique Sellers',
  'BidVault Community Forum',
  'How to Bid on Luxury Watches',
  'Real-Time Auction Rules',
  'Proxy Bidding Guidelines',
  'Secure Escrow Payments',
  'Collector Dispute Resolution',
  'Vintage Cars Bidding Tips'
]

const helpCategories = [
  {
    title: 'Bidding & Winning',
    icon: Gavel,
    desc: 'Master real-time bidding, automatic increments, proxy bids, and winning bid verification.',
    articles: ['How real-time sniping protection works', 'Setting up automatic proxy bidding limits', 'Understanding reserve vs starting bids']
  },
  {
    title: 'Selling & Listing',
    icon: DollarSign,
    desc: 'List rare collectibles, art, and jewelry with verified seller credentials and instant escrow.',
    articles: ['Photo requirements for high-value auctions', 'Calculating seller fees and payout timing', 'Managing active auctions and questions']
  },
  {
    title: 'Trust & Authenticity',
    icon: ShieldCheck,
    desc: 'All luxury watches, art, and vintage vehicles undergo strict verification and escrow checks.',
    articles: ['BidVault Certificate of Authenticity (CoA)', 'Reporting counterfeit or suspicious items', 'Escrow protection and refund policies']
  },
  {
    title: 'Collector Community',
    icon: Users,
    desc: 'Connect with passionate collectors, connoisseurs, and appraisers across the globe.',
    articles: ['Joining verified collector clubs', 'Attending live virtual auction previews', 'Community guidelines & code of conduct']
  }
]

const faqItems = [
  {
    q: 'How does BidVault ensure item authenticity and secure payments?',
    a: 'Every high-value auction listed on BidVault requires strict verification. Funds from winning bids are held securely in our protected Escrow system until the buyer inspects and approves the item upon delivery.'
  },
  {
    q: 'What happens if a bid is placed in the last 60 seconds of an auction?',
    a: 'BidVault features Anti-Sniping Protection. If a bid is placed within the final 60 seconds of the countdown timer, the auction deadline automatically extends by 2 minutes to allow competing bidders a fair chance to respond.'
  },
  {
    q: 'Can I cancel a bid once it has been submitted?',
    a: 'Bids placed on live auctions are legally binding agreements. However, if a clear typographical error occurs (e.g., entering $50,000 instead of $5,000), you can request an emergency review within 15 minutes via our 24/7 Support Desk.'
  },
  {
    q: 'How do I become a Verified Seller on BidVault?',
    a: 'To earn the Verified Seller badge, navigate to Dashboard > Profile Settings and submit your government ID along with proof of ownership or professional appraiser certificates for your inventory.'
  },
  {
    q: 'Are there hidden buyer premiums or transaction fees?',
    a: 'No hidden fees. BidVault operates on complete transparency with a flat 5% buyer platform fee applied only to winning bids, clearly displayed before you confirm any bid.'
  }
]

export default function CommunityHelp() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openFaq, setOpenFaq] = useState(0)

  const filteredFaqs = faqItems.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      {/* SEO Hidden Meta Section for Search Engines */}
      <div className="sr-only">
        <h1>BidVault Community & Help Center - #1 Online Auction Support & Collector Guide</h1>
        <p>
          Find answers on live bidding, proxy bidding rules, luxury watch verification, antique auction guidelines, and join our global collector community forum.
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" /> Official Collector Knowledge Base
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground"
          >
            Community & <span className="text-gradient">Help Center</span>
          </motion.h1>

          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Everything you need to bid with confidence, list premium inventory, and connect with over 50,000 verified auction connoisseurs worldwide.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto pt-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help articles, bidding rules, escrow details..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-card shadow-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all"
            />
          </div>

          {/* SEO Trending Keywords Cloud */}
          <div className="pt-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2.5 uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-primary" /> Popular SEO Support Topics:
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {seoKeywords.map((kw, idx) => (
                <span
                  key={idx}
                  onClick={() => setSearchQuery(kw.split(' ')[0])}
                  className="px-3 py-1 rounded-full text-xs font-medium border border-border/60 bg-muted/50 text-foreground hover:border-primary hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Category Knowledge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {helpCategories.map((cat, idx) => {
            const Icon = cat.icon
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-7 rounded-3xl border border-border bg-card shadow-card hover:shadow-card-hover hover:border-primary/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center text-white mb-5 shadow-glow group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-border/50">
                  {cat.articles.map((art, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs font-medium text-foreground hover:text-primary cursor-pointer transition-colors">
                      <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{art}</span>
                      <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>

        {/* Frequently Asked Questions */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="text-sm text-muted-foreground">Detailed guidance on rules, payment protection, and platform policies</p>
          </div>

          <div className="space-y-3.5">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-10 rounded-2xl border border-dashed border-border bg-card">
                <HelpCircle className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">No FAQ matched "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-3 text-xs text-primary font-semibold hover:underline"
                >
                  Clear search
                </button>
              </div>
            ) : (
              filteredFaqs.map((faq, index) => {
                const isOpen = openFaq === index
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-border bg-card overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors font-semibold text-sm sm:text-base text-foreground"
                    >
                      <span className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-muted-foreground transition-transform duration-300 shrink-0 ${
                          isOpen ? 'rotate-180 text-primary' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <div className="px-5 pb-5 pt-1 text-sm text-muted-foreground border-t border-border/40 leading-relaxed bg-muted/10">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Community Engagement & Live Assistance Banner */}
        <div className="rounded-3xl gradient-primary p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
              <HeartHandshake className="w-3.5 h-3.5" /> 24/7 Priority Support
            </div>
            <h2 className="text-3xl sm:text-4xl font-black">
              Need Direct Assistance From Our Auction Specialists?
            </h2>
            <p className="text-white/85 text-sm sm:text-base leading-relaxed">
              Our support team is online around the clock to assist with item appraisal validation, escrow status inquiries, and live auction troubleshooting.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="mailto:support@bidvault.com"
                className="px-6 py-3 rounded-xl bg-white text-primary font-bold text-sm shadow-lg hover:bg-white/90 transition-all flex items-center gap-2"
              >
                <Mail className="w-4 h-4" /> Email Support Desk
              </a>
              <a
                href="tel:+18005552438"
                className="px-6 py-3 rounded-xl bg-black/30 border border-white/20 text-white font-bold text-sm hover:bg-black/40 transition-all flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" /> Call 1-800-BID-VAULT
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
