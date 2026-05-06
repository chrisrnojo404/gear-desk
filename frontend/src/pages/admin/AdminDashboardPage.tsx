import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { StatCard } from '../../components/dashboard/StatCard'
import { getAdminLogs, getAdminOverview } from '../../services/mock/adminService'
import type { AdminLogEntry, AdminOverview } from '../../types/admin'

function severityClass(severity: AdminLogEntry['severity']) {
  switch (severity) {
    case 'critical':
      return 'border-rose-400/30 bg-rose-500/15 text-rose-100'
    case 'warning':
      return 'border-amber-400/30 bg-amber-500/15 text-amber-100'
    default:
      return 'border-sky-400/30 bg-sky-500/15 text-sky-100'
  }
}

export function AdminDashboardPage() {
  const [overview, setOverview] = useState<AdminOverview | null>(null)
  const [recentLogs, setRecentLogs] = useState<AdminLogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      setError('')

      try {
        const [overviewData, logsData] = await Promise.all([
          getAdminOverview(),
          getAdminLogs(),
        ])

        setOverview(overviewData)
        setRecentLogs(logsData.slice(0, 4))
      } catch {
        setError('Admin dashboard kon niet worden geladen.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadData()
  }, [])

  if (isLoading) {
    return <LoadingScreen message="Admin dashboard wordt geladen..." />
  }

  if (error || !overview) {
    return (
      <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-6 text-sm text-rose-100">
        {error || 'Er ging iets mis.'}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin dashboard"
        title="Beheer en controle in een oogopslag"
        description="Hou grip op gebruikers, apparatuurstatussen, categorieen en systeemactiviteit vanuit een centrale adminlaag."
        actions={
          <Link
            to="/dashboard/admin/reports"
            className="rounded-2xl bg-sand-50 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white"
          >
            Bekijk rapporten
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Gebruikers" value={overview.totalUsers} helper="Accounts in het platform" />
        <StatCard label="Actieve assets" value={overview.activeEquipment} helper="Niet in onderhoud" />
        <StatCard label="Categorieen" value={overview.categories} helper="Beheerde assetgroepen" />
        <StatCard label="Open incidenten" value={overview.openIncidents} helper="Warnings en critical logs" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">Recente systeemlogs</h2>
              <p className="mt-1 text-sm text-slate-400">Laatste acties en signalen in de omgeving</p>
            </div>
            <Link
              to="/dashboard/admin/logs"
              className="text-sm font-medium text-slate-200 underline decoration-white/20 underline-offset-4"
            >
              Alles bekijken
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {recentLogs.map((entry) => (
              <article
                key={entry.id}
                className="rounded-3xl border border-white/10 bg-panel-800/70 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{entry.id}</p>
                    <p className="mt-1 text-base font-semibold text-white">{entry.action}</p>
                  </div>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.14em] uppercase ${severityClass(entry.severity)}`}
                  >
                    {entry.severity}
                  </span>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                  <p>Actor: {entry.actor}</p>
                  <p>Target: {entry.target}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-900/10 bg-sand-50 p-5 text-slate-900">
          <h2 className="text-lg font-semibold">Admin focus</h2>
          <div className="mt-5 space-y-4">
            {[
              'Activeer of blokkeer gebruikers wanneer toegang aangepast moet worden.',
              'Controleer assets in onderhoud voordat ze opnieuw beschikbaar komen.',
              'Gebruik rapporten en logs voor operationele en auditmatige opvolging.',
            ].map((item, index) => (
              <div key={item} className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <p className="pt-1 text-sm leading-6 text-slate-600">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
