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

/* --------------------------- API pública del banco -------------------------- */

const ALL_QUESTIONS: Question[] = [
  Q_EX_01_001, Q_EX_01_002, Q_EX_01_003,
  Q_EX_02_001, Q_EX_02_002, Q_EX_02_003,
  Q_EX_03_001,
  Q_EX_04_001,
  Q_EX_05_001,
  Q_EX_06_001, Q_EX_06_002, Q_EX_06_003, Q_EX_06_004, Q_EX_06_005,
  Q_EX_06_006, Q_EX_06_007, Q_EX_06_008, Q_EX_06_009, Q_EX_06_010, Q_EX_06_011,
  Q_EX_07_001, Q_EX_07_002, Q_EX_07_003, Q_EX_07_004,
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
