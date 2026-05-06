import { Link } from 'react-router-dom'
import { ArrowRight, Clock, BookOpen, GraduationCap } from 'lucide-react'
import { AREAS, MODULES, COURSE_TOTAL_MIN, COURSE_EXAM_MIN, formatDuration } from '@/lib/course'

export function HomePage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 animate-fade-in-up">
      {/* Hero */}
      <section className="mb-16">
        <div className="text-[12px] uppercase tracking-[0.18em] font-semibold text-[var(--color-pv-purple-600)] mb-4">
          Curso de certificación · Plain Vanilla Solutions
        </div>
        <h1 className="font-display text-[44px] sm:text-[56px] font-700 leading-[1.05] tracking-tight max-w-4xl">
          Microsoft Agent 365 para{' '}
          <span className="text-pv-gradient">administradores IT</span>
        </h1>
        <p className="mt-6 text-[19px] sm:text-[20px] text-[var(--text-secondary)] max-w-3xl leading-relaxed">
          Aprende a gobernar agentes de IA en Microsoft 365: identidades en Entra Agent ID, registry y ciclo de vida, protección de datos con Purview, y monitorización con Defender. 18 horas estructuradas, evaluación medible, certificado al finalizar.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            to="/modulo/1/teoria"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-pv-gradient text-white font-medium text-[15px] shadow-[var(--shadow-pv-md)] hover:shadow-[var(--shadow-pv-lg)] transition-shadow"
          >
            Empezar por el Módulo 01
            <ArrowRight className="size-[18px]" />
          </Link>
          <a
            href="#contenido"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[var(--border-strong)] text-[var(--text-primary)] font-medium text-[15px] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            Ver el temario
          </a>
        </div>

        {/* Stats row */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12 max-w-3xl">
          <Stat icon={<BookOpen className="size-5" />} label="Módulos" value="17" />
          <Stat icon={<Clock className="size-5" />} label="Duración" value={formatDuration(COURSE_TOTAL_MIN)} />
          <Stat icon={<GraduationCap className="size-5" />} label="Examen" value={`${COURSE_EXAM_MIN} min`} />
          <Stat label="Preguntas" value="60" />
        </div>
      </section>

      {/* Áreas de competencia */}
      <section className="mb-16">
        <h2 className="font-display text-[28px] font-600 mb-2">Cinco áreas de competencia</h2>
        <p className="text-[var(--text-secondary)] mb-8 max-w-2xl">
          El examen final pondera las cinco áreas según el peso oficial del producto. Cada módulo cubre una de ellas.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AREAS.map(area => (
            <div
              key={area.id}
              className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] hover:border-[var(--color-pv-purple-300)] transition-colors"
            >
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-[12px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">
                  Área {area.id}
                </span>
                <span className="font-mono text-[20px] font-700 text-pv-gradient">
                  {area.pesoExamen}%
                </span>
              </div>
              <h3 className="font-display text-[17px] font-600 leading-snug mb-2">
                {area.nombreEs}
              </h3>
              <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">
                {area.nombre}
              </p>
              <div className="mt-4 text-[12px] text-[var(--text-secondary)]">
                Módulos: {area.modulos.map(m => `M${String(m).padStart(2, '0')}`).join(', ')}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Temario */}
      <section id="contenido">
        <h2 className="font-display text-[28px] font-600 mb-2">Temario</h2>
        <p className="text-[var(--text-secondary)] mb-8 max-w-2xl">
          Solo el Módulo 01 está producido en este prototipo. Los siguientes se publicarán en sucesivas fases del plan.
        </p>

        <div className="space-y-1">
          {MODULES.filter(m => m.id <= 16).map(m => (
            <ModuleRow key={m.id} module={m} />
          ))}

          {/* Módulo 17 (examen) destacado */}
          <div className="pt-6 mt-6 border-t border-[var(--border-default)]">
            <ModuleRow module={MODULES[16]} isExam />
          </div>
        </div>
      </section>
    </div>
  )
}

function Stat({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-[12px] uppercase tracking-wider font-semibold text-[var(--text-muted)] mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <div className="font-display text-[28px] font-700 leading-none text-[var(--text-primary)]">
        {value}
      </div>
    </div>
  )
}

function ModuleRow({
  module: m,
  isExam = false,
}: {
  module: typeof MODULES[number]
  isExam?: boolean
}) {
  const isProduced = m.estado === 'producido'
  const target = isProduced ? `/modulo/${m.id}/teoria` : null

  const content = (
    <div className="flex items-center gap-4 py-3 px-4 rounded-xl group">
      <div className="font-mono text-[13px] font-semibold text-[var(--text-muted)] w-8 shrink-0 tabular-nums">
        {String(m.id).padStart(2, '0')}
      </div>
      <div className="flex-1 min-w-0">
        <div className={[
          'font-medium text-[15px] leading-snug',
          isProduced ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]',
          isExam && 'font-display font-600 text-[16px]',
        ].filter(Boolean).join(' ')}>
          {m.titulo}
        </div>
        <div className="text-[12px] text-[var(--text-muted)] mt-0.5 flex items-center gap-2 flex-wrap">
          <span>{formatDuration(m.duracionMin)}</span>
          {m.preguntas > 0 && (
            <>
              <span className="opacity-50">·</span>
              <span>{m.preguntas} {m.preguntas === 1 ? 'pregunta' : 'preguntas'}</span>
            </>
          )}
          {!isProduced && (
            <>
              <span className="opacity-50">·</span>
              <span className="text-[var(--color-pv-purple-600)]">Pendiente · Fase {m.faseProduccion}</span>
            </>
          )}
        </div>
      </div>
      {isProduced && (
        <ArrowRight className="size-[16px] text-[var(--text-muted)] group-hover:text-[var(--color-pv-purple-500)] group-hover:translate-x-0.5 transition-all" />
      )}
    </div>
  )

  if (target) {
    return (
      <Link to={target} className="block hover:bg-[var(--bg-surface-hover)] rounded-xl transition-colors">
        {content}
      </Link>
    )
  }
  return <div className="opacity-70">{content}</div>
}
