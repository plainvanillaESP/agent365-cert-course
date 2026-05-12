import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Highlighter as HighlighterIcon, Trash2 } from 'lucide-react'
import { useHighlights } from '@/hooks/useHighlights'
import {
  highlightFromSelection,
  paintHighlight,
  unpaintHighlight,
  type Highlight,
  type HighlightColor,
} from '@/lib/highlights'

interface HighlighterProps {
  /**
   * Función que devuelve el contenedor actual donde el alumno puede
   * resaltar. La llamada se hace tras cada render relevante; si
   * devuelve `null`, el componente no hace nada. Pasar una función (no
   * un ref) desacopla `Highlighter` del componente que renderiza el
   * contenido — útil para envolver markdown que vive dentro de otro
   * componente sin tener que forward-refear.
   */
  getContainer: () => HTMLElement | null
  moduleId: number
  section: string
  /**
   * Clave de invalidación adicional: cuando cambia, el componente
   * re-aplica los highlights al DOM (porque el contenido del
   * contenedor puede haberse reemplazado).
   */
  contentKey: string
}

interface PopoverState {
  visible: boolean
  /** Pixel coords relativos al viewport (la barra se posiciona absolute). */
  top: number
  left: number
  /** Si pulsamos sobre un `<mark>`, llevamos su id para acción de quitar. */
  existingId: string | null
}

const COLORS: HighlightColor[] = ['yellow', 'green', 'pink', 'purple']

/**
 * Componente que:
 *
 *   1. Escucha selecciones de texto dentro de `containerRef`.
 *   2. Muestra una barra flotante con paletas de color para guardar.
 *   3. Aplica `<mark>` al DOM al guardar y al cargar.
 *   4. Permite quitar un highlight pulsando sobre su `<mark>`.
 *
 * El componente NO añade DOM propio dentro del `containerRef` aparte
 * de los `<mark>`; mantiene un único `<div>` portal-like a nivel de
 * `document.body` para la barra flotante (`position: fixed`), así no
 * interfiere con la maquetación del contenido.
 *
 * Reutilización: cualquier vista que renderice un `.markdown-body`
 * (teoría, laboratorios, recursos) puede montar este componente
 * pasándole el ref. Los datos se persisten por `moduleId + section`.
 */
export function Highlighter({ getContainer, moduleId, section, contentKey }: HighlighterProps) {
  const { highlights, add, remove } = useHighlights(moduleId, section)
  const [popover, setPopover] = useState<PopoverState>({
    visible: false,
    top: 0,
    left: 0,
    existingId: null,
  })

  // Re-aplica los highlights al DOM tras renderizar contenido y tras
  // cambios en la lista de highlights. `contentKey` cambia al navegar
  // entre módulos/secciones; los efectos colaterales son del DOM.
  useLayoutEffect(() => {
    const container = getContainer()
    if (!container) return
    // Limpieza previa: quitar cualquier mark con data-highlight-id que
    // pueda haber sobrado de un render anterior.
    container.querySelectorAll<HTMLElement>('mark.pv-highlight').forEach(m => {
      const parent = m.parentNode
      if (!parent) return
      while (m.firstChild) parent.insertBefore(m.firstChild, m)
      parent.removeChild(m)
    })
    container.normalize()
    // Aplicar los persistidos.
    for (const h of highlights) {
      paintHighlight(container, h)
    }
  }, [highlights, contentKey, getContainer])

  // Escucha selección global y muestra la barra encima de la selección.
  useEffect(() => {
    const onMouseUp = () => {
      // Damos un tick para que el `Selection` se asiente tras mouseup/touchend.
      requestAnimationFrame(() => {
        const sel = window.getSelection()
        const container = getContainer()
        if (!sel || !container || sel.rangeCount === 0) {
          setPopover(p => ({ ...p, visible: false }))
          return
        }
        const range = sel.getRangeAt(0)
        if (range.collapsed) {
          // Selección colapsada (puede ser un click): si el click cayó
          // sobre un `<mark>`, ofrecemos la opción de borrar ese
          // highlight.
          const target =
            range.startContainer.nodeType === Node.ELEMENT_NODE
              ? (range.startContainer as HTMLElement)
              : range.startContainer.parentElement
          const mark = target?.closest<HTMLElement>('mark.pv-highlight[data-highlight-id]')
          if (mark) {
            const rect = mark.getBoundingClientRect()
            setPopover({
              visible: true,
              top: rect.top + window.scrollY - 44,
              left: rect.left + window.scrollX + rect.width / 2,
              existingId: mark.dataset.highlightId ?? null,
            })
            return
          }
          setPopover(p => ({ ...p, visible: false }))
          return
        }
        if (!container.contains(range.startContainer) || !container.contains(range.endContainer)) {
          setPopover(p => ({ ...p, visible: false }))
          return
        }
        const text = range.toString().trim()
        if (text.length < 3) {
          setPopover(p => ({ ...p, visible: false }))
          return
        }
        // Posiciona la barra sobre el final de la selección.
        const rect = range.getBoundingClientRect()
        setPopover({
          visible: true,
          top: rect.top + window.scrollY - 44,
          left: rect.left + window.scrollX + rect.width / 2,
          existingId: null,
        })
      })
    }

    const onScroll = () => {
      // Reposiciona o esconde al scrollear (la barra es position: absolute
      // sobre el documento, así que scroll vertical la lleva consigo, pero
      // si la selección sale de pantalla la escondemos).
      setPopover(p => {
        if (!p.visible) return p
        return p
      })
    }

    const onMouseDown = (e: MouseEvent) => {
      // Si el click es en la barra flotante, no la escondemos antes de
      // que el handler dispare.
      const target = e.target as HTMLElement | null
      if (target?.closest('[data-highlighter-bar]')) return
      // En cualquier otro click, una nueva selección se calculará en
      // mouseup; reseteamos preventivamente.
      setPopover(p => (p.visible ? { ...p, visible: false } : p))
    }

    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('touchend', onMouseUp)
    document.addEventListener('mousedown', onMouseDown)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('touchend', onMouseUp)
      document.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('scroll', onScroll)
    }
  }, [getContainer])

  const handleAdd = useCallback(
    (color: HighlightColor) => {
      const container = getContainer()
      const sel = window.getSelection()
      if (!container || !sel) return
      const h = highlightFromSelection(container, sel, color)
      if (!h) return
      add(h)
      sel.removeAllRanges()
      setPopover(p => ({ ...p, visible: false }))
    },
    [add, getContainer],
  )

  const handleRemove = useCallback(
    (id: string) => {
      const container = getContainer()
      if (container) unpaintHighlight(container, id)
      remove(id)
      setPopover(p => ({ ...p, visible: false }))
    },
    [remove, getContainer],
  )

  if (!popover.visible) return null

  return (
    <HighlighterBar
      top={popover.top}
      left={popover.left}
      existingId={popover.existingId}
      onAdd={handleAdd}
      onRemove={handleRemove}
    />
  )
}

/**
 * Barra flotante con los colores disponibles. Es position: absolute al
 * documento (no fixed) para que siga la posición de la selección
 * cuando el alumno scrollea.
 */
function HighlighterBar({
  top,
  left,
  existingId,
  onAdd,
  onRemove,
}: {
  top: number
  left: number
  existingId: string | null
  onAdd: (color: HighlightColor) => void
  onRemove: (id: string) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div
      ref={ref}
      data-highlighter-bar
      role="toolbar"
      aria-label="Acciones de resaltado"
      style={{
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        transform: 'translateX(-50%)',
      }}
      className="z-[70] inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-strong)] shadow-xl"
      // onMouseDown debe stopPropagation para no robar el rango antes de
      // que el handler de color dispare en mouseup.
      onMouseDown={e => e.preventDefault()}
    >
      {existingId ? (
        <button
          type="button"
          aria-label="Quitar resaltado"
          onClick={() => onRemove(existingId)}
          className="inline-flex items-center gap-1 h-7 px-2 rounded text-[12px] font-medium text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors"
        >
          <Trash2 className="size-[12px]" aria-hidden />
          Quitar resaltado
        </button>
      ) : (
        <>
          <HighlighterIcon
            className="size-[14px] text-[var(--text-muted)] shrink-0"
            aria-hidden
          />
          {COLORS.map(color => (
            <button
              key={color}
              type="button"
              aria-label={`Resaltar en ${color}`}
              onClick={() => onAdd(color)}
              className={[
                'size-6 rounded border border-black/15 dark:border-white/15 hover:scale-110 transition-transform',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--color-pv-purple-500)] focus-visible:ring-offset-[var(--bg-surface)]',
                colorSwatchClass(color),
              ].join(' ')}
            />
          ))}
        </>
      )}
    </div>
  )
}

function colorSwatchClass(c: HighlightColor): string {
  switch (c) {
    case 'yellow':
      return 'bg-[#fff59d]'
    case 'green':
      return 'bg-[#c8e6c9]'
    case 'pink':
      return 'bg-[#f8bbd0]'
    case 'purple':
      return 'bg-[#d1b3ff]'
  }
}

export type { Highlight }
