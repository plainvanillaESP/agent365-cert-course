import { useEffect, useRef, useState } from 'react'

export interface TocHeading {
  id: string
  text: string
  level: number
}

interface TocProps {
  rootSelector?: string
}

/**
 * Tabla de contenidos lateral con tres mejoras sobre la versión inicial:
 *
 *   1. **Active highlight robusto**: en lugar de quedarse con el primer
 *      heading que intersecta el viewport (que parpadeaba al scrollear
 *      rápido), mantiene un `Set` de IDs visibles y elige el primero en
 *      orden de documento. Si no hay ninguno visible (entre dos
 *      secciones), conserva el último activo.
 *   2. **Indicador de "leído"**: cada heading recuerda si en algún
 *      momento ha sido el activo. Los leídos se marcan con un punto
 *      púrpura tenue a la izquierda, así el alumno ve dónde ha
 *      avanzado dentro del módulo aunque vuelva atrás.
 *   3. **Re-escaneo si cambia el contenido**: usa `MutationObserver`
 *      para que cambiar de sección o cargar contenido reactivamente
 *      reconstruya la lista sin desmontar el componente.
 *
 * El componente se renderiza sticky bajo el header, así que conserva
 * posición al scrollear y sigue siendo navegable en cualquier punto
 * del módulo.
 */
export function TableOfContents({ rootSelector = '.markdown-body' }: TocProps) {
  const [headings, setHeadings] = useState<TocHeading[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set())
  // Mantiene los IDs visibles entre callbacks del observer; vive en un
  // ref para no causar renders innecesarios.
  const visibleIds = useRef<Set<string>>(new Set())

  useEffect(() => {
    const root = document.querySelector(rootSelector)
    if (!root) return

    let observer: IntersectionObserver | null = null

    const scan = () => {
      const elements = Array.from(root.querySelectorAll<HTMLElement>('h2, h3'))
      const found: TocHeading[] = []
      const ids: string[] = []
      for (const el of elements) {
        if (!el.id) continue
        found.push({
          id: el.id,
          text: el.textContent || '',
          level: parseInt(el.tagName.substring(1), 10),
        })
        ids.push(el.id)
      }
      setHeadings(found)

      // Reset estado al re-escanear (nuevo módulo / sección distinta).
      visibleIds.current = new Set()
      setActiveId('')
      setReadIds(new Set())

      if (observer) observer.disconnect()
      if (ids.length === 0) return

      const idSet = new Set(ids)
      const orderById = new Map(ids.map((id, idx) => [id, idx]))

      observer = new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            const id = entry.target.id
            if (!idSet.has(id)) continue
            if (entry.isIntersecting) {
              visibleIds.current.add(id)
            } else {
              visibleIds.current.delete(id)
            }
          }
          // Elegir el primero en orden de documento entre los visibles.
          let topId = ''
          let topIdx = Infinity
          for (const id of visibleIds.current) {
            const idx = orderById.get(id) ?? Infinity
            if (idx < topIdx) {
              topIdx = idx
              topId = id
            }
          }
          if (topId) {
            setActiveId(topId)
            setReadIds(prev => {
              if (prev.has(topId)) return prev
              const next = new Set(prev)
              next.add(topId)
              return next
            })
          }
        },
        {
          rootMargin: '-80px 0px -65% 0px',
          threshold: 0,
        },
      )

      for (const el of elements) {
        if (el.id) observer.observe(el)
      }
    }

    scan()

    // Re-escanea si el contenido del markdown cambia (ej. navegación
    // SPA dentro del mismo componente, o carga diferida de imágenes
    // que reflowea los IDs).
    const mutation = new MutationObserver(scan)
    mutation.observe(root, { childList: true, subtree: true })

    return () => {
      observer?.disconnect()
      mutation.disconnect()
    }
  }, [rootSelector])

  if (headings.length === 0) return null

  return (
    <nav aria-label="Tabla de contenidos" className="sticky top-[calc(var(--layout-header-h)+1.5rem)]">
      <div className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)] mb-3">
        En esta página
      </div>
      <ul className="border-l border-[var(--border-subtle)] space-y-px">
        {headings.map(h => {
          const isActive = activeId === h.id
          const isRead = readIds.has(h.id)
          return (
            <li key={h.id} className="relative">
              <a
                href={`#${h.id}`}
                aria-current={isActive ? 'true' : undefined}
                className={[
                  'block py-1 pr-2 transition-colors leading-snug -ml-px border-l-2 no-underline',
                  h.level === 3 ? 'pl-7 text-[12.5px]' : 'pl-3 text-[13px]',
                  isActive
                    ? 'border-[var(--border-active)] text-[var(--text-active)] font-medium'
                    : isRead
                      ? 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]',
                ].join(' ')}
                onClick={e => {
                  e.preventDefault()
                  const target = document.getElementById(h.id)
                  if (!target) return
                  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  history.pushState(null, '', `#${h.id}`)
                }}
              >
                {h.text}
              </a>
              {isRead && !isActive && (
                <span
                  aria-hidden
                  className={[
                    'absolute top-1/2 -translate-y-1/2 size-[5px] rounded-full',
                    'bg-[var(--color-pv-purple-500)]/55',
                    h.level === 3 ? 'left-[18px]' : 'left-[6px]',
                  ].join(' ')}
                />
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
