import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { StatusBadge } from '../../components/dashboard/StatusBadge'
import {
  getProcessorRequestById,
  updateProcessorRequestStatus,
} from '../../services/mock/processorService'
import type { ProcessorRequest, ProcessorRequestStatus } from '../../types/processor'

export function ProcessRequestPage() {
  const navigate = useNavigate()
  const { requestId = '' } = useParams()
  const [request, setRequest] = useState<ProcessorRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadRequest() {
      setIsLoading(true)
      setError('')

      try {
        const data = await getProcessorRequestById(requestId)

        if (!data) {
          setError('Aanvraag niet gevonden.')
          return
        }

        setRequest(data)
      } catch {
        setError('Aanvraag kon niet worden geladen.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadRequest()
  }, [requestId])

  const handleStatusChange = async (nextStatus: ProcessorRequestStatus) => {
    if (!request) {
      return
    }

    setIsUpdating(true)
    setError('')

    try {
      const updatedRequest = await updateProcessorRequestStatus(request.id, nextStatus)

      if (!updatedRequest) {
        setError('De aanvraag kon niet worden bijgewerkt.')
        return
      }

      setRequest(updatedRequest)
    } catch {
      setError('De status kon niet worden aangepast.')
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return <LoadingScreen message="Aanvraag wordt geladen..." />
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
        eyebrow="Aanvraag verwerken"
        title={`${request.id} · ${request.title}`}
        description="Controleer aanvraaginhoud, zet de status door en open desgewenst direct de printpagina."
        actions={
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Terug
            </button>
            <Link
              to={`/dashboard/processor/requests/${request.id}/print`}
              className="rounded-2xl bg-sand-50 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white"
            >
              Open printpagina
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge value={request.status} />
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold tracking-[0.14em] text-slate-300 uppercase">
              Prioriteit {request.priority}
            </span>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-400">Aanvrager</p>
              <p className="mt-2 text-base text-white">{request.requesterName}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Afdeling</p>
              <p className="mt-2 text-base text-white">{request.department}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Locatie</p>
              <p className="mt-2 text-base text-white">{request.location}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Draaidag</p>
              <p className="mt-2 text-base text-white">{request.shootDate}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Retourdatum</p>
              <p className="mt-2 text-base text-white">{request.returnDate}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Ingediend op</p>
              <p className="mt-2 text-base text-white">
                {new Date(request.submittedAt).toLocaleDateString('nl-NL')}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm text-slate-400">Notities</p>
            <p className="mt-2 text-sm leading-7 text-slate-200">{request.notes}</p>
          </div>

          {error ? (
            <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          ) : null}
        </section>

        <aside className="space-y-6">
          <section className="rounded-[1.75rem] border border-slate-900/10 bg-sand-50 p-5 text-slate-900">
            <h2 className="text-lg font-semibold">Aangevraagde items</h2>
            <div className="mt-5 space-y-3">
              {request.requestedItems.map((item) => (
                <div key={item} className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <p className="text-sm font-medium">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-white/10 bg-panel-800/75 p-5">
            <h2 className="text-lg font-semibold text-white">Verwerkactie</h2>
            <div className="mt-5 grid gap-3">
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleStatusChange('approved')}
                className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Goedkeuren
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleStatusChange('in_use')}
                className="rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Markeer als in gebruik
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleStatusChange('pending')}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Zet terug naar pending
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
