import { useEffect, useState } from 'react'
import { Search, Users, BookOpen, Mail, X } from 'lucide-react'
import { listAllUsers, type UserListItem } from '@/lib/admin'
import { PageHeader } from '@/components/PageHeader'
import { Callout } from '@/components/Callout'

export function AdminUsersListPage() {
  const [users, setUsers] = useState<UserListItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce simple para no consultar en cada tecla
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 250)
    return () => clearTimeout(id)
  }, [search])

  useEffect(() => {
    let canceled = false
    setUsers(null)
    listAllUsers({ search: debouncedSearch, limit: 100 })
      .then(u => {
        if (!canceled) setUsers(u)
      })
      .catch(e => {
        if (!canceled) setError(e instanceof Error ? e.message : String(e))
      })
    return () => {
      canceled = true
    }
  }, [debouncedSearch])

  return (
    <div className="max-w-5xl">
      <PageHeader
        eyebrow="Panel admin"
        title="Usuarios"
        description="Alumnos registrados en la plataforma. Búsqueda por email."
      />

      {/* Buscador */}
      <div className="mt-6 relative max-w-sm">
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

      {error && (
        <Callout kind="warning" className="mt-4">
          <p className="text-[13px] m-0">{error}</p>
        </Callout>
      )}

      {users == null ? (
        <div className="mt-4 space-y-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="h-14 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] animate-pulse"
            />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface)] p-8 text-center">
          <Users className="size-10 mx-auto text-[var(--text-muted)] mb-3" aria-hidden />
          <p className="text-[14px] text-[var(--text-secondary)]">
            {debouncedSearch
              ? `Ningún usuario coincide con "${debouncedSearch}".`
              : 'Aún no hay usuarios registrados en la plataforma.'}
          </p>
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[var(--border-default)] bg-[var(--bg-surface-2)]">
                <th className="text-left px-4 py-2.5 font-semibold text-[11.5px] uppercase tracking-[0.06em] text-[var(--text-muted)]">
                  Email
                </th>
                <th className="text-left px-4 py-2.5 font-semibold text-[11.5px] uppercase tracking-[0.06em] text-[var(--text-muted)]">
                  Nombre
                </th>
                <th className="text-left px-4 py-2.5 font-semibold text-[11.5px] uppercase tracking-[0.06em] text-[var(--text-muted)]">
                  Cursos accesibles
                </th>
                <th className="text-left px-4 py-2.5 font-semibold text-[11.5px] uppercase tracking-[0.06em] text-[var(--text-muted)]">
                  Alta
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr
                  key={u.id}
                  className="border-b border-[var(--border-subtle)] last:border-b-0 hover:bg-[var(--bg-surface-hover)]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail
                        className="size-[12px] text-[var(--text-muted)] shrink-0"
                        aria-hidden
                      />
                      <span className="text-[var(--text-primary)] truncate">{u.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">
                    {u.displayName ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-[var(--text-secondary)]">
                      <BookOpen className="size-[12px]" aria-hidden />
                      <span className="font-mono tabular-nums">
                        {u.accessibleCoursesCount}
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[var(--text-muted)]">
                    {new Date(u.createdAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
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
