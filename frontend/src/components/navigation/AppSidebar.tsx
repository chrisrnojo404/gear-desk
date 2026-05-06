import type { LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { LogoMark } from '../common/LogoMark'
import { RoleBadge } from '../common/RoleBadge'
import { Button } from '../ui/Button'
import { cn } from '../../utils/cn'
import type { User } from '../../types/auth'

export interface SidebarNavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

interface AppSidebarProps {
  navigationItems: SidebarNavItem[]
  user: User
  footerLabel: string
  onLogout: () => void
}

export function AppSidebar({
  navigationItems,
  user,
  footerLabel,
  onLogout,
}: AppSidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <LogoMark />

      <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-medium text-white">{user.name}</p>
        <p className="mt-1 text-sm text-slate-400">{user.department}</p>
        <div className="mt-4">
          <RoleBadge role={user.role} />
        </div>
      </div>

      <nav className="mt-8 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                  isActive
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-950/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white',
                )
              }
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-auto rounded-[1.5rem] border border-white/10 bg-linear-to-br from-brand-500/15 to-white/5 p-4">
        <p className="text-xs tracking-[0.18em] text-brand-100 uppercase">Control Layer</p>
        <p className="mt-2 text-sm leading-6 text-slate-300">{footerLabel}</p>
      </div>

      <Button variant="secondary" fullWidth className="mt-4" onClick={onLogout}>
        <LogOut className="h-4 w-4" />
        Uitloggen
      </Button>
    </div>
  )
}
