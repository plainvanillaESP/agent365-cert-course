import { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import {
  ChevronLeft,
  Plus,
  Building2,
  Calendar,
  Armchair,
  ExternalLink,
} from 'lucide-react'
import {
  getOrganization,
  listSubscriptionsForOrganization,
  listSeatsForOrganization,
} from '@/lib/admin'
import type {
  Organization,
  OrganizationSubscription,
  OrganizationSeat,
} from '@/lib/billing'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { Callout } from '@/components/Callout'

export function AdminOrganizationDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [org, setOrg] = useState<Organization | null | undefined>(undefined) // undefined = loading
  const [subs, setSubs] = useState<OrganizationSubscription[]>([])
  const [seats, setSeats] = useState<OrganizationSeat[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    let canceled = false
    setOrg(undefined)
    getOrganization(slug)
      .then(async o => {
        if (canceled) return
        setOrg(o)
        if (!o) return
        // Cargar subs + seats en paralelo
        const [s1, s2] = await Promise.all([
          listSubscriptionsForOrganization(o.id),
          listSeatsForOrganization(o.id),
        ])
        if (canceled) return
        setSubs(s1)
        setSeats(s2)
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
      <div className="max-w-4xl">
        <div className="h-6 w-40 rounded bg-[var(--bg-surface-2)] animate-pulse mb-4" />
        <div className="h-10 w-72 rounded bg-[var(--bg-surface-2)] animate-pulse mb-6" />
        <div className="space-y-3">
          {[0, 1].map(i => (
            <div
              key={i}
              className="h-20 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <Link
        to="/admin/organizaciones"
        className="inline-flex items-center gap-1 text-[12.5px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline mb-4"
      >
        <ChevronLeft className="size-[14px] stroke-[2]" aria-hidden />
        Volver a organizaciones
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <PageHeader
          eyebrow={`/${org.slug}`}
          title={org.name}
          description={org.legalName ?? org.contactEmail}
        />
        <a
          href={`/org/${org.slug}/admin`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline"
          aria-label="Abrir el panel admin de esta organización (futuro R.3)"
        >
          <ExternalLink className="size-[14px]" aria-hidden />
          Panel de la organización
        </a>
      </div>

      {error && (
        <Callout kind="warning">
          <p className="text-[13px] m-0">{error}</p>
        </Callout>
      )}

      {/* Datos fiscales */}
      <section className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 mb-6">
        <h2 className="text-[14px] font-semibold text-[var(--text-primary)] mb-4">
          Datos
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-[13px]">
          <DataField label="Email de contacto" value={org.contactEmail} />
          <DataField label="Email facturación" value={org.billingEmail} />
          <DataField label="Razón social" value={org.legalName} />
          <DataField label="CIF / VAT" value={org.taxId} mono />
          <DataField label="País" value={org.country} mono />
          <DataField
            label="Alta"
            value={new Date(org.createdAt).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          />
        </dl>
        {org.notes && (
          <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
            <p className="text-[11px] uppercase tracking-[0.06em] font-semibold text-[var(--text-muted)] mb-1.5">
              Notas internas
            </p>
            <p className="text-[13px] text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
              {org.notes}
            </p>
          </div>
        )}
      </section>

      {/* Subscriptions */}
      <section className="mb-6">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="text-[14px] font-semibold text-[var(--text-primary)]">
            Subscriptions ({subs.length})
          </h2>
          <Link to={`/admin/organizaciones/${org.slug}/subscriptions/nueva`}>
            <Button variant="primary" size="sm" iconLeft={<Plus className="size-[14px]" />}>
              Nueva subscription
            </Button>
          </Link>
        </div>

        {subs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface)] p-6 text-center">
            <Building2
              className="size-8 mx-auto text-[var(--text-muted)] mb-2"
              aria-hidden
            />
            <p className="text-[13px] text-[var(--text-secondary)]">
              Esta organización aún no tiene seats contratados.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {subs.map(sub => {
              const seatsOfThisSub = seats.filter(s => s.subscriptionId === sub.id)
              const active = seatsOfThisSub.filter(s => s.revokedAt == null)
              const assigned = active.filter(s => s.userId != null || s.assignedEmail != null)
              return (
                <li
                  key={sub.id}
                  className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-4"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="text-[10.5px] uppercase tracking-[0.08em] font-semibold text-[var(--text-muted)] mb-1">
                        Curso
                      </div>
                      <p className="text-[14px] font-medium text-[var(--text-primary)] font-mono">
                        {sub.courseSlug}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
                      <Armchair className="size-[14px]" aria-hidden />
                      <span className="font-mono tabular-nums">
                        {assigned.length} / {sub.seatsTotal}
                      </span>
                      <span className="text-[var(--text-muted)]">asignados</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4 flex-wrap text-[12px] text-[var(--text-muted)]">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="size-[12px]" aria-hidden />
                      Desde{' '}
                      {new Date(sub.startedAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    {sub.expiresAt ? (
                      <span>
                        Caduca el{' '}
                        {new Date(sub.expiresAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    ) : (
                      <span>Sin caducidad</span>
                    )}
                    {sub.notes && (
                      <span className="italic truncate max-w-md">{sub.notes}</span>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}

function DataField({
  label,
  value,
  mono,
}: {
  label: string
  value: string | null | undefined
  mono?: boolean
}) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.06em] font-semibold text-[var(--text-muted)] mb-0.5">
        {label}
      </dt>
      <dd
        className={
          mono
            ? 'font-mono text-[13px] text-[var(--text-primary)]'
            : 'text-[13px] text-[var(--text-primary)]'
        }
      >
        {value || (
          <span className="italic text-[var(--text-faint)]">No especificado</span>
        )}
      </dd>
    </div>
  )
}
