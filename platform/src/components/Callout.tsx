import type { ReactNode } from 'react'
import { Info, AlertTriangle, CheckCircle2, Lightbulb, Image as ImageIcon } from 'lucide-react'

export type CalloutKind = 'info' | 'warning' | 'success' | 'tip' | 'capture'

interface CalloutProps {
  /** Tipo de callout. Define color e icono. */
  kind?: CalloutKind
  /** Título opcional sobre el cuerpo. */
  title?: ReactNode
  /** Icono custom; si no se pasa, se usa el icono por defecto del kind. */
  icon?: ReactNode
  /** Cuerpo del callout. */
  children: ReactNode
  className?: string
}

const KIND_TO_ICON: Record<CalloutKind, ReactNode> = {
  info: <Info className="size-[16px] stroke-[1.75]" aria-hidden />,
  warning: <AlertTriangle className="size-[16px] stroke-[1.75]" aria-hidden />,
  success: <CheckCircle2 className="size-[16px] stroke-[1.75]" aria-hidden />,
  tip: <Lightbulb className="size-[16px] stroke-[1.75]" aria-hidden />,
  capture: <ImageIcon className="size-[16px] stroke-[1.75]" aria-hidden />,
}

/**
 * Bloque de aviso con icono y color semántico. Mismo lenguaje visual
 * que los blockquotes clasificados por `MarkdownRenderer`, pero invocable
 * directamente desde JSX en cualquier página o componente.
 *
 * Útil cuando necesitas comunicar contexto en una UI específica
 * (página de ajustes, página del examen, modales de error, etc.) y
 * quieres mantener la coherencia visual con los callouts del contenido.
 *
 * Tipos disponibles:
 *
 *   - `info`     (azul)    — contexto, prerrequisitos, nota
 *   - `warning`  (ámbar)   — advertencia, atención
 *   - `success`  (verde)   — confirmación, validación, OK
 *   - `tip`      (púrpura) — consejo, tip
 *   - `capture`  (gris)    — placeholder, contenido pendiente
 */
export function Callout({ kind = 'info', title, icon, children, className }: CalloutProps) {
  const baseClasses: Record<CalloutKind, string> = {
    info: 'border-l-blue-500 bg-blue-500/[0.06] text-blue-900 dark:text-blue-100 dark:bg-blue-500/[0.12]',
    warning: 'border-l-amber-500 bg-amber-500/[0.08] text-amber-900 dark:text-amber-100 dark:bg-amber-500/[0.14]',
    success: 'border-l-emerald-500 bg-emerald-500/[0.07] text-emerald-900 dark:text-emerald-100 dark:bg-emerald-500/[0.14]',
    tip: 'border-l-purple-500 bg-purple-500/[0.07] text-purple-900 dark:text-purple-100 dark:bg-purple-500/[0.14]',
    capture: 'border-l-stone-500 bg-stone-500/[0.05] text-stone-700 dark:text-stone-200 dark:bg-stone-500/[0.12] border-2 border-dashed border-l-stone-500 font-mono text-[13px]',
  }

  const iconClasses: Record<CalloutKind, string> = {
    info: 'text-blue-600 dark:text-blue-400',
    warning: 'text-amber-600 dark:text-amber-400',
    success: 'text-emerald-600 dark:text-emerald-400',
    tip: 'text-purple-600 dark:text-purple-400',
    capture: 'text-stone-500 dark:text-stone-400',
  }

  return (
    <aside
      className={[
        'rounded-md border-l-4 px-4 py-3',
        baseClasses[kind],
        className ?? '',
      ].join(' ')}
      data-callout={kind}
    >
      <div className="flex items-start gap-3">
        <span className={['shrink-0 mt-0.5', iconClasses[kind]].join(' ')}>
          {icon ?? KIND_TO_ICON[kind]}
        </span>
        <div className="flex-1 min-w-0">
          {title && (
            <div className="font-semibold text-[14px] leading-snug mb-1 text-[var(--text-primary)]">
              {title}
            </div>
          )}
          <div className="text-[13.5px] leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </aside>
  )
}
