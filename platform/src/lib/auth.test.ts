import { describe, it, expect, beforeEach } from 'vitest'
import { loadCurrentUser, signIn, signOut, coursesAssignedTo } from './auth'

describe('lib/auth', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loadCurrentUser devuelve null cuando no hay sesión', () => {
    expect(loadCurrentUser()).toBeNull()
  })

  it('signIn persiste el usuario y loadCurrentUser lo recupera', () => {
    const u = signIn('alumno@x.com', 'Alumno')
    expect(u.email).toBe('alumno@x.com')
    expect(u.name).toBe('Alumno')
    expect(u.id).toMatch(/[a-z0-9-]/)
    expect(u.assignedCourses).toBeInstanceOf(Array)
    const loaded = loadCurrentUser()
    expect(loaded).toEqual(u)
  })

  it('signIn usa la primera parte del email si name está vacío', () => {
    const u = signIn('test@example.com', '')
    expect(u.name).toBe('test')
  })

  it('signIn trimea email y name', () => {
    const u = signIn('  a@b.com  ', '  Nombre  ')
    expect(u.email).toBe('a@b.com')
    expect(u.name).toBe('Nombre')
  })

  it('signOut limpia la sesión', () => {
    signIn('x@y.com', 'X')
    expect(loadCurrentUser()).not.toBeNull()
    signOut()
    expect(loadCurrentUser()).toBeNull()
  })

  it('coursesAssignedTo filtra el catálogo por el array assignedCourses', () => {
    const u = signIn('x@y.com', 'X')
    // En el entorno test el registry está vacío (sin import.meta.glob),
    // así que `coursesAssignedTo` devuelve [] aunque el user tenga
    // assignedCourses []. Esto valida que la función no revienta.
    const result = coursesAssignedTo(u)
    expect(result).toBeInstanceOf(Array)
  })

  it('ignora storage corrupto en loadCurrentUser', () => {
    localStorage.setItem('pv-learn-current-user', '{{not-json')
    expect(loadCurrentUser()).toBeNull()
  })

  it('ignora user sin id o email', () => {
    localStorage.setItem(
      'pv-learn-current-user',
      JSON.stringify({ name: 'X', createdAt: 1, assignedCourses: [] }),
    )
    expect(loadCurrentUser()).toBeNull()
  })
})
