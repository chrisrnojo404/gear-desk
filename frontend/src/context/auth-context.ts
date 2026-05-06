import { createContext } from 'react'
import type { LoginPayload, User, UserRole } from '../types/auth'

interface AuthContextValue {
  isAuthenticated: boolean
  isBootstrapping: boolean
  isLoggingIn: boolean
  token: string | null
  user: User | null
  login: (payload: LoginPayload) => Promise<User>
  logout: () => void
  hasRole: (roles: UserRole[]) => boolean
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
