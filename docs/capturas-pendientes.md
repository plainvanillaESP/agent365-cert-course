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
