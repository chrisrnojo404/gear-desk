import { useEffect, useMemo, useState } from 'react'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { StatusBadge } from '../../components/dashboard/StatusBadge'
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
      return equipment
    }

    return equipment.filter((item) => item.category === selectedFilter)
  }, [equipment, selectedFilter])

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
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setSelectedFilter(filter.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              selectedFilter === filter.value
                ? 'bg-sand-50 text-slate-950'
                : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {error ? (
        <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-6 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredEquipment.map((item) => (
          <article
            key={item.id}
            className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs tracking-[0.16em] text-slate-400 uppercase">{item.id}</p>
                <h2 className="mt-2 text-lg font-semibold text-white">{item.name}</h2>
              </div>
              <StatusBadge value={item.condition} />
            </div>

            <div className="mt-5 grid gap-3 text-sm text-slate-300">
              <p>Categorie: {item.category}</p>
              <p>Beschikbaar: {item.quantityAvailable}</p>
              <p>Locatie: {item.location}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
