---
modulo: 8
tipo: laboratorios
titulo: "Laboratorios del Módulo 08"
duracion_min: 75
area_examen: 3
estado: producido
fase_produccion: 4
ultima_actualizacion: 2026-05-06
laboratorios:
  - id: "08.1"
    titulo: "Publish + Deploy de un agente con plantilla Custom"
    duracion_min: 30
    dificultad: intermedio
    requiere_tenant: true
    licencias_requeridas:
      - "Microsoft Agent 365"
      - "Microsoft 365 Copilot Studio (para crear agente de prueba)"
    roles_requeridos:
      - "AI Administrator"
      - "Cloud Application Administrator (para admin consents)"
  - id: "08.2"
    titulo: "Pin, Block, Unblock secuencial"
    duracion_min: 20
    dificultad: basico
    requiere_tenant: true
    licencias_requeridas:
      - "Lab 08.1 completado"
    roles_requeridos:
      - "AI Administrator"
  - id: "08.3"
    titulo: "Reassign ownership tras hard delete del owner"
    duracion_min: 25
    dificultad: avanzado
    requiere_tenant: true
    licencias_requeridas:
      - "Microsoft Agent 365"
      - "Acceso a Agent Builder"
    roles_requeridos:
      - "AI Administrator"
      - "User Administrator (para hard-delete del usuario de prueba)"
---

# Módulo 08 — Laboratorios

## Prerrequisitos

- Lectura completa de la teoría del Módulo 08.
- Tenant de Microsoft 365 con Agent 365 activado y Lab 06.1-06.2 completados (recomendado para tener un blueprint y agent identity ya listos).
- Los tres labs son **independientes** entre sí: el 08.1 crea el agente con el que se trabaja en 08.2. El 08.3 es independiente.

> Si no dispones de tenant, los labs funcionan como ejercicio de comprensión: lee cada paso, contrástalo con la teoría y razona qué verías en cada pantalla.

---

## Lab 08.1 — Publish + Deploy de un agente con plantilla Custom

**Duración:** 30 min · **Dificultad:** Intermedia

### Objetivo

Recorrer el wizard de publishing completo con un agente real, aplicar una Custom Template con políticas específicas, hacer Deploy a un grupo piloto, y verificar el resultado en la UI del usuario.

### Procedimiento

#### Parte A — Crear o usar agente Copilot Studio (5 min)

Si tienes un agente del Lab 06.2 (`RRHH-FAQ-Nominas`), úsalo. Si no:

1. Microsoft 365 Copilot → **Create agent**.
2. Configurar mínimo:
   - Display name: `Test-Agent-08`.
   - Description: `Agente de prueba para Lab 08.1`.
   - Sin datasource (suficiente para el lab).
3. **Submit for publishing** (botón en la parte superior).

#### Parte B — Crear Custom Template (8 min)

1. `M365 admin center → Agents → Settings → Templates`.
2. **+ New template** → nombre: `Lab08-CustomTemplate`.
3. Configurar las políticas:
   - Sharing externo: **Disabled**.
   - Cross-site SharePoint: **Limited to user's sites**.
   - Logging: **Verbose**.
   - Conditional Access: **Tenant-wide policies**.
   - Sensitivity label heredada: **Internal** (mínimo).
4. **Save** y verificar que aparece en la lista de Custom Templates.

#### Parte C — Wizard de publishing (12 min)

1. `M365 admin center → Agents → Overview` → **Top actions for you → Pending requests** → click sobre `Test-Agent-08`.
2. **Paso 2 (Review)**: revisar quién publica, qué hace, qué permisos pide.
3. **Paso 3 (Select users / groups)**: seleccionar **Specific groups** → buscar el grupo `IT-Lab-Pilot` (o crear uno si no existe con 3-5 usuarios de prueba).
4. **Paso 4 (Preinstall)**: marcar **Preinstall** = Yes.
5. **Paso 5 (Apply Template)**: seleccionar **Custom: Lab08-CustomTemplate**.
6. **Paso 6 (Permissions review)**: revisar y validar cada scope. Otorgar admin consent si es necesario.
7. **Paso 7 (Finalización)**: confirmar. El agente pasa a estado `Active`.

#### Parte D — Verificación (5 min)

1. **Registry**: verificar que el agente está en estado `Active` con badge.
2. **Vista de detalle del agente**: verificar que la Custom Template aplicada aparece en la sección de políticas.
3. **Pedir a un usuario del grupo piloto** que abra Microsoft 365 Copilot. Verificar que el agente aparece pre-instalado.
4. Anotar tiempo de propagación (típicamente 5-15 minutos).

### Output esperado

- Agente `Test-Agent-08` en estado `Active deployed` para el grupo piloto.
- Custom Template `Lab08-CustomTemplate` creada y aplicada.
- Documento de evidencia con captura del wizard completado.

### Errores frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| Wizard se cuelga en paso 5 | No hay Custom Templates creadas | Saltar al paso 7 con Default Template, o crear primero la Custom |
| Permissions review da «consent required» | Cuenta sin Cloud Application Administrator | Pedir a alguien con ese rol que termine el wizard |
| Agente no aparece pre-instalado para el usuario | Latencia de propagación | Esperar 15 minutos y reintentar |
| Custom Template no aparece en el dropdown | Template guardada con scope incorrecto | Verificar scope del template = Tenant |

---

## Lab 08.2 — Pin, Block, Unblock secuencial

**Duración:** 20 min · **Dificultad:** Básica

### Objetivo

Ejercitar las acciones de Pin, Block y Unblock sobre un agente activo. Observar la propagación a la UI cliente y entender el efecto de cada acción.

### Procedimiento

> Requiere haber completado el Lab 08.1 con `Test-Agent-08` en estado `Active deployed`.

#### Parte A — Pin (8 min)

1. `Registry` → click sobre `Test-Agent-08` → menú contextual **... → Pin**.
2. Seleccionar slot **Administrator**.
3. Confirmar.
4. **Esperar 5-15 minutos** (puede ser hasta 6h, pero típicamente menos).
5. Pedir al usuario piloto que recargue Microsoft 365 Copilot. Verificar que el agente aparece en el slot Administrator (visualmente prominente, con icono Pin).

#### Parte B — Block (4 min)

1. Vuelve al Registry → `Test-Agent-08` → **... → Block**.
2. Introducir justificación: «Block temporal para Lab 08.2».
3. Confirmar.
4. **Verificación inmediata**: pedir al usuario piloto que intente invocar el agente. Debe recibir mensaje de bloqueo («This agent has been blocked by your administrator»).
5. Verificar en Registry que el badge de status cambia a `Blocked`.

#### Parte C — Unblock (3 min)

1. Registry → `Test-Agent-08` → **... → Unblock**.
2. Confirmar.
3. Pedir al usuario piloto que reintente invocar. Debe funcionar de nuevo.
4. Verificar que el badge vuelve a `Active`.

#### Parte D — Comparar tiempos (5 min)

| Acción | Tiempo de propagación observado |
|---|---|
| Pin | _____ minutos |
| Block | _____ segundos / minutos |
| Unblock | _____ segundos / minutos |

Block y Unblock suelen ser casi inmediatos (segundos). Pin puede tardar 5-15 min por caching cliente. Esta diferencia es relevante para situaciones de seguridad: Block sirve como freno de emergencia.

### Output esperado

- Agente pineado al slot Administrator → blocked → unblocked, con verificación en cada paso desde la UI del usuario.
- Documento con tiempos observados.

### Errores frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| Pin atenuado | Agente no deployed | Hacer Deploy primero (Lab 08.1 Parte C) |
| Pin tarda más de 30 min | Caching agresivo del cliente Teams | Pedir al usuario que cierre y reabra Teams |
| Block no aplica al usuario | Usuario tenía sesión activa | El bloqueo aplica al siguiente sign-in del agente; en sesiones largas esperar 60 min |
| Unblock no restaura al estado anterior | Mientras estaba blocked se hizo otro cambio | Verificar audit log; aplicar manualmente lo que falte |

---

## Lab 08.3 — Reassign ownership tras hard delete del owner

**Duración:** 25 min · **Dificultad:** Avanzada

### Objetivo

Simular el caso real de un empleado que deja la organización y verificar el comportamiento de Reassign Ownership. Confirmar que la limitación a Agent Builder es real.

### Procedimiento

> ⚠ Lab destructivo: requiere crear un usuario de prueba y eliminarlo. NO ejecutar con cuentas reales.

#### Parte A — Crear cuenta de prueba (3 min)

1. Entra admin center → Users → **+ New user** → Internal user.
2. UPN: `test-leaver-08@<tu-tenant>.onmicrosoft.com`.
3. Display name: `Test Leaver 08`.
4. Manager: tu cuenta (o cualquier admin del tenant).
5. Asignar licencia Agent 365.

#### Parte B — Crear agente Agent Builder con esa cuenta (8 min)

> Loguearse con la cuenta `test-leaver-08` (en sesión privada del navegador):

1. Microsoft 365 Copilot → **Build with Agent Builder**.
2. Crear agente:
   - Display name: `Lab08-Test-AgentBuilder`.
   - Description: `Agente para probar reassign tras leaver`.
   - Sin datasource.
3. Publish (con la cuenta de prueba, queda en pending approval).

#### Parte C — Aprobar el agente con tu cuenta admin (3 min)

> Cerrar sesión de `test-leaver-08`, volver a tu cuenta admin:

1. M365 admin → Agents → Pending requests → aprobar `Lab08-Test-AgentBuilder` con Default Template.
2. Verificar en Registry que el owner es `test-leaver-08@<tu-tenant>`.

#### Parte D — Hard-delete del usuario (3 min)

1. Entra admin center → Users → buscar `test-leaver-08` → **Delete user**.
2. Confirmar el hard-delete (no soft-delete; o si es soft, ejecutar también `Remove-MgDirectoryDeletedItem` con su id).
3. Esperar 5-10 min para propagación.

#### Parte E — Verificar ownerless y reassign (8 min)

1. M365 admin → Agents → Overview → **Top actions for you → Ownerless agents → Manage**.
2. Verificar que `Lab08-Test-AgentBuilder` aparece en la lista.
3. Click sobre el agente → menú **... → Reassign Ownership**.
4. Seleccionar nuevo owner: tu cuenta admin (o el manager de la cuenta eliminada).
5. Confirmar.
6. Verificar que el agente sale de la categoría ownerless y aparece con el nuevo owner.

#### Parte F — Test contraste con Copilot Studio (opcional, 5 min adicionales)

> Para verificar la limitación de Reassign:

1. Crear un agente similar pero esta vez en Copilot Studio (no Agent Builder).
2. Ejecutar el mismo proceso (crear con cuenta de prueba, publicar, aprobar, eliminar el usuario).
3. Ir a M365 admin → ownerless → click sobre el agente Copilot Studio → buscar la opción **Reassign Ownership**.
4. **Resultado esperado**: la opción NO está disponible para Copilot Studio. La UI redirige (o instruye) a ir a Power Platform admin center.

### Output esperado

- Agente `Lab08-Test-AgentBuilder` con nuevo owner asignado.
- Verificación de la limitación: Reassign solo aplica a Agent Builder.
- Documento con capturas del antes/después de cada paso.

### Errores frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| Hard-delete falla con «license assigned» | La licencia debe quitarse antes | Quitar licencia primero, luego delete |
| Agente no aparece en ownerless después del delete | Latencia | Esperar 30 min más; el delete tarda en propagarse |
| Botón Reassign atenuado | Agente NO es Agent Builder (es Studio o Foundry) | Confirmar plataforma origen del agente |
| Reasignación pero el nuevo owner no recibe email | Mailbox del nuevo owner sin licencia activa | Verificar que la cuenta tiene licencia con mailbox |

### Limpieza tras el lab

```powershell
# Eliminar el agente de prueba
Remove-Agent365Agent -Id <id-del-agente-lab08>

# Eliminar la cuenta de prueba si sigue en deleted users
Remove-MgDirectoryDeletedItem -DirectoryObjectId <id-test-leaver-08>
```

---

## Errores frecuentes (consolidado)

| Error | Lab | Cómo evitarlo |
|---|---|---|
| Hacer Delete cuando se quería Remove | 08.1 | Si dudas, Remove primero. Siempre se puede Delete después |
| Aplicar Default Template a agentes que necesitan políticas estrictas | 08.1 | Crear Custom Template específica antes del wizard |
| Hard-delete de usuario con agentes activos | 08.3 | Reasignar ownership ANTES del delete |
| Probar Reassign con agente Copilot Studio | 08.3 | Solo aplica a Agent Builder; usar Power Platform admin center para Studio |

---

## Validación

Si has completado los tres labs, dominas el ciclo de vida operativo de un agente: lo creas, lo publicas con plantilla custom, lo distribuyes, lo pineas, lo bloqueas y desbloqueas, y resuelves el caso del owner que se va. Estos son los movimientos que harás cada semana en tu rol de IT admin.
