import { describe, it, expect, beforeEach } from 'vitest'
import { loadCurrentUser, signIn, signOut, coursesAssignedTo } from './auth'

// Backend local (fallback): los tests corren sin Supabase configurado,
// así que `isSupabaseEnabled()` devuelve false y las funciones del módulo
// usan la implementación local que vive en localStorage.
describe('lib/auth — backend local', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loadCurrentUser devuelve null cuando no hay sesión', async () => {
    await expect(loadCurrentUser()).resolves.toBeNull()
  })

  it('signIn persiste el usuario y loadCurrentUser lo recupera', async () => {
    const result = await signIn('alumno@x.com', 'Alumno')
    expect(result.kind).toBe('signed-in')
    if (result.kind !== 'signed-in') throw new Error('unreachable')
    expect(result.user.email).toBe('alumno@x.com')
    expect(result.user.name).toBe('Alumno')
    expect(result.user.id).toMatch(/[a-z0-9-]/)
    expect(result.user.assignedCourses).toBeInstanceOf(Array)
    const loaded = await loadCurrentUser()
    expect(loaded).toEqual(result.user)
  })

  it('signIn usa la primera parte del email si name está vacío', async () => {
    const r = await signIn('test@example.com', '')
    if (r.kind !== 'signed-in') throw new Error('unreachable')
    expect(r.user.name).toBe('test')
  })

  it('signIn trimea email y name', async () => {
    const r = await signIn('  a@b.com  ', '  Nombre  ')
    if (r.kind !== 'signed-in') throw new Error('unreachable')
    expect(r.user.email).toBe('a@b.com')
    expect(r.user.name).toBe('Nombre')
  })

  it('signOut limpia la sesión', async () => {
    await signIn('x@y.com', 'X')
    expect(await loadCurrentUser()).not.toBeNull()
    await signOut()
    expect(await loadCurrentUser()).toBeNull()
  })

  it('coursesAssignedTo filtra el catálogo por el array assignedCourses', async () => {
    const r = await signIn('x@y.com', 'X')
    if (r.kind !== 'signed-in') throw new Error('unreachable')
    const result = coursesAssignedTo(r.user)
    expect(result).toBeInstanceOf(Array)
  })

  it('ignora storage corrupto en loadCurrentUser', async () => {
    localStorage.setItem('pv-learn-current-user', '{{not-json')
    await expect(loadCurrentUser()).resolves.toBeNull()
  })

  it('ignora user sin id o email', async () => {
    localStorage.setItem(
      'pv-learn-current-user',
      JSON.stringify({ name: 'X', createdAt: 1, assignedCourses: [] }),
    )
    await expect(loadCurrentUser()).resolves.toBeNull()
  })
})
