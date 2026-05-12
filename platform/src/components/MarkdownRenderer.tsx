import { lazy, Suspense } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'
import { resolveContentUrl } from '@/lib/content'
import { ExternalLink } from 'lucide-react'
import { ZoomableImage } from '@/components/ZoomableImage'
import type { Components } from 'react-markdown'
import type { ReactNode, ReactElement } from 'react'

// Mermaid es pesado (parser, layouters cose-bilkent, etc.). Lazy-load
// para que solo se descargue en módulos que efectivamente lo usen.
const MermaidBlock = lazy(() =>
  import('@/components/MermaidBlock').then(m => ({ default: m.MermaidBlock })),
)

interface MarkdownRendererProps {
  body: string
  moduleSlug: string
  className?: string
  /**
   * Variante de presentación. `'lab'` aplica clases adicionales para
   * destacar pasos numerados, callouts (capturas pendientes, validación,
   * advertencia) y prerrequisitos. Por defecto `'default'` (teoría).
   */
  variant?: 'default' | 'lab'
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

export function MarkdownRenderer({ body, moduleSlug, className = '', variant = 'default' }: MarkdownRendererProps) {
  const components: Components = {
    img: ({ src, alt }) => {
      const resolved = src ? resolveContentUrl(moduleSlug, src) : undefined
      return <ZoomableImage src={resolved} alt={alt} />
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
    // Los blockquotes se clasifican siempre por su contenido (capturas
    // pendientes, advertencias, validación, tip, info) y se renderizan
    // como callouts visuales. La coherencia visual es la misma en
    // teoría, labs y recursos.
    blockquote: ({ children, ...rest }) => {
      const kind = classifyCallout(children)
      return (
        <blockquote {...rest} data-callout={kind} className={`callout callout-${kind}`}>
          {children}
        </blockquote>
      )
    },
    // Detecta `<pre><code class="language-mermaid">` y lo sustituye por
    // el componente con lazy-load del diagrama. El resto de lenguajes
    // deja que `rehype-highlight` haga su trabajo dentro del `<pre>`.
    //
    // Interceptamos a nivel de `<pre>` (no de `<code>`) para evitar
    // anidar un `<div>` dentro de un `<pre>` (HTML inválido) cuando el
    // bloque es Mermaid.
    pre: ({ children, ...rest }) => {
      const source = extractMermaidSource(children)
      if (source !== null) {
        return (
          <Suspense fallback={<div className="my-6 text-[12px] text-[var(--text-muted)]">Cargando diagrama…</div>}>
            <MermaidBlock source={source} />
          </Suspense>
        )
      }
      return <pre {...rest}>{children}</pre>
    },
  }

  return (
    <article className={`markdown-body ${variant === 'lab' ? 'markdown-lab' : ''} ${className}`}>
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

/**
 * Clasifica un blockquote por la primera línea de texto que contiene,
 * para asignarle un estilo de callout. Patrones reconocidos:
 *
 *   - capture:   `[CAPTURA PENDIENTE ...]`, «captura...», «screenshot...»
 *   - warning:   `⚠`, «importante:», «atención:», «aviso:», «cuidado»
 *   - success:   «validación:», «resultado esperado:», «ok:»
 *   - info:      «nota:», «prerrequisitos», «requisitos previos», «recordatorio»
 *   - tip:       «tip:», «consejo:», «pro tip»
 *   - default:   nota genérica.
 */
function classifyCallout(children: ReactNode): string {
  const text = extractFirstText(children).toLowerCase().trim()
  if (/^\[captura pendiente/i.test(text) || /captura/.test(text) || /screenshot/.test(text)) return 'capture'
  if (text.startsWith('⚠') || /^(importante|atención|atencion|aviso|cuidado|warning)\b/.test(text)) return 'warning'
  if (/^(validación|validacion|resultado esperado|ok)\b/.test(text)) return 'success'
  if (/^(tip|consejo|pro tip)\b/.test(text)) return 'tip'
  if (/^(nota|prerrequisitos|requisitos previos|recordatorio|info)\b/.test(text)) return 'info'
  return 'info'
}

/**
 * Si el `<pre>` envuelve un `<code class="language-mermaid">`, devuelve
 * el código fuente como string. En cualquier otro caso devuelve `null`.
 *
 * react-markdown + rehype-highlight nos dan el `<code>` con className
 * `language-mermaid` y los hijos pueden venir como string suelto o como
 * arrays de strings + elementos (cuando highlight ya ha tokenizado el
 * contenido). Para Mermaid no queremos el tokenizado: extraemos el
 * texto plano y lo pasamos a `MermaidBlock`.
 */
function extractMermaidSource(node: ReactNode): string | null {
  if (!node || typeof node !== 'object' || Array.isArray(node)) return null
  if (!('props' in node)) return null
  const el = node as { type?: unknown; props?: { className?: string; children?: ReactNode } }
  if (el.type !== 'code') return null
  const cls = el.props?.className ?? ''
  if (!/\blanguage-mermaid\b/.test(cls)) return null
  return flattenTextNodes(el.props?.children)
}

function flattenTextNodes(node: ReactNode): string {
  if (node == null) return ''
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(flattenTextNodes).join('')
  if (typeof node === 'object' && 'props' in node) {
    const props = (node as { props?: { children?: ReactNode } }).props
    return flattenTextNodes(props?.children)
  }
  return ''
}

function extractFirstText(node: ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) {
    for (const c of node) {
      const t = extractFirstText(c)
      if (t.trim()) return t
    }
    return ''
  }
  if (node && typeof node === 'object' && 'props' in node) {
    const props = (node as { props?: { children?: ReactNode } }).props
    if (props?.children !== undefined) return extractFirstText(props.children)
  }
  return ''
}
