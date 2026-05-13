import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Mail, Clock, CheckCircle2, Users } from 'lucide-react'
import {
  listSubscriptionsForOrganization,
  getTeamProgressForOrganization,
  type TeamMemberProgress,
} from '@/lib/admin'
import type { OrganizationSubscription } from '@/lib/billing'
import { listCourses } from '@/lib/coursesRegistry'
import { PageHeader } from '@/components/PageHeader'
import { Callout } from '@/components/Callout'
import type { OrgContextValue } from '@/components/OrgAdminLayout'

export function OrgTeamProgressPage() {
  const ctx = useOutletContext<OrgContextValue>()
  const [subs, setSubs] = useState<OrganizationSubscription[]>([])
  const [activeCourse, setActiveCourse] = useState<string>('')
  const [progress, setProgress] = useState<TeamMemberProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let canceled = false
    setLoading(true)
    listSubscriptionsForOrganization(ctx.organizationId)
      .then(s => {
        if (canceled) return
        setSubs(s)
        if (s.length > 0) setActiveCourse(s[0].courseSlug)
        else setLoading(false)
      })
      .catch(e => {
        if (!canceled) setError(e instanceof Error ? e.message : String(e))
        if (!canceled) setLoading(false)
      })
    return () => {
      canceled = true
    }
  }, [ctx.organizationId])

  useEffect(() => {
    if (!activeCourse) return
    let canceled = false
    setLoading(true)
    getTeamProgressForOrganization(ctx.organizationId, activeCourse)
      .then(p => {
        if (!canceled) setProgress(p)
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
  }, [ctx.organizationId, activeCourse])

  // Estadísticas agregadas
  const totalSeats = progress.length
  const activeUsers = progress.filter(p => p.userId != null).length
  const certified = progress.filter(p => p.passedExam).length
  const avgProgress =
    activeUsers > 0
      ? Math.round(
          progress.filter(p => p.userId != null).reduce((a, p) => a + p.progressPct, 0) /
            activeUsers,
        )
      : 0

  return (
    <div className="max-w-5xl">
      <PageHeader
        eyebrow={ctx.organizationName}
        title="Progreso del equipo"
        description="Estado de cada alumno: si ya se ha registrado, qué porcentaje ha completado y si tiene el certificado."
      />

      {error && (
        <Callout kind="warning" className="mt-6">
          <p className="text-[13px] m-0">{error}</p>
        </Callout>
      )}

      {/* Selector de curso */}
      {subs.length > 1 && (
        <div className="mt-6 flex items-center gap-3">
          <label className="text-[12.5px] font-medium text-[var(--text-secondary)]">
            Curso:
          </label>
          <select
            value={activeCourse}
            onChange={e => setActiveCourse(e.target.value)}
            className="px-3 py-1.5 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--color-pv-purple-500)]"
          >
            {subs.map(sub => {
              const course = listCourses().find(c => c.slug === sub.courseSlug)
              return (
                <option key={sub.id} value={sub.courseSlug}>
                  {course?.title ?? sub.courseSlug}
                </option>
              )
            })}
          </select>
        </div>
      )}

      {/* Stats agregados */}
      {!loading && subs.length > 0 && (
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            icon={<Users className="size-[16px] stroke-[1.75]" aria-hidden />}
            label="Asignados"
            value={totalSeats}
          />
          <StatCard
            icon={<CheckCircle2 className="size-[16px] stroke-[1.75]" aria-hidden />}
            label="Activos"
            value={activeUsers}
            subValue={totalSeats > 0 ? `${Math.round((activeUsers / totalSeats) * 100)}%` : null}
          />
          <StatCard
            icon={<Clock className="size-[16px] stroke-[1.75]" aria-hidden />}
            label="Progreso medio"
            value={avgProgress}
            unit="%"
          />
          <StatCard
            icon={<CheckCircle2 className="size-[16px] stroke-[1.75]" aria-hidden />}
            label="Certificados"
            value={certified}
          />
        </div>
      )}

      {/* Tabla del equipo */}
      <div className="mt-8">
        {subs.length === 0 && !loading && (
          <Callout kind="info">
            <p className="text-[13px] m-0">
              Esta organización aún no tiene cursos contratados.
            </p>
          </Callout>
        )}

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

        {!loading && subs.length > 0 && progress.length === 0 && (
          <div className="rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface)] p-8 text-center">
            <Users className="size-8 mx-auto text-[var(--text-muted)] mb-2" aria-hidden />
            <p className="text-[13px] text-[var(--text-secondary)]">
              Aún no has asignado ningún seat. Invita a tu equipo para verlo aquí.
            </p>
          </div>
        )}

        {!loading && progress.length > 0 && (
          <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] overflow-hidden">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[var(--border-default)] bg-[var(--bg-surface-2)]">
                  <th className="text-left px-4 py-2.5 font-semibold text-[11.5px] uppercase tracking-[0.06em] text-[var(--text-muted)]">
                    Email
                  </th>
                  <th className="text-left px-4 py-2.5 font-semibold text-[11.5px] uppercase tracking-[0.06em] text-[var(--text-muted)]">
                    Estado
                  </th>
                  <th className="text-left px-4 py-2.5 font-semibold text-[11.5px] uppercase tracking-[0.06em] text-[var(--text-muted)]">
                    Progreso
                  </th>
                  <th className="text-left px-4 py-2.5 font-semibold text-[11.5px] uppercase tracking-[0.06em] text-[var(--text-muted)]">
                    Última actividad
                  </th>
                  <th className="text-left px-4 py-2.5 font-semibold text-[11.5px] uppercase tracking-[0.06em] text-[var(--text-muted)]">
                    Certificado
                  </th>
                </tr>
              </thead>
              <tbody>
                {progress.map(p => (
                  <tr
                    key={p.seatId}
                    className="border-b border-[var(--border-subtle)] last:border-b-0 hover:bg-[var(--bg-surface-hover)]"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <Mail className="size-[12px] text-[var(--text-muted)] shrink-0" aria-hidden />
                        <span className="truncate text-[var(--text-primary)]">
                          {p.email ?? <span className="italic text-[var(--text-muted)]">Sin asignar</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {p.userId ? (
                        <span className="inline-flex items-center px-1.5 h-5 rounded-full text-[10.5px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                          Registrado
                        </span>
                      ) : p.email ? (
                        <span className="inline-flex items-center px-1.5 h-5 rounded-full text-[10.5px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300">
                          Invitado
                        </span>
                      ) : (
                        <span className="text-[var(--text-muted)] text-[12px]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {p.userId ? (
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <div className="h-1.5 w-16 rounded-full bg-[var(--bg-surface-2)] overflow-hidden">
                            <div
                              className="h-full bg-[var(--color-pv-purple-500)]"
                              style={{ width: `${p.progressPct}%` }}
                            />
                          </div>
                          <span className="font-mono tabular-nums text-[12px] text-[var(--text-secondary)]">
                            {p.progressPct}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-[var(--text-muted)] text-[12px]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[var(--text-muted)]">
                      {p.lastActivity
                        ? new Date(p.lastActivity).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {p.passedExam ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300 text-[12.5px] font-medium">
                          <CheckCircle2 className="size-[13px]" aria-hidden />
                          Emitido
                        </span>
                      ) : (
                        <span className="text-[var(--text-muted)] text-[12px]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  subValue,
  unit,
}: {
  icon: React.ReactNode
  label: string
  value: number
  subValue?: string | null
  unit?: string
}) {
  return (
    <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-3">
      <div className="flex items-center gap-1.5 text-[var(--text-muted)] mb-1.5">
        {icon}
        <span className="text-[11px] uppercase tracking-[0.06em] font-semibold">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-[22px] font-bold tabular-nums text-[var(--text-primary)] leading-none">
          {value}
        </span>
        {unit && (
          <span className="text-[14px] font-semibold text-[var(--text-muted)]">{unit}</span>
        )}
      </div>
      {subValue && (
        <div className="text-[11.5px] text-[var(--text-muted)] mt-1">{subValue}</div>
      )}
    </div>
  )
}
