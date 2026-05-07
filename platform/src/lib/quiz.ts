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

/**
 * NOTA — Convivencia de preguntas TS y markdown durante la transición a la spec del paquete.
 *
 * La spec del paquete (`docs/course-package-spec.md` v1.0) declara como fuente de verdad
 * los `quiz-practica.md` de cada módulo y el `banco-examen.md` del curso. Hasta que el
 * Bloque D introduzca el parser real desde markdown, las preguntas que ve el alumno
 * en el navegador siguen viviendo aquí en TS, mantenidas en sincronía manual con
 * los markdown:
 *
 *  - Preguntas Q-NN-M (quiz de práctica del módulo): identificadores `Q_PRACT_NN_M`.
 *    Subset que sale del `quiz-practica.md` del módulo. NO debe contener preguntas
 *    del banco final.
 *  - Preguntas EX-NN-MMM (banco oficial del examen final): NO se cargan en `lib/quiz.ts`.
 *    Viven solo en `cursos/{slug}/banco-examen.md` y se rendizaran cuando se implemente
 *    el componente del examen final (Fase 7, M17).
 *
 * Para los módulos M02-M08 todavía no migrados (sus preguntas aquí siguen identificadas
 * como `Q_EX_NN_*`), seguirán mostrándose como "evaluación" hasta su refactor en
 * Bloques C y D. Esto es deuda técnica explícita.
 */

const Q_PRACT_01_1: MultipleChoiceQuestion = {
  id: 'Q-01-1',
  type: 'multiple-choice',
  difficulty: 'facil',
  oa: 'OA-01.1',
  area: 1,
  bloom: 'Comprender',
  moduleId: 1,
  prompt:
    'El equipo de ingeniería de tu empresa quiere construir un agente conversacional desde cero usando código y desplegarlo en una aplicación Teams interna. Está debatiendo qué herramientas utilizar. ¿Cuál de los siguientes productos del ecosistema de Microsoft cubre la **construcción** del agente, frente a los demás que cubren capas distintas?',
  options: [
    { id: 'A', text: 'Microsoft Agent 365: porque incluye Agent Builder con un kit de desarrollo SDK.' },
    { id: 'B', text: 'Copilot Control System: porque controla qué agentes se pueden desplegar en Teams.' },
    { id: 'C', text: 'Microsoft 365 Agents SDK: es el framework oficial para construir agentes con código.' },
    { id: 'D', text: 'Microsoft Purview: porque protege los datos del agente desde el día cero.' },
  ],
  correctOptionId: 'C',
  justification:
    'El Microsoft 365 Agents SDK es el kit oficial para construir agentes con código (TypeScript, C#, Python). Agent 365 NO construye agentes, los gobierna; CCS no construye nada, gobierna el comportamiento de Copilot Chat para los humanos; Purview protege datos pero no es un constructor de agentes. Cuidado con la confusión nominal: el M365 Agents SDK (constructor) ≠ el Agent 365 SDK (extensión del control plane).',
}

const Q_PRACT_01_3: MultipleChoiceQuestion = {
  id: 'Q-01-3',
  type: 'scenario',
  difficulty: 'media',
  oa: 'OA-01.3',
  area: 1,
  bloom: 'Aplicar',
  moduleId: 1,
  prompt:
    'El CISO de Lumen Logística (4.500 empleados de oficina, M365 Copilot desplegado a 2.000) escribe un email al equipo IT con tres preocupaciones:\n\n1. «Necesitamos saber qué porcentaje del tiempo que pasan los empleados en Teams están usando Copilot Chat para resumir reuniones.»\n2. «Tenemos un agente Copilot Studio del equipo Comercial que envía resúmenes de oportunidades, pero nadie sabe a qué documentos está accediendo realmente.»\n3. «Queremos forzar que los nuevos empleados pasen 30 días sin acceso a Copilot Chat hasta completar la formación de uso responsable.»\n\n¿Qué producto resuelve cada preocupación?',
  options: [
    { id: 'A', text: '1 → CCS · 2 → Agent 365 · 3 → CCS' },
    { id: 'B', text: '1 → Agent 365 · 2 → CCS · 3 → Agent 365' },
    { id: 'C', text: 'Las tres preocupaciones se resuelven con Agent 365 porque las tres tocan IA.' },
    { id: 'D', text: 'Las tres preocupaciones se resuelven con CCS porque las tres afectan a empleados.' },
  ],
  correctOptionId: 'A',
  justification:
    'Medir el uso de Copilot Chat por humanos (1) es trabajo de CCS (Copilot Analytics + Viva Insights). Auditar a qué documentos accede un agente Copilot Studio (2) es trabajo de Agent 365 (Agent Registry + Purview integrado). Restringir el acceso de empleados a Copilot Chat (3) es trabajo de CCS. Regla mnemotécnica: Agent 365 gobierna agentes; CCS gobierna humanos usando IA.',
}

const Q_PRACT_01_5: DragAndDropQuestion = {
  id: 'Q-01-5',
  type: 'drag-and-drop',
  difficulty: 'media',
  oa: 'OA-01.2',
  area: 1,
  bloom: 'Aplicar',
  moduleId: 1,
  prompt:
    'Empareja cada acción operativa de gobernanza con el admin center que la ejecuta.',
  items: [
    { id: 'a1', text: 'Habilitar DSPM for AI sobre el tenant.' },
    { id: 'a2', text: 'Pin un agente al slot Administrator para grupo «Dirección Comercial».' },
    { id: 'a3', text: 'Investigar el riesgo de un agente comprometido en Risky Agents report.' },
    { id: 'a4', text: 'Aplicar la plantilla «EU AI Act» en Compliance Manager.' },
    { id: 'a5', text: 'Configurar el conector de Microsoft 365 para Defender XDR.' },
  ],
  targets: [
    { id: 'm365',     label: 'M365 admin'     },
    { id: 'entra',    label: 'Entra admin'    },
    { id: 'purview',  label: 'Purview admin'  },
    { id: 'defender', label: 'Defender admin' },
  ],
  correctMap: {
    a1: 'purview',
    a2: 'm365',
    a3: 'entra',
    a4: 'purview',
    a5: 'defender',
  },
  justification:
    'DSPM for AI y Compliance Manager viven en Microsoft Purview. Pin del Agent Registry vive en M365 admin center (los slots Microsoft / Administrator / User son del wizard de publishing). Risky Agents report y la gestión de riesgo de identidades de agente viven en Microsoft Entra (Entra Agent ID Protection). El conector M365 de Defender XDR es la pieza que activa la ingesta de telemetría de agentes en Defender.',
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

/* ======================== Módulo 06 — 11 preguntas ======================== */

const Q_EX_06_001: MultipleChoiceQuestion = {
  id: 'EX-06-001',
  type: 'multiple-choice',
  difficulty: 'facil',
  oa: 'OA-06.1',
  area: 2,
  bloom: 'Recordar',
  moduleId: 6,
  prompt:
    '¿Cuál de los siguientes objetos de Microsoft Entra Agent ID actúa como plantilla que define permisos heredables, restricciones y metadatos sin autenticar nada por sí solo?',
  options: [
    { id: 'A', text: 'Agent identity' },
    { id: 'B', text: 'Agent identity blueprint' },
    { id: 'C', text: 'Agent identity blueprint principal' },
    { id: 'D', text: 'Agent user' },
  ],
  correctOptionId: 'B',
  justification:
    'El agent identity blueprint es la plantilla. Define el catálogo de permisos heredables, restricciones (allowedAuthenticationFlows, maxAgentIdentities, tenantOnly), metadatos y políticas de lifecycle, pero no autentica nada por sí solo. Las agent identities son las instancias que sí autentican y heredan del blueprint. El blueprint principal es el service principal asociado al blueprint para admin consents. El agent user es una propiedad opcional de las agent identities autonomous.',
}

const Q_EX_06_002: MultipleChoiceQuestion = {
  id: 'EX-06-002',
  type: 'multiple-choice',
  difficulty: 'media',
  oa: 'OA-06.1',
  area: 2,
  bloom: 'Analizar',
  moduleId: 6,
  prompt:
    'En Microsoft Teams, un usuario ve que «Agent-RRHH-FAQ» aparece en la lista de personas con foto, presencia online, y un mailbox al que pueden enviarle email. ¿Qué tipo de objeto representa esto en Microsoft Entra Agent ID?',
  options: [
    { id: 'A', text: 'Agent identity blueprint' },
    { id: 'B', text: 'Agent identity blueprint principal' },
    { id: 'C', text: 'Agent identity (sin propiedad agent user)' },
    { id: 'D', text: 'Agent user' },
  ],
  correctOptionId: 'D',
  justification:
    'La presencia humana-like en Teams (foto, presence, mailbox propio, aparición en organigrama) es lo que distingue a un agent user del resto de objetos. Es una propiedad opcional (userType: AgentUser) que se aplica a una agent identity para hacerla visible como si fuera un colaborador más. Los blueprints y blueprint principals no tienen presencia visible. Una agent identity sin la propiedad agent user sí autentica y opera, pero no aparece en Teams como una persona.',
}

const Q_EX_06_003: DragAndDropQuestion = {
  id: 'EX-06-003',
  type: 'drag-and-drop',
  difficulty: 'media',
  oa: 'OA-06.1',
  area: 2,
  bloom: 'Analizar',
  moduleId: 6,
  prompt:
    'Empareja cada capacidad con el tipo de objeto al que pertenece en Microsoft Entra Agent ID.',
  items: [
    { id: 'c1', text: 'Define los scopes de Microsoft Graph que las identities heredan.' },
    { id: 'c2', text: 'Tiene un mailbox propio y aparece en organigrama.' },
    { id: 'c3', text: 'Es la instancia que autentica contra Microsoft Graph.' },
    { id: 'c4', text: 'Es el service principal vinculado al blueprint para admin consents.' },
    { id: 'c5', text: 'Tiene custom security attributes asignados individualmente.' },
    { id: 'c6', text: 'Define el límite duro de 10 resource apps × 40 scopes.' },
  ],
  targets: [
    { id: 'blueprint', label: 'Agent identity blueprint' },
    { id: 'principal', label: 'Agent identity blueprint principal' },
    { id: 'identity', label: 'Agent identity' },
    { id: 'user', label: 'Agent user' },
  ],
  correctMap: {
    c1: 'blueprint',
    c2: 'user',
    c3: 'identity',
    c4: 'principal',
    c5: 'identity',
    c6: 'blueprint',
  },
  justification:
    'Los scopes y restricciones se definen en el blueprint y se heredan. La instancia (agent identity) es lo que autentica y donde se asignan custom security attributes individualmente. El agent user es una propiedad opcional de la identity con presencia humana-like. El blueprint principal existe para que el blueprint pueda recibir admin consents.',
}

const Q_EX_06_004: MultipleChoiceQuestion = {
  id: 'EX-06-004',
  type: 'multiple-choice',
  difficulty: 'media',
  oa: 'OA-06.4',
  area: 2,
  bloom: 'Aplicar',
  moduleId: 6,
  prompt:
    'Una organización quiere desplegar un agente que monitorice 24/7 un buzón compartido (compliance@contoso.com) y publique en un canal de Teams cualquier mensaje que mencione palabras de la lista de cumplimiento normativo. NO hay usuario humano que invoque al agente. ¿Qué flujo de autenticación aplica y qué requisito de licenciamiento implica?',
  options: [
    { id: 'A', text: 'OBO. Cualquier licencia Agent 365 cubre el caso.' },
    { id: 'B', text: 'OBO. Requiere Microsoft 365 E7 obligatoriamente.' },
    { id: 'C', text: 'Own identity. Disponible en GA con cualquier licencia Agent 365.' },
    { id: 'D', text: 'Own identity. Solo disponible en Frontier preview en mayo de 2026.' },
  ],
  correctOptionId: 'D',
  justification:
    'El caso describe un agente autonomous (sin usuario humano que invoque). Esto requiere el flujo own identity con un access token obtenido vía client_credentials y permisos propios definidos en el blueprint. Los agentes own identity siguen en Frontier preview en mayo de 2026: no son GA todavía. Para desplegarlos a escala, la organización debe inscribirse en el programa Frontier preview.',
}

const Q_EX_06_005: MultipleChoiceQuestion = {
  id: 'EX-06-005',
  type: 'multiple-choice',
  difficulty: 'media',
  oa: 'OA-06.5',
  area: 2,
  bloom: 'Aplicar',
  moduleId: 6,
  prompt:
    '¿Qué llamada a Microsoft Graph permite listar los agentes con riesgo detectado por Microsoft Entra Identity Protection?',
  options: [
    { id: 'A', text: "GET https://graph.microsoft.com/beta/agentRegistry/agents?$filter=riskState eq 'high'" },
    { id: 'B', text: 'GET https://graph.microsoft.com/beta/identityProtection/riskyAgents' },
    { id: 'C', text: 'GET https://graph.microsoft.com/v1.0/auditLogs/agentRiskDetections' },
    { id: 'D', text: 'GET https://graph.microsoft.com/beta/copilot/admin/agents/risks' },
  ],
  correctOptionId: 'B',
  justification:
    'El endpoint correcto es /beta/identityProtection/riskyAgents, paralelo al /identityProtection/riskyUsers para usuarios. Devuelve los agentes con riskLevel y riskState calculado por Identity Protection. La opción A usa la ruta legacy del agent registry (que se retira con la convergencia de mayo de 2026) y un filter no soportado.',
}

const Q_EX_06_006: MultipleChoiceQuestion = {
  id: 'EX-06-006',
  type: 'multiple-choice',
  difficulty: 'media',
  oa: 'OA-06.2',
  area: 2,
  bloom: 'Aplicar',
  moduleId: 6,
  prompt:
    'Un desarrollador intenta crear un blueprint para agentes Foundry pero la CLI devuelve error «Too many scopes for resourceAppId 00000003-0000-0000-c000-000000000000». El blueprint declara 45 scopes para Microsoft Graph. ¿Cuál es la causa y cómo se corrige?',
  options: [
    { id: 'A', text: 'Microsoft Graph no soporta más de 30 scopes en blueprints Agent 365. Hay que reducir a 30.' },
    { id: 'B', text: 'El límite duro de Microsoft Entra Agent ID es de 40 scopes por resource app. El blueprint debe partirse o reducir scopes.' },
    { id: 'C', text: 'El error es transitorio: reintentar tras 10 minutos.' },
    { id: 'D', text: 'El blueprint tiene un campo inheritablePermissions mal formado: hay que validar el JSON con `a365 lint blueprint`.' },
  ],
  correctOptionId: 'B',
  justification:
    'Microsoft Entra Agent ID impone un límite duro de 10 resource apps × 40 scopes por blueprint. Es una restricción intencional para evitar blueprints monolíticos imposibles de auditar. 45 scopes para un mismo resourceAppId excede el límite, y la solución correcta es partir el blueprint en dos o reducir el alcance si los scopes incluyen permisos no necesarios.',
}

const Q_EX_06_007: MultipleChoiceQuestion = {
  id: 'EX-06-007',
  type: 'multiple-choice',
  difficulty: 'media',
  oa: 'OA-06.3',
  area: 2,
  bloom: 'Aplicar',
  moduleId: 6,
  prompt:
    'Un usuario sponsor de una agent identity es deshabilitado (accountEnabled = false) en Microsoft Entra. El blueprint asociado tiene transferOnLeaver = true y existe un lifecycle workflow para el trigger onSponsorLeaver con tasks por defecto. ¿Cuál es el comportamiento esperado?',
  options: [
    { id: 'A', text: 'La agent identity se elimina automáticamente del directorio.' },
    { id: 'B', text: 'El sponsorship se transfiere al manager del usuario, se notifica por email al manager y la agent identity queda marcada con requireReview = true.' },
    { id: 'C', text: 'La agent identity continúa funcionando sin cambios; solo el audit log registra el evento.' },
    { id: 'D', text: 'La agent identity se deshabilita inmediatamente y el manager debe re-habilitarla manualmente.' },
  ],
  correctOptionId: 'B',
  justification:
    'Con el lifecycle workflow onSponsorLeaver configurado y transferOnLeaver = true en la identity, el comportamiento por defecto es: (1) notifyManager envía email al manager indicando la transferencia, (2) transferAgentSponsorship reasigna sponsorship al manager, (3) markRequireReview marca la identity con requireReview = true y fecha objetivo de 30 días. La identity sigue activa durante esos 30 días para no interrumpir operaciones.',
}

const Q_EX_06_008: MultipleChoiceQuestion = {
  id: 'EX-06-008',
  type: 'multiple-choice',
  difficulty: 'dificil',
  oa: 'OA-06.2',
  area: 2,
  bloom: 'Crear',
  moduleId: 6,
  prompt:
    'Una entidad financiera necesita desplegar agentes Foundry para 4 áreas distintas (Análisis de Crédito, Investigación de Fraude, Reporting Regulatorio, Tesorería), cada una con su responsable de área como sponsor. Los agentes deben acceder solo a datos de su área, deben tener requireSponsor = true y deben llevar custom security attributes para auditoría externa. ¿Cuál es el diseño de blueprints más apropiado?',
  options: [
    { id: 'A', text: 'Un único blueprint global bp-finanzas-master con todos los scopes para las 4 áreas y custom security attributes que distinguen Department por instance.' },
    { id: 'B', text: 'Cuatro blueprints separados (bp-finanzas-credito, bp-finanzas-fraude, bp-finanzas-reporting, bp-finanzas-tesoreria) cada uno con requireSponsor = true, scopes específicos del área y custom security attributes propios.' },
    { id: 'C', text: 'Un blueprint por sponsor (4 blueprints), independientemente del área de negocio.' },
    { id: 'D', text: 'No usar blueprints; crear las agent identities directamente sin plantilla.' },
  ],
  correctOptionId: 'B',
  justification:
    'Separation of duties y principio de least-privilege exigen blueprints separados por área de negocio, no por sponsor (los sponsors pueden cambiar; las áreas tienen scopes y compliance distintos). Cada blueprint declara los scopes mínimos para su área, requireSponsor = true para forzar asignación de sponsor antes de operar, y custom security attributes específicos para que la auditoría externa pueda filtrar agentes por área.',
}

const Q_EX_06_009: MultipleChoiceQuestion = {
  id: 'EX-06-009',
  type: 'multiple-choice',
  difficulty: 'media',
  oa: 'OA-06.6',
  area: 2,
  bloom: 'Recordar',
  moduleId: 6,
  prompt:
    '¿Cuál de las siguientes capacidades NO está incluida en un agent identity blueprint, sino que es una propiedad de cada agent identity individual?',
  options: [
    { id: 'A', text: 'Inheritable permissions (lista de scopes Graph).' },
    { id: 'B', text: 'Restrictions (allowedAuthenticationFlows, maxAgentIdentities, tenantOnly).' },
    { id: 'C', text: 'Custom security attributes asignados a la instance concreta.' },
    { id: 'D', text: 'Lifecycle metadata (expirationPolicy, auditLevel).' },
  ],
  correctOptionId: 'C',
  justification:
    'Los custom security attributes son propiedades de cada agent identity individual, no del blueprint. Aunque el blueprint puede definir un conjunto de attributes por defecto, cada identity puede sobrescribir o añadir sus propios attributes (Department, ConfidentialityLevel, BusinessOwner, AgentPurpose). Las opciones A, B y D son propiedades del blueprint.',
}

const Q_EX_06_010: MultipleChoiceQuestion = {
  id: 'EX-06-010',
  type: 'multiple-choice',
  difficulty: 'media',
  oa: 'OA-06.3',
  area: 2,
  bloom: 'Aplicar',
  moduleId: 6,
  prompt:
    '¿Qué trigger de lifecycle workflow se ejecuta cuando un usuario sponsor cambia de manager o de departamento, sin dejar la organización?',
  options: [
    { id: 'A', text: 'onSponsorJoiner' },
    { id: 'B', text: 'onSponsorMover' },
    { id: 'C', text: 'onSponsorLeaver' },
    { id: 'D', text: 'onAgentInactivity' },
  ],
  correctOptionId: 'B',
  justification:
    'onSponsorMover es el trigger que se ejecuta cuando un usuario sponsor cambia de manager, departamento o atributos clave que afectan a la lógica de sponsorship, sin dejar la organización. La task típica asociada es revisar si el agente sigue siendo apropiado para la nueva área del sponsor. onSponsorJoiner se ejecuta cuando un usuario es asignado por primera vez como sponsor. onSponsorLeaver se ejecuta cuando el sponsor deja la organización. onAgentInactivity se ejecuta cuando una agent identity no se usa durante un periodo configurable.',
}

const Q_EX_06_011: MultipleChoiceQuestion = {
  id: 'EX-06-011',
  type: 'multiple-choice',
  difficulty: 'media',
  oa: 'OA-06.7',
  area: 2,
  bloom: 'Recordar',
  moduleId: 6,
  prompt:
    'Tras la convergencia M365 admin center ↔ Entra del 1 de mayo de 2026, las APIs antiguas /beta/agentRegistry/* quedan deprecated. ¿Cuál es el comportamiento exacto durante la ventana de retrocompatibilidad y cuándo dejan de funcionar definitivamente?',
  options: [
    { id: 'A', text: 'Las APIs antiguas dejan de funcionar inmediatamente el 1 de mayo de 2026 con 404 Not Found.' },
    { id: 'B', text: 'Las APIs antiguas siguen funcionando indefinidamente; la nueva ruta /beta/copilot/admin/* es solo opcional.' },
    { id: 'C', text: 'Las APIs antiguas redireccionan a las nuevas con HTTP 301 hasta noviembre de 2026; a partir de esa fecha devuelven 410 Gone.' },
    { id: 'D', text: 'Las APIs antiguas devuelven warnings en el header pero siguen funcionando. Sin fecha de fin anunciada.' },
  ],
  correctOptionId: 'C',
  justification:
    'La convergencia del 1 de mayo de 2026 inicia una ventana de retrocompatibilidad y soporte hasta noviembre de 2026. Durante ese periodo, las APIs /beta/agentRegistry/* redireccionan automáticamente a las nuevas /beta/copilot/admin/* con respuestas funcionales pero con Deprecation headers en cada respuesta. A partir de noviembre de 2026 devuelven 410 Gone y los clientes deben usar las nuevas rutas obligatoriamente.',
}

/* ================================ M07 ===================================== */

const Q_EX_07_001: MultipleChoiceQuestion = {
  id: 'EX-07-001',
  type: 'multiple-choice',
  difficulty: 'facil',
  oa: 'OA-07.3',
  area: 3,
  bloom: 'Recordar',
  moduleId: 7,
  prompt:
    '¿En qué pantalla del Microsoft 365 admin center aparece destacada la lista de agentes sin owner asignado (ownerless agents)?',
  options: [
    { id: 'A', text: 'Agents → Registry, en la columna Risks.' },
    { id: 'B', text: 'Agents → Map, como nodos sin etiqueta.' },
    { id: 'C', text: 'Agents → Overview, en la sección Top actions for you dentro de la categoría «Ownerless agents».' },
    { id: 'D', text: 'Agents → Settings, como advertencias de configuración.' },
  ],
  correctOptionId: 'C',
  justification:
    'La página Overview agrupa cuatro categorías de Top actions for you: Pending requests, Agents at risk, Ownerless agents y With exceptions. Es el centro de mando diario del IT admin. La A confunde Ownerless con Risks (son métricas distintas). La B es falsa: el Map muestra agentes pero no destaca específicamente los ownerless. La D es falsa: Settings es para configuración del workload, no para alertas operativas.',
}

const Q_EX_07_002: MultipleChoiceQuestion = {
  id: 'EX-07-002',
  type: 'scenario',
  difficulty: 'media',
  oa: 'OA-07.1',
  area: 3,
  bloom: 'Aplicar',
  moduleId: 7,
  prompt:
    'El CISO te pregunta: «¿Cuántos agentes de Third Party activos tenemos en producción que estén usando Copilot Studio y, además, tengan algún risk score Medium o superior?». ¿Qué combinación de filtros aplicas en el Registry para responder?',
  options: [
    { id: 'A', text: 'Filtrar por Publisher = Microsoft + Platform = Copilot Studio + Risk = Medium, High, Critical.' },
    { id: 'B', text: 'Filtrar por Publisher = Third Party + Platform = Copilot Studio + Status = Active + Risk = Medium, High, Critical.' },
    { id: 'C', text: 'Filtrar solo por Risk = High, Critical y descartar los que no sean de Third Party manualmente.' },
    { id: 'D', text: 'No es posible: los filtros del Registry son mutuamente excluyentes y no se pueden combinar.' },
  ],
  correctOptionId: 'B',
  justification:
    'Los filtros del Registry son acumulativos (AND entre filtros distintos, OR dentro del mismo filtro). La respuesta requiere combinar cuatro filtros: Publisher = Third Party (no Microsoft), Platform = Copilot Studio, Status = Active (en producción), y Risk con tres valores marcados (Medium, High, Critical). La A confunde Microsoft con Third Party. La C ignora los filtros disponibles. La D es falsa: los filtros se combinan.',
}

const Q_EX_07_003: MultipleChoiceQuestion = {
  id: 'EX-07-003',
  type: 'multiple-choice',
  difficulty: 'media',
  oa: 'OA-07.3',
  area: 3,
  bloom: 'Recordar',
  moduleId: 7,
  prompt:
    '¿Cuáles son los requisitos para que aparezca poblada la Risks column en el Registry y en la vista de detalle de cada agente?',
  options: [
    { id: 'A', text: 'Cualquier licencia M365 E3 o superior basta para que la Risks column aparezca poblada.' },
    { id: 'B', text: 'Licencia E7 (o equivalente con módulo de Risk) + conector Microsoft 365 configurado en Defender XDR + DSPM for AI activo en Microsoft Purview.' },
    { id: 'C', text: 'Licencia Agent 365 standalone con DSPM activo; Defender no es necesario.' },
    { id: 'D', text: 'Solo se necesita Identity Protection P2 en Microsoft Entra ID.' },
  ],
  correctOptionId: 'B',
  justification:
    'La Risks column requiere E7 (o equivalente) y que la cadena de conectores funcione: Defender XDR conectado a M365 (sin él no llega telemetría de seguridad) y DSPM for AI activo en Purview (aporta señales adicionales sobre acceso a datos sensibles). Sin uno de los tres, la columna aparece vacía o incompleta.',
}

const Q_EX_07_004: MultipleChoiceQuestion = {
  id: 'EX-07-004',
  type: 'scenario',
  difficulty: 'media',
  oa: 'OA-07.5',
  area: 3,
  bloom: 'Analizar',
  moduleId: 7,
  prompt:
    'Abres el Agent Map de tu tenant y observas que el agente Foundry-Finanzas-HUB tiene 6 conexiones entrantes desde otros agentes (Reportes, Análisis, Forecast, Audit, Compliance y Risk). El resto de agentes del cluster Foundry tienen 0 conexiones entrantes. ¿Qué te dice esta información sobre la arquitectura?',
  options: [
    { id: 'A', text: 'Hay un problema: los 6 agentes con 0 conexiones entrantes están huérfanos y deberían eliminarse.' },
    { id: 'B', text: 'Foundry-Finanzas-HUB es un agente hub del que dependen 6 workflows. Es un punto crítico de fallo: si se rompe, los 6 dependientes dejarán de funcionar.' },
    { id: 'C', text: 'Hay un ciclo en el grafo: el grafo es inválido y necesita refactor inmediato.' },
    { id: 'D', text: 'Los 6 agentes con 0 entrantes son los que reciben más uso; el HUB es solo telemetría.' },
  ],
  correctOptionId: 'B',
  justification:
    'La dirección de las flechas en el Agent Map representa invocación: A → B significa que A invoca a B. Si HUB tiene 6 conexiones entrantes, hay 6 agentes que lo invocan en algún punto de su lógica. Esto lo convierte en un agente hub: punto único de paso por el que circulan varios workflows. Si HUB falla, los 6 dependientes fallan. La A confunde dirección de flecha con orfandad. La C es falsa: 6 entrantes a 1 nodo NO es un ciclo. La D invierte el significado de la flecha.',
}

/* ================================ M08 ===================================== */

const Q_EX_08_001: DragAndDropQuestion = {
  id: 'EX-08-001',
  type: 'drag-and-drop',
  difficulty: 'media',
  oa: 'OA-08.6',
  area: 3,
  bloom: 'Aplicar',
  moduleId: 8,
  prompt:
    'Ordena las siguientes acciones del ciclo de vida de un agente desde la idea hasta la retirada definitiva. La posición 1 es la primera acción que se ejecuta; la posición 6 es la última.',
  items: [
    { id: 'a1', text: 'Delete (eliminación irreversible).' },
    { id: 'a2', text: 'Activate (aprobar y dejar activo en el catálogo).' },
    { id: 'a3', text: 'Publish (enviar a publish desde la plataforma de creación).' },
    { id: 'a4', text: 'Deploy (distribuir a los usuarios destinatarios).' },
    { id: 'a5', text: 'Pin (fijar al slot Administrator para visibilidad alta).' },
    { id: 'a6', text: 'Remove (retirar del despliegue antes del Delete final).' },
  ],
  targets: [
    { id: 'p1', label: 'Posición 1 — Primera acción' },
    { id: 'p2', label: 'Posición 2' },
    { id: 'p3', label: 'Posición 3' },
    { id: 'p4', label: 'Posición 4' },
    { id: 'p5', label: 'Posición 5' },
    { id: 'p6', label: 'Posición 6 — Última acción' },
  ],
  correctMap: {
    a3: 'p1', // Publish
    a2: 'p2', // Activate
    a4: 'p3', // Deploy
    a5: 'p4', // Pin
    a6: 'p5', // Remove
    a1: 'p6', // Delete
  },
  justification:
    'El ciclo es: Publish (developer envía) → Activate (admin aprueba) → Deploy (distribuir a usuarios) → Pin (visibilidad alta) → Remove (retirar del despliegue, reversible) → Delete (irreversible). Saltarse Remove e ir directo a Delete es legal pero un antipatrón: mejor hacer Remove, esperar 1-2 semanas y solo entonces Delete.',
}

const Q_EX_08_002: MultipleChoiceQuestion = {
  id: 'EX-08-002',
  type: 'multiple-choice',
  difficulty: 'media',
  oa: 'OA-08.4',
  area: 3,
  bloom: 'Recordar',
  moduleId: 8,
  prompt:
    'Tu equipo te pregunta si pueden recuperar un agente que acabas de eliminar (Delete) hace 2 horas. ¿Qué les respondes?',
  options: [
    { id: 'A', text: 'No, Delete es irreversible inmediatamente; el agente ya no existe en el directorio.' },
    { id: 'B', text: 'Sí, durante las primeras 24 horas un Global Administrator puede ejecutar Restore-Agent365Agent -Id <agent-id> para cancelar la eliminación. Pasadas las 24 h y el SharePoint Embedded container se borrará y la operación devolverá 404 Not Found.' },
    { id: 'C', text: 'Sí, pero solo si el agente tenía requireReview: true; en ese caso se puede restaurar en cualquier momento dentro del período de review.' },
    { id: 'D', text: 'Sí, los agentes Delete pasan a una papelera de Entra que los conserva 30 días, igual que los usuarios deshabilitados.' },
  ],
  correctOptionId: 'B',
  justification:
    'Delete tiene una ventana de 24 horas durante la cual un Global Administrator puede ejecutar Restore-Agent365Agent. Tras las 24 h, el SharePoint Embedded container se marca para borrarse físicamente. La A es falsa: durante las 24 h sí hay rescate. La C confunde flags de M06 con la ventana de Delete. La D es falsa: no existe papelera equivalente para agentes.',
}

const Q_EX_08_003: MultipleChoiceQuestion = {
  id: 'EX-08-003',
  type: 'multiple-choice',
  difficulty: 'media',
  oa: 'OA-08.5',
  area: 3,
  bloom: 'Recordar',
  moduleId: 8,
  prompt:
    'La acción Reassign Ownership desde el M365 admin center está disponible para…',
  options: [
    { id: 'A', text: 'Cualquier agente del Registry independientemente de su plataforma origen.' },
    { id: 'B', text: 'Solo agentes creados con Agent Builder. Para Copilot Studio se reasigna desde Power Platform admin center y para Foundry desde Azure portal.' },
    { id: 'C', text: 'Solo agentes con transferOnLeaver: true en su sponsor configuration.' },
    { id: 'D', text: 'Solo agentes que están en estado Pending approval; una vez activos, la propiedad es inmutable.' },
  ],
  correctOptionId: 'B',
  justification:
    'Una de las limitaciones más confundidas del módulo. Reassign Ownership desde M365 admin center solo aplica a agentes Agent Builder. Los agentes Copilot Studio se reasignan desde Power Platform admin center → Environments → Apps. Los Foundry desde Azure portal → AI Foundry resource → Access control (IAM). La A es falsa por esa limitación. La C confunde sponsor con ownership técnico. La D es falsa.',
}

const Q_EX_08_004: MultipleChoiceQuestion = {
  id: 'EX-08-004',
  type: 'scenario',
  difficulty: 'dificil',
  oa: 'OA-08.2',
  area: 3,
  bloom: 'Aplicar',
  moduleId: 8,
  prompt:
    'El equipo de Compliance te pide aplicar 6 restricciones específicas (sharing externo bloqueado, cross-site SharePoint bloqueado, sensitivity Confidential mínimo, DLP Block on Confidential, CA con MFA + dispositivo compliant, logging verbose) a TODOS los agentes nuevos del departamento Finanzas. ¿Cuál es la mejor forma de implementarlo?',
  options: [
    { id: 'A', text: 'Aplicar manualmente cada política a cada agente nuevo durante el wizard de publishing, en el paso 6 «Permissions review».' },
    { id: 'B', text: 'Crear una Custom Template llamada HighlySensitiveDataTemplate con esas 6 políticas y aplicarla en el paso 5 «Apply Template» del wizard a cada agente nuevo de Finanzas.' },
    { id: 'C', text: 'Modificar la Default Template del tenant para incluir esas políticas; afectará a todos los agentes nuevos del tenant entero.' },
    { id: 'D', text: 'Crear una Conditional Access policy específica para Finanzas; las otras políticas no son configurables centralmente.' },
  ],
  correctOptionId: 'B',
  justification:
    'El patrón correcto para un conjunto de restricciones específicas que aplican a una categoría de agentes (Finanzas) es crear una Custom Template una vez y aplicarla en el paso 5 del wizard cada vez que se publica un agente de Finanzas. La A es manual y propenso a errores. La C aplicaría a TODOS los agentes del tenant, sobrerestringiendo. La D solo cubre Conditional Access; las otras 5 políticas no son cubiertas por CA.',
}

const Q_EX_08_005: MultipleChoiceQuestion = {
  id: 'EX-08-005',
  type: 'multiple-choice',
  difficulty: 'media',
  oa: 'OA-08.3',
  area: 3,
  bloom: 'Recordar',
  moduleId: 8,
  prompt:
    '¿Cuál de las siguientes afirmaciones describe correctamente el comportamiento de Pin en Microsoft Agent 365?',
  options: [
    { id: 'A', text: 'Pin requiere que el agente esté en estado Pending approval; una vez activo, no se puede pinear.' },
    { id: 'B', text: 'Pin tiene 3 slots (Microsoft, Administrator, User) y la propagación a la UI cliente puede tardar hasta 6 horas. Solo se puede pinear un agente al slot Administrator a la vez; pinear otro despinea automáticamente al anterior.' },
    { id: 'C', text: 'Pin es irreversible: una vez pineado, la única forma de quitarlo es mediante Delete del agente.' },
    { id: 'D', text: 'Pin se puede aplicar a cualquier agente del Registry, esté deployed o no.' },
  ],
  correctOptionId: 'B',
  justification:
    'Los tres elementos de la B son correctos: 3 slots Pin, propagación cliente hasta 6 h por caching, y solo un agente puede ocupar el slot Administrator a la vez. La A invierte: Pin requiere agente activo y deployed. La C es falsa: Pin es reversible vía Unpin. La D es falsa: Pin solo aplica a agentes deployed.',
}

/* --------------------------- API pública del banco -------------------------- */

const ALL_QUESTIONS: Question[] = [
  Q_PRACT_01_1, Q_PRACT_01_3, Q_PRACT_01_5,
  Q_EX_02_001, Q_EX_02_002, Q_EX_02_003,
  Q_EX_03_001,
  Q_EX_04_001,
  Q_EX_05_001,
  Q_EX_06_001, Q_EX_06_002, Q_EX_06_003, Q_EX_06_004, Q_EX_06_005,
  Q_EX_06_006, Q_EX_06_007, Q_EX_06_008, Q_EX_06_009, Q_EX_06_010, Q_EX_06_011,
  Q_EX_07_001, Q_EX_07_002, Q_EX_07_003, Q_EX_07_004,
  Q_EX_08_001, Q_EX_08_002, Q_EX_08_003, Q_EX_08_004, Q_EX_08_005,
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
