/**
 * Tipos y API del banco de preguntas del curso.
 *
 * Las preguntas viven como bloques `::: pregunta` en los `quiz-practica.md`
 * de cada módulo (y en el `banco-examen.md` del curso para el examen final).
 * Este archivo NO contiene preguntas hardcoded: las carga via
 * `parseQuizMarkdown` desde el contenido del paquete.
 *
 * El paso de hardcoded a parser es la deuda técnica que cierra el Bloque D.
 *
 * Identificadores:
 *   - Q-NN-N      = quiz de práctica del módulo NN, pregunta N
 *   - EX-NN-NNN   = banco oficial del examen final, pregunta NNN del módulo NN
 */

import { parseQuizMarkdown } from './quiz-parser'
import { loadQuizModulesGlob } from './course-paths'

export type QuestionType =
  | 'multiple-choice'
  | 'multiple-response'
  | 'scenario'
  | 'drag-and-drop'
  | 'ordering'

export type Difficulty = 'facil' | 'media' | 'dificil'

export type Bloom = 'Recordar' | 'Comprender' | 'Aplicar' | 'Analizar' | 'Evaluar' | 'Crear'

interface QuestionMeta {
  id: string
  type: QuestionType
  difficulty: Difficulty
  oa: string
  area: number
  bloom: Bloom
  moduleId: number
}

interface OptionAnswer {
  id: string
  text: string
}

export interface MultipleChoiceQuestion extends QuestionMeta {
  type: 'multiple-choice' | 'scenario'
  prompt: string
  options: OptionAnswer[]
  correctOptionId: string
  justification: string
}

export interface MultipleResponseQuestion extends QuestionMeta {
  type: 'multiple-response'
  prompt: string
  options: OptionAnswer[]
  correctOptionIds: string[]
  justification: string
}

export interface DragAndDropQuestion extends QuestionMeta {
  type: 'drag-and-drop'
  prompt: string
  items: Array<{ id: string; text: string }>
  targets: Array<{ id: string; label: string }>
  /** itemId → targetId */
  correctMap: Record<string, string>
  justification: string
}

export interface OrderingQuestion extends QuestionMeta {
  type: 'ordering'
  prompt: string
  items: Array<{ id: string; text: string }>
  /** orden esperado de itemIds (posición 0 = primero) */
  correctOrder: string[]
  justification: string
}

export type Question =
  | MultipleChoiceQuestion
  | MultipleResponseQuestion
  | DragAndDropQuestion
  | OrderingQuestion

/* -------------------------- Carga desde markdown --------------------------- */

/**
 * Glob eager de los quiz-practica.md de TODOS los módulos del curso activo.
 * Vite los empaqueta en build, así que el lookup es síncrono y barato.
 *
 * El glob vive en `course-paths.ts` para que cambiar de curso solo
 * requiera tocar ese archivo.
 */
const quizFiles = loadQuizModulesGlob()

/**
 * Mapa moduleId → preguntas parseadas. Se calcula una vez al cargar el bundle.
 */
const QUESTIONS_BY_MODULE: Map<number, Question[]> = (() => {
  const out = new Map<number, Question[]>()
  for (const [path, raw] of Object.entries(quizFiles)) {
    // path es algo como '../../../cursos/agent365-cert/modulos/modulo-09-permisos-conditional-access/quiz-practica.md'
    const slugMatch = path.match(/modulo-(\d+)-/)
    if (!slugMatch) {
      console.warn('[quiz] No se pudo extraer moduleId del path:', path)
      continue
    }
    const moduleId = parseInt(slugMatch[1], 10)
    const questions = parseQuizMarkdown(raw, moduleId)
    if (questions.length > 0) {
      out.set(moduleId, questions)
    }
  }
  return out
})()

/* --------------------------- API pública del banco -------------------------- */

export function getQuestionsForModule(moduleId: number): Question[] {
  return QUESTIONS_BY_MODULE.get(moduleId) ?? []
}

export function isMultipleChoice(q: Question): q is MultipleChoiceQuestion {
  return q.type === 'multiple-choice' || q.type === 'scenario'
}

export function isMultipleResponse(q: Question): q is MultipleResponseQuestion {
  return q.type === 'multiple-response'
}

export function isDragAndDrop(q: Question): q is DragAndDropQuestion {
  return q.type === 'drag-and-drop'
}

export function isOrdering(q: Question): q is OrderingQuestion {
  return q.type === 'ordering'
}

/* ------------------------------ Tipos de respuesta -------------------------- */

export interface MCAnswer {
  type: 'mc'
  questionId: string
  selectedOptionId: string | null
}

export interface MRAnswer {
  type: 'mr'
  questionId: string
  selectedOptionIds: string[]
}

export interface DnDAnswer {
  type: 'dnd'
  questionId: string
  /** itemId → targetId. Items sin colocar no aparecen. */
  placements: Record<string, string>
}

export interface OrderingAnswer {
  type: 'order'
  questionId: string
  /** Orden actual de itemIds (posición 0 = primero). null si no se ha tocado. */
  order: string[] | null
}

export type Answer = MCAnswer | MRAnswer | DnDAnswer | OrderingAnswer

export function emptyAnswerFor(q: Question): Answer {
  if (isDragAndDrop(q)) {
    return { type: 'dnd', questionId: q.id, placements: {} }
  }
  if (isMultipleResponse(q)) {
    return { type: 'mr', questionId: q.id, selectedOptionIds: [] }
  }
  if (isOrdering(q)) {
    return { type: 'order', questionId: q.id, order: null }
  }
  return { type: 'mc', questionId: q.id, selectedOptionId: null }
}

export function isAnswerComplete(q: Question, a: Answer): boolean {
  if (isDragAndDrop(q) && a.type === 'dnd') {
    return q.items.every(item => a.placements[item.id])
  }
  if (isMultipleChoice(q) && a.type === 'mc') {
    return a.selectedOptionId !== null
  }
  if (isMultipleResponse(q) && a.type === 'mr') {
    return a.selectedOptionIds.length > 0
  }
  if (isOrdering(q) && a.type === 'order') {
    return a.order !== null && a.order.length === q.items.length
  }
  return false
}

export function isAnswerCorrect(q: Question, a: Answer): boolean {
  if (isDragAndDrop(q) && a.type === 'dnd') {
    return q.items.every(item => a.placements[item.id] === q.correctMap[item.id])
  }
  if (isMultipleChoice(q) && a.type === 'mc') {
    return a.selectedOptionId === q.correctOptionId
  }
  if (isMultipleResponse(q) && a.type === 'mr') {
    if (a.selectedOptionIds.length !== q.correctOptionIds.length) return false
    const expected = new Set(q.correctOptionIds)
    return a.selectedOptionIds.every(id => expected.has(id))
  }
  if (isOrdering(q) && a.type === 'order' && a.order) {
    if (a.order.length !== q.correctOrder.length) return false
    return a.order.every((itemId, idx) => itemId === q.correctOrder[idx])
  }
  return false
}

/**
 * Indica qué placements son individualmente correctos en un DnD.
 * Útil para mostrar feedback granular tras validar.
 */
export function dndItemCorrectness(q: DragAndDropQuestion, a: DnDAnswer): Record<string, boolean> {
  const result: Record<string, boolean> = {}
  for (const item of q.items) {
    result[item.id] = a.placements[item.id] === q.correctMap[item.id]
  }
  return result
}
