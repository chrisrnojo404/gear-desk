import type { UserRole } from '../../types/auth'
import { ROLE_LABELS } from '../../utils/constants'

const roleClasses: Record<UserRole, string> = {
  level_1: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-200',
  level_2: 'border-amber-400/30 bg-amber-500/15 text-amber-100',
  level_3: 'border-sky-400/30 bg-brand-500/20 text-sky-100',
}

interface RoleBadgeProps {
  role: UserRole
}

export function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase ${roleClasses[role]}`}
    >
      {ROLE_LABELS[role]}
    </span>
  )
}
