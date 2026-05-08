---
modulo: 9
tipo: quiz-practica
titulo: "Quiz de práctica del Módulo 09"
duracion_min: 18
umbral_aprobado_pct: 70
intentos_max: null
ultima_actualizacion: 2026-05-07
preguntas:
  - Q-09-1
  - Q-09-2
  - Q-09-3
  - Q-09-4
  - Q-09-5
  - Q-09-6
  - Q-09-7
  - Q-09-8
caso_estudio: "TextilNova"
---

# Módulo 09 — Quiz de práctica

> Ocho preguntas para validar tu comprensión de permisos, Conditional Access para workload identities y las seis detecciones de Identity Protection. Intentos ilimitados, aprobado a partir del 70 % (6 de 8 correctas).
>
> Estas preguntas son distintas a las del examen final del curso. Cubren los 6 OAs con escenarios y datos diferentes.

---

::: pregunta
id: Q-09-1
oa: OA-09.1
tipo: multiple-choice
dificultad: media
bloom: Aplicar
enunciado: |
  Un usuario invoca a un agente OBO «Comercial-Pricing» que tiene en su blueprint heredado los scopes `User.Read`, `Mail.Read`, `Files.Read.All`, `Crm.Account.Read`. El usuario tiene licencia M365 E3 (sin Exchange Online) y consintió todos los scopes la primera vez que invocó al agente. ¿Qué scopes serán **efectivos** durante la invocación?
opciones:
  - id: a
    texto: "Los cuatro: blueprint heredado + consent → efectivos."
  - id: b
    texto: "Solo `User.Read`, `Files.Read.All` y `Crm.Account.Read`. `Mail.Read` falla porque el usuario NO tiene Exchange Online en su licencia E3, así que la intersección lo descarta."
    correcta: true
  - id: c
    texto: "Solo `User.Read`. El resto requieren licencia E5 mínima."
  - id: d
    texto: "Solo los scopes Microsoft Graph estándar (`User.Read`, `Mail.Read`, `Files.Read.All`). Los scopes de resource apps custom como `Crm.Account.Read` no aplican en OBO."
justificacion: |
  Los permisos efectivos en OBO son la **intersección triple** entre blueprint heredado, licencia del usuario y consent. Los tres deben coincidir. En este caso el usuario ha consentido los cuatro y el blueprint los hereda, pero la licencia E3 no incluye Exchange Online, así que `Mail.Read` falla en runtime con `403 Forbidden`. Los otros tres pasan. La opción A ignora la dimensión de licencia. La C inventa un requisito E5. La D inventa que las custom resource apps no aplican en OBO (sí aplican; son parte del blueprint igual que Graph).
:::

::: pregunta
id: Q-09-2
oa: OA-09.2
tipo: scenario
dificultad: media
bloom: Aplicar
enunciado: |
  El CISO te pide configurar una CA policy que **bloquee** invocaciones a agentes con `customSecurityAttributes.ConfidentialityLevel = HighlyConfidential` que ocurran fuera de la ventana horaria 07:00-19:00 CET. ¿Cuál es la configuración correcta de la policy?
opciones:
  - id: a
    texto: "Assignments: All workload identities. Conditions: Sign-in time NOT IN [07:00–19:00 CET]. Grants: Require MFA. Aplicará a humanos y a agentes por igual."
  - id: b
    texto: "Assignments: Workload identities filtered by attribute ConfidentialityLevel = HighlyConfidential. Conditions: Sign-in time NOT IN [07:00–19:00 CET]. Grants: Block access."
    correcta: true
  - id: c
    texto: "Assignments: All users. Conditions: User logged in to a HighlyConfidential agent. Grants: Block access."
  - id: d
    texto: "No es posible: las CA policies para workload identities no soportan condiciones de tiempo, solo risk score y location."
justificacion: |
  La policy correcta selecciona Workload identities filtradas por custom security attribute (Filtros sobre attributes son parte de las assignments en CA workload identities), añade condición temporal (sí soportada para workload identities) y aplica grant Block. La opción A no filtra por attribute (afectaría a todos los workload identities) y aplica MFA, que no tiene sentido sin humano. La C confunde users con workload identities. La D es falsa: las condiciones de tiempo sí están soportadas para workload identities desde GA del 1 de mayo de 2026.
:::

::: pregunta
id: Q-09-3
oa: OA-09.4
tipo: multiple-choice
dificultad: facil
bloom: Recordar
enunciado: |
  ¿Cuál de las siguientes **NO** es una de las seis detecciones específicas de Microsoft Entra Identity Protection para agentes?
opciones:
  - id: a
    texto: "Anomalous token use"
  - id: b
    texto: "Atypical agent travel"
  - id: c
    texto: "Token issuer anomaly"
  - id: d
    texto: "Brute force credentials"
    correcta: true
  - id: e
    texto: "Adversary-in-the-middle (AiTM)"
justificacion: |
  Las seis detecciones específicas para agentes son: anomalous token use, atypical agent travel, token issuer anomaly, suspicious agent application activity, verified threat actor signals, y adversary-in-the-middle (AiTM). **Brute force credentials** existe en Identity Protection pero solo para usuarios humanos: los agentes no se autentican con credenciales user/password sujetas a brute force, así que la detección no aplica a ellos.
:::

::: pregunta
id: Q-09-4
oa: OA-09.4
tipo: multiple-response
dificultad: media
bloom: Comprender
enunciado: |
  ¿Cuáles de las siguientes señales activan típicamente la detección **Suspicious agent application activity** de Identity Protection? Selecciona todas las que apliquen.
opciones:
  - id: a
    texto: "El agente intenta llamar a Microsoft Graph con scopes que su blueprint no hereda."
    correcta: true
  - id: b
    texto: "El agente realiza diez veces más invocaciones por hora que su baseline aprendido durante 30 días."
    correcta: true
  - id: c
    texto: "El usuario que invocó al agente está en travel atípico."
  - id: d
    texto: "El agente intenta operaciones que requieren elevación de privilegios fuera de su rol esperado."
    correcta: true
  - id: e
    texto: "Microsoft Threat Intelligence ha marcado la IP de origen como threat actor verificado."
justificacion: |
  Suspicious agent application activity detecta **operaciones que el blueprint no debería heredar** y **patrones de uso fuera del baseline** del propio agente. Las opciones A, B y D encajan. La C describe atypical travel del usuario humano (es una detección de Identity Protection para usuarios, no para agentes). La E describe verified threat actor signals (otra detección distinta de las seis).
:::

::: pregunta
id: Q-09-5
oa: OA-09.5
tipo: scenario
dificultad: dificil
bloom: Analizar
enunciado: |
  Un auditor regulatorio pregunta: «¿Qué usuario humano accedió al documento `tesoreria-Q3-cierre.xlsx` el día 15 de octubre a las 23:47?». Tu equipo investiga y descubre que el acceso lo hizo el agente Foundry «Tesoreria-Reconcile» en modo own identity. ¿Cómo respondes al auditor con trazabilidad operacional?
opciones:
  - id: a
    texto: "«Fue el agente Tesoreria-Reconcile, así que no podemos identificar un usuario humano: el modo own identity opera con identidad propia sin contexto de usuario invocador. Para auditoría regulatoria correlacionamos el agentId con el BusinessOwner del agente vía custom security attribute, que es la persona responsable de la decisión de qué hace el agente.»"
    correcta: true
  - id: b
    texto: "«Fue el último usuario que invocó el agente antes de las 23:47. Lo extraemos del sign-in log más reciente del agente.»"
  - id: c
    texto: "«No podemos responder: own identity no genera logs auditables.»"
  - id: d
    texto: "«Ningún humano accedió: own identity no permite acceso a documentos sensibles por diseño, así que la pregunta no aplica.»"
justificacion: |
  Own identity no tiene usuario invocador: el agente actúa con su propia identidad y los sign-in logs reflejan eso (`userPrincipalName` vacío, `appId` del agente). Para auditoría regulatoria la trazabilidad pasa por el **BusinessOwner** del agente (custom security attribute) que documenta quién es el responsable humano de la decisión de operar en automático. La opción A es la respuesta operativa correcta. La B inventa una correlación incorrecta. La C ignora que sí hay logs (autónomos, en sign-in logs y CloudAppEvents). La D es falsa: own identity puede acceder a documentos sensibles si su blueprint lo permite.
:::

::: pregunta
id: Q-09-6
oa: OA-09.6
tipo: drag-and-drop
dificultad: media
bloom: Aplicar
enunciado: |
  Empareja cada **capa de defensa** del control de acceso a agentes con la pieza de Microsoft Entra / Microsoft Graph donde se configura.
items:
  - id: c1
    texto: "Limitar el conjunto de scopes Graph que cualquier agente derivado puede heredar."
  - id: c2
    texto: "Bloquear invocaciones de un agente cuando su risk score pasa a High."
  - id: c3
    texto: "Detectar que un agente intenta operaciones fuera del baseline aprendido."
  - id: c4
    texto: "Marcar al agente como `requireSponsor = true` para que no opere sin sponsor activo."
  - id: c5
    texto: "Bloquear invocaciones desde IPs marcadas como threat actor verificado por Microsoft Threat Intelligence."
targets:
  - id: blueprint
    label: "Blueprint (preventiva, estática)"
  - id: ca
    label: "Conditional Access (preventiva, dinámica)"
  - id: ip
    label: "Identity Protection (detectiva, dinámica)"
correct_map:
  c1: blueprint
  c2: ca
  c3: ip
  c4: blueprint
  c5: ca
justificacion: |
  - **Blueprint (preventiva, estática)**: define qué scopes hereda el agente y restricciones operativas como `requireSponsor`. Es la primera capa.
  - **Conditional Access (preventiva, dinámica)**: condiciona la invocación según signals (risk score, location, custom attributes). Bloquea en runtime.
  - **Identity Protection (detectiva, dinámica)**: detecta comportamiento anómalo y produce risk scores que la CA lee. Es el motor de detección.

  La señal «threat actor verificado» se usa típicamente en una CA policy con condición de location IP (la marca proviene de Identity Protection pero la decisión Block se toma en CA). El baseline del agente lo aprende ID Protection y dispara la detección «suspicious agent application activity».
:::

::: pregunta
id: Q-09-7
oa: OA-09.2
tipo: scenario
dificultad: media
bloom: Analizar
enunciado: |
  Has aplicado una CA policy `[Agents] Block High Risk` desde hace dos semanas. El equipo de Comercial reporta que **un usuario concreto** ha estado teniendo errores `403 Conditional Access` cuando intenta invocar al agente «Pricing-Bot», pero otros usuarios del mismo equipo no tienen problemas. El agente está en risk Low. ¿Cuál es la causa más probable?
opciones:
  - id: a
    texto: "La CA policy está mal configurada: debe filtrar por agente, no por usuario."
  - id: b
    texto: "La CA policy tiene un assignment Exclude que incluye al usuario por error o el usuario tiene un risk High propio (no del agente) que está disparando otra policy. Hay que mirar sign-in logs filtrando por `userPrincipalName` para ver qué CA está bloqueando exactamente."
    correcta: true
  - id: c
    texto: "El agente está mal configurado: debería estar en risk High, no en Low."
  - id: d
    texto: "El usuario tiene una licencia obsoleta que ya no cubre invocaciones a agentes."
justificacion: |
  El síntoma («un usuario concreto, otros del mismo equipo no») apunta a una asignación específica del usuario, no a un problema general del agente. Las posibilidades reales son: (1) el usuario es Excluded en una policy que debería incluirlo, (2) el usuario tiene un risk humano propio en High y otra policy general lo bloquea (no la del agente), (3) hay una policy diferente que aplica al usuario y no al resto del equipo. La forma de diagnosticar es ir a sign-in logs filtrados por UPN del usuario y mirar qué CA policy aparece como aplicada con resultado Block. La opción A no encaja con el síntoma. La C ignora que el agente está documentado en Low. La D inventa una causa.
:::

::: pregunta
id: Q-09-8
oa: OA-09.1
tipo: multiple-choice
dificultad: facil
bloom: Comprender
enunciado: |
  En el contexto de Microsoft Agent 365, los **custom security attributes** son…
opciones:
  - id: a
    texto: "Permisos adicionales que el agente puede ejecutar más allá de los scopes heredados del blueprint."
  - id: b
    texto: "Metadatos de gobernanza asignados a cada agent identity individual (Department, ConfidentialityLevel, BusinessOwner, AgentPurpose) que permiten filtrar agentes en políticas CA, DLP y reportes sin mantener listas nominales."
    correcta: true
  - id: c
    texto: "Atributos de seguridad heredados del usuario que invoca al agente en modo OBO."
  - id: d
    texto: "Configuración del runtime del agente en Foundry (CPU, memoria, capacity)."
justificacion: |
  Los custom security attributes son **metadatos de gobernanza**, no permisos. No autorizan operaciones ni se intersectan en runtime; sirven para que las políticas (CA, DLP, reportes) puedan dirigirse a categorías de agentes sin tener que listar nominalmente cada agente. Cuando llega un agente nuevo con `Department = Finanzas`, las policies que filtran por ese atributo se aplican automáticamente. La A confunde con permisos. La C es falsa (no hay herencia desde el usuario invocador para attributes). La D inventa un uso de configuración técnica.
:::

---

## Caso de estudio (refuerzo, no evaluable)

> Tras responder el quiz, intenta este ejercicio antes de pasar a M10.

**Escenario.** **TextilNova** (2.000 empleados, M365 E3 con Copilot al 80 %, Agent 365 standalone) acaba de inaugurar el equipo de Seguridad de IA. La directora del equipo te pide diseñar el **dashboard operativo diario** que su gente revisará cada mañana para gestionar el control de acceso de los 280 agentes activos. Pide:

1. Tres KPIs que respondan a «¿está todo bien o hay que actuar?» en menos de 30 segundos.
2. Tres listas accionables (lo que hay que tocar hoy).
3. Una sección de tendencias semanales (¿estamos mejor o peor que la semana pasada?).
4. Origen de cada dato: en qué admin center vive y cómo se actualiza.

**Tareas.**

1. Diseña la estructura del dashboard (mockup en Markdown, sin gráficos reales).
2. Lista las llamadas Microsoft Graph que alimentan cada sección y la frecuencia de refresco apropiada.
3. Define el SLA: cuánto tiempo máximo puede pasar entre que aparece un High Risk Agent y que el equipo lo triagea.

<details>
<summary>Ver solución sugerida</summary>

**1. Estructura del dashboard.**

```
┌─────────────────────────────────────────────────────────────┐
│  Agent Security Dashboard — TextilNova                      │
│  Última actualización: <timestamp>                          │
├─────────────────────────────────────────────────────────────┤
│  KPIs (revisión 30 segundos)                                │
│  ────────────────────────────────────────────────────────   │
│  [Agentes en High Risk]  [CA blocks últimas 24h]  [SLA OK]  │
│       3 / 280                  47                  98%      │
│                                                             │
│  Listas accionables (lo que tocas hoy)                      │
│  ────────────────────────────────────────────────────────   │
│  1. Risky Agents pendientes de triaje (3)                   │
│     - agent-id-x · Department: Finanzas · Risk: High        │
│       Detección: anomalous token use                        │
│     - agent-id-y · Department: Comercial · Risk: High       │
│       Detección: token issuer anomaly                       │
│     - ...                                                   │
│                                                             │
│  2. CA Report-only con falsos positivos > 5% (1)            │
│     - "[Agents] Block off-hours" — 12 FP en última semana   │
│       Acción: revisar condiciones                           │
│                                                             │
│  3. Blueprints sin sponsor activo (0)                       │
│                                                             │
│  Tendencias semanales                                       │
│  ────────────────────────────────────────────────────────   │
│  - Agentes en Risk High: 3 hoy vs 7 hace 7 días (-57%)      │
│  - Detecciones nuevas: 12 vs 18 (-33%)                      │
│  - Median triage time: 2.5h vs 4.1h (-39%)                  │
└─────────────────────────────────────────────────────────────┘
```

**2. Origen de los datos y refresco.**

| Sección | Endpoint Graph | Refresco |
|---|---|---|
| Agentes en High Risk | `GET /beta/identityProtection/riskyAgents?$filter=riskLevel eq 'high' and riskState eq 'atRisk'` | 5 min |
| CA blocks últimas 24h | `GET /beta/auditLogs/signIns?$filter=conditionalAccessStatus eq 'failure' and resourceType eq 'agent' and createdDateTime ge <24h ago>` | 15 min |
| SLA OK | calculado: `% Risky Agents triagados en menos de 8h hábiles` | 1 hora |
| Risky Agents pendientes | `GET /beta/identityProtection/riskyAgents?$filter=riskState eq 'atRisk' and riskLevel eq 'high'` | 5 min |
| CA Report-only con FP | calcular `count(signIns conditionalAccessStatus = notApplied — reportingOnly) / total` por policy en últimos 7d | diario |
| Blueprints sin sponsor | `GET /beta/identity/agentIdentityBlueprints?$filter=requireSponsor eq true and sponsorId eq null` | 1 hora |
| Tendencias semanales | agregaciones sobre los mismos endpoints en ventana 7d vs 7d anterior | diario |

**3. SLA de triaje.**

- **Risk High**: triaje en menos de 8 horas hábiles (objetivo: 4h). Si el agente afecta a `ConfidentialityLevel = HighlyConfidential`, baja a 2 horas.
- **Risk Medium**: triaje en menos de 24 horas hábiles.
- **Risk Low**: revisión en menos de 7 días (no bloquea operativa).

KPI «SLA OK» = % de Risky Agents triagados dentro de su SLA en los últimos 30 días. Objetivo > 95 %.

</details>
