import { useParams, Navigate } from 'react-router-dom'
import { findModule } from '@/lib/course'
import { loadContent, type ContentType } from '@/lib/content'
import { ModuleSidebar } from '@/components/ModuleSidebar'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'

const VALID_SECTIONS: ContentType[] = ['teoria', 'laboratorios', 'evaluacion', 'recursos']

export function ModulePage() {
  const { id, section = 'teoria' } = useParams<{ id: string; section?: string }>()

  const moduleId = id ? parseInt(id, 10) : NaN
  const module = !isNaN(moduleId) ? findModule(moduleId) : undefined

  if (!module) {
    return <Navigate to="/" replace />
  }

  if (!VALID_SECTIONS.includes(section as ContentType)) {
    return <Navigate to={`/modulo/${moduleId}/teoria`} replace />
  }

  const content = loadContent(module.slug, section as ContentType)

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <ModuleSidebar module={module} />

        <main className="flex-1 min-w-0 max-w-3xl">
          {content ? (
            <div className="animate-fade-in-up">
              <MarkdownRenderer
                body={content.body}
                moduleSlug={module.slug}
              />
            </div>
          ) : (
            <NotProducedNotice moduleId={module.id} section={section} faseProduccion={module.faseProduccion} />
          )}
        </main>
      </div>
    </div>
  )
}

function NotProducedNotice({
  moduleId,
  section,
  faseProduccion,
}: {
  moduleId: number
  section: string
  faseProduccion: number
}) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-[var(--border-default)] p-8 lg:p-12 text-center">
      <div className="text-[12px] uppercase tracking-wider font-semibold text-[var(--text-muted)] mb-2">
        Módulo {String(moduleId).padStart(2, '0')} · {section}
      </div>
      <h2 className="font-display text-[24px] font-600 mb-3">
        Contenido pendiente de producción
      </h2>
      <p className="text-[var(--text-secondary)] max-w-md mx-auto">
        Esta sección se producirá en la <strong>Fase {faseProduccion}</strong> del plan. Por ahora solo el Módulo 01 está completo.
      </p>
    </div>
  )
}
