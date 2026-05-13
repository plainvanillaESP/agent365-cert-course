import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import {
  loadCurrentUser,
  signIn as authSignIn,
  signOut as authSignOut,
  type SignInResult,
  type User,
} from '@/lib/auth'
import { getSupabase, isSupabaseEnabled } from '@/lib/supabase'

/**
 * Context de autenticación a nivel de plataforma.
 *
 * `loadCurrentUser()` es async (Supabase consulta API; local es síncrono
 * envuelto en Promise). Mantenemos un estado `status` con tres valores
 * para que los consumidores puedan distinguir:
 *
 *   - `loading`: estamos comprobando si hay sesión. Mostrar spinner.
 *   - `authenticated`: hay usuario; renderiza la app.
 *   - `unauthenticated`: no hay sesión; muestra LoginPage.
 *
 * Si Supabase está activo, suscribimos al `onAuthStateChange` para
 * recargar el usuario tras callbacks de magic link o sign-out desde
 * otra pestaña.
 */

type Status = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthContextValue {
  user: User | null
  status: Status
  /** Inicia sesión (local o Supabase). Devuelve el resultado para que
   *  LoginPage pueda mostrar "Revisa tu email" si es magic link. */
  signIn: (email: string, name: string) => Promise<SignInResult>
  signOut: () => Promise<void>
  /** Indica si el backend actual es Supabase (UX condicional). */
  backendKind: 'local' | 'supabase'
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const backendKind: 'local' | 'supabase' = isSupabaseEnabled() ? 'supabase' : 'local'

  // Carga inicial: comprueba si hay sesión activa.
  useEffect(() => {
    let cancelled = false
    loadCurrentUser()
      .then(u => {
        if (cancelled) return
        setUser(u)
        setStatus(u ? 'authenticated' : 'unauthenticated')
      })
      .catch(() => {
        if (cancelled) return
        setUser(null)
        setStatus('unauthenticated')
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Si Supabase está activo, escucha cambios de auth para reaccionar a
  // callbacks de magic link y sign-out cross-tab.
  useEffect(() => {
    if (backendKind !== 'supabase') return
    const supabase = getSupabase()
    if (!supabase) return
    const { data } = supabase.auth.onAuthStateChange(async () => {
      const u = await loadCurrentUser()
      setUser(u)
      setStatus(u ? 'authenticated' : 'unauthenticated')
    })
    return () => {
      data.subscription.unsubscribe()
    }
  }, [backendKind])

  const signIn = useCallback(async (email: string, name: string): Promise<SignInResult> => {
    const result = await authSignIn(email, name)
    if (result.kind === 'signed-in') {
      setUser(result.user)
      setStatus('authenticated')
    }
    // En 'magic-link-sent' el estado se actualizará via onAuthStateChange
    // cuando el alumno pulse el enlace y vuelva al sitio.
    return result
  }, [])

  const signOut = useCallback(async () => {
    await authSignOut()
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  return (
    <AuthContext.Provider value={{ user, status, signIn, signOut, backendKind }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth() debe llamarse dentro de un <AuthProvider>')
  return ctx
}
