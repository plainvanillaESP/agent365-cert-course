---
modulo: 3
tipo: quiz-practica
titulo: "Quiz de práctica del Módulo 03"
duracion_min: 12
umbral_aprobado_pct: 70
intentos_max: null
ultima_actualizacion: 2026-05-07
preguntas:
  - Q-03-1
  - Q-03-2
  - Q-03-3
  - Q-03-4
  - Q-03-5
  - Q-03-6
caso_estudio: "ContosoFinance"
---

# Módulo 03 — Quiz de práctica

> Seis preguntas para validar tu comprensión del licenciamiento, los prerrequisitos y la planificación de Agent 365. Intentos ilimitados, aprobado a partir del 70 %.

---

::: pregunta
id: Q-03-1
oa: OA-03.1
tipo: scenario
dificultad: media
bloom: Evaluar
enunciado: |
  TextilNova es una empresa de 2.000 empleados con Microsoft 365 E3 (no E5). El CIO acaba de licenciar Microsoft 365 Copilot al **80 %** de la plantilla (1.600 usuarios) y quiere desplegar Agent 365 a esos mismos 1.600. La adopción de Copilot está estable en ese nivel desde hace tres meses. ¿Cuál es la recomendación de licenciamiento más adecuada?
opciones:
  - id: a
    texto: "Migrar los 1.600 usuarios con Copilot a Microsoft 365 E7. Por encima del 60 % de adopción Copilot el bundle E7 es típicamente más eficiente y simplifica el SKU stack."
    correcta: true
  - id: b
    texto: "Mantener E3, comprar Agent 365 standalone para los 1.600 usuarios y mantener Copilot en su SKU actual. Suma tres líneas de billing pero permite máxima granularidad."
  - id: c
    texto: "Migrar toda la plantilla (2.000 usuarios) a E7, incluyendo los 400 que no usan Copilot."
  - id: d
    texto: "Esperar 6 meses al GA de Frontier preview para tomar la decisión con datos reales."
justificacion: |
  Con Copilot ya estable al 80 % en una organización con E3 base, **E7 es probablemente la opción óptima**: bundle Copilot + Agent 365 + (uplift a E5 implícito en E7) en un solo SKU para los 1.600 usuarios que ya pagan Copilot. La opción B funciona pero suma SKU stack para 1.600 usuarios y exige mantener tres líneas de billing en paralelo. La C sobreasigna a 400 usuarios sin Copilot. La D es procastinación: los datos ya están y la decisión se puede tomar.

  Conviene contrastar este caso con EX-03-001 (banco final): adopción 35 % → standalone es mejor. La regla operativa: **standalone si Copilot < 60 %; E7 si Copilot > 60 %**.
:::

::: pregunta
id: Q-03-2
oa: OA-03.2
tipo: multiple-choice
dificultad: media
bloom: Aplicar
enunciado: |
  Un agente Foundry desplegado en producción opera de dos formas según el caso: (a) responde a preguntas que un usuario le hace en Teams (modo OBO sobre el usuario que pregunta) y (b) procesa cada noche un batch de 5.000 facturas sin un usuario que lo invoque (modo autonomous con su propia identidad). ¿Qué afirmación sobre cobertura de licencias es correcta?
opciones:
  - id: a
    texto: "Solo necesita licencia el usuario que invoca al agente en Teams. El batch nocturno no consume licencias porque no hay un usuario asociado."
  - id: b
    texto: "El uso OBO consume licencia del usuario invocador (debe tener Agent 365). El uso autonomous consume mensajes de la cuota del agente (Foundry capacity) y se contabiliza como consumo de la identidad de agente."
    correcta: true
  - id: c
    texto: "Ambos modos requieren que el agente tenga licencia Agent 365 propia, sin importar quién lo invoque."
  - id: d
    texto: "El modo autonomous requiere E7 obligatoriamente; OBO admite cualquier SKU."
justificacion: |
  La regla **OBO vs autonomous** es el principio operativo más confuso del módulo:

  - **OBO** (on-behalf-of): el agente actúa con el contexto del usuario; **el usuario debe tener Agent 365**. Si no lo tiene, el agente no responde.
  - **Autonomous**: el agente actúa con su propia identidad de agente; **consume cuota de su plataforma** (Foundry messages, MCS messages, etc.). No hay un usuario que «pague» por el invoke.

  Confundir ambos modos lleva a infralicenciamiento (caso A) o sobrelicenciamiento (caso C). La opción D inventa una restricción.
:::

::: pregunta
id: Q-03-3
oa: OA-03.3
tipo: multiple-response
dificultad: media
bloom: Recordar
enunciado: |
  De las siguientes capacidades, ¿cuáles requieren **licencia adicional** más allá del Agent 365 standalone? Selecciona todas las que apliquen.
opciones:
  - id: a
    texto: "Risks column con datos consolidados de Defender XDR."
    correcta: true
  - id: b
    texto: "Conditional Access para agentes con grant Block."
    correcta: true
  - id: c
    texto: "Visualización del Agent Registry y Agent Map."
  - id: d
    texto: "DSPM for AI con dashboards de riesgo."
    correcta: true
  - id: e
    texto: "Aprobación de pending requests desde el wizard."
  - id: f
    texto: "ID Protection con detecciones específicas para agentes (Risky Sign-Ins, Risky Agents)."
    correcta: true
justificacion: |
  Las capacidades que requieren licencia adicional sobre Agent 365 standalone:

  - **Risks column con datos de Defender** → requiere Microsoft Defender for Cloud Apps (típicamente vía E5 o standalone Defender).
  - **Conditional Access para agentes** → requiere Microsoft Entra ID P1 o P2 (P2 para agente).
  - **DSPM for AI dashboards completos** → requiere Microsoft Purview (típicamente vía E5 Compliance o standalone).
  - **ID Protection con detecciones** → requiere Microsoft Entra ID P2.

  Las capacidades **incluidas** en Agent 365 standalone (sin coste adicional): Registry, Map, wizard de publishing y aprobación. La regla operativa: standalone te da inventario y operación básica; necesitas Defender + Entra P2 + Purview para el control plane completo.
:::

::: pregunta
id: Q-03-4
oa: OA-03.4
tipo: scenario
dificultad: dificil
bloom: Aplicar
enunciado: |
  Calcula el coste mensual estimado de Agent 365 para una organización con: 800 empleados con M365 E5 base ($57/mes), de los cuales 500 tienen Microsoft 365 Copilot ($30/mes) y planean licenciar Agent 365 standalone ($15/mes) a esos 500. La empresa además tendrá 2 agentes Foundry autonomous que se estiman en $2.000/mes de Foundry capacity. ¿Cuál es el coste mensual estimado total?
opciones:
  - id: a
    texto: "$45.600 (E5) + $15.000 (Copilot) + $7.500 (Agent 365) + $2.000 (Foundry) = **$70.100/mes**"
    correcta: true
  - id: b
    texto: "$45.600 + $15.000 + $7.500 = $68.100/mes (Foundry no se cuenta porque va aparte de Agent 365)"
  - id: c
    texto: "$45.600 + $24.000 (Copilot+Agent 365 bundle 800 × $30) + $2.000 = $71.600/mes"
  - id: d
    texto: "$45.600 + $15.000 + $12.000 (Agent 365 a toda la plantilla 800 × $15) + $2.000 = $74.600/mes"
justificacion: |
  Cálculo correcto:

  - 800 × $57 (E5)        = $45.600
  - 500 × $30 (Copilot)   = $15.000
  - 500 × $15 (Agent 365) = $7.500
  - Foundry capacity      = $2.000
  - **Total** = **$70.100/mes**

  La opción B descuenta Foundry capacity, que es real (autonomous mode consume mensajes). La C aplica el bundle a los 800 empleados cuando solo 500 tienen Copilot. La D licencia Agent 365 a toda la plantilla cuando solo 500 lo necesitan (los que invocan agentes vía OBO). La regla: **Agent 365 a quien invoca agentes**, **Copilot a quien usa Copilot Chat**, **Foundry capacity por separado** según consumo de agente autonomous.
:::

::: pregunta
id: Q-03-5
oa: OA-03.5
tipo: drag-and-drop
dificultad: media
bloom: Comprender
enunciado: |
  Empareja cada concepto de billing con la línea de billing que lo gestiona.
items:
  - id: b1
    texto: "Agent 365 standalone $15/usuario/mes."
  - id: b2
    texto: "Foundry capacity ($X/1k mensajes para agentes autonomous)."
  - id: b3
    texto: "Copilot Studio messages para agentes Agent Builder y MCS CEA."
  - id: b4
    texto: "M365 Copilot $30/usuario/mes (incluido en E7)."
  - id: b5
    texto: "Microsoft 365 E5 base $57/usuario/mes."
targets:
  - id: a365-line
    label: "Línea Agent 365 (per-seat)"
  - id: copilot-line
    label: "Línea Copilot (per-seat)"
  - id: m365-line
    label: "Línea M365 base (per-seat)"
  - id: capacity-line
    label: "Línea de capacity (consumo)"
correct_map:
  b1: a365-line
  b2: capacity-line
  b3: capacity-line
  b4: copilot-line
  b5: m365-line
justificacion: |
  Las **tres líneas de billing simultáneas** que el responsable financiero necesita modelar:

  1. **Per-seat M365** (E3, E5, E7) — la base.
  2. **Per-seat Copilot y Agent 365** — uno o ambos según despliegue.
  3. **Capacity de mensajes** — Foundry capacity y Copilot Studio messages, según consumo real de agentes autonomous y de Agent Builder/MCS.

  Confundir capacity con per-seat es el error de planificación financiera más frecuente: el responsable cree que con la licencia per-seat «todo está pagado» y al cabo de unos meses recibe una factura de capacity que no había anticipado.
:::

::: pregunta
id: Q-03-6
oa: OA-03.6
tipo: scenario
dificultad: media
bloom: Aplicar
enunciado: |
  Tu organización está admitida en el programa **Frontier preview** y dispone de 25 licencias gratuitas de Agent 365. La directora de IT te pide diseñar un plan de despliegue que minimice riesgo y maximice aprendizaje. ¿Cuál de los siguientes planes es el más adecuado?
opciones:
  - id: a
    texto: "Asignar las 25 licencias a un grupo piloto multi-disciplinar (5 IT + 5 Operaciones + 5 Comercial + 5 RRHH + 5 Legal) durante 8-10 semanas, instrumentar metricas de adopción y errores, y solo después decidir si pasar a contratación per-seat o E7."
    correcta: true
  - id: b
    texto: "Asignar las 25 licencias a la dirección ejecutiva para que validen el producto desde la óptica del usuario senior."
  - id: c
    texto: "Asignar las 25 licencias al equipo IT para validar exclusivamente la administración del control plane antes de exponerlo a usuarios de negocio."
  - id: d
    texto: "Saltarse Frontier preview, esperar al GA y desplegar directo a 500 usuarios el primer día."
justificacion: |
  Frontier preview (25 licencias gratuitas) está diseñado para **validar capacidades nuevas con usuarios reales** antes del despliegue masivo. La opción A es el patrón canónico: cohorte multi-disciplinar para detectar tanto problemas técnicos (que el equipo IT no ve) como problemas de adopción (que solo aparecen con usuarios reales). La opción B desperdicia el preview: la dirección ejecutiva no es representativa del uso. La C lo limita a IT y pierde la validación de adopción. La D ignora el preview, que es exactamente lo que está pensado para evitar.
:::

---

## Caso de estudio (refuerzo, no evaluable)

> Tras responder el quiz, intenta completar este ejercicio antes de pasar a M04.

**Escenario.** **ContosoFinance**, una entidad financiera con 8.500 empleados, evalúa Agent 365. Tiene M365 E5 base (8.500 × $57). Copilot está al 45 % de adopción (3.825 usuarios) creciendo al 4 % mensual. Se quieren tres cosas:

1. Cubrir gobernanza de los 3.825 usuarios Copilot durante el próximo año.
2. Cubrir 4 agentes Foundry autonomous para procesos batch nocturnos (estimación inicial $5.000/mes en capacity).
3. Tener Risks column desde el día uno por requisito regulatorio.

**Tareas.**

1. ¿Qué SKU recomiendas (standalone vs E7) y a quién? Justifica con cifras.
2. ¿Qué línea de billing extra hay que prever?
3. ¿Cuál es el coste estimado del primer año?

<details>
<summary>Ver solución sugerida</summary>

**1.** A 45 % de adopción Copilot creciendo 4 % mensual, **standalone es la opción óptima los primeros meses**. Cuando la adopción supere el 60-65 % (en ~4-5 meses), evaluar migrar a E7 para los usuarios Copilot. Mantener E5 para los 4.675 usuarios sin Copilot.

**2.** Foundry capacity (~$5.000/mes). Es independiente del per-seat y se contabiliza por consumo real.

**3.** Estimación primer año (12 meses, sin migrar a E7):

- E5 base: 8.500 × $57 × 12 = $5.814.000
- Copilot (asume crecimiento medio a 5.500 al final del año): ~4.660 × $30 × 12 = $1.677.600
- Agent 365 standalone (a los Copilot users que crecen): ~4.660 × $15 × 12 = $838.800
- Foundry capacity: $5.000 × 12 = $60.000

**Total estimado año 1: ~$8.390.400**.

Risks column (req regulatorio) llega vía Defender XDR. ContosoFinance ya tiene E5, así que la capacidad está cubierta sin coste extra. La activación es del módulo M05.
</details>
