---
modulo: 8
tipo: evaluacion
titulo: "Evaluación del Módulo 08"
duracion_min: 18
area_examen: 3
estado: producido
fase_produccion: 4
ultima_actualizacion: 2026-05-06
preguntas_oficiales: 5
caso_estudio: true
---

# Módulo 08 — Evaluación

> 5 preguntas oficiales del banco que el M08 aporta al examen final, más un caso de estudio extenso de Plain Coffee SL.

## Preguntas oficiales del banco

### EX-08-001 · Drag-and-drop · Media

**OA mapeado:** OA-08.6 · **Área:** 3 · **Bloom:** Aplicar

**Enunciado:**

Ordena las siguientes acciones del **ciclo de vida de un agente** desde la idea hasta la retirada definitiva. La posición 1 es la primera acción que se ejecuta; la posición 6 es la última.

**Acciones a ordenar:**

1. **Delete** (eliminación irreversible).
2. **Activate** (aprobar y dejar activo en el catálogo).
3. **Publish** (enviar a publish desde la plataforma de creación).
4. **Deploy** (distribuir a los usuarios destinatarios).
5. **Pin** (fijar al slot Administrator para visibilidad alta).
6. **Remove** (retirar del despliegue antes del Delete final).

<details>
<summary>Ver respuesta</summary>

**Secuencia correcta:**

| Posición | Acción |
|---|---|
| 1 | Publish |
| 2 | Activate |
| 3 | Deploy |
| 4 | Pin |
| 5 | Remove |
| 6 | Delete |

**Justificación:** el ciclo es: el developer hace **Publish** desde Copilot Studio o Foundry → el admin hace **Activate** tras revisar → si va a llegar a usuarios, hace **Deploy** → para visibilidad alta, **Pin** al slot Administrator → cuando se va a retirar, primero **Remove** (preserva todo, reversible) → finalmente **Delete** (irreversible). Saltarse el Remove e ir directo a Delete es legal pero un antipatrón: mejor hacer Remove, esperar 1-2 semanas para confirmar que nadie lo echa de menos y solo entonces Delete. Ver § 8.7.

</details>

---

### EX-08-002 · Multiple choice · Media

**OA mapeado:** OA-08.4 · **Área:** 3 · **Bloom:** Recordar

**Enunciado:**

Tu equipo te pregunta si pueden recuperar un agente que **acabas de eliminar (Delete) hace 2 horas**. ¿Qué les respondes?

A) No, Delete es irreversible inmediatamente; el agente ya no existe en el directorio.
B) Sí, durante las primeras 24 horas un Global Administrator puede ejecutar `Restore-Agent365Agent -Id <agent-id>` para cancelar la eliminación. Pasadas las 24 h y el SharePoint Embedded container se borrará y la operación devolverá `404 Not Found`.
C) Sí, pero solo si el agente tenía `requireReview: true`; en ese caso se puede restaurar en cualquier momento dentro del período de review.
D) Sí, los agentes Delete pasan a una papelera de Entra que los conserva 30 días, igual que los usuarios deshabilitados.

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** B

**Justificación:** Delete tiene una ventana de 24 horas durante la cual un Global Administrator puede ejecutar `Restore-Agent365Agent` para cancelar la eliminación. Tras las 24h, el SharePoint Embedded container se marca para borrarse físicamente y la restauración devuelve `404 Not Found`. La A es falsa: durante las 24 h sí hay rescate. La C confunde flags de M06 (sponsorship) con la ventana de Delete. La D es falsa: no existe «papelera» equivalente para agentes; los 30 días de usuarios eliminados es de Entra, no de Agent 365. Ver § 8.5.

</details>

---

### EX-08-003 · Multiple choice · Media

**OA mapeado:** OA-08.5 · **Área:** 3 · **Bloom:** Recordar

**Enunciado:**

La acción **Reassign Ownership** desde el M365 admin center está disponible para…

A) Cualquier agente del Registry independientemente de su plataforma origen.
B) Solo agentes creados con **Agent Builder**. Para Copilot Studio se reasigna desde Power Platform admin center y para Foundry desde Azure portal.
C) Solo agentes con `transferOnLeaver: true` en su sponsor configuration.
D) Solo agentes que están en estado `Pending approval`; una vez activos, la propiedad es inmutable.

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** B

**Justificación:** una de las limitaciones más confundidas del módulo. Reassign Ownership desde M365 admin center solo aplica a agentes Agent Builder. Los agentes Copilot Studio se reasignan desde Power Platform admin center → Environments → Apps. Los Foundry desde Azure portal → AI Foundry resource → Access control (IAM). La A es falsa por esa limitación. La C confunde sponsor (M06) con ownership técnico. La D es falsa: la propiedad no es inmutable; el problema es solo *dónde* se reasigna. Ver § 8.6.

</details>

---

### EX-08-004 · Scenario · Difícil

**OA mapeado:** OA-08.2 · **Área:** 3 · **Bloom:** Aplicar

**Enunciado:**

El equipo de Compliance te pide aplicar las siguientes restricciones a **todos los agentes nuevos** del departamento Finanzas:

- Sharing externo: **Bloqueado completamente**.
- Cross-site SharePoint: **Bloqueado**.
- Sensitivity label heredada: mínimo **Confidential**.
- DLP: **Block on Confidential content**.
- Conditional Access: **MFA + dispositivo compliant**.
- Logging: **Verbose**.

¿Cuál es la mejor forma de implementarlo?

A) Aplicar manualmente cada política a cada agente nuevo durante el wizard de publishing, en el paso 6 «Permissions review».
B) Crear una **Custom Template** llamada `HighlySensitiveDataTemplate` con esas 6 políticas y aplicarla en el paso 5 «Apply Template» del wizard a cada agente nuevo de Finanzas.
C) Modificar la **Default Template** del tenant para incluir esas políticas; afectará a todos los agentes nuevos del tenant entero.
D) Crear una Conditional Access policy específica para Finanzas; las otras políticas no son configurables centralmente.

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** B

**Justificación:** el patrón correcto para un conjunto de restricciones específicas que aplican a una categoría de agentes (Finanzas) es **crear una Custom Template** una vez y aplicarla en el paso 5 del wizard cada vez que se publica un agente de Finanzas. La A funciona pero es manual y propenso a errores: si tienes 30 agentes de Finanzas, son 30 × 6 = 180 configuraciones manuales. La C aplicaría las restricciones a TODOS los agentes del tenant (incluidos los que no son de Finanzas), sobrerestringiendo. La D solo cubre Conditional Access; las otras 5 políticas (sharing, DLP, sensitivity, logging) no son cubiertas por CA. Ver § 8.3.

</details>

---

### EX-08-005 · Multiple choice · Media

**OA mapeado:** OA-08.3 · **Área:** 3 · **Bloom:** Recordar

**Enunciado:**

¿Cuál de las siguientes afirmaciones describe correctamente el **comportamiento de Pin** en Microsoft Agent 365?

A) Pin requiere que el agente esté en estado `Pending approval`; una vez activo, no se puede pinear.
B) Pin tiene 3 slots (Microsoft, Administrator, User) y la propagación a la UI cliente puede tardar **hasta 6 horas**. Solo se puede pinear un agente al slot Administrator a la vez; pinear otro despinea automáticamente al anterior.
C) Pin es irreversible: una vez pineado, la única forma de quitarlo es mediante Delete del agente.
D) Pin se puede aplicar a cualquier agente del Registry, esté deployed o no.

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** B

**Justificación:** los tres elementos de la B son correctos: (1) hay 3 slots Pin (Microsoft, Administrator, User), (2) la propagación cliente tarda hasta 6 h por caching de Teams/Outlook, y (3) solo un agente puede ocupar el slot Administrator a la vez. La A invierte: Pin requiere agente activo y deployed, no Pending approval. La C es falsa: Pin es reversible vía Unpin. La D es falsa: Pin solo aplica a agentes deployed; el botón Pin está atenuado para agentes no deployed. Ver § 8.4.

</details>

---

## Caso de estudio (refuerzo)

> El caso refuerza la comprensión integral del módulo aplicando todas las acciones a un escenario realista. Recomendado tras leer la teoría y antes de pasar al M09.

### Contexto

**Plain Coffee SL** ha completado la fase piloto del agente `Tienda-Ops-Iberia` (Copilot Studio) que asiste a los responsables de tienda en consultas sobre stock y precios. Tras 6 semanas de pilot, el sponsor (Marta Núñez) decide:

- **Hacer rollout** a las 200 tiendas de Iberia.
- **Pinear** el agente al slot Administrator para visibilidad alta.
- **Aplicar restricciones de compliance**: sharing externo bloqueado, sensitivity label `Internal`, logging verbose.
- **Crear blueprint paralelo** para `Tienda-Ops-Italia` (mismas funciones, otro idioma).

A los 4 meses, surgen problemas:
- El agente `Tienda-Ops-Italia` deja de usarse porque las tiendas italianas se externalizan a un partner (no es tema de IT).
- Pablo García, owner técnico de un agente Foundry de finanzas, deja la organización. Se descubre que era owner único de **5 agentes** sin sponsor configurado.

### Preguntas guiadas

1. **Rollout de Tienda-Ops-Iberia.** Lista los pasos exactos que ejecutas para el rollout completo, en orden. ¿Qué Custom Template usas? ¿Qué pasos opcionales puedes saltarte?

2. **Retirement de Tienda-Ops-Italia.** Diseña el ciclo de retirement de 4 semanas para evitar sorpresas a los usuarios actuales. ¿En qué semana haces qué acción?

3. **Crisis Pablo García.** Pablo deja la organización el viernes a las 17:00. RRHH desactivará su cuenta el lunes a las 9:00. Tienes el fin de semana para actuar sobre los 5 agentes de Pablo. ¿Qué haces?

4. **Plantillas a tener.** Tras esta experiencia, decides formalizar 3-5 Custom Templates para la organización. ¿Cuáles propondrías para Plain Coffee SL?

5. **Política tenant.** Propón una política tenant (de máximo 5 puntos) que evite que vuelva a ocurrir el caso Pablo García en el futuro.

### Solución comentada

<details>
<summary>Ver solución completa</summary>

**Pregunta 1 — Rollout de Tienda-Ops-Iberia**

Asumiendo que el agente ya está en estado `Active deployed` para el grupo piloto de 10 usuarios:

1. **Crear / actualizar Custom Template `RetailOpsTemplate`** con: sharing externo blocked, sensitivity Internal, logging verbose, CA tenant-wide policies.
2. **Re-Deploy** a `Iberia-Store-Managers` (Security Group con los 200 responsables de tienda) con preinstall = true.
3. **Apply Template** la `RetailOpsTemplate` en el wizard.
4. **Pin** al slot Administrator para visibilidad alta.
5. **Notificar** al grupo via comunicación interna corporativa con instrucciones de uso.
6. **Monitoring**: durante las primeras 2 semanas tras rollout, revisar diariamente las hero metrics y Risks column del agente.

Pasos opcionales saltados: paso 4 «Preinstall» del wizard NO se salta (queremos preinstall). Paso 6 «Permissions review» tampoco (es necesario validar que los scopes siguen siendo los del piloto).

**Pregunta 2 — Retirement de Tienda-Ops-Italia**

Ciclo de 4 semanas:

| Semana | Acción | Razón |
|---|---|---|
| -4 | Anuncio interno a los responsables de tienda Italia | Avisar con tiempo |
| -3 | **Unpin** del slot Administrator | Reducir visibilidad |
| -2 | **Block** | Los usuarios actuales pueden seguir invocando, los nuevos no pueden iniciar |
| -1 | **Remove** del despliegue | Los usuarios pierden acceso |
| 0 (día -1) | **Export del SharePoint Embedded container** | Preservar archivos relevantes |
| 0 | **Delete** | Eliminación definitiva |

**Pregunta 3 — Crisis Pablo García**

Acciones del fin de semana antes del lunes 9:00:

1. **Listar los 5 agentes de Pablo** vía PowerShell:
   ```powershell
   Get-Agent365Agents -OwnerUpn pablo.garcia@plaincoffee.onmicrosoft.com
   ```
2. **Para cada agente, decidir destino**: ¿se mantiene? ¿se retira?
3. **Si se mantiene**: 
   - Si es **Agent Builder**: usar Reassign Ownership desde M365 admin center → asignar al manager de Pablo (Eva Martín).
   - Si es **Foundry**: ir a Azure portal → AI Foundry resource → IAM → asignar Owner a Eva.
   - Si es **Copilot Studio**: ir a Power Platform admin center → Environments → seleccionar environment → Apps → reasignar.
4. **Si se retira**: aplicar el ciclo de retirement de la pregunta 2 (versión acelerada por la urgencia).
5. **Confirmar el lunes con Eva** que ha recibido los emails de notificación y entiende su nuevo rol como owner.

**Crítico**: hacer todo esto ANTES del hard-delete de la cuenta de Pablo. Si RRHH ya borra la cuenta el lunes a las 9:00 sin que se haya reasignado, los 5 agentes pasarán a estado `ownerless` y la reasignación se complicará (especialmente para los Copilot Studio y Foundry que tienen procesos distintos de reasignación).

**Pregunta 4 — Plantillas a tener**

Para Plain Coffee SL, 4 Custom Templates cubren los casos:

1. **`StandardInternalTemplate`** — agentes internos sin requisitos especiales (la mayoría: RRHH FAQ, Onboarding, etc.).
2. **`HighlySensitiveDataTemplate`** — agentes que acceden a datos confidenciales (Finanzas, Legal, RRHH datos personales).
3. **`RetailOpsTemplate`** — agentes operativos de tienda (sensitivity Internal, logging verbose, sharing blocked).
4. **`PartnerFacingTemplate`** — para agentes que interactúan con partners externos (sharing allowed within partner orgs, audit reforzado).

Una quinta `PublicFacingTemplate` solo si Plain Coffee tiene agentes orientados a clientes finales (ej: en su web pública).

**Pregunta 5 — Política tenant para evitar el caso Pablo García**

Política «Owner integrity policy» de Plain Coffee SL:

1. **Sponsor obligatorio** en todos los agentes. Sin sponsor, el publish fallará.
2. **`transferOnLeaver: true` por default** en todos los agentes nuevos.
3. **Lifecycle workflow activo** que reasigne sponsorship al manager en caso de leaver event.
4. **Bloqueo de hard-delete de usuarios con agentes activos**: antes de borrar a un usuario en Entra, IT debe haber documentado que los agentes han sido reasignados.
5. **Auditoría trimestral** de agentes ownerless: si hay alguno, se reasignan o eliminan en el siguiente ciclo trimestral.

Estos 5 puntos formalizan lo que la teoría del M06+M08 explica de forma técnica.

</details>

---

## Validación de aprendizaje

Antes de pasar al M09, el alumno debe poder responder sin notas:

- **¿Cuántos bloques de acciones hay y cuáles son?** Cuatro: Aprobación (Publish, Activate, Approve Update), Distribución (Deploy, Pin, Block, Unblock), Retirada (Remove, Delete), Governance avanzado (Manage Ownerless, Reassign).
- **¿Cuál es la única acción irreversible?** Delete, tras 24 h de propagación.
- **¿Para qué tipo de agente es Reassign Ownership desde M365 admin center?** Solo Agent Builder.
- **¿Cuándo aplicar Custom Template?** Siempre que haya 3+ agentes que compartan un conjunto específico de restricciones.
