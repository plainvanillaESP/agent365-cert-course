---
modulo: 14
tipo: laboratorios
titulo: "Laboratorios del Módulo 14"
duracion_total_min: 60
ultima_actualizacion: 2026-05-11
laboratorios:
  - id: LAB-14-1
    titulo: "Configurar delegated administration cross-tenant con GDAP + Customer Lockbox"
    duracion_min: 30
  - id: LAB-14-2
    titulo: "Diseñar y validar policy framework distribuido para 3 tenants regulatorios distintos"
    duracion_min: 30
---

# Módulo 14 — Laboratorios

> Dos laboratorios prácticos para consolidar la teoría sobre gobernanza avanzada y multi-tenant aplicada a Agent 365. El primero es técnico (configuración de delegación cross-tenant), el segundo es de diseño (framework de políticas distribuido). Tiempo total: 60 minutos.
>
> **Prerrequisitos comunes:**
>
> - Acceso a 2-3 tenants de Microsoft 365 con Agent 365 activado (puedes usar tenants de prueba si no dispones de tenants productivos en topología multi-tenant).
> - Rol `Global Administrator` en al menos uno de los tenants para configurar GDAP y Customer Lockbox.
> - Conocer las regulaciones aplicables a los tenants del lab (GDPR para EU, HIPAA para sanidad US, LGPD para Brasil, etc.).

---

## LAB-14-1 — Configurar delegated administration cross-tenant con GDAP + Customer Lockbox

**Duración:** 30 min · **Producto:** Microsoft Entra admin center + Microsoft 365 admin center · **OA:** OA-14.2.

### Objetivo

Configurar el patrón canónico de delegated administration entre un tenant matriz («HQ») y un tenant subsidiario («Subsidiary-EU») usando GDAP y Customer Lockbox. El entregable es un compliance officer de HQ con visibilidad y capacidad de acción limitada y auditada sobre Subsidiary-EU.

### Pasos

1. **Identifica los tenants**: anota el tenant ID del tenant matriz (HQ) y del subsidiario (Subsidiary-EU). Si necesitas crear tenants de prueba, hazlo en `signup.microsoft.com/get-started/signup` con cuentas distintas.

2. **Crea la GDAP relationship desde HQ**:
   - Acceso al admin center de HQ → Partner relationships → New GDAP relationship.
   - Customer tenant: introduce el tenant ID de Subsidiary-EU.
   - Roles a solicitar (NO solicitar Global Administrator):
     - `Security Reader` (para visibilidad de Defender XDR).
     - `Compliance Administrator` (para Purview).
     - `Copilot Administrator` (rol específico de CCS).
   - Duration: **180 días** (renovable). Justificación: alinea con ciclo trimestral del comité central.
   - Genera la URL de invitación.

3. **Acepta la GDAP en Subsidiary-EU**:
   - El Global Admin del tenant Subsidiary-EU abre la URL de invitación.
   - Revisa los roles solicitados y los aprueba explícitamente.
   - La relationship queda activa en ambos tenants.

4. **Activa Customer Lockbox en Subsidiary-EU**:
   - Microsoft 365 admin center → Settings → Org settings → Security & privacy → Customer Lockbox.
   - Toggle `Require approval for all data access requests` = On.
   - Aprobadores designados: 2 personas con roles de seguridad alta (Global Admin + Compliance Admin local).
   - Save.

5. **Asigna roles GDAP a usuarios específicos en HQ**:
   - Acceso al admin center de HQ → Partner relationships → Subsidiary-EU → Manage.
   - Añade a un usuario específico de HQ (ej. `compliance.officer@hq.com`) con el rol `Security Reader` heredado de la GDAP.
   - Configura notification on access: el usuario recibe email cuando ejerce el rol heredado.

6. **Test funcional del flow B2B + GDAP + Lockbox**:
   - El `compliance.officer@hq.com` accede al portal de Defender XDR de Subsidiary-EU vía la URL específica del tenant.
   - Microsoft Entra le solicita autenticación adicional (MFA conditional access del tenant remoto).
   - El usuario navega Advanced Hunting y ejecuta una query simple sobre CloudAppEvents — debe funcionar sin problemas (Security Reader es suficiente).
   - El usuario intenta acceder a contenido de un agente (output específico de una invocación) → Customer Lockbox dispara la solicitud de aprobación al Global Admin local.
   - El Global Admin local aprueba la solicitud → el acceso se concede por 4 horas.
   - Tras 4 horas, el acceso caduca automáticamente.

7. **Validación del audit log**:
   - En el audit log de Subsidiary-EU, busca eventos con `actor.upn = compliance.officer@hq.com`.
   - Debe aparecer: el login B2B, la ejecución de queries en Defender, la solicitud de Customer Lockbox, la aprobación, el acceso al contenido, la expiración.
   - Documenta la cadena completa con timestamps.

8. **Documentación entregable**:
   - Diagrama de la GDAP relationship con roles + duraciones.
   - Lista de aprobadores de Customer Lockbox con escalado en caso de ausencia.
   - SOP para renovación de la GDAP cada 180 días.
   - SLA de aprobación de Customer Lockbox (target: < 4h en horario laboral).

### Validación

- Existe una GDAP relationship activa entre HQ y Subsidiary-EU con scope limitado y duración finita.
- Customer Lockbox está activo en Subsidiary-EU con aprobadores designados.
- El test funcional reproduce correctamente el flow esperado (acceso normal a config + aprobación explícita a contenido).
- El audit log captura toda la cadena de acciones cross-tenant.

### Variantes y extensiones

- Repetir el ejercicio con 3 subsidiarias para entender la complejidad operativa real cuando HQ gestiona N relationships GDAP simultáneamente.
- Configurar conditional access en Subsidiary-EU que requiera dispositivo gestionado por HQ (no solo MFA) para usuarios B2B con roles administrativos.
- Construir un playbook automático que renueve GDAP relationships 30 días antes de su expiración con notificación a Global Admins de ambos tenants.

---

## LAB-14-2 — Diseñar y validar policy framework distribuido para 3 tenants regulatorios distintos

**Duración:** 30 min · **Producto:** ejercicio de diseño (PowerPoint o Loop) · **OA:** OA-14.3, OA-14.4, OA-14.5.

### Objetivo

Diseñar el policy framework distribuido para una organización ficticia con tres tenants en jurisdicciones distintas (UE-Alemania, US-California, Brasil-São Paulo) con regulaciones distintas. Validar que el framework se aplica coherentemente sin violar regulación local. El entregable es un documento operativo de 6-8 páginas con framework, ejemplos de aplicación y plan de rollout.

### Escenario

**InternationalManufacturing-Corp** (45.000 empleados):

- HQ-Alemania: 18.000 empleados. Fabricación industrial. Sometido a GDPR + AI Act + BetrVG (codeterminación). Tenant `intman.de`.
- US-Subsidiary: 16.000 empleados. Distribución y servicio. Sometido a CCPA + SOX (cotiza en NYSE) + sector-específicas (HIPAA para clientes sanitarios). Tenant `intman.us`.
- BR-Subsidiary: 11.000 empleados. Operaciones LATAM. Sometido a LGPD + regulaciones del Banco Central. Tenant `intman.com.br`.

Agent 365 acaba de comprarse y se debe desplegar en los tres tenants simultáneamente, con framework de gobernanza coordinado.

### Pasos

1. **Define el framework global** (10 min, escribir en documento Loop o PowerPoint):
   - **Principios mínimos no negociables** (aplicables a los 3 tenants):
     - P1: Toda invocación de un agente sobre datos personales requiere base legal documentada.
     - P2: Outputs generados por agentes que contienen datos personales reciben sensitivity label automática.
     - P3: Customer Lockbox activado en los 3 tenants.
     - P4: Telemetría agregada al comité central con anonimización por defecto.
     - P5: Custom detection rules de Defender XDR para los 3 patrones canónicos (volumen, exfiltración, compromiso identidad).
   - **KPIs canónicos** (idénticos en los 3 tenants):
     - DAU/MAU por tenant.
     - Compliance rate por tenant.
     - Incidents Critical/High por tenant.
     - MTTD/MTTR del SOC central.
     - Audit log completitud por tenant.
   - **Vocabulario común**: definiciones idénticas de «incident», «invocation», «sensitive output».

2. **Adapta el framework por tenant** (10 min):

   **intman.de**:
   - GDPR: cookies y trackers en outputs de agentes que producen documentos para clientes finales — requiere consentimiento explícito.
   - AI Act: agentes que toman decisiones automáticas con efectos legales (rechazo de candidatos, denegación de crédito) clasificados como high-risk → conformity assessment previo + DPIA.
   - BetrVG: implementación de agentes que monitorizan empleados requiere acuerdo previo con el comité de empresa.
   - Adaptación específica: comité local incluye representante del Betriebsrat. Política de Approval-based estricta para agentes que tocan datos de empleados.

   **intman.us**:
   - CCPA: derecho de opt-out de venta de datos — outputs comerciales de agentes para clientes finales deben respetar el opt-out documentado.
   - SOX: outputs financieros que se usen en reporting al regulador requieren auditoría humana antes de publicación → workflow de aprobación obligatorio.
   - HIPAA: agentes que tocan PHI (Protected Health Information) requieren BAA (Business Associate Agreement) con Microsoft.
   - Adaptación específica: política Approval-based para agentes con PHI; Curated catalog para el resto. Workflow obligatorio para outputs financieros.

   **intman.com.br**:
   - LGPD: similar a GDPR pero con particularidades — ANPD (autoridad de protección de datos brasileña) como contacto regulatorio.
   - Banco Central: si la subsidiaria tiene operaciones financieras, agentes con datos de transacciones requieren reporting específico cuatrimestral al BC.
   - Adaptación específica: comité local incluye DPO (Encarregado pelo Tratamento) certificado por ANPD. Custom rule de Defender XDR adicional para detectar accesos a datos transaccionales.

3. **Diseña el ciclo de gobernanza** (5 min):
   - **Comité central** (mensual): Director de IA corporativo + CIO + CISO + Compliance Officer + 1 representante por subsidiaria.
   - **Comités locales** (quincenal durante despliegue → mensual estable): Responsable IA local + IT manager + Compliance local + representante de negocio + (en Alemania) representante Betriebsrat + (en Brasil) DPO ANPD.
   - **Reporting agregado mensual**: dashboard CCS-style con vista por subsidiaria + vista por jurisdicción + vista corporativa.
   - **Calendario de auditorías**: BaFin/anual para Alemania (si aplica banca); SOX/anual para US; ANPD/cuando lo soliciten para Brasil. Preparación 4-6 semanas anticipadas.

4. **Plan de rollout** (5 min):
   - **Semana 1-2**: aprobación del framework por el Consejo de Administración corporativo.
   - **Semana 3-4**: aprobación adaptaciones por comités locales con sus representantes regulatorios.
   - **Semana 5-8**: configuración técnica (CCS, Defender XDR, Purview) en los 3 tenants paralelamente.
   - **Semana 9-12**: piloto controlado en 1 departamento de cada tenant.
   - **Semana 13-16**: escalado al resto del tenant.
   - **Mes 4-6**: revisión trimestral con ajustes según feedback.

5. **Validación cruzada con regulación**:
   - Para cada elemento del framework, identifica si entra en conflicto con alguna regulación local.
   - Caso típico: el principio P4 «telemetría agregada al comité central» puede conflictuar con GDPR si la agregación expone datos identificables. Solución: anonimización irreversible antes de salida del tenant.
   - Caso típico: el principio P5 «custom detection rules unificadas» puede conflictuar con BetrVG si una rule monitoriza empleados individuales. Solución: aplicación de la rule con agregación mínima 5+ usuarios para no exponer individuos en Alemania.

### Validación

- Existe un documento de 6-8 páginas con framework global + adaptaciones por tenant.
- Las adaptaciones por tenant respetan las regulaciones locales sin violar principios mínimos.
- El ciclo de gobernanza tiene cadencias, composición y outputs definidos.
- El plan de rollout es realista (no comprimir en menos de 4 meses).
- Las validaciones cruzadas con regulación están documentadas.

### Variantes y extensiones

- Añadir un cuarto tenant en China (intman.cn) con regulación PIPL + Cybersecurity Law: ¿qué cambia? (Pista: posible incompatibilidad con telemetría agregada cross-border).
- Diseñar el plan de respuesta cuando ANPD pide información en Brasil con 72h de plazo: ¿qué proceso, quién decide, cómo se coordina con comité central?
- Construir el calendario operativo anual completo con las 4 auditorías externas integradas (BaFin, SOX, ANPD, anual corporativa).

---

## Cierre

Tras los dos labs has tocado las dos palancas operativas de gobernanza avanzada multi-tenant: la configuración técnica de delegación cross-tenant con GDAP + Customer Lockbox (LAB-14-1) y el diseño de un framework distribuido para topologías regulatoriamente complejas (LAB-14-2).

Si quieres ir más allá:

- Diseñar el modelo de coste compartido entre matriz y subsidiarias para las licencias de Agent 365 y los costes operativos del SOC central.
- Construir el plan de respuesta cross-tenant para un incident que toca múltiples jurisdicciones simultáneamente (típico en grupos multi-país).
- Implementar el playbook automatizado de renovación de GDAP relationships antes de expiración.

El siguiente módulo (M15) cubre **troubleshooting y operación**: las situaciones comunes del día a día con sus protocolos de resolución.
