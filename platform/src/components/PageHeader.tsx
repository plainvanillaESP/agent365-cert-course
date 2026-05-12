import type { ReactNode } from 'react'

interface PageHeaderProps {
  /** Texto pequeño en uppercase sobre el título. Opcional. */
  eyebrow?: string
  /** Título principal de la página. */
  title: string
  /** Descripción debajo del título. Opcional. */
  description?: string
  /** Acciones (botones, links) a la derecha del título en desktop. */
  actions?: ReactNode
  /**
   * Imagen/logo grande a la izquierda del bloque (variante "hero"
   * de la home). Si se omite, queda como header simple.
   */
  logo?: ReactNode
  className?: string
}

/**
 * Cabecera estándar de página. Reemplaza los headers ad-hoc que cada
 * página (HomePage, SettingsPage, ExamPreStart, ProgressPage…) tenía
 * con tamaños, tracking y espaciados ligeramente distintos.
 *
 * Dos modos según se pase `logo` o no:
 *
 *   - **Hero** (con logo): bloque grande con el logo del curso a la
 *     izquierda y el contenido textual a la derecha. Pensado para la
 *     home y para landings de curso. Eyebrow + título de 34-40 px +
 *     descripción larga + acciones.
 *
 *   - **Simple** (sin logo): bloque vertical con eyebrow + título de
 *     28-32 px + descripción + acciones. Pensado para páginas
 *     internas (ajustes, examen, progreso).
 *
 * Tipografía: `--font-display` para el h1, `--text-primary` para el
 * color, `tracking-tight` para evitar el aspecto inflado de los
 * tipos display a tamaños grandes.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  logo,
  className = '',
}: PageHeaderProps) {
  if (logo) {
    return (
      <header className={['pt-2 pb-8', className].join(' ')}>
        <div className="flex items-start gap-5 sm:gap-7">
          <div className="shrink-0 mt-1">{logo}</div>
          <div className="flex-1 min-w-0">
            {eyebrow && (
              <div className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[var(--color-pv-purple-700)] dark:text-[var(--color-pv-purple-300)] mb-3">
                {eyebrow}
              </div>
            )}
            <h1 className="font-display text-[34px] sm:text-[40px] leading-[1.1] tracking-[-0.025em] font-bold text-[var(--text-primary)] mb-4">
              {title}
            </h1>
            {description && (
              <p className="text-[16px] leading-relaxed text-[var(--text-secondary)] max-w-[640px]">
                {description}
              </p>
            )}
            {actions && <div className="mt-7 flex flex-wrap items-center gap-3">{actions}</div>}
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className={['space-y-3', className].join(' ')}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0 space-y-3">
          {eyebrow && (
            <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-muted)] font-semibold">
              {eyebrow}
            </div>
          )}
          <h1 className="text-[28px] sm:text-[32px] font-display font-semibold text-[var(--text-primary)] leading-[1.1] tracking-[-0.01em]">
            {title}
          </h1>
          {description && (
            <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="shrink-0 flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  )
}
