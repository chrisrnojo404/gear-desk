import { useState } from 'react'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { FormInput } from '../../components/auth/FormInput'
import { RoleBadge } from '../../components/common/RoleBadge'
import { useAuth } from '../../hooks/useAuth'
import { getDefaultRouteForRole } from '../../routes/routeConfig'
import type { LoginPayload, UserRole } from '../../types/auth'
import { Button } from '../../components/ui/Button'

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
    <div className="w-full max-w-4xl">
      <div className="panel-glow rounded-[2rem] border border-white/10 bg-panel-900/88 p-5 shadow-2xl shadow-slate-950/20 sm:p-6">
        <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50 p-7 sm:p-9">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-100 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase">
            <ShieldCheck className="h-4 w-4" />
            Secure login
          </div>
          <p className="mt-5 text-sm font-semibold tracking-[0.18em] text-brand-600 uppercase">
            AUTH / Login
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-slate-950">
            Meld je aan bij Gear Desk
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Gebruik een demoaccount om de loginflow te testen. Na inloggen word je op basis van je
            rol naar de juiste omgeving gestuurd.
          </p>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/70">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-950">Demo toegang</p>
                <p className="text-xs text-slate-500">Wachtwoord voor alle accounts: `Welkom123!`</p>
              </div>
              <div className="rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-white uppercase">
                Mock API
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => fillDemoAccount(account.email)}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:border-brand-300 hover:bg-brand-50"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-950">{account.email}</p>
                    <p className="mt-1 text-xs text-slate-500">Klik om dit account in te vullen</p>
                  </div>
                  <RoleBadge role={account.role} variant="light" />
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
              variant="light"
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
              variant="light"
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

            <Button
              type="submit"
              disabled={isLoggingIn}
              size="lg"
              fullWidth
            >
              {isLoggingIn ? 'Inloggen...' : 'Inloggen'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
