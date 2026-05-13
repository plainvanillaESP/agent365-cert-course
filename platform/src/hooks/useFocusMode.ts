import { useSyncExternalStore } from 'react'
import {
  getFocusSnapshot,
  subscribeFocus,
  startWork,
  pause,
  resume,
  stop,
  skipPhase,
  type FocusState,
} from '@/lib/focusStore'

/**
 * Suscribe a los cambios del store global del Pomodoro y expone las
 * acciones. Como el store es singleton, todos los consumidores ven el
 * mismo estado sin context plumbing.
 */
export function useFocusMode(): FocusState & {
  startWork: () => void
  pause: () => void
  resume: () => void
  stop: () => void
  skipPhase: () => void
} {
  const state = useSyncExternalStore(subscribeFocus, getFocusSnapshot, getFocusSnapshot)
  return {
    ...state,
    startWork,
    pause,
    resume,
    stop,
    skipPhase,
  }
}
