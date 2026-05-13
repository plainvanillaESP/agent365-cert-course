import { useEffect, useRef } from 'react'
import { CheckCircle2, RotateCcw, Lightbulb, Check, X, Sparkles, AlertCircle, Award, Trophy } from 'lucide-react'
import { useLabState } from '@/hooks/useLabState'
import {
  type LabScenario,
  type LabProduct,
  type ProductId,
  isScenarioCorrect,
} from '@/lib/labs'
import { Button } from '@/components/Button'

interface LabProps {
  moduleId: number
}

export function Lab({ moduleId }: LabProps) {
  const {
    lab,
    answers,
    validated,
    setAnswer,
    validate,
    reset,
    answeredCount,
    correctCount,
    totalScenarios,
  } = useLabState(moduleId)

  const resultRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (validated && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [validated])

  if (!lab) {
    return (
      <div className="rounded-md border border-[var(--border-default)] bg-[var(--bg-surface-2)] p-6 text-center">
        <p className="text-[14px] text-[var(--text-secondary)]">
          Este módulo no tiene laboratorio interactivo en esta fase.
        </p>
      </div>
    )
  }

  const allAnswered = answeredCount === totalScenarios

  return (
    <div className="space-y-6">
      <div ref={resultRef}>
        {validated ? (
          <LabResult correct={correctCount} total={totalScenarios} />
        ) : (
          <LabHeader
            title={lab.title}
            intro={lab.intro}
            answered={answeredCount}
            total={totalScenarios}
          />
        )}
      </div>

      <ol className="space-y-4 list-none p-0 m-0">
        {lab.scenarios.map((scenario, idx) => {
          const validatedAnswer = validated ? validated[scenario.id] : null
          const currentAnswer = answers[scenario.id]
          const correct = validated ? isScenarioCorrect(scenario, validatedAnswer) : null

          return (
            <li key={scenario.id}>
              <ScenarioCard
                index={idx}
                scenario={scenario}
                products={lab.products}
                currentAnswer={currentAnswer}
                validatedAnswer={validatedAnswer}
                isCorrect={correct}
                onSelect={pid => setAnswer(scenario.id, pid)}
              />
            </li>
          )
        })}
      </ol>

      {/* Productos de referencia siempre visible (cheatsheet) */}
      <ProductLegend products={lab.products} />

      {/* Acciones */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        {!validated ? (
          <>
            <Button
              variant="primary"
              size="lg"
              onClick={validate}
              disabled={!allAnswered}
              iconLeft={<CheckCircle2 className="size-[16px] stroke-[2]" aria-hidden />}
            >
              Validar respuestas
            </Button>
            {!allAnswered && (
              <span className="text-[12.5px] text-[var(--text-muted)]">
                Te quedan {totalScenarios - answeredCount} escenarios por contestar.
              </span>
            )}
          </>
        ) : (
          <Button
            variant="primary"
            size="lg"
            onClick={reset}
            iconLeft={<RotateCcw className="size-[16px] stroke-[2]" aria-hidden />}
          >
            Reiniciar laboratorio
          </Button>
        )}
      </div>

      {/* Patrones de error tras validar */}
      {validated && lab.errorPatterns.length > 0 && <ErrorPatterns items={lab.errorPatterns} />}
    </div>
  )
}

/* ------------------------------ Subcomponentes ------------------------------ */

function LabHeader({
  title,
  intro,
  answered,
  total,
}: {
  title: string
  intro: string
  answered: number
  total: number
}) {
  const pct = Math.round((answered / total) * 100)
  return (
    <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-5">
      <div className="flex items-start gap-3">
        <Sparkles className="size-[18px] text-[var(--color-pv-purple-500)] stroke-[1.75] shrink-0 mt-0.5" aria-hidden />
        <div className="flex-1">
          <h3 className="font-display text-[15px] font-semibold text-[var(--text-primary)] mb-1">
            {title}
          </h3>
          <p className="text-[13.5px] text-[var(--text-secondary)] leading-relaxed">{intro}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-[var(--bg-surface-2)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-pv-purple-500)] transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="font-mono text-[12px] tabular-nums text-[var(--text-muted)] shrink-0">
          {answered}/{total} respondidos
        </span>
      </div>
    </div>
  )
}

function LabResult({ correct, total }: { correct: number; total: number }) {
  const pct = correct / total

  if (correct === total) {
    return (
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/[0.06] p-5">
        <div className="flex items-start gap-3">
          <Trophy
            className="size-[20px] text-emerald-600 dark:text-emerald-400 stroke-[1.75] shrink-0 mt-0.5"
            aria-hidden
          />
          <div className="flex-1">
            <h3 className="font-display text-[16px] font-semibold text-emerald-800 dark:text-emerald-200">
              {correct} de {total}: dominio del ecosistema
            </h3>
            <p className="text-[13.5px] text-[var(--text-secondary)] leading-relaxed mt-1">
              Has identificado el producto correcto en todos los escenarios. Puedes pasar al Módulo 02.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (pct >= 0.7) {
    return (
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/[0.06] p-5">
        <div className="flex items-start gap-3">
          <Award
            className="size-[20px] text-emerald-600 dark:text-emerald-400 stroke-[1.75] shrink-0 mt-0.5"
            aria-hidden
          />
          <div className="flex-1">
            <h3 className="font-display text-[16px] font-semibold text-emerald-800 dark:text-emerald-200">
              {correct} de {total}: bien encaminado
            </h3>
            <p className="text-[13.5px] text-[var(--text-secondary)] leading-relaxed mt-1">
              Repasa la justificación de los escenarios fallados antes de seguir.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-amber-500/40 bg-amber-500/[0.06] p-5">
      <div className="flex items-start gap-3">
        <AlertCircle
          className="size-[20px] text-amber-600 dark:text-amber-400 stroke-[1.75] shrink-0 mt-0.5"
          aria-hidden
        />
        <div className="flex-1">
          <h3 className="font-display text-[16px] font-semibold text-amber-800 dark:text-amber-200">
            {correct} de {total}: revisa la teoría del módulo
          </h3>
          <p className="text-[13.5px] text-[var(--text-secondary)] leading-relaxed mt-1">
            La distinción entre los seis productos del ecosistema es la base del resto del curso. Vuelve a la sección 1.2 antes de continuar.
          </p>
        </div>
      </div>
    </div>
  )
}

function ScenarioCard({
  index,
  scenario,
  products,
  currentAnswer,
  validatedAnswer,
  isCorrect,
  onSelect,
}: {
  index: number
  scenario: LabScenario
  products: LabProduct[]
  currentAnswer: ProductId | null
  validatedAnswer: ProductId | null
  isCorrect: boolean | null
  onSelect: (pid: ProductId | null) => void
}) {
  const submitted = validatedAnswer !== null || isCorrect !== null

  const borderColor =
    isCorrect === true
      ? 'border-emerald-500/40'
      : isCorrect === false
        ? 'border-red-500/40'
        : 'border-[var(--border-default)]'

  return (
    <article
      className={[
        'rounded-lg border bg-[var(--bg-surface)] overflow-hidden transition-colors',
        borderColor,
      ].join(' ')}
    >
      <div className="px-5 sm:px-6 pt-5 pb-1 flex items-start justify-between gap-3">
        <div className="size-8 rounded-md bg-[var(--bg-surface-2)] flex items-center justify-center font-display text-[15px] font-semibold text-[var(--text-primary)] shrink-0 tabular-nums">
          {index + 1}
        </div>
        {isCorrect !== null && <ResultBadge correct={isCorrect} />}
      </div>

      <div className="px-5 sm:px-6 pb-5 pt-3">
        <p className="text-[14.5px] leading-relaxed text-[var(--text-primary)] mb-4 italic">
          {scenario.prompt}
        </p>

        {/* Chips de producto */}
        <div className="flex flex-wrap gap-2">
          {products.map(p => {
            const selected =
              !submitted && currentAnswer === p.id
                ? 'selected'
                : submitted && validatedAnswer === p.id
                  ? isCorrect
                    ? 'correct-chosen'
                    : 'incorrect-chosen'
                  : submitted && scenario.correctProductIds.includes(p.id)
                    ? 'should-be'
                    : 'idle'

            return (
              <ProductChip
                key={p.id}
                product={p}
                state={selected}
                disabled={submitted}
                onClick={() => onSelect(currentAnswer === p.id ? null : p.id)}
              />
            )
          })}
        </div>

        {submitted && <ScenarioFeedback scenario={scenario} products={products} />}
      </div>
    </article>
  )
}

function ProductChip({
  product,
  state,
  disabled,
  onClick,
}: {
  product: LabProduct
  state: 'idle' | 'selected' | 'correct-chosen' | 'incorrect-chosen' | 'should-be'
  disabled: boolean
  onClick: () => void
}) {
  let cls = 'border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface-hover)]'
  if (state === 'selected') {
    cls = 'border-[var(--color-pv-purple-500)] bg-[var(--bg-active)] text-[var(--color-pv-purple-700)] dark:text-[var(--color-pv-purple-300)]'
  } else if (state === 'correct-chosen') {
    cls = 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200'
  } else if (state === 'incorrect-chosen') {
    cls = 'border-red-500 bg-red-500/10 text-red-800 dark:text-red-200'
  } else if (state === 'should-be') {
    // Producto correcto que no fue elegido por el alumno
    cls = 'border-emerald-500/50 bg-emerald-500/[0.06] text-emerald-700 dark:text-emerald-300'
  } else if (disabled) {
    cls = 'border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-faint)] opacity-60'
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={product.fullName}
      className={[
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border-2 text-[12.5px] font-mono font-semibold transition-colors',
        cls,
        disabled ? 'cursor-default' : 'cursor-pointer',
      ].join(' ')}
    >
      {state === 'correct-chosen' && <Check className="size-3.5 stroke-[2.5]" aria-hidden />}
      {state === 'incorrect-chosen' && <X className="size-3.5 stroke-[2.5]" aria-hidden />}
      {state === 'should-be' && <Check className="size-3.5 stroke-[2.5]" aria-hidden />}
      {product.shortLabel}
    </button>
  )
}

function ScenarioFeedback({
  scenario,
  products,
}: {
  scenario: LabScenario
  products: LabProduct[]
}) {
  const correctProducts = products.filter(p => scenario.correctProductIds.includes(p.id))
  return (
    <div className="mt-4 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface-2)] overflow-hidden">
      <header className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-surface-hover)] border-b border-[var(--border-subtle)]">
        <Lightbulb
          className="size-[14px] text-amber-600 dark:text-amber-400 stroke-[1.75]"
          aria-hidden
        />
        <span className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
          Justificación
        </span>
      </header>
      <div className="p-4 space-y-2">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[13px]">
          <span className="text-[var(--text-muted)]">
            {correctProducts.length === 1 ? 'Producto correcto:' : 'Productos válidos:'}
          </span>
          {correctProducts.map((p, i) => (
            <span key={p.id} className="inline-flex items-baseline gap-1.5">
              <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-300">
                {p.shortLabel}
              </span>
              <span className="text-[var(--text-secondary)]">— {p.fullName}</span>
              {i < correctProducts.length - 1 && <span className="text-[var(--text-faint)]">,</span>}
            </span>
          ))}
        </div>
        <p className="text-[13.5px] leading-relaxed text-[var(--text-secondary)]">
          {scenario.rationale}
        </p>
      </div>
    </div>
  )
}

function ResultBadge({ correct }: { correct: boolean }) {
  if (correct) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11.5px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 shrink-0">
        <Check className="size-[13px] stroke-[2.5]" aria-hidden />
        Acertado
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11.5px] font-semibold uppercase tracking-wider text-red-700 dark:text-red-300 bg-red-500/10 shrink-0">
      <X className="size-[13px] stroke-[2.5]" aria-hidden />
      Fallado
    </span>
  )
}

function ProductLegend({ products }: { products: LabProduct[] }) {
  return (
    <details className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)]">
      <summary className="cursor-pointer flex items-center gap-2 px-4 py-3 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] transition-colors list-none [&::-webkit-details-marker]:hidden font-medium">
        <span>Referencia rápida de los productos</span>
      </summary>
      <ul className="border-t border-[var(--border-subtle)] divide-y divide-[var(--border-subtle)]">
        {products.map(p => (
          <li
            key={p.id}
            className="grid grid-cols-[110px_1fr_minmax(0,260px)] items-center gap-3 px-4 py-2.5 text-[12.5px]"
          >
            <span className="font-mono font-semibold text-[var(--text-primary)]">
              {p.shortLabel}
            </span>
            <span className="text-[var(--text-primary)]">{p.fullName}</span>
            <span className="text-[var(--text-muted)] text-[12px]">{p.hint}</span>
          </li>
        ))}
      </ul>
    </details>
  )
}

function ErrorPatterns({ items }: { items: string[] }) {
  return (
    <section className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 mt-2">
      <header className="flex items-center gap-2 mb-3">
        <AlertCircle
          className="size-[16px] text-amber-600 dark:text-amber-400 stroke-[1.75]"
          aria-hidden
        />
        <h3 className="font-display text-[14px] font-semibold text-[var(--text-primary)]">
          Errores frecuentes
        </h3>
      </header>
      <ul className="space-y-2 list-none p-0 m-0">
        {items.map((it, i) => (
          <li
            key={i}
            className="text-[13px] leading-relaxed text-[var(--text-secondary)] pl-4 relative"
          >
            <span
              aria-hidden
              className="absolute left-0 top-[7px] size-1.5 rounded-full bg-[var(--text-faint)]"
            />
            {it}
          </li>
        ))}
      </ul>
    </section>
  )
}
