import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB, MIN_BID_INCREMENT } from './constants'

/** Email validator */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/** Password rules: min 8 chars, 1 upper, 1 lower, 1 number */
export function isValidPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)
}

export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' }
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  const levels = [
    { score: 0, label: '', color: '' },
    { score: 1, label: 'Very Weak', color: 'bg-destructive' },
    { score: 2, label: 'Weak', color: 'bg-orange-500' },
    { score: 3, label: 'Fair', color: 'bg-yellow-500' },
    { score: 4, label: 'Strong', color: 'bg-green-500' },
    { score: 5, label: 'Very Strong', color: 'bg-emerald-500' },
  ]
  return levels[score]
}

/** Validate login form */
export function validateLogin({ email, password }) {
  const errors = {}
  if (!email) errors.email = 'Email is required'
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address'
  if (!password) errors.password = 'Password is required'
  return errors
}

/** Validate signup form */
export function validateSignup({ name, email, password, confirmPassword }) {
  const errors = {}
  if (!name || name.trim().length < 2) errors.name = 'Name must be at least 2 characters'
  if (!email) errors.email = 'Email is required'
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address'
  if (!password) errors.password = 'Password is required'
  else if (!isValidPassword(password))
    errors.password = 'Password must be 8+ chars with uppercase, lowercase, and number'
  if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match'
  return errors
}

/** Validate bid amount */
export function validateBid(amount, currentBid) {
  if (!amount || isNaN(amount)) return 'Enter a valid amount'
  if (amount <= currentBid) return `Bid must be higher than ₹${currentBid.toLocaleString('en-IN')}`
  if (amount < currentBid + MIN_BID_INCREMENT)
    return `Minimum increment is ₹${MIN_BID_INCREMENT.toLocaleString('en-IN')}`
  return null
}

/** Validate auction creation form */
export function validateAuction(data) {
  const errors = {}
  if (!data.title || data.title.trim().length < 5) errors.title = 'Title must be at least 5 characters'
  if (!data.description || data.description.trim().length < 20)
    errors.description = 'Description must be at least 20 characters'
  if (!data.category) errors.category = 'Select a category'
  if (!data.startingBid || data.startingBid < 100)
    errors.startingBid = 'Starting bid must be at least ₹100'
  if (!data.endDate) errors.endDate = 'End date is required'
  else if (new Date(data.endDate) <= new Date()) errors.endDate = 'End date must be in the future'
  return errors
}

/** Validate image file */
export function validateImage(file) {
  if (!file) return 'Image is required'
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return 'Only JPEG, PNG, and WebP images are accepted'
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) return `Image must be smaller than ${MAX_IMAGE_SIZE_MB}MB`
  return null
}
