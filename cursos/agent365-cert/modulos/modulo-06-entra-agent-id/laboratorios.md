---
modulo: 6
tipo: laboratorios
titulo: "Laboratorios del Módulo 06"
duracion_min: 90
area_examen: 2
estado: producido
fase_produccion: 4
ultima_actualizacion: 2026-05-06
laboratorios:
  - id: "06.1"
    titulo: "Crear un blueprint con la CLI a365"
    duracion_min: 30
    dificultad: intermedio
    requiere_tenant: true
    licencias_requeridas:
      - "Microsoft Agent 365"
    roles_requeridos:
      - "AI Administrator"
      - "Agent ID Administrator"
  - id: "06.2"
    titulo: "Crear y desplegar una agent identity desde el blueprint"
    duracion_min: 30
    dificultad: intermedio
    requiere_tenant: true
    licencias_requeridas:
      - "Lab 06.1 completado"
    roles_requeridos:
      - "Agent ID Administrator"
  - id: "06.3"
    titulo: "Configurar sponsorship + lifecycle workflow"
    duracion_min: 30
    dificultad: avanzado
    requiere_tenant: true
    licencias_requeridas:
      - "Microsoft Entra ID P1 (incluido en E5)"
      - "Lab 06.1 y 06.2 completados"
    roles_requeridos:
      - "Lifecycle Workflows Administrator"
      - "Agent ID Administrator"
---

# Módulo 06 — Laboratorios

## Prerrequisitos

- Lectura completa de la teoría del Módulo 06.
- Tenant de Microsoft 365 con Agent 365 activado (M05 completado).
- Acceso a un terminal con permisos de administrador local para instalar la CLI `a365`.
- Los tres labs son **secuenciales**: cada uno depende del anterior. Ejecutar en orden.

> Si no dispones de tenant, los labs funcionan como ejercicio de comprensión: lee cada paso, responde a las preguntas de checkpoint y sigue con el siguiente. La lógica de las decisiones es la misma.

---

## Lab 06.1 — Crear un blueprint con la CLI `a365`

**Duración:** 30 min · **Dificultad:** Intermedia

### Objetivo

Instalar la CLI oficial de Agent 365, autenticarse contra el tenant, y crear un blueprint con permisos heredables ajustados al caso de uso «agente RRHH FAQ» de Plain Coffee SL.

### Procedimiento

#### Parte A — Instalar la CLI `a365` (8 min)

```bash
# Linux / macOS
curl -fsSL https://aka.ms/install-a365 | bash

# Windows PowerShell (como admin)
iex "& { $(irm https://aka.ms/install-a365.ps1) }"

# Verificar instalación
a365 --version
# Esperado: a365 1.x.x (build YYYYMMDD)
```

#### Parte B — Autenticarse contra el tenant (5 min)

```bash
a365 setup admin --tenant plaincoffee.onmicrosoft.com
```

El comando abre el navegador para autenticación interactiva. Iniciar sesión con una cuenta que tenga **AI Administrator** y **Agent ID Administrator**. Si la cuenta no tiene los roles correctos, fallará con mensaje claro.

Tras la autenticación, verifica el estado:

```bash
a365 setup status
# Esperado:
# ✓ Tenant: plaincoffee.onmicrosoft.com
# ✓ Logged in as: luis@plaincoffee.onmicrosoft.com
# ✓ AI Administrator: yes
# ✓ Agent ID Administrator: yes
# ✓ Agent 365 workload: active
```

#### Parte C — Diseñar el blueprint en YAML (10 min)

Crear archivo `bp-rrhh-faq.yaml`:

```yaml
displayName: RRHH FAQ — read employee data
description: Blueprint para agentes Copilot Studio del equipo de RRHH

inheritablePermissions:
  - resourceAppId: 00000003-0000-0000-c000-000000000000  # Microsoft Graph
    resourceAppName: Microsoft Graph
    scopes:
      - User.Read.All
      - Group.Read.All
      - TeamsActivity.Send

restrictions:
  allowedAuthenticationFlows: [onBehalfOf]
  maxAgentIdentities: 5
  tenantOnly: true

lifecycle:
  expirationPolicy: 365days
  auditLevel: verbose

customSecurityAttributes:
  - key: Department
    value: HR
  - key: DataSensitivity
    value: Internal
```

#### Parte D — Crear el blueprint (5 min)

```bash
a365 setup blueprint --file bp-rrhh-faq.yaml

# Salida esperada:
# Validating blueprint...
# ✓ Schema OK
# ✓ Resource apps validated (1)
# ✓ Total scopes: 3 (limit: 40)
# Creating blueprint principal...
# ✓ Blueprint principal created (id: ...)
# Granting admin consent...
# ✓ Admin consent granted for Microsoft Graph scopes
# Creating blueprint...
# ✓ Blueprint created (id: bp-rrhh-faq-001)
```

#### Parte E — Verificación (2 min)

```bash
# Listar blueprints del tenant
a365 list blueprints

# Salida esperada (al menos):
# ID                    DISPLAY NAME              IDENTITIES   STATUS
# bp-rrhh-faq-001      RRHH FAQ — read...        0            Active
```

Verificar también desde Entra admin center:

1. Navegar a `entra.microsoft.com → Identity → Agents → Blueprints`.
2. Confirmar que aparece `RRHH FAQ — read employee data`.
3. Click sobre el blueprint y verificar que muestra los 3 scopes y las restrictions.

### Checkpoints

- [ ] CLI `a365` instalada y `--version` funciona.
- [ ] `a365 setup status` muestra los 5 ✓ esperados.
- [ ] Archivo `bp-rrhh-faq.yaml` validado por la CLI sin errores.
- [ ] Blueprint creado y visible desde la CLI y desde Entra admin center.
- [ ] **Cero identities** asociadas todavía.

### Errores frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| `a365: command not found` tras instalación | Path no actualizado | Reiniciar shell o ejecutar `source ~/.profile` |
| `setup admin` falla con «insufficient privilege» | Cuenta sin AI Admin ni Agent ID Admin | Pedir al equipo IT que añada los roles |
| `setup blueprint` falla con `tooManyScopes` | Más de 40 scopes en una resource app | Reducir el número de scopes o partir en dos blueprints |
| `setup blueprint` falla con `resourceAppNotConsented` | Admin consent no se otorgó | Re-ejecutar `setup admin` con `--grant-consent` |

---

## Lab 06.2 — Crear y desplegar una agent identity desde el blueprint

**Duración:** 30 min · **Dificultad:** Intermedia

### Objetivo

Crear una agent identity concreta a partir del blueprint del Lab 06.1, desplegar el agente vinculado, y validar que la identidad aparece en el directorio con sus permisos heredados correctamente.

### Procedimiento

#### Parte A — Crear la agent identity con la CLI (10 min)

```bash
a365 create-instance identity \
  --blueprint bp-rrhh-faq-001 \
  --display-name "RRHH-FAQ-Nominas" \
  --description "Agente que responde dudas sobre nóminas y beneficios" \
  --sponsor luis@plaincoffee.onmicrosoft.com

# Salida esperada:
# Validating blueprint...
# ✓ Blueprint exists and accepts new identities (current: 0/5)
# Creating agent identity...
# ✓ Agent identity created (id: agent-rrhh-faq-nominas-001)
# ✓ Inherited permissions from blueprint
# ✓ Sponsor configured: luis@plaincoffee.onmicrosoft.com
# ✓ transferOnLeaver: true (default)
```

#### Parte B — Verificar en Entra admin center (5 min)

1. `entra.microsoft.com → Identity → Agents → Agent identities`.
2. Buscar `RRHH-FAQ-Nominas`.
3. Verificar:
   - Estado: Active.
   - Blueprint: `bp-rrhh-faq-001`.
   - Sponsor: Luis Ortega.
   - Permissions: heredados del blueprint.
   - Custom security attributes: `Department: HR`, `DataSensitivity: Internal`.

#### Parte C — Filtrar por blueprint en Microsoft Graph (5 min)

Probar la consulta Graph para listar todas las identities derivadas del blueprint:

```http
GET https://graph.microsoft.com/beta/agentIdentities
?$filter=blueprintId eq 'bp-rrhh-faq-001'
&$select=id,displayName,sponsor,createdDateTime
```

Resultado esperado:

```json
{
  "value": [
    {
      "id": "agent-rrhh-faq-nominas-001",
      "displayName": "RRHH-FAQ-Nominas",
      "sponsor": {
        "userPrincipalName": "luis@plaincoffee.onmicrosoft.com",
        "displayName": "Luis Ortega",
        "transferOnLeaver": true
      },
      "createdDateTime": "2026-05-06T10:34:12Z"
    }
  ]
}
```

#### Parte D — Filtrar por custom security attribute (5 min)

```http
GET https://graph.microsoft.com/beta/agentIdentities
?$filter=customSecurityAttributes/Department eq 'HR'
```

Esto debería devolver el mismo agente, ahora filtrado por atributo custom en lugar de blueprint. Útil para reporting transversal.

#### Parte E — Vincular el agente Copilot Studio a la identity (5 min)

En Microsoft Copilot Studio:

1. Crear un nuevo agente `RRHH FAQ Nóminas`.
2. En la sección **Identity** del agente, vincular con la agent identity recién creada (`agent-rrhh-faq-nominas-001`).
3. Publicar al tenant.
4. Hacer una invocación de prueba desde Microsoft 365 Copilot.

### Checkpoints

- [ ] Agent identity visible en Entra admin center con sponsor configurado.
- [ ] Consulta Graph por `blueprintId` devuelve la identity.
- [ ] Consulta Graph por custom security attribute devuelve la identity.
- [ ] Agente Copilot Studio vinculado y publicado.
- [ ] Invocación de prueba responde correctamente.

### Errores frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| `create-instance` falla con `maxAgentIdentitiesReached` | Ya hay `maxAgentIdentities` instancias | Subir el límite del blueprint o crear nuevo blueprint |
| Sponsor no aparece en el output | UPN mal escrito o usuario no existe | Verificar UPN exacto desde Entra |
| Consulta Graph devuelve `403 Forbidden` | Cuenta sin permisos para leer agentIdentities | Asignar Agent ID Administrator |
| Agente Copilot Studio no encuentra la identity | La identity está en otra tenant unit | Mover a la misma unidad administrativa o configurar scope |

---

## Lab 06.3 — Configurar sponsorship + lifecycle workflow

**Duración:** 30 min · **Dificultad:** Avanzada

### Objetivo

Configurar un lifecycle workflow que detecte el `leaver` event de un sponsor y transfiera automáticamente el sponsorship al manager. Simular la salida del sponsor y verificar que la transferencia ocurre.

### Procedimiento

#### Parte A — Configurar el lifecycle workflow (15 min)

1. `entra.microsoft.com → Identity governance → Lifecycle workflows → Workflows`.
2. **Create a workflow** → seleccionar plantilla **«Manage agent sponsorship on leaver»** (si no existe en tu tenant, crear desde cero usando el código YAML siguiente).
3. Configuración:

```yaml
name: Agent sponsorship transfer on leaver
description: Transfiere sponsorship del agente al manager cuando el sponsor deja la organización
trigger:
  type: onLeaver
  scope:
    users: all
  daysBeforeAction: 0
tasks:
  - taskId: notifyManager
    parameters:
      subject: "Has sido designado sponsor de un agent identity"
      message: |
        Hola {{user.manager.displayName}},
        
        El agent identity {{agent.displayName}} (ID: {{agent.id}}) ha sido transferido a ti
        porque su sponsor anterior ({{user.displayName}}) ha dejado la organización.
        
        Por favor, revisa si el agente sigue siendo necesario en {{review.deadline}}.
        Tienes 30 días para decidir.
  
  - taskId: transferAgentSponsorship
    parameters:
      newSponsor: "{{user.manager}}"
      agentFilter: "sponsor.userPrincipalName eq '{{user.userPrincipalName}}'"
  
  - taskId: requireReviewWithinDays
    parameters:
      days: 30
      escalationContact: "ITAdmins@plaincoffee.com"
```

4. Activar el workflow.

#### Parte B — Simular el leaver event (5 min)

> Lo siguiente requiere una cuenta de prueba que se pueda deshabilitar. NO hacerlo con cuentas reales del tenant.

Crear cuenta de prueba si no existe:

```bash
# Desde Entra admin center → New user → Internal user
# UPN: test-leaver@plaincoffee.onmicrosoft.com
# Manager: luis@plaincoffee.onmicrosoft.com
```

Asignar la cuenta como sponsor de una agent identity nueva:

```bash
a365 update identity agent-rrhh-faq-nominas-001 \
  --sponsor test-leaver@plaincoffee.onmicrosoft.com \
  --transfer-on-leaver true
```

Disparar el leaver event:

```bash
# Desde Entra admin center → Users → test-leaver → Edit → Account enabled = NO
# O via PowerShell:
# Update-MgUser -UserId test-leaver@... -AccountEnabled:$false
```

#### Parte C — Verificar la transferencia automática (10 min)

Esperar entre 5 y 60 minutos (la latencia del workflow varía según tenant):

1. **En Entra → Lifecycle workflows → Workflows → Run history**: verificar que el workflow se ha disparado.
2. **En el outlook del manager (Luis Ortega)**: verificar que ha recibido el email de notificación.
3. **En Entra → Identity → Agents → Agent identities**: verificar que el sponsor del agente ahora es Luis Ortega, no `test-leaver@`.
4. **En la propia identity**: verificar que `requiresReview` está marcado con deadline a 30 días.

```bash
# Comprobar el cambio vía CLI:
a365 get identity agent-rrhh-faq-nominas-001 --output json | jq '.sponsor'

# Esperado:
# {
#   "userPrincipalName": "luis@plaincoffee.onmicrosoft.com",
#   "displayName": "Luis Ortega",
#   "transferOnLeaver": true,
#   "transferredAt": "2026-05-06T11:08:42Z",
#   "previousSponsor": "test-leaver@plaincoffee.onmicrosoft.com"
# }
```

### Checkpoints

- [ ] Workflow creado y activo.
- [ ] Cuenta de prueba `test-leaver` creada y asignada como sponsor.
- [ ] Account disabled dispara el workflow en menos de 60 min.
- [ ] Manager recibe el email de notificación.
- [ ] Sponsor del agente cambia a Luis Ortega automáticamente.
- [ ] `requiresReview` marcado con deadline 30 días.

### Errores frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| Workflow no se dispara tras 60 min | Trigger mal configurado | Verificar `trigger.type: onLeaver` y `scope.users: all` |
| Email no llega al manager | Cuenta de manager sin licencia M365 o mailbox bloqueado | Verificar licencia y mailbox del manager |
| Transferencia falla con «manager not found» | Usuario test-leaver sin manager configurado | Asignar manager antes de disable |
| `transferAgentSponsorship` task no encuentra agentes | `agentFilter` mal escrito | Verificar sintaxis del filtro y el UPN exacto |

### Limpieza tras el lab

Tras completar el lab, **revertir los cambios** para no dejar la cuenta de prueba con efectos colaterales:

```bash
# Re-habilitar la cuenta o eliminarla
# Reasignar el agent identity a su sponsor real (Luis)
a365 update identity agent-rrhh-faq-nominas-001 \
  --sponsor luis@plaincoffee.onmicrosoft.com

# Si se quiere mantener el workflow para producción, dejarlo activo
# Si era solo para el lab, deshabilitar:
# Entra → Lifecycle workflows → Workflows → Disable
```

---

## Errores frecuentes (consolidado)

| Error | Lab | Cómo evitarlo |
|---|---|---|
| Crear blueprint sin verificar `maxAgentIdentities` | 06.1 | Calcular crecimiento esperado antes de crear; mejor poner un margen del 50 % |
| Crear identity sin sponsor | 06.2 | Sponsor debería ser obligatorio por política tenant; si no lo es, hacerlo costumbre |
| Lifecycle workflow sin `daysBeforeAction` | 06.3 | Configurar siempre el grace period (default 0 es inmediato; mejor 1-3 días para evitar disparos accidentales) |
| Probar el workflow con cuentas reales | 06.3 | Siempre con cuentas de prueba dedicadas |

---

## Validación

Si has completado los tres labs, has cubierto el ciclo completo de governance de identidades de Agent 365: del blueprint a la identity a su lifecycle automático. Estás listo para el M07, donde profundizaremos en el Agent Registry y el Agent Map como capas operativas sobre estas identidades.
