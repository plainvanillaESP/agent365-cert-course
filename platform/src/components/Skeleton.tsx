import type { ReactNode } from 'react'

interface SkeletonProps {
  /** Anchura en px, %, o cualquier valor CSS válido. Por defecto 100%. */
  width?: string
  /** Altura en px, %, o cualquier valor CSS válido. Por defecto 1em. */
  height?: string
  /** Forma del skeleton: línea (default), círculo, rectángulo redondeado. */
  shape?: 'line' | 'circle' | 'rect'
  /** Clases extra para combinar con tailwind utilitarias del consumidor. */
  className?: string
  /** Label accesible. Solo se anuncia una vez por contenedor. */
  ariaLabel?: string
}

/**
 * Bloque de carga animado con shimmer suave (clase `.pv-skeleton` en
 * index.css). Reemplaza spinners y "Cargando…" inertes con un
 * placeholder que ocupa el sitio real del contenido futuro.
 *
 * Uso típico:
 *
 *   <Skeleton width="40%" height="1.5em" />
 *   <Skeleton shape="circle" width="32px" height="32px" />
 *   <Skeleton shape="rect" width="100%" height="200px" />
 *
 * Si tienes una región completa con varios skeletons, márcala con
 * `aria-busy="true"` y `aria-live="polite"` en el contenedor, no aquí.
 */
export function Skeleton({
  width = '100%',
  height = '1em',
  shape = 'line',
  className = '',
  ariaLabel,
}: SkeletonProps) {
  const radiusClass =
    shape === 'circle' ? 'rounded-full' : shape === 'rect' ? 'rounded-lg' : 'rounded-md'

  return (
    <span
      role={ariaLabel ? 'status' : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={['pv-skeleton inline-block align-middle', radiusClass, className].join(' ')}
      style={{ width, height }}
    />
  )
}

/**
 * Skeleton de varias líneas de texto, ideal para previsualizar
 * párrafos cargando. Cada línea es ligeramente diferente para que
 * no parezca un placeholder pegado.
 */
export function SkeletonParagraph({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  const widths = ['100%', '92%', '85%', '78%']
  return (
    <span className={['flex flex-col gap-2', className].join(' ')} aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={widths[i % widths.length]} height="0.9em" />
      ))}
    </span>
  )
}

/**
 * Envolvedor que muestra `children` solo si `ready` es true; mientras
 * tanto enseña el `fallback` (típicamente un Skeleton).
 */
export function WhenReady({
  ready,
  fallback,
  children,
}: {
  ready: boolean
  fallback: ReactNode
  children: ReactNode
}) {
  return <>{ready ? children : fallback}</>
}
