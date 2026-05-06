import { ArrowRight, Clock, BookOpen, GraduationCap, FileText, CheckCircle2, Circle, Lock } from 'lucide-react'
import { ButtonLink } from '@/components/Button'
import { AREAS, MODULES, COURSE_TOTAL_MIN, COURSE_EXAM_MIN, formatDuration } from '@/lib/course'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

const PHASES = [
  { id: '0',   desc: 'Investigación deep-research base',                 status: 'done'    as const },
  { id: '1',   desc: 'Diseño maestro (blueprint, áreas, banco modelo)',  status: 'done'    as const },
  { id: '2',   desc: 'Módulo 01 prototipo de contenido',                 status: 'done'    as const },
  { id: '2.A', desc: 'Prototipo del shell de e-learning con M01',        status: 'current' as const },
  { id: '3',   desc: 'Módulos 02–05 (Fundamentos & Setup)',              status: 'todo'    as const },
  { id: '4',   desc: 'Módulos 06–09 (Identidad y ciclo de vida)',        status: 'todo'    as const },
  { id: '5',   desc: 'Módulos 10–13 (Datos, monitorización, CCS)',       status: 'todo'    as const },
  { id: '6',   desc: 'Módulos 14–16 (Avanzado)',                         status: 'todo'    as const },
  { id: '7',   desc: 'Módulo 17 — Evaluación final',                     status: 'todo'    as const },
  { id: '8',   desc: 'Shell completo + auth + certificación + PDFs',     status: 'todo'    as const },
]

export function HomePage() {
  return (
    <div className="max-w-[var(--layout-content-max)] mx-auto">
      {/* Hero: introducción del curso */}
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
            iconRight={<ArrowRight className="size-4 stroke-[2.25]" />}
          >
            Empezar por el Módulo 01
          </ButtonLink>
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-4 -mx-px rounded-lg overflow-hidden border border-[var(--border-default)] bg-[var(--border-subtle)] gap-px">
        <Stat icon={<BookOpen className="size-[14px] stroke-[1.75]" />} label="Módulos" value="17" />
        <Stat icon={<Clock className="size-[14px] stroke-[1.75]" />} label="Duración" value={formatDuration(COURSE_TOTAL_MIN)} />
        <Stat icon={<GraduationCap className="size-[14px] stroke-[1.75]" />} label="Examen" value={`${COURSE_EXAM_MIN} min`} />
        <Stat icon={<FileText className="size-[14px] stroke-[1.75]" />} label="Preguntas" value="60" />
      </section>

      {/* Estado de producción */}
      <Section
        eyebrow="Roadmap"
        title="Estado de producción"
        description="Este sitio se actualiza automáticamente al mergear contenido a main. Solo el Módulo 01 está producido al 100 % en este momento; el resto se publica en sucesivas fases del plan."
      >
        <ul className="rounded-lg border border-[var(--border-default)] divide-y divide-[var(--border-subtle)] overflow-hidden bg-[var(--bg-surface)]">
          {PHASES.map(p => (
            <li
              key={p.id}
              className={[
                'flex items-center gap-4 px-4 py-3',
                p.status === 'current' && 'bg-[var(--bg-active)]',
              ].filter(Boolean).join(' ')}
            >
              <PhaseIcon status={p.status} />
              <div className="flex-1 min-w-0 flex items-center gap-3">
                <span
                  className={[
                    'font-mono text-[12px] tabular-nums shrink-0 w-12',
                    p.status === 'current' ? 'text-[var(--text-active)] font-semibold' : 'text-[var(--text-muted)]',
                  ].join(' ')}
                >
                  Fase {p.id}
                </span>
                <span
                  className={[
                    'text-[14px] leading-snug',
                    p.status === 'current' ? 'text-[var(--text-active)] font-medium'
                      : p.status === 'done' ? 'text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)]',
                  ].join(' ')}
                >
                  {p.desc}
                </span>
              </div>
              <PhaseBadge status={p.status} />
            </li>
          ))}
        </ul>
      </Section>

      {/* Áreas de competencia */}
      <Section
        eyebrow="Examen"
        title="Áreas de competencia"
        description="El examen final pondera las cinco áreas según el peso oficial. Los módulos cubren cada área en bloques temáticos."
      >
        <div className="space-y-3">
          {AREAS.map(area => (
            <div
              key={area.id}
              className="flex items-start gap-4 p-4 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)]"
            >
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
                <div className="text-[13px] text-[var(--text-muted)] mt-1 italic">
                  {area.nombre}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-mono text-[18px] font-semibold tabular-nums text-[var(--text-primary)] leading-none">
                  {area.pesoExamen}%
                </div>
                <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider mt-1">
                  Peso
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Temario */}
      <Section
        eyebrow="Temario"
        title="Los 17 módulos del curso"
        description="Los módulos producidos son enlaces; los pendientes muestran su fase de producción."
      >
        <ul className="rounded-lg border border-[var(--border-default)] divide-y divide-[var(--border-subtle)] overflow-hidden bg-[var(--bg-surface)]">
          {MODULES.filter(m => m.id <= 16).map(m => (
            <ModuleRow key={m.id} module={m} />
          ))}
        </ul>

        <div className="mt-3">
          <ul className="rounded-lg border border-[var(--border-default)] overflow-hidden bg-[var(--bg-surface)]">
            <ModuleRow module={MODULES[16]} isExam />
          </ul>
        </div>
      </Section>

      {/* Sobre este sitio */}
      <Section
        eyebrow="Sobre"
        title="Sobre este sitio"
        description=""
      >
        <div className="markdown-body">
          <p>
            Este shell es el prototipo del producto final del curso (Fase 2.A del plan).
            Renderiza el contenido producido en markdown como una experiencia navegable con
            tipografía técnica, modo oscuro y navegación lateral. Todavía no incluye
            autenticación, evaluación interactiva ni generación de certificado: esas piezas
            se añadirán en hitos posteriores de la Fase 2.A y se finalizarán en la Fase 8.
          </p>
          <p>
            Repositorio fuente:{' '}
            <a
              href="https://github.com/plainvanillaESP/agent365-cert-course"
              target="_blank"
              rel="noreferrer"
            >
              github.com/plainvanillaESP/agent365-cert-course
            </a>
            .
          </p>
        </div>
      </Section>
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

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="bg-[var(--bg-surface)] px-4 py-3.5">
      <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.06em] font-semibold text-[var(--text-muted)] mb-1.5">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-[20px] font-semibold leading-none text-[var(--text-primary)] tabular-nums font-display tracking-tight">
        {value}
      </div>
    </div>
  )
}

function PhaseIcon({ status }: { status: 'done' | 'current' | 'todo' }) {
  if (status === 'done') {
    return <CheckCircle2 className="size-[16px] stroke-[2] shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
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

function PhaseBadge({ status }: { status: 'done' | 'current' | 'todo' }) {
  const cls = 'text-[10.5px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded shrink-0'
  if (status === 'done') {
    return <span className={`${cls} text-emerald-700 dark:text-emerald-300 bg-emerald-500/10`}>Completada</span>
  }
  if (status === 'current') {
    return <span className={`${cls} text-[var(--color-pv-purple-700)] dark:text-[var(--color-pv-purple-200)] bg-[var(--bg-active-strong)]`}>En curso</span>
  }
  return <span className={`${cls} text-[var(--text-muted)] bg-[var(--bg-surface-2)]`}>Pendiente</span>
}

function ModuleRow({
  module: m,
  isExam = false,
}: {
  module: typeof MODULES[number]
  isExam?: boolean
}) {
  const isProduced = m.estado === 'producido'
  const moduleNum = String(m.id).padStart(2, '0')

  const inner = (
    <div className="flex items-center gap-4 px-4 py-3 group">
      {/* Estado icono */}
      <div className="shrink-0">
        {isProduced
          ? <CheckCircle2 className="size-[16px] stroke-[2] text-emerald-600 dark:text-emerald-400" aria-hidden />
          : <Lock className="size-[14px] stroke-[1.75] text-[var(--text-faint)]" aria-hidden />}
      </div>
      {/* Número */}
      <div className="font-mono text-[12px] font-medium text-[var(--text-muted)] w-7 shrink-0 tabular-nums">
        {moduleNum}
      </div>
      {/* Título */}
      <div className="flex-1 min-w-0">
        <div className={[
          'text-[14px] leading-snug',
          isProduced ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)]',
          isExam && 'font-semibold',
        ].filter(Boolean).join(' ')}>
          {m.titulo}
        </div>
      </div>
      {/* Duración */}
      <div className="text-[12px] text-[var(--text-muted)] tabular-nums shrink-0 hidden sm:block w-12 text-right">
        {formatDuration(m.duracionMin)}
      </div>
      {/* Estado texto */}
      <div className="text-[12px] shrink-0 w-24 hidden md:block">
        {isProduced ? (
          <span className="text-emerald-700 dark:text-emerald-300 font-medium">Disponible</span>
        ) : (
          <span className="text-[var(--text-muted)]">Fase {m.faseProduccion}</span>
        )}
      </div>
      {/* Flecha */}
      {isProduced && (
        <ArrowRight className="size-[14px] stroke-[1.75] text-[var(--text-muted)] shrink-0 group-hover:text-[var(--color-pv-purple-600)] dark:group-hover:text-[var(--color-pv-purple-300)] group-hover:translate-x-0.5 transition-all" aria-hidden />
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
