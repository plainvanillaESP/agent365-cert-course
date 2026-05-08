import { Check, X } from 'lucide-react'
import type { MultipleResponseQuestion, MRAnswer } from '@/lib/quiz'

interface Props {
  question: MultipleResponseQuestion
  answer: MRAnswer
  /** Si null, modo edición. Si presente, modo revisión post-validar. */
  submission: { selectedOptionIds: string[] } | null
  onChange: (a: MRAnswer) => void
}

export function QuestionMultipleResponse({ question, answer, submission, onChange }: Props) {
  const submitted = submission !== null
  const submittedSelections = submission?.selectedOptionIds ?? []
  const correctSet = new Set(question.correctOptionIds)

  const promptParagraphs = question.prompt.split('\n').filter(Boolean)

  function toggleOption(optId: string) {
    if (submitted) return
    const next = answer.selectedOptionIds.includes(optId)
      ? answer.selectedOptionIds.filter(id => id !== optId)
      : [...answer.selectedOptionIds, optId]
    onChange({ ...answer, selectedOptionIds: next })
  }

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
        Selecciona todas las opciones que apliquen.
      </p>

      <fieldset>
        <legend className="sr-only">Opciones de respuesta (varias correctas)</legend>
        <ul className="space-y-2">
          {question.options.map(opt => {
            const selected = answer.selectedOptionIds.includes(opt.id)
            const isCorrectOption = correctSet.has(opt.id)
            const wasSelected = submittedSelections.includes(opt.id)

            let stateClasses = 'border-[var(--border-default)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface-hover)]'
            let indicatorClasses = 'border-[var(--border-strong)] bg-[var(--bg-surface)]'
            let indicatorContent: React.ReactNode = null

            if (!submitted) {
              if (selected) {
                stateClasses = 'border-[var(--color-pv-purple-500)] bg-[var(--bg-active)] hover:bg-[var(--bg-active)]'
                indicatorClasses = 'border-[var(--color-pv-purple-500)] bg-[var(--color-pv-purple-500)]'
                indicatorContent = <Check className="size-3 text-white stroke-[3]" aria-hidden />
              }
            } else {
              if (isCorrectOption && wasSelected) {
                // Marcaste bien una correcta
                stateClasses = 'border-emerald-500/50 bg-emerald-500/[0.06]'
                indicatorClasses = 'border-emerald-500 bg-emerald-500'
                indicatorContent = <Check className="size-3 text-white stroke-[3]" aria-hidden />
              } else if (isCorrectOption && !wasSelected) {
                // Era correcta y no la marcaste: la mostramos verde con borde para señalar que faltó
                stateClasses = 'border-emerald-500/50 bg-emerald-500/[0.06]'
                indicatorClasses = 'border-emerald-500 bg-[var(--bg-surface)]'
                indicatorContent = <Check className="size-3 text-emerald-600 stroke-[3]" aria-hidden />
              } else if (!isCorrectOption && wasSelected) {
                // Marcaste mal una incorrecta
                stateClasses = 'border-red-500/50 bg-red-500/[0.06]'
                indicatorClasses = 'border-red-500 bg-red-500'
                indicatorContent = <X className="size-3 text-white stroke-[3]" aria-hidden />
              } else {
                // Ni correcta ni la marcaste: neutral
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
                    type="checkbox"
                    name={question.id}
                    value={opt.id}
                    checked={selected}
                    disabled={submitted}
                    onChange={() => toggleOption(opt.id)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className={[
                      'size-[18px] shrink-0 rounded-[4px] border-2 flex items-center justify-center transition-colors mt-px',
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
