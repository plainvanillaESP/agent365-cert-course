import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  type Answer,
  type Question,
  emptyAnswerFor,
  getQuestionsForModule,
  isAnswerComplete,
  isAnswerCorrect,
} from '@/lib/quiz'
import { useCourseStorageKey } from '@/lib/storage'

interface QuizAttempt {
  startedAt: number
  submittedAt: number
  /** questionId → answer */
  answers: Record<string, Answer>
  score: number
  total: number
}

/**
 * Modo de práctica:
 *
 *   - `full`     — el quiz oficial del módulo. Persiste en `history` y
 *                  cuenta para el motor de progreso (Bloque D.2).
 *   - `adaptive` — ronda de repaso con solo las preguntas que el alumno
 *                  acaba de fallar. NO persiste en `history`. Las que
 *                  se aciertan entran en `cooldown` y desaparecen de
 *                  futuras rondas adaptativas hasta expirar.
 */
type PracticeMode = 'full' | 'adaptive'

/** ms timestamp hasta el que una pregunta está en cooldown adaptativo. */
type Cooldowns = Record<string, number>

interface QuizState {
  /** Preguntas visibles en el modo de práctica actual. */
  questions: Question[]
  /** Modo en uso. */
  mode: PracticeMode
  /** questionId → answer en el intento actual (no enviado) */
  currentAnswers: Record<string, Answer>
  /** Una vez se valida y se envía el intento, esto se llena. Mientras es null estamos en modo edición. */
  submission: { answers: Record<string, Answer>; score: number; total: number } | null
  /** Historial de intentos enviados, persistido en localStorage (solo modo `full`). */
  history: QuizAttempt[]

  // Acciones
  setAnswer: (questionId: string, answer: Answer) => void
  validate: () => void
  /** Reinicia y vuelve al modo `full` (quiz oficial completo). */
  reset: () => void
  /**
   * Pasa a modo `adaptive` con las preguntas que falló en la última
   * submisión. Si no hay submisión o no falló nada, no hace nada.
   */
  startAdaptiveRound: () => void
  clearHistory: () => void

  // Helpers derivados
  allComplete: boolean
  /** Cuántas preguntas falló en la última submisión (modo `full`). */
  lastFailedCount: number
  /**
   * Cuántas preguntas falladas siguen "vivas" para un repaso adaptativo
   * (es decir, no están en cooldown). 0 si no hay submisión.
   */
  adaptivePendingCount: number
}


/**
 * Cooldown tras acertar una pregunta en una ronda adaptativa: 30 min.
 * No es spaced repetition completo (eso entra en otra fase con flashcards);
 * solo evita que la misma pregunta acertada salga inmediatamente en la
 * siguiente ronda.
 */
const ADAPTIVE_COOLDOWN_MS = 30 * 60 * 1000

export function useQuizState(moduleId: number): QuizState {
  const allQuestions = useMemo(() => getQuestionsForModule(moduleId), [moduleId])
  const historyKey = useCourseStorageKey(`quiz-m${moduleId}-history`)
  const cooldownsKey = useCourseStorageKey(`quiz-m${moduleId}-cooldowns`)

  const buildEmptyAnswers = useCallback(
    (questions: Question[]) => {
      const empty: Record<string, Answer> = {}
      for (const q of questions) {
        empty[q.id] = emptyAnswerFor(q)
      }
      return empty
    },
    [],
  )

  // Modo de práctica + el subset visible que ese modo expone.
  const [mode, setMode] = useState<PracticeMode>('full')
  const [adaptiveQuestionIds, setAdaptiveQuestionIds] = useState<string[]>([])
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, Answer>>(() =>
    buildEmptyAnswers(allQuestions),
  )
  const [submission, setSubmission] = useState<QuizState['submission']>(null)
  const [history, setHistory] = useState<QuizAttempt[]>([])
  const [cooldowns, setCooldowns] = useState<Cooldowns>({})
  const [startedAt, setStartedAt] = useState(() => Date.now())

  // Las preguntas visibles dependen del modo.
  const questions = useMemo(() => {
    if (mode === 'full') return allQuestions
    const set = new Set(adaptiveQuestionIds)
    return allQuestions.filter(q => set.has(q.id))
  }, [mode, allQuestions, adaptiveQuestionIds])

  // Carga inicial del historial y de los cooldowns desde localStorage.
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
    try {
      const raw = localStorage.getItem(cooldownsKey)
      if (raw) {
        const parsed = JSON.parse(raw) as Cooldowns
        if (parsed && typeof parsed === 'object') {
          // Limpieza: descarta los cooldowns ya expirados al cargar.
          const now = Date.now()
          const fresh: Cooldowns = {}
          for (const [id, until] of Object.entries(parsed)) {
            if (typeof until === 'number' && until > now) fresh[id] = until
          }
          setCooldowns(fresh)
        }
      }
    } catch {
      /* ignorar */
    }
  }, [historyKey, cooldownsKey])

  // Reset si cambia el módulo: vuelve a modo `full` con preguntas vacías.
  useEffect(() => {
    setMode('full')
    setAdaptiveQuestionIds([])
    setCurrentAnswers(buildEmptyAnswers(allQuestions))
    setSubmission(null)
    setStartedAt(Date.now())
  }, [allQuestions, buildEmptyAnswers])

  const setAnswer = useCallback(
    (questionId: string, answer: Answer) => {
      // No permitir editar tras validar (hasta reset o nueva ronda).
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
    const correctIds: string[] = []
    for (const q of questions) {
      if (isAnswerCorrect(q, currentAnswers[q.id])) {
        score++
        correctIds.push(q.id)
      }
    }
    const total = questions.length

    setSubmission({ answers: currentAnswers, score, total })

    if (mode === 'full') {
      // Persiste en historial y notifica al motor de progreso.
      const attempt: QuizAttempt = {
        startedAt,
        submittedAt: Date.now(),
        answers: currentAnswers,
        score,
        total,
      }
      const newHistory = [...history, attempt]
      setHistory(newHistory)
      try {
        localStorage.setItem(historyKey, JSON.stringify(newHistory))
        window.dispatchEvent(new CustomEvent('pv-learn-progress-changed'))
      } catch {
        /* fallar silenciosamente si localStorage está bloqueado */
      }
    } else {
      // Modo adaptativo: las acertadas entran en cooldown. NO se actualiza
      // history ni se notifica al motor (no es un intento oficial).
      if (correctIds.length > 0) {
        const until = Date.now() + ADAPTIVE_COOLDOWN_MS
        const next: Cooldowns = { ...cooldowns }
        for (const id of correctIds) next[id] = until
        setCooldowns(next)
        try {
          localStorage.setItem(cooldownsKey, JSON.stringify(next))
        } catch {
          /* ignorar */
        }
      }
    }
  }, [
    questions,
    currentAnswers,
    allComplete,
    submission,
    history,
    historyKey,
    startedAt,
    mode,
    cooldowns,
    cooldownsKey,
  ])

  const reset = useCallback(() => {
    setMode('full')
    setAdaptiveQuestionIds([])
    setCurrentAnswers(buildEmptyAnswers(allQuestions))
    setSubmission(null)
    setStartedAt(Date.now())
  }, [buildEmptyAnswers, allQuestions])

  // Preguntas falladas en la última submisión (modo `full` activo).
  const lastFailedIds = useMemo(() => {
    if (!submission) return []
    const failed: string[] = []
    for (const q of allQuestions) {
      const a = submission.answers[q.id]
      if (a !== undefined && !isAnswerCorrect(q, a)) failed.push(q.id)
    }
    return failed
  }, [submission, allQuestions])

  // Las falladas que NO están en cooldown se pueden volver a practicar.
  const adaptivePending = useMemo(() => {
    const now = Date.now()
    return lastFailedIds.filter(id => !cooldowns[id] || cooldowns[id] <= now)
  }, [lastFailedIds, cooldowns])

  const startAdaptiveRound = useCallback(() => {
    if (adaptivePending.length === 0) return
    const next = allQuestions.filter(q => adaptivePending.includes(q.id))
    setMode('adaptive')
    setAdaptiveQuestionIds(next.map(q => q.id))
    setCurrentAnswers(buildEmptyAnswers(next))
    setSubmission(null)
    setStartedAt(Date.now())
  }, [adaptivePending, allQuestions, buildEmptyAnswers])

  const clearHistory = useCallback(() => {
    setHistory([])
    setCooldowns({})
    try {
      localStorage.removeItem(historyKey)
      localStorage.removeItem(cooldownsKey)
      window.dispatchEvent(new CustomEvent('pv-learn-progress-changed'))
    } catch {
      /* ignorar */
    }
  }, [historyKey, cooldownsKey])

  return {
    questions,
    mode,
    currentAnswers,
    submission,
    history,
    setAnswer,
    validate,
    reset,
    startAdaptiveRound,
    clearHistory,
    allComplete,
    lastFailedCount: lastFailedIds.length,
    adaptivePendingCount: adaptivePending.length,
  }
}
