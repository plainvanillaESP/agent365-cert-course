import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'
import { resolveContentUrl } from '@/lib/content'
import { ExternalLink } from 'lucide-react'
import type { Components } from 'react-markdown'

interface MarkdownRendererProps {
  /**
   * El cuerpo markdown ya sin frontmatter.
   */
  body: string
  /**
   * Slug del módulo para resolver URLs relativas (ej: assets/foo.svg).
   */
  moduleSlug: string
  /**
   * Clase adicional opcional.
   */
  className?: string
}

/**
 * Reemplaza inline los marcadores de badge `[GA]`, `[Preview]`, `[Frontier]`,
 * `[Deprecated]`, `[Frontier preview]`, `[Preview pública]` por un span con la clase
 * de badge correspondiente. Aplicado al texto antes de pasarlo a react-markdown,
 * vía un componente custom de párrafo.
 *
 * Implementación: post-proceso DOM ligero en el componente <p> y elementos
 * inline. Más fiable que tocar el AST de remark.
 */
function transformBadges(node: React.ReactNode): React.ReactNode {
  if (typeof node === 'string') {
    const parts: (string | React.ReactElement)[] = []
    const regex = /\[(GA|Preview|Frontier|Deprecated|Preview pública|Frontier preview)\]/g
    let lastIndex = 0
    let match
    let key = 0
    while ((match = regex.exec(node)) !== null) {
      if (match.index > lastIndex) {
        parts.push(node.slice(lastIndex, match.index))
      }
      const status = match[1]
      const variantClass = status.toLowerCase().includes('ga')
        ? 'badge-status-ga'
        : status.toLowerCase().includes('frontier')
        ? 'badge-status-frontier'
        : status.toLowerCase().includes('deprecated')
        ? 'badge-status-deprecated'
        : 'badge-status-preview'
      parts.push(
        <span key={`badge-${key++}`} className={`badge-status ${variantClass}`}>
          {status}
        </span>
      )
      lastIndex = match.index + match[0].length
    }
    if (lastIndex < node.length) {
      parts.push(node.slice(lastIndex))
    }
    return parts.length > 1 ? <>{parts}</> : node
  }
  return node
}

function transformChildren(children: React.ReactNode): React.ReactNode {
  if (Array.isArray(children)) {
    return children.map((child, i) => {
      if (typeof child === 'string') {
        return <span key={i}>{transformBadges(child)}</span>
      }
      return child
    })
  }
  return transformBadges(children)
}

export function MarkdownRenderer({ body, moduleSlug, className = '' }: MarkdownRendererProps) {
  const components: Components = {
    // Resolver URLs relativas de imágenes (SVG inline, etc.)
    img: ({ src, alt, ...rest }) => {
      const resolved = src ? resolveContentUrl(moduleSlug, src) : undefined
      return (
        <img
          src={resolved}
          alt={alt}
          loading="lazy"
          {...rest}
        />
      )
    },
    // Enlaces externos: target=_blank y icono inline
    a: ({ href, children, ...rest }) => {
      const isExternal = href?.startsWith('http://') || href?.startsWith('https://')
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-baseline gap-1 hover:no-underline"
            {...rest}
          >
            <span className="underline underline-offset-[3px] decoration-1">{children}</span>
            <ExternalLink className="size-3 shrink-0 translate-y-px opacity-60" aria-hidden />
          </a>
        )
      }
      return <a href={href} {...rest}>{children}</a>
    },
    // Texto inline: reemplazar badges
    p: ({ children, ...rest }) => (
      <p {...rest}>{transformChildren(children)}</p>
    ),
    li: ({ children, ...rest }) => (
      <li {...rest}>{transformChildren(children)}</li>
    ),
    td: ({ children, ...rest }) => (
      <td {...rest}>{transformChildren(children)}</td>
    ),
    th: ({ children, ...rest }) => (
      <th {...rest}>{transformChildren(children)}</th>
    ),
  }

  return (
    <article className={`markdown-body ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          rehypeSlug,
          [rehypeHighlight, { detect: true, ignoreMissing: true }],
        ]}
        components={components}
      >
        {body}
      </ReactMarkdown>
    </article>
  )
}
