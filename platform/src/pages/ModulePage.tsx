import { useParams, Navigate, NavLink, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { BookOpenText, FlaskConical, ClipboardCheck, Link2, ChevronLeft, ArrowRight, Check, NotebookPen } from 'lucide-react'
import { findModule, getAreaForModule, formatDuration } from '@/lib/course'
import { loadContent, type ContentType } from '@/lib/content'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { PageHeader } from '@/components/PageHeader'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { TableOfContents } from '@/components/TableOfContents'
import { Quiz } from '@/components/quiz/Quiz'
import { getQuestionsForModule } from '@/lib/quiz'
import { Lab } from '@/components/lab/Lab'
import { getLabForModule } from '@/lib/labs'
import { Resources } from '@/components/resources/Resources'
import { getResourcesForModule } from '@/lib/resources'
import { ScrollProgress } from '@/components/ScrollProgress'
import { NotesPanel } from '@/components/NotesPanel'
import { Highlighter } from '@/components/Highlighter'
import { markSectionVisited, type TrackedSection } from '@/lib/progress'
import { useModuleProgress, useUnlockState } from '@/hooks/useModuleProgress'

const VALID_SECTIONS: ContentType[] = ['teoria', 'laboratorios', 'quiz-practica', 'recursos']

const SECTION_META = {
  teoria:          { label: 'Teoría',     icon: BookOpenText  },
  laboratorios:    { label: 'Laboratorios', icon: FlaskConical },
  'quiz-practica': { label: 'Práctica',   icon: ClipboardCheck },
  recursos:        { label: 'Recursos',   icon: Link2          },
} as const

export function ModulePage() {
  const { id, section = 'teoria' } = useParams<{ id: string; section?: string }>()

  const moduleId = id ? parseInt(id, 10) : NaN
  const module = !isNaN(moduleId) ? findModule(moduleId) : undefined

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [moduleId, section])

  // Marcar como visitada al entrar en laboratorios o recursos.
  // Las otras secciones (teoria, quiz-practica) registran progreso por
  // sus propios componentes (ScrollProgress, useQuizState).
  useEffect(() => {
    if (isNaN(moduleId)) return
    if (section === 'laboratorios' || section === 'recursos') {
      markSectionVisited(moduleId, section)
    }
  }, [moduleId, section])

  // Hook al motor de progreso. Antes del render para mantener el orden
  // de hooks estable (no condicional).
  const progress = useModuleProgress(isNaN(moduleId) ? -1 : moduleId)
  const { isUnlocked } = useUnlockState()

  // Panel de notas del alumno. Estado local de la página: la persistencia
  // del contenido vive en `useNotes`. Al cambiar de módulo el panel se
  // cierra para que el alumno no edite por error las notas del módulo
  // anterior.
  const [notesOpen, setNotesOpen] = useState(false)
  useEffect(() => {
    setNotesOpen(false)
  }, [moduleId])

  // El atajo `n` vive en `App.tsx` para que aparezca en el modal de
  // ayuda con el resto de atajos globales. Solo dispara un custom event
  // si estamos en una ruta de módulo; aquí lo escuchamos y traduce a
  // toggle del estado local del panel.
  useEffect(() => {
    const onToggle = () => setNotesOpen(o => !o)
    window.addEventListener('pv-learn:toggle-notes', onToggle)
    return () => window.removeEventListener('pv-learn:toggle-notes', onToggle)
  }, [])

  if (!module) return <Navigate to="/" replace />
  // Alias legacy: /modulo/X/evaluacion → /modulo/X/quiz-practica.
  // Bookmarks o enlaces externos al path antiguo siguen funcionando.
  if (section === 'evaluacion') {
    return <Navigate to={`/modulo/${moduleId}/quiz-practica`} replace />
  }
  if (!VALID_SECTIONS.includes(section as ContentType)) {
    return <Navigate to={`/modulo/${moduleId}/teoria`} replace />
  }
  // Gate de acceso (Bloque D.4): si el módulo está bloqueado en modo
  // secuencial, redirigir a /progreso con un querystring para que la
  // página pueda mostrar un mensaje explicativo en lugar de un toast
  // efímero. La URL queda guardable en bookmarks; al desbloquear, el
  // mensaje desaparece naturalmente.
  if (!isUnlocked(moduleId)) {
    return <Navigate to={`/progreso?locked=${moduleId}`} replace />
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
        <Breadcrumbs
          items={[
            { label: 'Inicio', to: '/' },
            ...(area ? [{ label: `Área ${area.id} · ${area.nombreEs}` }] : []),
            { label: `Módulo ${String(module.id).padStart(2, '0')}` },
          ]}
          className="mb-5"
        />

        {/* Header del módulo */}
        <div className="pb-5 mb-6 border-b border-[var(--border-default)]">
          <PageHeader
            eyebrow={`Módulo ${String(module.id).padStart(2, '0')}`}
            title={module.titulo}
          />
          <div className="flex items-center gap-3 mt-3 text-[13px] text-[var(--text-muted)] flex-wrap">
            <span>{formatDuration(module.duracionMin)}</span>
            {module.preguntas > 0 && (
              <>
                <span aria-hidden className="text-[var(--text-faint)]">·</span>
                <span>{module.preguntas} {module.preguntas === 1 ? 'pregunta' : 'preguntas'} en el examen</span>
              </>
            )}
          </div>

          {/* Tabs de sección + botón Notas */}
          <div className="mt-5 flex flex-wrap items-end justify-between gap-2 -mb-[1px] border-b border-transparent">
            <div className="flex flex-wrap gap-1">
              {Object.entries(SECTION_META).map(([slug, meta]) => {
                const Icon = meta.icon
                const isCompleted = progress.sections[slug as TrackedSection]?.status === 'completed'
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
                    {isCompleted && (
                      <Check
                        className="size-[13px] stroke-[2.5] text-emerald-600 dark:text-emerald-400"
                        aria-label="Sección completada"
                      />
                    )}
                  </NavLink>
                )
              })}
            </div>
            <button
              type="button"
              onClick={() => setNotesOpen(o => !o)}
              aria-expanded={notesOpen}
              aria-controls="module-notes-panel"
              className={[
                'inline-flex items-center gap-1.5 h-8 px-2.5 mb-0.5 rounded-md text-[12.5px] font-medium border transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pv-purple-500)]',
                notesOpen
                  ? 'bg-[var(--color-pv-purple-500)]/15 text-[var(--color-pv-purple-700)] dark:text-[var(--color-pv-purple-300)] border-[var(--color-pv-purple-500)]/40'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] border-[var(--border-default)]',
              ].join(' ')}
            >
              <NotebookPen className="size-[14px] stroke-[1.75]" aria-hidden />
              <span>Notas</span>
              <kbd
                className="hidden md:inline-flex items-center justify-center h-4 min-w-[1rem] px-1 rounded border border-[var(--border-strong)] bg-[var(--bg-surface-2)] font-mono text-[10px] font-semibold text-[var(--text-muted)] ml-0.5"
                aria-hidden
              >
                N
              </kbd>
            </button>
          </div>
        </div>

        {/* Barra de progreso de lectura, solo en teoría con contenido */}
        {section === 'teoria' && content && (
          <ScrollProgress storageKey={`agent365-reading-m${module.id}-teoria`} />
        )}

        {/* Contenido */}
        {section === 'quiz-practica' && getQuestionsForModule(module.id).length > 0 ? (
          <Quiz moduleId={module.id} />
        ) : section === 'laboratorios' && getLabForModule(module.id) ? (
          <Lab moduleId={module.id} />
        ) : section === 'recursos' && getResourcesForModule(module.id) ? (
          <Resources moduleId={module.id} />
        ) : content ? (
          <MarkdownRenderer
            body={content.body}
            moduleSlug={module.slug}
            variant={section === 'laboratorios' ? 'lab' : 'default'}
          />
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

      {/* TOC derecha — solo en teoría con markdown */}
      <aside className="hidden xl:block">
        {content &&
          section !== 'quiz-practica' &&
          section !== 'laboratorios' &&
          section !== 'recursos' && <TableOfContents />}
      </aside>

      {/* Panel de notas — drawer lateral derecho */}
      <div id="module-notes-panel">
        <NotesPanel
          open={notesOpen}
          onClose={() => setNotesOpen(false)}
          moduleId={module.id}
          moduleTitle={module.titulo}
        />
      </div>

      {/* Highlighter — solo en secciones de prosa (teoría/labs). El
          selector busca el `<article.markdown-body>` que MarkdownRenderer
          monta. Si la sección actual no usa MarkdownRenderer (quiz,
          recursos), getContainer devolverá null y el componente no
          intentará pintar nada. */}
      {(section === 'teoria' || section === 'laboratorios') && (
        <Highlighter
          getContainer={() => document.querySelector<HTMLElement>('article.markdown-body')}
          moduleId={module.id}
          section={section}
          contentKey={`${module.id}-${section}`}
        />
      )}
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
