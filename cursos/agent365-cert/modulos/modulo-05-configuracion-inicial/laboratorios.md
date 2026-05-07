---
modulo: 5
tipo: laboratorios
titulo: "Laboratorios del Módulo 05"
duracion_min: 55
area_examen: 1
estado: producido
fase_produccion: 3
ultima_actualizacion: 2026-05-06
laboratorios:
  - id: "05.1"
    titulo: "Activación inicial del tenant"
    duracion_min: 30
    dificultad: intermedio
    requiere_tenant: true
    licencias_requeridas:
      - "Microsoft Agent 365 (standalone o E7) en al menos 1 usuario"
      - "Microsoft 365 E5 o equivalente como base"
    roles_requeridos:
      - "Global Administrator o AI Administrator"
  - id: "05.2"
    titulo: "Configuración cross-admin center y validación end-to-end"
    duracion_min: 25
    dificultad: intermedio
    requiere_tenant: true
    licencias_requeridas:
      - "Lab 05.1 completado"
    roles_requeridos:
      - "Global Administrator o (AI Administrator + Security Administrator + Compliance Administrator)"
---

# Módulo 05 — Laboratorios

## Prerrequisitos

- Lectura completa de la teoría del Módulo 05.
- Tenant de Microsoft 365 con al menos una licencia Agent 365 GA o estar dentro del programa Frontier preview.
- Acceso administrativo según los roles indicados en cada lab.
- Ambos labs son **secuenciales**: completar primero el 05.1 y después el 05.2.

> Si no dispones de tenant, los labs funcionan como ejercicio de comprensión: completa la checklist marcando cada paso conceptualmente y redacta el procedimiento que aplicarías.

---

## Lab 05.1 — Activación inicial del tenant

**Duración:** 30 min · **Dificultad:** Intermedia

### Objetivo

Activar Microsoft Agent 365 desde cero en un tenant productivo siguiendo el orden correcto y dejando evidencia documentada de cada paso para auditoría.

### Procedimiento

#### Parte A — Verificar prerrequisitos (10 min)

Recorrer la checklist del § 5.1 en este orden:

1. **Licencias.** En `M365 admin center → Billing → Licenses` verificar que hay al menos una licencia Agent 365 (standalone o E7) asignada a un usuario activo. Anotar: número de licencias compradas, número asignadas, número activas (con login en los últimos 30 días).

2. **Roles.** En `Entra admin center → Identity → Roles & administrators → My roles` confirmar que tu cuenta tiene Global Administrator o AI Administrator. Anotar: rol asignado, fecha de asignación, si es activo o eligible (vía PIM).

3. **Audit logs.** En `Microsoft Purview → Audit` verificar que NO aparece el banner «Start recording user and admin activity». Si aparece, pulsarlo y esperar al mensaje de confirmación.

4. **Región.** En `M365 admin → Settings → Org settings → Organization profile` verificar que el campo «Country or region» está en una región soportada (mayo 2026: US, EU, UK, Canada, Australia).

5. **Conectividad.** Si la organización tiene proxy o firewall corporativo, comprobar con el equipo de red que el tráfico hacia `*.cloud.microsoft` y `*.microsoft365.com` está permitido. Si hay duda, ejecutar desde la red corporativa una visita de prueba a `https://admin.cloud.microsoft/agents/` y verificar que carga sin bloqueos.

6. **Tenant ID.** En `Entra admin center → Identity → Overview` copiar el Tenant ID y guardarlo en un documento seguro (no en email plano).

#### Parte B — Activación (15 min)

Ejecutar la secuencia del § 5.2:

1. **Frontier toggle (si aplica).**
   - Solo si la organización va a usar capacidades preview o agentes autonomous.
   - `M365 admin center → Copilot → Settings → User access → Copilot Frontier` → toggle a `On`.
   - Aceptar el aviso. Esperar 5-10 minutos.

2. **Terms of Service.**
   - `M365 admin center` → menú lateral → **Agents**.
   - Aparece el modal de Terms of Service.
   - Leer (¡realmente!) y pulsar **Accept**.
   - Verificar en `Purview → Audit → Search` que aparece un evento `AgentTOSAccepted` con tu cuenta y el timestamp.

3. **Overview.**
   - El flujo lleva automáticamente a la página Overview del Agent workload.
   - Verificar que se ven las 4 hero metrics (todas a `0` inicialmente).
   - Verificar que el menú lateral muestra: Overview, Registry, Map, Settings.

#### Parte C — Documentación de cierre (5 min)

Crear un documento `Activación-Agent365-{fecha}.md` con:

- Lista de prerrequisitos verificados con timestamp y resultado.
- Captura de la página Overview tras la activación.
- Hora exacta de la aceptación de Terms of Service.
- Tu cuenta y rol que realizó la activación.

### Output esperado

- Agent workload activo y accesible para todos los admins con AI Administrator.
- Audit log con evento `AgentTOSAccepted` registrado.
- Documento de evidencia de activación archivado.

### Errores frecuentes y solución

| Síntoma | Causa | Solución |
|---|---|---|
| «Agents» no aparece en M365 admin center | Sin licencia Agent 365 asignada o sin rol adecuado | Verificar Parte A puntos 1 y 2 |
| Frontier toggle aparece atenuado | Región no soportada o licenciamiento Frontier no contratado | Verificar Parte A punto 4 y revisar el contrato con Microsoft |
| Modal de Terms of Service no aparece | Ya fue aceptado por otra persona | Buscar en audit log `AgentTOSAccepted` para identificar quién y cuándo |
| Página Overview en blanco | Audit logs no habilitados o latencia inicial | Habilitar audit logs y esperar 30 minutos |

---

## Lab 05.2 — Configuración cross-admin center y validación end-to-end

**Duración:** 25 min · **Dificultad:** Intermedia

### Objetivo

Conectar Defender XDR y Purview al Agent workload, opcionalmente conectar Power Platform admin center, y validar end-to-end con un agente de prueba.

### Procedimiento

#### Parte A — Conectar Defender (8 min)

Ver § 5.3 para detalle.

1. `Defender XDR → Settings → Cloud Apps → App connectors`.
2. **Add app connector** → buscar **Microsoft 365** → **Connect**.
3. Seleccionar áreas: SharePoint Online, OneDrive, Teams, Exchange Online, Microsoft Entra.
4. Tipo de autenticación: **OAuth**.
5. Aceptar permisos.
6. Esperar 5-8 minutos a que el estado pase de «Connecting» a «Connected».
7. Smoke test KQL antes de seguir:
   ```
   CloudAppEvents
   | where TimeGenerated > ago(15m)
   | take 10
   ```
   Si devuelve filas, el conector funciona y los eventos llegan.

#### Parte B — Conectar Purview (8 min)

Ver § 5.4 para detalle.

1. `Microsoft Purview → Solutions → Data Security Posture Management for AI`.
2. **Activate DSPM for AI**.
3. Aceptar coste implícito (compute para análisis de prompts).
4. **AI observability → Activate**.
5. Verificar publicación de sensitivity labels: `Purview → Information protection → Labels` → comprobar que las labels tienen scope a SharePoint Online y OneDrive.

#### Parte C — Conectar Power Platform (4 min, opcional)

Solo si la organización va a usar agentes Copilot Studio.

1. `Power Platform admin center → Integrations → Microsoft 365`.
2. **Connect to Microsoft 365 Agent Registry**.
3. Aceptar permisos. Sincronización inicial en 10-30 minutos.

#### Parte D — Validación end-to-end (5 min)

Seguir el procedimiento del § 5.5:

1. **Crear agente de prueba** desde Microsoft 365 Copilot → Create agent.
   - Nombre: `Test Agent 365 Setup`.
   - Sin datasource. Publicar al tenant.
2. **Interactuar con el agente** una vez (hacerle una pregunta).
3. **Verificar en los tres admin centers** en máximo 30 min:
   - **M365 admin → Agents → Registry:** el agente aparece con estado Active y owner correcto.
   - **Defender XDR → Hunting:** consulta KQL `CloudAppEvents | where ActionType startswith "Agent"` devuelve al menos una fila.
   - **Purview → Activity explorer:** filtrando «AI prompt» o «AI response» aparece al menos un evento.

### Output esperado

- Conector Microsoft 365 en Defender en estado «Connected» con eventos fluyendo.
- DSPM y AI observability activos en Purview con datos en el dashboard.
- Agente de prueba `Test Agent 365 Setup` visible en los tres admin centers.
- Documento de evidencia de validación con capturas de los tres admin centers.

### Plantilla de evidencia

Para cada admin center, registrar:

| Admin center | URL exacta | Hora de verificación | Resultado | Captura |
|---|---|---|---|---|
| M365 admin | `admin.microsoft.com/Adminportal/Home#/agents/registry` | | OK / KO | sí / no |
| Defender | `security.microsoft.com/v2/advanced-hunting` | | OK / KO | sí / no |
| Purview | `purview.microsoft.com/activityexplorer` | | OK / KO | sí / no |

---

## Solución comentada

> Para los dos labs, lee solo después de haber ejecutado los procedimientos.

<details>
<summary>Solución completa</summary>

### Lab 05.1

**Tiempo real esperado:** 25-35 min según familiaridad con los admin centers. Si tarda más de 45 min, hay un prerrequisito que fallaba.

**Errores que indican fallo de prerrequisito:**

- Si en Parte A1 el conteo de licencias no cuadra con lo facturado, hay un problema de asignación que debe resolverse antes (probablemente requiere Billing Administrator).
- Si en Parte A3 el banner «Start recording» aparece, **detenerse y pulsar primero**. Continuar sin audit logs activos invalida la mayor parte del Lab 05.2.

**Validación de éxito Lab 05.1:**

- Audit log incluye evento `AgentTOSAccepted` (verificable con `Search-UnifiedAuditLog -Operations AgentTOSAccepted` desde Exchange Online PowerShell).
- Página Overview accesible para una segunda persona con AI Reader (sin necesidad de aceptar Terms otra vez).
- Documento de evidencia archivado.

### Lab 05.2

**Tiempo real esperado:** 30-45 min. La validación end-to-end es la parte más impredecible: la latencia de los conectores varía entre 5 minutos (tenant maduro con tráfico) y 90 minutos (tenant recién activado).

**Diagnóstico si la validación tarda más de 30 minutos:**

1. Comprobar en Purview Audit que aparecen eventos relacionados con el agente de prueba. Si no aparecen, el problema es del audit log, no de Defender ni Purview.
2. Si los eventos están en Audit pero no en Defender CloudAppEvents tras 60 minutos, revisar el conector M365 en Defender → Settings → Cloud Apps. Posibles causas: permisos OAuth incompletos, conector pausado, indexación de Defender retrasada.
3. Si los eventos están en Audit pero no en Purview Activity explorer, revisar el primer scan de DSPM. A veces falla silenciosamente y hay que reactivarlo.

**Validación de éxito Lab 05.2:**

- Smoke test KQL inicial (Parte A punto 7) devuelve filas en menos de 10 minutos.
- Agente de prueba aparece en M365 Registry inmediatamente tras crearlo.
- Aparece en Defender CloudAppEvents en menos de 30 minutos tras la primera interacción.
- Aparece en Purview Activity explorer en menos de 30 minutos tras la primera interacción.

</details>

---

## Errores frecuentes (consolidado)

| Error | Lab | Cómo evitarlo |
|---|---|---|
| Saltar el smoke test KQL antes de seguir | 05.2 Parte A7 | Siempre ejecutar la consulta genérica antes de la específica de agentes |
| Activar Frontier «por si acaso» en una organización que solo va a usar GA | 05.1 Parte B1 | Frontier es solo para preview real; activarlo sin justificación añade complejidad innecesaria |
| Aceptar Terms of Service desde una cuenta de servicio o cuenta compartida | 05.1 Parte B2 | El audit log atribuirá la aceptación a la cuenta de servicio: pésimo para auditoría |
| Olvidar archivar las evidencias | Ambos | Sin evidencia, la próxima auditoría externa no puede verificar el momento de activación |

---

## Validación

Si has completado los dos labs y tu validación end-to-end aparece en los tres admin centers en menos de 30 minutos, has cerrado correctamente la Fase 3 del curso. Estás listo para entrar al M06, donde profundizaremos en las identidades de los agentes en Microsoft Entra.
