import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle2, XCircle, ShieldCheck, ExternalLink } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Callout } from '@/components/Callout'
import { getSupabase, isSupabaseEnabled } from '@/lib/supabase'

/**
 * Endpoint público de verificación de certificados.
 *
 *   Ruta: `/cert/:verificationId`
 *
 * Cualquier visitante (incluso sin sesión) puede entrar a esta URL y
 * comprobar que el certificado es legítimo. La policy de RLS en
 * `exam_attempt` (ver `supabase/schema.sql`) permite SELECT anónimo
 * por `verification_id`, así que un partner o reclutador puede
 * verificar la veracidad del título sin acceso al curso.
 *
 * Si Supabase no está configurado, la página avisa de que la
 * verificación pública no está disponible. Los certificados emitidos
 * en modo local existen solo en el navegador que los produjo y NO son
 * verificables externamente — ese es el caso del despliegue actual.
 */

interface VerifiedAttempt {
  course_slug: string
  submitted_at: string
  score: number
  total: number
  pct: number
  passed: boolean
  verification_id: string
  metadata: { learner_name?: string; course_title?: string; cert_title?: string } | null
}

type Status =
  | { kind: 'loading' }
  | { kind: 'ok'; attempt: VerifiedAttempt }
  | { kind: 'not-found' }
  | { kind: 'disabled' }
  | { kind: 'error'; message: string }

export function VerifyPage() {
  const { verificationId } = useParams<{ verificationId: string }>()
  const [status, setStatus] = useState<Status>({ kind: 'loading' })

  useEffect(() => {
    if (!verificationId) {
      setStatus({ kind: 'not-found' })
      return
    }
    if (!isSupabaseEnabled()) {
      setStatus({ kind: 'disabled' })
      return
    }
    const supabase = getSupabase()
    if (!supabase) {
      setStatus({ kind: 'disabled' })
      return
    }

    let cancelled = false
    void supabase
      .from('exam_attempt')
      .select(
        'course_slug, submitted_at, score, total, pct, passed, verification_id, metadata',
      )
      .eq('verification_id', verificationId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          setStatus({ kind: 'error', message: error.message })
          return
        }
        if (!data) {
          setStatus({ kind: 'not-found' })
          return
        }
        setStatus({ kind: 'ok', attempt: data as VerifiedAttempt })
      })

    return () => {
      cancelled = true
    }
  }, [verificationId])

  if (status.kind === 'loading') {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center text-[var(--text-muted)]">
        Comprobando certificado…
      </div>
    )
  }

  if (status.kind === 'disabled') {
    return (
      <div className="max-w-2xl mx-auto py-12 space-y-4">
        <PageHeader
          eyebrow="Verificación pública"
          title="Verificación no disponible"
          description="Esta instancia de PV-Learn no tiene el backend conectado, así que los certificados emitidos viven solo en el navegador del alumno."
        />
        <Callout kind="info">
          <p className="text-[13px] m-0">
            Si eres el administrador del despliegue, configura
            <code className="mx-1 text-[12px]">VITE_SUPABASE_URL</code> y
            <code className="mx-1 text-[12px]">VITE_SUPABASE_ANON_KEY</code> en el entorno
            (ver <code className="text-[12px]">supabase/README.md</code>) y reinicia el deploy.
            La verificación pública pasa a estar disponible automáticamente.
          </p>
        </Callout>
      </div>
    )
  }

  if (status.kind === 'not-found') {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-3">
        <div className="size-14 mx-auto rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center">
          <XCircle className="size-7 stroke-[1.75]" aria-hidden />
        </div>
        <h1 className="text-[22px] font-semibold text-[var(--text-primary)]">
          Certificado no encontrado
        </h1>
        <p className="text-[14px] text-[var(--text-secondary)]">
          El identificador <code className="font-mono text-[13px]">{verificationId}</code> no
          corresponde a ningún certificado emitido. Comprueba que la URL es correcta.
        </p>
        <Link to="/" className="inline-block text-[13.5px] text-[var(--text-active)] hover:underline">
          Volver al inicio
        </Link>
      </div>
    )
  }

  if (status.kind === 'error') {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Callout kind="warning">
          <p className="text-[13px] m-0">No se pudo verificar el certificado: {status.message}</p>
        </Callout>
      </div>
    )
  }

  const attempt = status.attempt
  const learner = attempt.metadata?.learner_name ?? 'Alumno verificado'
  const certTitle =
    attempt.metadata?.cert_title ?? attempt.metadata?.course_title ?? attempt.course_slug

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-6">
      <PageHeader
        eyebrow="Verificación pública"
        title={attempt.passed ? 'Certificado verificado' : 'Intento no aprobado'}
        description={
          attempt.passed
            ? 'Este certificado es legítimo y fue emitido por la plataforma PV-Learn.'
            : 'El intento se realizó pero no superó el umbral de aprobación.'
        }
      />

      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 space-y-4">
        <div className="flex items-center gap-3">
          {attempt.passed ? (
            <ShieldCheck
              className="size-10 text-emerald-700 dark:text-emerald-300 stroke-[1.5]"
              aria-hidden
            />
          ) : (
            <XCircle
              className="size-10 text-amber-700 dark:text-amber-300 stroke-[1.5]"
              aria-hidden
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="text-[10.5px] uppercase tracking-[0.08em] text-[var(--text-muted)] font-semibold">
              Alumno
            </div>
            <div className="text-[17px] font-semibold text-[var(--text-primary)] truncate">
              {learner}
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[var(--border-subtle)] text-[13px]">
          <Pair label="Curso" value={certTitle} />
          <Pair label="Fecha" value={new Date(attempt.submitted_at).toLocaleDateString('es-ES')} />
          <Pair label="Puntuación" value={`${attempt.score} / ${attempt.total} (${attempt.pct}%)`} />
          <Pair label="Estado" value={attempt.passed ? <strong className="text-emerald-700 dark:text-emerald-300">Aprobado</strong> : 'No aprobado'} />
          <Pair
            label="ID de verificación"
            value={<code className="font-mono text-[12px]">{attempt.verification_id}</code>}
            full
          />
        </dl>
      </div>

      <p className="text-[12px] text-[var(--text-muted)] flex items-center gap-1">
        <CheckCircle2 className="size-[14px] text-emerald-700 dark:text-emerald-300" aria-hidden />
        Esta página se sirve directamente desde el backend de PV-Learn — no necesita confianza
        en el alumno ni en intermediarios.
        <Link to="/" className="ml-1 inline-flex items-center gap-1 text-[var(--text-active)] hover:underline">
          Ir a PV-Learn
          <ExternalLink className="size-[11px]" aria-hidden />
        </Link>
      </p>
    </div>
  )
}

function Pair({ label, value, full }: { label: string; value: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <dt className="text-[10.5px] uppercase tracking-[0.08em] text-[var(--text-muted)] font-semibold mb-1">
        {label}
      </dt>
      <dd className="text-[13.5px] text-[var(--text-primary)] m-0">{value}</dd>
    </div>
  )
}
