import { Pause, Play, SkipForward, X, Coffee, Timer as TimerIcon } from 'lucide-react'
import { useFocusMode } from '@/hooks/useFocusMode'
import { formatMmSs, formatStudyTime, WORK_SECONDS, SHORT_BREAK_SECONDS } from '@/lib/focusStore'
import { IconButton } from '@/components/Button'

/**
 * Tarjeta flotante del modo focus / Pomodoro.
 *
 * Se renderiza solo cuando el timer está activo (`phase !== 'idle'`).
 * Posición fija bottom-right del viewport, con padding seguro respecto
 * a los bordes y la safe-area iOS. No bloquea la lectura: el alumno
 * puede mover la mirada al timer sin interrumpir el scroll.
 *
 * En la fase `work` muestra el icono Timer y un acento púrpura; en
 * `shortBreak` cambia a `Coffee` con acento verde y un texto distinto
 * que aclara que es un descanso (no se acumula tiempo de estudio).
 */
export function FocusTimer() {
  const focus = useFocusMode()

  if (focus.phase === 'idle') return null

  const isWork = focus.phase === 'work'
  const total = isWork ? WORK_SECONDS : SHORT_BREAK_SECONDS
  const elapsed = total - focus.secondsRemaining
  const pct = Math.min(100, Math.max(0, (elapsed / total) * 100))

  return (
    <div
      role="status"
      aria-live="off" // ya hay un aria-label descriptivo; evitamos verbosidad
      aria-label={`Modo focus: ${isWork ? 'bloque de trabajo' : 'descanso'} a ${formatMmSs(focus.secondsRemaining)}`}
      className={[
        'fixed bottom-4 right-4 z-[55]',
        'pb-[env(safe-area-inset-bottom)]',
        'rounded-lg shadow-2xl border bg-[var(--bg-surface)]',
        isWork
          ? 'border-[var(--color-pv-purple-500)]/45'
          : 'border-emerald-500/45',
        'w-[230px] overflow-hidden',
      ].join(' ')}
    >
      {/* Barra de progreso superior */}
      <div className="h-1 bg-[var(--bg-surface-2)]">
        <div
          className={[
            'h-full transition-[width] duration-1000 ease-linear',
            'motion-reduce:transition-none',
            isWork ? 'bg-[var(--color-pv-purple-500)]' : 'bg-emerald-500',
          ].join(' ')}
          style={{ width: `${pct}%` }}
          aria-hidden
        />
      </div>

      <div className="px-3 pt-2.5 pb-2 flex items-center gap-2">
        {isWork ? (
          <TimerIcon
            className="size-[15px] text-[var(--color-pv-purple-700)] dark:text-[var(--color-pv-purple-300)] shrink-0"
            aria-hidden
          />
        ) : (
          <Coffee
            className="size-[15px] text-emerald-700 dark:text-emerald-300 shrink-0"
            aria-hidden
          />
        )}
        <span className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[var(--text-muted)]">
          {isWork ? 'Trabajo' : 'Descanso'}
        </span>
        <IconButton
          onClick={focus.stop}
          label="Cerrar el temporizador"
          size="sm"
          className="ml-auto -mr-1.5"
        >
          <X className="size-[13px]" />
        </IconButton>
      </div>

      <div className="px-3 pb-1 font-mono tabular-nums text-[28px] leading-none text-[var(--text-primary)] font-semibold">
        {formatMmSs(focus.secondsRemaining)}
      </div>

      <div className="px-3 pb-2.5 flex items-center gap-1.5">
        {focus.running ? (
          <button
            type="button"
            onClick={focus.pause}
            className="inline-flex items-center gap-1 h-7 px-2 rounded text-[11.5px] font-medium bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pv-purple-500)] transition-colors"
          >
            <Pause className="size-[12px]" aria-hidden />
            Pausar
          </button>
        ) : (
          <button
            type="button"
            onClick={focus.resume}
            className="inline-flex items-center gap-1 h-7 px-2 rounded text-[11.5px] font-medium bg-[var(--color-pv-purple-600)] text-white hover:bg-[var(--color-pv-purple-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pv-purple-500)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--bg-canvas)] transition-colors"
          >
            <Play className="size-[12px]" aria-hidden />
            Reanudar
          </button>
        )}
        <button
          type="button"
          onClick={focus.skipPhase}
          className="inline-flex items-center gap-1 h-7 px-2 rounded text-[11.5px] font-medium text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pv-purple-500)] transition-colors"
          title={isWork ? 'Saltar a descanso (cuenta el pomodoro)' : 'Terminar el descanso'}
        >
          <SkipForward className="size-[12px]" aria-hidden />
          Saltar
        </button>
      </div>

      {/* Contador del día */}
      {focus.pomodorosToday > 0 && (
        <div className="px-3 py-2 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-2)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
          <span>
            <span className="font-semibold text-[var(--text-primary)] tabular-nums">
              {focus.pomodorosToday}
            </span>
            {' '}pomodoro{focus.pomodorosToday === 1 ? '' : 's'} hoy
          </span>
          <span className="tabular-nums">{formatStudyTime(focus.totalSeconds)}</span>
        </div>
      )}
    </div>
  )
}
