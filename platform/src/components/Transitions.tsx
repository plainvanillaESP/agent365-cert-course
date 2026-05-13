import type { ReactNode } from 'react'

/**
 * Helpers de transición reutilizables. Implementadas con animaciones
 * CSS en lugar de `framer-motion` para no añadir 30 kB al bundle por
 * algo tan simple. Las animaciones respetan `prefers-reduced-motion`
 * en el CSS (clase `.pv-fade-in` definida en `index.css`).
 *
 * Patrón clave: el componente usa `key` para que el contenido se
 * remonte cuando cambia, lo que dispara la animación. El consumidor
 * pasa `fadeKey` con el valor que debe disparar la transición
 * (típicamente el slug de la ruta, el modo, etc.).
 */

interface FadeProps {
  /** Cambio de este valor remonta el contenido y reanima. */
  fadeKey: string | number
  children: ReactNode
  className?: string
  /**
   * Variante de la animación.
   * - `fade`: opacidad + 4 px de slide vertical.
   * - `slide-right`: opacidad + 12 px de slide horizontal (útil para
   *   "venir desde la izquierda" en cambios de sección).
   */
  variant?: 'fade' | 'slide-right'
}

export function Fade({ fadeKey, children, className = '', variant = 'fade' }: FadeProps) {
  return (
    <div
      key={fadeKey}
      className={`${variant === 'slide-right' ? 'pv-slide-in-right' : 'pv-fade-in'} ${className}`}
    >
      {children}
    </div>
  )
}
