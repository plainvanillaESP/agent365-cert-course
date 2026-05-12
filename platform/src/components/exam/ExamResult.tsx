import { CheckCircle2, XCircle, RotateCcw, Award, Clock } from 'lucide-react'
import { Button, ButtonLink } from '@/components/Button'
import { EXAM_PASS_PCT, type AreaBreakdown } from '@/lib/exam'
import type { ExamAttempt } from '@/hooks/useExamState'

interface ExamResultProps {
  attempt: ExamAttempt
  attemptsRemaining: number
  cooldownUntil: number | null
  onRetry: () => void
  onBackToPreStart: () => void
}

export function ExamResult({
  attempt,
  attemptsRemaining,
  cooldownUntil,
  onRetry,
  onBackToPreStart,
}: ExamResultProps) {
  const passed = attempt.scoring.passed
  const Icon = passed ? CheckCircle2 : XCircle
  const tone = passed
    ? 'text-emerald-700 dark:text-emerald-300'
    : 'text-amber-700 dark:text-amber-300'

  const cooldownActive = cooldownUntil !== null && cooldownUntil > Date.now()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero con resultado */}
      <header className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 sm:p-8 space-y-5">
        <div className="flex items-start gap-4">
          <Icon className={['size-[40px] sm:size-[48px] stroke-[1.5] shrink-0', tone].join(' ')} aria-hidden />
          <div className="space-y-1 flex-1 min-w-0">
            <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-muted)] font-semibold">
              {attempt.reason === 'timeout' ? 'Examen entregado por tiempo' : 'Examen finalizado'}
            </div>
            <h1 className={['text-[28px] sm:text-[32px] font-semibold leading-[1.1] tracking-[-0.01em]', tone].join(' ')}>
              {passed ? '¡Has aprobado!' : 'No has alcanzado el umbral'}
            </h1>
          </div>
        </div>

        {/* Score grande */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-2">
          <Metric label="Aciertos" value={`${attempt.scoring.score} / ${attempt.scoring.total}`} />
          <Metric label="Porcentaje" value={`${attempt.scoring.pct} %`} highlight={tone} />
          <Metric label={`Umbral aprobado`} value={`${EXAM_PASS_PCT} %`} />
        </div>

        <div className="text-[13px] text-[var(--text-secondary)] flex items-center gap-2 pt-2 border-t border-[var(--border-subtle)]">
          <Clock className="size-[14px] stroke-[1.75]" aria-hidden />
          <span>
            Duración real: <strong className="font-mono tabular-nums">{formatDuration(attempt.durationSec)}</strong>
            {' · '}
            Finalizado el{' '}
            {new Date(attempt.submittedAt).toLocaleString('es-ES', {
              dateStyle: 'long',
              timeStyle: 'short',
            })}
          </span>
        </div>
      </header>

      {/* CTAs principales */}
      <section className="flex flex-wrap items-center gap-3">
        {passed && (
          <ButtonLink
            to={`/certificado/${attempt.id}`}
            variant="primary"
            size="lg"
            iconLeft={<Award className="size-[16px] stroke-[2]" aria-hidden />}
          >
            Ver y descargar certificado
          </ButtonLink>
        )}
        {!passed && !cooldownActive && attemptsRemaining > 0 && (
          <Button
            variant="primary"
            size="lg"
            onClick={onRetry}
            iconLeft={<RotateCcw className="size-[16px] stroke-[2]" aria-hidden />}
          >
            Volver a intentarlo
          </Button>
        )}
        <Button variant="secondary" size="lg" onClick={onBackToPreStart}>
          Volver a la pantalla previa
        </Button>
      </section>

      {!passed && cooldownActive && (
        <section className="rounded-md border border-amber-500/60 bg-amber-500/10 px-4 py-3 text-[13.5px] text-amber-800 dark:text-amber-200">
          Has agotado los intentos disponibles. El examen se desbloqueará el{' '}
          <strong className="font-semibold">
            {new Date(cooldownUntil!).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}
          </strong>
          . Aprovecha el tiempo para repasar los módulos donde más fallaste según el detalle por área.
        </section>
      )}

      {/* Breakdown por área */}
      <section className="space-y-3">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">Detalle por área de competencia</h2>
        <div className="space-y-2">
          {attempt.scoring.byArea
            .filter((a: AreaBreakdown) => a.total > 0)
            .map((a: AreaBreakdown) => (
              <AreaRow key={a.areaId} area={a} />
            ))}
        </div>
        <p className="text-[12.5px] text-[var(--text-muted)] pt-2">
          Los pesos en porcentaje son los pesos canónicos de cada área en el examen.
          Una caída fuerte en un área concreta sugiere repasar los módulos correspondientes antes de un nuevo intento.
        </p>
      </section>
    </div>
  )
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: string }) {
  return (
    <div className="space-y-1">
      <div className="text-[10.5px] uppercase tracking-[0.06em] text-[var(--text-muted)] font-semibold">
        {label}
      </div>
      <div className={['text-[22px] sm:text-[26px] font-semibold tabular-nums', highlight ?? 'text-[var(--text-primary)]'].join(' ')}>
        {value}
      </div>
    </div>
  )
}

function AreaRow({ area }: { area: AreaBreakdown }) {
  const tone = area.pct >= 70 ? 'bg-emerald-500' : area.pct >= 50 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div className="rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3">
      <div className="flex flex-wrap items-baseline gap-2 mb-2">
        <span className="text-[10.5px] uppercase tracking-[0.06em] text-[var(--text-muted)] font-semibold tabular-nums">
          Área {area.areaId} · {area.pesoExamen} %
        </span>
        <span className="text-[14px] font-medium text-[var(--text-primary)]">{area.areaNombreEs}</span>
        <span className="ml-auto font-mono text-[13px] tabular-nums text-[var(--text-secondary)]">
          {area.correct} / {area.total} ({area.pct} %)
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-[var(--bg-surface-2)] overflow-hidden">
        <div
          className={['h-full transition-[width] duration-500 ease-out', tone].join(' ')}
          style={{ width: `${area.pct}%` }}
          aria-hidden
        />
      </div>
    </div>
  )
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m} min ${String(s).padStart(2, '0')} s`
}
