import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock, BookOpen, GraduationCap, FileText, CheckCircle2, Circle, Lock } from 'lucide-react'
import { ButtonLink } from '@/components/Button'
import { AREAS, MODULES, COURSE_TOTAL_MIN, COURSE_EXAM_MIN, formatDuration, type CourseModule } from '@/lib/course'

type PhaseStatus = 'done' | 'current' | 'todo'

interface Phase {
  id: string
  desc: string
  status: PhaseStatus
}

const PHASES: Phase[] = [
  { id: '0',   desc: 'Investigación deep-research base',                 status: 'done'    },
  { id: '1',   desc: 'Diseño maestro (blueprint, áreas, banco modelo)',  status: 'done'    },
  { id: '2',   desc: 'Módulo 01 prototipo de contenido',                 status: 'done'    },
  { id: '2.A', desc: 'Prototipo del shell de e-learning con M01',        status: 'done'    },
  { id: '3',   desc: 'Módulos 02–05 (Fundamentos & Setup)',              status: 'current' },
  { id: '4',   desc: 'Módulos 06–09 (Identidad y ciclo de vida)',        status: 'todo'    },
  { id: '5',   desc: 'Módulos 10–13 (Datos, monitorización, CCS)',       status: 'todo'    },
  { id: '6',   desc: 'Módulos 14–16 (Avanzado)',                         status: 'todo'    },
  { id: '7',   desc: 'Módulo 17 — Evaluación final',                     status: 'todo'    },
  { id: '8',   desc: 'Plataforma multi-curso, autenticación y backend',   status: 'todo'    },
  { id: '9',   desc: 'Panel admin de cursos, certificación y PDFs',       status: 'todo'    },
]

export function HomePage() {
  return (
    <div className="max-w-[var(--layout-content-max)] mx-auto">
      <Hero />

      <StatsGrid />

      <Section
        eyebrow="Roadmap"
        title="Estado de producción"
        description="Los módulos producidos están disponibles. El resto se publica progresivamente."
      >
        <Card>
          <ul className="divide-y divide-[var(--border-subtle)]">
            {PHASES.map(p => (
              <PhaseRow key={p.id} phase={p} />
            ))}
          </ul>
        </Card>
      </Section>

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
        title="Los 17 módulos del curso"
        description=""
      >
        <Card>
          <ul className="divide-y divide-[var(--border-subtle)]">
            {MODULES.filter(m => m.id <= 16).map(m => (
              <ModuleRow key={m.id} module={m} />
            ))}
          </ul>
        </Card>
        <div className="mt-3">
          <Card>
            <ModuleRow module={MODULES[16]} isExam />
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
      <div className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[var(--color-pv-purple-700)] dark:text-[var(--color-pv-purple-300)] mb-3">
        Plain Vanilla Solutions · Curso de certificación
      </div>
      <h1 className="font-display text-[34px] sm:text-[40px] leading-[1.1] tracking-[-0.025em] font-bold text-[var(--text-primary)] mb-4">
        Microsoft Agent 365 IT Admin
      </h1>
      <p className="text-[16px] leading-relaxed text-[var(--text-secondary)] max-w-[640px]">
        Curso de certificación para administradores IT sobre Microsoft Agent 365 y la
        gobernanza de agentes de IA en Microsoft 365. 17 módulos estructurados, 18 horas
        de teoría y laboratorios, evaluación final medible y constancia de finalización.
      </p>
      <div className="mt-7">
        <ButtonLink
          to="/modulo/1/teoria"
          variant="primary"
          size="lg"
          iconRight={<ArrowRight className="size-4 stroke-[2.25]" aria-hidden />}
        >
          Empezar por el Módulo 01
        </ButtonLink>
      </div>
    </header>
  )
}

function StatsGrid() {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-4 rounded-lg overflow-hidden border border-[var(--border-default)] bg-[var(--border-subtle)] gap-px">
      <Stat icon={<BookOpen className="size-[14px] stroke-[1.75]" />} label="Módulos" value="17" />
      <Stat icon={<Clock className="size-[14px] stroke-[1.75]" />} label="Duración" value={formatDuration(COURSE_TOTAL_MIN)} />
      <Stat icon={<GraduationCap className="size-[14px] stroke-[1.75]" />} label="Examen" value={`${COURSE_EXAM_MIN} min`} />
      <Stat icon={<FileText className="size-[14px] stroke-[1.75]" />} label="Preguntas" value="60" />
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

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className="mt-12">
      <div className="mb-5">
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)] mb-1.5">
          {eyebrow}
        </div>
        <h2 className="font-display text-[22px] sm:text-[24px] font-semibold text-[var(--text-primary)] leading-tight tracking-[-0.015em]">
          {title}
        </h2>
        {description && (
          <p className="text-[14.5px] text-[var(--text-secondary)] mt-2 max-w-[600px]">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  )
}

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={[
        'rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] overflow-hidden',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}

/* --------------------------- Roadmap (PhaseRow) --------------------------- */

function PhaseRow({ phase }: { phase: Phase }) {
  return (
    <li
      className={[
        'flex items-center gap-3 sm:gap-4 px-4 py-3',
        phase.status === 'current' && 'bg-[var(--bg-active)]',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <PhaseIcon status={phase.status} />
      <span
        className={[
          'font-mono text-[12px] tabular-nums shrink-0 w-14 whitespace-nowrap',
          phase.status === 'current'
            ? 'text-[var(--text-active)] font-semibold'
            : 'text-[var(--text-muted)]',
        ].join(' ')}
      >
        Fase {phase.id}
      </span>
      <span
        className={[
          'flex-1 min-w-0 text-[14px] leading-snug',
          phase.status === 'current'
            ? 'text-[var(--text-active)] font-medium'
            : phase.status === 'done'
              ? 'text-[var(--text-primary)]'
              : 'text-[var(--text-secondary)]',
        ].join(' ')}
      >
        {phase.desc}
      </span>
      <PhaseBadge status={phase.status} />
    </li>
  )
}

function PhaseIcon({ status }: { status: PhaseStatus }) {
  if (status === 'done') {
    return (
      <CheckCircle2
        className="size-[16px] stroke-[2] shrink-0 text-emerald-600 dark:text-emerald-400"
        aria-hidden
      />
    )
  }
  if (status === 'current') {
    return (
      <span className="size-[16px] shrink-0 inline-flex items-center justify-center" aria-hidden>
        <span className="size-2.5 rounded-full bg-[var(--color-pv-purple-500)] ring-4 ring-[var(--color-pv-purple-500)]/20 animate-pulse" />
      </span>
    )
  }
  return <Circle className="size-[16px] stroke-[1.5] shrink-0 text-[var(--text-faint)]" aria-hidden />
}

function PhaseBadge({ status }: { status: PhaseStatus }) {
  const cls = 'text-[10.5px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 whitespace-nowrap'
  if (status === 'done') {
    return (
      <span className={`${cls} text-emerald-700 dark:text-emerald-300 bg-emerald-500/10`}>
        Completada
      </span>
    )
  }
  if (status === 'current') {
    return (
      <span
        className={`${cls} text-[var(--color-pv-purple-700)] dark:text-[var(--color-pv-purple-200)] bg-[var(--bg-active-strong)]`}
      >
        En curso
      </span>
    )
  }
  return <span className={`${cls} text-[var(--text-muted)] bg-[var(--bg-surface-2)]`}>Pendiente</span>
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

function ModuleRow({ module: m, isExam = false }: { module: CourseModule; isExam?: boolean }) {
  const isProduced = m.estado === 'producido'
  const moduleNum = String(m.id).padStart(2, '0')

  const inner = (
    <div className="flex items-center gap-3 sm:gap-4 px-4 py-3 group">
      {/* Estado icono */}
      <div className="shrink-0">
        {isProduced ? (
          <CheckCircle2
            className="size-[16px] stroke-[2] text-emerald-600 dark:text-emerald-400"
            aria-hidden
          />
        ) : (
          <Lock className="size-[14px] stroke-[1.75] text-[var(--text-faint)]" aria-hidden />
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
            isProduced ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)]',
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
        {isProduced ? (
          <span className="text-emerald-700 dark:text-emerald-300 font-medium">Disponible</span>
        ) : (
          <span className="text-[var(--text-muted)]">Fase {m.faseProduccion}</span>
        )}
      </div>
      {/* Flecha */}
      {isProduced && (
        <ArrowRight
          className="size-[14px] stroke-[1.75] text-[var(--text-muted)] shrink-0 group-hover:text-[var(--color-pv-purple-600)] dark:group-hover:text-[var(--color-pv-purple-300)] group-hover:translate-x-0.5 transition-all"
          aria-hidden
        />
      )}
    </div>
  )

  if (isProduced) {
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
  return <li className="opacity-75">{inner}</li>
}
