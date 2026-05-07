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

const Q_PRACT_02_1: DragAndDropQuestion = {
  id: 'Q-02-1',
  type: 'drag-and-drop',
  difficulty: 'media',
  oa: 'OA-02.1',
  area: 1,
  bloom: 'Aplicar',
  moduleId: 2,
  prompt:
    'Empareja cada capacidad de la página de detalle de un agente en el Registry con el admin center que la alimenta de datos.',
  items: [
    { id: 'c1', text: 'Risks column con score Low / Medium / High.' },
    { id: 'c2', text: 'AI Agent Inventory consolidado de agentes locales y SaaS.' },
    { id: 'c3', text: 'Sensitivity labels heredados de los archivos `.agent`.' },
    { id: 'c4', text: 'Pin / Block / Approve update sobre el agente.' },
    { id: 'c5', text: 'Estado de identidad de agente (active, disabled, blocked) con sus `appId`.' },
  ],
  targets: [
    { id: 'm365',     label: 'Microsoft 365 admin center' },
    { id: 'entra',    label: 'Microsoft Entra' },
    { id: 'purview',  label: 'Microsoft Purview' },
    { id: 'defender', label: 'Microsoft Defender XDR' },
  ],
  correctMap: {
    c1: 'defender',
    c2: 'defender',
    c3: 'purview',
    c4: 'm365',
    c5: 'entra',
  },
  justification:
    'Aunque la página de detalle del agente es UNA vista en M365 admin center, gran parte de la información que muestra proviene de los otros admin centers: la Risks column la alimenta Defender XDR (que también consolida el AI Agent Inventory incluyendo agentes locales detectados como Shadow AI), los sensitivity labels los aplica Purview sobre el archivo .agent, y el estado de identidad lo gestiona Entra Agent ID. Solo las acciones operativas como Pin / Block / Approve viven nativamente en M365 admin center.',
}

const Q_PRACT_02_3: MultipleChoiceQuestion = {
  id: 'Q-02-3',
  type: 'multiple-choice',
  difficulty: 'facil',
  oa: 'OA-02.3',
  area: 1,
  bloom: 'Comprender',
  moduleId: 2,
  prompt:
    'En el Agent Registry hay tres categorías de Publisher. ¿Cuál de las siguientes afirmaciones describe correctamente esa clasificación?',
  options: [
    { id: 'A', text: 'Microsoft (agentes desarrollados por Microsoft), Third Party (partners verificados que han pasado por el ISV program) y Your organization (agentes creados por usuarios o IT del propio tenant).' },
    { id: 'B', text: 'Microsoft (first party), Open Source (agentes con licencia OSS) y Custom (creados internamente).' },
    { id: 'C', text: 'Verified, Pending Verification y Blocked, según el estado de la aprobación de IT.' },
    { id: 'D', text: 'Trusted, Untrusted y Quarantine, según el risk score asignado por Defender.' },
  ],
  correctOptionId: 'A',
  justification:
    'Las tres categorías de Publisher en el Registry son Microsoft, Third Party (partners ISV con verificación oficial) y Your organization (agentes creados por la propia empresa). Esta clasificación es independiente del estado de aprobación (que vive en otra columna) y del risk score (que vive en la Risks column). La opción B inventa categorías. La C confunde Publisher con estado de approval. La D confunde Publisher con risk classification.',
}

const Q_PRACT_02_5: MultipleChoiceQuestion = {
  id: 'Q-02-5',
  type: 'scenario',
  difficulty: 'dificil',
  oa: 'OA-02.5',
  area: 1,
  bloom: 'Analizar',
  moduleId: 2,
  prompt:
    'Un equipo está construyendo un agente Foundry que durante el runtime necesita consultar las reuniones próximas del usuario en Outlook y los archivos compartidos recientemente con el equipo. El líder técnico pregunta si tiene que llamar a Microsoft Graph desde el agente o si hay otra vía. ¿Cuál es la respuesta arquitectónicamente más correcta?',
  options: [
    { id: 'A', text: 'Sí, necesariamente. El agente debe llamar Microsoft Graph con su agent identity para acceder al calendario y archivos.' },
    { id: 'B', text: 'No es necesario llamar Graph directamente: el agente puede consumir esos datos vía Work IQ MCP servers, que exponen contexto del usuario (calendario, archivos, contactos, etc.) como herramientas MCP estandarizadas en runtime.' },
    { id: 'C', text: 'Sí, pero usando el SDK de Outlook y el SDK de SharePoint, no Graph.' },
    { id: 'D', text: 'No tiene sentido la pregunta: los agentes Foundry no pueden acceder a datos del usuario en runtime.' },
  ],
  correctOptionId: 'B',
  justification:
    'Work IQ MCP servers son una pieza arquitectónica clave de Agent 365: exponen contexto del usuario (calendario, mail, archivos, contactos, equipos, etc.) como herramientas MCP estandarizadas que cualquier agente puede consumir en runtime sin escribir integraciones contra Microsoft Graph. Esto reduce código, centraliza permisos y hace que la gobernanza de qué datos toca el agente sea automática (Purview ve los accesos vía MCP). La opción A funciona pero es la opción \'vieja\': implica más código, más permisos, más superficie de ataque.',
}

const Q_PRACT_03_1: MultipleChoiceQuestion = {
  id: 'Q-03-1',
  type: 'scenario',
  difficulty: 'media',
  oa: 'OA-03.1',
  area: 1,
  bloom: 'Evaluar',
  moduleId: 3,
  prompt:
    'TextilNova es una empresa de 2.000 empleados con Microsoft 365 E3 (no E5). El CIO acaba de licenciar Microsoft 365 Copilot al 80 % de la plantilla (1.600 usuarios) y quiere desplegar Agent 365 a esos mismos 1.600. La adopción de Copilot está estable en ese nivel desde hace tres meses. ¿Cuál es la recomendación de licenciamiento más adecuada?',
  options: [
    { id: 'A', text: 'Migrar los 1.600 usuarios con Copilot a Microsoft 365 E7. Por encima del 60 % de adopción Copilot el bundle E7 es típicamente más eficiente y simplifica el SKU stack.' },
    { id: 'B', text: 'Mantener E3, comprar Agent 365 standalone para los 1.600 usuarios y mantener Copilot en su SKU actual.' },
    { id: 'C', text: 'Migrar toda la plantilla (2.000 usuarios) a E7, incluyendo los 400 que no usan Copilot.' },
    { id: 'D', text: 'Esperar 6 meses al GA de Frontier preview para tomar la decisión con datos reales.' },
  ],
  correctOptionId: 'A',
  justification:
    'Con Copilot estable al 80 % en una organización con E3 base, E7 es probablemente la opción óptima: bundle Copilot + Agent 365 + uplift a E5 implícito en E7 en un solo SKU para los 1.600 usuarios que ya pagan Copilot. La opción B funciona pero suma SKU stack para 1.600 usuarios y exige mantener tres líneas de billing en paralelo. La C sobreasigna a 400 usuarios sin Copilot. La D es procastinación: los datos ya están y la decisión se puede tomar. Regla operativa: standalone si Copilot < 60 %; E7 si Copilot > 60 %.',
}

const Q_PRACT_03_2: MultipleChoiceQuestion = {
  id: 'Q-03-2',
  type: 'multiple-choice',
  difficulty: 'media',
  oa: 'OA-03.2',
  area: 1,
  bloom: 'Aplicar',
  moduleId: 3,
  prompt:
    'Un agente Foundry desplegado en producción opera de dos formas según el caso: (a) responde a preguntas que un usuario le hace en Teams (modo OBO sobre el usuario que pregunta) y (b) procesa cada noche un batch de 5.000 facturas sin un usuario que lo invoque (modo autonomous con su propia identidad). ¿Qué afirmación sobre cobertura de licencias es correcta?',
  options: [
    { id: 'A', text: 'Solo necesita licencia el usuario que invoca al agente en Teams. El batch nocturno no consume licencias porque no hay un usuario asociado.' },
    { id: 'B', text: 'El uso OBO consume licencia del usuario invocador (debe tener Agent 365). El uso autonomous consume mensajes de la cuota del agente (Foundry capacity) y se contabiliza como consumo de la identidad de agente.' },
    { id: 'C', text: 'Ambos modos requieren que el agente tenga licencia Agent 365 propia, sin importar quién lo invoque.' },
    { id: 'D', text: 'El modo autonomous requiere E7 obligatoriamente; OBO admite cualquier SKU.' },
  ],
  correctOptionId: 'B',
  justification:
    'OBO (on-behalf-of): el agente actúa con el contexto del usuario; el usuario debe tener Agent 365. Si no lo tiene, el agente no responde. Autonomous: el agente actúa con su propia identidad de agente; consume cuota de su plataforma (Foundry messages, MCS messages, etc.). No hay un usuario que pague por el invoke. Confundir ambos modos lleva a infralicenciamiento (caso A) o sobrelicenciamiento (caso C). La opción D inventa una restricción.',
}

const Q_PRACT_03_5: DragAndDropQuestion = {
  id: 'Q-03-5',
  type: 'drag-and-drop',
  difficulty: 'media',
  oa: 'OA-03.5',
  area: 1,
  bloom: 'Comprender',
  moduleId: 3,
  prompt:
    'Empareja cada concepto de billing con la línea de billing que lo gestiona.',
  items: [
    { id: 'b1', text: 'Agent 365 standalone $15/usuario/mes.' },
    { id: 'b2', text: 'Foundry capacity ($X/1k mensajes para agentes autonomous).' },
    { id: 'b3', text: 'Copilot Studio messages para agentes Agent Builder y MCS CEA.' },
    { id: 'b4', text: 'M365 Copilot $30/usuario/mes (incluido en E7).' },
    { id: 'b5', text: 'Microsoft 365 E5 base $57/usuario/mes.' },
  ],
  targets: [
    { id: 'a365',     label: 'Línea Agent 365 (per-seat)' },
    { id: 'copilot',  label: 'Línea Copilot (per-seat)' },
    { id: 'm365',     label: 'Línea M365 base (per-seat)' },
    { id: 'capacity', label: 'Línea de capacity (consumo)' },
  ],
  correctMap: {
    b1: 'a365',
    b2: 'capacity',
    b3: 'capacity',
    b4: 'copilot',
    b5: 'm365',
  },
  justification:
    'Las tres líneas de billing simultáneas que el responsable financiero necesita modelar: per-seat M365 (E3/E5/E7) la base, per-seat Copilot y Agent 365 según despliegue, y capacity de mensajes (Foundry capacity y Copilot Studio messages) según consumo real de agentes autonomous. Confundir capacity con per-seat es el error de planificación financiera más frecuente.',
}

const Q_PRACT_04_1: MultipleChoiceQuestion = {
  id: 'Q-04-1',
  type: 'scenario',
  difficulty: 'media',
  oa: 'OA-04.1',
  area: 1,
  bloom: 'Aplicar',
  moduleId: 4,
  prompt:
    'Marta del equipo de Adopción de tu empresa necesita: ver el inventario completo de agentes en el Registry, configurar plantillas de publishing Custom para distintos departamentos y aprobar pending requests cuando llegan. NO debe poder modificar roles, ni tocar políticas Defender o Purview. ¿Qué rol mínimo le asignas?',
  options: [
    { id: 'A', text: 'Global Administrator. Es la opción más rápida.' },
    { id: 'B', text: 'AI Administrator. Permite gestionar plantillas, aprobar requests y leer todo el Registry. NO incluye modificación de roles ni controles de Defender/Purview.' },
    { id: 'C', text: 'AI Reader + Cloud Application Administrator. Para leer el Registry y aprobar requests.' },
    { id: 'D', text: 'Privileged Role Administrator. Es necesario para gestionar plantillas porque las plantillas son políticas.' },
  ],
  correctOptionId: 'B',
  justification:
    'AI Administrator es exactamente el rol diseñado para el perfil descrito: gestión completa del workload Agents (Registry, plantillas, aprobaciones) sin tocar identidad ni roles ni datos. La opción A sobreasigna privilegio (antipatrón). La C confunde: AI Reader no permite aprobar requests, y Cloud Application Administrator es un rol de Entra apps/SP no relacionado con plantillas. La D inventa: Privileged Role Administrator es para gestionar elegibilidades PIM, no plantillas.',
}

const Q_PRACT_04_2: MultipleChoiceQuestion = {
  id: 'Q-04-2',
  type: 'multiple-choice',
  difficulty: 'facil',
  oa: 'OA-04.2',
  area: 1,
  bloom: 'Comprender',
  moduleId: 4,
  prompt:
    '¿Cuál de las siguientes afirmaciones describe correctamente la diferencia entre AI Administrator y AI Reader?',
  options: [
    { id: 'A', text: 'AI Administrator escribe (gestiona plantillas, aprueba/bloquea agentes, configura settings); AI Reader solo lee (consulta Registry, Map, métricas).' },
    { id: 'B', text: 'AI Administrator es full admin del tenant, AI Reader es lectura del tenant entero.' },
    { id: 'C', text: 'AI Administrator gestiona Microsoft Entra Agent ID; AI Reader gestiona el Agent Registry.' },
    { id: 'D', text: 'AI Administrator gestiona producción; AI Reader gestiona Frontier preview.' },
  ],
  correctOptionId: 'A',
  justification:
    'La separación es escritura vs lectura dentro del workload Agents (no del tenant entero). AI Administrator hace acciones (publish, approve, block, pin, plantillas, settings); AI Reader solo lee. La opción B confunde con Global Admin/Global Reader. La C inventa un reparto que no existe (Entra Agent ID lo gobierna Agent ID Administrator, otro rol distinto). La D inventa una distinción por entorno.',
}

const Q_PRACT_04_5: DragAndDropQuestion = {
  id: 'Q-04-5',
  type: 'drag-and-drop',
  difficulty: 'media',
  oa: 'OA-04.1',
  area: 1,
  bloom: 'Aplicar',
  moduleId: 4,
  prompt:
    'Empareja cada tarea con el rol mínimo que la cubre.',
  items: [
    { id: 't1', text: 'Aprobar un pending request de un agente nuevo en el wizard de publishing.' },
    { id: 't2', text: 'Configurar una blueprint de identidad en Entra Agent ID.' },
    { id: 't3', text: 'Investigar una alerta de Defender XDR sobre un agente comprometido.' },
    { id: 't4', text: 'Aplicar una sensitivity label sobre un archivo `.agent` en Purview.' },
    { id: 't5', text: 'Consultar el Registry y exportarlo a Excel sin modificar nada.' },
  ],
  targets: [
    { id: 'ai-admin',       label: 'AI Administrator' },
    { id: 'agent-id-admin', label: 'Agent ID Administrator' },
    { id: 'sec-op',         label: 'Security Operator' },
    { id: 'compl-admin',    label: 'Compliance Administrator' },
    { id: 'ai-reader',      label: 'AI Reader' },
  ],
  correctMap: {
    t1: 'ai-admin',
    t2: 'agent-id-admin',
    t3: 'sec-op',
    t4: 'compl-admin',
    t5: 'ai-reader',
  },
  justification:
    'Cada tarea tiene su rol mínimo. Aprobar requests → AI Administrator. Configurar blueprint → Agent ID Administrator (rol específico de Entra Agent ID, distinto de AI Administrator). Investigar alerta Defender → Security Operator. Aplicar sensitivity label → Compliance Administrator (Purview). Leer y exportar Registry → AI Reader. La trampa más frecuente: Agent ID Administrator y AI Administrator suenan parecido pero son roles distintos.',
}

const Q_PRACT_05_1: MultipleChoiceQuestion = {
  id: 'Q-05-1',
  type: 'multiple-choice',
  difficulty: 'facil',
  oa: 'OA-05.1',
  area: 1,
  bloom: 'Recordar',
  moduleId: 5,
  prompt:
    'Estás a punto de activar Agent 365 en un tenant productivo y revisas el checklist de prerrequisitos. ¿Cuál de los siguientes elementos NO es prerrequisito para activar el workload?',
  options: [
    { id: 'A', text: 'Audit logs habilitados en el tenant.' },
    { id: 'B', text: 'Licencias Agent 365 asignadas a los usuarios piloto.' },
    { id: 'C', text: 'Un blueprint de identidad creado previamente en Entra Agent ID.' },
    { id: 'D', text: 'El admin que activa tiene rol Global Administrator o AI Administrator.' },
  ],
  correctOptionId: 'C',
  justification:
    'Crear un blueprint de identidad en Entra Agent ID es una tarea posterior a la activación: hace falta tener el workload activo para entrar a Entra Agent ID y crear el blueprint. Las opciones A, B y D sí son prerrequisitos: sin audit logs los eventos del workload no se persisten; sin licencias asignadas no hay quien invoque agentes; sin rol no se puede activar el workload.',
}

const Q_PRACT_05_2: MultipleChoiceQuestion = {
  id: 'Q-05-2',
  type: 'scenario',
  difficulty: 'media',
  oa: 'OA-05.2',
  area: 1,
  bloom: 'Analizar',
  moduleId: 5,
  prompt:
    'Un compañero tuyo ha activado Agent 365 hace dos días siguiendo notas internas. Hoy el responsable de Defender informa de que NO recibe ningún evento de agentes en CloudAppEvents pese a que los usuarios ya están invocando agentes desde Teams. Tú revisas el setup y todo lo demás (Registry visible, Purview DSPM activado, Terms of Service aceptados) parece correcto. ¿Cuál es el paso más probable que se ha saltado?',
  options: [
    { id: 'A', text: 'Aceptar Terms of Service del workload Agents (el compañero los aceptó hace dos días, así que están).' },
    { id: 'B', text: 'Configurar el Microsoft 365 connector en Defender for Cloud Apps. Sin él, Defender no ingiere telemetría del workload Agents.' },
    { id: 'C', text: 'Activar el toggle Frontier preview, sin el cual no se generan eventos.' },
    { id: 'D', text: 'Asignar licencias Agent 365 a los usuarios (los usuarios invocan, luego ya tienen).' },
  ],
  correctOptionId: 'B',
  justification:
    'El conector M365 en Defender for Cloud Apps es la pieza que activa la ingesta de telemetría del workload Agents en Defender XDR. Sin él, Defender no \'ve\' los agentes y CloudAppEvents queda vacío respecto al workload. Es uno de los pasos más fáciles de olvidar porque su síntoma no es un error visible al activar, sino la ausencia silenciosa de datos un par de días después.',
}

const Q_PRACT_05_5: DragAndDropQuestion = {
  id: 'Q-05-5',
  type: 'drag-and-drop',
  difficulty: 'media',
  oa: 'OA-05.5',
  area: 1,
  bloom: 'Aplicar',
  moduleId: 5,
  prompt:
    'Empareja cada acción de validación end-to-end del setup con el admin center donde la verificarías.',
  items: [
    { id: 'v1', text: 'Confirmar que el agente de prueba aparece en el Agent Registry con su Type y Publisher correctos.' },
    { id: 'v2', text: 'Confirmar que el agente de prueba aparece en AI Agent Inventory con su Risk score calculado.' },
    { id: 'v3', text: 'Confirmar que el agente de prueba aparece en DSPM for AI con su exposición de datos visible.' },
    { id: 'v4', text: 'Confirmar que la identidad del agente de prueba existe como objeto agent identity con su `appId`.' },
    { id: 'v5', text: 'Confirmar que se puede aprobar un pending request del agente desde el wizard de publishing.' },
  ],
  targets: [
    { id: 'm365',     label: 'M365 admin center' },
    { id: 'entra',    label: 'Entra admin center' },
    { id: 'purview',  label: 'Microsoft Purview portal' },
    { id: 'defender', label: 'Microsoft Defender XDR' },
  ],
  correctMap: {
    v1: 'm365',
    v2: 'defender',
    v3: 'purview',
    v4: 'entra',
    v5: 'm365',
  },
  justification:
    'La validación end-to-end consiste en ver el mismo agente desde los cuatro admin centers. Si el agente aparece en los cuatro con datos coherentes (Type/Publisher, Risk score, DSPM exposure, identity object), el setup está operativo de extremo a extremo. Si falta en alguno, el conector correspondiente está mal configurado.',
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
  Q_PRACT_02_1, Q_PRACT_02_3, Q_PRACT_02_5,
  Q_PRACT_03_1, Q_PRACT_03_2, Q_PRACT_03_5,
  Q_PRACT_04_1, Q_PRACT_04_2, Q_PRACT_04_5,
  Q_PRACT_05_1, Q_PRACT_05_2, Q_PRACT_05_5,
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
