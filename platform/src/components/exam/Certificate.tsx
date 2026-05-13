import { useEffect, useState } from 'react'
import { Printer, ArrowLeft, Trash2 } from 'lucide-react'
import { ButtonLink, Button } from '@/components/Button'
import { ShareButtons } from '@/components/ShareButtons'
import { useCourse } from '@/contexts/CourseContext'
import type { ExamAttempt } from '@/hooks/useExamState'
import { CertificateSeal } from './CertificateSeal'
import { CertificateBadge } from './CertificateBadge'
import { COURSE_CERT_TITLE, COURSE_CERT_LEGAL_NAME } from '@/lib/course'

const LOGO_POSITIVO = `${import.meta.env.BASE_URL}logotipo-positivo.svg`

const LEARNER_NAME_KEY = 'pv-learn-learner-name'

function loadStoredName(): string {
  if (typeof localStorage === 'undefined') return ''
  try {
    return localStorage.getItem(LEARNER_NAME_KEY) ?? ''
  } catch {
    return ''
  }
}

function storeName(name: string): void {
  if (typeof localStorage === 'undefined') return
  try {
    if (name.trim()) localStorage.setItem(LEARNER_NAME_KEY, name.trim())
    else localStorage.removeItem(LEARNER_NAME_KEY)
  } catch {
    /* localStorage bloqueado, ignorar */
  }
}

interface CertificateProps {
  attempt: ExamAttempt
}

/**
 * Vista del certificado. Sigue dos modos:
 *
 *   - Pantalla normal: cabecera de retorno, botón "Imprimir" y formulario
 *     para introducir el nombre del alumno antes de imprimir.
 *   - Modo impresión: solo el certificado, sin cabeceras ni controles
 *     (gestionado vía CSS print del shell).
 *
 * No generamos PDF en frontend: el browser abre el cuadro de impresión y
 * el usuario elige "Guardar como PDF". Cero dependencias añadidas y
 * compatible con cualquier navegador moderno.
 *
 * El nombre del alumno se guarda en localStorage SOLO si el alumno marca
 * el consentimiento explícito. Si no, se mantiene en memoria durante la
 * visita pero no se persiste. Botón visible para borrar el nombre guardado.
 */
export function Certificate({ attempt }: CertificateProps) {
  const [name, setName] = useState(() => loadStoredName())
  const [consent, setConsent] = useState<boolean>(() => loadStoredName().length > 0)
  const { href } = useCourse()

  // Si el alumno acepta el consentimiento, persistimos al teclear.
  // Si lo desactiva, eliminamos lo guardado previamente.
  useEffect(() => {
    if (consent) storeName(name)
    else if (loadStoredName()) storeName('')
  }, [consent, name])

  const verificationId = makeVerificationId(attempt)
  const issuedAt = new Date(attempt.submittedAt)
  const hasStoredName = loadStoredName().length > 0

  return (
    <div className="space-y-6">
      {/* Controles solo en pantalla */}
      <div className="print:hidden max-w-4xl mx-auto space-y-3">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <ButtonLink
            to={href('examen')}
            variant="ghost"
            size="md"
            iconLeft={<ArrowLeft className="size-[16px] stroke-[1.75]" aria-hidden />}
          >
            Volver al examen
          </ButtonLink>
          <div className="flex items-center gap-3 flex-wrap">
            <label className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
              <span>Tu nombre:</span>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nombre y apellidos"
                className="rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-1.5 text-[13.5px] w-[260px] focus:outline-none focus:ring-2 focus:ring-[var(--color-pv-purple-600)]"
              />
            </label>
            <Button
              variant="primary"
              size="md"
              onClick={() => window.print()}
              disabled={!name.trim()}
              iconLeft={<Printer className="size-[16px] stroke-[2]" aria-hidden />}
            >
              Imprimir o guardar como PDF
            </Button>
          </div>
        </div>

        <div className="rounded-md border border-[var(--border-default)] bg-[var(--bg-surface-2)] px-4 py-3 text-[13px] text-[var(--text-secondary)] flex flex-wrap items-center gap-3">
          <label className="flex items-start gap-2 cursor-pointer flex-1 min-w-[280px]">
            <input
              type="checkbox"
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              className="mt-[3px] accent-[var(--color-pv-purple-600)]"
            />
            <span className="leading-snug">
              Recordar mi nombre en este navegador para futuros certificados.
              {' '}
              <span className="text-[var(--text-muted)]">
                Se guarda solo en este dispositivo (localStorage). Puedes borrarlo en cualquier momento.
              </span>
            </span>
          </label>
          {hasStoredName && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                storeName('')
                setName('')
                setConsent(false)
              }}
              iconLeft={<Trash2 className="size-3.5 stroke-[1.75]" aria-hidden />}
            >
              Borrar nombre guardado
            </Button>
          )}
        </div>

        <p className="text-[12.5px] text-[var(--text-muted)]">
          Al pulsar imprimir, tu navegador abrirá el cuadro de impresión estándar.
          En la mayoría de navegadores puedes elegir <strong>«Guardar como PDF»</strong> como destino para obtener un archivo descargable.
        </p>

        {/* Compartir: enlaces a redes (LinkedIn / X), Web Share API en
            mobile y copia al portapapeles. El enlace lleva al
            certificado en este navegador; cuando exista verificación
            pública (fase 9 backend) el shareUrl podrá apuntar a la URL
            verificable persistente. */}
        <div className="pt-1">
          <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-muted)] font-semibold mb-2">
            Compartir
          </div>
          <ShareButtons
            text={
              name.trim()
                ? `He aprobado el examen de certificación ${COURSE_CERT_TITLE}.`
                : `Examen de certificación ${COURSE_CERT_TITLE} aprobado.`
            }
            title={`Certificado ${COURSE_CERT_TITLE}`}
          />
        </div>
      </div>

      {/* Lienzo del certificado */}
      <article
        className={[
          'cert-page',
          'mx-auto bg-white text-slate-900',
          'border border-slate-300 print:border-none',
          'shadow-md print:shadow-none',
          'p-10 sm:p-14',
          'w-full max-w-[920px]',
          'aspect-[1.414/1]',
        ].join(' ')}
      >
        <div className="h-full flex flex-col">
          {/* Cabecera */}
          <header className="flex items-center justify-between">
            <img
              src={LOGO_POSITIVO}
              alt="Plain Vanilla"
              className="h-8"
              decoding="async"
            />
            <div className="text-right">
              <div className="text-[10.5px] uppercase tracking-[0.12em] text-slate-500 font-semibold">
                Certificado oficial
              </div>
              <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                ID {verificationId}
              </div>
            </div>
          </header>

          {/* Cuerpo */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8 gap-5">
            <div className="text-[12px] uppercase tracking-[0.18em] text-slate-500 font-semibold">
              Plain Vanilla acredita que
            </div>
            <div className="text-[36px] sm:text-[44px] font-semibold leading-[1.05] tracking-[-0.01em] text-slate-900 min-h-[1.2em]">
              {name.trim() || <span className="text-slate-300">Tu nombre aparecerá aquí</span>}
            </div>
            <div className="text-[15px] text-slate-700 max-w-xl leading-relaxed">
              ha completado satisfactoriamente el examen de certificación
            </div>
            <div className="text-[22px] sm:text-[26px] font-semibold text-slate-900">
              {COURSE_CERT_TITLE}
            </div>
            <div className="flex items-baseline gap-6 mt-4">
              <Stat label="Puntuación" value={`${attempt.scoring.pct} %`} />
              <Stat label="Aciertos" value={`${attempt.scoring.score} / ${attempt.scoring.total}`} />
              <Stat
                label="Fecha"
                value={issuedAt.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
              />
            </div>
          </div>

          {/* Pie */}
          <footer className="border-t border-slate-200 pt-5 mt-2">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-end">
              {/* Firma y emisor (izquierda) */}
              <div className="space-y-1">
                <div className="h-[34px] border-b border-slate-400" aria-hidden />
                <div className="text-[10.5px] uppercase tracking-[0.12em] text-slate-500 font-semibold">
                  Firma
                </div>
                <div className="text-[12px] text-slate-700">
                  Director Gerente, Plain Vanilla Solutions SL
                </div>
              </div>

              {/* Sello (centro) */}
              <div className="flex justify-center">
                <CertificateSeal size={120} />
              </div>

              {/* Insignia + emisor (derecha) */}
              <div className="flex flex-col items-end gap-2">
                <CertificateBadge verificationId={verificationId} size={84} />
                <div className="text-right">
                  <div className="text-[10.5px] text-slate-500 uppercase tracking-[0.08em]">Emitido por</div>
                  <div className="text-[13px] font-semibold text-slate-900">Plain Vanilla Solutions SL</div>
                  <div className="text-[10.5px] text-slate-500">B87644233, Madrid</div>
                </div>
              </div>
            </div>

            <p className="text-[10.5px] text-slate-500 leading-relaxed pt-4 mt-4 border-t border-slate-100">
              Este certificado acredita la superación del examen final del curso
              <em> {COURSE_CERT_LEGAL_NAME} </em>
              impartido por Plain Vanilla Solutions SL. La autenticidad se verifica con el ID y la insignia visual de la esquina superior derecha.
            </p>
          </footer>
        </div>
      </article>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-[0.12em] text-slate-500 font-semibold">{label}</div>
      <div className="text-[18px] font-semibold tabular-nums text-slate-900 mt-0.5">{value}</div>
    </div>
  )
}

/**
 * ID de verificación reproducible a partir del intento. Formato AG365-XXXX-YYYY,
 * no es criptográfico: es una huella corta basada en el id del intento +
 * timestamp de envío.
 */
function makeVerificationId(attempt: ExamAttempt): string {
  const hash = simpleHash(`${attempt.id}::${attempt.submittedAt}`)
  const a = (hash & 0xffff).toString(16).padStart(4, '0').toUpperCase()
  const b = ((hash >>> 16) & 0xffff).toString(16).padStart(4, '0').toUpperCase()
  return `AG365-${a}-${b}`
}

function simpleHash(s: string): number {
  let h = 0x811c9dc5 // FNV-1a offset
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h >>> 0
}
