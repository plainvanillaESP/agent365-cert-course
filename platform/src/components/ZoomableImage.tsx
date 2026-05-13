import { useEffect, useState, useRef, useCallback } from 'react'
import { ZoomIn, Plus, Minus, RotateCcw, X, Loader2 } from 'lucide-react'
import { Modal } from '@/components/Modal'

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
 * Comportamiento en vista normal: imagen markdown habitual con
 * indicador "Ampliar" al pasar por encima. Click abre el lightbox.
 *
 * Comportamiento en lightbox (Modal bare): backdrop oscuro, controles
 * de zoom (50-400%), pan con drag cuando hay zoom, doble click para
 * resetear, wheel para zoom continuo. Atajos: Esc / + / - / 0.
 *
 * La mecánica de Modal (portal, scroll lock, Escape) viene del
 * componente Modal base. Aquí solo se gestiona el estado de zoom
 * y la imagen.
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

  // Atajos de teclado específicos del zoom (Esc lo gestiona Modal).
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === '+' || e.key === '=') zoomIn()
      else if (e.key === '-' || e.key === '_') zoomOut()
      else if (e.key === '0') handleReset()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, handleReset, zoomIn, zoomOut])

  // Reset al cerrar.
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

  /* Drag (pan) cuando hay zoom */
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

  /* Wheel zoom continuo */
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
          decoding="async"
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

      <Modal
        open={open}
        onClose={handleClose}
        ariaLabel={alt ? `Imagen ampliada: ${alt}` : 'Imagen ampliada'}
        bare
        className="bg-black/85 overflow-hidden"
      >
        <div className="contents" onWheel={onWheel}>
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

          {/* Imagen */}
          <img
            src={src}
            alt={alt}
            draggable={false}
            decoding="async"
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
        </div>
      </Modal>
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
