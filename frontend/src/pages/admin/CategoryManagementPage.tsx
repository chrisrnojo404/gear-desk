import { useEffect, useState } from 'react'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { getAdminCategories } from '../../services/mock/adminService'
import type { AdminCategory } from '../../types/admin'

export function CategoryManagementPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadCategories() {
      setIsLoading(true)
      setError('')

      try {
        setCategories(await getAdminCategories())
      } catch {
        setError('Categorieen konden niet worden geladen.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadCategories()
  }, [])

  if (isLoading) {
    return <LoadingScreen message="Categoriebeheer wordt geladen..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Categoriebeheer"
        title="Beheer assetgroepen en toegangsregels"
        description="Definieer welke type apparatuur onder een categorie valt en welk toegangsniveau daarbij hoort."
      />

      {error ? (
        <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-6 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => (
          <article
            key={category.id}
            className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5"
          >
            <p className="text-xs tracking-[0.16em] text-slate-400 uppercase">{category.id}</p>
            <h2 className="mt-2 text-lg font-semibold text-white">{category.name}</h2>
            <p className="mt-4 text-sm text-slate-300">Items: {category.itemCount}</p>
            <p className="mt-2 text-sm text-slate-300">Toegang: {category.accessLevel}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
