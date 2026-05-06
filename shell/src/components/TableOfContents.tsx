import { useEffect, useState } from 'react'

export interface TocHeading {
  id: string
  text: string
  level: number
}

interface TocProps {
  rootSelector?: string
}

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
      if (id) found.push({ id, text, level })
    })
    setHeadings(found)

    if (found.length === 0) return

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

  if (headings.length === 0) return null

  return (
    <nav aria-label="Tabla de contenidos" className="sticky top-[calc(var(--layout-header-h)+1.5rem)]">
      <div className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)] mb-3">
        En esta página
      </div>
      <ul className="border-l border-[var(--border-subtle)] space-y-px">
        {headings.map(h => {
          const isActive = activeId === h.id
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={[
                  'block py-1 pr-2 transition-colors leading-snug -ml-px border-l-2 no-underline',
                  h.level === 3 ? 'pl-7 text-[12.5px]' : 'pl-3 text-[13px]',
                  isActive
                    ? 'border-[var(--border-active)] text-[var(--text-active)] font-medium'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]',
                ].join(' ')}
                onClick={e => {
                  e.preventDefault()
                  document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  history.pushState(null, '', `#${h.id}`)
                }}
              >
                {h.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
