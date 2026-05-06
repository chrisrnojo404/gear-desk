import { Link } from 'react-router-dom'
import { StatusBadge } from '../../components/dashboard/StatusBadge'
import type { ProcessorRequest } from '../../types/processor'

interface ProcessorRequestTableProps {
  requests: ProcessorRequest[]
}

export function ProcessorRequestTable({ requests }: ProcessorRequestTableProps) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5">
      <div className="hidden grid-cols-[0.8fr_1.1fr_0.8fr_0.65fr_0.7fr_150px] gap-4 border-b border-white/10 px-5 py-4 text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase lg:grid">
        <span>ID</span>
        <span>Aanvraag</span>
        <span>Aanvrager</span>
        <span>Status</span>
        <span>Draaidag</span>
        <span>Actie</span>
      </div>

      <div className="divide-y divide-white/10">
        {requests.map((request) => (
          <div
            key={request.id}
            className="grid gap-4 px-5 py-5 lg:grid-cols-[0.8fr_1.1fr_0.8fr_0.65fr_0.7fr_150px] lg:items-center"
          >
            <p className="text-sm font-medium text-slate-300">{request.id}</p>
            <div>
              <p className="text-base font-semibold text-white">{request.title}</p>
              <p className="mt-1 text-sm text-slate-400">{request.location}</p>
            </div>
            <div>
              <p className="text-sm text-slate-200">{request.requesterName}</p>
              <p className="mt-1 text-sm text-slate-400">{request.department}</p>
            </div>
            <div>
              <StatusBadge value={request.status} />
            </div>
            <p className="text-sm text-slate-300">{request.shootDate}</p>
            <div className="flex flex-wrap gap-2">
              <Link
                to={`/dashboard/processor/requests/${request.id}/process`}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Verwerken
              </Link>
              <Link
                to={`/dashboard/processor/requests/${request.id}/print`}
                className="rounded-2xl bg-sand-50 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-white"
              >
                Print
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
