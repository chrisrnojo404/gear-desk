import { useEffect, useMemo, useState } from 'react'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { RoleBadge } from '../../components/common/RoleBadge'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { getAdminUsers } from '../../services/mock/adminService'
import type { AdminUser } from '../../types/admin'

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
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
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

    void loadUsers()
  }, [])

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
        header: 'Actie',
        render: (user) => (
          <Button variant="secondary" size="sm" onClick={() => setSelectedUser(user)}>
            Bekijk
          </Button>
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
        open={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        title={selectedUser?.name ?? ''}
        description="Voorbeeld van een herbruikbare modal voor accountbeheer."
        footer={
          <Button variant="secondary" onClick={() => setSelectedUser(null)}>
            Sluiten
          </Button>
        }
      >
        {selectedUser ? (
          <div className="grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
            <div>
              <p className="text-slate-400">E-mail</p>
              <p className="mt-2 text-white">{selectedUser.email}</p>
            </div>
            <div>
              <p className="text-slate-400">Afdeling</p>
              <p className="mt-2 text-white">{selectedUser.department}</p>
            </div>
            <div>
              <p className="text-slate-400">Rol</p>
              <div className="mt-2">
                <RoleBadge role={selectedUser.role} />
              </div>
            </div>
            <div>
              <p className="text-slate-400">Status</p>
              <div className="mt-2">
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.14em] uppercase ${statusClass(selectedUser.status)}`}
                >
                  {selectedUser.status}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
