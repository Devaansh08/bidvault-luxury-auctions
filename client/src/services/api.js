import axios from 'axios'
import { toast } from 'sonner'

const API = axios.create({
  baseURL: import.meta.env.VITE_API || 'http://localhost:5000',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Request interceptor
API.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
)

// Response interceptor — global error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong'
    const status = error.response?.status

    // Don't show toast for auth check endpoint
    const silentUrls = ['/user', '/auth/me']
    const url = error.config?.url || ''
    const isSilent = silentUrls.some((u) => url.endsWith(u))

    if (status === 401 && !isSilent) {
      // Let individual handlers deal with 401
    } else if (status === 403) {
      toast.error('You do not have permission to do this.')
    } else if (status >= 500) {
      toast.error('Server error. Please try again later.')
    }

    return Promise.reject(error)
  },
)

export default API
