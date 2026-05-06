import type { ReactNode } from 'react'
import { Menu, Search, Bell } from 'lucide-react'
import { Button } from '../ui/Button'

interface TopbarProps {
  title: string
  subtitle: string
  onMenuClick: () => void
  rightSlot?: ReactNode
}

export function Topbar({ title, subtitle, onMenuClick, rightSlot }: TopbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-[1.75rem] border border-white/10 bg-white/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <Button variant="secondary" size="sm" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-4 w-4" />
        </Button>
        <div>
          <p className="text-xs tracking-[0.18em] text-slate-400 uppercase">Media Ops</p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-white">{title}</h1>
          <p className="mt-1 text-sm text-slate-300">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400 md:flex">
          <Search className="h-4 w-4" />
          Zoek assets, aanvragen of gebruikers
        </div>
        <Button variant="secondary" size="sm" className="rounded-full p-2.5">
          <Bell className="h-4 w-4" />
        </Button>
        {rightSlot}
      </div>
    </div>
  )
}
