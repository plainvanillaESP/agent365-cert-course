/**
 * Parser de preguntas desde markdown.
 *
 * Lee `cursos/<slug>/modulos/<modulo>/quiz-practica.md` (y eventualmente
 * `cursos/<slug>/banco-examen.md`) y extrae los bloques `::: pregunta`
 * definidos en `docs/course-package-spec.md` v1.0.
 *
 * Cada bloque es de la forma:
 *
 *   ::: pregunta
 *   id: Q-NN-N
 *   tipo: multiple-choice
 *   ...resto de campos YAML...
 *   :::
 *
 * El YAML interno se parsea con js-yaml (browser-safe) y se valida
 * estructuralmente. Las preguntas mal formadas se descartan con un
 * warning en consola para no romper el render del módulo.
 *
 * Tipos soportados:
 *   - multiple-choice  (1 opción correcta)
 *   - multiple-response (varias correctas)
 *   - scenario          (1 opción correcta, MC con prompt extenso)
 *   - drag-and-drop     (item → target)
 *   - ordering          (item → posición ordenada)
 *
 * IMPORTANTE: este parser es la fuente de verdad de los quizzes.
 * Sustituye a las preguntas hardcoded en `lib/quiz.ts` que existían
 * mientras esperábamos al parser real (deuda técnica de Bloque D).
 */

import yaml from 'js-yaml'
import type { Question, QuestionType, Difficulty } from './quiz'

const PREGUNTA_BLOCK_RE = /:::\s*pregunta\s*\n([\s\S]*?)\n:::/g

interface ParsedQuestionRaw {
  id?: string
  modulo?: number
  oa?: string
  area?: number
  tipo?: string
  dificultad?: string
  bloom?: string
  enunciado?: string

  // multiple-choice / multiple-response / scenario
  opciones?: Array<{ id: string; texto: string; correcta?: boolean }>

  // drag-and-drop
  items?: Array<{ id: string; texto: string }>
  targets?: Array<{ id: string; label: string }>
  correct_map?: Record<string, string>

  // ordering
  // (usa items + el correct_order como array de itemIds en orden esperado)
  correct_order?: string[]

  justificacion?: string
}

/**
 * Parsea el contenido raw de un quiz-practica.md y devuelve las preguntas
 * en formato `Question[]` consumible por `useQuizState`.
 *
 * @param raw  contenido del archivo .md (con o sin frontmatter)
 * @param moduleId  número de módulo a poblar en cada Question (override del campo `modulo` del YAML)
 */
export function parseQuizMarkdown(raw: string, moduleId: number): Question[] {
  const questions: Question[] = []

  // Resetear lastIndex porque la regex es /g
  PREGUNTA_BLOCK_RE.lastIndex = 0

  let match: RegExpExecArray | null
  while ((match = PREGUNTA_BLOCK_RE.exec(raw)) !== null) {
    const yamlSource = match[1]
    let parsed: ParsedQuestionRaw
    try {
      parsed = yaml.load(yamlSource) as ParsedQuestionRaw
    } catch (e) {
      console.warn('[quiz-parser] YAML inválido en bloque ::: pregunta:', e)
      continue
    }
    const q = buildQuestion(parsed, moduleId)
    if (q) questions.push(q)
  }
  return questions
}

function buildQuestion(p: ParsedQuestionRaw, moduleId: number): Question | null {
  if (!p || typeof p !== 'object') return null
  if (!p.id || !p.tipo) {
    console.warn('[quiz-parser] Pregunta sin id o tipo, descartada:', p)
    return null
  }

  const tipo = p.tipo as QuestionType
  const dificultad = (p.dificultad ?? 'media') as Difficulty
  const bloom = (p.bloom ?? 'Comprender') as Question['bloom']
  const oa = p.oa ?? ''
  const area = p.area ?? 0

  const meta = {
    id: p.id,
    type: tipo,
    difficulty: dificultad,
    oa,
    area,
    bloom,
    moduleId: p.modulo ?? moduleId,
  }

  if (tipo === 'multiple-choice' || tipo === 'scenario') {
    if (!Array.isArray(p.opciones) || p.opciones.length === 0) {
      console.warn('[quiz-parser]', p.id, 'sin opciones')
      return null
    }
    const correct = p.opciones.find(o => o.correcta)
    if (!correct) {
      console.warn('[quiz-parser]', p.id, 'sin opción correcta marcada')
      return null
    }
    return {
      ...meta,
      type: tipo,
      prompt: p.enunciado ?? '',
      options: p.opciones.map(o => ({ id: o.id, text: o.texto })),
      correctOptionId: correct.id,
      justification: p.justificacion ?? '',
    } as Question
  }

  if (tipo === 'multiple-response') {
    if (!Array.isArray(p.opciones) || p.opciones.length === 0) {
      console.warn('[quiz-parser]', p.id, 'sin opciones')
      return null
    }
    const correctIds = p.opciones.filter(o => o.correcta).map(o => o.id)
    if (correctIds.length === 0) {
      console.warn('[quiz-parser]', p.id, 'multiple-response sin opciones correctas')
      return null
    }
    return {
      ...meta,
      type: 'multiple-response',
      prompt: p.enunciado ?? '',
      options: p.opciones.map(o => ({ id: o.id, text: o.texto })),
      correctOptionIds: correctIds,
      justification: p.justificacion ?? '',
    } as Question
  }

  if (tipo === 'drag-and-drop') {
    if (!Array.isArray(p.items) || !Array.isArray(p.targets) || !p.correct_map) {
      console.warn('[quiz-parser]', p.id, 'drag-and-drop incompleto')
      return null
    }
    return {
      ...meta,
      type: 'drag-and-drop',
      prompt: p.enunciado ?? '',
      items: p.items.map(i => ({ id: i.id, text: i.texto })),
      targets: p.targets,
      correctMap: p.correct_map,
      justification: p.justificacion ?? '',
    } as Question
  }

  if (tipo === 'ordering') {
    if (!Array.isArray(p.items) || !Array.isArray(p.correct_order)) {
      console.warn('[quiz-parser]', p.id, 'ordering incompleto')
      return null
    }
    return {
      ...meta,
      type: 'ordering',
      prompt: p.enunciado ?? '',
      items: p.items.map(i => ({ id: i.id, text: i.texto })),
      correctOrder: p.correct_order,
      justification: p.justificacion ?? '',
    } as Question
  }

  console.warn('[quiz-parser]', p.id, 'tipo desconocido:', tipo)
  return null
}
