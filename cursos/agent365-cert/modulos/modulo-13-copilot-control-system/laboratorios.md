---
modulo: 13
tipo: laboratorios
titulo: "Laboratorios del Módulo 13"
duracion_total_min: 60
ultima_actualizacion: 2026-05-11
laboratorios:
  - id: LAB-13-1
    titulo: "Configurar política Curated catalog y validar compliance rate"
    duracion_min: 30
  - id: LAB-13-2
    titulo: "Generar el reporte mensual al comité de gobernanza desde CCS"
    duracion_min: 30
---

# Módulo 13 — Laboratorios

> Dos laboratorios prácticos para consolidar la teoría sobre Copilot Control System aplicado a Agent 365. Los labs son más cortos que en módulos anteriores (M11-M12) por el menor volumen del módulo, pero igualmente entregan artefactos concretos. Tiempo total aproximado: 60 minutos.
>
> **Prerrequisitos comunes:**
>
> - Tenant Microsoft 365 con Agent 365 y Copilot 365 activados.
> - Acceso a Microsoft Copilot Control System (CCS).
> - Rol asignado a tu usuario: `Copilot Administrator` o `Global Administrator`.
> - Al menos 50 usuarios licenciados con Copilot 365 en el tenant para que la telemetría sea representativa.
> - Al menos un grupo de Entra ID (`Marketing`, `Comercial`, `Finanzas`...) con miembros para usar como scope en las políticas.

---

## LAB-13-1 — Configurar política Curated catalog y validar compliance rate

**Duración:** 30 min · **Producto:** Copilot Control System → Agent governance · **OA:** OA-13.3.

### Objetivo

Implementar el modelo de política Curated catalog para un grupo de Entra ID concreto, validar empíricamente su comportamiento con invocaciones reales y medir el compliance rate después de 24-48 horas. El entregable es una política activa documentada y un primer ciclo de medición.

### Pasos

1. **Abre Copilot Control System** (microsoft365.com/admin → Copilot → Control System) → Agent governance → Catalog policies.

2. **Selecciona el grupo objetivo**: utiliza un grupo de Entra ID con 20-50 miembros (`Marketing-Europe` o equivalente). Si no tienes uno, créalo en Entra ID con miembros de prueba.

3. **Crea la política Curated**:
   - Click `Create policy`.
   - **Name**: `Marketing-Europe-Curated-2026Q2`.
   - **Description**: «Curated catalog para Marketing Europa Q2 2026. Allowlist: agentes de productividad estándar + 2 agentes específicos de research. Revisión trimestral».
   - **Scope**: Entra group → `Marketing-Europe`.
   - **Mode**: `Curated catalog`.

4. **Define la allowlist**:
   - Click `Add agents to allowlist`.
   - Selecciona los agentes estándar disponibles en el catálogo: `Outlook Copilot Assistant`, `Teams Meeting Summarizer`, `Word Document Helper`.
   - Añade 2 agentes específicos de research del catálogo del tenant: `Research-Brief-Generator`, `Competitive-Analysis-Helper`.
   - Total: 5 agentes en la allowlist.

5. **Configuración adicional**:
   - **Approval requirement** para agentes nuevos: **No** (los 5 de la allowlist se permiten directamente).
   - **Communication**: configura el mensaje al usuario cuando intenta acceder a un agente fuera de la allowlist:
     > «Este agente no está incluido en la lista aprobada para Marketing-Europe en Q2 2026. Si necesitas acceso, abre un ticket en ServiceNow categoría `Agent365-Access-Request`».

6. **Save and apply**. La política se propaga en 5-15 minutos.

7. **Validación empírica (después de 30 min)**:
   - Invoca con un usuario del grupo: uno de los agentes de la allowlist (debe funcionar normalmente).
   - Intenta invocar con el mismo usuario un agente fuera de la allowlist (debe bloquearse y mostrar el mensaje).
   - Documenta los timestamps de ambas pruebas.

8. **Medición del compliance rate después de 24-48h**:
   - Vuelve a CCS → Agent governance → Catalog policies → tu política → Compliance metrics.
   - Verifica:
     - **Compliance rate**: % de invocaciones dentro de la política. Target operativo: > 95 %.
     - **Friction**: número de tickets de aprobación generados; tiempo medio resolución. Threshold: < 5 tickets por semana para grupo de 20-50 usuarios.
     - **Coverage**: % de usuarios del grupo que han invocado al menos un agente. Threshold: > 60 % en primera semana.

9. **Ajustes iniciales** (si los KPIs no están en target):
   - Compliance < 95 %: identificar los 3 agentes más solicitados fuera de allowlist. Decidir si añadirlos o si justifica mantenerlos fuera.
   - Friction alto: ajustar la comunicación de la política para reducir intentos repetidos.
   - Coverage bajo: campaña interna de comunicación con los 5 agentes disponibles.

### Validación

- Política `Marketing-Europe-Curated-2026Q2` está activa en CCS.
- Test de allowlist funciona en ambos sentidos (permite los aprobados, bloquea los no aprobados).
- Métricas iniciales documentadas: compliance rate, friction, coverage.
- Documento de ajustes propuestos para la próxima revisión.

### Variantes y extensiones

- Crear una segunda política Approval-based para un agente sensible (acceso a datos financieros), con flujo de ticket automático a ServiceNow para cada solicitud.
- Configurar workflow en Power Automate que extraiga semanalmente las métricas de compliance y las publique en Teams del responsable de gobernanza de IA.

---

## LAB-13-2 — Generar el reporte mensual al comité de gobernanza desde CCS

**Duración:** 30 min · **Producto:** Copilot Control System → Telemetry + Reporting · **OA:** OA-13.5.

### Objetivo

Generar el reporte mensual estándar de gobernanza de IA desde CCS, completarlo con narrativa ejecutiva, y dejarlo listo para presentación al comité de gobernanza. El entregable es un PDF formateado más una presentación PPTX exportable directamente desde CCS.

### Pasos

1. **Define el periodo y audiencia**:
   - Comité de gobernanza mensual: típicamente segundo martes de cada mes.
   - Periodo del reporte: mes natural anterior al comité (si el comité es 12 de junio, periodo del reporte = mayo).
   - Audiencia primaria: CIO, CFO, CISO, director de IA. Audiencia secundaria: responsables de departamento con agentes activos.

2. **Genera el reporte automático desde CCS**:
   - CCS → Reports → Monthly governance report → Generate.
   - Selecciona el mes (mayo 2026).
   - Formato: PDF + PPTX.
   - Tiempo de generación: 5-10 minutos.

3. **Revisa el contenido auto-generado**. El reporte estándar incluye 4 secciones:

   **Sección 1 — Adopción**:
   - DAU/MAU del mes con tendencia mes a mes.
   - Top 10 agentes por uso, con departamento de los usuarios.
   - Distribución de invocaciones por departamento.
   - Cobertura de licencias: licencias asignadas vs usuarios activos.

   **Sección 2 — Coste**:
   - Gasto mensual de licencias Copilot.
   - Gasto mensual de agentes premium (si aplica).
   - Coste por usuario activo (Total / DAU).
   - Proyección anualizada.

   **Sección 3 — Cumplimiento**:
   - % invocaciones dentro de política (compliance rate global).
   - Número de override events DLP del mes (input de Defender XDR + Purview).
   - Número de incidents de seguridad cerrados (input de Defender XDR).
   - Número de pending approvals activos.

   **Sección 4 — Oportunidades**:
   - Agentes con alta demanda pendientes de aprovisionamiento (basado en denials de catalog policies).
   - Departamentos con baja adopción que requieren plan de activación (coverage < 50 %).
   - Licencias infrautilizadas para reasignación (uso < 5 invocaciones/mes).

4. **Añade la narrativa ejecutiva** (el reporte auto-generado tiene datos pero no narrativa). Para cada sección, escribe 2-3 párrafos que respondan:

   - **¿Qué cambió este mes vs anterior?** Datos brutos + interpretación.
   - **¿Por qué?** Hipótesis con evidencia.
   - **¿Qué proponemos hacer?** Acciones concretas con owner y fecha objetivo.

5. **Validación cruzada con Defender XDR**:
   - Para los incidents reportados en Sección 3, abrir el portal de Defender XDR y validar que coinciden con los cierres reales del SOC.
   - Si hay discrepancia, investigar antes de presentar al comité.

6. **Validación cruzada con Purview**:
   - Para los override events reportados, validar contra Purview audit log.
   - Documentar si hay events relevantes que el reporte de CCS no capturó (puede ocurrir por lag de sincronización).

7. **Exporta para distribución**:
   - PDF para email al comité 48h antes de la reunión (lectura previa).
   - PPTX como soporte de la presentación oral en la reunión.

8. **Después del comité, documenta**:
   - Decisiones tomadas en la reunión.
   - Cambios a políticas que necesitan implementarse antes del próximo comité.
   - Acciones de seguimiento con owner asignado.

### Validación

- Reporte mensual generado desde CCS con sus 4 secciones completas.
- Narrativa ejecutiva añadida a cada sección.
- Validación cruzada con Defender XDR y Purview documentada.
- PDF + PPTX exportados y enviados a la audiencia con tiempo de lectura previo.

### Variantes y extensiones

- Programar la generación del reporte automáticamente el primer lunes del mes con notificación al responsable de gobernanza.
- Construir un workbook de Sentinel con la misma narrativa para alineación con el CISO y el SOC.
- Diseñar un slide ejecutivo único «one-pager» del reporte para presentación al CEO en comités estratégicos donde el detalle completo es excesivo.

---

## Cierre

Tras los dos labs has tocado las dos palancas operativas más usadas de CCS: configuración de políticas centralizadas con medición de compliance (LAB-13-1) y generación de reporting ejecutivo mensual (LAB-13-2).

Si quieres ir más allá:

- Diseñar el calendario operativo anual de gobernanza de IA: rituales semanales, mensuales, trimestrales, anuales.
- Conectar CCS con el sistema de tickets corporativo (ServiceNow, Jira) para automatizar approval-based flows.
- Construir el modelo de evolución de políticas: cuándo pasar de Approval-based a Curated, de Curated a Open.

El siguiente módulo (M14) cubre **gobernanza avanzada y multi-tenant**: cómo escalar lo aprendido aquí a organizaciones complejas con varios tenants o estructuras federadas.
