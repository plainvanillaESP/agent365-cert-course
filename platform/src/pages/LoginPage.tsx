import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { LogIn, Info, Mail, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { Callout } from '@/components/Callout'

interface LocationState {
  from?: string
}

/**
 * Página de entrada al alumno.
 *
 *   - **Backend local**: el sign-in es local. El alumno introduce email
 *     + nombre y queda "logado" como invitado.
 *
 *   - **Backend Supabase**: el sign-in envía un magic link al email.
 *     La página pasa a un estado "sent" que indica al alumno que revise
 *     su email. Cuando pulse el enlace y vuelva, el `onAuthStateChange`
 *     de AuthContext detecta la sesión y la app se hidrata.
 */
export function LoginPage() {
  const { user, status, signIn, backendKind } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [sending, setSending] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const from = (location.state as LocationState | null)?.from ?? '/'

  if (status === 'loading') {
    return (
      <div className="max-w-md mx-auto py-12 text-center text-[var(--text-muted)]">
        Comprobando sesión…
      </div>
    )
  }

  if (user) return <Navigate to={from} replace />

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || sending) return
    setError(null)
    setSending(true)
    try {
      const result = await signIn(email, name)
      if (result.kind === 'signed-in') {
        navigate(from, { replace: true })
      } else {
        setMagicLinkSent(result.email)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión')
    } finally {
      setSending(false)
    }
  }

  // Estado tras enviar magic link.
  if (magicLinkSent) {
    return (
      <div className="max-w-md mx-auto py-12 text-center">
        <div className="size-14 mx-auto rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-4">
          <CheckCircle2 className="size-7 stroke-[1.75]" aria-hidden />
        </div>
        <h1 className="text-[22px] font-semibold text-[var(--text-primary)] mb-2">
          Revisa tu email
        </h1>
        <p className="text-[14px] text-[var(--text-secondary)] mb-2">
          Hemos enviado un enlace de acceso a <strong>{magicLinkSent}</strong>.
        </p>
        <p className="text-[13px] text-[var(--text-muted)] mb-6">
          Pulsa el enlace en el mensaje y se abrirá tu sesión automáticamente.
          Puedes cerrar esta pestaña si quieres.
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setMagicLinkSent(null)
            setEmail('')
            setName('')
          }}
        >
          Usar otra dirección
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <PageHeader
        eyebrow="Plain Vanilla · PV-Learn"
        title="Entrar"
        description={
          backendKind === 'supabase'
            ? 'Introduce tu email y te enviaremos un enlace para acceder, sin contraseña.'
            : 'Identifícate para acceder a tus cursos. Tu progreso queda asociado a este email.'
        }
      />

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label
            htmlFor="login-email"
            className="block text-[12.5px] font-medium text-[var(--text-secondary)] mb-1.5"
          >
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
            disabled={sending}
            className="w-full px-3 py-2.5 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-pv-purple-500)] focus:border-[var(--color-pv-purple-500)] disabled:opacity-50"
          />
        </div>

        {/* Campo nombre solo en backend local. En Supabase el nombre lo
            mantiene el usuario en su perfil. */}
        {backendKind === 'local' && (
          <div>
            <label
              htmlFor="login-name"
              className="block text-[12.5px] font-medium text-[var(--text-secondary)] mb-1.5"
            >
              Nombre <span className="text-[var(--text-muted)] font-normal">(opcional)</span>
            </label>
            <input
              id="login-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Cómo quieres que te llamemos"
              disabled={sending}
              className="w-full px-3 py-2.5 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-pv-purple-500)] focus:border-[var(--color-pv-purple-500)] disabled:opacity-50"
            />
          </div>
        )}

        {error && (
          <Callout kind="warning">
            <p className="text-[13px] m-0">{error}</p>
          </Callout>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={!email.trim() || sending}
          iconLeft={
            backendKind === 'supabase' ? (
              <Mail className="size-[16px] stroke-[2]" aria-hidden />
            ) : (
              <LogIn className="size-[16px] stroke-[2]" aria-hidden />
            )
          }
        >
          {sending
            ? 'Enviando…'
            : backendKind === 'supabase'
              ? 'Enviarme un enlace'
              : 'Entrar'}
        </Button>
      </form>

      {backendKind === 'local' && (
        <Callout kind="info" className="mt-6">
          <p className="text-[12.5px] m-0">
            <Info className="inline size-[12px] mr-1 -translate-y-px" aria-hidden />
            <strong className="font-semibold">Versión actual:</strong> el sign-in es local.
            No se envía ningún dato a un servidor; el email y el nombre solo viven en este navegador.
            Cuando se active el backend real, mantendrás progreso entre dispositivos sincronizando con tu cuenta.
          </p>
        </Callout>
      )}
    </div>
  )
}
