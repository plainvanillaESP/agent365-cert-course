/**
 * API del examen final del curso (M17).
 *
 * El banco oficial vive en `cursos/agent365-cert/banco-examen.md` con bloques
 * `::: pregunta` para cada pregunta `EX-NN-NNN`. Este módulo se encarga de:
 *
 *   - Cargar el banco entero una vez al iniciar el bundle.
 *   - Producir una selección aleatoria de N preguntas para cada intento.
 *   - Puntuar un intento sumando preguntas correctas.
 *   - Producir el desglose por área de competencia para reporting.
 *
 * Diseño:
 *   - Funciones PURAS. El estado (intento en curso, historial) vive en
 *     `useExamState`, no aquí. Esto facilita testing.
 *   - El banco se cachea en memoria al primer acceso. No hay disk I/O
 *     en runtime, solo el `import.meta.glob` que Vite resuelve en build.
 *   - El umbral de aprobado y duración vienen del `course.yaml` pero se
 *     consumen como constantes aquí; M17 cambia con poca frecuencia.
 */

import yaml from 'js-yaml'
import { parseQuizMarkdown } from './quiz-parser'
import { type Question } from './quiz'
import { AREAS } from './course'

/* ------------------------------ Constantes -------------------------------- */

/** Número total de preguntas que aparecen en el examen. Igual al tamaño del banco. */
export const EXAM_NUM_QUESTIONS = 60

/** Duración del examen en minutos. */
export const EXAM_DURATION_MIN = 90

/** Umbral de aprobado (porcentaje, 0-100). */
export const EXAM_PASS_PCT = 70

/** Número máximo de intentos antes del cooldown. */
export const EXAM_MAX_ATTEMPTS = 3

/** Días de cooldown tras agotar `EXAM_MAX_ATTEMPTS`. */
export const EXAM_COOLDOWN_DAYS = 7

/* ------------------------------ Carga del banco --------------------------- */

const bancoFiles = import.meta.glob('../../../cursos/agent365-cert/banco-examen.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

interface ParsedBancoFrontmatter {
  total_preguntas_objetivo?: number
  total_preguntas_actuales?: number
}

function extractFrontmatter(raw: string): ParsedBancoFrontmatter {
  const m = raw.match(/^---\n([\s\S]*?)\n---/)
  if (!m) return {}
  try {
    return (yaml.load(m[1]) ?? {}) as ParsedBancoFrontmatter
  } catch {
    return {}
  }
}

const BANCO_QUESTIONS: Question[] = (() => {
  const all: Question[] = []
  for (const [path, raw] of Object.entries(bancoFiles)) {
    void path
    // moduleId=0 como sentinel; el parser ya pone el `moduleId` real desde el
    // frontmatter de cada pregunta (`modulo: NN`).
    const qs = parseQuizMarkdown(raw, 0)
    for (const q of qs) {
      all.push(q)
    }
  }
  return all
})()

const BANCO_META: ParsedBancoFrontmatter = (() => {
  for (const raw of Object.values(bancoFiles)) {
    return extractFrontmatter(raw)
  }
  return {}
})()

/* ------------------------------- API pública ------------------------------ */

/** Devuelve el banco entero, en el orden en que se parseó. */
export function getExamBank(): Question[] {
  return BANCO_QUESTIONS
}

/** Tamaño efectivo del banco actualmente disponible. */
export function getExamBankSize(): number {
  return BANCO_QUESTIONS.length
}

/** Tamaño declarado en el frontmatter del banco. */
export function getExamBankDeclaredSize(): number {
  return BANCO_META.total_preguntas_objetivo ?? EXAM_NUM_QUESTIONS
}

/**
 * Selecciona N preguntas del banco en orden aleatorio. La selección es
 * con remplazo NO permitido: si N > banco, devuelve todo el banco.
 *
 * Esto es Fisher-Yates con un PRNG seedable para tests reproducibles.
 *
 * @param count  número objetivo de preguntas
 * @param seed   opcional, semilla para reproducibilidad
 */
export function selectExamQuestions(count: number, seed?: number): Question[] {
  const pool = [...BANCO_QUESTIONS]
  const n = Math.min(count, pool.length)
  const rng = makeRng(seed ?? defaultSeed())
  // Fisher-Yates parcial
  for (let i = pool.length - 1; i > pool.length - n - 1 && i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const tmp = pool[i]
    pool[i] = pool[j]
    pool[j] = tmp
  }
  return pool.slice(pool.length - n).reverse()
}

/**
 * Resultado de un intento, listo para reporting.
 */
export interface ExamScoring {
  score: number
  total: number
  pct: number
  passed: boolean
  byArea: AreaBreakdown[]
}

export interface AreaBreakdown {
  areaId: number
  areaNombreEs: string
  pesoExamen: number
  total: number
  correct: number
  pct: number
}

/**
 * Puntúa un intento. Recibe la lista de preguntas que se presentaron y
 * un mapa `questionId → correcta(bool)`.
 */
export function scoreExam(
  questions: Question[],
  perQuestionCorrect: Record<string, boolean>,
): ExamScoring {
  let correct = 0
  const total = questions.length
  const areaCorrect: Record<number, number> = {}
  const areaTotal: Record<number, number> = {}

  for (const q of questions) {
    const ok = !!perQuestionCorrect[q.id]
    if (ok) correct++
    areaTotal[q.area] = (areaTotal[q.area] ?? 0) + 1
    areaCorrect[q.area] = (areaCorrect[q.area] ?? 0) + (ok ? 1 : 0)
  }

  const pct = total > 0 ? Math.round((correct / total) * 100) : 0

  const byArea: AreaBreakdown[] = AREAS.map(area => {
    const t = areaTotal[area.id] ?? 0
    const c = areaCorrect[area.id] ?? 0
    return {
      areaId: area.id,
      areaNombreEs: area.nombreEs,
      pesoExamen: area.pesoExamen,
      total: t,
      correct: c,
      pct: t > 0 ? Math.round((c / t) * 100) : 0,
    }
  })

  return {
    score: correct,
    total,
    pct,
    passed: pct >= EXAM_PASS_PCT,
    byArea,
  }
}

/* ------------------------------ PRNG seedable ----------------------------- */

/** PRNG xmur3 + sfc32 simple, suficiente para barajar preguntas. */
function makeRng(seed: number): () => number {
  let a = seed >>> 0
  let b = (seed * 0x9e3779b9) >>> 0
  let c = (seed ^ 0x85ebca6b) >>> 0
  let d = ((seed * 0xc2b2ae35) ^ 0x27d4eb2f) >>> 0
  return function () {
    const t = (a + b) >>> 0
    a = b ^ (b >>> 9)
    b = (c + (c << 3)) >>> 0
    c = ((c << 21) | (c >>> 11)) >>> 0
    c = (c + (d = (d + 1) >>> 0)) >>> 0
    return ((t + d) >>> 0) / 4294967296
  }
}

function defaultSeed(): number {
  // Suficiente para variar entre intentos sin necesidad de crypto.
  return (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0
}
