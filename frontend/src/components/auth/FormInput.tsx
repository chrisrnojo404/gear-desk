import type { InputHTMLAttributes } from 'react'
import type { FieldError } from 'react-hook-form'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: FieldError
  hint?: string
  variant?: 'light' | 'dark'
}

export function FormInput({
  label,
  error,
  hint,
  id,
  variant = 'dark',
  ...props
}: FormInputProps) {
  const isLight = variant === 'light'

  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between">
        <span className={`text-sm font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
          {label}
        </span>
        {hint ? (
          <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{hint}</span>
        ) : null}
      </div>
      <input
        id={id}
        className={
          isLight
            ? 'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/15'
            : 'w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-brand-500 focus:bg-white/10 focus:ring-4 focus:ring-brand-500/15'
        }
        {...props}
      />
      {error ? (
        <p className={`mt-2 text-sm ${isLight ? 'text-rose-600' : 'text-rose-300'}`}>{error.message}</p>
      ) : null}
    </label>
  )
}
