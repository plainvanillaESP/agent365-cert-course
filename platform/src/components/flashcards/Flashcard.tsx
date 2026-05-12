import { type Question } from '@/lib/quiz'
import { InlineMarkdown } from '@/components/InlineMarkdown'

interface FlashcardProps {
  question: Question
  flipped: boolean
}

/**
 * Tarjeta de flashcard: muestra el prompt (anverso) o el prompt + la
 * respuesta canónica + la justificación (reverso). Sin animación 3D
 * por defecto para mantener el componente simple y robusto en mobile;
 * la transición la maneja `FlashcardSession` con un fade entre cards.
 *
 * El reverso se construye según el tipo de pregunta: para mc/scenario
 * se muestra el texto de la opción correcta; para mr se listan las
 * correctas; para dnd/ordering se omiten porque la respuesta es
 * compuesta y la justificación ya la cubre.
 */
export function Flashcard({ question, flipped }: FlashcardProps) {
  return (
    <article className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-sm">
      <div className="text-[10.5px] uppercase tracking-[0.08em] text-[var(--text-muted)] font-semibold mb-3">
        {question.id} · {areaLabel(question.area)} · {bloomLabel(question.bloom)}
      </div>

      <div className="text-[15.5px] leading-relaxed text-[var(--text-primary)] mb-4">
        <InlineMarkdown text={question.prompt} />
      </div>

      {flipped && (
        <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] space-y-3">
          <Answer question={question} />
          <div>
            <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-muted)] font-semibold mb-1.5">
              Justificación
            </div>
            <div className="text-[14px] leading-relaxed text-[var(--text-secondary)]">
              <InlineMarkdown text={question.justification} />
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

function Answer({ question }: { question: Question }) {
  if (question.type === 'multiple-choice' || question.type === 'scenario') {
    const opt = question.options.find(o => o.id === question.correctOptionId)
    return (
      <div>
        <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-muted)] font-semibold mb-1.5">
          Respuesta correcta
        </div>
        <div className="text-[14.5px] text-[var(--text-primary)] font-medium">
          {opt ? <InlineMarkdown text={opt.text} /> : '—'}
        </div>
      </div>
    )
  }
  if (question.type === 'multiple-response') {
    return (
      <div>
        <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-muted)] font-semibold mb-1.5">
          Respuestas correctas
        </div>
        <ul className="text-[14px] text-[var(--text-primary)] space-y-1 list-disc pl-5">
          {question.options
            .filter(o => question.correctOptionIds.includes(o.id))
            .map(o => (
              <li key={o.id}>
                <InlineMarkdown text={o.text} />
              </li>
            ))}
        </ul>
      </div>
    )
  }
  if (question.type === 'ordering') {
    const itemById = Object.fromEntries(question.items.map(i => [i.id, i]))
    return (
      <div>
        <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-muted)] font-semibold mb-1.5">
          Orden correcto
        </div>
        <ol className="text-[14px] text-[var(--text-primary)] space-y-1 list-decimal pl-5">
          {question.correctOrder.map(itemId => (
            <li key={itemId}>{itemById[itemId]?.text ?? itemId}</li>
          ))}
        </ol>
      </div>
    )
  }
  // dnd: la respuesta es un mapping item→target. La justificación lo cubre.
  return null
}

function areaLabel(area: number): string {
  const labels: Record<number, string> = {
    1: 'Planificación',
    2: 'Identidades',
    3: 'Registry',
    4: 'Purview',
    5: 'Monitorización',
  }
  return labels[area] ?? `Área ${area}`
}

function bloomLabel(b: string): string {
  return b
}
