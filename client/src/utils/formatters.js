import { format, formatDistanceToNow, differenceInSeconds, isPast } from 'date-fns'

/** Format number as Indian Rupee currency */
export function formatCurrency(amount, compact = false) {
  if (compact && amount >= 1_00_000) {
    return '₹' + (amount / 1_00_000).toFixed(1) + 'L'
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/** Format number with commas */
export function formatNumber(num) {
  return new Intl.NumberFormat('en-IN').format(num)
}

/** Format date as readable string */
export function formatDate(date, fmt = 'dd MMM yyyy') {
  if (!date) return '—'
  return format(new Date(date), fmt)
}

/** Format date + time */
export function formatDateTime(date) {
  if (!date) return '—'
  return format(new Date(date), 'dd MMM yyyy, hh:mm a')
}

/** Relative time (e.g., "2 hours ago") */
export function timeAgo(date) {
  if (!date) return '—'
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

/** Countdown timer object from date */
export function getCountdown(endDate) {
  const now = new Date()
  const end = new Date(endDate)
  if (isPast(end)) return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 }

  const totalSeconds = differenceInSeconds(end, now)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return { expired: false, days, hours, minutes, seconds, totalSeconds }
}

/** Format file size */
export function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

/** Capitalize first letter */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/** Initials from name */
export function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}
