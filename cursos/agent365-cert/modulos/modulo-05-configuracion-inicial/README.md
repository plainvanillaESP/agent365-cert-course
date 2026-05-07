# Módulo 05 — Configuración inicial del tenant

**Duración total:** 75 min · **Fase de producción:** 3 · **Estado:** producido

## Resumen

Pasos uno-a-uno para activar Microsoft Agent 365 en un tenant productivo: prerrequisitos verificables (licencias, roles, audit logs, regiones soportadas, conectividad), activación Frontier toggle (si aplica), aceptación de Terms of Service, navegación a Agents Overview. Configuración del conector Microsoft 365 en Defender for Cloud Apps. Habilitación de DSPM y AI observability en Microsoft Purview. Conexión del Power Platform connector. Validación end-to-end con un agente de prueba que aparece en los tres admin centers en menos de 30 minutos.

## Estructura

- `teoria.md` — 6 secciones (5.1 a 5.6) cubriendo prerrequisitos del tenant, secuencia de activación paso a paso, configuración de Defender XDR, configuración de Microsoft Purview, validación end-to-end, y troubleshooting básico de los errores frecuentes.
- `laboratorios.md` — Dos labs secuenciales:
  - **Lab 05.1** «Activación inicial del tenant» (30 min, intermedio): verificar prerrequisitos en orden, activar Frontier, aceptar Terms of Service, llegar a Overview, documentar evidencia de cierre.
  - **Lab 05.2** «Configuración cross-admin center y validación» (25 min, intermedio): conectar Defender, Purview y opcionalmente Power Platform; lanzar agente de prueba; verificar end-to-end.
- `evaluacion.md` — 1 pregunta oficial EX-05-001 (drag-and-drop, ordenar los 6 pasos de la activación) + caso de estudio extenso de Plain Coffee SL con 4 preguntas guiadas de diagnóstico, plan de acción, prevención y validación de cierre.
- `recursos.md` — 6 secciones de documentación oficial Microsoft Learn (activación, audit logs, Defender, Purview, Power Platform, troubleshooting) y referencias para los siguientes módulos.
- `assets/` — 3 SVGs nativos:
  - `01-prerrequisitos-checklist.svg` — los 6 bloques de prerrequisitos con dónde verificar cada uno.
  - `02-flujo-activacion.svg` — los 3 pasos secuenciales de la activación con flecha de dependencias.
  - `03-validacion-end-to-end.svg` — agente de prueba en Agent Builder generando evidencia visible en los 3 admin centers.

## Reparto a la evaluación final

1 pregunta del Área 1 (Plan and configure Microsoft Agent 365):

- **EX-05-001** — drag-and-drop secuenciando los pasos de activación. Bloom: Aplicar.

## Decisiones de diseño

- **Capturas reales pospuestas a iteración 2.** Es el módulo más operativo de Fase 3 y el que más se beneficiará de capturas reales. SVGs conceptuales actuales cubren el flujo y las verificaciones. Las capturas se documentan en `docs/capturas-pendientes.md`.
- **Lab 05.1 y 05.2 secuenciales.** El Lab 05.2 depende del 05.1 completado. Esto refleja la realidad operativa (no se puede configurar conectores sin haber activado el workload).
- **Caso de estudio orientado a diagnóstico.** El caso de Plain Coffee SL en evaluación es deliberadamente «un setup que aparenta funcionar pero falla en parte». Es el escenario más realista en organizaciones reales y el más útil pedagógicamente.

## Anti-IA

Sin frases marketing-IA. Sin OAs/Bloom en el cuerpo (solo en frontmatter). Sin ASCII art. Tablas con datos comparativos. Tres ideas-faro al final que el alumno debe poder repetir sin notas. KQL real y verificable, no inventado.

## Capturas pendientes

Ver `docs/capturas-pendientes.md` sección «Módulo 05» para la lista detallada de capturas necesarias para la iteración 2.
