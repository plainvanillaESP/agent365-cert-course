import { describe, it, expect, beforeEach } from 'vitest'
import {
  setActiveCourseSlug,
  activeCourseSlug,
  courseStorageKey,
  globalStorageKey,
} from './storage'

describe('lib/storage', () => {
  beforeEach(() => {
    // El módulo mantiene un slug activo entre tests; reseteamos a un
    // valor conocido para que cada test sea independiente.
    setActiveCourseSlug('agent365-cert')
  })

  it('courseStorageKey usa prefix pv-learn-{slug}-', () => {
    expect(courseStorageKey('agent365-cert', 'notes-m9')).toBe(
      'pv-learn-agent365-cert-notes-m9',
    )
    expect(courseStorageKey('demo-pv-learn', 'exam-history')).toBe(
      'pv-learn-demo-pv-learn-exam-history',
    )
  })

  it('globalStorageKey usa prefix pv-learn-', () => {
    expect(globalStorageKey('reading-mode')).toBe('pv-learn-reading-mode')
    expect(globalStorageKey('focus-pomodoros-total')).toBe('pv-learn-focus-pomodoros-total')
  })

  it('setActiveCourseSlug actualiza activeCourseSlug()', () => {
    setActiveCourseSlug('curso-x')
    expect(activeCourseSlug()).toBe('curso-x')
  })

  it('no hay colisión entre courseStorageKey con dos slugs distintos', () => {
    const a = courseStorageKey('curso-a', 'notes-m1')
    const b = courseStorageKey('curso-b', 'notes-m1')
    expect(a).not.toBe(b)
  })
})
