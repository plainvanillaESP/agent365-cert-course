/**
 * Componentes de marca Plain Vanilla.
 *
 * Tres variantes, todas usando SVG:
 *   - <Imagotipo>  — solo el iris. Independiente del tema (gradiente brand legible
 *                    sobre cualquier fondo).
 *   - <Logotipo>   — imagotipo + nombre. Cambia entre versión positiva (texto negro)
 *                    y negativa (texto blanco) según el tema.
 *
 * El cambio entre positivo/negativo se hace con CSS (`block dark:hidden` y
 * `hidden dark:block`), no con JS. Así no hay desincronización entre la clase
 * .dark del HTML (aplicada por el script anti-FOUC en index.html) y el render
 * inicial de React: el navegador resuelve el toggle inmediatamente con CSS.
 */

interface LogoProps {
  className?: string
  alt?: string
}

const BASE = import.meta.env.BASE_URL

/**
 * Solo el iris. Gradient pink→purple sobre fondo transparente. Mismo asset
 * en cualquier tema.
 */
export function Imagotipo({ className = 'size-8', alt = 'Plain Vanilla' }: LogoProps) {
  return (
    <img
      src={`${BASE}imagotipo.svg`}
      alt={alt}
      className={className}
      decoding="async"
      width={32}
      height={32}
    />
  )
}

/**
 * Logotipo completo (imagotipo + nombre). Dos `<img>` apilados; el toggle
 * positivo/negativo se hace por CSS con la clase `.dark` en `<html>`.
 */
export function Logotipo({ className = 'h-7', alt = 'Plain Vanilla' }: LogoProps) {
  return (
    <>
      <img
        src={`${BASE}logotipo-positivo.svg`}
        alt={alt}
        className={`${className} block dark:hidden`}
        decoding="async"
      />
      <img
        src={`${BASE}logotipo-negativo.svg`}
        alt=""
        aria-hidden
        className={`${className} hidden dark:block`}
        decoding="async"
      />
    </>
  )
}
