import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export interface DataTableColumn<T> {
  key: string
  header: string
  className?: string
  mobileLabel?: string
  render: (row: T) => ReactNode
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  getRowKey: (row: T) => string
  emptyMessage?: string
}

export function DataTable<T>({
  columns,
  data,
  getRowKey,
  emptyMessage = 'Geen data beschikbaar.',
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-white/4 p-10 text-center text-sm text-slate-400">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5">
      <div
        className="hidden items-center gap-4 border-b border-white/10 px-5 py-4 text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase lg:grid"
        style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
      >
        {columns.map((column) => (
          <span key={column.key} className={column.className}>
            {column.header}
          </span>
        ))}
      </div>

      <div className="divide-y divide-white/10">
        {data.map((row) => (
          <div
            key={getRowKey(row)}
            className="group px-5 py-5 transition hover:bg-white/6 lg:grid lg:items-center lg:gap-4"
            style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
          >
            {columns.map((column) => (
              <div key={column.key} className={cn('min-w-0', column.className)}>
                <p className="mb-1 text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase lg:hidden">
                  {column.mobileLabel ?? column.header}
                </p>
                {column.render(row)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
