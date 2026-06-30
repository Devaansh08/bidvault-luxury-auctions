import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, ImageOff, X, Loader2, Calendar, DollarSign, Tag, FileText, Clock } from 'lucide-react'
import { useCreateAuction } from '../../hooks/useAuctions'
import { uploadService } from '../../services/uploadService'
import { validateAuction, validateImage } from '../../utils/validators'
import { AUCTION_CATEGORIES, ROUTES } from '../../utils/constants'
import { cn } from '../../utils/helpers'
import { toast } from 'sonner'

export default function CreateAuction() {
  const navigate = useNavigate()
  const createAuction = useCreateAuction()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    startingBid: '',
    endDate: '',
  })
  const [errors, setErrors] = useState({})
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageError, setImageError] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setErrors((err) => ({ ...err, [e.target.name]: undefined }))
  }

  const handleImage = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const err = validateImage(file)
    if (err) { setImageError(err); return }
    setImageError(null)
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleImage({ target: { files: [file] } })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateAuction({ ...form, startingBid: Number(form.startingBid) })
    if (Object.keys(errs).length) { setErrors(errs); return }
    if (!imageFile) { setImageError('Image is required'); return }

    setLoading(true)
    try {
      setUploading(true)
      const { url: imageUrl } = await uploadService.uploadToCloudinary(imageFile)
      setUploading(false)

      await createAuction.mutateAsync({
        ...form,
        startingBid: Number(form.startingBid),
        image: imageUrl,
      })
      navigate(ROUTES.MY_AUCTIONS)
    } catch (err) {
      setUploading(false)
      toast.error(err.response?.data?.message || 'Failed to create auction')
    } finally {
      setLoading(false)
    }
  }

  const minDate = new Date()
  minDate.setHours(minDate.getHours() + 1)
  const minDateStr = minDate.toISOString().slice(0, 16)

  const inputClass = (name) => cn(
    'w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 bg-background transition-all',
    errors[name]
      ? 'border-destructive focus:ring-destructive/30'
      : 'border-border focus:ring-primary/30 focus:border-primary',
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create Auction</h1>
        <p className="text-muted-foreground text-sm mt-1">List an item for real-time bidding</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image upload */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Upload className="w-4 h-4 text-primary" /> Item Photo
          </h2>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className={cn(
              'relative border-2 border-dashed rounded-xl cursor-pointer transition-colors',
              imagePreview ? 'border-primary/40' : 'border-border hover:border-primary/40 hover:bg-primary/5',
            )}
          >
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="w-full h-56 object-cover rounded-xl" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null) }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center hover:bg-background"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center py-12 text-muted-foreground">
                <ImageOff className="w-12 h-12 mb-3 opacity-40" />
                <p className="text-sm font-medium">Click or drag to upload image</p>
                <p className="text-xs mt-1">JPEG, PNG, WebP · Max 5MB</p>
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
          {imageError && <p className="text-xs text-destructive mt-2">{imageError}</p>}
        </div>

        {/* Details */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          <h2 className="font-semibold flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" /> Item Details
          </h2>

          <div>
            <label className="block text-sm font-medium mb-1.5">Title *</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Vintage Rolex Submariner 1960" className={inputClass('title')} />
            {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the item's condition, history, and unique features…"
              className={cn(inputClass('description'), 'resize-none')}
            />
            {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> Category *
            </label>
            <select name="category" value={form.category} onChange={handleChange} className={inputClass('category')}>
              <option value="">Select a category</option>
              {AUCTION_CATEGORIES.slice(1).map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-destructive mt-1">{errors.category}</p>}
          </div>
        </div>

        {/* Pricing & Timing */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          <h2 className="font-semibold flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" /> Pricing & Timing
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Starting Bid (₹) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₹</span>
                <input
                  name="startingBid"
                  type="number"
                  min="100"
                  step="100"
                  value={form.startingBid}
                  onChange={handleChange}
                  placeholder="500"
                  className={cn(inputClass('startingBid'), 'pl-8')}
                />
              </div>
              {errors.startingBid && <p className="text-xs text-destructive mt-1">{errors.startingBid}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> End Date & Time *
              </label>
              <input
                name="endDate"
                type="datetime-local"
                min={minDateStr}
                value={form.endDate}
                onChange={handleChange}
                className={inputClass('endDate')}
              />
              {errors.endDate && <p className="text-xs text-destructive mt-1">{errors.endDate}</p>}
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || createAuction.isPending}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-glow hover:shadow-glow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {uploading ? 'Uploading image…' : 'Creating auction…'}
            </>
          ) : (
            'Create Auction'
          )}
        </button>
      </form>
    </div>
  )
}
