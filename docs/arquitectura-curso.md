# Arquitectura del curso

> Diseño maestro detallado de los 17 módulos del curso. Este documento es la **fuente única de verdad** para la producción de contenido: define objetivos, duraciones, laboratorios, conceptos clave y el reparto de preguntas de la evaluación final. Cualquier cambio en la estructura del curso se refleja primero aquí y luego se propaga al contenido fuente.

**Estado:** ✅ Versión 1.1 (Fase 1 completada)
**Última revisión:** mayo 2026

---

## Tabla de contenidos

- [0. Información general](#0-información-general)
- [1. Áreas de competencia](#1-áreas-de-competencia)
- [2. Resumen de los 17 módulos](#2-resumen-de-los-17-módulos)
- [3. Detalle por módulo](#3-detalle-por-módulo)
- [4. Estructura de la evaluación final](#4-estructura-de-la-evaluación-final)
- [5. Matriz de competencias](#5-matriz-de-competencias)
- [6. Ruta de producción](#6-ruta-de-producción)

---

## 0. Información general

### Visión

El curso forma a administradores IT capaces de **gobernar de forma autónoma todos los agentes de IA que operan en un tenant de Microsoft 365**, usando Microsoft Agent 365 como plano de control unificado e integrando coherentemente las disciplinas de identidad (Microsoft Entra Agent ID), protección de datos (Microsoft Purview), monitorización (Microsoft Defender) y experiencia del usuario (Copilot Control System).

Al completarlo, el alumno demuestra competencia en las cinco áreas que estructuran la evaluación final.

### Audiencia objetivo

Administrador IT con experiencia previa en Microsoft 365, que opera como mínimo uno de los siguientes admin centers en su día a día: Microsoft 365, Microsoft Entra, Microsoft Purview, Microsoft Defender, SharePoint o Power Platform.

### Prerrequisitos formales

- Conocimientos administrativos de Microsoft 365 a nivel MS-102 o equivalente.
- Familiaridad con Microsoft Entra ID (usuarios, grupos, roles, Conditional Access básico).
- Conceptos básicos de protección de datos (DLP, sensitivity labels) y de detección de amenazas (alertas, advanced hunting con KQL).
- Capacidad de leer y ejecutar comandos PowerShell y peticiones a Microsoft Graph.
- No se requiere experiencia previa con Copilot Studio, Foundry ni Microsoft 365 Agents SDK.

### Tenant para los laboratorios

- **Recomendado:** tenant Microsoft 365 con E5 + Microsoft 365 Copilot + Microsoft Agent 365 (standalone o vía E7 Frontier Suite). Si se dispone de tenant en programa Frontier preview, mejor aún (las 25 licencias gratuitas cubren todos los labs).
- **Mínimo viable:** tenant Microsoft 365 Developer Program con E5 + add-on de Copilot. Algunos labs avanzados (real-time protection runtime, ID Protection P2 para agentes) no se podrán reproducir.
- **Roles necesarios** para el alumno en su tenant de pruebas: Global Administrator (para algunas tareas one-off como OAuth admin consent) o, idealmente, los roles least-privilege correspondientes que el propio curso enseña a delegar.

### Constancia de finalización

Al completar el itinerario, Plain Vanilla Solutions SL emite una **constancia de finalización del curso** con el nombre del alumno y la fecha. La constancia acredita que el alumno ha cubierto el itinerario formativo y superado la evaluación, sin pretensión de equivalencia con certificaciones oficiales de Microsoft.

Requisitos para obtener la constancia:

| Requisito | Umbral |
|---|---|
| Progreso del curso | 100% de los 16 módulos teóricos completados |
| Laboratorios | Al menos 80% de los laboratorios validados (al menos 26 de los ~32) |
| Evaluación final | ≥ 70% (42/60 preguntas) |
| Caso de estudio integrado del Módulo 15 | Resuelto correctamente |

### Idioma, tono y formato

Ver [`convenciones-redaccion.md`](./convenciones-redaccion.md). Resumen: español de España, profesional pero directo, sin paja introductoria, con badges explícitos de estado de cada capacidad (🟢 GA / 🟡 Preview / 🔴 Frontier).

### Itinerario único

El curso tiene **un único itinerario** que cubre los 17 módulos en orden con dependencias lógicas estrictas. Duración total **18 horas** de teoría + laboratorios, más 90 minutos de evaluación final. La secuencia construye desde fundamentos hasta operación: contexto del producto → setup del tenant → identidad y ciclo de vida → protección de datos → monitorización → gobernanza avanzada y operación.

---

## 1. Áreas de competencia

Las cinco áreas que estructuran el curso y la evaluación final, con pesos fijos basados en densidad conceptual y criticidad operativa para un administrador IT:

| Área | Peso | Módulos que la cubren |
|---|---|---|
| **1. Plan and configure Microsoft Agent 365** | 15% | M01, M02, M03, M04, M05 |
| **2. Manage agent identities with Microsoft Entra Agent ID** | 30% | M06, M09 |
| **3. Manage the agent registry and lifecycle** | 15% | M07, M08 |
| **4. Implement data protection with Microsoft Purview** | 20% | M10, M11 |
| **5. Monitor, investigate and govern** | 20% | M12, M13, M14, M15, M16 |

**Total:** 60 preguntas en la evaluación final, distribuidas según los pesos.

**Justificación de los pesos:**

- **Área 2 (30%) es la más pesada** porque concentra lo más distintivo y conceptualmente más denso del curso: cuatro tipos de objetos nuevos en Entra (blueprint, blueprint principal, agent identity, agent user), flujos OBO vs own identity, Conditional Access para agentes, Identity Protection con 6 detecciones nuevas. Sin dominar esta área, no se gobierna nada del producto.
- **Áreas 4 y 5 (20% cada una)** reflejan que la protección de datos y la monitorización son los dos bloques operativos donde el admin pasa más tiempo una vez el producto está en marcha. Purview es crítico para compliance regulatoria (EU AI Act); KQL hunting en Defender es una skill técnica con peso real.
- **Áreas 1 y 3 (15% cada una)** son foundational pero menos profundas: la primera es el onboarding del producto (factual: qué licencia, qué rol, cómo se enciende) y la tercera es operación mecánica (enumeración de las 11 acciones del ciclo de vida, filtros del registry).

---

## 2. Resumen de los 17 módulos

| # | Título | Duración | Fase | Dependencias | # Labs | # Preguntas |
|---|---|---|---|---|---|---|
| 01 | Fundamentos: ¿Qué es Microsoft Agent 365? | 60 min | F2 | — | 0 | 3 |
| 02 | Arquitectura y componentes | 75 min | F3 | M01 | 1 | 3 |
| 03 | Licenciamiento, prerrequisitos y planificación | 60 min | F3 | M01, M02 | 1 | 1 |
| 04 | Roles administrativos y delegación | 45 min | F3 | M02 | 1 | 1 |
| 05 | Configuración inicial del tenant | 75 min | F3 | M03, M04 | 2 | 1 |
| 06 | Microsoft Entra Agent ID e identidades | 105 min | F4 | M02, M04 | 3 | 11 |
| 07 | Agent Registry y Agent Map | 75 min | F4 | M02, M05 | 2 | 4 |
| 08 | Despliegue, distribución y ciclo de vida | 90 min | F4 | M07 | 3 | 5 |
| 09 | Permisos, accesos y Conditional Access | 75 min | F4 | M06, M08 | 2 | 7 |
| 10 | Microsoft Purview y protección de datos | 75 min | F5 | M02, M07 | 2 | 5 |
| 11 | DLP, sensitivity labels y compliance | 75 min | F5 | M10 | 3 | 7 |
| 12 | Monitorización, auditoría y reporting | 75 min | F5 | M02, M07, M10 | 2 | 7 |
| 13 | Copilot Control System integrado | 45 min | F5 | M01, M02 | 1 | 1 |
| 14 | Gobernanza avanzada y políticas | 60 min | F6 | M07, M08, M11, M12 | 2 | 2 |
| 15 | Troubleshooting y casos prácticos | 45 min | F6 | Todos los anteriores | 3 | 1 |
| 16 | Costes y optimización | 45 min | F6 | M03 | 1 | 1 |
| 17 | Evaluación final | 90 min | F7 | Todos | — | — |

**Totales:**
- 16 módulos de contenido + 1 evaluación final
- ~1080 minutos = **18 horas de teoría/labs** + 90 min de evaluación
- ~32 laboratorios prácticos
- 60 preguntas en la evaluación final

---

## 3. Detalle por módulo

### Módulo 01 — Fundamentos: ¿Qué es Microsoft Agent 365?

**Duración total:** 60 min · **Fase:** F2 (prototipo) · **Dependencias:** ninguna

**Resumen.** Establece el marco conceptual del curso: qué es Microsoft Agent 365 (un plano de control de gobernanza, no un agent builder), por qué existe (el problema del *agent sprawl* y del shadow AI), cómo se diferencia de Copilot Studio, Foundry, Microsoft 365 Agents SDK y Copilot Control System, y cuál es el papel del administrador IT en este nuevo paradigma. Introduce los cuatro stakeholders core (M365 admin, Entra admin, Purview admin, Defender admin) y los hitos clave de disponibilidad (GA 1 mayo 2026).

**Objetivos de aprendizaje.** Al finalizar este módulo, el alumno será capaz de:

- **OA-01.1** Explicar en una frase el propósito de Microsoft Agent 365 y por qué se diferencia de un agent builder. *(Comprender)*
- **OA-01.2** Identificar los cuatro stakeholders core que Microsoft Agent 365 alinea y la responsabilidad de cada uno. *(Recordar)*
- **OA-01.3** Distinguir Microsoft Agent 365 de Copilot Control System, Microsoft 365 Agents SDK, Microsoft Agent 365 SDK y Copilot Studio. *(Analizar)*
- **OA-01.4** Reconocer los principales hitos cronológicos del producto (Ignite 2025, GA 1 mayo 2026, capacidades en preview). *(Recordar)*
- **OA-01.5** Argumentar la necesidad de gobernar agentes de IA citando casos concretos de agent sprawl, shadow AI y agentes locales (OpenClaw, GitHub Copilot CLI, Claude Code). *(Evaluar)*

**Estructura de teoría.**

| Sección | Duración | Contenido |
|---|---|---|
| 1.1 El problema que resuelve Agent 365 | 10 min | Agent sprawl, multiplicación de agentes, shadow AI, riesgos de gobernanza. |
| 1.2 Posicionamiento: control plane, no builder | 15 min | Agent 365 vs Copilot Studio vs Foundry vs M365 Agents SDK vs Agent 365 SDK. Diagrama de capas. |
| 1.3 Los cuatro stakeholders core | 10 min | Roles M365, Entra, Purview, Defender admin. |
| 1.4 Agent 365 vs Copilot Control System (CCS) | 10 min | "CCS gobierna a las personas que usan IA; Agent 365 gobierna a los agentes mismos". |
| 1.5 Cronología del producto | 5 min | Ignite 2025, Frontier preview, GA 1 mayo 2026. |
| 1.6 Resumen y próximos pasos | 10 min | Mapa mental del curso. Cómo el resto de módulos profundizan. |

**Conceptos clave.** Agent, Agent instance, Agent identity, Control plane, Agent sprawl, Shadow AI, Stakeholder, Frontier preview, GA, Copilot Control System (CCS).

**Laboratorios.** Ninguno (módulo conceptual). En su lugar: ejercicio de mapeo en el que el alumno debe ubicar 10 escenarios reales en la matriz "Agent 365 vs CCS vs Copilot Studio vs Foundry vs M365 Agents SDK vs Agent 365 SDK".

**Reparto a la evaluación final.** 3 preguntas (Área 1):
- 1 multiple-choice sobre la diferencia Agent 365 vs Copilot Studio.
- 1 multiple-choice sobre los stakeholders core.
- 1 escenario sobre cuándo aplicar Agent 365 vs CCS.

**Observaciones de producción.** Producir como **prototipo de calidad** en Fase 2. La calidad de tono y profundidad de este módulo establece el estándar para los 16 restantes.

---

### Módulo 02 — Arquitectura y componentes

**Duración total:** 75 min · **Fase:** F3 · **Dependencias:** M01

**Resumen.** Diagrama de bloques completo de Microsoft Agent 365 y sus integraciones: Microsoft 365 admin center (Agent workload, Registry, Map, Overview), Microsoft Entra Agent ID (blueprint, blueprint principal, agent identity, agent user), Microsoft Purview (DSPM for AI, AI observability), Microsoft Defender (CloudAppEvents, real-time protection, posture management), Work IQ MCP servers, Agent 365 SDK + CLI. Tipos de agentes gestionables y categorización por publisher.

**Objetivos de aprendizaje.**

- **OA-02.1** Dibujar el diagrama de arquitectura de Agent 365 nombrando cada componente y su responsabilidad. *(Aplicar)*
- **OA-02.2** Identificar los 8 tipos de agentes gestionables en M365 admin center (MCS DA, MCS CEA, MCS BP, Foundry LOB/non-LOB/hosted, Agent Builder, SharePoint, Toolkit, Agent instance) y diferenciarlos. *(Analizar)*
- **OA-02.3** Distinguir las tres categorías de publisher (Your organization, Third Party, Microsoft) y sus implicaciones de gobernanza. *(Comprender)*
- **OA-02.4** Mapear cada hero metric del Overview (registry total, active users, run-time, registry sync) a su fuente de datos. *(Aplicar)*
- **OA-02.5** Ubicar Work IQ MCP servers dentro de la arquitectura y explicar su rol en runtime de agentes. *(Comprender)*

**Estructura de teoría.**

| Sección | Duración | Contenido |
|---|---|---|
| 2.1 Diagrama macro: Agent 365 como plano de control | 15 min | Diagrama SVG con M365 admin center, Entra, Purview, Defender, MCP, SDK. |
| 2.2 Microsoft 365 admin center: Agent workload | 15 min | Overview, Registry, Map, hero metrics, settings. Capturas guiadas. |
| 2.3 Tipos de agentes gestionables | 15 min | MCS DA/CEA/BP, Foundry LOB/non-LOB/hosted, Agent Builder, SharePoint, Toolkit, Agent instance. |
| 2.4 Categorías por publisher | 10 min | Your organization (incluye your users), Third Party, Microsoft. |
| 2.5 Work IQ MCP servers | 5 min | Outlook, Word, Teams, SharePoint, OneDrive, User, Dataverse/Dynamics, Copilot. |
| 2.6 Microsoft 365 Agents SDK vs Agent 365 SDK | 10 min | Distinción crítica. Diagrama de capas. Uso conjunto. |
| 2.7 Resumen y mapa mental | 5 min | Mapa de los componentes que se desarrollarán en módulos posteriores. |

**Conceptos clave.** Agent workload, Agent Registry, Agent Map, Hero metric, Agent instance, MCS, Foundry, Agent Builder, SharePoint agent, Agent Toolkit, Work IQ MCP, OBO (On-Behalf-Of), Service principal, Blueprint.

**Laboratorios.**

| Lab | Título | Duración | Dificultad | Prerrequisitos |
|---|---|---|---|---|
| **Lab 02.1** | Recorrido guiado por la arquitectura | 30 min | Básico | Tenant con Agent 365 activado, rol Global Reader o AI Reader |

*Lab 02.1.* El alumno navega por M365 admin center → Agents → Overview, identifica las 4 hero metrics, recorre Registry y Map, abre la página de un agente y localiza visualmente cada componente arquitectónico. Output: documento de 1 página con capturas anotadas.

**Reparto a la evaluación final.** 3 preguntas (Área 1):
- 1 drag-and-drop: emparejar componente ↔ admin center.
- 1 multiple-choice: cuál NO es un tipo de agente gestionable.
- 1 multiple-choice: distinción Agents SDK vs Agent 365 SDK.

---

### Módulo 03 — Licenciamiento, prerrequisitos y planificación

**Duración total:** 60 min · **Fase:** F3 · **Dependencias:** M01, M02

**Resumen.** Comparativa completa de licenciamiento (Agent 365 standalone $15, M365 E7 Frontier Suite $99, E5 base, Entra Suite $12, Entra ID P1/P2). Reglas críticas: cobertura OBO vs autonomous, qué se incluye en E7, qué requiere add-ons. Modelos de consumo paralelos (Copilot Credits para Copilot Studio, per-token para Foundry). Decisión Agent 365 standalone vs E7. Frontier preview (25 licencias gratuitas). Planificación de despliegue: cómo dimensionar.

**Objetivos de aprendizaje.**

- **OA-03.1** Comparar las opciones de licenciamiento (Agent 365 standalone, E7, E5+add-ons) y recomendar la adecuada para un escenario dado. *(Evaluar)*
- **OA-03.2** Aplicar las reglas de cobertura OBO vs autonomous a un caso real. *(Aplicar)*
- **OA-03.3** Identificar qué capacidades requieren licencias adicionales (Risks column, CA para agentes, ID Protection para agentes). *(Recordar)*
- **OA-03.4** Calcular el coste mensual estimado de una organización dada (usuarios, número de agentes, plataforma de creación). *(Aplicar)*
- **OA-03.5** Distinguir las tres líneas de billing simultáneas (Agent 365 per-seat, Copilot Studio Credits, Foundry per-token) y atribuir consumo a cada una. *(Analizar)*
- **OA-03.6** Diseñar un plan de despliegue gradual partiendo de un piloto Frontier preview. *(Crear)*

**Estructura de teoría.**

| Sección | Duración | Contenido |
|---|---|---|
| 3.1 SKUs disponibles y precios (mayo 2026) | 10 min | Agent 365 $15, E7 $99 (con/sin Teams), E5, Entra Suite $12, P1, P2. Tabla. |
| 3.2 Reglas de cobertura: OBO vs autonomous | 10 min | Quién paga qué. Casos. Estado preview de autonomous. |
| 3.3 Capacidades con licencia adicional | 10 min | Risks column → E7. CA agentes → P1. ID Protection agentes → P2. Network → Internet Access. Work IQ → Copilot. |
| 3.4 Modelos de consumo paralelos | 10 min | Copilot Credits ($200/pack 25k), Foundry per-token, P3 plan con CCCUs. |
| 3.5 Frontier preview vs GA | 5 min | 25 licencias gratuitas en Frontier; modelo per-instance vs per-user en GA. |
| 3.6 Decisión: standalone vs E7 | 5 min | Cuándo $15 vs $99. Tabla de break-even por organización. |
| 3.7 Planificación de despliegue | 10 min | Piloto → expansión → general availability. Sizing. |

**Conceptos clave.** Per-seat, Per-instance, OBO, Autonomous agent, Frontier preview, Copilot Credits, CCCU (Copilot Consumption Credit Unit), Pre-Purchase Plan P3, Risks column.

**Laboratorios.**

| Lab | Título | Duración | Dificultad |
|---|---|---|---|
| **Lab 03.1** | Calculadora de licenciamiento Plain Vanilla | 25 min | Básico |

*Lab 03.1.* Hoja de cálculo con 4 escenarios reales (5.000 / 1.000 / 200 / 50 usuarios, mix de tipos de agentes). El alumno calcula coste mensual recomendado, justifica la elección entre Agent 365 standalone vs E7, y dimensiona el consumo de Copilot Credits para los agentes Copilot Studio. Output: hoja de cálculo completada + 1 párrafo de justificación por escenario.

**Reparto a la evaluación final.** 1 pregunta (Área 1):
- 1 escenario: cuándo Agent 365 standalone vs E7.

---

### Módulo 04 — Roles administrativos y delegación

**Duración total:** 45 min · **Fase:** F3 · **Dependencias:** M02

**Resumen.** Catálogo completo de roles administrativos involucrados en la gobernanza de agentes (AI Administrator, AI Reader, Global Administrator, Global Reader, Agent ID Administrator, Cloud Application Administrator, Agent ID Developer, Conditional Access Administrator, Security Administrator/Operator/Reader, Lifecycle Workflows Administrator, Billing Administrator, IRM roles). Principio de least-privilege aplicado al ecosistema. Diseño de delegación para una organización mediana.

**Objetivos de aprendizaje.**

- **OA-04.1** Identificar el rol mínimo necesario para realizar una tarea dada (least-privilege). *(Aplicar)*
- **OA-04.2** Distinguir AI Administrator vs AI Reader vs Global Administrator y sus límites. *(Analizar)*
- **OA-04.3** Diseñar un esquema de delegación para una organización con separación de funciones (Adopción, Seguridad, Compliance). *(Crear)*
- **OA-04.4** Asignar roles desde Microsoft 365 admin center y desde Microsoft Entra admin center. *(Aplicar)*

**Estructura de teoría.**

| Sección | Duración | Contenido |
|---|---|---|
| 4.1 Catálogo de roles | 10 min | Tabla con cada rol, su ámbito y restricciones. |
| 4.2 Principio de least-privilege aplicado | 5 min | Por qué AI Reader > Global Admin para visibilidad. Riesgos de privilegio excesivo. |
| 4.3 Delegación entre admin centers | 10 min | Roles que viven en M365, en Entra, y en otros admin centers. |
| 4.4 Diseño de delegación: caso práctico | 15 min | Plantilla de matriz Persona ↔ Roles para una organización mediana. |
| 4.5 Resumen | 5 min | Cierre con recomendaciones. |

**Conceptos clave.** AI Administrator, AI Reader, Agent ID Administrator, Agent ID Developer, Least-privilege, Separation of duties.

**Laboratorios.**

| Lab | Título | Duración | Dificultad |
|---|---|---|---|
| **Lab 04.1** | Asignar roles least-privilege a un equipo de seguridad ficticio | 25 min | Intermedio |

*Lab 04.1.* Dado el organigrama de la empresa ficticia "Plain Coffee SL" (1 CIO, 2 admins de M365, 2 analistas de seguridad, 1 compliance officer), el alumno asigna los roles mínimos necesarios desde M365 admin center → Roles → Role assignments y desde Entra admin center → Roles & administrators. Validación: ningún usuario tiene Global Administrator y todos pueden hacer su trabajo.

**Reparto a la evaluación final.** 1 pregunta (Área 1):
- 1 multiple-choice: rol mínimo para una tarea dada (least-privilege).

---

### Módulo 05 — Configuración inicial del tenant

**Duración total:** 75 min · **Fase:** F3 · **Dependencias:** M03, M04

**Resumen.** Pasos uno-a-uno para activar Agent 365 en un tenant: prerrequisitos verificables (licencias, roles, audit logs habilitados), activación Frontier (Copilot → Settings → User access → Copilot Frontier), aceptación de Terms of Service, navegación a Agents → Overview. Configuración de Microsoft 365 connector en Defender. Habilitación de DSPM en Purview. Activación de Power Platform connector. Validación end-to-end de que el setup funciona.

**Objetivos de aprendizaje.**

- **OA-05.1** Validar los prerrequisitos de un tenant antes de activar Agent 365. *(Aplicar)*
- **OA-05.2** Activar Agent 365 (modo Frontier preview o GA) siguiendo el orden correcto. *(Aplicar)*
- **OA-05.3** Configurar el Microsoft 365 connector en Defender for Cloud Apps. *(Aplicar)*
- **OA-05.4** Habilitar DSPM y AI observability en Microsoft Purview. *(Aplicar)*
- **OA-05.5** Verificar end-to-end que el setup está operativo (capturando un evento de prueba). *(Evaluar)*

**Estructura de teoría.**

| Sección | Duración | Contenido |
|---|---|---|
| 5.1 Prerrequisitos del tenant | 10 min | Licencias, roles, audit logs, regiones soportadas. Checklist. |
| 5.2 Activación: paso a paso | 20 min | Copilot Frontier toggle, Terms of Service, Agents Overview. Capturas. |
| 5.3 Configuración de Defender | 10 min | Microsoft 365 connector, audit logs, alertas iniciales. |
| 5.4 Configuración de Purview | 10 min | DSPM, AI observability, sensitivity labels habilitadas para SharePoint/OneDrive. |
| 5.5 Validación end-to-end | 15 min | Test: crear un agente trivial, capturar evento, ver en cada admin center. |
| 5.6 Resumen y troubleshooting básico | 10 min | Errores frecuentes en activación. Cierre. |

**Conceptos clave.** Frontier toggle, Terms of Service, Audit log, Microsoft 365 connector, DSPM, AI observability.

**Laboratorios.**

| Lab | Título | Duración | Dificultad |
|---|---|---|---|
| **Lab 05.1** | Activación inicial del tenant | 30 min | Intermedio |
| **Lab 05.2** | Configuración cross-admin center y validación | 25 min | Intermedio |

*Lab 05.1.* Activar Frontier en un tenant nuevo. Verificar las 25 licencias asignadas. Navegar a Agents Overview y comprobar las 4 hero metrics. Capturar evidencia.
*Lab 05.2.* Configurar Microsoft 365 connector en Defender, habilitar DSPM en Purview, conectar Power Platform admin center. Lanzar un agente de prueba (Agent Builder) y verificar que aparece en los 3 admin centers en menos de 30 minutos.

**Reparto a la evaluación final.** 1 pregunta (Área 1):
- 1 ordenamiento: secuenciar correctamente los pasos de activación.

---

### Módulo 06 — Microsoft Entra Agent ID e identidades de agentes

**Duración total:** 105 min · **Fase:** F4 · **Dependencias:** M02, M04

**Resumen.** El módulo más denso del curso. Introduce los cuatro tipos de objetos nuevos de Entra Agent ID (agent identity blueprint, blueprint principal, agent identity, agent user), los dos flujos de autenticación (OBO y own identity), las capacidades de governance (sponsorship, lifecycle workflows, access packages, inheritable permissions, custom security attributes, multi-select disable). Convergencia M365 admin center ↔ Entra admin center (1 mayo 2026). APIs Graph para identidades. Best practices de blueprints.

**Objetivos de aprendizaje.**

- **OA-06.1** Distinguir los cuatro tipos de objetos nuevos en Entra Agent ID y la relación entre ellos. *(Analizar)*
- **OA-06.2** Diseñar un agent identity blueprint con permisos heredables ajustados a un caso de uso. *(Crear)*
- **OA-06.3** Configurar agent sponsorship con transferencia automática al manager. *(Aplicar)*
- **OA-06.4** Distinguir flujos OBO vs own identity y aplicar la elección correcta. *(Analizar)*
- **OA-06.5** Listar y filtrar agent identities desde Entra admin center y desde Microsoft Graph (`agentSignIn`, `agentType`). *(Aplicar)*
- **OA-06.6** Aplicar custom security attributes para segmentar agentes. *(Aplicar)*
- **OA-06.7** Deshabilitar identidades en bulk y diagnosticar el impacto. *(Aplicar)*

**Estructura de teoría.**

| Sección | Duración | Contenido |
|---|---|---|
| 6.1 Los cuatro tipos de objetos | 20 min | Blueprint, blueprint principal, agent identity, agent user. Diagrama relacional. |
| 6.2 Flujos de autenticación | 15 min | OBO (delegated) vs own identity (autonomous). Diagramas de tokens. |
| 6.3 Agent identity blueprints | 20 min | Plantillas, permisos heredables, restricciones, audit, lifecycle metadata, max 10 resource apps × 40 scopes. |
| 6.4 Sponsorship y lifecycle | 15 min | Sponsor, transferencia al manager, lifecycle workflows, mover/leaver tasks. |
| 6.5 Access packages | 10 min | Asignar permisos vía Security Group, OAuth API, Entra roles. |
| 6.6 Custom security attributes | 5 min | Segmentación. Casos de uso. |
| 6.7 Convergencia M365 ↔ Entra (mayo 2026) | 10 min | Retiro de Agent registry/collections en Entra; APIs `/beta/agentRegistry/...` → `/beta/copilot/admin/...`. |
| 6.8 APIs Graph para identidades | 5 min | `riskyAgents`, `agentRiskDetections`, `signInEventTypes`. Ejemplos. |
| 6.9 Resumen | 5 min | Cierre. |

**Conceptos clave.** Agent identity blueprint, Agent identity blueprint principal, Agent identity, Agent user, OBO, Own identity, Sponsor, Inheritable permission, Custom security attribute, Lifecycle workflow, Access package.

**Laboratorios.**

| Lab | Título | Duración | Dificultad |
|---|---|---|---|
| **Lab 06.1** | Crear un blueprint con `a365 setup` | 30 min | Intermedio |
| **Lab 06.2** | Crear y disponer una agent identity desde el blueprint | 30 min | Intermedio |
| **Lab 06.3** | Configurar sponsorship + lifecycle workflow | 30 min | Avanzado |

*Lab 06.1.* Instalar Agent 365 CLI (`a365`), ejecutar `a365 setup admin` + `a365 setup blueprint`. Crear blueprint con permisos heredables enumerados (User.Read.All, TeamsActivity.Send, Group.Read.All).
*Lab 06.2.* Crear una agent identity desde el blueprint con `a365 create-instance identity`. Validar que aparece en Entra admin center → Agent ID. Filtrar por Agent Blueprint ID.
*Lab 06.3.* Configurar a un usuario como sponsor de la agent identity. Simular su salida (disable). Verificar que el lifecycle workflow notifica al manager y reasigna el sponsorship.

**Reparto a la evaluación final.** 11 preguntas (Área 2):
- 2 multiple-choice sobre los cuatro tipos de objetos.
- 1 drag-and-drop: emparejar capacidad ↔ tipo de objeto.
- 1 escenario: elegir OBO vs own identity para un caso.
- 1 código: identificar qué hace una llamada a Microsoft Graph.
- 1 troubleshooting: por qué falla la creación de un blueprint.
- 1 escenario complejo: diseñar el blueprint para un caso real.
- 1 multiple-response: capacidades del blueprint.
- 1 multiple-choice: comportamiento de sponsorship.
- 1 multiple-choice: lifecycle workflow trigger.
- 1 multiple-choice: convergencia M365 ↔ Entra (APIs migradas).

---

### Módulo 07 — Agent Registry y Agent Map

**Duración total:** 75 min · **Fase:** F4 · **Dependencias:** M02, M05

**Resumen.** Inmersión en M365 admin center → Agents → Registry y Map. Filtros, columnas, exportación a Excel, hero metrics, top actions for you (pending requests, agents at risk, ownerless, with exceptions), Agent analytics. Visualización en Agent Map: clusters por plataforma, conexiones agent-to-agent, multi-agent workflows. Registry sync multicloud (AWS Bedrock, Google Gemini Enterprise) en preview. Risks column (E7).

**Objetivos de aprendizaje.**

- **OA-07.1** Navegar Registry y Map y aplicar filtros relevantes. *(Aplicar)*
- **OA-07.2** Exportar inventario completo a Excel y analizarlo. *(Aplicar)*
- **OA-07.3** Interpretar las hero metrics y las "top actions for you" de Overview. *(Analizar)*
- **OA-07.4** Identificar agentes registrados desde plataformas externas vía registry sync. *(Recordar)*
- **OA-07.5** Visualizar conexiones agent-to-agent en multi-agent workflows. *(Analizar)*

**Estructura de teoría.**

| Sección | Duración | Contenido |
|---|---|---|
| 7.1 Agent Registry: estructura | 15 min | Metadata por agente, columnas, filtros, ordenación. |
| 7.2 Agent Map: visualización | 15 min | Clusters por plataforma, fit-to-view, full screen, max agents. |
| 7.3 Hero metrics y Top actions | 15 min | Overview en profundidad. Pending requests, ownerless, at risk, exceptions. |
| 7.4 Agent analytics | 10 min | Creators (org/Third Party/Microsoft), top platforms. Análiticas Foundry solo soportan V2 — limitación a tener en cuenta para agentes V1 históricos. |
| 7.5 Registry sync multicloud 🟡 Preview | 10 min | AWS Bedrock, Google Gemini Enterprise. Cómo se conecta y limitaciones. |
| 7.6 Risks column 🟢 GA (con E7) | 10 min | Qué muestra, delay de hasta 1 hora, integración con Defender. |

**Conceptos clave.** Agent Registry, Agent Map, Hero metric, Ownerless agent, Pending request, Registry sync, Risks column.

**Laboratorios.**

| Lab | Título | Duración | Dificultad |
|---|---|---|---|
| **Lab 07.1** | Recorrido completo por Registry y Map con filtros | 25 min | Básico |
| **Lab 07.2** | Exportar inventario y analizar en Excel | 20 min | Intermedio |

*Lab 07.1.* Navegar por Agents → Registry. Aplicar filtros: por publisher (Third Party only), por estado (At risk), por plataforma (Copilot Studio). Cambiar a Map view. Identificar agentes con conexiones a otros agentes.
*Lab 07.2.* Export inventory a Excel. Construir tabla pivote de "agentes por plataforma × estado". Identificar 3 ownerless agents y 2 at-risk agents. Documentar.

**Reparto a la evaluación final.** 4 preguntas (Área 3):
- 1 multiple-choice: dónde se ven los ownerless agents.
- 1 escenario: filtrar Registry para responder una pregunta dada.
- 1 multiple-choice: requisitos de Risks column.
- 1 escenario: interpretar Agent Map para un multi-agent workflow.

---

### Módulo 08 — Despliegue, distribución y ciclo de vida

**Duración total:** 90 min · **Fase:** F4 · **Dependencias:** M07

**Resumen.** Las acciones de gobernanza disponibles en M365 admin center y cómo combinarlas en un ciclo de vida real: Publish → Activate → Deploy → Pin → Block/Unblock → Remove → Delete (irreversible). Approve Updates. Manage Ownerless Agents. Reassign Ownership (solo Agent Builder). Wizard de publishing con plantillas Default y Custom. Casos: agente que se aprueba con permisos restringidos, agente que se pinea a un grupo específico, agente que se elimina con propagación de 24h.

**Objetivos de aprendizaje.**

- **OA-08.1** Distinguir las 11 acciones de gobernanza y sus efectos. *(Analizar)*
- **OA-08.2** Ejecutar el wizard de publishing aplicando una plantilla (Default o Custom). *(Aplicar)*
- **OA-08.3** Aplicar Pin (3 slots: Microsoft, Administrator, User) a un grupo de usuarios. *(Aplicar)*
- **OA-08.4** Diferenciar Remove (reversible) de Delete (irreversible, 24h propagación). *(Recordar)*
- **OA-08.5** Reasignar ownership de un agente Agent Builder cuando el owner sale. *(Aplicar)*
- **OA-08.6** Diseñar un ciclo de vida completo para una organización (publishing → review → deployment → retirement). *(Crear)*

**Estructura de teoría.**

| Sección | Duración | Contenido |
|---|---|---|
| 8.1 Las 11 acciones de gobernanza | 20 min | Publish, Activate, Deploy, Pin, Block, Unblock, Remove, Delete, Approve Updates, Manage Ownerless, Reassign. Tabla con efecto y reversibilidad. |
| 8.2 Wizard de publishing | 20 min | Submission, Review, Select users/groups, Preinstall, Apply Template, Permissions review, Admin consent. |
| 8.3 Plantillas Default vs Custom | 10 min | Qué incluye cada una. Cuándo usar Custom. |
| 8.4 Pinning y propagación | 5 min | 3 slots, hasta 6h propagación, solo agentes deployed. |
| 8.5 Remove vs Delete | 10 min | Diferencia. SharePoint Embedded container. 24h propagación. |
| 8.6 Ownerless y Reassign | 10 min | Cómo aparece. Quién puede reasignar. Limitación a Agent Builder. |
| 8.7 Diseño del ciclo de vida | 10 min | Plantilla de proceso para una organización. |
| 8.8 Resumen | 5 min | Cierre. |

**Conceptos clave.** Publish, Activate, Deploy, Pin, Block, Remove, Delete, Approve Update, Ownerless, Reassign Ownership, Default Template, Custom Template, SharePoint Embedded container.

**Laboratorios.**

| Lab | Título | Duración | Dificultad |
|---|---|---|---|
| **Lab 08.1** | Publish + Deploy de un agente con plantilla Custom | 30 min | Intermedio |
| **Lab 08.2** | Pin, Block, Unblock secuencial | 20 min | Básico |
| **Lab 08.3** | Reassign ownership tras hard delete del owner | 25 min | Avanzado |

*Lab 08.1.* Publicar un agente Copilot Studio. Aplicar plantilla Custom con políticas extra (Restrict External Content sharing, Entra Access Package). Deploy a un grupo de 5 usuarios. Validar que aparece pre-instalado.
*Lab 08.2.* Pin el agente al slot Administrator. Block con justificación. Unblock. Verificar comportamiento en cada paso.
*Lab 08.3.* Crear un agente Agent Builder con un usuario de prueba. Hard-delete el usuario en Entra. Verificar que aparece en Manage Ownerless Agents. Reasignar ownership a otro usuario.

**Reparto a la evaluación final.** 5 preguntas (Área 3):
- 1 ordenamiento: secuenciar acciones del ciclo de vida.
- 1 multiple-choice: Remove vs Delete.
- 1 multiple-choice: Reassign solo aplica a qué tipo de agente.
- 1 escenario: aplicar Custom Template para una restricción dada.
- 1 multiple-response: efectos de Pin y propagación.

---

### Módulo 09 — Permisos, accesos y Conditional Access

**Duración total:** 75 min · **Fase:** F4 · **Dependencias:** M06, M08

**Resumen.** Application vs Delegated Permissions, admin consent, common permissions (User.ReadBasic.All, TeamsActivity.Send, etc.). Conditional Access para agentes: scope (All agent identities / All agent users), target (All resources), Agent risk conditions (high/medium/low), Grant Block, Report-only mode. Identity Protection para agentes (P2): 6 detecciones offline, Risky Agents report 90 días, acciones (Confirm compromise → eleva a High → dispara CA Block).

**Objetivos de aprendizaje.**

- **OA-09.1** Distinguir Application Permissions vs Delegated Permissions y sus implicaciones. *(Analizar)*
- **OA-09.2** Conceder admin consent a OAuth grants pendientes. *(Aplicar)*
- **OA-09.3** Crear una política Conditional Access para All agent identities con grant Block por agent risk. *(Crear)*
- **OA-09.4** Aplicar Report-only mode antes de enforcement. *(Aplicar)*
- **OA-09.5** Interpretar el Risky Agents report y decidir acción (Confirm compromise / Confirm safe / Dismiss / Disable). *(Evaluar)*
- **OA-09.6** Diferenciar enforcement de CA en token request del agente vs en blueprint adquiriendo token. *(Analizar)*

**Estructura de teoría.**

| Sección | Duración | Contenido |
|---|---|---|
| 9.1 Application vs Delegated Permissions | 10 min | Diferencias. Cuándo cada una. Common permissions list. |
| 9.2 Admin consent | 10 min | Cómo otorgarlo. Por qué a veces queda pending. |
| 9.3 Conditional Access para agentes 🟢 GA | 20 min | Scope, target, conditions, grants. Casos típicos. |
| 9.4 Report-only mode | 10 min | Por qué es crítico. Cómo monitorizar. |
| 9.5 Identity Protection para agentes 🟡 Preview (P2) | 10 min | Detecciones offline, Risky Agents report. |
| 9.6 Acciones: Confirm compromise, Confirm safe, Dismiss, Disable | 10 min | Efectos cascada en CA. |
| 9.7 Resumen | 5 min | Cierre. |

**Conceptos clave.** Application Permission, Delegated Permission, Admin consent, Conditional Access, Agent risk, Report-only, Identity Protection, Risky Agents, Confirm compromise.

**Laboratorios.**

| Lab | Título | Duración | Dificultad |
|---|---|---|---|
| **Lab 09.1** | Crear CA policy de bloqueo por high agent risk en Report-only | 30 min | Avanzado |
| **Lab 09.2** | Confirm compromise sobre un agente y observar enforcement | 20 min | Avanzado |

*Lab 09.1.* Desde Entra admin center → Conditional Access → New policy: Scope All agent identities, Target All resources, Conditions Agent risk High, Grant Block, Report-only ON. Validar que las sign-ins aparecen en Sign-in logs > Agent sign-ins.
*Lab 09.2.* Sobre la identidad creada en Lab 06.2, marcar Confirm compromise desde Risky Agents report. Verificar que la CA policy en modo Block efectivamente bloquea (cambiar a enforced para validar).

**Reparto a la evaluación final.** 7 preguntas (Área 2):
- 2 multiple-choice: Application vs Delegated.
- 1 escenario: diseñar CA policy para un caso.
- 1 multiple-choice: cuándo enforcement de CA aplica vs no.
- 1 multiple-choice: efecto de Confirm compromise.
- 1 ordenamiento: secuenciar setup CA + Report-only + Confirm.
- 1 multiple-response: capacidades de Identity Protection para agentes.

---

### Módulo 10 — Microsoft Purview y protección de datos

**Duración total:** 75 min · **Fase:** F5 · **Dependencias:** M02, M07

**Resumen.** Capacidades Purview soportadas para Agent 365: DSPM y DSPM for AI (classic), AI observability page, auditing (agent-to-human, human-to-agent, agent-to-tools, agent-to-agent en unified audit log), data classification con SITs y trainable classifiers, sensitivity labels (con caveats: VIEW + EXTRACT, contenido nuevo NO hereda), encryption (NO sin sensitivity labels). Acceso: rol Compliance Administrator o Microsoft Purview Compliance Administrator.

**Objetivos de aprendizaje.**

- **OA-10.1** Identificar las capacidades Purview soportadas y las no soportadas para Agent 365. *(Recordar)*
- **OA-10.2** Habilitar DSPM for AI y navegar AI observability page. *(Aplicar)*
- **OA-10.3** Configurar data classification con SITs en prompts y respuestas de agentes. *(Aplicar)*
- **OA-10.4** Aplicar sensitivity labels a un agent instance entendiendo el límite de "contenido nuevo no hereda labels". *(Aplicar)*
- **OA-10.5** Buscar actividad de agentes en unified audit log. *(Aplicar)*

**Estructura de teoría.**

| Sección | Duración | Contenido |
|---|---|---|
| 10.1 Mapa de capabilities Purview para Agent 365 | 10 min | Tabla con soportado/no soportado y notas. |
| 10.2 DSPM y AI observability page | 20 min | Cómo se accede, qué muestra, cómo interpretar. |
| 10.3 Auditing | 15 min | Tipos de eventos. Cómo buscar. Retención. |
| 10.4 Data classification con SITs | 10 min | SITs out-of-the-box, trainable classifiers. Aplicación a prompts/responses. |
| 10.5 Sensitivity labels y sus límites | 15 min | VIEW + EXTRACT requirement. Por qué contenido nuevo no hereda. Encryption sin label = NO. |
| 10.6 Resumen | 5 min | Cierre y transición a M11. |

**Conceptos clave.** DSPM, DSPM for AI, AI observability, Sensitivity Information Type (SIT), Trainable classifier, Sensitivity label, VIEW + EXTRACT usage right, Unified audit log.

**Laboratorios.**

| Lab | Título | Duración | Dificultad |
|---|---|---|---|
| **Lab 10.1** | Habilitar DSPM y revisar AI observability | 25 min | Intermedio |
| **Lab 10.2** | Buscar actividad de un agente en unified audit log | 25 min | Intermedio |

*Lab 10.1.* Desde Microsoft Purview portal → DSPM → AI observability. Listar agent instances activos, identificar agentes con riesgo IRM. Capturar la página principal con interpretación.
*Lab 10.2.* Buscar todas las actividades del agente desplegado en Lab 08.1 en los últimos 7 días. Filtrar por tipo de evento (agent-to-human, agent-to-tools). Exportar resultados.

**Reparto a la evaluación final.** 5 preguntas (Área 4):
- 2 multiple-choice: capabilities soportadas vs no soportadas.
- 1 escenario: aplicar sensitivity label.
- 1 multiple-choice: requisitos de VIEW + EXTRACT.
- 1 query: encontrar X actividad en unified audit log.

---

### Módulo 11 — DLP, sensitivity labels y compliance

**Duración total:** 75 min · **Fase:** F5 · **Dependencias:** M10

**Resumen.** DLP policies con agent instance como user/security group; Endpoint DLP para sitios generative AI third-party; Insider Risk Management con Risky AI usage policy template (prompt injection, protected materials); Communication Compliance (Teams + emails); eDiscovery (`Type:Contains:Copilot activity`); Data Lifecycle Management (retention para Teams, OneDrive/SharePoint, emails); Compliance Manager con templates regulatorios (EU AI Act, NIST AI RMF, ISO 42001, ISO 23894, DORA).

**Objetivos de aprendizaje.**

- **OA-11.1** Crear una DLP policy que bloquee compartir SITs con un agent instance. *(Crear)*
- **OA-11.2** Habilitar Endpoint DLP para sitios generative AI no autorizados. *(Aplicar)*
- **OA-11.3** Configurar una Risky AI usage policy en Insider Risk Management. *(Aplicar)*
- **OA-11.4** Buscar actividad de Copilot/agentes en eDiscovery con la query correcta. *(Aplicar)*
- **OA-11.5** Crear retention policies para prompts y responses. *(Aplicar)*
- **OA-11.6** Identificar el regulatory template adecuado en Compliance Manager para una jurisdicción dada. *(Evaluar)*

**Estructura de teoría.**

| Sección | Duración | Contenido |
|---|---|---|
| 11.1 DLP para Agent 365 | 15 min | Especificar agent instance como user. Casos: Teams, OneDrive/SharePoint, emails. |
| 11.2 Endpoint DLP | 10 min | Sitios third-party generative AI. Bloqueo selectivo. |
| 11.3 Insider Risk Management | 15 min | Risky AI usage template. Prompt injection. Protected materials. |
| 11.4 Communication Compliance | 10 min | Teams + emails. Casos. |
| 11.5 eDiscovery | 5 min | `Type:Contains:Copilot activity`. Workflow legal hold. |
| 11.6 Data Lifecycle Management | 5 min | Retention policies. Audit log retention. |
| 11.7 Compliance Manager para AI 🟢 GA | 10 min | Templates: EU AI Act, NIST AI RMF, ISO 42001, ISO 23894, DORA. |
| 11.8 Resumen | 5 min | Cierre. |

**Conceptos clave.** DLP policy, Endpoint DLP, Insider Risk Management, Risky AI usage, Prompt injection, Communication Compliance, eDiscovery, Legal hold, Data Lifecycle Management, Compliance Manager, Regulatory template.

**Laboratorios.**

| Lab | Título | Duración | Dificultad |
|---|---|---|---|
| **Lab 11.1** | DLP que bloquea SIT credit-card en agent | 25 min | Intermedio |
| **Lab 11.2** | IRM Risky AI usage policy | 20 min | Avanzado |
| **Lab 11.3** | Compliance Manager: assessment EU AI Act | 25 min | Intermedio |

*Lab 11.1.* Crear DLP policy que bloquea compartir números de tarjeta de crédito con el agent instance del Lab 08.1. Probar con un mensaje que contenga el SIT y verificar bloqueo.
*Lab 11.2.* Configurar Risky AI usage policy detectando prompt injection. Generar evento de prueba. Validar alerta.
*Lab 11.3.* En Compliance Manager, iniciar EU AI Act assessment. Identificar 5 controles cubiertos por la activación de Agent 365 + el lab anterior. Documentar.

**Reparto a la evaluación final.** 7 preguntas (Área 4):
- 1 escenario: diseñar DLP policy.
- 1 multiple-choice: dónde se configura Endpoint DLP.
- 1 multiple-choice: query eDiscovery correcta.
- 1 multiple-choice: regulatory template apropiado.
- 1 escenario: IRM Risky AI usage triggers.
- 1 multiple-response: capacidades de Compliance Manager para AI.
- 1 multiple-choice: retention policies para prompts y responses.

---

### Módulo 12 — Monitorización, auditoría y reporting con Defender

**Duración total:** 75 min · **Fase:** F5 · **Dependencias:** M02, M07, M10

**Resumen.** Centralized monitoring de actividad de agentes en Defender. Out-of-the-box threat detections. Proactive threat hunting con Advanced Hunting (KQL) en tabla CloudAppEvents. Real-time protection durante runtime (preview): inspecciona tool invocations antes de ejecutar; bloquea XPIA (Indirect Prompt Injection) y UPIA (Direct); fail-open si no responde en 1 segundo. Defender for Cloud Apps AI Agent Inventory (Copilot Studio). Posture management. Detección de Shadow AI (OpenClaw, GitHub Copilot CLI, Claude Code) vía Intune.

**Objetivos de aprendizaje.**

- **OA-12.1** Construir queries KQL en CloudAppEvents para investigar actividad de agentes. *(Aplicar)*
- **OA-12.2** Habilitar real-time protection durante runtime y configurar el comportamiento fail-open. *(Aplicar)*
- **OA-12.3** Distinguir XPIA (Indirect Prompt Injection) vs UPIA (Direct Prompt Injection) y reconocer en logs. *(Analizar)*
- **OA-12.4** Configurar Defender for Cloud Apps AI Agent Inventory para Copilot Studio. *(Aplicar)*
- **OA-12.5** Identificar agentes Shadow AI / locales (OpenClaw, GitHub Copilot CLI, Claude Code) vía Defender + Intune. *(Aplicar)*
- **OA-12.6** Investigar un incidente con cadena de eventos relacionados (correlación). *(Evaluar)*
- **OA-12.7** Interpretar la Risks column de Registry y correlacionarla con alertas Defender. *(Analizar)*

**Estructura de teoría.**

| Sección | Duración | Contenido |
|---|---|---|
| 12.1 Centralized monitoring en Defender | 10 min | Cómo llegan los eventos. Connector. |
| 12.2 Out-of-the-box threat detections | 10 min | Tipos de alertas. Severidad. |
| 12.3 Advanced Hunting con KQL | 25 min | Tabla CloudAppEvents. ActionTypes (InvokeAgent, InferenceCall, ExecuteToolBy*). Queries de ejemplo. |
| 12.4 Real-time protection runtime 🟡 Preview | 10 min | XPIA vs UPIA. Fail-open. Cómo se inserta en runtime. |
| 12.5 Defender for Cloud Apps: AI Agent Inventory | 10 min | Inventario. Posture. Attack paths. |
| 12.6 Shadow AI / agentes locales | 5 min | Intune block policies. OpenClaw, GitHub Copilot CLI, Claude Code. |
| 12.7 Risks column ↔ Defender alerts | 5 min | Correlación. Delay de hasta 1h. |

**Conceptos clave.** CloudAppEvents, KQL, ActionType, InvokeAgent, InferenceCall, ExecuteToolBySDK, ExecuteToolByGateway, ExecuteToolByMCPServer, XPIA, UPIA, Real-time protection, Fail-open, AI Agent Inventory, Posture management, Shadow AI.

**Laboratorios.**

| Lab | Título | Duración | Dificultad |
|---|---|---|---|
| **Lab 12.1** | KQL hunting: top 10 actions por agente | 30 min | Avanzado |
| **Lab 12.2** | Real-time protection: bloquear XPIA simulado | 25 min | Avanzado |

*Lab 12.1.* En Defender → Advanced Hunting, ejecutar query:
```kql
CloudAppEvents
| where ActionType in ("InvokeAgent","InferenceCall","ExecuteToolBySDK","ExecuteToolByGateway","ExecuteToolByMCPServer")
| summarize Count = count() by ActionType, AccountObjectId
| top 10 by Count
```
Interpretar resultados. Construir variante que filtra por un agente específico.
*Lab 12.2.* Habilitar real-time protection. Simular XPIA con prompt malicioso embebido en documento. Verificar bloqueo. Probar comportamiento fail-open.

**Reparto a la evaluación final.** 7 preguntas (Área 5):
- 2 KQL: completar query para responder una pregunta dada.
- 1 multiple-choice: XPIA vs UPIA.
- 1 multiple-choice: comportamiento fail-open.
- 1 escenario: investigar incidente con cadena de eventos.
- 1 escenario: correlación Risks column ↔ alerta Defender.
- 1 multiple-choice: detección Shadow AI / agentes locales.

---

### Módulo 13 — Copilot Control System integrado con Agent 365

**Duración total:** 45 min · **Fase:** F5 · **Dependencias:** M01, M02

**Resumen.** Tres pilares CCS: Security & Governance (foundational A3/E3 + optimized A5/E5), Management Controls (licensing, message capacity, ALM, deployment), Measurement & Reporting (Copilot Analytics, Copilot Dashboard con Viva Insights). Diferencia clave: CCS gobierna a las personas usando AI; Agent 365 gobierna a los agentes mismos. Cómo se complementan (no son sustitutivos).

**Objetivos de aprendizaje.**

- **OA-13.1** Diferenciar los tres pilares CCS. *(Comprender)*
- **OA-13.2** Comparar CCS foundational vs optimized y elegir el adecuado. *(Evaluar)*
- **OA-13.3** Distinguir el ámbito de CCS (personas) del de Agent 365 (agentes) y aplicar la elección correcta a un escenario. *(Analizar)*

**Estructura de teoría.**

| Sección | Duración | Contenido |
|---|---|---|
| 13.1 Los tres pilares CCS | 15 min | Security & Governance, Management Controls, Measurement & Reporting. |
| 13.2 Foundational vs Optimized | 10 min | Qué incluye cada licencia. SharePoint Advanced Management, Adaptive Protection IRM, etc. |
| 13.3 CCS ↔ Agent 365 | 15 min | Diferencias y complementariedades. Casos: cuándo cada uno. |
| 13.4 Resumen | 5 min | Cierre. |

**Conceptos clave.** CCS, Foundational tier, Optimized tier, Copilot Analytics, Copilot Dashboard, SharePoint Advanced Management, Adaptive Protection.

**Laboratorios.**

| Lab | Título | Duración | Dificultad |
|---|---|---|---|
| **Lab 13.1** | Revisar Copilot Dashboard y mapear a CCS pillars | 20 min | Básico |

*Lab 13.1.* Acceder a Copilot Dashboard en Viva Insights. Mapear cada métrica visible a uno de los tres pilares CCS. Documentar.

**Reparto a la evaluación final.** 1 pregunta (Área 5):
- 1 escenario: CCS o Agent 365 para X problema.

---

### Módulo 14 — Gobernanza avanzada y políticas

**Duración total:** 60 min · **Fase:** F6 · **Dependencias:** M07, M08, M11, M12

**Resumen.** Plantillas Default vs Custom en profundidad. Políticas Entra (Identity Protection, Network visibility con Global Secure Access, Lifecycle), SharePoint (Restrict External Sharing, Access Control, Agent access insights, Content Permissions Insights, RCD, RAC), Purview (Audit, Know Your Data, AI compliance assessment). SharePoint Agents specifics (.agent files, permisos del archivo gobiernan acceso, Information Barriers no soportadas en embedded). Copilot Studio governance en Power Platform admin center. Registry sync con AWS Bedrock y Google Gemini Enterprise. Shadow AI page (OpenClaw).

**Objetivos de aprendizaje.**

- **OA-14.1** Componer una Custom Template con políticas extra de Entra, SharePoint y Purview. *(Crear)*
- **OA-14.2** Configurar Restricted Content Discovery (RCD) y Restricted Access Control (RAC) en SharePoint. *(Aplicar)*
- **OA-14.3** Aplicar las políticas de governance específicas para SharePoint Agents (.agent files). *(Aplicar)*
- **OA-14.4** Configurar Copilot Studio governance desde Power Platform admin center. *(Aplicar)*
- **OA-14.5** Conectar registry sync con AWS Bedrock o Google Gemini Enterprise. *(Aplicar)*
- **OA-14.6** Diseñar una estrategia de gobernanza coherente entre los 3-4 admin centers para una organización mediana. *(Crear)*

**Estructura de teoría.**

| Sección | Duración | Contenido |
|---|---|---|
| 14.1 Custom Templates en profundidad | 15 min | Componer plantilla. Casos. |
| 14.2 SharePoint Agents governance | 10 min | .agent files, permisos archivo, RCD, RAC, DLP por extensión. Limitaciones: sensitivity labels NO se aplican directamente sobre `.agent` files (solo vía extension); default ready-made SharePoint agents NO son editables. |
| 14.3 Copilot Studio governance | 10 min | Power Platform admin center. DLP, block publishing, environment routing, sharing. |
| 14.4 Registry sync multicloud 🟡 Preview | 5 min | AWS Bedrock, Google Gemini. Conexión y limitaciones. |
| 14.5 Shadow AI page 🟡 Preview | 5 min | OpenClaw, GitHub Copilot CLI, Claude Code. |
| 14.6 Diseño de estrategia coherente | 10 min | Cómo evitar inconsistencias entre admin centers. Plantilla. |
| 14.7 Resumen | 5 min | Cierre. |

**Conceptos clave.** Default Template, Custom Template, RCD (Restricted Content Discovery), RAC (Restricted Access Control), .agent file, Information Barrier, Power Platform DLP, Block agent publishing, Registry sync, Shadow AI page.

**Laboratorios.**

| Lab | Título | Duración | Dificultad |
|---|---|---|---|
| **Lab 14.1** | Crear Custom Template con 5 políticas extra | 25 min | Intermedio |
| **Lab 14.2** | RCD + RAC en SharePoint para un site sensible | 25 min | Avanzado |

*Lab 14.1.* Componer Custom Template añadiendo Restrict External Content sharing + Entra Access Package + Endpoint DLP a un agent. Aplicar a un agente publicado. Validar.
*Lab 14.2.* En SharePoint admin center, identificar un site sensible. Aplicar RCD para deshabilitar agent features. Aplicar RAC para limitar acceso a un grupo. Verificar comportamiento.

**Reparto a la evaluación final.** 2 preguntas (Área 5):
- 1 escenario: componer Custom Template para un caso.
- 1 multiple-choice: RCD vs RAC en SharePoint.

---

### Módulo 15 — Troubleshooting y casos prácticos

**Duración total:** 45 min · **Fase:** F6 · **Dependencias:** Todos los módulos anteriores

**Resumen.** Síntomas comunes y diagnóstico estructurado. "Agent not available" — license errors, can't assign license, agent not responding, OAuth2 grants pending, manifest upload errors, Beta permissions disappearing, env mismatches Copilot Studio vs producción, DLP/CA bloqueando silenciosamente. Comandos de diagnóstico: `a365 setup admin`, `a365 cleanup`, `az webapp log tail`, Graph Explorer. Tres casos prácticos integrados que combinan múltiples módulos.

**Objetivos de aprendizaje.**

- **OA-15.1** Diagnosticar 8 síntomas comunes mediante árbol de decisión. *(Analizar)*
- **OA-15.2** Aplicar comandos de diagnóstico correctos según el síntoma. *(Aplicar)*
- **OA-15.3** Resolver casos prácticos integrados que combinan identidad, accesos, DLP y monitorización. *(Crear)*

**Estructura de teoría.**

| Sección | Duración | Contenido |
|---|---|---|
| 15.1 Árbol de decisión: síntomas → diagnóstico | 10 min | "Agent not available", license errors, OAuth pending, etc. |
| 15.2 Comandos de diagnóstico | 10 min | `a365 setup admin`, `a365 cleanup`, `az webapp log tail`, Graph Explorer. |
| 15.3 Caso 1: Agente bloqueado por high risk inesperado | 10 min | Identificar la cadena causa-efecto. |
| 15.4 Caso 2: Ownerless tras hard delete del usuario | 5 min | Reasignar y limpiar lifecycle. |
| 15.5 Caso 3: Sponsor que cambia de rol | 5 min | Lifecycle workflow + sponsorship transfer. |
| 15.6 Resumen | 5 min | Cierre y prep para Módulo 16. |

**Conceptos clave.** OAuth2 grant, Manifest upload, Env mismatch, Silent block, Diagnostic command, Cause-effect chain.

**Laboratorios.**

| Lab | Título | Duración | Dificultad |
|---|---|---|---|
| **Lab 15.1** | Caso integrado 1 (resolución guiada) | 20 min | Avanzado |
| **Lab 15.2** | Caso integrado 2 (autónomo) | 25 min | Avanzado |
| **Lab 15.3** | Caso integrado 3 (autónomo, evaluable) | 30 min | Avanzado |

*Lab 15.3 es la prueba integrada del curso, evaluable, requerida para la constancia de finalización.* El alumno recibe un escenario realista con 5 problemas simultáneos. Debe identificarlos y resolverlos en un tenant de pruebas. Output: informe en 1 página con diagnóstico + acciones correctivas + medidas preventivas.

**Reparto a la evaluación final.** 1 pregunta (Área 5):
- 1 troubleshooting: dado un escenario, ordenar correctivas.

---

### Módulo 16 — Costes y optimización

**Duración total:** 45 min · **Fase:** F6 · **Dependencias:** M03

**Resumen.** Modelo per-seat Agent 365 ($15) vs consumption Copilot Studio (Copilot Credits) y Foundry (per-token). E7 vs à-la-carte ($99 vs $117). Pre-Purchase Plan P3 con CCCUs (5-20% descuento). Cuándo Agent 365 standalone vs E7. Cuándo no comprar (org con <10 agentes simples). Best practices: medir ROI en M365 admin center, registry hygiene, blocking unused agents.

**Objetivos de aprendizaje.**

- **OA-16.1** Distinguir las tres líneas de billing (per-seat, Copilot Credits, per-token) y atribuir consumo a cada una. *(Analizar)*
- **OA-16.2** Aplicar Pre-Purchase Plan P3 correctamente para optimizar coste. *(Aplicar)*
- **OA-16.3** Evaluar ROI de Agent 365 vs no contratar para una organización dada. *(Evaluar)*
- **OA-16.4** Aplicar best practices de registry hygiene para reducir coste. *(Aplicar)*

**Estructura de teoría.**

| Sección | Duración | Contenido |
|---|---|---|
| 16.1 Las tres líneas de billing | 10 min | Per-seat (Agent 365), Copilot Credits (Copilot Studio), per-token (Foundry). |
| 16.2 E7 vs à-la-carte | 10 min | $99 vs $117. Cuándo cada uno. |
| 16.3 Pre-Purchase Plan P3 con CCCUs | 10 min | Descuentos 5-20%. Cómo calcular. |
| 16.4 Cuándo NO comprar Agent 365 | 5 min | Org con pocos agentes. Alternativas. |
| 16.5 Best practices de optimización | 5 min | Registry hygiene, block unused, monitor consumption. |
| 16.6 Resumen | 5 min | Cierre del curso teórico. |

**Conceptos clave.** Per-seat, Per-token, Copilot Credits, CCCU, Pre-Purchase Plan P3, ROI, Registry hygiene.

**Laboratorios.**

| Lab | Título | Duración | Dificultad |
|---|---|---|---|
| **Lab 16.1** | Caso financiero: optimizar coste de organización mediana | 30 min | Intermedio |

*Lab 16.1.* Dado el inventario de agentes y consumo de un cliente ficticio (200 usuarios, 35 agentes mixtos), proponer la combinación óptima Agent 365 / E7 / P3 plan justificando con cifras.

**Reparto a la evaluación final.** 1 pregunta (Área 5):
- 1 escenario financiero: elegir el plan óptimo.

---

### Módulo 17 — Evaluación final

**Duración total:** 90 min · **Fase:** F7 · **Dependencias:** Todos los módulos

Estructura completa en la sección [4. Estructura de la evaluación final](#4-estructura-de-la-evaluación-final).

---

## 4. Estructura de la evaluación final

### Formato

| Atributo | Valor |
|---|---|
| Número de preguntas | 60 |
| Duración | 90 minutos |
| Aprobado | ≥ 70% (42/60) |
| Tipos | Multiple choice, Multiple response, Drag-and-drop, Ordenamiento, KQL completion, Escenario, Troubleshooting tree |
| Repaso permitido | Sí, dentro de los 90 min |
| Modalidad | Online en plataforma e-learning, monitorizado por timer; o impreso para sesiones presenciales |

### Distribución por área

| Área | Peso | Preguntas |
|---|---|---|
| 1. Plan and configure Microsoft Agent 365 | 15% | 9 |
| 2. Manage agent identities with Microsoft Entra Agent ID | 30% | 18 |
| 3. Manage the agent registry and lifecycle | 15% | 9 |
| 4. Implement data protection with Microsoft Purview | 20% | 12 |
| 5. Monitor, investigate and govern | 20% | 12 |
| **Total** | **100%** | **60** |

### Distribución por tipo de pregunta

| Tipo | Cantidad | Notas |
|---|---|---|
| Multiple choice (1 respuesta) | 30 | Preguntas conceptuales y factuales |
| Multiple response (2-3 respuestas) | 8 | Para verificar comprensión multifacética |
| Drag-and-drop | 8 | Emparejamientos componente↔admin center, capacidad↔producto |
| Ordenamiento | 4 | Secuencias de pasos (activación, ciclo de vida) |
| KQL completion | 4 | Completar query Defender en CloudAppEvents |
| Escenario | 4 | Caso realista con elección entre opciones |
| Troubleshooting tree | 2 | Árbol de decisión guiado |

### Reglas de construcción

- Cada pregunta tiene un identificador único `EX-XX-NNN` donde XX es el módulo de origen y NNN un correlativo.
- Cada pregunta debe rastrearse a un objetivo de aprendizaje específico (matriz de competencias).
- Las preguntas multiple-choice tienen 4 opciones con distractores plausibles.
- Las preguntas KQL parten de una query parcial y piden completar 1-2 partes.
- Los escenarios son de 3-5 líneas, con datos suficientes para responder y suficientemente realistas para ser interesantes.
- Las preguntas se revisan trimestralmente para retirar las que dependan de capacidades retiradas o ya no relevantes.

### Banco de preguntas

El banco completo se mantiene en `modulos/modulo-17-examen-certificacion/banco-preguntas.md`. Cada pregunta lleva: enunciado, opciones (si aplica), respuesta correcta, justificación con referencia al módulo de origen, dificultad estimada (Fácil / Media / Difícil) y objetivo de aprendizaje mapeado.

---

## 5. Matriz de competencias

> Versión inicial. Se completa en Fase 7 con los IDs específicos de cada pregunta. Aquí se reflejan los objetivos de aprendizaje agregados por área.

| Área | Objetivos de aprendizaje | # Preguntas |
|---|---|---|
| 1. Plan and configure Microsoft Agent 365 | OA-01.1 a OA-01.5; OA-02.1 a OA-02.5; OA-03.1 a OA-03.6; OA-04.1 a OA-04.4; OA-05.1 a OA-05.5 | 9 |
| 2. Manage agent identities with Microsoft Entra Agent ID | OA-06.1 a OA-06.7; OA-09.1 a OA-09.6 | 18 |
| 3. Manage the agent registry and lifecycle | OA-07.1 a OA-07.5; OA-08.1 a OA-08.6 | 9 |
| 4. Implement data protection with Microsoft Purview | OA-10.1 a OA-10.5; OA-11.1 a OA-11.6 | 12 |
| 5. Monitor, investigate and govern | OA-12.1 a OA-12.7; OA-13.1 a OA-13.3; OA-14.1 a OA-14.6; OA-15.1 a OA-15.3; OA-16.1 a OA-16.4 | 12 |

**Total:** 87 objetivos de aprendizaje cubiertos por 60 preguntas. Cada pregunta cubre 1-2 objetivos principales.

La matriz detallada con identificadores de pregunta se completa en Fase 7 al producirse el banco final.

---

## 6. Ruta de producción

Orden recomendado de redacción de los módulos durante las Fases 2-6:

```
Fase 2: Prototipo
  └── M01 ────────────► validación de calidad

Fase 3: Bloque Fundamentos & Setup
  ├── M02 (depende de M01)
  ├── M03 (depende de M02)
  ├── M04 (depende de M02)
  └── M05 (depende de M03, M04)

Fase 4: Bloque Identidad y Ciclo de vida
  ├── M06 (depende de M02, M04)
  ├── M07 (depende de M02, M05)
  ├── M08 (depende de M07)
  └── M09 (depende de M06, M08)

Fase 5: Bloque Datos, Monitorización, CCS
  ├── M10 (depende de M02, M07)
  ├── M11 (depende de M10)
  ├── M12 (depende de M02, M07, M10)
  └── M13 (depende de M01, M02)

Fase 6: Bloque Avanzado
  ├── M14 (depende de M07, M08, M11, M12)
  ├── M15 (depende de TODO lo anterior)
  └── M16 (depende de M03)

Fase 7: Evaluación
  └── M17 (depende de TODO)
```

**Banco de preguntas.** Se construye **incrementalmente**: cada módulo aporta sus N preguntas al producirse, no se deja para Fase 7. En Fase 7 se hace la revisión integral del banco, balanceo de dificultad, y validación final de la matriz de competencias.

**Capturas de pantalla.** Se producen al final de cada módulo, no durante la redacción inicial. Esto evita capturas obsoletas si Microsoft cambia el UI durante la producción.

**Diagramas SVG.** Se producen junto con la redacción del módulo, son texto versionable y rara vez quedan obsoletos.

**Validación de cada módulo.** Antes de mergear el PR del módulo:
- Revisión de tono y consistencia con `docs/convenciones-redaccion.md`
- Validación de URLs (todas las referencias a learn.microsoft.com deben resolver)
- Validación de que las afirmaciones técnicas tienen fuente
- Validación de que los laboratorios son ejecutables en un tenant Frontier preview o E5+Copilot
- Validación de que las preguntas aportadas al banco están mapeadas en la matriz

---

> **Próximo paso.** Una vez aprobado este blueprint, arranca la **Fase 2** con la producción del Módulo 1 al 100% como prototipo de calidad.
