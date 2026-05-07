# Módulo 07 — Agent Registry y Agent Map

**Duración total:** 75 min · **Fase de producción:** 4 · **Estado:** producido

## Resumen

Primer módulo puramente operativo del curso. Inmersión en `M365 admin center → Agents → Registry` y `→ Map`: anatomía completa del Registry con sus columnas configurables y filtros laterales acumulativos, Map view con clusters por plataforma y conexiones agent-to-agent para detectar multi-agent workflows, hero metrics y Top actions for you (Pending requests, Agents at risk, Ownerless, With exceptions) en la página Overview, Agent analytics con la limitación de Foundry V2, Registry sync multicloud con AWS Bedrock y Google Gemini Enterprise (Preview) y Risks column del licenciamiento E7. Patrón operativo diario y semanal del IT admin.

## Estructura

- `teoria.md` — 7 secciones (7.1 a 7.7) cubriendo Registry, Map, Hero metrics + Top actions, Agent analytics, Registry sync multicloud (Preview), Risks column (E7) y resumen con cross-references a M08, M09 y M12.
- `laboratorios.md` — 2 labs:
  - **Lab 07.1** «Recorrido completo por Registry y Map con filtros» (25 min, básico): familiarización con columnas, búsqueda, filtros combinados (4 preguntas operativas), cambio a Map view, identificación de clusters y agentes hub.
  - **Lab 07.2** «Exportar inventario y analizar en Excel» (20 min, intermedio): exportación a `.xlsx`, dos PivotTables (plataforma × estado y owner × risk), identificación de ownerless y at-risk, documento de evidencia.
- `evaluacion.md` — 4 preguntas oficiales EX-07-001 a EX-07-004 + caso de estudio operativo de Plain Coffee SL con 5 preguntas guiadas (priorización del lunes, gestión de pending requests, investigación de at-risk, limpieza de ownerless, exportación trimestral).
- `recursos.md` — 6 categorías de docs Microsoft Learn (admin center, Risks column, Registry sync multicloud, exportación e integración, buenas prácticas) y cross-references a M08/M09/M12.
- `assets/` — 3 SVGs nativos:
  - `01-anatomia-registry.svg` — Registry con filtros laterales, columnas, ejemplo de filas con pills de estado y riesgo, vista de detalle.
  - `02-agent-map.svg` — clusters por plataforma (Copilot Studio, Foundry, M365 Copilot, External Preview) con hub agent en Foundry y conexión cross-cluster.
  - `03-hero-metrics-actions.svg` — 4 hero metrics arriba con sparklines y 4 categorías de Top actions for you abajo con conteos, descripciones y acciones recomendadas.

## Reparto a la evaluación final

4 preguntas del Área 3 (Registry y ciclo de vida — 15 % del examen):

- **EX-07-001** mc fácil — pantalla donde se ven los ownerless agents (Overview > Top actions). Bloom: Recordar.
- **EX-07-002** scenario media — combinación de filtros para responder pregunta operativa sobre Third Party + Copilot Studio + risk Medium o superior. Bloom: Aplicar.
- **EX-07-003** mc media — requisitos de la Risks column (E7 + Defender + DSPM). Bloom: Recordar.
- **EX-07-004** scenario media — interpretar 6 conexiones entrantes a un agente como hub + punto crítico de fallo. Bloom: Analizar.

## Decisiones de diseño

- **Primer módulo operativo del curso.** Anteriormente se cubrían fundamentos, licenciamiento, roles, configuración, identidades. M07 es el primero que vive en el día a día del IT admin. Las decisiones de scope reflejan eso: rutina diaria, rutina semanal, rutina trimestral.
- **Capturas pospuestas a iteración 2 (alta prioridad).** Es el módulo donde más se beneficiarán de capturas reales los alumnos, porque toda la operativa pasa por la UI. Documentadas 6+ capturas en `docs/capturas-pendientes.md`.
- **Caso de estudio temporal (lunes por la mañana).** El caso de Plain Coffee SL en evaluación está diseñado deliberadamente como una sesión de 90 minutos del lunes. Es el patrón temporal real que el alumno encontrará en su trabajo.

## Anti-IA

Sin frases marketing-IA. Sin OAs/Bloom en el cuerpo (solo en frontmatter). Sin ASCII art. Tablas con columnas y filtros explicados. Tres ideas-faro al final que el alumno debe poder repetir sin notas. Sin afirmaciones sobre comportamientos no documentados de Microsoft.

## Capturas pendientes

Ver `docs/capturas-pendientes.md` sección «Módulo 07» para la lista detallada de capturas necesarias para la iteración 2.
