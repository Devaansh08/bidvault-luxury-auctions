import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes safely */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/** Truncate text to n chars */
export function truncate(str, n = 60) {
  return str?.length > n ? str.slice(0, n) + '…' : str
}

/** Debounce a function */
export function debounce(fn, delay = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/** Sleep for ms milliseconds */
export const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

/** Safely access nested object key */
export function get(obj, path, fallback = undefined) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj) ?? fallback
}

/** Check if value is empty (null, undefined, '', [], {}) */
export function isEmpty(value) {
  if (value == null) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/** Generate a random ID */
export function generateId() {
  return Math.random().toString(36).slice(2, 9)
}

/** Scroll smoothly to element */
export function scrollTo(elementId) {
  document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' })
}
