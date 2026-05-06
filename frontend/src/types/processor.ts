export type ProcessorRequestStatus = 'pending' | 'approved' | 'in_use'
export type ProcessorPriority = 'low' | 'medium' | 'high'

export interface ProcessorRequest {
  id: string
  title: string
  requesterName: string
  department: string
  status: ProcessorRequestStatus
  priority: ProcessorPriority
  shootDate: string
  returnDate: string
  location: string
  submittedAt: string
  requestedItems: string[]
  notes: string
}

export interface ProcessorOverview {
  totalRequests: number
  pendingRequests: number
  approvedRequests: number
  inUseRequests: number
}
