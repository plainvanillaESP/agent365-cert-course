import type { ReactNode } from 'react'
import { type Question } from '@/lib/quiz'
import { Check, X } from 'lucide-react'

interface QuestionCardProps {
  index: number
  question: Question
  /** Estado tras validar. Si null → modo edición. */
  state: 'pending' | 'correct' | 'incorrect'
  children: ReactNode
}

const TYPE_LABEL: Record<string, string> = {
  'multiple-choice': 'Opción única',
  'scenario':        'Escenario',
  'drag-and-drop':   'Drag & drop',
}

const DIFFICULTY_LABEL: Record<string, string> = {
  facil:   'Fácil',
  media:   'Media',
  dificil: 'Difícil',
}

export function QuestionCard({ index, question, state, children }: QuestionCardProps) {
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
      <header className="px-5 py-4 border-b border-[var(--border-subtle)] flex items-start gap-4">
        <div className="size-8 rounded-md bg-[var(--bg-surface-2)] flex items-center justify-center font-mono text-[13px] font-semibold text-[var(--text-primary)] shrink-0 tabular-nums">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="font-mono text-[var(--text-muted)]">{question.id}</span>
            <span className="text-[var(--text-faint)]">·</span>
            <span className="text-[var(--text-secondary)]">{TYPE_LABEL[question.type] ?? question.type}</span>
            <span className="text-[var(--text-faint)]">·</span>
            <span className="text-[var(--text-secondary)]">{DIFFICULTY_LABEL[question.difficulty]}</span>
            <span className="text-[var(--text-faint)]">·</span>
            <span className="text-[var(--text-muted)]">Bloom: {question.bloom}</span>
          </div>
        </div>
        {state !== 'pending' && <ResultBadge state={state} />}
      </header>
      <div className="p-5">{children}</div>
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
