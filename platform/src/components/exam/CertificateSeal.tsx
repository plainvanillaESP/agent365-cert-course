/**
 * Sello circular del certificado Plain Vanilla. SVG inline para evitar
 * dependencias de imagen. Se compone de:
 *   - Anillo exterior con texto curvado «PLAIN VANILLA CERTIFIED»
 *   - Borde grueso interior
 *   - Núcleo con iniciales «AG 365» y la palabra «CERTIFIED»
 *
 * Tamaño base 140x140. Encaja en el pie del certificado.
 */
export function CertificateSeal({ size = 140 }: { size?: number }) {
  const radius = size / 2
  const center = size / 2
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Sello oficial Plain Vanilla"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="cert-seal-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9A44E5" />
          <stop offset="100%" stopColor="#F68DAC" />
        </linearGradient>
        <path
          id="cert-seal-arc-top"
          d={`M ${center - radius + 16} ${center} A ${radius - 16} ${radius - 16} 0 0 1 ${center + radius - 16} ${center}`}
          fill="none"
        />
        <path
          id="cert-seal-arc-bottom"
          d={`M ${center - radius + 16} ${center} A ${radius - 16} ${radius - 16} 0 0 0 ${center + radius - 16} ${center}`}
          fill="none"
        />
      </defs>

      {/* Anillo exterior fino */}
      <circle cx={center} cy={center} r={radius - 4} fill="none" stroke="url(#cert-seal-grad)" strokeWidth="2" />
      {/* Borde interior grueso */}
      <circle cx={center} cy={center} r={radius - 12} fill="none" stroke="url(#cert-seal-grad)" strokeWidth="3" />

      {/* Texto curvado superior */}
      <text fill="#0f172a" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '10px', letterSpacing: '0.18em', fontWeight: 600 }}>
        <textPath href="#cert-seal-arc-top" startOffset="50%" textAnchor="middle">
          PLAIN VANILLA CERTIFIED
        </textPath>
      </text>

      {/* Texto curvado inferior */}
      <text fill="#475569" style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '9px', letterSpacing: '0.22em', fontWeight: 500 }}>
        <textPath href="#cert-seal-arc-bottom" startOffset="50%" textAnchor="middle">
          AGENT 365 IT ADMIN
        </textPath>
      </text>

      {/* Núcleo */}
      <text
        x={center}
        y={center - 4}
        textAnchor="middle"
        fill="url(#cert-seal-grad)"
        style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: '20px', fontWeight: 700, letterSpacing: '0.02em' }}
      >
        AG 365
      </text>
      <text
        x={center}
        y={center + 14}
        textAnchor="middle"
        fill="#0f172a"
        style={{ fontFamily: 'Instrument Sans, sans-serif', fontSize: '9px', letterSpacing: '0.16em', fontWeight: 600 }}
      >
        CERTIFIED
      </text>
    </svg>
  )
}
