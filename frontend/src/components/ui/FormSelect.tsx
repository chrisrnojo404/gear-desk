import type { SelectHTMLAttributes } from 'react'
import type { FieldError } from 'react-hook-form'

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: FieldError
}

export function FormSelect({ label, error, id, children, ...props }: FormSelectProps) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-medium text-slate-200">{label}</div>
      <select
        id={id}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
        {...props}
      >
        {children}
      </select>
      {error ? <p className="mt-2 text-sm text-rose-300">{error.message}</p> : null}
    </label>
  )
}
