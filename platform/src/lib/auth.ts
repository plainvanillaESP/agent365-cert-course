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
   * todos los cursos del registry. En Supabase se lee uniendo
   * `course_enrollment`, `course_purchase` activas y
   * `organization_seat` activos (las tres fuentes que reconoce
   * `user_has_access_to_course` en SQL).
   */
  assignedCourses: string[]
  /**
   * El usuario es administrador de la plataforma (Plain Vanilla),
   * con acceso a /admin/* y todas las tablas de RLS.
   *
   *   - **Backend local**: siempre `true`. En local es tu navegador y
   *     no hay base de datos real; querer probar el panel admin es
   *     justo lo esperado.
   *   - **Backend Supabase**: `true` si el JWT incluye
   *     `app_metadata.role === 'platform_admin'`. Este claim se
   *     setea en SQL: `update auth.users set raw_app_meta_data = …`.
   */
  isPlatformAdmin: boolean
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
    const parsed = JSON.parse(raw) as Partial<User>
    if (!parsed?.id || !parsed.email) return null
    // Forward-compat con sesiones creadas antes de R.2: si la sesión
    // guardada no tiene isPlatformAdmin (campo añadido en R.2),
    // lo seteamos a true por defecto en modo local.
    return {
      id: parsed.id,
      email: parsed.email,
      name: parsed.name ?? parsed.email.split('@')[0],
      createdAt: parsed.createdAt ?? Date.now(),
      assignedCourses: parsed.assignedCourses ?? [],
      isPlatformAdmin: parsed.isPlatformAdmin ?? true,
    }
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
    // En backend local cualquier sesión tiene acceso al panel admin
    // para que se pueda probar el flujo R.2 sin Supabase.
    isPlatformAdmin: true,
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

  // Cursos accesibles: tres fuentes en paralelo (R.1).
  //   1. course_enrollment (cortesía / asignación manual del admin)
  //   2. course_purchase (compra B2C activa)
  //   3. organization_seat activo (B2B)
  // Las tres consultan en paralelo y se unen. RLS filtra por user_id.
  // En el futuro este conjunto se puede sustituir por una sola RPC a
  // la función SQL `user_has_access_to_course`, pero por ahora un OR
  // en tres tablas es legible y suficientemente eficiente (cada una
  // está indexada por user_id).
  const [enrolled, purchased, seated] = await Promise.all([
    supabase
      .from('course_enrollment')
      .select('course_slug')
      .eq('user_id', u.id),
    supabase
      .from('course_purchase')
      .select('course_slug, expires_at')
      .eq('user_id', u.id),
    supabase
      .from('organization_seat')
      .select('subscription_id, revoked_at, organization_subscription!inner(course_slug, expires_at)')
      .eq('user_id', u.id)
      .is('revoked_at', null),
  ])

  const slugs = new Set<string>()
  for (const row of enrolled.data ?? []) {
    slugs.add((row as { course_slug: string }).course_slug)
  }
  const now = Date.now()
  for (const row of purchased.data ?? []) {
    const r = row as { course_slug: string; expires_at: string | null }
    if (r.expires_at == null || new Date(r.expires_at).getTime() > now) {
      slugs.add(r.course_slug)
    }
  }
  for (const row of seated.data ?? []) {
    const r = row as {
      organization_subscription:
        | { course_slug: string; expires_at: string | null }
        | Array<{ course_slug: string; expires_at: string | null }>
        | null
    }
    // PostgREST devuelve el join como array (incluso con !inner). Si solo
    // hay una FK, normalizamos a primer elemento.
    const subRaw = r.organization_subscription
    const sub = Array.isArray(subRaw) ? subRaw[0] ?? null : subRaw
    if (sub && (sub.expires_at == null || new Date(sub.expires_at).getTime() > now)) {
      slugs.add(sub.course_slug)
    }
  }

  return {
    id: u.id,
    email: u.email ?? '',
    name:
      (u.user_metadata?.display_name as string | undefined) ??
      u.email?.split('@')[0] ??
      'Alumno',
    createdAt: u.created_at ? new Date(u.created_at).getTime() : Date.now(),
    assignedCourses: Array.from(slugs),
    // El claim `role: 'platform_admin'` se setea via SQL en auth.users
    // raw_app_meta_data. Supabase lo expone como app_metadata en el JWT
    // y cliente. Sin claim → false (alumno normal).
    isPlatformAdmin:
      (u.app_metadata as { role?: string } | undefined)?.role === 'platform_admin',
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
