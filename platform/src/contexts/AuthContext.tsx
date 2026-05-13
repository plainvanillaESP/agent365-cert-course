import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import {
  loadCurrentUser,
  signIn as authSignIn,
  signOut as authSignOut,
  type User,
} from '@/lib/auth'

/**
 * Context de autenticación a nivel de plataforma.
 *
 * Hoy es una capa fina sobre `lib/auth.ts` (que persiste en localStorage
 * sin validar nada). Cuando llegue el backend real (Fase 9), solo cambia
 * la implementación de `lib/auth.ts`; el contrato de este context se
 * mantiene y los componentes consumidores siguen funcionando.
 *
 * Componentes que necesitan el usuario actual usan `useAuth()`. El
 * provider se monta una vez al inicio de la app, por encima del router.
 */

interface AuthContextValue {
  user: User | null
  signIn: (email: string, name: string) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadCurrentUser())

  const signIn = useCallback((email: string, name: string) => {
    const u = authSignIn(email, name)
    setUser(u)
  }, [])

  const signOut = useCallback(() => {
    authSignOut()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth() debe llamarse dentro de un <AuthProvider>')
  }
  return ctx
}
