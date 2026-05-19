import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { LogIn, Mail, CheckCircle2, GraduationCap, ShieldCheck, Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/Button'
import { Callout } from '@/components/Callout'
import { Imagotipo } from '@/components/Logo'

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
 *
 * Layout: split en dos columnas en desktop, stack en mobile. La columna
 * izquierda vende la plataforma (qué es PV-Learn, qué ofrece). La
 * derecha tiene el formulario. Sin elementos del header alumno
 * (Progreso, GitHub, focus, reading) porque el header los oculta
 * automáticamente cuando no hay sesión.
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
      <div className="min-h-[calc(100dvh-var(--layout-header-h))] flex items-center justify-center">
        <p className="text-[var(--text-muted)] text-sm">Comprobando sesión…</p>
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
      <div className="min-h-[calc(100dvh-var(--layout-header-h))] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          <div className="size-16 mx-auto rounded-2xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-5">
            <CheckCircle2 className="size-8 stroke-[1.75]" aria-hidden />
          </div>
          <h1 className="text-[26px] font-semibold text-[var(--text-primary)] mb-3 tracking-tight">
            Revisa tu email
          </h1>
          <p className="text-[15px] text-[var(--text-secondary)] mb-2">
            Hemos enviado un enlace de acceso a{' '}
            <strong className="text-[var(--text-primary)]">{magicLinkSent}</strong>.
          </p>
          <p className="text-[13.5px] text-[var(--text-muted)] mb-8 leading-relaxed">
            Pulsa el enlace en el mensaje y se abrirá tu sesión automáticamente. Puedes cerrar
            esta pestaña si quieres.
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
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100dvh-var(--layout-header-h))] flex items-stretch">
      {/* ───────────── Columna izquierda: branding y valor ───────────── */}
      <aside
        className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center px-12 py-16"
        aria-hidden
      >
        {/* Gradiente de fondo con la paleta brand de Plain Vanilla. */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'linear-gradient(135deg, rgba(154, 68, 229, 0.95) 0%, rgba(189, 100, 220, 0.92) 45%, rgba(246, 141, 172, 0.92) 100%)',
          }}
        />
        {/* Puntos decorativos suaves. */}
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.25) 0%, transparent 35%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.18) 0%, transparent 40%)',
          }}
        />

        <div className="max-w-md text-white">
          {/* Imagotipo en blanco (negative=true) porque el panel tiene un
              gradiente púrpura→rosa de fondo y la versión con gradiente
              brand se confunde con él. La versión sólida blanca contrasta
              limpiamente sobre el color. */}
          <Imagotipo className="size-10 mb-8" negative />

          <h2 className="text-[36px] font-bold leading-[1.1] tracking-tight mb-5">
            Aprende. Certifícate. Avanza.
          </h2>
          <p className="text-[16px] leading-relaxed text-white/90 mb-10">
            La plataforma de formación profesional de Plain Vanilla para Microsoft 365,
            seguridad y agentes de IA. Cursos producidos por expertos, con certificación
            reconocida.
          </p>

          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="size-9 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
                <GraduationCap className="size-[18px] stroke-[1.75]" aria-hidden />
              </span>
              <div>
                <p className="font-semibold text-[14.5px] leading-tight mb-1">
                  Contenido producido por especialistas
                </p>
                <p className="text-[13.5px] text-white/80 leading-snug">
                  Diseñado y revisado por consultores que viven los productos a diario.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="size-9 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
                <ShieldCheck className="size-[18px] stroke-[1.75]" aria-hidden />
              </span>
              <div>
                <p className="font-semibold text-[14.5px] leading-tight mb-1">
                  Certificación verificable
                </p>
                <p className="text-[13.5px] text-white/80 leading-snug">
                  Cada certificado lleva una URL pública para compartir con clientes o
                  empleadores.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="size-9 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Sparkles className="size-[18px] stroke-[1.75]" aria-hidden />
              </span>
              <div>
                <p className="font-semibold text-[14.5px] leading-tight mb-1">
                  Aprendizaje activo
                </p>
                <p className="text-[13.5px] text-white/80 leading-snug">
                  Laboratorios interactivos, notas del alumno, flashcards y repaso espaciado.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </aside>

      {/* ───────────── Columna derecha: formulario ───────────── */}
      <section className="flex-1 flex items-center justify-center px-6 sm:px-10 py-12 lg:py-0">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-[28px] font-semibold text-[var(--text-primary)] tracking-tight leading-tight mb-2">
              Entrar a PV-Learn
            </h1>
            <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
              {backendKind === 'supabase'
                ? 'Introduce tu email y te enviaremos un enlace de acceso. Sin contraseñas.'
                : 'Identifícate con tu email para acceder a tus cursos.'}
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
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
                className="w-full px-3 py-2.5 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-pv-purple-500)] focus:border-[var(--color-pv-purple-500)] disabled:opacity-50 transition-shadow"
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
                  Nombre{' '}
                  <span className="text-[var(--text-muted)] font-normal">(opcional)</span>
                </label>
                <input
                  id="login-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Cómo quieres que te llamemos"
                  disabled={sending}
                  className="w-full px-3 py-2.5 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-pv-purple-500)] focus:border-[var(--color-pv-purple-500)] disabled:opacity-50 transition-shadow"
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
            <p className="mt-6 text-[12px] text-[var(--text-muted)] leading-relaxed">
              <strong className="font-semibold text-[var(--text-secondary)]">
                Versión actual:
              </strong>{' '}
              el sign-in es local. El email y el nombre solo viven en este navegador. Cuando
              se active el backend real, tu progreso se sincronizará entre dispositivos.
            </p>
          )}

          <p className="mt-10 pt-6 border-t border-[var(--border-subtle)] text-[12px] text-[var(--text-muted)] text-center">
            ¿Tu empresa ha contratado un curso para ti?{' '}
            <a
              href="mailto:hola@plainvanilla.ai"
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline-offset-2 hover:underline transition-colors"
            >
              Escríbenos
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}
