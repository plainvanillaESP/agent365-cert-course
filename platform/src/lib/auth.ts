/**
 * Auth de PV-Learn, con backend pluggable.
 *
 * El módulo expone un contrato único (`signIn`, `signOut`,
 * `loadCurrentUser`, `coursesAssignedTo`) y elige internamente el
 * backend según `isSupabaseEnabled()`:
 *
 *   - **Supabase**: magic link al email; sesión persistente vía
 *     `@supabase/supabase-js`; `assignedCourses` se lee de la tabla
 *     `course_enrollment` (RLS). Todas las funciones son async.
 *
 *   - **Local** (fallback): el alumno introduce email + nombre y queda
 *     "logado" como invitado. Sesión en `localStorage` bajo
 *     `pv-learn-current-user`. Todas las funciones son async para
 *     mantener firma única; resuelven sincrónicamente.
 *
 * Los componentes (`LoginPage`, `AuthContext`, `CatalogPage`,
 * `SettingsPage`) ya consumen un contrato async, así que el cambio de
 * backend es transparente para ellos.
 */

import { getSupabase, isSupabaseEnabled } from './supabase'
import { listCourses, type CourseData } from './coursesRegistry'

export interface User {
  /** Identificador único. UUID del proveedor. */
  id: string
  email: string
  name: string
  /** ms timestamp de la primera creación. */
  createdAt: number
  /**
   * Slugs de cursos asignados. En el backend local se rellena con
   * todos los cursos del registry. En Supabase se lee de la tabla
   * `course_enrollment` (filtrada por RLS).
   */
  assignedCourses: string[]
}

/* ============================================================================ */
/*                           Backend: local (fallback)                          */
/* ============================================================================ */

const CURRENT_USER_KEY = 'pv-learn-current-user'

function cryptoRandomId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

async function localLoadCurrentUser(): Promise<User | null> {
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

async function localSignIn(email: string, name: string): Promise<User> {
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
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    } catch {
      /* ignore */
    }
  }
  return user
}

async function localSignOut(): Promise<void> {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.removeItem(CURRENT_USER_KEY)
  } catch {
    /* ignore */
  }
}

/* ============================================================================ */
/*                                Backend: Supabase                             */
/* ============================================================================ */

async function supabaseLoadCurrentUser(): Promise<User | null> {
  const supabase = getSupabase()
  if (!supabase) return null
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error || !session?.user) return null
  const u = session.user
  const enrolled = await supabase
    .from('course_enrollment')
    .select('course_slug')
    .eq('user_id', u.id)
  const assignedCourses: string[] = (enrolled.data ?? []).map(
    (r: { course_slug: string }) => r.course_slug,
  )
  return {
    id: u.id,
    email: u.email ?? '',
    name:
      (u.user_metadata?.display_name as string | undefined) ??
      u.email?.split('@')[0] ??
      'Alumno',
    createdAt: u.created_at ? new Date(u.created_at).getTime() : Date.now(),
    assignedCourses,
  }
}

/**
 * En Supabase el sign-in es por magic link: NO devuelve el `User`
 * inmediatamente, sino que envía un email con un enlace que, al
 * pulsarlo, crea la sesión. El contrato del módulo trata esto como un
 * caso especial: si el backend es Supabase, la promesa resuelve y el
 * caller debe mostrar "Revisa tu email" y esperar a `loadCurrentUser`
 * tras el redirect del callback.
 *
 * Para que la firma común no haga falsas promesas, este caso se
 * comunica con `result.kind`.
 */
export type SignInResult =
  | { kind: 'signed-in'; user: User }
  | { kind: 'magic-link-sent'; email: string }

async function supabaseSignIn(email: string, name: string): Promise<SignInResult> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase no está configurado')
  const trimmedEmail = email.trim()
  const trimmedName = name.trim()
  const { error } = await supabase.auth.signInWithOtp({
    email: trimmedEmail,
    options: {
      emailRedirectTo: window.location.origin,
      data: trimmedName ? { display_name: trimmedName } : undefined,
    },
  })
  if (error) throw error
  return { kind: 'magic-link-sent', email: trimmedEmail }
}

async function supabaseSignOut(): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) return
  await supabase.auth.signOut()
}

/* ============================================================================ */
/*                            API pública (despacha)                            */
/* ============================================================================ */

export async function loadCurrentUser(): Promise<User | null> {
  if (isSupabaseEnabled()) return supabaseLoadCurrentUser()
  return localLoadCurrentUser()
}

export async function signIn(email: string, name: string): Promise<SignInResult> {
  if (isSupabaseEnabled()) return supabaseSignIn(email, name)
  const u = await localSignIn(email, name)
  return { kind: 'signed-in', user: u }
}

export async function signOut(): Promise<void> {
  if (isSupabaseEnabled()) return supabaseSignOut()
  return localSignOut()
}

/** Lista de `CourseData` de los cursos asignados al usuario. */
export function coursesAssignedTo(user: User): CourseData[] {
  const all = listCourses()
  if (user.assignedCourses.length === 0) return []
  return all.filter(c => user.assignedCourses.includes(c.slug))
}
