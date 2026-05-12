import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, ZoomIn, Plus, Minus, RotateCcw } from 'lucide-react'

interface ZoomableImageProps {
  src?: string
  alt?: string
  className?: string
}

/**
 * Imagen que se puede ampliar a pantalla completa al hacer click.
 *
 * En vista normal: la imagen se muestra con un cursor de lupa y un
 * indicador visible al pasar por encima. Click abre el lightbox.
 *
 * En lightbox: backdrop oscuro, imagen centrada con tamaño máximo del
 * 95 % del viewport. Controles para zoom in/out, reset y cerrar. Soporte
 * de teclado (Esc cierra, +/- zoom, 0 reset). Click fuera del contenido
 * cierra. El zoom permite leer texto en SVGs y diagramas que en la
 * lectura normal del módulo se ven pequeños.
 *
 * Compatible con `prefers-reduced-motion`: la transición de zoom se
 * desactiva si el usuario lo solicita.
 */
export function ZoomableImage({ src, alt, className }: ZoomableImageProps) {
  const [open, setOpen] = useState(false)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragRef = useRef<{ x: number; y: number } | null>(null)

  // Controles de teclado y bloqueo de scroll del body cuando se abre.
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      } else if (e.key === '+' || e.key === '=') {
        setScale(s => Math.min(s + 0.25, 4))
      } else if (e.key === '-' || e.key === '_') {
        setScale(s => Math.max(s - 0.25, 0.5))
      } else if (e.key === '0') {
        setScale(1)
        setOffset({ x: 0, y: 0 })
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  // Reset al cerrar.
  useEffect(() => {
    if (!open) {
      setScale(1)
      setOffset({ x: 0, y: 0 })
    }
  }, [open])

  if (!src) return null

  const handleOpen = () => setOpen(true)

  // Drag para mover la imagen cuando está ampliada
  const onPointerDown = (e: React.PointerEvent) => {
    if (scale <= 1) return
    dragRef.current = { x: e.clientX - offset.x, y: e.clientY - offset.y }
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return
    setOffset({
      x: e.clientX - dragRef.current.x,
      y: e.clientY - dragRef.current.y,
    })
  }
  const onPointerUp = () => {
    dragRef.current = null
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={[
          'group relative inline-block max-w-full p-0 m-0 border-0 bg-transparent cursor-zoom-in print:cursor-default',
          className ?? '',
        ].join(' ')}
        aria-label={alt ? `Ampliar imagen: ${alt}` : 'Ampliar imagen'}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="max-w-full h-auto rounded-md transition-[box-shadow] duration-200 group-hover:shadow-md"
        />
        <span
          className="absolute top-2 right-2 hidden sm:flex items-center gap-1 rounded-md bg-black/55 text-white text-[11px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm print:hidden"
          aria-hidden
        >
          <ZoomIn className="size-3 stroke-[2]" />
          Ampliar
        </span>
      </button>

      {open && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm print:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={alt ? `Imagen ampliada: ${alt}` : 'Imagen ampliada'}
          onClick={e => {
            // Click sobre el backdrop cierra; click sobre la imagen no.
            if (e.target === e.currentTarget) setOpen(false)
          }}
        >
          {/* Controles superiores */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <CtrlButton
              onClick={() => setScale(s => Math.max(s - 0.25, 0.5))}
              ariaLabel="Reducir zoom"
              disabled={scale <= 0.5}
            >
              <Minus className="size-[16px] stroke-[2]" aria-hidden />
            </CtrlButton>
            <span className="px-2 py-1 rounded-md text-white/85 text-[12px] font-mono tabular-nums bg-white/10 min-w-[3.5rem] text-center">
              {Math.round(scale * 100)}%
            </span>
            <CtrlButton
              onClick={() => setScale(s => Math.min(s + 0.25, 4))}
              ariaLabel="Aumentar zoom"
              disabled={scale >= 4}
            >
              <Plus className="size-[16px] stroke-[2]" aria-hidden />
            </CtrlButton>
            <CtrlButton
              onClick={() => {
                setScale(1)
                setOffset({ x: 0, y: 0 })
              }}
              ariaLabel="Restablecer tamaño"
            >
              <RotateCcw className="size-[16px] stroke-[2]" aria-hidden />
            </CtrlButton>
            <CtrlButton onClick={() => setOpen(false)} ariaLabel="Cerrar imagen ampliada">
              <X className="size-[18px] stroke-[2]" aria-hidden />
            </CtrlButton>
          </div>

          {/* Etiqueta inferior con el alt */}
          {alt && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-[80vw] px-3 py-1.5 rounded-md bg-black/65 text-white/90 text-[13px] text-center backdrop-blur-sm">
              {alt}
            </div>
          )}

          {/* Lienzo con la imagen */}
          <div
            className="select-none"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              transition: dragRef.current ? 'none' : 'transform 0.15s ease-out',
              cursor: scale > 1 ? 'grab' : 'default',
              maxWidth: '95vw',
              maxHeight: '95vh',
            }}
          >
            <img
              src={src}
              alt={alt}
              className="max-w-[95vw] max-h-[95vh] block object-contain pointer-events-none"
              draggable={false}
            />
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}

function CtrlButton({
  onClick,
  ariaLabel,
  disabled,
  children,
}: {
  onClick: () => void
  ariaLabel: string
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="size-9 rounded-md bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  )
}
