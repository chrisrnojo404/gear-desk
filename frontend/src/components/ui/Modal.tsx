import type { PropsWithChildren, ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  footer?: ReactNode
}

export function Modal({
  open,
  title,
  description,
  onClose,
  footer,
  children,
}: PropsWithChildren<ModalProps>) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Sluiten"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
      />
      <div className="panel-glow relative z-10 w-full max-w-2xl rounded-[2rem] border border-white/10 bg-panel-900 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-white">{title}</h2>
            {description ? <p className="mt-2 text-sm text-slate-400">{description}</p> : null}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full p-2">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-6">{children}</div>

        {footer ? <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div> : null}
      </div>
    </div>
  )
}
