import type { EquipmentItem, RequestItem } from '../../types/requester'
import type { ProcessorRequestStatus } from '../../types/processor'
import type { AdminEquipmentItem } from '../../types/admin'

type BadgeVariant =
  | RequestItem['status']
  | EquipmentItem['condition']
  | ProcessorRequestStatus
  | AdminEquipmentItem['status']

const badgeMap: Record<BadgeVariant, string> = {
  approved: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-100',
  available: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-100',
  draft: 'border-slate-400/30 bg-slate-500/15 text-slate-200',
  in_review: 'border-amber-400/30 bg-amber-500/15 text-amber-100',
  in_use: 'border-violet-400/30 bg-violet-500/15 text-violet-100',
  pending: 'border-amber-400/30 bg-amber-500/15 text-amber-100',
  rejected: 'border-rose-400/30 bg-rose-500/15 text-rose-100',
  submitted: 'border-sky-400/30 bg-sky-500/15 text-sky-100',
  excellent: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-100',
  good: 'border-sky-400/30 bg-sky-500/15 text-sky-100',
  maintenance: 'border-amber-400/30 bg-amber-500/15 text-amber-100',
}

function formatLabel(value: BadgeVariant) {
  return value.replaceAll('_', ' ')
}

interface StatusBadgeProps {
  value: BadgeVariant
}

export function StatusBadge({ value }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.14em] uppercase ${badgeMap[value]}`}
    >
      {formatLabel(value)}
    </span>
  )
}
