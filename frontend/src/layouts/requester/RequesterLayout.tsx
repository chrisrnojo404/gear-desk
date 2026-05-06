import { NavLink, Outlet } from 'react-router-dom'
import { LogoMark } from '../../components/common/LogoMark'
import { RoleBadge } from '../../components/common/RoleBadge'
import { useAuth } from '../../hooks/useAuth'

const navigationItems = [
  { to: '/dashboard/requester', label: 'Dashboard', end: true },
  { to: '/dashboard/requester/new-request', label: 'Nieuwe aanvraag' },
  { to: '/dashboard/requester/requests', label: 'Mijn aanvragen' },
  { to: '/dashboard/requester/equipment', label: 'Beschikbare apparatuur' },
]

export function RequesterLayout() {
  const { user, logout } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="panel-glow rounded-[2rem] border border-white/10 bg-panel-900/85 p-5 backdrop-blur-xl">
          <LogoMark />

          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="mt-1 text-sm text-slate-400">{user.department}</p>
            <div className="mt-4">
              <RoleBadge role={user.role} />
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-950/30'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            onClick={logout}
            className="mt-8 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Uitloggen
          </button>
        </aside>

        <main className="panel-glow rounded-[2rem] border border-white/10 bg-panel-900/85 p-5 backdrop-blur-xl sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-3 rounded-[1.75rem] border border-white/10 bg-white/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs tracking-[0.18em] text-slate-400 uppercase">Level 1 omgeving</p>
              <p className="mt-1 text-sm text-slate-300">
                Vraag apparatuur aan, volg statusupdates en bekijk beschikbaarheid.
              </p>
            </div>
            <div className="rounded-full bg-sand-50 px-4 py-2 text-sm font-medium text-slate-900">
              Ingelogd als aanvrager
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  )
}
