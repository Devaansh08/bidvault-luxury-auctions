import { useDispatch, useSelector } from 'react-redux'
import { selectUser, selectIsAuthenticated, setUser, clearUser, setLoading } from '../store/authSlice'
import { authService } from '../services/authService'
import { toast } from 'sonner'

export function useAuth() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const login = async (credentials) => {
    dispatch(setLoading(true))
    try {
      const res = await authService.login(credentials)
      dispatch(setUser(res.data.user))
      toast.success(`Welcome back, ${res.data.user.name}!`)
      return res.data
    } finally {
      dispatch(setLoading(false))
    }
  }

  const signup = async (userData) => {
    dispatch(setLoading(true))
    try {
      const res = await authService.signup(userData)
      dispatch(setUser(res.data.user))
      toast.success('Account created successfully!')
      return res.data
    } finally {
      dispatch(setLoading(false))
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch {}
    dispatch(clearUser())
    toast.success('Logged out successfully')
  }

  return { user, isAuthenticated, login, signup, logout }
}
