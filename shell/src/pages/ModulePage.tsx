import { useParams, Navigate, NavLink, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { ChevronRight, BookOpenText, FlaskConical, ClipboardCheck, Link2, ChevronLeft, ArrowRight } from 'lucide-react'
import { findModule, getAreaForModule, formatDuration } from '@/lib/course'
import { loadContent, type ContentType } from '@/lib/content'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { TableOfContents } from '@/components/TableOfContents'

const VALID_SECTIONS: ContentType[] = ['teoria', 'laboratorios', 'evaluacion', 'recursos']

const SECTION_META = {
  teoria:       { label: 'Teoría',       icon: BookOpenText  },
  laboratorios: { label: 'Laboratorios', icon: FlaskConical  },
  evaluacion:   { label: 'Evaluación',   icon: ClipboardCheck },
  recursos:     { label: 'Recursos',     icon: Link2          },
} as const

export function ModulePage() {
  const { id, section = 'teoria' } = useParams<{ id: string; section?: string }>()

  const moduleId = id ? parseInt(id, 10) : NaN
  const module = !isNaN(moduleId) ? findModule(moduleId) : undefined

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [moduleId, section])

  if (!module) return <Navigate to="/" replace />
  if (!VALID_SECTIONS.includes(section as ContentType)) {
    return <Navigate to={`/modulo/${moduleId}/teoria`} replace />
  }

  const content = loadContent(module.slug, section as ContentType)
  const area = getAreaForModule(module.id)
  const prevModule = findModule(module.id - 1)
  const nextModule = findModule(module.id + 1)
  const prevAvail = prevModule && prevModule.estado === 'producido'
  const nextAvail = nextModule && nextModule.estado === 'producido'

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,var(--layout-content-max))_var(--layout-toc-w)] gap-8 xl:gap-12 max-w-[calc(var(--layout-content-max)+var(--layout-toc-w)+3rem)] mx-auto">
      <div className="min-w-0">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12.5px] text-[var(--text-muted)] mb-5 flex-wrap">
          <Link to="/" className="hover:text-[var(--text-primary)] transition-colors no-underline">
            Inicio
          </Link>
          {area && (
            <>
              <ChevronRight className="size-3 shrink-0 text-[var(--text-faint)]" aria-hidden />
              <span>Área {area.id} · {area.nombreEs}</span>
            </>
          )}
          <ChevronRight className="size-3 shrink-0 text-[var(--text-faint)]" aria-hidden />
          <span className="text-[var(--text-secondary)] font-medium">
            Módulo {String(module.id).padStart(2, '0')}
          </span>
        </nav>

        {/* Header del módulo */}
        <header className="pb-5 mb-6 border-b border-[var(--border-default)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-pv-purple-700)] dark:text-[var(--color-pv-purple-300)] mb-2.5">
            Módulo {String(module.id).padStart(2, '0')}
          </div>
          <h1 className="font-display text-[30px] sm:text-[34px] leading-[1.15] tracking-[-0.02em] font-bold text-[var(--text-primary)]">
            {module.titulo}
          </h1>
          <div className="flex items-center gap-3 mt-2.5 text-[13px] text-[var(--text-muted)] flex-wrap">
            <span>{formatDuration(module.duracionMin)}</span>
            {module.preguntas > 0 && (
              <>
                <span aria-hidden className="text-[var(--text-faint)]">·</span>
                <span>{module.preguntas} {module.preguntas === 1 ? 'pregunta' : 'preguntas'} en el examen</span>
              </>
            )}
          </div>

          {/* Tabs de sección */}
          <div className="mt-5 flex flex-wrap gap-1 -mb-[1px] border-b border-transparent">
            {Object.entries(SECTION_META).map(([slug, meta]) => {
              const Icon = meta.icon
              return (
                <NavLink
                  key={slug}
                  to={`/modulo/${module.id}/${slug}`}
                  end
                  className={({ isActive }) =>
                    [
                      'inline-flex items-center gap-2 px-3 py-2 text-[13px] font-medium rounded-t-md border-b-2 transition-colors no-underline',
                      isActive
                        ? 'text-[var(--text-active)] border-[var(--border-active)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] border-transparent',
                    ].join(' ')
                  }
                >
                  <Icon className="size-[14px] stroke-[1.75]" aria-hidden />
                  <span>{meta.label}</span>
                </NavLink>
              )
            })}
          </div>
        </header>

        {/* Contenido */}
        {content ? (
          <MarkdownRenderer body={content.body} moduleSlug={module.slug} />
        ) : (
          <NotProducedNotice section={section} faseProduccion={module.faseProduccion} />
        )}

        {/* Navegación entre módulos */}
        {(prevAvail || nextAvail) && (
          <nav
            aria-label="Navegación entre módulos"
            className="mt-12 pt-6 border-t border-[var(--border-default)] grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <div>
              {prevAvail && prevModule && (
                <Link
                  to={`/modulo/${prevModule.id}/teoria`}
                  className="group block px-4 py-3 rounded-md border border-[var(--border-default)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface-hover)] transition-colors no-underline"
                >
                  <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    <ChevronLeft className="size-3 stroke-[2.25]" aria-hidden />
                    <span>Anterior · Módulo {String(prevModule.id).padStart(2, '0')}</span>
                  </div>
                  <div className="text-[14px] font-medium text-[var(--text-primary)] mt-1 leading-snug">
                    {prevModule.titulo}
                  </div>
                </Link>
              )}
            </div>
            <div className="text-right">
              {nextAvail && nextModule && (
                <Link
                  to={`/modulo/${nextModule.id}/teoria`}
                  className="group block px-4 py-3 rounded-md border border-[var(--border-default)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface-hover)] transition-colors no-underline"
                >
                  <div className="flex items-center justify-end gap-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    <span>Siguiente · Módulo {String(nextModule.id).padStart(2, '0')}</span>
                    <ArrowRight className="size-3 stroke-[2.25]" aria-hidden />
                  </div>
                  <div className="text-[14px] font-medium text-[var(--text-primary)] mt-1 leading-snug">
                    {nextModule.titulo}
                  </div>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>

      {/* TOC derecha */}
      <aside className="hidden xl:block">
        {content && <TableOfContents />}
      </aside>
    </div>
  )
}

function NotProducedNotice({
  section,
  faseProduccion,
}: {
  section: string
  faseProduccion: number
}) {
  return (
    <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface-2)] p-8 text-center">
      <div className="text-[10.5px] uppercase tracking-[0.08em] font-semibold text-[var(--text-muted)] mb-2">
        {section}
      </div>
      <h2 className="font-display text-[18px] font-semibold mb-2 text-[var(--text-primary)]">
        Sección pendiente de producción
      </h2>
      <p className="text-[14px] text-[var(--text-secondary)]">
        Esta sección se producirá en la <strong className="font-semibold text-[var(--text-primary)]">Fase {faseProduccion}</strong> del plan.
      </p>
    </div>
  )
}
