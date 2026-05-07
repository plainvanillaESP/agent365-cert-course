---
modulo: 6
tipo: evaluacion
titulo: "Evaluación del Módulo 06"
duracion_min: 30
area_examen: 2
estado: producido
fase_produccion: 4
ultima_actualizacion: 2026-05-06
preguntas_oficiales: 11
caso_estudio: true
---

# Módulo 06 — Evaluación

> **El módulo más denso del curso.** 11 preguntas oficiales del banco que el M06 aporta al examen final, repartidas entre los conceptos críticos del Área 2 (Identidades de agentes con Entra Agent ID, 30 % del examen). Lee la teoría completa antes de abordarlas.

## Preguntas oficiales del banco

### EX-06-001 · Multiple choice · Media

**OA mapeado:** OA-06.1 · **Área:** 2 · **Bloom:** Recordar

**Enunciado:**

¿Qué describe correctamente un **agent identity blueprint** en Microsoft Entra Agent ID?

A) Es la identidad concreta de un agente, la que autentica y hace llamadas a Microsoft Graph.
B) Es una plantilla que define permisos, restricciones y metadatos. No autentica nada por sí sola; produce instancias (`agent identities`) que sí autentican.
C) Es un tipo especial de service principal que se crea automáticamente al desplegar un agente Foundry.
D) Es el objeto User en Entra ID que un agente autonomous tiene asociado para tener mailbox y presencia en Teams.

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** B

**Justificación:** un blueprint es la plantilla, no la instancia. Define la estructura común (permisos heredables, restricciones, lifecycle metadata) que heredarán todas las agent identities derivadas. Por sí solo no autentica: la autenticación la realizan las identities. La A describe `agentIdentity`, la C describe el `agentIdentityBlueprintPrincipal`, la D describe `agentUser`. Ver § 6.1.

</details>

---

### EX-06-002 · Multiple choice · Media

**OA mapeado:** OA-06.1 · **Área:** 2 · **Bloom:** Analizar

**Enunciado:**

Una organización ha creado un único `agent identity blueprint` para su equipo de RRHH y, a partir de él, ha desplegado **5 agent identities** distintas (una por cada caso de uso). Una de esas 5 identidades, además, tiene un agent user asociado para poder recibir email. ¿Cuántos objetos de tipo «blueprint principal» y «agent user» existen en el directorio en este escenario?

A) 1 blueprint principal y 5 agent users.
B) 5 blueprint principals y 1 agent user.
C) 1 blueprint principal y 1 agent user.
D) 5 blueprint principals y 5 agent users.

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** C

**Justificación:** la relación es 1:1 entre blueprint y blueprint principal (cada blueprint tiene exactamente un service principal asociado, no uno por identidad). Y 0:1 entre agent identity y agent user (la mayoría no tiene; solo la que necesita identidad humana-like). Por tanto: 1 blueprint principal (uno por blueprint, no por identidad derivada) y 1 agent user (solo la identidad que lo necesita explícitamente). Ver § 6.1.

</details>

---

### EX-06-003 · Drag-and-drop · Media

**OA mapeado:** OA-06.1 · **Área:** 2 · **Bloom:** Analizar

**Enunciado:**

Empareja cada **capacidad** del directorio con el **tipo de objeto** al que pertenece.

| Capacidad | Tipo de objeto |
|---|---|
| Define los permisos heredables que serán comunes a todas las identidades derivadas | ? |
| Tiene un mailbox y presencia en Microsoft Teams | ? |
| Hace las llamadas reales a Microsoft Graph en runtime | ? |
| Recibe los admin consents otorgados a nivel tenant | ? |

Tipos de objeto disponibles:

- Agent identity blueprint
- Blueprint principal
- Agent identity
- Agent user

<details>
<summary>Ver respuesta</summary>

**Solución:**

| Capacidad | Tipo de objeto |
|---|---|
| Define los permisos heredables comunes | **Agent identity blueprint** |
| Tiene mailbox y presencia en Teams | **Agent user** |
| Hace las llamadas a Microsoft Graph en runtime | **Agent identity** |
| Recibe los admin consents a nivel tenant | **Blueprint principal** |

Ver § 6.1. La diferencia entre blueprint y blueprint principal es la fuente del error más común: el blueprint **define** los permisos, pero los consents se otorgan al **principal** (porque es la entidad que aparece en el flujo OAuth de admin consent).

</details>

---

### EX-06-004 · Scenario · Media

**OA mapeado:** OA-06.4 · **Área:** 2 · **Bloom:** Aplicar

**Enunciado:**

Una empresa de servicios financieros quiere desplegar un agente que **monitoriza un buzón compartido `compliance@bank.com` 24/7**, detecta correos sospechosos según reglas predefinidas y abre tickets en un sistema interno. El agente debe operar **sin un usuario humano detrás** y debe poder leer todos los correos del buzón sin importar quién esté logueado en ese momento. ¿Qué flujo de autenticación es el correcto?

A) **OBO**, porque OBO es el flujo estándar para todos los agentes en producción y no requiere capacidades preview.
B) **Own identity** vía Frontier preview, porque el agente necesita operar 24/7 sin usuario invocador y con sus propios permisos sobre el buzón.
C) **Híbrido**: OBO durante el horario laboral (cuando hay usuarios) y own identity fuera de él.
D) **OBO con cuenta de servicio**: crear un usuario `compliance-service@bank.com`, asignarle permisos sobre el buzón, y que el agente actúe en su nombre.

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** B

**Justificación:** monitorización 24/7 sin usuario presente exige que el agente opere con sus propios permisos. OBO es imposible: requiere un token de un usuario activo, y aquí no lo hay. Own identity es la respuesta correcta — el agente solicita un token vía `client_credentials` y opera con los permisos del blueprint. La limitación: en mayo de 2026 sigue en Frontier preview, así que la organización debe estar inscrita en el programa. La opción A confunde GA con OBO. La C es un antipatrón: complejidad innecesaria sin justificación. La D (cuenta de servicio) es el patrón legacy pre-Agent 365 que precisamente Agent ID viene a sustituir. Ver § 6.2.

</details>

---

### EX-06-005 · Multiple choice · Difícil

**OA mapeado:** OA-06.5 · **Área:** 2 · **Bloom:** Analizar

**Enunciado:**

Un IT admin ejecuta la siguiente llamada a Microsoft Graph:

```http
GET /beta/identityProtection/riskyAgents
?$filter=riskLevel eq 'high'
```

¿Qué información devuelve esta llamada?

A) La lista completa de agent identities del tenant, con su nivel de riesgo en una columna.
B) Solo los agent identities que Microsoft Identity Protection ha clasificado como riesgo `high` (calculado a partir de Defender + Identity Protection).
C) Las detecciones individuales de comportamiento sospechoso por parte de agentes en las últimas 24 horas.
D) Los blueprints con permisos excesivos según el análisis automático de DSPM for AI.

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** B

**Justificación:** `riskyAgents` devuelve **solo** los agentes con risk score elevado, filtrados por el `$filter` aplicado. La A es incorrecta: no devuelve la lista completa, solo los riesgosos. La C describe `agentRiskDetections` (detecciones individuales), un endpoint distinto. La D no existe: DSPM no expone este endpoint sobre blueprints. Ver § 6.8.

</details>

---

### EX-06-006 · Multiple choice · Difícil

**OA mapeado:** OA-06.2 · **Área:** 2 · **Bloom:** Aplicar

**Enunciado:**

Un IT admin intenta crear un blueprint con la CLI `a365 setup blueprint` y recibe el siguiente error:

```
BlueprintCreationFailed: tooManyScopes
Resource app: 00000003-0000-0000-c000-000000000000 (Microsoft Graph)
Scopes requested: 47 (limit: 40)
```

¿Cuál es la solución correcta?

A) Solicitar a Microsoft un aumento del límite de scopes vía cuenta-manager. El límite es ajustable.
B) Crear un blueprint adicional con los scopes que sobran y operar los agentes con ambos blueprints simultáneamente.
C) Reducir el número de scopes a 40 o menos en este blueprint, partiendo el caso de uso en dos blueprints distintos si es necesario.
D) Cambiar el resource app de Microsoft Graph a Microsoft Graph Beta, que no tiene este límite.

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** C

**Justificación:** el límite de 40 scopes por resource app es un límite **fijo** de Microsoft Entra Agent ID, no ajustable por cliente. La solución correcta es reducir el número de scopes: o bien agrupar scopes redundantes (varios de los 47 probablemente cubren funcionalidad similar), o bien partir el blueprint en dos según función. La A es falsa (el límite no se levanta). La B es problemática porque un agente solo puede heredar de un blueprint a la vez. La D es falsa (Microsoft Graph Beta no es un resource app distinto, es la misma app con endpoints en preview). Ver § 6.3.

</details>

---

### EX-06-007 · Scenario · Difícil

**OA mapeado:** OA-06.2 · **Área:** 2 · **Bloom:** Crear

**Enunciado:**

Una empresa de retail quiere desplegar 12 agentes Copilot Studio para distintos equipos de tienda (cada agente responde preguntas sobre stock, precios y promociones). Todos los agentes:

- Operan en modo **OBO** (los empleados de tienda los invocan).
- Necesitan los mismos permisos: leer datos de productos en SharePoint, leer información del usuario invocador, enviar mensajes a Teams.
- Deben tener trazabilidad: log verbose de cada token request.

¿Cuántos blueprints debería crear el IT admin y qué configuración clave debe tener?

A) **12 blueprints**, uno por agente, para tener identidad técnica separada por tienda.
B) **1 blueprint** común con `allowedAuthenticationFlows: ["onBehalfOf"]`, `auditLevel: "verbose"`, `maxAgentIdentities: 12+` y los scopes mínimos para SharePoint, User.Read.All y TeamsActivity.Send.
C) **2 blueprints**: uno con escritura (TeamsActivity.Send) y otro con solo lectura (SharePoint, User.Read.All), aplicado por separado a cada agente.
D) **1 blueprint** con `allowedAuthenticationFlows` que permita ambos modos (OBO y client_credentials) por si en el futuro se quiere migrar a autonomous.

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** B

**Justificación:** un blueprint produce N identities, así que 12 blueprints separados (opción A) duplican mantenimiento sin aportar valor; cada identity ya tendrá su audit trail individual. La B aplica el patrón correcto: un blueprint común con todas las restricciones bien definidas y `maxAgentIdentities: 12+` para cubrir las 12 instancias actuales y posibles nuevas. La C separa innecesariamente lectura y escritura cuando ambas son necesarias para todos los agentes; añade complejidad. La D abre la puerta a own identity «por si acaso», un antipatrón: si todos operan en OBO, restringir a `onBehalfOf` reduce la superficie de ataque y descarta sobreasignación. Ver § 6.3.

</details>

---

### EX-06-008 · Multiple choice · Media

**OA mapeado:** OA-06.2 · **Área:** 2 · **Bloom:** Recordar

**Enunciado:**

¿Cuál de las siguientes afirmaciones describe correctamente las **capacidades del blueprint**?

A) Un blueprint puede definir permisos heredables hasta un máximo de 10 resource apps × 40 scopes, restringir los flujos de autenticación permitidos, limitar el número máximo de identities derivadas y configurar custom security attributes que las identities heredarán.
B) Un blueprint hereda los permisos del rol Global Administrator del usuario que lo crea, y los traslada automáticamente a todas las agent identities derivadas.
C) Un blueprint puede modificarse en cualquier momento aunque tenga identities activas, y los cambios se aplican retroactivamente.
D) Un blueprint solo define metadatos; los permisos se asignan individualmente a cada agent identity tras crearla.

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** A

**Justificación:** la A enumera correctamente las cuatro capacidades centrales del blueprint: permisos heredables (con sus límites), restricciones de flujos, límite de identities y custom security attributes. La B es falsa: el blueprint NO hereda permisos del Global Administrator; los permisos los define explícitamente el blueprint y requieren admin consent específico. La C es falsa: una vez hay identities activas, las modificaciones del blueprint están restringidas (`BlueprintModificationDenied: blueprintInUse`); el patrón correcto es deprecar el viejo y crear uno nuevo. La D invierte el modelo: los permisos van en el blueprint precisamente para evitar tener que asignar manualmente a cada identity. Ver § 6.3.

</details>

---

### EX-06-009 · Multiple choice · Media

**OA mapeado:** OA-06.3 · **Área:** 2 · **Bloom:** Aplicar

**Enunciado:**

Una agent identity tiene configurado `sponsor.userPrincipalName = "luis@plaincoffee.com"` y `sponsor.transferOnLeaver = true`. **Luis se va de la organización** y RRHH le desactiva la cuenta. El lifecycle workflow correspondiente está activo y configurado correctamente. ¿Qué ocurre con la agent identity?

A) La agent identity se elimina automáticamente porque su sponsor ya no existe.
B) La agent identity se deshabilita y deja de poder autenticarse hasta que un admin la reactive manualmente.
C) El campo `sponsor` se transfiere al manager de Luis automáticamente, se notifica al manager, y la agent identity recibe un flag `requiresReview` para revisión en X días.
D) Nada: el campo `sponsor` mantiene el UPN de Luis aunque su cuenta esté deshabilitada.

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** C

**Justificación:** con `transferOnLeaver: true` y un lifecycle workflow activo, el flujo es: detectar el leaver event → transferir sponsorship al manager → notificar al manager → marcar `requiresReview` para que el nuevo sponsor decida si el agente sigue siendo necesario. La A es falsa: la identidad NO se elimina, solo cambia de sponsor. La B es falsa: la autenticación de la agent identity no depende de su sponsor (depende de su blueprint y sus credenciales). La D solo ocurriría si `transferOnLeaver: false` o si el workflow no está configurado, pero el enunciado dice explícitamente que ambos están en su sitio. Ver § 6.4.

</details>

---

### EX-06-010 · Multiple choice · Media

**OA mapeado:** OA-06.3 · **Área:** 2 · **Bloom:** Recordar

**Enunciado:**

¿Qué evento del **sponsor** dispara el lifecycle workflow tipo `onLeaver`?

A) Un cambio en el campo `jobTitle` del sponsor.
B) Un cambio en el campo `manager` del sponsor.
C) `accountEnabled = false` en la cuenta del sponsor o eliminación de la cuenta.
D) La invocación del agente desde una IP no habitual.

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** C

**Justificación:** el trigger `onLeaver` de Lifecycle Workflows se dispara cuando un usuario es **leaver** en sentido HR: cuenta deshabilitada (`accountEnabled = false`) o eliminada del directorio. La A y la B describen el trigger `onMover` (cambios de rol o de manager), no `onLeaver`. La D no es un trigger de Lifecycle Workflows; eso lo gestiona Conditional Access o Identity Protection. Ver § 6.4.

</details>

---

### EX-06-011 · Multiple choice · Difícil

**OA mapeado:** OA-06.5 · **Área:** 2 · **Bloom:** Recordar

**Enunciado:**

Tu equipo tiene scripts de PowerShell con la siguiente llamada Graph que viene de una versión anterior:

```http
GET /beta/agentRegistry/agents
```

A día de hoy (mayo de 2026), ¿qué deberías hacer para asegurar que estos scripts siguen funcionando dentro de **3 meses**?

A) Nada. El endpoint legacy seguirá funcionando indefinidamente porque está en `/beta/`.
B) Migrar los scripts a `GET /beta/copilot/admin/agents` antes del 1 de agosto de 2026, fecha en que el endpoint legacy devolverá `410 Gone`.
C) Migrar a `GET /v1.0/agentRegistry/agents`, la versión estable del mismo endpoint.
D) Sustituir las llamadas Graph por consultas KQL contra la tabla `CloudAppEvents` de Defender XDR.

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** B

**Justificación:** la convergencia M365 ↔ Entra del 1 de mayo de 2026 movió la gestión de agentes de Entra a M365 admin center y migró los endpoints de `/beta/agentRegistry/...` a `/beta/copilot/admin/...`. Microsoft mantiene retrocompatibilidad durante **90 días** (hasta el 1 de agosto). A partir de esa fecha, los endpoints legacy devuelven `410 Gone`. La A es peligrosa: el legacy va a desaparecer. La C es falsa: el endpoint nunca llegó a `/v1.0/`. La D mezcla cosas: KQL en Defender es para auditar eventos, no sustituye una consulta del Registry. Ver § 6.7.

</details>

---

## Caso de estudio (refuerzo)

> El caso de estudio no se evalúa pero refuerza la comprensión integral del módulo. Recomendado tras leer la teoría y antes de pasar al Módulo 07.

### Contexto

**Plain Coffee SL** ya tiene Agent 365 activo (M02-M05 completos). Ahora el equipo IT debe diseñar la arquitectura de identidades para tres familias de agentes que la organización quiere desplegar:

- **Familia A — RRHH FAQ**: 3 agentes Copilot Studio (uno por subárea: nóminas, formación, organigrama). Operan en modo OBO. Volumen estimado: 200 invocaciones/día por agente.
- **Familia B — Análisis financiero**: 2 agentes Foundry hosted con GPT-4o que generan reportes mensuales. Operan en modo own identity (parte del programa Frontier preview ya activado en M05).
- **Familia C — Asistente operaciones tienda**: 12 agentes Copilot Studio con configuración idéntica, uno por región geográfica. Operan en modo OBO. Cada uno se invoca desde el Teams de los responsables de tienda.

Equipo IT involucrado: Luis Ortega (sponsor de Familia A), Pablo García (Data Engineer, sponsor de Familia B y desarrollador), Marta Núñez (sponsor de Familia C).

### Preguntas guiadas

1. **Cuántos blueprints diseñar.** ¿Cuántos blueprints en total recomiendas para cubrir las tres familias? Justifica con criterios de mantenimiento, audit y separation of duties.

2. **Configuración de cada blueprint.** Para la Familia C (12 agentes idénticos), redacta la configuración clave del blueprint: `allowedAuthenticationFlows`, `maxAgentIdentities`, ejemplo de `inheritablePermissions`, `customSecurityAttributes` recomendados.

3. **Sponsorship en la práctica.** Para cada familia, identifica al sponsor inicial y configura `transferOnLeaver` y `transferOnMover`. ¿Qué pasa si Luis Ortega cambia de equipo y deja de ser admin de M365?

4. **Roles necesarios para crear y operar.** ¿Qué roles administrativos necesita Pablo García para crear y mantener los agentes Foundry de Familia B? ¿Y qué rol mínimo necesitaría un nuevo desarrollador junior que solo crea sus propios agentes?

5. **Convergencia mayo 2026.** Plain Coffee tenía un script PowerShell del año pasado que listaba agentes con `GET /beta/agentRegistry/agents`. ¿Qué hace el equipo con ese script ahora? ¿Y qué evidencia documenta para la auditoría interna?

### Solución comentada

<details>
<summary>Ver solución completa</summary>

**Pregunta 1 — Cuántos blueprints**

**Tres blueprints, uno por familia.** No 17 (uno por agente). No uno único compartido entre las tres.

| Blueprint | Familia | Justificación |
|---|---|---|
| `bp-rrhh-faq` | A | Permisos específicos para SharePoint (carpetas RRHH), User.Read.All, TeamsActivity.Send. |
| `bp-foundry-finanzas` | B | Permisos específicos para datos financieros (SharePoint Finance, Dynamics si aplica). `allowedAuthenticationFlows: ["clientCredentials"]` para autonomous. |
| `bp-tienda-ops` | C | Permisos para datos de productos en SharePoint, User.Read, TeamsActivity.Send. `maxAgentIdentities: 15` para cubrir las 12 actuales y crecimiento. |

Por qué tres y no uno único: los permisos heredables son distintos (Familia A no necesita acceso a datos financieros; Familia B sí). Mezclar todos en un blueprint único sobreasigna permisos a las identidades de Familia A y C. Por qué no 17: blueprints distintos para identities con permisos idénticos solo añade mantenimiento. La unidad de blueprint es la **familia funcional**, no la instancia.

**Pregunta 2 — Configuración de Familia C**

```json
{
  "id": "bp-tienda-ops",
  "displayName": "Asistente operaciones tienda — agentes regionales",
  "description": "Agentes OBO para responsables de tienda con permisos sobre datos de productos",
  "inheritablePermissions": [
    {
      "resourceAppId": "00000003-0000-0000-c000-000000000000",
      "resourceAppName": "Microsoft Graph",
      "scopes": ["User.Read", "TeamsActivity.Send"]
    },
    {
      "resourceAppId": "00000003-0000-0ff1-ce00-000000000000",
      "resourceAppName": "SharePoint Online",
      "scopes": ["Sites.Selected"]
    }
  ],
  "restrictions": {
    "allowedAuthenticationFlows": ["onBehalfOf"],
    "maxAgentIdentities": 15,
    "tenantOnly": true
  },
  "lifecycle": {
    "expirationPolicy": "365days",
    "auditLevel": "verbose"
  },
  "customSecurityAttributes": [
    { "key": "Department", "value": "Retail" },
    { "key": "DataSensitivity", "value": "Internal" }
  ]
}
```

Notas:
- `Sites.Selected` permite restringir aún más a los sites concretos de productos (no acceso a todos los sites).
- `allowedAuthenticationFlows: ["onBehalfOf"]` cierra la puerta a own identity: si en el futuro alguien quisiera convertir uno de estos agentes a autonomous «por error», fallaría.
- `auditLevel: verbose` justificado por el volumen y la criticidad para retail.
- `customSecurityAttributes.Region` se aplicaría a nivel agent identity individual (`Region: "Iberia"`, `Region: "Italia"`, etc.) para segmentar policies CA por región.

**Pregunta 3 — Sponsorship**

| Familia | Sponsor inicial | `transferOnLeaver` | `transferOnMover` | Notas |
|---|---|---|---|---|
| A | Luis Ortega | `true` | `false` | Si Luis se va, transferir al manager (Eva Martín). Si Luis cambia de rol pero sigue en la organización (jobTitle change), el sponsorship se mantiene. |
| B | Pablo García | `true` | `true` | Pablo es Data Engineer; si se mueve a otro equipo, los agentes Foundry deberían reasignarse al nuevo manager para mantener la cadena de responsabilidad. |
| C | Marta Núñez | `true` | `false` | Igual que Luis: si Marta se va, transferir al manager. Si solo cambia de rol, mantener. |

**Si Luis Ortega cambia de equipo:** sin `transferOnMover` activo, el sponsorship sigue siendo Luis, y él lo gestionará desde su nuevo equipo. Esto es lo correcto cuando «mover de rol» en la misma organización no implica perder el contexto del agente. Si Luis pasa de Admin M365 a CIO, sigue siendo capaz de actuar como sponsor de Familia A. Si pasa a una unidad de negocio sin relación con RRHH, el equipo decide si reasignar manualmente.

**Pregunta 4 — Roles necesarios**

**Pablo García (crear y mantener agentes Foundry de Familia B):**
- **Agent ID Administrator**: para crear el blueprint y las agent identities derivadas.
- **AI Administrator**: para aprobar los agentes en el Registry.
- (Opcionalmente) **Cloud Application Administrator**: si necesita configurar service principals adicionales para Foundry.

**Desarrollador junior nuevo que solo crea sus propios agentes:**
- **Agent ID Developer**: rol específico que permite crear/modificar **solo sus propios** agentes, sin acceso a los de otros. Es el rol mínimo correcto. El antipatrón sería darle Agent ID Administrator: ahí podría modificar agentes de otros equipos.

**Pregunta 5 — Convergencia mayo 2026**

**Acción inmediata sobre el script:**

1. Localizar el script (`Select-String -Pattern "agentRegistry" -Path *.ps1`).
2. Cambiar el endpoint a `GET /beta/copilot/admin/agents`.
3. Probar el script en un entorno de test antes del 1 de agosto.
4. Documentar el cambio en el repositorio de scripts del equipo IT.

**Evidencia para auditoría interna:**

- Commit del repositorio donde se hace la migración, con mensaje explicando la convergencia M365↔Entra y la fecha de deprecación.
- Captura del audit log mostrando que el script funciona contra el nuevo endpoint.
- Documento de procedimiento actualizado que referencia el endpoint nuevo.
- Lista de scripts y herramientas internas verificados como migrados (con check por cada uno).

Esto es importante porque la próxima auditoría externa va a buscar evidencia de que la organización está al día con los cambios anunciados de Microsoft. Tener el commit y la documentación cierra el punto de auditoría sin discusión.

</details>

---

## Validación de aprendizaje

Antes de pasar al M07, el alumno debe poder responder sin notas:

- **¿Cuántos tipos de objetos introduce Entra Agent ID y cuál es la relación entre ellos?** Cuatro: blueprint (1), blueprint principal (1 por blueprint), agent identity (N por blueprint), agent user (0 o 1 por identity).
- **¿Cuál es la diferencia operativa entre OBO y own identity?** OBO usa el token del usuario invocador (permisos heredados); own identity usa un token propio del agente (permisos definidos en el blueprint, hoy solo Frontier preview).
- **¿Qué pasa si el sponsor de un agente se va de la organización?** Con `transferOnLeaver: true` y lifecycle workflow activo, el sponsorship se transfiere automáticamente al manager y el agente recibe un flag `requiresReview`.
- **¿Qué endpoint usar para listar agentes a partir del 1 de mayo de 2026?** `GET /beta/copilot/admin/agents` (no `/beta/agentRegistry/agents`, que será `410 Gone` desde el 1 de agosto).
