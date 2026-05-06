import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { FormInput } from '../../components/auth/FormInput'
import { PageHeader } from '../../components/dashboard/PageHeader'
import { Button } from '../../components/ui/Button'
import { FormSelect } from '../../components/ui/FormSelect'
import { FormTextarea } from '../../components/ui/FormTextarea'
import { createRequest, getAvailableEquipment } from '../../services/mock/requesterService'
import type { NewRequestFormValues } from '../../types/requester'
import { useEffect } from 'react'

const activityTypes = [
  { value: 'studio', label: 'Studio opname' },
  { value: 'reportage', label: 'Reportage' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'event', label: 'Event' },
  { value: 'livestream', label: 'Livestream' },
] as const

export function NewRequestPage() {
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState('')
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [equipmentOptions, setEquipmentOptions] = useState<Array<{ id: string; name: string }>>([])
  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<NewRequestFormValues>({
    defaultValues: {
      activityType: 'studio',
      priority: 'medium',
      requestedItems: [],
    },
  })

  const selectedItems = useWatch({
    control,
    name: 'requestedItems',
  }) ?? []

  useEffect(() => {
    async function loadOptions() {
      const equipment = await getAvailableEquipment()
      setEquipmentOptions(equipment.map((item) => ({ id: item.id, name: item.name })))
    }

    void loadOptions()
  }, [])

  const toggleEquipmentItem = (name: string) => {
    const current = selectedItems ?? []
    const next = current.includes(name)
      ? current.filter((item) => item !== name)
      : [...current, name]

    setValue('requestedItems', next, { shouldDirty: true, shouldValidate: true })
    if (next.length > 0) {
      clearErrors('requestedItems')
    }
  }

  const onSubmit = handleSubmit(async (values) => {
    if (!values.requestedItems.length) {
      setError('requestedItems', {
        type: 'manual',
        message: 'Selecteer minstens een apparaat.',
      })
      return
    }

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
          className="card-surface p-5 sm:p-6"
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

            <FormSelect
              id="activityType"
              label="Activiteit type"
              error={errors.activityType}
              {...register('activityType', {
                required: 'Activiteit type is verplicht.',
              })}
            >
              {activityTypes.map((activity) => (
                <option key={activity.value} value={activity.value} className="text-slate-900">
                  {activity.label}
                </option>
              ))}
            </FormSelect>

            <FormInput
              id="location"
              label="Plaats"
              placeholder="Studio A of buitenlocatie"
              error={errors.location}
              {...register('location', {
                required: 'Locatie is verplicht.',
              })}
            />

            <FormSelect
              id="priority"
              label="Prioriteit"
              error={errors.priority}
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
            </FormSelect>

            <FormInput
              id="requestDate"
              type="date"
              label="Datum"
              error={errors.requestDate}
              {...register('requestDate', {
                required: 'Datum is verplicht.',
              })}
            />

            <FormInput
              id="startTime"
              type="time"
              label="Starttijd"
              error={errors.startTime}
              {...register('startTime', {
                required: 'Starttijd is verplicht.',
              })}
            />

            <FormInput
              id="endTime"
              type="time"
              label="Eindtijd"
              error={errors.endTime}
              {...register('endTime', {
                required: 'Eindtijd is verplicht.',
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

            <div className="md:col-span-2">
              <FormTextarea
                id="purpose"
                rows={4}
                label="Omschrijving"
                placeholder="Omschrijf kort de activiteit en wat er nodig is"
                error={errors.purpose}
                {...register('purpose', {
                  required: 'Omschrijving is verplicht.',
                  minLength: {
                    value: 12,
                    message: 'Omschrijf de activiteit iets uitgebreider.',
                  },
                })}
              />
            </div>

            <div className="md:col-span-2">
              <div className="mb-2 text-sm font-medium text-slate-200">Apparatuur selectie</div>
              <div className="grid gap-3 md:grid-cols-2">
                {equipmentOptions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleEquipmentItem(item.name)}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      selectedItems?.includes(item.name)
                        ? 'border-brand-400 bg-brand-500/15 text-white'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/8'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
              {errors.requestedItems ? (
                <p className="mt-2 text-sm text-rose-300">{errors.requestedItems.message}</p>
              ) : null}
            </div>

            <div className="md:col-span-2">
              <FormTextarea
                id="notes"
                rows={3}
                label="Notities"
                placeholder="Extra wensen, pickup-tijd of aandachtspunten"
                {...register('notes')}
              />
            </div>
          </div>

          {submitError ? (
            <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {submitError}
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              type="submit"
              disabled={isSubmittingForm}
              size="lg"
            >
              {isSubmittingForm ? 'Aanvraag wordt opgeslagen...' : 'Aanvraag indienen'}
            </Button>
          </div>
        </form>

        <aside className="card-surface bg-panel-800/75 p-5">
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
