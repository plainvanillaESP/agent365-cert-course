---
modulo: 7
tipo: quiz-practica
titulo: "Quiz de práctica del Módulo 07"
duracion_min: 12
umbral_aprobado_pct: 70
intentos_max: null
ultima_actualizacion: 2026-05-07
preguntas:
  - Q-07-1
  - Q-07-2
  - Q-07-3
  - Q-07-4
  - Q-07-5
caso_estudio: "Lumen Logística"
---

# Módulo 07 — Quiz de práctica

> Cinco preguntas para validar tu comprensión del Agent Registry, el Agent Map y la página Overview. Intentos ilimitados, aprobado a partir del 70 %.
>
> Estas preguntas son distintas a las del examen final del curso. Cubren los 5 OAs con escenarios y datos diferentes.

---

::: pregunta
id: Q-07-1
oa: OA-07.3
tipo: multiple-choice
dificultad: facil
bloom: Recordar
enunciado: |
  Entras en M365 admin center → Agents → Overview y ves el bloque «Top actions for you». ¿Cuál de las siguientes categorías **NO** aparece en ese bloque?
opciones:
  - id: a
    texto: "Pending requests"
  - id: b
    texto: "Agents at risk"
  - id: c
    texto: "Top performing agents"
    correcta: true
  - id: d
    texto: "Ownerless agents"
justificacion: |
  Las cuatro categorías de **Top actions for you** son: Pending requests, Agents at risk, Ownerless agents y With exceptions. «Top performing agents» NO existe como categoría de Top actions: Overview se centra en lo que requiere atención del admin (riesgos, pendientes, sin owner, con excepciones), no en métricas de uso. Las métricas de uso viven en Microsoft 365 Copilot Dashboard, no en Overview de Agent 365.
:::

::: pregunta
id: Q-07-2
oa: OA-07.1
tipo: scenario
dificultad: media
bloom: Aplicar
enunciado: |
  El responsable de seguridad pregunta: «¿Cuántos agentes Microsoft (publisher Microsoft) están desplegados en la plataforma Foundry y siguen en risk Low pero llevan inactivos más de 30 días?». ¿Qué combinación de filtros aplicas en el Registry para responder?
opciones:
  - id: a
    texto: "Publisher = Microsoft + Platform = Foundry + Risk = Low + Last activity = > 30 days."
    correcta: true
  - id: b
    texto: "Publisher = Third Party + Platform = Foundry + Risk = Low; el filtro de inactividad no existe en el Registry."
  - id: c
    texto: "Solo se puede filtrar por dos de esas dimensiones simultáneamente; combinar las cuatro requiere exportar a Excel y filtrar en local."
  - id: d
    texto: "Status = Pending + Risk = Low. La inactividad se infiere del estado Pending."
justificacion: |
  Los filtros del Registry son acumulativos (AND lógico entre filtros distintos) y combinables sin límite práctico. Para esta pregunta se combinan cuatro: Publisher = Microsoft, Platform = Foundry, Risk = Low, Last activity (días). La opción B confunde Publisher Microsoft con Third Party. La C inventa una limitación. La D confunde inactividad con estado Pending (son atributos distintos).
:::

::: pregunta
id: Q-07-3
oa: OA-07.2
tipo: multiple-choice
dificultad: facil
bloom: Aplicar
enunciado: |
  Necesitas exportar el inventario completo de agentes para enviárselo al auditor externo. ¿Cuál es la forma más correcta de hacerlo desde el Registry?
opciones:
  - id: a
    texto: "Botón «Export to Excel» en la barra superior del Registry: descarga un .xlsx con todas las columnas visibles y los filtros aplicados en ese momento."
    correcta: true
  - id: b
    texto: "Capturar pantalla del Registry y enviar la imagen al auditor."
  - id: c
    texto: "Exportar manualmente cada agente uno a uno desde su página de detalle."
  - id: d
    texto: "El Registry no tiene función de exportar: hay que pedir a un developer que genere el inventario vía Microsoft Graph."
justificacion: |
  El botón **Export to Excel** del Registry produce un .xlsx con todas las columnas visibles respetando los filtros activos. Es la vía oficial y la que usa la mayoría de IT admins para auditorías. Si los filtros no están activos, exporta el universo completo. La opción A es la respuesta canónica. La B es un antipatrón (sin trazabilidad). La C es manual y propensa a errores. La D es falsa: la exportación nativa existe (aunque también existe la vía Graph para automatización).
:::

::: pregunta
id: Q-07-4
oa: OA-07.4
tipo: multiple-response
dificultad: media
bloom: Aplicar
enunciado: |
  De las siguientes plataformas de creación de agentes, ¿cuáles aparecen en el **Registry** del Microsoft 365 admin center vía registry sync? Selecciona todas las que apliquen.
opciones:
  - id: a
    texto: "Microsoft Copilot Studio"
    correcta: true
  - id: b
    texto: "Microsoft Foundry"
    correcta: true
  - id: c
    texto: "ChatGPT consumer (cuentas personales)"
  - id: d
    texto: "SharePoint agents (.agent files en bibliotecas)"
    correcta: true
  - id: e
    texto: "Microsoft 365 Agents SDK custom (built con código)"
    correcta: true
  - id: f
    texto: "Excel macros (VBA) que llaman APIs externas"
justificacion: |
  El Registry sincroniza vía registry sync los agentes registrados en plataformas oficiales del ecosistema Microsoft: **Copilot Studio**, **Foundry**, **SharePoint agents** y **Agents SDK custom** (también Agent Builder declarative/custom y Teams app, no listados aquí). NO sincroniza ChatGPT consumer (cuenta personal, fuera del tenant) ni Excel macros con VBA (no son agentes del catálogo Microsoft). Esta cobertura es exactamente lo que justifica la frase «el Registry es la fuente única de verdad para agentes del tenant».
:::

::: pregunta
id: Q-07-5
oa: OA-07.5
tipo: scenario
dificultad: dificil
bloom: Analizar
enunciado: |
  En el Agent Map detectas un patrón con tres agentes: **Reportes-Mensuales** invoca a **Datos-Crudos**, que invoca a **Limpieza-ETL**, que a su vez invoca a **Reportes-Mensuales**. Las flechas dibujan un triángulo cerrado. ¿Cómo interpretas este patrón y cuál es la prioridad de actuación?
opciones:
  - id: a
    texto: "Es un grafo de dependencias estándar; no requiere acción específica."
  - id: b
    texto: "Es un ciclo (loop circular) entre tres agentes. Es un antipatrón: puede provocar invocaciones recursivas, costes en spiral y comportamientos impredecibles. Prioridad alta de revisión con los owners para refactorizar el flujo."
    correcta: true
  - id: c
    texto: "Es un cluster cohesionado que indica una buena arquitectura modular."
  - id: d
    texto: "Indica que los tres agentes son redundantes y pueden consolidarse en uno solo."
justificacion: |
  Tres flechas formando un triángulo cerrado representa **un ciclo en el grafo dirigido** (A→B→C→A). Es un antipatrón clásico: en runtime puede provocar invocaciones recursivas con timeouts agotados, spiral de costes (cada vuelta consume mensajes en las plataformas correspondientes) y comportamientos no deterministas según el orden de ejecución. La prioridad alta es refactorizar: típicamente uno de los tres agentes debería tener un trigger externo en lugar de invocarse desde dentro del ciclo. La opción A subestima el riesgo. La C es lo opuesto a la realidad: cohesión modular se ve como subgrafos densos sin ciclos. La D no se deriva del Map; consolidar tres agentes requiere análisis funcional.
:::

---

## Caso de estudio (refuerzo, no evaluable)

> Tras responder el quiz, intenta este ejercicio antes de pasar a M08.

**Escenario.** **Lumen Logística** (4.500 empleados) tiene Agent 365 desde hace 6 meses con 320 agentes registrados. La directora de IT pide al equipo dos cosas:

1. Producir el primer informe trimestral del estado de agentes (auditoría interna).
2. Identificar los 5 agentes más críticos de la arquitectura (los que, si fallan, rompen más workflows).

**Tareas.**

1. Diseña los filtros del Registry y el flujo de Excel que producirías para el informe trimestral. ¿Qué columnas exportarías y qué cinco insights sacarías del análisis?
2. Diseña un protocolo para identificar los 5 agentes más críticos a partir del Agent Map. ¿Qué métrica del Map miras y cómo la obtienes si el Map no expone «top hub agents» nativamente?

<details>
<summary>Ver solución sugerida</summary>

**1. Informe trimestral.**

Filtros y exportación:
- Filtro 1: Status = Active (descartar Pending y Removed).
- Filtro 2: Last activity = >= primer día del trimestre.
- Export to Excel con todas las columnas.

Cinco insights tipo:
- Distribución por Publisher (Microsoft / Third Party / Your organization). Si Your organization > 70 % es señal de mucha creación interna no controlada.
- Distribución por Platform. Si Foundry crece > 20 % trimestre/trimestre es señal de proyecto pro-code maduro.
- Top 10 por Last activity (más usados).
- Bottom 10 por Last activity (candidatos a Remove).
- Risk distribution: cuántos en Low/Medium/High/Critical y tendencia.

**2. Top 5 agentes críticos.**

Métrica clave: **número de conexiones entrantes** (in-degree) en el Map. Un agente con muchas entradas es un hub: si falla, fallan todos los que lo invocan.

Cómo obtenerlo si el Map no lo expone como ranking nativo:
- Exportar el grafo del Map (botón Export graph as JSON).
- Procesar en local con un script Python (pandas o networkx) para calcular in-degree por nodo.
- Ordenar descendente y extraer los 5 primeros.
- Validar el resultado pasando el listado al líder técnico para confirmar que efectivamente son los hubs estratégicos.

Si el Map no tiene Export, alternativa vía Microsoft Graph: `GET /beta/copilot/admin/agents/{agentId}/connections` por agente y agregar.

</details>
