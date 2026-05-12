import { useState } from 'react'
import { LayoutGrid } from 'lucide-react'
import { isAnswerComplete, type Question, type Answer } from '@/lib/quiz'

interface ExamSidebarIndexProps {
  questions: Question[]
  answers: Record<string, Answer>
  /** id del DOM al que hacer scroll cuando se pulsa una pregunta. */
  getQuestionAnchorId: (index: number) => string
}

/**
 * Índice lateral del examen activo. Una grilla de botones, uno por
 * pregunta, con tres estados visuales:
 *   - respondida: relleno verde
 *   - sin responder: borde gris
 *   - actual en viewport: borde acentuado (heurística: la última en la
 *     que el alumno tocó algo; aquí simplificamos al hover y foco)
 *
 * Click en un botón hace scroll suave a la tarjeta de pregunta. En
 * mobile el índice colapsa a un summary expandible.
 */
export function ExamSidebarIndex({
  questions,
  answers,
  getQuestionAnchorId,
}: ExamSidebarIndexProps) {
  const [collapsed, setCollapsed] = useState(false)

  const answeredCount = questions.filter(q => answers[q.id] && isAnswerComplete(q, answers[q.id])).length

  return (
    <aside
      className="hidden xl:block w-[14rem] shrink-0 sticky top-[calc(var(--layout-header-h)+5rem)] self-start"
      aria-label="Índice de preguntas del examen"
    >
      <div className="rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] overflow-hidden">
        <button
          type="button"
          onClick={() => setCollapsed(c => !c)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 text-[12px] uppercase tracking-[0.06em] text-[var(--text-muted)] font-semibold hover:bg-[var(--bg-surface-hover)] transition-colors"
        >
          <span className="flex items-center gap-2">
            <LayoutGrid className="size-[13px] stroke-[1.75]" aria-hidden />
            Índice
          </span>
          <span className="font-mono tabular-nums text-[11px] normal-case">
            {answeredCount}/{questions.length}
          </span>
        </button>

        {!collapsed && (
          <div className="border-t border-[var(--border-subtle)] p-2">
            <ol className="grid grid-cols-5 gap-1.5 list-none p-0 m-0">
              {questions.map((q, idx) => {
                const done = answers[q.id] && isAnswerComplete(q, answers[q.id])
                return (
                  <li key={q.id} className="m-0 p-0">
                    <a
                      href={`#${getQuestionAnchorId(idx)}`}
                      onClick={e => {
                        e.preventDefault()
                        const el = document.getElementById(getQuestionAnchorId(idx))
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          // Pequeño highlight visual tras saltar
                          el.classList.add('exam-jump-highlight')
                          window.setTimeout(() => el.classList.remove('exam-jump-highlight'), 1200)
                        }
                      }}
                      aria-label={`Pregunta ${idx + 1}${done ? ' (respondida)' : ' (sin responder)'}`}
                      className={[
                        'flex items-center justify-center h-7 rounded text-[11.5px] font-mono tabular-nums no-underline transition-colors',
                        done
                          ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 border border-emerald-500/40 hover:bg-emerald-500/25'
                          : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:bg-[var(--bg-surface-hover)]',
                      ].join(' ')}
                    >
                      {idx + 1}
                    </a>
                  </li>
                )
              })}
            </ol>

            <div className="flex items-center gap-3 pt-2 mt-2 border-t border-[var(--border-subtle)] text-[10.5px] text-[var(--text-muted)]">
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-sm bg-emerald-500/40 border border-emerald-500/60" aria-hidden />
                Respondida
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-sm bg-[var(--bg-surface-2)] border border-[var(--border-default)]" aria-hidden />
                Pendiente
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
