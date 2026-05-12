import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import type { ReactNode } from 'react'

interface InlineMarkdownProps {
  /** Texto markdown inline (sin saltos de línea de párrafo). */
  text: string
  /** className opcional para el span contenedor. */
  className?: string
}

/**
 * Renderiza una línea de texto con soporte para markdown inline:
 *
 *   **negrita**, *cursiva*, `code`, [enlace](url), y entidades HTML.
 *
 * NO genera párrafos `<p>` (los párrafos los maneja el contenedor padre,
 * típicamente para mantener semántica de listas, opciones de quiz o
 * párrafos del prompt). Se usa en los enunciados y opciones de las
 * preguntas, donde el texto viene del frontmatter del markdown del banco
 * y conserva los marcadores `**...**` sin renderizar si no se procesan.
 *
 * Limitaciones intencionales:
 *   - No soporta encabezados ni bloques (no aplica inline).
 *   - No soporta imágenes (las preguntas no las llevan; si en el futuro sí,
 *     se pueden añadir aquí mismo).
 *   - Enlaces externos se abren en nueva pestaña por seguridad.
 */
export function InlineMarkdown({ text, className }: InlineMarkdownProps) {
  const components: Components = {
    // Quitamos el wrapper <p> que react-markdown añade por defecto.
    // Renderizamos los hijos directamente para que el texto fluya en línea.
    p: ({ children }) => <>{children}</>,
    a: ({ href, children }) => {
      const isExternal = href?.startsWith('http://') || href?.startsWith('https://')
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[var(--text-muted)] underline-offset-2"
          >
            {children as ReactNode}
          </a>
        )
      }
      return (
        <a href={href} className="underline decoration-[var(--text-muted)] underline-offset-2">
          {children as ReactNode}
        </a>
      )
    },
    code: ({ children }) => (
      <code className="rounded bg-[var(--bg-surface-2)] px-1 py-px text-[0.92em] font-mono">
        {children as ReactNode}
      </code>
    ),
    strong: ({ children }) => <strong className="font-semibold">{children as ReactNode}</strong>,
    em: ({ children }) => <em className="italic">{children as ReactNode}</em>,
  }

  return (
    <span className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {text}
      </ReactMarkdown>
    </span>
  )
}
