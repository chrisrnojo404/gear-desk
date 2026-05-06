export type UserRole = 'level_1' | 'level_2' | 'level_3'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  department: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}
