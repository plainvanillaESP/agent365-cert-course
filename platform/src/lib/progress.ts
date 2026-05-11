/**
 * Motor de progreso del alumno (Bloque D.2).
 *
 * Lee el estado persistido en localStorage por los componentes que ya
 * registran actividad del alumno (ScrollProgress, useQuizState) y por
 * los visit-trackers que añadimos en este bloque (laboratorios y
 * recursos). Calcula el estado de cada sección de un módulo según los
 * criterios canónicos del programa:
 *
 *   - teoria         → completa cuando el alumno ha hecho scroll
 *                      hasta al menos `THEORY_THRESHOLD_PCT` del
 *                      contenido en algún momento
 *   - quiz-practica  → completa cuando hay al menos un intento
 *                      enviado con score >= `QUIZ_PASS_RATIO`
 *   - laboratorios   → completa cuando el alumno ha visitado la sección
 *   - recursos       → completa cuando el alumno ha visitado la sección
 *
 * Diseño del store:
 *   - El módulo de progreso NO duplica datos. Lee directamente los keys
 *     de localStorage que ya escriben otros componentes:
 *       agent365-reading-m{N}-teoria   → maxPct persistido por
 *                                        ScrollProgress
 *       agent365-quiz-m{N}-history     → historial persistido por
 *                                        useQuizState
 *   - Las visitas a laboratorios y recursos se persisten en un único
 *     key acumulativo: agent365-section-visits.
 *
 *   Esta separación evita inconsistencias al cambiar el formato de un
 *   sub-store y mantiene a cada componente como única fuente de su
 *   propio estado, pero centraliza la lectura para vistas agregadas.
 */

import type { ContentType } from './content'

export const THEORY_THRESHOLD_PCT = 80
export const QUIZ_PASS_RATIO = 0.7

/* ------------------------------ Tipos públicos ------------------------------ */

export type SectionStatus = 'not-started' | 'in-progress' | 'completed'

export interface SectionState {
  status: SectionStatus
  /** Detalle por sección. Null si no aplica al tipo. */
  detail?: SectionDetail
}

export interface SectionDetail {
  /** teoria: porcentaje máximo de scroll alcanzado (0-100) */
  scrollMaxPct?: number
  /** quiz-practica: mejor ratio score/total (0-1) */
  bestRatio?: number
  /** quiz-practica: número de intentos enviados */
  attempts?: number
  /** laboratorios / recursos: timestamp de la primera visita */
  visitedAt?: number
}

export interface ModuleProgressSnapshot {
  moduleId: number
  sections: Record<TrackedSection, SectionState>
  /** Resumen: cuántas secciones del módulo se consideran completas */
  completedCount: number
  totalSections: number
  /** true si TODAS las secciones del módulo están en `completed` */
  isModuleComplete: boolean
}

/** Las secciones del módulo que el motor de progreso rastrea. */
export type TrackedSection = Extract<ContentType, 'teoria' | 'laboratorios' | 'quiz-practica' | 'recursos'>

export const TRACKED_SECTIONS: TrackedSection[] = ['teoria', 'laboratorios', 'quiz-practica', 'recursos']

/* ----------------------------- Keys localStorage ---------------------------- */

const READING_KEY = (moduleId: number, section: TrackedSection): string =>
  `agent365-reading-m${moduleId}-${section}`

const QUIZ_HISTORY_KEY = (moduleId: number): string => `agent365-quiz-m${moduleId}-history`

const SECTION_VISITS_KEY = 'agent365-section-visits'

/* ----------------------- Lectura de estado por componente ------------------ */

interface PersistedReading {
  maxPct?: number
  lastScrollY?: number
  updatedAt?: number
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function getReadingMaxPct(moduleId: number, section: TrackedSection): number {
  if (typeof localStorage === 'undefined') return 0
  const data = safeParse<PersistedReading>(localStorage.getItem(READING_KEY(moduleId, section)))
  return typeof data?.maxPct === 'number' ? Math.max(0, Math.min(100, data.maxPct)) : 0
}

interface QuizAttempt {
  score: number
  total: number
}

function getQuizStats(moduleId: number): { bestRatio: number; attempts: number } {
  if (typeof localStorage === 'undefined') return { bestRatio: 0, attempts: 0 }
  const history = safeParse<QuizAttempt[]>(localStorage.getItem(QUIZ_HISTORY_KEY(moduleId)))
  if (!Array.isArray(history) || history.length === 0) return { bestRatio: 0, attempts: 0 }
  let bestRatio = 0
  for (const a of history) {
    if (a && typeof a.score === 'number' && typeof a.total === 'number' && a.total > 0) {
      const ratio = a.score / a.total
      if (ratio > bestRatio) bestRatio = ratio
    }
  }
  return { bestRatio, attempts: history.length }
}

interface VisitsMap {
  /** Key compuesto: `m{N}-{section}`. Valor: timestamp de la primera visita. */
  [key: string]: number
}

function getVisits(): VisitsMap {
  if (typeof localStorage === 'undefined') return {}
  const data = safeParse<VisitsMap>(localStorage.getItem(SECTION_VISITS_KEY))
  return data && typeof data === 'object' ? data : {}
}

function visitKey(moduleId: number, section: TrackedSection): string {
  return `m${moduleId}-${section}`
}

/* ------------------------------ API pública -------------------------------- */

/**
 * Marca una sección como visitada (idempotente). Si ya existe una visita
 * previa, no la sobrescribe (mantiene el primer timestamp). Dispara un
 * `CustomEvent('progress-changed')` en window para que los hooks
 * activos se refresquen sin esperar a un reload.
 */
export function markSectionVisited(moduleId: number, section: TrackedSection): void {
  if (typeof localStorage === 'undefined') return
  const visits = getVisits()
  const key = visitKey(moduleId, section)
  if (visits[key]) return // ya estaba registrada
  visits[key] = Date.now()
  try {
    localStorage.setItem(SECTION_VISITS_KEY, JSON.stringify(visits))
    notifyProgressChanged()
  } catch {
    /* localStorage bloqueado, ignore */
  }
}

/**
 * Borra todo el progreso del alumno (todas las claves del motor).
 * Útil para un futuro botón "Reiniciar progreso" en settings.
 */
export function clearAllProgress(): void {
  if (typeof localStorage === 'undefined') return
  const keys: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (!k) continue
    if (k.startsWith('agent365-reading-m') || k.startsWith('agent365-quiz-m') || k === SECTION_VISITS_KEY) {
      keys.push(k)
    }
  }
  for (const k of keys) localStorage.removeItem(k)
  notifyProgressChanged()
}

/**
 * Calcula el snapshot de progreso de un módulo leyendo los stores
 * subyacentes en este momento. Es síncrono y barato (~4 lecturas de
 * localStorage). El hook `useModuleProgress` lo llama en cada
 * notificación de cambio.
 */
export function readModuleProgress(moduleId: number): ModuleProgressSnapshot {
  const visits = getVisits()
  const sections: Record<TrackedSection, SectionState> = {
    teoria: computeTeoriaState(moduleId),
    'quiz-practica': computeQuizState(moduleId),
    laboratorios: computeVisitState(moduleId, 'laboratorios', visits),
    recursos: computeVisitState(moduleId, 'recursos', visits),
  }

  let completedCount = 0
  for (const s of TRACKED_SECTIONS) {
    if (sections[s].status === 'completed') completedCount++
  }

  return {
    moduleId,
    sections,
    completedCount,
    totalSections: TRACKED_SECTIONS.length,
    isModuleComplete: completedCount === TRACKED_SECTIONS.length,
  }
}

function computeTeoriaState(moduleId: number): SectionState {
  const pct = getReadingMaxPct(moduleId, 'teoria')
  const detail: SectionDetail = { scrollMaxPct: pct }
  if (pct === 0) return { status: 'not-started', detail }
  if (pct >= THEORY_THRESHOLD_PCT) return { status: 'completed', detail }
  return { status: 'in-progress', detail }
}

function computeQuizState(moduleId: number): SectionState {
  const { bestRatio, attempts } = getQuizStats(moduleId)
  const detail: SectionDetail = { bestRatio, attempts }
  if (attempts === 0) return { status: 'not-started', detail }
  if (bestRatio >= QUIZ_PASS_RATIO) return { status: 'completed', detail }
  return { status: 'in-progress', detail }
}

function computeVisitState(
  moduleId: number,
  section: TrackedSection,
  visits: VisitsMap,
): SectionState {
  const ts = visits[visitKey(moduleId, section)]
  if (!ts) return { status: 'not-started' }
  return { status: 'completed', detail: { visitedAt: ts } }
}

/* --------------------------- Notificación cross-tab ------------------------- */

const PROGRESS_EVENT = 'agent365-progress-changed'

/**
 * Notifica al mismo tab de un cambio en localStorage. El evento nativo
 * `storage` solo se dispara en otros tabs, así que necesitamos un
 * `CustomEvent` propio para que los hooks vivos en el mismo tab se
 * refresquen tras `markSectionVisited` o `clearAllProgress`.
 */
function notifyProgressChanged(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(PROGRESS_EVENT))
}

export function subscribeProgressChanges(handler: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const onCustom = () => handler()
  const onStorage = (e: StorageEvent) => {
    // solo nos importan keys del motor de progreso
    if (
      !e.key ||
      e.key.startsWith('agent365-reading-m') ||
      e.key.startsWith('agent365-quiz-m') ||
      e.key === SECTION_VISITS_KEY
    ) {
      handler()
    }
  }
  window.addEventListener(PROGRESS_EVENT, onCustom)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(PROGRESS_EVENT, onCustom)
    window.removeEventListener('storage', onStorage)
  }
}
