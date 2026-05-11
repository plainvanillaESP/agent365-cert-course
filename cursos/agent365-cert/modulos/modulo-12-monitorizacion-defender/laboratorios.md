---
modulo: 12
tipo: laboratorios
titulo: "Laboratorios del Módulo 12"
duracion_total_min: 110
ultima_actualizacion: 2026-05-11
laboratorios:
  - id: LAB-12-1
    titulo: "Escribir y validar las 3 queries KQL canónicas en Advanced Hunting"
    duracion_min: 30
  - id: LAB-12-2
    titulo: "Configurar custom detection rule con severidad calibrada"
    duracion_min: 25
  - id: LAB-12-3
    titulo: "Conectar Defender XDR con Sentinel y crear playbook AgentCompromise-Containment"
    duracion_min: 25
  - id: LAB-12-4
    titulo: "Investigar incidente simulado end-to-end: timeline + contención + post-mortem"
    duracion_min: 30
---

# Módulo 12 — Laboratorios

> Cuatro laboratorios prácticos para consolidar la teoría sobre Defender XDR aplicado a Agent 365, hunting con KQL, custom detection rules y la integración con Microsoft Sentinel. Cada lab entrega un artefacto concreto (queries operativas, regla activa, playbook funcional, post-mortem firmado). Tiempo total aproximado: 110 minutos.
>
> **Prerrequisitos comunes:**
>
> - Tenant Microsoft 365 con Agent 365 activado.
> - Licencias en el tenant: Microsoft 365 E5 Security (incluye Defender XDR completo) + Microsoft Sentinel workspace.
> - Roles asignados a tu usuario (vía PIM): `Security Administrator`, `Security Reader` (para Advanced Hunting), `Sentinel Contributor` (para playbooks).
> - Familiaridad básica con KQL. Si nunca has escrito una query, completa el tutorial oficial de Microsoft Learn antes de empezar (2-3 horas).
> - Al menos un agente OBO de prueba con varios días de actividad en el tenant para que `CloudAppEvents` tenga datos representativos.

---

## LAB-12-1 — Escribir y validar las 3 queries KQL canónicas en Advanced Hunting

**Duración:** 30 min · **Producto:** Microsoft Defender XDR Advanced Hunting · **OA:** OA-12.3, OA-12.4.

### Objetivo

Escribir, ejecutar y calibrar las tres queries KQL canónicas para detección de patrones problemáticos en Agent 365: volumen anómalo, exfiltración vía agente y compromiso de identidad. El entregable es un repositorio de queries operativas validadas contra datos reales del tenant, con thresholds documentados.

### Pasos

1. **Abre Microsoft Defender XDR** (security.microsoft.com) → Hunting → Advanced hunting.

2. **Query 1 — Volumen anómalo (5x baseline horario)**:
   ```kql
   let baseline =
       CloudAppEvents
       | where Application == "Microsoft Agent 365"
       | where ActionType == "AgentInvoke"
       | where Timestamp between (ago(30d) .. ago(7d))
       | summarize HourlyAvg = round(count() / 24.0 / 23.0, 2) by AgentId;
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
   - Ejecuta. Si tu tenant tiene poco tráfico, ajusta `ago(1h)` a `ago(24h)`.
   - Documenta los resultados: ¿hay agentes con multiplicador ≥ 5? ¿Son legítimos (campañas, picos esperados) o anomalías reales?

3. **Query 2 — Exfiltración vía agente**:
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
   - Ajusta thresholds (30 docs sensibles, 5 outputs) según el volumen real del tenant.
   - Si no hay matches, baja umbrales hasta encontrar al menos uno y documenta el baseline real.

4. **Query 3 — Compromiso de identidad de agente**:
   ```kql
   CloudAppEvents
   | where Application == "Microsoft Agent 365"
   | where ActionType == "AgentInvoke"
   | where Timestamp >= ago(1h)
   | summarize
       CurrentIPs = make_set(SourceIPAddress),
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
   | extend NewSources = set_difference(CurrentIPs, HistoricalIPs)
   | where array_length(NewSources) > 2 or NewUserAgents > 3
   | project AgentId, NewSources, NewUserAgents, InvocationsLastHour
   ```
   - Esta query genera más falsos positivos en organizaciones con teletrabajo extensivo. Documenta cuántos agentes activan la regla y cuántos son falsos positivos esperados (VPN, oficinas nuevas, etc.).

5. **Guarda las queries**: Advanced Hunting → cada query → Save → Add to query collection «Agent365-Canonical-Patterns». Documenta:
   - Threshold actual y justificación.
   - Tasa de falsos positivos esperada.
   - Acción recomendada cuando dispara (investigar, escalar, notificar).
   - Last reviewed date (revisión trimestral).

6. **Validación cruzada con el portal**:
   - Cualquier hallazgo de las queries → verificar en Microsoft Defender for Cloud Apps → Activity log con filtros equivalentes.
   - Confirmar que las queries no dejan ciegos (ningún evento real escapa) ni generan ruido excesivo (FP rate < 20 % en la fase de descubrimiento, < 5 % tras calibración).

### Validación

- Las 3 queries están guardadas en una colección dedicada en Advanced Hunting.
- Cada query ejecuta sin errores y devuelve resultados coherentes con el tenant.
- Hay documentación de thresholds, FP rate esperada y next-review date.

### Variantes y extensiones

- Escribir una **cuarta query** que combine los tres patrones en AND: agentes con volumen anómalo Y accesos masivos a sensitive Y nuevas IPs. El resultado es la lista de candidatos a investigación inmediata por compromiso confirmado.
- Adaptar las queries para excluir agentes específicos por su nombre o blueprint (típico para excluir agentes batch nocturnos que tienen baselines diferentes).

---

## LAB-12-2 — Configurar custom detection rule con severidad calibrada

**Duración:** 25 min · **Producto:** Microsoft Defender XDR Custom detection rules · **OA:** OA-12.5.

### Objetivo

Promover la query 2 del LAB-12-1 (exfiltración vía agente) a custom detection rule operativa con severidad calibrada, entity extraction, acciones automatizadas medidas y mapeo MITRE ATT&CK. El entregable es una rule activa en producción del SOC.

### Pasos

1. **Abre Microsoft Defender XDR** → Hunting → Custom detection rules → Create new.

2. **Sección 1 — Detection details**:
   - **Name**: `Agent365-Exfiltration-Pattern-Detection`.
   - **Description**: «Detecta patrón de exfiltración vía agente: > 30 archivos `Confidential+` accedidos + > 5 outputs producidos en 2 horas. Runbook: SOP-AG365-001».
   - **Severity**: **High** (la justificación: si la query coincide, el riesgo de exfiltración es real; no debe ser Critical porque puede tener FP legítimo como auditoría programada, no debe ser Medium porque la respuesta requerida es < 1h).
   - **Category**: `Initial access` o `Exfiltration` según MITRE.
   - **MITRE ATT&CK technique**: T1567 (Exfiltration Over Web Service) + T1078.004 (Valid Accounts: Cloud Accounts).

3. **Sección 2 — Query**: pega la query del LAB-12-1 Query 2. Ajusta el time range a `ago(1h)` para que la rule se ejecute con datos frescos cada hora.

4. **Sección 3 — Frequency**: **Every 1 hour** (alineado con el time range de la query; ejecuciones más frecuentes pueden generar duplicados, menos frecuentes pierden velocidad de respuesta).

5. **Sección 4 — Entities to extract**:
   - `AgentId` → Entity type: Cloud application instance.
   - `AccountUpn` → Entity type: User.
   - El extract de entities permite que Defender correlacione esta alerta con otras del mismo agente o usuario, agrupándolas en un incident.

6. **Sección 5 — Actions on detection**:
   - **For impacted users**: Email notification al grupo `soc-tier1@empresa.com` + ServiceNow ticket (si conector configurado).
   - **For impacted devices**: ninguna acción automática en producción de día 1.
   - **Run playbook**: opcional, deja vacío por ahora (lo configuramos en LAB-12-3 con Sentinel).
   - **NO automatizar disable de agente o cuenta** en producción de día 1. Estas acciones disruptivas solo se automatizan tras 2-3 meses con FP < 1 % validados.

7. **Save and turn on**. Confirma que aparece en la lista de Custom detection rules como `On`.

8. **Test forzado**:
   - Provoca el pattern: invoca el agente de prueba 30+ veces seguidas accediendo a archivos con label `Confidential` y pidiéndole > 5 outputs.
   - Espera 1 hora (la frequency de la rule). Si la query coincide, debe generar una alerta nueva.
   - Verifica en Defender XDR → Alerts → filtro por rule name.

9. **Triaje del primer evento**:
   - El SOC tier 1 que recibe la alerta debe poder responder en < 5 min: ¿es legítimo o sospechoso?
   - Documenta el contexto enriquecido: ¿qué archivos? ¿qué usuario? ¿qué outputs? ¿desde dónde?
   - Si es FP, `Resolve as compliant` y documenta razón (ej. «auditoría programada de Q1 reports»).

10. **Calibración semanal**:
    - Lunes: revisar volumen de alertas de la semana, FP rate, tiempo medio de triaje.
    - Si FP > 20 %, ajustar thresholds de la query (subir a 50 docs o 10 outputs).
    - Si FN sospechosos (incidentes que se detectaron por otra vía pero no por esta rule), revisar la query para entender por qué falló.

### Validación

- La custom detection rule está creada, activa, y registrada en el repositorio de runbooks operativos.
- Entity extraction funciona y se ven entidades en cada alerta generada.
- La severidad está calibrada (High) con justificación documentada en el campo description.
- Hay flujo de triaje funcional en el SOC para alertas generadas por esta rule.

### Variantes y extensiones

- Promover también la query 1 (volumen anómalo) a custom detection rule con severidad Medium (no es exfiltración confirmada, solo anomalía).
- Promover la query 3 (compromiso de identidad) con severidad High y action automatizada `Disable user account` solo después de 3 meses de validación.
- Crear una rule meta-correlación que dispare Critical cuando las 3 queries individuales coincidan simultáneamente para el mismo agente.

---

## LAB-12-3 — Conectar Defender XDR con Sentinel y crear playbook AgentCompromise-Containment

**Duración:** 25 min · **Producto:** Microsoft Sentinel + Logic Apps · **OA:** OA-12.6.

### Objetivo

Conectar Microsoft Defender XDR a un workspace de Microsoft Sentinel, configurar Long-Term Retention para auditoría regulatoria, y crear el playbook canónico `AgentCompromise-Containment` que automatiza la contención inicial cuando se detecta compromiso de identidad de agente.

### Pasos

1. **Provisión workspace Sentinel** (si no existe):
   - Azure portal → Microsoft Sentinel → Create.
   - Seleccionar o crear Log Analytics workspace.
   - Region: la misma que tu Defender XDR para minimizar latencia y coste de ingestión.

2. **Conectar Defender XDR a Sentinel**:
   - Sentinel workspace → Content hub → buscar «Microsoft Defender XDR» → Install.
   - Tras la instalación, en Data connectors → «Microsoft Defender XDR» → Configure.
   - Activar la ingestión de: Incidents and alerts, Microsoft Defender for Cloud Apps events, CloudAppEvents, IdentityLogonEvents.
   - Aplicar y esperar 15-30 min para la primera ingestión.

3. **Configurar Long-Term Retention**:
   - Sentinel → Settings → Workspace settings → Usage and estimated costs → Data retention.
   - **Interactive retention (workspace operativo)**: 90 días.
   - **Long-term retention (archivo)**: 7 años para `CloudAppEvents`, `SecurityAlert`, `SecurityIncident`. El coste es 1/4 del workspace operativo.

4. **Crear playbook `AgentCompromise-Containment`**:
   - Sentinel → Automation → Playbooks → Create → Logic App.
   - Name: `pb-Agent365-Compromise-Containment`.
   - Region: misma que Sentinel.
   - Resource group: dedicado a Sentinel playbooks.

5. **Editar el Logic App** (Azure portal → Logic Apps designer):

   **Trigger**: `When Microsoft Sentinel incident is triggered` (filtro: rule = `Agent365-Compromise-Detection`).

   **Step 1 — Parse incident details**:
   ```json
   {
     "AgentId": "@{triggerBody()?['object']?['properties']?['relatedEntities'][0]?['agentId']}",
     "AccountUpn": "@{triggerBody()?['object']?['properties']?['relatedEntities'][1]?['userPrincipalName']}",
     "IncidentNumber": "@{triggerBody()?['object']?['properties']?['incidentNumber']}"
   }
   ```

   **Step 2 — Disable agent via Microsoft Graph API**:
   - HTTP action → POST → `https://graph.microsoft.com/v1.0/applications/{AgentId}/restore` (revocar tokens activos).
   - Authentication: Managed Identity con permisos `Application.ReadWrite.All`.

   **Step 3 — Revoke active tokens**:
   - HTTP action → POST → `https://graph.microsoft.com/v1.0/applications/{AgentId}/revokeSignInSessions`.

   **Step 4 — Notify agent owner**:
   - Office 365 Outlook action → Send email.
   - To: dynamic `{AgentOwnerEmail}` (extraído de la entity).
   - Subject: «Agent {AgentId} detained — security incident {IncidentNumber}».
   - Body: contexto de la detección, próximos pasos, contacto del SOC.

   **Step 5 — Create ServiceNow ticket** (si está integrado):
   - ServiceNow action → Create record.
   - Table: `incident`.
   - Priority: P1.
   - Short description: «Agent365 compromise containment — {AgentId}».
   - Description: detalle del incidente, evidencia adjunta, acciones automatizadas ejecutadas.

   **Step 6 — Add comment to Sentinel incident**:
   - Microsoft Sentinel action → Add comment to incident.
   - Comment: «Playbook `pb-Agent365-Compromise-Containment` executed at {timestamp}. Actions: agent disabled, tokens revoked, owner notified, ServiceNow ticket P1 created. Manual investigation required».

6. **Save** el Logic App.

7. **Configurar automation rule** que dispare el playbook:
   - Sentinel → Automation → Create → Automation rule.
   - Name: `Auto-Containment-AgentCompromise`.
   - Trigger: «When incident is created».
   - Conditions: incident `analyticRuleId` matches `Agent365-Compromise-Detection`.
   - Actions: `Run playbook` → seleccionar `pb-Agent365-Compromise-Containment`.

8. **Test del playbook**:
   - Dispara manualmente la rule del LAB-12-2 con un evento simulado.
   - El incident creado debe disparar la automation rule, que ejecuta el playbook.
   - Verifica en el portal: ¿el agente fue deshabilitado? ¿se notificó al owner? ¿se creó el ticket?
   - **IMPORTANTE**: usa un agente de prueba; NO ejecutes este playbook contra agentes productivos sin haber validado el flujo completo.

### Validación

- Sentinel está conectado con Defender XDR y los incidents llegan correctamente.
- LTR configurada para retención larga de las tablas críticas.
- El playbook `pb-Agent365-Compromise-Containment` existe y funciona end-to-end con datos de prueba.
- La automation rule lo dispara automáticamente cuando se crea el incident correspondiente.

### Variantes y extensiones

- Crear los otros dos playbooks canónicos: `pb-Agent365-DLPMassOverride-Investigation` y `pb-Agent365-MassDownload-Forensic`.
- Añadir un step de notificación a Teams (canal SOC) en paralelo al email al owner.
- Construir un workbook de Sentinel con el dashboard CISO mensual descrito en el caso de estudio del quiz.

---

## LAB-12-4 — Investigar incidente simulado end-to-end: timeline + contención + post-mortem

**Duración:** 30 min · **Producto:** investigación holística con Defender XDR + Sentinel · **OA:** OA-12.7.

### Objetivo

Simular un incidente realista de compromiso de agente, ejecutar la investigación completa (recopilación de evidencia, construcción de timeline, correlación de señales de múltiples productos, contención, recuperación) y producir el post-mortem formal con lecciones aprendidas. El entregable es un documento de incident report defendible ante auditoría.

### Escenario simulado

El lunes 11 de mayo a las 10:23 UTC, la custom detection rule `Agent365-Exfiltration-Pattern-Detection` (LAB-12-2) genera una alerta High: el agente `comercial-pricebot` accedió a 47 archivos `Confidential` y produjo 8 outputs en los últimos 45 minutos. El playbook `pb-Agent365-Compromise-Containment` (LAB-12-3) ya ha ejecutado contención inicial (agente deshabilitado, tokens revocados, owner notificado). Eres el SOC tier 2 asignado y tu trabajo es investigar y producir el post-mortem.

### Pasos

1. **Recopilación de evidencia inicial** (5 min):
   - Defender XDR → Incidents → busca incident relacionado con `comercial-pricebot`.
   - Lista todas las alertas correlacionadas en el incident (DLP, Identity Protection, Defender for Cloud Apps).
   - Anota: `agentId`, `incidentNumber`, `userPrincipalName` del invocador, timestamp inicial.

2. **Construcción del timeline** (10 min):
   - Advanced Hunting → ejecuta la query de correlación por `correlationId`:
     ```kql
     let correlationsOfInterest = (
         CloudAppEvents
         | where AgentId == "<agentId>"
         | where Timestamp between (datetime(2026-05-11 09:00) .. datetime(2026-05-11 11:00))
         | summarize by tostring(parse_json(RawEventData).correlationId)
     );
     CloudAppEvents
     | where Application == "Microsoft Agent 365"
     | extend correlationId = tostring(parse_json(RawEventData).correlationId)
     | where correlationId in (correlationsOfInterest)
     | project Timestamp, ActionType, AgentId, AccountUpn, ResourceUri, InputDataSensitivity,
               OutputDataSensitivity, SourceIPAddress, Country, correlationId
     | order by Timestamp asc
     ```
   - Construye una tabla cronológica con: hora, acción, recurso, sensitivity, IP, país.
   - Identifica el «evento cero»: el primer signo de comportamiento anómalo.

3. **Correlación de señales cross-product** (5 min):
   - **Identity Protection**: ¿la cuenta del usuario invocador tiene risk events recientes? ¿desde cuándo está en High?
     ```kql
     SigninLogs
     | where UserPrincipalName == "<accountUpn>"
     | where TimeGenerated >= ago(7d)
     | project TimeGenerated, IPAddress, Location, ResultType, RiskState, RiskLevelAggregated
     | order by TimeGenerated desc
     ```
   - **Defender for Endpoint** (si está en el alcance): ¿el dispositivo del usuario muestra señales de compromiso?
   - **Purview DLP**: ¿hubo policy override events en la misma ventana?
   - **Communication Compliance**: ¿hay outputs marcados como `flagged for review`?

4. **Hipótesis de incidente** (3 min):
   - Basándote en la evidencia recopilada, formula 2-3 hipótesis:
     - Hipótesis A: cuenta del usuario comprometida (phishing, credential stuffing).
     - Hipótesis B: insider threat (el usuario tiene acceso legítimo pero abusa).
     - Hipótesis C: comportamiento legítimo no documentado (auditoría especial, proyecto urgente).
   - Para cada una, lista qué evidencia la respalda y qué evidencia la refuta.

5. **Validación con stakeholders** (telefonia simulada, 2 min):
   - Contacta con el manager del usuario: ¿hay un proyecto especial activo? ¿el usuario está en horario habitual?
   - Contacta con el owner del agente: ¿el patrón de acceso es coherente con el use case del agente?
   - Documenta sus respuestas con timestamp.

6. **Decisión de contención adicional** (2 min):
   - Si hipótesis A o B confirmadas → mantener agente deshabilitado, deshabilitar cuenta del usuario, iniciar forensics.
   - Si hipótesis C confirmada → restaurar agente, cerrar incident como FP, documentar para futuras calibraciones.

7. **Producción del post-mortem** (3 min escribir, formato canónico):

   ```markdown
   # Post-mortem: Incident Agent365-EX-001 (2026-05-11)

   ## Resumen ejecutivo
   - Detected: 10:23 UTC by rule Agent365-Exfiltration-Pattern-Detection
   - Affected entity: agente comercial-pricebot, usuario invocador <upn>
   - Outcome: [Confirmado compromiso / Falso positivo / Indeterminado]
   - Time to detect: <X> min
   - Time to contain: <Y> min
   - Time to investigate: <Z> min

   ## Timeline detallado
   [Tabla con eventos numerados por correlación temporal]

   ## Causa raíz
   [Análisis técnico del cómo y por qué]

   ## Impacto
   - Datos accedidos: <N> archivos, sensitivity <X>
   - Outputs generados: <N>, con sensitivity <X>
   - Exfiltración confirmada: [Sí / No / Indeterminado]
   - Usuarios afectados: <list>

   ## Acciones ejecutadas
   - Contención automática (playbook): <list>
   - Contención manual adicional: <list>
   - Recuperación: <list>

   ## Lecciones aprendidas
   - Qué funcionó: <list>
   - Qué falló: <list>
   - Mejoras propuestas (con owner y fecha): <list>

   ## Acciones de mejora
   - [ ] <accion> — owner: <X> — fecha objetivo: <DD/MM/YYYY>

   ---
   Firmado por: SOC tier 2 lead — 2026-05-11
   ```

### Validación

- Existe un timeline detallado y firmado con todas las acciones del agente en la ventana del incidente.
- Las hipótesis están formuladas, evaluadas y resueltas con evidencia.
- El post-mortem está completo con todas las secciones canónicas.
- Las acciones de mejora tienen owner asignado y fecha objetivo concreta.

### Variantes y extensiones

- Repetir el ejercicio con otro escenario simulado: compromiso de cuenta usuario invocador en lugar de del agente, exfiltración lenta durante varios días, ataque coordinado a múltiples agentes simultáneamente.
- Practicar el handover a CISO: presentar el post-mortem en 5 minutos, anticipando las 3 preguntas más probables del CISO.
- Integrar las lecciones aprendidas en mejoras concretas: nuevas custom detection rules, ajustes a playbooks existentes, refinamiento de blueprints de los agentes.

---

## Cierre

Tras los cuatro labs has tocado todas las palancas operativas de Defender XDR aplicado a Agent 365: las queries KQL fundamentales validadas contra tu tenant (LAB-12-1), una custom detection rule en producción con calibración correcta (LAB-12-2), integración con Sentinel y playbook automatizado de contención (LAB-12-3), y una investigación end-to-end con post-mortem firmado (LAB-12-4).

Si quieres ir más allá:

- Construir un workbook de Sentinel con dashboards ejecutivos personalizados (volumen de invocaciones, top agentes por riesgo, FP rate de custom rules, tiempo medio de triaje).
- Conectar los hallazgos de Defender XDR con tu plataforma de threat intelligence corporativa para enriquecimiento bidireccional.
- Diseñar los playbooks para los otros dos escenarios canónicos: `DLPMassOverride-Investigation` y `MassDownload-Forensic`.
- Establecer la cadencia operativa: ¿quién hace triaje? ¿qué SLA por severidad? ¿cómo se mide la eficacia del SOC mensualmente?

El siguiente módulo (M13) cubre **Copilot Control System integrado con Agent 365**: la pieza que da gobernanza unificada sobre todos los agentes. Conceptualmente complementaria a Defender XDR (M12 detecta, M13 controla).
