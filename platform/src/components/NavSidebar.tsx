import { NavLink, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ChevronRight, Home as HomeIcon, BookOpenText, FlaskConical, ClipboardCheck, Link2, Lock } from 'lucide-react'
import { AREAS, MODULES, type CourseArea, type CourseModule } from '@/lib/course'
import { useUnlockState } from '@/hooks/useModuleProgress'

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
            to="/"
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

          {/* Examen final */}
          <ExamSection
            module={MODULES[16]}
            currentModuleId={currentModuleId}
            onItemClick={onClose}
          />
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
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)] tabular-nums">
              Área {area.id}
            </span>
            <span className="text-[10px] font-mono text-[var(--text-faint)] tabular-nums">
              · {area.pesoExamen}%
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
            <ModuleItem
              key={m.id}
              module={m}
              isCurrent={m.id === currentModuleId}
              onItemClick={onItemClick}
              unlocked={isUnlocked(m.id)}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

interface ModuleItemProps {
  module: CourseModule
  isCurrent: boolean
  onItemClick?: () => void
  unlocked: boolean
}

function ModuleItem({ module, isCurrent, onItemClick, unlocked }: ModuleItemProps) {
  const isProduced = module.estado === 'producido'
  const moduleNum = String(module.id).padStart(2, '0')

  if (!isProduced) {
    return (
      <li>
        <div className="flex items-start gap-2 px-2.5 py-[5px] rounded-md text-[var(--text-faint)] cursor-not-allowed text-[13px] leading-snug">
          <span className="font-mono text-[11px] tabular-nums shrink-0 mt-px opacity-70">
            {moduleNum}
          </span>
          <span className="break-words">{module.titulo}</span>
        </div>
      </li>
    )
  }

  // Producido pero bloqueado por orden secuencial: visible pero sin enlace
  if (!unlocked) {
    return (
      <li>
        <div
          className="flex items-start gap-2 px-2.5 py-[5px] rounded-md text-[var(--text-faint)] cursor-not-allowed text-[13px] leading-snug"
          title="Completa los módulos anteriores para desbloquear este, o activa el modo acceso libre desde /progreso"
        >
          <span className="font-mono text-[11px] tabular-nums shrink-0 mt-px opacity-70">
            {moduleNum}
          </span>
          <span className="break-words flex-1">{module.titulo}</span>
          <Lock className="size-[11px] shrink-0 mt-[3px] opacity-70 stroke-[1.75]" aria-hidden />
        </div>
      </li>
    )
  }

  return (
    <li>
      <NavLink
        to={`/modulo/${module.id}/teoria`}
        onClick={onItemClick}
        className={({ isActive }) =>
          [
            'flex items-start gap-2 px-2.5 py-[5px] rounded-md no-underline transition-colors text-[13px] leading-snug',
            (isActive || isCurrent)
              ? 'bg-[var(--bg-active)] text-[var(--text-active)] font-medium'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]',
          ].join(' ')
        }
      >
        <span
          className={[
            'font-mono text-[11px] tabular-nums shrink-0 mt-px',
            (isCurrent) ? 'opacity-100' : 'opacity-60',
          ].join(' ')}
        >
          {moduleNum}
        </span>
        <span className="break-words">{module.titulo}</span>
      </NavLink>

      {/* Sub-secciones del módulo activo */}
      {isCurrent && (
        <ul className="ml-6 mt-0.5 mb-1 space-y-px">
          {SECTIONS.map(s => {
            const Icon = s.icon
            return (
              <li key={s.slug}>
                <NavLink
                  to={`/modulo/${module.id}/${s.slug}`}
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
    </li>
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

  return (
    <div className="pt-4 mt-3 border-t border-[var(--border-subtle)]">
      <div className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)] px-2.5 mb-1.5">
        Evaluación final
      </div>
      {isProduced ? (
        <NavLink
          to="/examen"
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
