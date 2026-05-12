import { useCallback, useEffect, useState } from 'react'
import {
  type Highlight,
  type HighlightColor,
  loadHighlights,
  saveHighlights,
} from '@/lib/highlights'

/**
 * Estado React de los highlights del alumno para un módulo + sección
 * concretos. Maneja persistencia (vía `lib/highlights.ts`) y emite un
 * `CustomEvent('pv-learn:highlights-changed')` cuando cambia, para que
 * componentes ajenos que muestren contadores se sincronicen.
 */
export function useHighlights(moduleId: number, section: string): {
  highlights: Highlight[]
  add: (h: Highlight) => void
  remove: (id: string) => void
  clear: () => void
  updateColor: (id: string, color: HighlightColor) => void
} {
  const [highlights, setHighlights] = useState<Highlight[]>(() =>
    loadHighlights(moduleId, section),
  )

  // Recarga al cambiar módulo o sección.
  useEffect(() => {
    setHighlights(loadHighlights(moduleId, section))
  }, [moduleId, section])

  const persist = useCallback(
    (next: Highlight[]) => {
      saveHighlights(moduleId, section, next)
      setHighlights(next)
      window.dispatchEvent(new CustomEvent('pv-learn:highlights-changed'))
    },
    [moduleId, section],
  )

  const add = useCallback(
    (h: Highlight) => {
      persist([...loadHighlights(moduleId, section), h])
    },
    [moduleId, section, persist],
  )

  const remove = useCallback(
    (id: string) => {
      persist(loadHighlights(moduleId, section).filter(h => h.id !== id))
    },
    [moduleId, section, persist],
  )

  const clear = useCallback(() => {
    persist([])
  }, [persist])

  const updateColor = useCallback(
    (id: string, color: HighlightColor) => {
      persist(
        loadHighlights(moduleId, section).map(h =>
          h.id === id ? { ...h, color } : h,
        ),
      )
    },
    [moduleId, section, persist],
  )

  return { highlights, add, remove, clear, updateColor }
}
