import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  type LabAnswers,
  type LabExercise,
  type ProductId,
  emptyLabAnswers,
  countAnswered,
  countCorrect,
  getLabForModule,
} from '@/lib/labs'
import { useCourseStorageKey } from '@/lib/storage'

interface LabState {
  lab: LabExercise | null
  answers: LabAnswers
  /** Snapshot de respuestas tras pulsar Validar. Si null, sigue en edición. */
  validated: LabAnswers | null

  setAnswer: (scenarioId: string, productId: ProductId | null) => void
  validate: () => void
  reset: () => void

  // Helpers
  answeredCount: number
  correctCount: number
  totalScenarios: number
}

export function useLabState(moduleId: number): LabState {
  const lab = useMemo(() => getLabForModule(moduleId), [moduleId])
  const stateKey = useCourseStorageKey(`lab-m${moduleId}-state`)

  const [answers, setAnswers] = useState<LabAnswers>(() => (lab ? emptyLabAnswers(lab) : {}))
  const [validated, setValidated] = useState<LabAnswers | null>(null)

  // Cargar respuestas en progreso desde localStorage al montar
  useEffect(() => {
    if (!lab) return
    try {
      const raw = localStorage.getItem(stateKey)
      if (raw) {
        const parsed = JSON.parse(raw) as { answers?: LabAnswers; validated?: LabAnswers | null }
        if (parsed?.answers) setAnswers({ ...emptyLabAnswers(lab), ...parsed.answers })
        if (parsed?.validated) setValidated(parsed.validated)
      }
    } catch {
      /* corrupt JSON, ignore */
    }
  }, [lab, stateKey])

  // Persistir cambios
  useEffect(() => {
    if (!lab) return
    try {
      localStorage.setItem(stateKey, JSON.stringify({ answers, validated }))
    } catch {
      /* localStorage bloqueado, ignore */
    }
  }, [answers, validated, lab, stateKey])

  // Reset al cambiar de módulo
  useEffect(() => {
    if (lab) setAnswers(emptyLabAnswers(lab))
    setValidated(null)
  }, [lab])

  const setAnswer = useCallback(
    (scenarioId: string, productId: ProductId | null) => {
      if (validated) return // bloqueado tras validar hasta reset
      setAnswers(prev => ({ ...prev, [scenarioId]: productId }))
    },
    [validated],
  )

  const validate = useCallback(() => {
    if (!lab) return
    setValidated(answers)
  }, [answers, lab])

  const reset = useCallback(() => {
    if (!lab) return
    setAnswers(emptyLabAnswers(lab))
    setValidated(null)
  }, [lab])

  const answeredCount = lab ? countAnswered(lab, answers) : 0
  const correctCount = lab && validated ? countCorrect(lab, validated) : 0
  const totalScenarios = lab ? lab.scenarios.length : 0

  return {
    lab,
    answers,
    validated,
    setAnswer,
    validate,
    reset,
    answeredCount,
    correctCount,
    totalScenarios,
  }
}
