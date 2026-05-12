/**
 * API del banco de laboratorios formativos del curso.
 *
 * Los laboratorios son ejercicios formativos: el alumno los hace para
 * consolidar conceptos pero no se califican ni cuentan en el examen.
 * Por eso el modelo de feedback es inmediato y permite reintentar sin
 * coste, a diferencia del quiz oficial.
 *
 * **Fuente de los datos**: archivos `lab.yaml` dentro de cada módulo
 * del curso (`cursos/<slug>/modulos/<modulo>/lab.yaml`). El glob vive
 * en `course-paths.ts` para que solo haya UN sitio donde el slug del
 * curso aparezca hardcoded. Si un módulo no tiene `lab.yaml`, el
 * componente Lab muestra la teoría del laboratorio sin la parte
 * interactiva.
 *
 * Antes: los datos vivían como objetos TypeScript inline en este
 * archivo, lo que rompía el principio plug-and-play (cambiar de curso
 * obligaba a editar este archivo). Ver fase H.1 del changelog.
 */

import yaml from 'js-yaml'
import { loadLabsGlob } from './course-paths'

export type ProductId = string

export interface LabProduct {
  id: ProductId
  shortLabel: string
  fullName: string
  /** Texto corto bajo el chip al expandir, ayuda mnemotécnica. */
  hint: string
}

export interface LabScenario {
  /** id corto '01'..'NN' para keys y persistencia. */
  id: string
  prompt: string
  /** Productos correctos. >1 = alternativas válidas, basta acertar una. */
  correctProductIds: ProductId[]
  rationale: string
}

export interface LabExercise {
  moduleId: number
  title: string
  intro: string
  products: LabProduct[]
  scenarios: LabScenario[]
  /** Patrones de error pedagógicos al cerrar el lab. */
  errorPatterns: string[]
}

/* ------------------------- Carga desde YAML ------------------------- */

/**
 * Mapa moduleId → laboratorio parseado, calculado una vez al cargar
 * el bundle. Los archivos vienen via `import.meta.glob` (eager) desde
 * `course-paths.ts`, así que el lookup es síncrono y barato.
 */
const LABS_BY_MODULE: Map<number, LabExercise> = (() => {
  const out = new Map<number, LabExercise>()
  const labFiles = loadLabsGlob()

  for (const [path, raw] of Object.entries(labFiles)) {
    try {
      const data = yaml.load(raw) as Partial<LabExercise> | null
      if (!data || typeof data.moduleId !== 'number') {
        console.warn('[labs] YAML sin moduleId válido:', path)
        continue
      }

      // Validación mínima del shape; el tipado de TS es solo de compile-time.
      if (
        !data.title ||
        !data.intro ||
        !Array.isArray(data.products) ||
        !Array.isArray(data.scenarios) ||
        !Array.isArray(data.errorPatterns)
      ) {
        console.warn('[labs] YAML con shape incompleto:', path)
        continue
      }

      out.set(data.moduleId, data as LabExercise)
    } catch (err) {
      console.warn('[labs] Error parseando YAML:', path, err)
    }
  }

  return out
})()

/* --------------------------- API pública --------------------------- */

export function getLabForModule(moduleId: number): LabExercise | null {
  return LABS_BY_MODULE.get(moduleId) ?? null
}

export function getAllLabs(): LabExercise[] {
  return [...LABS_BY_MODULE.values()]
}

/* ------------------------------ Tipos de estado ----------------------------- */

/** scenarioId → productId seleccionado, o null si aún no contestado. */
export type LabAnswers = Record<string, ProductId | null>

export function emptyLabAnswers(lab: LabExercise): LabAnswers {
  const out: LabAnswers = {}
  for (const s of lab.scenarios) out[s.id] = null
  return out
}

export function isScenarioAnswered(answer: ProductId | null): boolean {
  return answer !== null
}

export function isScenarioCorrect(scenario: LabScenario, answer: ProductId | null): boolean {
  if (answer === null) return false
  return scenario.correctProductIds.includes(answer)
}

export function countCorrect(lab: LabExercise, answers: LabAnswers): number {
  let n = 0
  for (const s of lab.scenarios) {
    if (isScenarioCorrect(s, answers[s.id])) n++
  }
  return n
}

export function countAnswered(lab: LabExercise, answers: LabAnswers): number {
  let n = 0
  for (const s of lab.scenarios) {
    if (isScenarioAnswered(answers[s.id])) n++
  }
  return n
}
