import { useEffect, useState } from 'react'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { getAdminLogs } from '../../services/mock/adminService'
import type { AdminLogEntry } from '../../types/admin'

function severityClass(severity: AdminLogEntry['severity']) {
  switch (severity) {
    case 'critical':
      return 'border-rose-400/30 bg-rose-500/15 text-rose-100'
    case 'warning':
      return 'border-amber-400/30 bg-amber-500/15 text-amber-100'
    default:
      return 'border-sky-400/30 bg-sky-500/15 text-sky-100'
  }
}

export function LogsPage() {
  const [logs, setLogs] = useState<AdminLogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadLogs() {
      setIsLoading(true)
      setError('')

      try {
        setLogs(await getAdminLogs())
      } catch {
        setError('Logs konden niet worden geladen.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadLogs()
  }, [])

  if (isLoading) {
    return <LoadingScreen message="Logs worden geladen..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Logs"
        title="Audit trail en systeemactiviteit"
        description="Bekijk welke acties zijn uitgevoerd, door wie en welke waarschuwingen extra aandacht nodig hebben."
      />

      {error ? (
        <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-6 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4">
        {logs.map((log) => (
          <article
            key={log.id}
            className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs tracking-[0.16em] text-slate-400 uppercase">{log.id}</p>
                <h2 className="mt-2 text-lg font-semibold text-white">{log.action}</h2>
                <p className="mt-2 text-sm text-slate-300">Target: {log.target}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold tracking-[0.14em] text-slate-300 uppercase">
                  {new Date(log.timestamp).toLocaleString('nl-NL')}
                </span>
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.14em] uppercase ${severityClass(log.severity)}`}
                >
                  {log.severity}
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-400">Actor: {log.actor}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
