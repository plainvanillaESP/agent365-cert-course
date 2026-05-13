import { useState } from 'react'
import { Link2, Share2, Check } from 'lucide-react'

// Iconos sociales como SVG inline porque la versión instalada de
// `lucide-react` (1.14) no expone `Linkedin` ni `Twitter`. Los paths son
// los logos oficiales simplificados. Inline en vez de añadir
// `react-icons` por algo tan puntual.
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  )
}

interface ShareButtonsProps {
  /** URL canónica a compartir (absoluta). Si no se pasa, usa `window.location.href`. */
  url?: string
  /** Texto sugerido para X y para Web Share API (no se usa en LinkedIn). */
  text?: string
  /** Título sugerido (Web Share API). */
  title?: string
  className?: string
  /** Variante visual: completa (iconos + labels) o compacta (solo iconos). */
  variant?: 'full' | 'compact'
}

/**
 * Botonera de compartir reutilizable. Soporta:
 *
 *   - **LinkedIn**: enlace al sharer estándar `feed/?shareActive=true&text=`
 *     (acepta URL en el texto y deja que el alumno edite el copy antes
 *     de publicar).
 *   - **X (Twitter)**: enlace al sharer estándar
 *     `twitter.com/intent/tweet`.
 *   - **Web Share API** (mobile + browsers modernos): botón "Compartir"
 *     que invoca `navigator.share`. Solo aparece si la API existe.
 *   - **Copiar enlace**: copia la URL al portapapeles con feedback.
 *
 * Componentizada para que cualquier shell PV-Learn la consuma sin tocar
 * nada (futuro: compartir badges, módulos, recursos). Recibe URL + text
 * + title y se ocupa del resto.
 */
export function ShareButtons({
  url,
  text = '',
  title = '',
  className = '',
  variant = 'full',
}: ShareButtonsProps) {
  const shareUrl = url ?? (typeof window !== 'undefined' ? window.location.href : '')
  const [copied, setCopied] = useState(false)

  const linkedInHref = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(
    text ? `${text}\n${shareUrl}` : shareUrl,
  )}`

  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`

  const supportsWebShare =
    typeof navigator !== 'undefined' && typeof (navigator as Navigator).share === 'function'

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Fallback: prompt para que el alumno copie a mano.
      window.prompt('Copia el enlace:', shareUrl)
    }
  }

  const onWebShare = async () => {
    try {
      await (navigator as Navigator).share({ url: shareUrl, text, title })
    } catch {
      /* el alumno canceló el share o el navegador lo rechazó: silencio */
    }
  }

  const compact = variant === 'compact'
  const btnBase =
    'inline-flex items-center gap-1.5 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pv-purple-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]'
  const btnFull = `${btnBase} h-9 px-3 text-[13px] font-medium border border-[var(--border-default)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)]`
  const btnCompact = `${btnBase} size-9 justify-center border border-[var(--border-default)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]`
  const cls = compact ? btnCompact : btnFull

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`} role="group" aria-label="Compartir">
      <a
        href={linkedInHref}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        aria-label="Compartir en LinkedIn"
      >
        <LinkedinIcon className="size-[15px]" />
        {!compact && <span>LinkedIn</span>}
      </a>
      <a
        href={twitterHref}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        aria-label="Compartir en X"
      >
        <XIcon className="size-[15px]" />
        {!compact && <span>X</span>}
      </a>
      {supportsWebShare && (
        <button type="button" onClick={onWebShare} className={cls} aria-label="Compartir">
          <Share2 className="size-[15px]" aria-hidden />
          {!compact && <span>Compartir</span>}
        </button>
      )}
      <button
        type="button"
        onClick={onCopy}
        className={cls}
        aria-label="Copiar enlace"
        aria-live="polite"
      >
        {copied ? (
          <>
            <Check className="size-[15px] text-emerald-600 dark:text-emerald-400" aria-hidden />
            {!compact && <span>Copiado</span>}
          </>
        ) : (
          <>
            <Link2 className="size-[15px]" aria-hidden />
            {!compact && <span>Copiar enlace</span>}
          </>
        )}
      </button>
    </div>
  )
}
