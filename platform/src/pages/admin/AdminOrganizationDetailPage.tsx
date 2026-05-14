import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams, Navigate, useNavigate } from 'react-router-dom'
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
  Pencil,
  AlertTriangle,
} from 'lucide-react'
import {
  getOrganization,
  listSubscriptionsForOrganization,
  listSeatsForOrganization,
  listMembersForOrganization,
  listPendingInvitations,
  addOrganizationMember,
  removeOrganizationMember,
  updateOrganization,
  deleteOrganization,
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
import { useToast } from '@/contexts/ToastContext'

export function AdminOrganizationDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const toast = useToast()
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
  // Modal editar org
  const [editOpen, setEditOpen] = useState(false)
  // Modal eliminar org
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deletingNow, setDeletingNow] = useState(false)

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
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            iconLeft={<Pencil className="size-[13px]" />}
            onClick={() => setEditOpen(true)}
          >
            Editar
          </Button>
          <a
            href={`/org/${org.slug}/admin`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-[12.5px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pv-purple-500)]"
            aria-label="Abrir el panel admin de esta organización"
          >
            <ExternalLink className="size-[13px]" aria-hidden />
            Panel de la organización
          </a>
        </div>
      </div>

      {error && (
        <Callout kind="warning" className="mb-4">
          <p className="text-[13px] m-0">{error}</p>
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

      {/* Zona peligrosa */}
      <section className="mt-12 rounded-lg border border-red-500/30 bg-red-500/5 p-5">
        <h2 className="text-[14px] font-semibold text-red-700 dark:text-red-300 mb-2 flex items-center gap-1.5">
          <AlertTriangle className="size-[14px]" aria-hidden />
          Zona peligrosa
        </h2>
        <p className="text-[13px] text-[var(--text-secondary)] mb-4 leading-relaxed">
          Eliminar la organización borrará también sus subscriptions, seats e invitaciones
          en cascada. El progreso de los alumnos en sus cursos se conserva, pero perderán
          el acceso si lo tenían sólo por esta organización.
        </p>
        <button
          type="button"
          onClick={() => {
            setDeleteConfirm('')
            setDeleteOpen(true)
          }}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-md border border-red-500/40 bg-transparent text-red-700 dark:text-red-300 hover:bg-red-500/10 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <Trash2 className="size-[14px]" aria-hidden />
          Eliminar organización
        </button>
      </section>

      {/* Modal añadir admin */}
      <AddAdminModal
        open={addOpen}
        organizationId={org.id}
        organizationName={org.name}
        onClose={() => setAddOpen(false)}
        onSuccess={async res => {
          setAddOpen(false)
          toast.show({
            kind: 'success',
            message:
              res.kind === 'added'
                ? `${res.email} añadido como administrador`
                : `Invitación enviada a ${res.email}. Se activará automáticamente cuando entre.`,
          })
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

      {/* Modal editar organización */}
      <EditOrgModal
        open={editOpen}
        organization={org}
        onClose={() => setEditOpen(false)}
        onSaved={async updated => {
          setEditOpen(false)
          setOrg(updated)
          toast.show({
            kind: 'success',
            message: 'Datos de la organización actualizados.',
          })
        }}
      />

      {/* Modal eliminar organización */}
      <Modal
        open={deleteOpen}
        onClose={() => !deletingNow && setDeleteOpen(false)}
        ariaLabel="Eliminar organización"
        size="sm"
        header={
          <h2 className="text-[16px] font-semibold text-red-700 dark:text-red-300 flex items-center gap-1.5">
            <AlertTriangle className="size-[15px]" aria-hidden />
            Eliminar organización
          </h2>
        }
      >
        <p className="text-[13.5px] text-[var(--text-secondary)] mb-4 leading-relaxed">
          Vas a eliminar <strong className="text-[var(--text-primary)]">{org.name}</strong>{' '}
          y todo lo asociado: <strong>{subs.length}</strong> subscription{subs.length === 1 ? '' : 's'},{' '}
          <strong>{seats.length}</strong> seat{seats.length === 1 ? '' : 's'}, <strong>{members.length}</strong>{' '}
          administrador{members.length === 1 ? '' : 'es'} y <strong>{pending.length}</strong>{' '}
          invitación{pending.length === 1 ? '' : 'es'} pendiente{pending.length === 1 ? '' : 's'}.
          Esta acción no se puede deshacer.
        </p>
        <label
          htmlFor="delete-confirm"
          className="block text-[12.5px] font-medium text-[var(--text-secondary)] mb-1.5"
        >
          Escribe <code className="px-1 py-0.5 rounded bg-[var(--bg-surface-2)] text-[12px] font-mono text-[var(--text-primary)]">{org.slug}</code> para confirmar
        </label>
        <input
          id="delete-confirm"
          type="text"
          autoComplete="off"
          autoFocus
          value={deleteConfirm}
          onChange={e => setDeleteConfirm(e.target.value)}
          disabled={deletingNow}
          className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] text-[13px] font-mono focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
        />
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => setDeleteOpen(false)}
            disabled={deletingNow}
          >
            Cancelar
          </Button>
          <button
            type="button"
            disabled={deleteConfirm !== org.slug || deletingNow}
            onClick={async () => {
              if (deleteConfirm !== org.slug) return
              setDeletingNow(true)
              try {
                await deleteOrganization(org.id)
                toast.show({
                  kind: 'success',
                  message: `Organización ${org.name} eliminada.`,
                })
                navigate('/admin/organizaciones', { replace: true })
              } catch (e) {
                toast.show({
                  kind: 'error',
                  message:
                    e instanceof Error ? e.message : 'No se pudo eliminar la organización',
                })
                setDeletingNow(false)
              }
            }}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-red-600 hover:bg-red-700 disabled:bg-red-600/40 disabled:cursor-not-allowed text-white text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            {deletingNow ? 'Eliminando…' : 'Eliminar definitivamente'}
          </button>
        </div>
      </Modal>
    </div>
  )
}

function EditOrgModal({
  open,
  organization,
  onClose,
  onSaved,
}: {
  open: boolean
  organization: Organization
  onClose: () => void
  onSaved: (updated: Organization) => void
}) {
  const [name, setName] = useState(organization.name)
  const [legalName, setLegalName] = useState(organization.legalName ?? '')
  const [taxId, setTaxId] = useState(organization.taxId ?? '')
  const [billingEmail, setBillingEmail] = useState(organization.billingEmail ?? '')
  const [contactEmail, setContactEmail] = useState(organization.contactEmail)
  const [country, setCountry] = useState(organization.country ?? '')
  const [notes, setNotes] = useState(organization.notes ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Resetear el form cuando se abre con nuevos datos
  useEffect(() => {
    if (open) {
      setName(organization.name)
      setLegalName(organization.legalName ?? '')
      setTaxId(organization.taxId ?? '')
      setBillingEmail(organization.billingEmail ?? '')
      setContactEmail(organization.contactEmail)
      setCountry(organization.country ?? '')
      setNotes(organization.notes ?? '')
      setError(null)
    }
  }, [open, organization])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (submitting || !name.trim() || !contactEmail.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const updated = await updateOrganization(organization.id, {
        name: name.trim(),
        legalName: legalName.trim() || null,
        taxId: taxId.trim() || null,
        billingEmail: billingEmail.trim() || null,
        contactEmail: contactEmail.trim(),
        country: country.trim() || null,
        notes: notes.trim() || null,
      })
      onSaved(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron guardar los cambios')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => !submitting && onClose()}
      ariaLabel="Editar organización"
      size="md"
      header={
        <div>
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
            Editar organización
          </h2>
          <p className="text-[12.5px] text-[var(--text-muted)] mt-0.5">
            El slug <code className="font-mono">{organization.slug}</code> no se puede
            cambiar.
          </p>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-3" noValidate>
        <EditField
          id="edit-org-name"
          label="Nombre"
          required
          value={name}
          onChange={setName}
          disabled={submitting}
        />
        <EditField
          id="edit-org-legal-name"
          label="Razón social"
          value={legalName}
          onChange={setLegalName}
          disabled={submitting}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <EditField
            id="edit-org-tax-id"
            label="CIF / VAT"
            value={taxId}
            onChange={setTaxId}
            disabled={submitting}
            mono
          />
          <EditField
            id="edit-org-country"
            label="País"
            value={country}
            onChange={setCountry}
            disabled={submitting}
            placeholder="ES"
            mono
          />
        </div>
        <EditField
          id="edit-org-contact"
          label="Email de contacto"
          required
          type="email"
          value={contactEmail}
          onChange={setContactEmail}
          disabled={submitting}
        />
        <EditField
          id="edit-org-billing"
          label="Email de facturación"
          type="email"
          value={billingEmail}
          onChange={setBillingEmail}
          disabled={submitting}
        />
        <div>
          <label
            htmlFor="edit-org-notes"
            className="block text-[12.5px] font-medium text-[var(--text-secondary)] mb-1.5"
          >
            Notas internas
          </label>
          <textarea
            id="edit-org-notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
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
          <Button
            variant="ghost"
            onClick={onClose}
            type="button"
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!name.trim() || !contactEmail.trim() || submitting}
          >
            {submitting ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function EditField({
  id,
  label,
  value,
  onChange,
  disabled,
  required,
  type,
  placeholder,
  mono,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  disabled?: boolean
  required?: boolean
  type?: string
  placeholder?: string
  mono?: boolean
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[12.5px] font-medium text-[var(--text-secondary)] mb-1.5"
      >
        {label}
        {required && <span className="text-[var(--color-pv-purple-600)] ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type ?? 'text'}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={[
          'w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] text-[13.5px]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--color-pv-purple-500)]',
          mono ? 'font-mono' : '',
        ].join(' ')}
      />
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
