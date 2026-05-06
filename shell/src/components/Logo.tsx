/**
 * Componentes de marca Plain Vanilla.
 *
 * Tres versiones, las tres con archivos reales de la marca:
 *   - <Imagotipo>     — solo el iris (tipo "icon"). Se usa en el header del shell.
 *   - <LogotipoLight> — imagotipo + texto en negro. Para fondo claro.
 *   - <LogotipoDark>  — imagotipo + texto en blanco. Para fondo oscuro.
 */
import { useTheme } from '@/hooks/useTheme'

interface LogoProps {
  className?: string
  alt?: string
}

export function Imagotipo({ className = 'size-8', alt = 'Plain Vanilla' }: LogoProps) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}imagotipo.png`}
      alt={alt}
      className={className}
      width={32}
      height={32}
      decoding="async"
    />
  )
}

/**
 * Logotipo completo (imagotipo + nombre). Cambia automáticamente entre
 * versión clara/oscura según el tema actual.
 */
export function Logotipo({ className = 'h-7', alt = 'Plain Vanilla' }: LogoProps) {
  const { theme } = useTheme()
  const src = theme === 'dark'
    ? `${import.meta.env.BASE_URL}logotipo-negativo.png`
    : `${import.meta.env.BASE_URL}logotipo-positivo.png`
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      decoding="async"
    />
  )
}
