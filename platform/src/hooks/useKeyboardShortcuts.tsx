import { useEffect, useRef, type ReactNode } from 'react'

export interface Shortcut {
  /** Tecla a escuchar: 'j', 'k', '?', 'Enter', etc. */
  key: string
  /** Requiere Cmd/Ctrl. */
  meta?: boolean
  /** Requiere Shift. */
  shift?: boolean
  /** Texto descriptivo para el modal de ayuda. */
  description: string
  /** Grupo lógico al que pertenece (Navegación, Examen, Ayuda…). */
  group: string
  /** Callback. */
  handler: () => void
  /** Si true, el atajo se ejecuta también dentro de inputs/textareas. */
  enableInInputs?: boolean
}

/**
 * Hook para registrar atajos de teclado globales. Escucha en
 * `document` con captura único, normaliza la combinación y ejecuta
 * el handler que corresponda.
 *
 * Convención: las teclas sueltas son lowercase (`'j'`, `'k'`, `'?'`).
 * Los modificadores se piden por flags (`meta`, `shift`). Por defecto
 * los atajos se ignoran si el foco está en un input, textarea o
 * contenteditable, para no romper la escritura del usuario.
 *
 * El hook acepta un array de shortcuts. Si un handler cambia entre
 * renders (closure sobre estado), pasar `deps` para que el effect se
 * vuelva a registrar. En caso de que los shortcuts vivan en el árbol
 * de componentes con estado complejo, conviene memoizar la lista.
 */
export function useKeyboardShortcuts(shortcuts: Shortcut[], deps: unknown[] = []) {
  // Guardamos la lista en un ref para que el listener pueda leer la
  // versión actual sin tener que registrarse cada vez que cambia.
  const shortcutsRef = useRef(shortcuts)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    shortcutsRef.current = shortcuts
  }, [shortcuts, ...deps])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // ¿Foco en input/textarea/contenteditable? Saltar salvo opt-in.
      const target = e.target as HTMLElement | null
      const isInputContext =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT' ||
        target?.isContentEditable

      for (const s of shortcutsRef.current) {
        if (isInputContext && !s.enableInInputs) continue
        const keyMatches = e.key === s.key || e.key.toLowerCase() === s.key.toLowerCase()
        const metaOk = s.meta ? e.metaKey || e.ctrlKey : !(e.metaKey || e.ctrlKey)
        const shiftOk = s.shift ? e.shiftKey : !e.shiftKey
        if (keyMatches && metaOk && shiftOk) {
          e.preventDefault()
          s.handler()
          return
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])
}

/* ----------------------------- UI: tecla ----------------------------- */

/**
 * Visualización compacta de una combinación de teclas.
 * Renderiza chips con la tecla en mono, separados por `+`.
 */
export function KeyChip({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[1.75rem] h-6 px-1.5 rounded border border-[var(--border-strong)] bg-[var(--bg-surface-2)] font-mono text-[11px] font-semibold text-[var(--text-primary)] tabular-nums">
      {children}
    </kbd>
  )
}

/** Combinación de teclas. Pasa segments con la combinación. */
export function KeyCombo({ keys }: { keys: string[] }) {
  return (
    <span className="inline-flex items-center gap-1">
      {keys.map((k, i) => (
        <span key={i} className="inline-flex items-center gap-1">
          <KeyChip>{k}</KeyChip>
          {i < keys.length - 1 && <span className="text-[var(--text-muted)] text-[11px]">+</span>}
        </span>
      ))}
    </span>
  )
}

/** Construye el array de keys a mostrar para un Shortcut. */
export function shortcutKeys(s: Shortcut): string[] {
  const out: string[] = []
  if (s.meta) out.push(navigator.userAgent.includes('Mac') ? '⌘' : 'Ctrl')
  if (s.shift) out.push('⇧')
  out.push(s.key === ' ' ? 'Space' : s.key.toUpperCase())
  return out
}
