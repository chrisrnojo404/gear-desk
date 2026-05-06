import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { StatusBadge } from '../../components/dashboard/StatusBadge'
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable'
import { getMyRequests } from '../../services/mock/requesterService'
import type { RequestItem } from '../../types/requester'

const columns: DataTableColumn<RequestItem>[] = [
  {
    key: 'request',
    header: 'Aanvraag',
    className: 'lg:col-span-2',
    render: (request) => (
      <div>
        <p className="text-xs tracking-[0.12em] text-slate-400 uppercase">{request.id}</p>
        <p className="mt-1 text-base font-semibold text-white">{request.title}</p>
        <p className="mt-2 text-sm text-slate-300">{request.purpose}</p>
      </div>
    ),
  },
  {
    key: 'location',
    header: 'Locatie',
    render: (request) => <p className="text-sm text-slate-300">{request.location}</p>,
  },
  {
    key: 'requestDate',
    header: 'Datum',
    render: (request) => <p className="text-sm text-slate-300">{request.requestDate}</p>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (request) => <StatusBadge value={request.status} />,
  },
  {
    key: 'action',
    header: 'Actie',
    render: (request) => (
      <Link
        to={`/dashboard/requester/requests/${request.id}`}
        className="inline-flex rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
      >
        Details
      </Link>
    ),
  },
]

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

      <DataTable
        columns={columns}
        data={requests}
        getRowKey={(request) => request.id}
        emptyMessage="Er zijn nog geen aanvragen beschikbaar."
      />
    </div>
  )
}
