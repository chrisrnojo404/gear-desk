import type {
  EquipmentItem,
  NewRequestFormValues,
  RequestItem,
  RequesterOverview,
} from '../../types/requester'

const requests: RequestItem[] = [
  {
    id: 'REQ-1042',
    title: 'Studio interview set voor ochtendprogramma',
    status: 'approved',
    priority: 'high',
    shootDate: '2026-05-08',
    returnDate: '2026-05-08',
    location: 'Studio A',
    purpose: 'Interviewopname met twee camera’s en basisverlichting.',
    submittedAt: '2026-05-04T09:30:00Z',
    requestedItems: ['Sony FX3', 'Rode Wireless GO II', 'Aputure 300D'],
    notes: 'Pickup gewenst voor 07:30.',
  },
  {
    id: 'REQ-1038',
    title: 'Mobiele reportage set voor buitendraai',
    status: 'in_review',
    priority: 'medium',
    shootDate: '2026-05-10',
    returnDate: '2026-05-10',
    location: 'Binnenstad',
    purpose: 'Compacte ENG-set voor mobiele nieuwsinzet.',
    submittedAt: '2026-05-03T13:15:00Z',
    requestedItems: ['Canon C70', 'Sennheiser MKE 600', 'Tripod kit'],
    notes: 'Liefst extra accu’s meenemen.',
  },
  {
    id: 'REQ-1026',
    title: 'Podcast corner met audio en key light',
    status: 'submitted',
    priority: 'low',
    shootDate: '2026-05-12',
    returnDate: '2026-05-12',
    location: 'Redactiehoek',
    purpose: 'Twee microfoons en zachte belichting voor podcastopname.',
    submittedAt: '2026-05-02T08:05:00Z',
    requestedItems: ['Shure SM7B', 'Zoom PodTrak P4', 'Softbox set'],
    notes: 'Opbouw kan een uur voor aanvang starten.',
  },
]

const equipment: EquipmentItem[] = [
  {
    id: 'EQ-001',
    name: 'Sony FX3',
    category: 'camera',
    quantityAvailable: 4,
    status: 'available',
    location: 'Magazijn 1',
  },
  {
    id: 'EQ-002',
    name: 'Canon C70',
    category: 'camera',
    quantityAvailable: 2,
    status: 'reserved',
    location: 'Magazijn 1',
  },
  {
    id: 'EQ-009',
    name: 'Rode Wireless GO II',
    category: 'audio',
    quantityAvailable: 6,
    status: 'available',
    location: 'Audio kast',
  },
  {
    id: 'EQ-015',
    name: 'Aputure 300D',
    category: 'lighting',
    quantityAvailable: 3,
    status: 'in_use',
    location: 'Lichtopslag',
  },
  {
    id: 'EQ-021',
    name: 'Tripod kit',
    category: 'accessories',
    quantityAvailable: 5,
    status: 'defect',
    location: 'Accessoirewand',
  },
]

function delay(ms = 500) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function getRequesterOverview(): Promise<RequesterOverview> {
  await delay()

  return {
    activeRequests: requests.length,
    approvedRequests: requests.filter((request) => request.status === 'approved').length,
    availableItems: equipment.reduce((total, item) => total + item.quantityAvailable, 0),
    nextPickup: '8 mei om 07:30',
  }
}

export async function getMyRequests(): Promise<RequestItem[]> {
  await delay()
  return [...requests]
}

export async function getRequestById(id: string): Promise<RequestItem | null> {
  await delay(350)
  return requests.find((request) => request.id === id) ?? null
}

export async function getAvailableEquipment(): Promise<EquipmentItem[]> {
  await delay()
  return [...equipment]
}

export async function createRequest(values: NewRequestFormValues): Promise<RequestItem> {
  await delay(900)

  const createdRequest: RequestItem = {
    id: `REQ-${Math.floor(1100 + Math.random() * 200)}`,
    title: values.title,
    status: 'submitted',
    priority: values.priority,
    shootDate: values.shootDate,
    returnDate: values.returnDate,
    location: values.location,
    purpose: values.purpose,
    submittedAt: new Date().toISOString(),
    requestedItems: values.requestedItems
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    notes: values.notes,
  }

  requests.unshift(createdRequest)
  return createdRequest
}
