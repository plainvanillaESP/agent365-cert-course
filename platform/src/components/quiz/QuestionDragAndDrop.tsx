import { useMemo } from 'react'
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core'
import { Check, X, GripVertical } from 'lucide-react'
import { InlineMarkdown } from '@/components/InlineMarkdown'
import type { DragAndDropQuestion, DnDAnswer } from '@/lib/quiz'
import { dndItemCorrectness } from '@/lib/quiz'

interface Props {
  question: DragAndDropQuestion
  answer: DnDAnswer
  /** Si null → modo edición. Si presente → modo revisión. */
  submission: DnDAnswer | null
  onChange: (a: DnDAnswer) => void
}

const POOL_ID = '__pool__'

export function QuestionDragAndDrop({ question, answer, submission, onChange }: Props) {
  const submitted = submission !== null

  // Sensores: pointer (mouse, touch) + teclado para accesibilidad
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  )

  // Items por zona (pool + cada target)
  const itemsByZone = useMemo(() => {
    const placements = submitted ? submission.placements : answer.placements
    const map: Record<string, string[]> = { [POOL_ID]: [] }
    for (const t of question.targets) map[t.id] = []
    for (const item of question.items) {
      const target = placements[item.id]
      if (target && map[target]) {
        map[target].push(item.id)
      } else {
        map[POOL_ID].push(item.id)
      }
    }
    return map
  }, [question, answer, submission, submitted])

  // Correctness per item (solo cuando submitted)
  const itemCorrectness = useMemo(
    () => (submitted ? dndItemCorrectness(question, submission) : {}),
    [question, submission, submitted],
  )

  function handleDragEnd(event: DragEndEvent) {
    if (submitted) return
    const { active, over } = event
    if (!over) return
    const itemId = String(active.id)
    const zoneId = String(over.id)

    const newPlacements = { ...answer.placements }
    if (zoneId === POOL_ID) {
      delete newPlacements[itemId]
    } else {
      newPlacements[itemId] = zoneId
    }
    onChange({ ...answer, placements: newPlacements })
  }

  return (
    <div>
      <p className="text-[14.5px] leading-relaxed text-[var(--text-primary)] mb-5">
        <InlineMarkdown text={question.prompt} />
      </p>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        {/* Pool de responsabilidades disponibles */}
        <Pool
          items={question.items.filter(i => itemsByZone[POOL_ID].includes(i.id))}
          itemCorrectness={itemCorrectness}
          submitted={submitted}
        />

        {/* Zonas de drop por stakeholder */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {question.targets.map(target => (
            <DropZone
              key={target.id}
              target={target}
              items={question.items.filter(i => itemsByZone[target.id]?.includes(i.id))}
              itemCorrectness={itemCorrectness}
              correctMap={question.correctMap}
              submitted={submitted}
            />
          ))}
        </div>
      </DndContext>
    </div>
  )
}

/* ----------------------------- Subcomponentes ----------------------------- */

function Pool({
  items,
  itemCorrectness,
  submitted,
}: {
  items: { id: string; text: string }[]
  itemCorrectness: Record<string, boolean>
  submitted: boolean
}) {
  const { setNodeRef, isOver } = useDroppable({ id: POOL_ID })

  return (
    <div
      ref={setNodeRef}
      className={[
        'rounded-md border-2 border-dashed p-3 min-h-[80px] transition-colors',
        isOver
          ? 'border-[var(--color-pv-purple-500)] bg-[var(--bg-active)]'
          : 'border-[var(--border-default)] bg-[var(--bg-surface-2)]',
      ].join(' ')}
    >
      <div className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)] mb-2 px-1">
        {items.length === 0 ? 'Todas las responsabilidades colocadas' : 'Responsabilidades por colocar'}
      </div>
      {items.length > 0 && (
        <ul className="space-y-2">
          {items.map(item => (
            <DraggableItem
              key={item.id}
              item={item}
              isCorrect={submitted ? itemCorrectness[item.id] : null}
              disabled={submitted}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

function DropZone({
  target,
  items,
  itemCorrectness,
  correctMap,
  submitted,
}: {
  target: { id: string; label: string }
  items: { id: string; text: string }[]
  itemCorrectness: Record<string, boolean>
  correctMap: Record<string, string>
  submitted: boolean
}) {
  const { setNodeRef, isOver } = useDroppable({ id: target.id })

  return (
    <div
      ref={setNodeRef}
      className={[
        'rounded-md border-2 p-3 min-h-[110px] transition-colors flex flex-col',
        isOver
          ? 'border-[var(--color-pv-purple-500)] bg-[var(--bg-active)]'
          : 'border-[var(--border-default)] bg-[var(--bg-surface)]',
      ].join(' ')}
    >
      <div className="font-display text-[14px] font-semibold text-[var(--text-primary)] px-1 mb-2 flex items-center justify-between">
        <span>{target.label}</span>
        {submitted && (
          <span className="text-[11px] font-mono font-normal text-[var(--text-muted)]">
            {Object.values(correctMap).filter(t => t === target.id).length} esperadas
          </span>
        )}
      </div>
      {items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-[11.5px] text-[var(--text-faint)] italic">
          Suelta aquí
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map(item => (
            <DraggableItem
              key={item.id}
              item={item}
              isCorrect={submitted ? itemCorrectness[item.id] : null}
              disabled={submitted}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

function DraggableItem({
  item,
  isCorrect,
  disabled,
}: {
  item: { id: string; text: string }
  isCorrect: boolean | null
  disabled: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    disabled,
  })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 50 }
    : undefined

  // Color según estado
  let stateClasses = 'bg-[var(--bg-surface)] border-[var(--border-default)] hover:border-[var(--border-strong)]'
  let indicator: React.ReactNode = (
    <GripVertical
      className="size-[14px] text-[var(--text-faint)] shrink-0 mt-0.5"
      aria-hidden
    />
  )
  if (isCorrect === true) {
    stateClasses = 'bg-emerald-500/[0.07] border-emerald-500/50'
    indicator = (
      <Check
        className="size-[14px] text-emerald-600 dark:text-emerald-400 stroke-[2.5] shrink-0 mt-0.5"
        aria-hidden
      />
    )
  } else if (isCorrect === false) {
    stateClasses = 'bg-red-500/[0.07] border-red-500/50'
    indicator = (
      <X
        className="size-[14px] text-red-600 dark:text-red-400 stroke-[2.5] shrink-0 mt-0.5"
        aria-hidden
      />
    )
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={[
        'flex items-start gap-2 p-2.5 rounded-md border text-[13px] leading-snug transition-colors',
        stateClasses,
        disabled ? 'cursor-default' : 'cursor-grab active:cursor-grabbing',
        isDragging && 'opacity-60 shadow-lg ring-2 ring-[var(--color-pv-purple-500)]/40',
      ]
        .filter(Boolean)
        .join(' ')}
      {...listeners}
      {...attributes}
    >
      {indicator}
      <span className="text-[var(--text-primary)] flex-1 min-w-0">
        <InlineMarkdown text={item.text} />
      </span>
    </li>
  )
}
