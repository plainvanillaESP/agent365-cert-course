import { useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import {
  Armchair,
  UserCheck,
  UserPlus,
  Award,
  Plus,
  ArrowRight,
} from 'lucide-react'
import {
  getOrganizationKPIs,
  listSubscriptionsForOrganization,
  type OrgKPIs,
} from '@/lib/admin'
import type { OrganizationSubscription } from '@/lib/billing'
import { PageHeader } from '@/components/PageHeader'
import { Callout } from '@/components/Callout'
import { Button } from '@/components/Button'
import type { OrgContextValue } from '@/components/OrgAdminLayout'

export function OrgDashboardPage() {
  const ctx = useOutletContext<OrgContextValue>()
  const [kpis, setKpis] = useState<OrgKPIs | null>(null)
  const [subs, setSubs] = useState<OrganizationSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let canceled = false
    setLoading(true)
    Promise.all([
      getOrganizationKPIs(ctx.organizationId),
      listSubscriptionsForOrganization(ctx.organizationId),
    ])
      .then(([k, s]) => {
        if (canceled) return
        setKpis(k)
        setSubs(s)
      })
      .catch(e => {
        if (!canceled) setError(e instanceof Error ? e.message : String(e))
      })
      .finally(() => {
        if (!canceled) setLoading(false)
      })
    return () => {
      canceled = true
    }
  }, [ctx.organizationId])

  return (
    <div className="max-w-5xl">
      <PageHeader
        eyebrow={ctx.organizationName}
        title="Dashboard"
        description="Vista general de los seats contratados, su asignación y el progreso del equipo."
      />

      {error && (
        <Callout kind="warning" className="mt-6">
          <p className="text-[13px] m-0">{error}</p>
        </Callout>
      )}

      {/* KPIs */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard
          icon={<Armchair className="size-[18px] stroke-[1.75]" aria-hidden />}
          label="Seats contratados"
          value={kpis?.seatsTotal ?? null}
          loading={loading}
        />
        <KPICard
          icon={<UserCheck className="size-[18px] stroke-[1.75]" aria-hidden />}
          label="Asignados"
          value={kpis?.seatsAssigned ?? null}
          subValue={
            kpis && kpis.seatsTotal > 0
              ? `${Math.round((kpis.seatsAssigned / kpis.seatsTotal) * 100)}% del total`
              : null
          }
          loading={loading}
        />
        <KPICard
          icon={<UserPlus className="size-[18px] stroke-[1.75]" aria-hidden />}
          label="Vacantes"
          value={kpis?.seatsVacant ?? null}
          loading={loading}
          tone={kpis && kpis.seatsVacant > 0 ? 'accent' : 'default'}
        />
        <KPICard
          icon={<Award className="size-[18px] stroke-[1.75]" aria-hidden />}
          label="Certificados"
          value={kpis?.certificatesIssued ?? null}
          loading={loading}
        />
      </div>

      {/* Acciones rápidas */}
      {kpis && kpis.seatsVacant > 0 && (
        <div className="mt-10">
          <div className="rounded-lg border border-[var(--color-pv-purple-500)]/30 bg-[var(--color-pv-purple-500)]/5 p-5 flex items-start gap-4">
            <div className="size-10 rounded-md bg-[var(--color-pv-purple-500)]/15 text-[var(--color-pv-purple-700)] dark:text-[var(--color-pv-purple-300)] flex items-center justify-center shrink-0">
              <UserPlus className="size-[18px]" aria-hidden />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[14px] text-[var(--text-primary)] mb-1">
                Tienes {kpis.seatsVacant} seat{kpis.seatsVacant === 1 ? '' : 's'} sin asignar
              </h3>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-3">
                Invita a los miembros de tu equipo introduciendo sus emails. Recibirán un
                enlace de acceso al curso.
              </p>
              <Link to={`/org/${ctx.organizationSlug}/admin/seats/invitar`}>
                <Button
                  variant="primary"
                  size="sm"
                  iconLeft={<Plus className="size-[14px]" />}
                >
                  Invitar a mi equipo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Subscriptions */}
      <div className="mt-10">
        <h2 className="text-[14px] font-semibold text-[var(--text-primary)] mb-3">
          Cursos contratados
        </h2>
        {loading && (
          <div className="space-y-2">
            {[0, 1].map(i => (
              <div
                key={i}
                className="h-20 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] animate-pulse"
              />
            ))}
          </div>
        )}
        {!loading && subs.length === 0 && (
          <Callout kind="info">
            <p className="text-[13px] m-0">
              Esta organización aún no tiene cursos contratados. Contacta con Plain Vanilla
              para activar una subscription.
            </p>
          </Callout>
        )}
        {!loading && subs.length > 0 && (
          <ul className="space-y-2">
            {subs.map(sub => (
              <li key={sub.id}>
                <Link
                  to={`/org/${ctx.organizationSlug}/admin/seats?curso=${sub.courseSlug}`}
                  className="group block rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface-hover)] transition-colors p-4 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pv-purple-500)]"
                >
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-[var(--text-primary)] font-mono mb-1">
                        {sub.courseSlug}
                      </p>
                      <p className="text-[12.5px] text-[var(--text-muted)]">
                        {sub.seatsTotal} seat{sub.seatsTotal === 1 ? '' : 's'} contratado
                        {sub.seatsTotal === 1 ? '' : 's'}
                        {sub.expiresAt
                          ? `, caduca el ${new Date(sub.expiresAt).toLocaleDateString('es-ES')}`
                          : ', sin caducidad'}
                      </p>
                    </div>
                    <ArrowRight
                      className="size-[14px] text-[var(--text-muted)] group-hover:text-[var(--text-primary)] group-hover:translate-x-0.5 transition-all shrink-0"
                      aria-hidden
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function KPICard({
  icon,
  label,
  value,
  subValue,
  loading,
  tone = 'default',
}: {
  icon: React.ReactNode
  label: string
  value: number | null
  subValue?: string | null
  loading: boolean
  tone?: 'default' | 'accent'
}) {
  return (
    <div
      className={[
        'rounded-lg border p-4',
        tone === 'accent'
          ? 'border-[var(--color-pv-purple-500)]/30 bg-[var(--color-pv-purple-500)]/5'
          : 'border-[var(--border-default)] bg-[var(--bg-surface)]',
      ].join(' ')}
    >
      <div className="flex items-center gap-2 text-[var(--text-muted)] mb-2">
        {icon}
        <span className="text-[12px] uppercase tracking-[0.06em] font-semibold">
          {label}
        </span>
      </div>
      {loading ? (
        <div className="h-8 w-16 rounded bg-[var(--bg-surface-2)] animate-pulse" />
      ) : (
        <div className="text-[28px] font-bold tabular-nums text-[var(--text-primary)] leading-none">
          {value ?? 0}
        </div>
      )}
      {subValue && !loading && (
        <div className="text-[12px] text-[var(--text-muted)] mt-1">{subValue}</div>
      )}
    </div>
  )
}
