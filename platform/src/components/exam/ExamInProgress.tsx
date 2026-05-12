import { useState } from 'react'
import { ChevronUp, Send, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/Button'
import { QuestionCard } from '@/components/quiz/QuestionCard'
import { QuestionMultipleChoice } from '@/components/quiz/QuestionMultipleChoice'
import { QuestionMultipleResponse } from '@/components/quiz/QuestionMultipleResponse'
import { QuestionDragAndDrop } from '@/components/quiz/QuestionDragAndDrop'
import { QuestionOrdering } from '@/components/quiz/QuestionOrdering'
import {
  isMultipleChoice,
  isMultipleResponse,
  isDragAndDrop,
  isOrdering,
  isAnswerComplete,
  type Question,
  type Answer,
  type MCAnswer,
  type MRAnswer,
  type DnDAnswer,
  type OrderingAnswer,
} from '@/lib/quiz'
import { ExamTimer } from './ExamTimer'
import { ExamSidebarIndex } from './ExamSidebarIndex'
import { EXAM_DURATION_MIN } from '@/lib/exam'

const questionAnchorId = (idx: number) => `exam-q-${idx + 1}`

interface ExamInProgressProps {
  questions: Question[]
  answers: Record<string, Answer>
  remainingSec: number
  onAnswerChange: (questionId: string, answer: Answer) => void
  onSubmit: () => void
}

export function ExamInProgress({
  questions,
  answers,
  remainingSec,
  onAnswerChange,
  onSubmit,
}: ExamInProgressProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  const answeredCount = questions.filter(q => answers[q.id] && isAnswerComplete(q, answers[q.id])).length
  const totalSec = EXAM_DURATION_MIN * 60
  const progressPct = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0

  const handleSubmitClick = () => {
    if (answeredCount < questions.length) {
      setConfirmOpen(true)
    } else {
      onSubmit()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header sticky con timer y progreso */}
      <div className="sticky top-[var(--layout-header-h)] z-30 -mx-5 sm:-mx-8 lg:-mx-12 px-5 sm:px-8 lg:px-12 py-3 bg-[var(--bg-canvas)]/95 backdrop-blur border-b border-[var(--border-default)]">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 max-w-5xl">
          <ExamTimer remainingSec={remainingSec} totalSec={totalSec} />
          <div className="flex-1 min-w-[140px]">
            <div className="flex items-center justify-between text-[11.5px] text-[var(--text-muted)] mb-1">
              <span>
                Respondidas{' '}
                <span className="font-mono tabular-nums font-semibold text-[var(--text-secondary)]">
                  {answeredCount}/{questions.length}
                </span>
              </span>
              <span className="font-mono tabular-nums">{progressPct} %</span>
            </div>
            <div className="h-1.5 rounded-full bg-[var(--bg-surface-2)] overflow-hidden">
              <div
                className="h-full bg-[var(--color-pv-purple-600)] transition-[width] duration-300 ease-out"
                style={{ width: `${progressPct}%` }}
                aria-hidden
              />
            </div>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmitClick}
            iconLeft={<Send className="size-[14px] stroke-[2]" aria-hidden />}
          >
            Finalizar examen
          </Button>
        </div>
      </div>

      {/* Preguntas con índice lateral */}
      <div className="flex gap-6">
        <ol className="flex-1 min-w-0 space-y-5 list-none p-0 m-0">
          {questions.map((q, idx) => {
            const ans = answers[q.id]
            return (
              <li key={q.id} id={questionAnchorId(idx)} className="scroll-mt-[calc(var(--layout-header-h)+5rem)]">
                <QuestionCard index={idx} state="pending">
                  {isMultipleChoice(q) && ans?.type === 'mc' && (
                    <QuestionMultipleChoice
                      question={q}
                      answer={ans as MCAnswer}
                      submission={null}
                      onChange={a => onAnswerChange(q.id, a)}
                    />
                  )}
                  {isMultipleResponse(q) && ans?.type === 'mr' && (
                    <QuestionMultipleResponse
                      question={q}
                      answer={ans as MRAnswer}
                      submission={null}
                      onChange={a => onAnswerChange(q.id, a)}
                    />
                  )}
                  {isDragAndDrop(q) && ans?.type === 'dnd' && (
                    <QuestionDragAndDrop
                      question={q}
                      answer={ans as DnDAnswer}
                      submission={null}
                      onChange={a => onAnswerChange(q.id, a)}
                    />
                  )}
                  {isOrdering(q) && ans?.type === 'order' && (
                    <QuestionOrdering
                      question={q}
                      answer={ans as OrderingAnswer}
                      submission={null}
                      onChange={a => onAnswerChange(q.id, a)}
                    />
                  )}
                </QuestionCard>
              </li>
            )
          })}
        </ol>

        <ExamSidebarIndex
          questions={questions}
          answers={answers}
          getQuestionAnchorId={questionAnchorId}
        />
      </div>

      {/* Pie con submit y back-to-top */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmitClick}
          iconLeft={<Send className="size-[16px] stroke-[2]" aria-hidden />}
        >
          Finalizar examen
        </Button>
        <Button
          variant="ghost"
          size="md"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          iconLeft={<ChevronUp className="size-[16px] stroke-[1.75]" aria-hidden />}
        >
          Volver arriba
        </Button>
        {answeredCount < questions.length && (
          <span className="text-[12.5px] text-[var(--text-muted)]">
            Quedan {questions.length - answeredCount} preguntas sin responder.
          </span>
        )}
      </div>

      {/* Modal de confirmación si hay incompletas */}
      {confirmOpen && (
        <ConfirmDialog
          missing={questions.length - answeredCount}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => {
            setConfirmOpen(false)
            onSubmit()
          }}
        />
      )}
    </div>
  )
}

function ConfirmDialog({
  missing,
  onCancel,
  onConfirm,
}: {
  missing: number
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-w-md w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 shadow-xl space-y-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="size-[20px] stroke-[1.75] text-amber-500 shrink-0 mt-0.5" aria-hidden />
          <div className="space-y-1">
            <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
              ¿Finalizar el examen ahora?
            </h2>
            <p className="text-[13.5px] text-[var(--text-secondary)] leading-relaxed">
              Quedan <strong className="font-semibold">{missing}</strong> preguntas sin responder. Si finalizas ahora, esas preguntas se contarán como incorrectas y no podrás volver a editarlas.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" size="md" onClick={onCancel}>
            Seguir respondiendo
          </Button>
          <Button variant="primary" size="md" onClick={onConfirm}>
            Finalizar de todos modos
          </Button>
        </div>
      </div>
    </div>
  )
}
