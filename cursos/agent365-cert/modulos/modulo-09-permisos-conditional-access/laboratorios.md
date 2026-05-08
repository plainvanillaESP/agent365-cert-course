---
modulo: 9
tipo: laboratorios
titulo: "Laboratorios del Módulo 09"
duracion_total_min: 90
ultima_actualizacion: 2026-05-07
laboratorios:
  - id: LAB-09-1
    titulo: "Crear una CA policy que bloquee agentes con risk High"
    duracion_min: 20
  - id: LAB-09-2
    titulo: "Configurar las seis detecciones de Identity Protection para agentes"
    duracion_min: 25
  - id: LAB-09-3
    titulo: "Auditar permisos efectivos de un agente OBO"
    duracion_min: 20
  - id: LAB-09-4
    titulo: "Diseño end-to-end: agente Foundry de Tesorería"
    duracion_min: 25
---

# Módulo 09 — Laboratorios

> Cuatro laboratorios prácticos para consolidar lo aprendido en la teoría. Cada lab entrega un artefacto concreto (una CA policy, una configuración de Identity Protection, un informe de permisos efectivos, un blueprint + CA + ID Protection compuesto). Tiempo total: aproximadamente 90 minutos.
>
> **Prerrequisitos comunes:**
>
> - Tenant Microsoft 365 con Agent 365 activado (suficiente con Frontier preview).
> - Tu usuario tiene roles `AI Administrator` + `Agent ID Administrator` + `Conditional Access Administrator`. Si no los tienes permanentes, actívalos vía PIM antes de empezar.
> - Licencias en el tenant: Workload Identities Premium (para CA) y Microsoft Entra ID P2 (para ID Protection). Si solo tienes E3/E5, los labs 1 y 2 no completarán; los labs 3 y 4 sí pueden ejecutarse.

---

## LAB-09-1 — Crear una CA policy que bloquee agentes con risk High

**Duración:** 20 min · **Producto:** Microsoft Entra admin center · **OA:** OA-09.2, OA-09.3.

### Objetivo

Configurar la CA policy más común en operación de Agent 365: bloquear cualquier agente cuyo `riskScore` sea `High`, evitando que ejecute operaciones contra Microsoft Graph mientras el riesgo permanece elevado.

### Pasos

1. **Abre el portal Microsoft Entra admin center** → Protection → Conditional Access → Policies → New policy. Llama a la policy `[Agents] Block High Risk`.

2. **Asignar identidades** (sección Assignments):
   - **Users or workload identities** → Workload identities.
   - **Include**: All workload identities.
   - **Exclude**: tu propio service principal de admin (para no bloquearte por accidente).

3. **Definir condiciones** (sección Conditions):
   - **Workload identity risk** → Yes, configure.
   - **Risk levels**: marcar solo `High`.
   - Dejar el resto sin condicionar (no filtramos por app porque queremos cubrir todas).

4. **Definir grant** (sección Access controls → Grant):
   - Block access.
   - Save.

5. **Activar en modo Report-only primero** (sección Enable policy):
   - Selecciona Report-only y guarda. Esto aplica la policy en modo «logging» sin bloquear, durante 7-14 días para detectar falsos positivos.

6. **Verifica que la policy aparece** en CA → Policies con estado Report-only.

7. **Prueba con un agente artificialmente en High** (opcional pero recomendado):
   - Localiza un agent identity de prueba en Entra Agent ID.
   - En PowerShell con Graph SDK:
     ```powershell
     Connect-MgGraph -Scopes "IdentityRiskyServicePrincipal.ReadWrite.All"
     Invoke-MgConfirmRiskyAgentCompromised -RiskyAgentId <agent-id>
     ```
   - Espera 5-10 min. Vuelve a Risky Agents y comprueba que el agente está en High.
   - Intenta invocarlo desde un usuario de prueba: la invocación debería pasar (porque la CA está en Report-only) pero aparecer en sign-in logs con `conditionalAccessStatus: notApplied — reportingOnly`.

8. **Tras 7 días de Report-only sin falsos positivos significativos**: vuelve a la policy y cambia Enable policy a On. La policy ya bloquea efectivamente.

### Validación

- La policy aparece en Microsoft Entra → Protection → Conditional Access con estado On (al final del ejercicio) o Report-only (durante el periodo de validación).
- El sign-in log muestra `conditionalAccessStatus: success` para invocaciones de agentes Low/Medium y `failure — Block` para los High.

### Variantes y extensiones

- Aplicar la policy solo a agentes con `customSecurityAttributes.ConfidentialityLevel == HighlyConfidential` (requiere agentes con ese atributo previamente asignado).
- Combinar con grant `Use Continuous Access Evaluation` para forzar re-evaluación del token cuando cambia el risk score.

---

## LAB-09-2 — Configurar las seis detecciones de Identity Protection para agentes

**Duración:** 25 min · **Producto:** Microsoft Entra Identity Protection · **OA:** OA-09.4.

### Objetivo

Activar y configurar las seis detecciones específicas de Identity Protection que aplican a workload identities de agentes y validar que los risk scores se calculan.

### Pasos

1. **Abre Microsoft Entra admin center** → Protection → Identity Protection → Settings → Workload identity protection.

2. **Verifica que las seis detecciones están enabled**:
   - Anomalous token use.
   - Atypical agent travel.
   - Token issuer anomaly.
   - Suspicious agent application activity.
   - Verified threat actor signals.
   - Adversary-in-the-middle (AiTM).

   Si alguna aparece como Disabled, actívala (toggle a Enabled) con justificación corporativa («Implementación M09 lab — adopción Agent 365»).

3. **Configura el umbral de risk policy para workload identities**:
   - Sign-in risk policy: aplicable a workload identities. Configura el umbral en `Medium and above` para empezar (luego se puede bajar a `Low`).
   - Acción del risk policy: bloquear (esto es además de la CA del lab anterior; ambas trabajan en serie).

4. **Configura el grupo de notificaciones**:
   - Settings → Users at risk detected alerts → asigna al equipo de Seguridad como destinatarios.
   - Settings → Weekly digest → habilítalo para el mismo grupo.

5. **Generar tráfico de prueba para que las detecciones se activen**:
   - Invoca un agente de prueba desde una IP atípica (puedes usar una VPN o proxy distinto de tu IP habitual).
   - Espera 1-2 horas para que Identity Protection ingiera el evento.
   - Vuelve a Identity Protection → Risky Sign-Ins for Agents → filtra por el `agentId` del agente de prueba. Deberías ver eventos con riesgo asignado.

6. **Audita las detecciones desde Microsoft Graph**:
   ```powershell
   Connect-MgGraph -Scopes "IdentityRiskEvent.Read.All"
   Get-MgRiskDetection -Filter "objectType eq 'agent'" |
     Select-Object riskEventType, riskLevel, agentId, detectedDateTime
   ```

### Validación

- Las seis detecciones aparecen como Enabled en Workload identity protection settings.
- Risky Sign-Ins for Agents tiene al menos un evento del agente de prueba.
- El comando Graph devuelve detecciones con los campos correctos.

### Variantes y extensiones

- Crear una notificación custom vía Logic Apps que mande un mensaje a un canal Teams del equipo de seguridad cuando aparece un evento High.
- Configurar el agent ID baseline para que Identity Protection aprenda el comportamiento normal del agente durante 30 días antes de generar alertas.

---

## LAB-09-3 — Auditar permisos efectivos de un agente OBO

**Duración:** 20 min · **Producto:** Microsoft Graph + sign-in logs · **OA:** OA-09.1, OA-09.5.

### Objetivo

Dado un agente OBO en producción y un usuario invocador concreto, calcular los permisos efectivos que el agente puede ejecutar en su nombre y verificar la traza completa en sign-in logs.

### Pasos

1. **Localiza un agente OBO en el Registry** (M365 admin center → Agents → Registry → filtrar por Type que sea OBO o Mode = OBO según el tipo de agente). Anota su `agentId` y `appId`.

2. **Localiza el blueprint del agente** (Microsoft Entra → Agent ID → Blueprints):
   ```powershell
   Connect-MgGraph -Scopes "AgentIdentity.Read.All"
   $agent = Get-MgAgentIdentity -AgentIdentityId <agent-id>
   $blueprint = Get-MgAgentBlueprint -BlueprintId $agent.BlueprintId
   $blueprint.InheritablePermissions
   ```

   Anota la lista completa de scopes heredados.

3. **Localiza al usuario invocador** (uno que haya invocado el agente recientemente):
   - Microsoft Entra → Sign-in logs → Workload identities → filtra por `appId` del agente.
   - Busca un `userPrincipalName` representativo.
   - Anota su licencia: PowerShell `Get-MgUserLicenseDetail -UserId <upn>`.

4. **Calcula la intersección triple** (en una hoja de cálculo o en papel):

   | Scope (heredado del blueprint) | ¿En licencia del usuario? | ¿Consentido por el usuario? | Efectivo |
   |---|---|---|---|
   | `User.Read` | Sí (todas las licencias M365) | Sí (consent automático) | Sí |
   | `Mail.Read` | Sí solo si tiene Exchange | Solo si consintió | Depende |
   | `Files.Read.All` | Sí solo si tiene SharePoint | Solo si consintió | Depende |
   | `Calendars.Read` | Sí solo si tiene Exchange | Solo si consintió | Depende |
   | ... | ... | ... | ... |

   El consent del usuario para un scope concreto se ve en Entra → Enterprise applications → buscar el agente → Permissions → User consent.

5. **Genera el informe de auditoría**:
   - Crea un documento Markdown o Excel con: `agentId`, `userPrincipalName`, lista de scopes blueprint, lista de scopes en licencia del usuario, lista de scopes consentidos, intersección final.
   - Pública el informe en el SharePoint del equipo de gobernanza con etiqueta `Agent OBO permissions audit`.

6. **Cruza con sign-in logs reales**:
   - Microsoft Entra → Sign-in logs → filtra por usuario invocador y por `resourceId = <appId del agente>`.
   - Verifica que los scopes en el campo `scopes` del token coinciden con los que calculaste como efectivos.

### Validación

- El informe contiene la intersección completa con razón documentada para cada scope efectivo.
- La traza en sign-in logs confirma los scopes del token reales coincidiendo con el cálculo.
- Si hay discrepancias (un scope que el usuario tiene pero no está en el token), la causa es habitualmente «consent no concedido» — documentar en el informe.

### Variantes y extensiones

- Repetir el ejercicio con tres usuarios distintos del mismo agente para detectar disparidad: típicamente algún usuario no completó consent y eso explica tickets de soporte abiertos.
- Automatizar el cálculo con un script PowerShell que tome `agentId` como input y produzca el informe Markdown final.

---

## LAB-09-4 — Diseño end-to-end: agente Foundry de Tesorería

**Duración:** 25 min · **Producto:** combinación blueprint + CA + ID Protection · **OA:** OA-09.6.

### Objetivo

Diseñar la configuración completa de control de acceso para un agente Foundry de Tesorería que opera autonomous con `ConfidentialityLevel = HighlyConfidential`. El agente procesa reconciliación de operaciones de mercado cada noche entre las 22:00 y las 06:00.

### Pasos

1. **Diseña el blueprint** (escribe el JSON, no lo apliques todavía):

   ```json
   {
     "id": "bp-tesoreria-autonomous",
     "displayName": "Tesoreria - autonomous batch agents",
     "inheritablePermissions": {
       "Microsoft Graph": [
         "Files.Read.All",
         "Sites.Read.All"
       ],
       "Treasury API (custom)": [
         "Treasury.Read.All",
         "Treasury.Reconcile"
       ]
     },
     "restrictions": {
       "requireSponsor": true,
       "transferOnLeaver": true,
       "transferOnMover": false,
       "allowedAuthenticationFlows": ["client_credentials"],
       "maxAgentIdentities": 50,
       "tenantOnly": true
     },
     "defaultCustomSecurityAttributes": {
       "Department": "Tesoreria",
       "ConfidentialityLevel": "HighlyConfidential",
       "BusinessOwner": "tesoreria-lead@empresa.com",
       "AgentPurpose": "Reconciliacion automatica de operaciones de mercado"
     },
     "lifecycle": {
       "expirationPolicy": "P365D",
       "auditLevel": "high"
     }
   }
   ```

   Justifica cada elección en una nota de diseño. Especialmente `requireSponsor`, `tenantOnly` y `allowedAuthenticationFlows: client_credentials` (el agente es autonomous, no OBO).

2. **Diseña la CA policy 1** («Bloquear fuera de horario operativo»):

   ```
   Name: [Agents] Tesoreria - Block outside business hours
   Assignments:
     Workload identities: include all where customSecurityAttributes.Department == "Tesoreria"
                         AND customSecurityAttributes.ConfidentialityLevel == "HighlyConfidential"
   Conditions:
     Workload identity location: any
     Sign-in time: NOT IN [22:00 – 06:00] (zona horaria CET)
   Grants:
     Block access
   Enable: On (después de 7 días Report-only)
   ```

3. **Diseña la CA policy 2** (defensa en profundidad sobre risk):

   ```
   Name: [Agents] Tesoreria - Block on Medium or High risk
   Assignments:
     Workload identities: include all where customSecurityAttributes.Department == "Tesoreria"
   Conditions:
     Workload identity risk: Medium, High
   Grants:
     Block access
   Enable: On
   ```

4. **Configura Identity Protection para este blueprint**:
   - Verifica que las 6 detecciones están enabled (LAB-09-2).
   - Crea una alerta custom: cualquier risk High en agentes con `Department = Tesoreria` debe notificar al CISO en menos de 5 minutos.

5. **Documenta el diseño completo** en un Markdown que incluya:
   - JSON del blueprint.
   - YAML/pseudocódigo de las dos CA policies.
   - Configuración de las alertas de ID Protection.
   - Diagrama (puedes usar mermaid) que muestre las tres capas de defensa trabajando en serie.
   - Plan de validación: cómo verificarías que el diseño funciona (qué probar primero, qué probar después).

6. **(Opcional)** Aplica el diseño en un tenant de pruebas siguiendo los pasos de los labs 9.1, 9.2 y la creación de blueprint del módulo M06.

### Validación

- El documento de diseño cubre las tres capas (blueprint, CA, ID Protection) explícitamente.
- Cada elección de configuración tiene una justificación operativa, no solo técnica.
- El plan de validación es ejecutable y mensurable.

### Variantes y extensiones

- Cambiar el caso de uso a agente OBO en lugar de autonomous y rediseñar las tres capas: ¿qué cambia? (Pista: el blueprint cambia el flow, y las CA pueden ahora condicionar por dispositivo del usuario invocador).
- Añadir una cuarta capa de defensa: DLP de Microsoft Purview que detecte si el agente accede a datos `HighlyConfidential` que no debería tocar (esto enlaza con M11).

---

## Cierre

Tras los cuatro labs has cubierto en práctica los seis OAs del módulo: distinción de tipos de permisos (LAB-09-3), CA para workload identities (LAB-09-1), ID Protection con risk score y detecciones (LAB-09-2), trazabilidad OBO (LAB-09-3), composición de defensas (LAB-09-4) y diseño end-to-end (LAB-09-4).

Si quieres ir más allá, los siguientes pasos lógicos son:

- Trasladar los artefactos al tenant productivo siguiendo el plan de validación que diseñaste.
- Documentar las CA policies en el repositorio de gobernanza de tu organización con el patrón de nombrado `[Agents] <area> - <intent>`.
- Programar la revisión semanal de las CA y la trimestral de los blueprints como hábito operativo del equipo.
