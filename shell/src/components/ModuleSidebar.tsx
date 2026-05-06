import { NavLink } from 'react-router-dom'
import { BookOpenText, FlaskConical, ClipboardCheck, Link2 } from 'lucide-react'
import type { CourseModule } from '@/lib/course'
import { findModule, getAreaForModule, formatDuration } from '@/lib/course'

interface ModuleSidebarProps {
  module: CourseModule
}

const SECTIONS = [
  { slug: 'teoria',        label: 'Teoría',       icon: BookOpenText  },
  { slug: 'laboratorios',  label: 'Laboratorios', icon: FlaskConical  },
  { slug: 'evaluacion',    label: 'Evaluación',   icon: ClipboardCheck },
  { slug: 'recursos',      label: 'Recursos',     icon: Link2          },
] as const

export function ModuleSidebar({ module }: ModuleSidebarProps) {
  const area = getAreaForModule(module.id)
  const prevModule = findModule(module.id - 1)
  const nextModule = findModule(module.id + 1)

  return (
    <aside className="w-full lg:w-64 lg:shrink-0">
      <div className="lg:sticky lg:top-20 space-y-6">
        {/* Identificación del módulo */}
        <div>
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[var(--color-pv-purple-600)]">
            Módulo {String(module.id).padStart(2, '0')}
            {area && ` · Área ${area.id}`}
          </div>
          <h2 className="mt-1 font-display text-[18px] font-semibold leading-tight text-[var(--text-primary)]">
            {module.titulo}
          </h2>
          <div className="mt-2 text-[13px] text-[var(--text-muted)]">
            {formatDuration(module.duracionMin)}
            {module.preguntas > 0 && ` · ${module.preguntas} ${module.preguntas === 1 ? 'pregunta' : 'preguntas'}`}
          </div>
        </div>

        {/* Navegación entre secciones */}
        <nav>
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)] mb-2 px-3">
            Secciones
          </div>
          <ul className="space-y-0.5">
            {SECTIONS.map(s => {
              const Icon = s.icon
              return (
                <li key={s.slug}>
                  <NavLink
                    to={`/modulo/${module.id}/${s.slug}`}
                    className={({ isActive }) =>
                      [
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] transition-colors',
                        isActive
                          ? 'bg-[var(--color-pv-purple-100)] text-[var(--color-pv-purple-700)] font-medium dark:bg-[var(--color-pv-purple-800)] dark:text-[var(--color-pv-purple-100)]'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]',
                      ].join(' ')
                    }
                  >
                    <Icon className="size-[16px] shrink-0" />
                    <span>{s.label}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Navegación entre módulos */}
        <div className="border-t border-[var(--border-default)] pt-4 space-y-2">
          {prevModule && (
            <a
              href={`/modulo/${prevModule.id}/teoria`}
              className="block px-3 py-2 rounded-lg hover:bg-[var(--bg-surface-hover)] transition-colors"
            >
              <div className="text-[11px] text-[var(--text-muted)]">← Anterior</div>
              <div className="text-[13px] font-medium text-[var(--text-secondary)] mt-0.5 leading-snug">
                M{String(prevModule.id).padStart(2, '0')} · {prevModule.titulo}
              </div>
            </a>
          )}
          {nextModule && (
            <a
              href={`/modulo/${nextModule.id}/teoria`}
              className="block px-3 py-2 rounded-lg hover:bg-[var(--bg-surface-hover)] transition-colors"
            >
              <div className="text-[11px] text-[var(--text-muted)]">Siguiente →</div>
              <div className="text-[13px] font-medium text-[var(--text-secondary)] mt-0.5 leading-snug">
                M{String(nextModule.id).padStart(2, '0')} · {nextModule.titulo}
              </div>
            </a>
          )}
        </div>
      </div>
    </aside>
  )
}
