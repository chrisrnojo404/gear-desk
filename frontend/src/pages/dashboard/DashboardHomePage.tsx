import { RoleBadge } from '../../components/common/RoleBadge'
import { useAuth } from '../../hooks/useAuth'

export function DashboardHomePage() {
  const { user, logout } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="panel-glow rounded-[2rem] border border-white/10 bg-panel-900/85 p-6 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm tracking-[0.18em] text-slate-400 uppercase">Dashboard</p>
              <h1 className="mt-3 font-display text-3xl font-semibold text-white">
                Welkom terug, {user.name}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Deze placeholder-omgeving is alvast gekoppeld aan auth, role-based routing en mock
                sessiebeheer. Hiermee kunnen we de volgende dashboardpagina&apos;s veilig verder
                uitbouwen.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <RoleBadge role={user.role} />
              <button
                type="button"
                onClick={logout}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Uitloggen
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ['Actieve aanvragen', '12', '3 wachten op controle'],
              ['Beschikbare sets', '84', '16 gereserveerd voor komende producties'],
              ['Retourcontrole', '7', '2 items vereisen schade-inspectie'],
            ].map(([title, value, subtitle]) => (
              <article key={title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">{title}</p>
                <p className="mt-4 text-4xl font-semibold text-white">{value}</p>
                <p className="mt-2 text-sm text-slate-300">{subtitle}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
