import { useState } from 'react'
import { Mail, MessageSquare, User, Send, Loader2, CheckCircle2 } from 'lucide-react'
import { contactService } from '../services/contactService'
import { toast } from 'sonner'
import { cn } from '../utils/helpers'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email required'
    if (!form.subject.trim()) errs.subject = 'Subject is required'
    if (!form.message.trim() || form.message.length < 20) errs.message = 'Message must be at least 20 characters'
    return errs
  }

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setErrors((err) => ({ ...err, [e.target.name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await contactService.sendMessage(form)
      setSent(true)
      toast.success('Message sent! We\'ll get back to you soon.')
    } catch (err) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (name) => cn(
    'w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 bg-background transition-all',
    errors[name] ? 'border-destructive focus:ring-destructive/30' : 'border-border focus:ring-primary/30 focus:border-primary',
  )

  if (sent) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
        <p className="text-muted-foreground">Thanks for reaching out. We'll respond within 24 hours.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Get in Touch</h1>
        <p className="text-muted-foreground mt-3 max-w-md mx-auto">
          Have questions or need help? We're here for you. Send us a message and we'll respond shortly.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className={cn(inputClass('name'), 'pl-10')} />
              </div>
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className={cn(inputClass('email'), 'pl-10')} />
              </div>
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Subject</label>
            <input name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?" className={inputClass('subject')} />
            {errors.subject && <p className="text-xs text-destructive mt-1">{errors.subject}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Message</label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder="Tell us more about your inquiry…"
                className={cn(inputClass('message'), 'pl-10 resize-none')}
              />
            </div>
            {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : <><Send className="w-4 h-4" /> Send Message</>}
          </button>
        </form>
      </div>
    </div>
  )
}
