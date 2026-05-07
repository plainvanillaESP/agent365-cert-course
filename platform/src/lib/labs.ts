/**
 * Banco de laboratorios formativos del curso.
 *
 * Los laboratorios son ejercicios formativos: el alumno los hace para
 * consolidar conceptos pero no se califican ni cuentan en el examen.
 * Por eso el modelo de feedback es inmediato y permite reintentar sin
 * coste, a diferencia del quiz oficial.
 *
 * Para el M01 el laboratorio es de mapeo: 10 escenarios y 6 productos
 * del ecosistema. El alumno asigna cada escenario al producto principal.
 */

export type ProductId = 'A365' | 'CCS' | 'CS' | 'FOU' | 'M365-SDK' | 'A365-SDK'

export interface LabProduct {
  id: ProductId
  shortLabel: string
  fullName: string
  /** Texto corto que aparece bajo el chip cuando expande, ayuda mnemotécnica */
  hint: string
}

export interface LabScenario {
  /** id corto '01'..'10' para keys y persistencia */
  id: string
  prompt: string
  /** Productos correctos. >1 = alternativas válidas, basta acertar una. */
  correctProductIds: ProductId[]
  rationale: string
}

export interface LabExercise {
  moduleId: number
  title: string
  intro: string
  products: LabProduct[]
  scenarios: LabScenario[]
  /** Patrones de error que se muestran al alumno al cerrar el lab. */
  errorPatterns: string[]
}

/* ----------------------------- M01 lab data ------------------------------ */

const M01_PRODUCTS: LabProduct[] = [
  { id: 'A365',     shortLabel: 'A365',     fullName: 'Microsoft Agent 365',         hint: 'Control plane: gobierna agentes' },
  { id: 'CCS',      shortLabel: 'CCS',      fullName: 'Copilot Control System',      hint: 'Gobierna humanos usando Copilot' },
  { id: 'CS',       shortLabel: 'CS',       fullName: 'Microsoft Copilot Studio',    hint: 'Construye agentes low-code' },
  { id: 'FOU',      shortLabel: 'FOU',      fullName: 'Microsoft Foundry',           hint: 'Construye agentes pro-code' },
  { id: 'M365-SDK', shortLabel: 'M365-SDK', fullName: 'Microsoft 365 Agents SDK',    hint: 'Transporte conversacional' },
  { id: 'A365-SDK', shortLabel: 'A365-SDK', fullName: 'Microsoft Agent 365 SDK',     hint: 'Identidad y telemetría del agente' },
]

const M01_SCENARIOS: LabScenario[] = [
  {
    id: '01',
    prompt: 'El equipo de RR. HH. quiere construir un agente que conteste preguntas sobre la política de vacaciones a partir de un PDF.',
    correctProductIds: ['CS'],
    rationale: 'Construcción de un agente declarativo con base de conocimiento documental. Caso típico de Copilot Studio (canvas + connectors). No es A365: A365 no construye agentes, los gobierna.',
  },
  {
    id: '02',
    prompt: 'El CIO pregunta cuántos agentes hay activos en el tenant y de qué plataforma proceden.',
    correctProductIds: ['A365'],
    rationale: 'Inventario centralizado de agentes en el tenant. Ese es exactamente el propósito del Agent Registry, que vive dentro de Agent 365.',
  },
  {
    id: '03',
    prompt: 'Un empleado se va de la empresa y quiere asegurarse de que sus 4 agentes Copilot Studio pasan automáticamente a su manager.',
    correctProductIds: ['A365'],
    rationale: 'Lifecycle workflows con sponsorship transfer al manager son capacidades de Microsoft Entra Agent ID, parte del control plane Agent 365.',
  },
  {
    id: '04',
    prompt: 'El director de RR. HH. quiere medir si Microsoft 365 Copilot ha mejorado la productividad del equipo en los últimos 3 meses.',
    correctProductIds: ['CCS'],
    rationale: 'Métricas de adopción y productividad de humanos usando Copilot. Es Copilot Analytics + Copilot Dashboard, dentro del pilar Measurement & Reporting de CCS.',
  },
  {
    id: '05',
    prompt: 'Un desarrollador quiere extender un agente que ya tiene funcionando en LangGraph para que tenga una identidad de directorio y telemetría OpenTelemetry.',
    correctProductIds: ['A365-SDK'],
    rationale: 'Extender un agente existente con identidad Entra-backed y observabilidad OpenTelemetry es lo que ofrece el Microsoft Agent 365 SDK. No confundir con el M365 Agents SDK, que cubre transporte conversacional.',
  },
  {
    id: '06',
    prompt: 'Un equipo de finanzas quiere construir un agente con flujo conversacional complejo que envíe mensajes en Teams y pueda escalar a un humano si el caso es complicado.',
    correctProductIds: ['CS', 'M365-SDK'],
    rationale: 'Hay dos respuestas válidas. Si se prioriza low-code y canvas visual, Copilot Studio. Si se prioriza control completo del transporte y multicanal (Teams + Slack), M365 Agents SDK. La decisión es de arquitectura, no de producto único.',
  },
  {
    id: '07',
    prompt: 'El equipo de seguridad quiere bloquear en runtime cualquier intento de un agente de invocar una tool específica si detecta patrones de prompt injection.',
    correctProductIds: ['A365'],
    rationale: 'Real-time protection durante runtime es una capacidad de Microsoft Defender, integrada en el control plane Agent 365.',
  },
  {
    id: '08',
    prompt: 'El equipo de IT quiere que ciertos documentos de SharePoint con sensitivity label «Confidential» no sean accesibles ni siquiera por humanos vía Microsoft 365 Copilot.',
    correctProductIds: ['CCS'],
    rationale: 'El foundational tier de CCS con sensitivity labels + DSPM for AI cubre que los humanos no descubran documentos confidenciales por oversharing al usar Copilot. No es A365 porque la pregunta es sobre acceso humano, no de agentes.',
  },
  {
    id: '09',
    prompt: 'Un partner externo quiere construir un agente especializado en análisis de contratos con LLMs custom y arquitectura propia, integrable después con el resto del ecosistema Microsoft.',
    correctProductIds: ['FOU'],
    rationale: 'Construcción de un agente pro-code con LLMs custom y arquitectura propia. Microsoft Foundry es el entorno apropiado. Una vez construido, A365 puede gobernarlo si se registra.',
  },
  {
    id: '10',
    prompt: 'El CISO quiere recibir alertas cuando un agente sea identificado como high risk por Identity Protection y bloquear automáticamente sus tokens.',
    correctProductIds: ['A365'],
    rationale: 'Identity Protection para agentes + Conditional Access con grant Block es la combinación de capacidades dentro de Microsoft Entra Agent ID, parte de Agent 365.',
  },
]

const M01_LAB: LabExercise = {
  moduleId: 1,
  title: 'Mapeo de escenarios al producto correcto',
  intro: 'Lee cada escenario y elige el producto que lo resuelve. Algunos escenarios admiten más de una respuesta válida; en ese caso, basta con acertar una. Tras validar verás la justificación de cada uno.',
  products: M01_PRODUCTS,
  scenarios: M01_SCENARIOS,
  errorPatterns: [
    'Confundir CCS con Agent 365 cuando el sujeto cambia. Si la frase es sobre personas usando IA, es CCS. Si es sobre lo que hace el agente, es Agent 365.',
    'Confundir los dos SDKs. M365 Agents SDK es transporte conversacional. Agent 365 SDK es identidad y gobernanza.',
    'Pensar que Agent 365 sustituye a Copilot Studio o a Foundry. No los sustituye: los gobierna.',
  ],
}

/* --------------------------- API pública del banco -------------------------- */

const ALL_LABS: Record<number, LabExercise> = {
  1: M01_LAB,
}

export function getLabForModule(moduleId: number): LabExercise | null {
  return ALL_LABS[moduleId] ?? null
}

/* ------------------------------ Tipos de estado ----------------------------- */

/** scenarioId → productId seleccionado, o null si aún no contestado. */
export type LabAnswers = Record<string, ProductId | null>

export function emptyLabAnswers(lab: LabExercise): LabAnswers {
  const out: LabAnswers = {}
  for (const s of lab.scenarios) out[s.id] = null
  return out
}

export function isScenarioAnswered(answer: ProductId | null): boolean {
  return answer !== null
}

export function isScenarioCorrect(scenario: LabScenario, answer: ProductId | null): boolean {
  if (answer === null) return false
  return scenario.correctProductIds.includes(answer)
}

export function countCorrect(lab: LabExercise, answers: LabAnswers): number {
  let n = 0
  for (const s of lab.scenarios) {
    if (isScenarioCorrect(s, answers[s.id])) n++
  }
  return n
}

export function countAnswered(lab: LabExercise, answers: LabAnswers): number {
  let n = 0
  for (const s of lab.scenarios) {
    if (isScenarioAnswered(answers[s.id])) n++
  }
  return n
}
