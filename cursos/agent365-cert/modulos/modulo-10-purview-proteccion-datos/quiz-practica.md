---
modulo: 10
tipo: quiz-practica
titulo: "Quiz de práctica del Módulo 10"
duracion_min: 15
umbral_aprobado_pct: 70
intentos_max: null
ultima_actualizacion: 2026-05-11
preguntas:
  - Q-10-1
  - Q-10-2
  - Q-10-3
  - Q-10-4
  - Q-10-5
  - Q-10-6
caso_estudio: "Pernod Ricard"
---

# Módulo 10 — Quiz de práctica

> Seis preguntas para validar tu comprensión de Microsoft Purview integrado con Agent 365: por qué es complementario a CA, DSPM for AI, sensitivity labels y herencia, trazabilidad forense, information protection en outputs, y la composición end-to-end. Intentos ilimitados, aprobado a partir del 70 % (5 de 6 correctas).
>
> Las seis preguntas usan los cinco tipos canónicos del paquete (multiple-choice, multiple-response, scenario, drag-and-drop, ordering) para cubrir los seis OAs del módulo.

---

::: pregunta
id: Q-10-1
oa: OA-10.1
tipo: multiple-choice
dificultad: media
bloom: Comprender
enunciado: |
  ¿Cuál de las siguientes situaciones **NO** se resuelve con Conditional Access (M09) y por tanto requiere una capa adicional como Microsoft Purview (M10)?
opciones:
  - id: a
    texto: "Bloquear la invocación de un agente cuando su risk score pasa a High."
  - id: b
    texto: "Garantizar que un output del agente combinando datos de varias fuentes herede la sensitivity label más restrictiva y se cifre automáticamente."
    correcta: true
  - id: c
    texto: "Impedir que un agente con scope `Mail.Send` opere fuera de un blueprint de la allowlist."
  - id: d
    texto: "Filtrar invocaciones según el atributo `ConfidentialityLevel` del agente."
justificacion: |
  CA condiciona el **acceso** (si el agente puede o no invocar). Purview decide **qué pasa con el dato** una vez accedido: herencia de labels, cifrado, watermark, restricciones de compartición y trazabilidad forense. Las opciones A, C y D son funciones canónicas de CA aplicadas a workload identities. La B describe específicamente la herencia automática de label más restrictiva, que es un mecanismo de Information Protection (Purview), no de CA.
:::

::: pregunta
id: Q-10-2
oa: OA-10.2
tipo: scenario
dificultad: media
bloom: Aplicar
enunciado: |
  Llegas al lunes y abres DSPM for AI. El panel «Top sensitive interactions» muestra que el agente «Comercial-PriceBot» ha pasado de 50 interacciones/semana con datos `Confidential+` a 850 esta semana, sin que el número de usuarios invocadores haya crecido. El blueprint no ha cambiado. ¿Cuál es la lectura más adecuada del dashboard?
opciones:
  - id: a
    texto: "Comportamiento esperado: el agente está consolidando su adopción. Sin acción."
  - id: b
    texto: "Aumentar el umbral de la alerta para reducir ruido en el dashboard."
  - id: c
    texto: "Bandera roja: pico sostenido y concentrado en pocos usuarios. Investigar si hay uso anómalo (credenciales comprometidas, partner externo no autorizado, scope efectivo cambiado por consent reciente). Cruzar con Risky Users y con sign-in logs."
    correcta: true
  - id: d
    texto: "Aplicar inmediatamente un bloqueo CA hasta que se reduzca el volumen."
justificacion: |
  La heurística de DSPM for AI dice que un pico sostenido con conteo de usuarios estable es bandera roja: el incremento no se explica por más adopción sino por más volumen por usuario, que típicamente apunta a uso anómalo (cuentas comprometidas) o a expansión no autorizada (un nuevo flow que el equipo de seguridad no aprobó). La respuesta operativa correcta es investigar antes de actuar. A subestima el riesgo, B oculta el problema en lugar de resolverlo, D actúa sin diagnóstico y rompe operación legítima.
:::

::: pregunta
id: Q-10-3
oa: OA-10.3
tipo: multiple-response
dificultad: media
bloom: Aplicar
enunciado: |
  Un agente OBO lee tres archivos en una sola invocación: A (`Internal`), B (`Confidential`) y C (sin label, pero su contenido contiene un número de tarjeta de crédito detectable como SIT). El agente genera un output que combina los tres. ¿Cuáles de las siguientes afirmaciones son correctas? Selecciona todas las que apliquen.
opciones:
  - id: a
    texto: "El output hereda automáticamente la label `Confidential` por ser la más restrictiva de las fuentes etiquetadas."
    correcta: true
  - id: b
    texto: "El auto-labeling de Purview puede aplicar `Confidential` (o mayor) al output al detectar el SIT de tarjeta de crédito en C, incluso aunque C no tuviera label."
    correcta: true
  - id: c
    texto: "El output queda sin label porque uno de los archivos (C) no estaba etiquetado."
  - id: d
    texto: "El output activa cifrado AES-256 automático y watermark visible con UPN + fecha si la label final es `Confidential` o superior."
    correcta: true
  - id: e
    texto: "Para preservar la label en aplicaciones de terceros vía Agent 365 SDK, el desarrollador debe implementar la herencia siguiendo la guía del MIP SDK."
    correcta: true
justificacion: |
  Las cuatro afirmaciones A, B, D y E son correctas y describen funciones canónicas de Purview integrado con Agent 365: herencia automática de la label más restrictiva (A), auto-labeling vía SITs cuando hay fuentes sin etiquetar (B), protecciones que activa `Confidential+` automáticamente (D), y responsabilidad del desarrollador con MIP SDK para apps de terceros (E). La opción C es incorrecta: precisamente la herencia y el auto-labeling existen para que un archivo sin label no degrade la protección global.
:::

::: pregunta
id: Q-10-4
oa: OA-10.4
tipo: drag-and-drop
dificultad: media
bloom: Recordar
enunciado: |
  Empareja cada **evento de Audit Premium para Agent 365** con la información principal que registra.
items:
  - id: e1
    texto: "AgentInvoke"
  - id: e2
    texto: "AgentAutonomousInvoke"
  - id: e3
    texto: "AgentDataAccess"
  - id: e4
    texto: "AgentOutputGenerated"
  - id: e5
    texto: "AgentSensitivityLabelInherited"
targets:
  - id: t1
    label: "Invocación OBO con UPN del usuario, agentId, blueprintId, scopes"
  - id: t2
    label: "Invocación own identity sin UPN, autenticación por client_credentials"
  - id: t3
    label: "Acceso a un recurso concreto con resourceUri y sensitivityLabel"
  - id: t4
    label: "Output producido con outputSensitivityLabel y outputTokenCount"
  - id: t5
    label: "Herencia automática de la label más restrictiva con inputs y mostRestrictiveLabel"
correct_map:
  e1: t1
  e2: t2
  e3: t3
  e4: t4
  e5: t5
justificacion: |
  Los cinco eventos del esquema enriquecido de Audit Premium para Agent 365 cada uno responden a una pregunta distinta sobre la actividad del agente: quién invoca (AgentInvoke / AgentAutonomousInvoke según OBO o own identity), qué datos toca (AgentDataAccess), qué produce (AgentOutputGenerated) y por qué el output tiene esa label (AgentSensitivityLabelInherited). La combinación de los cinco permite reconstruir una invocación end-to-end en una auditoría regulatoria.
:::

::: pregunta
id: Q-10-5
oa: OA-10.6
tipo: ordering
dificultad: dificil
bloom: Analizar
enunciado: |
  Ordena las **capas de defensa coherentes** para un agente que opera sobre datos sensibles, desde la capa más temprana (decisión preventiva sobre permisos) hasta la capa más tardía (protección sobre el dato exfiltrado en el endpoint del usuario).
items:
  - id: o1
    texto: "Sensitivity label en el blueprint (Information Protection)"
  - id: o2
    texto: "Conditional Access que bloquea risk High y atributos sensibles fuera de horario"
  - id: o3
    texto: "Identity Protection con las 6 detecciones de agente activas"
  - id: o4
    texto: "Herencia automática de label en outputs + cifrado + watermark"
  - id: o5
    texto: "Endpoint DLP bloqueando exfiltración a aplicaciones no aprobadas"
correct_order:
  - o1
  - o2
  - o3
  - o4
  - o5
justificacion: |
  El orden refleja el flujo natural de una invocación: primero se define qué permisos puede heredar el agente (blueprint con label), luego se condiciona el acceso runtime (CA), Identity Protection detecta comportamiento anómalo durante la invocación, el output generado hereda label y se protege (encryption, watermark), y finalmente si el usuario intenta sacar el dato de la organización, Endpoint DLP bloquea en la última milla. Las cinco capas trabajan en serie: cada una recoge lo que la anterior no cubre. Saltarse capas crea huecos: por ejemplo, blueprint + Endpoint DLP sin CA permite invocaciones risk High que llegan hasta el endpoint y dependen de la última capa para no exfiltrar.
:::

::: pregunta
id: Q-10-6
oa: OA-10.5
tipo: scenario
dificultad: media
bloom: Crear
enunciado: |
  El responsable de Compliance te pide diseñar la política de Information Protection para outputs de un agente de RRHH que procesa datos personales sujetos a GDPR. Los outputs son resúmenes ejecutivos enviados a managers vía email. ¿Cuál es la configuración correcta?
opciones:
  - id: a
    texto: "Aplicar sensitivity label `Public` al blueprint y dejar que el output viaje sin restricciones para no entorpecer el flujo de comunicación."
  - id: b
    texto: "Aplicar sensitivity label `Highly Confidential` al blueprint con herencia automática al output. Encryption AES-256 obligatorio, watermark con UPN + fecha, restricción dura «no compartir fuera del tenant», auto-labeling por SITs (DNI, IBAN, etc.) como backup, y Endpoint DLP bloqueando copia a apps no aprobadas. Auditoría regulatoria via eDiscovery con custodian hold permanente."
    correcta: true
  - id: c
    texto: "Aplicar solo Endpoint DLP en los dispositivos de los managers. Las otras capas son innecesarias si el endpoint protege la salida."
  - id: d
    texto: "Aplicar sensitivity label solo manualmente, caso por caso, según el contenido del output específico."
justificacion: |
  GDPR exige defensa en profundidad sobre datos personales: cifrado, control de compartición, watermark identificativo, trazabilidad y bloqueo de exfiltración. La opción B aplica las cinco capas necesarias en su orden correcto. La A subestima brutalmente el riesgo regulatorio. La C ignora que sin label el output no se cifra y queda expuesto si llega a otro endpoint; además Endpoint DLP solo cubre el dispositivo configurado, no el viaje del email. La D es operacionalmente inviable: con cientos de outputs diarios, la aplicación manual genera errores y deja la mayoría sin proteger.
:::

---

## Caso de estudio (refuerzo, no evaluable)

> Tras responder el quiz, intenta este ejercicio antes de pasar a M11.

**Escenario.** **Pernod Ricard** (19.500 empleados, M365 E5 al 70 %, Agent 365 en piloto con 200 usuarios) tiene un agente «Tasting-Notes-Assistant» que ayuda al equipo de Marketing a redactar notas de cata de productos premium. El agente accede a la base de datos de productos (no sensible), al sistema interno de fórmulas (`Highly Confidential`, secreto industrial) y a archivos de Marketing (`Confidential`). Compliance te pide diseñar el dashboard operativo semanal del Chief Information Security Officer (CISO) para este agente.

**Tareas.**

1. Diseña la estructura del dashboard semanal (mockup en Markdown). Debe responder en 30 segundos a «¿está todo bien o hay que actuar?».
2. Lista los endpoints de Microsoft Graph que alimentan cada métrica.
3. Define los thresholds operativos (verde/ámbar/rojo) para cada KPI.
4. Define el SLA: cuánto tiempo máximo entre la aparición de una señal roja y la actuación del equipo.

<details>
<summary>Ver solución sugerida</summary>

**1. Estructura del dashboard semanal CISO — Agente Tasting-Notes-Assistant.**

```
┌─────────────────────────────────────────────────────────────────┐
│  CISO Dashboard — Tasting-Notes-Assistant                      │
│  Semana: <fecha> · Comparativa: vs semana anterior              │
├─────────────────────────────────────────────────────────────────┤
│  KPIs principales (30 segundos)                                 │
│  ────────────────────────────────────────────────────────────  │
│  [Invocaciones]  [Accesos a Fórmulas]  [Outputs HighlyConfid.]│
│      820              23 (▲8%)              17 (▼15%)         │
│       🟢                  🟡                    🟢              │
│                                                                 │
│  [Risk events]   [DLP blocks endpoint]   [Custodian holds]    │
│       0 High          3 (todos OK)              1 activo       │
│       🟢                  🟢                    🟢              │
│                                                                 │
│  Acciones esta semana                                           │
│  ────────────────────────────────────────────────────────────  │
│  · 2 alertas DSPM medium (revisadas, falsos positivos)          │
│  · 1 auto-label aplicado retroactivamente al archivo X          │
│  · 3 invocaciones desde IP nueva (todas legítimas: nuevo BD)    │
│                                                                 │
│  Compliance check                                               │
│  ────────────────────────────────────────────────────────────  │
│  · Audit log retention: 10 años ✓                              │
│  · eDiscovery custodian hold activo ✓                           │
│  · Sensitivity label inherita correctamente en 100% outputs ✓  │
└─────────────────────────────────────────────────────────────────┘
```

**2. Endpoints de Graph que alimentan cada métrica.**

| KPI | Endpoint Graph | Refresco |
|---|---|---|
| Invocaciones | `GET /beta/auditLogs/signIns?$filter=resourceType eq 'agent' and resourceId eq <agentId>` | diario |
| Accesos a Fórmulas | `GET /beta/auditLogs/agentDataAccess?$filter=agentId eq <id> and resourceUri like '%/formulas/%'` | diario |
| Outputs HighlyConfidential | `GET /beta/auditLogs/agentOutputGenerated?$filter=agentId eq <id> and outputSensitivityLabel eq 'HighlyConfidential'` | diario |
| Risk events | `GET /beta/identityProtection/riskDetections?$filter=agentId eq <id> and riskLevel in ('high', 'medium')` | hora |
| DLP blocks endpoint | `GET /beta/security/dataLossPreventionPolicies/blocks?$filter=resourceContext contains <agentId>` | diario |
| Custodian holds | `GET /beta/security/eDiscoveryHolds?$filter=custodianAgentId eq <agentId>` | semanal |

**3. Thresholds operativos.**

| KPI | 🟢 Verde | 🟡 Ámbar | 🔴 Rojo |
|---|---|---|---|
| Invocaciones | dentro de ±20 % baseline | +20-50 % | > +50 % o concentrado en < 3 usuarios |
| Accesos a Fórmulas | baseline 25-35/semana | 35-50/semana | > 50 o desde IP inusual |
| Outputs HC | 15-25/semana | 25-40/semana | > 40 o destinatario externo |
| Risk events | 0 High, < 3 Medium | 1 High, 3-5 Medium | > 1 High o Medium sostenido |
| DLP blocks | 0-5/semana (todos OK) | 5-10/semana o 1 sospechoso | > 1 sospechoso confirmado |

**4. SLA de respuesta.**

| Señal | Tiempo máximo de actuación |
|---|---|
| KPI en 🔴 | 4 horas hábiles (escalado a CISO + Compliance Officer) |
| Risk High en agente | 2 horas hábiles (escalado directo a SOC) |
| DLP block sospechoso | 24 horas (revisión y entrevista al usuario) |
| eDiscovery hit en custodian | 48 horas (notificación a regulador si aplica) |
| KPI en 🟡 sostenido > 2 semanas | revisión en próximo comité semanal CISO |

KPI agregado de salud: % de señales en SLA durante el mes. Objetivo > 95 %.

</details>
