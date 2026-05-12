import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { IconButton } from '@/components/Button'

interface ModalProps {
  /** Controla si el modal está abierto. */
  open: boolean
  /** Callback cuando se solicita cerrar (Escape, backdrop click, botón X). */
  onClose: () => void
  /** Título accesible del modal (aria-label si no se renderiza cabecera). */
  ariaLabel?: string
  /**
   * Si `true`, click sobre el backdrop cierra. Si `false`, solo se
   * cierra explícitamente con la X o Escape. Por defecto `true`.
   */
  closeOnBackdrop?: boolean
  /**
   * Tamaño del contenido. `auto` deja que el contenido marque el
   * tamaño (típico para lightbox). `sm`/`md`/`lg` aplican max-width
   * razonables.
   */
  size?: 'auto' | 'sm' | 'md' | 'lg'
  /**
   * Si `true`, no se renderiza ningún chrome (cabecera, padding,
   * fondo del card). El contenido va directo al backdrop. Útil para
   * el lightbox de imágenes que tiene su propio chrome.
   */
  bare?: boolean
  /** Cabecera del modal (título, subtítulo). Opcional. */
  header?: React.ReactNode
  /** Pie del modal (acciones). Opcional. */
  footer?: React.ReactNode
  children: React.ReactNode
  /** Clase extra sobre el backdrop (para z-index custom, etc.). */
  className?: string
  /** Clase extra sobre el card de contenido (cuando no es `bare`). */
  contentClassName?: string
}

/**
 * Modal genérico con mecánica común: portal a `document.body`,
 * backdrop oscuro, bloqueo de scroll del body, focus trap básico
 * y Escape para cerrar.
 *
 * Dos modos:
 *
 *   - **Normal**: renderiza un card centrado con cabecera, body
 *     y footer opcionales. Usado por confirmaciones y diálogos
 *     estándar.
 *
 *   - **Bare**: el children va directo dentro del backdrop sin
 *     chrome. Usado por componentes con su propio diseño completo
 *     (lightbox de imágenes con sus controles y label inferior).
 *
 * `ZoomableImage` y `ConfirmDialog` construyen sus modos sobre
 * este componente. Cualquier modal futuro debe pasar por aquí.
 */
export function Modal({
  open,
  onClose,
  ariaLabel,
  closeOnBackdrop = true,
  size = 'md',
  bare = false,
  header,
  footer,
  children,
  className = '',
  contentClassName = '',
}: ModalProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  // Bloqueo de scroll del body y listener de Escape.
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, onClose])

  // Focus inicial sobre el card al abrir.
  useEffect(() => {
    if (!open || bare) return
    const node = cardRef.current
    if (!node) return
    // Buscar el primer elemento focusable; si no hay, focar al propio card.
    const focusable = node.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    ;(focusable ?? node).focus()
  }, [open, bare])

  if (!open) return null

  const sizeClass: Record<NonNullable<ModalProps['size']>, string> = {
    auto: '',
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  }

  return createPortal(
    <div
      className={[
        'fixed inset-0 z-[100] flex items-center justify-center bg-black/65 backdrop-blur-sm print:hidden p-4',
        className,
      ].join(' ')}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={e => {
        if (closeOnBackdrop && e.target === e.currentTarget) onClose()
      }}
    >
      {bare ? (
        children
      ) : (
        <div
          ref={cardRef}
          tabIndex={-1}
          className={[
            'w-full rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-xl outline-none flex flex-col max-h-[90vh]',
            sizeClass[size],
            contentClassName,
          ].join(' ')}
          onClick={e => e.stopPropagation()}
        >
          {header && (
            <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-[var(--border-subtle)] shrink-0">
              <div className="flex-1 min-w-0">{header}</div>
              <IconButton onClick={onClose} label="Cerrar" size="sm">
                <X className="size-[16px] stroke-[1.75]" />
              </IconButton>
            </div>
          )}
          {!header && (
            <div className="absolute top-3 right-3">
              <IconButton onClick={onClose} label="Cerrar" size="sm">
                <X className="size-[16px] stroke-[1.75]" />
              </IconButton>
            </div>
          )}
          <div className="px-5 py-4 overflow-y-auto flex-1">{children}</div>
          {footer && (
            <div className="px-5 py-3.5 border-t border-[var(--border-subtle)] flex items-center justify-end gap-2 shrink-0">
              {footer}
            </div>
          )}
        </div>
      )}
    </div>,
    document.body,
  )
}
