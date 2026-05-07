---
modulo: 7
tipo: evaluacion
titulo: "Evaluación del Módulo 07"
duracion_min: 15
area_examen: 3
estado: producido
fase_produccion: 4
ultima_actualizacion: 2026-05-06
preguntas_oficiales: 4
caso_estudio: true
---

# Módulo 07 — Evaluación

> 4 preguntas oficiales del banco que el M07 aporta al examen final, más un caso de estudio operativo de Plain Coffee SL.

## Preguntas oficiales del banco

### EX-07-001 · Multiple choice · Fácil

**OA mapeado:** OA-07.3 · **Área:** 3 · **Bloom:** Recordar

**Enunciado:**

¿En qué pantalla del Microsoft 365 admin center aparece destacada la lista de **agentes sin owner asignado** (ownerless agents)?

A) `Agents → Registry`, en la columna Risks.
B) `Agents → Map`, como nodos sin etiqueta.
C) `Agents → Overview`, en la sección **Top actions for you** dentro de la categoría «Ownerless agents».
D) `Agents → Settings`, como advertencias de configuración.

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** C

**Justificación:** la página Overview agrupa cuatro categorías de Top actions for you: Pending requests, Agents at risk, **Ownerless agents** y With exceptions. Es el centro de mando diario del IT admin. La A confunde Ownerless con Risks (son métricas distintas). La B es falsa: el Map muestra agentes pero no destaca específicamente los ownerless. La D es falsa: Settings es para configuración del workload, no para alertas operativas. Ver § 7.3.

</details>

---

### EX-07-002 · Scenario · Media

**OA mapeado:** OA-07.1 · **Área:** 3 · **Bloom:** Aplicar

**Enunciado:**

El CISO te pregunta: «¿Cuántos agentes de **Third Party** activos tenemos en producción que estén usando **Copilot Studio** y, además, tengan algún **risk score Medium o superior**?». ¿Qué combinación de filtros aplicas en el Registry para responder?

A) Filtrar por **Publisher = Microsoft** + **Platform = Copilot Studio** + **Risk = Medium, High, Critical**.
B) Filtrar por **Publisher = Third Party** + **Platform = Copilot Studio** + **Status = Active** + **Risk = Medium, High, Critical**.
C) Filtrar solo por **Risk = High, Critical** y descartar los que no sean de Third Party manualmente.
D) No es posible: los filtros del Registry son mutuamente excluyentes y no se pueden combinar.

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** B

**Justificación:** los filtros del Registry son acumulativos (AND entre filtros distintos, OR dentro del mismo filtro). La respuesta a la pregunta requiere combinar cuatro filtros: Publisher = Third Party (no Microsoft), Platform = Copilot Studio, Status = Active (en producción), y Risk con tres valores marcados (Medium, High, Critical). La A confunde Microsoft con Third Party. La C ignora los filtros (extra trabajo manual innecesario). La D es falsa: los filtros se combinan. Ver § 7.1.

</details>

---

### EX-07-003 · Multiple choice · Media

**OA mapeado:** OA-07.3 · **Área:** 3 · **Bloom:** Recordar

**Enunciado:**

¿Cuáles son los **requisitos** para que aparezca poblada la **Risks column** en el Registry y en la vista de detalle de cada agente?

A) Cualquier licencia M365 E3 o superior basta para que la Risks column aparezca poblada.
B) Licencia E7 (o equivalente con módulo de Risk) **+** conector Microsoft 365 configurado en Defender XDR **+** DSPM for AI activo en Microsoft Purview.
C) Licencia Agent 365 standalone con DSPM activo; Defender no es necesario.
D) Solo se necesita Identity Protection P2 en Microsoft Entra ID.

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** B

**Justificación:** la Risks column requiere E7 (o equivalente) **y** que la cadena de conectores funcione: Defender XDR conectado a M365 (sin él no llega telemetría de seguridad) y DSPM for AI activo en Purview (aporta señales adicionales sobre acceso a datos sensibles). Sin uno de los tres, la columna aparece vacía o incompleta. La A es falsa: E3/E5 sin E7 no incluye Risks. La C es falsa: Defender es necesario, no opcional. La D es falsa: Identity Protection contribuye al score pero no es el único requisito. Ver § 7.6 + M05 §§ 5.3-5.4.

</details>

---

### EX-07-004 · Scenario · Media

**OA mapeado:** OA-07.5 · **Área:** 3 · **Bloom:** Analizar

**Enunciado:**

Abres el Agent Map de tu tenant y observas que el agente **`Foundry-Finanzas-HUB`** tiene **6 conexiones entrantes** desde otros agentes (Reportes, Análisis, Forecast, Audit, Compliance y Risk). El resto de agentes del cluster Foundry tienen **0 conexiones entrantes**. ¿Qué te dice esta información sobre la arquitectura?

A) Hay un problema: los 6 agentes con 0 conexiones entrantes están huérfanos y deberían eliminarse.
B) `Foundry-Finanzas-HUB` es un **agente hub** del que dependen 6 workflows. Es un **punto crítico de fallo**: si se rompe, los 6 dependientes dejarán de funcionar.
C) Hay un ciclo en el grafo: el grafo es inválido y necesita refactor inmediato.
D) Los 6 agentes con 0 entrantes son los que reciben más uso; el HUB es solo telemetría.

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** B

**Justificación:** la dirección de las flechas en el Agent Map representa **invocación**: A → B significa que A invoca a B. Si HUB tiene 6 conexiones entrantes, hay 6 agentes que lo invocan en algún punto de su lógica. Esto lo convierte en un agente hub: punto único de paso por el que circulan varios workflows. Si HUB falla, los 6 dependientes fallan. La A confunde dirección de la flecha con orfandad. La C es falsa: 6 entrantes a 1 nodo NO es un ciclo (un ciclo sería A → B → A). La D invierte el significado de la flecha. Ver § 7.2.

</details>

---

## Caso de estudio (refuerzo)

> El caso no se evalúa pero refuerza la operación cotidiana del Registry y Map. Recomendado tras leer la teoría y antes de pasar al M08.

### Contexto

Es lunes por la mañana. Eres el IT admin de **Plain Coffee SL**. Abres el Microsoft 365 admin center → Agents → Overview y ves esto:

**Hero metrics:**
- Agent Registry total: **247 agentes** (▲ +14 últimos 30 días).
- Active users (30d): **1.842** (▲ +12 % mes a mes).
- Agent run-time: **8.300 horas** (▲ +9 % mom).
- Registry sync: ✓ healthy (M365 + AWS Bedrock conectados).

**Top actions for you:**
- **7** pending requests.
- **3** agents at risk (High o Critical).
- **5** ownerless agents.
- **12** with exceptions.

### Preguntas guiadas

1. **Priorización del lunes.** Tienes 90 minutos antes de tu primera reunión. ¿En qué orden atacarías las 4 categorías de Top actions y por qué?

2. **Análisis de pending requests.** Profundizas en pending requests y ves que **6 de los 7** son agentes Third Party del catálogo público que distintos empleados han descargado en los últimos 3 días. El 7º es un agente Foundry creado por tu equipo de Data Engineering. ¿Cómo procedes?

3. **Investigación de agents at risk.** De los 3 agentes en riesgo:
   - `Foundry-Finanzas-01` (High): permisos excesivos detectados por DSPM.
   - `RRHH-Onboarding` (High): sign-in desde IP no habitual hace 4 horas.
   - `Tienda-LATAM-Bogotá` (Critical): volumen de invocaciones 50 veces mayor que la media histórica.
   ¿Cuál atacas primero, cómo lo investigas, y qué decisión tomas?

4. **Limpieza de ownerless.** Filtras los 5 ownerless: 3 son agentes que tenía **Pedro Sánchez** (un empleado que se fue hace 4 meses sin que su sponsor estuviera bien configurado). 2 son agentes creados vía API hace 18 meses sin owner inicial. ¿Cómo los gestionas?

5. **Exportación para reporting.** Tu jefe te pide un informe trimestral con la distribución de agentes por plataforma, owner y risk level. ¿Qué proceso sigues desde el Registry?

### Solución comentada

<details>
<summary>Ver solución completa</summary>

**Pregunta 1 — Priorización**

Orden recomendado en 90 minutos:

1. **Agents at risk (3 agentes, ~30 min)** — máxima prioridad. Riesgo activo de seguridad.
2. **Pending requests (7 agentes, ~25 min)** — segunda prioridad. Los empleados que esperan aprobación están bloqueados.
3. **Ownerless agents (5, ~15 min)** — tercera. Es deuda técnica acumulada, no urgencia inmediata.
4. **Exceptions (12, ~20 min)** — cuarta. Las excepciones legítimas no requieren acción inmediata; solo revisión.

Justificación: los at risk tienen impacto activo de seguridad (un agente comprometido puede estar exfiltrando datos AHORA). Las pending requests bloquean trabajo de empleados (impacto de productividad inmediato). Ownerless y exceptions son deuda que se puede limpiar el resto de la semana.

**Pregunta 2 — Pending requests**

Para los 6 Third Party del catálogo:
- **Verificar el publisher** de cada uno (¿es un partner certificado de Microsoft o un proveedor desconocido?).
- **Revisar capabilities**: ¿qué scopes solicitan? ¿Acceso a datos sensibles?
- **Cross-check con la lista de proveedores aprobados** de Plain Coffee.
- Aprobar los del catálogo de partners certificados con scopes razonables.
- Rechazar (con explicación) los de proveedores desconocidos o con scopes excesivos.
- Si más de 2 son del mismo proveedor, considerar añadirlo a la lista blanca para evitar repeticiones.

Para el Foundry interno: validar con el equipo de Data Engineering que el blueprint y los permisos están alineados con la política, y aprobar.

**Pregunta 3 — Agents at risk**

Orden de ataque: **Tienda-LATAM-Bogotá (Critical) primero**.

Critical antes que High: el risk level no es ordinal puro, pero Critical implica que el modelo confía en que hay un problema activo.

**Investigación Tienda-LATAM-Bogotá:**
- Click sobre risk level → risk panel → ver causas.
- «50× volumen normal» puede ser: (a) un loop accidental tras un cambio reciente, (b) un compromiso real, (c) un legítimo crecimiento por una campaña.
- Verificar si el agente tuvo cambios recientes (deploy, blueprint update, nuevo datasource).
- Verificar quiénes son los usuarios invocadores (caso a caso) en los últimos 60 minutos.
- **Decisión rápida**: si no hay explicación legítima en 5 minutos, **disable the agent** desde el panel y abrir incidente para investigación profunda.

**Foundry-Finanzas-01 (segundo):**
- DSPM detectó permisos excesivos. Comparar permisos del blueprint vs uso real.
- Si el agente nunca usa los scopes excesivos, **reducir el blueprint**: crear nuevo blueprint con menos scopes, migrar la identity.
- Si los usa pero esporádicamente, dejar como está y marcar la excepción.

**RRHH-Onboarding (tercero):**
- Sign-in desde IP no habitual. ¿Es esa IP de un proveedor legítimo? ¿De un país donde el sponsor está de viaje?
- Si dudoso: aplicar Conditional Access más restrictivo y monitorizar 24h.

**Pregunta 4 — Ownerless**

Los **3 de Pedro Sánchez**: este es el caso clásico que el lifecycle workflow `transferOnLeaver` debería haber prevenido (ver M06 § 6.4). Síntomas:
- Pedro era sponsor pero `transferOnLeaver: false` o no había workflow activo.
- O Pedro era owner sin sponsor.

Acción inmediata:
- Identificar al **manager actual** de Pedro (consultar histórico HR si ya no existe en Entra).
- Asignar el manager como nuevo owner de los 3 agentes.
- Marcar `requireReview` para que el nuevo owner decida en 30 días si los agentes siguen siendo necesarios.

Acción preventiva:
- **Activar lifecycle workflow** con `transferOnLeaver: true` para todos los agentes nuevos.
- Auditar resto de agentes para ver si más están en riesgo del mismo problema.

Los **2 sin owner inicial**:
- Probablemente son scripts o automatizaciones técnicas creadas por IT.
- Buscar el creator en el audit log (`Search-UnifiedAuditLog -Operations AgentCreated`).
- Si el creator sigue en la organización: asignarlo como owner.
- Si no: asignarlo al **lead actual del equipo IT** (Eva Martín, CIO).
- Política a aplicar: **owner obligatorio en creación**. Modificar política tenant.

**Pregunta 5 — Exportación trimestral**

Proceso:

1. **Aplicar filtros pertinentes**. Por ejemplo, todos los agentes activos: Status = Active. (Si quieres separar Pending y Disabled, aplicar y exportar tres veces.)
2. **Botón Export → Excel** arriba a la derecha. Descarga `.xlsx`.
3. **Abrir en Excel**. La hoja contiene todas las columnas (incluyendo las no visibles en la UI: Created date, Tags, Sponsor, Capabilities).
4. **Crear tabla pivote** con dimensiones: Platform, Owner, Risk level. Métrica: Count.
5. **Generar gráficos** y añadir al informe trimestral.
6. **Archivar** la copia exportada en SharePoint con etiqueta de retención y fecha. Esto sirve como evidencia ante auditorías futuras: «el 6 de mayo de 2026 teníamos X agentes en este estado».

Recomendación: automatizar este proceso con Power Automate (un flow que ejecute la exportación cada trimestre y la suba a SharePoint con timestamp).

</details>

---

## Validación de aprendizaje

Antes de pasar al M08, el alumno debe poder responder sin notas:

- **¿Qué pantalla abro primero por la mañana?** Overview. Las 4 hero metrics y las 4 Top actions for you en una sola vista.
- **¿Cómo busco agentes Third Party de alto riesgo en Copilot Studio?** Filtros laterales del Registry: Publisher = Third Party + Platform = Copilot Studio + Risk = High/Critical.
- **¿Cuándo abro el Map en lugar del Registry?** Cuando quiero ver multi-agent workflows o detectar agentes hub.
- **¿Qué hace falta para que aparezca la Risks column?** E7 + Defender M365 connector + DSPM for AI. Los tres encadenados.
