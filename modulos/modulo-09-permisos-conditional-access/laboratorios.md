---
modulo: 9
tipo: laboratorios
titulo: "Laboratorios del Módulo 09"
duracion_min: 50
area_examen: 2
estado: producido
fase_produccion: 4
ultima_actualizacion: 2026-05-07
laboratorios:
  - id: "09.1"
    titulo: "Crear CA policy de bloqueo por high agent risk en Report-only"
    duracion_min: 30
    dificultad: avanzado
    requiere_tenant: true
    licencias_requeridas:
      - "Microsoft Entra ID P2 (incluida en E5/E7)"
      - "Microsoft Agent 365"
    roles_requeridos:
      - "Conditional Access Administrator (o Security Administrator)"
      - "Identity Protection lectura para validación"
  - id: "09.2"
    titulo: "Confirm compromise sobre un agente y observar enforcement"
    duracion_min: 20
    dificultad: avanzado
    requiere_tenant: true
    licencias_requeridas:
      - "Lab 09.1 completado"
      - "Lab 06.2 completado (agent identity creada)"
    roles_requeridos:
      - "Conditional Access Administrator"
      - "Identity Protection Administrator"
---

# Módulo 09 — Laboratorios

## Prerrequisitos

- Lectura completa de la teoría del Módulo 09.
- Tenant con Agent 365 activado, Microsoft Entra ID P2 disponible y al menos un agente activo (idealmente la identidad creada en Lab 06.2 — `RRHH-FAQ-Nominas` o equivalente).
- Acceso a Identity Protection con licencia P2 inscrita en Frontier preview (paso del M05).
- Los dos labs son **secuenciales**: el 09.1 crea la CA policy con la que se valida el cascade en 09.2.

> Si no dispones de tenant, los labs funcionan como ejercicio de comprensión: lee cada paso, contrástalo con la teoría y razona qué verías en cada pantalla del Entra admin center.

---

## Lab 09.1 — Crear CA policy de bloqueo por high agent risk en Report-only

**Duración:** 30 min · **Dificultad:** Avanzada

### Objetivo

Crear una política de Conditional Access que aplique a `All agent identities`, condicione por `Agent risk: High`, otorgue `Block access` y arranque en **Report-only mode** para monitorización antes de enforcement. Validar que los sign-ins de los agentes aparecen evaluados en los Sign-in logs sin bloqueo real.

### Procedimiento

#### Parte A — Verificar prerrequisitos del tenant (5 min)

1. `Entra admin center → Identity → Overview` → confirmar que el tenant tiene **Microsoft Entra ID P2** activa (visible en *License utilization*).
2. `Entra admin center → Identity Protection → Overview` → confirmar que la página carga sin warning de licencia. Si aparece *Upgrade required*, P2 no está activa: parar el lab y revisar M05.
3. `Entra admin center → Identity → Agents → All agent identities` → verificar que hay al menos una agent identity activa (la del Lab 06.2 sirve).
4. Anotar el nombre del tenant y el `tenantId` (visible en `Properties`); harán falta para auditar después.

#### Parte B — Crear la policy en Report-only (15 min)

1. `Entra admin center → Identity → Protection → Conditional Access → Policies` → **+ New policy**.
2. **Name**: `Block agent identities at high risk (lab)`.
3. **Assignments → Users or workload identities**:
   - Cambiar el selector a **Workload identities**.
   - **Include**: `All agent identities`.
   - **Exclude**: dejar vacío para el lab (en producción se excluyen identidades break-glass).
4. **Target resources → Cloud apps**:
   - **Include**: `All resources`.
5. **Conditions → Agent risk**:
   - Configure: **Yes**.
   - Select levels: marcar `High` solamente. **No** marcar Medium ni Low en este lab.
6. **Access controls → Grant**:
   - Configure: **Block access**.
   - Confirmar.
7. **Enable policy**: seleccionar **Report-only**. Esta es la decisión clave del lab — **no** seleccionar *On*.
8. **Create**. La policy queda visible en la lista con el badge `Report-only`.

#### Parte C — Generar tráfico para que la policy se evalúe (5 min)

1. Forzar al menos un sign-in del agente. Tres opciones según el agente:
   - **Agente conversacional** (Agent Builder o Copilot Studio): pedir a un usuario piloto que invoque el agente desde Microsoft 365 Copilot.
   - **Agente con own identity**: ejecutar manualmente el flujo `client_credentials` (un POST a `https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token` con el `client_id` del agente).
   - **Bulk simulado**: invocar el agente 3-4 veces seguidas para tener varias entradas en logs.
2. Esperar 5 minutos para que los logs se ingesten (típicamente 2-5 min).

#### Parte D — Validar que la policy se evalúa sin bloquear (5 min)

1. `Entra admin center → Identity → Sign-in logs → Workload identity sign-ins` (pestaña separada de los sign-ins de usuario humano).
2. Filtrar por **Application name** = nombre del agente, o por el `appId` de la agent identity.
3. Click sobre uno de los sign-ins recientes → pestaña **Conditional Access**.
4. Buscar la policy `Block agent identities at high risk (lab)`. Resultado esperado:
   - **Result**: `Not applied` si el agente NO tiene `Agent risk: High` en ese momento.
   - **Result**: `Reported: would have been blocked` si el agente SÍ está en High (caso esperado solo si vienes del Lab 09.2 o si Identity Protection ha disparado una detección real).
5. Validar que el sign-in **no se bloqueó**: la pestaña **Status** muestra `Success`. Esto confirma que Report-only evalúa sin enforcement.

### Output esperado

- Una CA policy `Block agent identities at high risk (lab)` en estado `Report-only`, scope `All agent identities`, condition `Agent risk: High`, grant `Block access`.
- Al menos un sign-in del agente registrado en `Workload identity sign-ins` con la policy evaluada.
- Captura de pantalla de la pestaña *Conditional Access* del sign-in mostrando la evaluación.

### Errores frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| El selector *Workload identities* no aparece | Tenant sin Workload Identities Premium o sin Agent 365 activado | Verificar M05; el switch aparece tras la activación |
| `All agent identities` no es seleccionable | Pre-GA: la opción se llamaba `Agentic identities` | Buscar la nomenclatura legacy si el tenant no se ha actualizado a la build de mayo 2026 |
| La policy no aparece en *Conditional Access* del sign-in | El sign-in es de un usuario humano, no del agente | Filtrar por *Workload identity sign-ins*, no por *User sign-ins* |
| `Result: Not applied` siempre | El agente nunca llega a `High` agent risk en el lab | Es normal sin compromiso real. Para forzar `High` ir al Lab 09.2 |
| La policy bloquea sign-ins en lugar de solo reportarlos | Estado pasó por error a `On` | Editar la policy → `Enable policy: Report-only` → Save |

---

## Lab 09.2 — Confirm compromise sobre un agente y observar enforcement

**Duración:** 20 min · **Dificultad:** Avanzada

### Objetivo

Marcar manualmente una agent identity como comprometida desde el Risky Agents report, observar la elevación inmediata del risk a `High`, cambiar la policy del Lab 09.1 a enforcement (`On`) y confirmar que el siguiente sign-in del agente queda bloqueado por la CA policy.

### Procedimiento

> Requiere haber completado el Lab 09.1 con la CA policy en estado `Report-only` y disponer de la agent identity del Lab 06.2 (`RRHH-FAQ-Nominas` o equivalente).

#### Parte A — Pasar la policy a enforcement (3 min)

1. `Entra admin center → Identity → Protection → Conditional Access → Policies` → seleccionar `Block agent identities at high risk (lab)`.
2. Cambiar **Enable policy** de `Report-only` a `On`.
3. **Save**.
4. Verificar que el badge de la policy en la lista cambia a `Enabled`.

> En producción este paso ocurre tras 7-14 días de Report-only sin falsos positivos. Aquí lo aceleramos para validar el cascade.

#### Parte B — Confirm compromise desde Risky Agents (5 min)

1. `Entra admin center → Identity → Protection → Risky agents`.
2. Si la agent identity del Lab 06.2 no aparece en la lista, generar primero algo de actividad: invocar el agente 5-10 veces para que tenga histórico de sign-ins. La identidad puede aparecer en `Risk level: Low` aunque no haya detecciones.
3. Buscar la identidad del agente. Click sobre ella para abrir el detalle.
4. Botón **Confirm compromise** en la barra superior.
5. Diálogo de confirmación: introducir justificación `Lab 09.2 — verificación del cascade`.
6. Confirmar.
7. **Verificación inmediata**: el panel de detalle del agente muestra `Risk level: High` con etiqueta `Confirmed compromised by admin`.

#### Parte C — Validar el bloqueo en el siguiente sign-in (8 min)

1. Forzar un nuevo sign-in del agente (mismo método que Lab 09.1 Parte C).
2. Esperar 2-3 minutos.
3. `Sign-in logs → Workload identity sign-ins` → filtrar por la agent identity comprometida.
4. El sign-in más reciente debe mostrar:
   - **Status**: `Failure`.
   - **Failure reason**: `Access has been blocked by Conditional Access policies`.
   - **Conditional Access** tab: la policy `Block agent identities at high risk (lab)` con resultado `Failure: blocked by policy`.
5. Si el sign-in todavía aparece como `Success`, esperar 5 minutos más: la propagación entre Identity Protection y Conditional Access puede tardar.

#### Parte D — Revertir el estado (4 min)

> Limpieza obligatoria si el agente es uno que sigue en producción.

1. Volver a `Risky agents` → seleccionar la identidad → **Confirm safe**.
2. Justificación: `Lab 09.2 — false positive (test)`.
3. El risk del agente vuelve a `Low` y la policy deja de bloquearlo en sign-ins futuros.
4. **Opcional**: cambiar la policy `Block agent identities at high risk (lab)` de nuevo a `Report-only` o eliminarla con **Delete** si no se va a reutilizar.

### Output esperado

- La agent identity con `Risk level: High` durante la fase activa del lab (Parte B).
- Al menos un sign-in bloqueado en `Workload identity sign-ins` con `Failure reason: Access has been blocked by Conditional Access policies`.
- Captura del cascade: identidad en High → CA policy aplicada → sign-in bloqueado.
- Estado revertido tras la limpieza: `Risk level: Low`, policy en `Report-only` o eliminada.

### Errores frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| Botón *Confirm compromise* atenuado | Cuenta sin rol Identity Protection Administrator | Pedir a alguien con el rol que ejecute la acción |
| El risk no sube a `High` tras Confirm compromise | Cache de la consola; no del backend | Refrescar la página; el backend ya tiene `High` registrado |
| Sign-in posterior sigue en `Success` | Sesión del agente con token aún válido | El bloqueo aplica al siguiente token request, no a llamadas con tokens vivos. Esperar a que el token expire (típicamente 60 min) o forzar `client_credentials` nuevo |
| `Confirm safe` no devuelve la policy a inactiva | El cache de Conditional Access tarda 5-15 min | Esperar; el siguiente sign-in tras el cache será evaluado con `Risk: Low` |
| El agente queda inservible al final del lab | No se ejecutó la Parte D | Ejecutar `Confirm safe`. Si la identidad sigue High, abrir el detalle del agente y el botón sigue disponible |

### Limpieza tras el lab

```powershell
# Quitar la policy de prueba si no se va a reutilizar
$policy = Get-MgIdentityConditionalAccessPolicy -Filter "displayName eq 'Block agent identities at high risk (lab)'"
Remove-MgIdentityConditionalAccessPolicy -ConditionalAccessPolicyId $policy.Id

# Confirmar que el agente quedó en estado Low (si no, ejecutar Confirm safe desde la UI)
Get-MgRiskyServicePrincipal -Filter "id eq '<agentIdentityId>'"
```

---

## Errores frecuentes (consolidado)

| Error | Lab | Cómo evitarlo |
|---|---|---|
| Crear la policy directamente en `On` sin Report-only | 09.1 | Siempre arrancar en Report-only. Documentar fecha y review programada |
| Confirm compromise sobre un agente real sin investigar | 09.2 | Reservar Confirm compromise para evidencia razonable; usar Dismiss si la investigación está abierta |
| No revertir tras el lab y dejar la policy en `On` | 09.2 | Ejecutar la limpieza de la Parte D antes de cerrar |
| Buscar agentes en `User sign-ins` en lugar de `Workload identity sign-ins` | 09.1 y 09.2 | Las dos pestañas están separadas en Entra; agentes solo en la segunda |

---

## Validación

Si has completado los dos labs, dominas el ciclo completo de control de acceso para agentes: diseñar la policy con los cuatro componentes correctos, monitorizar en Report-only, escalar a enforcement, y reaccionar a un compromiso con `Confirm compromise` viendo el cascade hasta el bloqueo del siguiente sign-in. Estas son las dos operaciones que estructuran el día a día del admin de Conditional Access cuando hay agentes en producción.
