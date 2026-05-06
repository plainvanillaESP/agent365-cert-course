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
