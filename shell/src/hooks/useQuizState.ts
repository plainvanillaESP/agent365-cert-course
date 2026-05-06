import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  type Answer,
  type Question,
  emptyAnswerFor,
  getQuestionsForModule,
  isAnswerComplete,
  isAnswerCorrect,
} from '@/lib/quiz'

interface QuizAttempt {
  startedAt: number
  submittedAt: number
  /** questionId → answer */
  answers: Record<string, Answer>
  score: number
  total: number
}

interface QuizState {
  questions: Question[]
  /** questionId → answer en el intento actual (no enviado) */
  currentAnswers: Record<string, Answer>
  /** Una vez se valida y se envía el intento, esto se llena. Mientras es null estamos en modo edición. */
  submission: { answers: Record<string, Answer>; score: number; total: number } | null
  /** Historial de intentos enviados, persistido en localStorage. */
  history: QuizAttempt[]

  // Acciones
  setAnswer: (questionId: string, answer: Answer) => void
  validate: () => void
  reset: () => void
  clearHistory: () => void

  // Helpers derivados
  allComplete: boolean
}

const HISTORY_KEY_PREFIX = 'agent365-quiz-m'

export function useQuizState(moduleId: number): QuizState {
  const questions = useMemo(() => getQuestionsForModule(moduleId), [moduleId])
  const historyKey = `${HISTORY_KEY_PREFIX}${moduleId}-history`

  const buildEmptyAnswers = useCallback(() => {
    const empty: Record<string, Answer> = {}
    for (const q of questions) {
      empty[q.id] = emptyAnswerFor(q)
    }
    return empty
  }, [questions])

  const [currentAnswers, setCurrentAnswers] = useState<Record<string, Answer>>(buildEmptyAnswers)
  const [submission, setSubmission] = useState<QuizState['submission']>(null)
  const [history, setHistory] = useState<QuizAttempt[]>([])
  const [startedAt] = useState(() => Date.now())

  // Carga inicial del historial desde localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(historyKey)
      if (raw) {
        const parsed = JSON.parse(raw) as QuizAttempt[]
        if (Array.isArray(parsed)) setHistory(parsed)
      }
    } catch {
      /* ignorar JSON corrupto */
    }
  }, [historyKey])

  // Reset si cambia el módulo
  useEffect(() => {
    setCurrentAnswers(buildEmptyAnswers())
    setSubmission(null)
  }, [buildEmptyAnswers])

  const setAnswer = useCallback(
    (questionId: string, answer: Answer) => {
      // No permitir editar tras validar (hasta reset)
      if (submission) return
      setCurrentAnswers(prev => ({ ...prev, [questionId]: answer }))
    },
    [submission],
  )

  const allComplete = useMemo(
    () => questions.every(q => isAnswerComplete(q, currentAnswers[q.id])),
    [questions, currentAnswers],
  )

  const validate = useCallback(() => {
    if (!allComplete || submission) return

    let score = 0
    for (const q of questions) {
      if (isAnswerCorrect(q, currentAnswers[q.id])) score++
    }
    const total = questions.length

    const attempt: QuizAttempt = {
      startedAt,
      submittedAt: Date.now(),
      answers: currentAnswers,
      score,
      total,
    }

    const newHistory = [...history, attempt]
    setHistory(newHistory)
    setSubmission({ answers: currentAnswers, score, total })

    try {
      localStorage.setItem(historyKey, JSON.stringify(newHistory))
    } catch {
      /* fallar silenciosamente si localStorage está bloqueado */
    }
  }, [questions, currentAnswers, allComplete, submission, history, historyKey, startedAt])

  const reset = useCallback(() => {
    setCurrentAnswers(buildEmptyAnswers())
    setSubmission(null)
  }, [buildEmptyAnswers])

  const clearHistory = useCallback(() => {
    setHistory([])
    try {
      localStorage.removeItem(historyKey)
    } catch {
      /* ignorar */
    }
  }, [historyKey])

  return {
    questions,
    currentAnswers,
    submission,
    history,
    setAnswer,
    validate,
    reset,
    clearHistory,
    allComplete,
  }
}
