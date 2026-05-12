import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock, BookOpen, GraduationCap, FileText, CheckCircle2, Lock } from 'lucide-react'
import { ButtonLink } from '@/components/Button'
import { Section, Card } from '@/components/Layout'
import {
  AREAS,
  MODULES,
  CONTENT_MODULES,
  EXAM_MODULE,
  COURSE_TOTAL_MIN,
  COURSE_EXAM_MIN,
  COURSE_TOTAL_QUESTIONS,
  COURSE_TITLE,
  COURSE_EYEBROW,
  COURSE_DESCRIPTION,
  COURSE_LOGO,
  COURSE_START_PATH,
  formatDuration,
  type CourseModule,
} from '@/lib/course'
import { useUnlockState } from '@/hooks/useModuleProgress'

export function HomePage() {
  const { isUnlocked } = useUnlockState()
  const numTotalModules = MODULES.length

  return (
    <div className="max-w-[var(--layout-content-max)] mx-auto">
      <Hero />

      <StatsGrid />

      <Section
        eyebrow="Examen"
        title="Áreas de competencia"
        description="El examen final pondera las cinco áreas según el peso oficial. Los módulos cubren cada área en bloques temáticos."
      >
        <div className="space-y-3">
          {AREAS.map(area => (
            <AreaCard key={area.id} area={area} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Temario"
        title={`Los ${numTotalModules} módulos del curso`}
      >
        <Card flush>
          <ul className="divide-y divide-[var(--border-subtle)]">
            {CONTENT_MODULES.map(m => (
              <ModuleRow key={m.id} module={m} unlocked={isUnlocked(m.id)} />
            ))}
          </ul>
        </Card>
        <div className="mt-3">
          <Card flush>
            <ModuleRow module={EXAM_MODULE} isExam unlocked={isUnlocked(EXAM_MODULE.id)} />
          </Card>
        </div>
      </Section>
    </div>
  )
}

/* ------------------------- Componentes de la home ------------------------- */

function Hero() {
  return (
    <header className="pt-2 pb-8">
      <div className="flex items-start gap-5 sm:gap-7">
        <img
          src={`${import.meta.env.BASE_URL}${COURSE_LOGO}`}
          alt=""
          className="size-[72px] sm:size-[96px] rounded-[18px] shrink-0 mt-1"
          aria-hidden
        />
        <div className="flex-1 min-w-0">
          <div className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[var(--color-pv-purple-700)] dark:text-[var(--color-pv-purple-300)] mb-3">
            {COURSE_EYEBROW}
          </div>
          <h1 className="font-display text-[34px] sm:text-[40px] leading-[1.1] tracking-[-0.025em] font-bold text-[var(--text-primary)] mb-4">
            {COURSE_TITLE}
          </h1>
          <p className="text-[16px] leading-relaxed text-[var(--text-secondary)] max-w-[640px]">
            {COURSE_DESCRIPTION}
          </p>
          <div className="mt-7">
            <ButtonLink
              to={COURSE_START_PATH}
              variant="primary"
              size="lg"
              iconRight={<ArrowRight className="size-4 stroke-[2.25]" aria-hidden />}
            >
              Empezar por el primer módulo
            </ButtonLink>
          </div>
        </div>
      </div>
    </header>
  )
}

function StatsGrid() {
  const numContentModules = CONTENT_MODULES.length
  return (
    <section className="grid grid-cols-2 sm:grid-cols-4 rounded-lg overflow-hidden border border-[var(--border-default)] bg-[var(--border-subtle)] gap-px">
      <Stat icon={<BookOpen className="size-[14px] stroke-[1.75]" />} label="Módulos" value={String(numContentModules)} />
      <Stat icon={<Clock className="size-[14px] stroke-[1.75]" />} label="Duración" value={formatDuration(COURSE_TOTAL_MIN)} />
      <Stat icon={<GraduationCap className="size-[14px] stroke-[1.75]" />} label="Examen" value={`${COURSE_EXAM_MIN} min`} />
      <Stat icon={<FileText className="size-[14px] stroke-[1.75]" />} label="Preguntas" value={String(COURSE_TOTAL_QUESTIONS)} />
    </section>
  )
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="bg-[var(--bg-surface)] px-4 py-3.5">
      <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.06em] font-semibold text-[var(--text-muted)] mb-1.5">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-[20px] font-semibold leading-none text-[var(--text-primary)] tabular-nums font-display tracking-tight whitespace-nowrap">
        {value}
      </div>
    </div>
  )
}

/* --------------------------- Áreas (AreaCard) --------------------------- */

function AreaCard({ area }: { area: typeof AREAS[number] }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)]">
      <div className="size-9 rounded-md bg-[var(--bg-surface-2)] flex items-center justify-center font-mono text-[14px] font-semibold text-[var(--text-primary)] shrink-0">
        {area.id}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-display text-[15px] font-semibold text-[var(--text-primary)] leading-tight">
            {area.nombreEs}
          </h3>
          <span className="text-[12px] text-[var(--text-muted)] font-mono">
            {area.modulos.map(m => `M${String(m).padStart(2, '0')}`).join(' · ')}
          </span>
        </div>
        <div className="text-[13px] text-[var(--text-muted)] mt-1 italic">{area.nombre}</div>
      </div>
      <div className="text-right shrink-0">
        <div className="font-mono text-[18px] font-semibold tabular-nums text-[var(--text-primary)] leading-none whitespace-nowrap">
          {area.pesoExamen}%
        </div>
        <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider mt-1">
          Peso
        </div>
      </div>
    </div>
  )
}

/* --------------------------- Temario (ModuleRow) --------------------------- */

function ModuleRow({
  module: m,
  isExam = false,
  unlocked = true,
}: {
  module: CourseModule
  isExam?: boolean
  unlocked?: boolean
}) {
  const isProduced = m.estado === 'producido'
  const isAccessible = isProduced && unlocked
  const isLocked = isProduced && !unlocked
  const moduleNum = String(m.id).padStart(2, '0')

  const inner = (
    <div className="flex items-center gap-3 sm:gap-4 px-4 py-3 group">
      {/* Estado icono */}
      <div className="shrink-0">
        {isAccessible ? (
          <CheckCircle2
            className="size-[16px] stroke-[2] text-emerald-600 dark:text-emerald-400"
            aria-hidden
          />
        ) : (
          <Lock
            className={[
              'stroke-[1.75]',
              isLocked ? 'size-[14px] text-amber-600 dark:text-amber-400' : 'size-[14px] text-[var(--text-faint)]',
            ].join(' ')}
            aria-hidden
          />
        )}
      </div>
      {/* Número */}
      <div className="font-mono text-[12px] font-medium text-[var(--text-muted)] w-7 shrink-0 tabular-nums whitespace-nowrap">
        {moduleNum}
      </div>
      {/* Título */}
      <div className="flex-1 min-w-0">
        <div
          className={[
            'text-[14px] leading-snug',
            isAccessible ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)]',
            isExam && 'font-semibold',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {m.titulo}
        </div>
      </div>
      {/* Duración */}
      <div className="text-[12px] text-[var(--text-muted)] tabular-nums shrink-0 hidden sm:block whitespace-nowrap text-right min-w-[58px]">
        {formatDuration(m.duracionMin)}
      </div>
      {/* Estado texto */}
      <div className="text-[12px] shrink-0 hidden md:block whitespace-nowrap text-right min-w-[80px]">
        {isAccessible ? (
          <span className="text-emerald-700 dark:text-emerald-300 font-medium">Disponible</span>
        ) : isLocked ? (
          <span className="text-amber-700 dark:text-amber-400 font-medium">Bloqueado</span>
        ) : (
          <span className="text-[var(--text-muted)]">Fase {m.faseProduccion}</span>
        )}
      </div>
      {/* Flecha */}
      {isAccessible && (
        <ArrowRight
          className="size-[14px] stroke-[1.75] text-[var(--text-muted)] shrink-0 group-hover:text-[var(--color-pv-purple-600)] dark:group-hover:text-[var(--color-pv-purple-300)] group-hover:translate-x-0.5 transition-all"
          aria-hidden
        />
      )}
    </div>
  )

  if (isAccessible) {
    return (
      <li>
        <Link
          to={`/modulo/${m.id}/teoria`}
          className="block hover:bg-[var(--bg-surface-hover)] transition-colors no-underline"
        >
          {inner}
        </Link>
      </li>
    )
  }
  return (
    <li
      className={isLocked ? 'opacity-75' : 'opacity-75'}
      title={isLocked ? 'Completa los módulos anteriores o activa modo acceso libre' : undefined}
    >
      {inner}
    </li>
  )
}
