import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { FormInput } from '../../components/auth/FormInput'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { createRequest } from '../../services/mock/requesterService'
import type { NewRequestFormValues } from '../../types/requester'

export function NewRequestPage() {
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState('')
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewRequestFormValues>({
    defaultValues: {
      priority: 'medium',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError('')
    setIsSubmittingForm(true)

    try {
      const createdRequest = await createRequest(values)
      navigate(`/dashboard/requester/requests/${createdRequest.id}`)
    } catch {
      setSubmitError('De aanvraag kon niet worden opgeslagen. Probeer het opnieuw.')
    } finally {
      setIsSubmittingForm(false)
    }
  })

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Nieuwe aanvraag"
        title="Vraag apparatuur aan voor een productie"
        description="Vul je productiegegevens, planning en gewenste apparatuur in. Deze aanvraag wordt daarna doorgestuurd naar de verwerker."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <form
          onSubmit={onSubmit}
          className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 sm:p-6"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormInput
                id="title"
                label="Titel van aanvraag"
                placeholder="Bijv. Reportageset voor live interview"
                error={errors.title}
                {...register('title', {
                  required: 'Titel is verplicht.',
                  minLength: {
                    value: 6,
                    message: 'Titel moet minimaal 6 tekens bevatten.',
                  },
                })}
              />
            </div>

            <FormInput
              id="location"
              label="Locatie"
              placeholder="Studio A of buitenlocatie"
              error={errors.location}
              {...register('location', {
                required: 'Locatie is verplicht.',
              })}
            />

            <label className="block">
              <div className="mb-2 text-sm font-medium text-slate-200">Prioriteit</div>
              <select
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
                {...register('priority', {
                  required: 'Prioriteit is verplicht.',
                })}
              >
                <option value="low" className="text-slate-900">
                  Laag
                </option>
                <option value="medium" className="text-slate-900">
                  Gemiddeld
                </option>
                <option value="high" className="text-slate-900">
                  Hoog
                </option>
              </select>
            </label>

            <FormInput
              id="shootDate"
              type="date"
              label="Opnamedatum"
              error={errors.shootDate}
              {...register('shootDate', {
                required: 'Opnamedatum is verplicht.',
              })}
            />

            <FormInput
              id="returnDate"
              type="date"
              label="Retourdatum"
              error={errors.returnDate}
              {...register('returnDate', {
                required: 'Retourdatum is verplicht.',
              })}
            />

            <label className="block md:col-span-2">
              <div className="mb-2 text-sm font-medium text-slate-200">Doel van de productie</div>
              <textarea
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-brand-500 focus:bg-white/8 focus:ring-4 focus:ring-brand-500/15"
                placeholder="Omschrijf kort waar de apparatuur voor nodig is"
                {...register('purpose', {
                  required: 'Doel van de productie is verplicht.',
                  minLength: {
                    value: 12,
                    message: 'Omschrijf het doel iets uitgebreider.',
                  },
                })}
              />
              {errors.purpose ? (
                <p className="mt-2 text-sm text-rose-300">{errors.purpose.message}</p>
              ) : null}
            </label>

            <label className="block md:col-span-2">
              <div className="mb-2 text-sm font-medium text-slate-200">
                Gewenste apparatuur
              </div>
              <textarea
                rows={3}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-brand-500 focus:bg-white/8 focus:ring-4 focus:ring-brand-500/15"
                placeholder="Bijv. Sony FX3, Rode Wireless GO II, Aputure 300D"
                {...register('requestedItems', {
                  required: 'Voer minstens een apparaat in.',
                })}
              />
              {errors.requestedItems ? (
                <p className="mt-2 text-sm text-rose-300">{errors.requestedItems.message}</p>
              ) : null}
            </label>

            <label className="block md:col-span-2">
              <div className="mb-2 text-sm font-medium text-slate-200">Notities</div>
              <textarea
                rows={3}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-brand-500 focus:bg-white/8 focus:ring-4 focus:ring-brand-500/15"
                placeholder="Extra wensen, pickup-tijd of aandachtspunten"
                {...register('notes')}
              />
            </label>
          </div>

          {submitError ? (
            <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {submitError}
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSubmittingForm}
              className="rounded-2xl bg-sand-50 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmittingForm ? 'Aanvraag wordt opgeslagen...' : 'Aanvraag indienen'}
            </button>
          </div>
        </form>

        <aside className="rounded-[1.75rem] border border-white/10 bg-panel-800/75 p-5">
          <h2 className="text-lg font-semibold text-white">Tips voor een sterke aanvraag</h2>
          <div className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
            <p>Wees specifiek over locatie, draaidag en gewenste set-up.</p>
            <p>Noem kernapparatuur gescheiden door komma&apos;s voor snellere verwerking.</p>
            <p>Vermeld vroege pickup of kritische deadlines altijd in de notities.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
