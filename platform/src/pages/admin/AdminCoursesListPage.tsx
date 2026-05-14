import { useEffect, useState, type FormEvent } from 'react'
import {
  BookOpen,
  Tag,
  CreditCard,
  Calendar,
  Edit,
  ShoppingCart,
  Lock,
  Clock,
  Infinity as InfinityIcon,
  AlertCircle,
} from 'lucide-react'
import {
  listAllCoursePricing,
  upsertCoursePricing,
  formatPrice,
  describeAccessModel,
  type CoursePricing,
  type AccessModel,
} from '@/lib/coursePricing'
import { listCourses } from '@/lib/coursesRegistry'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { Callout } from '@/components/Callout'
import { Modal } from '@/components/Modal'
import { useToast } from '@/contexts/ToastContext'

/**
 * Lista de cursos del registry con su configuración comercial B2C.
 * El curso en sí (módulos, contenido, examen) vive en cursos/<slug>/
 * en el repo; solo aquí se gestionan precio, acceso y estado de venta
 * directa.
 */
export function AdminCoursesListPage() {
  const [pricings, setPricings] = useState<CoursePricing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<{
    slug: string
    title: string
    current: CoursePricing | null
  } | null>(null)
  const toast = useToast()

  const courses = listCourses()

  const reload = async () => {
    const data = await listAllCoursePricing()
    setPricings(data)
  }

  useEffect(() => {
    let canceled = false
    setLoading(true)
    reload()
      .catch(e => {
        if (!canceled) setError(e instanceof Error ? e.message : String(e))
      })
      .finally(() => {
        if (!canceled) setLoading(false)
      })
    return () => {
      canceled = true
    }
  }, [])

  const pricingByCourse = new Map(pricings.map(p => [p.courseSlug, p]))

  return (
    <div className="max-w-4xl">
      <PageHeader
        eyebrow="Panel admin"
        title="Cursos y precios"
        description="Configura la comercialización B2C de cada curso del catálogo: precio público, duración del acceso y estado de venta directa. El contenido del curso (módulos, examen) se gestiona aparte en el repositorio."
      />

      {error && (
        <Callout kind="warning" className="mt-6">
          <p className="text-[13px] m-0">{error}</p>
        </Callout>
      )}

      {loading ? (
        <div className="mt-6 space-y-3">
          {[0, 1].map(i => (
            <div
              key={i}
              className="h-28 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] animate-pulse"
            />
          ))}
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {courses.map(course => {
            const pricing = pricingByCourse.get(course.slug) ?? null
            return (
              <li key={course.slug}>
                <CoursePricingCard
                  slug={course.slug}
                  title={course.shortTitle ?? course.title}
                  editor={course.editor}
                  brandingColor={course.branding.colorPrimario}
                  pricing={pricing}
                  onEdit={() =>
                    setEditing({
                      slug: course.slug,
                      title: course.shortTitle ?? course.title,
                      current: pricing,
                    })
                  }
                />
              </li>
            )
          })}
        </ul>
      )}

      <EditPricingModal
        open={editing != null}
        courseSlug={editing?.slug ?? ''}
        courseTitle={editing?.title ?? ''}
        current={editing?.current ?? null}
        onClose={() => setEditing(null)}
        onSaved={async () => {
          setEditing(null)
          toast.show({ kind: 'success', message: 'Configuración guardada.' })
          await reload()
        }}
      />
    </div>
  )
}

function CoursePricingCard({
  slug,
  title,
  editor,
  brandingColor,
  pricing,
  onEdit,
}: {
  slug: string
  title: string
  editor: string
  brandingColor: string
  pricing: CoursePricing | null
  onEdit: () => void
}) {
  const isConfigured = pricing != null
  const isOnSale = pricing?.b2cEnabled === true && (pricing?.b2cPriceCents ?? 0) > 0
  const needsStripe = isOnSale && !pricing?.stripePriceId

  return (
    <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
      <div className="flex items-start gap-3 mb-3">
        <div
          className="size-10 rounded-md shrink-0 flex items-center justify-center"
          style={{ backgroundColor: brandingColor + '22' }}
          aria-hidden
        >
          <BookOpen
            className="size-[18px] stroke-[1.75]"
            style={{ color: brandingColor }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10.5px] uppercase tracking-[0.08em] text-[var(--text-muted)] font-semibold">
            {editor}
          </div>
          <h3 className="text-[15.5px] font-semibold text-[var(--text-primary)] leading-snug mt-0.5">
            {title}
          </h3>
          <p className="text-[11.5px] text-[var(--text-muted)] mt-1 font-mono">{slug}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconLeft={<Edit className="size-[13px]" />}
          onClick={onEdit}
        >
          Editar
        </Button>
      </div>

      {isConfigured ? (
        <div className="flex items-center gap-x-5 gap-y-2 flex-wrap pt-3 border-t border-[var(--border-subtle)]">
          <StatusBadge isOnSale={isOnSale} needsStripe={needsStripe} />
          {pricing.b2cPriceCents != null && pricing.b2cPriceCents > 0 && (
            <Field icon={<Tag className="size-[13px]" aria-hidden />}>
              <span className="font-mono font-semibold text-[var(--text-primary)]">
                {formatPrice(pricing.b2cPriceCents, pricing.currency)}
              </span>
            </Field>
          )}
          <Field
            icon={
              pricing.accessModel === 'perpetual' ? (
                <InfinityIcon className="size-[13px]" aria-hidden />
              ) : (
                <Clock className="size-[13px]" aria-hidden />
              )
            }
          >
            {describeAccessModel(pricing)}
          </Field>
          {pricing.stripePriceId ? (
            <Field icon={<CreditCard className="size-[13px]" aria-hidden />}>
              <span className="font-mono text-[11.5px] truncate max-w-[180px]">
                {pricing.stripePriceId}
              </span>
            </Field>
          ) : (
            <Field icon={<Lock className="size-[13px]" aria-hidden />}>
              <span className="text-[var(--text-muted)] italic">Stripe no conectado</span>
            </Field>
          )}
          <Field icon={<Calendar className="size-[13px]" aria-hidden />}>
            Última edición{' '}
            {new Date(pricing.updatedAt).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </Field>
        </div>
      ) : (
        <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center gap-2 text-[12.5px] text-[var(--text-muted)]">
          <AlertCircle className="size-[14px]" aria-hidden />
          <span>Sin configuración B2C. El curso solo está disponible por seats B2B.</span>
        </div>
      )}
    </div>
  )
}

function StatusBadge({
  isOnSale,
  needsStripe,
}: {
  isOnSale: boolean
  needsStripe: boolean
}) {
  if (isOnSale && !needsStripe) {
    return (
      <span className="inline-flex items-center gap-1 px-2 h-5 rounded-full text-[10.5px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
        <ShoppingCart className="size-[11px]" aria-hidden />
        A la venta
      </span>
    )
  }
  if (isOnSale && needsStripe) {
    return (
      <span className="inline-flex items-center gap-1 px-2 h-5 rounded-full text-[10.5px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300">
        <AlertCircle className="size-[11px]" aria-hidden />
        Pendiente Stripe
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 h-5 rounded-full text-[10.5px] font-semibold bg-[var(--bg-surface-2)] text-[var(--text-muted)]">
      <Lock className="size-[11px]" aria-hidden />
      No a la venta
    </span>
  )
}

function Field({
  icon,
  children,
}: {
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="inline-flex items-center gap-1.5 text-[12px] text-[var(--text-secondary)]">
      <span className="text-[var(--text-muted)]">{icon}</span>
      <span>{children}</span>
    </div>
  )
}

function EditPricingModal({
  open,
  courseSlug,
  courseTitle,
  current,
  onClose,
  onSaved,
}: {
  open: boolean
  courseSlug: string
  courseTitle: string
  current: CoursePricing | null
  onClose: () => void
  onSaved: () => void | Promise<void>
}) {
  const [b2cEnabled, setB2cEnabled] = useState(false)
  const [priceEuros, setPriceEuros] = useState('')
  const [currency, setCurrency] = useState('EUR')
  const [accessModel, setAccessModel] = useState<AccessModel>('perpetual')
  const [durationMonths, setDurationMonths] = useState('')
  const [stripePriceId, setStripePriceId] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Resetear al abrir
  useEffect(() => {
    if (!open) return
    if (current) {
      setB2cEnabled(current.b2cEnabled)
      setPriceEuros(
        current.b2cPriceCents != null ? (current.b2cPriceCents / 100).toFixed(2) : '',
      )
      setCurrency(current.currency)
      setAccessModel(current.accessModel)
      setDurationMonths(
        current.accessDurationMonths != null ? String(current.accessDurationMonths) : '',
      )
      setStripePriceId(current.stripePriceId ?? '')
      setNotes(current.notes ?? '')
    } else {
      // Valores por defecto razonables para un curso nuevo
      setB2cEnabled(false)
      setPriceEuros('')
      setCurrency('EUR')
      setAccessModel('perpetual')
      setDurationMonths('')
      setStripePriceId('')
      setNotes('')
    }
    setError(null)
  }, [open, current])

  const priceCentsParsed = (() => {
    if (!priceEuros.trim()) return null
    const v = parseFloat(priceEuros.replace(',', '.'))
    if (Number.isNaN(v) || v < 0) return null
    return Math.round(v * 100)
  })()

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setError(null)
    setSubmitting(true)
    try {
      await upsertCoursePricing({
        courseSlug,
        b2cEnabled,
        b2cPriceCents: priceCentsParsed,
        currency: currency.trim().toUpperCase() || 'EUR',
        accessModel,
        accessDurationMonths:
          accessModel === 'duration'
            ? Math.max(1, parseInt(durationMonths || '0', 10))
            : null,
        stripePriceId: stripePriceId.trim() || null,
        notes: notes.trim() || null,
      })
      await onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la configuración')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => !submitting && onClose()}
      ariaLabel="Editar configuración B2C del curso"
      size="md"
      header={
        <div>
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
            Configuración B2C
          </h2>
          <p className="text-[12.5px] text-[var(--text-muted)] mt-0.5">
            {courseTitle} <span className="font-mono">({courseSlug})</span>
          </p>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {/* Toggle B2C */}
        <label className="flex items-start gap-3 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface-2)] p-3 cursor-pointer">
          <input
            type="checkbox"
            checked={b2cEnabled}
            onChange={e => setB2cEnabled(e.target.checked)}
            className="mt-0.5 size-4 accent-[var(--color-pv-purple-600)] cursor-pointer"
          />
          <div className="flex-1">
            <div className="text-[13.5px] font-medium text-[var(--text-primary)]">
              Disponible para venta directa B2C
            </div>
            <p className="text-[12px] text-[var(--text-muted)] mt-0.5 leading-relaxed">
              Si está activado, el curso aparece en la landing pública y se puede comprar
              individualmente vía Stripe. Si no, solo se distribuye vía contratos B2B.
            </p>
          </div>
        </label>

        {/* Precio + moneda */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label
              htmlFor="pricing-price"
              className="block text-[12.5px] font-medium text-[var(--text-secondary)] mb-1.5"
            >
              Precio público {b2cEnabled && <span className="text-[var(--color-pv-purple-600)]">*</span>}
            </label>
            <div className="relative">
              <input
                id="pricing-price"
                type="text"
                inputMode="decimal"
                value={priceEuros}
                onChange={e => setPriceEuros(e.target.value)}
                placeholder="199,00"
                disabled={submitting}
                className="w-full pl-3 pr-10 py-2 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] text-[14px] font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-[var(--color-pv-purple-500)]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[var(--text-muted)] font-mono">
                {currency}
              </span>
            </div>
            {priceEuros && priceCentsParsed != null && (
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                Equivale a {formatPrice(priceCentsParsed, currency)}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="pricing-currency"
              className="block text-[12.5px] font-medium text-[var(--text-secondary)] mb-1.5"
            >
              Moneda
            </label>
            <select
              id="pricing-currency"
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              disabled={submitting}
              className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[var(--color-pv-purple-500)]"
            >
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
              <option value="MXN">MXN</option>
            </select>
          </div>
        </div>

        {/* Modelo de acceso */}
        <fieldset>
          <legend className="text-[12.5px] font-medium text-[var(--text-secondary)] mb-2">
            Modelo de acceso <span className="text-[var(--color-pv-purple-600)]">*</span>
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <AccessOption
              value="perpetual"
              checked={accessModel === 'perpetual'}
              onChange={() => setAccessModel('perpetual')}
              icon={<InfinityIcon className="size-[14px]" aria-hidden />}
              title="Permanente"
              description="Una vez comprado, acceso para siempre."
            />
            <AccessOption
              value="duration"
              checked={accessModel === 'duration'}
              onChange={() => setAccessModel('duration')}
              icon={<Clock className="size-[14px]" aria-hidden />}
              title="Por duración"
              description="Acceso temporal en meses desde la compra."
            />
          </div>
          {accessModel === 'duration' && (
            <div className="mt-3">
              <label
                htmlFor="pricing-months"
                className="block text-[12.5px] font-medium text-[var(--text-secondary)] mb-1.5"
              >
                Meses de acceso <span className="text-[var(--color-pv-purple-600)]">*</span>
              </label>
              <input
                id="pricing-months"
                type="number"
                min={1}
                max={120}
                value={durationMonths}
                onChange={e => setDurationMonths(e.target.value)}
                placeholder="12"
                disabled={submitting}
                className="w-32 px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] text-[14px] font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-[var(--color-pv-purple-500)]"
              />
            </div>
          )}
        </fieldset>

        {/* Stripe Price ID */}
        <div>
          <label
            htmlFor="pricing-stripe"
            className="block text-[12.5px] font-medium text-[var(--text-secondary)] mb-1.5"
          >
            Stripe Price ID
          </label>
          <input
            id="pricing-stripe"
            type="text"
            value={stripePriceId}
            onChange={e => setStripePriceId(e.target.value)}
            placeholder="price_..."
            disabled={submitting}
            className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] text-[13px] font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-pv-purple-500)]"
          />
          <p className="text-[11.5px] text-[var(--text-muted)] mt-1 leading-relaxed">
            El ID del price que crees en Stripe Dashboard. Empieza por <code className="font-mono">price_</code>.
            Si está vacío y el curso está a la venta, el botón "Comprar" no se podrá activar (Fase R.4.2).
          </p>
        </div>

        {/* Notas */}
        <div>
          <label
            htmlFor="pricing-notes"
            className="block text-[12.5px] font-medium text-[var(--text-secondary)] mb-1.5"
          >
            Notas internas
          </label>
          <textarea
            id="pricing-notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Ej. Precio promocional de lanzamiento, descuento partner X…"
            rows={2}
            disabled={submitting}
            className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] text-[13px] resize-y focus:outline-none focus:ring-2 focus:ring-[var(--color-pv-purple-500)]"
          />
        </div>

        {error && (
          <Callout kind="warning">
            <p className="text-[13px] m-0">{error}</p>
          </Callout>
        )}

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="ghost" type="button" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Guardando…' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function AccessOption({
  value,
  checked,
  onChange,
  icon,
  title,
  description,
}: {
  value: string
  checked: boolean
  onChange: () => void
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <label
      className={[
        'flex items-start gap-2 p-3 rounded-md border cursor-pointer transition-colors',
        checked
          ? 'border-[var(--color-pv-purple-500)] bg-[var(--color-pv-purple-500)]/5'
          : 'border-[var(--border-default)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)]',
      ].join(' ')}
    >
      <input
        type="radio"
        name="access-model"
        value={value}
        checked={checked}
        onChange={onChange}
        className="mt-0.5 size-4 accent-[var(--color-pv-purple-600)] cursor-pointer"
      />
      <div className="flex-1">
        <div className="flex items-center gap-1.5 text-[13.5px] font-medium text-[var(--text-primary)]">
          {icon}
          {title}
        </div>
        <p className="text-[12px] text-[var(--text-muted)] mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
    </label>
  )
}
