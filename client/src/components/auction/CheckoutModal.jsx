import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, ShieldCheck, CheckCircle2, Loader2, Sparkles, Truck, MapPin, Building, Wallet, ArrowRight, ArrowLeft } from 'lucide-react'
import { formatCurrency } from '../../utils/formatters'
import { toast } from 'sonner'

export default function CheckoutModal({ isOpen, onClose, auction, winningAmount, onPaymentSuccess }) {
  const [step, setStep] = useState(1) // 1: Shipping, 2: Payment
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [address, setAddress] = useState({
    fullName: 'Devansh Sharma',
    street: '124 Luxury Heritage Avenue',
    city: 'New Delhi',
    postalCode: '110001',
    country: 'India',
  })

  if (!isOpen) return null

  const shippingCosts = {
    standard: 0,
    express: 45,
    armored: 150,
  }

  const shippingCost = shippingCosts[shippingMethod] || 0
  const totalAmount = winningAmount + shippingCost

  const handleNextStep = (e) => {
    e.preventDefault()
    if (!address.fullName || !address.street || !address.city) {
      toast.error('Please fill out all delivery address fields.')
      return
    }
    setStep(2)
  }

  const handlePay = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/auth/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'user@bidvault.com',
          subject: `🏆 Auction Won & Shipping Verified: ${auction?.title || 'Collectible Item'}`,
          message: `Congratulations! Your payment of ${formatCurrency(totalAmount)} has been verified. Shipping via ${shippingMethod.toUpperCase()} to ${address.city}. Tracking ID: TRK-991823-BV.`,
        }),
      })
    } catch (err) {}

    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      toast.success('🎉 Order & Shipping verified! Invoice & Credentials dispatched to your registered email.')
      if (onPaymentSuccess) onPaymentSuccess({ address, shippingMethod, totalAmount })
    }, 1200)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-xl rounded-3xl border border-border bg-card shadow-2xl overflow-hidden p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {success ? (
            <div className="py-8 text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto text-white shadow-glow"
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>
              <h3 className="text-2xl font-bold">Order Confirmed & Dispatched!</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Your payment of <strong className="text-foreground">{formatCurrency(totalAmount)}</strong> for <em>{auction?.title}</em> has been verified. It is scheduled for delivery via <strong className="text-foreground uppercase">{shippingMethod}</strong> to <strong>{address.city}</strong>.
              </p>
              <div className="p-4 rounded-2xl bg-muted/40 border border-border text-left text-xs space-y-1 font-mono">
                <p>Tracking ID: TRK-{Math.floor(100000 + Math.random() * 900000)}-BV</p>
                <p>Delivery To: {address.fullName}, {address.street}, {address.city}</p>
                <p>Escrow Verification: Confirmed (100% Secured)</p>
              </div>
              <div className="pt-3">
                <button
                  onClick={onClose}
                  className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-glow hover:bg-primary/90 transition-all"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Stepper Header */}
              <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                <div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/15 text-primary uppercase tracking-wider">
                    Step {step} of 2
                  </span>
                  <h2 className="text-2xl font-bold mt-1.5">
                    {step === 1 ? 'Shipping & Delivery Setup' : 'Secure Payment Verification'}
                  </h2>
                </div>
                <div className="flex gap-2">
                  <span className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-primary shadow-glow' : 'bg-muted'}`} />
                  <span className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-primary shadow-glow' : 'bg-muted'}`} />
                </div>
              </div>

              {step === 1 ? (
                /* Step 1: Shipping Setup */
                <form onSubmit={handleNextStep} className="space-y-5">
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Delivery Address
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-muted-foreground">Recipient Name</label>
                        <input
                          type="text"
                          required
                          value={address.fullName}
                          onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-muted-foreground">Street Address</label>
                        <input
                          type="text"
                          required
                          value={address.street}
                          onChange={(e) => setAddress({ ...address, street: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-muted-foreground">City</label>
                        <input
                          type="text"
                          required
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-muted-foreground">Postal Code</label>
                        <input
                          type="text"
                          required
                          value={address.postalCode}
                          onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-primary/30"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Options */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Select Shipping & Logistics Speed
                    </label>
                    <div className="space-y-2.5">
                      {[
                        {
                          id: 'standard',
                          title: '🚚 Standard Ground Shipping',
                          time: '3-5 Business Days · Insured',
                          price: '$0.00 (Free)',
                        },
                        {
                          id: 'express',
                          title: '⚡ Priority Air Express',
                          time: 'Next Day Guaranteed Flight',
                          price: '+$45.00',
                        },
                        {
                          id: 'armored',
                          title: '🛡️ White-Glove Armored Escrow Courier',
                          time: 'High-Value Collectible Courier + Signature Audit',
                          price: '+$150.00',
                        },
                      ].map((opt) => (
                        <div
                          key={opt.id}
                          onClick={() => setShippingMethod(opt.id)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                            shippingMethod === opt.id
                              ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary/30'
                              : 'border-border hover:bg-muted/40'
                          }`}
                        >
                          <div>
                            <p className="font-bold text-sm text-foreground">{opt.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{opt.time}</p>
                          </div>
                          <span className="font-mono font-bold text-sm text-primary">{opt.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-glow hover:bg-primary/90 transition-all mt-4"
                  >
                    Proceed to Payment <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* Step 2: Payment Verification */
                <form onSubmit={handlePay} className="space-y-5">
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Item Bid Winning Price:</span>
                      <span className="font-semibold text-foreground">{formatCurrency(winningAmount)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Shipping Method ({shippingMethod.toUpperCase()}):</span>
                      <span className="font-semibold text-foreground">{formatCurrency(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold border-t border-border pt-2">
                      <span>Total Order Amount:</span>
                      <span className="text-lg text-gradient">{formatCurrency(totalAmount)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Select Payment Gateway
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'card', label: 'Credit Card', icon: CreditCard },
                        { id: 'upi', label: 'UPI / NetBank', icon: Building },
                        { id: 'crypto', label: 'Crypto USDT', icon: Wallet },
                      ].map((m) => {
                        const Icon = m.icon
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setPaymentMethod(m.id)}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium gap-2 transition-all ${
                              paymentMethod === m.id
                                ? 'border-primary bg-primary/10 text-primary shadow-sm ring-1 ring-primary/30'
                                : 'border-border hover:bg-muted text-muted-foreground'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            {m.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        required
                        placeholder="Card Number: 4532 •••• •••• 8910"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm"
                      />
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-3.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-glow hover:bg-primary/90 transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Verifying Escrow…
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" /> Pay & Dispatch Order
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
