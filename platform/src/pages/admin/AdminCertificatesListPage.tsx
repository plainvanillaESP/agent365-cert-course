import { useEffect, useState } from 'react'
import { Award, Mail, ExternalLink, Search, X } from 'lucide-react'
import { listIssuedCertificates, type IssuedCertificateRow } from '@/lib/admin'
import { listCourses } from '@/lib/coursesRegistry'
import { PageHeader } from '@/components/PageHeader'
import { Callout } from '@/components/Callout'

export function AdminCertificatesListPage() {
  const [certs, setCerts] = useState<IssuedCertificateRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [courseSlug, setCourseSlug] = useState<string>('')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const courses = listCourses()

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 250)
    return () => clearTimeout(id)
  }, [search])

  useEffect(() => {
    let canceled = false
    setCerts(null)
    listIssuedCertificates({
      courseSlug: courseSlug || undefined,
      search: debouncedSearch || undefined,
      limit: 200,
    })
      .then(c => {
        if (!canceled) setCerts(c)
      })
      .catch(e => {
        if (!canceled) setError(e instanceof Error ? e.message : String(e))
      })
    return () => {
      canceled = true
    }
  }, [courseSlug, debouncedSearch])

  return (
    <div className="max-w-5xl">
      <PageHeader
        eyebrow="Panel admin"
        title="Certificados emitidos"
        description="Histórico de exámenes aprobados con su puntuación. Cada certificado tiene una URL pública de verificación."
      />

      {/* Filtros */}
      <div className="mt-6 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 size-[15px] text-[var(--text-muted)]"
            aria-hidden
          />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por email…"
            className="w-full pl-9 pr-9 py-2 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[var(--color-pv-purple-500)]"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Limpiar búsqueda"
              className="absolute right-2 top-1/2 -translate-y-1/2 size-6 inline-flex items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)]"
            >
              <X className="size-[14px]" aria-hidden />
            </button>
          )}
        </div>
        <select
          value={courseSlug}
          onChange={e => setCourseSlug(e.target.value)}
          className="px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--color-pv-purple-500)]"
        >
          <option value="">Todos los cursos</option>
          {courses.map(c => (
            <option key={c.slug} value={c.slug}>
              {c.shortTitle ?? c.title}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <Callout kind="warning" className="mt-4">
          <p className="text-[13px] m-0">{error}</p>
        </Callout>
      )}

      {certs == null ? (
        <div className="mt-4 space-y-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="h-14 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] animate-pulse"
            />
          ))}
        </div>
      ) : certs.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface)] p-8 text-center">
          <Award className="size-10 mx-auto text-[var(--text-muted)] mb-3" aria-hidden />
          <p className="text-[14px] text-[var(--text-secondary)]">
            {debouncedSearch || courseSlug
              ? 'No hay certificados que coincidan con los filtros.'
              : 'Aún no se ha emitido ningún certificado.'}
          </p>
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[var(--border-default)] bg-[var(--bg-surface-2)]">
                <th className="text-left px-4 py-2.5 font-semibold text-[11.5px] uppercase tracking-[0.06em] text-[var(--text-muted)]">
                  Alumno
                </th>
                <th className="text-left px-4 py-2.5 font-semibold text-[11.5px] uppercase tracking-[0.06em] text-[var(--text-muted)]">
                  Curso
                </th>
                <th className="text-left px-4 py-2.5 font-semibold text-[11.5px] uppercase tracking-[0.06em] text-[var(--text-muted)]">
                  Nota
                </th>
                <th className="text-left px-4 py-2.5 font-semibold text-[11.5px] uppercase tracking-[0.06em] text-[var(--text-muted)]">
                  Emitido
                </th>
                <th className="text-left px-4 py-2.5 font-semibold text-[11.5px] uppercase tracking-[0.06em] text-[var(--text-muted)]">
                  Verificación
                </th>
              </tr>
            </thead>
            <tbody>
              {certs.map(c => (
                <tr
                  key={c.attemptId}
                  className="border-b border-[var(--border-subtle)] last:border-b-0 hover:bg-[var(--bg-surface-hover)]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail
                        className="size-[12px] text-[var(--text-muted)] shrink-0"
                        aria-hidden
                      />
                      <div className="min-w-0">
                        <div className="text-[var(--text-primary)] truncate">
                          {c.email ?? '—'}
                        </div>
                        {c.displayName && (
                          <div className="text-[11.5px] text-[var(--text-muted)] truncate">
                            {c.displayName}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[12.5px] text-[var(--text-secondary)]">
                      {c.courseSlug}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono font-semibold text-[var(--text-primary)] tabular-nums">
                      {Math.round(c.scorePct)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[var(--text-muted)]">
                    {new Date(c.submittedAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    {c.verificationId ? (
                      <a
                        href={`/cert/${c.verificationId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--color-pv-purple-600)] dark:text-[var(--color-pv-purple-300)] hover:underline no-underline"
                      >
                        Ver
                        <ExternalLink className="size-[12px]" aria-hidden />
                      </a>
                    ) : (
                      <span className="text-[12px] text-[var(--text-muted)]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
