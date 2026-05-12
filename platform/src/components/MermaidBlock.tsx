import { useEffect, useId, useRef, useState } from 'react'
import { AlertTriangle } from 'lucide-react'

interface MermaidBlockProps {
  /** Código fuente Mermaid. */
  source: string
}

/**
 * Cache singleton de la librería Mermaid. Se importa dinámicamente la
 * primera vez que se renderiza un diagrama y se inicializa con un tema
 * neutro que respeta los tokens visuales de la plataforma.
 */
let mermaidPromise: Promise<typeof import('mermaid').default> | null = null

function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then(mod => {
      const mermaid = mod.default
      const isDark =
        typeof document !== 'undefined' &&
        document.documentElement.classList.contains('dark')
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: isDark ? 'dark' : 'neutral',
        fontFamily:
          'Instrument Sans, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
      })
      return mermaid
    })
  }
  return mermaidPromise
}

/**
 * Renderiza un bloque ```mermaid del markdown del curso a SVG inline.
 *
 * Detalles:
 *
 *   - **Lazy-load** de la librería: el chunk de Mermaid (~500 kB) solo
 *     se descarga si la sección consultada contiene al menos un
 *     diagrama. Hoy ningún módulo lo usa, pero queda listo para futuros
 *     módulos (arquitecturas, sequence diagrams) sin tener que editar
 *     la plataforma.
 *   - **Resiliencia**: si Mermaid no consigue parsear, mostramos un
 *     callout con el error y el código fuente, en lugar de romper el
 *     render del módulo entero.
 *   - **Tema**: se inicializa la primera vez con `dark` o `neutral`
 *     según `documentElement.classList`. Si el alumno cambia de tema
 *     en runtime, los diagramas ya renderizados conservan su tema; los
 *     siguientes adoptan el nuevo. Es un trade-off consciente: re-render
 *     en cambio de tema es caro y no es el caso de uso principal.
 */
export function MermaidBlock({ source }: MermaidBlockProps) {
  const reactId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [svg, setSvg] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setError(null)
    setSvg(null)

    loadMermaid()
      .then(async mermaid => {
        // El id ha de ser válido como atributo XML: nada de ":", que
        // useId usa. Limpiamos a [A-Za-z0-9_-].
        const safeId = `mermaid-${reactId.replace(/[^a-zA-Z0-9_-]/g, '_')}`
        try {
          const { svg } = await mermaid.render(safeId, source.trim())
          if (!cancelled) setSvg(svg)
        } catch (err) {
          if (!cancelled) {
            setError(err instanceof Error ? err.message : 'Error renderizando diagrama')
          }
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'No se pudo cargar Mermaid')
        }
      })

    return () => {
      cancelled = true
    }
  }, [source, reactId])

  if (error) {
    return (
      <div className="my-6 rounded-lg border border-amber-500/45 bg-amber-500/10 p-4">
        <div className="flex items-center gap-2 text-[12.5px] font-semibold text-amber-700 dark:text-amber-300 mb-2">
          <AlertTriangle className="size-[14px] stroke-[2]" aria-hidden />
          Diagrama Mermaid no renderizable
        </div>
        <pre className="text-[12px] text-[var(--text-secondary)] whitespace-pre-wrap font-mono overflow-x-auto m-0">
{source}
        </pre>
        <p className="text-[11.5px] text-[var(--text-muted)] mt-2 m-0">{error}</p>
      </div>
    )
  }

  return (
    <div className="my-6 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-4 overflow-x-auto">
      {svg ? (
        <div
          ref={containerRef}
          className="mermaid-svg flex justify-center"
          // El SVG viene de mermaid.render(), generado a partir de un
          // source markdown del paquete del curso (no de input del
          // alumno). La librería usa `securityLevel: 'strict'` para
          // sanitizar texto. Inyectamos como innerHTML.
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div
          role="status"
          className="text-[12px] text-[var(--text-muted)] py-6 text-center"
        >
          Cargando diagrama…
        </div>
      )}
    </div>
  )
}
