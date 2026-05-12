import { useEffect, useRef } from 'react'
import { CheckCircle2, RotateCcw, History, Trash2, Repeat2, ListChecks } from 'lucide-react'
import { useQuizState } from '@/hooks/useQuizState'
import { celebrate } from '@/lib/confetti'
import {
  isMultipleChoice,
  isMultipleResponse,
  isDragAndDrop,
  isOrdering,
  isAnswerCorrect,
  isAnswerComplete,
  type Answer,
  type MCAnswer,
  type MRAnswer,
  type DnDAnswer,
  type OrderingAnswer,
} from '@/lib/quiz'
import { Button } from '@/components/Button'
import { QuestionCard } from './QuestionCard'
import { QuestionMultipleChoice } from './QuestionMultipleChoice'
import { QuestionMultipleResponse } from './QuestionMultipleResponse'
import { QuestionDragAndDrop } from './QuestionDragAndDrop'
import { QuestionOrdering } from './QuestionOrdering'
import { QuestionFeedback } from './QuestionFeedback'
import { QuizHeader, QuizResult } from './QuizFeedback'

interface QuizProps {
  moduleId: number
}

export function Quiz({ moduleId }: QuizProps) {
  const {
    questions,
    mode,
    currentAnswers,
    submission,
    history,
    setAnswer,
    validate,
    reset,
    startAdaptiveRound,
    clearHistory,
    allComplete,
    lastFailedCount,
    adaptivePendingCount,
  } = useQuizState(moduleId)

  const submission_ref = useRef<HTMLDivElement | null>(null)

  // Al validar, hacer scroll suave al resultado y, si todo correcto,
  // lanzar confetti (respeta prefers-reduced-motion en lib/confetti.ts).
  useEffect(() => {
    if (submission && submission_ref.current) {
      submission_ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      if (submission.score === submission.total && submission.total > 0) {
        void celebrate()
      }
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
    isAnswerComplete(q, currentAnswers[q.id]),
  ).length

  return (
    <div className="space-y-6">
      {/* Banner del modo adaptativo (solo cuando estamos repasando). */}
      {mode === 'adaptive' && (
        <AdaptiveBanner pending={questions.length} onExit={reset} submitted={!!submission} />
      )}

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
                    answer={ans as MCAnswer}
                    submission={submittedAns?.type === 'mc' ? submittedAns : null}
                    onChange={a => setAnswer(q.id, a)}
                  />
                )}
                {isMultipleResponse(q) && ans.type === 'mr' && (
                  <QuestionMultipleResponse
                    question={q}
                    answer={ans as MRAnswer}
                    submission={submittedAns?.type === 'mr' ? submittedAns : null}
                    onChange={a => setAnswer(q.id, a)}
                  />
                )}
                {isDragAndDrop(q) && ans.type === 'dnd' && (
                  <QuestionDragAndDrop
                    question={q}
                    answer={ans as DnDAnswer}
                    submission={submittedAns?.type === 'dnd' ? submittedAns : null}
                    onChange={a => setAnswer(q.id, a)}
                  />
                )}
                {isOrdering(q) && ans.type === 'order' && (
                  <QuestionOrdering
                    question={q}
                    answer={ans as OrderingAnswer}
                    submission={submittedAns?.type === 'order' ? submittedAns : null}
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
          <>
            {/* En modo full: tras validar, ofrecer repaso adaptativo si
                hubo fallos y queda algo fuera de cooldown. */}
            {mode === 'full' && lastFailedCount > 0 && adaptivePendingCount > 0 && (
              <Button
                variant="primary"
                size="lg"
                onClick={startAdaptiveRound}
                iconLeft={<Repeat2 className="size-[16px] stroke-[2]" aria-hidden />}
              >
                Repasar las {adaptivePendingCount} que fallaste
              </Button>
            )}
            {/* En modo adaptive: si todavía quedan falladas, ofrecer
                otra ronda; si no, volver al quiz completo. */}
            {mode === 'adaptive' && lastFailedCount > 0 && adaptivePendingCount > 0 && (
              <Button
                variant="primary"
                size="lg"
                onClick={startAdaptiveRound}
                iconLeft={<Repeat2 className="size-[16px] stroke-[2]" aria-hidden />}
              >
                Otra ronda · {adaptivePendingCount} pendientes
              </Button>
            )}
            <Button
              variant={
                mode === 'full' && lastFailedCount > 0 && adaptivePendingCount > 0
                  ? 'secondary'
                  : 'primary'
              }
              size="lg"
              onClick={reset}
              iconLeft={
                mode === 'adaptive' ? (
                  <ListChecks className="size-[16px] stroke-[2]" aria-hidden />
                ) : (
                  <RotateCcw className="size-[16px] stroke-[2]" aria-hidden />
                )
              }
            >
              {mode === 'adaptive' ? 'Volver al quiz completo' : 'Reiniciar práctica'}
            </Button>
            {mode === 'full' && lastFailedCount > 0 && adaptivePendingCount === 0 && (
              <span className="text-[12.5px] text-[var(--text-muted)]">
                Las {lastFailedCount} preguntas falladas están en cooldown. Vuelve más tarde
                para repasarlas.
              </span>
            )}
          </>
        )}
      </div>

      {/* Historial de intentos */}
      {history.length > 0 && (
        <AttemptHistory history={history} onClear={clearHistory} />
      )}
    </div>
  )
}

/**
 * Banner sticky-info que avisa al alumno de que está en una ronda
 * adaptativa (solo las preguntas que falló), con un atajo claro para
 * volver al quiz completo.
 */
function AdaptiveBanner({
  pending,
  onExit,
  submitted,
}: {
  pending: number
  onExit: () => void
  submitted: boolean
}) {
  return (
    <div
      role="status"
      className="rounded-lg border border-[var(--color-pv-purple-500)]/40 bg-[var(--color-pv-purple-500)]/10 px-4 py-3 flex items-center gap-3"
    >
      <Repeat2
        className="size-[18px] text-[var(--color-pv-purple-700)] dark:text-[var(--color-pv-purple-300)] shrink-0"
        aria-hidden
      />
      <div className="flex-1 min-w-0 text-[13px]">
        <span className="font-semibold text-[var(--text-primary)]">Modo repaso</span>
        <span className="text-[var(--text-secondary)]"> · </span>
        <span className="text-[var(--text-secondary)]">
          {submitted
            ? 'Acabas de validar esta ronda. Los aciertos entran en cooldown 30 min.'
            : `Practicas ${pending} pregunta${pending === 1 ? '' : 's'} que fallaste. No cuenta para el progreso oficial.`}
        </span>
      </div>
      <button
        type="button"
        onClick={onExit}
        className="shrink-0 text-[12.5px] font-medium text-[var(--color-pv-purple-700)] dark:text-[var(--color-pv-purple-300)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pv-purple-500)] rounded px-1"
      >
        Salir del repaso
      </button>
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
