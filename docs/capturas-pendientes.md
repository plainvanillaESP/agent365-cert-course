# Capturas pendientes del curso

> **Estado:** documento operativo · **Última actualización:** 2026-05-06

Este documento centraliza todas las capturas de admin centers que el curso necesita para sustituir SVGs conceptuales en una segunda iteración. Todas las capturas deben ser tomadas en un tenant productivo o demo de Plain Vanilla con Microsoft Agent 365 GA o Frontier preview activado.

## Convenciones generales

### Resolución y formato

- **Formato:** PNG (no JPG, las anotaciones pierden nitidez con compresión).
- **Resolución mínima:** 1920×1080 para capturas de pantalla completa, 1400×900 para capturas de modal o panel lateral.
- **Densidad:** 1× (no Retina/2×) para que el peso del archivo sea razonable. El navegador escala bien.
- **Compresión:** PNG nivel 9 con `pngquant` o equivalente para optimizar peso sin perder calidad.

### Anotaciones

Todas las capturas anotadas siguen la misma convención visual para que el alumno las reconozca como un patrón:

- **Color de anotación:** `#D7263D` (rojo brand del curso, consistente con el color de error de Tailwind).
- **Rectángulo:** stroke 3px, sin relleno. Esquinas levemente redondeadas (radius 4px).
- **Números en círculo:** círculo `#D7263D` con relleno completo, número blanco bold dentro. Diámetro 28-32px.
- **Posición de los números:** esquina superior izquierda del rectángulo correspondiente, tocándolo.
- **Sin texto encima de la captura.** Las leyendas explicativas van en el cuerpo del módulo (numeradas correspondiendo a los números en círculo).

### Datos sensibles

Antes de subir cada captura:

- **Anonimizar nombres reales:** sustituir nombres de usuarios reales por nombres ficticios (Adele Vance, Megan Bowen, etc. — los samples oficiales de Microsoft).
- **Anonimizar tenant ID:** si aparece en la URL o en algún campo, sustituir por `contoso.onmicrosoft.com` o blur visual.
- **Anonimizar emails:** mismo patrón. Usar `@contoso.com` o blur.
- **No anonimizar nombres de productos.** Microsoft 365, Entra, Defender, Purview se mantienen literales.

### Naming y ubicación de archivos

Cada captura tiene un ID único `MNN-CAP-XX`:

- `MNN` = módulo (`M04`, `M05`, etc.)
- `CAP` = captura
- `XX` = correlativo dentro del módulo (`01`, `02`, ...)

**Ejemplo:** `M04-CAP-01-entra-roles-list.png`

El archivo se ubica en:

```
modulos/modulo-MM-{slug}/assets/capturas/MNN-CAP-XX-{descriptor}.png
```

Cada captura sustituye al SVG conceptual correspondiente en el `.md` del módulo cuando sea entregada.

### Workflow de entrega

1. **Tomar la captura** en el admin center, sin anotaciones.
2. **Anonimizar** datos sensibles (nombres reales, tenant ID, emails).
3. **Anotar** con la herramienta de tu elección (Snagit, Skitch, anotaciones nativas de macOS/Windows) usando la convención visual de arriba.
4. **Guardar** con el filename exacto que indica este documento.
5. **Subir** vía PR a la rama del módulo correspondiente, o pasarme las capturas y yo me encargo de integrarlas.

---

## Capturas por módulo

### Módulo 04 — Roles administrativos y delegación

> Estado del módulo: producido y publicado con SVGs conceptuales (PR Fase 3 M04). Las siguientes capturas sustituirían los SVGs en una iteración 2 que daría más realismo al módulo.

#### M04-CAP-01 · Página de Roles & administrators en Entra admin center

- **Ubicación en el curso:** `modulos/modulo-04-roles-administrativos/teoria.md` § 4.1, opcionalmente complementaria al SVG `01-catalogo-roles.svg`.
- **URL del admin center:** `https://entra.microsoft.com/#view/Microsoft_AAD_IAM/AllRolesBlade`
- **Vista exacta:** lista completa de roles built-in. Filtrado por las palabras `AI`, `Agent`, `Security`, `Compliance` para mostrar los relevantes al curso. Columnas visibles: Name, Description, Type, Templates.
- **Resolución:** 1920×1080
- **Anotaciones (numeradas):**
  1. Buscador / filtro con el término aplicado.
  2. Fila del rol AI Administrator destacada.
  3. Columna «Type» que distingue Built-in de Custom.
  4. Botón «Add custom role» (mencionado pero no usado en el curso).
- **Anonimización:** ninguna (es vista de catálogo de Microsoft, sin datos del tenant).
- **Filename:** `M04-CAP-01-entra-roles-list.png`
- **Path final:** `modulos/modulo-04-roles-administrativos/assets/capturas/M04-CAP-01-entra-roles-list.png`

#### M04-CAP-02 · Detalle del rol AI Administrator

- **Ubicación en el curso:** `modulos/modulo-04-roles-administrativos/teoria.md` § 4.1, panel lateral o sección extendida.
- **URL del admin center:** `https://entra.microsoft.com/#view/Microsoft_AAD_IAM/RoleMenuBlade/~/Description/{role-id}`
- **Vista exacta:** click sobre el rol AI Administrator → panel de detalle con descripción, permisos, asignaciones actuales.
- **Resolución:** 1400×900
- **Anotaciones (numeradas):**
  1. Nombre del rol y badge «Built-in».
  2. Descripción oficial del rol.
  3. Sección «Permissions» con las acciones permitidas más relevantes.
  4. Pestaña «Assignments» y número total de usuarios asignados.
  5. Botón «Add assignments» que llevará al wizard.
- **Anonimización:** si la pestaña de Assignments muestra usuarios reales, blurrar nombres y emails.
- **Filename:** `M04-CAP-02-ai-administrator-detail.png`
- **Path final:** `modulos/modulo-04-roles-administrativos/assets/capturas/M04-CAP-02-ai-administrator-detail.png`

#### M04-CAP-03 · Wizard de asignación de un rol

- **Ubicación en el curso:** `modulos/modulo-04-roles-administrativos/laboratorios.md` § Lab 04.1, sección «Ejecución técnica».
- **URL del admin center:** flujo dentro de Entra → Roles & administrators → AI Administrator → Add assignments.
- **Vista exacta:** modal o blade del wizard de asignación. Incluir la elección entre Eligible y Active assignment, y el campo de Justification.
- **Resolución:** 1400×900
- **Anotaciones (numeradas):**
  1. Selector de usuario / grupo (campo de búsqueda).
  2. Toggle entre «Active» y «Eligible» assignment.
  3. Campo de duración / fecha de inicio y fin.
  4. Campo de justificación obligatoria.
  5. Botón Assign final.
- **Anonimización:** sustituir nombres reales si aparecen en el selector. Usar nombres ficticios como Adele Vance, Megan Bowen.
- **Filename:** `M04-CAP-03-add-role-assignment.png`
- **Path final:** `modulos/modulo-04-roles-administrativos/assets/capturas/M04-CAP-03-add-role-assignment.png`

#### M04-CAP-04 · Página de PIM con activación de rol

- **Ubicación en el curso:** `modulos/modulo-04-roles-administrativos/teoria.md` § 4.2 (PIM como mitigación), y `laboratorios.md` § Lab 04.1 punto 3.
- **URL del admin center:** `https://entra.microsoft.com/#view/Microsoft_Azure_PIMCommon/CommonMenuBlade/~/quickStart`
- **Vista exacta:** PIM → Microsoft Entra roles → My roles. Mostrar al menos un rol Eligible disponible para activar y, si es posible, un rol Active reciente.
- **Resolución:** 1920×1080
- **Anotaciones (numeradas):**
  1. Pestaña «Eligible assignments» con un rol disponible.
  2. Botón «Activate» del rol.
  3. Pestaña «Active assignments» con un rol activo y su tiempo restante.
  4. Sección «Audit history» (visible si se hace scroll).
- **Anonimización:** ninguna específica si solo se ve mi propia cuenta. Si aparece tenant ID, blurrar.
- **Filename:** `M04-CAP-04-pim-my-roles.png`
- **Path final:** `modulos/modulo-04-roles-administrativos/assets/capturas/M04-CAP-04-pim-my-roles.png`

#### M04-CAP-05 · M365 admin center → Roles (vista alternativa simplificada)

- **Ubicación en el curso:** `modulos/modulo-04-roles-administrativos/teoria.md` § 4.3, opcional complementaria al SVG `02-delegacion-admin-centers.svg`.
- **URL del admin center:** `https://admin.microsoft.com/Adminportal/Home#/roles`
- **Vista exacta:** página de Roles en M365 admin center mostrando las pestañas Azure AD / Exchange / etc., con el filtro «AI» aplicado.
- **Resolución:** 1920×1080
- **Anotaciones (numeradas):**
  1. Tabs de categorías de roles (Azure AD, Exchange, etc.).
  2. Buscador / filtro.
  3. Fila del rol AI Administrator visible.
  4. Botón «Compare roles» (mencionable pero opcional).
- **Anonimización:** ninguna específica.
- **Filename:** `M04-CAP-05-m365-admin-roles.png`
- **Path final:** `modulos/modulo-04-roles-administrativos/assets/capturas/M04-CAP-05-m365-admin-roles.png`

#### Total M04: 5 capturas

Tres capturas en Entra (catálogo, detalle de rol, wizard de asignación), una en PIM y una en M365 admin center. Coste estimado de captura: 30-45 minutos en un tenant que tenga las licencias activas.

---

### Módulo 05 — Configuración inicial del tenant

> Estado del módulo: producido y publicado con SVGs conceptuales (PR Fase 3 M05). Es el módulo de Fase 3 que MÁS se beneficiará de capturas reales por ser puramente operativo.

#### M05-CAP-01 · Toggle Copilot Frontier en M365 admin center

- **Ubicación en el curso:** `modulos/modulo-05-configuracion-inicial/teoria.md` § 5.2 Paso 1.
- **URL del admin center:** `https://admin.microsoft.com/Adminportal/Home#/copilot/settings`
- **Vista exacta:** página de Copilot Settings con la sección «User access» visible y el toggle «Copilot Frontier» destacado.
- **Resolución:** 1920×1080
- **Anotaciones (numeradas):**
  1. Sección «User access» (cabecera).
  2. Toggle «Copilot Frontier» en estado Off (estado inicial).
  3. Aviso de capacidades preview que aparece al activar.
  4. Botón Save final.
- **Anonimización:** ninguna.
- **Filename:** `M05-CAP-01-frontier-toggle.png`
- **Path final:** `modulos/modulo-05-configuracion-inicial/assets/capturas/M05-CAP-01-frontier-toggle.png`

#### M05-CAP-02 · Modal de Terms of Service de Agent 365

- **Ubicación en el curso:** `modulos/modulo-05-configuracion-inicial/teoria.md` § 5.2 Paso 2.
- **URL del admin center:** `https://admin.microsoft.com/Adminportal/Home#/agents` (la primera vez)
- **Vista exacta:** modal pop-up de Terms of Service que aparece automáticamente al entrar al Agent workload por primera vez.
- **Resolución:** 1400×900
- **Anotaciones (numeradas):**
  1. Título del modal «Microsoft Agent 365 Terms of Service».
  2. Cuerpo del texto (puede mostrar solo el inicio, suficiente).
  3. Checkbox de aceptación.
  4. Botón Accept.
- **Anonimización:** si aparece nombre del aceptante o tenant en algún lado, blurrar.
- **Filename:** `M05-CAP-02-terms-of-service-modal.png`
- **Path final:** `modulos/modulo-05-configuracion-inicial/assets/capturas/M05-CAP-02-terms-of-service-modal.png`

#### M05-CAP-03 · Página Overview del Agent workload con las 4 hero metrics

- **Ubicación en el curso:** `modulos/modulo-05-configuracion-inicial/teoria.md` § 5.2 Paso 3 + 5.5.
- **URL del admin center:** `https://admin.microsoft.com/Adminportal/Home#/agents/overview`
- **Vista exacta:** página Overview tras la activación. Las 4 hero metrics arriba, el menú lateral del workload visible (Overview, Registry, Map, Settings).
- **Resolución:** 1920×1080
- **Anotaciones (numeradas):**
  1. Hero metric 1: Agent Registry total.
  2. Hero metric 2: Active users (últimos 30 días).
  3. Hero metric 3: Agent run-time (horas).
  4. Hero metric 4: Registry sync.
  5. Menú lateral con las 4 entradas (Overview, Registry, Map, Settings).
- **Anonimización:** si los números tienen valores reales que pueden ser sensibles, sustituir por «42» o similares para los ejemplos.
- **Filename:** `M05-CAP-03-overview-hero-metrics.png`
- **Path final:** `modulos/modulo-05-configuracion-inicial/assets/capturas/M05-CAP-03-overview-hero-metrics.png`

#### M05-CAP-04 · Configuración del conector Microsoft 365 en Defender

- **Ubicación en el curso:** `modulos/modulo-05-configuracion-inicial/teoria.md` § 5.3 + Lab 05.2 Parte A.
- **URL del admin center:** `https://security.microsoft.com/cloudapps/connectedapps`
- **Vista exacta:** wizard de añadir conector M365. Idealmente capturar el paso donde se eligen las áreas a conectar (SharePoint, OneDrive, Teams, etc.).
- **Resolución:** 1400×900
- **Anotaciones (numeradas):**
  1. Buscador con «Microsoft 365» seleccionado.
  2. Lista de áreas conectables con checkboxes.
  3. Selector de tipo de autenticación (OAuth recomendado).
  4. Botón Connect.
- **Anonimización:** si hay datos del tenant visibles, blurrar.
- **Filename:** `M05-CAP-04-defender-m365-connector.png`
- **Path final:** `modulos/modulo-05-configuracion-inicial/assets/capturas/M05-CAP-04-defender-m365-connector.png`

#### M05-CAP-05 · DSPM for AI activación en Purview

- **Ubicación en el curso:** `modulos/modulo-05-configuracion-inicial/teoria.md` § 5.4.
- **URL del admin center:** `https://purview.microsoft.com/dspm/aiusage`
- **Vista exacta:** página de DSPM for AI antes o durante la activación. Si ya está activo, capturar el dashboard inicial con métricas vacías o iniciales.
- **Resolución:** 1920×1080
- **Anotaciones (numeradas):**
  1. Título «Data Security Posture Management for AI».
  2. Botón Activate (si aún no está activo) o estado «Active».
  3. Panel de Audit policies activas.
  4. Sub-sección AI observability con su estado.
- **Anonimización:** ninguna específica.
- **Filename:** `M05-CAP-05-dspm-for-ai-activation.png`
- **Path final:** `modulos/modulo-05-configuracion-inicial/assets/capturas/M05-CAP-05-dspm-for-ai-activation.png`

#### M05-CAP-06 · KQL en Defender XDR Hunting con eventos de agente

- **Ubicación en el curso:** `modulos/modulo-05-configuracion-inicial/teoria.md` § 5.3 + 5.5 + Lab 05.2 Parte D.
- **URL del admin center:** `https://security.microsoft.com/v2/advanced-hunting`
- **Vista exacta:** Advanced hunting con la consulta `CloudAppEvents | where ActionType startswith "Agent" | take 10` ejecutada y al menos algunas filas de resultado visibles.
- **Resolución:** 1920×1080
- **Anotaciones (numeradas):**
  1. Editor KQL con la consulta visible.
  2. Botón Run query.
  3. Tabla de resultados con al menos 1 fila.
  4. Columnas relevantes: TimeGenerated, ActionType, AccountObjectId, Application.
  5. Botón Export results (mencionable para evidencia de auditoría).
- **Anonimización:** si las filas muestran AccountObjectId o emails reales, blurrar o sustituir por valores de ejemplo (Adele Vance, Megan Bowen).
- **Filename:** `M05-CAP-06-defender-kql-agent-events.png`
- **Path final:** `modulos/modulo-05-configuracion-inicial/assets/capturas/M05-CAP-06-defender-kql-agent-events.png`

#### M05-CAP-07 · Activity explorer de Purview con eventos AI

- **Ubicación en el curso:** `modulos/modulo-05-configuracion-inicial/teoria.md` § 5.4 + 5.5.
- **URL del admin center:** `https://purview.microsoft.com/activityexplorer`
- **Vista exacta:** Activity explorer filtrado por Activity = «AI prompt» o «AI response» con al menos un evento visible.
- **Resolución:** 1920×1080
- **Anotaciones (numeradas):**
  1. Filtro de Activity aplicado.
  2. Filtro de fecha (últimas 24 horas).
  3. Tabla de actividades con al menos una fila.
  4. Columnas relevantes: Activity, User, Timestamp, Sensitivity label.
- **Anonimización:** sustituir nombres de usuarios reales por nombres ficticios.
- **Filename:** `M05-CAP-07-purview-activity-explorer.png`
- **Path final:** `modulos/modulo-05-configuracion-inicial/assets/capturas/M05-CAP-07-purview-activity-explorer.png`

#### Total M05: 7 capturas

Dos capturas en M365 admin center (Frontier toggle, Overview), una del modal Terms of Service, dos en Defender (conector M365, KQL hunting), dos en Purview (DSPM activation, Activity explorer). Coste estimado de captura: 45-75 minutos en un tenant que ya esté operando.

---

### Módulo 06 — Microsoft Entra Agent ID e identidades de agentes

> Estado del módulo: producido y publicado con SVGs conceptuales (PR Fase 4 M06). Es el módulo más denso del curso (Área 2, 30 % del examen). Las capturas reales darían contexto operativo a los 3 labs y a las 11 preguntas oficiales.

#### M06-CAP-01 · Página de Agents → Blueprints en Entra admin center

- **Ubicación en el curso:** `modulos/modulo-06-entra-agent-id/teoria.md` § 6.3 + Lab 06.1 Parte E.
- **URL del admin center:** `https://entra.microsoft.com/#view/Microsoft_AAD_IAM/Agents/Blueprints`
- **Vista exacta:** lista de blueprints del tenant tras crear `bp-rrhh-faq-001`. Mostrar al menos un blueprint creado.
- **Resolución:** 1920×1080
- **Anotaciones (numeradas):**
  1. Nav lateral con `Identity → Agents → Blueprints` resaltado.
  2. Botón **+ New blueprint** arriba a la derecha.
  3. Fila con `bp-rrhh-faq-001` y su display name.
  4. Columna de status `Active`.
  5. Columna de identities count (`0` o el número actual).
- **Anonimización:** ninguna específica si solo aparece el blueprint del lab.
- **Filename:** `M06-CAP-01-entra-blueprints-list.png`
- **Path final:** `modulos/modulo-06-entra-agent-id/assets/capturas/M06-CAP-01-entra-blueprints-list.png`

#### M06-CAP-02 · Detalle de un blueprint con permisos heredables

- **Ubicación en el curso:** `modulos/modulo-06-entra-agent-id/teoria.md` § 6.3 + Lab 06.1 Parte E.
- **URL del admin center:** click sobre `bp-rrhh-faq-001` desde la lista anterior.
- **Vista exacta:** panel de detalle del blueprint con las 5 secciones visibles: metadata, inheritable permissions, restrictions, lifecycle, custom security attributes.
- **Resolución:** 1400×900
- **Anotaciones (numeradas):**
  1. Display name y description.
  2. Sección **Inheritable permissions** con los 3 scopes de Microsoft Graph.
  3. Sección **Restrictions** con `allowedAuthenticationFlows: [onBehalfOf]`.
  4. Sección **Lifecycle** con `auditLevel: verbose`.
  5. Sección **Custom security attributes** con `Department: HR`.
  6. Botón **Edit** y **Delete** arriba a la derecha (mencionar pero no usar en el lab).
- **Anonimización:** ninguna.
- **Filename:** `M06-CAP-02-blueprint-detail.png`
- **Path final:** `modulos/modulo-06-entra-agent-id/assets/capturas/M06-CAP-02-blueprint-detail.png`

#### M06-CAP-03 · Lista de Agent identities filtrada por blueprint

- **Ubicación en el curso:** `modulos/modulo-06-entra-agent-id/teoria.md` § 6.1 + Lab 06.2 Parte B.
- **URL del admin center:** `https://entra.microsoft.com/#view/Microsoft_AAD_IAM/Agents/AgentIdentities`
- **Vista exacta:** lista de agent identities filtrada por `blueprintId eq 'bp-rrhh-faq-001'`. Mostrar al menos `agent-rrhh-faq-nominas-001` y campos clave.
- **Resolución:** 1920×1080
- **Anotaciones (numeradas):**
  1. Filtro aplicado por blueprint.
  2. Columna `Display name` con `RRHH-FAQ-Nominas`.
  3. Columna `Sponsor` con UPN del sponsor.
  4. Columna `Status` (Active).
  5. Columna `Custom security attributes` (resumida o expandible).
  6. Botón **Bulk disable** arriba (mencionar pero no usar).
- **Anonimización:** sustituir UPN reales por nombres ficticios si aparecen.
- **Filename:** `M06-CAP-03-agent-identities-list.png`
- **Path final:** `modulos/modulo-06-entra-agent-id/assets/capturas/M06-CAP-03-agent-identities-list.png`

#### M06-CAP-04 · Configuración de sponsor en una agent identity

- **Ubicación en el curso:** `modulos/modulo-06-entra-agent-id/teoria.md` § 6.4 + Lab 06.3 Parte B.
- **URL del admin center:** click sobre una agent identity → tab **Sponsorship**.
- **Vista exacta:** panel de sponsorship de una agent identity con UPN del sponsor, toggle de `transferOnLeaver`, fecha de última transferencia (si aplica).
- **Resolución:** 1400×900
- **Anotaciones (numeradas):**
  1. UPN del sponsor configurado.
  2. Toggle `transferOnLeaver: true`.
  3. Toggle `transferOnMover: false` (default).
  4. Campo `Last transfer` (vacío inicialmente, después de Lab 06.3 con timestamp).
  5. Botón **Change sponsor** (mencionar).
- **Anonimización:** sustituir UPN reales.
- **Filename:** `M06-CAP-04-sponsor-configuration.png`
- **Path final:** `modulos/modulo-06-entra-agent-id/assets/capturas/M06-CAP-04-sponsor-configuration.png`

#### M06-CAP-05 · Lifecycle workflow editor para sponsorship transfer

- **Ubicación en el curso:** `modulos/modulo-06-entra-agent-id/teoria.md` § 6.4 + Lab 06.3 Parte A.
- **URL del admin center:** `https://entra.microsoft.com/#view/Microsoft_AAD_IAM/IdentityGovernance/LifecycleWorkflows`
- **Vista exacta:** editor del workflow `Agent sponsorship transfer on leaver` con sus tasks visibles.
- **Resolución:** 1920×1080
- **Anotaciones (numeradas):**
  1. Nombre del workflow.
  2. Trigger `onLeaver` con scope `all users`.
  3. Lista de tasks: `notifyManager`, `transferAgentSponsorship`, `requireReviewWithinDays`.
  4. Status `Active` y last run.
  5. Botón **Run history** (mencionar para verificación tras Lab 06.3).
- **Anonimización:** ninguna específica.
- **Filename:** `M06-CAP-05-lifecycle-workflow-editor.png`
- **Path final:** `modulos/modulo-06-entra-agent-id/assets/capturas/M06-CAP-05-lifecycle-workflow-editor.png`

#### M06-CAP-06 · KQL para riskyAgents en Defender XDR Hunting

- **Ubicación en el curso:** `modulos/modulo-06-entra-agent-id/teoria.md` § 6.8.
- **URL del admin center:** `https://security.microsoft.com/v2/advanced-hunting`
- **Vista exacta:** Advanced hunting con consulta KQL sobre `riskyAgents`. Si Identity Protection no detecta riesgos, alternativa: consulta sobre `CloudAppEvents` filtrada por agent.
- **Resolución:** 1920×1080
- **Anotaciones (numeradas):**
  1. Editor KQL con consulta visible.
  2. Botón Run query.
  3. Tabla de resultados (puede estar vacía en tenant nuevo: documentar y aceptar).
  4. Columna `riskLevel` y `riskState`.
- **Anonimización:** sustituir IDs y UPNs reales si aparecen.
- **Filename:** `M06-CAP-06-defender-risky-agents-kql.png`
- **Path final:** `modulos/modulo-06-entra-agent-id/assets/capturas/M06-CAP-06-defender-risky-agents-kql.png`

#### Total M06: 6 capturas

Cinco capturas en Microsoft Entra (blueprints list, blueprint detail, agent identities list, sponsor configuration, lifecycle workflow editor) y una en Defender XDR. Coste estimado de captura: 60-90 minutos. Es el módulo con más capturas pendientes por su densidad operativa.

---

### Módulo 07 — Agent Registry y Agent Map

> Estado del módulo: producido y publicado con SVGs conceptuales (PR Fase 4 M07). Es el primer módulo puramente operativo: los alumnos se beneficiarán especialmente de capturas reales aquí.

#### M07-CAP-01 · Página Overview con hero metrics y Top actions for you

- **Ubicación en el curso:** `modulos/modulo-07-agent-registry-map/teoria.md` § 7.3.
- **URL del admin center:** `https://admin.microsoft.com/Adminportal/Home#/agents/overview`
- **Vista exacta:** Overview completo con las 4 hero metrics arriba y las 4 categorías de Top actions for you abajo. Idealmente con números reales (no ceros).
- **Resolución:** 1920×1080
- **Anotaciones (numeradas):**
  1. Hero metric Agent Registry total con sparkline.
  2. Hero metric Active users (30d).
  3. Hero metric Agent run-time.
  4. Hero metric Registry sync con plataformas conectadas.
  5. Sección Top actions for you con las 4 categorías destacadas.
  6. Conteos de cada categoría (Pending requests, At risk, Ownerless, With exceptions).
- **Anonimización:** sustituir números reales por valores de ejemplo razonables si los reales son sensibles.
- **Filename:** `M07-CAP-01-overview-hero-actions.png`
- **Path final:** `modulos/modulo-07-agent-registry-map/assets/capturas/M07-CAP-01-overview-hero-actions.png`

#### M07-CAP-02 · Agent Registry con filtros aplicados

- **Ubicación en el curso:** `modulos/modulo-07-agent-registry-map/teoria.md` § 7.1 + Lab 07.1 Parte B.
- **URL del admin center:** `https://admin.microsoft.com/Adminportal/Home#/agents/registry`
- **Vista exacta:** Registry con filtros laterales aplicados (al menos Publisher = Third Party + Status = Active). Mostrar 5-10 filas de ejemplo en la tabla.
- **Resolución:** 1920×1080
- **Anotaciones (numeradas):**
  1. Filtros laterales con checkboxes marcados.
  2. Header de columnas con las columnas estándar.
  3. Una fila con badge de status «Active» destacada.
  4. Una fila con badge de risk «High» o «Critical» destacada (si E7 activo).
  5. Botón Customize columns arriba.
  6. Botón Export arriba.
- **Anonimización:** sustituir nombres reales de agentes por ficticios (Adele Vance pattern). Sustituir UPN reales.
- **Filename:** `M07-CAP-02-registry-filtered.png`
- **Path final:** `modulos/modulo-07-agent-registry-map/assets/capturas/M07-CAP-02-registry-filtered.png`

#### M07-CAP-03 · Vista de detalle de un agente

- **Ubicación en el curso:** `modulos/modulo-07-agent-registry-map/teoria.md` § 7.1.
- **URL del admin center:** click sobre una fila del Registry → panel lateral.
- **Vista exacta:** panel de detalle de un agente con sus 6 secciones: identidad/owner, plataforma/configuración, permisos, risk panel (E7), actividad, capabilities.
- **Resolución:** 1400×900
- **Anotaciones (numeradas):**
  1. Sección Identity & Owner con UPN del owner y sponsor.
  2. Sección Permissions con scopes listados.
  3. Risk panel con risk level y top causes (si E7).
  4. Gráfica de actividad últimos 30 días.
  5. Sección Capabilities con datasources y plugins.
  6. Botones de acción arriba (Edit, Disable, Delete).
- **Anonimización:** sustituir UPN reales por nombres ficticios.
- **Filename:** `M07-CAP-03-agent-detail-panel.png`
- **Path final:** `modulos/modulo-07-agent-registry-map/assets/capturas/M07-CAP-03-agent-detail-panel.png`

#### M07-CAP-04 · Agent Map con clusters por plataforma

- **Ubicación en el curso:** `modulos/modulo-07-agent-registry-map/teoria.md` § 7.2 + Lab 07.1 Parte C.
- **URL del admin center:** `https://admin.microsoft.com/Adminportal/Home#/agents/map`
- **Vista exacta:** Agent Map con al menos 2 clusters de plataformas distintas y, si es posible, una conexión agent-to-agent visible.
- **Resolución:** 1920×1080
- **Anotaciones (numeradas):**
  1. Cluster Copilot Studio con sus agentes.
  2. Cluster Foundry (si aplica).
  3. Una conexión A → B entre agentes.
  4. Botón Fit to view.
  5. Botón Full screen.
  6. Buscador de nodos.
- **Anonimización:** sustituir nombres reales de agentes en los nodos.
- **Filename:** `M07-CAP-04-agent-map-clusters.png`
- **Path final:** `modulos/modulo-07-agent-registry-map/assets/capturas/M07-CAP-04-agent-map-clusters.png`

#### M07-CAP-05 · Pending requests al expandir desde Overview

- **Ubicación en el curso:** `modulos/modulo-07-agent-registry-map/teoria.md` § 7.3 + caso de estudio P2.
- **URL del admin center:** click sobre «Pending requests» en Top actions for you.
- **Vista exacta:** lista de agentes pending approval con sus capabilities visibles, botones de approve/reject por cada uno.
- **Resolución:** 1920×1080
- **Anotaciones (numeradas):**
  1. Header con el conteo de pending.
  2. Una fila con un agente Third Party de ejemplo, sus capabilities expandibles.
  3. Botones Approve y Reject por cada agente.
  4. Botón de bulk approve (si aplica).
- **Anonimización:** sustituir nombres reales de agentes y publishers.
- **Filename:** `M07-CAP-05-pending-requests-list.png`
- **Path final:** `modulos/modulo-07-agent-registry-map/assets/capturas/M07-CAP-05-pending-requests-list.png`

#### M07-CAP-06 · Risks column con risk panel expandido (requiere E7)

- **Ubicación en el curso:** `modulos/modulo-07-agent-registry-map/teoria.md` § 7.6.
- **URL del admin center:** click sobre el risk badge de un agente con Risk = High o Critical.
- **Vista exacta:** risk panel del agente con risk score numérico, top 3 risk causes, trend, y botones de acción.
- **Resolución:** 1400×900
- **Anotaciones (numeradas):**
  1. Risk level badge (High o Critical).
  2. Risk score numérico (0-100).
  3. Top 3 risk causes listadas con su origen (Defender / Identity Protection / DSPM).
  4. Sparkline de trend últimos 7 días.
  5. Botón Mark as false positive.
  6. Botón Investigate in Defender.
  7. Botón Disable agent.
- **Anonimización:** ninguna específica si los datos no incluyen UPN reales.
- **Filename:** `M07-CAP-06-risk-panel-detail.png`
- **Path final:** `modulos/modulo-07-agent-registry-map/assets/capturas/M07-CAP-06-risk-panel-detail.png`

#### M07-CAP-07 · Exportación a Excel completada

- **Ubicación en el curso:** `modulos/modulo-07-agent-registry-map/teoria.md` § 7.1 + Lab 07.2 Parte A-C.
- **URL del admin center:** N/A (es captura del archivo .xlsx descargado).
- **Vista exacta:** workbook abierto en Excel con la hoja del inventario y al menos una PivotTable visible.
- **Resolución:** 1920×1080
- **Anotaciones (numeradas):**
  1. Hoja con todas las columnas exportadas.
  2. Indicador de cantidad de filas (X agentes).
  3. PivotTable plataforma × estado en hoja secundaria.
  4. PivotTable owner × risk level en hoja secundaria.
- **Anonimización:** sustituir UPN y nombres reales.
- **Filename:** `M07-CAP-07-excel-export-pivot.png`
- **Path final:** `modulos/modulo-07-agent-registry-map/assets/capturas/M07-CAP-07-excel-export-pivot.png`

#### Total M07: 7 capturas

Cinco capturas en M365 admin center (Overview, Registry filtrado, detalle de agente, Map, Pending requests), una de Risk panel (requiere E7) y una de Excel con PivotTables. Coste estimado: 60-75 minutos. Capturas de alta prioridad por la naturaleza operativa del módulo.

---

### Módulo 08 — Despliegue, distribución y ciclo de vida

> Estado del módulo: producido y publicado con SVGs conceptuales (PR Fase 4 M08). Las 11 acciones se ejecutan desde la UI; las capturas reales son críticas para enseñar a operarlas con seguridad.

#### M08-CAP-01 · Menú contextual con las 11 acciones de un agente

- **Ubicación en el curso:** `modulos/modulo-08-ciclo-vida-agentes/teoria.md` § 8.1.
- **URL del admin center:** `https://admin.microsoft.com/Adminportal/Home#/agents/registry` → click sobre un agente → menú contextual `...`.
- **Vista exacta:** menú contextual desplegado con todas las acciones disponibles para un agente en estado `Active deployed` con E7.
- **Resolución:** 1400×900
- **Anotaciones (numeradas):**
  1. Botón `...` que abre el menú.
  2. Acciones del bloque Distribución (Pin, Block).
  3. Acciones del bloque Retirada (Remove, Delete).
  4. Acción Reassign Ownership (si Agent Builder).
  5. Estado del agente arriba (Active).
- **Anonimización:** sustituir nombre real del agente.
- **Filename:** `M08-CAP-01-context-menu-actions.png`
- **Path final:** `modulos/modulo-08-ciclo-vida-agentes/assets/capturas/M08-CAP-01-context-menu-actions.png`

#### M08-CAP-02 · Wizard de publishing paso 5 (Apply Template)

- **Ubicación en el curso:** `modulos/modulo-08-ciclo-vida-agentes/teoria.md` § 8.2 + Lab 08.1 Parte C.
- **URL del admin center:** desde Pending requests → click en un agente → wizard paso 5.
- **Vista exacta:** paso del wizard donde se elige plantilla. Mostrar dropdown con Default + Custom + None.
- **Resolución:** 1400×900
- **Anotaciones (numeradas):**
  1. Indicador del paso 5 de 7.
  2. Dropdown Apply Template con opciones.
  3. Custom Template seleccionada.
  4. Resumen de políticas que aplica esa template (panel lateral).
  5. Botones Back / Next.
- **Anonimización:** ninguna específica.
- **Filename:** `M08-CAP-02-wizard-apply-template.png`
- **Path final:** `modulos/modulo-08-ciclo-vida-agentes/assets/capturas/M08-CAP-02-wizard-apply-template.png`

#### M08-CAP-03 · Crear Custom Template

- **Ubicación en el curso:** `modulos/modulo-08-ciclo-vida-agentes/teoria.md` § 8.3 + Lab 08.1 Parte B.
- **URL del admin center:** `M365 admin → Agents → Settings → Templates → New`.
- **Vista exacta:** formulario de creación de Custom Template con todas las políticas configurables.
- **Resolución:** 1920×1080
- **Anotaciones (numeradas):**
  1. Campo Name (`Lab08-CustomTemplate` o similar).
  2. Sección Sharing externo con toggle Disabled.
  3. Sección Cross-site SharePoint con dropdown.
  4. Sección Logging con dropdown Verbose.
  5. Sección Conditional Access.
  6. Sección Sensitivity label heredada.
  7. Botón Save.
- **Anonimización:** ninguna.
- **Filename:** `M08-CAP-03-custom-template-form.png`
- **Path final:** `modulos/modulo-08-ciclo-vida-agentes/assets/capturas/M08-CAP-03-custom-template-form.png`

#### M08-CAP-04 · Pin con 3 slots disponibles

- **Ubicación en el curso:** `modulos/modulo-08-ciclo-vida-agentes/teoria.md` § 8.4 + Lab 08.2 Parte A.
- **URL del admin center:** click sobre un agente Active deployed → ... → Pin.
- **Vista exacta:** modal de Pin con los 3 slots (Microsoft, Administrator, User) y radio buttons.
- **Resolución:** 1400×900
- **Anotaciones (numeradas):**
  1. Slot Microsoft (atenuado, no configurable).
  2. Slot Administrator (seleccionable).
  3. Slot User (seleccionable).
  4. Texto explicativo de cada slot.
  5. Botón Pin / Cancel.
- **Anonimización:** ninguna.
- **Filename:** `M08-CAP-04-pin-3-slots-modal.png`
- **Path final:** `modulos/modulo-08-ciclo-vida-agentes/assets/capturas/M08-CAP-04-pin-3-slots-modal.png`

#### M08-CAP-05 · Modal de confirmación Delete con timeline

- **Ubicación en el curso:** `modulos/modulo-08-ciclo-vida-agentes/teoria.md` § 8.5.
- **URL del admin center:** click sobre un agente → ... → Delete.
- **Vista exacta:** modal de confirmación de Delete con la advertencia de irreversibilidad y la timeline de 24 h.
- **Resolución:** 1400×900
- **Anotaciones (numeradas):**
  1. Mensaje de advertencia destacado.
  2. Timeline de propagación 24 h.
  3. Mención del SharePoint Embedded container.
  4. Campo de confirmación de tipeado (escribe `DELETE` o nombre del agente).
  5. Botón Delete (rojo) y Cancel.
- **Anonimización:** ninguna.
- **Filename:** `M08-CAP-05-delete-confirmation-modal.png`
- **Path final:** `modulos/modulo-08-ciclo-vida-agentes/assets/capturas/M08-CAP-05-delete-confirmation-modal.png`

#### M08-CAP-06 · Manage Ownerless agents view

- **Ubicación en el curso:** `modulos/modulo-08-ciclo-vida-agentes/teoria.md` § 8.6 + Lab 08.3 Parte E.
- **URL del admin center:** Overview → Top actions for you → Ownerless agents → Manage.
- **Vista exacta:** lista filtrada de agentes ownerless con la columna del antiguo owner (UPN preservado para auditoría).
- **Resolución:** 1920×1080
- **Anotaciones (numeradas):**
  1. Filtro Ownerless aplicado.
  2. Columna Display name de los agentes.
  3. Columna Previous owner UPN.
  4. Columna Last activity.
  5. Acción Reassign Ownership disponible para los Agent Builder.
- **Anonimización:** sustituir UPN reales por ficticios.
- **Filename:** `M08-CAP-06-manage-ownerless-list.png`
- **Path final:** `modulos/modulo-08-ciclo-vida-agentes/assets/capturas/M08-CAP-06-manage-ownerless-list.png`

#### M08-CAP-07 · Modal de Reassign Ownership

- **Ubicación en el curso:** `modulos/modulo-08-ciclo-vida-agentes/teoria.md` § 8.6 + Lab 08.3 Parte E.
- **URL del admin center:** desde la lista de ownerless → ... → Reassign Ownership.
- **Vista exacta:** modal con typeahead de usuario o grupo nuevo owner.
- **Resolución:** 1400×900
- **Anotaciones (numeradas):**
  1. Información del agente a reasignar.
  2. Antiguo owner (deleted user UPN).
  3. Typeahead de nuevo owner.
  4. Toggle de notificación al nuevo owner.
  5. Botón Reassign / Cancel.
- **Anonimización:** sustituir UPN.
- **Filename:** `M08-CAP-07-reassign-ownership-modal.png`
- **Path final:** `modulos/modulo-08-ciclo-vida-agentes/assets/capturas/M08-CAP-07-reassign-ownership-modal.png`

#### Total M08: 7 capturas

Siete capturas críticas: el menú contextual con las 11 acciones, dos del wizard (paso 5 + crear template), Pin con 3 slots, Delete con timeline, Manage Ownerless, Reassign modal. Todas son acciones operativas que el alumno ejecutará en su rol. Coste estimado de captura: 75-90 minutos en un tenant operativo.

---

### Módulo 06 — Microsoft Entra Agent ID e identidades de agentes

> Estado del módulo: producido y publicado con SVGs conceptuales (PR Fase 4 M06). Es el módulo más denso del curso (105 min, 11 preguntas examen) y se beneficiaría especialmente de capturas reales del Entra admin center con datos de blueprints e identities reales.

#### M06-CAP-01 · Lista de Agent identity blueprints en Entra

- **Ubicación en el curso:** `modulos/modulo-06-entra-agent-id/teoria.md` § 6.1 + 6.3.
- **URL del admin center:** `https://entra.microsoft.com/#view/Microsoft_AAD_AgentID/BlueprintsListBlade` (o `Identity → Agent ID → Blueprints` según el menú actual).
- **Vista exacta:** lista de blueprints del tenant. Idealmente el blueprint `blueprint-rrhh-001` creado en Lab 06.1 visible junto a 1-2 blueprints adicionales de ejemplo.
- **Resolución:** 1920×1080
- **Anotaciones (numeradas):**
  1. Botón «Add blueprint» que invoca el wizard.
  2. Columna Display name con el blueprint resaltado.
  3. Columna Active identities (cuántas instances existen).
  4. Columna Last reviewed.
  5. Filtro / búsqueda.
- **Anonimización:** sustituir nombres de blueprints reales por nombres ficticios consistentes con el caso Plain Coffee SL.
- **Filename:** `M06-CAP-01-entra-blueprints-list.png`
- **Path final:** `modulos/modulo-06-entra-agent-id/assets/capturas/M06-CAP-01-entra-blueprints-list.png`

#### M06-CAP-02 · Detalle de un blueprint con permisos heredables

- **Ubicación en el curso:** `modulos/modulo-06-entra-agent-id/teoria.md` § 6.3 (anatomía del blueprint).
- **URL del admin center:** click sobre `blueprint-rrhh-001` en la lista anterior.
- **Vista exacta:** página de detalle del blueprint con las pestañas Overview, Inheritable permissions, Restrictions, Custom security attributes, Lifecycle.
- **Resolución:** 1920×1080
- **Anotaciones (numeradas):**
  1. Pestaña Inheritable permissions activa.
  2. Lista de scopes definidos (User.Read.All, Group.Read.All, TeamsActivity.Send).
  3. Indicador `3/40` o similar mostrando uso del límite.
  4. Pestaña Custom security attributes con los pares Department=HR, DataSensitivity=Internal.
  5. Botón Edit del blueprint.
- **Anonimización:** ninguna específica (el blueprint es de prueba).
- **Filename:** `M06-CAP-02-blueprint-inheritable-permissions.png`
- **Path final:** `modulos/modulo-06-entra-agent-id/assets/capturas/M06-CAP-02-blueprint-inheritable-permissions.png`

#### M06-CAP-03 · Lista de Agent identities filtrada por blueprint

- **Ubicación en el curso:** `modulos/modulo-06-entra-agent-id/teoria.md` § 6.1 + Lab 06.2 Parte B.
- **URL del admin center:** `Entra admin center → Identity → Agent ID → Agent identities`.
- **Vista exacta:** lista de identities con filtro `agentBlueprintId = blueprint-rrhh-001` aplicado, mostrando `Agent-RRHH-FAQ` y otras identities asociadas al mismo blueprint.
- **Resolución:** 1920×1080
- **Anotaciones (numeradas):**
  1. Filtro aplicado (chip visible arriba).
  2. Columna Display name con `Agent-RRHH-FAQ`.
  3. Columna Blueprint ID.
  4. Columna Account enabled.
  5. Botón «Bulk disable» que demuestra multi-select disable.
- **Anonimización:** ninguna específica.
- **Filename:** `M06-CAP-03-identities-list-filtered.png`
- **Path final:** `modulos/modulo-06-entra-agent-id/assets/capturas/M06-CAP-03-identities-list-filtered.png`

#### M06-CAP-04 · Detalle de agent identity con sponsor configurado

- **Ubicación en el curso:** `modulos/modulo-06-entra-agent-id/teoria.md` § 6.4 + Lab 06.3 Parte A.
- **URL del admin center:** click sobre `Agent-RRHH-FAQ` en la lista anterior.
- **Vista exacta:** detalle de la agent identity con la sección Sponsorship visible: sponsor asignado, `transferOnLeaver = true`, `requireReview` (puede estar `false` si la cuenta sponsor sigue activa).
- **Resolución:** 1400×900
- **Anotaciones (numeradas):**
  1. Sección Sponsorship.
  2. Campo Sponsor con el nombre del usuario.
  3. Toggle Transfer on leaver.
  4. Campo Account enabled.
  5. Sección Inherited permissions del blueprint.
- **Anonimización:** sustituir nombre del sponsor real por `Luis Ortega` (consistente con el caso del curso).
- **Filename:** `M06-CAP-04-identity-sponsor-detail.png`
- **Path final:** `modulos/modulo-06-entra-agent-id/assets/capturas/M06-CAP-04-identity-sponsor-detail.png`

#### M06-CAP-05 · Configuración de Lifecycle workflow `onLeaver`

- **Ubicación en el curso:** `modulos/modulo-06-entra-agent-id/teoria.md` § 6.4 + Lab 06.3 Parte B.
- **URL del admin center:** `Entra admin center → Identity Governance → Lifecycle workflows → seleccionar workflow → Tasks`.
- **Vista exacta:** detalle de un workflow con trigger `onLeaver` y al menos las tasks `notifyManager`, `transferAgentSponsorship`, `markRequireReview` añadidas.
- **Resolución:** 1920×1080
- **Anotaciones (numeradas):**
  1. Campo Trigger con `onLeaver`.
  2. Campo Scope con `allUsers` o `selected groups`.
  3. Tabla de tasks con las 3 tasks visibles.
  4. Toggle Enabled del workflow.
  5. Sección Workflow history con ejecuciones recientes.
- **Anonimización:** ninguna específica.
- **Filename:** `M06-CAP-05-lifecycle-workflow-onleaver.png`
- **Path final:** `modulos/modulo-06-entra-agent-id/assets/capturas/M06-CAP-05-lifecycle-workflow-onleaver.png`

#### M06-CAP-06 · Custom security attributes en directorio + asignación a identity

- **Ubicación en el curso:** `modulos/modulo-06-entra-agent-id/teoria.md` § 6.6.
- **URL del admin center:** `Entra admin center → Identity → Custom security attributes` y luego asignación en la identity.
- **Vista exacta:** preferiblemente dos capturas combinadas en una imagen: izquierda con la definición de los attributes a nivel directorio (Department, DataSensitivity, BusinessOwner, AgentPurpose), derecha con la asignación a `Agent-RRHH-FAQ`.
- **Resolución:** 1920×1080
- **Anotaciones (numeradas):**
  1. Lista de attribute sets definidos.
  2. Attribute Department con valores predefinidos (HR, Finance, Sales, Engineering).
  3. Vista de la identity con sus custom security attributes asignados.
- **Anonimización:** ninguna específica.
- **Filename:** `M06-CAP-06-custom-security-attributes.png`
- **Path final:** `modulos/modulo-06-entra-agent-id/assets/capturas/M06-CAP-06-custom-security-attributes.png`

#### M06-CAP-07 · Multi-select disable de agent identities

- **Ubicación en el curso:** `modulos/modulo-06-entra-agent-id/teoria.md` § 6.4 (último bloque).
- **URL del admin center:** `Entra admin center → Identity → Agent ID → Agent identities` con varias identities seleccionadas.
- **Vista exacta:** la lista con 3-5 identities seleccionadas (checkbox marcado) y el modal o dropdown de bulk action visible con la opción «Disable selected».
- **Resolución:** 1920×1080
- **Anotaciones (numeradas):**
  1. Checkboxes marcados de las identities seleccionadas.
  2. Contador «5 selected» o similar.
  3. Botón / dropdown de Bulk actions.
  4. Opción «Disable» destacada.
  5. Contador de impacto («This will affect 5 identities and X dependent agents»).
- **Anonimización:** sustituir nombres de identities por valores ficticios.
- **Filename:** `M06-CAP-07-bulk-disable-identities.png`
- **Path final:** `modulos/modulo-06-entra-agent-id/assets/capturas/M06-CAP-07-bulk-disable-identities.png`

#### M06-CAP-08 · Graph Explorer ejecutando `/beta/identityProtection/riskyAgents`

- **Ubicación en el curso:** `modulos/modulo-06-entra-agent-id/teoria.md` § 6.8 + Lab 06.2 Parte C.
- **URL del admin center:** `https://developer.microsoft.com/en-us/graph/graph-explorer`
- **Vista exacta:** Graph Explorer con la consulta `GET https://graph.microsoft.com/beta/identityProtection/riskyAgents` ejecutada y respuesta JSON visible con al menos 1 agente listado.
- **Resolución:** 1920×1080
- **Anotaciones (numeradas):**
  1. Campo URL con la query.
  2. Botón Run query.
  3. Respuesta JSON con array `value` y al menos 1 elemento.
  4. Property `riskLevel` y `riskState` visibles en el JSON.
  5. Acceso a permisos/scopes consentidos para esta query.
- **Anonimización:** sustituir IDs de agentes reales por valores de ejemplo.
- **Filename:** `M06-CAP-08-graph-explorer-risky-agents.png`
- **Path final:** `modulos/modulo-06-entra-agent-id/assets/capturas/M06-CAP-08-graph-explorer-risky-agents.png`

#### Total M06: 8 capturas

Cinco capturas en Entra admin center (lista blueprints, detalle blueprint, lista identities, detalle identity con sponsor, custom security attributes), una en Identity Governance (lifecycle workflow), una de bulk action (multi-select disable) y una en Graph Explorer (riskyAgents). Coste estimado de captura: 60-90 minutos en un tenant operativo con blueprints y identities ya creados (idealmente tras ejecutar los labs del módulo).

---

## Plantilla para nuevas entradas

Al añadir capturas de un módulo nuevo, copiar esta plantilla:

```markdown
### Módulo NN — {título del módulo}

#### MNN-CAP-01 · {descripción corta}

- **Ubicación en el curso:** `modulos/modulo-NN-{slug}/teoria.md` § {N.N} — sustituye al SVG `{nn-{slug}.svg}`.
- **URL del admin center:** `https://{admin}.microsoft.com/...{path}`
- **Vista exacta:** {explicación de qué pestaña, filtros aplicados, etc.}
- **Resolución:** 1920×1080 / 1400×900 (según aplique)
- **Anotaciones (numeradas):**
  1. {Qué señalar con el rectángulo + número 1}
  2. {Qué señalar con el rectángulo + número 2}
  3. {...}
- **Anonimización:** {qué blurrar/sustituir}
- **Filename:** `MNN-CAP-01-{descriptor-kebab-case}.png`
- **Path final:** `modulos/modulo-NN-{slug}/assets/capturas/MNN-CAP-01-{descriptor}.png`
```
