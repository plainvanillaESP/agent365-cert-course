import { NavLink, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ChevronRight, Home as HomeIcon, BookOpenText, FlaskConical, ClipboardCheck, Link2, Settings as SettingsIcon, Sparkles } from 'lucide-react'
import { useFlashcards } from '@/hooks/useFlashcards'
import { AREAS, MODULES, EXAM_MODULE, type CourseArea, type CourseModule } from '@/lib/course'
import { useCourseOptional } from '@/contexts/CourseContext'
import { useUnlockState } from '@/hooks/useModuleProgress'
import { ModuleRow } from '@/components/ModuleRow'

const SECTIONS = [
  { slug: 'teoria',       label: 'Teoría',       icon: BookOpenText  },
  { slug: 'laboratorios', label: 'Laboratorios', icon: FlaskConical  },
  { slug: 'quiz-practica', label: 'Práctica',     icon: ClipboardCheck },
  { slug: 'recursos',     label: 'Recursos',     icon: Link2          },
] as const

interface NavSidebarProps {
  open?: boolean
  onClose?: () => void
}

export function NavSidebar({ open, onClose }: NavSidebarProps) {
  const { id } = useParams<{ id: string }>()
  const currentModuleId = id ? parseInt(id, 10) : null
  const { isUnlocked } = useUnlockState()
  const courseCtx = useCourseOptional()
  const href = (path = '') =>
    courseCtx ? courseCtx.href(path) : `/${path.replace(/^\/+/, '')}`

  return (
    <>
      {/* Backdrop en mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
          aria-hidden
        />
      )}

      <nav
        className={[
          'fixed lg:sticky top-0 lg:top-[var(--layout-header-h)] left-0 z-40 lg:z-0',
          'h-dvh lg:h-[calc(100dvh-var(--layout-header-h))]',
          'w-[var(--layout-sidebar-w)] shrink-0',
          'bg-[var(--bg-canvas)] border-r border-[var(--border-default)]',
          'overflow-y-auto overscroll-contain',
          'transition-transform duration-200 ease-out',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
        aria-label="Navegación del curso"
      >
        <div className="py-4 px-3 space-y-0.5">
          {/* Home */}
          <NavLink
            to={href('')}
            end
            onClick={onClose}
            className={({ isActive }) =>
              [
                'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13.5px] no-underline transition-colors',
                isActive
                  ? 'bg-[var(--bg-active)] text-[var(--text-active)] font-medium'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]',
              ].join(' ')
            }
          >
            <HomeIcon className="size-[15px] shrink-0 stroke-[1.75]" aria-hidden />
            <span>Inicio del curso</span>
          </NavLink>

          {/* Áreas */}
          <div className="pt-3 space-y-1">
            {AREAS.map(area => (
              <AreaGroup
                key={area.id}
                area={area}
                currentModuleId={currentModuleId}
                onItemClick={onClose}
                isUnlocked={isUnlocked}
              />
            ))}
          </div>

          {/* Examen final
              EXAM_MODULE viene de course.ts y siempre está definido
              (fallback al último módulo si el yaml no marca uno como
              examen). `MODULES[16]` era un acceso por índice fijo que
              fallaba con `undefined` cuando el curso tenía 16 módulos
              de contenido sin examen aparte. */}
          <ExamSection
            module={EXAM_MODULE}
            currentModuleId={currentModuleId}
            onItemClick={onClose}
          />

          {/* Repaso (flashcards SM-2) */}
          <RepasoLink onItemClick={onClose} />

          {/* Ajustes */}
          <div className="pt-3 mt-3 border-t border-[var(--border-subtle)]">
            <NavLink
              to="/ajustes"
              onClick={onClose}
              className={({ isActive }) =>
                [
                  'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] no-underline transition-colors',
                  isActive
                    ? 'bg-[var(--bg-active)] text-[var(--text-active)] font-medium'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]',
                ].join(' ')
              }
            >
              <SettingsIcon className="size-[15px] shrink-0 stroke-[1.75]" aria-hidden />
              <span>Ajustes</span>
            </NavLink>
          </div>
        </div>
      </nav>
    </>
  )
}

interface AreaGroupProps {
  area: CourseArea
  currentModuleId: number | null
  onItemClick?: () => void
  isUnlocked: (moduleId: number) => boolean
}

function AreaGroup({ area, currentModuleId, onItemClick, isUnlocked }: AreaGroupProps) {
  const modules = MODULES.filter(m => area.modulos.includes(m.id))
  const containsCurrent = currentModuleId != null && area.modulos.includes(currentModuleId)
  const [expanded, setExpanded] = useState(containsCurrent)
  const courseCtx = useCourseOptional()
  const areaHref = (p = '') =>
    courseCtx ? courseCtx.href(p) : `/${p.replace(/^\/+/, '')}`

  // Re-expandir si el módulo activo cambia y entra en esta área
  useEffect(() => {
    if (containsCurrent) setExpanded(true)
  }, [containsCurrent])

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-start gap-2 px-2.5 py-1.5 rounded-md hover:bg-[var(--bg-surface-hover)] transition-colors text-left group"
        aria-expanded={expanded}
      >
        <ChevronRight
          className={[
            'size-[14px] shrink-0 mt-[3px] text-[var(--text-faint)] transition-transform',
            expanded && 'rotate-90',
          ].filter(Boolean).join(' ')}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)] tabular-nums">
              Área {area.id}
            </span>
            <span className="text-[10px] font-mono text-[var(--text-faint)] tabular-nums">
              {area.pesoExamen}%
            </span>
          </div>
          <div className="text-[13px] font-medium text-[var(--text-secondary)] mt-0.5 leading-snug">
            {area.nombreEs}
          </div>
        </div>
      </button>

      {expanded && (
        <ul className="mt-0.5 mb-1 ml-3 pl-2 border-l border-[var(--border-subtle)] space-y-px">
          {modules.map(m => (
            <ModuleRow
              key={m.id}
              module={m}
              variant="sidebar"
              isCurrent={m.id === currentModuleId}
              onClick={onItemClick}
              unlocked={isUnlocked(m.id)}
            >
              {m.id === currentModuleId && (
                <ul className="ml-6 mt-0.5 mb-1 space-y-px">
                  {SECTIONS.map(s => {
                    const Icon = s.icon
                    return (
                      <li key={s.slug}>
                        <NavLink
                          to={areaHref(`modulo/${m.id}/${s.slug}`)}
                          onClick={onItemClick}
                          className={({ isActive }) =>
                            [
                              'flex items-center gap-2 px-2.5 py-1 rounded-md text-[12.5px] no-underline transition-colors',
                              isActive
                                ? 'text-[var(--text-active)] font-medium bg-[var(--bg-active)]'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]',
                            ].join(' ')
                          }
                        >
                          <Icon className="size-[13px] shrink-0 stroke-[1.75]" aria-hidden />
                          <span>{s.label}</span>
                        </NavLink>
                      </li>
                    )
                  })}
                </ul>
              )}
            </ModuleRow>
          ))}
        </ul>
      )}
    </div>
  )
}

function ExamSection({
  module,
  currentModuleId,
  onItemClick,
}: {
  module: CourseModule
  currentModuleId: number | null
  onItemClick?: () => void
}) {
  const isCurrent = module.id === currentModuleId
  const isProduced = module.estado === 'producido'
  const courseCtx = useCourseOptional()
  const examHref = courseCtx ? courseCtx.href('examen') : '/examen'

  return (
    <div className="pt-4 mt-3 border-t border-[var(--border-subtle)]">
      <div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)] px-2.5 mb-1.5">
        Evaluación final
      </div>
      {isProduced ? (
        <NavLink
          to={examHref}
          onClick={onItemClick}
          className={({ isActive }) =>
            [
              'flex items-start gap-2 px-2.5 py-2 rounded-md no-underline transition-colors text-[13px] leading-snug',
              (isActive || isCurrent)
                ? 'bg-[var(--bg-active)] text-[var(--text-active)] font-medium'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]',
            ].join(' ')
          }
        >
          <span className="font-mono text-[11px] tabular-nums shrink-0 mt-px opacity-70">17</span>
          <span className="break-words">{module.titulo}</span>
        </NavLink>
      ) : (
        <div className="flex items-start gap-2 px-2.5 py-2 rounded-md text-[var(--text-faint)] cursor-not-allowed text-[13px] leading-snug">
          <span className="font-mono text-[11px] tabular-nums shrink-0 mt-px opacity-60">17</span>
          <span className="break-words">{module.titulo}</span>
        </div>
      )}
    </div>
  )
}

/**
 * Link al repaso espaciado (flashcards). Muestra una pildora con el
 * número de cards vencidas hoy si hay alguna; si no, solo el texto.
 */
function RepasoLink({ onItemClick }: { onItemClick?: () => void }) {
  const { dueCount } = useFlashcards()
  const courseCtx = useCourseOptional()
  const repasoHref = courseCtx ? courseCtx.href('repaso') : '/repaso'
  return (
    <NavLink
      to={repasoHref}
      onClick={onItemClick}
      className={({ isActive }) =>
        [
          'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] no-underline transition-colors',
          isActive
            ? 'bg-[var(--bg-active)] text-[var(--text-active)] font-medium'
            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]',
        ].join(' ')
      }
    >
      <Sparkles className="size-[15px] shrink-0 stroke-[1.75]" aria-hidden />
      <span>Repaso</span>
      {dueCount > 0 && (
        <span
          className="ml-auto inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1.5 rounded-full bg-[var(--color-pv-purple-500)]/15 text-[11px] font-semibold text-[var(--color-pv-purple-600)] dark:text-[var(--color-pv-purple-300)] tabular-nums"
          aria-label={`${dueCount} flashcards pendientes`}
        >
          {dueCount}
        </span>
      )}
    </NavLink>
  )
}
