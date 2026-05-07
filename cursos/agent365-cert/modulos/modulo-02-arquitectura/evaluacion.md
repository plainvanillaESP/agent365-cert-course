---
modulo: 2
tipo: evaluacion
titulo: "Evaluación del Módulo 02"
area_examen: 1
estado: producido
fase_produccion: 3
ultima_actualizacion: 2026-05-06
preguntas_oficiales:
  - EX-02-001
  - EX-02-002
  - EX-02-003
---

# Módulo 02 — Evaluación

> Este módulo aporta **3 preguntas** al examen final del curso (área 1: *Plan and configure Microsoft Agent 365*). Las preguntas están redactadas con calidad final y forman parte del banco oficial.

---

## Preguntas oficiales del banco

### EX-02-001 · Drag-and-drop · Media

**OA mapeado:** OA-02.1 · **Área:** 1 · **Bloom:** Aplicar

**Enunciado:**

Empareja cada componente arquitectónico de Microsoft Agent 365 con el admin center donde un administrador lo gestiona principalmente.

**Componentes:**

1. Agent Registry y Agent Map.
2. Conditional Access para agentes con grant Block.
3. DSPM for AI y Compliance Manager.
4. Tabla `CloudAppEvents` para hunting con KQL.
5. Lifecycle workflows con sponsorship transfer al manager.
6. Wizard de publishing y aprobación de requests.

**Admin centers:**

- Microsoft 365 admin center
- Microsoft Entra admin center
- Microsoft Purview portal
- Microsoft Defender XDR

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:**

| Componente | Admin center |
|---|---|
| 1. Agent Registry y Agent Map | **Microsoft 365 admin center** |
| 2. Conditional Access para agentes | **Microsoft Entra admin center** |
| 3. DSPM for AI y Compliance Manager | **Microsoft Purview portal** |
| 4. `CloudAppEvents` con KQL | **Microsoft Defender XDR** |
| 5. Lifecycle workflows con sponsorship | **Microsoft Entra admin center** |
| 6. Wizard de publishing | **Microsoft 365 admin center** |

**Justificación:** la arquitectura distribuida de Agent 365 reparte la gobernanza en cuatro admin centers. Registry, Map y wizard de publishing viven en M365 admin center. Conditional Access y lifecycle workflows viven en Entra (porque dependen de la identidad). DSPM y Compliance Manager viven en Purview. KQL hunting vive en Defender. Saber a qué admin center ir es la primera competencia operativa del curso. Ver § 2.1.

**Variantes para evitar repetición entre cohortes:**

- Aumentar a 8 componentes incluyendo: «Risks column en la página de detalle» (M365 admin center con visibilidad heredada de Defender), «AI Agent Inventory» (Defender), «sensitivity labels para .agent files» (Purview).
- Convertir a multiple-response: *«¿Cuáles de estos componentes viven en Microsoft Entra?»*.
- Reformular como ordenamiento: ordenar las acciones del proceso de aprobación de un agente nuevo según el admin center donde ocurren.

</details>

---

### EX-02-002 · Multiple choice · Media

**OA mapeado:** OA-02.2 · **Área:** 1 · **Bloom:** Analizar

**Enunciado:**

Un desarrollador comenta que su equipo va a desplegar varios «agentes Microsoft Agents Toolkit» en el tenant. Una arquitecta IT pregunta cómo aparecerán esos agentes en el Agent Registry de Microsoft 365 admin center. ¿Cuál es la respuesta correcta?

A) Aparecerán como tipo «Agent Toolkit», una novena categoría además de los 8 tipos estándar.
B) No aparecerán en el Registry hasta que se conviertan a Agent Builder.
C) Aparecerán como uno de los 8 tipos estándar (típicamente MCS CEA o Foundry) según cómo se haya configurado el deploy; Agent Toolkit es la herramienta de desarrollo, no un tipo de registro.
D) Aparecerán como tipo «SharePoint agent» porque Toolkit despliega los agentes a una librería SharePoint.

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** C

**Justificación:** el Microsoft 365 Agents Toolkit es una **extensión de Visual Studio Code** para construir agentes pro-code conversacionales. No es un tipo de agente en sí: el agente que produce se registra como uno de los 8 tipos estándar (lo más común, MCS CEA o Foundry) según el target del deploy. La opción A confunde herramienta con tipo. La B es inventada. La D mezcla SharePoint agents (que son `.agent files` en una librería) con el Toolkit (que es un IDE plugin). Ver § 2.3.

**Variantes para evitar repetición entre cohortes:**

- Cambiar el sujeto a *«Agent Builder»* o a *«SharePoint agent»* y preguntar por sus implicaciones de gobernanza diferenciales.
- Pedir identificar **qué columna del Registry** distingue mejor entre los 8 tipos (columna *Type*) frente a la columna *Publisher* (que captura algo distinto).
- Convertir a multiple-response: *«¿Cuáles de estos NO son tipos de agente del Registry?»* incluyendo Agent Toolkit, blueprint, sponsor, agent identity como distractores.

</details>

---

### EX-02-003 · Multiple choice · Fácil

**OA mapeado:** OA-02.1 · **Área:** 1 · **Bloom:** Comprender

**Enunciado:**

Un partner tecnológico presenta un agente y dice que «usa el Microsoft Agents SDK para gobernarlo». ¿Qué debería responder un administrador IT con criterio?

A) «Perfecto, entonces ya está cubierto por Agent 365.»
B) «Esa frase es ambigua: hay dos SDKs distintos. El Microsoft 365 Agents SDK es transporte conversacional; el Microsoft Agent 365 SDK es el que gobierna. Necesito saber cuál de los dos.»
C) «El Microsoft Agents SDK no existe; está confundiendo nombres de productos.»
D) «Da igual cuál de los dos, porque ambos hacen lo mismo desde la unificación de SDKs en mayo de 2026.»

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** B

**Justificación:** la confusión entre los dos SDKs es uno de los errores más comunes en conversaciones con desarrolladores y partners. Microsoft 365 Agents SDK (paquete `@microsoft/agents`) cubre el transporte conversacional: recibir mensajes en Teams, Slack, Copilot. Microsoft Agent 365 SDK (paquete `@microsoft/agent365`) cubre la gobernanza: identidad Entra, telemetría OpenTelemetry, acceso a Work IQ MCP. Solo el segundo «gobierna» en el sentido de Agent 365. La opción A acepta una afirmación ambigua sin verificar. La C niega una realidad (los dos SDKs existen). La D inventa una unificación que no ha ocurrido. Ver § 2.6 y § 1.2.

**Variantes para evitar repetición entre cohortes:**

- Reformular como escenario con código: presentar dos snippets `npm install @microsoft/agents` y `npm install @microsoft/agent365` y pedir identificar qué cubre cada uno.
- Convertir a drag-and-drop: emparejar capacidades (transporte conversacional, identidad Entra, telemetría OpenTelemetry, acceso MCP, multi-canal) con el SDK que las aporta.
- Cambiar el contexto a una RFP de partner donde el cliente tiene que pedir aclaración.

</details>

---

## Caso de estudio (refuerzo)

> El caso de estudio no se evalúa pero refuerza la comprensión integral. Recomendado tras leer la teoría y antes de pasar al Módulo 03.

**Escenario:**

La consultora Plain Coffee SL acaba de activar Microsoft Agent 365 Frontier preview. La directora de IT pide al equipo de seguridad que prepare un documento de una página, dirigido al comité directivo, explicando dónde van a configurar las distintas piezas del producto. La estructura del documento ya está fijada: una sección por cada admin center implicado.

**Tareas:**

1. Lista los cuatro admin centers que habrá que mencionar en el documento, con dos componentes concretos que cada uno gobierna.
2. Identifica el componente que **no** vive en ningún admin center clásico y explica dónde reside en realidad.
3. Recomienda el orden en el que los administradores deberían aprender los cuatro admin centers durante el roll-out, con una justificación corta.

<details>
<summary>Ver solución sugerida</summary>

**1.**

| Admin center | Componentes |
|---|---|
| Microsoft 365 admin center | Agent Registry, Agent Map, hero metrics, wizard de publishing, 11 acciones de ciclo de vida. |
| Microsoft Entra admin center | 4 tipos de objetos Agent ID (blueprint, blueprint principal, agent identity, agent user), Conditional Access para agentes, lifecycle workflows. |
| Microsoft Purview portal | DSPM for AI, AI observability, DLP con `agent instance` como user, Compliance Manager con templates regulatorios. |
| Microsoft Defender XDR | Tabla `CloudAppEvents` con 5 ActionTypes nuevas, real-time protection, AI Agent Inventory, detección de Shadow AI. |

**2.** Los **Work IQ MCP servers** y el **Agent 365 SDK + CLI** son componentes nuevos que no viven en ningún admin center clásico. Los MCP servers son endpoints gestionados por Microsoft que los agentes consumen en runtime (no los administra el cliente directamente). El SDK + CLI vive en npm y se integra desde el código de los agentes; el administrador no lo configura, lo verifica indirectamente a través del Run-time hero metric.

**3.** Orden recomendado:

1. **M365 admin center primero** (Registry, Map, Overview): es el dashboard del día a día. Sin esto no se sabe qué hay en el tenant.
2. **Entra admin center segundo** (Agent ID): la identidad es el cimiento de todo lo demás. Si los agentes no están identificados, ni Purview ni Defender pueden gobernarlos correctamente.
3. **Purview tercero** (DSPM, DLP, sensitivity labels): la protección de datos requiere que la identidad esté en su sitio.
4. **Defender cuarto** (CloudAppEvents, real-time protection): la monitorización es la última capa, porque depende de tener datos que monitorizar.

</details>

---

## Validación de aprendizaje

El alumno está listo para avanzar al Módulo 03 cuando puede:

- [ ] Dibujar el diagrama macro del § 2.1 sin notas y nombrar los seis bloques.
- [ ] Listar los 8 tipos de agentes gestionables y diferenciar los que son de creación (MCS, Foundry, Agent Builder, SharePoint) de la marca Agent instance.
- [ ] Explicar la diferencia entre los dos SDKs en una sola frase.
- [ ] Asignar correctamente un componente a su admin center sin titubear.
