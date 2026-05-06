export type RequestStatus =
  | 'draft'
  | 'submitted'
  | 'approved'
  | 'in_review'
  | 'rejected'
  | 'in_use'
  | 'returned'
export type RequestPriority = 'low' | 'medium' | 'high'
export type EquipmentCategory = 'camera' | 'audio' | 'lighting' | 'accessories'
export type ActivityType = 'studio' | 'reportage' | 'podcast' | 'event' | 'livestream'

export interface StatusTimelineEntry {
  id: string
  status: RequestStatus
  label: string
  timestamp: string
  actor: string
  note?: string
}

export interface RequestItem {
  id: string
  title: string
  status: RequestStatus
  activityType: ActivityType
  priority: RequestPriority
  requestDate: string
  startTime: string
  endTime: string
  returnDate: string
  location: string
  purpose: string
  submittedAt: string
  requestedItems: string[]
  notes: string
  timeline: StatusTimelineEntry[]
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
  activityType: ActivityType
  requestDate: string
  startTime: string
  endTime: string
  location: string
  purpose: string
  returnDate: string
  priority: RequestPriority
  requestedItems: string[]
  notes: string
}
