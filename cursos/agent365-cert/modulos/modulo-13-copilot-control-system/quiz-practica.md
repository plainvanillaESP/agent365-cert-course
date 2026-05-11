---
modulo: 13
tipo: quiz-practica
titulo: "Quiz de práctica del Módulo 13"
duracion_min: 12
umbral_aprobado_pct: 70
intentos_max: null
ultima_actualizacion: 2026-05-11
preguntas:
  - Q-13-1
  - Q-13-2
  - Q-13-3
  - Q-13-4
  - Q-13-5
caso_estudio: "Telefónica"
---

# Módulo 13 — Quiz de práctica

> Cinco preguntas para validar tu comprensión de Copilot Control System integrado con Agent 365: posicionamiento, superficies operativas, modelos de política, diferenciación con Defender XDR y Purview, operación del día a día. Intentos ilimitados, aprobado a partir del 70 % (4 de 5 correctas).
>
> Las cinco preguntas usan los cinco tipos canónicos del paquete (multiple-choice, multiple-response, scenario, drag-and-drop, ordering) para cubrir los cinco OAs del módulo.

---

::: pregunta
id: Q-13-1
oa: OA-13.1
tipo: multiple-choice
dificultad: facil
bloom: Comprender
enunciado: |
  Un nuevo Director de IA pregunta «si ya tenemos Microsoft 365 admin center, Microsoft Entra admin center, Microsoft Defender XDR y Microsoft Purview, ¿qué aporta Copilot Control System?». ¿Cuál es la respuesta más precisa?
opciones:
  - id: a
    texto: "CCS sustituye a los otros cuatro portales con una interfaz moderna unificada."
  - id: b
    texto: "CCS es un **panel unificado de gobernanza operativa** específico para Copilot 365 y agentes Agent 365. Agrega las vistas críticas de los otros productos con público objetivo distinto: responsables de transformación digital, CIOs, COOs y directores de IA, no admins técnicos. No sustituye, complementa con vistas agregadas, narrativas y palancas operativas para no-técnicos."
    correcta: true
  - id: c
    texto: "CCS es solo un dashboard de telemetría sin capacidad de acción."
  - id: d
    texto: "CCS es la consola del SOC y reemplaza a Defender XDR para investigación."
justificacion: |
  La opción B captura el posicionamiento didáctico clave: público objetivo distinto. Los portales originales están diseñados para roles técnicos (admins M365, analistas SOC, oficiales de cumplimiento). CCS añade una capa específica para ejecutivos y responsables de transformación que necesitan vistas agregadas y narrativas sin tener que entender la mecánica técnica subyacente. La A es falsa (CCS no sustituye); la C subestima sus capacidades de acción; la D confunde roles (Defender XDR sigue siendo el portal del SOC).
:::

::: pregunta
id: Q-13-2
oa: OA-13.2
tipo: drag-and-drop
dificultad: facil
bloom: Recordar
enunciado: |
  Empareja cada **superficie operativa de Copilot Control System** con la pregunta de negocio que responde.
items:
  - id: s1
    texto: "License management"
  - id: s2
    texto: "Agent governance"
  - id: s3
    texto: "Data governance integration"
  - id: s4
    texto: "Telemetry"
targets:
  - id: t1
    label: "¿Quién tiene Copilot 365 / acceso a agentes y cómo se distribuye el coste?"
  - id: t2
    label: "¿Qué agentes pueden usarse, por quién y bajo qué condiciones?"
  - id: t3
    label: "¿Qué datos pueden tocar los agentes y con qué protección?"
  - id: t4
    label: "¿Qué uso real están haciendo los usuarios y los agentes?"
correct_map:
  s1: t1
  s2: t2
  s3: t3
  s4: t4
justificacion: |
  Las cuatro superficies de CCS responden a cuatro preguntas operativas distintas que cualquier responsable ejecutivo de IA debe poder contestar en su día a día. License management cubre el «¿quién lo tiene y cuánto cuesta?», Agent governance el «¿qué pueden usar?», Data governance integration el «¿qué datos pueden tocar?», y Telemetry el «¿qué uso están haciendo?». Memorizar este mapeo es la base para navegar el portal con eficacia.
:::

::: pregunta
id: Q-13-3
oa: OA-13.3
tipo: scenario
dificultad: media
bloom: Aplicar
enunciado: |
  Una entidad bancaria mediana acaba de comprar Copilot 365 y empieza el despliegue. El Director de Tecnología debate con Compliance qué modelo de política aplicar inicialmente. ¿Cuál es la decisión correcta y por qué?
opciones:
  - id: a
    texto: "**Open catalog**: permitir todos los agentes desde el inicio para acelerar la adopción."
  - id: b
    texto: "**Approval-based**: cualquier acceso a un agente nuevo requiere ticket. Es el modelo recomendado para organizaciones reguladas o en fases iniciales de adopción, permite construir confianza y aprender los patrones de uso reales antes de relajar el control."
    correcta: true
  - id: c
    texto: "Sin política: la responsabilidad recae en cada usuario."
  - id: d
    texto: "Curated catalog desde día uno sin pasar por Approval-based."
justificacion: |
  La opción B es la decisión canónica: una entidad bancaria (regulada) en fase inicial de adopción debe empezar en Approval-based. El modelo Open (A) expone a la organización a riesgo regulatorio antes de tener visibilidad operativa real. La C abdica de la responsabilidad de gobernanza. La D es operativamente prematuro: Curated requiere ya conocer qué agentes son legítimos para qué departamento, y eso solo se aprende tras 3-6 meses en Approval-based. La evolución natural es Approval-based → Curated → (raramente) Open según madurez.
:::

::: pregunta
id: Q-13-4
oa: OA-13.4
tipo: multiple-response
dificultad: media
bloom: Analizar
enunciado: |
  Una organización tiene CCS, Defender XDR y Purview operativos. ¿En cuál de los siguientes escenarios el portal primario correcto es Copilot Control System? Selecciona todos los que apliquen.
opciones:
  - id: a
    texto: "El CIO necesita ver cuántas licencias Copilot tiene asignadas Marketing-Europe y cuál es la utilización."
    correcta: true
  - id: b
    texto: "El SOC tier 2 está investigando un incident donde un agente accedió a 50 archivos `Confidential` en 30 minutos."
  - id: c
    texto: "El responsable de gobernanza de IA quiere bloquear el acceso del agente `Comercial-PriceBot` para el grupo Marketing."
    correcta: true
  - id: d
    texto: "Compliance necesita aplicar sensitivity label `Highly Confidential` a un blueprint específico."
  - id: e
    texto: "El director de IA prepara el reporte mensual para el comité de gobernanza con métricas de adopción."
    correcta: true
  - id: f
    texto: "Legal necesita extraer evidencia forense de los accesos del agente en respuesta a una solicitud regulatoria."
justificacion: |
  Las opciones A, C y E son correctas: License management (A), Agent governance (C) y Telemetry/Reporting (E) son las superficies nativas de CCS y donde la operación debe vivir. Las B, D y F son escenarios donde el portal correcto es otro: B → Defender XDR (incident investigation con KQL y timeline), D → Purview (Information Protection para crear/aplicar sensitivity labels), F → Purview (eDiscovery Premium para evidencia forense con cadena de custodia). Hacer estas operaciones desde CCS produce limitaciones funcionales o resultados incompletos.
:::

::: pregunta
id: Q-13-5
oa: OA-13.5
tipo: ordering
dificultad: media
bloom: Aplicar
enunciado: |
  Ordena las **actividades del ritual semanal** del responsable de gobernanza de IA en CCS, desde la primera acción del lunes por la mañana hasta la última.
items:
  - id: o1
    texto: "Revisar license utilization e identificar usuarios con licencia y uso < 5 invocaciones/mes para reasignación"
  - id: o2
    texto: "Revisar Top agents this week y validar que los movimientos en el ranking son esperados"
  - id: o3
    texto: "Revisar policy compliance por grupo e investigar grupos con compliance < 95 %"
  - id: o4
    texto: "Revisar pending approvals y escalar tickets > 72 h"
  - id: o5
    texto: "Marcar anomalías evidentes en Telemetry para revisión del SOC vía Defender XDR"
correct_order:
  - o1
  - o2
  - o3
  - o4
  - o5
justificacion: |
  El orden refleja la secuencia natural del ritual semanal de 30-45 min: empezar por lo fácilmente accionable (licencias infrautilizadas son reasignaciones limpias, O1), seguir por la novedad de la semana (agentes que suben en el ranking, O2), validar el cumplimiento agregado (O3), atender los bloqueos operativos pendientes (approvals atrasados, O4), y finalmente marcar lo que requiere otra disciplina (telemetría anómala para el SOC, O5). El orden alternativo (empezar por O5) produce horas perdidas siguiendo señales que el SOC debería investigar antes que el responsable de gobernanza.
:::

---

## Caso de estudio (refuerzo, no evaluable)

> Tras responder el quiz, intenta este ejercicio antes de pasar a M14.

**Escenario.** **Telefónica** (97.000 empleados, operación internacional con presencia en 12 países, M365 E5 completo, Agent 365 en producción para 12.000 usuarios). El CIO Global te pide diseñar el **calendario operativo anual de gobernanza de IA** apoyándose en CCS como herramienta principal, articulado con Defender XDR y Purview en sus respectivos roles. El calendario debe servir para 2026 y los siguientes años con ajustes anuales.

**Tareas.**

1. Diseña el **calendario anual** con sus rituales: semanal, mensual, trimestral, anual.
2. Para cada ritual, identifica: propietario, audiencia, duración típica, fuente principal (CCS / Defender XDR / Purview).
3. Define los **3 KPIs ejecutivos** que se reportan al Consejo de Administración una vez al año basados en datos de CCS.
4. Diseña el **plan de evolución** del modelo de política (Approval-based → Curated → Open) con criterios objetivos para cada transición.

<details>
<summary>Ver solución sugerida</summary>

**1. Calendario operativo anual.**

| Cadencia | Ritual | Duración |
|---|---|---|
| Semanal (lunes) | Triaje de gobernanza de IA | 30-45 min |
| Mensual | Comité de gobernanza de IA | 60 min |
| Trimestral | Revisión de políticas y plan de evolución | 90 min |
| Anual | Revisión estratégica al Consejo + renegociación licencias Microsoft | 120 min |

**2. Detalle de cada ritual.**

| Ritual | Propietario | Audiencia | Fuente principal |
|---|---|---|---|
| Triaje semanal | Responsable gobernanza IA | Solo él/ella + asistente | CCS (License, Telemetry, Compliance) |
| Comité mensual | Responsable gobernanza IA | CIO, CFO, CISO, directores de área | CCS (reporte auto) + Defender XDR (incidents) + Purview (compliance) |
| Revisión trimestral políticas | Comité de gobernanza | Mismo que comité mensual | CCS (compliance rates 3 meses) + datos del negocio |
| Revisión anual | CIO Global | Consejo de Administración | CCS (KPIs anuales) + Defender XDR (incidents anuales) + Purview (regulatory) |

**3. Tres KPIs ejecutivos al Consejo.**

1. **Adopción efectiva**: % de empleados activos en Copilot/agentes cada mes (DAU mensualizado). Target 2026: > 60 %.
2. **Postura de cumplimiento**: % invocaciones dentro de política. Target: > 97 %.
3. **Eficiencia económica**: Coste por usuario activo (Total / DAU). Target: en línea con benchmark sector telco según informe McKinsey/Gartner.

**4. Plan de evolución del modelo de política.**

| Fase | Modelo | Criterio de transición a siguiente fase | Duración esperada |
|---|---|---|---|
| 1 | **Approval-based** | 3 meses operando + compliance rate > 95 % + < 5 tickets/semana | 3-6 meses |
| 2 | **Curated catalog** | 6 meses adicionales + 80 % cobertura de los grupos + visibilidad clara de patrones de uso | 12-24 meses |
| 3 | **Open catalog** | (Opcional, no obligatorio) Solo si la organización demuestra madurez avanzada: compliance > 99 %, cero incidentes graves 12 meses consecutivos, cultura interna de IA madura | Indefinido |

Telefónica, por su naturaleza regulada y dimensión internacional, probablemente nunca pase de Curated. Open queda como aspiracional para organizaciones pequeñas o de cultura tech radical. La evolución se valida con datos en cada revisión trimestral.

</details>
