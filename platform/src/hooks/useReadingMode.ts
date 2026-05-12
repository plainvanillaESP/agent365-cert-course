import { useCallback, useEffect, useState } from 'react'

/**
 * Modo lectura inmersivo.
 *
 * Cuando está activo, el shell pinta `data-reading-mode="on"` sobre el
 * `<html>` y los selectores CSS de `index.css` se ocupan de:
 *
 *   - Ocultar la sidebar de navegación de módulos.
 *   - Ocultar la tabla de contenidos lateral.
 *   - Ensanchar el área de texto y centrar el contenido.
 *   - Aumentar `line-height` y `letter-spacing` ligeramente.
 *
 * Persistencia en `localStorage` bajo `agent365-reading-mode`. La
 * preferencia es del alumno, no del módulo, así que se mantiene al
 * navegar entre módulos. Se ignora silenciosamente si `localStorage`
 * no está disponible.
 */
const STORAGE_KEY = 'pv-learn-reading-mode'
const ATTR = 'data-reading-mode'

function readInitial(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function applyToDom(enabled: boolean) {
  const root = document.documentElement
  if (enabled) root.setAttribute(ATTR, 'on')
  else root.removeAttribute(ATTR)
}

export function useReadingMode(): {
  enabled: boolean
  toggle: () => void
  set: (next: boolean) => void
} {
  const [enabled, setEnabled] = useState<boolean>(readInitial)

  // Aplica el atributo al montar y cuando cambia el estado.
  useEffect(() => {
    applyToDom(enabled)
    try {
      if (enabled) localStorage.setItem(STORAGE_KEY, '1')
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [enabled])

  // Sincroniza entre pestañas/ventanas (storage event) y con el atajo
  // global `i` registrado en `App.tsx`, que dispara un custom event.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setEnabled(e.newValue === '1')
    }
    const onToggleEvent = () => setEnabled(v => !v)
    window.addEventListener('storage', onStorage)
    window.addEventListener('pv-learn:toggle-reading-mode', onToggleEvent)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('pv-learn:toggle-reading-mode', onToggleEvent)
    }
  }, [])

  const toggle = useCallback(() => setEnabled(v => !v), [])
  const set = useCallback((next: boolean) => setEnabled(next), [])

  return { enabled, toggle, set }
}
