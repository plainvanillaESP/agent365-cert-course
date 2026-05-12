import type { ReactNode } from 'react'

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

interface SectionProps {
  /** Texto pequeño en uppercase sobre el título. Opcional. */
  eyebrow?: string
  /** Título principal de la sección. */
  title: string
  /** Descripción debajo del título. Opcional. */
  description?: string
  /** Acción opcional alineada a la derecha del título (botón, link…). */
  action?: ReactNode
  children: ReactNode
  className?: string
}

/**
 * Bloque de sección con eyebrow, título, descripción y contenido.
 *
 * Es el patrón visual que se usa en la home, en el progreso, en los
 * ajustes y en el examen para agrupar contenido relacionado. Mantiene
 * la jerarquía tipográfica del proyecto (eyebrow uppercase + título
 * grande + descripción gris). Lo extraemos como componente para que
 * cualquier página nueva use exactamente el mismo espacio, tamaños y
 * separaciones sin tener que recordar las clases.
 */
export function Section({
  eyebrow,
  title,
  description,
  action,
  children,
  className = '',
}: SectionProps) {
  return (
    <section className={['mt-12 first:mt-0', className].join(' ')}>
      <div className="mb-5 flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          {eyebrow && (
            <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-muted)] font-semibold mb-2">
              {eyebrow}
            </div>
          )}
          <h2 className="text-[24px] font-display font-bold leading-[1.15] tracking-[-0.01em] text-[var(--text-primary)]">
            {title}
          </h2>
          {description && (
            <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed mt-2 max-w-2xl">
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Card                                                                      */
/* -------------------------------------------------------------------------- */

interface CardProps {
  children: ReactNode
  className?: string
  /** Si `true`, la card no tiene padding interno (útil para listas). */
  flush?: boolean
}

/**
 * Contenedor con borde y fondo de superficie. Es el patrón visual
 * estándar para agrupar listas, formularios, contenido relacionado.
 *
 * El parámetro `flush` quita el padding interno, lo que es útil cuando
 * el contenido es una lista cuyas filas ya tienen su propio padding
 * (ej. `<ul className="divide-y">` en home y settings).
 */
export function Card({ children, className = '', flush = false }: CardProps) {
  return (
    <div
      className={[
        'rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] overflow-hidden',
        flush ? '' : 'p-4',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  EmptyState                                                                */
/* -------------------------------------------------------------------------- */

interface EmptyStateProps {
  /** Icono grande arriba del título. Opcional. */
  icon?: ReactNode
  /** Título principal del estado vacío. */
  title: string
  /** Descripción debajo del título. Opcional. */
  description?: ReactNode
  /** CTA opcional (botón, link). */
  action?: ReactNode
  className?: string
}

/**
 * Estado vacío estándar: icono grande + título + descripción + CTA.
 *
 * Se usa cuando un listado está vacío (sin intentos del examen, sin
 * módulos completados, búsqueda sin resultados, etc.). Centrar el
 * contenido vertical y horizontalmente, con suficiente padding para
 * que respire dentro de un Card.
 *
 * Mantenerlo uniforme evita que cada página invente su forma de
 * mostrar "no hay datos", que se ve descoordinado a lo largo del
 * curso.
 */
export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center text-center py-10 px-6 gap-2',
        className,
      ].join(' ')}
    >
      {icon && (
        <div className="text-[var(--text-muted)] mb-1" aria-hidden>
          {icon}
        </div>
      )}
      <h3 className="text-[16px] font-semibold text-[var(--text-primary)] leading-tight">
        {title}
      </h3>
      {description && (
        <div className="text-[13.5px] text-[var(--text-secondary)] leading-relaxed max-w-sm">
          {description}
        </div>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Stat                                                                      */
/* -------------------------------------------------------------------------- */

interface StatProps {
  /** Icono pequeño antes del label (opcional). */
  icon?: ReactNode
  /** Etiqueta corta en uppercase (ej. "Módulos", "Duración"). */
  label: string
  /** Valor numérico o textual destacado. */
  value: ReactNode
  /** Texto pequeño bajo el valor (opcional). */
  hint?: string
  className?: string
}

/**
 * Métrica destacada: label uppercase pequeña + valor grande tabular-nums.
 *
 * Es el patrón que la home usa para mostrar "17 módulos / 18h /
 * 90 min examen / 60 preguntas" y que también aplica para resultados
 * del examen, página de progreso, dashboards futuros. Tipografía
 * y tracking unificados a un único componente.
 *
 * Si se compone dentro de `StatsGrid`, los bordes y el grid se
 * gestionan automáticamente.
 */
export function Stat({ icon, label, value, hint, className = '' }: StatProps) {
  return (
    <div className={['bg-[var(--bg-surface)] px-4 py-3.5', className].join(' ')}>
      <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.06em] font-semibold text-[var(--text-muted)] mb-1.5">
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{label}</span>
      </div>
      <div className="text-[20px] font-semibold leading-none text-[var(--text-primary)] tabular-nums font-display tracking-tight whitespace-nowrap">
        {value}
      </div>
      {hint && (
        <div className="text-[11px] text-[var(--text-muted)] mt-1.5">
          {hint}
        </div>
      )}
    </div>
  )
}

interface StatsGridProps {
  /** Número de columnas en desktop (sm+). En móvil siempre 2. */
  cols?: 2 | 3 | 4
  children: ReactNode
  className?: string
}

/**
 * Cuadrícula de stats con bordes finos entre celdas. Patrón visual
 * usado en la home para presentar las cifras del curso de un vistazo.
 * Componer pasando varios `<Stat>` como children.
 */
export function StatsGrid({ cols = 4, children, className = '' }: StatsGridProps) {
  const colsClass: Record<2 | 3 | 4, string> = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'sm:grid-cols-4',
  }
  return (
    <section
      className={[
        'grid grid-cols-2 rounded-lg overflow-hidden border border-[var(--border-default)] bg-[var(--border-subtle)] gap-px',
        colsClass[cols],
        className,
      ].join(' ')}
    >
      {children}
    </section>
  )
}
