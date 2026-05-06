import { Navigate, Route, Routes } from 'react-router-dom'
import { LoadingScreen } from '../components/common/LoadingScreen'
import { AdminLayout } from '../layouts/admin/AdminLayout'
import { AuthLayout } from '../layouts/AuthLayout'
import { ProcessorLayout } from '../layouts/processor/ProcessorLayout'
import { RequesterLayout } from '../layouts/requester/RequesterLayout'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { CategoryManagementPage } from '../pages/admin/CategoryManagementPage'
import { EquipmentManagementPage } from '../pages/admin/EquipmentManagementPage'
import { LogsPage } from '../pages/admin/LogsPage'
import { ReportsPage } from '../pages/admin/ReportsPage'
import { UsersManagementPage } from '../pages/admin/UsersManagementPage'
import { LoginPage } from '../pages/auth/LoginPage'
import { PrintPage } from '../pages/processor/PrintPage'
import { ProcessRequestPage } from '../pages/processor/ProcessRequestPage'
import { ProcessorDashboardPage } from '../pages/processor/ProcessorDashboardPage'
import { ProcessorRequestsListPage } from '../pages/processor/ProcessorRequestsListPage'
import { AvailableEquipmentPage } from '../pages/requester/AvailableEquipmentPage'
import { MyRequestsPage } from '../pages/requester/MyRequestsPage'
import { NewRequestPage } from '../pages/requester/NewRequestPage'
import { RequestDetailsPage } from '../pages/requester/RequestDetailsPage'
import { RequesterDashboardPage } from '../pages/requester/RequesterDashboardPage'
import { useAuth } from '../hooks/useAuth'
import { ProtectedRoute } from './ProtectedRoute'
import { getDefaultRouteForRole } from './routeConfig'

function LoginRoute() {
  const { isAuthenticated, isBootstrapping, user } = useAuth()

  if (isBootstrapping) {
    return <LoadingScreen />
  }

  if (isAuthenticated && user) {
    return <Navigate to={getDefaultRouteForRole(user.role)} replace />
  }

  return (
    <AuthLayout>
      <LoginPage />
    </AuthLayout>
  )
}

function DashboardIndexRoute() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={getDefaultRouteForRole(user.role)} replace />
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginRoute />} />

      <Route path="/dashboard" element={<ProtectedRoute />}>
        <Route index element={<DashboardIndexRoute />} />

        <Route element={<ProtectedRoute allowedRoles={['level_1']} />}>
          <Route path="requester" element={<RequesterLayout />}>
            <Route index element={<RequesterDashboardPage />} />
            <Route path="new-request" element={<NewRequestPage />} />
            <Route path="requests" element={<MyRequestsPage />} />
            <Route path="requests/:requestId" element={<RequestDetailsPage />} />
            <Route path="equipment" element={<AvailableEquipmentPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['level_2']} />}>
          <Route path="processor" element={<ProcessorLayout />}>
            <Route index element={<ProcessorDashboardPage />} />
            <Route
              path="all-requests"
              element={<ProcessorRequestsListPage mode="all" />}
            />
            <Route
              path="pending"
              element={<ProcessorRequestsListPage mode="pending" />}
            />
            <Route
              path="approved"
              element={<ProcessorRequestsListPage mode="approved" />}
            />
            <Route
              path="in-use"
              element={<ProcessorRequestsListPage mode="in_use" />}
            />
            <Route
              path="requests/:requestId/process"
              element={<ProcessRequestPage />}
            />
            <Route path="requests/:requestId/print" element={<PrintPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['level_3']} />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="users" element={<UsersManagementPage />} />
            <Route path="equipment" element={<EquipmentManagementPage />} />
            <Route path="categories" element={<CategoryManagementPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="logs" element={<LogsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
