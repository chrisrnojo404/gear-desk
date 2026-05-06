import { useEffect, useMemo, useState } from 'react'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { StatusBadge } from '../../components/dashboard/StatusBadge'
import { FormInput } from '../../components/auth/FormInput'
import { Button } from '../../components/ui/Button'
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable'
import { getAdminEquipment } from '../../services/mock/adminService'
import type { AdminEquipmentItem } from '../../types/admin'

const filters: Array<{ label: string; value: 'all' | 'available' | 'in_use' }> = [
  { label: 'Alles', value: 'all' },
  { label: 'Vrij', value: 'available' },
  { label: 'In gebruik', value: 'in_use' },
]

export function ProcessorEquipmentPage() {
  const [equipment, setEquipment] = useState<AdminEquipmentItem[]>([])
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'available' | 'in_use'>('all')
  const [search, setSearch] = useState('')
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

  const filteredEquipment = useMemo(() => {
    return equipment
      .filter((item) => selectedFilter === 'all' || item.status === selectedFilter)
      .filter((item) => {
        const term = search.toLowerCase()
        return (
          item.name.toLowerCase().includes(term) ||
          item.id.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term) ||
          item.location.toLowerCase().includes(term)
        )
      })
  }, [equipment, search, selectedFilter])

  const availableCount = equipment.filter((item) => item.status === 'available').length
  const inUseCount = equipment.filter((item) => item.status === 'in_use').length

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
      key: 'serial',
      header: 'Serienummer',
      render: (item) => <p className="text-sm text-slate-300">{item.serialNumber}</p>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => <StatusBadge value={item.status} />,
    },
    {
      key: 'location',
      header: 'Locatie',
      render: (item) => <p className="text-sm text-slate-300">{item.location}</p>,
    },
  ]

  if (isLoading) {
    return <LoadingScreen message="Apparatuur wordt geladen..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Apparatuur"
        title="Vrije en actieve apparatuur"
        description="Bekijk welke assets direct beschikbaar zijn en welke momenteel in gebruik staan."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.75rem] border border-emerald-400/20 bg-emerald-500/10 p-5">
          <p className="text-sm text-emerald-100">Vrije apparatuur</p>
          <p className="mt-3 text-3xl font-semibold text-white">{availableCount}</p>
        </div>
        <div className="rounded-[1.75rem] border border-amber-400/20 bg-amber-500/10 p-5">
          <p className="text-sm text-amber-100">In gebruik</p>
          <p className="mt-3 text-3xl font-semibold text-white">{inUseCount}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="min-w-[240px] flex-1">
          <FormInput
            id="processor-equipment-search"
            label="Zoeken"
            placeholder="Zoek op asset, ID, categorie of locatie"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            size="sm"
            className="rounded-full"
            variant={selectedFilter === filter.value ? 'primary' : 'secondary'}
            onClick={() => setSelectedFilter(filter.value)}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {error ? (
        <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-6 text-sm text-rose-100">
          {error}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredEquipment}
          getRowKey={(item) => item.id}
          emptyMessage="Geen apparatuur gevonden voor deze selectie."
        />
      )}
    </div>
  )
}
