import { useEffect, useRef, useState } from 'react'
import { Download, Trash2, X, NotebookPen, Info } from 'lucide-react'
import { useNotes } from '@/hooks/useNotes'
import { Button, IconButton } from '@/components/Button'

interface NotesPanelProps {
  open: boolean
  onClose: () => void
  moduleId: number
  moduleTitle: string
}

/**
 * Panel lateral de notas del alumno por módulo. Se desliza desde la
 * derecha (con backdrop en pantallas pequeñas) y deja al alumno escribir
 * en markdown mientras lee la teoría.
 *
 * Estado y persistencia en `useNotes(moduleId)`. La UI solo expone:
 * editor, contador de palabras/chars, estado de guardado y acciones
 * (exportar a `.md`, borrar con confirmación inline).
 */
export function NotesPanel({ open, onClose, moduleId, moduleTitle }: NotesPanelProps) {
  const { notes, setNotes, status, savedAt, clear, exportToMd, characterCount, wordCount } =
    useNotes(moduleId)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [confirmClear, setConfirmClear] = useState(false)

  // Foco al abrir. Pequeño retraso para que la transición no robe el caret.
  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => textareaRef.current?.focus(), 220)
    return () => clearTimeout(t)
  }, [open])

  // Salir del modo de confirmación si el panel se cierra o cambia el módulo.
  useEffect(() => {
    if (!open) setConfirmClear(false)
  }, [open, moduleId])

  // Escape para cerrar (cuando el panel está abierto).
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Si estamos confirmando, primero cancela el confirm.
        if (confirmClear) {
          setConfirmClear(false)
          e.preventDefault()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, confirmClear])

  // Etiqueta del estado de guardado.
  const savedLabel = (() => {
    if (status === 'pending') return 'Guardando…'
    if (status === 'saved' && savedAt) return 'Guardado'
    if (notes.length === 0) return 'Sin notas'
    return ''
  })()

  return (
    <>
      {/* Backdrop semitransparente solo en pantallas < lg. En desktop
          el panel convive con la lectura sin oscurecer. */}
      <div
        aria-hidden
        onClick={onClose}
        className={[
          'fixed inset-0 z-[45] bg-black/40 backdrop-blur-[1px] transition-opacity duration-200 lg:hidden',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      />

      <aside
        role="complementary"
        aria-label="Notas del módulo"
        aria-hidden={!open}
        className={[
          'fixed top-0 right-0 z-[50] h-dvh w-full sm:max-w-[420px] bg-[var(--bg-surface)]',
          'border-l border-[var(--border-default)] shadow-2xl',
          'flex flex-col transition-transform duration-200 ease-out',
          'motion-reduce:transition-none',
          open ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {/* Cabecera */}
        <div className="flex items-start gap-3 px-4 py-3 border-b border-[var(--border-subtle)] shrink-0">
          <NotebookPen
            className="size-[18px] mt-0.5 text-[var(--color-pv-purple-600)] dark:text-[var(--color-pv-purple-300)] shrink-0"
            aria-hidden
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-[14px] font-semibold text-[var(--text-primary)] leading-tight">
              Notas del módulo
            </h2>
            <p className="text-[12px] text-[var(--text-muted)] truncate mt-0.5">
              Módulo {String(moduleId).padStart(2, '0')}, {moduleTitle}
            </p>
          </div>
          <IconButton onClick={onClose} label="Cerrar notas" size="sm">
            <X className="size-[16px]" />
          </IconButton>
        </div>

        {/* Editor */}
        <div className="flex-1 min-h-0 flex flex-col">
          <label htmlFor="notes-textarea" className="sr-only">
            Notas en formato markdown
          </label>
          <textarea
            ref={textareaRef}
            id="notes-textarea"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder={'Apunta lo que quieras recordar. Markdown soportado:\n\n- # Encabezados\n- **negrita**, *cursiva*, `código`\n- - listas\n- [enlaces](https://…)\n\nLo que escribas se guarda automáticamente y solo en tu navegador.'}
            spellCheck
            className={[
              'flex-1 w-full px-4 py-3.5 bg-transparent border-0 outline-none resize-none',
              'text-[14px] leading-[1.55] text-[var(--text-primary)]',
              'placeholder:text-[var(--text-muted)] placeholder:text-[13px]',
              'font-mono',
              'focus:outline-none',
            ].join(' ')}
            aria-describedby="notes-meta notes-help"
          />
        </div>

        {/* Footer con métricas y acciones */}
        <div
          id="notes-meta"
          className="shrink-0 border-t border-[var(--border-subtle)] px-3 py-2.5 flex items-center justify-between gap-2 text-[11.5px] text-[var(--text-muted)]"
        >
          <div className="flex items-center gap-4 tabular-nums">
            <span aria-label={`${wordCount} palabras`}>
              {wordCount} palabra{wordCount === 1 ? '' : 's'}
            </span>
            <span aria-label={`${characterCount} caracteres`}>
              {characterCount.toLocaleString('es')} char
            </span>
            {savedLabel && (
              <>
                <span
                  className={
                    status === 'pending'
                      ? 'text-amber-600 dark:text-amber-400'
                      : status === 'saved'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : ''
                  }
                  aria-live="polite"
                >
                  {savedLabel}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {confirmClear ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    clear()
                    setConfirmClear(false)
                  }}
                  className="inline-flex items-center justify-center h-8 px-3 rounded-md text-[13px] font-medium bg-red-600 text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] transition-colors"
                >
                  Confirmar borrado
                </button>
                <Button size="sm" variant="ghost" onClick={() => setConfirmClear(false)}>
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                <IconButton
                  onClick={() => exportToMd(moduleTitle)}
                  label="Exportar notas a .md"
                  size="sm"
                  disabled={notes.length === 0}
                >
                  <Download className="size-[14px]" />
                </IconButton>
                <IconButton
                  onClick={() => setConfirmClear(true)}
                  label="Borrar todas las notas"
                  size="sm"
                  disabled={notes.length === 0}
                >
                  <Trash2 className="size-[14px]" />
                </IconButton>
              </>
            )}
          </div>
        </div>

        {/* Pista de ayuda con info al pie */}
        <div
          id="notes-help"
          className="shrink-0 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-3 py-2 text-[11px] text-[var(--text-muted)] flex items-center gap-1.5"
        >
          <Info className="size-[12px] shrink-0" aria-hidden />
          <span>
            Markdown soportado. Solo se guardan en este navegador. Exporta a <code className="font-mono">.md</code> antes de borrar caché.
          </span>
        </div>
      </aside>
    </>
  )
}
