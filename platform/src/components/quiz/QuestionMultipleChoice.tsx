import { Check, X } from 'lucide-react'
import type { MultipleChoiceQuestion, MCAnswer } from '@/lib/quiz'

interface Props {
  question: MultipleChoiceQuestion
  answer: MCAnswer
  /** Si null, modo edición. Si presente, modo revisión post-validar. */
  submission: { selectedOptionId: string | null } | null
  onChange: (a: MCAnswer) => void
}

export function QuestionMultipleChoice({ question, answer, submission, onChange }: Props) {
  const submitted = submission !== null
  const submittedSelection = submission?.selectedOptionId ?? null

  const promptParagraphs = question.prompt.split('\n').filter(Boolean)

  return (
    <div>
      <div className="space-y-3 mb-5">
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

      <fieldset>
        <legend className="sr-only">Opciones de respuesta</legend>
        <ul className="space-y-2">
          {question.options.map(opt => {
            const selected = answer.selectedOptionId === opt.id
            const isCorrectOption = opt.id === question.correctOptionId
            const wasSelected = submittedSelection === opt.id

            // Estado visual de cada opción
            let stateClasses = 'border-[var(--border-default)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface-hover)]'
            let indicatorClasses =
              'border-[var(--border-strong)] bg-[var(--bg-surface)]'
            let indicatorContent = null

            if (!submitted) {
              if (selected) {
                stateClasses =
                  'border-[var(--color-pv-purple-500)] bg-[var(--bg-active)] hover:bg-[var(--bg-active)]'
                indicatorClasses = 'border-[var(--color-pv-purple-500)] bg-[var(--color-pv-purple-500)]'
                indicatorContent = <span className="size-1.5 rounded-full bg-white" aria-hidden />
              }
            } else {
              if (isCorrectOption) {
                // La correcta siempre se marca verde tras validar
                stateClasses = 'border-emerald-500/50 bg-emerald-500/[0.06]'
                indicatorClasses = 'border-emerald-500 bg-emerald-500'
                indicatorContent = <Check className="size-3 text-white stroke-[3]" aria-hidden />
              } else if (wasSelected) {
                // Marcaste mal: rojo
                stateClasses = 'border-red-500/50 bg-red-500/[0.06]'
                indicatorClasses = 'border-red-500 bg-red-500'
                indicatorContent = <X className="size-3 text-white stroke-[3]" aria-hidden />
              } else {
                stateClasses = 'border-[var(--border-default)] opacity-60'
                indicatorClasses = 'border-[var(--border-strong)] bg-[var(--bg-surface)]'
              }
            }

            return (
              <li key={opt.id}>
                <label
                  className={[
                    'flex items-start gap-3 p-3.5 rounded-md border-2 transition-colors cursor-pointer',
                    stateClasses,
                    submitted && 'cursor-default',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={opt.id}
                    checked={selected}
                    disabled={submitted}
                    onChange={() => onChange({ ...answer, selectedOptionId: opt.id })}
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className={[
                      'size-[18px] shrink-0 rounded-full border-2 flex items-center justify-center transition-colors mt-px',
                      indicatorClasses,
                    ].join(' ')}
                  >
                    {indicatorContent}
                  </span>
                  <span className="flex items-start gap-2 flex-1 min-w-0">
                    <span className="font-mono text-[12.5px] font-semibold text-[var(--text-muted)] shrink-0 mt-0.5">
                      {opt.id}
                    </span>
                    <span className="text-[14px] leading-relaxed text-[var(--text-primary)]">
                      {opt.text}
                    </span>
                  </span>
                </label>
              </li>
            )
          })}
        </ul>
      </fieldset>
    </div>
  )
}
