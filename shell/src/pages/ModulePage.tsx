import { useParams, Navigate, NavLink, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { ChevronRight, BookOpenText, FlaskConical, ClipboardCheck, Link2, ChevronLeft, ArrowRight as ArrowRightIcon } from 'lucide-react'
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

  // Scroll al top al cambiar de módulo o sección
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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_var(--layout-toc-w)] gap-8 xl:gap-12 max-w-[calc(var(--layout-content-max)+var(--layout-toc-w)+3rem)] mx-auto">
      <div className="min-w-0 max-w-[var(--layout-content-max)]">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12.5px] text-[var(--text-muted)] mb-4 flex-wrap">
          <Link to="/" className="hover:text-[var(--text-primary)] transition-colors">Inicio</Link>
          {area && (
            <>
              <ChevronRight className="size-3 shrink-0" />
              <span>Área {area.id} · {area.nombreEs}</span>
            </>
          )}
          <ChevronRight className="size-3 shrink-0" />
          <span className="text-[var(--text-secondary)]">
            Módulo {String(module.id).padStart(2, '0')}
          </span>
        </nav>

        {/* Header del módulo */}
        <header className="pb-5 border-b border-[var(--border-default)] mb-6">
          <h1 className="font-display text-[32px] leading-[1.15] tracking-[-0.02em] font-bold text-[var(--text-primary)]">
            {module.titulo}
          </h1>
          <div className="flex items-center gap-3 mt-2 text-[12.5px] text-[var(--text-muted)] flex-wrap">
            <span>Módulo {String(module.id).padStart(2, '0')}</span>
            <span aria-hidden>·</span>
            <span>{formatDuration(module.duracionMin)}</span>
            {module.preguntas > 0 && (
              <>
                <span aria-hidden>·</span>
                <span>{module.preguntas} {module.preguntas === 1 ? 'pregunta' : 'preguntas'} en el examen</span>
              </>
            )}
          </div>

          {/* Tabs de sección */}
          <div className="mt-5 flex flex-wrap gap-1 -mb-px">
            {Object.entries(SECTION_META).map(([slug, meta]) => {
              const Icon = meta.icon
              return (
                <NavLink
                  key={slug}
                  to={`/modulo/${module.id}/${slug}`}
                  end
                  className={({ isActive }) =>
                    [
                      'inline-flex items-center gap-2 px-3 py-2 text-[13px] font-medium rounded-t-md border-b-2 transition-colors',
                      isActive
                        ? 'text-[var(--text-active)] border-[var(--border-active)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] border-transparent',
                    ].join(' ')
                  }
                >
                  <Icon className="size-[14px]" />
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
        <nav
          aria-label="Navegación entre módulos"
          className="mt-12 pt-6 border-t border-[var(--border-default)] grid grid-cols-2 gap-4"
        >
          <div>
            {prevModule && prevModule.estado === 'producido' && (
              <Link
                to={`/modulo/${prevModule.id}/teoria`}
                className="group block p-3 -ml-3 rounded-md hover:bg-[var(--bg-surface-hover)] transition-colors no-underline"
              >
                <div className="flex items-center gap-1 text-[12px] text-[var(--text-muted)]">
                  <ChevronLeft className="size-3" />
                  <span>Anterior</span>
                </div>
                <div className="text-[13.5px] font-medium text-[var(--text-primary)] mt-1 leading-snug">
                  {prevModule.titulo}
                </div>
              </Link>
            )}
          </div>
          <div className="text-right">
            {nextModule && nextModule.estado === 'producido' && (
              <Link
                to={`/modulo/${nextModule.id}/teoria`}
                className="group block p-3 -mr-3 rounded-md hover:bg-[var(--bg-surface-hover)] transition-colors no-underline"
              >
                <div className="flex items-center justify-end gap-1 text-[12px] text-[var(--text-muted)]">
                  <span>Siguiente</span>
                  <ArrowRightIcon className="size-3" />
                </div>
                <div className="text-[13.5px] font-medium text-[var(--text-primary)] mt-1 leading-snug">
                  {nextModule.titulo}
                </div>
              </Link>
            )}
          </div>
        </nav>
      </div>

      {/* TOC derecha (solo en xl) */}
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
    <div className="rounded-md border border-[var(--border-default)] bg-[var(--bg-surface-2)] p-6 text-center">
      <div className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)] mb-2">
        {section}
      </div>
      <h2 className="font-display text-[18px] font-semibold mb-2">
        Sección pendiente de producción
      </h2>
      <p className="text-[13.5px] text-[var(--text-secondary)]">
        Esta sección se producirá en la <strong>Fase {faseProduccion}</strong> del plan.
      </p>
    </div>
  )
}
