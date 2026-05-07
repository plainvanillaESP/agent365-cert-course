---
modulo: 7
tipo: laboratorios
titulo: "Laboratorios del Módulo 07"
duracion_min: 45
area_examen: 3
estado: producido
fase_produccion: 4
ultima_actualizacion: 2026-05-06
laboratorios:
  - id: "07.1"
    titulo: "Recorrido completo por Registry y Map con filtros"
    duracion_min: 25
    dificultad: basico
    requiere_tenant: true
    licencias_requeridas:
      - "Microsoft Agent 365 (cualquier SKU)"
    roles_requeridos:
      - "AI Reader (mínimo)"
      - "AI Administrator (recomendado para acciones)"
  - id: "07.2"
    titulo: "Exportar inventario y analizar en Excel"
    duracion_min: 20
    dificultad: intermedio
    requiere_tenant: true
    licencias_requeridas:
      - "Microsoft Agent 365"
      - "Microsoft Excel (Microsoft 365 Apps)"
    roles_requeridos:
      - "AI Reader"
---

# Módulo 07 — Laboratorios

## Prerrequisitos

- Lectura completa de la teoría del Módulo 07.
- Tenant de Microsoft 365 con Agent 365 activado y al menos algunos agentes desplegados (idealmente, los del Lab 06.2 si vienes de la secuencia).
- Si tu tenant es nuevo y solo tiene 1-2 agentes, el lab 07.1 funcionará pero el 07.2 (análisis con tabla pivote) requerirá al menos 10-15 agentes para tener volumen interesante.

> Si no dispones de tenant, los labs funcionan como ejercicio de comprensión: lee cada paso, mira el SVG correspondiente del módulo y razona qué verías en cada pantalla.

---

## Lab 07.1 — Recorrido completo por Registry y Map con filtros

**Duración:** 25 min · **Dificultad:** Básica

### Objetivo

Familiarizarse con la navegación del Agent Registry y del Agent Map. Aplicar filtros combinados, identificar agentes con características concretas y cambiar entre vistas tabular y gráfica.

### Procedimiento

#### Parte A — Recorrido por el Registry (10 min)

1. Abrir `M365 admin center → Agents → Registry`.
2. **Verificar las columnas estándar**: Display name, Publisher, Platform, Owner, Status, Last activity, Active users (30d), Risks (si tienes E7).
3. **Customize columns** (botón superior derecho) → añadir las columnas: Created date, Tags, Sponsor.
4. **Ordenar por Last activity descendente**. Identificar los 3 agentes más recientes.
5. **Búsqueda full-text**: probar el buscador con el nombre parcial de un agente conocido.

#### Parte B — Aplicar filtros combinados (8 min)

Responder a las siguientes preguntas con filtros, sin recurrir al buscador:

1. ¿Cuántos agentes **Third Party Active** tiene el tenant?
   - Filtros: Publisher = Third Party · Status = Active.
   - Anotar el conteo.

2. ¿Cuántos agentes de **Copilot Studio creados en los últimos 30 días**?
   - Filtros: Platform = Copilot Studio · Date = Created last 30 days.
   - Anotar el conteo.

3. Si tienes E7: ¿cuántos agentes están en estado de riesgo **Medium o superior**?
   - Filtros: Risk = Medium, High, Critical.
   - Anotar el conteo.

4. ¿Hay algún agente **ownerless**?
   - Filtros: clear all (limpiar) y ordenar por columna Owner ascendente.
   - Las primeras filas tendrán Owner vacío si los hay.

#### Parte C — Cambio a Agent Map (5 min)

1. Click en la pestaña **Map** (junto a Registry).
2. **Fit to view**: encajar todo el grafo en pantalla.
3. **Identificar clusters**: ¿cuántos clusters hay y de qué plataformas?
4. **Detectar agentes hub**: nodos con varias conexiones entrantes. ¿Hay alguno?
5. **Click sobre un nodo**: panel lateral con la misma vista de detalle del Registry.

#### Parte D — Comparar Registry vs Map (2 min)

Anotar:
- ¿Qué información ves mejor en Registry?
- ¿Qué información ves mejor en Map?
- ¿Cuándo abrirías cada una?

### Output esperado

Documento corto (½ página) con:
- Conteos de las 4 preguntas de Parte B.
- Captura de pantalla del Agent Map con clusters identificados.
- Reflexión Registry vs Map.

### Errores frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| Risks column no aparece | Sin E7 | Confirmar licencia; sin E7 esa columna no se muestra |
| Map dice «too many agents» | >200 agentes en filtro activo | Aplicar más filtros antes de cargar el Map |
| Owner aparece vacío para agentes que sí tienen owner | Owner es un grupo (no usuario) y la UI no lo carga | Click en el agente y verificar en el panel de detalle |
| Filtros no se aplican | Bug ocasional de la UI | Refrescar la página y reaplicar |

---

## Lab 07.2 — Exportar inventario y analizar en Excel

**Duración:** 20 min · **Dificultad:** Intermedia

### Objetivo

Exportar el inventario completo de agentes a Excel, construir tablas pivote para análisis cruzados y generar evidencia documentable para reporting periódico.

### Procedimiento

#### Parte A — Exportación (3 min)

1. En `Agents → Registry`, **clear all filters** para tener el inventario completo.
2. Click en **Export** arriba a la derecha → **Excel (.xlsx)**.
3. Esperar la descarga (puede tardar 30-60 segundos para tenants grandes).
4. Abrir el archivo en Excel.

#### Parte B — Inspección de columnas (3 min)

El archivo `.xlsx` exportado contiene **más columnas** que las visibles en la UI. Verificar que están presentes:

- Display name, Publisher, Platform, Owner UPN, Status.
- Last activity, Created date, Last updated.
- Active users (30d), Total invocations, Run-time.
- Risk level, Risk score numérico, Top risk causes.
- Tags, Sponsor, Capabilities (datasources, plugins).
- Custom security attributes (cada uno como columna separada).

#### Parte C — Tabla pivote: agentes por plataforma × estado (5 min)

1. Insertar **PivotTable** desde la pestaña Insert.
2. **Filas**: Platform.
3. **Columnas**: Status.
4. **Valores**: Count of Display name.
5. Resultado esperado: matriz con plataformas en filas y estados en columnas, contando agentes.

Pregunta a responder con esta tabla: ¿qué plataforma tiene **más agentes Pending approval**? ¿Es coherente con la política de la organización?

#### Parte D — Tabla pivote: ownership y riesgo (5 min)

1. Crear segunda PivotTable.
2. **Filas**: Owner UPN (top 10 owners).
3. **Columnas**: Risk level (con E7).
4. **Valores**: Count of Display name.

Identificar los **owners con más agentes en High/Critical**. Estos son candidatos a:

- Recibir formación de governance.
- Reasignar parte de sus agentes para reducir concentración.

#### Parte E — Identificar 3 ownerless y 2 at-risk (3 min)

1. Filtro en la hoja exportada: Owner UPN = vacío. Listar los 3 primeros.
2. Filtro: Risk level = High o Critical. Listar los 2 primeros.
3. Anotar Display name, Platform y última actividad de cada uno.

#### Parte F — Documentar (1 min)

Crear documento `Analisis-Agent365-{fecha}.md` con:

- Conteo total de agentes y desglose por publisher.
- Las dos tablas pivote (capturas).
- Lista de 3 ownerless y 2 at-risk identificados.
- Acciones recomendadas para cada uno.

### Output esperado

- Archivo `.xlsx` exportado del Registry.
- Workbook con 2 PivotTables.
- Documento `.md` con análisis y recomendaciones.

### Errores frecuentes

| Síntoma | Causa | Solución |
|---|---|---|
| Export devuelve error «too large» | >5000 agentes en el tenant | Aplicar filtros antes de exportar (por ejemplo, exportar por plataforma) |
| Columnas Risk vacías en el .xlsx | Sin E7 o sin Defender connector | Esperado en tenants sin E7. Las pivotes de Risk no funcionarán |
| PivotTable da error de tipo | Columna numérica leída como texto | Excel: seleccionar columna → Data → Text to columns → Number |
| Valores muy bajos o cero en todas las pivotes | Lab 07.1 dejó filtros activos al exportar | Volver al Registry, clear all filters, re-exportar |

---

## Solución comentada

> Lee solo después de haber ejecutado los procedimientos.

<details>
<summary>Solución completa</summary>

### Lab 07.1

**Tiempo real esperado:** 20-30 min según familiaridad con M365 admin center y tamaño del tenant.

**Patrones a observar:**

- Si la mayoría de agentes son **Microsoft** Publisher, el tenant está principalmente con built-in (poca adopción interna).
- Si la mayoría son **Organization**, hay buena adopción interna (positivo) o shadow IT (negativo).
- Si la mayoría son **Third Party**, revisar la política: ¿es OK que tantos agentes externos operen?

**Sobre el Map:**

- Si todos los agentes están en un solo cluster, probablemente solo se usa una plataforma. Considera si hay un caso de uso para diversificar.
- Si los clusters están bien balanceados (Copilot Studio + Foundry, por ejemplo), la organización tiene madurez en adopción.
- Sin conexiones agent-to-agent: los agentes son aislados. No es malo per se, pero indica que aún no se hacen multi-agent workflows.

### Lab 07.2

**Tiempo real esperado:** 15-25 min.

**Insights típicos en organizaciones reales:**

- **Pareto en Owner**: 5-10 owners tienen el 60-80 % de los agentes. Los Top 5 deberían recibir formación de governance prioritaria.
- **Pareto en Risk**: si la columna Risk está poblada, suele haber 3-5 owners con todos los agentes en riesgo. Mismo patrón que el anterior.
- **Pending approval por plataforma**: si Copilot Studio tiene la mayoría, es porque es la plataforma low-code donde más empleados crean agentes sin pasar por IT. Es positivo (adopción) pero exige proceso de aprobación robusto.

**Documento de evidencia:**

El `.md` generado es el primer documento operativo del módulo. Sirve como:
- Reporte trimestral al CISO.
- Evidencia para auditoría externa.
- Punto de partida para conversaciones con cada owner sobre sus agentes en riesgo.

</details>

---

## Errores frecuentes (consolidado)

| Error | Lab | Cómo evitarlo |
|---|---|---|
| Exportar con filtros activos | 07.2 | Clear all filters antes del export para inventario completo |
| Confundir Map → con uso de un agente | 07.1 | La flecha A → B significa que A invoca a B (no que B usa A) |
| Asumir que «Owner = vacío» son agentes legítimos sin owner | Ambos | Vacío es ownerless: hay que asignar owner |
| Trabajar con la tabla pivote sin convertir el rango a Tabla | 07.2 | Insertar como Table primero (Ctrl+T) y luego PivotTable |

---

## Validación

Si has completado los dos labs, tienes la rutina operativa básica del Agent workload: navegación, filtros, exportación, análisis. En el M08 entraremos en las acciones que se pueden ejecutar SOBRE el inventario (publishing, deprecación, distribución).
