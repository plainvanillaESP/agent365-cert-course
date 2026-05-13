import { describe, it, expect } from 'vitest'
import {
  createCard,
  review,
  isDue,
  humanizeInterval,
  DEFAULT_EASE,
  MIN_EASE,
} from './srs'

describe('lib/srs — SM-2', () => {
  describe('createCard', () => {
    it('crea una card vencida ya mismo con parámetros iniciales', () => {
      const now = 1_700_000_000_000
      const c = createCard('q1', now)
      expect(c.cardId).toBe('q1')
      expect(c.repetitions).toBe(0)
      expect(c.easeFactor).toBe(DEFAULT_EASE)
      expect(c.interval).toBe(0)
      expect(c.dueAt).toBe(now)
      expect(c.lastReviewedAt).toBeNull()
    })
  })

  describe('review', () => {
    const NOW = 1_700_000_000_000
    const DAY = 24 * 60 * 60 * 1000

    it('quality < 3 resetea repetitions y pone interval=1 día', () => {
      const c = createCard('q', NOW)
      const reviewed = review({ ...c, repetitions: 3, easeFactor: 2.5, interval: 10 }, 0, NOW)
      expect(reviewed.repetitions).toBe(0)
      expect(reviewed.interval).toBe(1)
      expect(reviewed.dueAt).toBe(NOW + DAY)
      expect(reviewed.lastReviewedAt).toBe(NOW)
    })

    it('quality 3 (Hard) tras 0 reps → reps=1, interval=1', () => {
      const c = createCard('q', NOW)
      const r = review(c, 3, NOW)
      expect(r.repetitions).toBe(1)
      expect(r.interval).toBe(1)
    })

    it('quality 4 (Good) tras 1 rep → reps=2, interval=6', () => {
      const c = { ...createCard('q', NOW), repetitions: 1, interval: 1 }
      const r = review(c, 4, NOW)
      expect(r.repetitions).toBe(2)
      expect(r.interval).toBe(6)
    })

    it('quality 5 (Easy) tras 2 reps → reps=3, interval=round(prev*ease_pre)', () => {
      // SM-2: el interval se calcula con el easeFactor PREVIO al review,
      // y después se ajusta el easeFactor. La fórmula aplicada aquí es
      // `round(6 * 2.5) = 15`, no `round(6 * easeFactor_new)`.
      const c = { ...createCard('q', NOW), repetitions: 2, interval: 6, easeFactor: 2.5 }
      const r = review(c, 5, NOW)
      expect(r.repetitions).toBe(3)
      expect(r.interval).toBe(Math.round(6 * 2.5))
      // El nuevo easeFactor sí queda subido tras quality 5.
      expect(r.easeFactor).toBeGreaterThan(2.5)
    })

    it('easeFactor sube con quality=5 y baja con quality=3', () => {
      const c = createCard('q', NOW)
      expect(review(c, 5, NOW).easeFactor).toBeGreaterThan(c.easeFactor)
      expect(review(c, 3, NOW).easeFactor).toBeLessThan(c.easeFactor)
    })

    it('easeFactor se satura a MIN_EASE tras muchas malas', () => {
      let c = createCard('q', NOW)
      for (let i = 0; i < 30; i++) c = review(c, 0, NOW)
      expect(c.easeFactor).toBeGreaterThanOrEqual(MIN_EASE)
      expect(c.easeFactor).toBeCloseTo(MIN_EASE, 5)
    })

    it('dueAt avanza interval * DAY_MS', () => {
      const c = createCard('q', NOW)
      const r = review(c, 4, NOW) // interval=1
      expect(r.dueAt - NOW).toBe(DAY)
    })
  })

  describe('isDue', () => {
    it('true cuando dueAt <= now', () => {
      const c = { ...createCard('q', 1000), dueAt: 1000 }
      expect(isDue(c, 1000)).toBe(true)
      expect(isDue(c, 2000)).toBe(true)
    })
    it('false cuando dueAt > now', () => {
      const c = { ...createCard('q', 1000), dueAt: 2000 }
      expect(isDue(c, 1000)).toBe(false)
    })
  })

  describe('humanizeInterval', () => {
    it('formatea < 1 día como "hoy"', () => {
      expect(humanizeInterval(0)).toBe('hoy')
    })
    it('formatea 1 día singular', () => {
      expect(humanizeInterval(1)).toBe('1 día')
    })
    it('formatea N días < 30', () => {
      expect(humanizeInterval(7)).toBe('7 días')
    })
    it('formatea meses para 30-364', () => {
      expect(humanizeInterval(60)).toBe('2 meses')
      expect(humanizeInterval(30)).toBe('1 mes')
    })
    it('formatea años para >= 365', () => {
      expect(humanizeInterval(365)).toBe('1 año')
      expect(humanizeInterval(800)).toBe('2 años')
    })
  })
})
