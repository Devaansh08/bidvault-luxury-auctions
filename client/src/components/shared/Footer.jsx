import { Link } from 'react-router-dom'
import { Gavel, Mail, Heart, Globe, Share2, MessageCircle } from 'lucide-react'
import { ROUTES } from '../../utils/constants'

const footerLinks = {
  Platform: [
    { label: 'Browse Auctions', to: ROUTES.AUCTIONS },
    { label: 'Create Auction', to: ROUTES.CREATE_AUCTION },
    { label: 'How It Works', to: ROUTES.HOME + '#how-it-works' },
    { label: 'Community & Help Center', to: '/community-help' },
  ],
  Account: [
    { label: 'Dashboard', to: ROUTES.DASHBOARD },
    { label: 'My Bids', to: ROUTES.MY_BIDS },
    { label: 'Profile Settings', to: ROUTES.PROFILE },
  ],
  Support: [
    { label: 'Contact Us', to: ROUTES.CONTACT },
    { label: 'Sign In', to: ROUTES.LOGIN },
    { label: 'Create Account', to: ROUTES.SIGNUP },
  ],
}

const socials = [
  { icon: Globe, href: '#', label: 'Website' },
  { icon: Share2, href: '#', label: 'Community' },
  { icon: MessageCircle, href: '#', label: 'Chat' },
  { icon: Mail, href: '#', label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link to={ROUTES.HOME} className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                <Gavel className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">BidVault</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The premium real-time auction platform for unique items, art, collectibles, and more.
            </p>
            <div className="flex items-center gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-sm mb-3">{title}</h3>
              <ul className="space-y-2">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} BidVault. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-destructive fill-destructive" /> by BidVault Team
          </p>
        </div>
      </div>
    </footer>
  )
}
