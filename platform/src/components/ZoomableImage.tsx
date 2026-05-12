import { useEffect, useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X, ZoomIn, Plus, Minus, RotateCcw, Loader2 } from 'lucide-react'

interface ZoomableImageProps {
  src?: string
  alt?: string
  className?: string
}

const MIN_SCALE = 0.5
const MAX_SCALE = 4
const SCALE_STEP = 0.25

/**
 * Imagen con click-to-zoom integrado.
 *
 * En vista normal, la imagen mantiene su comportamiento markdown habitual
 * (responsive, lazy load) y muestra un indicador de "Ampliar" al pasar
 * por encima. Click abre un lightbox modal con:
 *
 *   - Backdrop oscuro semitransparente. Click cierra.
 *   - Controles superiores: zoom in/out (50-400%, paso 25%), reset, cerrar.
 *   - Pan con drag cuando hay zoom (`scale > 1`).
 *   - Rueda del ratón para zoom continuo.
 *   - Doble click para resetear a 100%.
 *   - Atajos teclado: Esc cierra, +/- zoom, 0 reset.
 *   - Etiqueta inferior con el alt para contexto.
 *   - Loading state mientras la imagen carga (raro, suele venir del cache).
 *
 * La imagen del modal se posiciona directamente en el flex container con
 * el transform aplicado a ella misma. Esto evita el problema clásico de
 * un div wrapper con max-width/height pero sin contenido cargado, que
 * colapsa a 0x0 hasta que la imagen termina de cargar.
 *
 * Se renderiza vía createPortal en `document.body` para evitar conflictos
 * con párrafos generados por react-markdown que podrían contener el
 * componente. Bloquea el scroll del body mientras está abierto. Compatible
 * con `prefers-reduced-motion` y `print:hidden` para el certificado.
 */
export function ZoomableImage({ src, alt, className }: ZoomableImageProps) {
  const [open, setOpen] = useState(false)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [loaded, setLoaded] = useState(false)
  const dragRef = useRef<{ startX: number; startY: number; offsetX: number; offsetY: number } | null>(null)

  const handleOpen = useCallback(() => {
    setLoaded(false)
    setOpen(true)
  }, [])

  const handleClose = useCallback(() => setOpen(false), [])

  const handleReset = useCallback(() => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }, [])

  const zoomIn = useCallback(() => setScale(s => Math.min(s + SCALE_STEP, MAX_SCALE)), [])
  const zoomOut = useCallback(() => setScale(s => Math.max(s - SCALE_STEP, MIN_SCALE)), [])

  // Listeners globales y bloqueo de scroll cuando se abre el modal.
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
      else if (e.key === '+' || e.key === '=') zoomIn()
      else if (e.key === '-' || e.key === '_') zoomOut()
      else if (e.key === '0') handleReset()
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, handleClose, handleReset, zoomIn, zoomOut])

  // Reset zoom y offset al cerrar.
  useEffect(() => {
    if (!open) {
      setScale(1)
      setOffset({ x: 0, y: 0 })
      dragRef.current = null
    }
  }, [open])

  if (!src) return null

  const handleTriggerKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleOpen()
    }
  }

  /* ---------------- Drag (pan) cuando hay zoom ---------------- */

  const onImgPointerDown = (e: React.PointerEvent<HTMLImageElement>) => {
    if (scale <= 1) return
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      offsetX: offset.x,
      offsetY: offset.y,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onImgPointerMove = (e: React.PointerEvent<HTMLImageElement>) => {
    if (!dragRef.current) return
    setOffset({
      x: dragRef.current.offsetX + (e.clientX - dragRef.current.startX),
      y: dragRef.current.offsetY + (e.clientY - dragRef.current.startY),
    })
  }

  const onImgPointerUp = (e: React.PointerEvent<HTMLImageElement>) => {
    dragRef.current = null
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  /* ---------------- Wheel zoom ---------------- */

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -SCALE_STEP : SCALE_STEP
    setScale(s => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s + delta)))
  }

  return (
    <>
      <span
        role="button"
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={handleTriggerKey}
        className={[
          'group relative block max-w-full cursor-zoom-in print:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pv-purple-500)] rounded-md',
          className ?? '',
        ].join(' ')}
        aria-label={alt ? `Ampliar imagen: ${alt}` : 'Ampliar imagen'}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="max-w-full h-auto block rounded-md transition-[box-shadow] duration-200 group-hover:shadow-md"
        />
        <span
          className="absolute top-2 right-2 hidden sm:flex items-center gap-1 rounded-md bg-black/55 text-white text-[11px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm print:hidden"
          aria-hidden
        >
          <ZoomIn className="size-3 stroke-[2]" />
          Ampliar
        </span>
      </span>

      {open && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm print:hidden overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label={alt ? `Imagen ampliada: ${alt}` : 'Imagen ampliada'}
          onClick={e => {
            if (e.target === e.currentTarget) handleClose()
          }}
          onWheel={onWheel}
        >
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Loader2 className="size-10 stroke-[1.5] text-white/70 animate-spin" aria-hidden />
            </div>
          )}

          {/* Controles superiores */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <CtrlButton onClick={zoomOut} ariaLabel="Reducir zoom" disabled={scale <= MIN_SCALE}>
              <Minus className="size-[16px] stroke-[2]" aria-hidden />
            </CtrlButton>
            <span className="px-2 py-1 rounded-md text-white/85 text-[12px] font-mono tabular-nums bg-white/10 min-w-[3.5rem] text-center">
              {Math.round(scale * 100)}%
            </span>
            <CtrlButton onClick={zoomIn} ariaLabel="Aumentar zoom" disabled={scale >= MAX_SCALE}>
              <Plus className="size-[16px] stroke-[2]" aria-hidden />
            </CtrlButton>
            <CtrlButton onClick={handleReset} ariaLabel="Restablecer tamaño">
              <RotateCcw className="size-[16px] stroke-[2]" aria-hidden />
            </CtrlButton>
            <CtrlButton onClick={handleClose} ariaLabel="Cerrar imagen ampliada">
              <X className="size-[18px] stroke-[2]" aria-hidden />
            </CtrlButton>
          </div>

          {/* Etiqueta inferior con el alt */}
          {alt && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-[80vw] px-3 py-1.5 rounded-md bg-black/65 text-white/90 text-[13px] text-center backdrop-blur-sm pointer-events-none z-10">
              {alt}
            </div>
          )}

          {/* Imagen — directa al flex container, transform sobre sí misma */}
          <img
            src={src}
            alt={alt}
            draggable={false}
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
            onClick={e => e.stopPropagation()}
            onDoubleClick={handleReset}
            onPointerDown={onImgPointerDown}
            onPointerMove={onImgPointerMove}
            onPointerUp={onImgPointerUp}
            onPointerCancel={onImgPointerUp}
            className="max-w-[95vw] max-h-[95vh] object-contain select-none rounded"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              transition: dragRef.current
                ? 'opacity 0.2s'
                : 'transform 0.15s ease-out, opacity 0.2s',
              cursor: scale > 1 ? (dragRef.current ? 'grabbing' : 'grab') : 'zoom-in',
              opacity: loaded ? 1 : 0,
              touchAction: 'none',
            }}
          />
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
