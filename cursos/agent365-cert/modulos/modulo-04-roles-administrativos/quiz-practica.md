---
modulo: 4
tipo: quiz-practica
titulo: "Quiz de práctica del Módulo 04"
duracion_min: 10
umbral_aprobado_pct: 70
intentos_max: null
ultima_actualizacion: 2026-05-07
preguntas:
  - Q-04-1
  - Q-04-2
  - Q-04-3
  - Q-04-4
  - Q-04-5
caso_estudio: "Plain Coffee SL"
---

# Módulo 04 — Quiz de práctica

> Cinco preguntas para validar tu comprensión de los roles administrativos, la delegación least-privilege y el ciclo de aprovisionamiento de roles. Intentos ilimitados, aprobado a partir del 70 %.

---

::: pregunta
id: Q-04-1
oa: OA-04.1
tipo: scenario
dificultad: media
bloom: Aplicar
enunciado: |
  Marta del equipo de **Adopción** de tu empresa necesita: ver el inventario completo de agentes en el Registry, configurar plantillas de publishing Custom para distintos departamentos y aprobar pending requests cuando llegan. **NO** debe poder modificar roles, ni tocar políticas Defender o Purview. ¿Qué rol mínimo le asignas?
opciones:
  - id: a
    texto: "Global Administrator. Es la opción más rápida."
  - id: b
    texto: "AI Administrator. Permite gestionar plantillas, aprobar requests y leer todo el Registry. NO incluye modificación de roles ni controles de Defender/Purview."
    correcta: true
  - id: c
    texto: "AI Reader + Cloud Application Administrator. Para leer el Registry y aprobar requests."
  - id: d
    texto: "Privileged Role Administrator. Es necesario para gestionar plantillas porque las plantillas son políticas."
justificacion: |
  **AI Administrator** es exactamente el rol diseñado para el perfil descrito: gestión completa del workload Agents (Registry, plantillas, aprobaciones) sin tocar identidad ni roles ni datos. La opción A sobreasigna privilegio (antipatrón). La C confunde: AI Reader no permite aprobar requests, y Cloud Application Administrator es un rol de Entra apps/SP no relacionado con plantillas. La D inventa: Privileged Role Administrator es para gestionar elegibilidades PIM, no plantillas.
:::

::: pregunta
id: Q-04-2
oa: OA-04.2
tipo: multiple-choice
dificultad: facil
bloom: Comprender
enunciado: |
  ¿Cuál de las siguientes afirmaciones describe correctamente la diferencia entre **AI Administrator** y **AI Reader**?
opciones:
  - id: a
    texto: "AI Administrator escribe (gestiona plantillas, aprueba/bloquea agentes, configura settings); AI Reader solo lee (consulta Registry, Map, métricas)."
    correcta: true
  - id: b
    texto: "AI Administrator es full admin del tenant, AI Reader es lectura del tenant entero."
  - id: c
    texto: "AI Administrator gestiona Microsoft Entra Agent ID; AI Reader gestiona el Agent Registry."
  - id: d
    texto: "AI Administrator gestiona producción; AI Reader gestiona Frontier preview."
justificacion: |
  La separación es **escritura vs lectura** dentro del workload Agents (no del tenant entero). AI Administrator hace acciones (publish, approve, block, pin, plantillas, settings); AI Reader solo lee. La opción B confunde con Global Admin/Global Reader. La C inventa un reparto que no existe (Entra Agent ID lo gobierna **Agent ID Administrator**, otro rol distinto). La D inventa una distinción por entorno.
:::

::: pregunta
id: Q-04-3
oa: OA-04.3
tipo: scenario
dificultad: media
bloom: Crear
enunciado: |
  Necesitas diseñar la **delegación de Agent 365** en una empresa donde existen tres equipos con responsabilidades diferenciadas:

  - **Adopción**: 3 personas que aprueban agentes y gestionan plantillas.
  - **Seguridad**: 2 personas que monitorizan alertas Defender y pueden bloquear agentes ante incidentes.
  - **Compliance**: 2 personas que auditan políticas Purview y configuran sensitivity labels.

  ¿Qué combinación de roles aplica el principio de **separation of duties** correctamente?
opciones:
  - id: a
    texto: "A todos: Global Administrator. Es lo más operativo."
  - id: b
    texto: "Adopción → AI Administrator. Seguridad → Security Operator + AI Administrator (para bloquear). Compliance → Compliance Administrator (Purview) + AI Reader."
    correcta: true
  - id: c
    texto: "Adopción → AI Reader. Seguridad → Security Reader. Compliance → Compliance Reader. Todos en lectura para no romper nada."
  - id: d
    texto: "Adopción → AI Administrator + Security Administrator + Compliance Administrator. Seguridad y Compliance → AI Reader."
justificacion: |
  Separation of duties exige que cada equipo tenga el privilegio de su dominio sin invadir los demás:

  - **Adopción** → AI Administrator (suficiente para su responsabilidad).
  - **Seguridad** → Security Operator (Defender investigation/response) + AI Administrator (necesario para bloquear agentes ante incidente). Aquí es legítimo dar AI Administrator.
  - **Compliance** → Compliance Administrator (Purview) + AI Reader (para correlacionar agentes con políticas Purview, sin escritura sobre ellos).

  La opción A es el antipatrón Global Admin. La C incapacita a todos los equipos. La D acumula privilegios en Adopción que no son de su dominio.
:::

::: pregunta
id: Q-04-4
oa: OA-04.4
tipo: multiple-choice
dificultad: facil
bloom: Recordar
enunciado: |
  Tu compañero de IT pregunta desde dónde tiene que asignar el rol **AI Administrator** a un nuevo miembro del equipo de Adopción. ¿Qué le respondes?
opciones:
  - id: a
    texto: "Solo desde Microsoft Entra admin center → Roles & administrators."
  - id: b
    texto: "Solo desde Microsoft 365 admin center → Roles → Agent 365."
  - id: c
    texto: "Se puede desde **ambos**: Microsoft 365 admin center y Microsoft Entra admin center. Las dos rutas asignan exactamente el mismo rol Entra subyacente."
    correcta: true
  - id: d
    texto: "Solo desde el portal de Azure (portal.azure.com) usando Privileged Identity Management."
justificacion: |
  El **mismo rol Entra** se puede asignar desde dos UIs diferentes: M365 admin center (Roles) y Entra admin center (Roles & administrators). Ambas escriben sobre el mismo objeto subyacente. PIM (la opción D) es para hacer la asignación **just-in-time elegible** en lugar de permanente, pero también utiliza ese mismo rol Entra. Saber que las dos UIs convergen evita tickets de soporte cuando un compañero «no encuentra» dónde asignar.
:::

::: pregunta
id: Q-04-5
oa: OA-04.1
tipo: drag-and-drop
dificultad: media
bloom: Aplicar
enunciado: |
  Empareja cada tarea con el **rol mínimo** que la cubre.
items:
  - id: t1
    texto: "Aprobar un pending request de un agente nuevo en el wizard de publishing."
  - id: t2
    texto: "Configurar una blueprint de identidad en Entra Agent ID."
  - id: t3
    texto: "Investigar una alerta de Defender XDR sobre un agente comprometido."
  - id: t4
    texto: "Aplicar una sensitivity label sobre un archivo `.agent` en Purview."
  - id: t5
    texto: "Consultar el Registry y exportarlo a Excel sin modificar nada."
targets:
  - id: ai-admin
    label: "AI Administrator"
  - id: agent-id-admin
    label: "Agent ID Administrator"
  - id: sec-op
    label: "Security Operator"
  - id: compl-admin
    label: "Compliance Administrator"
  - id: ai-reader
    label: "AI Reader"
correct_map:
  t1: ai-admin
  t2: agent-id-admin
  t3: sec-op
  t4: compl-admin
  t5: ai-reader
justificacion: |
  Cada tarea tiene su rol mínimo:

  - **Aprobar requests** → AI Administrator.
  - **Configurar blueprint** → Agent ID Administrator (rol específico de Entra Agent ID, distinto de AI Administrator).
  - **Investigar alerta Defender** → Security Operator.
  - **Aplicar sensitivity label** → Compliance Administrator (Purview).
  - **Leer y exportar Registry** → AI Reader (lectura sin escritura).

  La trampa más frecuente: **Agent ID Administrator** y **AI Administrator** suenan parecido pero son roles distintos. El primero gestiona identidades de agente en Entra; el segundo gestiona el workload Agents en M365. Esta separación es justamente la base del principio de separation of duties dentro de Agent 365.
:::

---

## Caso de estudio (refuerzo, no evaluable)

> Tras responder el quiz, intenta completar este ejercicio antes de pasar a M05.

**Escenario.** Plain Coffee SL ha pasado de un piloto inicial de Agent 365 (50 licencias en RRHH) a un despliegue corporativo (500 licencias: 350 Operaciones + 50 RRHH + 100 Finanzas). El equipo IT crece y se decide formalizar el modelo de delegación con tres roles por equipo (Adopción, Seguridad, Compliance) más una capa de gobierno superior con dos personas en PIM elegible.

**Tarea.** Diseña la matriz de roles de los **siete miembros** del equipo IT, aplicando least-privilege y separation of duties. Indica para cada uno qué roles asignarías y cuáles dejarías como elegibles via PIM.

<details>
<summary>Ver solución sugerida</summary>

| Persona | Equipo | Roles permanentes | Roles PIM elegibles |
|---|---|---|---|
| Luis | Gobierno IT | Cloud Application Administrator (para conectores) | Global Administrator (incidente crítico) |
| Marta | Gobierno IT | AI Reader (visión global) | AI Administrator + Agent ID Administrator (escalado) |
| Adopción 1 | Adopción | AI Administrator | — |
| Adopción 2 | Adopción | AI Administrator | — |
| Adopción 3 | Adopción | AI Reader | AI Administrator (rotación de aprobaciones) |
| Seguridad 1 | Seguridad | Security Operator + AI Administrator | — |
| Seguridad 2 | Seguridad | Security Operator + AI Reader | AI Administrator (bloqueo emergencia) |
| Compliance 1 | Compliance | Compliance Administrator + AI Reader | — |
| Compliance 2 | Compliance | Compliance Administrator + AI Reader | — |

Principio aplicado: **escritura mínima por permanente**, **escritura escalable por PIM elegible** con justificación + MFA + ventana temporal. Global Administrator solo elegible vía PIM y nunca permanente, ni siquiera para gobierno IT.
</details>
