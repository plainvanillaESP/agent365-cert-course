---
modulo: 15
tipo: quiz-practica
titulo: "Quiz de práctica del Módulo 15"
duracion_min: 12
umbral_aprobado_pct: 70
intentos_max: null
ultima_actualizacion: 2026-05-11
preguntas:
  - Q-15-1
  - Q-15-2
  - Q-15-3
  - Q-15-4
  - Q-15-5
caso_estudio: "Repsol"
---

# Módulo 15 — Quiz de práctica

> Cinco preguntas para validar tu comprensión del protocolo de troubleshooting OBDED, diagnóstico de problemas de acceso, gestión de agentes deshabilitados, cierre de incidents con obstáculos y reconciliación de audit logs. Intentos ilimitados, aprobado a partir del 70 % (4 de 5 correctas).

---

::: pregunta
id: Q-15-1
oa: OA-15.5
tipo: ordering
dificultad: facil
bloom: Recordar
enunciado: |
  Ordena las cinco fases del protocolo canónico **OBDED** de troubleshooting, en el orden correcto desde el primer paso hasta el último.
items:
  - id: o1
    texto: "**Observe**: ¿qué se está reportando exactamente? ¿es un síntoma o el problema?"
  - id: o2
    texto: "**Diagnose**: ¿cuál es la causa raíz? ¿qué hipótesis explica todos los síntomas?"
  - id: o3
    texto: "**Execute**: ¿qué acción soluciona la causa raíz sin introducir nuevos problemas?"
  - id: o4
    texto: "**Validate**: ¿la acción funcionó? ¿el síntoma original ya no se reproduce?"
  - id: o5
    texto: "**Document**: ¿qué aprendimos? ¿cómo evitamos esto en el futuro?"
correct_order:
  - o1
  - o2
  - o3
  - o4
  - o5
justificacion: |
  El protocolo OBDED se aplica en orden estricto. Saltarse Diagnose (ir directamente a Execute) es el error más común y caro: produce rework constante cuando la acción no resuelve la causa raíz real. Saltarse Document es el segundo más común: la organización no aprende y los casos se repiten. La inversión de tiempo correcta es 80 % en Observe + Diagnose, 20 % en Execute. Los equipos junior invierten al revés.
:::

::: pregunta
id: Q-15-2
oa: OA-15.1
tipo: ordering
dificultad: media
bloom: Aplicar
enunciado: |
  Un usuario reporta «no puedo invocar el agente X». Ordena los pasos correctos del **árbol de decisión** que el SOC tier 1 debe seguir para diagnosticar la causa raíz, desde el primer check hasta el último.
items:
  - id: p1
    texto: "Verificar que el usuario tiene **licencia Copilot 365** activa asignada en CCS"
  - id: p2
    texto: "Verificar que el usuario está **en el scope de la catalog policy** que permite ese agente"
  - id: p3
    texto: "Verificar que el **agente está activo** (no deshabilitado)"
  - id: p4
    texto: "Verificar que ninguna **Conditional Access policy** está bloqueando la sesión"
  - id: p5
    texto: "Si todo lo anterior es OK, **escalar a tier 2** con los datos recopilados"
correct_order:
  - p1
  - p2
  - p3
  - p4
  - p5
justificacion: |
  El árbol de decisión sigue la cadena de dependencias técnicas: sin licencia, lo demás no aplica. Con licencia, sin policy permitiéndolo, falla aunque el agente esté activo. Con policy, sin agente activo, falla aunque la CA no bloquee. Saltar directamente al paso 4 (CA) sin verificar los anteriores es el patrón típico de troubleshooting improvisado y produce diagnósticos erróneos. La escalación a tier 2 (paso 5) llega solo cuando el árbol completo está agotado, no antes.
:::

::: pregunta
id: Q-15-3
oa: OA-15.2
tipo: scenario
dificultad: dificil
bloom: Analizar
enunciado: |
  Un agente que funcionaba se deshabilita súbitamente. Investigando, encuentras un evento `AgentDisabled` con `automationName = "pb-Agent365-Compromise-Containment"`. Un manager presiona para re-habilitar el agente inmediatamente porque hay impacto al negocio. ¿Cuál es la respuesta operativamente correcta?
opciones:
  - id: a
    texto: "Re-habilitar inmediatamente el agente: la presión del negocio justifica la velocidad; investigar después."
  - id: b
    texto: "**NO re-habilitar inmediatamente**. Una automation deshabilitó el agente por algo. Confirmar con el SOC tier 2 si el evento que disparó la automation es falso positivo (FP) o real ANTES de re-habilitar. Si FP, re-enable manual + ajustar threshold/excepciones de la rule. Si real, mantener disabled + investigar incident con SOC. Re-habilitar agentes deshabilitados por automation sin investigar es el patrón más peligroso del módulo."
    correcta: true
  - id: c
    texto: "Eliminar la custom detection rule que disparó la automation para que no vuelva a ocurrir."
  - id: d
    texto: "Reportar al CISO sin tomar acción y esperar instrucciones."
justificacion: |
  La opción B refleja la disciplina operativa correcta documentada en la sección 15.3.4. Una security automation se disparó por una hipótesis razonable; ignorarla pone en riesgo todo el sistema de detección. Casos como exfiltración o compromiso de identidad de agente cumplen primero la automation y luego se confirman: re-habilitar sin investigar deja al atacante operando. La A prioriza velocidad sobre seguridad. La C destruye un sistema de detección que probablemente funciona correctamente. La D abdica de la responsabilidad operativa: el SOC tier 2 tiene autoridad para resolver casos de este tipo sin esperar al CISO. La regla canónica: validar antes de re-habilitar.
:::

::: pregunta
id: Q-15-4
oa: OA-15.3
tipo: multiple-response
dificultad: media
bloom: Aplicar
enunciado: |
  Sobre el cierre de incidents en Defender XDR cuando hay obstáculos, ¿cuáles de las siguientes afirmaciones son correctas? Selecciona todas las que apliquen.
opciones:
  - id: a
    texto: "Si una **entity (AgentId, AccountUpn) está unresolved porque fue eliminada durante la investigación**, se puede cerrar el incident documentando la situación en el post-mortem y manteniendo evidencia archivada."
    correcta: true
  - id: b
    texto: "Si **falta evidencia** (logs no aparecen), antes de cerrar como «inconcluso» verifica retención de Defender XDR (30 días), Sentinel LTR (hasta 12 años), Purview audit log (independiente) y logs en cliente."
    correcta: true
  - id: c
    texto: "Si un **playbook falla parcialmente**, los steps fallidos se ejecutan manualmente desde el portal correspondiente; el plan preventivo incluye retry policies, alerting y testing trimestral."
    correcta: true
  - id: d
    texto: "Los incidents que no se cierran en 48h se cierran automáticamente sin investigación adicional para mantener el dashboard limpio."
  - id: e
    texto: "Cuando se cierra un incident con evidencia incompleta, se documenta como **«evidence partial; closed based on available data»** con justificación. Es preferible a un cierre forzado sin trazabilidad."
    correcta: true
  - id: f
    texto: "Mismatch entre AgentId reportado por Defender y AgentId en CCS suele ser un bug de sincronización; abrir caso con Microsoft Support."
    correcta: true
justificacion: |
  Las opciones A, B, C, E y F describen el flujo canónico de cierre con obstáculos. La D es operacionalmente peligrosa: cerrar incidents sin investigación genera pasivos legales (un incident real cerrado por timeout sería negligencia ante una auditoría) y oculta evidencia que podría ser relevante en futuras investigaciones correlacionadas. Los incidents se cierran cuando tienen resolución documentada, no cuando llevan tiempo abiertos. Si la investigación no converge, el cierre se hace con evidencia parcial y justificación, no automáticamente.
:::

::: pregunta
id: Q-15-5
oa: OA-15.4
tipo: scenario
dificultad: dificil
bloom: Analizar
enunciado: |
  El dashboard CCS reporta 42.000 invocaciones de agente esta semana. Una query equivalente en Defender XDR Advanced Hunting devuelve 37.500 invocaciones del mismo periodo. ¿Qué hace el responsable de gobernanza de IA?
opciones:
  - id: a
    texto: "Acepta la discrepancia: las dos fuentes nunca coinciden exactamente, es normal."
  - id: b
    texto: "**Aplica reconciliación cruzada con la tercera fuente** (Purview audit log) que es independiente. Si Purview coincide con una de las dos, la discrepancia está en la otra. Si CCS = Purview = 42.000 y Defender = 37.500, la causa raíz está en CloudAppEvents (filtro de ingestión, throttling, configuración connector). Investiga causa raíz, ejecuta resolución, reporta al comité central por ser gap > 1 % (sería 10.7 %)."
    correcta: true
  - id: c
    texto: "Ignora Defender XDR y usa CCS como única fuente, asumiendo que tiene mejor cobertura."
  - id: d
    texto: "Espera 24h a ver si la discrepancia se resuelve automáticamente."
justificacion: |
  La opción B aplica el método canónico de reconciliación cruzada documentado en sección 15.5. CCS y Purview son fuentes independientes que deben coincidir; Defender XDR/CloudAppEvents es una tercera fuente que también debería coincidir. Cuando dos coinciden y una difiere, la discrepancia está en la que difiere. Investigar la causa raíz (filtro de ingestión, throttling, etc.) y remediarla es disciplina operativa básica. Las opciones A, C, D abdican la responsabilidad: aceptar discrepancias como «normales» tolera datos no fiables; usar solo una fuente pierde la capacidad de reconciliación; esperar 24h sin investigar pierde tiempo y puede dejar evidencia perdida. Los gaps > 1 % sostenidos > 1h son material de reporting al comité central por su impacto en auditoría regulatoria.
:::

---

## Caso de estudio (refuerzo, no evaluable)

> Tras responder el quiz, intenta este ejercicio antes de pasar a M16.

**Escenario.** **Repsol** (24.000 empleados, sector energético regulado por CNMC, M365 E5 + Agent 365 desplegado a 6.000 usuarios). El equipo SOC tier 1 reporta una **acumulación inusual de tickets en las últimas 2 semanas**: 47 tickets relacionados con problemas de acceso a agentes vs media histórica de 12 tickets/semana. El responsable de gobernanza te pide diagnosticar la situación y diseñar un plan de respuesta.

**Tareas.**

1. Identifica las **3 hipótesis más probables** sobre la causa raíz del incremento de tickets.
2. Diseña la **query KQL** que ayudaría a confirmar/refutar cada hipótesis.
3. Define el **plan de respuesta de 2 semanas** con acciones, owners y fechas.
4. Diseña el **dashboard SOC** que el tier 1 debería tener disponible para detectar este patrón antes de las 2 semanas de retraso.

<details>
<summary>Ver solución sugerida</summary>

**1. Tres hipótesis probables.**

| # | Hipótesis | Por qué es plausible |
|---|---|---|
| H1 | **Despliegue reciente de nueva CA policy** que afecta a una porción de usuarios bajo condiciones específicas (ubicación, dispositivo, hora) | Las nuevas CA policies son la causa #1 de pico repentino de tickets de acceso |
| H2 | **Secret de uno o varios blueprints expiró** sin renovación programada | Si Repsol no tenía calendar de rotación, es muy plausible: secrets caducan típicamente cada 1-2 años; pico simultáneo de tickets es el síntoma |
| H3 | **Custom detection rule recién habilitada** con `Disable agent` automatizado y threshold mal calibrado | Si el SOC habilitó nuevas rules recientemente sin validar madurez, FPs disruptivas son el resultado |

**2. Query KQL por hipótesis.**

H1 — verificar CA:
```kql
SigninLogs
| where AppDisplayName == "Microsoft Agent 365"
| where TimeGenerated >= ago(14d)
| where ResultType == "53003"  // blocked by CA
| summarize Blocked = count() by bin(TimeGenerated, 1d), ConditionalAccessPolicies
| order by TimeGenerated desc
```
Si hay un pico de bloqueos coincidente con una CA policy específica, confirmado.

H2 — verificar secrets expirados:
```kql
CloudAppEvents
| where Application == "Microsoft Agent 365"
| where Timestamp >= ago(14d)
| where ActionType == "AgentInvoke"
| extend ResultCode = tostring(parse_json(RawEventData).resultCode)
| where ResultCode == "401"
| summarize Failures401 = count() by AgentId, bin(Timestamp, 1d)
| order by Failures401 desc
```
Si varios agentes tienen pico simultáneo de 401, confirmado.

H3 — verificar automation disables:
```kql
CloudAppEvents
| where Application == "Microsoft Agent 365"
| where Timestamp >= ago(14d)
| where ActionType == "AgentDisabled"
| extend Reason = tostring(parse_json(RawEventData).reason)
| where Reason has "Automation triggered"
| project Timestamp, AgentId, Reason, AutomationName = tostring(parse_json(RawEventData).automationName)
| order by Timestamp desc
```
Si hay pico de eventos `AgentDisabled` por automations en las 2 semanas, confirmado.

**3. Plan de respuesta de 2 semanas.**

| Semana | Acción | Owner | Fecha objetivo |
|---|---|---|---|
| Semana 1 | Ejecutar las 3 queries de diagnóstico y confirmar/refutar hipótesis | SOC tier 2 lead | Día 1 |
| Semana 1 | Si H1 confirmada: revisión inmediata de la CA policy con equipo de seguridad; ajuste con excepciones o cambio de scope | Security architect | Día 3 |
| Semana 1 | Si H2 confirmada: rotación inmediata de secrets afectados; calendario de rotación a 3 meses creado | IT operations | Día 2-5 |
| Semana 1 | Si H3 confirmada: desactivar acciones automáticas disruptivas de las rules afectadas; calibración de thresholds | SOC tier 2 lead | Día 2-7 |
| Semana 1 | Comunicación al negocio: mensaje único agregado en lugar de respuesta caso a caso | Responsable de gobernanza | Día 4 |
| Semana 2 | Validación: los tickets nuevos vuelven a media histórica (≤ 12/semana) | SOC tier 1 lead | Continuo |
| Semana 2 | Post-mortem agregado: causa raíz documentada, plan preventivo | Responsable de gobernanza | Día 12 |
| Semana 2 | Implementación de detección temprana (dashboard SOC) | SOC tier 3 + IT | Día 14 |

**4. Dashboard SOC con detección temprana.**

```
┌──────────────────────────────────────────────────────────────┐
│   SOC Dashboard — Agent 365 — Lun 11 May 2026               │
├──────────────────────────────────────────────────────────────┤
│ TICKETS ABIERTOS                                             │
│   Tickets esta semana          ──── 18 (vs hist. 12) 🟡      │
│   Tendencia 4 semanas          ──── ▲ 50% en 2 semanas       │
│   MTTR esta semana             ──── 1.8h (target < 4h) 🟢    │
│   FP rate custom rules         ──── 4% (target < 5%) 🟢      │
├──────────────────────────────────────────────────────────────┤
│ ALERTAS TEMPRANAS (umbrales preventivos)                     │
│   CA blocks de Agent 365 hoy   ──── 47 (vs hist. 8) 🔴       │
│   Secrets expirando < 30 días  ──── 2 🟡                     │
│   Automation disables esta sem ──── 6 (vs hist. 1) 🟡        │
│   Audit log gap esta semana    ──── 0.03% 🟢                 │
├──────────────────────────────────────────────────────────────┤
│ ACCIONES PRIORIZADAS                                         │
│   1. Investigar pico de CA blocks (47 vs 8) — high           │
│   2. Rotar 2 secrets antes del fin de mes — medium           │
│   3. Calibrar custom rule X (6 disables vs 1 normal) — med   │
└──────────────────────────────────────────────────────────────┘
```

Este dashboard se actualiza cada 15 minutos y se muestra en pantalla permanente del SOC. Los umbrales preventivos (CA blocks, secrets caducando, automation disables, audit log gaps) sirven para detectar problemas antes de que el volumen de tickets revele la magnitud — el patrón del caso Repsol no habría llegado a 2 semanas de retraso si las alertas tempranas estuvieran operativas.

</details>
