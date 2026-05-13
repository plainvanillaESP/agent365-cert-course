import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Building2, ArrowRight, Mail } from 'lucide-react'
import { listOrganizations } from '@/lib/admin'
import type { Organization } from '@/lib/billing'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { Callout } from '@/components/Callout'

export function AdminOrganizationsListPage() {
  const [orgs, setOrgs] = useState<Organization[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let canceled = false
    listOrganizations()
      .then(o => {
        if (!canceled) setOrgs(o)
      })
      .catch(e => {
        if (!canceled) setError(e instanceof Error ? e.message : String(e))
      })
    return () => {
      canceled = true
    }
  }, [])

  return (
    <div className="max-w-6xl">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <PageHeader
          eyebrow="Panel admin"
          title="Organizaciones"
          description="Empresas cliente con contratos de seats B2B."
        />
        <Link to="/admin/organizaciones/nueva">
          <Button variant="primary" iconLeft={<Plus className="size-[16px]" />}>
            Nueva organización
          </Button>
        </Link>
      </div>

      {error && (
        <Callout kind="warning">
          <p className="text-[13px] m-0">{error}</p>
        </Callout>
      )}

      {!orgs && !error && (
        <div className="space-y-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="h-20 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] animate-pulse"
            />
          ))}
        </div>
      )}

      {orgs && orgs.length === 0 && (
        <div className="rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface)] p-8 text-center">
          <Building2 className="size-10 mx-auto text-[var(--text-muted)] mb-3" aria-hidden />
          <p className="text-[14px] text-[var(--text-secondary)] mb-4">
            Aún no hay ninguna organización dada de alta. Crea la primera
            para poder contratarle seats del curso.
          </p>
          <Link to="/admin/organizaciones/nueva">
            <Button variant="primary" iconLeft={<Plus className="size-[16px]" />}>
              Crear primera organización
            </Button>
          </Link>
        </div>
      )}

      {orgs && orgs.length > 0 && (
        <ul className="space-y-2">
          {orgs.map(org => (
            <li key={org.id}>
              <Link
                to={`/admin/organizaciones/${org.slug}`}
                className="group block rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface-hover)] transition-colors p-4 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pv-purple-500)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <h3 className="text-[15px] font-semibold text-[var(--text-primary)] truncate">
                        {org.name}
                      </h3>
                      <span className="text-[11px] font-mono text-[var(--text-muted)] tabular-nums">
                        /{org.slug}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[12.5px] text-[var(--text-muted)]">
                      <Mail className="size-[12px]" aria-hidden />
                      <span className="truncate">{org.contactEmail}</span>
                    </div>
                    {org.taxId && (
                      <div className="text-[12px] text-[var(--text-muted)] mt-1">
                        {org.taxId}
                        {org.country ? `, ${org.country}` : ''}
                      </div>
                    )}
                  </div>
                  <ArrowRight
                    className="size-[16px] text-[var(--text-muted)] group-hover:text-[var(--text-primary)] group-hover:translate-x-0.5 transition-all shrink-0 mt-1"
                    aria-hidden
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
