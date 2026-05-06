import type {
  AdminCategory,
  AdminCategoryFormValues,
  AdminEquipmentFormValues,
  AdminEquipmentItem,
  AdminLogEntry,
  AdminOverview,
  AdminReport,
  AdminUser,
  AdminUserFormValues,
} from '../../types/admin'

let adminUsers: AdminUser[] = [
  {
    id: 1,
    name: 'Naomi Kandhai',
    email: 'aanvrager@geardesk.local',
    role: 'level_1',
    status: 'active',
    department: 'Productie',
  },
  {
    id: 2,
    name: 'Rens Martina',
    email: 'verwerker@geardesk.local',
    role: 'level_2',
    status: 'active',
    department: 'Materiaalbalie',
  },
  {
    id: 3,
    name: 'Jade Linscheer',
    email: 'admin@geardesk.local',
    role: 'level_3',
    status: 'active',
    department: 'Operations',
  },
  {
    id: 4,
    name: 'Milan Simons',
    email: 'milan.simons@media.local',
    role: 'level_1',
    status: 'pending',
    department: 'Nieuws',
  },
]

let adminEquipment: AdminEquipmentItem[] = [
  {
    id: 'EQ-301',
    name: 'Sony FX6',
    category: 'Camera',
    condition: 'good',
    quantity: 4,
    status: 'available',
    serialNumber: 'FX6-00912',
    location: 'Magazijn 1',
  },
  {
    id: 'EQ-302',
    name: 'Zoom F6 Recorder',
    category: 'Audio',
    condition: 'new',
    quantity: 2,
    status: 'in_use',
    serialNumber: 'ZF6-11032',
    location: 'Uitgegeven',
  },
  {
    id: 'EQ-303',
    name: 'Aputure Nova P300c',
    category: 'Lighting',
    condition: 'maintenance',
    quantity: 1,
    status: 'defect',
    serialNumber: 'ANP-44321',
    location: 'Technische dienst',
  },
  {
    id: 'EQ-304',
    name: 'Sachtler Flowtech Tripod',
    category: 'Accessories',
    condition: 'fair',
    quantity: 6,
    status: 'reserved',
    serialNumber: 'SFT-88210',
    location: 'Accessoirewand',
  },
  {
    id: 'EQ-305',
    name: 'Blackmagic Studio Camera 4K',
    category: 'Camera',
    condition: 'good',
    quantity: 3,
    status: 'available',
    serialNumber: 'BSC-22451',
    location: 'Magazijn 2',
  },
  {
    id: 'EQ-306',
    name: 'Shure SM7B',
    category: 'Audio',
    condition: 'fair',
    quantity: 8,
    status: 'available',
    serialNumber: 'SM7-78124',
    location: 'Audiorek',
  },
  {
    id: 'EQ-307',
    name: 'Nanlite Forza 300',
    category: 'Lighting',
    condition: 'good',
    quantity: 5,
    status: 'reserved',
    serialNumber: 'NF3-33109',
    location: 'Lichtopslag',
  },
  {
    id: 'EQ-308',
    name: 'DJI RS 3 Pro',
    category: 'Accessories',
    condition: 'new',
    quantity: 2,
    status: 'in_use',
    serialNumber: 'RS3-65018',
    location: 'Uitgegeven',
  },
]

let adminCategories: AdminCategory[] = [
  { id: 'CAT-1', name: 'Camera', itemCount: 28, accessLevel: 'Level 1+' },
  { id: 'CAT-2', name: 'Audio', itemCount: 19, accessLevel: 'Level 1+' },
  { id: 'CAT-3', name: 'Lighting', itemCount: 14, accessLevel: 'Level 2 approval' },
  { id: 'CAT-4', name: 'Accessories', itemCount: 36, accessLevel: 'Level 1+' },
]

const adminReports: AdminReport[] = [
  {
    id: 'RPT-91',
    title: 'Maandrapport gebruik apparatuur',
    period: 'Mei 2026',
    summary: 'Overzicht van uitgifte, retouren en bezettingsgraad per categorie.',
    status: 'ready',
  },
  {
    id: 'RPT-92',
    title: 'Gebruikersactiviteit per rol',
    period: 'Q2 2026',
    summary: 'Aanvragen, verwerkingstijden en admin-acties per gebruikersniveau.',
    status: 'ready',
  },
  {
    id: 'RPT-93',
    title: 'Onderhoud en incidentanalyse',
    period: 'Mei 2026',
    summary: 'Openstaande onderhoudsmeldingen en trendanalyse van defecten.',
    status: 'processing',
  },
]

const adminLogs: AdminLogEntry[] = [
  {
    id: 'LOG-5001',
    timestamp: '2026-05-06T09:14:00Z',
    actor: 'Jade Linscheer',
    action: 'Gebruiker geactiveerd',
    target: 'milan.simons@media.local',
    severity: 'info',
  },
  {
    id: 'LOG-5002',
    timestamp: '2026-05-06T08:41:00Z',
    actor: 'Rens Martina',
    action: 'Aanvraagstatus aangepast naar in gebruik',
    target: 'REQ-1998',
    severity: 'info',
  },
  {
    id: 'LOG-5003',
    timestamp: '2026-05-06T08:10:00Z',
    actor: 'System',
    action: 'Onderhoudsflag geplaatst op apparaat',
    target: 'EQ-303',
    severity: 'warning',
  },
  {
    id: 'LOG-5004',
    timestamp: '2026-05-05T17:48:00Z',
    actor: 'System',
    action: 'Mislukte inlogpogingen gedetecteerd',
    target: 'admin paneel',
    severity: 'critical',
  },
]

function delay(ms = 450) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function getAdminOverview(): Promise<AdminOverview> {
  await delay()

  return {
    totalUsers: adminUsers.length,
    activeEquipment: adminEquipment.filter((item) => item.status !== 'defect').length,
    categories: adminCategories.length,
    openIncidents: adminLogs.filter((entry) => entry.severity !== 'info').length,
  }
}

export async function getAdminUsers() {
  await delay()
  return [...adminUsers]
}

export async function createAdminUser(values: AdminUserFormValues) {
  await delay()
  const user: AdminUser = {
    id: Math.max(0, ...adminUsers.map((item) => item.id)) + 1,
    ...values,
  }
  adminUsers.unshift(user)
  return user
}

export async function updateAdminUser(id: number, values: AdminUserFormValues) {
  await delay()
  adminUsers = adminUsers.map((user) => (user.id === id ? { ...user, ...values } : user))
  return adminUsers.find((user) => user.id === id) ?? null
}

export async function deleteAdminUser(id: number) {
  await delay()
  adminUsers = adminUsers.filter((user) => user.id !== id)
}

export async function getAdminEquipment() {
  await delay()
  return [...adminEquipment]
}

export async function createAdminEquipment(values: AdminEquipmentFormValues) {
  await delay()
  const item: AdminEquipmentItem = {
    id: `EQ-${Math.floor(400 + Math.random() * 500)}`,
    ...values,
  }
  adminEquipment.unshift(item)
  return item
}

export async function updateAdminEquipment(id: string, values: AdminEquipmentFormValues) {
  await delay()
  adminEquipment = adminEquipment.map((item) => (item.id === id ? { ...item, ...values } : item))
  return adminEquipment.find((item) => item.id === id) ?? null
}

export async function deleteAdminEquipment(id: string) {
  await delay()
  adminEquipment = adminEquipment.filter((item) => item.id !== id)
}

export async function getAdminCategories() {
  await delay()
  return [...adminCategories]
}

export async function createAdminCategory(values: AdminCategoryFormValues) {
  await delay()
  const category: AdminCategory = {
    id: `CAT-${adminCategories.length + 1}`,
    ...values,
  }
  adminCategories.unshift(category)
  return category
}

export async function updateAdminCategory(id: string, values: AdminCategoryFormValues) {
  await delay()
  adminCategories = adminCategories.map((category) =>
    category.id === id ? { ...category, ...values } : category,
  )
  return adminCategories.find((category) => category.id === id) ?? null
}

export async function deleteAdminCategory(id: string) {
  await delay()
  adminCategories = adminCategories.filter((category) => category.id !== id)
}

export async function getAdminReports() {
  await delay()
  return [...adminReports]
}

export async function getAdminLogs() {
  await delay()
  return [...adminLogs]
}
