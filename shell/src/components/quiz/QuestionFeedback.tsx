import { Lightbulb } from 'lucide-react'
import type { Question, MultipleChoiceQuestion, DragAndDropQuestion } from '@/lib/quiz'
import { isMultipleChoice, isDragAndDrop } from '@/lib/quiz'

interface Props {
  question: Question
}

export function QuestionFeedback({ question }: Props) {
  return (
    <div className="mt-4 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface-2)] overflow-hidden">
      <header className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-surface-hover)] border-b border-[var(--border-subtle)]">
        <Lightbulb
          className="size-[14px] text-amber-600 dark:text-amber-400 stroke-[1.75]"
          aria-hidden
        />
        <span className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
          Justificación
        </span>
      </header>
      <div className="p-4 space-y-3">
        {isMultipleChoice(question) && <MCAnswer question={question} />}
        {isDragAndDrop(question) && <DnDAnswer question={question} />}
        <p className="text-[13.5px] leading-relaxed text-[var(--text-secondary)]">
          {question.justification}
        </p>
      </div>
    </div>
  )
}

function MCAnswer({ question }: { question: MultipleChoiceQuestion }) {
  const correct = question.options.find(o => o.id === question.correctOptionId)
  if (!correct) return null
  return (
    <div className="flex items-baseline gap-2 text-[13.5px]">
      <span className="text-[var(--text-muted)]">Respuesta correcta:</span>
      <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-300">
        {correct.id}
      </span>
      <span className="text-[var(--text-primary)]">— {correct.text}</span>
    </div>
  )
}

function DnDAnswer({ question }: { question: DragAndDropQuestion }) {
  return (
    <div>
      <div className="text-[12.5px] text-[var(--text-muted)] mb-2">
        Asignación correcta:
      </div>
      <ul className="space-y-1.5">
        {question.items.map(item => {
          const targetId = question.correctMap[item.id]
          const target = question.targets.find(t => t.id === targetId)
          return (
            <li key={item.id} className="text-[13px] flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[var(--text-secondary)]">{item.text}</span>
              <span className="text-[var(--text-faint)]">→</span>
              <span className="font-medium text-emerald-700 dark:text-emerald-300">
                {target?.label ?? targetId}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
