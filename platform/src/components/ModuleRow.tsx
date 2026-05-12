import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { CheckCircle2, Lock, ArrowRight } from 'lucide-react'
import type { CourseModule } from '@/lib/course'
import { formatDuration } from '@/lib/course'
import { Badge } from '@/components/Badge'

interface ModuleRowProps {
  module: CourseModule
  /** ¿El módulo está accesible para el alumno? */
  unlocked?: boolean
  /** Visual del módulo del examen final (título en bold). Solo en `variant="list"`. */
  isExam?: boolean
  /** En `variant="sidebar"`: estado activo (módulo abierto ahora). */
  isCurrent?: boolean
  /** Callback al hacer click. Útil en sidebar móvil para cerrarla. */
  onClick?: () => void
  /**
   * - `list`: vista detallada para la home, con icono de estado, duración y badge.
   * - `sidebar`: vista compacta para la nav lateral, solo número + título.
   */
  variant?: 'list' | 'sidebar'
  /**
   * Contenido extra dentro del `<li>` después del item (solo `variant="sidebar"`).
   * Útil para renderizar sub-secciones cuando el módulo está activo.
   */
  children?: ReactNode
}

/**
 * Fila de módulo unificada. Es la representación única de un módulo
 * en cualquier listado de la plataforma (home, sidebar, futuro
 * dashboard). Antes había tres versiones inline (`ModuleRow` en
 * HomePage, `ModuleItem` en NavSidebar, otra en ProgressPage) con
 * variaciones de estilo arbitrarias. Ahora todo el lenguaje visual
 * pasa por aquí.
 *
 * Variantes:
 *
 *   - `list` (default): icono de estado + número + título + duración
 *     + badge de estado + flecha. Apta para listas grandes en la home
 *     o futuras vistas de catálogo.
 *
 *   - `sidebar`: número compacto + título. NavLink con estado activo.
 *     Pensado para la barra lateral donde el espacio es premium.
 *
 * En ambas variantes, el comportamiento de bloqueo es consistente:
 * los módulos en producción y los bloqueados por orden secuencial se
 * muestran tenues y sin enlace (con tooltip explicativo).
 */
export function ModuleRow({
  module: m,
  unlocked = true,
  isExam = false,
  isCurrent = false,
  onClick,
  variant = 'list',
  children,
}: ModuleRowProps) {
  const isProduced = m.estado === 'producido'
  const isAccessible = isProduced && unlocked
  const isLocked = isProduced && !unlocked
  const moduleNum = String(m.id).padStart(2, '0')

  if (variant === 'sidebar') {
    return (
      <SidebarVariant
        m={m}
        moduleNum={moduleNum}
        isAccessible={isAccessible}
        isLocked={isLocked}
        isProduced={isProduced}
        isCurrent={isCurrent}
        onClick={onClick}
      >
        {children}
      </SidebarVariant>
    )
  }

  return (
    <ListVariant
      m={m}
      moduleNum={moduleNum}
      isAccessible={isAccessible}
      isLocked={isLocked}
      isExam={isExam}
    />
  )
}

/* -------------------------- Variante: list -------------------------- */

function ListVariant({
  m,
  moduleNum,
  isAccessible,
  isLocked,
  isExam,
}: {
  m: CourseModule
  moduleNum: string
  isAccessible: boolean
  isLocked: boolean
  isExam: boolean
}) {
  const content = (
    <div className="flex items-center gap-3 sm:gap-4 px-4 py-3 group">
      {/* Estado icono */}
      <div className="shrink-0">
        {isAccessible ? (
          <CheckCircle2
            className="size-[16px] stroke-[2] text-emerald-600 dark:text-emerald-400"
            aria-hidden
          />
        ) : (
          <Lock
            className={[
              'size-[14px] stroke-[1.75]',
              isLocked ? 'text-amber-600 dark:text-amber-400' : 'text-[var(--text-faint)]',
            ].join(' ')}
            aria-hidden
          />
        )}
      </div>

      {/* Número */}
      <div className="font-mono text-[12px] font-medium text-[var(--text-muted)] w-7 shrink-0 tabular-nums whitespace-nowrap">
        {moduleNum}
      </div>

      {/* Título */}
      <div className="flex-1 min-w-0">
        <div
          className={[
            'text-[14px] leading-snug',
            isAccessible ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)]',
            isExam && 'font-semibold',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {m.titulo}
        </div>
      </div>

      {/* Duración */}
      <div className="text-[12px] text-[var(--text-muted)] tabular-nums shrink-0 hidden sm:block whitespace-nowrap text-right min-w-[58px]">
        {formatDuration(m.duracionMin)}
      </div>

      {/* Badge de estado */}
      <div className="shrink-0 hidden md:flex justify-end min-w-[100px]">
        {isAccessible ? (
          <Badge variant="success" size="xs" dot>
            Disponible
          </Badge>
        ) : isLocked ? (
          <Badge variant="warning" size="xs" dot>
            Bloqueado
          </Badge>
        ) : (
          <Badge variant="neutral" size="xs">
            Fase {m.faseProduccion}
          </Badge>
        )}
      </div>

      {/* Flecha */}
      {isAccessible && (
        <ArrowRight
          className="size-[14px] stroke-[1.75] text-[var(--text-muted)] shrink-0 group-hover:text-[var(--color-pv-purple-600)] dark:group-hover:text-[var(--color-pv-purple-300)] group-hover:translate-x-0.5 transition-all"
          aria-hidden
        />
      )}
    </div>
  )

  if (isAccessible) {
    return (
      <li>
        <Link
          to={`/modulo/${m.id}/teoria`}
          className="block hover:bg-[var(--bg-surface-hover)] transition-colors no-underline"
        >
          {content}
        </Link>
      </li>
    )
  }

  return (
    <li
      className="opacity-75"
      title={isLocked ? 'Completa los módulos anteriores o activa modo acceso libre' : undefined}
    >
      {content}
    </li>
  )
}

/* ------------------------ Variante: sidebar ------------------------ */

function SidebarVariant({
  m,
  moduleNum,
  isLocked,
  isProduced,
  isCurrent,
  onClick,
  children,
}: {
  m: CourseModule
  moduleNum: string
  isAccessible: boolean
  isLocked: boolean
  isProduced: boolean
  isCurrent: boolean
  onClick?: () => void
  children?: ReactNode
}) {
  if (!isProduced) {
    return (
      <li>
        <div className="flex items-start gap-2 px-2.5 py-[5px] rounded-md text-[var(--text-faint)] cursor-not-allowed text-[13px] leading-snug">
          <span className="font-mono text-[11px] tabular-nums shrink-0 mt-px opacity-70">
            {moduleNum}
          </span>
          <span className="break-words">{m.titulo}</span>
        </div>
      </li>
    )
  }

  if (isLocked) {
    return (
      <li>
        <div
          className="flex items-start gap-2 px-2.5 py-[5px] rounded-md text-[var(--text-faint)] cursor-not-allowed text-[13px] leading-snug"
          title="Completa los módulos anteriores para desbloquear este, o activa el modo acceso libre desde /ajustes"
        >
          <span className="font-mono text-[11px] tabular-nums shrink-0 mt-px opacity-70">
            {moduleNum}
          </span>
          <span className="break-words flex-1">{m.titulo}</span>
          <Lock className="size-[11px] shrink-0 mt-[3px] opacity-70 stroke-[1.75]" aria-hidden />
        </div>
      </li>
    )
  }

  return (
    <li>
      <NavLink
        to={`/modulo/${m.id}/teoria`}
        onClick={onClick}
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
            isCurrent ? 'opacity-100' : 'opacity-60',
          ].join(' ')}
        >
          {moduleNum}
        </span>
        <span className="break-words">{m.titulo}</span>
      </NavLink>
      {children}
    </li>
  )
}

export { ListVariant as ModuleRowList, SidebarVariant as ModuleRowSidebar }
