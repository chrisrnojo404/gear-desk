import { useEffect, useState } from 'react'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { RoleBadge } from '../../components/common/RoleBadge'
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
      ) : null}

      <div className="grid gap-4">
        {users.map((user) => (
          <article
            key={user.id}
            className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">{user.name}</h2>
                <p className="mt-1 text-sm text-slate-400">{user.email}</p>
                <p className="mt-2 text-sm text-slate-300">{user.department}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <RoleBadge role={user.role} />
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.14em] uppercase ${statusClass(user.status)}`}
                >
                  {user.status}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
