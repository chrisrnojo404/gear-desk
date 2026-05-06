export type RequestStatus = 'draft' | 'submitted' | 'approved' | 'in_review' | 'rejected'
export type RequestPriority = 'low' | 'medium' | 'high'
export type EquipmentCategory = 'camera' | 'audio' | 'lighting' | 'accessories'

export interface RequestItem {
  id: string
  title: string
  status: RequestStatus
  priority: RequestPriority
  shootDate: string
  returnDate: string
  location: string
  purpose: string
  submittedAt: string
  requestedItems: string[]
  notes: string
}

export interface EquipmentItem {
  id: string
  name: string
  category: EquipmentCategory
  quantityAvailable: number
  status: 'available' | 'reserved' | 'in_use' | 'defect'
  location: string
}

export interface RequesterOverview {
  activeRequests: number
  approvedRequests: number
  availableItems: number
  nextPickup: string
}

export interface NewRequestFormValues {
  title: string
  purpose: string
  location: string
  shootDate: string
  returnDate: string
  priority: RequestPriority
  requestedItems: string
  notes: string
}
