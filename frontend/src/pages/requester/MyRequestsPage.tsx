import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { StatusBadge } from '../../components/dashboard/StatusBadge'
import { getMyRequests } from '../../services/mock/requesterService'
import type { RequestItem } from '../../types/requester'

export function MyRequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadRequests() {
      setIsLoading(true)
      setError('')

      try {
        setRequests(await getMyRequests())
      } catch {
        setError('Je aanvragen konden niet worden geladen.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadRequests()
  }, [])

  if (isLoading) {
    return <LoadingScreen message="Aanvragen worden geladen..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Mijn aanvragen"
        title="Alle ingediende en actieve aanvragen"
        description="Volg per aanvraag de status, planning en inhoud van je aangevraagde apparatuur."
      />

      {error ? (
        <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-6 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5">
        <div className="hidden grid-cols-[1.05fr_0.75fr_0.65fr_0.65fr_120px] gap-4 border-b border-white/10 px-5 py-4 text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase lg:grid">
          <span>Aanvraag</span>
          <span>Locatie</span>
          <span>Opnamedatum</span>
          <span>Status</span>
          <span>Actie</span>
        </div>

        <div className="divide-y divide-white/10">
          {requests.map((request) => (
            <div
              key={request.id}
              className="grid gap-4 px-5 py-5 lg:grid-cols-[1.05fr_0.75fr_0.65fr_0.65fr_120px] lg:items-center"
            >
              <div>
                <p className="text-xs tracking-[0.12em] text-slate-400 uppercase">{request.id}</p>
                <p className="mt-1 text-base font-semibold text-white">{request.title}</p>
                <p className="mt-2 text-sm text-slate-300">{request.purpose}</p>
              </div>
              <p className="text-sm text-slate-300">{request.location}</p>
              <p className="text-sm text-slate-300">{request.shootDate}</p>
              <div>
                <StatusBadge value={request.status} />
              </div>
              <div>
                <Link
                  to={`/dashboard/requester/requests/${request.id}`}
                  className="inline-flex rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
