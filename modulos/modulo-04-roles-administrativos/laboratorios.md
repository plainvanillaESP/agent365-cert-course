---
modulo: 4
tipo: laboratorios
titulo: "Laboratorios del Módulo 04"
duracion_min: 25
area_examen: 1
estado: producido
fase_produccion: 3
ultima_actualizacion: 2026-05-06
laboratorios:
  - id: "04.1"
    titulo: "Asignar roles least-privilege a un equipo de seguridad"
    duracion_min: 25
    dificultad: intermedio
    requiere_tenant: true
    licencias_requeridas:
      - "Microsoft Agent 365"
      - "Microsoft Entra ID P1 (para PIM)"
    roles_requeridos:
      - "Global Administrator (para asignar otros roles)"
      - "Privileged Role Administrator"
---

# Módulo 04 — Laboratorios

## Prerrequisitos

- Lectura completa de la teoría del Módulo 04.
- Acceso a un tenant con Microsoft Agent 365 activado y Entra ID P1 (necesario para PIM).
- Rol Global Administrator o Privileged Role Administrator para asignar roles a otros usuarios.
- Si no dispones de tenant, el lab se puede ejecutar como ejercicio en papel/hoja de cálculo: la lógica de las decisiones es la misma.

---

## Lab 04.1 — Asignar roles least-privilege a un equipo de seguridad

**Duración:** 25 min · **Dificultad:** Intermedia

### Objetivo

Aplicar el principio de least-privilege al diseño de la matriz de delegación de un equipo IT real, ejecutar las asignaciones desde Microsoft Entra admin center y, donde corresponda, configurar PIM para los roles con privilegio elevado.

### Caso

**Plain Coffee SL** ya conocida del Módulo 04. Aquí se trabajan **tres variaciones** del caso base que ponen a prueba la comprensión del catálogo y del principio.

#### Variación 1 — Marta se va de baja por 3 meses

Marta (Admin M365 backup) se va de baja por maternidad. Durante esos 3 meses, ¿cómo redistribuyes sus responsabilidades? Específicamente:

- ¿Quién cubre AI Administrator?
- ¿Quién cubre Lifecycle Workflows Admin?
- ¿Es buena idea que Luis acumule los roles de Marta temporalmente?
- ¿Cómo se gestiona la asignación temporal para que se revierta automáticamente cuando Marta vuelva?

#### Variación 2 — Plain Coffee compra un negocio en sector regulado

Plain Coffee SL adquiere una pequeña marca de café enfocada al canal de hostelería de hospitales. El nuevo negocio aporta un compliance officer adicional (Pedro Ríos) y la organización cae bajo regulación adicional (HIPAA-like a nivel español, supervisión sanitaria). Esto añade requisitos:

- Risks column en Registry obligatoria (E7 ya activo).
- Acceso de auditor externo cada 6 meses (no anual como antes).
- Logs de Defender con retención mínima 365 días (no la default de 30).

¿Qué cambios introduces en la matriz de roles? ¿Pedro reemplaza a Ana o coexiste con ella? ¿Qué scope les das?

#### Variación 3 — Mini-escenarios de least-privilege

Para cada tarea, identifica el rol mínimo que la cubre:

| Tarea | Rol mínimo |
|---|---|
| 1. Aprobar un nuevo agente Copilot Studio en el Registry | ? |
| 2. Investigar una alerta de Defender sobre un agente sospechoso (sin modificar políticas) | ? |
| 3. Configurar una política de Conditional Access que bloquee agentes sin Entra Agent ID | ? |
| 4. Auditar trimestralmente la lista de agentes y sus owners para cumplir SOX | ? |
| 5. Configurar lifecycle workflow para que el agente de un empleado que se va se transfiera a su manager | ? |
| 6. Ver el coste de Copilot Credits del último trimestre | ? |
| 7. Crear un nuevo agente Foundry para análisis financiero (siendo desarrollador del equipo) | ? |
| 8. Aplicar sensitivity label a los datos accedidos por agentes de RRHH | ? |

### Plantilla de output

Para cada variación, completa:

| Campo | Cómo se completa |
|---|---|
| Variación 1 — Asignaciones temporales | Lista de personas + roles + duración |
| Variación 1 — Mecanismo de reversión | Manual / Access Review / PIM eligible / fecha fin explícita |
| Variación 2 — Matriz actualizada | Tabla persona ↔ roles con cambios resaltados |
| Variación 2 — Justificación de cambios | 3-4 líneas por cada cambio |
| Variación 3 — Tabla de respuestas | Las 8 tareas con su rol mínimo |

### Ejecución técnica (si tienes tenant)

Si tu tenant lo permite, ejecuta las asignaciones reales:

1. **Asignación permanente.** Microsoft Entra admin center → Identity → Roles & administrators → seleccionar rol → Add assignments → seleccionar usuario → Assign.

2. **Asignación temporal con fecha fin.** En el mismo flujo, en lugar de Active assignment, elegir **Eligible assignment** con fecha de inicio y fin. El usuario podrá activar el rol durante esa ventana, no antes ni después.

3. **PIM con activación bajo demanda.** Microsoft Entra → PIM → Microsoft Entra roles → Roles → seleccionar rol (ej: AI Administrator) → Add assignments → seleccionar usuario → **Eligible** → configurar duración máxima de activación (ej: 4 horas), justificación obligatoria, MFA requerido.

4. **Access Review.** Microsoft Entra → PIM o Identity Governance → Access reviews → Create review → seleccionar el rol y los asignados → frecuencia trimestral o semestral. Al final del periodo, los asignados que no son revalidados pierden el rol automáticamente.

---

## Solución comentada

> Lee solo después de haber resuelto las tres variaciones.

<details>
<summary>Solución completa</summary>

### Variación 1 — Marta de baja

**Asignaciones temporales:**

- Luis Ortega: añade temporalmente Lifecycle Workflows Admin (que tenía Marta). Mantiene su catálogo actual.
- Eva Martín (CIO): activa AI Administrator vía PIM cuando se necesite (raramente, porque Luis ya lo tiene).
- Si la organización lo justifica, contratar a un IT externo o reasignar puntualmente a un técnico interno con el rol AI Administrator + Lifecycle Workflows Admin durante los 3 meses.

**Mecanismo de reversión:** **Eligible assignment con fecha de fin** (3 meses desde la fecha de baja). Al cabo de 3 meses, los roles añadidos a Luis caducan automáticamente. Si Marta vuelve antes o después, se ajusta manualmente. Alternativa: Access Review trimestral que valida si los roles temporales siguen siendo necesarios.

**Reflexión:** acumular dos AI Administrator (Luis original + el rol que tenía Marta) **no es** un riesgo significativo: ambos hacen lo mismo. El verdadero riesgo es si Luis se va de vacaciones simultáneamente, dejando el equipo sin cobertura. Por eso es recomendable que Eva tenga AI Administrator vía PIM como backup.

### Variación 2 — Adquisición regulada

**Cambios introducidos:**

- **Pedro Ríos coexiste con Ana**, no la reemplaza. Pedro se encarga del compliance del nuevo negocio sanitario; Ana mantiene compliance del negocio principal. Ambos tienen el mismo conjunto de roles (Compliance Administrator + IRM Administrator + AI Reader) pero con **scope distinto**: Ana ve la unidad administrativa del negocio principal, Pedro ve la nueva.
- **Auditor externo:** se cambia el patrón de asignación de Global Reader anual a Global Reader cada 6 meses, mediante Access Review programado. La cuenta del auditor (`auditor-2026-h1@plaincoffee.onmicrosoft.com`) se reactiva con cada periodo y caduca automáticamente.
- **Retención de Defender:** no es un cambio de roles, es un cambio de configuración. Se activa desde Defender → Settings → Retention. La persona que lo configura es Security Administrator (rol que **ningún miembro del equipo IT actual tiene**: hay que crear ese rol o promover a Dani/Sara temporalmente vía PIM).

**Justificación de cambios:** scope por unidad administrativa permite que Pedro y Ana coexistan sin ver datos del otro negocio. Auditoría más frecuente requiere automatización vía Access Review (no se puede recordar manualmente cada 6 meses). El cambio de retención requiere un rol con escritura que el equipo actual no tiene asignado permanentemente; PIM activa Security Administrator para Dani durante la ventana de configuración (1-2 horas) con justificación documentada.

### Variación 3 — Mini-escenarios

| Tarea | Rol mínimo | Comentario |
|---|---|---|
| 1. Aprobar agente nuevo en Registry | **AI Administrator** | Aprobar es escritura. Reader no basta. |
| 2. Investigar alerta de Defender sin modificar políticas | **Security Operator** | Reader solo ve, Operator investiga y responde. Sin escritura en políticas. |
| 3. Política CA que bloquea agentes sin Entra Agent ID | **Conditional Access Administrator** | CA Admin específicamente. Security Admin no incluye CA. |
| 4. Auditoría trimestral de agentes y owners para SOX | **AI Reader** o **Global Reader** | Solo lectura. Global Reader si quieres ver más allá de Agent workload (recomendado para auditoría). |
| 5. Lifecycle workflow para sponsorship transfer | **Lifecycle Workflows Administrator** | Específicamente este rol; otros no acceden a workflows. |
| 6. Ver coste de Copilot Credits | **Billing Administrator** | Reader de billing (existe en algunos tenants) o Billing Administrator. |
| 7. Crear agente Foundry siendo desarrollador | **Agent ID Developer** | Suficiente para sus propios agentes. No requiere Administrator. |
| 8. Aplicar sensitivity label a datos accedidos por agentes | **Compliance Administrator** | DLP y sensitivity labels viven en Purview Compliance. |

</details>

---

## Errores frecuentes

| Error | Por qué pasa | Cómo evitarlo |
|---|---|---|
| Asignar Global Administrator «por simplicidad» | El admin no quiere pensar qué rol concreto necesita el usuario | Aplica least-privilege siempre: empieza por el Reader y sube solo si es necesario |
| Acumular roles en una sola persona por «hacerlo todo» | Un solo punto de fallo y un solo objetivo de ataque | Divide entre dos personas y haz backup mutuo |
| Asignar roles permanentes a privilegios elevados | Inercia administrativa | Convierte todos los Administrator a PIM con eligible assignment |
| Olvidar Access Reviews | Se asigna un rol y nadie revisa si sigue siendo necesario | Configura review trimestral o semestral en cada rol crítico |
| Confundir AI Administrator con Global Administrator | Nombre nuevo introducido en mayo de 2026 | AI Administrator solo cubre Agent workload; Global cubre todo. Ver § 4.1 |

---

## Validación

Si has resuelto las 3 variaciones aplicando explícitamente least-privilege y PIM donde corresponde, estás preparado para el M05. Si dudaste en la variación 3 (mini-escenarios), repasa el catálogo en § 4.1 antes de avanzar.
