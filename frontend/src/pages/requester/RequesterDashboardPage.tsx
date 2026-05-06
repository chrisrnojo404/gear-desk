import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { StatCard } from '../../components/dashboard/StatCard'
import { StatusBadge } from '../../components/dashboard/StatusBadge'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { getMyRequests, getRequesterOverview } from '../../services/mock/requesterService'
import type { RequestItem, RequesterOverview } from '../../types/requester'

export function RequesterDashboardPage() {
  const [overview, setOverview] = useState<RequesterOverview | null>(null)
  const [recentRequests, setRecentRequests] = useState<RequestItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      setError('')

      try {
        const [overviewResponse, requestsResponse] = await Promise.all([
          getRequesterOverview(),
          getMyRequests(),
        ])

        setOverview(overviewResponse)
        setRecentRequests(requestsResponse.slice(0, 3))
      } catch {
        setError('Dashboardgegevens konden niet worden geladen.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadData()
  }, [])

  if (isLoading) {
    return <LoadingScreen message="Aanvragersdashboard wordt geladen..." />
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
        eyebrow="Dashboard"
        title="Overzicht van je aanvragen"
        description="Bekijk je actuele aanvragen, aankomende pickups en beschikbare apparatuur voor nieuwe producties."
        actions={
          <Link
            to="/dashboard/requester/new-request"
            className="rounded-2xl bg-sand-50 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white"
          >
            Nieuwe aanvraag
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Actieve aanvragen"
          value={overview.activeRequests}
          helper="Alle lopende aanvragen in jouw wachtrij"
        />
        <StatCard
          label="Goedgekeurd"
          value={overview.approvedRequests}
          helper="Aanvragen die klaarstaan voor uitvoering"
        />
        <StatCard
          label="Beschikbare items"
          value={overview.availableItems}
          helper="Apparatuur direct inzetbaar volgens mock voorraad"
        />
        <StatCard
          label="Volgende pickup"
          value={overview.nextPickup}
          helper="Geplande afhaaltijd voor je eerstvolgende aanvraag"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">Recente aanvragen</h2>
              <p className="mt-1 text-sm text-slate-400">Snel overzicht van je laatste dossiers</p>
            </div>
            <Link
              to="/dashboard/requester/requests"
              className="text-sm font-medium text-slate-200 underline decoration-white/20 underline-offset-4"
            >
              Alles bekijken
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {recentRequests.map((request) => (
              <Link
                key={request.id}
                to={`/dashboard/requester/requests/${request.id}`}
                className="block rounded-3xl border border-white/10 bg-panel-800/70 p-4 transition hover:border-brand-400/40"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{request.id}</p>
                    <p className="mt-1 text-base font-semibold text-white">{request.title}</p>
                  </div>
                  <StatusBadge value={request.status} />
                </div>
                <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
                  <p>Opname: {request.shootDate}</p>
                  <p>Locatie: {request.location}</p>
                  <p>Prioriteit: {request.priority}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-900/10 bg-sand-50 p-5 text-slate-900">
          <h2 className="text-lg font-semibold">Snelle workflow</h2>
          <div className="mt-5 space-y-4">
            {[
              'Start een nieuwe aanvraag voor een aankomende productie.',
              'Controleer welke apparatuur direct beschikbaar is.',
              'Open een aanvraagdetail om status, items en notities te volgen.',
            ].map((step, index) => (
              <div key={step} className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <p className="pt-1 text-sm leading-6 text-slate-600">{step}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
