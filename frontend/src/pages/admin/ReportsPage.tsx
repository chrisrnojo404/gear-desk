import { useEffect, useState } from 'react'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { getAdminReports } from '../../services/mock/adminService'
import type { AdminReport } from '../../types/admin'

function reportStatusClass(status: AdminReport['status']) {
  return status === 'ready'
    ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-100'
    : 'border-amber-400/30 bg-amber-500/15 text-amber-100'
}

export function ReportsPage() {
  const [reports, setReports] = useState<AdminReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadReports() {
      setIsLoading(true)
      setError('')

      try {
        setReports(await getAdminReports())
      } catch {
        setError('Rapporten konden niet worden geladen.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadReports()
  }, [])

  if (isLoading) {
    return <LoadingScreen message="Rapporten worden geladen..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Rapporten"
        title="Management- en operationele rapportages"
        description="Gebruik rapporten voor trendanalyse, capaciteitsplanning en controle op gebruik en onderhoud."
      />

      {error ? (
        <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-6 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4">
        {reports.map((report) => (
          <article
            key={report.id}
            className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs tracking-[0.16em] text-slate-400 uppercase">{report.id}</p>
                <h2 className="mt-2 text-lg font-semibold text-white">{report.title}</h2>
                <p className="mt-2 text-sm text-slate-300">{report.summary}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold tracking-[0.14em] text-slate-300 uppercase">
                  {report.period}
                </span>
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.14em] uppercase ${reportStatusClass(report.status)}`}
                >
                  {report.status}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
