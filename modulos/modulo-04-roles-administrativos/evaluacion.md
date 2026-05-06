---
modulo: 4
tipo: evaluacion
titulo: "Evaluación del Módulo 04"
duracion_min: 15
area_examen: 1
estado: producido
fase_produccion: 3
ultima_actualizacion: 2026-05-06
preguntas_oficiales: 1
caso_estudio: true
---

# Módulo 04 — Evaluación

> Una pregunta oficial del banco que el M04 aporta al examen final, más un caso de estudio extenso de refuerzo.

## Preguntas oficiales del banco

### EX-04-001 · Multiple choice · Media

**OA mapeado:** OA-04.1 · **Área:** 1 · **Bloom:** Aplicar

**Enunciado:**

Un analista de seguridad necesita revisar diariamente las alertas que Microsoft Defender XDR genera sobre agentes en el Agent Registry, correlacionarlas con la información del propio Registry y, cuando una alerta lo justifique, abrir un ticket al equipo de M365 admin. **No** debe poder modificar políticas de Defender ni aprobar o bloquear agentes. ¿Qué combinación de roles aplica el principio de least-privilege correctamente?

A) Global Administrator. Es el más simple y cubre todo lo que necesita.
B) Security Administrator + AI Administrator, para tener escritura en seguridad y en agentes.
C) Security Operator + AI Reader, que permite investigar alertas en Defender y ver el Registry sin modificarlo.
D) Security Reader, suficiente porque solo necesita leer.

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** C

**Justificación:** least-privilege exige asignar el mínimo rol que permite hacer la tarea. **Security Operator** permite investigar alertas y responder a incidentes en Defender (la tarea principal) sin escritura en políticas. **AI Reader** permite ver el Registry para correlacionar pero no modificar agentes. La combinación cubre exactamente las necesidades sin excederse. La opción A (Global Administrator) es el antipatrón clásico: sobreasigna privilegio. La B (Security Administrator + AI Administrator) da escritura donde la tarea solo requiere lectura/operación. La D (Security Reader) es insuficiente: el Reader **no permite responder** a incidentes, solo verlos.

</details>

---

## Caso de estudio (refuerzo)

> El caso de estudio no se evalúa pero refuerza la comprensión integral del módulo. Recomendado tras leer la teoría y antes de pasar al Módulo 05.

### Contexto

**Plain Coffee SL** ha pasado de un piloto inicial de Agent 365 (50 licencias en RRHH) a un despliegue corporativo (350 licencias para Operaciones + 50 RRHH + 100 Finanzas, total 500 licencias). El equipo IT crece para acompañar:

- Eva Martín (CIO), Luis Ortega (Admin M365 lead), Marta Núñez (Admin M365 backup), Dani López y Sara Vidal (analistas seguridad), Ana Ruiz (Compliance officer) — los 6 anteriores.
- **Nuevas incorporaciones:**
  - Pablo García (Data Engineer): construye agentes Foundry para análisis financiero. Necesita ser productivo desplegando agentes propios, sin tocar los de otros.
  - Carmen Sanz (Adoption Lead): coordina la formación y la comunicación interna del despliegue. Debe ver Registry y métricas de uso, sin modificar nada.

Adicionalmente, la organización ha decidido implantar **PIM** (Privileged Identity Management) para todos los roles administrativos y ha contratado **auditoría externa anual** que requerirá acceso de solo lectura a todo el tenant durante 2 semanas al año.

### Preguntas guiadas

1. **Roles para Pablo García.** ¿Qué rol o combinación de roles le asignarías y por qué? ¿Qué riesgo evitas comparado con asignarle Agent ID Administrator?

2. **Roles para Carmen Sanz.** ¿Qué rol o combinación de roles le asignarías? ¿Cuál es el rol más infrautilizado del catálogo que aplica perfectamente aquí?

3. **PIM en la matriz.** Identifica al menos 3 roles de la matriz original que deberían pasar a activación PIM en lugar de asignación permanente. Justifica cada uno.

4. **Auditor externo.** ¿Qué rol asignar al auditor externo durante las 2 semanas? ¿Cómo gestionas su acceso para que cumpla principio de least-privilege y, además, tenga fecha de fin?

5. **Antipatrones detectados.** Si revisas la matriz original con la mirada de un auditor, ¿hay algún punto que mejorarías ahora? Pista: piensa en separation of duties.

### Solución comentada

<details>
<summary>Ver solución completa</summary>

**Pregunta 1 — Pablo García**

**Rol asignado: Agent ID Developer.**

Pablo necesita crear sus propios agentes Foundry pero no debe poder modificar los de otros equipos. Agent ID Developer le permite exactamente eso: crear y editar agentes asignados a él, ver el catálogo de su área, sin escritura sobre agentes ajenos. Asignarle Agent ID Administrator sería el antipatrón: ese rol gestiona identidades a nivel tenant, lo que le permitiría crear, modificar o eliminar agentes de cualquier desarrollador. El riesgo evitado es shadow IT al revés: un Data Engineer que toca agentes que no son suyos.

**Pregunta 2 — Carmen Sanz**

**Rol asignado: Global Reader.**

Es probablemente el rol más infrautilizado del catálogo. Permite ver TODO el tenant sin escritura en nada: Registry, Map, Defender alerts, Purview reports, Entra ID, etc. Para una Adoption Lead que necesita métricas y visibilidad transversal sin riesgo de modificar nada, Global Reader es exactamente la respuesta. Una alternativa sería combinar AI Reader + métricas específicas, pero Global Reader es más simple y limpio. **Lo importante:** no asignar AI Administrator aunque ella misma lo pida pensando que «así puedo ver mejor». Reader basta.

**Pregunta 3 — PIM**

Tres roles que deberían pasar a PIM en lugar de asignación permanente:

- **Global Administrator de Eva (CIO).** Como ya estaba en la matriz original. Eva tiene Global Reader permanente para visibilidad y Global Administrator vía PIM para operaciones break-glass.
- **AI Administrator de Luis y Marta.** Aunque sean operación diaria, AI Administrator permite aprobar agentes y modificar el Registry. PIM con activación de 4 horas tras justificación reduce el riesgo si una de sus cuentas se compromete.
- **Security Administrator (no asignado en la matriz original, pero si en algún momento se necesita).** Cualquier rol con escritura en políticas de seguridad debería ser PIM por defecto.

**Pregunta 4 — Auditor externo**

**Rol asignado: Global Reader, vía Access Reviews con fecha de expiración.**

Global Reader cumple least-privilege para auditoría: ve todo, modifica nada. Para gestionar la fecha de fin sin tener que recordarlo manualmente, se asigna mediante **Access Reviews** o **PIM con eligible assignment de 14 días**. Tras esa fecha, el acceso expira automáticamente. Adicionalmente: el auditor debería tener una cuenta de invitado dedicada (`auditor-2026@plaincoffee.onmicrosoft.com`), no un alias en una cuenta interna existente. Esto facilita revocación, auditoría de log y separación clara entre actividad interna y externa.

**Pregunta 5 — Antipatrones detectados**

Repasando la matriz original con ojos de auditor, dos puntos a mejorar:

- **Luis tiene AI Administrator + Agent ID Administrator + Billing Administrator.** Acumula tres áreas: gobernanza de agentes, identidad y billing. Un compromiso de su cuenta da control total sobre el ciclo de vida de los agentes y el coste. **Mejora:** mover Billing Administrator a otra persona (alguien de Finanzas o al CIO Eva). Separation of duties: quien opera no debería controlar la facturación.
- **Dani y Sara tienen el mismo perfil exacto.** No es un antipatrón en sí, pero conviene que uno de los dos también tenga acceso a Purview Insider Risk Investigator para que pueda colaborar con Ana cuando un caso de IRM requiera investigación en Defender. Esto evita silos.

</details>

---

## Validación de aprendizaje

Antes de pasar al M05, el alumno debe poder responder sin notas:

- **¿Cuál es el rol más infrautilizado del catálogo?** Global Reader. Solo lectura de TODO, ideal para auditoría y compliance.
- **¿Cuál es el antipatrón más caro?** Asignar Global Administrator donde otro rol más limitado bastaría.
- **¿Cuándo conviene PIM?** Para todo rol con privilegio elevado. Convierte privilegio permanente (riesgo alto) en privilegio temporal y auditado.
