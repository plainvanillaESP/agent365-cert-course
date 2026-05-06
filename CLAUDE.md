# Contexto para Claude

Este archivo proporciona contexto a Claude (en cualquier interfaz: claude.ai, Claude Code, etc.) para trabajar de forma productiva en este repositorio sin tener que reexplicar el proyecto cada sesión.

---

## Qué es este proyecto

Curso de certificación profesional para Administradores IT sobre **Microsoft Agent 365** y la gobernanza de agentes de IA en Microsoft 365. Producido por Plain Vanilla Solutions SL.

- 17 módulos
- ~22-25 horas de contenido
- Teoría + laboratorios prácticos + evaluaciones
- Idioma: **español de España**
- Audiencia: administradores M365/Entra/Purview/Defender con experiencia previa
- Branding: Plain Vanilla Solutions

## Estructura mental

Lee siempre primero estos archivos para tener contexto completo:

1. [`README.md`](./README.md) — Visión general
2. [`PLAN.md`](./PLAN.md) — Estado y roadmap (incluye la fase activa)
3. [`docs/arquitectura-curso.md`](./docs/arquitectura-curso.md) — Blueprint detallado de los 17 módulos
4. [`docs/convenciones-redaccion.md`](./docs/convenciones-redaccion.md) — Tono y estilo
5. [`investigacion/deep-research-mayo-2026.md`](./investigacion/deep-research-mayo-2026.md) — Investigación base con todas las URLs y datos técnicos

## Reglas críticas

### Idioma
- **Español de España**, no neutro ni latinoamericano
- "Vosotros" si el contexto pide segunda persona del plural; preferir formas impersonales en contenido formal
- Términos técnicos en inglés cuando son nombres propios de Microsoft (Agent Registry, Conditional Access, blueprint) — no traducir
- Anglicismos comunes en español técnico (deploy, tenant, log) son aceptables

### Precisión técnica
- **Toda afirmación factual debe tener fuente oficial Microsoft Learn**
- Citar URL en formato markdown link al final de cada sección o como nota al pie
- Si una capacidad está en preview, marcarla explícitamente con badge `🟡 Preview` o `🔴 Frontier preview`
- Las capacidades GA llevan badge `🟢 GA mayo 2026` (o la fecha que corresponda)
- Distinguir explícitamente Microsoft 365 Agents SDK ≠ Microsoft Agent 365 SDK
- Distinguir CCS (Copilot Control System) ≠ Agent 365

### Profundidad
- Es un curso de **certificación**. La profundidad técnica es alta.
- Asumir que el alumno sabe administrar M365 antes de empezar
- Incluir comandos PowerShell/CLI/KQL exactos cuando sean relevantes
- Capturas de pantalla descritas con suficiente detalle para que se entiendan sin verlas (mientras producimos las imágenes)

### Formato
- Markdown puro, sin HTML inline salvo cuando sea necesario para diagramas SVG
- Headers jerárquicos: H1 solo título del documento, H2 secciones principales, H3 subsecciones
- Tablas cuando hay comparativa de 3+ ítems con 2+ atributos
- Bloques de código con lenguaje declarado
- Listas numeradas para procedimientos paso a paso, viñetas para enumeraciones

## Flujo de trabajo típico

Cuando el usuario te pida producir contenido para un módulo:

1. Lee [`PLAN.md`](./PLAN.md) para confirmar la fase activa
2. Lee [`docs/arquitectura-curso.md`](./docs/arquitectura-curso.md) para ver objetivos del módulo y duración planificada
3. Consulta [`investigacion/deep-research-mayo-2026.md`](./investigacion/deep-research-mayo-2026.md) para datos técnicos verificados
4. Si necesitas información adicional, busca en `learn.microsoft.com` (preferentemente versión en español, fallback a inglés)
5. Produce el archivo en la ruta correspondiente (`modulos/modulo-XX/teoria.md` o el archivo que corresponda)
6. Si produces un cambio relevante, actualiza [`docs/changelog.md`](./docs/changelog.md) con una entrada nueva

## Lo que NO debes hacer

- No inventar fechas, nombres de roles, precios, o features que no estén en la investigación o en learn.microsoft.com verificable
- No añadir contenido al README o PLAN sin que el usuario lo pida explícitamente
- No producir contenido genérico de "introducción a la IA" — el alumno ya viene con contexto, ir al grano
- No usar emojis salvo los badges de estado (🟢 🟡 🔴 ✅ ⏳)
- No traducir nombres propios de productos Microsoft

## Comandos útiles

```bash
# Ver estado del repo
git status

# Construir PDFs (cuando los scripts estén listos)
python scripts/build-pdfs.py

# Construir e-learning web (cuando los scripts estén listos)
python scripts/build-web.py

# Validar markdown
python scripts/validate.py
```
