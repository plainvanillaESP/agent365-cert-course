/**
 * Spaced repetition (SM-2) sobre el banco de preguntas del curso.
 *
 * Cada pregunta del banco se trata como una flashcard. Tras cada
 * revisión, el alumno indica una "calidad" (0–5) y SM-2 recalcula:
 *
 *   - `repetitions`: aciertos consecutivos.
 *   - `easeFactor`:  factor de facilidad (2.5 por defecto, mínimo 1.3).
 *   - `interval`:    días hasta la próxima revisión.
 *   - `dueAt`:       ms timestamp en el que la card volverá a entrar.
 *
 * Reglas (SM-2 clásico):
 *
 *   - Si `quality < 3` (Again / Hard fail):
 *       repetitions = 0
 *       interval    = 1 día
 *   - Si `quality >= 3`:
 *       repetitions++
 *       interval =
 *         repetitions === 1 ? 1
 *         : repetitions === 2 ? 6
 *         : Math.round(prevInterval * easeFactor)
 *   - easeFactor += 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
 *     (cap inferior 1.3)
 *
 * Sin dependencia de React. Reutilizable desde cualquier shell.
 */

export type SrsQuality = 0 | 1 | 2 | 3 | 4 | 5

export interface CardState {
  cardId: string
  repetitions: number
  easeFactor: number
  /** Días hasta próxima revisión (último calculado). */
  interval: number
  /** ms timestamp en el que la card está "due". */
  dueAt: number
  /** ms timestamp del último review (null si nunca revisada). */
  lastReviewedAt: number | null
}

export const DEFAULT_EASE = 2.5
export const MIN_EASE = 1.3
const DAY_MS = 24 * 60 * 60 * 1000

export function createCard(cardId: string, now = Date.now()): CardState {
  return {
    cardId,
    repetitions: 0,
    easeFactor: DEFAULT_EASE,
    interval: 0,
    dueAt: now,
    lastReviewedAt: null,
  }
}

export function review(card: CardState, quality: SrsQuality, now = Date.now()): CardState {
  let { repetitions, easeFactor } = card
  let interval: number

  if (quality < 3) {
    repetitions = 0
    interval = 1
  } else {
    repetitions += 1
    if (repetitions === 1) interval = 1
    else if (repetitions === 2) interval = 6
    else interval = Math.round(card.interval * easeFactor)
  }

  // Ajuste de easeFactor.
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  if (easeFactor < MIN_EASE) easeFactor = MIN_EASE

  return {
    ...card,
    repetitions,
    easeFactor,
    interval,
    dueAt: now + interval * DAY_MS,
    lastReviewedAt: now,
  }
}

/** ¿Está vencida para revisar? */
export function isDue(card: CardState, now = Date.now()): boolean {
  return card.dueAt <= now
}

/** Útil para mostrar en la UI: "Próxima revisión en 3 días". */
export function humanizeInterval(days: number): string {
  if (days < 1) return 'hoy'
  if (days === 1) return '1 día'
  if (days < 30) return `${days} días`
  if (days < 365) {
    const m = Math.round(days / 30)
    return m === 1 ? '1 mes' : `${m} meses`
  }
  const y = Math.round(days / 365)
  return y === 1 ? '1 año' : `${y} años`
}
