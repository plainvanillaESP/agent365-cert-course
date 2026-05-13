import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { LogIn, Info } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { Callout } from '@/components/Callout'

interface LocationState {
  from?: string
}

/**
 * Página de entrada al alumno. En la versión actual (sin backend) actúa
 * como un sign-in local: el alumno introduce email + nombre y queda
 * "logado" como invitado. Estos campos se persisten en `localStorage`
 * y todos los hooks de auth los leen como si fuera una sesión real.
 *
 * Cuando llegue el backend (Fase 9), basta con sustituir el formulario
 * por un input de email + envío de magic link. El resto del flujo del
 * shell ya está preparado (CatalogPage, redirección desde rutas
 * protegidas, etc.).
 */
export function LoginPage() {
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')

  const from = (location.state as LocationState | null)?.from ?? '/'

  // Ya hay sesión activa: redirigir a donde quería ir el alumno.
  if (user) return <Navigate to={from} replace />

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    signIn(email, name)
    navigate(from, { replace: true })
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <PageHeader
        eyebrow="Plain Vanilla · PV-Learn"
        title="Entrar"
        description="Identifícate para acceder a tus cursos. Tu progreso queda asociado a este email."
      />

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-[12.5px] font-medium text-[var(--text-secondary)] mb-1.5">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="alumno@ejemplo.com"
            className="w-full px-3 py-2.5 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-pv-purple-500)] focus:border-[var(--color-pv-purple-500)]"
          />
        </div>

        <div>
          <label htmlFor="login-name" className="block text-[12.5px] font-medium text-[var(--text-secondary)] mb-1.5">
            Nombre <span className="text-[var(--text-muted)] font-normal">(opcional)</span>
          </label>
          <input
            id="login-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Cómo quieres que te llamemos"
            className="w-full px-3 py-2.5 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-pv-purple-500)] focus:border-[var(--color-pv-purple-500)]"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          iconLeft={<LogIn className="size-[16px] stroke-[2]" aria-hidden />}
          disabled={!email.trim()}
        >
          Entrar
        </Button>
      </form>

      <Callout kind="info" className="mt-6">
        <p className="text-[12.5px] m-0">
          <Info className="inline size-[12px] mr-1 -translate-y-px" aria-hidden />
          <strong className="font-semibold">Versión actual:</strong> el sign-in es local. No se envía ningún dato a un servidor; el email y el nombre solo viven en este navegador. Cuando llegue la autenticación real, mantendrás progreso entre dispositivos sincronizando con tu cuenta.
        </p>
      </Callout>
    </div>
  )
}
