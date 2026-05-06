import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { getProcessorRequestById } from '../../services/mock/processorService'
import type { ProcessorRequest } from '../../types/processor'

export function PrintPage() {
  const { requestId = '' } = useParams()
  const [request, setRequest] = useState<ProcessorRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadRequest() {
      setIsLoading(true)
      setError('')

      try {
        const data = await getProcessorRequestById(requestId)

        if (!data) {
          setError('Printgegevens niet gevonden.')
          return
        }

        setRequest(data)
      } catch {
        setError('Printpagina kon niet worden geladen.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadRequest()
  }, [requestId])

  if (isLoading) {
    return <LoadingScreen message="Printpagina wordt voorbereid..." />
  }

  if (error || !request) {
    return (
      <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-6 text-sm text-rose-100">
        {error || 'Printpagina niet beschikbaar.'}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm tracking-[0.18em] text-slate-400 uppercase">Printpagina</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-white">
            Uitgifteformulier {request.id}
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-2xl bg-sand-50 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white"
          >
            Print
          </button>
          <Link
            to={`/dashboard/processor/requests/${request.id}/process`}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Terug naar verwerking
          </Link>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-900/10 bg-sand-50 p-6 text-slate-900 sm:p-8">
        <div className="flex flex-col gap-6 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold">Gear Desk uitgifteformulier</h2>
            <p className="mt-2 text-sm text-slate-500">
              Te gebruiken bij uitgifte, controle en handmatige paraaf.
            </p>
          </div>
          <div className="text-sm text-slate-500">
            <p>ID: {request.id}</p>
            <p>Datum: {request.requestDate}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Aanvrager</p>
            <p className="mt-2 text-base font-medium">{request.requesterName}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Afdeling</p>
            <p className="mt-2 text-base font-medium">{request.department}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Locatie</p>
            <p className="mt-2 text-base font-medium">{request.location}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Tijdslot</p>
            <p className="mt-2 text-base font-medium">
              {request.startTime} - {request.endTime}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Retourdatum</p>
            <p className="mt-2 text-base font-medium">{request.returnDate}</p>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm text-slate-500">Aangevraagde items</p>
          <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white">
            {request.requestedItems.map((item, index) => (
              <div
                key={item}
                className={`grid grid-cols-[1fr_140px_140px] gap-4 px-4 py-4 text-sm ${
                  index !== request.requestedItems.length - 1 ? 'border-b border-slate-200' : ''
                }`}
              >
                <span>{item}</span>
                <span className="text-slate-400">Uitgegeven: ____</span>
                <span className="text-slate-400">Retour: ____</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Notities</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">{request.notes}</p>
          </div>
          <div className="space-y-5">
            <div className="rounded-3xl border border-dashed border-slate-300 p-4">
              <p className="text-sm text-slate-500">Paraaf uitgifte</p>
              <div className="mt-8 border-b border-slate-300" />
            </div>
            <div className="rounded-3xl border border-dashed border-slate-300 p-4">
              <p className="text-sm text-slate-500">Paraaf retourcontrole</p>
              <div className="mt-8 border-b border-slate-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
