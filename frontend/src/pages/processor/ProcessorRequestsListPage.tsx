import { useEffect, useState } from 'react'
import { LoadingScreen } from '../../components/common/LoadingScreen'
import { PageHeader } from '../../components/dashboard/PageHeader'
import {
  getAllProcessorRequests,
  getProcessorRequestsByStatus,
} from '../../services/mock/processorService'
import type { ProcessorRequest, ProcessorRequestStatus } from '../../types/processor'
import { ProcessorRequestTable } from './ProcessorRequestTable'

interface ProcessorRequestsListPageProps {
  mode: 'all' | ProcessorRequestStatus
}

const copy = {
  all: {
    eyebrow: 'Alle aanvragen',
    title: 'Volledige aanvraaglijst',
    description: 'Overzicht van alle aanvragen die door Level 2 verwerkt of opgevolgd moeten worden.',
  },
  pending: {
    eyebrow: 'Pending aanvragen',
    title: 'Aanvragen die op verwerking wachten',
    description: 'Controleer nieuwe of nog niet afgehandelde aanvragen en zet de volgende stap.',
  },
  approved: {
    eyebrow: 'Goedgekeurde aanvragen',
    title: 'Aanvragen die zijn vrijgegeven',
    description: 'Gebruik deze lijst voor voorbereiding, uitgifte en verdere coördinatie.',
  },
  in_use: {
    eyebrow: 'In gebruik aanvragen',
    title: 'Apparatuur die momenteel buiten staat',
    description: 'Monitor welke sets in gebruik zijn en wanneer retour verwacht wordt.',
  },
  rejected: {
    eyebrow: 'Afgekeurde aanvragen',
    title: 'Aanvragen die zijn afgekeurd',
    description: 'Overzicht van aanvragen die niet zijn goedgekeurd en opvolging nodig hebben.',
  },
  returned: {
    eyebrow: 'Retour registraties',
    title: 'Aanvragen die retour zijn geboekt',
    description: 'Gebruik deze lijst om afgeronde opdrachten en teruggebrachte sets te volgen.',
  },
} as const

export function ProcessorRequestsListPage({ mode }: ProcessorRequestsListPageProps) {
  const [requests, setRequests] = useState<ProcessorRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadRequests() {
      setIsLoading(true)
      setError('')

      try {
        const data =
          mode === 'all'
            ? await getAllProcessorRequests()
            : await getProcessorRequestsByStatus(mode)

        setRequests(data)
      } catch {
        setError('Aanvragen konden niet worden geladen.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadRequests()
  }, [mode])

  if (isLoading) {
    return <LoadingScreen message="Aanvragen worden geladen..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={copy[mode].eyebrow}
        title={copy[mode].title}
        description={copy[mode].description}
      />

      {error ? (
        <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-6 text-sm text-rose-100">
          {error}
        </div>
      ) : (
        <ProcessorRequestTable requests={requests} />
      )}
    </div>
  )
}
