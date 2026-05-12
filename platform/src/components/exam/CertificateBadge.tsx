import type React from 'react'

/**
 * Insignia visual del certificado: patrón de cuadrícula 11x11 derivado
 * determinísticamente del verificationId. Tiene el aspecto de un QR pero
 * NO es escaneable: es un identificador visual único por intento.
 *
 * La motivación: un QR real necesitaría una librería de QR o un servicio
 * externo, lo que rompe el principio del proyecto (cero deps añadidas y
 * funciona offline). El patrón visual cumple la función de "huella
 * distintiva" sin esos costes.
 *
 * Si en el futuro se quiere un QR escaneable, este componente se puede
 * sustituir por uno basado en `qrcode-generator` o equivalente sin tocar
 * el resto del certificado.
 */
export function CertificateBadge({
  verificationId,
  size = 96,
}: {
  verificationId: string
  size?: number
}) {
  const grid = 11
  const cell = size / grid

  // Hash determinístico del id en un array de booleanos
  const seed = simpleHash(verificationId)
  const cells: boolean[] = []
  let s = seed
  for (let i = 0; i < grid * grid; i++) {
    // LCG simple: x' = a * x + c mod m
    s = (s * 1664525 + 1013904223) >>> 0
    cells.push((s & 1) === 1)
  }

  // Esquinas decorativas tipo "marker" para mantener la estética QR
  const markerSize = 3
  const isInMarker = (r: number, c: number) =>
    (r < markerSize && c < markerSize) ||
    (r < markerSize && c >= grid - markerSize) ||
    (r >= grid - markerSize && c < markerSize)
  const isMarkerOuter = (r: number, c: number) => {
    if (!isInMarker(r, c)) return false
    // Esquina alguna
    const cornerR = r < markerSize ? 0 : grid - markerSize
    const cornerC = c < markerSize ? 0 : grid - markerSize
    const rr = r - cornerR
    const cc = c - cornerC
    // Borde exterior 3x3
    return rr === 0 || rr === 2 || cc === 0 || cc === 2
  }
  const isMarkerCenter = (r: number, c: number) => {
    if (!isInMarker(r, c)) return false
    const cornerR = r < markerSize ? 0 : grid - markerSize
    const cornerC = c < markerSize ? 0 : grid - markerSize
    const rr = r - cornerR
    const cc = c - cornerC
    return rr === 1 && cc === 1
  }

  const rects: React.ReactElement[] = []
  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      const idx = r * grid + c
      let on: boolean
      if (isMarkerOuter(r, c)) on = true
      else if (isMarkerCenter(r, c)) on = true
      else if (isInMarker(r, c)) on = false
      else on = cells[idx]
      if (!on) continue
      rects.push(
        <rect
          key={`${r}-${c}`}
          x={c * cell}
          y={r * cell}
          width={cell}
          height={cell}
          fill="#0f172a"
        />,
      )
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`Insignia visual del certificado (id ${verificationId})`}
      className="shrink-0"
    >
      <rect width={size} height={size} fill="#ffffff" />
      {rects}
    </svg>
  )
}

function simpleHash(s: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h >>> 0
}
