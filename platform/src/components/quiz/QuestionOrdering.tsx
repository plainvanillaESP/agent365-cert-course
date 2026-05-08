import { useEffect } from 'react'
import { ArrowUp, ArrowDown, Check, X } from 'lucide-react'
import type { OrderingQuestion, OrderingAnswer } from '@/lib/quiz'

interface Props {
  question: OrderingQuestion
  answer: OrderingAnswer
  /** Si null, modo edición. Si presente, modo revisión post-validar. */
  submission: { order: string[] | null } | null
  onChange: (a: OrderingAnswer) => void
}

export function QuestionOrdering({ question, answer, submission, onChange }: Props) {
  const submitted = submission !== null

  // Si todavía no hay un orden inicial en el answer, lo inicializamos con el orden
  // de aparición en `items` (sin hacerlo correcto, claro: items.map(i => i.id) es
  // el orden tal como están definidos, que NO debería coincidir con correctOrder).
  useEffect(() => {
    if (!submitted && answer.order === null) {
      onChange({ ...answer, order: question.items.map(i => i.id) })
    }
    // Solo cuando montamos / cuando cambia question
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id])

  const order = (submitted ? submission!.order : answer.order) ?? question.items.map(i => i.id)
  const itemById = Object.fromEntries(question.items.map(i => [i.id, i]))

  function move(idx: number, delta: number) {
    if (submitted) return
    const target = idx + delta
    if (target < 0 || target >= order.length) return
    const next = [...order]
    ;[next[idx], next[target]] = [next[target], next[idx]]
    onChange({ ...answer, order: next })
  }

  const promptParagraphs = question.prompt.split('\n').filter(Boolean)

  return (
    <div>
      <div className="space-y-3 mb-2">
        {promptParagraphs.map((p, i) => (
          <p
            key={i}
            className={[
              'text-[14.5px] leading-relaxed',
              i === 0 ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] italic',
            ].join(' ')}
          >
            {p}
          </p>
        ))}
      </div>
      <p className="text-[12.5px] text-[var(--text-muted)] mb-4 italic">
        Ordena los elementos usando los botones de subir y bajar.
      </p>

      <ol className="space-y-2 list-none p-0 m-0">
        {order.map((itemId, idx) => {
          const item = itemById[itemId]
          if (!item) return null
          const expectedAtThisPosition = question.correctOrder[idx]
          const isCorrectHere = expectedAtThisPosition === itemId

          let stateClasses = 'border-[var(--border-default)] bg-[var(--bg-surface)]'
          let indicatorContent: React.ReactNode = (
            <span className="font-mono text-[13px] font-semibold text-[var(--text-secondary)]">
              {idx + 1}
            </span>
          )

          if (submitted) {
            if (isCorrectHere) {
              stateClasses = 'border-emerald-500/50 bg-emerald-500/[0.06]'
              indicatorContent = <Check className="size-3.5 text-emerald-600 stroke-[3]" aria-hidden />
            } else {
              stateClasses = 'border-red-500/50 bg-red-500/[0.06]'
              indicatorContent = <X className="size-3.5 text-red-600 stroke-[3]" aria-hidden />
            }
          }

          return (
            <li key={itemId}>
              <div
                className={[
                  'flex items-center gap-3 p-3 rounded-md border-2 transition-colors',
                  stateClasses,
                ].join(' ')}
              >
                <span
                  aria-hidden
                  className="size-[28px] shrink-0 rounded-full border-2 border-[var(--border-strong)] bg-[var(--bg-surface)] flex items-center justify-center"
                >
                  {indicatorContent}
                </span>
                <span className="flex-1 min-w-0 text-[14px] leading-relaxed text-[var(--text-primary)]">
                  {item.text}
                </span>
                {!submitted && (
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <button
                      type="button"
                      aria-label={`Subir "${item.text}"`}
                      disabled={idx === 0}
                      onClick={() => move(idx, -1)}
                      className="size-7 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowUp className="size-3.5 stroke-[2]" aria-hidden />
                    </button>
                    <button
                      type="button"
                      aria-label={`Bajar "${item.text}"`}
                      disabled={idx === order.length - 1}
                      onClick={() => move(idx, 1)}
                      className="size-7 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowDown className="size-3.5 stroke-[2]" aria-hidden />
                    </button>
                  </div>
                )}
              </div>
              {submitted && !isCorrectHere && expectedAtThisPosition && (
                <p className="text-[12px] text-[var(--text-muted)] mt-1 ml-11">
                  En esta posición debería ir: <span className="text-[var(--text-secondary)]">{itemById[expectedAtThisPosition]?.text}</span>
                </p>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
