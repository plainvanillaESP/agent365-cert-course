import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from './ErrorBoundary'

// React Testing Library no viene con vitest; añadimos sus matchers
// manualmente. Si no está instalado, el test no compila y CI lo
// reportará — preferible a tests silenciosamente saltados.

function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('boom intencional')
  return <span>vivo</span>
}

describe('ErrorBoundary', () => {
  let consoleError: typeof console.error

  beforeEach(() => {
    // React imprime el error capturado en consola; lo silenciamos para
    // que la salida del test sea limpia.
    consoleError = console.error
    console.error = vi.fn()
  })

  afterEach(() => {
    console.error = consoleError
  })

  it('renderiza los children cuando no hay error', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={false} />
      </ErrorBoundary>,
    )
    expect(screen.getByText('vivo')).toBeTruthy()
  })

  it('captura el error y muestra el fallback con acciones', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Algo ha ido mal')).toBeTruthy()
    expect(screen.getByRole('button', { name: /Recargar/ })).toBeTruthy()
    expect(screen.getByRole('button', { name: /Volver al inicio/ })).toBeTruthy()
  })

  it('llama a window.Sentry.captureException si está presente', () => {
    const capture = vi.fn()
    ;(window as { Sentry?: unknown }).Sentry = { captureException: capture }
    try {
      render(
        <ErrorBoundary>
          <Bomb shouldThrow={true} />
        </ErrorBoundary>,
      )
      expect(capture).toHaveBeenCalledTimes(1)
      expect(capture.mock.calls[0][0]).toBeInstanceOf(Error)
    } finally {
      delete (window as { Sentry?: unknown }).Sentry
    }
  })
})
