import { useState, type PropsWithChildren } from 'react'
import { AuthContext } from './auth-context'
import { loginWithMockApi } from '../services/authService'
import type { LoginPayload, User } from '../types/auth'
import { clearAuthSession, getStoredAuthSession, saveAuthSession } from '../utils/storage'

const initialSession = getStoredAuthSession()

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(initialSession?.user ?? null)
  const [token, setToken] = useState<string | null>(initialSession?.token ?? null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const login = async (payload: LoginPayload) => {
    setIsLoggingIn(true)

    try {
      const session = await loginWithMockApi(payload)
      saveAuthSession(session)
      setUser(session.user)
      setToken(session.token)
      return session.user
    } finally {
      setIsLoggingIn(false)
    }
  }

  const logout = () => {
    clearAuthSession()
    setUser(null)
    setToken(null)
  }

  const hasRole = (roles: User['role'][]) => {
    if (!user) {
      return false
    }

    return roles.includes(user.role)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(user && token),
        isBootstrapping: false,
        isLoggingIn,
        token,
        user,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
