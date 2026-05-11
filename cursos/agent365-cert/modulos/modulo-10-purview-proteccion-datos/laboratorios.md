---
modulo: 10
tipo: laboratorios
titulo: "Laboratorios del Módulo 10"
duracion_total_min: 90
ultima_actualizacion: 2026-05-11
laboratorios:
  - id: LAB-10-1
    titulo: "Aplicar sensitivity label a un blueprint y verificar herencia en outputs"
    duracion_min: 20
  - id: LAB-10-2
    titulo: "Configurar DSPM for AI: activar dashboard y alertas"
    duracion_min: 25
  - id: LAB-10-3
    titulo: "Búsqueda forense en eDiscovery Premium filtrada por agentId"
    duracion_min: 20
  - id: LAB-10-4
    titulo: "Diseño end-to-end: política coherente Purview + Conditional Access"
    duracion_min: 25
---

# Módulo 10 — Laboratorios

> Cuatro laboratorios prácticos para consolidar la teoría sobre Microsoft Purview integrado con Agent 365. Cada lab entrega un artefacto concreto (un blueprint etiquetado, un dashboard configurado, una búsqueda de eDiscovery exportable, un diseño compuesto). Tiempo total: aproximadamente 90 minutos.
>
> **Prerrequisitos comunes:**
>
> - Tenant Microsoft 365 con Agent 365 activado.
> - Licencias en el tenant: Microsoft 365 E5 Compliance (incluye Information Protection, Audit Premium, eDiscovery Premium, DSPM for AI, Insider Risk Management).
> - Roles asignados a tu usuario (vía PIM si no son permanentes): `Compliance Administrator`, `Information Protection Administrator`, `eDiscovery Manager`, `AI Administrator`.
> - Al menos un agente OBO de prueba en el tenant con varias invocaciones recientes para que haya datos en DSPM y en el audit log.

---

## LAB-10-1 — Aplicar sensitivity label a un blueprint y verificar herencia en outputs

**Duración:** 20 min · **Producto:** Microsoft Purview Information Protection + Microsoft Entra Agent ID · **OA:** OA-10.3.

### Objetivo

Aplicar la sensitivity label `Confidential` a un blueprint de Agent 365 y verificar empíricamente que los outputs de un agente derivado heredan esa label automáticamente, activando cifrado y watermark.

### Pasos

1. **Abre Microsoft Purview** (compliance.microsoft.com) → Information Protection → Labels. Verifica que existen las cuatro labels canónicas: Public, Internal, Confidential, Highly Confidential. Si no existen, crea al menos `Confidential` con las protecciones:
   - Encryption: enabled (AES-256), permisos para Internal Users.
   - Content marking: header «CONFIDENTIAL — Internal use only», watermark visible con `${User.Email}` y `${Date}`.
   - Endpoint DLP rules: bloquear copia a aplicaciones no aprobadas.

2. **Abre Microsoft Entra admin center** → Agent ID → Blueprints. Localiza un blueprint OBO de prueba (idealmente con datos no productivos). Anota su `blueprintId`.

3. **Aplica la sensitivity label al blueprint**:
   ```powershell
   Connect-IPPSSession
   Set-Label -Identity <blueprintId> -SensitivityLabel "Confidential" -Justification "Lab M10.1 - prueba de herencia"
   ```
   En portal: Blueprint detail → Compliance → Sensitivity → seleccionar Confidential → Apply.

4. **Invoca un agente derivado del blueprint**:
   - Desde el cliente de prueba (Teams, Foundry chat playground, etc.), pide al agente que lea un par de documentos y produzca un resumen ejecutivo.
   - Captura el output (texto o documento).

5. **Verifica la herencia**:
   - Si el output es un mensaje de Outlook → el email debe llegar con la marca «CONFIDENTIAL» en el header, banner amarillo en cliente, y cifrado activo (icono de candado).
   - Si el output es un documento Word → al abrirlo debes ver el watermark visible con tu email + fecha, y la barra superior indica «Confidential — encrypted».
   - Si el output va al portapapeles, intentar pegarlo en un navegador con login personal → Endpoint DLP debe bloquearlo y mostrar el aviso.

6. **Audita el evento de herencia**:
   - Purview → Audit → Search → Activity = `AgentSensitivityLabelInherited` en últimas 24h.
   - El evento debe mostrar el `agentId`, los inputs accedidos, el output generado, y la label heredada (`Confidential`).

### Validación

- El blueprint tiene la label `Confidential` aplicada (visible en Purview y en Microsoft Entra).
- El output del agente lleva watermark y cifrado.
- El audit log registra el evento `AgentSensitivityLabelInherited` con el detalle de fuentes e output.

### Variantes y extensiones

- Repetir con varios inputs de labels mixtas (Internal + Confidential + Public). Verificar que el output toma la más restrictiva (`Confidential`).
- Cambiar la label del blueprint a `Highly Confidential` y comprobar que el output queda bloqueado para compartición externa.

---

## LAB-10-2 — Configurar DSPM for AI: activar dashboard y alertas

**Duración:** 25 min · **Producto:** Microsoft Purview DSPM for AI · **OA:** OA-10.2.

### Objetivo

Activar Data Security Posture Management for AI por primera vez en el tenant, configurar los cuatro paneles principales y dejar una alerta operativa que dispare cuando aparezca un patrón de uso problemático.

### Pasos

1. **Abre Microsoft Purview** → Data Security Posture Management for AI → Settings.

2. **Activa la recolección de señales** para los siguientes orígenes:
   - Microsoft 365 Copilot.
   - Microsoft Agent 365 (todos los agentes del tenant).
   - Agentes de Copilot Studio.
   - Agentes de Foundry desplegados al tenant.

3. **Espera 30-60 minutos** a que DSPM ingiera la primera ventana de datos. Si tu tenant tiene tráfico bajo, simula actividad invocando al agente de prueba varias veces con prompts que toquen datos sensibles (resúmenes de documentos clasificados, búsquedas en SharePoint).

4. **Revisa los cuatro paneles**:
   - **Top sensitive interactions**: identifica las 3 invocaciones con mayor volumen de datos `Confidential+`. Anota `agentId`, usuario invocador, número de invocaciones.
   - **Top apps**: cuáles agentes generan más interacciones sensibles. ¿Hay alguno inesperado?
   - **Risky users**: usuarios cuyo patrón activa señales de Insider Risk. Para el lab, probablemente esté vacío (solo aparece tras varias semanas de baseline).
   - **Data oversharing**: archivos `Confidential+` accedidos por agentes con scopes amplios. Anotar el `resourceUri` de los 3 primeros.

5. **Configura una alerta operativa**:
   - DSPM for AI → Alerts → New alert.
   - Trigger: «Sensitive data interactions exceed threshold».
   - Condition: > 50 interacciones con datos `Confidential+` en una hora por un solo agente.
   - Severity: Medium.
   - Notification: email al grupo de seguridad + ticket en ServiceNow (si hay integración configurada).

6. **Documenta los hallazgos** en un informe Markdown que incluya:
   - Top 3 agentes por interacciones sensibles.
   - Top 3 archivos en data oversharing.
   - Recomendaciones de mitigación para cada uno (ajustar blueprint, aplicar label retroactiva, restringir scope).

### Validación

- DSPM for AI está configurado y muestra datos reales del tenant.
- Una alerta operativa está activa con destinatarios definidos.
- El informe documenta los 3 + 3 hallazgos prioritarios.

### Variantes y extensiones

- Crear un dashboard custom en Power BI conectado al endpoint Graph `dspmForAI` para visualizaciones que el portal nativo no ofrece.
- Configurar workflow en Power Automate que cree un ticket en Jira cuando una alerta de DSPM con severidad High se dispara.

---

## LAB-10-3 — Búsqueda forense en eDiscovery Premium filtrada por agentId

**Duración:** 20 min · **Producto:** Microsoft Purview eDiscovery Premium · **OA:** OA-10.4.

### Objetivo

Simular una solicitud de auditoría regulatoria: «qué archivos `Confidential+` accedió el agente X durante el último mes». Producir el informe exportable y el custodian hold preventivo.

### Pasos

1. **Abre Microsoft Purview** → eDiscovery Premium → Cases → New case. Nombra el caso `LAB-M10.3-AuditoriaAgenteX`.

2. **Añade el agente como custodian**:
   - Case → Custodians → Add custodian.
   - Type: Agent identity (selección habilitada solo con Audit Premium + Agent 365).
   - Search: por `agentId` del agente de prueba. Selecciona.

3. **Define la búsqueda**:
   - Case → Searches → New search.
   - Custodians: el agente seleccionado.
   - Date range: últimos 30 días.
   - Conditions:
     - Activity = `AgentDataAccess`.
     - SensitivityLabel ∈ `[Confidential, HighlyConfidential]`.
   - Save and run.

4. **Espera a que la búsqueda termine** (típicamente 2-10 min) y revisa los resultados:
   - Número total de hits.
   - Top 10 `resourceUri` accedidos (vista agregada).
   - Distribución temporal: ¿hay un pico inusual? ¿algún acceso fuera de horario operativo?

5. **Aplica custodian hold**:
   - Case → Holds → New hold.
   - Custodians: el agente seleccionado.
   - Hold all content (audit log + recursos accedidos correlacionados).
   - Justification: «Auditoría regulatoria simulada LAB-M10.3».
   - Apply.

6. **Exporta evidencia para el regulador**:
   - Búsqueda → Export results → CSV + PST (si aplica).
   - Verifica que el export contiene timestamp, UPN del usuario invocador (si OBO), `resourceUri`, `sensitivityLabel`, `correlationId`.

### Validación

- El caso está creado con el agente como custodian.
- La búsqueda devuelve resultados coherentes (con detalle agentId + sensitivityLabel).
- El custodian hold está activo (impedirá el borrado de los archivos accedidos durante la investigación).
- El export contiene los campos forenses necesarios.

### Variantes y extensiones

- Repetir cruzando con el usuario invocador como custodian: ver coincidencias y discrepancias.
- Crear una review set sobre los resultados y aplicar tags (`Relevant`, `Privileged`) para entrenar el modelo de relevancia de eDiscovery.

---

## LAB-10-4 — Diseño end-to-end: política coherente Purview + Conditional Access

**Duración:** 25 min · **Producto:** combinación de M09 + M10 · **OA:** OA-10.6.

### Objetivo

Para un caso de uso concreto (agente de Tesorería con scope sensible), diseñar la política completa de protección que combine las capas de M09 (Conditional Access, Identity Protection) y M10 (sensitivity labels, DSPM, eDiscovery). El entregable es un documento de diseño revisable por seguridad y compliance.

### Pasos

1. **Define el caso de uso**: agente Foundry de Tesorería que opera en modo own identity (batch nocturno) reconciliando operaciones de mercado con archivos de Treasury Site (`Highly Confidential`).

2. **Capa 1 — Blueprint con label**:
   ```json
   {
     "id": "bp-tesoreria-autonomous",
     "displayName": "Tesoreria - autonomous batch agents",
     "sensitivityLabel": "Highly Confidential",
     "inheritablePermissions": {
       "Microsoft Graph": ["Files.Read.All", "Sites.Read.All"],
       "Treasury API (custom)": ["Treasury.Read.All", "Treasury.Reconcile"]
     },
     "restrictions": {
       "requireSponsor": true,
       "transferOnLeaver": true,
       "allowedAuthenticationFlows": ["client_credentials"]
     },
     "defaultCustomSecurityAttributes": {
       "Department": "Tesoreria",
       "ConfidentialityLevel": "HighlyConfidential",
       "BusinessOwner": "tesoreria-lead@empresa.com"
     }
   }
   ```

3. **Capa 2 — Conditional Access** (de M09):
   - Policy 1: bloquear fuera de horario batch 22:00-06:00.
   - Policy 2: bloquear si `workloadIdentityRisk = Medium or High`.

4. **Capa 3 — Identity Protection** (de M09):
   - Las 6 detecciones para agentes habilitadas.
   - Alerta custom: cualquier High en agentes con `Department = Tesoreria` notifica al CISO en < 5 min.

5. **Capa 4 — Information Protection** (M10):
   - Auto-labeling policy que aplica `Highly Confidential` a cualquier output que combine datos de Treasury Site.
   - Encryption AES-256 obligatorio.
   - Watermark con UPN + fecha + «Tesoreria — Internal Only».
   - Restricción dura: no compartir fuera del grupo Tesoreria-Auditores.

6. **Capa 5 — DSPM for AI** (M10):
   - Alert: cualquier interacción con `Highly Confidential` desde IP fuera de Azure West Europe.
   - Weekly digest del agente a los stakeholders de Tesoreria.

7. **Capa 6 — eDiscovery Premium** (M10):
   - Custodian hold permanente al agente (mientras opere) con retención 10 años.
   - Búsqueda programada semanal: «accesos a HighlyConfidential» exportable a SharePoint del equipo de compliance.

8. **Documenta el diseño completo** en un Markdown que incluya:
   - JSON del blueprint con label.
   - YAML/pseudocódigo de las CA policies.
   - Configuración de IP, DSPM y eDiscovery.
   - Diagrama (puedes usar mermaid) que muestre las seis capas trabajando en serie.
   - Plan de validación: cómo probarías cada capa por separado y todas juntas.

### Validación

- El documento cubre las seis capas explícitamente.
- Cada capa tiene justificación operativa, no solo técnica.
- El plan de validación es ejecutable y mensurable.
- El equipo de seguridad y compliance pueden firmar el diseño sin dudas pendientes.

### Variantes y extensiones

- Adaptar el diseño a un agente OBO en lugar de autonomous: ¿qué cambia en cada capa? (pista: la CA puede ahora condicionar por dispositivo del usuario invocador; la trazabilidad regulatoria va al UPN, no al BusinessOwner).
- Aplicar el diseño a un agente que opera fuera de la UE: identificar las cláusulas de soberanía del dato que necesitan reforzarse.

---

## Cierre

Tras los cuatro labs has tocado todas las palancas operativas de Purview integrado con Agent 365: aplicación y herencia de sensitivity labels (LAB-10-1), gobernanza diaria con DSPM for AI (LAB-10-2), trazabilidad forense con eDiscovery Premium (LAB-10-3), y diseño end-to-end combinando todas las capas (LAB-10-4).

Si quieres ir más allá:

- Trasladar los artefactos al tenant productivo siguiendo el plan de validación.
- Integrar las alertas de DSPM con tu SIEM corporativo (Sentinel, Splunk).
- Programar la auditoría mensual como hábito del equipo de compliance.

El siguiente módulo (M11) profundiza específicamente en **DLP para agentes**, que es la capa de policy enforcement que aquí solo hemos referenciado.
