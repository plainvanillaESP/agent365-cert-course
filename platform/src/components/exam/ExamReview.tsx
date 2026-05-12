import { useState, useMemo } from 'react'
import { Eye, EyeOff, CheckCircle2, XCircle, Filter } from 'lucide-react'
import { Button } from '@/components/Button'
import { QuestionCard } from '@/components/quiz/QuestionCard'
import { QuestionMultipleChoice } from '@/components/quiz/QuestionMultipleChoice'
import { QuestionMultipleResponse } from '@/components/quiz/QuestionMultipleResponse'
import { QuestionDragAndDrop } from '@/components/quiz/QuestionDragAndDrop'
import { QuestionOrdering } from '@/components/quiz/QuestionOrdering'
import { QuestionFeedback } from '@/components/quiz/QuestionFeedback'
import {
  isMultipleChoice,
  isMultipleResponse,
  isDragAndDrop,
  isOrdering,
  emptyAnswerFor,
  type Question,
  type Answer,
  type MCAnswer,
  type MRAnswer,
  type DnDAnswer,
  type OrderingAnswer,
} from '@/lib/quiz'
import { getQuestionsByIds } from '@/lib/exam'
import type { ExamAttempt } from '@/hooks/useExamState'

interface ExamReviewProps {
  attempt: ExamAttempt
}

type FilterMode = 'all' | 'wrong' | 'right'

/**
 * Revisión de respuestas del último intento. Carga las preguntas desde el
 * banco usando los `questionIds` del intento (orden original mostrado al
 * alumno) y repinta cada una en su tarjeta con la respuesta que dio y la
 * justificación del enunciado.
 *
 * Es la única vista del flujo del examen donde se muestran las
 * justificaciones; durante el examen estaban ocultas para no comprometer
 * la integridad del intento.
 */
export function ExamReview({ attempt }: ExamReviewProps) {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<FilterMode>('wrong')

  const questions = useMemo(() => getQuestionsByIds(attempt.questionIds), [attempt.questionIds])

  const filtered = useMemo(() => {
    if (filter === 'all') return questions
    if (filter === 'wrong') return questions.filter(q => !attempt.perQuestionCorrect[q.id])
    return questions.filter(q => attempt.perQuestionCorrect[q.id])
  }, [questions, filter, attempt.perQuestionCorrect])

  const wrongCount = attempt.scoring.total - attempt.scoring.score
  const rightCount = attempt.scoring.score

  if (questions.length === 0) {
    // El banco no contiene los IDs (caso raro: cambio de banco entre intento e
    // historial). No queremos romper la vista; ocultamos la sección.
    return null
  }

  return (
    <section className="space-y-4 pt-2">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">
          Revisar respuestas
        </h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setOpen(o => !o)}
          iconLeft={
            open ? (
              <EyeOff className="size-[14px] stroke-[1.75]" aria-hidden />
            ) : (
              <Eye className="size-[14px] stroke-[1.75]" aria-hidden />
            )
          }
        >
          {open ? 'Ocultar revisión' : 'Ver pregunta a pregunta'}
        </Button>
        {!open && (
          <span className="text-[12.5px] text-[var(--text-muted)]">
            Revisa cada pregunta con tu respuesta, la correcta y la justificación.
          </span>
        )}
      </div>

      {open && (
        <>
          <FilterBar
            filter={filter}
            onChange={setFilter}
            total={attempt.scoring.total}
            wrong={wrongCount}
            right={rightCount}
          />

          <ol className="space-y-5 list-none p-0 m-0">
            {filtered.map((q, idx) => {
              const correct = !!attempt.perQuestionCorrect[q.id]
              // El alumno pudo dejar la pregunta vacía (timeout). En ese caso
              // emptyAnswerFor produce el shape correcto.
              const studentAnswer: Answer = attempt.answers[q.id] ?? emptyAnswerFor(q)
              return (
                <li key={q.id}>
                  <QuestionCard index={idx} state={correct ? 'correct' : 'incorrect'}>
                    <QuestionBody
                      question={q}
                      studentAnswer={studentAnswer}
                    />
                    <QuestionFeedback question={q} />
                  </QuestionCard>
                </li>
              )
            })}
          </ol>

          {filtered.length === 0 && (
            <div className="rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 text-center text-[13.5px] text-[var(--text-secondary)]">
              {filter === 'wrong'
                ? 'No fallaste ninguna pregunta con este filtro. Buen trabajo.'
                : 'No hay preguntas que mostrar con este filtro.'}
            </div>
          )}
        </>
      )}
    </section>
  )
}

/**
 * Repinta la pregunta con la respuesta del alumno en modo "submitted":
 * los componentes `QuestionXxx` ya pintan distinta apariencia para opciones
 * correctas vs incorrectas cuando reciben `submission != null`. Aquí
 * pasamos la misma respuesta como `answer` y como `submission` para
 * que se muestre con el mismo estilo de validación que el quiz de práctica.
 */
function QuestionBody({
  question,
  studentAnswer,
}: {
  question: Question
  studentAnswer: Answer
}) {
  if (isMultipleChoice(question) && studentAnswer.type === 'mc') {
    return (
      <QuestionMultipleChoice
        question={question}
        answer={studentAnswer as MCAnswer}
        submission={studentAnswer as MCAnswer}
        onChange={() => {}}
      />
    )
  }
  if (isMultipleResponse(question) && studentAnswer.type === 'mr') {
    return (
      <QuestionMultipleResponse
        question={question}
        answer={studentAnswer as MRAnswer}
        submission={studentAnswer as MRAnswer}
        onChange={() => {}}
      />
    )
  }
  if (isDragAndDrop(question) && studentAnswer.type === 'dnd') {
    return (
      <QuestionDragAndDrop
        question={question}
        answer={studentAnswer as DnDAnswer}
        submission={studentAnswer as DnDAnswer}
        onChange={() => {}}
      />
    )
  }
  if (isOrdering(question) && studentAnswer.type === 'order') {
    return (
      <QuestionOrdering
        question={question}
        answer={studentAnswer as OrderingAnswer}
        submission={studentAnswer as OrderingAnswer}
        onChange={() => {}}
      />
    )
  }
  return null
}

function FilterBar({
  filter,
  onChange,
  total,
  wrong,
  right,
}: {
  filter: FilterMode
  onChange: (f: FilterMode) => void
  total: number
  wrong: number
  right: number
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface-2)] px-1.5 py-1.5">
      <Filter className="size-[13px] stroke-[1.75] text-[var(--text-muted)] mx-1.5" aria-hidden />
      <FilterChip active={filter === 'wrong'} onClick={() => onChange('wrong')} tone="amber">
        <XCircle className="size-[13px] stroke-[1.75]" aria-hidden />
        Falladas <span className="tabular-nums opacity-80">({wrong})</span>
      </FilterChip>
      <FilterChip active={filter === 'right'} onClick={() => onChange('right')} tone="emerald">
        <CheckCircle2 className="size-[13px] stroke-[1.75]" aria-hidden />
        Correctas <span className="tabular-nums opacity-80">({right})</span>
      </FilterChip>
      <FilterChip active={filter === 'all'} onClick={() => onChange('all')} tone="neutral">
        Todas <span className="tabular-nums opacity-80">({total})</span>
      </FilterChip>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
  tone,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  tone: 'amber' | 'emerald' | 'neutral'
}) {
  const toneActive: Record<typeof tone, string> = {
    amber: 'bg-amber-500/15 text-amber-800 dark:text-amber-200 border-amber-500/40',
    emerald: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 border-emerald-500/40',
    neutral: 'bg-[var(--bg-active)] text-[var(--text-active)] border-[var(--border-strong)]',
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex items-center gap-1.5 px-2.5 py-1 rounded text-[12.5px] font-medium border transition-colors',
        active
          ? toneActive[tone]
          : 'border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]',
      ].join(' ')}
    >
      {children}
    </button>
  )
}
