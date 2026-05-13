/**
 * Índice de búsqueda global del curso.
 *
 * Indexa cuatro tipos de contenido editorial del paquete del curso:
 *
 *   - **Teoría** (`teoria.md` de cada módulo): se trocea por headings H2/H3.
 *     Cada chunk lleva el texto del heading como título y el cuerpo del
 *     bloque como cuerpo a indexar.
 *   - **Quiz** (preguntas parseadas via `lib/quiz.ts`): se indexa el
 *     enunciado de cada pregunta.
 *   - **Labs** (escenarios cargados via `lib/labs.ts`): se indexa el
 *     prompt de cada escenario.
 *   - **Recursos** (categorías y items cargados via `lib/resources.ts`):
 *     se indexa el título y la descripción de cada recurso.
 *
 * Además se indexan los **módulos** mismos (título + área).
 *
 * El índice se construye una sola vez al primer uso (lazy). Como todo el
 * contenido viene de `import.meta.glob` eager ya cargado en el bundle, no
 * hay I/O.
 *
 * Matching: tokeniza la query, normaliza tildes y case, exige AND de
 * todos los tokens, puntúa más alto cuando el match cae en el título.
 */

import { loadContent, getProducedModules } from './content'
import { CONTENT_MODULES, AREAS, findModule, getAreaForModule } from './course'
import { getQuestionsForModule } from './quiz'
import { getAllLabs } from './labs'
import { getAllResources } from './resources'

export type SearchResultType = 'module' | 'theory' | 'quiz' | 'lab' | 'resource'

export interface SearchResult {
  type: SearchResultType
  /** Id de módulo asociado (0 si es global). */
  moduleId: number
  /** Título humano del módulo (vacío si no aplica). */
  moduleTitle: string
  /** Título principal del resultado (heading, enunciado, etc.). */
  title: string
  /** Snippet alrededor del primer match (≈140 chars). Sin markdown. */
  snippet: string
  /** Ruta dentro de la SPA a la que navegar al seleccionar. */
  to: string
  /** Tag corto para la UI (Teoría, Quiz, Lab, Recursos, Módulo). */
  tag: string
  /** Puntuación interna para ordenar. Mayor es mejor. */
  score: number
}

interface IndexedDoc {
  type: SearchResultType
  moduleId: number
  moduleTitle: string
  title: string
  body: string
  to: string
  tag: string
  /** Url externa para resources (opcional). */
  externalUrl?: string
  /** Texto normalizado precalculado (title + body). */
  haystack: string
  /** Solo title normalizado, para boost. */
  titleNorm: string
}

/* ----------------------------- normalización ----------------------------- */

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

function tokenize(query: string): string[] {
  return normalize(query)
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length > 0)
}

/**
 * Quita marcadores de markdown (asteriscos, backticks, links, imágenes,
 * tablas, separadores) para producir texto plano legible en el snippet.
 */
function stripMarkdown(text: string): string {
  return text
    // Imágenes ![alt](url)
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Links [text](url)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Code blocks fenced ```...```
    .replace(/```[\s\S]*?```/g, ' ')
    // Inline code `...`
    .replace(/`([^`]+)`/g, '$1')
    // Énfasis ** __ * _
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Headings #
    .replace(/^#{1,6}\s+/gm, '')
    // Blockquotes >
    .replace(/^>\s?/gm, '')
    // Separadores y tablas
    .replace(/^[-=]{3,}\s*$/gm, ' ')
    .replace(/\|/g, ' ')
    // Listas
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // HTML residual
    .replace(/<[^>]+>/g, ' ')
    // Saltos de línea múltiples
    .replace(/\s+/g, ' ')
    .trim()
}

/* ---------------------------- chunking de teoría --------------------------- */

interface TheoryChunk {
  heading: string
  level: number
  body: string
}

/**
 * Trocea un markdown por headings H2/H3. Cada chunk lleva el texto del
 * heading y el cuerpo entre ese heading y el siguiente del mismo nivel
 * o superior. El H1 inicial se ignora como heading propio pero su
 * contenido cae en un chunk introductorio.
 */
function chunkTheory(body: string): TheoryChunk[] {
  const lines = body.split('\n')
  const chunks: TheoryChunk[] = []
  let current: TheoryChunk | null = null

  // Saltar el H1 inicial si lo hay, los chunks empiezan tras él.
  for (const line of lines) {
    const m = line.match(/^(#{1,6})\s+(.+?)\s*$/)
    if (m) {
      const level = m[1].length
      const heading = m[2].trim()
      if (level === 1) {
        // El H1 reinicia: arranca un chunk introductorio sin heading propio.
        if (current) chunks.push(current)
        current = { heading, level: 1, body: '' }
        continue
      }
      if (level === 2 || level === 3) {
        if (current) chunks.push(current)
        current = { heading, level, body: '' }
        continue
      }
    }
    if (current) {
      current.body += line + '\n'
    } else {
      current = { heading: '', level: 0, body: line + '\n' }
    }
  }
  if (current) chunks.push(current)

  return chunks.filter(c => c.heading || c.body.trim().length > 0)
}

/* -------------------------- construcción del índice ------------------------ */

let CACHED_INDEX: IndexedDoc[] | null = null

function buildIndex(): IndexedDoc[] {
  const docs: IndexedDoc[] = []
  const producedSlugs = new Set(getProducedModules())

  // 1) Módulos como entrada propia (búsqueda por título de módulo).
  for (const m of CONTENT_MODULES) {
    if (!producedSlugs.has(m.slug)) continue
    const area = getAreaForModule(m.id)
    const body = area ? `Área ${area.id}: ${area.nombreEs}. ${area.nombre}.` : ''
    docs.push({
      type: 'module',
      moduleId: m.id,
      moduleTitle: m.titulo,
      title: `Módulo ${String(m.id).padStart(2, '0')} — ${m.titulo}`,
      body,
      to: `modulo/${m.id}/teoria`,
      tag: 'Módulo',
      haystack: normalize(`${m.titulo} ${body}`),
      titleNorm: normalize(m.titulo),
    })
  }

  // 2) Teoría: un chunk por heading H2/H3.
  for (const m of CONTENT_MODULES) {
    if (!producedSlugs.has(m.slug)) continue
    const teoria = loadContent(m.slug, 'teoria')
    if (!teoria) continue
    const chunks = chunkTheory(teoria.body)
    for (const ch of chunks) {
      const plainBody = stripMarkdown(ch.body)
      if (!ch.heading && plainBody.length < 40) continue
      const title = ch.heading || `Introducción · ${m.titulo}`
      docs.push({
        type: 'theory',
        moduleId: m.id,
        moduleTitle: m.titulo,
        title,
        body: plainBody,
        to: `modulo/${m.id}/teoria`,
        tag: 'Teoría',
        haystack: normalize(`${title} ${plainBody}`),
        titleNorm: normalize(title),
      })
    }
  }

  // 3) Quiz: enunciado de cada pregunta.
  for (const m of CONTENT_MODULES) {
    const questions = getQuestionsForModule(m.id)
    for (const q of questions) {
      const prompt = stripMarkdown(q.prompt)
      docs.push({
        type: 'quiz',
        moduleId: m.id,
        moduleTitle: m.titulo,
        title: prompt.slice(0, 120),
        body: prompt,
        to: `modulo/${m.id}/quiz-practica`,
        tag: 'Quiz',
        haystack: normalize(prompt),
        titleNorm: normalize(prompt.slice(0, 120)),
      })
    }
  }

  // 4) Labs: escenarios del lab interactivo.
  for (const lab of getAllLabs()) {
    const mod = findModule(lab.moduleId)
    if (!mod) continue
    // Lab cabecera global.
    const intro = stripMarkdown(lab.intro)
    docs.push({
      type: 'lab',
      moduleId: lab.moduleId,
      moduleTitle: mod.titulo,
      title: lab.title,
      body: intro,
      to: `modulo/${lab.moduleId}/laboratorios`,
      tag: 'Lab',
      haystack: normalize(`${lab.title} ${intro}`),
      titleNorm: normalize(lab.title),
    })
    // Un doc por escenario para granularidad.
    for (const sc of lab.scenarios) {
      const prompt = stripMarkdown(sc.prompt)
      docs.push({
        type: 'lab',
        moduleId: lab.moduleId,
        moduleTitle: mod.titulo,
        title: `Escenario ${sc.id} · ${prompt.slice(0, 80)}`,
        body: `${prompt} ${stripMarkdown(sc.rationale)}`,
        to: `modulo/${lab.moduleId}/laboratorios`,
        tag: 'Lab',
        haystack: normalize(`${prompt} ${sc.rationale}`),
        titleNorm: normalize(prompt),
      })
    }
  }

  // 5) Recursos: cada recurso individual.
  for (const r of getAllResources()) {
    const mod = findModule(r.moduleId)
    if (!mod) continue
    for (const cat of r.categories) {
      for (const item of cat.resources) {
        const body = item.description ? stripMarkdown(item.description) : ''
        docs.push({
          type: 'resource',
          moduleId: r.moduleId,
          moduleTitle: mod.titulo,
          title: item.title,
          body: `${cat.title}. ${body}`.trim(),
          to: `modulo/${r.moduleId}/recursos`,
          tag: 'Recursos',
          externalUrl: item.url,
          haystack: normalize(`${item.title} ${cat.title} ${body}`),
          titleNorm: normalize(item.title),
        })
      }
    }
  }

  return docs
}

function getIndex(): IndexedDoc[] {
  if (!CACHED_INDEX) CACHED_INDEX = buildIndex()
  return CACHED_INDEX
}

/* ---------------------------------- API ---------------------------------- */

const TYPE_WEIGHT: Record<SearchResultType, number> = {
  module: 50,
  theory: 30,
  quiz: 25,
  lab: 22,
  resource: 18,
}

/** Devuelve hasta `limit` resultados ordenados por puntuación. */
export function searchCourse(query: string, limit = 20): SearchResult[] {
  const tokens = tokenize(query)
  if (tokens.length === 0) return []

  const docs = getIndex()
  const out: SearchResult[] = []

  for (const doc of docs) {
    let score = 0
    let allFound = true
    let firstHitInBody = -1

    for (const t of tokens) {
      const inTitle = doc.titleNorm.indexOf(t)
      const inBody = doc.haystack.indexOf(t)
      if (inTitle === -1 && inBody === -1) {
        allFound = false
        break
      }
      // Boost por aparecer en título; doble si está al inicio.
      if (inTitle !== -1) {
        score += inTitle === 0 ? 30 : 18
      }
      if (inBody !== -1) {
        score += 5
        if (firstHitInBody === -1 || inBody < firstHitInBody) {
          firstHitInBody = inBody
        }
      }
    }
    if (!allFound) continue

    score += TYPE_WEIGHT[doc.type]

    // Bonus si todos los tokens aparecen como frase contigua.
    if (tokens.length > 1) {
      const phrase = tokens.join(' ')
      if (doc.haystack.includes(phrase)) score += 25
      if (doc.titleNorm.includes(phrase)) score += 35
    }

    const snippet = makeSnippet(doc.body || doc.title, tokens, firstHitInBody)

    out.push({
      type: doc.type,
      moduleId: doc.moduleId,
      moduleTitle: doc.moduleTitle,
      title: doc.title,
      snippet,
      to: doc.to,
      tag: doc.tag,
      score,
    })
  }

  out.sort((a, b) => b.score - a.score)
  return out.slice(0, limit)
}

/**
 * Genera un snippet de ≈140 chars centrado en el primer hit. Conserva el
 * texto original (sin normalizar) para que las tildes se vean correctamente.
 */
function makeSnippet(body: string, tokens: string[], normHitIdx: number): string {
  if (!body) return ''
  const SNIPPET_LEN = 160

  // Reencontrar el hit en el texto sin normalizar para preservar acentos.
  const norm = normalize(body)
  let hitIdx = -1
  for (const t of tokens) {
    const i = norm.indexOf(t)
    if (i !== -1 && (hitIdx === -1 || i < hitIdx)) hitIdx = i
  }
  if (hitIdx === -1) hitIdx = normHitIdx >= 0 ? normHitIdx : 0

  const start = Math.max(0, hitIdx - 50)
  const end = Math.min(body.length, start + SNIPPET_LEN)
  let s = body.slice(start, end)
  if (start > 0) s = '…' + s
  if (end < body.length) s = s + '…'
  return s.trim()
}

/** Resetea el índice (utilidad de tests). */
export function resetSearchIndex() {
  CACHED_INDEX = null
}

/**
 * Devuelve segmentos del texto marcando los rangos que coinciden con la
 * query, para renderizar con `<mark>`. Conserva la capitalización original.
 */
export function highlight(text: string, query: string): Array<{ text: string; match: boolean }> {
  const tokens = tokenize(query)
  if (tokens.length === 0) return [{ text, match: false }]
  // Encontrar todos los rangos.
  const norm = normalize(text)
  type Range = { start: number; end: number }
  const ranges: Range[] = []
  for (const t of tokens) {
    let from = 0
    while (true) {
      const i = norm.indexOf(t, from)
      if (i === -1) break
      ranges.push({ start: i, end: i + t.length })
      from = i + t.length
    }
  }
  if (ranges.length === 0) return [{ text, match: false }]
  // Mergear rangos solapados.
  ranges.sort((a, b) => a.start - b.start)
  const merged: Range[] = [ranges[0]]
  for (let i = 1; i < ranges.length; i++) {
    const last = merged[merged.length - 1]
    if (ranges[i].start <= last.end) {
      last.end = Math.max(last.end, ranges[i].end)
    } else {
      merged.push(ranges[i])
    }
  }
  // Construir segmentos.
  const segments: Array<{ text: string; match: boolean }> = []
  let cursor = 0
  for (const r of merged) {
    if (r.start > cursor) segments.push({ text: text.slice(cursor, r.start), match: false })
    segments.push({ text: text.slice(r.start, r.end), match: true })
    cursor = r.end
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), match: false })
  return segments
}

// Mantener referencia a AREAS para evitar warnings de unused-import si en algún
// momento se reordena. (AREAS se consume vía getAreaForModule).
void AREAS
