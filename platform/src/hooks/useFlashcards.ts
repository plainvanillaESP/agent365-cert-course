import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Question } from '@/lib/quiz'
import { getQuestionsForModule } from '@/lib/quiz'
import { CONTENT_MODULES } from '@/lib/course'
import { useCourseStorageKey } from '@/lib/storage'
import {
  type CardState,
  type SrsQuality,
  createCard,
  isDue,
  review,
} from '@/lib/srs'

/**
 * Maneja el deck completo de flashcards (todas las preguntas de todos
 * los módulos producidos). Persistencia en `agent365-srs-cards` como
 * un mapa `{ cardId → CardState }`. Si un cardId aparece por primera
 * vez (módulo nuevo o pregunta nueva), se crea con `createCard()` y
 * queda inmediatamente due.
 */

interface DeckEntry {
  question: Question
  state: CardState
  /** Slug del módulo (`modulo-01-...`) para mostrar contexto. */
  moduleSlug: string
  /** Id del módulo. */
  moduleId: number
}

export function useFlashcards(): {
  /** Todas las cards (vencidas o no), ordenadas por dueAt asc. */
  all: DeckEntry[]
  /** Solo las cards vencidas, ordenadas por dueAt asc. */
  due: DeckEntry[]
  /** Cuántas cards quedan vencidas hoy. */
  dueCount: number
  /** Procesa una revisión y devuelve el nuevo `due` (puede haber cambiado). */
  reviewCard: (cardId: string, quality: SrsQuality) => void
  /** Borra el progreso de SRS (con confirm del consumidor). */
  reset: () => void
} {
  const storageKey = useCourseStorageKey('srs-cards')
  const [statesById, setStatesById] = useState<Record<string, CardState>>(() =>
    loadCardStates(storageKey),
  )

  // Si el curso cambia, recarga el deck.
  useEffect(() => {
    setStatesById(loadCardStates(storageKey))
  }, [storageKey])

  // Persistencia en cada cambio.
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(statesById))
    } catch {
      /* localStorage bloqueado: ignorar */
    }
  }, [statesById, storageKey])

  // Conjunto plano de preguntas con su moduleId/slug.
  const questions = useMemo<DeckEntry[]>(() => {
    const out: DeckEntry[] = []
    const now = Date.now()
    for (const m of CONTENT_MODULES) {
      if (m.estado !== 'producido') continue
      const qs = getQuestionsForModule(m.id)
      for (const q of qs) {
        const state = statesById[q.id] ?? createCard(q.id, now)
        out.push({ question: q, state, moduleSlug: m.slug, moduleId: m.id })
      }
    }
    return out
  }, [statesById])

  const all = useMemo(
    () => [...questions].sort((a, b) => a.state.dueAt - b.state.dueAt),
    [questions],
  )
  const now = Date.now()
  const due = useMemo(
    () => all.filter(e => isDue(e.state, now)),
    [all, now],
  )

  const reviewCard = useCallback((cardId: string, quality: SrsQuality) => {
    setStatesById(prev => {
      const current = prev[cardId] ?? createCard(cardId)
      const next = review(current, quality)
      return { ...prev, [cardId]: next }
    })
  }, [])

  const reset = useCallback(() => {
    setStatesById({})
    try {
      localStorage.removeItem(storageKey)
    } catch {
      /* ignore */
    }
  }, [storageKey])

  return { all, due, dueCount: due.length, reviewCard, reset }
}

function loadCardStates(storageKey: string): Record<string, CardState> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}
