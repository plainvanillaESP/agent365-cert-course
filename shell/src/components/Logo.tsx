interface LogoProps {
  className?: string
}

/**
 * Imagotipo de Plain Vanilla.
 * Reproducción del logo brand en SVG con el gradiente característico
 * #9A44E5 → #F68DAC.
 */
export function Logo({ className = 'size-10' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Plain Vanilla"
    >
      <defs>
        <linearGradient id="pv-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F68DAC" />
          <stop offset="100%" stopColor="#9A44E5" />
        </linearGradient>
      </defs>
      {/* Cuatro pétalos formando círculo */}
      <path
        d="M32 4 C32 18 18 32 4 32 C4 18 18 4 32 4 Z"
        fill="url(#pv-logo-gradient)"
        opacity="0.9"
      />
      <path
        d="M32 4 C46 4 60 18 60 32 C46 32 32 18 32 4 Z"
        fill="url(#pv-logo-gradient)"
        opacity="0.95"
      />
      <path
        d="M32 60 C32 46 46 32 60 32 C60 46 46 60 32 60 Z"
        fill="url(#pv-logo-gradient)"
      />
      <path
        d="M32 60 C18 60 4 46 4 32 C18 32 32 46 32 60 Z"
        fill="url(#pv-logo-gradient)"
        opacity="0.85"
      />
      {/* Diamante central */}
      <path
        d="M32 18 L40 32 L32 46 L24 32 Z"
        fill="url(#pv-logo-gradient)"
        opacity="0.7"
      />
    </svg>
  )
}
