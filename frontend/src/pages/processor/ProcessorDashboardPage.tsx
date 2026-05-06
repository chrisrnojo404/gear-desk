import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { StatCard } from '../../components/dashboard/StatCard'
import { StatusBadge } from '../../components/dashboard/StatusBadge'
import { getAllProcessorRequests, getProcessorOverview } from '../../services/mock/processorService'
import type { ProcessorOverview, ProcessorRequest } from '../../types/processor'

function getUpcomingRequests(requests: ProcessorRequest[]) {
  return [...requests]
    .filter((request) => request.status === 'approved')
    .sort((left, right) => {
      const leftDate = new Date(`${left.requestDate}T${left.startTime}`)
      const rightDate = new Date(`${right.requestDate}T${right.startTime}`)
      return leftDate.getTime() - rightDate.getTime()
    })
    .slice(0, 4)
}

function getInUseRequests(requests: ProcessorRequest[]) {
  return [...requests]
    .filter((request) => request.status === 'in_use')
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

export function ProcessorDashboardPage() {
  const [overview, setOverview] = useState<ProcessorOverview | null>(null)
  const [requests, setRequests] = useState<ProcessorRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      setError('')

      try {
        const [overviewData, requestsData] = await Promise.all([
          getProcessorOverview(),
          getAllProcessorRequests(),
        ])

        setOverview(overviewData)
        setRequests(requestsData)
      } catch {
        setError('Verwerkersdashboard kon niet worden geladen.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadData()
  }, [])

  if (isLoading) {
    return <LoadingScreen message="Verwerkersdashboard wordt geladen..." />
  }

  if (!overview || error) {
    return (
      <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-6 text-sm text-rose-100">
        {error || 'Er ging iets mis.'}
      </div>
    )
  }

  const queue = requests.filter((request) => request.status === 'pending').slice(0, 4)
  const inUseRequests = getInUseRequests(requests)
  const upcomingRequests = getUpcomingRequests(requests)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title="Verwerkingsqueue en voortgang"
        description="Houd overzicht op alle binnenkomende aanvragen, goedgekeurde sets en apparatuur die momenteel in gebruik is."
        actions={
          <Link
            to="/dashboard/processor/pending"
            className="rounded-2xl bg-sand-50 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white"
          >
            Open pending queue
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Alle aanvragen" value={overview.totalRequests} helper="Complete Level 2 werklijst" />
        <StatCard label="Pending" value={overview.pendingRequests} helper="Wachten op beoordeling of voorbereiding" />
        <StatCard label="Goedgekeurd" value={overview.approvedRequests} helper="Klaar voor uitgifte of pick-up" />
        <StatCard label="In gebruik" value={overview.inUseRequests} helper="Momenteel buiten het magazijn" />
        <StatCard label="Retour" value={overview.returnedRequests} helper="Afgerond en retour geboekt" />
      </div>

      <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Upcoming schema</h2>
            <p className="mt-1 text-sm text-slate-400">Links zie je sets die al in gebruik zijn, rechts wat als volgende klaarstaat.</p>
          </div>
          <Link
            to="/dashboard/processor/in-use"
            className="text-sm font-medium text-slate-200 underline decoration-white/20 underline-offset-4"
          >
            Overzicht openen
          </Link>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-panel-900/55 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-white">Nu in gebruik</h3>
                <p className="mt-1 text-sm text-slate-400">Uitgegeven sets die momenteel buiten het magazijn zijn</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {inUseRequests.map((request) => (
                <Link
                  key={request.id}
                  to={`/dashboard/processor/process/${request.id}`}
                  className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-panel-800/70 p-4 transition hover:border-brand-400/40 sm:flex-row sm:items-center"
                >
                  <div className="flex h-16 min-w-16 flex-col items-center justify-center rounded-2xl bg-amber-500/15 text-amber-100">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-200/80">
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
                        {request.requesterName}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                        {request.activityType}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {inUseRequests.length === 0 ? (
              <div className="mt-4 rounded-3xl border border-dashed border-white/10 bg-panel-800/50 p-5 text-sm text-slate-400">
                Er zijn momenteel geen sets die als in gebruik gemarkeerd staan.
              </div>
            ) : null}
          </div>

          <div className="rounded-3xl border border-white/10 bg-panel-900/55 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-white">Upcoming</h3>
                <p className="mt-1 text-sm text-slate-400">Goedgekeurde aanvragen die klaarstaan voor uitgifte of voorbereiding</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {upcomingRequests.map((request) => (
                <Link
                  key={request.id}
                  to={`/dashboard/processor/process/${request.id}`}
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
                        {request.requesterName}
                      </span>
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

            {upcomingRequests.length === 0 ? (
              <div className="mt-4 rounded-3xl border border-dashed border-white/10 bg-panel-800/50 p-5 text-sm text-slate-400">
                Er zijn momenteel geen goedgekeurde aanvragen in de aankomende planning.
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">Nieuwe aanvragen</h2>
                <p className="mt-1 text-sm text-slate-400">Binnengekomen aanvragen die nog op pending staan</p>
              </div>
              <Link
                to="/dashboard/processor/all-requests"
                className="text-sm font-medium text-slate-200 underline decoration-white/20 underline-offset-4"
              >
                Alles bekijken
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {queue.map((request) => (
                <div
                  key={request.id}
                  className="rounded-3xl border border-white/10 bg-panel-800/70 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-slate-400">{request.id}</p>
                      <p className="mt-1 text-base font-semibold text-white">{request.title}</p>
                    </div>
                    <StatusBadge value={request.status} />
                  </div>
                  <div className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-3">
                    <p>Aanvrager: {request.requesterName}</p>
                    <p>Locatie: {request.location}</p>
                    <p>Datum: {request.requestDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-[1.75rem] border border-slate-900/10 bg-sand-50 p-5 text-slate-900">
          <h2 className="text-lg font-semibold">Verwerkstappen</h2>
          <div className="mt-5 space-y-4">
            {[
              'Controleer planning, locatie en gevraagde items.',
              'Keur de aanvraag goed of zet direct door naar in gebruik.',
              'Open de printpagina voor uitgifte of fysieke afhandeling.',
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
