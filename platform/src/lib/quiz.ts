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

/* ============================ Módulo 06 — quiz práctica ===================== */

const Q_PRACT_06_1: MultipleChoiceQuestion = {
  id: 'Q-06-1',
  type: 'multiple-choice',
  difficulty: 'facil',
  oa: 'OA-06.1',
  area: 2,
  bloom: 'Recordar',
  moduleId: 6,
  prompt:
    '¿Cuál de los siguientes objetos de Microsoft Entra Agent ID es la instancia que autentica contra Microsoft Graph y hereda permisos del blueprint?',
  options: [
    { id: 'A', text: 'Agent identity blueprint' },
    { id: 'B', text: 'Agent identity' },
    { id: 'C', text: 'Agent identity blueprint principal' },
    { id: 'D', text: 'Agent user' },
  ],
  correctOptionId: 'B',
  justification:
    'La agent identity es la instancia concreta. Tiene un appId, hereda los permisos del blueprint del que se aprovisionó, recibe tokens y autentica contra Microsoft Graph. El blueprint solo define la plantilla. El blueprint principal es el SP del blueprint para admin consents (no autentica al agente). El agent user es una propiedad opcional para presencia humana-like en Teams.',
}

const Q_PRACT_06_3: DragAndDropQuestion = {
  id: 'Q-06-3',
  type: 'drag-and-drop',
  difficulty: 'media',
  oa: 'OA-06.1',
  area: 2,
  bloom: 'Aplicar',
  moduleId: 6,
  prompt:
    'Empareja cada acción operativa con el objeto Entra Agent ID donde se ejecuta principalmente.',
  items: [
    { id: 'a1', text: 'Modificar la lista de inheritable permissions de un grupo de agentes.' },
    { id: 'a2', text: 'Asignar un Department = Finanzas a un agente concreto.' },
    { id: 'a3', text: 'Aceptar admin consent para los scopes Graph que el grupo va a heredar.' },
    { id: 'a4', text: 'Activar la propiedad userType: AgentUser para que el agente aparezca en Teams.' },
    { id: 'a5', text: 'Cambiar el accountEnabled = false para deshabilitar una instancia individual.' },
  ],
  targets: [
    { id: 'blueprint', label: 'Blueprint' },
    { id: 'principal', label: 'Blueprint principal' },
    { id: 'identity',  label: 'Identity' },
    { id: 'user',      label: 'Agent user' },
  ],
  correctMap: {
    a1: 'blueprint',
    a2: 'identity',
    a3: 'principal',
    a4: 'user',
    a5: 'identity',
  },
  justification:
    'Inheritable permissions se editan en el blueprint y se propagan a las identities derivadas. Custom security attributes (Department, etc.) se asignan a cada identity individual. Admin consent se acepta sobre el blueprint principal. userType: AgentUser es la propiedad que crea el agent user. accountEnabled = false se aplica sobre la identity concreta. Regla mnemotécnica: lo que afecta a muchos vive en el blueprint; lo que afecta a uno vive en la identity.',
}

const Q_PRACT_06_4: MultipleChoiceQuestion = {
  id: 'Q-06-4',
  type: 'scenario',
  difficulty: 'media',
  oa: 'OA-06.4',
  area: 2,
  bloom: 'Aplicar',
  moduleId: 6,
  prompt:
    'Un agente Foundry interno responde a preguntas de empleados sobre políticas de viaje. Cada empleado lo invoca desde Teams, el agente consulta el calendario del empleado y los gastos pendientes del propio empleado para personalizar la respuesta. ¿Qué flujo de autenticación corresponde y qué requisito de licenciamiento implica?',
  options: [
    { id: 'A', text: 'OBO. El agente actúa con el contexto del empleado invocador. Cada empleado invocador necesita licencia Agent 365.' },
    { id: 'B', text: 'Own identity, porque el agente accede a varios datos de varios empleados a lo largo del día.' },
    { id: 'C', text: 'Own identity, porque el agente vive en Foundry y los agentes Foundry son siempre autonomous.' },
    { id: 'D', text: 'OBO con licencia E7 obligatoria por tratarse de Foundry.' },
  ],
  correctOptionId: 'A',
  justification:
    'El caso describe un agente invocado por un usuario que accede a datos del propio usuario invocador. Es el patrón clásico de OBO (on-behalf-of): el agente recibe el contexto del usuario y opera con sus permisos. Cada usuario invocador debe tener licencia Agent 365. La opción B confunde acceso a datos de varios usuarios con autonomous: en OBO el agente accede a datos del invocador en cada interacción, no a datos de terceros. La C inventa una regla sobre Foundry. La D inventa el requisito E7.',
}

/* ============================ Módulo 07 — quiz práctica ===================== */

const Q_PRACT_07_1: MultipleChoiceQuestion = {
  id: 'Q-07-1',
  type: 'multiple-choice',
  difficulty: 'facil',
  oa: 'OA-07.3',
  area: 3,
  bloom: 'Recordar',
  moduleId: 7,
  prompt:
    'Entras en M365 admin center → Agents → Overview y ves el bloque «Top actions for you». ¿Cuál de las siguientes categorías NO aparece en ese bloque?',
  options: [
    { id: 'A', text: 'Pending requests' },
    { id: 'B', text: 'Agents at risk' },
    { id: 'C', text: 'Top performing agents' },
    { id: 'D', text: 'Ownerless agents' },
  ],
  correctOptionId: 'C',
  justification:
    'Las cuatro categorías de Top actions for you son: Pending requests, Agents at risk, Ownerless agents y With exceptions. Top performing agents NO existe como categoría: Overview se centra en lo que requiere atención del admin, no en métricas de uso. Las métricas de uso viven en Microsoft 365 Copilot Dashboard, no en Overview.',
}

const Q_PRACT_07_2: MultipleChoiceQuestion = {
  id: 'Q-07-2',
  type: 'scenario',
  difficulty: 'media',
  oa: 'OA-07.1',
  area: 3,
  bloom: 'Aplicar',
  moduleId: 7,
  prompt:
    'El responsable de seguridad pregunta: «¿Cuántos agentes Microsoft (publisher Microsoft) están desplegados en la plataforma Foundry y siguen en risk Low pero llevan inactivos más de 30 días?». ¿Qué combinación de filtros aplicas en el Registry para responder?',
  options: [
    { id: 'A', text: 'Publisher = Microsoft + Platform = Foundry + Risk = Low + Last activity = > 30 days.' },
    { id: 'B', text: 'Publisher = Third Party + Platform = Foundry + Risk = Low; el filtro de inactividad no existe en el Registry.' },
    { id: 'C', text: 'Solo se puede filtrar por dos de esas dimensiones simultáneamente; combinar las cuatro requiere exportar a Excel.' },
    { id: 'D', text: 'Status = Pending + Risk = Low. La inactividad se infiere del estado Pending.' },
  ],
  correctOptionId: 'A',
  justification:
    'Los filtros del Registry son acumulativos (AND lógico entre filtros distintos) y combinables sin límite práctico. Se combinan los cuatro: Publisher = Microsoft, Platform = Foundry, Risk = Low, Last activity (días). La opción B confunde Microsoft con Third Party. La C inventa una limitación. La D confunde inactividad con estado Pending.',
}

const Q_PRACT_07_5: MultipleChoiceQuestion = {
  id: 'Q-07-5',
  type: 'scenario',
  difficulty: 'dificil',
  oa: 'OA-07.5',
  area: 3,
  bloom: 'Analizar',
  moduleId: 7,
  prompt:
    'En el Agent Map detectas un patrón con tres agentes: Reportes-Mensuales invoca a Datos-Crudos, que invoca a Limpieza-ETL, que a su vez invoca a Reportes-Mensuales. Las flechas dibujan un triángulo cerrado. ¿Cómo interpretas este patrón y cuál es la prioridad de actuación?',
  options: [
    { id: 'A', text: 'Es un grafo de dependencias estándar; no requiere acción específica.' },
    { id: 'B', text: 'Es un ciclo (loop circular) entre tres agentes. Es un antipatrón: puede provocar invocaciones recursivas, costes en spiral y comportamientos impredecibles. Prioridad alta de revisión con los owners para refactorizar.' },
    { id: 'C', text: 'Es un cluster cohesionado que indica una buena arquitectura modular.' },
    { id: 'D', text: 'Indica que los tres agentes son redundantes y pueden consolidarse en uno solo.' },
  ],
  correctOptionId: 'B',
  justification:
    'Tres flechas formando un triángulo cerrado representa un ciclo en el grafo dirigido (A → B → C → A). Es un antipatrón clásico: en runtime puede provocar invocaciones recursivas con timeouts agotados, spiral de costes y comportamientos no deterministas. La prioridad alta es refactorizar: típicamente uno de los tres agentes debería tener un trigger externo en lugar de invocarse desde dentro del ciclo.',
}

/* ============================ Módulo 08 — quiz práctica ===================== */

const Q_PRACT_08_2: MultipleChoiceQuestion = {
  id: 'Q-08-2',
  type: 'scenario',
  difficulty: 'dificil',
  oa: 'OA-08.4',
  area: 3,
  bloom: 'Analizar',
  moduleId: 8,
  prompt:
    'El compañero Pedro eliminó por error el agente «Comercial-Forecast» hace 26 horas. El agente era usado por 80 personas del equipo Comercial. Pedro pregunta cómo recuperarlo. ¿Qué le respondes?',
  options: [
    { id: 'A', text: 'Ejecutar Restore-Agent365Agent -Id <agent-id> con rol Global Administrator. Tarda menos de 5 minutos.' },
    { id: 'B', text: 'El agente ya no se puede recuperar: la ventana de 24 h ha expirado y el SharePoint Embedded container ya está marcado para borrado físico. Hay que recrear el agente desde cero (o desde un backup del .agent file si existe).' },
    { id: 'C', text: 'Pedir al equipo de Defender XDR que restaure el agente desde el AI Agent Inventory.' },
    { id: 'D', text: 'Restaurar el agent identity en Microsoft Entra; con eso el agente vuelve a aparecer en el Registry.' },
  ],
  correctOptionId: 'B',
  justification:
    'La ventana de retroceso de Delete es 24 h. A las 26 h, Restore-Agent365Agent devuelve 404 Not Found y el contenedor SharePoint Embedded está marcado para borrado físico. La respuesta operativa es recrear desde cero. Lección aprendida: la diferencia entre Remove (reversible) y Delete (24 h) es crítica. Siempre Remove primero, esperar y solo entonces Delete.',
}

const Q_PRACT_08_3: MultipleChoiceQuestion = {
  id: 'Q-08-3',
  type: 'multiple-choice',
  difficulty: 'media',
  oa: 'OA-08.3',
  area: 3,
  bloom: 'Aplicar',
  moduleId: 8,
  prompt:
    'Has pineado el agente «Servicio-IT-FAQ» al slot Administrator para todo el grupo «Empleados nuevos». 30 minutos después, los empleados se quejan de que no ven el agente en su panel. ¿Cuál es la causa más probable?',
  options: [
    { id: 'A', text: 'Pin no se aplicó: hay que volver a ejecutar la acción.' },
    { id: 'B', text: 'El slot Administrator solo es visible para usuarios con rol IT Administrator.' },
    { id: 'C', text: 'La propagación de Pin a la UI cliente puede tardar hasta 6 horas por caching. Es comportamiento esperado.' },
    { id: 'D', text: 'El agente debe estar también pineado al slot User para que los usuarios lo vean.' },
  ],
  correctOptionId: 'C',
  justification:
    'La propagación de Pin a la UI cliente tiene una latencia de hasta 6 horas por caching en los clientes Office (Word, Outlook, Teams). 30 minutos es muy poco para diagnosticar un fallo: el comportamiento esperado es esperar a que se propague.',
}

const Q_PRACT_08_5: DragAndDropQuestion = {
  id: 'Q-08-5',
  type: 'drag-and-drop',
  difficulty: 'media',
  oa: 'OA-08.6',
  area: 3,
  bloom: 'Aplicar',
  moduleId: 8,
  prompt:
    'Empareja cada acción de gobernanza con la categoría del ciclo de vida a la que pertenece principalmente.',
  items: [
    { id: 'g1', text: 'Approve update (revisar y aprobar la nueva versión publicada).' },
    { id: 'g2', text: 'Pin (fijar al slot Administrator del catálogo).' },
    { id: 'g3', text: 'Block (bloquear definitivamente el agente).' },
    { id: 'g4', text: 'Reassign Ownership (cambiar el owner técnico).' },
    { id: 'g5', text: 'Remove (retirar del despliegue, reversible).' },
    { id: 'g6', text: 'Activate (aprobar y dejar activo en el catálogo).' },
  ],
  targets: [
    { id: 'deploy',      label: 'Activación / Despliegue' },
    { id: 'visibility',  label: 'Visibilidad y promoción' },
    { id: 'maintenance', label: 'Mantenimiento (cambios y updates)' },
    { id: 'retirement',  label: 'Retirada / Bloqueo' },
  ],
  correctMap: {
    g1: 'maintenance',
    g2: 'visibility',
    g3: 'retirement',
    g4: 'maintenance',
    g5: 'retirement',
    g6: 'deploy',
  },
  justification:
    'Las 11 acciones se agrupan en cuatro categorías: Activación / Despliegue (Activate, Deploy), Visibilidad y promoción (Pin, Unpin), Mantenimiento (Approve update, Reassign Ownership, Edit metadata) y Retirada / Bloqueo (Remove, Block, Delete, Restore). Conocer la categoría te permite anticipar el impacto de la acción.',
}

/* ============================ Módulo 09 — quiz práctica ===================== */

const Q_PRACT_09_1: MultipleChoiceQuestion = {
  id: 'Q-09-1',
  type: 'multiple-choice',
  difficulty: 'media',
  oa: 'OA-09.1',
  area: 2,
  bloom: 'Aplicar',
  moduleId: 9,
  prompt:
    'Un usuario invoca a un agente OBO «Comercial-Pricing» que tiene en su blueprint heredado los scopes User.Read, Mail.Read, Files.Read.All, Crm.Account.Read. El usuario tiene licencia M365 E3 (sin Exchange Online) y consintió todos los scopes la primera vez que invocó al agente. ¿Qué scopes serán efectivos durante la invocación?',
  options: [
    { id: 'A', text: 'Los cuatro: blueprint heredado + consent → efectivos.' },
    { id: 'B', text: 'Solo User.Read, Files.Read.All y Crm.Account.Read. Mail.Read falla porque el usuario NO tiene Exchange Online en su licencia E3, así que la intersección lo descarta.' },
    { id: 'C', text: 'Solo User.Read. El resto requieren licencia E5 mínima.' },
    { id: 'D', text: 'Solo los scopes Microsoft Graph estándar. Los scopes de resource apps custom como Crm.Account.Read no aplican en OBO.' },
  ],
  correctOptionId: 'B',
  justification:
    'Los permisos efectivos en OBO son la intersección triple entre blueprint heredado, licencia del usuario y consent. Los tres deben coincidir. En este caso el usuario ha consentido los cuatro y el blueprint los hereda, pero la licencia E3 no incluye Exchange Online, así que Mail.Read falla en runtime con 403 Forbidden. Los otros tres pasan.',
}

const Q_PRACT_09_5: MultipleChoiceQuestion = {
  id: 'Q-09-5',
  type: 'scenario',
  difficulty: 'dificil',
  oa: 'OA-09.5',
  area: 2,
  bloom: 'Analizar',
  moduleId: 9,
  prompt:
    'Un auditor regulatorio pregunta: «¿Qué usuario humano accedió al documento tesoreria-Q3-cierre.xlsx el día 15 de octubre a las 23:47?». Tu equipo investiga y descubre que el acceso lo hizo el agente Foundry «Tesoreria-Reconcile» en modo own identity. ¿Cómo respondes al auditor con trazabilidad operacional?',
  options: [
    { id: 'A', text: 'Fue el agente Tesoreria-Reconcile, así que no podemos identificar un usuario humano: own identity opera con identidad propia sin contexto de usuario invocador. Para auditoría regulatoria correlacionamos el agentId con el BusinessOwner del agente vía custom security attribute, que es la persona responsable de la decisión de qué hace el agente.' },
    { id: 'B', text: 'Fue el último usuario que invocó el agente antes de las 23:47. Lo extraemos del sign-in log más reciente.' },
    { id: 'C', text: 'No podemos responder: own identity no genera logs auditables.' },
    { id: 'D', text: 'Ningún humano accedió: own identity no permite acceso a documentos sensibles por diseño.' },
  ],
  correctOptionId: 'A',
  justification:
    'Own identity no tiene usuario invocador: el agente actúa con su propia identidad y los sign-in logs reflejan eso (userPrincipalName vacío, appId del agente). Para auditoría regulatoria la trazabilidad pasa por el BusinessOwner del agente (custom security attribute) que documenta quién es el responsable humano de la decisión.',
}

const Q_PRACT_09_6: DragAndDropQuestion = {
  id: 'Q-09-6',
  type: 'drag-and-drop',
  difficulty: 'media',
  oa: 'OA-09.6',
  area: 2,
  bloom: 'Aplicar',
  moduleId: 9,
  prompt:
    'Empareja cada capa de defensa del control de acceso a agentes con la pieza de Microsoft Entra / Microsoft Graph donde se configura.',
  items: [
    { id: 'c1', text: 'Limitar el conjunto de scopes Graph que cualquier agente derivado puede heredar.' },
    { id: 'c2', text: 'Bloquear invocaciones de un agente cuando su risk score pasa a High.' },
    { id: 'c3', text: 'Detectar que un agente intenta operaciones fuera del baseline aprendido.' },
    { id: 'c4', text: 'Marcar al agente como requireSponsor = true para que no opere sin sponsor activo.' },
    { id: 'c5', text: 'Bloquear invocaciones desde IPs marcadas como threat actor verificado por Microsoft Threat Intelligence.' },
  ],
  targets: [
    { id: 'blueprint', label: 'Blueprint (preventiva, estática)' },
    { id: 'ca',        label: 'Conditional Access (preventiva, dinámica)' },
    { id: 'ip',        label: 'Identity Protection (detectiva, dinámica)' },
  ],
  correctMap: {
    c1: 'blueprint',
    c2: 'ca',
    c3: 'ip',
    c4: 'blueprint',
    c5: 'ca',
  },
  justification:
    'Blueprint (preventiva, estática): define qué scopes hereda el agente y restricciones operativas como requireSponsor. Conditional Access (preventiva, dinámica): condiciona la invocación según signals (risk score, location, custom attributes). Identity Protection (detectiva, dinámica): detecta comportamiento anómalo y produce risk scores que la CA lee.',
}

/* --------------------------- API pública del banco -------------------------- */

const ALL_QUESTIONS: Question[] = [
  Q_PRACT_01_1, Q_PRACT_01_3, Q_PRACT_01_5,
  Q_PRACT_02_1, Q_PRACT_02_3, Q_PRACT_02_5,
  Q_PRACT_03_1, Q_PRACT_03_2, Q_PRACT_03_5,
  Q_PRACT_04_1, Q_PRACT_04_2, Q_PRACT_04_5,
  Q_PRACT_05_1, Q_PRACT_05_2, Q_PRACT_05_5,
  Q_PRACT_06_1, Q_PRACT_06_3, Q_PRACT_06_4,
  Q_PRACT_07_1, Q_PRACT_07_2, Q_PRACT_07_5,
  Q_PRACT_08_2, Q_PRACT_08_3, Q_PRACT_08_5,
  Q_PRACT_09_1, Q_PRACT_09_5, Q_PRACT_09_6,
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
