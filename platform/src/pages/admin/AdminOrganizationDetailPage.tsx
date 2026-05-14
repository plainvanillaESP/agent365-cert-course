import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import {
  ChevronLeft,
  Plus,
  Building2,
  Calendar,
  Armchair,
  ExternalLink,
  ShieldCheck,
  Mail,
  Trash2,
  Clock,
  Send,
} from 'lucide-react'
import {
  getOrganization,
  listSubscriptionsForOrganization,
  listSeatsForOrganization,
  listMembersForOrganization,
  listPendingInvitations,
  addOrganizationMember,
  removeOrganizationMember,
  type OrgMemberRow,
  type PendingInvitation,
  type AddOrgMemberResult,
} from '@/lib/admin'
import type {
  Organization,
  OrganizationSubscription,
  OrganizationSeat,
} from '@/lib/billing'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { Callout } from '@/components/Callout'
import { Modal } from '@/components/Modal'

export function AdminOrganizationDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [org, setOrg] = useState<Organization | null | undefined>(undefined)
  const [subs, setSubs] = useState<OrganizationSubscription[]>([])
  const [seats, setSeats] = useState<OrganizationSeat[]>([])
  const [members, setMembers] = useState<OrgMemberRow[]>([])
  const [pending, setPending] = useState<PendingInvitation[]>([])
  const [error, setError] = useState<string | null>(null)

  // Modal añadir admin
  const [addOpen, setAddOpen] = useState(false)

  // Modal confirmar borrar member
  const [removing, setRemoving] = useState<OrgMemberRow | null>(null)

  // Última invitación (banner success)
  const [lastInvite, setLastInvite] = useState<AddOrgMemberResult | null>(null)

  const reload = async (orgId: string) => {
    const [s1, s2, m, p] = await Promise.all([
      listSubscriptionsForOrganization(orgId),
      listSeatsForOrganization(orgId),
      listMembersForOrganization(orgId),
      listPendingInvitations(orgId),
    ])
    setSubs(s1)
    setSeats(s2)
    setMembers(m)
    setPending(p)
  }

  useEffect(() => {
    if (!slug) return
    let canceled = false
    setOrg(undefined)
    getOrganization(slug)
      .then(async o => {
        if (canceled) return
        setOrg(o)
        if (!o) return
        await reload(o.id)
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

  const handleRemoveMember = async () => {
    if (!removing) return
    try {
      await removeOrganizationMember(removing.id)
      setRemoving(null)
      await reload(org.id)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo quitar el admin')
    }
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
          aria-label="Abrir el panel admin de esta organización"
        >
          <ExternalLink className="size-[14px]" aria-hidden />
          Panel de la organización
        </a>
      </div>

      {error && (
        <Callout kind="warning" className="mb-4">
          <p className="text-[13px] m-0">{error}</p>
        </Callout>
      )}

      {lastInvite && (
        <Callout kind="info" className="mb-4">
          <p className="text-[13px] m-0">
            {lastInvite.kind === 'added' ? (
              <>
                <strong>{lastInvite.email}</strong> añadido como administrador.
              </>
            ) : (
              <>
                Invitación enviada a <strong>{lastInvite.email}</strong>. Recibirá un
                magic link y cuando entre se convertirá automáticamente en administrador.
              </>
            )}
          </p>
        </Callout>
      )}

      {/* Datos */}
      <section className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 mb-6">
        <h2 className="text-[14px] font-semibold text-[var(--text-primary)] mb-4">Datos</h2>
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

      {/* Administradores */}
      <section className="mb-6">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="text-[14px] font-semibold text-[var(--text-primary)]">
            Administradores ({members.length}
            {pending.length > 0 ? ` + ${pending.length} pendiente${pending.length === 1 ? '' : 's'}` : ''})
          </h2>
          <Button
            variant="primary"
            size="sm"
            iconLeft={<Plus className="size-[14px]" />}
            onClick={() => setAddOpen(true)}
          >
            Añadir admin
          </Button>
        </div>

        {members.length === 0 && pending.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface)] p-6 text-center">
            <ShieldCheck className="size-8 mx-auto text-[var(--text-muted)] mb-2" aria-hidden />
            <p className="text-[13px] text-[var(--text-secondary)] mb-3">
              Esta organización aún no tiene admins. Sin admin, la empresa cliente no
              puede invitar a su equipo ni operar su panel.
            </p>
            <Button
              variant="primary"
              size="sm"
              iconLeft={<Plus className="size-[14px]" />}
              onClick={() => setAddOpen(true)}
            >
              Añadir primer admin
            </Button>
          </div>
        ) : (
          <ul className="space-y-1.5">
            {members.map(m => (
              <li
                key={m.id}
                className="rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-2.5 flex items-center gap-3"
              >
                <span className="inline-flex items-center gap-1 px-2 h-5 rounded-full text-[10.5px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                  <ShieldCheck className="size-[11px]" aria-hidden />
                  {m.role}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[13.5px] text-[var(--text-primary)]">
                    <Mail className="size-[12px] text-[var(--text-muted)]" aria-hidden />
                    <span className="truncate">{m.email ?? 'Sin email'}</span>
                  </div>
                  <div className="text-[11.5px] text-[var(--text-muted)] mt-0.5">
                    {m.displayName ?? '—'} · Desde{' '}
                    {new Date(m.joinedAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRemoving(m)}
                  aria-label={`Quitar admin ${m.email}`}
                  className="size-8 inline-flex items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-700 transition-colors"
                  title="Quitar admin"
                >
                  <Trash2 className="size-[14px]" aria-hidden />
                </button>
              </li>
            ))}

            {pending.map(p => (
              <li
                key={p.id}
                className="rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2.5 flex items-center gap-3"
              >
                <span className="inline-flex items-center gap-1 px-2 h-5 rounded-full text-[10.5px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300">
                  <Clock className="size-[11px]" aria-hidden />
                  Pendiente
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[13.5px] text-[var(--text-primary)]">
                    <Mail className="size-[12px] text-[var(--text-muted)]" aria-hidden />
                    <span className="truncate">{p.email}</span>
                  </div>
                  <div className="text-[11.5px] text-[var(--text-muted)] mt-0.5">
                    Invitado{' '}
                    {new Date(p.createdAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                    . Se activará cuando el usuario entre por primera vez.
                  </div>
                </div>
              </li>
            ))}
          </ul>
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
            <Building2 className="size-8 mx-auto text-[var(--text-muted)] mb-2" aria-hidden />
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
                    {sub.notes && <span className="italic truncate max-w-md">{sub.notes}</span>}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* Modal añadir admin */}
      <AddAdminModal
        open={addOpen}
        organizationId={org.id}
        organizationName={org.name}
        onClose={() => setAddOpen(false)}
        onSuccess={async res => {
          setAddOpen(false)
          setLastInvite(res)
          await reload(org.id)
        }}
      />

      {/* Modal confirmar quitar admin */}
      <Modal
        open={removing != null}
        onClose={() => setRemoving(null)}
        ariaLabel="Quitar admin"
        size="sm"
        header={
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
            Quitar administrador
          </h2>
        }
      >
        <p className="text-[13.5px] text-[var(--text-secondary)] mb-4 leading-relaxed">
          ¿Seguro que quieres quitar a{' '}
          <strong className="text-[var(--text-primary)]">{removing?.email}</strong>{' '}
          como administrador de <strong className="text-[var(--text-primary)]">
            {org.name}
          </strong>? El usuario seguirá existiendo y conservará sus cursos, pero perderá
          acceso al panel <code className="text-[12px]">/org/{org.slug}/admin</code>.
        </p>
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={() => setRemoving(null)}>
            Cancelar
          </Button>
          <button
            type="button"
            onClick={handleRemoveMember}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-red-600 hover:bg-red-700 text-white text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            Quitar admin
          </button>
        </div>
      </Modal>
    </div>
  )
}

function AddAdminModal({
  open,
  organizationId,
  organizationName,
  onClose,
  onSuccess,
}: {
  open: boolean
  organizationId: string
  organizationName: string
  onClose: () => void
  onSuccess: (res: AddOrgMemberResult) => void
}) {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setEmail('')
      setError(null)
    }
  }, [open])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (submitting || !email.trim()) return
    setError(null)
    setSubmitting(true)
    try {
      const res = await addOrganizationMember({
        organizationId,
        email,
        role: 'admin',
      })
      onSuccess(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo añadir el admin')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      ariaLabel="Añadir administrador"
      size="sm"
      header={
        <div>
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
            Añadir administrador
          </h2>
          <p className="text-[12.5px] text-[var(--text-muted)] mt-0.5">
            A {organizationName}
          </p>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="add-admin-email"
            className="block text-[12.5px] font-medium text-[var(--text-secondary)] mb-1.5"
          >
            Email del nuevo administrador
          </label>
          <input
            id="add-admin-email"
            type="email"
            required
            autoFocus
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin-it@empresa.com"
            disabled={submitting}
            className="w-full px-3 py-2.5 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-pv-purple-500)]"
          />
          <p className="text-[11.5px] text-[var(--text-muted)] mt-1.5 leading-relaxed">
            Si el email ya tiene una cuenta en PV-Learn, lo añadiremos como admin
            inmediatamente. Si no, le enviaremos un enlace de invitación y se activará
            como admin la primera vez que entre.
          </p>
        </div>

        {error && (
          <Callout kind="warning">
            <p className="text-[13px] m-0">{error}</p>
          </Callout>
        )}

        <div className="flex items-center justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose} type="button" disabled={submitting}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!email.trim() || submitting}
            iconLeft={<Send className="size-[14px] stroke-[2]" aria-hidden />}
          >
            {submitting ? 'Añadiendo…' : 'Añadir admin'}
          </Button>
        </div>
      </form>
    </Modal>
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
        {value || <span className="italic text-[var(--text-faint)]">No especificado</span>}
      </dd>
    </div>
  )
}
