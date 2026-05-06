import { useState, type PropsWithChildren } from 'react'
import type { User } from '../../types/auth'
import { AppSidebar, type SidebarNavItem } from '../../components/navigation/AppSidebar'
import { Topbar } from '../../components/navigation/Topbar'

interface DashboardShellProps {
  user: User
  navigationItems: SidebarNavItem[]
  topbarTitle: string
  topbarSubtitle: string
  footerLabel: string
  onLogout: () => void
}

export function DashboardShell({
  children,
  user,
  navigationItems,
  topbarTitle,
  topbarSubtitle,
  footerLabel,
  onLogout,
}: PropsWithChildren<DashboardShellProps>) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="panel-glow hidden rounded-[2rem] border border-white/10 bg-panel-900/90 p-5 backdrop-blur-xl lg:block">
          <AppSidebar
            user={user}
            navigationItems={navigationItems}
            footerLabel={footerLabel}
            onLogout={onLogout}
          />
        </aside>

        {mobileOpen ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-label="Sluit menu"
            />
            <aside className="panel-glow relative z-10 h-full w-[86%] max-w-sm border-r border-white/10 bg-panel-900/95 p-5">
              <AppSidebar
                user={user}
                navigationItems={navigationItems}
                footerLabel={footerLabel}
                onLogout={onLogout}
              />
            </aside>
          </div>
        ) : null}

        <main className="panel-glow rounded-[2rem] border border-white/10 bg-panel-900/85 p-5 backdrop-blur-xl sm:p-6 lg:p-8">
          <Topbar
            title={topbarTitle}
            subtitle={topbarSubtitle}
            onMenuClick={() => setMobileOpen(true)}
          />
          {children}
        </main>
      </div>
    </div>
  )
}
