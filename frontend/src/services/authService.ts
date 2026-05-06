import type { AuthResponse, LoginPayload } from '../types/auth'

const mockUsers: Record<string, AuthResponse> = {
  'aanvrager@geardesk.local': {
    token: 'mock-token-level-1',
    user: {
      id: 1,
      name: 'Naomi Kandhai',
      email: 'aanvrager@geardesk.local',
      role: 'level_1',
      department: 'Productie',
    },
  },
  'verwerker@geardesk.local': {
    token: 'mock-token-level-2',
    user: {
      id: 2,
      name: 'Rens Martina',
      email: 'verwerker@geardesk.local',
      role: 'level_2',
      department: 'Materiaalbalie',
    },
  },
  'admin@geardesk.local': {
    token: 'mock-token-level-3',
    user: {
      id: 3,
      name: 'Jade Linscheer',
      email: 'admin@geardesk.local',
      role: 'level_3',
      department: 'Operations',
    },
  },
}

export async function loginWithMockApi(payload: LoginPayload) {
  await new Promise((resolve) => {
    setTimeout(resolve, 950)
  })

  const normalizedEmail = payload.email.trim().toLowerCase()
  const matchedUser = mockUsers[normalizedEmail]

  if (!matchedUser || payload.password !== 'Welkom123!') {
    throw new Error('Ongeldige inloggegevens. Gebruik een demo account en het wachtwoord Welkom123!.')
  }

  return matchedUser
}
