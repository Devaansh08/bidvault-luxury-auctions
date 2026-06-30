import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { User, Mail, MapPin, Save, Loader2, Image as ImageIcon, FileText, Sparkles, Phone, Globe, Crown, Shield, CheckCircle2 } from 'lucide-react'
import { selectUser, setUser } from '../../store/authSlice'
import { userService } from '../../services/userService'
import { authService } from '../../services/authService'
import { isValidPassword } from '../../utils/validators'
import { toast } from 'sonner'

export default function ProfileSettings() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)

  const [activeTab, setActiveTab] = useState('identity') // identity | details | upgrade | security

  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    avatar: user?.avatar || '',
    phone: user?.phone || '+91 98110 45291',
    website: user?.website || 'https://collectors.bidvault.com/user',
    vipTier: user?.vipTier || 'Standard Collector',
  })
  const [profileLoading, setProfileLoading] = useState(false)

  // Sync form when user updates in Redux
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        avatar: user.avatar || '',
        phone: user.phone || '+91 98110 45291',
        website: user.website || 'https://collectors.bidvault.com/user',
        vipTier: user.vipTier || 'Standard Collector',
      })
    }
  }, [user])

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwErrors, setPwErrors] = useState({})
  const [pwLoading, setPwLoading] = useState(false)

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&q=80',
  ]

  const handleProfileChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    try {
      const res = await userService.updateProfile(form)
      if (res.data?.user) {
        dispatch(setUser(res.data.user))
      }
      toast.success('🎉 Profile details saved and live updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setProfileLoading(false)
    }
  }

  const handleTierUpgrade = async (tierName) => {
    setProfileLoading(true)
    try {
      const updatedForm = { ...form, vipTier: tierName }
      const res = await userService.updateProfile(updatedForm)
      if (res.data?.user) {
        dispatch(setUser(res.data.user))
      }
      setForm(updatedForm)
      toast.success(`🎉 Membership Upgraded to ${tierName}! Enjoy verified priority bidding.`)
    } catch (err) {
      toast.error('Failed to upgrade membership status')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePwChange = (e) => {
    setPwForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setPwErrors((err) => ({ ...err, [e.target.name]: undefined }))
  }

  const handlePwSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!pwForm.currentPassword) errs.currentPassword = 'Required'
    if (!isValidPassword(pwForm.newPassword)) errs.newPassword = 'Min 8 chars, uppercase, lowercase, number'
    if (pwForm.newPassword !== pwForm.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    if (Object.keys(errs).length) {
      setPwErrors(errs)
      return
    }

    setPwLoading(true)
    try {
      await authService.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      toast.success('Password changed successfully!')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setPwLoading(false)
    }
  }

  const inputClass = (err) =>
    `w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 bg-background transition-all ${
      err ? 'border-destructive focus:ring-destructive/30' : 'border-border focus:ring-primary/30 focus:border-primary'
    }`

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header with Live VIP Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <Crown className="w-3.5 h-3.5" /> {form.vipTier || 'Standard Collector'}
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Profile & Membership Management</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your personal identity, contact details, shipping logistics presets, and VIP status
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap bg-muted/50 p-1.5 rounded-2xl border border-border gap-1.5">
          {[
            { id: 'identity', label: 'Identity & Bio' },
            { id: 'details', label: 'Contact & Shipping Details' },
            { id: 'upgrade', label: '🏆 Upgrade Tier' },
            { id: 'security', label: 'Security' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-primary text-primary-foreground shadow-glow' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: Identity & Bio */}
      {activeTab === 'identity' && (
        <form onSubmit={handleProfileSubmit} className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> Profile Picture & Basic Info
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">This information is displayed publicly on your bids and auctions</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 rounded-2xl bg-muted/30 border border-border/50">
            <div className="relative w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl font-bold shadow-glow shrink-0 overflow-hidden border-2 border-primary/20">
              {form.avatar ? (
                <img src={form.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0)?.toUpperCase() || 'U'
              )}
            </div>
            <div className="flex-1 space-y-2 w-full">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Profile Picture URL
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="url"
                  name="avatar"
                  value={form.avatar}
                  onChange={handleProfileChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-muted-foreground">Presets:</span>
                <div className="flex gap-1.5">
                  {sampleAvatars.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, avatar: url }))}
                      className={`w-6 h-6 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 ${
                        form.avatar === url ? 'border-primary ring-2 ring-primary/30' : 'border-transparent opacity-70'
                      }`}
                    >
                      <img src={url} alt={`Preset ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-muted-foreground" /> Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleProfileChange}
                required
                className={inputClass()}
                placeholder="Devansh Sharma"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-muted-foreground" /> City / Location
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleProfileChange}
                className={inputClass()}
                placeholder="New Delhi, India"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-muted-foreground" /> About Me / Collector Bio
              </label>
              <span className="text-xs text-muted-foreground">{form.bio.length}/300 chars</span>
            </div>
            <textarea
              name="bio"
              rows={3}
              maxLength={300}
              value={form.bio}
              onChange={handleProfileChange}
              className={inputClass()}
              placeholder="Tell collectors about your specialty items, watch history, or bidding interests..."
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <button
              type="submit"
              disabled={profileLoading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-glow hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {profileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Profile Identity
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Contact & Shipping Details Section */}
      {activeTab === 'details' && (
        <form onSubmit={handleProfileSubmit} className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-border pb-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" /> Edit Contact Details & Delivery Logistics
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              These details are auto-filled during checkout when you win an auction
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-muted-foreground" /> Registered Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || 'devanshdevil0@gmail.com'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-muted/60 text-sm opacity-80 cursor-not-allowed"
              />
              <p className="text-[11px] text-muted-foreground mt-1">Primary identity verification email</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-muted-foreground" /> Mobile / WhatsApp Number
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleProfileChange}
                className={inputClass()}
                placeholder="+91 98110 •••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-muted-foreground" /> Portfolio / Collector Website URL
            </label>
            <input
              type="url"
              name="website"
              value={form.website}
              onChange={handleProfileChange}
              className={inputClass()}
              placeholder="https://yourgallery.com"
            />
          </div>

          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
            <p className="text-xs font-bold text-primary flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> Logistics Verification Notice
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When updating contact details, our courier logistics system instantly syncs your recipient phone and location for all active winning shipments.
            </p>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <button
              type="submit"
              disabled={profileLoading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-glow hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {profileLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Contact Details
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: Upgrade Tier Section */}
      {activeTab === 'upgrade' && (
        <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8 space-y-6 shadow-md">
          <div className="border-b border-border/60 pb-4">
            <h2 className="font-extrabold text-2xl flex items-center gap-2.5">
              <Crown className="w-7 h-7 text-amber-500 fill-amber-500" /> Account Membership & VIP Tier Upgrade
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Select an exclusive collector tier below to unlock verified priority escrow, higher maximum bid caps, and white-glove support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                tier: 'Standard Collector',
                price: 'Free',
                badge: 'Default',
                desc: 'Basic real-time bidding up to $10,000 per auction.',
                features: ['Standard Ground Shipping', 'Real-time WebSocket alerts', 'Standard escrow protection'],
              },
              {
                tier: 'Gold VIP Collector',
                price: '$49 / Year',
                badge: 'Recommended',
                desc: 'Priority bidding privileges up to $150,000 with zero escrow fees.',
                features: ['Priority Air Express shipping', 'Verified Gold Badge ✓', '24/7 White-glove concierge'],
              },
              {
                tier: 'Platinum Pro Seller',
                price: '$199 / Year',
                badge: 'Elite Partner',
                desc: 'Unlimited bidding & listing volume with dedicated broker support.',
                features: ['Armored Escrow Courier included', 'Featured auction placement', 'Zero seller transaction fees'],
              },
            ].map((t) => {
              const isCurrent = form.vipTier === t.tier
              return (
                <div
                  key={t.tier}
                  className={`p-6 rounded-2xl border flex flex-col justify-between space-y-6 transition-all ${
                    isCurrent
                      ? 'border-primary bg-primary/15 shadow-glow ring-2 ring-primary'
                      : 'border-border bg-background/80 hover:border-primary/50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/20 text-primary">
                        {t.badge}
                      </span>
                      {isCurrent && (
                        <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Current
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-black">{t.tier}</h3>
                    <p className="text-2xl font-mono font-extrabold text-gradient">{t.price}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
                    <ul className="space-y-2 pt-2 border-t border-border/50 text-xs">
                      {t.features.map((f, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-foreground font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTierUpgrade(t.tier)}
                    disabled={isCurrent || profileLoading}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                      isCurrent
                        ? 'bg-muted text-muted-foreground cursor-default'
                        : 'bg-primary text-primary-foreground shadow-glow hover:bg-primary/90'
                    }`}
                  >
                    {isCurrent ? 'Active Membership Tier' : `Activate ${t.tier}`}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB 4: Security Section */}
      {activeTab === 'security' && (
        <form onSubmit={handlePwSubmit} className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-border pb-4">
            <h2 className="font-semibold text-lg">Change Password & Account Security</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Ensure your account uses a strong, unique password</p>
          </div>

          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-1.5">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={pwForm.currentPassword}
                onChange={handlePwChange}
                required
                className={inputClass(pwErrors.currentPassword)}
                placeholder="••••••••"
              />
              {pwErrors.currentPassword && <p className="text-xs text-destructive mt-1">{pwErrors.currentPassword}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={pwForm.newPassword}
                onChange={handlePwChange}
                required
                className={inputClass(pwErrors.newPassword)}
                placeholder="••••••••"
              />
              {pwErrors.newPassword && <p className="text-xs text-destructive mt-1">{pwErrors.newPassword}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={pwForm.confirmPassword}
                onChange={handlePwChange}
                required
                className={inputClass(pwErrors.confirmPassword)}
                placeholder="••••••••"
              />
              {pwErrors.confirmPassword && <p className="text-xs text-destructive mt-1">{pwErrors.confirmPassword}</p>}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <button
              type="submit"
              disabled={pwLoading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-glow hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {pwLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Update Security Password
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
