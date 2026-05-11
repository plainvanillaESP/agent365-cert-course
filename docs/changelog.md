# Changelog

Registro de cambios significativos en la producción del curso.

Formato: `YYYY-MM-DD — [Tipo] Descripción`

Tipos: `[Setup]` `[Investigación]` `[Diseño]` `[Contenido]` `[Build]` `[Fix]` `[Docs]`

---

## 2026-05-11

- `[Contenido]` Fase E.8 — M14 cerrado en un único PR: teoría + labs + quiz + manifest + 2 preguntas al banco (PR #?). M14 (Gobernanza avanzada y multi-tenant) queda **producido**. **Banco oficial alcanza el 97 %** (58/60 preguntas). Módulo intermedio producido en un único PR (mismo patrón que E.7 con M13).
  - **`teoria.md`** (~440 líneas, 5 secciones, 60 min lectura):
    - 14.1 Topologías multi-tenant comunes (las 4 topologías canónicas: parent/subsidiary, M&A en curso, MSP/MSSP, joint venture; implicaciones específicas para Agent 365 en cada una).
    - 14.2 Delegated administration cross-tenant (Microsoft Entra B2B, GDAP con scope + duración + audit + customer consent, Customer Lockbox, patrón recomendado de doble pertenencia controlada).
    - 14.3 Políticas cross-tenant (el reto regulatorio multi-jurisdiccional, el modelo de policy framework distribuido, 3 ejes de alineación: ético/operacional/tecnológico).
    - 14.4 Federation models (centralizado, federado, hub-and-spoke con tabla de decisión completa; hub-and-spoke como modelo más común en organizaciones modernas).
    - 14.5 Operación del ciclo de gobernanza distribuida (comité central + comités locales, reporting agregado en 3 vistas, integración con auditoría externa anual con 4-6 semanas de preparación).
    - Glosario inline de 16 términos clave.
  - **`laboratorios.md`** completos (~420 líneas, 2 labs, 60 min total):
    - LAB-14-1 (30 min) — Configurar delegated administration cross-tenant con GDAP + Customer Lockbox: crear GDAP relationship entre HQ y Subsidiary-EU con roles `Security Reader` + `Compliance Administrator` + `Copilot Administrator` (NO Global Admin), 180 días, activar Customer Lockbox con aprobadores designados, test funcional completo del flow B2B + GDAP + Lockbox, validación del audit log con cadena completa de acciones cross-tenant.
    - LAB-14-2 (30 min) — Diseñar policy framework distribuido para 3 tenants regulatorios distintos (InternationalManufacturing-Corp en Alemania + US + Brasil): framework global con 5 principios mínimos + KPIs canónicos + vocabulario común, adaptaciones por tenant respetando GDPR/AI Act/BetrVG/CCPA/SOX/HIPAA/LGPD, ciclo de gobernanza con comités, plan de rollout 16 semanas, validación cruzada con regulación.
  - **`quiz-practica.md`** con 5 preguntas Q-14-1..Q-14-5 cubriendo los 5 OAs en los 5 tipos del parser (drag-and-drop, multiple-response, scenario, multiple-choice, ordering). Caso de estudio de refuerzo: **Iberdrola-Avangrid** (grupo energético global con 40K empleados, operación en 5 países con reguladores propios) — diseño del modelo operativo cross-tenant 12 meses con federation model hub-and-spoke, framework global con 6 principios + 7 KPIs canónicos, calendario de 7 auditorías a lo largo del año, dashboard mensual al Consejo con 3 vistas.
  - **`recursos.md`** con URLs de Microsoft Learn (multi-tenant overview, cross-tenant access, GDAP completo con roles y migración desde DAP, Customer Lockbox, Agent 365 multi-tenant), referencia regulatoria (EU AI Act, GDPR, LGPD, CCPA/CPRA, NIST AI RMF), frameworks (COBIT 2019, ITIL 4, ISO/IEC 42001:2023), lecturas adicionales (Microsoft Trust Center, Gartner Magic Quadrant, MIT Sloan).
  - **`module.yaml`** completo: `estado: producido`, `duracion_min: 132` (60 teoría + 12 quiz + 60 labs), 5 OAs cubriendo Comprender, Aplicar, Crear, Analizar; 16 términos glosario; prerrequisitos M01 + M06 + M09 + M12 + M13; secciones completas; lista `laboratorios:` con los 2 IDs; `preguntas_aporta_examen_final: 2`.
  - **`banco-examen.md`**: añadidas 2 preguntas EX-14-001..002 cubriendo OA-14.2 (configuración MSP correcta) y OA-14.4 (federation model para grupo bancario multi-país). Banco oficial pasa de **56 a 58** preguntas (**97 %** completo). Tabla de distribución actualiza M14 a `Completo`.
  - **`README.md`** del directorio actualizado con estado producido.
  - **`platform/src/lib/course.ts`**: M14 cambia a `estado: 'producido'` con `duracionMin: 132`.
  - **`lib/quiz.ts` no requiere cambios** — beneficio operativo continuado del Bloque D.1. Verificado con `parseQuizMarkdown` → 5 preguntas Q-14 en los 5 tipos correctos.
- `[Build]` Validador `scripts/validate-course.py` reporta 275 checks OK · 0 warnings · 0 errors. `npx tsc --noEmit` sin errores. Build Vite OK 1.65s.

**Hito alcanzado — M14 completo. Banco al 97 %.** Con M01-M14 producidos, **14 de 16 módulos del temario están listos (87.5 %)** y el banco oficial alcanza 58/60 preguntas. Solo faltan **2 preguntas** para completar el banco (M15 aporta 1, M16 aporta 1). Próximo módulo: M15 (Troubleshooting y operación).

 M13 (Copilot Control System integrado con Agent 365) queda **producido**. **Banco oficial alcanza el 93 %** (56/60 preguntas). Módulo compacto producido en un solo PR (no necesita división E.7 + E.8 como módulos previos por su menor volumen: 1 sola pregunta al banco, 5 OAs, 2 labs).
  - **`teoria.md`** (~310 líneas, 5 secciones, 45 min lectura):
    - 13.1 ¿Qué es y dónde encaja CCS? (el problema que resuelve, posicionamiento con tres reglas mnemotécnicas «CCS controla / Defender XDR detecta / Purview protege el dato», por qué tiene su propio portal con público objetivo distinto).
    - 13.2 Las cuatro superficies operativas (License management, Agent governance, Data governance integration, Telemetry — cada una con la pregunta de negocio que responde y sus capacidades concretas).
    - 13.3 Configurar políticas centralizadas de adopción (los tres modelos canónicos Open / Curated / Approval-based, configuración paso a paso del Curated catalog, telemetría de políticas con compliance rate + friction + coverage).
    - 13.4 CCS, Defender XDR y Purview: diferenciación operativa (tabla de decisión rápida con 8 situaciones canónicas + tres anti-patrones a evitar).
    - 13.5 Operación del día a día (ritual semanal de 30-45 min los lunes con 5 actividades, reporte mensual al comité de gobernanza con 4 secciones, integración con el ciclo de gobernanza corporativa).
    - Glosario inline de 12 términos clave.
  - **`laboratorios.md`** completos (~250 líneas, 2 labs, 60 min total):
    - LAB-13-1 (30 min) — Configurar política Curated catalog y validar compliance rate: política `Marketing-Europe-Curated-2026Q2` con allowlist de 5 agentes, validación empírica de bloqueos, medición de compliance rate + friction + coverage después de 24-48h, ajustes iniciales según KPIs.
    - LAB-13-2 (30 min) — Generar el reporte mensual al comité de gobernanza desde CCS: flujo completo (definir periodo y audiencia → generar reporte automático → añadir narrativa ejecutiva a cada sección → validación cruzada con Defender XDR + Purview → exportar PDF + PPTX para distribución → documentar decisiones post-comité).
  - **`quiz-practica.md`** con 5 preguntas Q-13-1..Q-13-5 cubriendo los 5 OAs en los 5 tipos del parser (multiple-choice, drag-and-drop, scenario, multiple-response, ordering). Caso de estudio de refuerzo: **Telefónica** (97K empleados, 12 países) — calendario operativo anual de gobernanza de IA con rituales semanal/mensual/trimestral/anual, 3 KPIs ejecutivos al Consejo de Administración, plan de evolución del modelo de política Approval-based → Curated → Open con criterios objetivos para cada transición.
  - **`recursos.md`** con URLs de Microsoft Learn (CCS overview + License management + Agent governance + Data governance + Telemetry + Monthly governance report), documentación de diferenciación con Defender XDR y Purview, blogs oficiales, lecturas adicionales (Gartner Magic Quadrant AI Governance, MIT Sloan), herramientas (Graph PowerShell Copilot module, Power BI Copilot Reports template).
  - **`module.yaml`** completo: `estado: producido`, `duracion_min: 117` (45 teoría + 12 quiz + 60 labs), 5 OAs cubriendo Bloom Comprender, Aplicar, Analizar; 12 términos glosario; prerrequisitos M01 + M06 + M09 + M12; secciones completas; lista `laboratorios:` con los 2 IDs; `preguntas_aporta_examen_final: 1`.
  - **`banco-examen.md`**: añadida 1 pregunta EX-13-001 cubriendo OA-13.4 (diferenciación operativa CCS vs Defender XDR vs Purview en escenario compuesto con 3 situaciones simultáneas). Banco oficial pasa de **55 a 56** preguntas (**93 %** completo). Tabla de distribución actualiza M13 a `Completo`.
  - **`README.md`** del directorio actualizado con estado producido y enlace a archivos.
  - **`platform/src/lib/course.ts`**: M13 cambia a `estado: 'producido'` con `duracionMin: 117`.
  - **`lib/quiz.ts` no requiere cambios** — beneficio operativo continuado del Bloque D.1. Verificado con `parseQuizMarkdown` → 5 preguntas Q-13 en los 5 tipos correctos.
- `[Build]` Validador `scripts/validate-course.py` reporta 274 checks OK · 0 warnings · 0 errors. `npx tsc --noEmit` sin errores. Build Vite OK 2.55s.

**Hito alcanzado — M13 completo. Banco al 93 %.** Con M01-M13 producidos, **13 de 16 módulos del temario están listos (81 %)** y el banco oficial alcanza 56/60 preguntas. Solo faltan **4 preguntas** para completar el banco (M14 aporta 2, M15 aporta 1, M16 aporta 1). Próximo módulo: M14 (Gobernanza avanzada y multi-tenant).

 M12 (Monitorización, auditoría y reporting con Microsoft Defender XDR) queda **producido**. El alumno puede recorrer el módulo completo (teoría 90 min + quiz 20 min + 4 labs 110 min). **Banco oficial alcanza el 92 %** (55/60 preguntas).
  - **`laboratorios.md`** completos (~485 líneas, 4 labs, 110 min total):
    - LAB-12-1 (30 min) — Escribir y validar las 3 queries KQL canónicas en Advanced Hunting (volumen anómalo 5x baseline, exfiltración > 30 docs + > 5 outputs, compromiso de identidad > 2 IPs nuevas + > 3 useragents). Documentar thresholds, FP rate, next-review date.
    - LAB-12-2 (25 min) — Promover query 2 a custom detection rule operativa con severidad calibrada (High), entity extraction (AgentId, AccountUpn), MITRE ATT&CK mapping (T1567, T1078.004), acciones automatizadas medidas (solo notify en día 1, disable agente tras 2-3 meses con FP < 1 %).
    - LAB-12-3 (25 min) — Conectar Defender XDR con Sentinel, configurar Long-Term Retention 7 años, crear playbook `pb-Agent365-Compromise-Containment` con 6 steps (parse, disable agent vía Graph API, revoke tokens, notify owner, ServiceNow P1, add comment) y automation rule que lo dispara.
    - LAB-12-4 (30 min) — Investigación end-to-end de incidente simulado: recopilación de evidencia inicial, construcción de timeline con KQL `CorrelationId`, correlación cross-product (Identity Protection, Endpoint, DLP, CC), formulación de 2-3 hipótesis con evidencia, validación con stakeholders, decisión de contención adicional, post-mortem formal con timeline + causa raíz + impacto + acciones + lecciones aprendidas + mejoras con owner y fecha.
  - **`quiz-practica.md`** con 7 preguntas Q-12-1..Q-12-7 cubriendo los 7 OAs en los 5 tipos del parser (multiple-choice, scenario, multiple-response, drag-and-drop, ordering). Caso de estudio de refuerzo: **BBVA** (115K empleados, regulación bancaria europea estricta) — diseño completo del dashboard CISO mensual al Consejo de Riesgos con 10 KPIs en 4 secciones, 3 playbooks adicionales y SLA del SOC para respuesta al regulador.
  - **`banco-examen.md`**: añadidas 7 preguntas EX-12-001..007 cubriendo los OAs 12.1, 12.2, 12.3, 12.4, 12.5, 12.6 y 12.7. Banco oficial pasa de **48 a 55** preguntas (**92 %** completo). **Nueva Área 5 «Monitor, troubleshoot and improve Microsoft Agent 365»** inaugurada en el banco. Tabla de distribución actualiza M12 a `Completo`.
  - **`module.yaml`** de M12 cerrado: `estado: producido`, `duracion_min: 220` (90 teoría + 20 quiz + 110 labs), secciones completas, lista `laboratorios:` poblada con los 4 IDs.
  - **`platform/src/lib/course.ts`**: M12 cambia a `estado: 'producido'` con `duracionMin: 220`.
  - **`lib/quiz.ts` no requiere cambios** — el parser markdown introducido en D.1 captura las 7 preguntas Q-12 automáticamente. Verificado con `parseQuizMarkdown` → 7 preguntas en los 5 tipos correctos.
- `[Build]` Validador `scripts/validate-course.py` reporta 273 checks OK · 0 warnings · 0 errors. `npx tsc --noEmit` sin errores. Build Vite OK 2.03s.

**Hito alcanzado — M12 completo. Banco al 92 %.** Con M01-M12 producidos, **12 de 16 módulos del temario están listos (75 %)** y el banco oficial alcanza 55/60 preguntas. Solo faltan 5 preguntas para completar el banco (M13 aporta 1, M14 aporta 2, M15 aporta 1, M16 aporta 1). Próximo módulo en cola: M13 (Copilot Control System integrado con Agent 365).

 M12 (Monitorización, auditoría y reporting con Microsoft Defender XDR) **abre el Área 5 del examen** (Monitor, troubleshoot and improve, peso 25 %). Aporta 7 preguntas al banco oficial — el módulo de Área 5 con más peso. Mismo patrón B.1 / E.1 / E.3: contenido pedagógico voluminoso (teoría + recursos + manifest) en este PR; labs + quiz + 7 preguntas EX llegan en E.6.
  - **`teoria.md`** completa (~660 líneas, 7 secciones, 90 min lectura):
    - 12.1 Posicionamiento: Defender XDR como red de seguridad (las cinco capas en serie M09-M11-M12; por qué la prevención no basta; componentes de Defender XDR relevantes para Agent 365).
    - 12.2 El portal Defender XDR para agentes (Incidents como unidad de trabajo, Alerts comunes, Advanced hunting, Custom detection rules, Threat analytics).
    - 12.3 La tabla `CloudAppEvents` y campos enriquecidos (esquema completo, query base, latencia de ingestión 2-10 min, retención por defecto y con Sentinel LTR hasta 12 años).
    - 12.4 Hunting con KQL: 5 queries fundamentales (top N invocaciones, accesos por usuario y sensitivity, nuevas geografías, outputs con sensitivity alta, correlación por `correlationId`).
    - 12.5 Tres patrones problemáticos canónicos con queries KQL completas (volumen anómalo con threshold 5x baseline, exfiltración con > 30 archivos sensibles + > 5 outputs en 2h, compromiso de identidad con > 2 IPs nuevas + > 3 useragents distintos).
    - 12.6 Custom detection rules: anatomía completa, calibración de severidad (no todo es High), acciones automatizadas y umbrales operativos (2-3 meses con FP < 1 % antes de automatizar acciones disruptivas).
    - 12.7 Integración con Microsoft Sentinel (conector nativo, workspace operativo + LTR, tres playbooks canónicos `AgentCompromise-Containment` / `DLPMassOverride-Investigation` / `AgentMassDownload-Forensic`, correlación cross-tenant).
    - Glosario inline de 15 términos clave.
  - **`recursos.md`** con URLs de Microsoft Learn (Defender XDR overview + portal + integración con Agent 365; CloudAppEvents reference + Advanced hunting + límites + biblioteca de queries oficiales; KQL quick reference + tutorial + best practices; Custom detection rules + entity extraction; Sentinel completo con conector + playbooks + LTR + cross-tenant; Defender for Identity alerts para Agent ID), repositorios públicos (Azure-Sentinel GitHub, Sentinel Content Hub, comunitario M365 Defender Hunting Queries), blogs oficiales, lecturas adicionales (MITRE ATT&CK, NIST SP 800-61 Rev. 2, CISA Threat Intelligence Lifecycle) y herramientas (Defender PowerShell, Graph PowerShell Security, Azure CLI Sentinel extension, KQL Magic for Jupyter, VS Code Kusto extension).
  - **`module.yaml`** con los 7 OAs cubriendo Bloom Comprender, Aplicar, Crear, Analizar; 15 términos de glosario; prerrequisitos M01 + M06 + M09 + M10 + M11 (toda la cadena previa de Áreas 1, 2 y 4); `estado: produciendo`, `fase_produccion: 3`, `preguntas_aporta_examen_final: 7`.
  - **`README.md`** del directorio actualizado con nota sobre KQL como prerrequisito de facto.
  - Borrado: placeholders `evaluacion.md`, `laboratorios.md` originales.
- `[Build]` Validador `scripts/validate-course.py` reporta 270 checks OK · 0 warnings · 0 errors. Build Vite OK 2.47s.

 M11 (DLP, sensitivity labels avanzadas y Communication Compliance) queda **producido**. El alumno puede recorrer el módulo completo (teoría 90 min + quiz 20 min + 4 labs 100 min). **Banco oficial alcanza el 80 %** (48/60 preguntas).
  - **`laboratorios.md`** completos (~390 líneas, 4 labs, 100 min total):
    - LAB-11-1 (25 min) — Configurar DLP policy con location `Microsoft Agent 365 outputs` para bloquear con override outputs con SITs financieras, modo Test → producción, audit log validado.
    - LAB-11-2 (30 min) — Entrenar custom trainable classifier `Custom-MA-Conversations` con dataset balanceado, calibrar precision/recall ≥ 80/70 %, promover a producción en DLP policy en audit only.
    - LAB-11-3 (25 min) — Conectar Microsoft Defender for Cloud Apps a Salesforce sandbox, configurar DLP cross-SaaS con location MDA, validar con evento simulado, Cloud Discovery de shadow IT, session policy opcional.
    - LAB-11-4 (20 min) — Configurar Communication Compliance para detectar lenguaje regulado en outputs de agente de research, definir grupo reviewers, simular match, workflow Resolve/Escalate, reporte semanal.
  - **`quiz-practica.md`** con 7 preguntas Q-11-1..Q-11-7 cubriendo los 7 OAs en los 5 tipos del parser (multiple-choice, scenario, multiple-response, drag-and-drop, ordering). Caso de estudio de refuerzo: **Banco Santander** (200K+ empleados, regulación CNMV/ESMA) — diseño completo de programa DLP + CC con 5 policies prioritarias, 3 classifiers custom y reporting CISO con KPI específico de banca.
  - **`banco-examen.md`**: añadidas 7 preguntas EX-11-001..007 cubriendo los OAs 11.1, 11.2, 11.3, 11.4, 11.5, 11.6 y 11.7. Banco oficial pasa de **41 a 48** preguntas (**80 %** completo). Tabla de distribución actualiza M11 a `Completo`.
  - **`module.yaml`** de M11 cerrado: `estado: producido`, `duracion_min: 210` (90 teoría + 20 quiz + 100 labs), secciones completas, lista `laboratorios:` poblada con 4 IDs.
  - **`platform/src/lib/course.ts`**: M11 cambia a `estado: 'producido'` con `duracionMin: 210`.
  - **`lib/quiz.ts` no requiere cambios** — el parser markdown introducido en D.1 captura las 7 preguntas Q-11 automáticamente. Verificado con `parseQuizMarkdown` → 7 preguntas en los 5 tipos correctos.
- `[Build]` Validador `scripts/validate-course.py` reporta 272 checks OK · 0 warnings · 0 errors. `npx tsc --noEmit` sin errores. Build Vite OK 2.35s.

**Hito alcanzado — M11 completo. Banco al 80 %.** Con M01-M11 producidos, **11 de 16 módulos del temario están listos (69 %)** y el banco oficial al 80 %. Faltan 12 preguntas para completar el banco (M12 aporta 7, M13-M16 aportan 5 más). Próximo módulo en cola: M12 (Microsoft Defender XDR aplicado a agentes — la pieza que cierra el Área 4 con detección e investigación cuando algo se cuela a pesar de la prevención).

 M11 (DLP, sensitivity labels avanzadas y Communication Compliance) es el módulo más voluminoso del Área 4 del examen (7 preguntas al banco oficial, frente a 5 de M10). Mismo patrón B.1 / E.1: contenido pedagógico voluminoso en este PR; labs + quiz + 7 preguntas EX llegan en E.4.
  - **`teoria.md`** completa (~600 líneas, 7 secciones, 90 min lectura):
    - 11.1 DLP vs Information Protection: dónde está la frontera (las dos preguntas que se reparten, complementariedad en una invocación, capacidades exclusivas de DLP).
    - 11.2 Anatomía de una DLP policy para agentes (locations soportadas incluyendo la nueva `Microsoft Agent 365 outputs`, conditions con SITs + classifiers + labels + keywords + fingerprinting + context, actions con tabla operativa audit/block/justify/override, user experience con policy tip + block message + justification reasons).
    - 11.3 Trainable classifiers: classifiers built-in (`OffensiveLanguage`, `Harassment`, `Threats`, `ContractDocuments`, `FinancialReports`, etc.), flujo de entrenamiento custom de 6 pasos con métricas precision/recall, combinaciones AND/OR en policies.
    - 11.4 DLP en runtime para outputs (diagrama de flujo técnico, latencia añadida 200-800 ms para outputs típicos, flujo de override con justificación documentado paso a paso, cobertura input-side / mid-flight / output-side).
    - 11.5 Integración con Microsoft Defender for Cloud Apps (catálogo de 30+ conectores, DLP cross-SaaS con ejemplo YAML, Cloud Discovery para shadow IT, session policies en modo reverse proxy).
    - 11.6 Communication Compliance: el agente como participante regulado (por qué los agentes están en scope, configuración de policy completa, workflow de revisión de 5 pasos, ejemplos por industria — banca, sanidad, defensa, HR).
    - 11.7 Operación del día a día (triaje semanal con 5 puntos, exclusiones temporales con expiración automática, reporte mensual al CISO con las 4 preguntas clave, 3 errores operacionales comunes a evitar).
    - Glosario inline de 16 términos clave.
  - **`recursos.md`** con URLs de Microsoft Learn (DLP overview, plan, policy reference, integración con Agent 365; trainable classifiers definitions + custom guide + best practices; CC overview + plan + integración con agentes; MDA overview + connectors + session policies + Cloud Discovery + integración con Purview DLP), blogs oficiales, lecturas adicionales (CIS Controls v8 Control 3, NIST SP 800-53 AC/SC, MITRE ATT&CK TA0010 Exfiltration) y herramientas (Purview Compliance PowerShell, Graph PowerShell Compliance, MDA REST API).
  - **`module.yaml`** con los 7 OAs cubriendo Bloom Comprender, Aplicar, Crear, Analizar; 16 términos de glosario; prerrequisitos M01 + M09 + M10 (cadena de M09 → M10 → M11); `estado: produciendo`, `fase_produccion: 3`, `preguntas_aporta_examen_final: 7`.
  - **`README.md`** del directorio actualizado.
  - Borrado: placeholders `evaluacion.md`, `laboratorios.md` originales.
- `[Build]` Validador `scripts/validate-course.py` reporta 269 checks OK · 0 warnings · 0 errors. Build Vite OK 1.85s.

 M10 (Microsoft Purview y protección de datos en Agent 365) queda **producido**. El alumno puede recorrer el módulo completo (teoría 75 min + quiz 15 min + 4 labs 90 min) y las 5 preguntas EX-10 quedan disponibles para el examen final.
  - **`laboratorios.md`** completos (~310 líneas, 4 labs, 90 min total):
    - LAB-10-1 (20 min) — Aplicar sensitivity label `Confidential` a un blueprint y verificar empíricamente la herencia automática en outputs (cifrado, watermark, audit event `AgentSensitivityLabelInherited`).
    - LAB-10-2 (25 min) — Activar DSPM for AI por primera vez en el tenant, configurar los cuatro paneles principales, definir una alerta operativa con destinatarios y documentar 3+3 hallazgos prioritarios.
    - LAB-10-3 (20 min) — Búsqueda forense en eDiscovery Premium filtrada por `agentId`: simular solicitud regulatoria, añadir custodian, búsqueda con filtros sensitivityLabel, custodian hold, export forense.
    - LAB-10-4 (25 min) — Diseño end-to-end coherente Purview + Conditional Access para agente de Tesorería autonomous: seis capas en serie (blueprint con label → CA → Identity Protection → Information Protection → DSPM → eDiscovery) con plan de validación.
  - **`quiz-practica.md`** con 6 preguntas Q-10-1..Q-10-6 cubriendo los 6 OAs del módulo en los 5 tipos canónicos del parser (multiple-choice, scenario, multiple-response, drag-and-drop, ordering). Caso de estudio de refuerzo: **Pernod Ricard** (Tasting-Notes-Assistant — diseño de dashboard CISO semanal con KPIs, endpoints de Graph, thresholds operativos y SLAs).
  - **`banco-examen.md`**: añadidas 5 preguntas EX-10-001..005 cubriendo los OAs 10.1, 10.2, 10.3, 10.4 y 10.5. Banco oficial pasa de **36 a 41** preguntas (68 % completo). Nueva **Área 4 «Implement data protection with Microsoft Purview»** inaugurada en el banco. Tabla de distribución actualiza M10 a `Completo`.
  - **`module.yaml`** de M10 cerrado: `estado: producido`, `duracion_min: 183` (75 teoría + 18 quiz + 90 labs), secciones completas (teoria + quiz-practica + laboratorios + recursos), lista `laboratorios:` poblada con los 4 IDs.
  - **`platform/src/lib/course.ts`**: M10 cambia a `estado: 'producido'` con `duracionMin: 183`.
  - **`lib/quiz.ts` no requiere cambios**: el parser markdown introducido en D.1 captura las 6 preguntas Q-10 automáticamente. Verificado con `parseQuizMarkdown` → 6 preguntas en los 5 tipos correctos.
- `[Build]` Validador `scripts/validate-course.py` reporta 271 checks OK · 0 warnings · 0 errors. `npx tsc --noEmit` sin errores. Build Vite OK 2.64s.

**Hito alcanzado — M10 completo.** Área 4 del examen abierta (peso 20 %). Con M01-M09 + M10 producidos, **10 de 16 módulos del temario están listos** (62 %). El alumno puede recorrer la mayor parte del curso aplicando ya el motor de progreso (D.4 con desbloqueo secuencial). Próximo módulo en cola: M11 (DLP y compliance, 7 preguntas EX al banco — el más voluminoso del Área 4).

 Mismo patrón que B.1: contenido pedagógico voluminoso (teoría 75 min + glosario + recursos) en este PR; labs + quiz + 5 preguntas al banco llegan en E.2.
  - **`teoria.md`** completa (~530 líneas, 6 secciones, 75 min lectura):
    - 10.1 Por qué Purview con Agent 365 (gap que cubre respecto a CA, las tres preguntas que Purview responde, componentes que aplican a agentes).
    - 10.2 DSPM for AI (cuatro paneles del dashboard, comportamiento típico post-GA, detección automática vía SITs y labels existentes, acciones desde el dashboard).
    - 10.3 Sensitivity labels y archivos `.agent` (aplicación a archivos, herencia automática en outputs, labels sobre blueprints, auto-labeling).
    - 10.4 Trazabilidad por agente (eventos `AgentInvoke`, `AgentDataAccess`, `AgentOutputGenerated` con campos enriquecidos; retención hasta 10 años con Audit Premium; búsquedas en eDiscovery Premium con KQL filtrable por `agentId`).
    - 10.5 Information protection en outputs (cifrado AES-256 automático, watermark con UPN, restricciones de compartición, Endpoint DLP en la última milla).
    - 10.6 Operaciones del día a día (triaje semanal DSPM, auditoría mensual de outputs, respuesta a solicitud regulatoria, revisión trimestral de policies).
    - Glosario inline de 14 términos clave.
  - **`recursos.md`** con URLs de Microsoft Learn (Purview overview, DSPM for AI, Audit Premium, eDiscovery Premium, SITs reference, Endpoint DLP), blogs oficiales (Purview Tech Community, anuncio de integración con Agent 365), lecturas adicionales (NIST AI RMF, ISO/IEC 42001, GDPR Art. 22) y herramientas (Graph PowerShell, IPP module, Compliance portal).
  - **`module.yaml`** con los 6 OAs cubriendo Comprender, Aplicar, Analizar, Crear; 14 términos de glosario; prerrequisitos M01+M06+M09; `estado: produciendo`, `fase_produccion: 2`, `preguntas_aporta_examen_final: 5`.
  - **`README.md`** del directorio actualizado.
  - Borrado: placeholders `evaluacion.md`, `laboratorios.md` originales.
- `[Build]` Validador `scripts/validate-course.py` reporta 268 checks OK · 0 warnings · 0 errors. Build Vite OK 3.13s.

 **Cierra el Bloque D**. El alumno avanza por defecto módulo a módulo (M02 desbloqueado al completar M01, etc.) y puede activar un override «modo acceso libre» desde `/progreso` si prefiere saltarse el orden.
  - **`lib/progress.ts`** extendido:
    - Nuevo tipo `AccessMode = 'sequential' | 'free'` con default `'sequential'`.
    - Nuevas funciones `getAccessMode()` y `setAccessMode(mode)` que persisten en `agent365-access-mode` y disparan el evento de progreso.
    - Nueva función pura `isModuleUnlocked(moduleId, mode, producedIds, completedIds)`: M01 siempre desbloqueado; en modo `sequential`, un módulo se desbloquea cuando todos los módulos producidos con id menor están completos. En modo `free`, todos accesibles. Los módulos no producidos se ignoran en el cálculo.
    - `clearAllProgress` ahora limpia también el modo de acceso (vuelve a secuencial).
  - **`useModuleProgress.ts`** extendido con dos hooks:
    - `useAccessMode()`: tupla `[mode, setMode]` reactiva.
    - `useUnlockState()`: devuelve `{ mode, isUnlocked(moduleId) }` aplicando el cálculo a los snapshots actuales del curso. Una llamada por consumidor; el resultado es estable mientras no cambien progreso o modo.
  - **`ModulePage.tsx`**: gate de acceso. Si el módulo está bloqueado, redirige a `/progreso?locked={N}` para que la página pueda mostrar un mensaje explicativo, en lugar de un toast efímero. La URL queda guardable en bookmarks: al desbloquear, el mensaje desaparece naturalmente.
  - **`ProgressPage.tsx`** ampliada:
    - **Banner contextual** en la parte superior cuando llega vía `?locked={N}`, identifica el módulo y explica cómo desbloquearlo.
    - **Toggle «Modo de acceso»** al pie con switch accesible (`role="switch"`, `aria-checked`), copy diferenciado por modo, y badge con el modo activo.
    - `findNextStep` respeta el desbloqueo: solo sugiere módulos accesibles. Si todos los desbloqueados están completos, no muestra próximo paso.
    - Las filas de módulo distinguen tres estados: `pendiente` (no producido), `bloqueado` (producido pero locked en sequential), `disponible` (producido + unlocked). Cada estado tiene su badge.
  - **`NavSidebar.tsx`**: módulos producidos pero bloqueados se renderizan en gris con icono de candado y tooltip explicativo, sin enlace.
  - **`HomePage.tsx`**: misma diferenciación de estados en la tabla del temario: «Disponible» (verde), «Bloqueado» (ámbar), «Fase N» (gris).
- `[Build]` Validador `scripts/validate-course.py` reporta 270 checks OK · 0 warnings · 0 errors. `npx tsc --noEmit` sin errores. Build Vite OK 1.28s.

**Hito alcanzado — Bloque D cerrado.** El motor de progreso del alumno es funcionalmente completo: tracking por sección, criterios de finalización, vista global de progreso, próximo paso recomendado y desbloqueo secuencial con override. Lo único pendiente para «modo curso real con persistencia cross-device» es Supabase + auth (Bloque F).

 Tercer de cuatro entregas del Bloque D. Aterriza el motor de progreso de D.2 en una página visible: el alumno ve su avance por módulo y por área, y un card destacado «Próximo paso» que apunta a la primera sección pendiente.
  - **Nueva `platform/src/pages/ProgressPage.tsx`** (~290 líneas):
    - Hero con barra de progreso global y conteo `X / N módulos completos · pct%`.
    - **Card «Tu próximo paso»**: identifica el primer módulo producido no completo y dentro de él la primera sección pendiente (orden `teoria → quiz-practica → laboratorios → recursos`). Se oculta cuando todo está completo.
    - **Progreso por área del examen**: agrupación de módulos por área con peso del examen (15/30/15/20/20 %), conteo de completados por área y porcentaje.
    - **Mini-badges por módulo**: fila de 4 iconos (uno por sección) con tres estados visuales (`completed` verde con check, `in-progress` ámbar con icono, `not-started` neutral con icono). Tooltip nativo con el estado en texto.
    - **Módulos pendientes de producción**: aparecen en gris con badge «Pendiente» y candado, sin enlace.
    - **Zona de reinicio**: botón discreto al pie con confirmación inline destructiva. Llama a `clearAllProgress` del motor.
  - **`App.tsx`**: ruta nueva `/progreso`.
  - **`Header.tsx`**: enlace «Progreso» en la barra superior con icono `Activity`, visible en todas las páginas. Label oculto en móvil para ahorrar espacio.
  - **Bonus**: corregido `course.ts` con `estado: 'producido'` para M09 (estaba como `pendiente` aunque B.2 lo cerró) y `duracionMin: 183` (era `75` antes de añadir labs+quiz).
- `[Build]` Validador `scripts/validate-course.py` reporta 270 checks OK · 0 warnings · 0 errors. `npx tsc --noEmit` sin errores. Build Vite OK 2.20s.

 Empieza a tracker el avance del alumno por sección y módulo, sin desbloqueo (eso llega en D.4).
  - **Nuevo `platform/src/lib/progress.ts`** (~270 líneas): tipos `SectionStatus` (`not-started` / `in-progress` / `completed`), `SectionState`, `ModuleProgressSnapshot`. Funciones puras `readModuleProgress`, `markSectionVisited`, `clearAllProgress`, `subscribeProgressChanges`. Constantes públicas `THEORY_THRESHOLD_PCT = 80` y `QUIZ_PASS_RATIO = 0.7`.
  - **Criterios de finalización por sección**: teoría completa cuando el scroll máximo alcanza ≥80 % (lectura del `agent365-reading-m{N}-teoria` que ya escribe `ScrollProgress`); quiz completo cuando hay un intento con score ≥70 % (lectura del `agent365-quiz-m{N}-history` que ya escribe `useQuizState`); laboratorios y recursos completos al visitar la sección al menos una vez (nuevo store `agent365-section-visits`).
  - **Diseño sin duplicación**: el motor lee directamente de las claves que ya escriben otros componentes en lugar de mantener un mirror separado, evitando inconsistencias.
  - **Nuevo hook `useModuleProgress(moduleId)`**: snapshot reactivo que se recalcula al recibir eventos `agent365-progress-changed` (mismo tab, vía `CustomEvent`) o `storage` nativo (cross-tab).
  - **Nuevo hook `useCourseProgress()`**: snapshot agregado de todos los módulos producidos. Pensado para la vista global `/progreso` (D.3) y badges en la home.
  - **Integraciones**:
    - `ScrollProgress.tsx` ahora dispara el evento custom tras persistir `maxPct`.
    - `useQuizState.ts` dispara el evento custom tras persistir `history` y al `clearHistory`.
    - `ModulePage.tsx` llama a `markSectionVisited` al navegar a `laboratorios` o `recursos`, y muestra un check verde en la pestaña de cada sección completada.
- `[Build]` Validador `scripts/validate-course.py` reporta 270 checks OK · 0 warnings · 0 errors. `npx tsc --noEmit` sin errores. Build Vite OK 2.45s.

 Cierra la deuda técnica de la sincronía manual TS↔markdown que arrastrábamos desde Hito B.
  - **Nuevo `platform/src/lib/quiz-parser.ts`** (~170 líneas): parsea bloques `::: pregunta ... :::` de los `quiz-practica.md` extrayendo el YAML interno con js-yaml (browser-safe) y construyendo objetos `Question` validados. Soporta los 5 tipos canónicos: multiple-choice, multiple-response, scenario, drag-and-drop, ordering.
  - **`platform/src/lib/quiz.ts` reescrito** (de 835 a ~245 líneas): elimina las 27 `Q_PRACT_NN_M` hardcoded. `getQuestionsForModule` ahora usa `import.meta.glob` eager sobre los `quiz-practica.md` del paquete y los pasa por `parseQuizMarkdown`. **Pasamos de 27 preguntas hardcoded a 60 preguntas leídas del paquete** (8 M01 + 6 M02 + 6 M03 + 5 M04 + 5 M05 + 11 M06 + 5 M07 + 6 M08 + 8 M09).
  - **Tipos extendidos**: añadidos `MultipleResponseQuestion` con `correctOptionIds: string[]` y `OrderingQuestion` con `correctOrder: string[]`. `Answer` union extendida con `MRAnswer` y `OrderingAnswer`. Helpers `isMultipleResponse`, `isOrdering`, y `emptyAnswerFor` / `isAnswerComplete` / `isAnswerCorrect` actualizados para los 4 tipos.
  - **Componentes nuevos**: `QuestionMultipleResponse.tsx` (checkboxes para varias correctas; feedback diferenciando «correcta marcada bien», «correcta no marcada», «incorrecta marcada»), `QuestionOrdering.tsx` (lista reordenable con botones up/down accesibles, indicador de posición, feedback con orden esperado por elemento mal colocado).
  - **`Quiz.tsx`** adaptado: 4 ramas de render (MC + MR + DnD + Ordering). `answeredCount` ahora usa `isAnswerComplete` para soportar todos los tipos.
  - **`QuestionFeedback.tsx`** ampliado con paneles para respuestas MR (lista de correctas marcadas) y Ordering (orden numerado correcto).
  - **Dependencias**: añadido `js-yaml` y `@types/js-yaml`.
- `[Build]` Validador `scripts/validate-course.py` reporta 270 checks OK · 0 warnings · 0 errors. `npx tsc --noEmit` sin errores. Build Vite OK 2.23s.

 Cierra la **Fase 4** del curso (M01-M09 todos producidos).
  - **`laboratorios.md`** con 4 labs prácticos (90 min total): LAB-09-1 (CA policy bloquea agentes High Risk con flujo Report-only → On), LAB-09-2 (configurar las 6 detecciones de Identity Protection y validar con tráfico de prueba), LAB-09-3 (auditar permisos efectivos de un agente OBO calculando intersección triple blueprint/licencia/consent), LAB-09-4 (diseño end-to-end blueprint + 2 CA policies + ID Protection alerts para agente Foundry de Tesorería autonomous).
  - **`quiz-practica.md`** con 8 preguntas Q-09-1..Q-09-8 cubriendo los 6 OAs en cuatro tipos (multiple-choice, multiple-response, scenario, drag-and-drop). Caso de estudio TextilNova (diseñar dashboard operativo diario del equipo de Seguridad de IA).
  - **7 preguntas EX-09-001..007** acumuladas en `cursos/agent365-cert/banco-examen.md`. Banco pasa de 29 a **36 preguntas oficiales**.
  - **`module.yaml`** actualizado: `estado: producido`, secciones completas (teoria + quiz-practica + laboratorios + recursos), `duracion_min: 183` (75 teoría + 18 quiz + 90 labs), 4 labs declarados.
  - **`platform/src/lib/quiz.ts`** sincronizado: 3 nuevas `Q_PRACT_09_*` (1 multiple-choice OA-09.1, 1 scenario OA-09.5, 1 drag-and-drop OA-09.6).
- `[Build]` Validador `scripts/validate-course.py` reporta 270 checks OK · 0 warnings · 0 errors. Build OK 2.24s.

 M09 estaba en placeholder absoluto desde el inicio del repo. Se produce de cero con el formato del paquete.
  - **`teoria.md`** completa (~530 líneas, 6 secciones, 75 min lectura): permisos en cuatro capas (blueprint heredado, delegated OBO, application own identity, custom security attributes), Conditional Access para workload identities con grants disponibles y patrones canónicos, Identity Protection con las seis detecciones específicas para agentes (anomalous token use, atypical agent travel, token issuer anomaly, suspicious agent application activity, verified threat actor signals, AiTM), trazabilidad OBO vs own identity en sign-in logs y CloudAppEvents, composición de defensas en tres capas, operaciones del día a día (triaje diario de Risky Agents, revisión semanal de CA, revisión trimestral de blueprints).
  - **`recursos.md`** con URLs canónicas de Microsoft Learn (CA workload identities, riskyAgents endpoint, sign-in logs schema), blogs oficiales (Entra blog, Security blog, anuncio GA Agent 365), lecturas adicionales (Zero Trust, RFC 8693 OAuth OBO, NIST SP 800-207) y herramientas (Graph PowerShell SDK, az ad sp, Graph Explorer).
  - **`module.yaml`** con los 6 OAs definidos (cubriendo Comprender, Aplicar, Analizar, Crear), 16 términos de glosario, prerrequisitos M01+M04+M06, secciones teoría + recursos (quiz-practica y laboratorios se añadirán en B.2), `estado: produciendo`, `fase_produccion: 2`, `preguntas_aporta_examen_final: 7`.
  - **`README.md`** del directorio actualizado al estado actual.
  - Borrado: placeholders `evaluacion.md`, `laboratorios.md` originales (laboratorios.md se recrea en B.2 con contenido real).
- `[Build]` Validador `scripts/validate-course.py` reporta 267 checks OK · 0 warnings · 0 errors. Build OK 2.21s.

 Cierra la separación quiz/banco para todos los módulos producidos del curso. M07 (Agent Registry y Map): 5 preguntas Q-07-1..Q-07-5 nuevas cubriendo los 5 OAs en cuatro tipos. M08 (Ciclo de vida): 6 preguntas Q-08-1..Q-08-6 cubriendo los 6 OAs incluyendo MR sobre acciones irreversibles, scenario de Delete fuera de ventana, scenario de Pin con propagación, scenario de reasignar ownership Foundry, DnD de categorías de acciones de gobernanza. Las 9 preguntas oficiales (4 de M07 + 5 de M08) se acumulan en `cursos/agent365-cert/banco-examen.md`. **El banco pasa de 20 a 29 preguntas**.
- `[Build]` `module.yaml` de M07-M08 actualizado: sección `evaluacion-legacy` sustituida por `quiz-practica`; `duracion_min` recalculado (M07 75→87, M08 90→104). Casos de estudio: Lumen Logística para M07 (informe trimestral + identificar agentes hub) y Plain Coffee SL para M08 (procesar 12 propuestas, custom templates por departamento).
- `[Build]` `platform/src/lib/quiz.ts` sincronizado: las 9 preguntas `Q_EX_07_001..004` y `Q_EX_08_001..005` se sustituyen por 6 `Q_PRACT_*` (3 por módulo). Tras este PR, **lib/quiz.ts ya no contiene NINGUNA pregunta del banco final EX-NN-NNN como pregunta de práctica**: cierra la deuda técnica original que motivó las fases A.2, C.1, C.2 y C.3.
- `[Build]` Validador `scripts/validate-course.py` ahora reporta 269 checks OK · 0 warnings · 0 errors.

 M06 (Microsoft Entra Agent ID) es el módulo más extenso del Área 2 con 11 preguntas oficiales, así que se aborda en su propio PR. `evaluacion.md` legacy se separa en `quiz-practica.md` con 11 preguntas Q-06-1..Q-06-11 nuevas cubriendo los 7 OAs del módulo (cuatro tipos de objetos, blueprints, sponsorship, lifecycle workflows, OBO vs own identity, custom security attributes y operaciones bulk) en seis tipos (multiple-choice, multiple-response, scenario, drag-and-drop). Las 11 preguntas oficiales `EX-06-001` a `EX-06-011` se acumulan en `cursos/agent365-cert/banco-examen.md`. El banco pasa de 9 a **20 preguntas oficiales**.
- `[Build]` `module.yaml` de M06 actualizado: sección `evaluacion-legacy` sustituida por `quiz-practica`; `duracion_min` recalculado de 105 a 127 (suma 22 min de quiz). Caso de estudio cambia a Banco Cervantes (entidad financiera con 4 áreas: Crédito, Fraude, Reporting Regulatorio, Tesorería).
- `[Build]` `platform/src/lib/quiz.ts` sincronizado: las 11 preguntas `Q_EX_06_001..011` se sustituyen por 3 `Q_PRACT_06_*` (multiple-choice OA-06.1, drag-and-drop OA-06.1, scenario OA-06.4). Las otras 8 viven solo en el markdown hasta el parser real.
- `[Build]` Validador `scripts/validate-course.py` ahora reporta 267 checks OK · 0 warnings · 0 errors.
- `[Build]` Fase C.1 — Refactor M02-M05 (Área 1 completa) al formato del paquete (PR #34). Mismo patrón que A.2: `evaluacion.md` legacy de cada módulo se separa en `quiz-practica.md` con 5-6 preguntas `Q-NN-N` nuevas distintas a las del banco, y las preguntas oficiales `EX-NN-NNN` se acumulan en `cursos/agent365-cert/banco-examen.md`. El banco pasa de 3 a **9 preguntas** (M01 + M02-M05). El alumno que abre `/modulo/X/quiz-practica` para X∈[2,5] ahora ve preguntas distintas a las que verá en el examen final. Se borran los 4 `evaluacion.md` legacy. Total de preguntas de práctica nuevas producidas: 22 (M02:6, M03:6, M04:5, M05:5).
- `[Build]` `module.yaml` de M02-M05 actualizado: sección `evaluacion-legacy` sustituida por `quiz-practica`; `duracion_min` recalculado sumando la duración del quiz (M02 75→90, M03 60→72, M04 45→55, M05 75→87).
- `[Build]` `platform/src/lib/quiz.ts` sincronizado: las 6 preguntas `Q_EX_02_001/002/003`, `Q_EX_03_001`, `Q_EX_04_001`, `Q_EX_05_001` se sustituyen por 12 `Q_PRACT_NN_M` (3 por módulo, mix de multiple-choice + scenario + drag-and-drop). Las otras 10 preguntas (multiple-response, ordering y MCs adicionales) viven solo en el markdown hasta que llegue el parser real en Bloque D.
- `[Build]` Validador `scripts/validate-course.py` ahora reporta 266 checks OK · 0 warnings · 0 errors.
- `[Build]` Fase A.2 — Refactor de M01 al formato del paquete (PR #33). Se separa `evaluacion.md` legacy en dos archivos canónicos: `cursos/agent365-cert/banco-examen.md` con las 3 preguntas oficiales del banco final (`EX-01-001/002/003`) y `cursos/agent365-cert/modulos/modulo-01-fundamentos/quiz-practica.md` con 8 preguntas nuevas (`Q-01-1` a `Q-01-8`) cubriendo los 5 OAs del módulo en cinco tipos distintos (multiple-choice, multiple-response, scenario, drag-and-drop, ordering). El `module.yaml` declara la sección `quiz-practica` en lugar de `evaluacion-legacy`. Se mantiene el caso de estudio de Plain Coffee SL como refuerzo no evaluable al final del quiz.
- `[Build]` `platform/src/lib/content.ts` añade `quiz-practica` al `ContentType` union; `ModulePage.tsx` actualiza el routing y la UI para usar `/modulo/X/quiz-practica` (con redirect legacy `/evaluacion` → `/quiz-practica`); `NavSidebar.tsx` actualiza el slug y label a "Práctica"; `lib/quiz.ts` sustituye las 3 preguntas hardcoded `Q_EX_01_*` por `Q_PRACT_01_1/3/5` (multiple-choice, scenario, drag-and-drop) sincronizadas con el markdown; `Quiz.tsx` actualiza el copy del botón a "Reiniciar práctica".
- `[Build]` Validador `scripts/validate-course.py` ahora reporta 262 checks OK · 0 warnings (antes 260 + 1 warning por banco-examen.md inexistente).

---

## 2026-05-06

- `[Setup]` Repositorio inicializado con estructura completa de 17 módulos
- `[Investigación]` Versionada la investigación deep-research base en `investigacion/deep-research-mayo-2026.md`
- `[Diseño]` Borrador inicial de `docs/arquitectura-curso.md` con esquema de 17 módulos y duraciones estimadas
- `[Diseño]` Convenciones de redacción definidas en `docs/convenciones-redaccion.md`
- `[Setup]` `CLAUDE.md` añadido para sesiones futuras de Claude Code
- `[Setup]` Plantillas de módulo (teoria.md, laboratorios.md, evaluacion.md, recursos.md) creadas en cada uno de los 17 módulos
- `[Diseño]` **Fase 1 completada.** Blueprint maestro completo en `docs/arquitectura-curso.md`:
  - 8 áreas de competencia con peso de examen
  - 17 módulos detallados con objetivos de aprendizaje (formato Bloom, IDs OA-XX.N), sub-secciones de teoría con duración exacta, conceptos clave, laboratorios con dificultad y prerrequisitos, reparto de preguntas al examen
  - Estructura del examen final: 60 preguntas, 90 min, 7 tipos, distribución por área
  - Matriz de competencias inicial con 87 objetivos cubiertos
  - Ruta de producción con dependencias entre módulos para Fases 2-7
- `[Diseño]` **Revisión 1.1 del blueprint** tras feedback:
  - Áreas reducidas de 8 a **5 estilo Microsoft Learn**. Identidad pasa a ser la más pesada.
  - Duración total recortada de 23h a **18h** (1080 min). Se aprietan minutajes de teoría manteniendo todos los laboratorios.
  - Concepto de "certificación con validez de 18 meses" sustituido por **"constancia de finalización del curso"** sin caducidad ni recertificación.
  - Tres caminos de aprendizaje eliminados: **itinerario único** de 16 módulos secuenciales.
- `[Diseño]` **Revisión 1.2 del blueprint:** pesos finales del examen.
  - Pesos cambiados de rangos (estilo Microsoft Learn) a **valores exactos** justificados técnicamente: 15% / 30% / 15% / 20% / 20%.
  - Identidad sube a 30% (era 25-30%) por densidad conceptual: 4 tipos de objetos nuevos en Entra, OBO/own identity, CA para agentes, ID Protection.
  - Reparto exacto: 9 / 18 / 9 / 12 / 12 = 60 preguntas.
  - Reparto a nivel de módulo reequilibrado coherentemente (M03→1, M06→11, M08→5, M10→5, M12→7, M14→2).
- `[Diseño]` **Auditoría de Fase 1** completada en `docs/auditoria-fase-1.md`:
  - Verificación sistemática de 96 temas del research contra los 17 módulos del blueprint.
  - Resultado: 86 temas cubiertos explícitamente, 7 indirectamente, 0 gaps.
  - 3 caveats técnicos identificados como (sensitivity labels en `.agent` files, ready-made SharePoint agents no editables, análiticas Foundry V2). Aplicados en este mismo commit.
- `[Diseño]` **Banco de preguntas modelo** creado en `docs/banco-preguntas-modelo.md`:
  - 12 preguntas reales completas (enunciado + opciones + respuesta + justificación + variantes).
  - Cubren los 7 tipos de pregunta del examen, 5 niveles de Bloom, 3 dificultades, 5 áreas y 8 módulos.
  - Establecen el estándar de calidad al que se ajustarán las 60 preguntas finales producidas en Fases 2-7.
- `[Fix]` 3 caveats añadidos al blueprint:
  - M14.2: sensitivity labels no se aplican directamente sobre `.agent` files; default ready-made SharePoint agents no son editables.
  - M07.4: análiticas Foundry solo V2.

---

## 2026-05-06 (continuación) — Fase 2

- `[Contenido]` **Módulo 01 producido al 100%** como prototipo de calidad. Establece el estándar para los 16 módulos restantes.
  - `teoria.md` (356 líneas, ~7.500 palabras): seis sub-secciones temporizadas, glosario inicial de 10 términos, mapa de capas en ASCII, tabla comparativa de los seis productos confundibles, distinción de los dos SDKs, los cuatro stakeholders core, distinción CCS/A365 con tabla de casos de uso, cronología completa, badges de estado por capacidad, fuentes oficiales.
  - `laboratorios.md` (115 líneas): ejercicio de mapeo de 10 escenarios al producto correcto con plantilla de respuesta y solución comentada.
  - `evaluacion.md` (174 líneas): 3 preguntas oficiales del banco (EX-01-001 multiple-choice, EX-01-002 escenario, EX-01-003 drag-and-drop) con justificación, variantes para evitar repetición y caso de estudio integrado de Plain Coffee SL.
  - `recursos.md` (91 líneas): enlaces a documentación oficial de Microsoft Learn, blogs, whitepapers, repos GitHub.
  - `README.md` del módulo con resumen, OAs y validación.
  - 2 diagramas SVG: `01-control-plane.svg` (Agent 365 sobre los builders) y `02-stakeholders.svg` (los cuatro perfiles administrativos).

---

## 2026-05-06 (continuación 2) — Camino B: prototipo del shell antes de Fase 3

- `[Decisión]` **Cambio en el orden del plan.** Originalmente la producción del shell de e-learning (Fase 8) iba al final, después de los 17 módulos. Decisión revisada: construir un **prototipo del shell con sólo M01 dentro** antes de seguir produciendo módulos. Si el diseño del shell falla, falla con 1 módulo de contenido y no con 17. Las fases 3-7 avanzan después sobre un shell ya validado.
- `[Plan]` PLAN.md reescrito introduciendo la **Fase 2.A — Prototipo del shell de e-learning con M01**. Stack confirmado: Vite + React 18 + TypeScript + Tailwind, tipografías Bricolage Grotesque + Instrument Sans, iconos Lucide React (Material UI Icons como fallback), routing React Router v6, markdown vía react-markdown, evaluación interactiva con @dnd-kit para drag-and-drop, hosting en Vercel.
- `[Convenciones]` Regla absoluta de **cero emojis** en cualquier archivo del repositorio explicitada en `docs/convenciones-redaccion.md`. Excepción única: badges de estado del producto en formato texto entre corchetes (`[GA]`, `[Preview]`, `[Frontier]`, `[Deprecated]`). Iconos sólo en el shell React vía Lucide o Material UI.
- `[Cleanup]` Pase global de cleanup: 93 archivos limpiados de emojis (`🟢 🟡 🔴 ✅ 🚧 ⏳ ⚠️ 📂 📄 🧪 📝 🔗 📋 ❌ ✓` y todas sus combinaciones). Reemplazos por equivalentes de texto donde aplica:
  - `🟢 GA` → `[GA]`, `🟡 Preview` → `[Preview]`, `🔴 Frontier` → `[Frontier]`, `⚠️ Deprecated` → `[Deprecated]`
  - Estados de fase y módulo: emoji eliminado, texto conservado (`✅ Producido` → `Producido`)
  - Iconos decorativos en bullets: eliminados
  - Tablas con `✅/❌`: convertidas a `Sí/No`
- `[Sitio]` `index.md` y `modulos/README.md` reescritos con el nuevo orden de fases y sin emojis. La Fase 2.A queda marcada explícitamente como activa.
