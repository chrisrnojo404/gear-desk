import { useEffect, useState } from 'react'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { StatusBadge } from '../../components/dashboard/StatusBadge'
import { getAdminEquipment } from '../../services/mock/adminService'
import type { AdminEquipmentItem } from '../../types/admin'

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
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {equipment.map((item) => (
          <article
            key={item.id}
            className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5"
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
              <p>Serienummer: {item.serialNumber}</p>
              <p>Locatie: {item.location}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
