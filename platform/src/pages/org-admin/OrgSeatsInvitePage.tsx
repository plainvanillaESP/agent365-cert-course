import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { ChevronLeft, Send, AlertCircle, Check } from 'lucide-react'
import {
  listSubscriptionsForOrganization,
  listSeatsForOrganization,
  assignEmailsToOrganization,
  type AssignEmailsResult,
} from '@/lib/admin'
import type { OrganizationSubscription } from '@/lib/billing'
import { listCourses } from '@/lib/coursesRegistry'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { Callout } from '@/components/Callout'
import { useToast } from '@/contexts/ToastContext'
import type { OrgContextValue } from '@/components/OrgAdminLayout'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function OrgSeatsInvitePage() {
  const ctx = useOutletContext<OrgContextValue>()
  const navigate = useNavigate()
  const toast = useToast()

  const [subs, setSubs] = useState<OrganizationSubscription[]>([])
  const [loadingSubs, setLoadingSubs] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AssignEmailsResult | null>(null)

  const [courseSlug, setCourseSlug] = useState('')
  const [emailsRaw, setEmailsRaw] = useState('')
  const [vacantBySub, setVacantBySub] = useState<Map<string, number>>(new Map())
  const [submitting, setSubmitting] = useState(false)

  // Cargar subs y seats vacantes
  useEffect(() => {
    let canceled = false
    Promise.all([
      listSubscriptionsForOrganization(ctx.organizationId),
      listSeatsForOrganization(ctx.organizationId),
    ])
      .then(([s, seats]) => {
        if (canceled) return
        setSubs(s)
        // Auto-seleccionar el curso si solo hay uno
        if (s.length === 1) setCourseSlug(s[0].courseSlug)
        // Contar vacantes por curso
        const m = new Map<string, number>()
        for (const sub of s) m.set(sub.courseSlug, 0)
        for (const seat of seats) {
          if (seat.revokedAt != null) continue
          if (seat.assignedEmail != null) continue
          const sub = s.find(x => x.id === seat.subscriptionId)
          if (!sub) continue
          m.set(sub.courseSlug, (m.get(sub.courseSlug) ?? 0) + 1)
        }
        setVacantBySub(m)
      })
      .catch(e => {
        if (!canceled) setError(e instanceof Error ? e.message : String(e))
      })
      .finally(() => {
        if (!canceled) setLoadingSubs(false)
      })
    return () => {
      canceled = true
    }
  }, [ctx.organizationId])

  // Parsear y validar emails
  const parsedEmails = Array.from(
    new Set(
      emailsRaw
        .split(/[\s,;]+/)
        .map(e => e.trim().toLowerCase())
        .filter(Boolean),
    ),
  )
  const validEmails = parsedEmails.filter(e => EMAIL_REGEX.test(e))
  const invalidEmails = parsedEmails.filter(e => !EMAIL_REGEX.test(e))
  const vacantForCourse = courseSlug ? (vacantBySub.get(courseSlug) ?? 0) : 0
  const canSubmit =
    courseSlug && validEmails.length > 0 && validEmails.length <= vacantForCourse

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!canSubmit || submitting) return
    setSubmitting(true)
    setError(null)
    setResult(null)
    try {
      const res = await assignEmailsToOrganization({
        organizationId: ctx.organizationId,
        courseSlug,
        emails: validEmails,
      })
      setResult(res)
      if (res.invited.length > 0) {
        toast.show({
          kind: 'success',
          message: `${res.invited.length} ${res.invited.length === 1 ? 'invitación enviada' : 'invitaciones enviadas'}`,
        })
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'No se pudieron invitar los emails'
      setError(msg)
      toast.show({ kind: 'error', message: msg })
    } finally {
      setSubmitting(false)
    }
  }

  // Pantalla post-invitación
  if (result) {
    return (
      <div className="max-w-2xl">
        <PageHeader
          eyebrow={ctx.organizationName}
          title="Invitaciones enviadas"
          description={
            result.invited.length > 0
              ? `Hemos enviado un enlace de acceso a ${result.invited.length} ${result.invited.length === 1 ? 'email' : 'emails'}.`
              : 'No se ha invitado a nadie nuevo.'
          }
        />

        <div className="mt-8 space-y-4">
          {result.invited.length > 0 && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
              <h3 className="flex items-center gap-2 text-[13.5px] font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                <Check className="size-[14px]" aria-hidden />
                Invitados ({result.invited.length})
              </h3>
              <ul className="text-[12.5px] text-[var(--text-secondary)] space-y-0.5 font-mono">
                {result.invited.map(email => (
                  <li key={email}>{email}</li>
                ))}
              </ul>
            </div>
          )}

          {result.alreadyAssigned.length > 0 && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
              <h3 className="flex items-center gap-2 text-[13.5px] font-semibold text-amber-700 dark:text-amber-300 mb-2">
                <AlertCircle className="size-[14px]" aria-hidden />
                Ya tenían seat ({result.alreadyAssigned.length})
              </h3>
              <p className="text-[12.5px] text-[var(--text-secondary)] mb-2">
                Estos emails ya estaban asignados, no se ha creado ningún seat nuevo:
              </p>
              <ul className="text-[12.5px] text-[var(--text-secondary)] space-y-0.5 font-mono">
                {result.alreadyAssigned.map(email => (
                  <li key={email}>{email}</li>
                ))}
              </ul>
            </div>
          )}

          <Callout kind="info">
            <p className="text-[13px] m-0">
              {result.remaining > 0
                ? `Te quedan ${result.remaining} seat${result.remaining === 1 ? '' : 's'} sin asignar.`
                : 'No quedan seats sin asignar en esta subscription.'}
            </p>
          </Callout>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <Button
            variant="primary"
            onClick={() => navigate(`/org/${ctx.organizationSlug}/admin/seats`)}
          >
            Ver lista de seats
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setResult(null)
              setEmailsRaw('')
            }}
          >
            Invitar más emails
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <Link
        to={`/org/${ctx.organizationSlug}/admin/seats`}
        className="inline-flex items-center gap-1 text-[12.5px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline mb-4"
      >
        <ChevronLeft className="size-[14px] stroke-[2]" aria-hidden />
        Volver a seats
      </Link>

      <PageHeader
        eyebrow={ctx.organizationName}
        title="Invitar al equipo"
        description="Introduce los emails de los miembros de tu equipo. Cada uno ocupará un seat vacante y recibirá un enlace de acceso al curso."
      />

      {error && (
        <Callout kind="warning" className="mt-6">
          <p className="text-[13px] m-0">{error}</p>
        </Callout>
      )}

      <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
        <div>
          <label
            htmlFor="invite-course"
            className="block text-[12.5px] font-medium text-[var(--text-secondary)] mb-1.5"
          >
            Curso <span className="text-[var(--color-pv-purple-600)]">*</span>
          </label>
          {loadingSubs ? (
            <div className="h-10 rounded-md bg-[var(--bg-surface-2)] animate-pulse" />
          ) : subs.length === 0 ? (
            <Callout kind="warning">
              <p className="text-[13px] m-0">
                Esta organización aún no tiene cursos contratados. Contacta con Plain
                Vanilla para activar una subscription.
              </p>
            </Callout>
          ) : (
            <>
              <select
                id="invite-course"
                required
                value={courseSlug}
                onChange={e => setCourseSlug(e.target.value)}
                disabled={submitting}
                className="w-full px-3 py-2.5 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-pv-purple-500)]"
              >
                <option value="">Selecciona un curso…</option>
                {subs.map(sub => {
                  const vacant = vacantBySub.get(sub.courseSlug) ?? 0
                  const course = listCourses().find(c => c.slug === sub.courseSlug)
                  return (
                    <option key={sub.id} value={sub.courseSlug}>
                      {course?.title ?? sub.courseSlug} ({vacant} seat
                      {vacant === 1 ? '' : 's'} vacante{vacant === 1 ? '' : 's'})
                    </option>
                  )
                })}
              </select>
              {courseSlug && (
                <p className="text-[11.5px] text-[var(--text-muted)] mt-1">
                  {vacantForCourse} seat{vacantForCourse === 1 ? '' : 's'} disponible
                  {vacantForCourse === 1 ? '' : 's'} para invitar
                </p>
              )}
            </>
          )}
        </div>

        <div>
          <label
            htmlFor="invite-emails"
            className="block text-[12.5px] font-medium text-[var(--text-secondary)] mb-1.5"
          >
            Emails del equipo <span className="text-[var(--color-pv-purple-600)]">*</span>
          </label>
          <textarea
            id="invite-emails"
            value={emailsRaw}
            onChange={e => setEmailsRaw(e.target.value)}
            placeholder={'alumno1@empresa.com\nalumno2@empresa.com\nalumno3@empresa.com'}
            rows={8}
            disabled={submitting}
            className="w-full px-3 py-2.5 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] text-[13px] font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--color-pv-purple-500)] resize-y"
          />
          <p className="text-[11.5px] text-[var(--text-muted)] mt-1 leading-relaxed">
            Uno por línea, o separados por comas. Acepta hasta {vacantForCourse} emails
            según los seats vacantes del curso seleccionado.
          </p>
        </div>

        {/* Resumen de validación */}
        {parsedEmails.length > 0 && (
          <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-3 text-[12.5px] space-y-1">
            <div className="flex items-center gap-2">
              <Check className="size-[12px] text-emerald-600" aria-hidden />
              <span className="text-[var(--text-secondary)]">
                <strong className="text-[var(--text-primary)]">{validEmails.length}</strong>{' '}
                {validEmails.length === 1 ? 'email válido' : 'emails válidos'}
              </span>
            </div>
            {invalidEmails.length > 0 && (
              <div className="flex items-center gap-2">
                <AlertCircle className="size-[12px] text-amber-600" aria-hidden />
                <span className="text-[var(--text-secondary)]">
                  <strong className="text-[var(--text-primary)]">
                    {invalidEmails.length}
                  </strong>{' '}
                  no válido{invalidEmails.length === 1 ? '' : 's'}:{' '}
                  <span className="font-mono">{invalidEmails.join(', ')}</span>
                </span>
              </div>
            )}
            {validEmails.length > vacantForCourse && (
              <div className="flex items-center gap-2">
                <AlertCircle className="size-[12px] text-red-600" aria-hidden />
                <span className="text-red-700 dark:text-red-300">
                  Hay {validEmails.length - vacantForCourse} email
                  {validEmails.length - vacantForCourse === 1 ? '' : 's'} más que seats
                  vacantes. Reduce la lista o contrata más seats.
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!canSubmit || submitting}
            iconLeft={<Send className="size-[16px] stroke-[2]" aria-hidden />}
          >
            {submitting
              ? 'Enviando…'
              : validEmails.length > 0
                ? `Invitar a ${validEmails.length} ${validEmails.length === 1 ? 'persona' : 'personas'}`
                : 'Invitar'}
          </Button>
          <Link to={`/org/${ctx.organizationSlug}/admin/seats`}>
            <Button variant="ghost" size="lg">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
