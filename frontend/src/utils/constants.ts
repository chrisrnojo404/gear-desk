import type { UserRole } from '../types/auth'

export const STORAGE_KEYS = {
  auth: 'gear-desk-auth',
} as const

export const ROLE_LABELS: Record<UserRole, string> = {
  level_1: 'Level 1 - Aanvrager',
  level_2: 'Level 2 - Verwerker',
  level_3: 'Level 3 - Admin',
}
