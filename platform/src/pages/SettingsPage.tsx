import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, ShieldOff, Trash2, Download, Upload, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/Button'
import {
  getAccessMode,
  setAccessMode,
  clearAllProgress,
  type AccessMode,
} from '@/lib/progress'

/**
 * Página /ajustes — controles que afectan a toda la plataforma:
 *
 *   - Modo de acceso (secuencial vs libre).
 *   - Borrar todo el progreso del curso (módulos + reading scroll + visitas).
 *   - Borrar historial del examen y nombre del certificado.
 *   - Exportar el estado completo a JSON descargable.
 *   - Importar estado desde JSON (con confirmación previa).
 *
 * Todas las operaciones tocan localStorage y notifican al motor de
 * progreso. El usuario controla aquí su sesión sin depender de devtools.
 */
export function SettingsPage() {
  const [mode, setMode] = useState<AccessMode>(getAccessMode())
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  // Si otro tab cambia el modo, refrescamos.
  useEffect(() => {
    const onStorage = () => setMode(getAccessMode())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Auto-clear del aviso tras 4s.
  useEffect(() => {
    if (!notice) return
    const id = window.setTimeout(() => setNotice(null), 4000)
    return () => window.clearTimeout(id)
  }, [notice])

  const handleModeChange = (m: AccessMode) => {
    setAccessMode(m)
    setMode(m)
    setNotice({ type: 'ok', text: m === 'free' ? 'Acceso libre activado. Todos los módulos quedan accesibles.' : 'Acceso secuencial activado.' })
  }

  const handleClearProgress = () => {
    const ok = window.confirm(
      'Vas a borrar TODO tu progreso de los 16 módulos (lectura, quizzes, visitas a labs y recursos). El historial del examen se borra aparte. ¿Confirmas?',
    )
    if (!ok) return
    clearAllProgress()
    setNotice({ type: 'ok', text: 'Progreso de los módulos borrado.' })
  }

  const handleClearExam = () => {
    const ok = window.confirm(
      'Vas a borrar el historial de intentos del examen final (incluyendo certificados generados). ¿Confirmas?',
    )
    if (!ok) return
    try {
      localStorage.removeItem('agent365-exam-history')
      localStorage.removeItem('agent365-exam-current')
      window.dispatchEvent(new CustomEvent('agent365-progress-changed'))
      setNotice({ type: 'ok', text: 'Historial del examen borrado.' })
    } catch {
      setNotice({ type: 'err', text: 'No se pudo borrar (localStorage bloqueado).' })
    }
  }

  const handleClearName = () => {
    try {
      localStorage.removeItem('agent365-learner-name')
      setNotice({ type: 'ok', text: 'Nombre del alumno borrado.' })
    } catch {
      setNotice({ type: 'err', text: 'No se pudo borrar (localStorage bloqueado).' })
    }
  }

  const handleExport = () => {
    try {
      const dump = collectStorageDump()
      const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `agent365-progreso-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      setNotice({ type: 'ok', text: 'Progreso exportado.' })
    } catch (e) {
      setNotice({ type: 'err', text: 'Error al exportar: ' + (e instanceof Error ? e.message : 'desconocido') })
    }
  }

  const handleImport = async (file: File) => {
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      if (typeof data !== 'object' || data === null) {
        throw new Error('archivo inválido')
      }
      const ok = window.confirm(
        'Importar este archivo sustituirá tu progreso actual de Agent 365 en este navegador. ¿Continuar?',
      )
      if (!ok) return
      applyStorageDump(data as Record<string, string>)
      setMode(getAccessMode())
      setNotice({ type: 'ok', text: `Progreso importado (${Object.keys(data).length} claves).` })
    } catch (e) {
      setNotice({ type: 'err', text: 'Error al importar: ' + (e instanceof Error ? e.message : 'archivo inválido') })
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-[var(--text-muted)] font-semibold">
          <SettingsIcon className="size-[14px] stroke-[1.75]" aria-hidden />
          Ajustes
        </div>
        <h1 className="text-[28px] font-semibold text-[var(--text-primary)] leading-tight">
          Configuración del curso
        </h1>
        <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          Controla cómo accedes al curso y gestiona los datos guardados en este navegador. Todos los cambios afectan solo a este dispositivo.
        </p>
      </header>

      {notice && (
        <div
          className={[
            'rounded-md border px-4 py-3 text-[13.5px] flex items-start gap-2',
            notice.type === 'ok'
              ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200'
              : 'border-red-500/60 bg-red-500/10 text-red-800 dark:text-red-200',
          ].join(' ')}
        >
          {notice.type === 'ok' ? (
            <CheckCircle2 className="size-[16px] stroke-[1.75] shrink-0 mt-0.5" aria-hidden />
          ) : (
            <AlertCircle className="size-[16px] stroke-[1.75] shrink-0 mt-0.5" aria-hidden />
          )}
          <span>{notice.text}</span>
        </div>
      )}

      {/* Modo de acceso */}
      <Section title="Modo de acceso" description="Decide si los módulos se desbloquean en orden o si puedes saltar libremente.">
        <div className="grid sm:grid-cols-2 gap-3">
          <ChoiceCard
            active={mode === 'sequential'}
            onClick={() => handleModeChange('sequential')}
            title="Acceso secuencial (recomendado)"
            body="Cada módulo se desbloquea cuando los anteriores están completos. Coherente con el itinerario diseñado."
          />
          <ChoiceCard
            active={mode === 'free'}
            onClick={() => handleModeChange('free')}
            title="Acceso libre"
            body="Todos los módulos producidos son accesibles desde el primer día. Útil si vas a buscar contenido específico."
          />
        </div>
      </Section>

      {/* Borrado */}
      <Section title="Borrar datos" description="Limpia el progreso local. Cada acción se confirma antes de ejecutarse.">
        <div className="space-y-2">
          <DangerRow
            title="Borrar progreso de los módulos"
            body="Elimina la lectura, los intentos de quiz y las visitas a laboratorios y recursos. No afecta al historial del examen ni a tu nombre."
            buttonLabel="Borrar progreso"
            onClick={handleClearProgress}
          />
          <DangerRow
            title="Borrar historial del examen"
            body="Elimina todos los intentos del examen final (incluido el actual si está en curso) y los certificados generados."
            buttonLabel="Borrar examen"
            onClick={handleClearExam}
          />
          <DangerRow
            title="Borrar nombre guardado del certificado"
            body="Si marcaste «recordar mi nombre» en el certificado, esto lo elimina. Tu intento aprobado se mantiene."
            buttonLabel="Borrar nombre"
            onClick={handleClearName}
          />
        </div>
      </Section>

      {/* Exportar / importar */}
      <Section title="Exportar e importar progreso" description="Mueve tu progreso entre navegadores o haz una copia de seguridad.">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={handleExport}
            iconLeft={<Download className="size-[15px] stroke-[1.75]" aria-hidden />}
          >
            Exportar progreso (JSON)
          </Button>
          <label className="inline-flex items-center">
            <input
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) void handleImport(f)
                // permitir re-seleccionar el mismo archivo
                e.target.value = ''
              }}
            />
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-[13.5px] font-medium cursor-pointer bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-default)] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-strong)]"
            >
              <Upload className="size-[15px] stroke-[1.75]" aria-hidden />
              Importar progreso
            </span>
          </label>
        </div>
        <p className="text-[12.5px] text-[var(--text-muted)] pt-2">
          El archivo incluye solo las claves `agent365-*` de localStorage de este dominio. No contiene credenciales ni datos sensibles más allá del nombre que hayas guardado para el certificado.
        </p>
      </Section>
    </div>
  )
}

function Section({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">{title}</h2>
        <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{description}</p>
      </div>
      {children}
    </section>
  )
}

function ChoiceCard({
  active,
  onClick,
  title,
  body,
}: {
  active: boolean
  onClick: () => void
  title: string
  body: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'text-left rounded-md border p-4 transition-colors',
        active
          ? 'border-[var(--color-pv-purple-600)] bg-[var(--color-pv-purple-600)]/8 ring-2 ring-[var(--color-pv-purple-600)]/30'
          : 'border-[var(--border-default)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)]',
      ].join(' ')}
    >
      <div className="text-[14px] font-semibold text-[var(--text-primary)] mb-1">{title}</div>
      <div className="text-[12.5px] text-[var(--text-secondary)] leading-relaxed">{body}</div>
    </button>
  )
}

function DangerRow({
  title,
  body,
  buttonLabel,
  onClick,
}: {
  title: string
  body: string
  buttonLabel: string
  onClick: () => void
}) {
  return (
    <div className="rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] p-4 flex flex-wrap items-start gap-3 justify-between">
      <div className="space-y-1 max-w-2xl">
        <div className="flex items-center gap-2 text-[14px] font-semibold text-[var(--text-primary)]">
          <ShieldOff className="size-[14px] stroke-[1.75] text-[var(--text-muted)]" aria-hidden />
          {title}
        </div>
        <div className="text-[12.5px] text-[var(--text-secondary)] leading-relaxed">{body}</div>
      </div>
      <Button
        variant="secondary"
        size="sm"
        onClick={onClick}
        iconLeft={<Trash2 className="size-[14px] stroke-[1.75]" aria-hidden />}
      >
        {buttonLabel}
      </Button>
    </div>
  )
}

/* ------------------------- export/import helpers -------------------------- */

const STORAGE_PREFIX = 'agent365-'

function collectStorageDump(): Record<string, string> {
  const out: Record<string, string> = {}
  if (typeof localStorage === 'undefined') return out
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (!k) continue
    if (!k.startsWith(STORAGE_PREFIX)) continue
    const v = localStorage.getItem(k)
    if (v !== null) out[k] = v
  }
  return out
}

function applyStorageDump(data: Record<string, string>): void {
  if (typeof localStorage === 'undefined') return
  // Limpiar keys agent365-* actuales
  const toRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k && k.startsWith(STORAGE_PREFIX)) toRemove.push(k)
  }
  for (const k of toRemove) localStorage.removeItem(k)
  // Aplicar entradas del dump (solo claves agent365-*)
  for (const [k, v] of Object.entries(data)) {
    if (typeof v !== 'string') continue
    if (!k.startsWith(STORAGE_PREFIX)) continue
    try {
      localStorage.setItem(k, v)
    } catch {
      /* localStorage lleno o bloqueado, salta esa entrada */
    }
  }
  window.dispatchEvent(new CustomEvent('agent365-progress-changed'))
}
