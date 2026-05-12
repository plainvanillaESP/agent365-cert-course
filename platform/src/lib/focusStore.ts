/**
 * Store del modo focus (Pomodoro).
 *
 * Singleton a nivel de módulo, con suscriptores. Se consume desde React
 * con `useSyncExternalStore` (ver `hooks/useFocusMode.ts`) para que
 * todos los componentes reaccionen al mismo estado sin plumbing de
 * context.
 *
 * Fases:
 *
 *   - `idle`       — el temporizador no está corriendo.
 *   - `work`       — bloque de trabajo de 25 minutos.
 *   - `shortBreak` — descanso de 5 minutos tras un work.
 *
 * Persistencia ligera en `localStorage`:
 *
 *   - `agent365-focus-pomodoros-total`         — count global.
 *   - `agent365-focus-total-seconds`           — segundos acumulados de "work".
 *   - `agent365-focus-pomodoros-today`         — count del día actual (ISO date como key).
 *   - `agent365-focus-pomodoros-today-date`    — fecha del contador anterior.
 *
 * El temporizador en sí (cuántos segundos quedan ahora) NO persiste: si
 * el alumno recarga, el timer se descarta. Pomodoros completados sí.
 * Esto evita la complejidad de calcular `startedAt + duracion - now` con
 * pausas, system clock drift, etc.
 */

export const WORK_SECONDS = 25 * 60
export const SHORT_BREAK_SECONDS = 5 * 60

export type FocusPhase = 'idle' | 'work' | 'shortBreak'

export interface FocusState {
  phase: FocusPhase
  /** Segundos restantes de la fase actual; 0 si idle. */
  secondsRemaining: number
  /** True si el timer corre (tick activo). False si está pausado o idle. */
  running: boolean
  /** Pomodoros (de trabajo) completados HOY. */
  pomodorosToday: number
  /** Pomodoros completados en total (vida del navegador). */
  pomodorosTotal: number
  /** Segundos de "work" acumulados, vida del navegador. */
  totalSeconds: number
}

const KEY_POMODOROS_TOTAL = 'agent365-focus-pomodoros-total'
const KEY_TOTAL_SECONDS = 'agent365-focus-total-seconds'
const KEY_POMODOROS_TODAY = 'agent365-focus-pomodoros-today'
const KEY_POMODOROS_TODAY_DATE = 'agent365-focus-pomodoros-today-date'

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function safeRead(key: string, fallback: number): number {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    const n = parseInt(raw, 10)
    return Number.isFinite(n) ? n : fallback
  } catch {
    return fallback
  }
}

function safeWrite(key: string, value: number | string) {
  try {
    localStorage.setItem(key, typeof value === 'number' ? String(value) : value)
  } catch {
    /* ignore */
  }
}

function loadInitialCounters(): {
  pomodorosTotal: number
  totalSeconds: number
  pomodorosToday: number
} {
  if (typeof window === 'undefined') {
    return { pomodorosTotal: 0, totalSeconds: 0, pomodorosToday: 0 }
  }
  const total = safeRead(KEY_POMODOROS_TOTAL, 0)
  const seconds = safeRead(KEY_TOTAL_SECONDS, 0)
  let today = safeRead(KEY_POMODOROS_TODAY, 0)
  try {
    const savedDate = localStorage.getItem(KEY_POMODOROS_TODAY_DATE)
    if (savedDate !== todayISO()) {
      today = 0
      safeWrite(KEY_POMODOROS_TODAY, 0)
      safeWrite(KEY_POMODOROS_TODAY_DATE, todayISO())
    }
  } catch {
    /* ignore */
  }
  return { pomodorosTotal: total, totalSeconds: seconds, pomodorosToday: today }
}

const initial = loadInitialCounters()

let state: FocusState = {
  phase: 'idle',
  secondsRemaining: 0,
  running: false,
  pomodorosToday: initial.pomodorosToday,
  pomodorosTotal: initial.pomodorosTotal,
  totalSeconds: initial.totalSeconds,
}

const subscribers = new Set<() => void>()

let tickHandle: ReturnType<typeof setInterval> | null = null

function notify() {
  // Inmutabilidad: clonamos para que `useSyncExternalStore` detecte el
  // cambio referencial.
  state = { ...state }
  for (const fn of subscribers) fn()
}

function startTick() {
  if (tickHandle !== null) return
  tickHandle = setInterval(() => {
    if (!state.running) return
    if (state.secondsRemaining <= 1) {
      // Fin de fase: registrar progreso y transicionar.
      completeCurrentPhase()
    } else {
      state.secondsRemaining -= 1
      if (state.phase === 'work') {
        state.totalSeconds += 1
        // Persistir cada 30 s para no machacar localStorage en cada tick.
        if (state.totalSeconds % 30 === 0) {
          safeWrite(KEY_TOTAL_SECONDS, state.totalSeconds)
        }
      }
      notify()
    }
  }, 1000)
}

function stopTick() {
  if (tickHandle !== null) {
    clearInterval(tickHandle)
    tickHandle = null
  }
}

function completeCurrentPhase() {
  const prevPhase = state.phase
  if (prevPhase === 'work') {
    state.pomodorosToday += 1
    state.pomodorosTotal += 1
    // Persistencia atómica al cierre del bloque.
    safeWrite(KEY_TOTAL_SECONDS, state.totalSeconds)
    safeWrite(KEY_POMODOROS_TOTAL, state.pomodorosTotal)
    safeWrite(KEY_POMODOROS_TODAY, state.pomodorosToday)
    safeWrite(KEY_POMODOROS_TODAY_DATE, todayISO())
    // Tras un bloque de trabajo, pasamos a descanso corto y arrancamos.
    state.phase = 'shortBreak'
    state.secondsRemaining = SHORT_BREAK_SECONDS
    notify()
  } else if (prevPhase === 'shortBreak') {
    // Tras un descanso, paramos y dejamos que el alumno reinicie cuando
    // quiera el siguiente bloque. Más respetuoso que iniciar otro work
    // automáticamente sin consentimiento.
    state.phase = 'idle'
    state.secondsRemaining = 0
    state.running = false
    stopTick()
    notify()
  }
}

/** Lee el snapshot actual (referencia estable hasta el próximo notify). */
export function getFocusSnapshot(): FocusState {
  return state
}

/** Suscribe a cambios; devuelve función para desuscribir. */
export function subscribeFocus(fn: () => void): () => void {
  subscribers.add(fn)
  return () => subscribers.delete(fn)
}

/* ------------------------------ acciones ------------------------------ */

export function startWork() {
  state.phase = 'work'
  state.secondsRemaining = WORK_SECONDS
  state.running = true
  startTick()
  notify()
}

export function pause() {
  if (!state.running) return
  state.running = false
  safeWrite(KEY_TOTAL_SECONDS, state.totalSeconds)
  notify()
}

export function resume() {
  if (state.phase === 'idle') {
    startWork()
    return
  }
  state.running = true
  startTick()
  notify()
}

export function stop() {
  // Persistir cualquier segundo de work acumulado antes de cortar.
  if (state.phase === 'work') safeWrite(KEY_TOTAL_SECONDS, state.totalSeconds)
  state.phase = 'idle'
  state.secondsRemaining = 0
  state.running = false
  stopTick()
  notify()
}

export function skipPhase() {
  // Forzar el cierre de la fase actual. En work, contabiliza el bloque
  // aunque no haya terminado (decisión del alumno: lo dio por bueno).
  if (state.phase === 'idle') return
  completeCurrentPhase()
}

export function formatMmSs(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds))
  const mm = Math.floor(s / 60)
  const ss = s % 60
  return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
}

export function formatStudyTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds))
  if (s < 60) return `${s} s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60)
  const remM = m % 60
  return remM === 0 ? `${h} h` : `${h} h ${remM} min`
}
