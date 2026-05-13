/**
 * Hook que gestiona el ciclo completo del examen final.
 *
 * Estados:
 *   - 'pre-start': aún no se ha iniciado el intento actual
 *   - 'in-progress': intento en curso, timer activo, respuestas editables
 *   - 'result': intento enviado, resultado visible, edición bloqueada
 *
 * Persistencia (localStorage):
 *   - `agent365-exam-current`: snapshot del intento en curso (preguntas
 *     seleccionadas, respuestas parciales, deadline ISO). Permite sobrevivir
 *     un refresh accidental sin perder progreso ni regalar tiempo.
 *   - `agent365-exam-history`: array de intentos enviados con score y pass/fail.
 *     Determina cuántos intentos quedan y si hay cooldown activo.
 *
 * Auto-submit:
 *   - Cuando el reloj llega a 00:00, se ejecuta `submit()` automáticamente
 *     con las respuestas presentes (incompletas cuentan como incorrectas).
 *   - El timer corre sobre `deadline` (timestamp absoluto), no sobre un
 *     contador incremental. Eso evita drift y resiste a navegar fuera de la
 *     pestaña.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  type Answer,
  type Question,
  emptyAnswerFor,
  isAnswerCorrect,
} from '../lib/quiz'
import {
  EXAM_COOLDOWN_DAYS,
  EXAM_DURATION_MIN,
  EXAM_MAX_ATTEMPTS,
  EXAM_NUM_QUESTIONS,
  scoreExam,
  selectExamQuestions,
  type ExamScoring,
} from '../lib/exam'
import { useCourseStorageKey } from '@/lib/storage'

export type ExamPhase = 'pre-start' | 'in-progress' | 'result'

export interface ExamAttempt {
  /** id único del intento. */
  id: string
  /** timestamp de inicio. */
  startedAt: number
  /** timestamp de envío (auto o manual). */
  submittedAt: number
  /** segundos de duración real (puede ser menor que `EXAM_DURATION_MIN * 60`). */
  durationSec: number
  /** si la sumisión fue por timeout (auto) o manual. */
  reason: 'manual' | 'timeout'
  /** snapshot de scoring del intento. */
  scoring: ExamScoring
  /** ids de las preguntas presentadas, en el orden mostrado. */
  questionIds: string[]
  /**
   * Respuestas del alumno indexadas por questionId. Incluye respuestas
   * incompletas (auto-submit por timeout) representadas con su `emptyAnswerFor`.
   * Se persisten para permitir la revisión post-examen.
   */
  answers: Record<string, Answer>
  /**
   * Para cada questionId, indica si la respuesta del alumno fue correcta.
   * Equivalente a recalcular `isAnswerCorrect` por cada pregunta, pero
   * cacheado en el intento para no depender del banco en la revisión.
   */
  perQuestionCorrect: Record<string, boolean>
}

interface CurrentSnapshot {
  attemptId: string
  startedAt: number
  /** timestamp en ms en el que el examen debe finalizar. */
  deadline: number
  /** preguntas presentadas, snapshot serializado. */
  questions: Question[]
  /** respuestas en curso. */
  answers: Record<string, Answer>
}

interface UseExamStateReturn {
  phase: ExamPhase
  /** preguntas del intento en curso (vacío fuera de in-progress). */
  questions: Question[]
  /** respuestas del intento en curso o del último intento, según fase. */
  answers: Record<string, Answer>
  /** resultado del último intento (solo en 'result'). */
  lastResult: ExamAttempt | null
  /** historial completo de intentos, orden cronológico. */
  history: ExamAttempt[]
  /** segundos restantes en el intento en curso. */
  remainingSec: number
  /** intentos disponibles antes del cooldown. */
  attemptsRemaining: number
  /** si hay cooldown activo, devuelve timestamp ms en que se libera. */
  cooldownUntil: number | null

  start: () => void
  setAnswer: (questionId: string, answer: Answer) => void
  submit: () => void
  reset: () => void
  clearHistory: () => void
}

/* ------------------------------ utilidades -------------------------------- */

function loadJSON<T>(key: string): T | null {
  if (typeof localStorage === 'undefined') return null
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function saveJSON(key: string, val: unknown): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(val))
  } catch {
    /* localStorage bloqueado, ignorar */
  }
}

function makeId(): string {
  // No necesitamos cripto, basta con timestamp + random corto.
  return `${Date.now().toString(36)}-${Math.floor(Math.random() * 0xffff).toString(36)}`
}

function buildEmptyAnswers(qs: Question[]): Record<string, Answer> {
  const out: Record<string, Answer> = {}
  for (const q of qs) out[q.id] = emptyAnswerFor(q)
  return out
}

function computeCooldown(history: ExamAttempt[]): number | null {
  if (history.length < EXAM_MAX_ATTEMPTS) return null
  // Tomamos los últimos `EXAM_MAX_ATTEMPTS` intentos: si NINGUNO fue passed,
  // hay cooldown desde el más reciente.
  const recent = history.slice(-EXAM_MAX_ATTEMPTS)
  const anyPassed = recent.some(a => a.scoring.passed)
  if (anyPassed) return null
  const latest = recent[recent.length - 1].submittedAt
  return latest + EXAM_COOLDOWN_DAYS * 24 * 60 * 60 * 1000
}

/* --------------------------------- hook ----------------------------------- */

export function useExamState(): UseExamStateReturn {
  const CURRENT_KEY = useCourseStorageKey('exam-current')
  const HISTORY_KEY = useCourseStorageKey('exam-history')
  const [phase, setPhase] = useState<ExamPhase>('pre-start')
  const [current, setCurrent] = useState<CurrentSnapshot | null>(null)
  const [lastResult, setLastResult] = useState<ExamAttempt | null>(null)
  const [history, setHistory] = useState<ExamAttempt[]>([])
  const [now, setNow] = useState<number>(() => Date.now())
  // Necesitamos llamar a submit desde el efecto del timer, pero submit
  // depende de current. Lo aliasamos con ref para evitar bucles.
  const submitRef = useRef<(reason: 'manual' | 'timeout') => void>(() => {})

  // Carga inicial: historial y, si hay intento previo en curso aún válido, reanudar.
  useEffect(() => {
    const persistedHistory = loadJSON<ExamAttempt[]>(HISTORY_KEY) ?? []
    setHistory(persistedHistory)

    const persistedCurrent = loadJSON<CurrentSnapshot>(CURRENT_KEY)
    if (persistedCurrent && persistedCurrent.deadline > Date.now()) {
      setCurrent(persistedCurrent)
      setPhase('in-progress')
    } else if (persistedCurrent && persistedCurrent.deadline <= Date.now()) {
      // El intento expiró mientras estábamos fuera. Auto-submit retroactivo.
      void persistedCurrent
      // Reusa la lógica de submit en el siguiente tick (ya con estado cargado).
      // Vamos a forzar la sumisión inmediata aquí.
      const auto = buildAttemptFromSnapshot(persistedCurrent, 'timeout', persistedCurrent.deadline)
      const newHistory = [...persistedHistory, auto]
      setHistory(newHistory)
      setLastResult(auto)
      setPhase('result')
      saveJSON(HISTORY_KEY, newHistory)
      if (typeof localStorage !== 'undefined') localStorage.removeItem(CURRENT_KEY)
    }
  }, [])

  // Tick del reloj cuando hay intento en curso.
  useEffect(() => {
    if (phase !== 'in-progress' || !current) return
    const tick = () => {
      const t = Date.now()
      setNow(t)
      if (t >= current.deadline) {
        submitRef.current('timeout')
      }
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [phase, current])

  const start = useCallback(() => {
    if (phase === 'in-progress') return
    const questions = selectExamQuestions(EXAM_NUM_QUESTIONS)
    if (questions.length === 0) {
      // Banco vacío, no podemos arrancar.
      console.warn('[exam] Banco vacío, no se puede iniciar el examen.')
      return
    }
    const startedAt = Date.now()
    const deadline = startedAt + EXAM_DURATION_MIN * 60 * 1000
    const snap: CurrentSnapshot = {
      attemptId: makeId(),
      startedAt,
      deadline,
      questions,
      answers: buildEmptyAnswers(questions),
    }
    setCurrent(snap)
    setLastResult(null)
    setPhase('in-progress')
    saveJSON(CURRENT_KEY, snap)
  }, [phase])

  const setAnswer = useCallback(
    (questionId: string, answer: Answer) => {
      if (phase !== 'in-progress' || !current) return
      setCurrent(prev => {
        if (!prev) return prev
        const updated: CurrentSnapshot = {
          ...prev,
          answers: { ...prev.answers, [questionId]: answer },
        }
        saveJSON(CURRENT_KEY, updated)
        return updated
      })
    },
    [phase, current],
  )

  const submit = useCallback(
    (reason: 'manual' | 'timeout' = 'manual') => {
      if (phase !== 'in-progress' || !current) return
      const submittedAt = Math.min(Date.now(), current.deadline)
      const attempt = buildAttemptFromSnapshot(current, reason, submittedAt)
      const newHistory = [...history, attempt]
      setHistory(newHistory)
      setLastResult(attempt)
      setPhase('result')
      setCurrent(null)
      saveJSON(HISTORY_KEY, newHistory)
      if (typeof localStorage !== 'undefined') localStorage.removeItem(CURRENT_KEY)
    },
    [phase, current, history],
  )

  // Mantenemos la ref al último `submit` para el ciclo de auto-submit en timeout.
  useEffect(() => {
    submitRef.current = submit
  }, [submit])

  const reset = useCallback(() => {
    setPhase('pre-start')
    setCurrent(null)
    setLastResult(null)
    if (typeof localStorage !== 'undefined') localStorage.removeItem(CURRENT_KEY)
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    setLastResult(null)
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(HISTORY_KEY)
      localStorage.removeItem(CURRENT_KEY)
    }
    setCurrent(null)
    setPhase('pre-start')
  }, [])

  const remainingSec = useMemo(() => {
    if (phase !== 'in-progress' || !current) return 0
    return Math.max(0, Math.ceil((current.deadline - now) / 1000))
  }, [phase, current, now])

  const cooldownUntil = useMemo(() => computeCooldown(history), [history])
  const attemptsRemaining = useMemo(() => {
    // Si el último intento aprobó, no se ofrecen más intentos.
    const lastPassed = history.length > 0 && history[history.length - 1].scoring.passed
    if (lastPassed) return 0
    if (cooldownUntil && cooldownUntil > Date.now()) return 0
    // Cooldown ya pasado o todavía no se han usado los 3: reseteamos el ciclo
    // de cuenta a partir del cooldown pasado.
    if (cooldownUntil && cooldownUntil <= Date.now()) {
      return EXAM_MAX_ATTEMPTS
    }
    return Math.max(0, EXAM_MAX_ATTEMPTS - history.length)
  }, [history, cooldownUntil])

  return {
    phase,
    questions: phase === 'in-progress' ? (current?.questions ?? []) : [],
    answers: phase === 'in-progress' ? (current?.answers ?? {}) : (lastResult?.answers ?? {}),
    lastResult,
    history,
    remainingSec,
    attemptsRemaining,
    cooldownUntil,
    start,
    setAnswer,
    submit: () => submit('manual'),
    reset,
    clearHistory,
  }
}

/* ------------------------- helpers de construcción ------------------------ */

function buildAttemptFromSnapshot(
  snap: CurrentSnapshot,
  reason: 'manual' | 'timeout',
  submittedAt: number,
): ExamAttempt {
  const perQ: Record<string, boolean> = {}
  for (const q of snap.questions) {
    const a = snap.answers[q.id]
    perQ[q.id] = !!a && isAnswerCorrect(q, a)
  }
  const scoring = scoreExam(snap.questions, perQ)
  return {
    id: snap.attemptId,
    startedAt: snap.startedAt,
    submittedAt,
    durationSec: Math.max(0, Math.round((submittedAt - snap.startedAt) / 1000)),
    reason,
    scoring,
    questionIds: snap.questions.map(q => q.id),
    answers: snap.answers,
    perQuestionCorrect: perQ,
  }
}
