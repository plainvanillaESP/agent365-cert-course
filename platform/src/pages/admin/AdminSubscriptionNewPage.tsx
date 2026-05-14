import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams, Link, Navigate } from 'react-router-dom'
import { ChevronLeft, Save } from 'lucide-react'
import { getOrganization, createSubscription } from '@/lib/admin'
import type { Organization } from '@/lib/billing'
import { listCourses } from '@/lib/coursesRegistry'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { Callout } from '@/components/Callout'
import { useToast } from '@/contexts/ToastContext'

export function AdminSubscriptionNewPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const [org, setOrg] = useState<Organization | null | undefined>(undefined)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const courses = listCourses()

  const [form, setForm] = useState({
    courseSlug: courses[0]?.slug ?? '',
    seatsTotal: 10,
    expiresAt: '',
    notes: '',
  })

  useEffect(() => {
    if (!slug) return
    let canceled = false
    getOrganization(slug)
      .then(o => {
        if (!canceled) setOrg(o)
      })
      .catch(e => {
        if (!canceled) setError(e instanceof Error ? e.message : String(e))
      })
    return () => {
      canceled = true
    }
  }, [slug])

  if (org === null) return <Navigate to="/admin/organizaciones" replace />
  if (org === undefined) {
    return (
      <div className="max-w-2xl">
        <div className="h-6 w-40 rounded bg-[var(--bg-surface-2)] animate-pulse mb-4" />
        <div className="h-10 w-72 rounded bg-[var(--bg-surface-2)] animate-pulse" />
      </div>
    )
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (saving) return
    setError(null)
    setSaving(true)
    try {
      await createSubscription({
        organizationId: org.id,
        courseSlug: form.courseSlug,
        seatsTotal: form.seatsTotal,
        expiresAt: form.expiresAt || null,
        notes: form.notes || null,
      })
      navigate(`/admin/organizaciones/${org.slug}`)
      toast.show({
        kind: 'success',
        message: `Subscription creada con ${form.seatsTotal} seat${form.seatsTotal === 1 ? '' : 's'}`,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'No se pudo crear la subscription'
      setError(msg)
      toast.show({ kind: 'error', message: msg })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <Link
        to={`/admin/organizaciones/${org.slug}`}
        className="inline-flex items-center gap-1 text-[12.5px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline mb-4"
      >
        <ChevronLeft className="size-[14px] stroke-[2]" aria-hidden />
        Volver a {org.name}
      </Link>

      <PageHeader
        eyebrow={`Organización · ${org.name}`}
        title="Nueva subscription"
        description="Contrato de N seats de un curso para esta organización. Al guardar se crean los seats vacantes."
      />

      <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
        <Field label="Curso" required>
          <select
            required
            value={form.courseSlug}
            onChange={e => setForm(f => ({ ...f, courseSlug: e.target.value }))}
            disabled={saving}
            className={inputClass}
          >
            {courses.map(c => (
              <option key={c.slug} value={c.slug}>
                {c.title} ({c.slug})
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Número de seats"
          required
          hint="Cada seat es una licencia para un alumno. Al guardar, los seats se crean vacantes; el admin de la organización los asignará a emails desde su panel."
        >
          <input
            type="number"
            required
            min={1}
            max={10000}
            value={form.seatsTotal}
            onChange={e => setForm(f => ({ ...f, seatsTotal: parseInt(e.target.value, 10) || 0 }))}
            disabled={saving}
            className={`${inputClass} font-mono tabular-nums`}
          />
        </Field>

        <Field
          label="Fecha de caducidad"
          hint="Opcional. Si se deja en blanco, el contrato es perpetuo. Tras esta fecha los seats dejan de dar acceso."
        >
          <input
            type="date"
            value={form.expiresAt}
            onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))}
            disabled={saving}
            className={inputClass}
          />
        </Field>

        <Field label="Notas internas">
          <textarea
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder="Referencia de factura, condiciones especiales del contrato…"
            rows={3}
            disabled={saving}
            className={`${inputClass} resize-y`}
          />
        </Field>

        {error && (
          <Callout kind="warning">
            <p className="text-[13px] m-0">{error}</p>
          </Callout>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={saving}
            iconLeft={<Save className="size-[16px] stroke-[2]" aria-hidden />}
          >
            {saving ? 'Creando…' : `Crear subscription (${form.seatsTotal} seats)`}
          </Button>
          <Link to={`/admin/organizaciones/${org.slug}`}>
            <Button variant="ghost" size="lg">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}

const inputClass =
  'w-full px-3 py-2.5 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-pv-purple-500)] focus:border-[var(--color-pv-purple-500)] disabled:opacity-50 transition-shadow'

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-[12.5px] font-medium text-[var(--text-secondary)] mb-1.5">
        {label}
        {required && <span className="text-[var(--color-pv-purple-600)] ml-0.5">*</span>}
      </label>
      {children}
      {hint && (
        <p className="text-[11.5px] text-[var(--text-muted)] mt-1 leading-relaxed">{hint}</p>
      )}
    </div>
  )
}
