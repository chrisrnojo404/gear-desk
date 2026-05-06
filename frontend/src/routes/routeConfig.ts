import type { UserRole } from '../types/auth'

export function getDefaultRouteForRole(role: UserRole) {
  switch (role) {
    case 'level_1':
      return '/dashboard/requester'
    case 'level_2':
      return '/dashboard/processor'
    case 'level_3':
      return '/dashboard/admin'
    default:
      return '/login'
  }
}
