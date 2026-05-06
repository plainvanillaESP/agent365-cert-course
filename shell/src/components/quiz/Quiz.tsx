import { useEffect, useRef } from 'react'
import { CheckCircle2, RotateCcw, History, Trash2 } from 'lucide-react'
import { useQuizState } from '@/hooks/useQuizState'
import {
  isMultipleChoice,
  isDragAndDrop,
  isAnswerCorrect,
  type Answer,
  type MCAnswer,
  type DnDAnswer,
} from '@/lib/quiz'
import { Button } from '@/components/Button'
import { QuestionCard } from './QuestionCard'
import { QuestionMultipleChoice } from './QuestionMultipleChoice'
import { QuestionDragAndDrop } from './QuestionDragAndDrop'
import { QuestionFeedback } from './QuestionFeedback'
import { QuizHeader, QuizResult } from './QuizFeedback'

interface QuizProps {
  moduleId: number
}

export function Quiz({ moduleId }: QuizProps) {
  const {
    questions,
    currentAnswers,
    submission,
    history,
    setAnswer,
    validate,
    reset,
    clearHistory,
    allComplete,
  } = useQuizState(moduleId)

  const submission_ref = useRef<HTMLDivElement | null>(null)

  // Al validar, hacer scroll suave al resultado
  useEffect(() => {
    if (submission && submission_ref.current) {
      submission_ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [submission])

  if (questions.length === 0) {
    return (
      <div className="rounded-md border border-[var(--border-default)] bg-[var(--bg-surface-2)] p-6 text-center">
        <p className="text-[14px] text-[var(--text-secondary)]">
          Este módulo todavía no tiene preguntas en el banco oficial.
        </p>
      </div>
    )
  }

  const answeredCount = questions.filter(q =>
    isMultipleChoice(q)
      ? (currentAnswers[q.id] as MCAnswer).selectedOptionId !== null
      : Object.keys((currentAnswers[q.id] as DnDAnswer).placements).length === q.items.length,
  ).length

  return (
    <div className="space-y-6">
      {/* Resultado o explicación */}
      <div ref={submission_ref}>
        {submission ? (
          <QuizResult score={submission.score} total={submission.total} />
        ) : (
          <QuizHeader totalQuestions={questions.length} answeredCount={answeredCount} />
        )}
      </div>

      {/* Tarjetas de pregunta */}
      <ol className="space-y-5 list-none p-0 m-0">
        {questions.map((q, idx) => {
          const ans: Answer = currentAnswers[q.id]
          const submittedAns: Answer | null = submission ? submission.answers[q.id] : null
          const state = submission
            ? isAnswerCorrect(q, submittedAns!) ? 'correct' : 'incorrect'
            : 'pending'

          return (
            <li key={q.id}>
              <QuestionCard index={idx} state={state}>
                {isMultipleChoice(q) && ans.type === 'mc' && (
                  <QuestionMultipleChoice
                    question={q}
                    answer={ans}
                    submission={submittedAns?.type === 'mc' ? submittedAns : null}
                    onChange={a => setAnswer(q.id, a)}
                  />
                )}
                {isDragAndDrop(q) && ans.type === 'dnd' && (
                  <QuestionDragAndDrop
                    question={q}
                    answer={ans}
                    submission={submittedAns?.type === 'dnd' ? submittedAns : null}
                    onChange={a => setAnswer(q.id, a)}
                  />
                )}

                {submission && <QuestionFeedback question={q} />}
              </QuestionCard>
            </li>
          )
        })}
      </ol>

      {/* Acciones */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        {!submission ? (
          <>
            <Button
              variant="primary"
              size="lg"
              onClick={validate}
              disabled={!allComplete}
              iconLeft={<CheckCircle2 className="size-[16px] stroke-[2]" aria-hidden />}
            >
              Validar respuestas
            </Button>
            {!allComplete && (
              <span className="text-[12.5px] text-[var(--text-muted)]">
                Responde las {questions.length - answeredCount} preguntas restantes para validar.
              </span>
            )}
          </>
        ) : (
          <Button
            variant="primary"
            size="lg"
            onClick={reset}
            iconLeft={<RotateCcw className="size-[16px] stroke-[2]" aria-hidden />}
          >
            Reiniciar evaluación
          </Button>
        )}
      </div>

      {/* Historial de intentos */}
      {history.length > 0 && (
        <AttemptHistory history={history} onClear={clearHistory} />
      )}
    </div>
  )
}

function AttemptHistory({
  history,
  onClear,
}: {
  history: { submittedAt: number; score: number; total: number }[]
  onClear: () => void
}) {
  return (
    <details className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] mt-8">
      <summary className="cursor-pointer flex items-center gap-2 px-4 py-3 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] transition-colors list-none [&::-webkit-details-marker]:hidden">
        <History className="size-[14px] stroke-[1.75] text-[var(--text-muted)]" aria-hidden />
        <span>
          Tus intentos previos ({history.length})
        </span>
      </summary>
      <div className="border-t border-[var(--border-subtle)] divide-y divide-[var(--border-subtle)]">
        {history
          .slice()
          .reverse()
          .map((attempt, i) => {
            const date = new Date(attempt.submittedAt)
            return (
              <div
                key={attempt.submittedAt}
                className="flex items-center gap-4 px-4 py-2.5 text-[12.5px]"
              >
                <span className="font-mono text-[var(--text-muted)] tabular-nums w-8 shrink-0">
                  #{history.length - i}
                </span>
                <span className="text-[var(--text-secondary)] flex-1 min-w-0">
                  {date.toLocaleString('es-ES', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </span>
                <span
                  className={[
                    'font-mono font-semibold tabular-nums shrink-0 whitespace-nowrap',
                    attempt.score === attempt.total
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : attempt.score >= Math.ceil(attempt.total * 0.7)
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-amber-700 dark:text-amber-300',
                  ].join(' ')}
                >
                  {attempt.score}/{attempt.total}
                </span>
              </div>
            )
          })}
        <div className="px-4 py-2.5 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            iconLeft={<Trash2 className="size-3.5 stroke-[1.75]" aria-hidden />}
          >
            Borrar historial
          </Button>
        </div>
      </div>
    </details>
  )
}
