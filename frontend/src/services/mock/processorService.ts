import type {
  ProcessorOverview,
  ProcessorRequest,
  ProcessorRequestStatus,
} from '../../types/processor'

let processorRequests: ProcessorRequest[] = [
  {
    id: 'REQ-2004',
    title: 'Buitendraai nieuwsreportage',
    requesterName: 'Naomi Kandhai',
    department: 'Nieuws',
    status: 'pending',
    priority: 'high',
    shootDate: '2026-05-07',
    returnDate: '2026-05-07',
    location: 'Waterkant',
    submittedAt: '2026-05-05T10:15:00Z',
    requestedItems: ['Sony FX3', 'Wireless lav set', 'Tripod kit'],
    notes: 'Reporter vertrekt om 08:00, pickup liefst 07:15.',
  },
  {
    id: 'REQ-2001',
    title: 'Studio panelgesprek met drie camera’s',
    requesterName: 'Ruben Tjin',
    department: 'Productie',
    status: 'approved',
    priority: 'medium',
    shootDate: '2026-05-08',
    returnDate: '2026-05-08',
    location: 'Studio B',
    submittedAt: '2026-05-04T08:45:00Z',
    requestedItems: ['Canon C70', 'Aputure 300D', 'Audio mixer'],
    notes: 'Set mag de avond ervoor klaargezet worden.',
  },
  {
    id: 'REQ-1998',
    title: 'Podcast opname met audio corner',
    requesterName: 'Luciana Vrede',
    department: 'Digital',
    status: 'in_use',
    priority: 'low',
    shootDate: '2026-05-06',
    returnDate: '2026-05-06',
    location: 'Podcast studio',
    submittedAt: '2026-05-03T15:20:00Z',
    requestedItems: ['Shure SM7B', 'Zoom PodTrak P4', 'Softbox set'],
    notes: 'Retour verwacht eind van de middag.',
  },
  {
    id: 'REQ-1994',
    title: 'Concertregistratie avondshift',
    requesterName: 'Alysha Kanhai',
    department: 'Events',
    status: 'pending',
    priority: 'high',
    shootDate: '2026-05-09',
    returnDate: '2026-05-10',
    location: 'Amfitheater',
    submittedAt: '2026-05-02T11:05:00Z',
    requestedItems: ['Sony FX6', 'Field recorder', 'Battery kit'],
    notes: 'Extra regenbescherming gewenst.',
  },
]

function delay(ms = 450) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function getProcessorOverview(): Promise<ProcessorOverview> {
  await delay()

  return {
    totalRequests: processorRequests.length,
    pendingRequests: processorRequests.filter((request) => request.status === 'pending').length,
    approvedRequests: processorRequests.filter((request) => request.status === 'approved').length,
    inUseRequests: processorRequests.filter((request) => request.status === 'in_use').length,
  }
}

export async function getAllProcessorRequests(): Promise<ProcessorRequest[]> {
  await delay()
  return [...processorRequests]
}

export async function getProcessorRequestsByStatus(status: ProcessorRequestStatus) {
  await delay()
  return processorRequests.filter((request) => request.status === status)
}

export async function getProcessorRequestById(id: string) {
  await delay(300)
  return processorRequests.find((request) => request.id === id) ?? null
}

export async function updateProcessorRequestStatus(
  id: string,
  status: ProcessorRequestStatus,
) {
  await delay(400)

  processorRequests = processorRequests.map((request) =>
    request.id === id ? { ...request, status } : request,
  )

  return processorRequests.find((request) => request.id === id) ?? null
}
