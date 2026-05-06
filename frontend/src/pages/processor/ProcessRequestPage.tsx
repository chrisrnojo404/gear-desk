import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { StatusBadge } from '../../components/dashboard/StatusBadge'
import { Button } from '../../components/ui/Button'
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

  const handleStatusChange = async (nextStatus: ProcessorRequestStatus, note?: string) => {
    if (!request) {
      return
    }

    setIsUpdating(true)
    setError('')

    try {
      const updatedRequest = await updateProcessorRequestStatus(request.id, nextStatus, note)

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
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Terug
            </Button>
            <Link
              to={`/dashboard/processor/requests/${request.id}/print`}
              className="inline-flex items-center justify-center rounded-2xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-400"
            >
              Open printpagina
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <section className="card-surface p-5 sm:p-6">
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
          <section className="card-surface bg-panel-800/75 p-5 text-white">
            <h2 className="text-lg font-semibold">Aangevraagde items</h2>
            <div className="mt-5 space-y-3">
              {request.requestedItems.map((item) => (
                <div key={item} className="rounded-2xl bg-white/5 px-4 py-3 shadow-sm">
                  <p className="text-sm font-medium text-white">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="card-surface bg-panel-800/75 p-5">
            <h2 className="text-lg font-semibold text-white">Verwerkactie</h2>
            <div className="mt-5 grid gap-3">
              <Button
                disabled={isUpdating}
                onClick={() => handleStatusChange('approved')}
                className="bg-emerald-500 hover:bg-emerald-400"
              >
                Goedkeuren
              </Button>
              <Button
                disabled={isUpdating}
                onClick={() => handleStatusChange('in_use')}
                className="bg-orange-500 hover:bg-orange-400"
              >
                Markeer als in gebruik
              </Button>
              <Button
                variant="secondary"
                disabled={isUpdating}
                onClick={() => handleStatusChange('pending')}
              >
                Zet terug naar pending
              </Button>
              <Button
                variant="danger"
                disabled={isUpdating}
                onClick={() => handleStatusChange('rejected', 'Afgekeurd door verwerker')}
              >
                Afkeuren
              </Button>
              <Button
                disabled={isUpdating}
                onClick={() => handleStatusChange('returned', 'Retour volledig geregistreerd')}
                className="bg-lime-600 hover:bg-lime-500"
              >
                Retour registreren
              </Button>
            </div>
          </section>
        </aside>
      </div>

      <section className="card-surface p-5">
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
