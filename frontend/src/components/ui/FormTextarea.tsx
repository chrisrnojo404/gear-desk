import type { TextareaHTMLAttributes } from 'react'
import type { FieldError } from 'react-hook-form'

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: FieldError
}

export function FormTextarea({ label, error, id, ...props }: FormTextareaProps) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-medium text-slate-200">{label}</div>
      <textarea
        id={id}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-brand-500 focus:bg-white/10 focus:ring-4 focus:ring-brand-500/15"
        {...props}
      />
      {error ? <p className="mt-2 text-sm text-rose-300">{error.message}</p> : null}
    </label>
  )
}
