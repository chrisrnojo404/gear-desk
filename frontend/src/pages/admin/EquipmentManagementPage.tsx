import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { StatusBadge } from '../../components/dashboard/StatusBadge'
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable'
import { Button } from '../../components/ui/Button'
import { FormInput } from '../../components/auth/FormInput'
import { FormSelect } from '../../components/ui/FormSelect'
import { Modal } from '../../components/ui/Modal'
import {
  createAdminEquipment,
  deleteAdminEquipment,
  getAdminEquipment,
  updateAdminEquipment,
} from '../../services/mock/adminService'
import type { AdminEquipmentFormValues, AdminEquipmentItem } from '../../types/admin'

export function EquipmentManagementPage() {
  const [equipment, setEquipment] = useState<AdminEquipmentItem[]>([])
  const [selectedItem, setSelectedItem] = useState<AdminEquipmentItem | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminEquipmentFormValues>({
    defaultValues: {
      name: '',
      category: 'Camera',
      status: 'available',
      serialNumber: '',
      location: '',
    },
  })

  useEffect(() => {
    let active = true

    void getAdminEquipment()
      .then((response) => {
        if (!active) {
          return
        }

        setEquipment(response)
      })
      .catch(() => {
        if (!active) {
          return
        }

        setError('Apparatuur kon niet worden geladen.')
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

  const openCreate = () => {
    reset({
      name: '',
      category: 'Camera',
      status: 'available',
      serialNumber: '',
      location: '',
    })
    setSelectedItem(null)
    setIsCreateOpen(true)
  }

  const openEdit = (item: AdminEquipmentItem) => {
    reset({
      name: item.name,
      category: item.category,
      status: item.status,
      serialNumber: item.serialNumber,
      location: item.location,
    })
    setSelectedItem(item)
    setIsCreateOpen(true)
  }

  const onSubmit = handleSubmit(async (values) => {
    setIsSaving(true)

    try {
      if (selectedItem) {
        await updateAdminEquipment(selectedItem.id, values)
      } else {
        await createAdminEquipment(values)
      }

      setIsCreateOpen(false)
      setSelectedItem(null)
      await loadEquipment()
    } finally {
      setIsSaving(false)
    }
  })

  const handleDelete = async (item: AdminEquipmentItem) => {
    await deleteAdminEquipment(item.id)
    await loadEquipment()
  }

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
    {
      key: 'actions',
      header: 'Acties',
      render: (item) => (
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={() => openEdit(item)}>
            Bewerken
          </Button>
          <Button variant="danger" size="sm" onClick={() => void handleDelete(item)}>
            Verwijderen
          </Button>
        </div>
      ),
    },
  ]

  if (isLoading) {
    return <LoadingScreen message="Apparatuurbeheer wordt geladen..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Apparatuurbeheer"
        title="Assets, serienummers en status"
        description="Houd centraal bij waar apparatuur zich bevindt en of onderhoud of inzet actie vereist."
        actions={
          <Button onClick={openCreate}>
            Apparatuur toevoegen
          </Button>
        }
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

      <Modal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title={selectedItem ? 'Apparaat bewerken' : 'Apparaat toevoegen'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>
              Annuleren
            </Button>
            <Button type="submit" form="equipment-form" disabled={isSaving}>
              {isSaving ? 'Opslaan...' : 'Opslaan'}
            </Button>
          </>
        }
      >
        <form id="equipment-form" onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          <FormInput
            id="equipment-name"
            label="Naam"
            error={errors.name}
            {...register('name', { required: 'Naam is verplicht.' })}
          />
          <FormInput
            id="equipment-serial"
            label="Serienummer"
            error={errors.serialNumber}
            {...register('serialNumber', { required: 'Serienummer is verplicht.' })}
          />
          <FormInput
            id="equipment-category"
            label="Categorie"
            error={errors.category}
            {...register('category', { required: 'Categorie is verplicht.' })}
          />
          <FormInput
            id="equipment-location"
            label="Locatie"
            error={errors.location}
            {...register('location', { required: 'Locatie is verplicht.' })}
          />
          <div className="md:col-span-2">
            <FormSelect
              id="equipment-status"
              label="Status"
              error={errors.status}
              {...register('status', { required: 'Status is verplicht.' })}
            >
              <option value="available" className="text-slate-900">Beschikbaar</option>
              <option value="reserved" className="text-slate-900">Gereserveerd</option>
              <option value="in_use" className="text-slate-900">In gebruik</option>
              <option value="defect" className="text-slate-900">Defect</option>
            </FormSelect>
          </div>
        </form>
      </Modal>
    </div>
  )
}
