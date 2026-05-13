import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCourse } from '@/contexts/CourseContext'
import { Sparkles, RotateCcw, ArrowRight, Trash2, BookOpen } from 'lucide-react'
import { useFlashcards } from '@/hooks/useFlashcards'
import type { SrsQuality } from '@/lib/srs'
import { humanizeInterval } from '@/lib/srs'
import { findModule } from '@/lib/course'
import { Flashcard } from '@/components/flashcards/Flashcard'
import { Fade } from '@/components/Transitions'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'

/**
 * Sesión de repaso espaciado (SM-2) sobre el banco completo de
 * preguntas del curso. Cada pregunta es una flashcard cuyo estado vive
 * en `lib/srs.ts`; el deck completo lo provee `hooks/useFlashcards`.
 *
 * Flujo de la página:
 *
 *   - Si no hay cards en absoluto (curso sin preguntas): mensaje informativo.
 *   - Si hay cards pero ninguna due hoy: mensaje "Estás al día" con
 *     el tiempo hasta la próxima revisión.
 *   - Si hay cards due: sesión interactiva con el componente Flashcard.
 *     "Mostrar respuesta" voltea la card; tras voltear aparecen los
 *     botones de calidad (Again / Hard / Good / Easy) que actualizan
 *     el estado SM-2 y pasan a la siguiente.
 */
export function RepasoPage() {
  const { all, due, dueCount, reviewCard, reset } = useFlashcards()
  const { href } = useCourse()
  const [sessionIds, setSessionIds] = useState<string[]>(() => due.map(d => d.question.id))
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)

  // Si entran cards nuevas (módulos recién producidos) o el alumno
  // resetea, reconstruir la lista de la sesión actual.
  useEffect(() => {
    if (sessionIds.length === 0) {
      setSessionIds(due.map(d => d.question.id))
      setIdx(0)
      setFlipped(false)
    }
  }, [due, sessionIds.length])

  const currentEntry = useMemo(() => {
    const id = sessionIds[idx]
    return all.find(e => e.question.id === id) ?? null
  }, [sessionIds, idx, all])

  const onReview = (quality: SrsQuality) => {
    if (!currentEntry) return
    reviewCard(currentEntry.question.id, quality)
    setFlipped(false)
    if (idx + 1 >= sessionIds.length) {
      // Fin de sesión: vacía el estado para que el useEffect reconstruya
      // con los que sigan due tras los reviews.
      setSessionIds([])
      setIdx(0)
    } else {
      setIdx(i => i + 1)
    }
  }

  if (all.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <BookOpen
          className="size-10 mx-auto mb-4 text-[var(--text-muted)] stroke-[1.5]"
          aria-hidden
        />
        <h1 className="text-[22px] font-semibold text-[var(--text-primary)] mb-2">
          Repaso espaciado
        </h1>
        <p className="text-[14px] text-[var(--text-secondary)]">
          Todavía no hay preguntas producidas en ningún módulo, así que no hay
          nada que repasar.
        </p>
      </div>
    )
  }

  // No quedan cards due: pantalla de "estás al día".
  if (dueCount === 0) {
    const next = all[0]
    const days = next ? Math.max(1, Math.round((next.state.dueAt - Date.now()) / (24 * 3600 * 1000))) : 1
    return (
      <div className="max-w-3xl mx-auto">
        <PageHeader
          eyebrow="Repaso espaciado"
          title="Estás al día"
          description="No tienes flashcards pendientes ahora mismo. Vuelve más tarde."
        />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatBox label="Cards en el deck" value={all.length} />
          <StatBox
            label="Próxima revisión"
            value={next ? humanizeInterval(days) : '—'}
          />
          <StatBox
            label="Revisadas"
            value={all.filter(e => e.state.lastReviewedAt !== null).length}
          />
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm('Esto reinicia el progreso de SRS para todas las flashcards. ¿Continuar?')) {
                reset()
              }
            }}
            iconLeft={<Trash2 className="size-3.5 stroke-[1.75]" aria-hidden />}
          >
            Reiniciar progreso SRS
          </Button>
          <Link to={href()} className="text-[13.5px] text-[var(--text-active)] hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  if (!currentEntry) return null
  const module = findModule(currentEntry.moduleId)
  const remaining = sessionIds.length - idx

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        eyebrow="Repaso espaciado"
        title="Sesión de flashcards"
        description={`${remaining} ${remaining === 1 ? 'tarjeta' : 'tarjetas'} pendiente${remaining === 1 ? '' : 's'} en esta sesión.`}
      />

      {/* Contexto: de qué módulo viene la card */}
      {module && (
        <div className="mt-4 mb-6 text-[12.5px] text-[var(--text-muted)] flex items-center gap-2">
          <Sparkles className="size-[13px] text-[var(--color-pv-purple-500)]" aria-hidden />
          <span>
            Módulo {String(module.id).padStart(2, '0')} ·{' '}
            <Link to={href(`modulo/${module.id}/teoria`)} className="text-[var(--text-active)] hover:underline">
              {module.titulo}
            </Link>
          </span>
        </div>
      )}

      <Fade fadeKey={currentEntry.question.id}>
        <Flashcard question={currentEntry.question} flipped={flipped} />
      </Fade>

      <div className="mt-6 flex flex-col items-stretch gap-3">
        {!flipped ? (
          <Button
            variant="primary"
            size="lg"
            onClick={() => setFlipped(true)}
            iconLeft={<ArrowRight className="size-[16px] stroke-[2]" aria-hidden />}
          >
            Mostrar respuesta
          </Button>
        ) : (
          <ReviewButtons onReview={onReview} />
        )}
        <div className="text-[11.5px] text-[var(--text-muted)] text-center">
          Las flashcards se programan automáticamente con SM-2: cuanto más fácil te resulte una pregunta, más espaciado el próximo repaso.
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3">
      <div className="text-[10.5px] uppercase tracking-[0.08em] text-[var(--text-muted)] font-semibold">
        {label}
      </div>
      <div className="text-[20px] font-semibold tabular-nums text-[var(--text-primary)] mt-1">
        {value}
      </div>
    </div>
  )
}

function ReviewButtons({ onReview }: { onReview: (q: SrsQuality) => void }) {
  // Mapeo simple a 4 botones:
  //   Again = 1 (fail), Hard = 3, Good = 4, Easy = 5.
  const buttons: Array<{
    label: string
    quality: SrsQuality
    desc: string
    color: string
  }> = [
    {
      label: 'Otra vez',
      quality: 1,
      desc: 'No lo recordaba',
      color:
        'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-950/50 border-red-300/50',
    },
    {
      label: 'Difícil',
      quality: 3,
      desc: 'Me costó',
      color:
        'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-950/50 border-amber-300/50',
    },
    {
      label: 'Bien',
      quality: 4,
      desc: 'Recordaba',
      color:
        'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-950/50 border-emerald-300/50',
    },
    {
      label: 'Fácil',
      quality: 5,
      desc: 'Recordaba sin esfuerzo',
      color:
        'bg-emerald-200 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-300 dark:hover:bg-emerald-900/60 border-emerald-400/50',
    },
  ]
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {buttons.map(b => (
        <button
          key={b.quality}
          type="button"
          onClick={() => onReview(b.quality)}
          className={[
            'flex flex-col items-center justify-center py-3 px-2 rounded-lg border transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pv-purple-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]',
            b.color,
          ].join(' ')}
        >
          <span className="text-[14px] font-semibold">{b.label}</span>
          <span className="text-[11px] opacity-80 mt-0.5">{b.desc}</span>
        </button>
      ))}
    </div>
  )
}

// Reset icon import kept for legibility of the trash icon usage above.
// Avoid lint warning for unused.
void RotateCcw
