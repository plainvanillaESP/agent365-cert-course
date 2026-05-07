---
spec_version: "1.0"
tipo: banco-examen
curso: agent365-cert
total_preguntas_objetivo: 60
total_preguntas_actuales: 3
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
| M02 — Arquitectura | 3 | Pendiente migración |
| M03 — Licenciamiento | 1 | Pendiente migración |
| M04 — Roles administrativos | 1 | Pendiente migración |
| M05 — Configuración inicial | 1 | Pendiente migración |
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
