import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { StatusBadge } from '../../components/dashboard/StatusBadge'
import { getRequestById } from '../../services/mock/requesterService'
import type { RequestItem } from '../../types/requester'

export function RequestDetailsPage() {
  const { requestId = '' } = useParams()
  const [request, setRequest] = useState<RequestItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadRequest() {
      setIsLoading(true)
      setError('')

      try {
        const response = await getRequestById(requestId)

        if (!response) {
          setError('Aanvraag niet gevonden.')
          return
        }

        setRequest(response)
      } catch {
        setError('Aanvraagdetails konden niet worden geladen.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadRequest()
  }, [requestId])

  if (isLoading) {
    return <LoadingScreen message="Aanvraagdetails worden geladen..." />
  }

  if (error || !request) {
    return (
      <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-6 text-sm text-rose-100">
        {error || 'Aanvraag niet beschikbaar.'}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={request.id}
        title={request.title}
        description="Bekijk alle details van deze aanvraag, inclusief planning, aangevraagde items en opmerkingen voor de verwerking."
        actions={
          <Link
            to="/dashboard/requester/requests"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Terug naar mijn aanvragen
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge value={request.status} />
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold tracking-[0.14em] text-slate-300 uppercase">
              Prioriteit {request.priority}
            </span>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-400">Activiteit type</p>
              <p className="mt-2 text-base text-white">{request.activityType}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Locatie</p>
              <p className="mt-2 text-base text-white">{request.location}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Ingediend op</p>
              <p className="mt-2 text-base text-white">
                {new Date(request.submittedAt).toLocaleDateString('nl-NL')}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Datum</p>
              <p className="mt-2 text-base text-white">{request.requestDate}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Tijdslot</p>
              <p className="mt-2 text-base text-white">
                {request.startTime} - {request.endTime}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Retourdatum</p>
              <p className="mt-2 text-base text-white">{request.returnDate}</p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm text-slate-400">Doel van de aanvraag</p>
            <p className="mt-2 text-sm leading-7 text-slate-200">{request.purpose}</p>
          </div>

          <div className="mt-8">
            <p className="text-sm text-slate-400">Notities</p>
            <p className="mt-2 text-sm leading-7 text-slate-200">{request.notes || 'Geen notities.'}</p>
          </div>
        </section>

        <aside className="rounded-[1.75rem] border border-slate-900/10 bg-sand-50 p-5 text-slate-900">
          <h2 className="text-lg font-semibold">Aangevraagde items</h2>
          <div className="mt-5 space-y-3">
            {request.requestedItems.map((item) => (
              <div key={item} className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                <p className="text-sm font-medium">{item}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold text-white">Status timeline</h2>
        <div className="mt-5 space-y-4">
          {request.timeline.map((entry) => (
            <div key={entry.id} className="flex gap-4">
              <div className="mt-1 h-3 w-3 rounded-full bg-brand-500" />
              <div>
                <p className="text-sm font-medium text-white">{entry.label}</p>
                <p className="mt-1 text-sm text-slate-400">
                  {new Date(entry.timestamp).toLocaleString('nl-NL')} · {entry.actor}
                </p>
                {entry.note ? <p className="mt-1 text-sm text-slate-300">{entry.note}</p> : null}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
