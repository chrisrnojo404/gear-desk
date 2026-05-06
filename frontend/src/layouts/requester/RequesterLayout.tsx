import { Boxes, ClipboardList, LayoutDashboard, PlusCircle } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { DashboardShell } from '../shared/DashboardShell'

const navigationItems = [
  { to: '/dashboard/requester', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/requester/new-request', label: 'Nieuwe aanvraag', icon: PlusCircle },
  { to: '/dashboard/requester/requests', label: 'Mijn aanvragen', icon: ClipboardList },
  { to: '/dashboard/requester/equipment', label: 'Beschikbare apparatuur', icon: Boxes },
]

export function RequesterLayout() {
  const { user, logout } = useAuth()

  if (!user) {
    return null
  }

  return (
    <DashboardShell
      user={user}
      navigationItems={navigationItems}
      topbarTitle="Aanvragersdashboard"
      topbarSubtitle="Start nieuwe aanvragen, controleer beschikbaarheid en volg de status van producties."
      footerLabel="Voor redacties, producers en crews die snel grip willen op hun gear-aanvragen."
      onLogout={logout}
    >
      <Outlet />
    </DashboardShell>
  )
}
