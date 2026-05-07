---
modulo: 5
tipo: quiz-practica
titulo: "Quiz de práctica del Módulo 05"
duracion_min: 12
umbral_aprobado_pct: 70
intentos_max: null
ultima_actualizacion: 2026-05-07
preguntas:
  - Q-05-1
  - Q-05-2
  - Q-05-3
  - Q-05-4
  - Q-05-5
caso_estudio: "Plain Coffee SL"
---

# Módulo 05 — Quiz de práctica

> Cinco preguntas para validar tu comprensión del proceso de configuración inicial del tenant. Intentos ilimitados, aprobado a partir del 70 %.

---

::: pregunta
id: Q-05-1
oa: OA-05.1
tipo: multiple-choice
dificultad: facil
bloom: Recordar
enunciado: |
  Estás a punto de activar Agent 365 en un tenant productivo y revisas el checklist de prerrequisitos. ¿Cuál de los siguientes elementos **NO** es prerrequisito para activar el workload?
opciones:
  - id: a
    texto: "Audit logs habilitados en el tenant."
  - id: b
    texto: "Licencias Agent 365 asignadas a los usuarios piloto."
  - id: c
    texto: "Un blueprint de identidad creado previamente en Entra Agent ID."
    correcta: true
  - id: d
    texto: "El admin que activa tiene rol Global Administrator o AI Administrator."
justificacion: |
  Crear un **blueprint de identidad** en Entra Agent ID es una tarea posterior a la activación: hace falta tener el workload activo para entrar a Entra Agent ID y crear el blueprint. Las opciones A, B y D sí son prerrequisitos: sin audit logs los eventos del workload no se persisten; sin licencias asignadas no hay quien invoque agentes; sin rol no se puede activar el workload. Saber qué viene **antes** y qué viene **después** de la activación evita ciclos de troubleshooting.
:::

::: pregunta
id: Q-05-2
oa: OA-05.2
tipo: scenario
dificultad: media
bloom: Analizar
enunciado: |
  Un compañero tuyo ha activado Agent 365 hace dos días siguiendo notas internas. Hoy el responsable de Defender informa de que **no recibe ningún evento de agentes** en CloudAppEvents pese a que los usuarios ya están invocando agentes desde Teams. Tú revisas el setup y todo lo demás (Registry visible, Purview DSPM activado, Terms of Service aceptados) parece correcto. ¿Cuál es el paso más probable que se ha saltado?
opciones:
  - id: a
    texto: "Aceptar Terms of Service del workload Agents (el compañero los aceptó hace dos días, así que están)."
  - id: b
    texto: "Configurar el Microsoft 365 connector en Defender for Cloud Apps. Sin él, Defender no ingiere telemetría del workload Agents."
    correcta: true
  - id: c
    texto: "Activar el toggle Frontier preview, sin el cual no se generan eventos."
  - id: d
    texto: "Asignar licencias Agent 365 a los usuarios (los usuarios invocan, luego ya tienen)."
justificacion: |
  El **conector M365 en Defender for Cloud Apps** es la pieza que activa la ingesta de telemetría del workload Agents en Defender XDR. Sin él, Defender no «ve» los agentes y CloudAppEvents queda vacío respecto al workload. Es uno de los pasos más fáciles de olvidar porque su síntoma no es un error visible al activar, sino la ausencia silenciosa de datos un par de días después. La opción A descarta el síntoma. La C confunde Frontier (es un toggle de visibilidad de capacidades preview). La D contradice el contexto.
:::

::: pregunta
id: Q-05-3
oa: OA-05.3
tipo: multiple-choice
dificultad: facil
bloom: Comprender
enunciado: |
  Al configurar el **Microsoft 365 connector** en Defender for Cloud Apps, ¿qué información agregada se vuelve disponible inmediatamente en Defender XDR?
opciones:
  - id: a
    texto: "El AI Agent Inventory consolidado (agentes M365 + agentes locales detectados como Shadow AI) y el riesgo asociado a cada agente."
    correcta: true
  - id: b
    texto: "Los blueprints de identidad de Entra Agent ID."
  - id: c
    texto: "Los sensitivity labels aplicados a archivos `.agent` en Purview."
  - id: d
    texto: "Las plantillas Custom de publishing creadas en M365 admin center."
justificacion: |
  El conector M365 en Defender activa específicamente el **AI Agent Inventory** y la valoración de **risk** de cada agente. Esta visibilidad es la base de la Risks column que aparece en M365 admin center y de las alertas Risky Agents. Las opciones B, C y D pertenecen a otros admin centers y no se ingieren a Defender vía este conector.
:::

::: pregunta
id: Q-05-4
oa: OA-05.4
tipo: multiple-choice
dificultad: media
bloom: Aplicar
enunciado: |
  Tras activar **DSPM for AI** en Microsoft Purview, ¿cuál de las siguientes capacidades pasa a estar disponible inmediatamente?
opciones:
  - id: a
    texto: "Un dashboard que mide qué porcentaje de los archivos `.agent` están etiquetados con sensitivity labels y la exposición de cada agente a datos sensibles."
    correcta: true
  - id: b
    texto: "El bloqueo automático de cualquier agente que acceda a datos confidenciales (auto-DLP)."
  - id: c
    texto: "La integración con Conditional Access para bloquear agentes con risk High."
  - id: d
    texto: "La generación automática del Compliance Manager template para EU AI Act sobre los agentes detectados."
justificacion: |
  DSPM for AI (Data Security Posture Management) entrega **visibilidad** sobre la exposición de los agentes a datos: dashboard de cobertura de labels, datos sensibles accedidos por cada agente, riesgos de oversharing. La opción B confunde DSPM (visibilidad) con DLP (bloqueo). La C confunde DSPM con Conditional Access (Entra). La D confunde DSPM con Compliance Manager (otro componente de Purview, requiere configuración separada). DSPM **muestra** posture; tomar acción requiere otras piezas (DLP, CA, Compliance Manager) que se configuran en módulos posteriores.
:::

::: pregunta
id: Q-05-5
oa: OA-05.5
tipo: drag-and-drop
dificultad: media
bloom: Aplicar
enunciado: |
  Empareja cada acción de **validación end-to-end** del setup con el admin center donde la verificarías.
items:
  - id: v1
    texto: "Confirmar que el agente de prueba aparece en el Agent Registry con su Type y Publisher correctos."
  - id: v2
    texto: "Confirmar que el agente de prueba aparece en AI Agent Inventory con su Risk score calculado."
  - id: v3
    texto: "Confirmar que el agente de prueba aparece en DSPM for AI con su exposición de datos visible."
  - id: v4
    texto: "Confirmar que la identidad del agente de prueba existe como objeto agent identity con su `appId`."
  - id: v5
    texto: "Confirmar que se puede aprobar un pending request del agente desde el wizard de publishing."
targets:
  - id: m365-admin
    label: "M365 admin center"
  - id: entra-admin
    label: "Entra admin center"
  - id: purview-admin
    label: "Microsoft Purview portal"
  - id: defender-admin
    label: "Microsoft Defender XDR"
correct_map:
  v1: m365-admin
  v2: defender-admin
  v3: purview-admin
  v4: entra-admin
  v5: m365-admin
justificacion: |
  La validación end-to-end consiste en **ver el mismo agente** desde los cuatro admin centers. Si el agente aparece en los cuatro con datos coherentes (Type/Publisher, Risk score, DSPM exposure, identity object), el setup está operativo de extremo a extremo. Si falta en alguno, el conector correspondiente está mal configurado. Es la prueba canónica para cerrar la fase de configuración antes de pasar al M06 (Entra Agent ID).
:::

---

## Caso de estudio (refuerzo, no evaluable)

> Tras responder el quiz, intenta completar este ejercicio antes de pasar a M06.

**Escenario.** Plain Coffee SL termina la fase de planificación (M03 cubrió licenciamiento, M04 cubrió delegación de roles). Luis Ortega (Admin M365 lead, con AI Administrator + Agent ID Administrator + Billing Administrator) tiene que activar Agent 365 en el tenant productivo el lunes a las 9:00. La organización ha decidido:

- Empezar con 50 licencias en RRHH como piloto.
- Activar Frontier preview para ver capacidades nuevas.
- Definir los conectores Defender y Purview en la primera ventana de cambio.
- Validar end-to-end con un agente de prueba del propio Luis antes de comunicar a RRHH.

**Tareas.**

1. Diseña el orden cronológico de los 6 pasos clave (de los 8 que viste en la teoría).
2. Identifica al menos dos puntos donde Luis podría dejar el setup incompleto sin error visible inmediato.
3. Define el criterio de éxito para abrir la puerta a los 50 usuarios de RRHH.

<details>
<summary>Ver solución sugerida</summary>

**1.** Orden cronológico:

1. Verificar prerrequisitos (licencias, audit logs, roles, network).
2. Activar Frontier toggle (M365 admin → Copilot → Settings).
3. Aceptar Terms of Service navegando a M365 admin → Agents.
4. Configurar Microsoft 365 connector en Defender for Cloud Apps.
5. Activar DSPM for AI en Microsoft Purview.
6. Lanzar agente de prueba propio y validar end-to-end en los 4 admin centers.

**2.** Puntos de fallo silencioso típicos:

- **Conector Defender no configurado** → Defender XDR no ingiere telemetría → Risks column queda vacía durante días sin error visible.
- **DSPM no activado** → Purview no mide exposición → no hay datos para Compliance Manager.
- **Audit logs no habilitados a nivel tenant** (raro pero posible) → eventos no se persisten en M365.

**3.** Criterio de éxito para abrir a RRHH:

- El agente de prueba aparece en los 4 admin centers (Registry, AI Agent Inventory, DSPM, Entra agent identity).
- El Risk score del agente de prueba es calculable (no «pending data»).
- Los logs de invocación del agente de prueba aparecen en CloudAppEvents.
- Luis puede aprobar y bloquear el agente de prueba sin error.
- Se ha publicado al equipo de RRHH la guía rápida de uso (es producto de adopción, no de IT).

Solo cuando los cinco se cumplen, Plain Coffee SL puede empezar la oleada de RRHH.
</details>
