import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, BookOpen, ListChecks, FlaskConical, Link as LinkIcon, Hash, X } from 'lucide-react'
import { Modal } from '@/components/Modal'
import { KeyCombo } from '@/hooks/useKeyboardShortcuts'
import { searchCourse, highlight, type SearchResult, type SearchResultType } from '@/lib/search'
import { IconButton } from '@/components/Button'

interface SearchPaletteProps {
  open: boolean
  onClose: () => void
}

const TYPE_ICON: Record<SearchResultType, typeof Search> = {
  module: Hash,
  theory: BookOpen,
  quiz: ListChecks,
  lab: FlaskConical,
  resource: LinkIcon,
}

const TYPE_ORDER: SearchResultType[] = ['module', 'theory', 'quiz', 'lab', 'resource']
const TYPE_LABEL: Record<SearchResultType, string> = {
  module: 'Módulos',
  theory: 'Teoría',
  quiz: 'Quiz',
  lab: 'Laboratorios',
  resource: 'Recursos',
}

/**
 * Paleta de búsqueda global del curso. Se abre con `Cmd+K` (Mac) /
 * `Ctrl+K` (resto), o con `/`. Indexa títulos, headings de teoría,
 * preguntas del quiz, escenarios de los labs y enlaces de recursos
 * (ver `lib/search.ts`). Navegación con flechas + Enter.
 */
export function SearchPalette({ open, onClose }: SearchPaletteProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Reset query al abrir/cerrar.
  useEffect(() => {
    if (open) {
      setQuery('')
      setSelected(0)
      // Pequeño delay para asegurar que el input está montado.
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  // Cómputo de resultados.
  const results = useMemo(() => {
    if (query.trim().length < 2) return []
    return searchCourse(query, 30)
  }, [query])

  // Si los resultados cambian, resetea la selección al primero.
  useEffect(() => {
    setSelected(0)
  }, [results])

  // Asegurar que el item seleccionado es visible.
  useEffect(() => {
    if (!listRef.current) return
    const node = listRef.current.querySelector<HTMLElement>(
      `[data-search-idx="${selected}"]`,
    )
    node?.scrollIntoView({ block: 'nearest' })
  }, [selected, results])

  // Agrupar resultados por tipo preservando ranking interno.
  const grouped = useMemo(() => {
    const map = new Map<SearchResultType, SearchResult[]>()
    for (const r of results) {
      const arr = map.get(r.type) ?? []
      arr.push(r)
      map.set(r.type, arr)
    }
    return TYPE_ORDER.filter(t => map.has(t)).map(t => ({ type: t, items: map.get(t)! }))
  }, [results])

  // Vista plana ordenada (para navegación por teclado).
  const flat = useMemo(() => grouped.flatMap(g => g.items), [grouped])

  const goToResult = (r: SearchResult) => {
    onClose()
    navigate(r.to)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected(s => Math.min(s + 1, Math.max(0, flat.length - 1)))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected(s => Math.max(0, s - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const r = flat[selected]
      if (r) goToResult(r)
    } else if (e.key === 'Home') {
      e.preventDefault()
      setSelected(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setSelected(Math.max(0, flat.length - 1))
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      ariaLabel="Búsqueda global del curso"
      size="lg"
      contentClassName="!max-w-2xl"
    >
      <div className="-mx-5 -my-4 flex flex-col max-h-[70vh]">
        {/* Cabecera con input y botón X */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-subtle)]">
          <Search className="size-[18px] text-[var(--text-muted)] shrink-0" aria-hidden />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Buscar en el curso… (teoría, quiz, labs, recursos)"
            aria-label="Buscar en el curso"
            aria-autocomplete="list"
            aria-controls="search-results"
            className="flex-1 bg-transparent border-0 outline-none text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
          />
          <IconButton onClick={onClose} label="Cerrar" size="sm">
            <X className="size-[16px]" />
          </IconButton>
        </div>

        {/* Resultados */}
        <div
          ref={listRef}
          id="search-results"
          role="listbox"
          aria-label="Resultados de búsqueda"
          className="flex-1 overflow-y-auto"
        >
          {query.trim().length < 2 ? (
            <EmptyHint />
          ) : flat.length === 0 ? (
            <NoResults query={query} />
          ) : (
            <SearchResultsList
              groups={grouped}
              total={flat.length}
              selected={selected}
              query={query}
              onHover={setSelected}
              onPick={goToResult}
            />
          )}
        </div>

        {/* Pie con atajos visibles */}
        <div className="border-t border-[var(--border-subtle)] px-4 py-2.5 flex items-center justify-between text-[11px] text-[var(--text-muted)]">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <KeyCombo keys={['↑', '↓']} />
              <span>Navegar</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <KeyCombo keys={['Enter']} />
              <span>Abrir</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <KeyCombo keys={['Esc']} />
              <span>Cerrar</span>
            </span>
          </div>
          {flat.length > 0 && (
            <span className="tabular-nums">
              {flat.length} resultado{flat.length === 1 ? '' : 's'}
            </span>
          )}
        </div>
      </div>
    </Modal>
  )
}

/* ------------------------------ Sub-componentes ----------------------------- */

function SearchResultsList({
  groups,
  total,
  selected,
  query,
  onHover,
  onPick,
}: {
  groups: Array<{ type: SearchResultType; items: SearchResult[] }>
  total: number
  selected: number
  query: string
  onHover: (idx: number) => void
  onPick: (r: SearchResult) => void
}) {
  let cursor = 0
  return (
    <div className="py-2">
      {groups.map(group => {
        const startIdx = cursor
        cursor += group.items.length
        return (
          <section key={group.type} className="mb-1.5 last:mb-0">
            <h3 className="px-4 pt-2 pb-1 text-[10.5px] uppercase tracking-[0.08em] text-[var(--text-muted)] font-semibold">
              {TYPE_LABEL[group.type]}
            </h3>
            <ul>
              {group.items.map((r, j) => {
                const idx = startIdx + j
                const isSelected = idx === selected
                return (
                  <ResultRow
                    key={`${r.type}-${idx}-${r.title}`}
                    result={r}
                    selected={isSelected}
                    query={query}
                    index={idx}
                    onHover={() => onHover(idx)}
                    onClick={() => onPick(r)}
                  />
                )
              })}
            </ul>
          </section>
        )
      })}
      <span className="sr-only" aria-live="polite">
        {total} resultados totales
      </span>
    </div>
  )
}

function ResultRow({
  result,
  selected,
  query,
  index,
  onHover,
  onClick,
}: {
  result: SearchResult
  selected: boolean
  query: string
  index: number
  onHover: () => void
  onClick: () => void
}) {
  const Icon = TYPE_ICON[result.type]
  return (
    <li>
      <button
        type="button"
        role="option"
        aria-selected={selected}
        data-search-idx={index}
        onMouseMove={onHover}
        onClick={onClick}
        className={[
          'w-full text-left px-4 py-2.5 flex items-start gap-3 transition-colors',
          'focus:outline-none focus-visible:outline-none',
          selected
            ? 'bg-[var(--bg-active)] text-[var(--text-active)]'
            : 'hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)]',
        ].join(' ')}
      >
        <Icon
          className={[
            'size-[16px] mt-0.5 shrink-0',
            selected ? 'text-[var(--color-pv-purple-600)]' : 'text-[var(--text-muted)]',
          ].join(' ')}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <div className="text-[13.5px] font-medium leading-snug truncate">
            <HighlightText text={result.title} query={query} />
          </div>
          {result.snippet && (
            <div className="text-[12px] text-[var(--text-muted)] mt-0.5 line-clamp-2 leading-snug">
              <HighlightText text={result.snippet} query={query} />
            </div>
          )}
          {result.type !== 'module' && (
            <div className="text-[11px] text-[var(--text-muted)] mt-1 truncate">
              {result.moduleTitle}
            </div>
          )}
        </div>
        <span
          className={[
            'shrink-0 text-[10.5px] uppercase tracking-[0.06em] px-1.5 py-0.5 rounded',
            'border border-[var(--border-subtle)]',
            selected
              ? 'bg-[var(--color-pv-purple-500)]/15 text-[var(--color-pv-purple-700)] dark:text-[var(--color-pv-purple-300)] border-transparent'
              : 'text-[var(--text-muted)]',
          ].join(' ')}
        >
          {result.tag}
        </span>
      </button>
    </li>
  )
}

function HighlightText({ text, query }: { text: string; query: string }) {
  const segments = highlight(text, query)
  return (
    <>
      {segments.map((s, i) =>
        s.match ? (
          <mark
            key={i}
            className="bg-[var(--color-pv-purple-500)]/20 text-[var(--text-primary)] rounded-sm px-0.5"
          >
            {s.text}
          </mark>
        ) : (
          <span key={i}>{s.text}</span>
        ),
      )}
    </>
  )
}

function EmptyHint() {
  return (
    <div className="px-4 py-10 text-center text-[var(--text-muted)] text-[13px]">
      <p>Escribe al menos dos caracteres para buscar.</p>
      <p className="mt-2 text-[12px]">
        Indexa títulos de módulo, secciones de teoría, preguntas del quiz, escenarios de los laboratorios y enlaces de recursos.
      </p>
    </div>
  )
}

function NoResults({ query }: { query: string }) {
  return (
    <div className="px-4 py-10 text-center text-[13px]">
      <p className="text-[var(--text-primary)] font-medium">Sin resultados para «{query}».</p>
      <p className="mt-2 text-[12px] text-[var(--text-muted)]">
        Prueba con menos palabras o sinónimos. La búsqueda exige que todos los términos aparezcan en el mismo bloque.
      </p>
    </div>
  )
}
