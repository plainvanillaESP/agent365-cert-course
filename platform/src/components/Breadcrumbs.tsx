import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'

export interface BreadcrumbItem {
  /** Texto visible. */
  label: string
  /** Link de destino. Si se omite o es el último item, se renderiza como texto plano. */
  to?: string
  /** Icono opcional a la izquierda del label. */
  icon?: ReactNode
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

/**
 * Migas de pan con marcado semántico `aria-label="Breadcrumb"` y datos
 * estructurados schema.org BreadcrumbList para SEO. El último item se
 * renderiza siempre como texto plano sin enlace, con `aria-current="page"`.
 *
 * Reemplaza los breadcrumbs ad-hoc que ModulePage y otras páginas tenían
 * inline. Cualquier página con jerarquía debe usar este componente.
 *
 * Uso típico:
 *
 *   <Breadcrumbs items={[
 *     { label: 'Inicio', to: '/', icon: <Home className="size-3" /> },
 *     { label: 'Módulo 04', to: '/modulo/4/teoria' },
 *     { label: 'Teoría' },
 *   ]} />
 */
export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  if (items.length === 0) return null

  // Schema.org BreadcrumbList. Lo serializamos como JSON-LD en un
  // <script type="application/ld+json"> dentro del nav. Bots como
  // Googlebot y Bingbot lo entienden y lo usan para enriquecer SERPs.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.to ? { item: window.location.origin + item.to } : {}),
    })),
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={[
        'flex items-center gap-1.5 text-[12.5px] text-[var(--text-muted)] flex-wrap',
        className,
      ].join(' ')}
    >
      <ol className="flex items-center gap-1.5 flex-wrap min-w-0">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={i} className="flex items-center gap-1.5 min-w-0">
              {i > 0 && (
                <ChevronRight
                  className="size-[12px] stroke-[1.75] text-[var(--text-faint)] shrink-0"
                  aria-hidden
                />
              )}
              {isLast || !item.to ? (
                <span
                  className="flex items-center gap-1 text-[var(--text-secondary)] font-medium truncate"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  <span className="truncate">{item.label}</span>
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors no-underline truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pv-purple-500)] rounded px-0.5"
                >
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  <span className="truncate">{item.label}</span>
                </Link>
              )}
            </li>
          )
        })}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </nav>
  )
}
