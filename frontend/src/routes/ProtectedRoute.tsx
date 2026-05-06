import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { LoadingScreen } from '../components/common/LoadingScreen'
import { useAuth } from '../hooks/useAuth'
import type { UserRole } from '../types/auth'
import { getDefaultRouteForRole } from './routeConfig'

interface ProtectedRouteProps {
  allowedRoles?: UserRole[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const location = useLocation()
  const { isAuthenticated, isBootstrapping, user } = useAuth()

  if (isBootstrapping) {
    return <LoadingScreen />
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDefaultRouteForRole(user.role)} replace />
  }

  return <Outlet />
}
