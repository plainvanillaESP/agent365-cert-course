import { useEffect, useState } from 'react'
import { Link, useOutletContext, useSearchParams } from 'react-router-dom'
import { Plus, Filter, X, UserCheck, UserMinus, Mail, AlertCircle } from 'lucide-react'
import {
  listSeatsForOrganization,
  listSubscriptionsForOrganization,
  revokeSeatById,
} from '@/lib/admin'
import type { OrganizationSeat, OrganizationSubscription } from '@/lib/billing'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { Callout } from '@/components/Callout'
import { Modal } from '@/components/Modal'
import { useToast } from '@/contexts/ToastContext'
import type { OrgContextValue } from '@/components/OrgAdminLayout'

type SeatFilter = 'all' | 'assigned' | 'vacant' | 'revoked'

export function OrgSeatsListPage() {
  const ctx = useOutletContext<OrgContextValue>()
  const [searchParams, setSearchParams] = useSearchParams()
  const courseFromUrl = searchParams.get('curso') ?? null
  const [filter, setFilter] = useState<SeatFilter>('all')
  const toast = useToast()

  const [seats, setSeats] = useState<OrganizationSeat[]>([])
  const [subs, setSubs] = useState<OrganizationSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [revoking, setRevoking] = useState<OrganizationSeat | null>(null)
  const [revokeReason, setRevokeReason] = useState('')

  const reload = async () => {
    const [s, sub] = await Promise.all([
      listSeatsForOrganization(ctx.organizationId),
      listSubscriptionsForOrganization(ctx.organizationId),
    ])
    setSeats(s)
    setSubs(sub)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.organizationId])

  // Helpers
  const subById = new Map(subs.map(s => [s.id, s]))
  const filtered = seats.filter(s => {
    // Filtro por curso de la URL (si lo hay)
    if (courseFromUrl) {
      const sub = subById.get(s.subscriptionId)
      if (!sub || sub.courseSlug !== courseFromUrl) return false
    }
    // Filtro por estado
    switch (filter) {
      case 'assigned':
        return s.revokedAt == null && s.assignedEmail != null
      case 'vacant':
        return s.revokedAt == null && s.assignedEmail == null
      case 'revoked':
        return s.revokedAt != null
      default:
        return true
    }
  })

  const counts = {
    all: seats.length,
    assigned: seats.filter(s => s.revokedAt == null && s.assignedEmail != null).length,
    vacant: seats.filter(s => s.revokedAt == null && s.assignedEmail == null).length,
    revoked: seats.filter(s => s.revokedAt != null).length,
  }

  const handleRevoke = async () => {
    if (!revoking) return
    const target = revoking
    try {
      await revokeSeatById(target.id, revokeReason.trim() || undefined)
      setRevoking(null)
      setRevokeReason('')
      await reload()
      toast.show({
        kind: 'success',
        message: target.assignedEmail
          ? `Seat de ${target.assignedEmail} revocado`
          : 'Seat revocado',
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'No se pudo revocar el seat'
      setError(msg)
      toast.show({ kind: 'error', message: msg })
    }
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <PageHeader
          eyebrow={ctx.organizationName}
          title="Seats"
          description="Gestión de las licencias contratadas. Invita emails para asignarlas o revóca seats existentes."
        />
        <Link to={`/org/${ctx.organizationSlug}/admin/seats/invitar`}>
          <Button variant="primary" iconLeft={<Plus className="size-[16px]" />}>
            Invitar emails
          </Button>
        </Link>
      </div>

      {error && (
        <Callout kind="warning" className="mb-4">
          <p className="text-[13px] m-0">{error}</p>
        </Callout>
      )}

      {/* Filtro por curso (desde URL) */}
      {courseFromUrl && (
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border-default)] bg-[var(--bg-surface)] text-[12px] text-[var(--text-secondary)]">
          <Filter className="size-[12px]" aria-hidden />
          <span>
            Curso: <strong className="font-mono">{courseFromUrl}</strong>
          </span>
          <button
            type="button"
            onClick={() => {
              const params = new URLSearchParams(searchParams)
              params.delete('curso')
              setSearchParams(params)
            }}
            className="ml-1 size-4 rounded-full inline-flex items-center justify-center hover:bg-[var(--bg-surface-hover)]"
            aria-label="Quitar filtro de curso"
          >
            <X className="size-[10px]" aria-hidden />
          </button>
        </div>
      )}

      {/* Tabs de filtro de estado */}
      <div className="flex items-center gap-1 mb-4 border-b border-[var(--border-default)]">
        <FilterTab active={filter === 'all'} onClick={() => setFilter('all')} count={counts.all}>
          Todos
        </FilterTab>
        <FilterTab
          active={filter === 'assigned'}
          onClick={() => setFilter('assigned')}
          count={counts.assigned}
        >
          Asignados
        </FilterTab>
        <FilterTab
          active={filter === 'vacant'}
          onClick={() => setFilter('vacant')}
          count={counts.vacant}
        >
          Vacantes
        </FilterTab>
        <FilterTab
          active={filter === 'revoked'}
          onClick={() => setFilter('revoked')}
          count={counts.revoked}
        >
          Revocados
        </FilterTab>
      </div>

      {loading && (
        <div className="space-y-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="h-14 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] animate-pulse"
            />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface)] p-8 text-center">
          <AlertCircle
            className="size-8 mx-auto text-[var(--text-muted)] mb-2"
            aria-hidden
          />
          <p className="text-[13px] text-[var(--text-secondary)]">
            No hay seats en esta vista.
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <ul className="space-y-1.5">
          {filtered.map(seat => {
            const sub = subById.get(seat.subscriptionId)
            return (
              <SeatRow
                key={seat.id}
                seat={seat}
                courseSlug={sub?.courseSlug}
                onRevoke={() => {
                  setRevokeReason('')
                  setRevoking(seat)
                }}
              />
            )
          })}
        </ul>
      )}

      {/* Modal de revocación */}
      <Modal
        open={revoking != null}
        onClose={() => setRevoking(null)}
        ariaLabel="Revocar seat"
        size="sm"
        header={
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
            Revocar seat
          </h2>
        }
      >
        <p className="text-[13.5px] text-[var(--text-secondary)] mb-4 leading-relaxed">
          ¿Seguro que quieres revocar el seat de{' '}
          <strong className="text-[var(--text-primary)]">
            {revoking?.assignedEmail ?? 'este seat'}
          </strong>
          ? El alumno perderá acceso al curso a partir de ahora. Su progreso se conserva
          por si vuelves a invitarle más tarde.
        </p>
        <label className="block text-[12.5px] font-medium text-[var(--text-secondary)] mb-1.5">
          Motivo (opcional)
        </label>
        <textarea
          value={revokeReason}
          onChange={e => setRevokeReason(e.target.value)}
          placeholder="Ej. Cambio de departamento, baja de la empresa…"
          rows={3}
          className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--color-pv-purple-500)] resize-y mb-4"
        />
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={() => setRevoking(null)}>
            Cancelar
          </Button>
          <button
            type="button"
            onClick={handleRevoke}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-red-600 hover:bg-red-700 text-white text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-page)]"
          >
            Revocar seat
          </button>
        </div>
      </Modal>
    </div>
  )
}

function FilterTab({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean
  onClick: () => void
  count: number
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'inline-flex items-center gap-1.5 h-9 px-3 -mb-[1px] border-b-2 text-[13px] font-medium transition-colors',
        active
          ? 'border-[var(--color-pv-purple-500)] text-[var(--text-primary)]'
          : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]',
      ].join(' ')}
    >
      <span>{children}</span>
      <span
        className={[
          'inline-flex items-center justify-center min-w-[1.4rem] h-4 px-1 rounded-full text-[10.5px] font-semibold tabular-nums',
          active
            ? 'bg-[var(--color-pv-purple-500)]/15 text-[var(--color-pv-purple-700)] dark:text-[var(--color-pv-purple-300)]'
            : 'bg-[var(--bg-surface-2)] text-[var(--text-muted)]',
        ].join(' ')}
      >
        {count}
      </span>
    </button>
  )
}

function SeatRow({
  seat,
  courseSlug,
  onRevoke,
}: {
  seat: OrganizationSeat
  courseSlug: string | undefined
  onRevoke: () => void
}) {
  const isRevoked = seat.revokedAt != null
  const isAssigned = seat.assignedEmail != null
  const isRegistered = seat.userId != null

  let statusLabel = 'Vacante'
  let statusColor = 'text-[var(--text-muted)]'
  let statusBg = 'bg-[var(--bg-surface-2)]'

  if (isRevoked) {
    statusLabel = 'Revocado'
    statusColor = 'text-red-700 dark:text-red-300'
    statusBg = 'bg-red-500/10'
  } else if (isRegistered) {
    statusLabel = 'Activo'
    statusColor = 'text-emerald-700 dark:text-emerald-300'
    statusBg = 'bg-emerald-500/10'
  } else if (isAssigned) {
    statusLabel = 'Invitado'
    statusColor = 'text-amber-700 dark:text-amber-300'
    statusBg = 'bg-amber-500/10'
  }

  return (
    <li className="rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-2.5 flex items-center gap-3">
      <span
        className={`inline-flex items-center px-2 h-5 rounded-full text-[10.5px] font-semibold ${statusBg} ${statusColor}`}
      >
        {statusLabel}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-[13.5px] text-[var(--text-primary)] truncate">
          {seat.assignedEmail ? (
            <>
              <Mail className="size-[12px] text-[var(--text-muted)]" aria-hidden />
              <span className="truncate">{seat.assignedEmail}</span>
            </>
          ) : (
            <span className="italic text-[var(--text-muted)]">Sin asignar</span>
          )}
        </div>
        <div className="text-[11.5px] text-[var(--text-muted)] mt-0.5 flex items-center gap-3 flex-wrap">
          {courseSlug && <span className="font-mono">{courseSlug}</span>}
          {seat.assignedAt && (
            <span>
              Invitado{' '}
              {new Date(seat.assignedAt).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          )}
          {seat.revokedAt && (
            <span>
              Revocado{' '}
              {new Date(seat.revokedAt).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
              {seat.revokedReason ? ` (${seat.revokedReason})` : ''}
            </span>
          )}
        </div>
      </div>
      {!isRevoked && isAssigned && (
        <button
          type="button"
          onClick={onRevoke}
          aria-label={`Revocar seat de ${seat.assignedEmail}`}
          className="size-8 inline-flex items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] transition-colors"
          title="Revocar seat"
        >
          <UserMinus className="size-[15px]" aria-hidden />
        </button>
      )}
      {!isRevoked && !isAssigned && (
        <span
          className="size-8 inline-flex items-center justify-center text-[var(--text-faint)]"
          aria-hidden
          title="Seat disponible para invitar"
        >
          <UserCheck className="size-[15px]" />
        </span>
      )}
    </li>
  )
}
