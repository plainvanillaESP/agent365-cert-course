import { describe, it, expect, vi } from 'vitest'

// Stub la librería canvas-confetti porque depende de Canvas2D, que
// happy-dom no implementa. El test verifica que el wrapper:
//   1. No revienta cuando lo invocas.
//   2. Respeta prefers-reduced-motion saltándose la animación.
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}))

import { celebrate, celebrateBig } from './confetti'

describe('lib/confetti', () => {
  it('celebrate() resuelve a void sin lanzar', async () => {
    await expect(celebrate()).resolves.toBeUndefined()
  })

  it('celebrateBig() resuelve a void sin lanzar', async () => {
    await expect(celebrateBig()).resolves.toBeUndefined()
  })

  it('respeta prefers-reduced-motion = reduce (no-op silencioso)', async () => {
    const matchMedia = window.matchMedia
    window.matchMedia = (q: string) => ({
      matches: q.includes('reduce'),
      media: q,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })
    try {
      await expect(celebrate()).resolves.toBeUndefined()
    } finally {
      window.matchMedia = matchMedia
    }
  })
})
