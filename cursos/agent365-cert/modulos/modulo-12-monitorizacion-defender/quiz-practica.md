---
modulo: 12
tipo: quiz-practica
titulo: "Quiz de práctica del Módulo 12"
duracion_min: 20
umbral_aprobado_pct: 70
intentos_max: null
ultima_actualizacion: 2026-05-11
preguntas:
  - Q-12-1
  - Q-12-2
  - Q-12-3
  - Q-12-4
  - Q-12-5
  - Q-12-6
  - Q-12-7
caso_estudio: "BBVA"
---

# Módulo 12 — Quiz de práctica

> Siete preguntas para validar tu comprensión de Defender XDR aplicado a Agent 365: posicionamiento detectivo, navegación del portal, tabla `CloudAppEvents`, queries KQL para patrones canónicos, custom detection rules, integración con Sentinel e investigación de incidentes. Intentos ilimitados, aprobado a partir del 70 % (5 de 7 correctas).
>
> Las siete preguntas usan los cinco tipos canónicos del paquete (multiple-choice, multiple-response, scenario, drag-and-drop, ordering) para cubrir los siete OAs del módulo.

---

::: pregunta
id: Q-12-1
oa: OA-12.1
tipo: multiple-choice
dificultad: media
bloom: Comprender
enunciado: |
  Tu organización ya tiene desplegadas con éxito las capas M09 (Conditional Access + Identity Protection), M10 (Information Protection) y M11 (DLP + Communication Compliance). El nuevo CISO pregunta «¿qué nos aporta Defender XDR? ¿no es redundante con lo que ya tenemos?». ¿Cuál es la respuesta más precisa?
opciones:
  - id: a
    texto: "Sí es redundante: las capas preventivas (CA, IP, DLP, CC) cubren todos los escenarios de riesgo si están bien configuradas."
  - id: b
    texto: "Defender XDR es una capa **detectiva y reactiva**, no preventiva. Cubre tres categorías que las capas preventivas no resuelven por diseño: (a) falsos negativos de los detectores preventivos, (b) comportamiento que es legítimo aisladamente pero anómalo agregado, (c) compromiso de la propia identidad del agente, donde el comportamiento es formalmente legítimo pero malicioso."
    correcta: true
  - id: c
    texto: "Defender XDR sustituye a Purview DLP: con XDR no se necesita DLP."
  - id: d
    texto: "Defender XDR aplica solo a endpoint security, no a agentes; no aporta nada al programa Agent 365."
justificacion: |
  La opción B captura el posicionamiento didáctico clave del módulo: prevención al 100 % no existe, y XDR es la disciplina que asume esa realidad. Los tres casos que cita son los que las capas preventivas no pueden cubrir por su naturaleza (un classifier con 85 % precision tiene 15 % de FN; comportamiento agregado anómalo no se detecta a nivel de evento individual; compromiso de identidad genera tráfico técnicamente legítimo). La A subestima el riesgo. La C confunde disciplinas (DLP y XDR son complementarias). La D contradice el alcance documentado de Defender XDR para Agent 365.
:::

::: pregunta
id: Q-12-2
oa: OA-12.2
tipo: scenario
dificultad: media
bloom: Aplicar
enunciado: |
  El SOC tier 1 te llega con esta queja: «Estamos ahogados con alertas. Hoy he recibido 47 alertas individuales sobre el agente `comercial-pricebot`: 12 de DLP, 18 de Defender for Cloud Apps, 9 de Identity Protection, 8 de Defender for Office 365. ¿Cómo priorizo?». ¿Cuál es la respuesta correcta sobre el workflow del SOC?
opciones:
  - id: a
    texto: "Procesa todas las alertas en orden de severidad, una por una. Es la única forma de no perder evidencia."
  - id: b
    texto: "El SOC nunca trabaja a nivel de alertas individuales. Defender XDR agrupa automáticamente alertas relacionadas en un único **incident** correlacionando por tiempo, identidad, recurso y MITRE ATT&CK technique. Las 47 alertas que describes son casi seguro 1 o 2 incidents. Trabaja sobre incidents, no sobre alerts: cada incident es la unidad de trabajo del SOC."
    correcta: true
  - id: c
    texto: "Ignora las alertas de Defender for Cloud Apps porque hay demasiadas. Las de Identity Protection son más fiables."
  - id: d
    texto: "Cierra las alertas más antiguas sin investigar para reducir el backlog visible."
justificacion: |
  La opción B es la respuesta canónica que diferencia un SOC maduro de uno sobrecargado. Defender XDR está diseñado precisamente para resolver este problema con la correlación automática en incidents. Si el SOC sigue trabajando a nivel de alertas, está infrautilizando la capacidad core del producto. La A garantiza saturación y burnout. La C es selectiva sin criterio. La D es operacionalmente peligrosa: cerrar sin investigar oculta evidencia y crea pasivos legales si más tarde hay un incidente real correlacionable.
:::

::: pregunta
id: Q-12-3
oa: OA-12.3
tipo: multiple-response
dificultad: media
bloom: Recordar
enunciado: |
  Sobre la tabla `CloudAppEvents` de Microsoft Defender XDR aplicada a Agent 365, ¿cuáles de las siguientes afirmaciones son correctas? Selecciona todas las que apliquen.
opciones:
  - id: a
    texto: "Es la tabla central para investigación de Agent 365: registra invocaciones, accesos a datos, outputs producidos."
    correcta: true
  - id: b
    texto: "Incluye campos enriquecidos específicos para agentes: `AgentId`, `AgentBlueprintId`, `InputDataSensitivity`, `OutputDataSensitivity`, `CorrelationId`."
    correcta: true
  - id: c
    texto: "La latencia de ingestión es típicamente 2-10 minutos."
    correcta: true
  - id: d
    texto: "Solo retiene datos 24 horas; para retención larga se necesita exportar a otro sistema."
  - id: e
    texto: "El campo `CorrelationId` permite reconstruir la cadena completa de una invocación: invoke → accesos a datos → output generado."
    correcta: true
  - id: f
    texto: "Es accesible vía Advanced Hunting con queries KQL."
    correcta: true
justificacion: |
  Las opciones A, B, C, E y F son correctas. La D es falsa: la retención por defecto es 30 días en Defender XDR; con Sentinel conectado se extiende a 90 días en workspace operativo y hasta 12 años en LTR. La latencia de ingestión es 2-10 minutos (aceptable para detección near real-time, pero el SOC usa también el portal de Defender for Cloud Apps para acción urgente con latencia inferior al minuto). El CorrelationId es la clave para investigación: dada una alerta sobre una invocación, el CorrelationId te permite reconstruir toda la historia.
:::

::: pregunta
id: Q-12-4
oa: OA-12.4
tipo: ordering
dificultad: dificil
bloom: Crear
enunciado: |
  Ordena los pasos correctos para **construir una query KQL** que detecte el patrón de «agente accediendo desde nuevas geografías» (no vistas en los últimos 30-7 días), desde el primer paso hasta el resultado final.
items:
  - id: o1
    texto: "Definir tabla base: `CloudAppEvents | where Application == \"Microsoft Agent 365\" | where ActionType == \"AgentInvoke\"`"
  - id: o2
    texto: "Crear subconsulta histórica con `Timestamp between (ago(30d) .. ago(7d))` agrupada por `AgentId` con `make_set(Country)` como `CountriesBefore`"
  - id: o3
    texto: "Crear conjunto actual: filtrar `Timestamp >= ago(7d)` y agrupar por `AgentId` con `make_set(Country)` como `CountriesNow`"
  - id: o4
    texto: "Unir actual con histórica usando `join kind=inner` sobre `AgentId`"
  - id: o5
    texto: "Calcular `NewCountries = set_difference(CountriesNow, CountriesBefore)` y filtrar `array_length(NewCountries) > 0`"
  - id: o6
    texto: "Proyectar columnas finales: `AgentId, NewCountries, CountriesBefore, CountriesNow` para inspección"
correct_order:
  - o1
  - o2
  - o3
  - o4
  - o5
  - o6
justificacion: |
  El orden refleja el flujo lógico de construir una query KQL: empezar por la tabla base con los filtros de aplicación y tipo de acción (O1), construir el conjunto histórico (O2), construir el conjunto actual (O3), unirlos (O4), calcular la diferencia (O5), proyectar el resultado limpio (O6). Saltarse pasos o invertir el orden produce queries que no compilan o queries que devuelven todos los agentes en lugar de solo los problemáticos. Aprender este flujo es el ejercicio mental que distingue al analista junior del senior en hunting.
:::

::: pregunta
id: Q-12-5
oa: OA-12.5
tipo: scenario
dificultad: media
bloom: Aplicar
enunciado: |
  Estás creando una custom detection rule para Agent 365 que detecta agentes que **acceden a archivos `HighlyConfidential` desde una IP nunca antes vista en los últimos 30 días**. Tu compañero junior propone severidad `Critical`. ¿Cuál es la calibración correcta y por qué?
opciones:
  - id: a
    texto: "Critical es correcto: cualquier acceso a HighlyConfidential desde nueva IP es siempre un compromiso confirmado."
  - id: b
    texto: "Severidad **High** con SLA de respuesta < 1 hora. Los indicadores (HighlyConfidential + IP nueva) son fuertes pero no confirmados (puede ser legítimo: VPN nueva, oficina nueva, teletrabajo desde casa primera vez). Reservar Critical para escenarios donde la respuesta requerida es < 15 min con compromiso confirmado (ej. mass download de 500 archivos en 10 minutos)."
    correcta: true
  - id: c
    texto: "Informational es correcto: el evento puede ser legítimo y no debe generar alarma."
  - id: d
    texto: "Low: solo HighlyConfidential sin más contexto no justifica acción inmediata."
justificacion: |
  La opción B captura la calibración operativa correcta. Asignar Critical a cualquier indicador, aunque sea fuerte, satura el SOC tier 1 con escalados de máxima prioridad que mayoritariamente serán FP. Critical debe reservarse para compromiso confirmado, no para indicadores sospechosos. La regla operativa: Critical = respuesta < 15 min con compromiso casi seguro; High = < 1h con indicadores fuertes; Medium = < 4h con anomalía a investigar; Low = < 24h interés para hunting. La A satura el SOC; la C subestima el riesgo; la D minimiza un patrón que merece atención prioritaria.
:::

::: pregunta
id: Q-12-6
oa: OA-12.6
tipo: drag-and-drop
dificultad: media
bloom: Aplicar
enunciado: |
  Empareja cada **componente de Microsoft Sentinel** con su función en el ecosistema de respuesta a incidentes de Agent 365.
items:
  - id: c1
    texto: "Data connector (Microsoft Defender XDR)"
  - id: c2
    texto: "Analytics rule"
  - id: c3
    texto: "Playbook (Logic App)"
  - id: c4
    texto: "Automation rule"
  - id: c5
    texto: "Workbook"
  - id: c6
    texto: "Long-Term Retention (LTR)"
targets:
  - id: t1
    label: "Ingiere incidents, alerts y raw events de Defender XDR al workspace de Sentinel near real-time"
  - id: t2
    label: "Query KQL programada que genera alerts cuando coincide (similar a custom detection rule de XDR)"
  - id: t3
    label: "Logic App que ejecuta acciones automatizadas (deshabilitar agente, revocar tokens, notificar) cuando se dispara"
  - id: t4
    label: "Regla que vincula un trigger (incident creado, alert recibida) con un playbook a ejecutar automáticamente"
  - id: t5
    label: "Dashboard ejecutivo configurable (volumen invocaciones, FP rate, tiempo medio de triaje, top agentes problemáticos)"
  - id: t6
    label: "Tier de retención de archivo barato (queries más lentas) hasta 12 años para auditoría regulatoria"
correct_map:
  c1: t1
  c2: t2
  c3: t3
  c4: t4
  c5: t5
  c6: t6
justificacion: |
  Los seis componentes de Sentinel cubren las capacidades complementarias a Defender XDR: ingestión (data connector), detección programada (analytics rule), respuesta automatizada (playbook), trigger de automatización (automation rule), visualización ejecutiva (workbook) y retención larga (LTR). La automation rule es la pieza que conecta detecciones con respuestas — sin ella, los playbooks no se disparan automáticamente y todo queda en respuesta manual. Una organización con SOC maduro usa los seis simultáneamente.
:::

::: pregunta
id: Q-12-7
oa: OA-12.7
tipo: scenario
dificultad: dificil
bloom: Analizar
enunciado: |
  Acabas de recibir una alerta High: el agente `comercial-pricebot` activó la rule `Agent365-Exfiltration-Pattern-Detection` con 47 archivos `Confidential` accedidos y 8 outputs producidos en 45 minutos. El playbook automatizado ya ejecutó contención (agente deshabilitado, tokens revocados, owner notificado). Eres el SOC tier 2 asignado al incident. ¿Cuál es el orden correcto de las siguientes acciones de investigación?
opciones:
  - id: a
    texto: "(1) Producir el post-mortem inmediatamente con la información de la alerta. (2) Cerrar el incident."
  - id: b
    texto: "(1) Recopilar evidencia inicial del incident en Defender XDR (alertas correlacionadas, entities, contexto). (2) Construir timeline detallado con query KQL por `correlationId`. (3) Correlacionar señales cross-product (Identity Protection, Defender for Endpoint, Purview DLP, Communication Compliance). (4) Formular 2-3 hipótesis con evidencia a favor y en contra. (5) Validar con stakeholders (manager del usuario, owner del agente). (6) Decidir contención adicional o restauración. (7) Producir post-mortem formal con timeline, causa raíz, impacto, acciones, lecciones aprendidas y mejoras con owner asignado."
    correcta: true
  - id: c
    texto: "(1) Restaurar el agente inmediatamente para minimizar impacto operativo. (2) Investigar después si hay quejas del owner."
  - id: d
    texto: "(1) Llamar al CISO inmediatamente. (2) Esperar instrucciones antes de hacer nada técnico."
justificacion: |
  La opción B describe el flujo canónico de investigación de un SOC maduro, alineado con NIST SP 800-61 Rev. 2. Cada paso aporta evidencia o decisión necesaria para el siguiente. Saltarse pasos es la fuente principal de errores documentados: la A produce post-mortems sin sustancia que el regulador rechaza; la C restaura un agente que puede estar comprometido (re-exposición de datos); la D escala antes de tener evidencia, agota la atención ejecutiva y produce decisiones sin contexto. El post-mortem llega al final del flujo, no al principio, y debe estar firmado por el SOC tier 2 con acciones de mejora con owner y fecha objetivo.
:::

---

## Caso de estudio (refuerzo, no evaluable)

> Tras responder el quiz, intenta este ejercicio antes de pasar a M13.

**Escenario.** **BBVA** (115.000 empleados, M365 E5 Compliance + E5 Security desplegados, Agent 365 en producción para 8.000 usuarios, regulación europea bancaria estricta). El CISO te pide diseñar el **dashboard operativo mensual** que se presenta al Consejo de Riesgos y al regulador. Debe responder a las preguntas que el regulador hace en sus auditorías trimestrales sobre el uso de IA en la organización.

**Tareas.**

1. Define los **8-10 KPIs** que debe contener el dashboard, organizados en 3-4 secciones lógicas.
2. Para cada KPI, especifica: nombre, fuente de datos (tabla de Defender XDR o producto que lo origina), threshold operativo (verde/ámbar/rojo), acción esperada cuando se sale de rango.
3. Define los **3 playbooks adicionales** (más allá del LAB-12-3) que el SOC necesita para responder a los KPIs en rojo.
4. Diseña el SLA del SOC para responder al regulador cuando hace consultas trimestrales.

<details>
<summary>Ver solución sugerida</summary>

**1. Estructura del dashboard CISO mensual — BBVA Agent 365.**

```
┌─────────────────────────────────────────────────────────────────┐
│   CISO Dashboard mensual — Agent 365 — BBVA — <mes/año>        │
│   Comparativa: vs mes anterior + tendencia 6 meses              │
├─────────────────────────────────────────────────────────────────┤

  Sección 1 — Volumen y uso saludable
  ───────────────────────────────────────────────────────────────
  KPI-1: Invocaciones totales         ──── 1.2M (▲5%)        🟢
  KPI-2: Agentes activos vs total     ──── 142 / 158 (90%)   🟢
  KPI-3: Usuarios únicos invocando    ──── 6.8K / 8K (85%)   🟢

  Sección 2 — Postura de seguridad
  ───────────────────────────────────────────────────────────────
  KPI-4: Incidents Critical/High      ──── 3 / 12 (todos resueltos en SLA)  🟢
  KPI-5: Custom rules con FP > 20%   ──── 2 (calibración prevista)         🟡
  KPI-6: Mean Time To Detect (MTTD)  ──── 18 min (target < 30 min)        🟢
  KPI-7: Mean Time To Respond (MTTR) ──── 47 min (target < 1h)            🟢

  Sección 3 — Cumplimiento regulatorio
  ───────────────────────────────────────────────────────────────
  KPI-8: Audit log completitud        ──── 99.97% (target > 99.9%)   🟢
  KPI-9: Custodian holds activos      ──── 4 (todos en plazo)         🟢
  KPI-10: Consultas regulador        ──── 1 esta semana (respondida)  🟢

  Sección 4 — Impacto y aprendizaje
  ───────────────────────────────────────────────────────────────
  · Top 3 incidents del mes (con post-mortem firmado)
  · Lecciones aprendidas → mejoras implementadas
  · Próximos cambios al programa (con owner)
└─────────────────────────────────────────────────────────────────┘
```

**2. KPIs en detalle.**

| # | KPI | Fuente | 🟢 Verde | 🟡 Ámbar | 🔴 Rojo |
|---|---|---|---|---|---|
| 1 | Invocaciones totales | `CloudAppEvents` ActionType=AgentInvoke | ±20% baseline | +/- 20-50% | > +50% concentrado en pocos |
| 2 | Agentes activos / total | `CloudAppEvents` distinct AgentId | > 80% | 60-80% | < 60% (subutilización) |
| 3 | Usuarios únicos invocando | `CloudAppEvents` distinct AccountUpn | > 80% del target | 60-80% | < 60% |
| 4 | Incidents Crit/High | Defender XDR incidents | < 5/mes | 5-15 | > 15 |
| 5 | Custom rules con FP > 20% | Audit de rules | 0-1 | 2-4 | > 4 |
| 6 | MTTD | Sentinel workbook | < 30 min | 30-60 min | > 60 min |
| 7 | MTTR | Sentinel workbook | < 1h | 1-4h | > 4h |
| 8 | Audit log completitud | Diff `CloudAppEvents` vs invocaciones reales | > 99.9% | 99.0-99.9% | < 99% |
| 9 | Custodian holds activos | eDiscovery Premium | Sin pendientes | < 5 atrasados | > 5 atrasados |
| 10 | Consultas regulador | Manual + ticketing | Todas respondidas en SLA | 1 fuera de SLA | > 1 fuera de SLA |

**3. Tres playbooks adicionales más allá del LAB-12-3.**

| Playbook | Trigger | Acciones automatizadas |
|---|---|---|
| `pb-Agent365-MTTRBreach-Escalation` | KPI-7 (MTTR) > 4h en cualquier incident High | Email automático a CISO + ticket P1; convocar war room en Teams; cancelar reuniones no críticas del equipo SOC tier 2/3 |
| `pb-Agent365-AuditCompleteness-Restore` | KPI-8 (audit completitud) < 99% | Llamada API a Microsoft support con caso pre-rellenado; snapshot inmediato de evidencia disponible; notificación a Compliance |
| `pb-Agent365-RegulatorQuery-Response` | KPI-10 (consulta regulador entrante) | Crear caso eDiscovery automáticamente; recopilar evidencia con queries pre-construidas; generar borrador de respuesta para Legal review; SLA tracking |

**4. SLA del SOC para respuesta al regulador.**

| Tipo de consulta | SLA reconocimiento | SLA respuesta completa |
|---|---|---|
| Consulta rutinaria trimestral | < 24h | < 10 días hábiles |
| Consulta puntual con plazo definido | < 4h | Antes del plazo, con margen de 48h |
| Solicitud formal de evidencia (subpoena) | < 1h | Según plazo legal (típicamente 30 días) |
| Emergencia regulatoria (suspensión cautelar) | Inmediato | < 4h con evidencia inicial; < 48h con informe completo |

El SLA agregado del programa: 100 % de consultas del regulador respondidas dentro del SLA aplicable. Cualquier violación dispara post-mortem específico y reporte al Consejo de Riesgos.

</details>
