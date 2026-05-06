import type { UserRole } from '../../types/auth'
import { ROLE_LABELS } from '../../utils/constants'

const roleClasses: Record<UserRole, string> = {
  level_1: 'border-sky-400/30 bg-brand-500/20 text-sky-100',
  level_2: 'border-orange-400/30 bg-orange-500/15 text-orange-100',
  level_3: 'border-violet-400/30 bg-violet-500/15 text-violet-100',
}

const lightRoleClasses: Record<UserRole, string> = {
  level_1: 'border-sky-300 bg-sky-100 text-sky-700',
  level_2: 'border-orange-300 bg-orange-100 text-orange-700',
  level_3: 'border-violet-300 bg-violet-100 text-violet-700',
}

interface RoleBadgeProps {
  role: UserRole
  variant?: 'dark' | 'light'
}

export function RoleBadge({ role, variant = 'dark' }: RoleBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase ${
        variant === 'light' ? lightRoleClasses[role] : roleClasses[role]
      }`}
    >
      {ROLE_LABELS[role]}
    </span>
  )
}
