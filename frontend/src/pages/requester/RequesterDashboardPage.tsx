import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { StatCard } from '../../components/dashboard/StatCard'
import { StatusBadge } from '../../components/dashboard/StatusBadge'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { getMyRequests, getRequesterOverview } from '../../services/mock/requesterService'
import type { RequestItem, RequesterOverview } from '../../types/requester'

function getUpcomingRequests(requests: RequestItem[]) {
  return [...requests]
    .sort((left, right) => {
      const leftDate = new Date(`${left.requestDate}T${left.startTime}`)
      const rightDate = new Date(`${right.requestDate}T${right.startTime}`)
      return leftDate.getTime() - rightDate.getTime()
    })
    .slice(0, 4)
}

function formatUpcomingDay(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('nl-NL', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  })
}

export function RequesterDashboardPage() {
  const [overview, setOverview] = useState<RequesterOverview | null>(null)
  const [requests, setRequests] = useState<RequestItem[]>([])
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
        setRequests(requestsResponse)
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

  const upcomingRequests = getUpcomingRequests(requests)

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

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">Upcoming schema</h2>
                <p className="mt-1 text-sm text-slate-400">Je eerstvolgende pickups en productiemomenten</p>
              </div>
              <Link
                to="/dashboard/requester/requests"
                className="text-sm font-medium text-slate-200 underline decoration-white/20 underline-offset-4"
              >
                Planning openen
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {upcomingRequests.map((request) => (
                <Link
                  key={request.id}
                  to={`/dashboard/requester/requests/${request.id}`}
                  className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-panel-800/70 p-4 transition hover:border-brand-400/40 sm:flex-row sm:items-center"
                >
                  <div className="flex h-16 min-w-16 flex-col items-center justify-center rounded-2xl bg-brand-500/15 text-brand-100">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-200/80">
                      {formatUpcomingDay(request.requestDate).split(' ')[0]}
                    </span>
                    <span className="mt-1 text-lg font-semibold">
                      {formatUpcomingDay(request.requestDate).split(' ').slice(1).join(' ')}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-white">{request.title}</p>
                        <p className="mt-1 text-sm text-slate-400">
                          {request.startTime} - {request.endTime} · {request.location}
                        </p>
                      </div>
                      <StatusBadge value={request.status} />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                        {request.activityType}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                        {request.requestedItems.length} items
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-[1.75rem] border border-slate-900/10 bg-sand-50 p-5 text-slate-900">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Snelle workflow</h2>
          </div>
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
