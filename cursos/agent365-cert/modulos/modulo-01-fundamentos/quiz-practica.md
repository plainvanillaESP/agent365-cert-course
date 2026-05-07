---
modulo: 1
tipo: quiz-practica
titulo: "Quiz de práctica del Módulo 01"
duracion_min: 12
umbral_aprobado_pct: 70
intentos_max: null
ultima_actualizacion: 2026-05-07
preguntas:
  - Q-01-1
  - Q-01-2
  - Q-01-3
  - Q-01-4
  - Q-01-5
  - Q-01-6
  - Q-01-7
  - Q-01-8
caso_estudio: "Plain Coffee SL"
---

# Módulo 01 — Quiz de práctica

> Ocho preguntas para validar tu comprensión del módulo. Intentos ilimitados, sin penalización: el objetivo es aprender, no examinarte. Aprobado a partir del 70% (6 de 8 correctas).
>
> Estas preguntas son **distintas** a las que verás en el examen final del curso. Si te cruzas con alguna que se parezca al examen, no es coincidencia: cubren los mismos objetivos de aprendizaje, con escenarios y datos diferentes para entrenar el reconocimiento de patrones.

---

## Preguntas

::: pregunta
id: Q-01-1
oa: OA-01.1
tipo: multiple-choice
dificultad: facil
bloom: Comprender
enunciado: |
  El equipo de ingeniería de tu empresa quiere construir un agente conversacional desde cero usando código y desplegarlo en una aplicación Teams interna. Está debatiendo qué herramientas utilizar. ¿Cuál de los siguientes productos del ecosistema de Microsoft cubre la **construcción** del agente, frente a los demás que cubren capas distintas?
opciones:
  - id: a
    texto: "Microsoft Agent 365: porque incluye Agent Builder con un kit de desarrollo SDK."
  - id: b
    texto: "Copilot Control System: porque controla qué agentes se pueden desplegar en Teams."
  - id: c
    texto: "Microsoft 365 Agents SDK: es el framework oficial para construir agentes con código."
    correcta: true
  - id: d
    texto: "Microsoft Purview: porque protege los datos del agente desde el día cero."
justificacion: |
  El **Microsoft 365 Agents SDK** es el kit oficial para construir agentes con código (TypeScript, C#, Python). Agent 365 NO construye agentes, los gobierna; CCS no construye nada, gobierna el comportamiento de Copilot Chat para los humanos; Purview protege datos pero no es un constructor de agentes. Ver § 1.2 «Posicionamiento: control plane, no builder» y § 1.5 «Cronología del producto».

  **Cuidado** con la confusión nominal: el M365 Agents SDK (constructor) ≠ el Agent 365 SDK (extensión del control plane). Son dos SDKs distintos; el módulo 02 los compara en detalle.
:::

::: pregunta
id: Q-01-2
oa: OA-01.4
tipo: multiple-choice
dificultad: media
bloom: Aplicar
enunciado: |
  Un compañero de IT te dice que para desplegar Copilot Studio en producción «basta con tener Microsoft 365 Agent 365 activado, porque al ser el control plane todo lo demás se configura automáticamente». ¿Cuál es la mejor respuesta?
opciones:
  - id: a
    texto: "Es correcto: Agent 365 incluye Copilot Studio como motor de creación de agentes."
  - id: b
    texto: "Es incorrecto: Agent 365 es el control plane sobre los agentes, no los crea ni los aprovisiona. Copilot Studio se licencia y configura aparte; Agent 365 luego lo gobierna."
    correcta: true
  - id: c
    texto: "Es correcto solo si la organización tiene M365 E7 (Frontier Suite)."
  - id: d
    texto: "Es incorrecto porque Agent 365 está pensado únicamente para agentes de SharePoint, no para los de Copilot Studio."
justificacion: |
  Agent 365 es **control plane**: gobierna, audita, monitoriza y aplica políticas sobre agentes que viven en otras plataformas, pero no los construye, no los aloja y no los licencia. La responsabilidad de licenciar y configurar Copilot Studio (capacidad de mensajes, conectores, entornos de Power Platform) sigue siendo independiente. Esta distinción es la fuente más frecuente de confusión en el primer mes con Agent 365 y sustenta el resto del curso. Ver § 1.2 y § 1.4.
:::

::: pregunta
id: Q-01-3
oa: OA-01.3
tipo: scenario
dificultad: media
bloom: Aplicar
enunciado: |
  El CISO de Lumen Logística (4.500 empleados de oficina, M365 Copilot desplegado a 2.000) escribe un email al equipo IT con tres preocupaciones:

  1. «Necesitamos saber qué porcentaje del tiempo que pasan los empleados en Teams están usando Copilot Chat para resumir reuniones.»
  2. «Tenemos un agente Copilot Studio del equipo Comercial que envía resúmenes de oportunidades, pero nadie sabe a qué documentos está accediendo realmente.»
  3. «Queremos forzar que los nuevos empleados pasen 30 días sin acceso a Copilot Chat hasta completar la formación de uso responsable.»

  ¿Qué producto resuelve cada preocupación?
opciones:
  - id: a
    texto: "1 → CCS · 2 → Agent 365 · 3 → CCS"
    correcta: true
  - id: b
    texto: "1 → Agent 365 · 2 → CCS · 3 → Agent 365"
  - id: c
    texto: "Las tres preocupaciones se resuelven con Agent 365 porque las tres tocan IA."
  - id: d
    texto: "Las tres preocupaciones se resuelven con CCS porque las tres afectan a empleados."
justificacion: |
  - **(1)** Medir el uso de Copilot Chat por humanos es trabajo de **CCS** (Copilot Analytics + Viva Insights). Es comportamiento de personas, no de agentes.
  - **(2)** Auditar a qué documentos accede un agente Copilot Studio es trabajo de **Agent 365** (Agent Registry + Purview integrado para los datos accedidos por agente).
  - **(3)** Restringir el acceso de empleados a Copilot Chat según colectivo es trabajo de **CCS** (controles de habilitación por grupo, gestión de licencias). Es gobernanza sobre el humano, no sobre un agente.

  La regla mnemotécnica del módulo: **Agent 365 gobierna agentes; CCS gobierna humanos usando IA**.
:::

::: pregunta
id: Q-01-4
oa: OA-01.2
tipo: multiple-response
dificultad: media
bloom: Aplicar
enunciado: |
  De las siguientes responsabilidades, ¿cuáles caen primariamente sobre el **Entra admin** dentro del modelo de cuatro stakeholders core de Agent 365? Selecciona todas las que apliquen.
opciones:
  - id: a
    texto: "Crear blueprints de identidad con permisos heredables para los agentes."
    correcta: true
  - id: b
    texto: "Configurar Conditional Access que bloquee agentes con risk score alto."
    correcta: true
  - id: c
    texto: "Aprobar pending requests de agentes en el wizard de publishing."
  - id: d
    texto: "Definir DLP policies que traten al agent instance como user."
  - id: e
    texto: "Configurar lifecycle workflows para transferir sponsorship cuando un manager cambia."
    correcta: true
  - id: f
    texto: "Investigar incidentes con KQL en la tabla CloudAppEvents."
justificacion: |
  Las responsabilidades del **Entra admin** son las relacionadas con **identidad, acceso y ciclo de vida de identidades**: blueprints (a), Conditional Access (b) y lifecycle workflows (e). El wizard de publishing y aprobaciones (c) viven en M365 admin center. DLP (d) vive en Purview. KQL hunting (f) vive en Defender. Ver § 1.3.
:::

::: pregunta
id: Q-01-5
oa: OA-01.2
tipo: drag-and-drop
dificultad: media
bloom: Aplicar
enunciado: |
  Empareja cada acción operativa de gobernanza con el admin center que la ejecuta. Las acciones son distintas a las del examen final pero los principios son los mismos.
items:
  - id: a1
    texto: "Habilitar DSPM for AI sobre el tenant."
  - id: a2
    texto: "Pin un agente al slot Administrator para grupo 'Dirección Comercial'."
  - id: a3
    texto: "Investigar el riesgo de un agente comprometido en Risky Agents report."
  - id: a4
    texto: "Aplicar la plantilla 'EU AI Act' en Compliance Manager."
  - id: a5
    texto: "Configurar el conector de Microsoft 365 para Defender XDR."
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
  a1: purview-admin
  a2: m365-admin
  a3: entra-admin
  a4: purview-admin
  a5: defender-admin
justificacion: |
  - **DSPM for AI** y **Compliance Manager** viven en Microsoft Purview.
  - **Pin** del Agent Registry vive en M365 admin center (los slots Microsoft / Administrator / User son del wizard de publishing).
  - **Risky Agents report** y la gestión de riesgo de identidades de agente viven en Microsoft Entra (Entra Agent ID Protection).
  - El **conector M365** de Defender XDR es la pieza que activa la ingesta de telemetría de agentes en Defender.

  El curso revisita estos cuatro admin centers en el módulo 02 (arquitectura) y profundiza en cada uno en los módulos 04-12.
:::

::: pregunta
id: Q-01-6
oa: OA-01.5
tipo: multiple-choice
dificultad: facil
bloom: Recordar
enunciado: |
  ¿Cuál de las siguientes secuencias refleja correctamente el orden cronológico de lanzamientos del ecosistema Microsoft de IA empresarial?
opciones:
  - id: a
    texto: "Copilot Studio (Power Virtual Agents original) → Microsoft 365 Copilot → Copilot Control System → Microsoft Agent 365"
    correcta: true
  - id: b
    texto: "Microsoft Agent 365 → Microsoft 365 Copilot → Copilot Studio → Copilot Control System"
  - id: c
    texto: "Microsoft 365 Copilot → Microsoft Agent 365 → Copilot Studio → Copilot Control System"
  - id: d
    texto: "Copilot Control System → Microsoft Agent 365 → Microsoft 365 Copilot → Copilot Studio"
justificacion: |
  La cronología real del ecosistema:
  - **Copilot Studio** (originalmente Power Virtual Agents) es el más antiguo, parte de Power Platform.
  - **Microsoft 365 Copilot** se anunció en 2023 y entró en GA durante 2024.
  - **Copilot Control System (CCS)** apareció después como capa de gobernanza para Copilot.
  - **Microsoft Agent 365** es el más reciente: GA el 1 de mayo de 2026.

  Conocer la cronología ayuda a entender por qué Agent 365 NO incluye lo que ya hacen los productos anteriores: se monta encima como capa específica de agentes. Ver § 1.5.
:::

::: pregunta
id: Q-01-7
oa: OA-01.1
tipo: multiple-choice
dificultad: facil
bloom: Recordar
enunciado: |
  De los siguientes productos, ¿cuál **NO** crea agentes y se posiciona exclusivamente como capa de gobernanza?
opciones:
  - id: a
    texto: "Microsoft Copilot Studio."
  - id: b
    texto: "Microsoft Foundry."
  - id: c
    texto: "Microsoft Agent 365."
    correcta: true
  - id: d
    texto: "SharePoint Agents."
justificacion: |
  - **Copilot Studio**, **Foundry** y **SharePoint Agents** son **constructores** de agentes (cada uno con un enfoque distinto: low-code/conversacional, pro-code/Azure, contenido SharePoint).
  - **Microsoft Agent 365** es la única opción de la lista que es **control plane**: no crea agentes, los gobierna.

  Esta distinción es la base sobre la que se construye todo el curso. Ver § 1.2.
:::

::: pregunta
id: Q-01-8
oa: OA-01.3
tipo: scenario
dificultad: dificil
bloom: Analizar
enunciado: |
  La compañía «Cervantes Bank» tiene M365 Copilot desplegado y un puñado de agentes Copilot Studio operativos. El comité de IA tiene cinco peticiones nuevas. Para cada una, ¿qué producto la resuelve?

  P1. «Bloquear que cualquier agente acceda a documentos etiquetados como Confidential.»
  P2. «Saber cuántos minutos al día está cada empleado interactuando con Copilot Chat.»
  P3. «Detectar agentes desplegados en el tenant que no han pasado por la cola de aprobación de IT.»
  P4. «Forzar que los empleados completen un curso de uso responsable antes de habilitarles Copilot.»
  P5. «Aplicar plantillas regulatorias del EU AI Act sobre los agentes que tratan datos personales.»
opciones:
  - id: a
    texto: "P1 → Agent 365 · P2 → CCS · P3 → Agent 365 · P4 → CCS · P5 → Agent 365"
    correcta: true
  - id: b
    texto: "Las cinco se resuelven con Agent 365: es el control plane unificado del tenant."
  - id: c
    texto: "P1, P3 y P5 → CCS · P2 y P4 → Agent 365"
  - id: d
    texto: "P1 y P5 → Purview standalone (no requieren Agent 365 ni CCS) · P2, P3 y P4 → Agent 365"
justificacion: |
  Aplicación clara del principio «Agent 365 gobierna agentes; CCS gobierna humanos usando IA», más una sutileza importante:

  - **P1, P3, P5** afectan a **agentes**: bloqueo de acceso a datos por agente (Agent 365 vía Purview integrado), inventario y aprobación (Agent 365 vía Registry), compliance regulatoria sobre agentes (Agent 365 vía Compliance Manager integrado). Las tres viven en Agent 365.
  - **P2 y P4** afectan a **humanos** usando IA: medir el uso de Copilot por personas y forzar formación previa al acceso. Ambas viven en CCS.

  El distractor D es tentador porque Purview standalone existe sin Agent 365, pero la integración con Agent 365 es lo que permite tratar al `agent instance` como `user` en las DLP policies y aplicar plantillas regulatorias específicas a sistemas de IA. Sin Agent 365 los datos serían los mismos pero no la pieza de governance. Ver § 1.4.
:::

---

## Caso de estudio (refuerzo, no evaluable)

> El caso de estudio no se evalúa pero refuerza la comprensión integral. Recomendado tras responder el quiz y antes de pasar al Módulo 02.

**Escenario:**

Plain Coffee SL es una cadena con 800 empleados de oficina. Ya tiene Microsoft 365 Copilot desplegado a toda la plantilla. La dirección observa tres síntomas a la vez:

- IT no sabe cuántos agentes hay en el tenant: algunos equipos han creado agentes Agent Builder, otros han desplegado agentes Copilot Studio compartidos por compañeros, hay un par de agentes Foundry construidos por el equipo de datos, y se sospecha que algunos empleados usan ChatGPT consumer en sus equipos.
- Un agente Copilot Studio del equipo de Marketing está accediendo a documentos confidenciales del equipo Legal y nadie sabe por qué.
- El equipo de Cumplimiento avisa de que la EU AI Act exige documentar el inventario de sistemas de IA que tratan datos personales.

**Tareas:**

1. ¿Qué producto debe contratar la dirección antes de hacer cualquier otra cosa? Justifica la elección frente a sus alternativas.
2. ¿Qué stakeholder dentro de Plain Coffee SL será responsable de cada uno de los tres síntomas?
3. ¿Cuál es el módulo del curso que cubrirá la respuesta operativa a cada síntoma?

<details>
<summary>Ver solución sugerida</summary>

**1.** **Microsoft Agent 365** (vía standalone o vía M365 E7, decisión que se toma en el Módulo 03 según volumen y necesidad de Risks column). Es el único producto que da inventario centralizado de agentes (Registry y Map), identidad gestionable (Entra Agent ID), gobernanza de datos (Purview integrado) y monitorización (Defender integrado) sobre agentes. CCS no resolvería el inventario de agentes; Copilot Studio sólo resuelve la creación, no la gobernanza.

**2.**

| Síntoma | Stakeholder principal | Apoyado por |
|---|---|---|
| No saber cuántos agentes hay | M365 admin (Agent Registry) | Defender admin (para los locales / Shadow AI) |
| Agente accediendo a documentos confidenciales | Purview admin (DLP, sensitivity labels) | Entra admin (CA + ID Protection si el agente está comprometido) |
| Inventario para EU AI Act | Purview admin (Compliance Manager) | M365 admin (export inventory) |

**3.**

| Síntoma | Módulos del curso |
|---|---|
| Inventario y registry | Módulo 02 (arquitectura), Módulo 07 (Registry y Map) |
| DLP sobre agentes | Módulo 10 (Purview), Módulo 11 (DLP, sensitivity labels) |
| Compliance EU AI Act | Módulo 11 (Compliance Manager) |

</details>

---

## Validación de aprendizaje

Estás listo para avanzar al Módulo 02 cuando puedes:

- Responder ≥ 6 de las 8 preguntas del quiz sin consultar la teoría.
- Explicar en treinta segundos qué es Agent 365 sin caer en la confusión con CCS o Copilot Studio.
- Asignar un escenario nuevo a su stakeholder correcto (M365 / Entra / Purview / Defender).
- Resolver el caso de estudio de Plain Coffee SL sin consultar la solución.
