import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ChevronLeft, Save } from 'lucide-react'
import { createOrganization } from '@/lib/admin'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { Callout } from '@/components/Callout'

export function AdminOrganizationNewPage() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    slug: '',
    legalName: '',
    taxId: '',
    billingEmail: '',
    contactEmail: '',
    country: '',
    notes: '',
  })

  // Auto-slug desde el nombre mientras el usuario no haya tocado el slug
  const [slugTouched, setSlugTouched] = useState(false)
  const handleNameChange = (value: string) => {
    setForm(f => {
      const auto = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40)
      return {
        ...f,
        name: value,
        slug: slugTouched ? f.slug : auto,
      }
    })
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (saving) return
    setError(null)
    setSaving(true)
    try {
      const created = await createOrganization({
        slug: form.slug,
        name: form.name,
        legalName: form.legalName || null,
        taxId: form.taxId || null,
        billingEmail: form.billingEmail || null,
        contactEmail: form.contactEmail,
        country: form.country || null,
        notes: form.notes || null,
      })
      navigate(`/admin/organizaciones/${created.slug}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la organización')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <Link
        to="/admin/organizaciones"
        className="inline-flex items-center gap-1 text-[12.5px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline mb-4"
      >
        <ChevronLeft className="size-[14px] stroke-[2]" aria-hidden />
        Volver a organizaciones
      </Link>

      <PageHeader
        eyebrow="Panel admin"
        title="Nueva organización"
        description="Da de alta una empresa cliente para venderle seats. Los campos fiscales se pueden completar más tarde."
      />

      <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
        <FormSection title="Datos generales">
          <Field label="Nombre comercial" required>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => handleNameChange(e.target.value)}
              placeholder="ACS Actividades de Construcción y Servicios"
              disabled={saving}
              className={inputClass}
            />
          </Field>

          <Field
            label="Slug (URL)"
            required
            hint={`Aparecerá en /org/${form.slug || 'acs'}/admin. Solo letras minúsculas, números y guiones.`}
          >
            <input
              type="text"
              required
              value={form.slug}
              onChange={e => {
                setSlugTouched(true)
                setForm(f => ({ ...f, slug: e.target.value }))
              }}
              placeholder="acs"
              disabled={saving}
              className={`${inputClass} font-mono`}
              pattern="[a-z0-9-]+"
            />
          </Field>

          <Field label="Email de contacto" required hint="El primer admin de la organización recibirá su magic link aquí">
            <input
              type="email"
              required
              value={form.contactEmail}
              onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))}
              placeholder="admin-it@acs.es"
              disabled={saving}
              className={inputClass}
            />
          </Field>
        </FormSection>

        <FormSection title="Datos fiscales" subtitle="Opcionales; sirven para emitir factura desde tu sistema externo">
          <Field label="Razón social">
            <input
              type="text"
              value={form.legalName}
              onChange={e => setForm(f => ({ ...f, legalName: e.target.value }))}
              placeholder="ACS, Actividades de Construcción y Servicios, S.A."
              disabled={saving}
              className={inputClass}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="CIF / VAT">
              <input
                type="text"
                value={form.taxId}
                onChange={e => setForm(f => ({ ...f, taxId: e.target.value }))}
                placeholder="A28004885"
                disabled={saving}
                className={`${inputClass} font-mono`}
              />
            </Field>

            <Field label="País" hint="ISO 3166-1 alpha-2">
              <input
                type="text"
                value={form.country}
                onChange={e => setForm(f => ({ ...f, country: e.target.value.toUpperCase().slice(0, 2) }))}
                placeholder="ES"
                disabled={saving}
                className={`${inputClass} font-mono uppercase`}
                maxLength={2}
              />
            </Field>
          </div>

          <Field label="Email para facturación">
            <input
              type="email"
              value={form.billingEmail}
              onChange={e => setForm(f => ({ ...f, billingEmail: e.target.value }))}
              placeholder="proveedores@acs.es"
              disabled={saving}
              className={inputClass}
            />
          </Field>
        </FormSection>

        <FormSection title="Notas internas" subtitle="Solo visibles para Plain Vanilla">
          <textarea
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder="Cómo conocieron Plain Vanilla, condiciones especiales del contrato, contactos secundarios…"
            rows={4}
            disabled={saving}
            className={inputClass + ' resize-y'}
          />
        </FormSection>

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
            {saving ? 'Creando…' : 'Crear organización'}
          </Button>
          <Link to="/admin/organizaciones">
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

function FormSection({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <header className="pb-2 border-b border-[var(--border-subtle)]">
        <h2 className="text-[14px] font-semibold text-[var(--text-primary)]">{title}</h2>
        {subtitle && (
          <p className="text-[12.5px] text-[var(--text-muted)] mt-0.5">{subtitle}</p>
        )}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

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
