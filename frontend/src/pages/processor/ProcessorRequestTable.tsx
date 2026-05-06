import { Link } from 'react-router-dom'
import { StatusBadge } from '../../components/dashboard/StatusBadge'
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable'
import type { ProcessorRequest } from '../../types/processor'

const columns: DataTableColumn<ProcessorRequest>[] = [
  {
    key: 'id',
    header: 'ID',
    render: (request) => <p className="text-sm font-medium text-slate-300">{request.id}</p>,
  },
  {
    key: 'request',
    header: 'Aanvraag',
    render: (request) => (
      <div>
        <p className="text-base font-semibold text-white">{request.title}</p>
        <p className="mt-1 text-sm text-slate-400">{request.location}</p>
      </div>
    ),
  },
  {
    key: 'requester',
    header: 'Aanvrager',
    render: (request) => (
      <div>
        <p className="text-sm text-slate-200">{request.requesterName}</p>
        <p className="mt-1 text-sm text-slate-400">{request.department}</p>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (request) => <StatusBadge value={request.status} />,
  },
  {
    key: 'shootDate',
    header: 'Draaidag',
    render: (request) => <p className="text-sm text-slate-300">{request.shootDate}</p>,
  },
  {
    key: 'actions',
    header: 'Actie',
    render: (request) => (
      <div className="flex flex-wrap gap-2">
        <Link
          to={`/dashboard/processor/requests/${request.id}/process`}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
        >
          Verwerken
        </Link>
        <Link
          to={`/dashboard/processor/requests/${request.id}/print`}
          className="rounded-2xl bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-400"
        >
          Print
        </Link>
      </div>
    ),
  },
]

interface ProcessorRequestTableProps {
  requests: ProcessorRequest[]
}

export function ProcessorRequestTable({ requests }: ProcessorRequestTableProps) {
  return (
    <DataTable
      columns={columns}
      data={requests}
      getRowKey={(request) => request.id}
      emptyMessage="Er zijn geen aanvragen in deze lijst."
    />
  )
}
