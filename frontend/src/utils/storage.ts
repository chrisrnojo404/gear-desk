import type { AuthResponse } from '../types/auth'
import { STORAGE_KEYS } from './constants'

export function saveAuthSession(session: AuthResponse) {
  localStorage.setItem(STORAGE_KEYS.auth, JSON.stringify(session))
}

export function getStoredAuthSession() {
  const rawSession = localStorage.getItem(STORAGE_KEYS.auth)

  if (!rawSession) {
    return null
  }

  try {
    return JSON.parse(rawSession) as AuthResponse
  } catch {
    localStorage.removeItem(STORAGE_KEYS.auth)
    return null
  }
}

export function clearAuthSession() {
  localStorage.removeItem(STORAGE_KEYS.auth)
}
