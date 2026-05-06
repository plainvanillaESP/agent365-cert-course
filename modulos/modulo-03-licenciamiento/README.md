# Módulo 03 — Licenciamiento, prerrequisitos y planificación

**Duración total:** 60 min · **Fase de producción:** 3 · **Estado:** producido

## Resumen

Comparativa completa del licenciamiento de Microsoft Agent 365 a fecha de mayo de 2026: SKU standalone ($15), bundle Microsoft 365 E7 ($99), reglas de cobertura OBO vs autonomous, capacidades que requieren licencias adicionales, los tres modelos de consumo paralelos (Agent 365 per-seat, Copilot Credits, Foundry per-token), diferencias entre Frontier preview y GA, decisión de standalone vs E7 con cálculo de break-even, y plan de despliegue en cuatro fases.

## Estructura

- `teoria.md` — 7 secciones (3.1 a 3.7) cubriendo SKUs, OBO/autonomous, capacidades con licencia adicional, modelos de consumo, Frontier vs GA, decisión standalone vs E7 y plan de despliegue. ~360 líneas.
- `laboratorios.md` — Lab 03.1 «Calculadora de licenciamiento»: 4 escenarios reales (pyme, mediana, gran empresa, sector regulado) con plantilla de cálculo y solución comentada. Markdown estático, sin tenant.
- `evaluacion.md` — 1 pregunta oficial (EX-03-001 multiple-choice) + caso de estudio extenso de ContosoFinance (banca con 8.500 empleados) con 4 preguntas guiadas y solución comentada.
- `recursos.md` — documentación oficial Microsoft Learn, anuncios primarios (Ignite 2025, GA mayo 2026), lecturas analíticas (Forrester, Gartner, IDC), calculadoras, y cross-references a M04, M05 y M16.
- `assets/` — 4 SVGs nativos:
  - `01-skus-precios.svg` — tarjetas comparativas de SKUs con precios y add-ons.
  - `02-obo-vs-autonomous.svg` — diagrama de los dos flujos de operación con cobertura.
  - `03-tres-lineas-billing.svg` — agente central conectado a las tres líneas de billing.
  - `04-fases-despliegue.svg` — timeline horizontal de las cuatro fases con métricas clave.

## Reparto a la evaluación final

1 pregunta del Área 1 (Plan and configure Microsoft Agent 365):

- **EX-03-001** — escenario sobre cuándo aplicar Agent 365 standalone vs Microsoft 365 E7. Bloom: Evaluar.

## Decisiones de diseño

- **Lab no interactivo en React.** El lab del M03 es una calculadora de licenciamiento basada en cálculo numérico y criterio. El alumno aprende al hacer los cálculos, no al ver el resultado calculado por una UI. Si en el futuro se decide convertirlo en componente Calculadora.tsx, ese trabajo se planifica como hito separado.
- **Capturas reales pospuestas.** El módulo no entra en operación de admin centers (pure conceptual de licencias). Las capturas anotadas se introducen a partir del M04.
- **Cifras y precios.** Todos los precios son list price USD a mayo de 2026 según deep research. Documentación primaria citada en `recursos.md`.

## Anti-IA

Sin frases marketing-IA. Sin OAs/Bloom en el cuerpo (solo en frontmatter). Sin ASCII art. Tablas en lugar de bullets cuando hay datos comparativos. Tres ideas-faro al final que el alumno debe poder repetir sin notas.
