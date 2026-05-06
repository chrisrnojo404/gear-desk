import { useEffect, useMemo, useState } from 'react'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { StatusBadge } from '../../components/dashboard/StatusBadge'
import { Button } from '../../components/ui/Button'
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable'
import { FormInput } from '../../components/auth/FormInput'
import { Modal } from '../../components/ui/Modal'
import { getAvailableEquipment } from '../../services/mock/requesterService'
import type { EquipmentItem, EquipmentCategory } from '../../types/requester'

const filters: Array<{ label: string; value: EquipmentCategory | 'all' }> = [
  { label: 'Alles', value: 'all' },
  { label: 'Camera', value: 'camera' },
  { label: 'Audio', value: 'audio' },
  { label: 'Lighting', value: 'lighting' },
  { label: 'Accessoires', value: 'accessories' },
]

export function AvailableEquipmentPage() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([])
  const [selectedFilter, setSelectedFilter] = useState<EquipmentCategory | 'all'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadEquipment() {
      setIsLoading(true)
      setError('')

      try {
        setEquipment(await getAvailableEquipment())
      } catch {
        setError('Beschikbare apparatuur kon niet worden geladen.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadEquipment()
  }, [])

  const filteredEquipment = useMemo(() => {
    if (selectedFilter === 'all') {
      return equipment.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    return equipment
      .filter((item) => item.category === selectedFilter)
      .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
  }, [equipment, selectedFilter, search])

  const columns: DataTableColumn<EquipmentItem>[] = [
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
      key: 'availability',
      header: 'Beschikbaar',
      render: (item) => <p className="text-sm text-slate-300">{item.quantityAvailable}</p>,
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
    return <LoadingScreen message="Voorraad wordt geladen..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Beschikbare apparatuur"
        title="Overzicht van direct inzetbare items"
        description="Filter door beschikbare apparatuur om je aanvraag beter voor te bereiden."
      />

      <div className="flex flex-wrap gap-3">
        <div className="min-w-[240px] flex-1">
          <FormInput
            id="equipment-search"
            label="Search"
            placeholder="Zoek op assetnaam"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="flex items-end gap-3">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'table' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            Tabel
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            onClick={() => setSelectedFilter(filter.value)}
            variant={selectedFilter === filter.value ? 'primary' : 'secondary'}
            size="sm"
            className="rounded-full"
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {error ? (
        <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-6 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      {viewMode === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredEquipment.map((item) => (
            <article
              key={item.id}
              className="card-surface p-5 shadow-xl shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-white/7"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs tracking-[0.16em] text-slate-400 uppercase">{item.id}</p>
                  <h2 className="mt-2 text-lg font-semibold text-white">{item.name}</h2>
                </div>
                <StatusBadge value={item.status} />
              </div>

              <div className="mt-5 grid gap-3 text-sm text-slate-300">
                <p>Categorie: {item.category}</p>
                <p>Beschikbaar: {item.quantityAvailable}</p>
                <p>Locatie: {item.location}</p>
              </div>

              <div className="mt-5">
                <Button variant="secondary" size="sm" onClick={() => setSelectedItem(item)}>
                  Bekijk details
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredEquipment}
          getRowKey={(item) => item.id}
          emptyMessage="Geen apparatuur gevonden voor deze filters."
        />
      )}

      <Modal
        open={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.name ?? ''}
        description="Voorbeeld van een herbruikbare modal voor assetinformatie."
        footer={
          <Button variant="secondary" onClick={() => setSelectedItem(null)}>
            Sluiten
          </Button>
        }
      >
        {selectedItem ? (
          <div className="grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
            <div>
              <p className="text-slate-400">Asset ID</p>
              <p className="mt-2 text-white">{selectedItem.id}</p>
            </div>
            <div>
              <p className="text-slate-400">Status</p>
              <div className="mt-2">
                <StatusBadge value={selectedItem.status} />
              </div>
            </div>
            <div>
              <p className="text-slate-400">Categorie</p>
              <p className="mt-2 text-white">{selectedItem.category}</p>
            </div>
            <div>
              <p className="text-slate-400">Beschikbare stuks</p>
              <p className="mt-2 text-white">{selectedItem.quantityAvailable}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-slate-400">Locatie</p>
              <p className="mt-2 text-white">{selectedItem.location}</p>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
