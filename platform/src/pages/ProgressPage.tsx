import { Link, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import {
  BookOpenText,
  FlaskConical,
  ClipboardCheck,
  Link2,
  Check,
  ArrowRight,
  Trash2,
  Sparkles,
  Lock,
  AlertCircle,
  Unlock,
} from 'lucide-react'
import { AREAS, MODULES, formatDuration, findModule, type CourseModule, type CourseArea } from '@/lib/course'
import { useCourseProgress, useAccessMode, useUnlockState } from '@/hooks/useModuleProgress'
import {
  clearAllProgress,
  type ModuleProgressSnapshot,
  type TrackedSection,
} from '@/lib/progress'
import { Button } from '@/components/Button'

const SECTION_META: Record<TrackedSection, { label: string; short: string; icon: typeof BookOpenText }> = {
  teoria:          { label: 'Teoría',         short: 'Teoría',  icon: BookOpenText  },
  'quiz-practica': { label: 'Práctica',       short: 'Quiz',    icon: ClipboardCheck },
  laboratorios:    { label: 'Laboratorios',   short: 'Labs',    icon: FlaskConical },
  recursos:        { label: 'Recursos',       short: 'Recursos', icon: Link2         },
}

export function ProgressPage() {
  const courseProgress = useCourseProgress()
  const byModuleId = new Map(courseProgress.map(s => [s.moduleId, s]))
  const { isUnlocked } = useUnlockState()
  const [searchParams] = useSearchParams()

  const producedModules = MODULES.filter(m => m.estado === 'producido' && m.id !== 17)
  const totalModules = producedModules.length
  const completedModules = courseProgress.filter(s => s.isModuleComplete).length
  const completionPct = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0

  const nextStep = findNextStep(producedModules, byModuleId, isUnlocked)

  const lockedParam = searchParams.get('locked')
  const lockedModule = lockedParam ? findModule(parseInt(lockedParam, 10)) : null

  return (
    <div className="max-w-[var(--layout-content-max)] mx-auto">
      {/* Banner contextual: el alumno intentó acceder a un módulo bloqueado */}
      {lockedModule && !isUnlocked(lockedModule.id) && (
        <LockedBanner module={lockedModule} />
      )}

      {/* Hero */}
      <section className="pb-8 mb-8 border-b border-[var(--border-default)]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-pv-purple-700)] dark:text-[var(--color-pv-purple-300)] mb-2.5">
          Tu progreso
        </div>
        <h1 className="font-display text-[32px] sm:text-[38px] leading-[1.1] tracking-[-0.02em] font-bold text-[var(--text-primary)]">
          Microsoft Agent 365 IT Admin
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-secondary)] max-w-prose">
          Tu avance por los módulos producidos del curso. El progreso se guarda en este navegador;
          si cambias de equipo o limpias los datos del sitio, se reinicia.
        </p>

        <ProgressBar pct={completionPct} completed={completedModules} total={totalModules} />
      </section>

      {/* Próximo paso */}
      {nextStep && (
        <section className="mb-10">
          <SectionHeader eyebrow="Continuar" title="Tu próximo paso" />
          <NextStepCard nextStep={nextStep} />
        </section>
      )}

      {/* Por área */}
      <section className="mb-10">
        <SectionHeader
          eyebrow="Detalle"
          title="Progreso por área del examen"
          description="Cada módulo muestra el estado de sus cuatro secciones: teoría, quiz, laboratorios y recursos."
        />
        <div className="space-y-6">
          {AREAS.map(area => {
            const areaModules = MODULES.filter(m => m.areaExamen === area.id && m.id !== 17)
            if (areaModules.length === 0) return null
            return (
              <AreaSection
                key={area.id}
                area={area}
                modules={areaModules}
                progressMap={byModuleId}
                isUnlocked={isUnlocked}
              />
            )
          })}
        </div>
      </section>

      {/* Modo de acceso + reinicio */}
      <section className="mt-12 pt-6 border-t border-[var(--border-default)] space-y-6">
        <AccessModeToggle />
        <ResetProgress />
      </section>
    </div>
  )
}

/* ----------------------------- Sub-componentes ----------------------------- */

function LockedBanner({ module }: { module: CourseModule }) {
  return (
    <div className="mb-6 rounded-md border border-amber-500/40 bg-amber-500/[0.08] p-4">
      <div className="flex items-start gap-3">
        <AlertCircle
          className="size-5 shrink-0 text-amber-600 dark:text-amber-400 stroke-[1.75] mt-0.5"
          aria-hidden
        />
        <div className="text-[13.5px] leading-relaxed text-[var(--text-primary)]">
          <span className="font-semibold">Módulo {String(module.id).padStart(2, '0')} aún no disponible:</span>{' '}
          completa los módulos anteriores producidos del curso para desbloquearlo, o activa el{' '}
          <span className="font-medium">modo acceso libre</span> al pie de esta página si prefieres saltarte el orden recomendado.
        </div>
      </div>
    </div>
  )
}

function AccessModeToggle() {
  const [mode, setMode] = useAccessMode()
  const isFree = mode === 'free'

  return (
    <div className="rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0 max-w-prose">
          <div className="flex items-center gap-2 mb-1.5">
            {isFree ? (
              <Unlock className="size-4 stroke-[1.75] text-[var(--text-secondary)]" aria-hidden />
            ) : (
              <Lock className="size-4 stroke-[1.75] text-[var(--text-secondary)]" aria-hidden />
            )}
            <h3 className="font-display text-[15px] font-bold text-[var(--text-primary)]">
              Modo de acceso
            </h3>
          </div>
          <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
            {isFree ? (
              <>
                Todos los módulos producidos son accesibles desde el primer día. Es el modo más cómodo si quieres consultar contenido fuera del orden recomendado.
              </>
            ) : (
              <>
                Cada módulo se desbloquea cuando completas todos los anteriores. Es el modo recomendado para preparar la certificación porque la progresión está diseñada acumulativamente.
              </>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMode(isFree ? 'sequential' : 'free')}
          role="switch"
          aria-checked={isFree}
          aria-label="Activar modo de acceso libre"
          className={[
            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pv-purple-500)] focus-visible:ring-offset-2',
            isFree
              ? 'bg-[var(--color-pv-purple-500)] border-[var(--color-pv-purple-500)]'
              : 'bg-[var(--bg-surface-2)] border-[var(--border-strong)]',
          ].join(' ')}
        >
          <span
            className={[
              'inline-block size-4 rounded-full bg-white shadow transition-transform mt-0.5',
              isFree ? 'translate-x-[22px]' : 'translate-x-0.5',
            ].join(' ')}
          />
        </button>
      </div>
      <div className="mt-3 flex items-baseline gap-2 text-[12px]">
        <span className="text-[var(--text-muted)]">Modo activo:</span>
        <span className="font-mono font-semibold text-[var(--text-primary)]">
          {isFree ? 'Acceso libre' : 'Secuencial (recomendado)'}
        </span>
      </div>
    </div>
  )
}

function ProgressBar({ pct, completed, total }: { pct: number; completed: number; total: number }) {
  return (
    <div className="mt-7">
      <div className="flex items-baseline justify-between mb-2">
        <div className="text-[14px] text-[var(--text-secondary)]">
          <span className="text-[var(--text-primary)] font-semibold text-[16px]">{completed}</span>
          <span className="mx-1.5 text-[var(--text-muted)]">de</span>
          <span className="font-semibold">{total}</span>
          <span className="ml-1.5">{total === 1 ? 'módulo completo' : 'módulos completos'}</span>
        </div>
        <div className="font-mono text-[14px] font-semibold text-[var(--text-primary)]">
          {pct}%
        </div>
      </div>
      <div className="h-2 rounded-full bg-[var(--border-subtle)] overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[var(--color-pv-purple-500)] to-[var(--color-pv-pink-500)] transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <header className="mb-5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)] mb-1.5">
        {eyebrow}
      </div>
      <h2 className="font-display text-[22px] font-bold text-[var(--text-primary)] leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-[14px] text-[var(--text-secondary)] max-w-prose">{description}</p>
      )}
    </header>
  )
}

interface NextStep {
  module: CourseModule
  pendingSection: TrackedSection
  pendingLabel: string
}

function NextStepCard({ nextStep }: { nextStep: NextStep }) {
  const SectionIcon = SECTION_META[nextStep.pendingSection].icon
  return (
    <Link
      to={`/modulo/${nextStep.module.id}/${nextStep.pendingSection}`}
      className="group block rounded-lg border-2 border-[var(--color-pv-purple-300)] dark:border-[var(--color-pv-purple-700)] bg-gradient-to-br from-[var(--color-pv-purple-50)] to-[var(--color-pv-pink-50)] dark:from-[var(--color-pv-purple-900)]/30 dark:to-[var(--color-pv-pink-900)]/20 p-5 hover:border-[var(--color-pv-purple-500)] transition-colors no-underline"
    >
      <div className="flex items-start gap-4">
        <div className="size-10 rounded-md bg-[var(--color-pv-purple-500)] flex items-center justify-center shrink-0">
          <Sparkles className="size-5 text-white stroke-[1.75]" aria-hidden />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-pv-purple-700)] dark:text-[var(--color-pv-purple-300)] mb-1">
            Módulo {String(nextStep.module.id).padStart(2, '0')}
          </div>
          <div className="font-display text-[18px] font-bold text-[var(--text-primary)] leading-snug mb-2">
            {nextStep.module.titulo}
          </div>
          <div className="flex items-center gap-1.5 text-[13.5px] text-[var(--text-secondary)]">
            <SectionIcon className="size-[14px] stroke-[1.75]" aria-hidden />
            <span>Empezar por: {nextStep.pendingLabel}</span>
          </div>
        </div>
        <ArrowRight
          className="size-5 text-[var(--text-muted)] group-hover:text-[var(--color-pv-purple-500)] group-hover:translate-x-1 transition-all shrink-0 mt-1.5"
          aria-hidden
        />
      </div>
    </Link>
  )
}

function AreaSection({
  area,
  modules,
  progressMap,
  isUnlocked,
}: {
  area: CourseArea
  modules: CourseModule[]
  progressMap: Map<number, ModuleProgressSnapshot>
  isUnlocked: (moduleId: number) => boolean
}) {
  const producedInArea = modules.filter(m => m.estado === 'producido')
  const completedInArea = producedInArea.filter(m => progressMap.get(m.id)?.isModuleComplete).length
  const totalInArea = producedInArea.length
  const pctInArea = totalInArea > 0 ? Math.round((completedInArea / totalInArea) * 100) : 0

  return (
    <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] overflow-hidden">
      <header className="px-5 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-2)]">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <div>
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)] mb-1">
              Área {area.id} · {area.pesoExamen}% del examen
            </div>
            <h3 className="font-display text-[16px] font-bold text-[var(--text-primary)]">
              {area.nombreEs}
            </h3>
          </div>
          {producedInArea.length > 0 && (
            <div className="text-[13px] text-[var(--text-secondary)]">
              <span className="font-mono font-semibold text-[var(--text-primary)]">
                {completedInArea} / {totalInArea}
              </span>
              <span className="mx-1.5 text-[var(--text-muted)]">·</span>
              <span className="font-mono">{pctInArea}%</span>
            </div>
          )}
        </div>
      </header>
      <ul className="divide-y divide-[var(--border-subtle)]">
        {modules.map(m => (
          <ModuleRow
            key={m.id}
            module={m}
            snapshot={progressMap.get(m.id)}
            unlocked={isUnlocked(m.id)}
          />
        ))}
      </ul>
    </div>
  )
}

function ModuleRow({
  module,
  snapshot,
  unlocked,
}: {
  module: CourseModule
  snapshot: ModuleProgressSnapshot | undefined
  unlocked: boolean
}) {
  const isProduced = module.estado === 'producido'
  const isComplete = snapshot?.isModuleComplete ?? false
  const isLocked = isProduced && !unlocked
  const isAccessible = isProduced && unlocked

  const Wrapper = isAccessible
    ? ({ children }: { children: React.ReactNode }) => (
        <Link
          to={`/modulo/${module.id}/teoria`}
          className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--bg-surface-hover)] transition-colors no-underline"
        >
          {children}
        </Link>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div
          className={[
            'flex items-center gap-4 px-5 py-4',
            isProduced ? 'opacity-60' : 'opacity-50',
          ].join(' ')}
        >
          {children}
        </div>
      )

  return (
    <li>
      <Wrapper>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[11.5px] font-semibold text-[var(--text-muted)]">
              M{String(module.id).padStart(2, '0')}
            </span>
            {!isProduced && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-[var(--bg-surface-2)] text-[var(--text-muted)]">
                <Lock className="size-2.5 stroke-[2.5]" aria-hidden />
                Pendiente
              </span>
            )}
            {isLocked && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-amber-500/15 text-amber-700 dark:text-amber-300">
                <Lock className="size-2.5 stroke-[2.5]" aria-hidden />
                Bloqueado
              </span>
            )}
            {isComplete && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                <Check className="size-2.5 stroke-[2.5]" aria-hidden />
                Completado
              </span>
            )}
          </div>
          <div className="text-[14px] font-medium text-[var(--text-primary)] leading-snug">
            {module.titulo}
          </div>
          <div className="text-[12px] text-[var(--text-muted)] mt-1">
            {formatDuration(module.duracionMin)}
          </div>
        </div>

        {isAccessible && snapshot && (
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            {(Object.keys(SECTION_META) as TrackedSection[]).map(section => {
              const state = snapshot.sections[section]
              const isCompleted = state.status === 'completed'
              const isInProgress = state.status === 'in-progress'
              const Icon = SECTION_META[section].icon
              return (
                <div
                  key={section}
                  title={`${SECTION_META[section].label}: ${labelForStatus(state.status)}`}
                  className={[
                    'size-7 rounded-md flex items-center justify-center border',
                    isCompleted &&
                      'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400',
                    isInProgress &&
                      'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400',
                    !isCompleted &&
                      !isInProgress &&
                      'bg-[var(--bg-surface-2)] border-[var(--border-default)] text-[var(--text-faint)]',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {isCompleted ? (
                    <Check className="size-3.5 stroke-[2.5]" aria-hidden />
                  ) : (
                    <Icon className="size-3.5 stroke-[1.75]" aria-hidden />
                  )}
                </div>
              )
            })}
          </div>
        )}

        {isAccessible && (
          <ArrowRight
            className="size-4 text-[var(--text-faint)] group-hover:text-[var(--text-primary)] shrink-0"
            aria-hidden
          />
        )}
      </Wrapper>
    </li>
  )
}

function ResetProgress() {
  const [confirming, setConfirming] = useState(false)

  if (!confirming) {
    return (
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="text-[13px] text-[var(--text-muted)]">
          Tu progreso se guarda solo en este navegador. Puedes reiniciarlo si quieres empezar de cero.
        </div>
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] font-medium text-[var(--text-muted)] hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <Trash2 className="size-[13px] stroke-[1.75]" aria-hidden />
          Reiniciar progreso
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-md border border-red-500/30 bg-red-500/[0.06] p-4">
      <div className="text-[13.5px] text-[var(--text-primary)] mb-3">
        Vas a borrar todo tu progreso: el avance de lectura, los intentos de quiz y las visitas a
        laboratorios y recursos. Esta acción no se puede deshacer.
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="primary"
          onClick={() => {
            clearAllProgress()
            setConfirming(false)
          }}
          className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
        >
          Sí, reiniciar
        </Button>
        <Button variant="ghost" onClick={() => setConfirming(false)}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}

/* ------------------------- Helpers de cálculo lógico ------------------------ */

function labelForStatus(status: 'not-started' | 'in-progress' | 'completed'): string {
  if (status === 'completed') return 'completada'
  if (status === 'in-progress') return 'en progreso'
  return 'sin empezar'
}

/**
 * Calcula el próximo paso recomendado: el primer módulo producido **y
 * desbloqueado** que no esté completo, y dentro de ese módulo la primera
 * sección pendiente según el orden natural (teoría → quiz → labs → recursos).
 *
 * Si todos los módulos desbloqueados están completos, devuelve null
 * (lo que típicamente significa que el alumno tiene que esperar a que
 * publiquemos M10+ o que activar acceso libre desbloquearía algo, pero
 * eso es responsabilidad del banner contextual, no de esta función).
 */
function findNextStep(
  modules: CourseModule[],
  progressMap: Map<number, ModuleProgressSnapshot>,
  isUnlocked: (moduleId: number) => boolean,
): NextStep | null {
  const order: TrackedSection[] = ['teoria', 'quiz-practica', 'laboratorios', 'recursos']
  for (const m of modules) {
    if (!isUnlocked(m.id)) continue
    const snap = progressMap.get(m.id)
    if (!snap || snap.isModuleComplete) continue
    const pending = order.find(s => snap.sections[s].status !== 'completed')
    if (pending) {
      return {
        module: m,
        pendingSection: pending,
        pendingLabel: SECTION_META[pending].label,
      }
    }
  }
  return null
}
