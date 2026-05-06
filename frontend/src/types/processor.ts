export type ProcessorRequestStatus = 'pending' | 'approved' | 'rejected' | 'in_use' | 'returned'
export type ProcessorPriority = 'low' | 'medium' | 'high'

export interface ProcessorTimelineEntry {
  id: string
  status: ProcessorRequestStatus
  label: string
  timestamp: string
  actor: string
  note?: string
}

export interface ProcessorRequest {
  id: string
  title: string
  requesterName: string
  department: string
  status: ProcessorRequestStatus
  priority: ProcessorPriority
  activityType: string
  requestDate: string
  startTime: string
  endTime: string
  returnDate: string
  location: string
  submittedAt: string
  requestedItems: string[]
  notes: string
  timeline: ProcessorTimelineEntry[]
}

export interface ProcessorOverview {
  totalRequests: number
  pendingRequests: number
  approvedRequests: number
  inUseRequests: number
  returnedRequests: number
}
