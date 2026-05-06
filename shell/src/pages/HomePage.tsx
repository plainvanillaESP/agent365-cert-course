import { Link } from 'react-router-dom'
import { ArrowRight, Clock, BookOpen, GraduationCap, FileText } from 'lucide-react'
import { AREAS, MODULES, COURSE_TOTAL_MIN, COURSE_EXAM_MIN, formatDuration } from '@/lib/course'

export function HomePage() {
  return (
    <article className="markdown-body max-w-[var(--layout-content-max)] mx-auto">
      {/* Encabezado */}
      <div>
        <div className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)] mb-2">
          Plain Vanilla Solutions · Curso de certificación
        </div>
        <h1>Microsoft Agent 365 IT Admin</h1>
        <p className="text-[16px] text-[var(--text-secondary)] leading-relaxed">
          Curso de certificación para administradores IT sobre Microsoft Agent 365 y la gobernanza de agentes de IA en Microsoft 365. 17 módulos estructurados, 18 horas de teoría y laboratorios, evaluación final medible y constancia de finalización.
        </p>
      </div>

      {/* Quick facts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px mt-8 rounded-md overflow-hidden border border-[var(--border-default)] bg-[var(--border-default)]">
        <Stat icon={<BookOpen className="size-[14px]" />} label="Módulos" value="17" />
        <Stat icon={<Clock className="size-[14px]" />} label="Duración" value={formatDuration(COURSE_TOTAL_MIN)} />
        <Stat icon={<GraduationCap className="size-[14px]" />} label="Examen" value={`${COURSE_EXAM_MIN} min`} />
        <Stat icon={<FileText className="size-[14px]" />} label="Preguntas" value="60" />
      </div>

      {/* Empezar */}
      <div className="mt-8 not-prose">
        <Link
          to="/modulo/1/teoria"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--color-pv-purple-600)] text-white text-[14px] font-medium hover:bg-[var(--color-pv-purple-700)] transition-colors"
        >
          Empezar por el Módulo 01
          <ArrowRight className="size-[14px]" />
        </Link>
      </div>

      <h2>Estado de producción</h2>
      <p>
        Este sitio se actualiza automáticamente cada vez que se mergea contenido a <code>main</code> en el repositorio. Solo el Módulo 01 está producido al 100 % en este momento; el resto se publica en sucesivas fases del plan.
      </p>

      <table>
        <thead>
          <tr>
            <th>Fase</th>
            <th>Descripción</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Fase 0</td><td>Investigación deep-research base</td><td>Completada</td></tr>
          <tr><td>Fase 1</td><td>Diseño maestro (blueprint, áreas, banco modelo)</td><td>Completada</td></tr>
          <tr><td>Fase 2</td><td>Módulo 01 prototipo de contenido</td><td>Completada</td></tr>
          <tr><td><strong>Fase 2.A</strong></td><td><strong>Prototipo del shell de e-learning con M01</strong></td><td><strong>En curso</strong></td></tr>
          <tr><td>Fase 3</td><td>Módulos 02-05 (Fundamentos &amp; Setup)</td><td>Pendiente</td></tr>
          <tr><td>Fase 4</td><td>Módulos 06-09 (Identidad y ciclo de vida)</td><td>Pendiente</td></tr>
          <tr><td>Fase 5</td><td>Módulos 10-13 (Datos, monitorización, CCS)</td><td>Pendiente</td></tr>
          <tr><td>Fase 6</td><td>Módulos 14-16 (Avanzado)</td><td>Pendiente</td></tr>
          <tr><td>Fase 7</td><td>Módulo 17 — Evaluación final</td><td>Pendiente</td></tr>
          <tr><td>Fase 8</td><td>Shell completo + auth + certificación + PDFs</td><td>Pendiente</td></tr>
        </tbody>
      </table>

      <h2>Áreas de competencia</h2>
      <p>
        El examen final pondera las cinco áreas según el peso oficial del producto. La columna <em>Módulos</em> indica qué módulos del curso cubren cada área.
      </p>

      <table>
        <thead>
          <tr>
            <th style={{ width: '8%' }}>Área</th>
            <th>Nombre</th>
            <th style={{ width: '12%' }}>Peso</th>
            <th style={{ width: '22%' }}>Módulos</th>
          </tr>
        </thead>
        <tbody>
          {AREAS.map(area => (
            <tr key={area.id}>
              <td><strong>{area.id}</strong></td>
              <td>
                <div className="font-medium">{area.nombreEs}</div>
                <div className="text-[12.5px] text-[var(--text-muted)] mt-0.5">{area.nombre}</div>
              </td>
              <td className="font-mono">{area.pesoExamen}%</td>
              <td className="font-mono text-[12.5px]">
                {area.modulos.map(m => `M${String(m).padStart(2, '0')}`).join(', ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Temario completo</h2>
      <p>
        Los módulos producidos son enlaces; los pendientes muestran su fase de producción.
      </p>

      <ul className="not-prose space-y-0 list-none p-0 m-0 mt-4 border border-[var(--border-default)] rounded-md overflow-hidden divide-y divide-[var(--border-subtle)]">
        {MODULES.filter(m => m.id <= 16).map(m => (
          <ModuleRow key={m.id} module={m} />
        ))}
      </ul>

      <div className="mt-3">
        <ul className="not-prose space-y-0 list-none p-0 m-0 border border-[var(--border-default)] rounded-md overflow-hidden">
          <ModuleRow module={MODULES[16]} isExam />
        </ul>
      </div>

      <h2>Sobre este sitio</h2>
      <p>
        Este shell es el prototipo del producto final del curso (Fase 2.A del plan). Renderiza el contenido producido en markdown como una experiencia navegable con tipografía técnica, modo oscuro y navegación lateral. Todavía no incluye autenticación, evaluación interactiva ni generación de certificado: esas piezas se añadirán en hitos posteriores de la Fase 2.A y se finalizarán en la Fase 8.
      </p>
      <p>
        Repositorio fuente: <a href="https://github.com/plainvanillaESP/agent365-cert-course" target="_blank" rel="noreferrer">github.com/plainvanillaESP/agent365-cert-course</a>.
      </p>
    </article>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-[var(--bg-surface)] px-4 py-3">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-[var(--text-muted)] mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-[18px] font-semibold leading-none text-[var(--text-primary)] tabular-nums">
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

  const inner = (
    <div className="flex items-center gap-4 px-4 py-2.5 group">
      <div className="font-mono text-[12px] font-medium text-[var(--text-muted)] w-7 shrink-0 tabular-nums">
        {String(m.id).padStart(2, '0')}
      </div>
      <div className="flex-1 min-w-0">
        <div className={[
          'text-[14px] leading-snug',
          isProduced ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-muted)]',
          isExam && 'font-semibold',
        ].filter(Boolean).join(' ')}>
          {m.titulo}
        </div>
      </div>
      <div className="text-[12px] text-[var(--text-muted)] tabular-nums shrink-0 hidden sm:block">
        {formatDuration(m.duracionMin)}
      </div>
      <div className="text-[12px] text-[var(--text-muted)] shrink-0 w-24 hidden md:block">
        {isProduced ? (
          <span className="text-emerald-700 dark:text-emerald-400">Disponible</span>
        ) : (
          <span>Fase {m.faseProduccion}</span>
        )}
      </div>
      {isProduced && (
        <ArrowRight className="size-[14px] text-[var(--text-muted)] shrink-0 group-hover:text-[var(--color-pv-purple-500)] group-hover:translate-x-0.5 transition-all" />
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
  return <li className="opacity-70">{inner}</li>
}
