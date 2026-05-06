export interface AdminOverview {
  totalUsers: number
  activeEquipment: number
  categories: number
  openIncidents: number
}

export interface AdminUser {
  id: number
  name: string
  email: string
  role: 'level_1' | 'level_2' | 'level_3'
  status: 'active' | 'pending' | 'blocked'
  department: string
}

export interface AdminUserFormValues {
  name: string
  email: string
  role: AdminUser['role']
  status: AdminUser['status']
  department: string
}

export interface AdminEquipmentItem {
  id: string
  name: string
  category: string
  condition: 'new' | 'good' | 'fair' | 'maintenance'
  quantity: number
  status: 'available' | 'reserved' | 'in_use' | 'defect'
  serialNumber: string
  location: string
}

export interface AdminEquipmentFormValues {
  name: string
  category: string
  condition: AdminEquipmentItem['condition']
  quantity: number
  status: AdminEquipmentItem['status']
  serialNumber: string
  location: string
}

export interface AdminCategory {
  id: string
  name: string
  itemCount: number
  accessLevel: string
}

export interface AdminCategoryFormValues {
  name: string
  itemCount: number
  accessLevel: string
}

export interface AdminReport {
  id: string
  title: string
  period: string
  summary: string
  status: 'ready' | 'processing'
}

export interface AdminLogEntry {
  id: string
  timestamp: string
  actor: string
  action: string
  target: string
  severity: 'info' | 'warning' | 'critical'
}
