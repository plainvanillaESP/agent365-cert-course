---
spec_version: "1.0"
tipo: banco-examen
curso: agent365-cert
total_preguntas_objetivo: 60
total_preguntas_actuales: 9
ultima_actualizacion: 2026-05-07
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
| M06 — Entra Agent ID | 11 | Pendiente migración |
| M07 — Agent Registry | 4 | Pendiente migración |
| M08 — Ciclo de vida | 5 | Pendiente migración |
| M09 — Permisos y CA | 7 | Pendiente producción |
| M10 — Purview | 5 | Pendiente producción |
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
