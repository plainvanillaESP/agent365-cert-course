import { describe, it, expect, beforeEach } from 'vitest'
import { getSupabase, isSupabaseEnabled, _resetSupabaseClientForTests } from './supabase'

describe('lib/supabase', () => {
  beforeEach(() => {
    _resetSupabaseClientForTests()
  })

  it('isSupabaseEnabled() devuelve false sin env vars', () => {
    // En el entorno de tests no hay VITE_SUPABASE_URL ni VITE_SUPABASE_ANON_KEY.
    expect(isSupabaseEnabled()).toBe(false)
  })

  it('getSupabase() devuelve null sin env vars', () => {
    expect(getSupabase()).toBeNull()
  })

  it('_resetSupabaseClientForTests permite re-lectura del env entre tests', () => {
    // Primera llamada cachea null.
    expect(getSupabase()).toBeNull()
    // Tras reset, la próxima llamada vuelve a leer env.
    _resetSupabaseClientForTests()
    expect(getSupabase()).toBeNull()
  })
})
