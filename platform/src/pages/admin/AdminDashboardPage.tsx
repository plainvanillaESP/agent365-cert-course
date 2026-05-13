import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  Building2,
  Armchair,
  ShoppingCart,
  Award,
  ArrowRight,
  Plus,
} from 'lucide-react'
import { getDashboardKPIs, type DashboardKPIs } from '@/lib/admin'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { Callout } from '@/components/Callout'

export function AdminDashboardPage() {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let canceled = false
    setLoading(true)
    getDashboardKPIs()
      .then(k => {
        if (!canceled) setKpis(k)
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
  }, [])

  return (
    <div className="max-w-6xl">
      <PageHeader
        eyebrow="Panel admin"
        title="Dashboard"
        description="Vista global de la plataforma. Usuarios, ventas, organizaciones y certificados emitidos."
      />

      {error && (
        <Callout kind="warning" className="mt-6">
          <p className="text-[13px] m-0">{error}</p>
        </Callout>
      )}

      {/* KPIs */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <KPICard
          icon={<Users className="size-[18px] stroke-[1.75]" aria-hidden />}
          label="Usuarios totales"
          value={kpis?.totalUsers ?? null}
          loading={loading}
        />
        <KPICard
          icon={<Building2 className="size-[18px] stroke-[1.75]" aria-hidden />}
          label="Organizaciones"
          value={kpis?.totalOrganizations ?? null}
          loading={loading}
        />
        <KPICard
          icon={<Armchair className="size-[18px] stroke-[1.75]" aria-hidden />}
          label="Seats activos"
          value={kpis?.totalSeatsInUse ?? null}
          subValue={kpis ? `${kpis.assignedSeats} asignados` : null}
          loading={loading}
        />
        <KPICard
          icon={<ShoppingCart className="size-[18px] stroke-[1.75]" aria-hidden />}
          label="Ventas este mes"
          value={kpis?.purchasesThisMonth ?? null}
          loading={loading}
        />
        <KPICard
          icon={<Award className="size-[18px] stroke-[1.75]" aria-hidden />}
          label="Certificados emitidos"
          value={kpis?.certificatesIssued ?? null}
          loading={loading}
        />
      </div>

      {/* Acciones rápidas */}
      <div className="mt-10">
        <h2 className="text-[15px] font-semibold text-[var(--text-primary)] mb-3">
          Acciones rápidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <QuickAction
            to="/admin/organizaciones/nueva"
            icon={<Plus className="size-[16px] stroke-[2]" aria-hidden />}
            title="Crear organización"
            description="Da de alta una empresa cliente para venderle seats B2B"
          />
          <QuickAction
            to="/admin/organizaciones"
            icon={<Building2 className="size-[16px] stroke-[2]" aria-hidden />}
            title="Ver organizaciones"
            description="Lista completa con seats contratados y asignados"
          />
        </div>
      </div>

      {kpis && kpis.totalOrganizations === 0 && !loading && (
        <Callout kind="info" className="mt-10">
          <p className="text-[13px] m-0">
            Aún no hay organizaciones. Empieza creando la primera para
            poder asignarle seats del curso.
          </p>
          <div className="mt-3">
            <Link to="/admin/organizaciones/nueva">
              <Button variant="primary" size="sm" iconLeft={<Plus className="size-[14px]" />}>
                Crear primera organización
              </Button>
            </Link>
          </div>
        </Callout>
      )}
    </div>
  )
}

function KPICard({
  icon,
  label,
  value,
  subValue,
  loading,
}: {
  icon: React.ReactNode
  label: string
  value: number | null
  subValue?: string | null
  loading: boolean
}) {
  return (
    <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
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

function QuickAction({
  to,
  icon,
  title,
  description,
}: {
  to: string
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Link
      to={to}
      className="group block px-4 py-3.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface-hover)] transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pv-purple-500)]"
    >
      <div className="flex items-start gap-3">
        <div className="size-9 rounded-md bg-[var(--color-pv-purple-500)]/10 text-[var(--color-pv-purple-700)] dark:text-[var(--color-pv-purple-300)] flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-[14px] text-[var(--text-primary)] leading-tight">
              {title}
            </p>
            <ArrowRight
              className="size-[14px] text-[var(--text-muted)] group-hover:text-[var(--text-primary)] group-hover:translate-x-0.5 transition-all shrink-0"
              aria-hidden
            />
          </div>
          <p className="text-[12.5px] text-[var(--text-muted)] mt-1 leading-snug">
            {description}
          </p>
        </div>
      </div>
    </Link>
  )
}
