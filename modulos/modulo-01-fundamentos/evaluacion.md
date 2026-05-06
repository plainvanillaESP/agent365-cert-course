# Módulo 01 — Evaluación

> Este módulo aporta **3 preguntas** a la evaluación final del curso (área 1: *Plan and configure Microsoft Agent 365*). Las preguntas están redactadas con calidad final y forman parte del banco oficial. Junto a cada pregunta se incluyen variantes de reformulación para evitar repetición entre cohortes.

---

## Preguntas oficiales del banco

### EX-01-001 · Multiple choice · Fácil

**OA mapeado:** OA-01.1 · **Área:** 1 · **Bloom:** Comprender

**Enunciado:**

Una compañía está evaluando Microsoft Agent 365 y Microsoft Copilot Studio para su estrategia de IA. ¿Cuál es la diferencia fundamental entre ambos productos?

A) Copilot Studio crea agentes y Agent 365 los gobierna; son productos complementarios, no alternativos.
B) Agent 365 reemplaza a Copilot Studio porque integra creación y gobernanza en una sola plataforma.
C) Copilot Studio se usa para agentes basados en Foundry; Agent 365 se usa para agentes basados en SharePoint.
D) Agent 365 es la versión empresarial de Copilot Studio con licencia E5.

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** A

**Justificación:** Microsoft Agent 365 es un control plane de gobernanza, observabilidad y seguridad. No crea agentes; gobierna los que ya existen, sin importar la plataforma de origen (Copilot Studio, Foundry, M365 Agents SDK, SharePoint, etc.). Es complementario, no competidor. Ver § 1.2 «Posicionamiento: control plane, no builder».

**Variantes para evitar repetición entre cohortes:**

- Cambiar Copilot Studio por Microsoft Foundry (misma respuesta).
- Reformular como *«¿Cuándo elegir uno u otro?»* exigiendo identificar casos de uso (sube de Comprender a Aplicar).
- Incluir el M365 Agents SDK o el Agent 365 SDK como tercer eje y construir un drag-and-drop.
- Cambiar la formulación del distractor B por *«Agent 365 incluye Copilot Studio dentro de su licencia E7»* (también falso, pero confunde por el bundling de E7).

</details>

---

### EX-01-002 · Escenario · Media

**OA mapeado:** OA-01.3 · **Área:** 1 · **Bloom:** Aplicar

**Enunciado:**

La directora de IT de Plain Coffee SL pregunta: *«Tenemos 800 empleados con licencia M365 Copilot. Algunos usuarios crean agentes con Agent Builder y los compañeros se quejan de que no saben qué pueden hacer ni si están aprobados por IT. Además, queremos limitar el tiempo que los empleados pasan usando Copilot Chat porque vemos un descenso en la productividad colaborativa.»*

¿Qué solución corresponde a cada problema?

A) Ambos problemas se resuelven con Microsoft Agent 365.
B) Ambos problemas se resuelven con Copilot Control System (CCS).
C) El primer problema se resuelve con Agent 365; el segundo con CCS.
D) El primer problema se resuelve con CCS; el segundo con Agent 365.

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** C

**Justificación:** Agent 365 gobierna a los **agentes**: el primer problema (inventariar agentes creados por usuarios, aprobarlos, hacerlos visibles) es exactamente su alcance. CCS gobierna a las **personas usando IA**: el segundo problema (uso de Copilot Chat por humanos, productividad colaborativa) corresponde a Copilot Analytics + Viva Insights, que viven en CCS. La respuesta D invierte el principio. Ver § 1.4 «Agent 365 vs Copilot Control System (CCS)».

**Variantes para evitar repetición entre cohortes:**

- Cambiar «Plain Coffee SL» por otra empresa ficticia con datos distintos (1.000 / 5.000 / 200 empleados).
- Cambiar el segundo problema por *«queremos saber qué departamentos generan más mensajes con Copilot»* (sigue siendo CCS).
- Cambiar el primer problema por *«necesitamos auditar qué documentos están usando los agentes»* (sigue siendo Agent 365, pero ahora vía Purview integrado).
- Reformular como tres problemas e introducir un tercero que exija combinación (p. ej. *«necesitamos saber cuánto cuestan los agentes por departamento»* → A365 + CCS).

</details>

---

### EX-01-003 · Drag-and-drop · Media

**OA mapeado:** OA-01.2 · **Área:** 1 · **Bloom:** Aplicar

**Enunciado:**

Empareja cada responsabilidad operativa con el stakeholder de Microsoft Agent 365 que la asume principalmente.

**Responsabilidades:**

1. Aplicar políticas de Conditional Access que bloqueen agentes con riesgo high.
2. Crear DLP policies que traten al `agent instance` como user.
3. Aprobar requests de agentes pendientes desde el wizard de publishing.
4. Investigar incidentes con KQL en la tabla `CloudAppEvents`.
5. Configurar lifecycle workflows para sponsorship transfer al manager.
6. Aplicar templates regulatorios (EU AI Act, ISO 42001) en Compliance Manager.

**Stakeholders:**

- M365 admin
- Entra admin
- Purview admin
- Defender admin

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:**

| Responsabilidad | Stakeholder |
|---|---|
| 1. Conditional Access para bloqueo por agent risk high | **Entra admin** |
| 2. DLP policies con agent instance como user | **Purview admin** |
| 3. Aprobación de requests de agentes desde el wizard de publishing | **M365 admin** |
| 4. Hunting con KQL en `CloudAppEvents` | **Defender admin** |
| 5. Lifecycle workflows + sponsorship transfer | **Entra admin** |
| 6. Templates regulatorios en Compliance Manager | **Purview admin** |

**Justificación:** El examen verifica que el alumno entiende qué admin center ejecuta cada acción operativa de gobernanza de agentes. CA y lifecycle workflows viven en Microsoft Entra (Entra Agent ID). DLP y Compliance Manager viven en Microsoft Purview. El wizard de publishing y la aprobación de requests viven en Microsoft 365 admin center. KQL hunting vive en Microsoft Defender XDR. Ver § 1.3 «Los cuatro stakeholders core».

**Variantes para evitar repetición entre cohortes:**

- Aumentar a 8 responsabilidades incluyendo: «Configurar el Microsoft 365 connector» (Defender), «Habilitar DSPM for AI» (Purview), «Pin un agente al slot Administrator» (M365 admin).
- Cambiar al formato multiple-response: *«¿Cuáles de estas responsabilidades viven en Microsoft Entra?»*.
- Añadir el quinto stakeholder *«Power Platform admin»* con responsabilidades de Copilot Studio governance.
- Convertir a ordenamiento: *«ordena las acciones por el orden cronológico de un proceso de aprobación de un agente nuevo»*.

</details>

---

## Caso de estudio (refuerzo)

> El caso de estudio no se evalúa pero refuerza la comprensión integral. Recomendado tras leer la teoría y antes de pasar al Módulo 02.

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

El alumno está listo para avanzar al Módulo 02 cuando puede:

- [ ] Responder correctamente las 3 preguntas oficiales sin consultar la teoría.
- [ ] Explicar en treinta segundos qué es Agent 365 sin caer en la confusión con CCS o Copilot Studio.
- [ ] Asignar un escenario nuevo a su stakeholder correcto (M365 / Entra / Purview / Defender).
- [ ] Resolver el caso de estudio de Plain Coffee SL sin consultar la solución.
