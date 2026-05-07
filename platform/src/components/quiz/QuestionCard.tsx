import type { ReactNode } from 'react'
import { Check, X } from 'lucide-react'

interface QuestionCardProps {
  index: number
  /** Estado tras validar. Si 'pending' → modo edición. */
  state: 'pending' | 'correct' | 'incorrect'
  children: ReactNode
}

export function QuestionCard({ index, state, children }: QuestionCardProps) {
  const borderColor =
    state === 'correct'
      ? 'border-emerald-500/40 dark:border-emerald-400/40'
      : state === 'incorrect'
        ? 'border-red-500/40 dark:border-red-400/40'
        : 'border-[var(--border-default)]'

  return (
    <article
      className={[
        'rounded-lg border bg-[var(--bg-surface)] overflow-hidden transition-colors',
        borderColor,
      ].join(' ')}
    >
      <div className="px-5 sm:px-6 pt-5 pb-1 flex items-start justify-between gap-3">
        <div className="size-8 rounded-md bg-[var(--bg-surface-2)] flex items-center justify-center font-display text-[15px] font-semibold text-[var(--text-primary)] shrink-0 tabular-nums">
          {index + 1}
        </div>
        {state !== 'pending' && <ResultBadge state={state} />}
      </div>
      <div className="px-5 sm:px-6 pb-5 pt-3">{children}</div>
    </article>
  )
}

function ResultBadge({ state }: { state: 'correct' | 'incorrect' }) {
  if (state === 'correct') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11.5px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 shrink-0">
        <Check className="size-[13px] stroke-[2.5]" aria-hidden />
        Correcta
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11.5px] font-semibold uppercase tracking-wider text-red-700 dark:text-red-300 bg-red-500/10 shrink-0">
      <X className="size-[13px] stroke-[2.5]" aria-hidden />
      Incorrecta
    </span>
  )
}
