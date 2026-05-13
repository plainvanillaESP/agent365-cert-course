import { Play, Clock, ListChecks, Award, ShieldAlert, History, Trash2 } from 'lucide-react'
import { Button } from '@/components/Button'
import { PageHeader } from '@/components/PageHeader'
import {
  EXAM_COOLDOWN_DAYS,
  EXAM_DURATION_MIN,
  EXAM_NUM_QUESTIONS,
  EXAM_PASS_PCT,
  EXAM_MAX_ATTEMPTS,
  getExamBankSize,
} from '@/lib/exam'
import { COURSE_EXAM_TITLE, COURSE_EXAM_INTRO, CONTENT_MODULES, EXAM_MODULE, COURSE_CERT_TITLE } from '@/lib/course'
import type { ExamAttempt } from '@/hooks/useExamState'

interface ExamPreStartProps {
  attemptsRemaining: number
  cooldownUntil: number | null
  history: ExamAttempt[]
  onStart: () => void
  onClearHistory: () => void
}

export function ExamPreStart({
  attemptsRemaining,
  cooldownUntil,
  history,
  onStart,
  onClearHistory,
}: ExamPreStartProps) {
  const bankReady = getExamBankSize() >= EXAM_NUM_QUESTIONS
  const cooldownActive = cooldownUntil !== null && cooldownUntil > Date.now()
  const canStart = bankReady && attemptsRemaining > 0 && !cooldownActive
  const lastPassed = history.length > 0 && history[history.length - 1].scoring.passed

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <PageHeader
        eyebrow={`Módulo ${EXAM_MODULE.id}, Examen final`}
        title={COURSE_EXAM_TITLE}
        description={`${COURSE_EXAM_INTRO} Pon a prueba lo aprendido en los ${CONTENT_MODULES.length} módulos del curso. Aprobar este examen te acredita como ${COURSE_CERT_TITLE} por Plain Vanilla.`}
      />

      {/* Reglas */}
      <section className="grid sm:grid-cols-2 gap-3">
        <RuleCard
          icon={<ListChecks className="size-[18px] stroke-[1.75]" aria-hidden />}
          title="60 preguntas"
          body="Selección aleatoria del banco oficial. Cubre las 5 áreas del temario en sus pesos canónicos."
        />
        <RuleCard
          icon={<Clock className="size-[18px] stroke-[1.75]" aria-hidden />}
          title={`${EXAM_DURATION_MIN} minutos`}
          body="Cronómetro visible en pantalla. Cuando llega a 00:00 el examen se entrega automáticamente."
        />
        <RuleCard
          icon={<Award className="size-[18px] stroke-[1.75]" aria-hidden />}
          title={`Aprobado al ${EXAM_PASS_PCT} %`}
          body={`Necesitas ${Math.ceil((EXAM_PASS_PCT / 100) * EXAM_NUM_QUESTIONS)} aciertos de ${EXAM_NUM_QUESTIONS}. Si apruebas se emite el certificado descargable.`}
        />
        <RuleCard
          icon={<ShieldAlert className="size-[18px] stroke-[1.75]" aria-hidden />}
          title={`${EXAM_MAX_ATTEMPTS} intentos`}
          body={`Si agotas los ${EXAM_MAX_ATTEMPTS} intentos sin aprobar, el examen se desbloquea de nuevo tras ${EXAM_COOLDOWN_DAYS} días.`}
        />
      </section>

      {/* Aviso de banco no listo (no debería pasar en producción) */}
      {!bankReady && (
        <section className="rounded-md border border-amber-500/60 bg-amber-500/10 px-4 py-3 text-[13.5px] text-amber-800 dark:text-amber-200">
          El banco oficial está incompleto: hay {getExamBankSize()} preguntas y el examen requiere {EXAM_NUM_QUESTIONS}. Hasta que el banco se complete no se puede iniciar el examen.
        </section>
      )}

      {/* Estado del alumno */}
      {lastPassed ? (
        <section className="rounded-md border border-emerald-500/60 bg-emerald-500/10 px-4 py-3 text-[13.5px] text-emerald-800 dark:text-emerald-200">
          Ya has aprobado el examen. Puedes consultar tu certificado en el historial de intentos. Si quieres re-intentar para mejorar tu marca, borra el historial primero.
        </section>
      ) : cooldownActive ? (
        <section className="rounded-md border border-amber-500/60 bg-amber-500/10 px-4 py-3 text-[13.5px] text-amber-800 dark:text-amber-200">
          Has agotado los {EXAM_MAX_ATTEMPTS} intentos disponibles sin aprobar. El examen se desbloqueará el{' '}
          <strong className="font-semibold">
            {new Date(cooldownUntil!).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}
          </strong>
          . Aprovecha el tiempo para repasar los módulos donde más fallaste.
        </section>
      ) : (
        <section className="rounded-md border border-[var(--border-default)] bg-[var(--bg-surface-2)] px-4 py-3 text-[13.5px] text-[var(--text-secondary)]">
          Intentos restantes en este ciclo:{' '}
          <strong className="font-semibold text-[var(--text-primary)] tabular-nums">{attemptsRemaining}</strong>{' '}
          de {EXAM_MAX_ATTEMPTS}.
        </section>
      )}

      {/* CTA */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button
          variant="primary"
          size="lg"
          onClick={onStart}
          disabled={!canStart}
          iconLeft={<Play className="size-[16px] stroke-[2]" aria-hidden />}
        >
          {history.length === 0 ? 'Iniciar examen' : 'Iniciar nuevo intento'}
        </Button>
        {!canStart && bankReady && (
          <span className="text-[12.5px] text-[var(--text-muted)]">
            {lastPassed
              ? 'Ya tienes un intento aprobado. Borra el historial si quieres repetirlo.'
              : 'No hay intentos disponibles en este momento.'}
          </span>
        )}
      </div>

      {/* Historial de intentos */}
      {history.length > 0 && (
        <AttemptHistory history={history} onClear={onClearHistory} />
      )}
    </div>
  )
}

function RuleCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] p-4 flex gap-3">
      <div className="text-[var(--text-secondary)] mt-0.5 shrink-0">{icon}</div>
      <div className="space-y-1">
        <div className="text-[13.5px] font-semibold text-[var(--text-primary)]">{title}</div>
        <div className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{body}</div>
      </div>
    </div>
  )
}

function AttemptHistory({ history, onClear }: { history: ExamAttempt[]; onClear: () => void }) {
  return (
    <details className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)]">
      <summary className="cursor-pointer flex items-center gap-2 px-4 py-3 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] transition-colors list-none [&::-webkit-details-marker]:hidden">
        <History className="size-[14px] stroke-[1.75] text-[var(--text-muted)]" aria-hidden />
        <span>Tus intentos previos ({history.length})</span>
      </summary>
      <div className="border-t border-[var(--border-subtle)] divide-y divide-[var(--border-subtle)]">
        {history
          .slice()
          .reverse()
          .map((a, i) => (
            <div key={a.id} className="flex items-center gap-4 px-4 py-2.5 text-[12.5px]">
              <span className="font-mono text-[var(--text-muted)] tabular-nums w-8 shrink-0">
                #{history.length - i}
              </span>
              <span className="text-[var(--text-secondary)] flex-1 min-w-0">
                {new Date(a.submittedAt).toLocaleString('es-ES', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
                {a.reason === 'timeout' && (
                  <span className="ml-2 text-[var(--text-muted)]">(tiempo agotado)</span>
                )}
              </span>
              <span
                className={[
                  'font-mono font-semibold tabular-nums shrink-0 whitespace-nowrap',
                  a.scoring.passed
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-amber-700 dark:text-amber-300',
                ].join(' ')}
              >
                {a.scoring.score}/{a.scoring.total} ({a.scoring.pct} %)
              </span>
            </div>
          ))}
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
