import { Link } from 'react-router-dom'
import {
  BookOpen,
  Newspaper,
  FileText,
  FolderGit2,
  Globe,
  ExternalLink,
  ArrowUpRight,
  ChevronRight,
  AlertCircle,
} from 'lucide-react'
import {
  type Resource,
  type ResourceType,
  type CrossReference,
  hostnameOf,
  getResourcesForModule,
} from '@/lib/resources'
import { findModule } from '@/lib/course'

interface ResourcesProps {
  moduleId: number
}

export function Resources({ moduleId }: ResourcesProps) {
  const data = getResourcesForModule(moduleId)
  if (!data) {
    return (
      <div className="rounded-md border border-[var(--border-default)] bg-[var(--bg-surface-2)] p-6 text-center">
        <p className="text-[14px] text-[var(--text-secondary)]">
          Este módulo todavía no tiene recursos publicados.
        </p>
      </div>
    )
  }

  // ¿Hay alguna categoría con fuentes externas? -> mostrar nota al final
  const hasExternal = data.categories.some(c =>
    c.resources.some(r => r.type === 'external'),
  )

  return (
    <div className="space-y-10">
      {data.intro && (
        <p className="text-[14.5px] leading-relaxed text-[var(--text-secondary)] max-w-[680px]">
          {data.intro}
        </p>
      )}

      {data.categories.map(cat => (
        <section key={cat.id} className="space-y-4">
          <header>
            <h2 className="font-display text-[18px] sm:text-[19px] font-semibold text-[var(--text-primary)] leading-tight tracking-[-0.01em]">
              {cat.title}
            </h2>
            {cat.description && (
              <p className="text-[13.5px] text-[var(--text-secondary)] mt-1.5 max-w-[640px]">
                {cat.description}
              </p>
            )}
          </header>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none p-0 m-0">
            {cat.resources.map(r => (
              <li key={r.url}>
                <ResourceCard resource={r} />
              </li>
            ))}
          </ul>
        </section>
      ))}

      {hasExternal && data.externalNote && (
        <aside className="rounded-md border border-amber-500/40 bg-amber-500/[0.06] p-4 flex items-start gap-3">
          <AlertCircle
            className="size-[16px] text-amber-600 dark:text-amber-400 stroke-[1.75] shrink-0 mt-0.5"
            aria-hidden
          />
          <p className="text-[13px] leading-relaxed text-[var(--text-secondary)] m-0">
            {data.externalNote}
          </p>
        </aside>
      )}

      {data.crossReferences.length > 0 && <CrossReferencesSection items={data.crossReferences} />}
    </div>
  )
}

/* ------------------------------ Subcomponentes ------------------------------ */

function ResourceCard({ resource }: { resource: Resource }) {
  const { Icon, label, color } = decorationFor(resource.type)

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer noopener"
      className="group block h-full rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-[var(--color-pv-purple-500)] hover:bg-[var(--bg-surface-hover)] transition-colors no-underline"
    >
      <div className="p-4 flex flex-col h-full gap-2.5">
        <div className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          <Icon className={`size-[13px] stroke-[1.75] ${color}`} aria-hidden />
          <span>{label}</span>
          {resource.date && (
            <>
              <span className="text-[var(--text-faint)]">·</span>
              <span className="font-normal normal-case tracking-normal">{resource.date}</span>
            </>
          )}
          {resource.lang === 'en' && (
            <span className="ml-auto inline-block px-1.5 py-px rounded text-[9.5px] font-mono font-semibold text-[var(--text-muted)] bg-[var(--bg-surface-2)] tracking-normal">
              EN
            </span>
          )}
        </div>

        <h3 className="font-display text-[14px] font-semibold leading-snug text-[var(--text-primary)] m-0">
          {resource.title}
        </h3>

        {resource.description && (
          <p className="text-[12.5px] leading-relaxed text-[var(--text-secondary)] m-0 flex-1">
            {resource.description}
          </p>
        )}

        <div className="flex items-center gap-1.5 text-[11.5px] text-[var(--text-muted)] mt-1 pt-2 border-t border-[var(--border-subtle)]">
          <span className="font-mono truncate">{hostnameOf(resource.url)}</span>
          <ArrowUpRight
            className="size-[12px] text-[var(--text-faint)] group-hover:text-[var(--color-pv-purple-500)] transition-colors ml-auto shrink-0"
            aria-hidden
          />
        </div>
      </div>
    </a>
  )
}

function CrossReferencesSection({ items }: { items: CrossReference[] }) {
  return (
    <section className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
      <header>
        <h2 className="font-display text-[18px] sm:text-[19px] font-semibold text-[var(--text-primary)] leading-tight tracking-[-0.01em]">
          Continuación en otros módulos
        </h2>
        <p className="text-[13.5px] text-[var(--text-secondary)] mt-1.5">
          Cada tema introducido aquí se trata en profundidad más adelante.
        </p>
      </header>
      <ul className="rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] divide-y divide-[var(--border-subtle)] list-none p-0 m-0">
        {items.map(cr => (
          <li key={`${cr.moduleId}-${cr.topic}`}>
            <CrossReferenceRow item={cr} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function CrossReferenceRow({ item }: { item: CrossReference }) {
  const target = findModule(item.moduleId)
  const isProduced = !!target?.faseProduccion && target.faseProduccion <= 2

  if (target && isProduced) {
    return (
      <Link
        to={`/modulo/${target.id}/teoria`}
        className="grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-3 hover:bg-[var(--bg-surface-hover)] transition-colors no-underline"
      >
        <Topic topic={item.topic} moduleTitle={item.moduleTitle} moduleId={item.moduleId} />
        <ChevronRight
          className="size-[14px] text-[var(--text-faint)] shrink-0"
          aria-hidden
        />
      </Link>
    )
  }

  // Módulo todavía no producido: render inerte
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-3 opacity-70">
      <Topic topic={item.topic} moduleTitle={item.moduleTitle} moduleId={item.moduleId} />
      <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)] shrink-0">
        Próximamente
      </span>
    </div>
  )
}

function Topic({
  topic,
  moduleTitle,
  moduleId,
}: {
  topic: string
  moduleTitle: string
  moduleId: number
}) {
  return (
    <div className="min-w-0">
      <div className="text-[14px] font-medium text-[var(--text-primary)] leading-snug">
        {topic}
      </div>
      <div className="text-[12px] text-[var(--text-muted)] mt-0.5">
        Módulo {String(moduleId).padStart(2, '0')} · {moduleTitle}
      </div>
    </div>
  )
}

/* --------------------------- Decoración por tipo --------------------------- */

function decorationFor(type: ResourceType): {
  Icon: typeof BookOpen
  label: string
  color: string
} {
  switch (type) {
    case 'docs':
      return { Icon: BookOpen,     label: 'Documentación', color: 'text-[var(--color-pv-purple-500)]' }
    case 'blog':
      return { Icon: Newspaper,    label: 'Blog',          color: 'text-blue-600 dark:text-blue-400' }
    case 'whitepaper':
      return { Icon: FileText,     label: 'Whitepaper',    color: 'text-emerald-600 dark:text-emerald-400' }
    case 'github':
      return { Icon: FolderGit2,   label: 'GitHub',        color: 'text-[var(--text-primary)]' }
    case 'commercial':
      return { Icon: Globe,        label: 'Producto',      color: 'text-cyan-600 dark:text-cyan-400' }
    case 'external':
      return { Icon: ExternalLink, label: 'Lectura',       color: 'text-amber-600 dark:text-amber-400' }
  }
}
