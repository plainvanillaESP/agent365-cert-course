/**
 * Banco de preguntas del curso.
 *
 * El M01 contribuye con 3 preguntas al examen final del Área 1. En esta fase
 * (Hito B) están hardcodeadas en TypeScript para que el shell pueda
 * renderizarlas como un quiz con feedback. En la Fase 8 se moverán
 * a un CMS o a frontmatter de los .md de cada módulo.
 *
 * Identificadores siguen la convención EX-MM-NNN (ver docs/banco-preguntas-modelo.md).
 */

export type QuestionType = 'multiple-choice' | 'scenario' | 'drag-and-drop'
export type Difficulty = 'facil' | 'media' | 'dificil'

interface QuestionMeta {
  id: string
  type: QuestionType
  difficulty: Difficulty
  oa: string
  area: number
  bloom: 'Recordar' | 'Comprender' | 'Aplicar' | 'Analizar' | 'Evaluar' | 'Crear'
  moduleId: number
}

interface OptionAnswer {
  id: string
  text: string
}

export interface MultipleChoiceQuestion extends QuestionMeta {
  type: 'multiple-choice' | 'scenario'
  prompt: string
  options: OptionAnswer[]
  correctOptionId: string
  justification: string
}

export interface DragAndDropQuestion extends QuestionMeta {
  type: 'drag-and-drop'
  prompt: string
  items: Array<{ id: string; text: string }>
  targets: Array<{ id: string; label: string }>
  /** itemId → targetId */
  correctMap: Record<string, string>
  justification: string
}

export type Question = MultipleChoiceQuestion | DragAndDropQuestion

/* ---------------------------- Banco de preguntas --------------------------- */

const Q_EX_01_001: MultipleChoiceQuestion = {
  id: 'EX-01-001',
  type: 'multiple-choice',
  difficulty: 'facil',
  oa: 'OA-01.1',
  area: 1,
  bloom: 'Comprender',
  moduleId: 1,
  prompt:
    'Una compañía está evaluando Microsoft Agent 365 y Microsoft Copilot Studio para su estrategia de IA. ¿Cuál es la diferencia fundamental entre ambos productos?',
  options: [
    { id: 'A', text: 'Copilot Studio crea agentes y Agent 365 los gobierna; son productos complementarios, no alternativos.' },
    { id: 'B', text: 'Agent 365 reemplaza a Copilot Studio porque integra creación y gobernanza en una sola plataforma.' },
    { id: 'C', text: 'Copilot Studio se usa para agentes basados en Foundry; Agent 365 se usa para agentes basados en SharePoint.' },
    { id: 'D', text: 'Agent 365 es la versión empresarial de Copilot Studio con licencia E5.' },
  ],
  correctOptionId: 'A',
  justification:
    'Microsoft Agent 365 es un control plane de gobernanza, observabilidad y seguridad. No crea agentes; gobierna los que ya existen, sin importar la plataforma de origen (Copilot Studio, Foundry, M365 Agents SDK, SharePoint, etc.). Es complementario, no competidor.',
}

const Q_EX_01_002: MultipleChoiceQuestion = {
  id: 'EX-01-002',
  type: 'scenario',
  difficulty: 'media',
  oa: 'OA-01.3',
  area: 1,
  bloom: 'Aplicar',
  moduleId: 1,
  prompt:
    'La directora de IT de Plain Coffee SL pregunta: «Tenemos 800 empleados con licencia M365 Copilot. Algunos usuarios crean agentes con Agent Builder y los compañeros se quejan de que no saben qué pueden hacer ni si están aprobados por IT. Además, queremos limitar el tiempo que los empleados pasan usando Copilot Chat porque vemos un descenso en la productividad colaborativa.»\n\n¿Qué solución corresponde a cada problema?',
  options: [
    { id: 'A', text: 'Ambos problemas se resuelven con Microsoft Agent 365.' },
    { id: 'B', text: 'Ambos problemas se resuelven con Copilot Control System (CCS).' },
    { id: 'C', text: 'El primer problema se resuelve con Agent 365; el segundo con CCS.' },
    { id: 'D', text: 'El primer problema se resuelve con CCS; el segundo con Agent 365.' },
  ],
  correctOptionId: 'C',
  justification:
    'Agent 365 gobierna a los agentes: el primer problema (inventariar agentes creados por usuarios, aprobarlos, hacerlos visibles) es exactamente su alcance. CCS gobierna a las personas usando IA: el segundo problema (uso de Copilot Chat por humanos, productividad colaborativa) corresponde a Copilot Analytics + Viva Insights, que viven en CCS. La opción D invierte el principio.',
}

const Q_EX_01_003: DragAndDropQuestion = {
  id: 'EX-01-003',
  type: 'drag-and-drop',
  difficulty: 'media',
  oa: 'OA-01.2',
  area: 1,
  bloom: 'Aplicar',
  moduleId: 1,
  prompt:
    'Empareja cada responsabilidad operativa con el stakeholder de Microsoft Agent 365 que la asume principalmente.',
  items: [
    { id: 'r1', text: 'Aplicar políticas de Conditional Access que bloqueen agentes con riesgo high.' },
    { id: 'r2', text: 'Crear DLP policies que traten al `agent instance` como user.' },
    { id: 'r3', text: 'Aprobar requests de agentes pendientes desde el wizard de publishing.' },
    { id: 'r4', text: 'Investigar incidentes con KQL en la tabla `CloudAppEvents`.' },
    { id: 'r5', text: 'Configurar lifecycle workflows para sponsorship transfer al manager.' },
    { id: 'r6', text: 'Aplicar templates regulatorios (EU AI Act, ISO 42001) en Compliance Manager.' },
  ],
  targets: [
    { id: 'm365',     label: 'M365 admin'     },
    { id: 'entra',    label: 'Entra admin'    },
    { id: 'purview',  label: 'Purview admin'  },
    { id: 'defender', label: 'Defender admin' },
  ],
  correctMap: {
    r1: 'entra',
    r2: 'purview',
    r3: 'm365',
    r4: 'defender',
    r5: 'entra',
    r6: 'purview',
  },
  justification:
    'CA (Conditional Access) y lifecycle workflows viven en Microsoft Entra (Entra Agent ID). DLP y Compliance Manager viven en Microsoft Purview. El wizard de publishing y la aprobación de requests viven en Microsoft 365 admin center. KQL hunting vive en Microsoft Defender XDR.',
}

const Q_EX_02_001: DragAndDropQuestion = {
  id: 'EX-02-001',
  type: 'drag-and-drop',
  difficulty: 'media',
  oa: 'OA-02.1',
  area: 1,
  bloom: 'Aplicar',
  moduleId: 2,
  prompt:
    'Empareja cada componente arquitectónico de Microsoft Agent 365 con el admin center donde un administrador lo gestiona principalmente.',
  items: [
    { id: 'c1', text: 'Agent Registry y Agent Map.' },
    { id: 'c2', text: 'Conditional Access para agentes con grant Block.' },
    { id: 'c3', text: 'DSPM for AI y Compliance Manager.' },
    { id: 'c4', text: 'Tabla `CloudAppEvents` para hunting con KQL.' },
    { id: 'c5', text: 'Lifecycle workflows con sponsorship transfer al manager.' },
    { id: 'c6', text: 'Wizard de publishing y aprobación de requests.' },
  ],
  targets: [
    { id: 'm365',     label: 'Microsoft 365 admin center' },
    { id: 'entra',    label: 'Microsoft Entra admin center' },
    { id: 'purview',  label: 'Microsoft Purview portal' },
    { id: 'defender', label: 'Microsoft Defender XDR' },
  ],
  correctMap: {
    c1: 'm365',
    c2: 'entra',
    c3: 'purview',
    c4: 'defender',
    c5: 'entra',
    c6: 'm365',
  },
  justification:
    'La arquitectura de Agent 365 reparte la gobernanza en cuatro admin centers. Registry, Map y wizard de publishing viven en Microsoft 365 admin center. Conditional Access y lifecycle workflows viven en Entra (dependen de la identidad). DSPM y Compliance Manager viven en Purview. KQL hunting vive en Defender. Saber a qué admin center ir es la primera competencia operativa del curso.',
}

const Q_EX_02_002: MultipleChoiceQuestion = {
  id: 'EX-02-002',
  type: 'multiple-choice',
  difficulty: 'media',
  oa: 'OA-02.2',
  area: 1,
  bloom: 'Analizar',
  moduleId: 2,
  prompt:
    'Un desarrollador comenta que su equipo va a desplegar varios «agentes Microsoft Agents Toolkit» en el tenant. Una arquitecta IT pregunta cómo aparecerán esos agentes en el Agent Registry de Microsoft 365 admin center. ¿Cuál es la respuesta correcta?',
  options: [
    { id: 'A', text: 'Aparecerán como tipo «Agent Toolkit», una novena categoría además de los 8 tipos estándar.' },
    { id: 'B', text: 'No aparecerán en el Registry hasta que se conviertan a Agent Builder.' },
    { id: 'C', text: 'Aparecerán como uno de los 8 tipos estándar (típicamente MCS CEA o Foundry) según cómo se haya configurado el deploy; Agent Toolkit es la herramienta de desarrollo, no un tipo de registro.' },
    { id: 'D', text: 'Aparecerán como tipo «SharePoint agent» porque Toolkit despliega los agentes a una librería SharePoint.' },
  ],
  correctOptionId: 'C',
  justification:
    'El Microsoft 365 Agents Toolkit es una extensión de Visual Studio Code para construir agentes pro-code conversacionales. No es un tipo de agente: el agente que produce se registra como uno de los 8 tipos estándar (típicamente MCS CEA o Foundry) según el target del deploy. La opción A confunde herramienta con tipo. La B es inventada. La D mezcla SharePoint agents (.agent files en una librería) con el Toolkit (un IDE plugin).',
}

const Q_EX_02_003: MultipleChoiceQuestion = {
  id: 'EX-02-003',
  type: 'multiple-choice',
  difficulty: 'facil',
  oa: 'OA-02.1',
  area: 1,
  bloom: 'Comprender',
  moduleId: 2,
  prompt:
    'Un partner tecnológico presenta un agente y dice que «usa el Microsoft Agents SDK para gobernarlo». ¿Qué debería responder un administrador IT con criterio?',
  options: [
    { id: 'A', text: '«Perfecto, entonces ya está cubierto por Agent 365.»' },
    { id: 'B', text: '«Esa frase es ambigua: hay dos SDKs distintos. El Microsoft 365 Agents SDK es transporte conversacional; el Microsoft Agent 365 SDK es el que gobierna. Necesito saber cuál de los dos.»' },
    { id: 'C', text: '«El Microsoft Agents SDK no existe; está confundiendo nombres de productos.»' },
    { id: 'D', text: '«Da igual cuál de los dos, porque ambos hacen lo mismo desde la unificación de SDKs en mayo de 2026.»' },
  ],
  correctOptionId: 'B',
  justification:
    'La confusión entre los dos SDKs es uno de los errores más comunes en conversaciones con desarrolladores y partners. Microsoft 365 Agents SDK (paquete @microsoft/agents) cubre el transporte conversacional. Microsoft Agent 365 SDK (paquete @microsoft/agent365) cubre la gobernanza: identidad Entra, telemetría OpenTelemetry, acceso a Work IQ MCP. Solo el segundo «gobierna». La opción A acepta una afirmación ambigua. La C niega una realidad. La D inventa una unificación que no ha ocurrido.',
}

const Q_EX_03_001: MultipleChoiceQuestion = {
  id: 'EX-03-001',
  type: 'multiple-choice',
  difficulty: 'media',
  oa: 'OA-03.1',
  area: 1,
  bloom: 'Evaluar',
  moduleId: 3,
  prompt:
    'Una empresa de 4.000 empleados con Microsoft 365 E5 corporativo tiene actualmente Copilot desplegado en el 35 % de su plantilla (1.400 licencias) y planea desplegar Microsoft Agent 365 a esos mismos 1.400 usuarios. La adopción de Copilot lleva 6 meses creciendo al 5 % mensual y la dirección no quiere cambiar la dinámica. ¿Cuál es la recomendación de licenciamiento más adecuada?',
  options: [
    { id: 'A', text: 'Migrar toda la plantilla a Microsoft 365 E7 ($99 × 4.000 = $396.000/mes) para tener gobernanza completa con Risks column desde el inicio.' },
    { id: 'B', text: 'Mantener E5 como base, comprar 1.400 licencias Agent 365 standalone ($15) y mantener Copilot solo en los usuarios que ya lo tienen, revisando la decisión cuando la adopción Copilot supere el 60 %.' },
    { id: 'C', text: 'Comprar Agent 365 E7 únicamente para los 1.400 usuarios con Copilot y dejar al resto sin Agent 365.' },
    { id: 'D', text: 'Contratar Frontier preview con 25 licencias gratuitas y desplegar Agent 365 solo a esos 25 usuarios mientras se evalúa la decisión.' },
  ],
  correctOptionId: 'B',
  justification:
    'La decisión standalone vs E7 depende del peso de Copilot, no de Agent 365. Con un 35 % de adopción Copilot creciendo al 5 % mensual, la organización está aún por debajo del break-even típico (60-70 %). E5 + Agent 365 standalone para los 1.400 usuarios que invocan agentes ($57 + $15 = $72 × 1.400 + Copilot ya pagado) es significativamente más barato que migrar los 4.000 a E7. La opción A sobrepaga ~$120.000/mes en E5 base que ya tienen y E7 a usuarios que no usan Copilot. La C mezcla SKUs sin justificación operativa (Agent 365 E7 no es un SKU; E7 es bundle completo). La D malentiende Frontier preview: es para validar capacidades nuevas, no para producción a 1.400 usuarios.',
}

const Q_EX_04_001: MultipleChoiceQuestion = {
  id: 'EX-04-001',
  type: 'multiple-choice',
  difficulty: 'media',
  oa: 'OA-04.1',
  area: 1,
  bloom: 'Aplicar',
  moduleId: 4,
  prompt:
    'Un analista de seguridad necesita revisar diariamente las alertas que Microsoft Defender XDR genera sobre agentes en el Agent Registry, correlacionarlas con la información del propio Registry y, cuando una alerta lo justifique, abrir un ticket al equipo de M365 admin. NO debe poder modificar políticas de Defender ni aprobar o bloquear agentes. ¿Qué combinación de roles aplica el principio de least-privilege correctamente?',
  options: [
    { id: 'A', text: 'Global Administrator. Es el más simple y cubre todo lo que necesita.' },
    { id: 'B', text: 'Security Administrator + AI Administrator, para tener escritura en seguridad y en agentes.' },
    { id: 'C', text: 'Security Operator + AI Reader, que permite investigar alertas en Defender y ver el Registry sin modificarlo.' },
    { id: 'D', text: 'Security Reader, suficiente porque solo necesita leer.' },
  ],
  correctOptionId: 'C',
  justification:
    'Least-privilege exige asignar el mínimo rol que permite hacer la tarea. Security Operator permite investigar alertas y responder a incidentes en Defender (la tarea principal) sin escritura en políticas. AI Reader permite ver el Registry para correlacionar pero no modificar agentes. La combinación cubre exactamente las necesidades sin excederse. La opción A (Global Administrator) es el antipatrón clásico: sobreasigna privilegio. La B (Security Administrator + AI Administrator) da escritura donde la tarea solo requiere lectura/operación. La D (Security Reader) es insuficiente: el Reader no permite responder a incidentes, solo verlos.',
}

const Q_EX_05_001: DragAndDropQuestion = {
  id: 'EX-05-001',
  type: 'drag-and-drop',
  difficulty: 'media',
  oa: 'OA-05.2',
  area: 1,
  bloom: 'Aplicar',
  moduleId: 5,
  prompt:
    'Ordena los siguientes pasos en la secuencia correcta para activar Microsoft Agent 365 desde cero en un tenant productivo. El primer paso (posición 1) es el que se hace antes de tocar ningún admin center; el último (posición 6) es el que confirma que todo está operativo.',
  items: [
    { id: 's1', text: 'Configurar el conector Microsoft 365 en Defender for Cloud Apps.' },
    { id: 's2', text: 'Verificar prerrequisitos: licencias asignadas, audit logs habilitados, rol Global Administrator o AI Administrator.' },
    { id: 's3', text: 'Activar Data Security Posture Management (DSPM) for AI en Microsoft Purview.' },
    { id: 's4', text: 'Aceptar Terms of Service la primera vez que se navega a M365 admin → Agents.' },
    { id: 's5', text: 'Lanzar un agente de prueba y verificar que aparece en los tres admin centers.' },
    { id: 's6', text: 'Activar el toggle Copilot Frontier en M365 admin → Copilot → Settings → User access (si aplica).' },
  ],
  targets: [
    { id: 'p1', label: 'Posición 1 — Antes de tocar admin centers' },
    { id: 'p2', label: 'Posición 2' },
    { id: 'p3', label: 'Posición 3 — Entrada al Agent workload' },
    { id: 'p4', label: 'Posición 4' },
    { id: 'p5', label: 'Posición 5' },
    { id: 'p6', label: 'Posición 6 — Confirmación final' },
  ],
  correctMap: {
    s2: 'p1', // Verificar prerrequisitos
    s6: 'p2', // Frontier toggle
    s4: 'p3', // Terms of Service
    s1: 'p4', // Defender connector
    s3: 'p5', // DSPM Purview
    s5: 'p6', // Validar end-to-end
  },
  justification:
    'La activación tiene un orden estricto basado en dependencias. Sin verificar prerrequisitos, los siguientes pasos pueden fallar silenciosamente. Frontier toggle activa el modo preview (si la organización lo va a usar) y debe ser anterior a Terms of Service. Los Terms of Service son la puerta de entrada al workload: sin aceptarlos no se puede entrar al Overview ni configurar nada. Los conectores de Defender y Purview son dos pasos independientes entre sí, pero ambos requieren que el workload esté activo, por lo que van después de Terms of Service. La validación end-to-end es siempre el último paso: confirma que todo lo anterior funciona en cadena. Saltar el orden no rompe el sistema de inmediato pero deja huecos que aparecen como errores días después.',
}

/* --------------------------- API pública del banco -------------------------- */

const ALL_QUESTIONS: Question[] = [
  Q_EX_01_001, Q_EX_01_002, Q_EX_01_003,
  Q_EX_02_001, Q_EX_02_002, Q_EX_02_003,
  Q_EX_03_001,
  Q_EX_04_001,
  Q_EX_05_001,
]

export function getQuestionsForModule(moduleId: number): Question[] {
  return ALL_QUESTIONS.filter(q => q.moduleId === moduleId)
}

export function isMultipleChoice(q: Question): q is MultipleChoiceQuestion {
  return q.type === 'multiple-choice' || q.type === 'scenario'
}

export function isDragAndDrop(q: Question): q is DragAndDropQuestion {
  return q.type === 'drag-and-drop'
}

/* ------------------------------ Tipos de estado ----------------------------- */

export interface MCAnswer {
  type: 'mc'
  questionId: string
  selectedOptionId: string | null
}

export interface DnDAnswer {
  type: 'dnd'
  questionId: string
  /** itemId → targetId. Items sin colocar no aparecen. */
  placements: Record<string, string>
}

export type Answer = MCAnswer | DnDAnswer

export function emptyAnswerFor(q: Question): Answer {
  if (isDragAndDrop(q)) {
    return { type: 'dnd', questionId: q.id, placements: {} }
  }
  return { type: 'mc', questionId: q.id, selectedOptionId: null }
}

export function isAnswerComplete(q: Question, a: Answer): boolean {
  if (isDragAndDrop(q) && a.type === 'dnd') {
    return q.items.every(item => a.placements[item.id])
  }
  if (isMultipleChoice(q) && a.type === 'mc') {
    return a.selectedOptionId !== null
  }
  return false
}

export function isAnswerCorrect(q: Question, a: Answer): boolean {
  if (isDragAndDrop(q) && a.type === 'dnd') {
    return q.items.every(item => a.placements[item.id] === q.correctMap[item.id])
  }
  if (isMultipleChoice(q) && a.type === 'mc') {
    return a.selectedOptionId === q.correctOptionId
  }
  return false
}

/**
 * Indica qué placements son individualmente correctos en un DnD.
 * Útil para mostrar feedback granular tras validar.
 */
export function dndItemCorrectness(q: DragAndDropQuestion, a: DnDAnswer): Record<string, boolean> {
  const result: Record<string, boolean> = {}
  for (const item of q.items) {
    result[item.id] = a.placements[item.id] === q.correctMap[item.id]
  }
  return result
}
