import { NavLink, useParams } from 'react-router-dom'
import { useState } from 'react'
import { ChevronRight, Home as HomeIcon } from 'lucide-react'
import { AREAS, MODULES, type CourseArea, type CourseModule } from '@/lib/course'

const SECTIONS = [
  { slug: 'teoria',       label: 'Teoría'       },
  { slug: 'laboratorios', label: 'Laboratorios' },
  { slug: 'evaluacion',   label: 'Evaluación'   },
  { slug: 'recursos',     label: 'Recursos'     },
] as const

interface NavSidebarProps {
  /** Si true, se muestra siempre (mobile drawer abierto). */
  open?: boolean
  /** Callback al cerrar (en mobile, tras click). */
  onClose?: () => void
}

export function NavSidebar({ open, onClose }: NavSidebarProps) {
  const { id } = useParams<{ id: string }>()
  const currentModuleId = id ? parseInt(id, 10) : null

  return (
    <>
      {/* Backdrop en mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <nav
        className={[
          'nav-sidebar',
          'fixed lg:sticky top-0 lg:top-[var(--layout-header-h)] left-0 z-40 lg:z-0',
          'h-dvh lg:h-[calc(100dvh-var(--layout-header-h))]',
          'w-[var(--layout-sidebar-w)] shrink-0',
          'bg-[var(--bg-canvas)] lg:bg-transparent border-r border-[var(--border-default)]',
          'overflow-y-auto overscroll-contain',
          'transition-transform duration-200 ease-out',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
        aria-label="Navegación del curso"
      >
        <div className="py-4 px-3 space-y-1">
          {/* Home */}
          <NavLink
            to="/"
            end
            onClick={onClose}
            className={({ isActive }) =>
              ['nav-sidebar-item flex items-center gap-2', isActive && 'active'].filter(Boolean).join(' ')
            }
          >
            <HomeIcon className="size-[14px]" />
            <span>Inicio del curso</span>
          </NavLink>

          {/* Áreas y sus módulos */}
          {AREAS.map(area => (
            <AreaGroup
              key={area.id}
              area={area}
              currentModuleId={currentModuleId}
              onItemClick={onClose}
            />
          ))}

          {/* Módulo 17 — examen como sección aparte */}
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
}

function AreaGroup({ area, currentModuleId, onItemClick }: AreaGroupProps) {
  const modules = MODULES.filter(m => area.modulos.includes(m.id))
  const containsCurrent = currentModuleId != null && area.modulos.includes(currentModuleId)
  const [expanded, setExpanded] = useState(containsCurrent)

  return (
    <div className="pt-2">
      <button
        type="button"
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-md hover:bg-[var(--bg-surface-hover)] transition-colors text-left"
        aria-expanded={expanded}
      >
        <div className="min-w-0">
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]">
            Área {area.id} · {area.pesoExamen}%
          </div>
          <div className="text-[13px] font-medium text-[var(--text-secondary)] mt-0.5 leading-snug truncate">
            {area.nombreEs}
          </div>
        </div>
        <ChevronRight
          className={[
            'size-3.5 shrink-0 text-[var(--text-muted)] transition-transform',
            expanded && 'rotate-90',
          ].filter(Boolean).join(' ')}
        />
      </button>

      {expanded && (
        <div className="mt-1 space-y-0.5">
          {modules.map(m => (
            <ModuleItem
              key={m.id}
              module={m}
              isCurrent={m.id === currentModuleId}
              onItemClick={onItemClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface ModuleItemProps {
  module: CourseModule
  isCurrent: boolean
  onItemClick?: () => void
}

function ModuleItem({ module, isCurrent, onItemClick }: ModuleItemProps) {
  const isProduced = module.estado === 'producido'

  if (!isProduced) {
    return (
      <div className="nav-sidebar-item nav-sidebar-subitem disabled flex items-baseline gap-2">
        <span className="font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
          {String(module.id).padStart(2, '0')}
        </span>
        <span className="truncate" title={module.titulo}>
          {module.titulo}
        </span>
      </div>
    )
  }

  return (
    <div>
      <NavLink
        to={`/modulo/${module.id}/teoria`}
        onClick={onItemClick}
        className={({ isActive }) =>
          [
            'nav-sidebar-item nav-sidebar-subitem flex items-baseline gap-2',
            (isActive || isCurrent) && 'active',
          ].filter(Boolean).join(' ')
        }
      >
        <span className="font-mono text-[11px] tabular-nums opacity-70">
          {String(module.id).padStart(2, '0')}
        </span>
        <span className="truncate" title={module.titulo}>
          {module.titulo}
        </span>
      </NavLink>

      {/* Sub-secciones cuando es el módulo activo */}
      {isCurrent && isProduced && (
        <div className="ml-7 mt-0.5 space-y-0.5 mb-1">
          {SECTIONS.map(s => (
            <NavLink
              key={s.slug}
              to={`/modulo/${module.id}/${s.slug}`}
              onClick={onItemClick}
              className={({ isActive }) =>
                [
                  'block px-2 py-1 rounded text-[12.5px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]',
                  isActive && 'text-[var(--text-active)] font-medium',
                ].filter(Boolean).join(' ')
              }
            >
              {s.label}
            </NavLink>
          ))}
        </div>
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

  return (
    <div className="pt-3 mt-3 border-t border-[var(--border-subtle)]">
      <div className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)] px-3 mb-1">
        Evaluación final
      </div>
      {isProduced ? (
        <NavLink
          to={`/modulo/${module.id}/teoria`}
          onClick={onItemClick}
          className={({ isActive }) =>
            ['nav-sidebar-item flex items-baseline gap-2', (isActive || isCurrent) && 'active'].filter(Boolean).join(' ')
          }
        >
          <span className="font-mono text-[11px] tabular-nums opacity-70">17</span>
          <span>{module.titulo}</span>
        </NavLink>
      ) : (
        <div className="nav-sidebar-item disabled flex items-baseline gap-2">
          <span className="font-mono text-[11px] tabular-nums opacity-60">17</span>
          <span>{module.titulo}</span>
        </div>
      )}
    </div>
  )
}
