---
modulo: 12
tipo: teoria
titulo: "Monitorización, auditoría y reporting con Microsoft Defender XDR"
duracion_lectura_min: 90
ultima_actualizacion: 2026-05-11
objetivos_aprendizaje:
  - id: OA-12.1
    texto: "Posicionar Microsoft Defender XDR como capa de detección e investigación en el ecosistema Agent 365, diferenciándolo de las capas preventivas (M09 Conditional Access, M10 Information Protection, M11 DLP y Communication Compliance)."
    bloom: Comprender
  - id: OA-12.2
    texto: "Navegar el Microsoft Defender XDR portal e identificar las superficies relevantes para Agent 365: Incidents, Alerts, Advanced hunting, Threat analytics, Custom detection rules."
    bloom: Aplicar
  - id: OA-12.3
    texto: "Consultar la tabla `CloudAppEvents` con KQL para identificar invocaciones de agentes, accesos a datos sensibles y patrones de uso característicos."
    bloom: Aplicar
  - id: OA-12.4
    texto: "Construir queries KQL para detectar tres patrones problemáticos canónicos: volumen anómalo de invocaciones, exfiltración de datos vía agente, compromiso de identidad de agente."
    bloom: Crear
  - id: OA-12.5
    texto: "Configurar custom detection rules en Defender XDR aplicadas a Agent 365 con severidad calibrada, enriquecimiento de contexto y acciones automatizadas."
    bloom: Crear
  - id: OA-12.6
    texto: "Integrar Defender XDR con Microsoft Sentinel para SOCs maduros: workflow incidente → playbook → contención, retención extendida y correlación cross-tenant."
    bloom: Aplicar
  - id: OA-12.7
    texto: "Investigar un incidente real con participación de agente: construir timeline, correlacionar señales de múltiples productos, ejecutar contención y producir post-mortem."
    bloom: Analizar
---

# Módulo 12 — Monitorización, auditoría y reporting con Microsoft Defender XDR

> **Duración estimada de lectura:** 90 minutos.
>
> **Prerrequisitos:** M01 (fundamentos), M06 (Entra Agent ID), M09 (Conditional Access), M10 (Purview Information Protection), M11 (DLP y Communication Compliance).
>
> Las capas anteriores previenen y protegen. **Defender XDR detecta e investiga cuando algo se cuela a pesar de la prevención.** Es la red de seguridad del programa: nada que se prevenga al 100 % en seguridad real, y XDR es la disciplina que asume esa realidad. M12 abre el Área 5 del examen (Monitor, troubleshoot and improve) y aporta 7 preguntas al banco oficial.

---

## 12.1 Posicionamiento: Defender XDR como red de seguridad

Las capas que vimos en M09-M11 son **preventivas**: deciden si algo se permite, qué protección se aplica, qué acciones se bloquean. Defender XDR es **detectiva y reactiva**: asume que algo se va a colar y proporciona la capacidad de detectar el evento, investigar su contexto, contener su impacto y aprender para futuras prevenciones.

### 12.1.1 Las cinco capas en serie

| Capa | Disciplina | Cuándo actúa | Foco |
|---|---|---|---|
| **M09** | Conditional Access + Identity Protection | En el intento de invocación | ¿Permitir o no? |
| **M10** | Purview Information Protection | En la creación o ingestión del dato | ¿Cómo se etiqueta y protege? |
| **M11** | DLP + Communication Compliance | En la acción sobre el dato | ¿Permitir, auditar, bloquear, justificar? |
| **M12** | **Defender XDR** | **En la detección post-evento** | **¿Está pasando algo que las capas previas no cubrieron?** |
| (M11 también) | Communication Compliance | En la revisión humana posterior | ¿Es relevante para escalado HR/Legal? |

Una organización madura opera las cinco capas en paralelo. Defender XDR es la capa que **convierte lo que se escapa de las preventivas en evidencia accionable**.

### 12.1.2 Por qué la prevención no basta

Tres tipos de incidentes requieren capacidad detectiva específica, porque la prevención no los cubre por diseño:

- **Falsos negativos de las detecciones preventivas**: un classifier de DLP con 85 % precision tiene 15 % de FN; en una organización con 50.000 invocaciones diarias, son miles de eventos potencialmente problemáticos cada semana que pasan los filtros preventivos.
- **Comportamiento que es legítimo aisladamente pero anómalo en conjunto**: cada invocación individual cumple policy, pero el patrón agregado señala compromiso (el mismo agente invocado 500 veces en una hora desde IPs nuevas).
- **Compromiso de identidad del propio agente**: si un atacante consigue las credenciales del agente, su comportamiento subsiguiente respeta todas las policies de acceso (es legítimo formalmente) pero su intención es maliciosa. Solo la detección por desviación de patrón puede identificarlo.

Defender XDR cubre los tres casos con detección, hunting y correlación entre productos.

### 12.1.3 Componentes de Defender XDR relevantes para Agent 365

| Componente | Aplica a agentes |
|---|---|
| **Microsoft Defender for Cloud Apps** | Sí — origina los eventos de `CloudAppEvents` de Agent 365 |
| **Microsoft Defender for Identity** | Sí — detecta compromiso de identidad de agente (Entra Agent ID) |
| **Microsoft Defender for Endpoint** | Indirectamente — endpoint del usuario invocador |
| **Microsoft Defender for Office 365** | Sí — emails enviados por agentes vía Copilot |
| **Microsoft Entra ID Protection** | Sí — risk scores específicos para workload identities (cubierto parcialmente en M09) |
| **Custom detection rules** | Sí — reglas KQL específicas para Agent 365 |
| **Advanced hunting** | Sí — la palanca operativa principal del SOC |
| **Sentinel** (integración) | Sí — para SOCs maduros con correlación cross-tenant |

---

## 12.2 El portal Defender XDR para agentes

El portal Microsoft Defender XDR (security.microsoft.com) es el punto único donde el SOC opera. Para Agent 365, las superficies relevantes son cinco.

### 12.2.1 Incidents

Los incidentes son agrupaciones automáticas de alertas relacionadas que Defender correlaciona por tiempo, identidad, recurso y técnica MITRE ATT&CK. Cuando varias alertas de distintos productos apuntan al mismo agente o al mismo usuario invocador, Defender las agrupa en un único incidente que el SOC tier 1 toma como caso unificado.

Operacionalmente, **los incidentes son la unidad de trabajo del SOC, no las alertas individuales**. Un SOC bien configurado nunca trabaja a nivel de alerta.

Un incidente típico que involucra a un agente puede correlacionar:

- Alerta de Identity Protection: «risk anomalous token use» en el agente.
- Alerta de Defender for Cloud Apps: «mass download» del mismo agente.
- Alerta de Purview DLP: «policy override events» del mismo agente con tasa alta.
- Alerta del SIEM correlacionado: «multiple sign-in attempts from new IP».

Las cuatro alertas individuales son ruido. Juntas, en un incidente, son la historia: el agente ha sido comprometido.

### 12.2.2 Alerts

Las alertas individuales aparecen en la vista de Alerts del portal. Para Agent 365, las más frecuentes son:

| Alerta | Producto | Causa típica |
|---|---|---|
| `AnomalousAgentInvocationVolume` | Defender for Cloud Apps | Pico inusual de invocaciones por agente |
| `AgentAccessFromNewIP` | Defender for Cloud Apps | Primer acceso del agente desde IP no vista |
| `AgentMassDownload` | Defender for Cloud Apps | Descarga masiva de archivos desde un agente |
| `WorkloadIdentityRiskHigh` | Entra Identity Protection | Risk score de la identidad del agente en High |
| `DlpRuleMatchSensitive` | Purview DLP | Match de DLP con sensitivity `HighlyConfidential` |
| `CompromisedAgent` | Defender for Identity | Indicadores de compromiso del propio agente |

### 12.2.3 Advanced hunting

Advanced hunting es la consola KQL del SOC. Permite escribir queries libres sobre las tablas que Defender expone, incluyendo `CloudAppEvents` (la tabla principal para Agent 365). Es donde el SOC tier 2/3 investiga, donde el threat hunter busca patrones nuevos, y donde se construyen las custom detection rules.

### 12.2.4 Custom detection rules

Reglas KQL que Defender ejecuta periódicamente (cada hora típicamente) y genera alertas custom cuando coinciden. Permiten al SOC formalizar patrones específicos de la organización que no están cubiertos por las detecciones built-in. Es donde se materializan las hipótesis del threat hunting que demuestran valor.

### 12.2.5 Threat analytics

Reports prepared by Microsoft Threat Intelligence con campañas conocidas, técnicas activas y guías de mitigación. Para Agent 365 hay un report dedicado a «attacks on AI agents» que se actualiza mensualmente. El SOC lo revisa al inicio de cada turno.

---

## 12.3 La tabla CloudAppEvents y campos enriquecidos

`CloudAppEvents` es la tabla central de Defender XDR para investigación de Agent 365. Registra todas las invocaciones, accesos a datos y outputs producidos por agentes con un esquema enriquecido específico para la disciplina.

### 12.3.1 Esquema relevante

| Campo | Tipo | Descripción |
|---|---|---|
| `Timestamp` | datetime | Momento del evento |
| `ActionType` | string | Tipo de acción: `AgentInvoke`, `AgentDataAccess`, `AgentOutputGenerated`, etc. |
| `AccountObjectId` | string | Object ID del usuario invocador (si OBO) |
| `AccountUpn` | string | UPN del usuario invocador (si OBO) |
| `Application` | string | «Microsoft Agent 365» |
| `AgentId` | string | Identificador único del agente |
| `AgentBlueprintId` | string | Blueprint del que deriva el agente |
| `AgentOwnerId` | string | Owner del agente |
| `SourceIPAddress` | string | IP desde la que se invoca |
| `Country` | string | País resuelto por geolocalización de IP |
| `City` | string | Ciudad resuelto por geolocalización |
| `UserAgent` | string | Useragent del cliente |
| `ResourceUri` | string | Recurso accedido (Graph URI, archivo, registro SaaS) |
| `InputDataSensitivity` | string | Sensitivity de los datos accedidos |
| `OutputDataSensitivity` | string | Sensitivity del output generado |
| `RawEventData` | dynamic | Payload completo en JSON (útil para investigación profunda) |
| `CorrelationId` | string | ID para correlacionar invocación + accesos + output |

### 12.3.2 Query base: explorar invocaciones recientes

```kql
CloudAppEvents
| where Application == "Microsoft Agent 365"
| where Timestamp >= ago(7d)
| project Timestamp, AgentId, AccountUpn, ActionType, ResourceUri,
          InputDataSensitivity, OutputDataSensitivity, SourceIPAddress, Country
| order by Timestamp desc
| take 100
```

Este patrón básico es el primero que aprende cualquier analista del SOC.

### 12.3.3 Latencia de ingestión

Los eventos aparecen en `CloudAppEvents` típicamente entre **2 y 10 minutos** después de la invocación real. Para detecciones near real-time esto es aceptable. Para respuesta de incidentes activos no — el SOC usa también el portal de Defender for Cloud Apps que tiene latencia inferior al minuto para acción manual urgente.

### 12.3.4 Retención

Defender XDR retiene `CloudAppEvents` por 30 días por defecto. Con Sentinel conectado, la retención se extiende a 90 días en el workspace operativo y 7 años en el archivo (Long-Term Retention). Para investigaciones regulatorias o pleitos, eDiscovery Premium (M10) tiene retención hasta 10 años con audit log enriquecido distinto pero correlacionable por `correlationId`.

---

## 12.4 Hunting con KQL: queries fundamentales

Las queries que aparecen una y otra vez en operación del SOC para Agent 365 son cinco. Memorizarlas o tenerlas en un repositorio compartido es la diferencia entre un analista que tarda 5 minutos en responder una pregunta y uno que tarda 45.

### 12.4.1 Top N agentes por invocaciones

```kql
CloudAppEvents
| where Application == "Microsoft Agent 365"
| where ActionType == "AgentInvoke"
| where Timestamp >= ago(7d)
| summarize Invocations = count() by AgentId
| order by Invocations desc
| take 10
```

Sirve para identificar quién acapara recursos, qué agentes son los más usados (consolidar conocimiento) y qué agentes desplegados nunca se invocan (candidatos a retirada).

### 12.4.2 Invocaciones por usuario, agrupadas por sensitivity

```kql
CloudAppEvents
| where Application == "Microsoft Agent 365"
| where ActionType == "AgentDataAccess"
| where Timestamp >= ago(7d)
| extend Sensitivity = tostring(InputDataSensitivity)
| summarize Accesos = count() by AccountUpn, Sensitivity
| order by Accesos desc
```

Identifica patrones del tipo «este usuario accede 200 veces/semana a `HighlyConfidential` vía agentes», potencial bandera para revisión.

### 12.4.3 Agentes accediendo desde nuevas geografías

```kql
CloudAppEvents
| where Application == "Microsoft Agent 365"
| where ActionType == "AgentInvoke"
| where Timestamp between (ago(30d) .. ago(7d))
| summarize CountriesBefore = make_set(Country) by AgentId
| join kind=inner (
    CloudAppEvents
    | where Application == "Microsoft Agent 365"
    | where Timestamp >= ago(7d)
    | summarize CountriesNow = make_set(Country) by AgentId
) on AgentId
| extend NewCountries = set_difference(CountriesNow, CountriesBefore)
| where array_length(NewCountries) > 0
| project AgentId, NewCountries, CountriesBefore, CountriesNow
```

Detecta agentes que en los últimos 7 días han comenzado a operar desde países no vistos en los 30 días previos. Patrón clásico de compromiso o expansión no aprobada.

### 12.4.4 Outputs con sensitivity más alta de lo esperado

```kql
CloudAppEvents
| where Application == "Microsoft Agent 365"
| where ActionType == "AgentOutputGenerated"
| where Timestamp >= ago(7d)
| where OutputDataSensitivity in ("Confidential", "HighlyConfidential")
| extend RawData = parse_json(RawEventData)
| project Timestamp, AgentId, AccountUpn, OutputDataSensitivity,
          OutputTokenCount = toint(RawData.outputTokenCount),
          CorrelationId
| order by Timestamp desc
```

Sirve para auditar la herencia automática de label en outputs (definida en M10) y validar que el comportamiento sea coherente con la naturaleza del agente.

### 12.4.5 Correlación output → invocación original

```kql
let correlationOfInterest = "<correlationId>";
CloudAppEvents
| where Application == "Microsoft Agent 365"
| extend RawData = parse_json(RawEventData)
| where tostring(RawData.correlationId) == correlationOfInterest
| project Timestamp, ActionType, AgentId, AccountUpn, ResourceUri,
          InputDataSensitivity, OutputDataSensitivity
| order by Timestamp asc
```

Dado un `correlationId` (típicamente extraído del primer hallazgo de hunting), reconstruye la historia completa de la invocación: invoke → data accesses → output generated. Es el patrón de investigación más usado en respuesta a incidentes.

---

## 12.5 Tres patrones problemáticos canónicos

Más allá de queries fundamentales, hay tres patrones de uso problemático que el SOC debe detectar de forma sistemática. Cada uno tiene su query KQL canónica.

### 12.5.1 Volumen anómalo

Un agente invocándose con frecuencia significativamente superior a su baseline puede indicar: cuenta del usuario invocador comprometida, mal uso intencional, automatización no aprobada por encima de la org central.

```kql
let baseline =
    CloudAppEvents
    | where Application == "Microsoft Agent 365"
    | where ActionType == "AgentInvoke"
    | where Timestamp between (ago(30d) .. ago(7d))
    | summarize HourlyAvg = round(count() / 24 / 23.0, 2) by AgentId;
CloudAppEvents
| where Application == "Microsoft Agent 365"
| where ActionType == "AgentInvoke"
| where Timestamp >= ago(1h)
| summarize CurrentCount = count() by AgentId
| join kind=inner baseline on AgentId
| extend Multiplier = round(CurrentCount / HourlyAvg, 1)
| where Multiplier >= 5
| project AgentId, HourlyAvg, CurrentCount, Multiplier
| order by Multiplier desc
```

Threshold típico: 5x sobre baseline horario activa investigación. 10x activa alerta High al SOC.

### 12.5.2 Exfiltración vía agente

Patrón de un agente que en pocas horas accede a un volumen anormal de archivos sensibles, especialmente combinado con la generación de outputs grandes hacia destinatarios externos o canales no estándar.

```kql
CloudAppEvents
| where Application == "Microsoft Agent 365"
| where Timestamp >= ago(2h)
| extend RawData = parse_json(RawEventData)
| summarize
    DistinctSensitiveDocs = dcountif(ResourceUri, InputDataSensitivity in ("Confidential", "HighlyConfidential")),
    TotalOutputTokens = sumif(toint(RawData.outputTokenCount), ActionType == "AgentOutputGenerated"),
    DistinctOutputs = countif(ActionType == "AgentOutputGenerated")
  by AgentId, AccountUpn
| where DistinctSensitiveDocs > 30 and DistinctOutputs > 5
| project AgentId, AccountUpn, DistinctSensitiveDocs, TotalOutputTokens, DistinctOutputs
| order by DistinctSensitiveDocs desc
```

Threshold típico: > 30 archivos sensibles distintos accedidos en 2 horas + > 5 outputs producidos en la misma ventana = caso para investigación inmediata.

### 12.5.3 Compromiso de identidad de agente

Indicador: el agente genera tráfico desde IPs nunca vistas + agentForwarder o useragent nuevo + tokens emitidos en patrones diferentes al baseline.

```kql
CloudAppEvents
| where Application == "Microsoft Agent 365"
| where ActionType == "AgentInvoke"
| where Timestamp >= ago(1h)
| extend RawData = parse_json(RawEventData)
| summarize
    NewIPs = dcount(SourceIPAddress),
    NewUserAgents = dcount(UserAgent),
    InvocationsLastHour = count()
  by AgentId
| join kind=inner (
    CloudAppEvents
    | where Application == "Microsoft Agent 365"
    | where ActionType == "AgentInvoke"
    | where Timestamp between (ago(30d) .. ago(1h))
    | summarize HistoricalIPs = make_set(SourceIPAddress),
                HistoricalUAs = make_set(UserAgent) by AgentId
) on AgentId
| extend NewSources = set_difference(make_set(SourceIPAddress), HistoricalIPs)
| where array_length(NewSources) > 2 or NewUserAgents > 3
| project AgentId, NewSources, NewUserAgents, InvocationsLastHour
```

Threshold típico: > 2 IPs nuevas en 1 hora o > 3 useragents distintos = indicador de compromiso candidato.

---

## 12.6 Custom detection rules: formalizar el hunting

Una vez una query KQL demuestra valor (detecta patrones reales con baja tasa de falsos positivos), se promueve a custom detection rule. Defender la ejecuta periódicamente (cada hora típicamente) y genera alertas automáticas cuando coincide.

### 12.6.1 Anatomía de una custom detection rule

| Componente | Descripción |
|---|---|
| **Nombre y descripción** | Auto-explicativos, con referencia interna al runbook de respuesta |
| **Severidad** | Informational / Low / Medium / High / Critical. Calibrar según volumen y criticidad |
| **Categoría MITRE ATT&CK** | Mapeo a tactic + technique (ej. T1078 Valid Accounts para compromiso de identidad) |
| **Query KQL** | La query, con cláusulas que produzcan resultados directamente accionables |
| **Schedule** | Cada cuánto se ejecuta (15 min, 1 hora, 4 horas, 24 horas) |
| **Entities** | Qué entidades extraer del resultado (AgentId, UserPrincipalName, IPAddress) para que Defender las correlacione |
| **Actions on alert** | Acciones automáticas opcionales: notificar grupo, ejecutar Logic App, llamar playbook de Sentinel |

### 12.6.2 Calibrar severidad

Un error común al desplegar custom rules es asignar severidad High a todas. Resultado: el SOC se satura, ignora las alertas, y se pierde el valor de tener detección custom. La calibración correcta:

- **Critical**: posible compromiso confirmado, requiere respuesta < 15 min (ej. exfiltración masiva confirmada).
- **High**: indicadores fuertes de compromiso, requiere respuesta < 1 hora (ej. acceso desde país no esperado + volumen anómalo).
- **Medium**: anomalía que requiere investigación pero no respuesta inmediata, < 4 horas (ej. solo volumen anómalo sin contexto adicional).
- **Low**: hallazgos de interés para hunting pero sin urgencia, < 24 horas.
- **Informational**: telemetría de soporte, no genera alerta operativa.

### 12.6.3 Acciones automatizadas

Defender XDR puede ejecutar acciones automáticas cuando una custom rule dispara:

- **Disable agent**: revoca temporalmente las credenciales del agente (severo, solo para Critical confirmado).
- **Disable invoking user**: deshabilita la cuenta del usuario invocador.
- **Notify group**: email al SOC tier 1 con contexto enriquecido.
- **Run playbook (Sentinel)**: dispara automation que recoge evidencia adicional, abre ticket, notifica.

Las acciones disruptivas (disable) solo se automatizan tras 2-3 meses de operación de la rule con tasa de FP < 1 %. Hasta entonces, las acciones son solo notify.

---

## 12.7 Integración con Microsoft Sentinel

Para SOCs maduros, Microsoft Sentinel es el SIEM/SOAR que extiende Defender XDR con capacidades adicionales: retención larga, correlación cross-tenant, playbooks de respuesta automática, dashboards ejecutivos personalizados.

### 12.7.1 Conector Defender XDR → Sentinel

El conector nativo «Microsoft Defender XDR» en Sentinel ingiere automáticamente: incidents, alerts, raw events de `CloudAppEvents` y otras tablas. La ingestión es near real-time (< 1 min) y se factura por GB ingerido.

### 12.7.2 Workspaces y retención

Sentinel separa retención operativa (workspace) de archivo (Long-Term Retention):

- **Workspace operativo**: queries instantáneas, retención típica 90-180 días, coste estándar.
- **Long-Term Retention**: archivo barato (1/4 del coste de workspace), queries más lentas, retención hasta 12 años, requerido para auditorías regulatorias largas.

Una organización con M365 E5 + Sentinel típicamente configura: workspace 90 días + LTR 7 años para incidentes financieros, sanitarios o legales sensibles.

### 12.7.3 Playbooks: el cierre del ciclo

Un playbook de Sentinel es un Logic App que se ejecuta cuando se dispara una alerta o incidente. Cubre la parte automatizable de la respuesta. Para Agent 365, los playbooks comunes son:

| Playbook | Trigger | Acciones |
|---|---|---|
| **AgentCompromise-Containment** | Incidente con `WorkloadIdentityRiskHigh` + acceso desde nueva geografía | Disable agent vía Graph API; revoke active tokens; notificar a owner; crear ticket ServiceNow |
| **DLPMassOverride-Investigation** | > 10 override events del mismo usuario en 1 hora | Recopilar últimos 100 outputs del usuario; correlacionar con calendario; abrir ticket investigación; notificar legal si involucra HighlyConfidential |
| **AgentMassDownload-Forensic** | Pattern de exfiltración detectada | Snapshot del audit log del agente; custodian hold preventivo en eDiscovery; bloquear cuenta de usuario invocador; alertar CISO si > umbral |

### 12.7.4 Correlación cross-tenant

Para organizaciones multi-tenant (grupos corporativos, M&A activos, consultoras), Sentinel permite correlacionar señales de varios tenants en un workspace central. Caso de uso típico: un atacante intenta comprometer agentes en varias subsidiarias simultáneamente; las señales individuales son débiles por tenant pero correlacionadas son inequívocas.

---

## Glosario de términos clave del módulo

| Término | Definición breve |
|---|---|
| **Microsoft Defender XDR** | Plataforma extended detection and response unificada que integra Defender for Cloud Apps, Defender for Identity, Defender for Endpoint, Defender for Office 365 y Entra ID Protection en un único portal. |
| **Microsoft Defender for Cloud Apps** | Componente que origina los eventos de Agent 365 en `CloudAppEvents`. Actúa como CASB (Cloud Access Security Broker). |
| **CloudAppEvents** | Tabla central de Defender XDR para investigación de Agent 365. Esquema enriquecido con `AgentId`, `AgentBlueprintId`, `InputDataSensitivity`, `OutputDataSensitivity` y `CorrelationId`. |
| **Advanced hunting** | Consola KQL del portal Defender XDR. Permite queries libres sobre todas las tablas y es el punto de operación del SOC tier 2/3. |
| **KQL (Kusto Query Language)** | Lenguaje de consulta de Microsoft para datos telemétricos. Sintaxis basada en pipes (`|`) y operadores funcionales. Estándar en Defender, Sentinel, Log Analytics. |
| **Incident** | Agrupación automática de alertas relacionadas que Defender correlaciona por tiempo, identidad, recurso y técnica MITRE ATT&CK. Es la unidad de trabajo del SOC. |
| **Custom detection rule** | Regla KQL que Defender ejecuta periódicamente (típicamente cada hora) y genera alertas automáticas cuando coincide. |
| **MITRE ATT&CK** | Framework de tácticas y técnicas adversarias mantenido por MITRE. Estándar de la industria para categorizar amenazas. Defender mapea sus detecciones contra este framework. |
| **Threat analytics** | Reports prepared by Microsoft Threat Intelligence con campañas conocidas, técnicas activas y guías de mitigación. Para Agent 365 hay un report dedicado. |
| **Microsoft Sentinel** | SIEM/SOAR de Microsoft. Extiende Defender XDR con retención larga, playbooks automatizados, correlación cross-tenant y dashboards ejecutivos. |
| **Playbook (Sentinel)** | Logic App que se ejecuta cuando se dispara una alerta o incidente. Cubre la parte automatizable de la respuesta. |
| **Long-Term Retention (LTR)** | Tier de retención de archivo en Sentinel: queries más lentas, coste reducido, retención hasta 12 años. Requerido para auditorías regulatorias largas. |
| **Correlation ID** | Identificador único en `CloudAppEvents` que correlaciona toda la cadena de una invocación: invoke → data accesses → output generated. Es la clave para reconstruir la historia completa de una invocación. |
| **AgentCompromise-Containment** | Playbook canónico de Sentinel para Agent 365: detecta compromiso, deshabilita agente, revoca tokens, notifica owner, crea ticket. |
| **Defender for Identity** | Componente que detecta compromiso de identidad, incluyendo identidad de agentes Entra Agent ID. |

---

## Resumen del módulo

- Defender XDR es la capa **detectiva y reactiva** del ecosistema Agent 365. Las capas M09 (CA), M10 (IP), M11 (DLP) son preventivas. Defender XDR asume que algo se va a colar.
- Tres tipos de incidentes requieren detección específica: falsos negativos de las preventivas, comportamiento legítimo aislado pero anómalo agregado, compromiso de identidad del propio agente.
- El portal Defender XDR ofrece cinco superficies operativas para Agent 365: Incidents (unidad de trabajo), Alerts, Advanced hunting (KQL), Custom detection rules, Threat analytics.
- `CloudAppEvents` es la tabla central con esquema enriquecido específico para Agent 365 (`AgentId`, `AgentBlueprintId`, `InputDataSensitivity`, `OutputDataSensitivity`, `CorrelationId`). Latencia de ingestión 2-10 min, retención 30 días por defecto, 7-10 años con Sentinel LTR.
- Cinco queries fundamentales KQL: top N invocaciones, accesos por usuario y sensitivity, nuevas geografías, outputs con sensitivity alta, correlación por `correlationId`.
- Tres patrones problemáticos canónicos a detectar: volumen anómalo (5x baseline), exfiltración (> 30 archivos sensibles + > 5 outputs en 2h), compromiso de identidad (> 2 IPs nuevas + > 3 useragents distintos).
- Custom detection rules formalizan el hunting con valor demostrado. Calibrar severidad es crítico: no todo es High. Automatizar acciones disruptivas solo tras 2-3 meses con FP < 1 %.
- Sentinel extiende Defender XDR con LTR (retención hasta 12 años), playbooks (Logic Apps de respuesta), correlación cross-tenant. Tres playbooks canónicos: AgentCompromise-Containment, DLPMassOverride-Investigation, AgentMassDownload-Forensic.

## Hacia el módulo siguiente

M13 introduce **Copilot Control System integrado con Agent 365**: la pieza que da gobernanza unificada sobre todos los agentes y sus usuarios. Conceptualmente es complementario a Defender XDR (M12 detecta incidentes, M13 da el control central). M14 amplía con gobernanza avanzada y multi-tenant para organizaciones complejas. M15 cubre troubleshooting cotidiano y M16 los costes y optimización del programa.
