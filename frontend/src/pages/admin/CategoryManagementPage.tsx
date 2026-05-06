import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { Button } from '../../components/ui/Button'
import { FormInput } from '../../components/auth/FormInput'
import { Modal } from '../../components/ui/Modal'
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from '../../services/mock/adminService'
import type { AdminCategory, AdminCategoryFormValues } from '../../types/admin'

export function CategoryManagementPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<AdminCategory | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminCategoryFormValues>({
    defaultValues: {
      name: '',
      itemCount: 0,
      accessLevel: '',
    },
  })

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

  useEffect(() => {
    let active = true

    void getAdminCategories()
      .then((response) => {
        if (!active) {
          return
        }

        setCategories(response)
      })
      .catch(() => {
        if (!active) {
          return
        }

        setError('Categorieen konden niet worden geladen.')
      })
      .finally(() => {
        if (active) {
          setIsLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const openCreate = () => {
    reset({ name: '', itemCount: 0, accessLevel: '' })
    setSelectedCategory(null)
    setIsModalOpen(true)
  }

  const openEdit = (category: AdminCategory) => {
    reset({
      name: category.name,
      itemCount: category.itemCount,
      accessLevel: category.accessLevel,
    })
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  const onSubmit = handleSubmit(async (values) => {
    setIsSaving(true)

    try {
      if (selectedCategory) {
        await updateAdminCategory(selectedCategory.id, values)
      } else {
        await createAdminCategory(values)
      }
      setIsModalOpen(false)
      await loadCategories()
    } finally {
      setIsSaving(false)
    }
  })

  const handleDelete = async (category: AdminCategory) => {
    await deleteAdminCategory(category.id)
    await loadCategories()
  }

  if (isLoading) {
    return <LoadingScreen message="Categoriebeheer wordt geladen..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Categoriebeheer"
        title="Beheer assetgroepen en toegangsregels"
        description="Definieer welke type apparatuur onder een categorie valt en welk toegangsniveau daarbij hoort."
        actions={<Button onClick={openCreate}>Categorie toevoegen</Button>}
      />

      {error ? (
        <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-6 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <article key={category.id} className="card-surface p-5">
            <p className="text-xs tracking-[0.16em] text-slate-400 uppercase">{category.id}</p>
            <h2 className="mt-2 text-lg font-semibold text-white">{category.name}</h2>
            <p className="mt-4 text-sm text-slate-300">Items: {category.itemCount}</p>
            <p className="mt-2 text-sm text-slate-300">Toegang: {category.accessLevel}</p>
            <div className="mt-5 flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => openEdit(category)}>
                Bewerken
              </Button>
              <Button variant="danger" size="sm" onClick={() => void handleDelete(category)}>
                Verwijderen
              </Button>
            </div>
          </article>
        ))}
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCategory ? 'Categorie bewerken' : 'Categorie toevoegen'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Annuleren
            </Button>
            <Button type="submit" form="category-form" disabled={isSaving}>
              {isSaving ? 'Opslaan...' : 'Opslaan'}
            </Button>
          </>
        }
      >
        <form id="category-form" onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          <FormInput
            id="category-name"
            label="Naam"
            error={errors.name}
            {...register('name', { required: 'Naam is verplicht.' })}
          />
          <FormInput
            id="category-items"
            type="number"
            label="Aantal items"
            error={errors.itemCount}
            {...register('itemCount', { valueAsNumber: true, required: 'Aantal is verplicht.' })}
          />
          <div className="md:col-span-2">
            <FormInput
              id="category-access"
              label="Toegangsniveau"
              error={errors.accessLevel}
              {...register('accessLevel', { required: 'Toegangsniveau is verplicht.' })}
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}
