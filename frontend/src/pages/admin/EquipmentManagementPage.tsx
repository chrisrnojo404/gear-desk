import { useEffect, useState } from 'react'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { StatusBadge } from '../../components/dashboard/StatusBadge'
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable'
import { getAdminEquipment } from '../../services/mock/adminService'
import type { AdminEquipmentItem } from '../../types/admin'

const columns: DataTableColumn<AdminEquipmentItem>[] = [
  {
    key: 'asset',
    header: 'Asset',
    render: (item) => (
      <div>
        <p className="text-base font-semibold text-white">{item.name}</p>
        <p className="mt-1 text-sm text-slate-400">{item.id}</p>
      </div>
    ),
  },
  {
    key: 'category',
    header: 'Categorie',
    render: (item) => <p className="text-sm text-slate-300">{item.category}</p>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (item) => <StatusBadge value={item.status} />,
  },
  {
    key: 'serial',
    header: 'Serienummer',
    render: (item) => <p className="text-sm text-slate-300">{item.serialNumber}</p>,
  },
  {
    key: 'location',
    header: 'Locatie',
    render: (item) => <p className="text-sm text-slate-300">{item.location}</p>,
  },
]

export function EquipmentManagementPage() {
  const [equipment, setEquipment] = useState<AdminEquipmentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadEquipment() {
      setIsLoading(true)
      setError('')

      try {
        setEquipment(await getAdminEquipment())
      } catch {
        setError('Apparatuur kon niet worden geladen.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadEquipment()
  }, [])

  if (isLoading) {
    return <LoadingScreen message="Apparatuurbeheer wordt geladen..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Apparatuurbeheer"
        title="Assets, serienummers en status"
        description="Houd centraal bij waar apparatuur zich bevindt en of onderhoud of inzet actie vereist."
      />

      {error ? (
        <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-6 text-sm text-rose-100">
          {error}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={equipment}
          getRowKey={(item) => item.id}
          emptyMessage="Er is geen apparatuur beschikbaar."
        />
      )}
    </div>
  )
}
