import {
  CheckCheck,
  ClipboardCheck,
  Clock3,
  LayoutDashboard,
  PackageSearch,
  RadioTower,
} from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { DashboardShell } from '../shared/DashboardShell'

const navigationItems = [
  { to: '/dashboard/processor', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/processor/all-requests', label: 'Alle aanvragen', icon: ClipboardCheck },
  { to: '/dashboard/processor/pending', label: 'Pending aanvragen', icon: Clock3 },
  { to: '/dashboard/processor/approved', label: 'Goedgekeurde aanvragen', icon: CheckCheck },
  { to: '/dashboard/processor/in-use', label: 'In gebruik aanvragen', icon: RadioTower },
  { to: '/dashboard/processor/equipment', label: 'Apparatuur overzicht', icon: PackageSearch },
]

export function ProcessorLayout() {
  const { user, logout } = useAuth()

  if (!user) {
    return null
  }

  return (
    <DashboardShell
      user={user}
      navigationItems={navigationItems}
      topbarTitle="Verwerkersdashboard"
      topbarSubtitle="Stuur de uitgifteflow aan, keur aanvragen goed en volg alles wat momenteel in gebruik is."
      footerLabel="Ontworpen voor materiaalbalie, planning en snelle operationele afhandeling."
      onLogout={logout}
    >
      <Outlet />
    </DashboardShell>
  )
}
