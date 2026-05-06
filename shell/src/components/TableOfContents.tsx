import { useEffect, useState } from 'react'

export interface TocHeading {
  id: string
  text: string
  level: number
}

interface TocProps {
  /**
   * Selector raíz dentro del cual buscar headings.
   */
  rootSelector?: string
}

/**
 * TOC derecha auto-generada del documento actual con scroll spy.
 * Detecta los h2 y h3 del article.markdown-body y resalta el visible.
 */
export function TableOfContents({ rootSelector = '.markdown-body' }: TocProps) {
  const [headings, setHeadings] = useState<TocHeading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const root = document.querySelector(rootSelector)
    if (!root) return

    const found: TocHeading[] = []
    const elements = root.querySelectorAll('h2, h3')
    elements.forEach(el => {
      const id = el.id
      const text = el.textContent || ''
      const level = parseInt(el.tagName.substring(1), 10)
      if (id) {
        found.push({ id, text, level })
      }
    })
    setHeadings(found)

    if (found.length === 0) return

    // Scroll spy
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      {
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0,
      }
    )

    elements.forEach(el => {
      if (el.id) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [rootSelector])

  if (headings.length === 0) {
    return null
  }

  return (
    <nav aria-label="Tabla de contenidos" className="sticky top-[calc(var(--layout-header-h)+1rem)]">
      <div className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)] mb-2 pl-3">
        En esta página
      </div>
      <ul className="space-y-0">
        {headings.map(h => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={[
                'toc-link',
                h.level === 3 && 'toc-link-h3',
                activeId === h.id && 'active',
              ].filter(Boolean).join(' ')}
              onClick={e => {
                e.preventDefault()
                document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                history.pushState(null, '', `#${h.id}`)
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
