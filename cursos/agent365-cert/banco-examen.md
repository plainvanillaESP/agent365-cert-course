---
spec_version: "1.0"
tipo: banco-examen
curso: agent365-cert
total_preguntas_objetivo: 60
total_preguntas_actuales: 41
ultima_actualizacion: 2026-05-11
---

# Banco oficial del examen final — Agent 365 IT Admin

> **Importante.** Las preguntas de este banco solo se presentan al alumno durante el examen final del curso. Nunca deben aparecer en el quiz de práctica de un módulo. Cada módulo aporta su cuota al banco según `module.yaml > preguntas_aporta_examen_final` y la suma total debe coincidir con `course.yaml > examen_final.numero_preguntas` (60).
>
> Este archivo se completa progresivamente al producir cada módulo. El validador `scripts/validate-course.py` comprueba que la distribución cuadra.

---

## Distribución por módulo

| Módulo | Preguntas que aporta | Estado |
|---|---|---|
| M01 — Fundamentos | 3 | Completo |
| M02 — Arquitectura | 3 | Completo |
| M03 — Licenciamiento | 1 | Completo |
| M04 — Roles administrativos | 1 | Completo |
| M05 — Configuración inicial | 1 | Completo |
| M06 — Entra Agent ID | 11 | Completo |
| M07 — Agent Registry | 4 | Completo |
| M08 — Ciclo de vida | 5 | Completo |
| M09 — Permisos y CA | 7 | Completo |
| M10 — Purview | 5 | Completo |
| M11 — DLP y compliance | 7 | Pendiente producción |
| M12 — Defender | 7 | Pendiente producción |
| M13 — CCS | 1 | Pendiente producción |
| M14 — Gobernanza avanzada | 2 | Pendiente producción |
| M15 — Troubleshooting | 1 | Pendiente producción |
| M16 — Costes | 1 | Pendiente producción |
| **Total** | **60** | |

---

## Área 1 — Plan and configure Microsoft Agent 365

### Módulo 01 — Fundamentos

::: pregunta
id: EX-01-001
modulo: 1
oa: OA-01.1
area: 1
tipo: multiple-choice
dificultad: facil
bloom: Comprender
enunciado: |
  Una compañía está evaluando Microsoft Agent 365 y Microsoft Copilot Studio para su estrategia de IA. ¿Cuál es la diferencia fundamental entre ambos productos?
opciones:
  - id: a
    texto: "Copilot Studio crea agentes y Agent 365 los gobierna; son productos complementarios, no alternativos."
    correcta: true
  - id: b
    texto: "Agent 365 reemplaza a Copilot Studio porque integra creación y gobernanza en una sola plataforma."
  - id: c
    texto: "Copilot Studio se usa para agentes basados en Foundry; Agent 365 se usa para agentes basados en SharePoint."
  - id: d
    texto: "Agent 365 es la versión empresarial de Copilot Studio con licencia E5."
justificacion: |
  Microsoft Agent 365 es un control plane de gobernanza, observabilidad y seguridad. No crea agentes; gobierna los que ya existen, sin importar la plataforma de origen (Copilot Studio, Foundry, M365 Agents SDK, SharePoint, etc.). Es complementario, no competidor. Ver § 1.2 «Posicionamiento: control plane, no builder».
variantes_cohorte:
  - "Cambiar Copilot Studio por Microsoft Foundry (misma respuesta)."
  - "Reformular como '¿cuándo elegir uno u otro?' exigiendo identificar casos de uso (sube de Comprender a Aplicar)."
  - "Incluir el M365 Agents SDK o el Agent 365 SDK como tercer eje y construir un drag-and-drop."
  - "Cambiar el distractor B por 'Agent 365 incluye Copilot Studio dentro de su licencia E7' (también falso, pero confunde por el bundling de E7)."
:::

::: pregunta
id: EX-01-002
modulo: 1
oa: OA-01.3
area: 1
tipo: scenario
dificultad: media
bloom: Aplicar
enunciado: |
  La directora de IT de Plain Coffee SL pregunta: «Tenemos 800 empleados con licencia M365 Copilot. Algunos usuarios crean agentes con Agent Builder y los compañeros se quejan de que no saben qué pueden hacer ni si están aprobados por IT. Además, queremos limitar el tiempo que los empleados pasan usando Copilot Chat porque vemos un descenso en la productividad colaborativa.»

  ¿Qué solución corresponde a cada problema?
opciones:
  - id: a
    texto: "Ambos problemas se resuelven con Microsoft Agent 365."
  - id: b
    texto: "Ambos problemas se resuelven con Copilot Control System (CCS)."
  - id: c
    texto: "El primer problema se resuelve con Agent 365; el segundo con CCS."
    correcta: true
  - id: d
    texto: "El primer problema se resuelve con CCS; el segundo con Agent 365."
justificacion: |
  Agent 365 gobierna a los **agentes**: el primer problema (inventariar agentes creados por usuarios, aprobarlos, hacerlos visibles) es exactamente su alcance. CCS gobierna a las **personas usando IA**: el segundo problema (uso de Copilot Chat por humanos, productividad colaborativa) corresponde a Copilot Analytics + Viva Insights, que viven en CCS. La respuesta D invierte el principio. Ver § 1.4 «Agent 365 vs Copilot Control System (CCS)».
variantes_cohorte:
  - "Cambiar 'Plain Coffee SL' por otra empresa ficticia con datos distintos (1.000 / 5.000 / 200 empleados)."
  - "Cambiar el segundo problema por 'queremos saber qué departamentos generan más mensajes con Copilot' (sigue siendo CCS)."
  - "Cambiar el primer problema por 'necesitamos auditar qué documentos están usando los agentes' (sigue siendo Agent 365, vía Purview integrado)."
  - "Reformular como tres problemas e introducir un tercero que exija combinación (p. ej. 'necesitamos saber cuánto cuestan los agentes por departamento' → A365 + CCS)."
:::

::: pregunta
id: EX-01-003
modulo: 1
oa: OA-01.2
area: 1
tipo: drag-and-drop
dificultad: media
bloom: Aplicar
enunciado: |
  Empareja cada responsabilidad operativa con el stakeholder de Microsoft Agent 365 que la asume principalmente.
items:
  - id: r1
    texto: "Aplicar políticas de Conditional Access que bloqueen agentes con riesgo high."
  - id: r2
    texto: "Crear DLP policies que traten al agent instance como user."
  - id: r3
    texto: "Aprobar requests de agentes pendientes desde el wizard de publishing."
  - id: r4
    texto: "Investigar incidentes con KQL en la tabla CloudAppEvents."
  - id: r5
    texto: "Configurar lifecycle workflows para sponsorship transfer al manager."
  - id: r6
    texto: "Aplicar templates regulatorios (EU AI Act, ISO 42001) en Compliance Manager."
targets:
  - id: m365-admin
    label: "M365 admin"
  - id: entra-admin
    label: "Entra admin"
  - id: purview-admin
    label: "Purview admin"
  - id: defender-admin
    label: "Defender admin"
correct_map:
  r1: entra-admin
  r2: purview-admin
  r3: m365-admin
  r4: defender-admin
  r5: entra-admin
  r6: purview-admin
justificacion: |
  El examen verifica que el alumno entiende qué admin center ejecuta cada acción operativa de gobernanza de agentes. CA y lifecycle workflows viven en Microsoft Entra (Entra Agent ID). DLP y Compliance Manager viven en Microsoft Purview. El wizard de publishing y la aprobación de requests viven en Microsoft 365 admin center. KQL hunting vive en Microsoft Defender XDR. Ver § 1.3 «Los cuatro stakeholders core».
variantes_cohorte:
  - "Aumentar a 8 responsabilidades incluyendo: 'Configurar el Microsoft 365 connector' (Defender), 'Habilitar DSPM for AI' (Purview), 'Pin un agente al slot Administrator' (M365 admin)."
  - "Cambiar al formato multiple-response: '¿cuáles de estas responsabilidades viven en Microsoft Entra?'."
  - "Añadir el quinto stakeholder 'Power Platform admin' con responsabilidades de Copilot Studio governance."
  - "Convertir a ordering: 'ordena las acciones por el orden cronológico de un proceso de aprobación de un agente nuevo'."
:::

### Módulo 02 — Arquitectura y componentes

::: pregunta
id: EX-02-001
modulo: 2
oa: OA-02.1
area: 1
tipo: drag-and-drop
dificultad: media
bloom: Aplicar
enunciado: |
  Empareja cada componente arquitectónico de Microsoft Agent 365 con el admin center donde un administrador lo gestiona principalmente.
items:
  - id: c1
    texto: "Agent Registry y Agent Map."
  - id: c2
    texto: "Conditional Access para agentes con grant Block."
  - id: c3
    texto: "DSPM for AI y Compliance Manager."
  - id: c4
    texto: "Tabla CloudAppEvents para hunting con KQL."
  - id: c5
    texto: "Lifecycle workflows con sponsorship transfer al manager."
  - id: c6
    texto: "Wizard de publishing y aprobación de requests."
targets:
  - id: m365-admin
    label: "Microsoft 365 admin center"
  - id: entra-admin
    label: "Microsoft Entra admin center"
  - id: purview-admin
    label: "Microsoft Purview portal"
  - id: defender-admin
    label: "Microsoft Defender XDR"
correct_map:
  c1: m365-admin
  c2: entra-admin
  c3: purview-admin
  c4: defender-admin
  c5: entra-admin
  c6: m365-admin
justificacion: |
  La arquitectura de Agent 365 reparte la gobernanza en cuatro admin centers. Registry, Map y wizard de publishing viven en M365 admin center. Conditional Access y lifecycle workflows viven en Entra (dependen de la identidad). DSPM y Compliance Manager viven en Purview. KQL hunting vive en Defender. Saber a qué admin center ir es la primera competencia operativa del curso.
variantes_cohorte:
  - "Aumentar a 8 componentes incluyendo: 'Risks column en la página de detalle' (M365 admin con visibilidad heredada de Defender), 'AI Agent Inventory' (Defender), 'sensitivity labels para .agent files' (Purview)."
  - "Convertir a multiple-response: '¿cuáles de estos componentes viven en Microsoft Entra?'."
  - "Reformular como ordenamiento: ordenar las acciones del proceso de aprobación de un agente nuevo según el admin center donde ocurren."
:::

::: pregunta
id: EX-02-002
modulo: 2
oa: OA-02.2
area: 1
tipo: multiple-choice
dificultad: media
bloom: Analizar
enunciado: |
  Un desarrollador comenta que su equipo va a desplegar varios «agentes Microsoft Agents Toolkit» en el tenant. Una arquitecta IT pregunta cómo aparecerán esos agentes en el Agent Registry de Microsoft 365 admin center. ¿Cuál es la respuesta correcta?
opciones:
  - id: a
    texto: "Aparecerán como tipo «Agent Toolkit», una novena categoría además de los 8 tipos estándar."
  - id: b
    texto: "No aparecerán en el Registry hasta que se conviertan a Agent Builder."
  - id: c
    texto: "Aparecerán como uno de los 8 tipos estándar (típicamente MCS CEA o Foundry) según cómo se haya configurado el deploy; Agent Toolkit es la herramienta de desarrollo, no un tipo de registro."
    correcta: true
  - id: d
    texto: "Aparecerán como tipo «SharePoint agent» porque Toolkit despliega los agentes a una librería SharePoint."
justificacion: |
  El Microsoft 365 Agents Toolkit es una extensión de Visual Studio Code para construir agentes pro-code conversacionales. No es un tipo de agente: el agente que produce se registra como uno de los 8 tipos estándar (típicamente MCS CEA o Foundry) según el target del deploy. La opción A confunde herramienta con tipo. La B es inventada. La D mezcla SharePoint agents (.agent files en una librería) con el Toolkit (un IDE plugin).
variantes_cohorte:
  - "Cambiar el sujeto a 'Agent Builder' o a 'SharePoint agent' y preguntar por sus implicaciones de gobernanza diferenciales."
  - "Pedir identificar qué columna del Registry distingue mejor entre los 8 tipos (columna 'Type') frente a la columna 'Publisher'."
  - "Convertir a multiple-response: '¿cuáles de estos NO son tipos de agente del Registry?' incluyendo Agent Toolkit, blueprint, sponsor, agent identity como distractores."
:::

::: pregunta
id: EX-02-003
modulo: 2
oa: OA-02.1
area: 1
tipo: multiple-choice
dificultad: facil
bloom: Comprender
enunciado: |
  Un partner tecnológico presenta un agente y dice que «usa el Microsoft Agents SDK para gobernarlo». ¿Qué debería responder un administrador IT con criterio?
opciones:
  - id: a
    texto: "«Perfecto, entonces ya está cubierto por Agent 365.»"
  - id: b
    texto: "«Esa frase es ambigua: hay dos SDKs distintos. El Microsoft 365 Agents SDK es transporte conversacional; el Microsoft Agent 365 SDK es el que gobierna. Necesito saber cuál de los dos.»"
    correcta: true
  - id: c
    texto: "«El Microsoft Agents SDK no existe; está confundiendo nombres de productos.»"
  - id: d
    texto: "«Da igual cuál de los dos, porque ambos hacen lo mismo desde la unificación de SDKs en mayo de 2026.»"
justificacion: |
  La confusión entre los dos SDKs es uno de los errores más comunes en conversaciones con desarrolladores y partners. Microsoft 365 Agents SDK (paquete @microsoft/agents) cubre el transporte conversacional. Microsoft Agent 365 SDK (paquete @microsoft/agent365) cubre la gobernanza: identidad Entra, telemetría OpenTelemetry, acceso a Work IQ MCP. Solo el segundo «gobierna». La opción A acepta una afirmación ambigua. La C niega una realidad. La D inventa una unificación que no ha ocurrido.
variantes_cohorte:
  - "Reformular como escenario con código: presentar dos snippets `npm install @microsoft/agents` y `npm install @microsoft/agent365` y pedir identificar qué cubre cada uno."
  - "Convertir a drag-and-drop: emparejar capacidades (transporte conversacional, identidad Entra, telemetría OpenTelemetry, acceso MCP, multi-canal) con el SDK que las aporta."
  - "Cambiar el contexto a una RFP de partner donde el cliente tiene que pedir aclaración."
:::

### Módulo 03 — Licenciamiento, prerrequisitos y planificación

::: pregunta
id: EX-03-001
modulo: 3
oa: OA-03.1
area: 1
tipo: multiple-choice
dificultad: media
bloom: Evaluar
enunciado: |
  Una empresa de 4.000 empleados con Microsoft 365 E5 corporativo tiene actualmente Copilot desplegado en el 35 % de su plantilla (1.400 licencias) y planea desplegar Microsoft Agent 365 a esos mismos 1.400 usuarios. La adopción de Copilot lleva 6 meses creciendo al 5 % mensual y la dirección no quiere cambiar la dinámica. ¿Cuál es la recomendación de licenciamiento más adecuada?
opciones:
  - id: a
    texto: "Migrar toda la plantilla a Microsoft 365 E7 ($99 × 4.000 = $396.000/mes) para tener gobernanza completa con Risks column desde el inicio."
  - id: b
    texto: "Mantener E5 como base, comprar 1.400 licencias Agent 365 standalone ($15) y mantener Copilot solo en los usuarios que ya lo tienen, revisando la decisión cuando la adopción Copilot supere el 60 %."
    correcta: true
  - id: c
    texto: "Comprar Agent 365 E7 únicamente para los 1.400 usuarios con Copilot y dejar al resto sin Agent 365."
  - id: d
    texto: "Contratar Frontier preview con 25 licencias gratuitas y desplegar Agent 365 solo a esos 25 usuarios mientras se evalúa la decisión."
justificacion: |
  La decisión standalone vs E7 depende del peso de Copilot, no de Agent 365. Con un 35 % de adopción Copilot creciendo al 5 % mensual, la organización está aún por debajo del break-even típico (60-70 %). E5 + Agent 365 standalone para los 1.400 usuarios que invocan agentes ($57 + $15 = $72 × 1.400 + Copilot ya pagado) es significativamente más barato que migrar los 4.000 a E7. La opción A sobrepaga ~$120.000/mes en E5 base que ya tienen y E7 a usuarios que no usan Copilot. La C mezcla SKUs sin justificación operativa (Agent 365 E7 no es un SKU; E7 es bundle completo). La D malentiende Frontier preview: es para validar capacidades nuevas, no para producción a 1.400 usuarios.
variantes_cohorte:
  - "Cambiar la adopción Copilot al 75 % y reformular: ahora E7 es probablemente más eficiente."
  - "Añadir un cuarto distractor con Office 365 E5 + Copilot + Agent 365 standalone para forzar comparación con tres líneas de billing."
  - "Convertir a escenario abierto pidiendo cálculo numérico mensual exacto."
:::

### Módulo 04 — Roles administrativos y delegación

::: pregunta
id: EX-04-001
modulo: 4
oa: OA-04.1
area: 1
tipo: multiple-choice
dificultad: media
bloom: Aplicar
enunciado: |
  Un analista de seguridad necesita revisar diariamente las alertas que Microsoft Defender XDR genera sobre agentes en el Agent Registry, correlacionarlas con la información del propio Registry y, cuando una alerta lo justifique, abrir un ticket al equipo de M365 admin. NO debe poder modificar políticas de Defender ni aprobar o bloquear agentes. ¿Qué combinación de roles aplica el principio de least-privilege correctamente?
opciones:
  - id: a
    texto: "Global Administrator. Es el más simple y cubre todo lo que necesita."
  - id: b
    texto: "Security Administrator + AI Administrator, para tener escritura en seguridad y en agentes."
  - id: c
    texto: "Security Operator + AI Reader, que permite investigar alertas en Defender y ver el Registry sin modificarlo."
    correcta: true
  - id: d
    texto: "Security Reader, suficiente porque solo necesita leer."
justificacion: |
  Least-privilege exige asignar el mínimo rol que permite hacer la tarea. Security Operator permite investigar alertas y responder a incidentes en Defender (la tarea principal) sin escritura en políticas. AI Reader permite ver el Registry para correlacionar pero no modificar agentes. La combinación cubre exactamente las necesidades sin excederse. La opción A (Global Administrator) es el antipatrón clásico: sobreasigna privilegio. La B (Security Administrator + AI Administrator) da escritura donde la tarea solo requiere lectura/operación. La D (Security Reader) es insuficiente: el Reader no permite responder a incidentes, solo verlos.
variantes_cohorte:
  - "Cambiar el escenario: ahora también debe poder bloquear un agente si la alerta lo justifica → la respuesta correcta cambia a Security Operator + AI Administrator."
  - "Convertir a drag-and-drop: emparejar 5 perfiles distintos con su combinación least-privilege."
  - "Añadir contexto de PIM: ahora la asignación es just-in-time con elegibilidad."
:::

### Módulo 05 — Configuración inicial del tenant

::: pregunta
id: EX-05-001
modulo: 5
oa: OA-05.2
area: 1
tipo: drag-and-drop
dificultad: media
bloom: Aplicar
enunciado: |
  Ordena los siguientes pasos en la secuencia correcta para activar Microsoft Agent 365 desde cero en un tenant productivo. La posición 1 es lo que se hace antes de tocar ningún admin center; la posición 6 es lo que confirma que todo está operativo.
items:
  - id: s1
    texto: "Configurar el conector Microsoft 365 en Defender for Cloud Apps."
  - id: s2
    texto: "Verificar prerrequisitos: licencias asignadas, audit logs habilitados, rol Global Administrator o AI Administrator."
  - id: s3
    texto: "Activar Data Security Posture Management (DSPM) for AI en Microsoft Purview."
  - id: s4
    texto: "Aceptar Terms of Service la primera vez que se navega a M365 admin → Agents."
  - id: s5
    texto: "Lanzar un agente de prueba y verificar que aparece en los tres admin centers."
  - id: s6
    texto: "Activar el toggle Copilot Frontier en M365 admin → Copilot → Settings → User access (si aplica)."
targets:
  - id: p1
    label: "Posición 1 — Antes de tocar admin centers"
  - id: p2
    label: "Posición 2"
  - id: p3
    label: "Posición 3 — Entrada al Agent workload"
  - id: p4
    label: "Posición 4"
  - id: p5
    label: "Posición 5"
  - id: p6
    label: "Posición 6 — Confirmación final"
correct_map:
  s2: p1
  s6: p2
  s4: p3
  s1: p4
  s3: p5
  s5: p6
justificacion: |
  La activación tiene un orden estricto basado en dependencias. Sin verificar prerrequisitos los siguientes pasos pueden fallar silenciosamente. Frontier toggle activa el modo preview (si la organización lo va a usar) y debe ser anterior a Terms of Service. Los Terms of Service son la puerta de entrada al workload: sin aceptarlos no se puede entrar al Overview ni configurar nada. Los conectores de Defender y Purview son dos pasos independientes entre sí pero ambos requieren que el workload esté activo, por lo que van después de Terms of Service. La validación end-to-end es siempre el último paso: confirma que todo lo anterior funciona en cadena. Saltar el orden no rompe el sistema de inmediato pero deja huecos que aparecen como errores días después.
variantes_cohorte:
  - "Aumentar a 8 pasos incluyendo: 'crear el primer template Custom para publishing' y 'configurar el primer blueprint Entra para sponsorship'."
  - "Convertir a multiple-choice con cuatro secuencias propuestas y pedir identificar la única correcta."
  - "Cambiar la pregunta a un escenario de troubleshooting: el admin se ha saltado un paso y aparece un error específico → identificar el paso saltado."
:::

## Área 2 — Manage agent identity, sponsorship and lifecycle

### Módulo 06 — Microsoft Entra Agent ID

::: pregunta
id: EX-06-001
modulo: 6
oa: OA-06.1
area: 2
tipo: multiple-choice
dificultad: facil
bloom: Recordar
enunciado: |
  ¿Cuál de los siguientes objetos de Microsoft Entra Agent ID actúa como plantilla que define permisos heredables, restricciones y metadatos sin autenticar nada por sí solo?
opciones:
  - id: a
    texto: "Agent identity"
  - id: b
    texto: "Agent identity blueprint"
    correcta: true
  - id: c
    texto: "Agent identity blueprint principal"
  - id: d
    texto: "Agent user"
justificacion: |
  El agent identity blueprint es la plantilla. Define el catálogo de permisos heredables, restricciones (allowedAuthenticationFlows, maxAgentIdentities, tenantOnly), metadatos y políticas de lifecycle, pero no autentica nada por sí solo. Las agent identities son las instancias que sí autentican y heredan del blueprint. El blueprint principal es el service principal asociado al blueprint para admin consents. El agent user es una propiedad opcional de las agent identities autonomous.
:::

::: pregunta
id: EX-06-002
modulo: 6
oa: OA-06.1
area: 2
tipo: multiple-choice
dificultad: media
bloom: Analizar
enunciado: |
  En Microsoft Teams, un usuario ve que «Agent-RRHH-FAQ» aparece en la lista de personas con foto, presencia online, y un mailbox al que pueden enviarle email. ¿Qué tipo de objeto representa esto en Microsoft Entra Agent ID?
opciones:
  - id: a
    texto: "Agent identity blueprint"
  - id: b
    texto: "Agent identity blueprint principal"
  - id: c
    texto: "Agent identity (sin propiedad agent user)"
  - id: d
    texto: "Agent user"
    correcta: true
justificacion: |
  La presencia humana-like en Teams (foto, presence, mailbox propio, aparición en organigrama) es lo que distingue a un agent user del resto de objetos. Es una propiedad opcional (userType: AgentUser) que se aplica a una agent identity para hacerla visible como si fuera un colaborador más. Los blueprints y blueprint principals no tienen presencia visible. Una agent identity sin la propiedad agent user sí autentica y opera, pero no aparece en Teams como una persona.
:::

::: pregunta
id: EX-06-003
modulo: 6
oa: OA-06.1
area: 2
tipo: drag-and-drop
dificultad: media
bloom: Analizar
enunciado: |
  Empareja cada capacidad con el tipo de objeto al que pertenece en Microsoft Entra Agent ID.
items:
  - id: c1
    texto: "Define los scopes de Microsoft Graph que las identities heredan."
  - id: c2
    texto: "Tiene un mailbox propio y aparece en organigrama."
  - id: c3
    texto: "Es la instancia que autentica contra Microsoft Graph."
  - id: c4
    texto: "Es el service principal vinculado al blueprint para admin consents."
  - id: c5
    texto: "Tiene custom security attributes asignados individualmente."
  - id: c6
    texto: "Define el límite duro de 10 resource apps × 40 scopes."
targets:
  - id: blueprint
    label: "Agent identity blueprint"
  - id: principal
    label: "Agent identity blueprint principal"
  - id: identity
    label: "Agent identity"
  - id: user
    label: "Agent user"
correct_map:
  c1: blueprint
  c2: user
  c3: identity
  c4: principal
  c5: identity
  c6: blueprint
justificacion: |
  Los scopes y restricciones se definen en el blueprint y se heredan. La instancia (agent identity) es lo que autentica y donde se asignan custom security attributes individualmente. El agent user es una propiedad opcional de la identity con presencia humana-like. El blueprint principal existe para que el blueprint pueda recibir admin consents.
:::

::: pregunta
id: EX-06-004
modulo: 6
oa: OA-06.4
area: 2
tipo: scenario
dificultad: media
bloom: Aplicar
enunciado: |
  Una organización quiere desplegar un agente que monitorice 24/7 un buzón compartido (compliance@contoso.com) y publique en un canal de Teams cualquier mensaje que mencione palabras de la lista de cumplimiento normativo. NO hay usuario humano que invoque al agente. ¿Qué flujo de autenticación aplica y qué requisito de licenciamiento implica?
opciones:
  - id: a
    texto: "OBO. Cualquier licencia Agent 365 cubre el caso."
  - id: b
    texto: "OBO. Requiere Microsoft 365 E7 obligatoriamente."
  - id: c
    texto: "Own identity. Disponible en GA con cualquier licencia Agent 365."
  - id: d
    texto: "Own identity. Solo disponible en Frontier preview en mayo de 2026."
    correcta: true
justificacion: |
  El caso describe un agente autonomous (sin usuario humano que invoque). Esto requiere el flujo own identity con un access token obtenido vía client_credentials y permisos propios definidos en el blueprint. Los agentes own identity siguen en Frontier preview en mayo de 2026: no son GA todavía. Para desplegarlos a escala, la organización debe inscribirse en el programa Frontier preview.
:::

::: pregunta
id: EX-06-005
modulo: 6
oa: OA-06.5
area: 2
tipo: multiple-choice
dificultad: media
bloom: Aplicar
enunciado: |
  ¿Qué llamada a Microsoft Graph permite listar los agentes con riesgo detectado por Microsoft Entra Identity Protection?
opciones:
  - id: a
    texto: "GET https://graph.microsoft.com/beta/agentRegistry/agents?$filter=riskState eq 'high'"
  - id: b
    texto: "GET https://graph.microsoft.com/beta/identityProtection/riskyAgents"
    correcta: true
  - id: c
    texto: "GET https://graph.microsoft.com/v1.0/auditLogs/agentRiskDetections"
  - id: d
    texto: "GET https://graph.microsoft.com/beta/copilot/admin/agents/risks"
justificacion: |
  El endpoint correcto es /beta/identityProtection/riskyAgents, paralelo al /identityProtection/riskyUsers para usuarios. Devuelve los agentes con riskLevel y riskState calculado por Identity Protection. La opción A usa la ruta legacy del agent registry (que se retira con la convergencia de mayo de 2026) y un filter no soportado.
:::

::: pregunta
id: EX-06-006
modulo: 6
oa: OA-06.2
area: 2
tipo: scenario
dificultad: dificil
bloom: Aplicar
enunciado: |
  Un desarrollador intenta crear un blueprint para agentes Foundry pero la CLI devuelve error «Too many scopes for resourceAppId 00000003-0000-0000-c000-000000000000». El blueprint declara 45 scopes para Microsoft Graph. ¿Cuál es la causa y cómo se corrige?
opciones:
  - id: a
    texto: "Microsoft Graph no soporta más de 30 scopes en blueprints Agent 365. Hay que reducir a 30."
  - id: b
    texto: "El límite duro de Microsoft Entra Agent ID es de 40 scopes por resource app. El blueprint debe partirse o reducir scopes."
    correcta: true
  - id: c
    texto: "El error es transitorio: reintentar tras 10 minutos."
  - id: d
    texto: "El blueprint tiene un campo inheritablePermissions mal formado: hay que validar el JSON con `a365 lint blueprint`."
justificacion: |
  Microsoft Entra Agent ID impone un límite duro de 10 resource apps × 40 scopes por blueprint. Es una restricción intencional para evitar blueprints monolíticos imposibles de auditar. 45 scopes para un mismo resourceAppId excede el límite, y la solución correcta es partir el blueprint en dos o reducir el alcance si los scopes incluyen permisos no necesarios.
:::

::: pregunta
id: EX-06-007
modulo: 6
oa: OA-06.3
area: 2
tipo: scenario
dificultad: dificil
bloom: Aplicar
enunciado: |
  Un usuario sponsor de una agent identity es deshabilitado (accountEnabled = false) en Microsoft Entra. El blueprint asociado tiene transferOnLeaver = true y existe un lifecycle workflow para el trigger onSponsorLeaver con tasks por defecto. ¿Cuál es el comportamiento esperado?
opciones:
  - id: a
    texto: "La agent identity se elimina automáticamente del directorio."
  - id: b
    texto: "El sponsorship se transfiere al manager del usuario, se notifica por email al manager y la agent identity queda marcada con requireReview = true."
    correcta: true
  - id: c
    texto: "La agent identity continúa funcionando sin cambios; solo el audit log registra el evento."
  - id: d
    texto: "La agent identity se deshabilita inmediatamente y el manager debe re-habilitarla manualmente."
justificacion: |
  Con el lifecycle workflow onSponsorLeaver configurado y transferOnLeaver = true en la identity, el comportamiento por defecto es: (1) notifyManager envía email al manager indicando la transferencia, (2) transferAgentSponsorship reasigna sponsorship al manager, (3) markRequireReview marca la identity con requireReview = true y fecha objetivo de 30 días. La identity sigue activa durante esos 30 días para no interrumpir operaciones.
:::

::: pregunta
id: EX-06-008
modulo: 6
oa: OA-06.2
area: 2
tipo: multiple-choice
dificultad: dificil
bloom: Crear
enunciado: |
  Una entidad financiera necesita desplegar agentes Foundry para 4 áreas distintas (Análisis de Crédito, Investigación de Fraude, Reporting Regulatorio, Tesorería), cada una con su responsable de área como sponsor. Los agentes deben acceder solo a datos de su área, deben tener requireSponsor = true y deben llevar custom security attributes para auditoría externa. ¿Cuál es el diseño de blueprints más apropiado?
opciones:
  - id: a
    texto: "Un único blueprint global bp-finanzas-master con todos los scopes para las 4 áreas y custom security attributes que distinguen Department por instance."
  - id: b
    texto: "Cuatro blueprints separados (bp-finanzas-credito, bp-finanzas-fraude, bp-finanzas-reporting, bp-finanzas-tesoreria) cada uno con requireSponsor = true, scopes específicos del área y custom security attributes propios."
    correcta: true
  - id: c
    texto: "Un blueprint por sponsor (4 blueprints), independientemente del área de negocio."
  - id: d
    texto: "No usar blueprints; crear las agent identities directamente sin plantilla."
justificacion: |
  Separation of duties y principio de least-privilege exigen blueprints separados por área de negocio, no por sponsor (los sponsors pueden cambiar; las áreas tienen scopes y compliance distintos). Cada blueprint declara los scopes mínimos para su área, requireSponsor = true para forzar asignación de sponsor antes de operar, y custom security attributes específicos para que la auditoría externa pueda filtrar agentes por área.
:::

::: pregunta
id: EX-06-009
modulo: 6
oa: OA-06.6
area: 2
tipo: multiple-choice
dificultad: media
bloom: Recordar
enunciado: |
  ¿Cuál de las siguientes capacidades NO está incluida en un agent identity blueprint, sino que es una propiedad de cada agent identity individual?
opciones:
  - id: a
    texto: "Inheritable permissions (lista de scopes Graph)."
  - id: b
    texto: "Restrictions (allowedAuthenticationFlows, maxAgentIdentities, tenantOnly)."
  - id: c
    texto: "Custom security attributes asignados a la instance concreta."
    correcta: true
  - id: d
    texto: "Lifecycle metadata (expirationPolicy, auditLevel)."
justificacion: |
  Los custom security attributes son propiedades de cada agent identity individual, no del blueprint. Aunque el blueprint puede definir un conjunto de attributes por defecto, cada identity puede sobrescribir o añadir sus propios attributes (Department, ConfidentialityLevel, BusinessOwner, AgentPurpose). Las opciones A, B y D son propiedades del blueprint.
:::

::: pregunta
id: EX-06-010
modulo: 6
oa: OA-06.3
area: 2
tipo: multiple-choice
dificultad: media
bloom: Aplicar
enunciado: |
  ¿Qué trigger de lifecycle workflow se ejecuta cuando un usuario sponsor cambia de manager o de departamento, sin dejar la organización?
opciones:
  - id: a
    texto: "onSponsorJoiner"
  - id: b
    texto: "onSponsorMover"
    correcta: true
  - id: c
    texto: "onSponsorLeaver"
  - id: d
    texto: "onAgentInactivity"
justificacion: |
  onSponsorMover es el trigger que se ejecuta cuando un usuario sponsor cambia de manager, departamento o atributos clave que afectan a la lógica de sponsorship, sin dejar la organización. La task típica asociada es revisar si el agente sigue siendo apropiado para la nueva área del sponsor. onSponsorJoiner se ejecuta cuando un usuario es asignado por primera vez como sponsor. onSponsorLeaver se ejecuta cuando el sponsor deja la organización. onAgentInactivity se ejecuta cuando una agent identity no se usa durante un periodo configurable.
:::

::: pregunta
id: EX-06-011
modulo: 6
oa: OA-06.7
area: 2
tipo: multiple-choice
dificultad: dificil
bloom: Recordar
enunciado: |
  Tras la convergencia M365 admin center ↔ Entra del 1 de mayo de 2026, las APIs antiguas /beta/agentRegistry/* quedan deprecated. ¿Cuál es el comportamiento exacto durante la ventana de retrocompatibilidad y cuándo dejan de funcionar definitivamente?
opciones:
  - id: a
    texto: "Las APIs antiguas dejan de funcionar inmediatamente el 1 de mayo de 2026 con 404 Not Found."
  - id: b
    texto: "Las APIs antiguas siguen funcionando indefinidamente; la nueva ruta /beta/copilot/admin/* es solo opcional."
  - id: c
    texto: "Las APIs antiguas redireccionan a las nuevas con HTTP 301 hasta noviembre de 2026; a partir de esa fecha devuelven 410 Gone."
    correcta: true
  - id: d
    texto: "Las APIs antiguas devuelven warnings en el header pero siguen funcionando. Sin fecha de fin anunciada."
justificacion: |
  La convergencia del 1 de mayo de 2026 inicia una ventana de retrocompatibilidad y soporte hasta noviembre de 2026. Durante ese periodo, las APIs /beta/agentRegistry/* redireccionan automáticamente a las nuevas /beta/copilot/admin/* con respuestas funcionales pero con Deprecation headers en cada respuesta. A partir de noviembre de 2026 devuelven 410 Gone y los clientes deben usar las nuevas rutas obligatoriamente.
:::

## Área 3 — Discover, manage and govern agents day to day

### Módulo 07 — Agent Registry y Agent Map

::: pregunta
id: EX-07-001
modulo: 7
oa: OA-07.3
area: 3
tipo: multiple-choice
dificultad: facil
bloom: Recordar
enunciado: |
  ¿En qué pantalla del Microsoft 365 admin center aparece destacada la lista de agentes sin owner asignado (ownerless agents)?
opciones:
  - id: a
    texto: "Agents → Registry, en la columna Risks."
  - id: b
    texto: "Agents → Map, como nodos sin etiqueta."
  - id: c
    texto: "Agents → Overview, en la sección Top actions for you dentro de la categoría «Ownerless agents»."
    correcta: true
  - id: d
    texto: "Agents → Settings, como advertencias de configuración."
justificacion: |
  La página Overview agrupa cuatro categorías de Top actions for you: Pending requests, Agents at risk, Ownerless agents y With exceptions. Es el centro de mando diario del IT admin. La A confunde Ownerless con Risks (son métricas distintas). La B es falsa: el Map muestra agentes pero no destaca específicamente los ownerless. La D es falsa: Settings es para configuración del workload, no para alertas operativas.
:::

::: pregunta
id: EX-07-002
modulo: 7
oa: OA-07.1
area: 3
tipo: scenario
dificultad: media
bloom: Aplicar
enunciado: |
  El CISO te pregunta: «¿Cuántos agentes de Third Party activos tenemos en producción que estén usando Copilot Studio y, además, tengan algún risk score Medium o superior?». ¿Qué combinación de filtros aplicas en el Registry para responder?
opciones:
  - id: a
    texto: "Filtrar por Publisher = Microsoft + Platform = Copilot Studio + Risk = Medium, High, Critical."
  - id: b
    texto: "Filtrar por Publisher = Third Party + Platform = Copilot Studio + Status = Active + Risk = Medium, High, Critical."
    correcta: true
  - id: c
    texto: "Filtrar solo por Risk = High, Critical y descartar los que no sean de Third Party manualmente."
  - id: d
    texto: "No es posible: los filtros del Registry son mutuamente excluyentes y no se pueden combinar."
justificacion: |
  Los filtros del Registry son acumulativos (AND entre filtros distintos, OR dentro del mismo filtro). La respuesta requiere combinar cuatro filtros: Publisher = Third Party (no Microsoft), Platform = Copilot Studio, Status = Active (en producción), y Risk con tres valores marcados (Medium, High, Critical). La A confunde Microsoft con Third Party. La C ignora los filtros disponibles. La D es falsa: los filtros se combinan.
:::

::: pregunta
id: EX-07-003
modulo: 7
oa: OA-07.3
area: 3
tipo: multiple-choice
dificultad: media
bloom: Recordar
enunciado: |
  ¿Cuáles son los requisitos para que aparezca poblada la Risks column en el Registry y en la vista de detalle de cada agente?
opciones:
  - id: a
    texto: "Cualquier licencia M365 E3 o superior basta para que la Risks column aparezca poblada."
  - id: b
    texto: "Licencia E7 (o equivalente con módulo de Risk) + conector Microsoft 365 configurado en Defender XDR + DSPM for AI activo en Microsoft Purview."
    correcta: true
  - id: c
    texto: "Licencia Agent 365 standalone con DSPM activo; Defender no es necesario."
  - id: d
    texto: "Solo se necesita Identity Protection P2 en Microsoft Entra ID."
justificacion: |
  La Risks column requiere E7 (o equivalente) y que la cadena de conectores funcione: Defender XDR conectado a M365 (sin él no llega telemetría de seguridad) y DSPM for AI activo en Purview (aporta señales adicionales sobre acceso a datos sensibles). Sin uno de los tres, la columna aparece vacía o incompleta.
:::

::: pregunta
id: EX-07-004
modulo: 7
oa: OA-07.5
area: 3
tipo: scenario
dificultad: media
bloom: Analizar
enunciado: |
  Abres el Agent Map de tu tenant y observas que el agente Foundry-Finanzas-HUB tiene 6 conexiones entrantes desde otros agentes (Reportes, Análisis, Forecast, Audit, Compliance y Risk). El resto de agentes del cluster Foundry tienen 0 conexiones entrantes. ¿Qué te dice esta información sobre la arquitectura?
opciones:
  - id: a
    texto: "Hay un problema: los 6 agentes con 0 conexiones entrantes están huérfanos y deberían eliminarse."
  - id: b
    texto: "Foundry-Finanzas-HUB es un agente hub del que dependen 6 workflows. Es un punto crítico de fallo: si se rompe, los 6 dependientes dejarán de funcionar."
    correcta: true
  - id: c
    texto: "Hay un ciclo en el grafo: el grafo es inválido y necesita refactor inmediato."
  - id: d
    texto: "Los 6 agentes con 0 entrantes son los que reciben más uso; el HUB es solo telemetría."
justificacion: |
  La dirección de las flechas en el Agent Map representa invocación: A → B significa que A invoca a B. Si HUB tiene 6 conexiones entrantes, hay 6 agentes que lo invocan en algún punto de su lógica. Esto lo convierte en un agente hub: punto único de paso por el que circulan varios workflows. Si HUB falla, los 6 dependientes fallan. La A confunde dirección de flecha con orfandad. La C es falsa: 6 entrantes a 1 nodo NO es un ciclo. La D invierte el significado de la flecha.
:::

### Módulo 08 — Ciclo de vida del agente

::: pregunta
id: EX-08-001
modulo: 8
oa: OA-08.6
area: 3
tipo: drag-and-drop
dificultad: media
bloom: Aplicar
enunciado: |
  Ordena las siguientes acciones del ciclo de vida de un agente desde la idea hasta la retirada definitiva. La posición 1 es la primera acción que se ejecuta; la posición 6 es la última.
items:
  - id: a1
    texto: "Delete (eliminación irreversible)."
  - id: a2
    texto: "Activate (aprobar y dejar activo en el catálogo)."
  - id: a3
    texto: "Publish (enviar a publish desde la plataforma de creación)."
  - id: a4
    texto: "Deploy (distribuir a los usuarios destinatarios)."
  - id: a5
    texto: "Pin (fijar al slot Administrator para visibilidad alta)."
  - id: a6
    texto: "Remove (retirar del despliegue antes del Delete final)."
targets:
  - id: p1
    label: "Posición 1 — Primera acción"
  - id: p2
    label: "Posición 2"
  - id: p3
    label: "Posición 3"
  - id: p4
    label: "Posición 4"
  - id: p5
    label: "Posición 5"
  - id: p6
    label: "Posición 6 — Última acción"
correct_map:
  a3: p1
  a2: p2
  a4: p3
  a5: p4
  a6: p5
  a1: p6
justificacion: |
  El ciclo es: Publish (developer envía) → Activate (admin aprueba) → Deploy (distribuir a usuarios) → Pin (visibilidad alta) → Remove (retirar del despliegue, reversible) → Delete (irreversible). Saltarse Remove e ir directo a Delete es legal pero un antipatrón: mejor hacer Remove, esperar 1-2 semanas y solo entonces Delete.
:::

::: pregunta
id: EX-08-002
modulo: 8
oa: OA-08.4
area: 3
tipo: multiple-choice
dificultad: media
bloom: Recordar
enunciado: |
  Tu equipo te pregunta si pueden recuperar un agente que acabas de eliminar (Delete) hace 2 horas. ¿Qué les respondes?
opciones:
  - id: a
    texto: "No, Delete es irreversible inmediatamente; el agente ya no existe en el directorio."
  - id: b
    texto: "Sí, durante las primeras 24 horas un Global Administrator puede ejecutar Restore-Agent365Agent -Id <agent-id> para cancelar la eliminación. Pasadas las 24 h el SharePoint Embedded container se borrará y la operación devolverá 404 Not Found."
    correcta: true
  - id: c
    texto: "Sí, pero solo si el agente tenía requireReview: true; en ese caso se puede restaurar en cualquier momento dentro del período de review."
  - id: d
    texto: "Sí, los agentes Delete pasan a una papelera de Entra que los conserva 30 días, igual que los usuarios deshabilitados."
justificacion: |
  Delete tiene una ventana de 24 horas durante la cual un Global Administrator puede ejecutar Restore-Agent365Agent. Tras las 24 h, el SharePoint Embedded container se marca para borrarse físicamente. La A es falsa: durante las 24 h sí hay rescate. La C confunde flags de M06 con la ventana de Delete. La D es falsa: no existe papelera equivalente para agentes.
:::

::: pregunta
id: EX-08-003
modulo: 8
oa: OA-08.5
area: 3
tipo: multiple-choice
dificultad: media
bloom: Recordar
enunciado: |
  La acción Reassign Ownership desde el M365 admin center está disponible para…
opciones:
  - id: a
    texto: "Cualquier agente del Registry independientemente de su plataforma origen."
  - id: b
    texto: "Solo agentes creados con Agent Builder. Para Copilot Studio se reasigna desde Power Platform admin center y para Foundry desde Azure portal."
    correcta: true
  - id: c
    texto: "Solo agentes con transferOnLeaver: true en su sponsor configuration."
  - id: d
    texto: "Solo agentes que están en estado Pending approval; una vez activos, la propiedad es inmutable."
justificacion: |
  Una de las limitaciones más confundidas del módulo. Reassign Ownership desde M365 admin center solo aplica a agentes Agent Builder. Los agentes Copilot Studio se reasignan desde Power Platform admin center → Environments → Apps. Los Foundry desde Azure portal → AI Foundry resource → Access control (IAM). La A es falsa por esa limitación. La C confunde sponsor con ownership técnico. La D es falsa.
:::

::: pregunta
id: EX-08-004
modulo: 8
oa: OA-08.2
area: 3
tipo: scenario
dificultad: dificil
bloom: Aplicar
enunciado: |
  El equipo de Compliance te pide aplicar 6 restricciones específicas (sharing externo bloqueado, cross-site SharePoint bloqueado, sensitivity Confidential mínimo, DLP Block on Confidential, CA con MFA + dispositivo compliant, logging verbose) a TODOS los agentes nuevos del departamento Finanzas. ¿Cuál es la mejor forma de implementarlo?
opciones:
  - id: a
    texto: "Aplicar manualmente cada política a cada agente nuevo durante el wizard de publishing, en el paso 6 «Permissions review»."
  - id: b
    texto: "Crear una Custom Template llamada HighlySensitiveDataTemplate con esas 6 políticas y aplicarla en el paso 5 «Apply Template» del wizard a cada agente nuevo de Finanzas."
    correcta: true
  - id: c
    texto: "Modificar la Default Template del tenant para incluir esas políticas; afectará a todos los agentes nuevos del tenant entero."
  - id: d
    texto: "Crear una Conditional Access policy específica para Finanzas; las otras políticas no son configurables centralmente."
justificacion: |
  El patrón correcto para un conjunto de restricciones específicas que aplican a una categoría de agentes (Finanzas) es crear una Custom Template una vez y aplicarla en el paso 5 del wizard cada vez que se publica un agente de Finanzas. La A es manual y propenso a errores. La C aplicaría a TODOS los agentes del tenant, sobrerestringiendo. La D solo cubre Conditional Access; las otras 5 políticas no son cubiertas por CA.
:::

::: pregunta
id: EX-08-005
modulo: 8
oa: OA-08.3
area: 3
tipo: multiple-choice
dificultad: media
bloom: Recordar
enunciado: |
  ¿Cuál de las siguientes afirmaciones describe correctamente el comportamiento de Pin en Microsoft Agent 365?
opciones:
  - id: a
    texto: "Pin requiere que el agente esté en estado Pending approval; una vez activo, no se puede pinear."
  - id: b
    texto: "Pin tiene 3 slots (Microsoft, Administrator, User) y la propagación a la UI cliente puede tardar hasta 6 horas. Solo se puede pinear un agente al slot Administrator a la vez; pinear otro despinea automáticamente al anterior."
    correcta: true
  - id: c
    texto: "Pin es irreversible: una vez pineado, la única forma de quitarlo es mediante Delete del agente."
  - id: d
    texto: "Pin se puede aplicar a cualquier agente del Registry, esté deployed o no."
justificacion: |
  Los tres elementos de la B son correctos: 3 slots Pin, propagación cliente hasta 6 h por caching, y solo un agente puede ocupar el slot Administrator a la vez. La A invierte: Pin requiere agente activo y deployed. La C es falsa: Pin es reversible vía Unpin. La D es falsa: Pin solo aplica a agentes deployed.
:::

### Módulo 09 — Permisos, accesos y Conditional Access

::: pregunta
id: EX-09-001
modulo: 9
oa: OA-09.1
area: 2
tipo: multiple-choice
dificultad: media
bloom: Comprender
enunciado: |
  Un agente OBO opera en runtime con permisos calculados como…
opciones:
  - id: a
    texto: "La unión entre los scopes del blueprint heredado y los del usuario invocador."
  - id: b
    texto: "La intersección triple entre scopes del blueprint heredado, scopes incluidos en la licencia del usuario invocador y scopes consentidos por el usuario."
    correcta: true
  - id: c
    texto: "Solo los scopes del blueprint, independientemente del usuario invocador."
  - id: d
    texto: "Solo los scopes que el usuario invocador tiene en su licencia, sin importar lo que herede el blueprint."
justificacion: |
  La regla operativa más importante del módulo es la intersección triple en OBO: blueprint AND licencia AND consent. Las tres listas deben coincidir para que el scope esté efectivamente disponible en runtime. La opción A (unión) es el opuesto y produce sobrelicenciamiento conceptual. La C ignora la licencia y consent. La D ignora blueprint y consent.
:::

::: pregunta
id: EX-09-002
modulo: 9
oa: OA-09.2
area: 2
tipo: scenario
dificultad: media
bloom: Aplicar
enunciado: |
  Tu organización quiere bloquear toda invocación a agentes con `customSecurityAttributes.Department = Finanzas` cuando el agente esté en `riskScore` Medium o High. La policy debe estar permanente (no Report-only) tras 7 días de validación. ¿Qué configuración aplica?
opciones:
  - id: a
    texto: "Assignments Workload identities con filter Department = Finanzas. Conditions Workload identity risk = Medium, High. Grants Block. Enable Report-only durante 7d, luego On."
    correcta: true
  - id: b
    texto: "Assignments All workload identities. Conditions Sign-in risk = Medium, High. Grants Require MFA. Enable On."
  - id: c
    texto: "Assignments Users in group Finanzas. Conditions User risk = Medium, High. Grants Block. Enable On."
  - id: d
    texto: "No es posible: las CA workload identities no soportan combinar custom attributes con risk score."
justificacion: |
  La opción A combina los dos signals (custom attribute Department + workload identity risk) y aplica grant Block como dicta el escenario. La progresión Report-only → On es la práctica recomendada para validar policies sin causar fallos en producción. La B aplica MFA (no tiene sentido para workload identities) y no filtra por Department. La C confunde users con workload identities. La D es falsa: combinar attributes con risk sí está soportado en workload identity CA.
:::

::: pregunta
id: EX-09-003
modulo: 9
oa: OA-09.4
area: 2
tipo: drag-and-drop
dificultad: media
bloom: Recordar
enunciado: |
  Empareja cada **detección de Identity Protection para agentes** con la señal que dispara su disparo principal.
items:
  - id: d1
    texto: "Anomalous token use"
  - id: d2
    texto: "Atypical agent travel"
  - id: d3
    texto: "Token issuer anomaly"
  - id: d4
    texto: "Suspicious agent application activity"
  - id: d5
    texto: "Verified threat actor signals"
  - id: d6
    texto: "Adversary-in-the-middle (AiTM)"
targets:
  - id: t1
    label: "Patrones de uso de token fuera del baseline aprendido"
  - id: t2
    label: "Token aparece en regiones imposibles de cubrir físicamente"
  - id: t3
    label: "Token con issuer no esperado o firma inválida"
  - id: t4
    label: "Agente intenta operaciones fuera de lo que su blueprint hereda"
  - id: t5
    label: "IP/ASN marcados por Microsoft Threat Intelligence"
  - id: t6
    label: "Patrones consistentes con proxy malicioso interceptando el flow OBO"
correct_map:
  d1: t1
  d2: t2
  d3: t3
  d4: t4
  d5: t5
  d6: t6
justificacion: |
  La memorización de las seis detecciones es exigible para el examen final. Cada una responde a una clase de ataque distinta: comportamiento anómalo del token, manipulación geográfica, token forgery, escalada de privilegios, threat intelligence externo, y proxy interceptor. La suma de las seis cubre el espectro de ataques sobre workload identities documentado por Microsoft Defender for Cloud Apps en su threat model de mayo de 2026.
:::

::: pregunta
id: EX-09-004
modulo: 9
oa: OA-09.5
area: 2
tipo: scenario
dificultad: dificil
bloom: Analizar
enunciado: |
  Necesitas distinguir en un sign-in log si una invocación a un agente fue OBO o own identity. ¿Qué campo del log debes inspeccionar primero y qué valor distingue uno del otro?
opciones:
  - id: a
    texto: "El campo `userPrincipalName`: si está poblado, fue OBO; si está vacío, fue own identity."
    correcta: true
  - id: b
    texto: "El campo `appId`: si coincide con un agent identity es OBO; si coincide con un service principal es own identity."
  - id: c
    texto: "El campo `correlationId`: los OBO tienen valor numérico, los own identity tienen GUID."
  - id: d
    texto: "El campo `tokenIssuerType`: el valor `AzureAD` indica OBO, `WorkloadIdentity` indica own identity."
justificacion: |
  El distintivo canónico es `userPrincipalName`: en OBO la entrada del log tiene el UPN del usuario invocador (porque es ese usuario quien arranca el flow); en own identity la entrada está poblada con la identidad del agente y `userPrincipalName` aparece vacío. La opción B confunde appId (siempre poblado en ambos modos con el agente como recurso). La C inventa una distinción entre correlation IDs. La D inventa un campo `tokenIssuerType`.
:::

::: pregunta
id: EX-09-005
modulo: 9
oa: OA-09.6
area: 2
tipo: scenario
dificultad: dificil
bloom: Crear
enunciado: |
  Diseñas el control de acceso para un agente Foundry de RRHH que opera **autonomous** (batch nocturno) leyendo datos de empleados (`Files.Read.All` sobre site RRHH) con `ConfidentialityLevel = HighlyConfidential`. ¿Cuál es la composición correcta de las tres capas de defensa?
opciones:
  - id: a
    texto: "Solo blueprint con scopes mínimos: las otras dos capas no son necesarias en agentes RRHH porque RRHH ya es área restringida."
  - id: b
    texto: "Blueprint con scopes mínimos + requireSponsor + Conditional Access que bloquee invocaciones fuera de la ventana batch (00:00-06:00) + Identity Protection con las 6 detecciones activas + risk policy block en Medium/High."
    correcta: true
  - id: c
    texto: "Solo Conditional Access bloqueando todas las invocaciones excepto desde la IP del scheduler. Las otras dos capas son redundantes."
  - id: d
    texto: "Solo Identity Protection en modo paranoid (umbral Low). Las otras dos capas son innecesarias si las detecciones son agresivas."
justificacion: |
  El principio de defensa en profundidad exige las tres capas. Cada una contiene un tipo de ataque distinto: el blueprint mantiene scopes mínimos (previene escalada por configuración), la CA bloquea invocaciones en condiciones no autorizadas (ventana horaria, atributos), y Identity Protection detecta comportamiento anómalo en runtime. Confiar en una sola capa deja huecos. La opción A subestima los riesgos. La C deja huecos en risk score. La D deja huecos en patrón estático (un agente con un scope que no debería tener pasa Identity Protection si su comportamiento parece normal).
:::

::: pregunta
id: EX-09-006
modulo: 9
oa: OA-09.3
area: 2
tipo: scenario
dificultad: media
bloom: Aplicar
enunciado: |
  El equipo de Seguridad ve en Risky Agents que el agente «Comercial-Crm-Sync» pasa a Risk High a las 11:30 con detección anomalous token use. La investigación revela que un partner externo está conectándose a la API custom del agente con tokens del propio tenant tras un onboarding técnico de la víspera. Es comportamiento legítimo. ¿Cuál es la respuesta operativa correcta?
opciones:
  - id: a
    texto: "Bloquear permanentemente el agente con Block desde el M365 admin center."
  - id: b
    texto: "Eliminar el agente y recrearlo con la nueva configuración."
  - id: c
    texto: "Hacer dismissal del riesgo en Identity Protection con justificación auditable («onboarding partner — comportamiento esperado tras integración del 2026-10-14») y monitorizar la reincidencia. Si vuelve a High, escalar a investigación profunda."
    correcta: true
  - id: d
    texto: "Esperar pasivamente: Identity Protection reevaluará al agente automáticamente y si el comportamiento se mantiene, dejará de marcarlo."
justificacion: |
  La respuesta operativa correcta para un falso positivo identificado es el **risk dismissal con justificación auditable**: queda en audit log, no bloquea operación legítima, y si la reincidencia ocurre se investiga. La opción A sobreasigna severidad y rompe operación legítima. La B elimina trabajo legítimo de meses. La D ignora la responsabilidad: Identity Protection no «aprende» automáticamente que algo es legítimo sin dismissal explícito; mantendría el agente en High indefinidamente.
:::

::: pregunta
id: EX-09-007
modulo: 9
oa: OA-09.2
area: 2
tipo: multiple-choice
dificultad: media
bloom: Recordar
enunciado: |
  ¿Qué licencia es **estrictamente necesaria** para crear Conditional Access policies que apliquen a workload identities de agentes?
opciones:
  - id: a
    texto: "Microsoft Entra ID P1 (incluida en E3)."
  - id: b
    texto: "Microsoft Entra ID P2 (incluida en E5)."
  - id: c
    texto: "Microsoft Entra Workload Identities Premium (vendida standalone o incluida en E7)."
    correcta: true
  - id: d
    texto: "Microsoft 365 E5 Compliance."
justificacion: |
  Microsoft Entra Workload Identities Premium es la licencia que habilita CA policies sobre workload identities (service principals + agent identities). Está incluida en E7 y se vende standalone para organizaciones que quieren CA para agentes sin migrar a E7. Sin esta licencia, las CA solo aplican a usuarios humanos. La opción A (P1) cubre CA para usuarios pero no para workload identities. La B (P2) habilita Identity Protection con risk scores avanzados pero no la aplicación de CA a workload identities. La D es de Compliance (Purview), sin relación con CA.
:::

---

## Área 4 — Implement data protection with Microsoft Purview

### Módulo 10 — Microsoft Purview y protección de datos

::: pregunta
id: EX-10-001
modulo: 10
oa: OA-10.1
area: 4
tipo: multiple-choice
dificultad: media
bloom: Comprender
enunciado: |
  Después de aplicar Conditional Access a todos los agentes del tenant, el responsable de Seguridad pregunta «¿qué problema concreto sigue sin estar resuelto y nos lleva a desplegar Microsoft Purview además de CA?». ¿Cuál es la respuesta más precisa?
opciones:
  - id: a
    texto: "Permitir que los agentes accedan solo desde dispositivos compliant, ya que CA no cubre dispositivos."
  - id: b
    texto: "Aplicar protección al **dato** una vez accedido por el agente (herencia de sensitivity labels, cifrado de outputs, watermark, trazabilidad regulatoria), responsabilidades que están fuera del alcance de CA."
    correcta: true
  - id: c
    texto: "Restringir scopes del agente, ya que el blueprint y CA no controlan permisos efectivos."
  - id: d
    texto: "Bloquear invocaciones cuando el risk score sube a High, lo cual CA no permite."
justificacion: |
  CA es una capa de **acceso**: decide si un agente puede invocar bajo ciertas condiciones. Purview es una capa de **dato**: decide qué pasa con el contenido una vez accedido. La opción B describe exactamente las cuatro funciones que CA no cubre (label, cifrado, watermark, trazabilidad). La opción A es falsa: CA sí controla device compliance. La C es falsa: blueprint controla scopes inheritables. La D es falsa: CA con Identity Protection sí bloquea por risk score.
:::

::: pregunta
id: EX-10-002
modulo: 10
oa: OA-10.4
area: 4
tipo: scenario
dificultad: dificil
bloom: Aplicar
enunciado: |
  Un regulador financiero solicita por escrito el listado completo de accesos a archivos clasificados como `HighlyConfidential` realizados por el agente «Treasury-Reconcile-Bot» durante el trimestre Q1 2026. La organización tiene Microsoft 365 E5 Compliance. ¿Cuál es el flujo operativo correcto para producir la evidencia?
opciones:
  - id: a
    texto: "Exportar el log de actividad del agente desde el portal de M365 admin center, filtrar el CSV en Excel por «Highly Confidential» y enviarlo al regulador."
  - id: b
    texto: "Abrir un caso en eDiscovery Premium, añadir al agente como custodian, definir una búsqueda con filtros `Activity = AgentDataAccess` y `SensitivityLabel ∈ (HighlyConfidential)` en el rango Q1, aplicar custodian hold preventivo, ejecutar la búsqueda y exportar resultados con timestamp, UPN del invocador, resourceUri, sensitivityLabel y correlationId."
    correcta: true
  - id: c
    texto: "Pedir al equipo de IT que extraiga del SharePoint el listado de archivos `HighlyConfidential` y cruzarlo manualmente con los timestamps en los que el agente operó."
  - id: d
    texto: "Usar Microsoft Sentinel para buscar eventos del agente y exportarlos en CSV."
justificacion: |
  La respuesta correcta es B: eDiscovery Premium es la herramienta diseñada para respuestas regulatorias con cadena de custodia, filtros por agentId y campos forenses estandarizados. El custodian hold es crítico para que el regulador acepte la evidencia como íntegra. La opción A produce un export sin cadena de custodia y sin campos clave (UPN del invocador, correlationId), inaceptable para un regulador. La C es operativamente inviable a escala y propensa a errores. La D usa la herramienta incorrecta: Sentinel es SIEM operativo, no produce evidencia con la trazabilidad regulatoria que pide la solicitud.
:::

::: pregunta
id: EX-10-003
modulo: 10
oa: OA-10.3
area: 4
tipo: drag-and-drop
dificultad: media
bloom: Aplicar
enunciado: |
  Empareja cada **sensitivity label** con el caso de uso típico en un archivo `.agent` o blueprint de Agent 365.
items:
  - id: l1
    texto: "Public"
  - id: l2
    texto: "Internal"
  - id: l3
    texto: "Confidential"
  - id: l4
    texto: "Highly Confidential"
targets:
  - id: t1
    label: "Agentes de plantilla, ejemplos, demos públicas para terceros"
  - id: t2
    label: "Agentes operativos estándar sin información confidencial en el prompt"
  - id: t3
    label: "Agentes que tocan resúmenes financieros, datos de RRHH u otros datos sensibles del negocio"
  - id: t4
    label: "Agentes con conexiones a APIs propietarias o prompts con know-how exclusivo (secreto industrial)"
correct_map:
  l1: t1
  l2: t2
  l3: t3
  l4: t4
justificacion: |
  Las cuatro labels canónicas se aplican según el nivel de protección requerido por el contenido del archivo. Public para material distribuible libremente; Internal para operación estándar sin sensibilidad particular; Confidential cuando hay datos sensibles del negocio (financiero, RRHH); Highly Confidential cuando hay secreto industrial o know-how propietario que justifica las protecciones más estrictas (cifrado obligatorio, no exfiltrable, watermark visible, custodian hold permanente).
:::

::: pregunta
id: EX-10-004
modulo: 10
oa: OA-10.5
area: 4
tipo: scenario
dificultad: dificil
bloom: Crear
enunciado: |
  El responsable de Compliance te pide que un agente de RRHH que produce resúmenes de evaluaciones de desempeño (datos personales sujetos a GDPR) tenga su output **siempre cifrado, identificable forensemente y restringido a no salir del tenant**. Los managers receptores no pueden compartir el resumen con externos ni con managers de otras divisiones. ¿Qué combinación de configuraciones de Purview implementa exactamente este requisito?
opciones:
  - id: a
    texto: "Aplicar sensitivity label `Confidential` al blueprint con encryption AES-256, watermark visible con UPN + fecha, restricción dura «no compartir fuera del tenant», auto-labeling de SITs como backup y Endpoint DLP bloqueando copia a apps no aprobadas."
    correcta: true
  - id: b
    texto: "Aplicar sensitivity label `Internal` al blueprint y confiar en que los managers no compartirán los resúmenes."
  - id: c
    texto: "Configurar Endpoint DLP en los dispositivos de los managers sin aplicar sensitivity labels al blueprint."
  - id: d
    texto: "Aplicar label `Highly Confidential` al blueprint sin restricciones de compartición específicas; basta con que el output se cifre."
justificacion: |
  La opción A combina las cinco piezas necesarias para GDPR: label con cifrado AES-256 (protección del dato en reposo y tránsito), watermark con UPN + fecha (trazabilidad forense si se filtra), restricción explícita de no salir del tenant (control de compartición), auto-labeling de SITs como red de seguridad (si un futuro output incluye DNI/IBAN no detectados manualmente, queda cubierto) y Endpoint DLP como última milla. La B subestima brutalmente el riesgo. La C deja huérfano el output cuando viaja fuera del endpoint (en un email, en un dispositivo no gestionado). La D protege el cifrado pero sin restricción de compartición, los managers podrían reenviar a externos sin que la label lo bloquee.
:::

::: pregunta
id: EX-10-005
modulo: 10
oa: OA-10.2
area: 4
tipo: multiple-response
dificultad: media
bloom: Recordar
enunciado: |
  ¿Cuáles son los cuatro paneles principales que muestra el dashboard de **Data Security Posture Management for AI** (DSPM for AI) de Microsoft Purview? Selecciona los cuatro correctos.
opciones:
  - id: a
    texto: "Top sensitive interactions: invocaciones que tocaron datos `Confidential+`, agrupadas por agente y por usuario invocador."
    correcta: true
  - id: b
    texto: "Top apps: cuáles agentes y aplicaciones de IA generativa consumen más datos sensibles."
    correcta: true
  - id: c
    texto: "Risky users: usuarios cuyo patrón de uso de agentes activa señales de Insider Risk Management."
    correcta: true
  - id: d
    texto: "Data oversharing: archivos accedidos por agentes en contextos que el oficial considera arriesgados."
    correcta: true
  - id: e
    texto: "Cost optimization: panel de gasto por agente y proyección presupuestaria."
  - id: f
    texto: "Performance metrics: latencia promedio de respuesta por agente."
justificacion: |
  DSPM for AI tiene exactamente cuatro paneles: Top sensitive interactions (A), Top apps (B), Risky users (C) y Data oversharing (D). Cada uno responde a una pregunta operativa distinta para el oficial de cumplimiento durante su triaje semanal. Las opciones E (costes) y F (performance) son metricas de uso operativo que se encuentran en otros dashboards (M365 admin center o Foundry usage), no en DSPM for AI, cuyo foco es exclusivamente la **postura de seguridad del dato**.
:::
