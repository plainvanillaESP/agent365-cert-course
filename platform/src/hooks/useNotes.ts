import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Notas del alumno por módulo.
 *
 * Persistencia en `localStorage` bajo la clave `agent365-notes-m{N}`.
 * Mantenemos el prefijo legacy para no romper progreso existente; cuando
 * llegue la fase 8 (multi-curso) se migrará al prefijo `pv-learn-{slug}-…`.
 *
 * El guardado se debounce 300 ms tras la última pulsación para evitar
 * machacar `localStorage` con cada tecla. `savedAt` registra el instante
 * del último flush; los consumidores pueden mostrarlo como confirmación
 * («Guardado hace 2 s»).
 *
 * Si `localStorage` no está disponible (modo privado en algunos
 * navegadores, quota llena), el hook degrada en silencio: el texto vive
 * en memoria hasta recargar.
 */

interface UseNotesResult {
  notes: string
  setNotes: (next: string) => void
  /** ms timestamp del último guardado en `localStorage`; null si nunca. */
  savedAt: number | null
  status: 'idle' | 'pending' | 'saved'
  /** Borra las notas (tras confirmación del consumidor). */
  clear: () => void
  /** Construye y descarga un .md con las notas. */
  exportToMd: (moduleTitle: string) => void
  /** Métricas útiles para mostrar en la UI. */
  characterCount: number
  wordCount: number
}

const KEY_PREFIX = 'agent365-notes-m'
const SAVE_DEBOUNCE_MS = 300

export function useNotes(moduleId: number): UseNotesResult {
  const storageKey = `${KEY_PREFIX}${moduleId}`

  const [notes, setNotesState] = useState<string>('')
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [status, setStatus] = useState<'idle' | 'pending' | 'saved'>('idle')

  // Carga inicial al cambiar de módulo.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw !== null) {
        setNotesState(raw)
        setSavedAt(Date.now())
        setStatus('saved')
      } else {
        setNotesState('')
        setSavedAt(null)
        setStatus('idle')
      }
    } catch {
      setNotesState('')
      setSavedAt(null)
      setStatus('idle')
    }
  }, [storageKey])

  // Debounce de escritura a localStorage.
  const flushTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    return () => {
      if (flushTimer.current) clearTimeout(flushTimer.current)
    }
  }, [])

  const setNotes = useCallback(
    (next: string) => {
      setNotesState(next)
      setStatus('pending')
      if (flushTimer.current) clearTimeout(flushTimer.current)
      flushTimer.current = setTimeout(() => {
        try {
          if (next.length === 0) {
            localStorage.removeItem(storageKey)
          } else {
            localStorage.setItem(storageKey, next)
          }
          setSavedAt(Date.now())
          setStatus('saved')
        } catch {
          // Disco lleno o modo privado: dejar status pending para que el
          // usuario sepa que no se ha guardado. No alertamos: el ruido no
          // ayuda y el usuario puede exportar manualmente.
        }
      }, SAVE_DEBOUNCE_MS)
    },
    [storageKey],
  )

  const clear = useCallback(() => {
    setNotesState('')
    try {
      localStorage.removeItem(storageKey)
    } catch {
      /* ignore */
    }
    setSavedAt(null)
    setStatus('idle')
  }, [storageKey])

  const exportToMd = useCallback(
    (moduleTitle: string) => {
      const today = new Date().toISOString().slice(0, 10)
      const body = notes.trim().length > 0 ? notes : '_(sin notas)_'
      const md = `---
modulo: ${moduleId}
titulo: ${JSON.stringify(moduleTitle)}
fecha_exportacion: ${today}
---

# Notas — Módulo ${String(moduleId).padStart(2, '0')}: ${moduleTitle}

${body}
`
      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `notas-modulo-${String(moduleId).padStart(2, '0')}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      // Liberar el blob tras un tick para que Safari no aborte la descarga.
      setTimeout(() => URL.revokeObjectURL(url), 100)
    },
    [moduleId, notes],
  )

  const characterCount = notes.length
  const wordCount = notes.trim().length === 0 ? 0 : notes.trim().split(/\s+/).length

  return {
    notes,
    setNotes,
    savedAt,
    status,
    clear,
    exportToMd,
    characterCount,
    wordCount,
  }
}
