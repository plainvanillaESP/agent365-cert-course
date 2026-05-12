import type { ReactNode } from 'react'

export type BadgeVariant =
  | 'neutral'   // gris  — categoría, área, info neutral
  | 'success'   // verde — completado, aprobado, GA
  | 'warning'   // ámbar — preview, parcial, atención
  | 'danger'    // rojo  — suspenso, deprecated, error
  | 'info'      // azul  — en curso, activo
  | 'brand'     // púrpura — destacado de marca, pendiente importante
  | 'frontier'  // gradient brand — feature de vanguardia

export type BadgeSize = 'xs' | 'sm' | 'md'

interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  /** Punto de color a la izquierda. Útil para badges de estado. */
  dot?: boolean
  /** Icono pequeño a la izquierda. */
  icon?: ReactNode
  children: ReactNode
  className?: string
  /** Si se pasa, el badge es un `<button>` y dispara `onClick`. */
  onClick?: () => void
  /** Sólo si es interactivo: aria-label opcional. */
  ariaLabel?: string
}

/**
 * Pildora de texto con color semántico. Reemplaza los múltiples
 * patrones de badge inline que la plataforma tenía duplicados
 * (`badge-status` en markdown, pills de estado en HomePage,
 * sidebar y progreso). Componente único, todas las variantes en
 * un solo sitio.
 *
 * Variantes pensadas para estados de la plataforma:
 *
 *   - `success` para módulos completados, exámenes aprobados,
 *     features GA.
 *   - `info`    para "En curso", módulo actual.
 *   - `warning` para Preview, partial, atención.
 *   - `danger`  para Suspenso, Deprecated, error.
 *   - `neutral` para áreas, categorías, tags.
 *   - `brand`   para destacar pendiente importante o marca.
 *   - `frontier` con gradient brand para features de vanguardia.
 *
 * Tamaños xs/sm/md. Mantener uniformidad: si dudas, usa `sm`.
 *
 * Si pasas `onClick`, el badge se renderiza como botón accesible
 * con hover y focus ring.
 */
export function Badge({
  variant = 'neutral',
  size = 'sm',
  dot = false,
  icon,
  children,
  className = '',
  onClick,
  ariaLabel,
}: BadgeProps) {
  const variantClasses: Record<BadgeVariant, string> = {
    neutral:  'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] border border-[var(--border-subtle)]',
    success:  'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30',
    warning:  'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30',
    danger:   'bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/30',
    info:     'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/30',
    brand:    'bg-[var(--color-pv-purple-100)] text-[var(--color-pv-purple-800)] dark:bg-[var(--color-pv-purple-500)]/15 dark:text-[var(--color-pv-purple-200)] border border-[var(--color-pv-purple-300)] dark:border-[var(--color-pv-purple-500)]/30',
    frontier: 'text-white border-0 bg-gradient-to-r from-[var(--color-pv-purple-500)] to-[var(--color-pv-pink-500)] shadow-sm',
  }

  const dotClasses: Record<BadgeVariant, string> = {
    neutral:  'bg-[var(--text-muted)]',
    success:  'bg-emerald-500',
    warning:  'bg-amber-500',
    danger:   'bg-red-500',
    info:     'bg-blue-500',
    brand:    'bg-[var(--color-pv-purple-500)]',
    frontier: 'bg-white/90',
  }

  const sizeClasses: Record<BadgeSize, string> = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-1 leading-none rounded',
    sm: 'text-[11px] px-2 py-0.5 gap-1.5 leading-tight rounded',
    md: 'text-[12.5px] px-2.5 py-1 gap-1.5 leading-tight rounded-md',
  }

  const baseClass = [
    'inline-flex items-center font-semibold uppercase tracking-wider whitespace-nowrap',
    sizeClasses[size],
    variantClasses[variant],
    onClick ? 'cursor-pointer hover:opacity-85 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pv-purple-500)]' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {dot && (
        <span
          className={['inline-block size-1.5 rounded-full shrink-0', dotClasses[variant]].join(' ')}
          aria-hidden
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </>
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-label={ariaLabel} className={baseClass}>
        {content}
      </button>
    )
  }

  return <span className={baseClass}>{content}</span>
}
