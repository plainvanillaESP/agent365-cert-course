import { useEffect, useState, useRef } from 'react'

interface ScrollProgressProps {
  /** Identificador único de la lectura (módulo+sección) para persistencia. */
  storageKey: string
  /**
   * Selector del contenedor cuyo scroll se mide. Si no se pasa, se usa
   * el documento entero (window.scrollY).
   */
  rootSelector?: string
}

interface PersistedReading {
  /** Porcentaje máximo alcanzado en lecturas previas (0-100). */
  maxPct: number
  /** Última posición de scroll absoluta en píxeles, para restaurar. */
  lastScrollY: number
  updatedAt: number
}

/**
 * Barra fina fija en el top de la columna central que muestra cuánto
 * lleva leído el alumno del módulo actual. Persiste el % máximo en
 * localStorage para que en visitas siguientes vea su progreso anterior
 * (subrayado en gris bajo la barra activa) y para que la home pueda
 * mostrar progreso por módulo en el futuro.
 *
 * No fuerza al alumno a desplazarse a la posición previa — eso resulta
 * desorientador. Simplemente le indica visualmente dónde llegó.
 */
export function ScrollProgress({ storageKey, rootSelector }: ScrollProgressProps) {
  const [pct, setPct] = useState(0)
  const [maxPct, setMaxPct] = useState(0)
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Carga inicial de progreso previo
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedReading
        if (typeof parsed?.maxPct === 'number') {
          setMaxPct(parsed.maxPct)
        }
      }
    } catch {
      /* ignorar JSON corrupto */
    }
  }, [storageKey])

  // Reset cuando cambia la lectura
  useEffect(() => {
    setPct(0)
    setMaxPct(prev => prev) // se carga arriba, esto solo limpia pct actual
    window.scrollTo({ top: 0 })
  }, [storageKey])

  // Listener de scroll
  useEffect(() => {
    function compute(): number {
      const root = rootSelector ? document.querySelector(rootSelector) : null
      if (root instanceof HTMLElement) {
        const rect = root.getBoundingClientRect()
        const totalScrollable = root.offsetHeight + rect.top - window.innerHeight
        const scrolled = -rect.top
        if (totalScrollable <= 0) return 100
        return Math.max(0, Math.min(100, (scrolled / totalScrollable) * 100))
      }
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight
      if (docHeight <= 0) return 100
      return Math.max(0, Math.min(100, (window.scrollY / docHeight) * 100))
    }

    function onScroll() {
      const next = compute()
      setPct(next)
      setMaxPct(prev => (next > prev ? next : prev))
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [rootSelector])

  // Persistir maxPct con debounce
  useEffect(() => {
    if (persistTimer.current) clearTimeout(persistTimer.current)
    persistTimer.current = setTimeout(() => {
      try {
        const data: PersistedReading = {
          maxPct,
          lastScrollY: window.scrollY,
          updatedAt: Date.now(),
        }
        localStorage.setItem(storageKey, JSON.stringify(data))
      } catch {
        /* localStorage bloqueado, ignore */
      }
    }, 600)
    return () => {
      if (persistTimer.current) clearTimeout(persistTimer.current)
    }
  }, [maxPct, storageKey])

  return (
    <div
      className="sticky top-0 z-10 -mx-5 sm:-mx-8 lg:-mx-12 -mt-8 lg:-mt-10 mb-6 px-5 sm:px-8 lg:px-12 pt-2 pb-1 bg-[var(--bg-canvas)]"
      role="progressbar"
      aria-label="Progreso de lectura del módulo"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
    >
      <div className="relative h-[3px] bg-[var(--border-subtle)] rounded-full overflow-hidden">
        {/* Línea sutil del máximo previo, si es mayor que el actual */}
        {maxPct > pct && (
          <div
            className="absolute inset-y-0 left-0 bg-[var(--text-faint)] opacity-30"
            style={{ width: `${maxPct}%` }}
          />
        )}
        {/* Barra activa */}
        <div
          className="absolute inset-y-0 left-0 bg-[var(--color-pv-purple-500)] transition-[width] duration-100"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
