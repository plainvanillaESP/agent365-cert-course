import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'
import { resolveContentUrl } from '@/lib/content'
import { ExternalLink } from 'lucide-react'
import type { Components } from 'react-markdown'
import type { ReactNode, ReactElement } from 'react'

interface MarkdownRendererProps {
  body: string
  moduleSlug: string
  className?: string
}

/**
 * Reemplaza inline `[GA]`, `[Preview]`, `[Frontier]`, `[Deprecated]` por chips estilizados.
 */
function transformBadges(node: ReactNode): ReactNode {
  if (typeof node === 'string') {
    const parts: (string | ReactElement)[] = []
    const regex = /\[(GA|Preview|Frontier|Deprecated|Preview pública|Frontier preview)\]/g
    let lastIndex = 0
    let match
    let key = 0
    while ((match = regex.exec(node)) !== null) {
      if (match.index > lastIndex) parts.push(node.slice(lastIndex, match.index))
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
    if (lastIndex < node.length) parts.push(node.slice(lastIndex))
    return parts.length > 1 ? <>{parts}</> : node
  }
  return node
}

function transformChildren(children: ReactNode): ReactNode {
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
    img: ({ src, alt, ...rest }) => {
      const resolved = src ? resolveContentUrl(moduleSlug, src) : undefined
      return <img src={resolved} alt={alt} loading="lazy" {...rest} />
    },
    a: ({ href, children, ...rest }) => {
      const isExternal = href?.startsWith('http://') || href?.startsWith('https://')
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-baseline gap-1"
            {...rest}
          >
            <span>{children}</span>
            <ExternalLink className="size-[11px] shrink-0 translate-y-px opacity-60" aria-hidden />
          </a>
        )
      }
      return <a href={href} {...rest}>{children}</a>
    },
    p: ({ children, ...rest }) => <p {...rest}>{transformChildren(children)}</p>,
    li: ({ children, ...rest }) => <li {...rest}>{transformChildren(children)}</li>,
    td: ({ children, ...rest }) => <td {...rest}>{transformChildren(children)}</td>,
    th: ({ children, ...rest }) => <th {...rest}>{transformChildren(children)}</th>,
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
