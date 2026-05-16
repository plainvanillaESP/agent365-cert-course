import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertOctagon, RefreshCw, Home } from 'lucide-react'

/**
 * Error boundary global de la app.
 *
 * React no expone errores síncronos de render en hooks de función; hay
 * que envolver el árbol con un componente de clase que implemente
 * `componentDidCatch` / `getDerivedStateFromError`. Cualquier crash
 * (chunk lazy que falla, librería que tira, render condicional con
 * `undefined.foo`) cae aquí en vez de dejar la pantalla en blanco.
 *
 * Comportamiento:
 *
 *   1. Captura el error y muestra una pantalla amable.
 *   2. Si `window.Sentry` existe (cuando se añada Sentry env-gated),
 *      reporta el error con `Sentry.captureException`.
 *   3. Ofrece dos acciones: recargar la página (descarta el estado en
 *      memoria pero conserva localStorage) y volver al inicio.
 *   4. En desarrollo muestra el stack trace; en producción solo el
 *      mensaje + un identificador para correlacionar con Sentry si
 *      llega.
 *
 * Reutilizable: se monta en `App.tsx` envolviendo todo el árbol del
 * router. No hace asunciones sobre el dominio del error.
 */

interface State {
  error: Error | null
  errorInfo: ErrorInfo | null
}

declare global {
  interface Window {
    Sentry?: {
      captureException?: (err: unknown, ctx?: unknown) => void
    }
  }
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null, errorInfo: null }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })
    // Reporta a Sentry si está disponible (cuando se enchufe).
    if (typeof window !== 'undefined' && window.Sentry?.captureException) {
      try {
        window.Sentry.captureException(error, { contexts: { react: errorInfo } })
      } catch {
        /* no rompemos por un fallo del reporter */
      }
    } else {
      // Sin Sentry: al menos lo dejamos en consola para que sea visible
      // en `npm run dev` y en la consola del navegador del alumno.
      console.error('[ErrorBoundary]', error, errorInfo)
    }
  }

  reset = () => {
    this.setState({ error: null, errorInfo: null })
  }

  reload = () => {
    window.location.reload()
  }

  goHome = () => {
    window.location.href = '/'
  }

  render() {
    if (!this.state.error) return this.props.children

    const isDev = import.meta.env.DEV
    const message = this.state.error.message || 'Error desconocido'

    return (
      <div className="min-h-dvh flex items-center justify-center p-6 bg-[var(--bg-canvas)]">
        <div className="max-w-lg w-full text-center">
          <div className="size-14 mx-auto rounded-full bg-red-500/15 text-red-700 dark:text-red-300 flex items-center justify-center mb-4">
            <AlertOctagon className="size-7 stroke-[1.75]" aria-hidden />
          </div>

          <h1 className="text-[22px] font-semibold text-[var(--text-primary)] mb-2">
            Algo ha ido mal
          </h1>
          <p className="text-[14px] text-[var(--text-secondary)] mb-6">
            La página no se ha podido cargar. Tu progreso queda guardado en este navegador;
            puedes recargar y volver a intentarlo.
          </p>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={this.reload}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-md text-[14px] font-medium bg-[var(--color-pv-purple-600)] text-white hover:bg-[var(--color-pv-purple-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pv-purple-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] transition-colors"
            >
              <RefreshCw className="size-[15px] stroke-[2]" aria-hidden />
              Recargar la página
            </button>
            <button
              type="button"
              onClick={this.goHome}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-md text-[14px] font-medium border border-[var(--border-default)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pv-purple-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] transition-colors"
            >
              <Home className="size-[15px] stroke-[2]" aria-hidden />
              Volver al inicio
            </button>
          </div>

          {/* Detalles colapsables: mensaje siempre, stack solo en dev. El
              mensaje del error es información necesaria para diagnosticar
              y NO expone secretos por sí mismo. El stack incluye paths del
              bundle (minificado en prod), así que tampoco. Aún así, el
              <details> sale colapsado para no estresar al usuario. */}
          <details className="mt-8 text-left">
            <summary className="text-[12px] text-[var(--text-muted)] cursor-pointer mb-2 inline-flex items-center gap-1.5">
              Detalles técnicos del error
            </summary>
            <pre className="text-[11px] font-mono text-red-700 dark:text-red-300 bg-[var(--bg-surface-2)] p-3 rounded overflow-x-auto whitespace-pre-wrap m-0 max-h-64 overflow-y-auto">
              {message}
              {isDev && this.state.error.stack ? '\n\n' + this.state.error.stack : ''}
              {isDev && this.state.errorInfo?.componentStack
                ? '\n\nComponent stack:' + this.state.errorInfo.componentStack
                : ''}
            </pre>
          </details>
        </div>
      </div>
    )
  }
}
