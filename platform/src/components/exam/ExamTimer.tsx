import { useEffect, useRef, useState } from 'react'
import { Clock, AlertCircle } from 'lucide-react'

interface ExamTimerProps {
  remainingSec: number
  totalSec: number
}

/**
 * Pastilla del cronómetro. El color cambia conforme se acerca el final:
 *   - > 10 min:  neutro
 *   - 2-10 min:  ámbar
 *   - < 2 min:   rojo + parpadeo discreto
 *
 * El componente NO controla la cuenta atrás: solo presenta el valor.
 * La cuenta vive en `useExamState` y se pasa por prop para que el reloj
 * sea consistente con la persistencia del intento.
 *
 * Accesibilidad: `role="timer"` lo identifica semánticamente. No usamos
 * `aria-live` activo sobre cada segundo para no saturar al lector de
 * pantalla; en su lugar, anunciamos solo en cruces de umbral (10 min,
 * 5 min, 2 min, 1 min, expirado) vía un canal `aria-live="polite"`
 * separado. El `Math.floor(remainingSec / 60)` evita ráfagas dentro del
 * mismo minuto.
 */
export function ExamTimer({ remainingSec, totalSec }: ExamTimerProps) {
  // Pequeño parpadeo en los últimos 2 minutos.
  const [blink, setBlink] = useState(false)
  useEffect(() => {
    if (remainingSec >= 120) {
      setBlink(false)
      return
    }
    const id = window.setInterval(() => setBlink(b => !b), 600)
    return () => window.clearInterval(id)
  }, [remainingSec])

  // Anuncio en cruces de umbral solamente.
  const [announcement, setAnnouncement] = useState('')
  const lastAnnouncedRef = useRef<number | null>(null)
  useEffect(() => {
    const minutesLeft = Math.floor(remainingSec / 60)
    const thresholds = [10, 5, 2, 1, 0]
    for (const t of thresholds) {
      if (minutesLeft === t && lastAnnouncedRef.current !== t) {
        lastAnnouncedRef.current = t
        if (t === 0) setAnnouncement('Tiempo agotado. El examen se está cerrando.')
        else if (t === 1) setAnnouncement('Queda 1 minuto.')
        else setAnnouncement(`Quedan ${t} minutos.`)
        break
      }
    }
  }, [remainingSec])

  const danger = remainingSec < 120
  const warn = !danger && remainingSec < 600
  const pct = totalSec > 0 ? Math.max(0, Math.min(100, (remainingSec / totalSec) * 100)) : 0

  const text = formatTime(remainingSec)

  const Icon = danger ? AlertCircle : Clock

  const colorClasses = danger
    ? 'border-red-500/60 bg-red-500/10 text-red-700 dark:text-red-300'
    : warn
      ? 'border-amber-500/60 bg-amber-500/10 text-amber-800 dark:text-amber-200'
      : 'border-[var(--border-default)] bg-[var(--bg-surface-2)] text-[var(--text-secondary)]'

  return (
    <>
      <div
        className={['flex items-center gap-2.5 rounded-md border px-3 py-1.5', colorClasses].join(' ')}
        role="timer"
        aria-label={`Tiempo restante del examen: ${text}`}
      >
        <Icon
          className={['size-[15px] stroke-[1.75] shrink-0', danger && blink ? 'opacity-50' : 'opacity-100'].join(' ')}
          aria-hidden
        />
        <div className="flex flex-col leading-tight">
          <span className="text-[10.5px] uppercase tracking-[0.06em] opacity-80">Tiempo restante</span>
          <span className="text-[15px] font-mono tabular-nums font-semibold">{text}</span>
        </div>
        <div className="hidden sm:block w-20 h-1.5 rounded-full bg-[var(--bg-surface-3,rgba(0,0,0,0.06))] overflow-hidden ml-1">
          <div
            className={[
              'h-full rounded-full transition-[width] duration-1000 ease-linear',
              danger ? 'bg-red-500' : warn ? 'bg-amber-500' : 'bg-[var(--text-secondary)]',
            ].join(' ')}
            style={{ width: `${pct}%` }}
            aria-hidden
          />
        </div>
      </div>
      {/* Canal de anuncios accesibles. Vacío hasta que se cruza un umbral. */}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </>
  )
}

function formatTime(sec: number): string {
  const s = Math.max(0, Math.floor(sec))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const ss = s % 60
  const mm = String(m).padStart(2, '0')
  const sss = String(ss).padStart(2, '0')
  if (h > 0) return `${h}:${mm}:${sss}`
  return `${mm}:${sss}`
}
