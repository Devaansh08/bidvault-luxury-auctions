import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated, selectIsAdmin } from '../store/authSlice'
import { ROUTES } from '../utils/constants'

export default function AdminRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isAdmin = useSelector(selectIsAdmin)

  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />
  if (!isAdmin) return <Navigate to={ROUTES.HOME} replace />

  return <Outlet />
}
