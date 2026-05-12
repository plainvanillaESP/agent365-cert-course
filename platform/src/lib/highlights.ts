/**
 * Motor de "highlights" del alumno sobre el contenido del curso.
 *
 * Cada highlight es una porción de texto que el alumno ha seleccionado
 * y guardado para destacar. La persistencia se hace por módulo +
 * sección en `localStorage`; el render visual lo gestiona
 * `components/Highlighter.tsx`, que aplica `<mark data-highlight-id>`
 * sobre los text nodes correspondientes del `.markdown-body`.
 *
 * Robustez frente a cambios de contenido:
 *
 *   Cada highlight guarda **`prefix`** y **`suffix`** (hasta 16
 *   caracteres antes/después del fragmento). Al re-renderizar, en
 *   lugar de fiarse de offsets DOM (que se invalidan al menor cambio),
 *   se busca `prefix + text + suffix` en el texto plano del
 *   contenedor. Si el match es único, se reaplica; si el contenido ha
 *   cambiado y no encuentra el fragmento, el highlight queda como
 *   "huérfano" (sigue en `localStorage`, no se pinta).
 *
 * Reutilización: este archivo NO depende de React. Cualquier curso
 * PV-Learn lo puede consumir desde su shell sin tocar nada. La capa
 * React reutilizable está en `hooks/useHighlights.ts` y
 * `components/Highlighter.tsx`.
 */

const CONTEXT_LEN = 16

/** Color de fondo del `<mark>` aplicado a los highlights. */
export type HighlightColor = 'yellow' | 'green' | 'pink' | 'purple'

export interface Highlight {
  /** Id único (uuid v4). Útil para borrado por click. */
  id: string
  /** Texto seleccionado, tal cual lo vio el alumno. */
  text: string
  /** Hasta `CONTEXT_LEN` caracteres inmediatamente antes del fragmento. */
  prefix: string
  /** Hasta `CONTEXT_LEN` caracteres inmediatamente después del fragmento. */
  suffix: string
  /** ms epoch del momento en que se guardó. */
  createdAt: number
  /** Color del resaltado. Por defecto `yellow`. */
  color: HighlightColor
  /** Nota opcional asociada al highlight (no implementada en UI v1). */
  note?: string
}

/* ----------------------------- localStorage ----------------------------- */

const KEY_PREFIX = 'agent365-highlights'

/** Compone la storage key para un módulo + sección. */
export function storageKey(moduleId: number, section: string): string {
  return `${KEY_PREFIX}-m${moduleId}-${section}`
}

export function loadHighlights(moduleId: number, section: string): Highlight[] {
  try {
    const raw = localStorage.getItem(storageKey(moduleId, section))
    if (!raw) return []
    const parsed = JSON.parse(raw) as Highlight[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveHighlights(
  moduleId: number,
  section: string,
  list: Highlight[],
): void {
  try {
    if (list.length === 0) {
      localStorage.removeItem(storageKey(moduleId, section))
    } else {
      localStorage.setItem(storageKey(moduleId, section), JSON.stringify(list))
    }
  } catch {
    /* ignore */
  }
}

/* -------------------------- Extracción del DOM -------------------------- */

/**
 * Devuelve el texto completo concatenado del contenedor (orden de
 * documento) y un mapeo paralelo `nodes` con los `Text` que lo
 * componen junto con `start` (offset acumulado en el texto plano).
 *
 * El mapeo permite, dado un índice plano, recuperar el `Text` que lo
 * contiene + el offset dentro de ese text node.
 */
export interface PlainTextMap {
  text: string
  nodes: Array<{ node: Text; start: number; end: number }>
}

export function buildPlainTextMap(container: HTMLElement): PlainTextMap {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
    acceptNode: node => {
      // Ignora text nodes dentro de `<style>`, `<script>` o `<code>` con
      // contenido vacío. Mantenemos `<code>` con contenido porque puede
      // ser parte de una frase resaltable.
      const parent = node.parentElement
      if (!parent) return NodeFilter.FILTER_REJECT
      if (parent.tagName === 'STYLE' || parent.tagName === 'SCRIPT')
        return NodeFilter.FILTER_REJECT
      // Skip text nodes que solo contienen whitespace puro entre bloques.
      if (!node.nodeValue || node.nodeValue.replace(/\s/g, '') === '') {
        return NodeFilter.FILTER_REJECT
      }
      return NodeFilter.FILTER_ACCEPT
    },
  })

  const nodes: PlainTextMap['nodes'] = []
  let text = ''
  let current: Node | null = walker.nextNode()
  while (current) {
    const t = current as Text
    const value = t.nodeValue ?? ''
    nodes.push({ node: t, start: text.length, end: text.length + value.length })
    text += value
    current = walker.nextNode()
  }
  return { text, nodes }
}

/**
 * Localiza un `{ start, end }` (índices en `text` plano) que se
 * corresponde con `prefix + payload + suffix`. Devuelve `null` si no
 * encuentra o si encuentra ambiguamente.
 */
export function locatePayload(
  plain: string,
  prefix: string,
  payload: string,
  suffix: string,
): { start: number; end: number } | null {
  if (!payload) return null
  // Búsqueda completa con prefijo + sufijo.
  const needle = prefix + payload + suffix
  const first = plain.indexOf(needle)
  if (first === -1) {
    // Fallback: solo el payload, si es único.
    const occurrences: number[] = []
    let from = 0
    while (true) {
      const i = plain.indexOf(payload, from)
      if (i === -1) break
      occurrences.push(i)
      from = i + payload.length
      if (occurrences.length > 1) break
    }
    if (occurrences.length === 1) {
      return { start: occurrences[0], end: occurrences[0] + payload.length }
    }
    return null
  }
  // ¿Es único el match con contexto?
  const second = plain.indexOf(needle, first + 1)
  if (second !== -1) return null // ambiguo
  return { start: first + prefix.length, end: first + prefix.length + payload.length }
}

/**
 * Convierte un par de índices `{ start, end }` (en el texto plano del
 * contenedor) en un `Range` del DOM que abarca exactamente esos
 * caracteres. Devuelve `null` si no se puede mapear.
 */
export function rangeFromPlainIndices(
  map: PlainTextMap,
  start: number,
  end: number,
): Range | null {
  if (start >= end) return null
  let startNode: Text | null = null
  let startOffset = 0
  let endNode: Text | null = null
  let endOffset = 0
  for (const entry of map.nodes) {
    if (startNode === null && start >= entry.start && start < entry.end) {
      startNode = entry.node
      startOffset = start - entry.start
    }
    if (endNode === null && end > entry.start && end <= entry.end) {
      endNode = entry.node
      endOffset = end - entry.start
      break
    }
  }
  if (!startNode || !endNode) return null
  const r = document.createRange()
  try {
    r.setStart(startNode, startOffset)
    r.setEnd(endNode, endOffset)
    return r
  } catch {
    return null
  }
}

/**
 * Envuelve los text nodes contenidos en el rango con `<mark>`s con el
 * `dataset.highlightId` indicado. Devuelve los `<mark>` creados.
 *
 * Implementación: el rango puede cruzar bordes de nodos (típico al
 * seleccionar varias frases). Se itera por los text nodes incluidos y
 * cada uno se splita parcialmente si el rango empieza/termina dentro
 * de él, luego se envuelve con un `<mark>`.
 */
export function wrapRangeWithHighlight(
  range: Range,
  highlightId: string,
  color: HighlightColor,
): HTMLElement[] {
  const marks: HTMLElement[] = []

  // Recolectar text nodes incluidos en el rango.
  const root = range.commonAncestorContainer
  const container =
    root.nodeType === Node.ELEMENT_NODE ? (root as Element) : root.parentElement
  if (!container) return marks

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
    acceptNode: node => {
      if (!range.intersectsNode(node)) return NodeFilter.FILTER_REJECT
      // Ignora text nodes que están totalmente fuera (intersectsNode con
      // boundaries del rango: doble-check).
      const tn = node as Text
      const r = document.createRange()
      r.selectNodeContents(tn)
      if (r.compareBoundaryPoints(Range.END_TO_START, range) >= 0)
        return NodeFilter.FILTER_REJECT
      if (r.compareBoundaryPoints(Range.START_TO_END, range) <= 0)
        return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })

  const textNodes: Text[] = []
  let n: Node | null = walker.nextNode()
  while (n) {
    textNodes.push(n as Text)
    n = walker.nextNode()
  }

  for (const tn of textNodes) {
    let start = 0
    let end = tn.nodeValue?.length ?? 0
    if (tn === range.startContainer) start = range.startOffset
    if (tn === range.endContainer) end = range.endOffset
    if (end <= start) continue
    const tail = end < (tn.nodeValue?.length ?? 0) ? tn.splitText(end) : null
    const middle = start > 0 ? tn.splitText(start) : tn
    void tail // 'tail' ya queda enlazado tras `middle` por el split

    const mark = document.createElement('mark')
    mark.dataset.highlightId = highlightId
    mark.dataset.highlightColor = color
    mark.className = `pv-highlight pv-highlight-${color}`
    middle.parentNode?.insertBefore(mark, middle)
    mark.appendChild(middle)
    marks.push(mark)
  }
  return marks
}

/**
 * Construye un highlight a partir del `Range` actual del navegador.
 * Devuelve `null` si la selección es trivial (vacía, solo whitespace,
 * o menos de `MIN_LEN` caracteres).
 */
export const MIN_HIGHLIGHT_LEN = 3

export function highlightFromSelection(
  container: HTMLElement,
  selection: Selection,
  color: HighlightColor = 'yellow',
): Highlight | null {
  if (selection.rangeCount === 0) return null
  const range = selection.getRangeAt(0)
  if (range.collapsed) return null
  if (!container.contains(range.startContainer) || !container.contains(range.endContainer))
    return null
  const text = range.toString().trim()
  if (text.length < MIN_HIGHLIGHT_LEN) return null

  const map = buildPlainTextMap(container)
  // Calcular el offset en `map.text` correspondiente al range.
  let startIdx: number | null = null
  let endIdx: number | null = null
  for (const entry of map.nodes) {
    if (entry.node === range.startContainer) {
      startIdx = entry.start + range.startOffset
    }
    if (entry.node === range.endContainer) {
      endIdx = entry.start + range.endOffset
    }
  }
  // Si el range arranca/acaba en un elemento (no text node), recurrir
  // al método del rango directamente.
  if (startIdx === null || endIdx === null) {
    const cloned = range.cloneRange()
    cloned.selectNodeContents(container)
    cloned.setEnd(range.startContainer, range.startOffset)
    startIdx = cloned.toString().length
    endIdx = startIdx + range.toString().length
  }
  if (startIdx === null || endIdx === null || endIdx <= startIdx) return null

  // Recortar los whitespace de bordes para no incluir espacios sobrantes.
  const raw = map.text.slice(startIdx, endIdx)
  const lead = raw.length - raw.trimStart().length
  const trail = raw.length - raw.trimEnd().length
  startIdx += lead
  endIdx -= trail
  if (endIdx - startIdx < MIN_HIGHLIGHT_LEN) return null

  const payload = map.text.slice(startIdx, endIdx)
  const prefix = map.text.slice(Math.max(0, startIdx - CONTEXT_LEN), startIdx)
  const suffix = map.text.slice(endIdx, Math.min(map.text.length, endIdx + CONTEXT_LEN))

  return {
    id: cryptoRandomId(),
    text: payload,
    prefix,
    suffix,
    createdAt: Date.now(),
    color,
  }
}

/** Aplica `wrapRangeWithHighlight` para un highlight guardado. Devuelve
 *  los `<mark>` creados o `[]` si no encontró el fragmento (huérfano). */
export function paintHighlight(container: HTMLElement, h: Highlight): HTMLElement[] {
  const map = buildPlainTextMap(container)
  const loc = locatePayload(map.text, h.prefix, h.text, h.suffix)
  if (!loc) return []
  const range = rangeFromPlainIndices(map, loc.start, loc.end)
  if (!range) return []
  return wrapRangeWithHighlight(range, h.id, h.color)
}

/** Quita los `<mark>` con `data-highlight-id` indicado, dejando el texto. */
export function unpaintHighlight(container: HTMLElement, id: string): void {
  const marks = container.querySelectorAll<HTMLElement>(
    `mark.pv-highlight[data-highlight-id="${cssEscape(id)}"]`,
  )
  marks.forEach(mark => {
    const parent = mark.parentNode
    if (!parent) return
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark)
    parent.removeChild(mark)
    // Mergea text nodes adyacentes que quedan tras el unwrap, para no
    // dejar el DOM fragmentado y romper futuras búsquedas exactas.
    parent.normalize()
  })
}

/* ----------------------------- utilidades ----------------------------- */

function cryptoRandomId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `h-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function cssEscape(s: string): string {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(s)
  }
  return s.replace(/["\\]/g, '\\$&')
}
