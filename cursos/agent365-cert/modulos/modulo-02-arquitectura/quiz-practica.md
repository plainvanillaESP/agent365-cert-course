---
modulo: 2
tipo: quiz-practica
titulo: "Quiz de práctica del Módulo 02"
duracion_min: 15
umbral_aprobado_pct: 70
intentos_max: null
ultima_actualizacion: 2026-05-07
preguntas:
  - Q-02-1
  - Q-02-2
  - Q-02-3
  - Q-02-4
  - Q-02-5
  - Q-02-6
caso_estudio: "Plain Coffee SL"
---

# Módulo 02 — Quiz de práctica

> Seis preguntas para validar tu comprensión de la arquitectura de Agent 365 y de los componentes que la conforman. Intentos ilimitados, aprobado a partir del 70 %.
>
> Estas preguntas son distintas a las del examen final del curso. Cubren los mismos OAs con escenarios y formulaciones nuevos.

---

::: pregunta
id: Q-02-1
oa: OA-02.1
tipo: drag-and-drop
dificultad: media
bloom: Aplicar
enunciado: |
  Empareja cada capacidad de la página de detalle de un agente en el Registry con el admin center que la alimenta de datos.
items:
  - id: c1
    texto: "Risks column con score Low / Medium / High."
  - id: c2
    texto: "AI Agent Inventory consolidado de agentes locales y SaaS."
  - id: c3
    texto: "Sensitivity labels heredados de los archivos `.agent`."
  - id: c4
    texto: "Pin / Block / Approve update sobre el agente."
  - id: c5
    texto: "Estado de identidad de agente (active, disabled, blocked) con sus `appId`."
targets:
  - id: m365-admin
    label: "Microsoft 365 admin center"
  - id: entra-admin
    label: "Microsoft Entra"
  - id: purview-admin
    label: "Microsoft Purview"
  - id: defender-admin
    label: "Microsoft Defender XDR"
correct_map:
  c1: defender-admin
  c2: defender-admin
  c3: purview-admin
  c4: m365-admin
  c5: entra-admin
justificacion: |
  Aunque la página de detalle del agente es **una** vista en M365 admin center, gran parte de la información que muestra **proviene** de los otros admin centers: la Risks column la alimenta Defender XDR (que también consolida el AI Agent Inventory incluyendo agentes locales detectados como Shadow AI), los sensitivity labels los aplica Purview sobre el archivo `.agent`, y el estado de identidad lo gestiona Entra Agent ID. Solo las acciones operativas como Pin / Block / Approve viven nativamente en M365 admin center. Esta integración cruzada es la que hace de Agent 365 un control plane real, no un mero portal.
:::

::: pregunta
id: Q-02-2
oa: OA-02.2
tipo: multiple-response
dificultad: media
bloom: Analizar
enunciado: |
  De los siguientes elementos, ¿cuáles **NO** corresponden a uno de los 8 tipos de agente del Registry? Selecciona todos los que apliquen.
opciones:
  - id: a
    texto: "Microsoft 365 Agents Toolkit"
    correcta: true
  - id: b
    texto: "MCS CEA (custom-engine agent)"
  - id: c
    texto: "Blueprint principal de Entra"
    correcta: true
  - id: d
    texto: "Agent Builder (declarative)"
  - id: e
    texto: "Sponsor user"
    correcta: true
  - id: f
    texto: "SharePoint agent"
  - id: g
    texto: "Foundry agent"
  - id: h
    texto: "Agent identity"
    correcta: true
justificacion: |
  Los **8 tipos** que aparecen en la columna Type del Registry son: Agent Builder declarative, Agent Builder custom, MCS CEA, Foundry, SharePoint agent, Microsoft Teams app, M365 Agents SDK custom y external (sync). Los distractores correctos son: Toolkit (es un IDE plugin, no un tipo), Blueprint (objeto de Entra Agent ID, no un agente), Sponsor user (rol del Entra Agent ID, no un tipo de agente), Agent identity (objeto de Entra que representa al agente, no un tipo del Registry). La distinción entre **tipo de agente** y **objetos relacionados con el agente** es el núcleo conceptual del módulo y se profundiza en M06.
:::

::: pregunta
id: Q-02-3
oa: OA-02.3
tipo: multiple-choice
dificultad: facil
bloom: Comprender
enunciado: |
  En el Agent Registry hay tres categorías de **Publisher**. ¿Cuál de las siguientes afirmaciones describe correctamente esa clasificación?
opciones:
  - id: a
    texto: "Microsoft (agentes desarrollados por Microsoft), Third Party (partners verificados que han pasado por el ISV program) y Your organization (agentes creados por usuarios o IT del propio tenant)."
    correcta: true
  - id: b
    texto: "Microsoft (first party), Open Source (agentes con licencia OSS) y Custom (creados internamente)."
  - id: c
    texto: "Verified, Pending Verification y Blocked, según el estado de la aprobación de IT."
  - id: d
    texto: "Trusted, Untrusted y Quarantine, según el risk score asignado por Defender."
justificacion: |
  Las tres categorías de Publisher en el Registry son **Microsoft**, **Third Party** (partners ISV con verificación oficial) y **Your organization** (agentes creados por la propia empresa). Esta clasificación es independiente del estado de aprobación (que vive en otra columna) y del risk score (que vive en la Risks column). La opción B inventa categorías. La C confunde Publisher con estado de approval. La D confunde Publisher con risk classification.
:::

::: pregunta
id: Q-02-4
oa: OA-02.4
tipo: multiple-choice
dificultad: media
bloom: Aplicar
enunciado: |
  En el Overview del Agent workload aparecen **hero metrics** con cifras clave del tenant. Si en la cifra «Agents with risks» pasa de 12 a 47 en una semana, ¿qué fuente de datos hay que ir a investigar primero para entender el cambio?
opciones:
  - id: a
    texto: "El Microsoft 365 admin center, porque es donde vive el Registry."
  - id: b
    texto: "Microsoft Defender XDR, porque la Risks column se alimenta de la valoración de riesgo que produce Defender."
    correcta: true
  - id: c
    texto: "Microsoft Purview, porque DSPM for AI controla los riesgos de los agentes."
  - id: d
    texto: "Microsoft Entra, porque el riesgo se calcula sobre la identidad del agente."
justificacion: |
  Aunque la métrica se **muestra** en M365 admin center, la **fuente de datos** es Defender XDR. Investigar el salto requiere ir a Defender → AI Agent Inventory para ver qué agentes nuevos han entrado al pool «with risks» y qué señales han disparado el cambio (puede ser exposición pública, agentes con plug-ins de terceros, agentes con Risky Sign-Ins en Entra que escalan hasta Defender). Saber dónde investigar cada hero metric es lo que diferencia mirar el dashboard de operarlo.
:::

::: pregunta
id: Q-02-5
oa: OA-02.5
tipo: scenario
dificultad: dificil
bloom: Analizar
enunciado: |
  Un equipo está construyendo un agente Foundry que durante el runtime necesita consultar las reuniones próximas del usuario en Outlook y los archivos compartidos recientemente con el equipo. El líder técnico pregunta si tiene que «llamar a Microsoft Graph desde el agente» o si hay otra vía. ¿Cuál es la respuesta arquitectónicamente más correcta?
opciones:
  - id: a
    texto: "Sí, necesariamente. El agente debe llamar Microsoft Graph con su agent identity para acceder al calendario y archivos."
  - id: b
    texto: "No es necesario llamar Graph directamente: el agente puede consumir esos datos vía Work IQ MCP servers, que exponen contexto del usuario (calendario, archivos, contactos, etc.) como herramientas MCP estandarizadas en runtime."
    correcta: true
  - id: c
    texto: "Sí, pero usando el SDK de Outlook y el SDK de SharePoint, no Graph."
  - id: d
    texto: "No tiene sentido la pregunta: los agentes Foundry no pueden acceder a datos del usuario en runtime."
justificacion: |
  **Work IQ MCP servers** son una pieza arquitectónica clave de Agent 365: exponen contexto del usuario (calendario, mail, archivos, contactos, equipos, etc.) como herramientas MCP estandarizadas que cualquier agente puede consumir en runtime sin tener que escribir integraciones contra Microsoft Graph. Esto reduce código, centraliza permisos y hace que la gobernanza de qué datos toca el agente sea automática (Purview ve los accesos vía MCP). La opción A funciona pero es la opción «vieja»: implica más código, más permisos, más superficie de ataque. La C confunde SDKs. La D es falsa: los agentes Foundry sí acceden a contexto del usuario, vía MCP es lo recomendado.
:::

::: pregunta
id: Q-02-6
oa: OA-02.1
tipo: multiple-choice
dificultad: facil
bloom: Recordar
enunciado: |
  Un equipo de desarrollo te muestra dos comandos `npm install` en su README:

  ```
  npm install @microsoft/agents
  npm install @microsoft/agent365
  ```

  ¿Qué cubre cada paquete?
opciones:
  - id: a
    texto: "@microsoft/agents → transporte conversacional (M365 Agents SDK). @microsoft/agent365 → gobernanza (identidad Entra, telemetría, Work IQ MCP)."
    correcta: true
  - id: b
    texto: "@microsoft/agents → identidad Entra. @microsoft/agent365 → Copilot Studio integration."
  - id: c
    texto: "Son alias del mismo SDK; uno es legacy."
  - id: d
    texto: "@microsoft/agents → Foundry SDK. @microsoft/agent365 → Copilot Control System SDK."
justificacion: |
  El paquete `@microsoft/agents` corresponde al **Microsoft 365 Agents SDK** (constructor: transporte conversacional, manejo de mensajes, multicanal). El paquete `@microsoft/agent365` corresponde al **Microsoft Agent 365 SDK** (control plane: identidad de agente con Entra, telemetría OpenTelemetry, acceso a Work IQ MCP, eventos de gobernanza). Tener los dos instalados es habitual: uno construye, el otro gobierna. La confusión nominal entre ambos es uno de los errores más frecuentes con partners y desarrolladores.
:::

---

## Caso de estudio (refuerzo, no evaluable)

> Tras leer la teoría y responder el quiz, intenta completar este ejercicio antes de pasar a M03.

**Escenario.** La consultora Plain Coffee SL acaba de activar Microsoft Agent 365 Frontier preview. La directora de IT pide al equipo de seguridad un documento de una página, dirigido al comité directivo, explicando dónde van a configurar las distintas piezas del producto. La estructura del documento ya está fijada: una sección por cada admin center implicado.

**Tarea.** Identifica para cada admin center (M365, Entra, Purview, Defender) las tres a cinco piezas más importantes que el equipo va a configurar en él durante los primeros 90 días. Justifica el reparto en lugar de tomarlo como una lista.

<details>
<summary>Ver solución sugerida</summary>

| Admin center | Piezas a configurar primero |
|---|---|
| **Microsoft 365 admin** | Agent Registry (review semanal), Agent Map, plantillas de publishing (Default y Custom), aprobación de pending requests, Pin de agentes recomendados |
| **Microsoft Entra** | Blueprints de identidad por área, Conditional Access para agentes (especialmente bloqueo por risk High), lifecycle workflows con sponsorship, ID Protection con detecciones para agentes |
| **Microsoft Purview** | DSPM for AI activado, sensitivity labels para `.agent` files, DLP policies tratando agent instance como user, Compliance Manager template EU AI Act |
| **Microsoft Defender** | Conector M365 activado, AI Agent Inventory revisado, KQL hunting baseline (CloudAppEvents), alertas de Risky Agents |

La justificación clave: **un agente vive simultáneamente en los cuatro admin centers** y omitir cualquiera deja huecos de gobernanza. M01 introdujo este principio; M02 lo materializa en componentes concretos.
</details>
