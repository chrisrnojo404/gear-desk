import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { RoleBadge } from '../../components/common/RoleBadge'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable'
import { Button } from '../../components/ui/Button'
import { FormInput } from '../../components/auth/FormInput'
import { FormSelect } from '../../components/ui/FormSelect'
import { Modal } from '../../components/ui/Modal'
import {
  createAdminUser,
  deleteAdminUser,
  getAdminUsers,
  updateAdminUser,
} from '../../services/mock/adminService'
import type { AdminUser, AdminUserFormValues } from '../../types/admin'

function statusClass(status: AdminUser['status']) {
  switch (status) {
    case 'active':
      return 'border-emerald-400/30 bg-emerald-500/15 text-emerald-100'
    case 'pending':
      return 'border-amber-400/30 bg-amber-500/15 text-amber-100'
    default:
      return 'border-rose-400/30 bg-rose-500/15 text-rose-100'
  }
}

export function UsersManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminUserFormValues>({
    defaultValues: {
      name: '',
      email: '',
      role: 'level_1',
      status: 'active',
      department: '',
    },
  })

  async function loadUsers() {
    setIsLoading(true)
    setError('')

    try {
      setUsers(await getAdminUsers())
    } catch {
      setError('Gebruikers konden niet worden geladen.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadUsers()
  }, [])

  const openCreate = () => {
    reset({
      name: '',
      email: '',
      role: 'level_1',
      status: 'active',
      department: '',
    })
    setSelectedUser(null)
    setIsModalOpen(true)
  }

  const openEdit = (user: AdminUser) => {
    reset({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      department: user.department,
    })
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleDelete = async (user: AdminUser) => {
    await deleteAdminUser(user.id)
    await loadUsers()
  }

  const onSubmit = handleSubmit(async (values) => {
    setIsSaving(true)

    try {
      if (selectedUser) {
        await updateAdminUser(selectedUser.id, values)
      } else {
        await createAdminUser(values)
      }

      setIsModalOpen(false)
      setSelectedUser(null)
      await loadUsers()
    } finally {
      setIsSaving(false)
    }
  })

  const columns = useMemo<DataTableColumn<AdminUser>[]>(
    () => [
      {
        key: 'user',
        header: 'Gebruiker',
        render: (user) => (
          <div>
            <p className="text-base font-semibold text-white">{user.name}</p>
            <p className="mt-1 text-sm text-slate-400">{user.email}</p>
          </div>
        ),
      },
      {
        key: 'department',
        header: 'Afdeling',
        render: (user) => <p className="text-sm text-slate-300">{user.department}</p>,
      },
      {
        key: 'role',
        header: 'Rol',
        render: (user) => <RoleBadge role={user.role} />,
      },
      {
        key: 'status',
        header: 'Status',
        render: (user) => (
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.14em] uppercase ${statusClass(user.status)}`}
          >
            {user.status}
          </span>
        ),
      },
      {
        key: 'action',
        header: 'Acties',
        render: (user) => (
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => openEdit(user)}>
              Bewerken
            </Button>
            <Button variant="danger" size="sm" onClick={() => void handleDelete(user)}>
              Verwijderen
            </Button>
          </div>
        ),
      },
    ],
    [],
  )

  if (isLoading) {
    return <LoadingScreen message="Gebruikersbeheer wordt geladen..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Gebruikersbeheer"
        title="Accounts, rollen en toegangsstatus"
        description="Beheer wie toegang heeft tot het systeem en welke verantwoordelijkheden aan elk account gekoppeld zijn."
        actions={
          <Button onClick={openCreate}>
            Gebruiker toevoegen
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
          data={users}
          getRowKey={(user) => String(user.id)}
          emptyMessage="Er zijn geen gebruikers gevonden."
        />
      )}

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedUser ? 'Gebruiker bewerken' : 'Nieuwe gebruiker'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Annuleren
            </Button>
            <Button type="submit" form="user-form" disabled={isSaving}>
              {isSaving ? 'Opslaan...' : 'Opslaan'}
            </Button>
          </>
        }
      >
        <form id="user-form" onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          <FormInput
            id="user-name"
            label="Naam"
            error={errors.name}
            {...register('name', { required: 'Naam is verplicht.' })}
          />
          <FormInput
            id="user-email"
            label="E-mail"
            type="email"
            error={errors.email}
            {...register('email', { required: 'E-mail is verplicht.' })}
          />
          <FormInput
            id="user-department"
            label="Afdeling"
            error={errors.department}
            {...register('department', { required: 'Afdeling is verplicht.' })}
          />
          <FormSelect
            id="user-role"
            label="Rol"
            error={errors.role}
            {...register('role', { required: 'Rol is verplicht.' })}
          >
            <option value="level_1" className="text-slate-900">Level 1 - Aanvrager</option>
            <option value="level_2" className="text-slate-900">Level 2 - Verwerker</option>
            <option value="level_3" className="text-slate-900">Level 3 - Admin</option>
          </FormSelect>
          <div className="md:col-span-2">
            <FormSelect
              id="user-status"
              label="Status"
              error={errors.status}
              {...register('status', { required: 'Status is verplicht.' })}
            >
              <option value="active" className="text-slate-900">Active</option>
              <option value="pending" className="text-slate-900">Pending</option>
              <option value="blocked" className="text-slate-900">Blocked</option>
            </FormSelect>
          </div>
        </form>
      </Modal>
    </div>
  )
}
