import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated, selectAuthInitialized } from '../store/authSlice'
import { ROUTES } from '../utils/constants'
import LoadingSpinner from '../components/shared/LoadingSpinner'

export default function ProtectedRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const initialized = useSelector(selectAuthInitialized)
  const location = useLocation()

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  return <Outlet />
}
