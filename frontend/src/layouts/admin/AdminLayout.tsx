import { Boxes, ChartColumn, LayoutDashboard, Logs, Tags, Users } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { DashboardShell } from '../shared/DashboardShell'

const navigationItems = [
  { to: '/dashboard/admin', label: 'Admin dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/admin/users', label: 'Gebruikersbeheer', icon: Users },
  { to: '/dashboard/admin/equipment', label: 'Apparatuurbeheer', icon: Boxes },
  { to: '/dashboard/admin/categories', label: 'Categoriebeheer', icon: Tags },
  { to: '/dashboard/admin/reports', label: 'Rapporten', icon: ChartColumn },
  { to: '/dashboard/admin/logs', label: 'Logs', icon: Logs },
]

export function AdminLayout() {
  const { user, logout } = useAuth()

  if (!user) {
    return null
  }

  return (
    <DashboardShell
      user={user}
      navigationItems={navigationItems}
      topbarTitle="Admin control center"
      topbarSubtitle="Beheer gebruikers, assets, rapporten en auditinformatie vanuit een centrale TV-station console."
      footerLabel="Voor operations, inventory control en management-inzichten over de hele organisatie."
      onLogout={logout}
    >
      <Outlet />
    </DashboardShell>
  )
}
