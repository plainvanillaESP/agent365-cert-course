/**
 * Contrato de autenticación de PV-Learn.
 *
 * Diseñado para enchufarse a cualquier backend (Supabase, Cloudflare
 * Workers + D1, Auth.js, Magic Link propio…) cuando llegue la Fase 9.
 * Hoy ofrece una implementación local con `localStorage` que no valida
 * credenciales — el alumno introduce email + nombre y queda «logado»
 * como invitado. Suficiente para validar la UX del flujo y permitir el
 * acceso a cursos en función de un campo `courses[]` del perfil.
 *
 * Cuando llegue el backend real:
 *
 *   1. Sustituir `signIn()` por una llamada al endpoint correspondiente
 *      (`POST /auth/magic-link`, OAuth, etc.).
 *   2. Sustituir `loadCurrentUser()` por una verificación de sesión
 *      contra el backend (cookie + endpoint `/me` o JWT en memoria).
 *   3. Sustituir `signOut()` por la baja de la sesión.
 *   4. `assignedCourses(user)` pasaría a leer de la BD; por ahora
 *      devuelve la lista completa del registry, simulando que todos
 *      los alumnos tienen acceso a todos los cursos.
 *
 * Tipos exportados pensados para no romper esa migración.
 */

import { listCourses, type CourseData } from './coursesRegistry'

export interface User {
  /** Identificador único. En la versión local es un uuid generado al firmar. */
  id: string
  /** Email del alumno. No validado en la versión local. */
  email: string
  /** Nombre visible. */
  name: string
  /** ms timestamp del primer signIn. */
  createdAt: number
  /**
   * Slugs de cursos asignados al alumno. En la versión local se asigna
   * todo el catálogo por defecto; el backend filtrará por suscripción.
   */
  assignedCourses: string[]
}

const CURRENT_USER_KEY = 'pv-learn-current-user'

function cryptoRandomId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/** Lee el usuario de la sesión actual (puede ser null). */
export function loadCurrentUser(): User | null {
  if (typeof localStorage === 'undefined') return null
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as User
    if (!parsed?.id || !parsed.email) return null
    return parsed
  } catch {
    return null
  }
}

function persistUser(user: User | null): void {
  if (typeof localStorage === 'undefined') return
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(CURRENT_USER_KEY)
    }
  } catch {
    /* localStorage bloqueado, ignore */
  }
}

/**
 * Inicia sesión "como invitado". Acepta cualquier email/nombre y los
 * persiste en `localStorage`. Cuando llegue el backend, esta función
 * pasará a llamar a `POST /auth/magic-link` o similar y devolverá el
 * usuario tras validación.
 */
export function signIn(email: string, name: string): User {
  const trimmedEmail = email.trim()
  const trimmedName = name.trim() || trimmedEmail.split('@')[0]
  const courses = listCourses().map(c => c.slug)
  const user: User = {
    id: cryptoRandomId(),
    email: trimmedEmail,
    name: trimmedName,
    createdAt: Date.now(),
    assignedCourses: courses,
  }
  persistUser(user)
  return user
}

export function signOut(): void {
  persistUser(null)
}

/** Lista de `CourseData` de los cursos asignados al usuario. */
export function coursesAssignedTo(user: User): CourseData[] {
  const all = listCourses()
  if (user.assignedCourses.length === 0) return []
  return all.filter(c => user.assignedCourses.includes(c.slug))
}
