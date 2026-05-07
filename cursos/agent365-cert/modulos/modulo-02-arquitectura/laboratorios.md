---
modulo: 2
tipo: laboratorios
titulo: "Laboratorios del Módulo 02"
duracion_min: 30
area_examen: 1
estado: producido
fase_produccion: 3
ultima_actualizacion: 2026-05-06
laboratorios:
  - id: "02.1"
    titulo: "Recorrido guiado por la arquitectura"
    duracion_min: 30
    dificultad: basico
    requiere_tenant: true
    licencias_requeridas:
      - "Microsoft Agent 365 (standalone o E7)"
    roles_requeridos:
      - "Global Reader"
      - "AI Reader"
---

# Módulo 02 — Laboratorios

> Este lab requiere acceso a un tenant con Microsoft Agent 365 activado. Si no dispones de uno, lee la solución comentada al final: cubre el mismo recorrido con capturas anotadas.

---

## Prerrequisitos

- **Tenant:** con Microsoft Agent 365 activado (standalone o vía M365 E7).
- **Licencias del operador:** ninguna asignada al usuario que ejecuta el lab; los roles bastan.
- **Roles:** Global Reader **o** AI Reader. No hace falta privilegio de escritura.
- **Tiempo total estimado:** 30 minutos.
- **Modo:** lectura. El lab no modifica nada del tenant.

---

## Lab 02.1 — Recorrido guiado por la arquitectura

**Objetivo:** localizar visualmente cada componente del diagrama de arquitectura del Módulo 02 dentro del tenant. Al finalizar, el alumno tiene un documento de referencia personal con capturas anotadas que le servirá de mapa para el resto del curso.

**Resultado esperado:** un documento (PDF, Word o cuaderno digital) con las 5 capturas del recorrido, cada una identificada con su componente arquitectónico.

### Recorrido en 5 paradas

#### Parada 1: Overview

1. Abre `https://admin.microsoft.com` con tu cuenta administradora.
2. En el menú lateral izquierdo, baja hasta encontrar **Agents**. Si no lo ves, despliega *Show all*.
3. Haz clic en **Agents → Overview**.
4. Identifica visualmente las **4 hero metrics**: Registry total, Active users (last 28 days), Run-time (last 28 days), Registry sync.
5. Captura la pantalla completa.

**Anotaciones a hacer en la captura:** rectángulo rojo alrededor de cada hero metric. Numerar 1 a 4 según orden de la tabla en § 2.2.

> [CAPTURA PENDIENTE — `assets/lab02-1-overview.png`] Pantalla completa de Overview con las 4 hero metrics rodeadas y numeradas.

#### Parada 2: Registry

1. Desde el menú lateral, **Agents → Registry**.
2. Observa las **columnas de la tabla**: Name, Type, Publisher, Owner, Status, Last activity, Risks (si tu licencia lo permite).
3. Aplica un filtro por **Publisher = Your organization** para ver solo los agentes internos.
4. Selecciona un agente y abre su página de detalle.

**Anotaciones a hacer en la captura del Registry:** rectángulo rojo alrededor de la columna **Publisher** y de la columna **Type**. Estos son los dos atributos que el examen evalúa más.

> [CAPTURA PENDIENTE — `assets/lab02-2-registry.png`] Tabla del Registry con filtro Your organization aplicado y columnas Type y Publisher destacadas.

#### Parada 3: Página de detalle del agente

1. En la página de detalle (que abriste al final de la parada 2), identifica las **5 pestañas**: Identity, Permissions, Activity, Risks, Settings.
2. Si tu licencia es M365 E7, la pestaña **Risks** debería tener contenido. Si no, verás un mensaje de upgrade.
3. Anota el **Entra Agent ID** del agente: es el identificador que aparece bajo *Identity*. Lo necesitarás en el M06.

**Anotaciones a hacer en la captura del detalle:** rectángulo rojo alrededor de las 5 pestañas, numeradas 1 a 5.

> [CAPTURA PENDIENTE — `assets/lab02-3-detalle-agente.png`] Página de detalle de un agente con las 5 pestañas visibles.

#### Parada 4: Map

1. Vuelve al menú lateral, **Agents → Map**.
2. Observa la visualización de grafo. Cada nodo es un agente; los colores agrupan por plataforma (MCS, Foundry, Agent Builder, SharePoint).
3. Si tu tenant tiene agentes en flujos multi-agente, verás aristas entre nodos. Si no, todos los nodos aparecen aislados.
4. Haz clic en un nodo: se abre el mismo panel de detalle de la parada 3.

**Anotaciones a hacer en la captura del Map:** rectángulo rojo alrededor de la **leyenda** (esquina superior derecha o inferior, según versión) que explica los colores por plataforma.

> [CAPTURA PENDIENTE — `assets/lab02-4-map.png`] Vista Map del Agent workload con leyenda destacada.

#### Parada 5: Settings

1. Menú lateral, **Agents → Settings**.
2. Identifica las **secciones de configuración**: Activación del workload, Defaults de publishing, Integraciones (Defender / Purview), Override de templates.
3. **No modifiques nada.** Este lab es solo de lectura.
4. Captura la página completa.

**Anotaciones a hacer en la captura de Settings:** rectángulo rojo alrededor del bloque de **Integraciones** — es donde se conectan Defender y Purview, los otros dos pilares del control plane.

> [CAPTURA PENDIENTE — `assets/lab02-5-settings.png`] Página de Settings con el bloque Integraciones destacado.

---

## Solución comentada

<details>
<summary>Ver solución completa</summary>

### Mapeo del recorrido al diagrama de arquitectura

| Parada | Componente del diagrama de § 2.1 |
|---|---|
| 1 — Overview | Microsoft 365 admin center → Agent workload (capa de visibilidad) |
| 2 — Registry | Microsoft 365 admin center → Agent Registry (inventario) |
| 3 — Detalle de agente | Bisagra entre M365 admin (Permissions, Activity, Settings), Entra Agent ID (Identity), Defender (Risks) |
| 4 — Map | Microsoft 365 admin center → Agent Map (visualización del Registry) |
| 5 — Settings | Punto de integración con Defender y Purview |

### Errores frecuentes

- **No encontrar Agents en el menú lateral:** suele estar al final del menú o requiere expandir *Show all*. Si tu rol no incluye Global Reader o AI Reader, no aparece nada.
- **Run-time hero metric en cero o muy bajo:** normal en tenants con pocos agentes Agent 365 SDK. Esa métrica solo cuenta los agentes con SDK integrado, no los Copilot Studio simples.
- **Pestaña Risks vacía o ausente:** la columna y pestaña Risks requieren licencia M365 E7. Sin E7, el alumno no la verá; eso no es un error de configuración.
- **Columna Publisher confusa:** *Your organization* incluye agentes de IT y de los empleados. Si solo se quieren ver los de IT, hay que combinar el filtro de Publisher con el de Owner.

### Validación

El lab está completo cuando el alumno tiene:

- [ ] 5 capturas anotadas, una por parada del recorrido.
- [ ] Identificado al menos un agente en el Registry y anotado su Entra Agent ID.
- [ ] Localizado el bloque de Integraciones en Settings.
- [ ] Comprendido por qué el detalle de un agente toca componentes de los tres admin centers (M365, Entra, Defender) en vez de uno solo.

Si las cuatro condiciones se cumplen, el alumno está listo para el M03 (Licenciamiento, prerrequisitos y planificación).

</details>
