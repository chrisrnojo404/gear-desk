import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { FormInput } from '../../components/auth/FormInput'
import { RoleBadge } from '../../components/common/RoleBadge'
import { useAuth } from '../../hooks/useAuth'
import { getDefaultRouteForRole } from '../../routes/routeConfig'
import type { LoginPayload, UserRole } from '../../types/auth'

const demoAccounts: Array<{ email: string; role: UserRole }> = [
  { email: 'aanvrager@geardesk.local', role: 'level_1' },
  { email: 'verwerker@geardesk.local', role: 'level_2' },
  { email: 'admin@geardesk.local', role: 'level_3' },
]

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoggingIn } = useAuth()
  const [submitError, setSubmitError] = useState('')
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginPayload>({
    defaultValues: {
      email: '',
      password: 'Welkom123!',
    },
  })

  const from = location.state as { from?: { pathname?: string } } | null

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError('')

    try {
      const user = await login(values)
      navigate(from?.from?.pathname ?? getDefaultRouteForRole(user.role), { replace: true })
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Er ging iets mis tijdens het inloggen.')
    }
  })

  const fillDemoAccount = (email: string) => {
    setSubmitError('')
    setValue('email', email, { shouldDirty: true, shouldValidate: true })
  }

  return (
    <div className="w-full max-w-xl">
      <div className="rounded-[2rem] border border-slate-900/10 bg-sand-50 p-5 shadow-2xl shadow-slate-950/20 sm:p-6">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 sm:p-8">
          <p className="text-sm font-medium tracking-[0.18em] text-brand-600 uppercase">
            AUTH / Login
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-slate-950">
            Meld je aan bij Gear Desk
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Gebruik een demoaccount om de loginflow te testen. Na inloggen word je op basis van je
            rol naar de juiste omgeving gestuurd.
          </p>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-900">Demo toegang</p>
                <p className="text-xs text-slate-500">Wachtwoord voor alle accounts: `Welkom123!`</p>
              </div>
              <div className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-white uppercase">
                Mock API
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => fillDemoAccount(account.email)}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-brand-300 hover:bg-brand-50"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{account.email}</p>
                    <p className="mt-1 text-xs text-slate-500">Klik om dit account in te vullen</p>
                  </div>
                  <RoleBadge role={account.role} />
                </button>
              ))}
            </div>
          </div>

          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <FormInput
              id="email"
              type="email"
              label="E-mailadres"
              placeholder="naam@organisatie.nl"
              autoComplete="email"
              error={errors.email}
              {...register('email', {
                required: 'E-mailadres is verplicht.',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Vul een geldig e-mailadres in.',
                },
              })}
            />

            <FormInput
              id="password"
              type="password"
              label="Wachtwoord"
              placeholder="Voer je wachtwoord in"
              autoComplete="current-password"
              hint="Demo: Welkom123!"
              error={errors.password}
              {...register('password', {
                required: 'Wachtwoord is verplicht.',
                minLength: {
                  value: 8,
                  message: 'Wachtwoord moet minimaal 8 tekens bevatten.',
                },
              })}
            />

            {submitError ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {submitError}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isLoggingIn ? 'Inloggen...' : 'Inloggen'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
