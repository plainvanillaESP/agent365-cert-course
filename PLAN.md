# Plan de producción

> Roadmap detallado de producción del curso de certificación Microsoft Agent 365 para administradores IT.

---

## Estado actual

**Fase activa:** Fase 1 — Diseño maestro y blueprint
**Última actualización:** mayo 2026

---

## Fases

### ✅ Fase 0 — Investigación base (completada)

Investigación deep-research sobre Microsoft Agent 365 y todo el ecosistema de gobernanza de agentes en Microsoft 365. Cubre:

- Toda la documentación oficial de `learn.microsoft.com/microsoft-agent-365/`
- Microsoft Entra Agent ID (identidades, blueprints, agent users)
- Microsoft Purview para Agent 365 (DSPM, DLP, IRM, eDiscovery, Compliance Manager)
- Microsoft Defender (advanced hunting, real-time protection, posture)
- Copilot Control System
- SharePoint Agents, Copilot Studio, Foundry, Microsoft 365 Agents SDK
- Licenciamiento (Agent 365 standalone, M365 E7, Entra Suite)
- Roles administrativos
- APIs Graph y Agent 365 CLI

📄 Output: [`investigacion/deep-research-mayo-2026.md`](./investigacion/deep-research-mayo-2026.md)

---

### 🟡 Fase 1 — Diseño maestro y blueprint (en curso)

**Objetivo:** Antes de redactar contenido, producir el blueprint completo del curso con todos los detalles que aseguran consistencia entre los 17 módulos.

**Entregables:**

1. **`docs/arquitectura-curso.md`** — Para cada módulo:
   - Duración exacta (minutos por sección)
   - Objetivos de aprendizaje en formato Bloom (recordar/comprender/aplicar/analizar/evaluar/crear)
   - Prerrequisitos del módulo
   - Lista de conceptos clave
   - Lista de laboratorios con tenant requirements
   - Tipo de preguntas de evaluación

2. **`docs/matriz-competencias.md`** — Mapeo de cada objetivo de aprendizaje a una pregunta del examen final, asegurando cobertura 100%.

3. **`docs/convenciones-redaccion.md`** — Tono, estilo, formato de capturas, formato de comandos, cómo citar fuentes oficiales, cómo etiquetar capacidades GA vs preview.

4. **`docs/guia-instructor.md`** — (opcional, fase posterior) Guía para impartir el curso con instructor.

5. **Banco de preguntas inicial** — esqueleto en `modulos/modulo-17-examen-certificacion/banco-preguntas.md` con 60+ preguntas distribuidas por módulo.

**Criterio de salida de fase:** validar el blueprint contigo antes de pasar a producción de contenido.

---

### ⏳ Fase 2 — Prototipo Módulo 1 (al 100%)

**Objetivo:** Construir el Módulo 1 completo con el formato definitivo. Sirve de validación de tono, profundidad y estilo antes de escalar a los 16 restantes.

**Entregables:**
- `modulos/modulo-01-fundamentos/teoria.md` (versión final)
- `modulos/modulo-01-fundamentos/laboratorios.md` (versión final)
- `modulos/modulo-01-fundamentos/evaluacion.md` (versión final)
- `modulos/modulo-01-fundamentos/recursos.md` (versión final)
- Diagramas SVG en `assets/`

**Criterio de salida de fase:** validar el módulo contigo. Si hay cambios de fondo, iterar antes de continuar.

---

### ⏳ Fases 3-6 — Producción módulos 2-17

Producción en bloques de ~4 módulos por fase para mantener la calidad y permitir validación intermedia.

| Fase | Módulos | Foco temático |
|---|---|---|
| Fase 3 | M2, M3, M4, M5 | Arquitectura, licenciamiento, roles, configuración inicial |
| Fase 4 | M6, M7, M8, M9 | Identidad, registro, ciclo de vida, accesos |
| Fase 5 | M10, M11, M12, M13 | Protección de datos, monitorización, CCS |
| Fase 6 | M14, M15, M16 | Gobernanza avanzada, troubleshooting, costes |

---

### ⏳ Fase 7 — Examen final + revisión integral

- Banco de preguntas completo: 60+ preguntas (multiple choice, drag-and-drop, KQL, scenarios, troubleshooting trees)
- Rúbrica de evaluación
- Revisión integral del curso para consistencia, cobertura y enlaces
- Validación final del mapeo competencias → preguntas

---

### ⏳ Fase 8 — Build de e-learning web + PDFs

- Build pipeline (markdown → HTML interactivo + markdown → PDF)
- E-learning navegable con quizzes interactivos
- PDFs descargables por módulo + manual completo
- Deploy a GitHub Pages (opcional)

---

## Convenciones de trabajo

### Formato del contenido fuente

- **Markdown** como única fuente de verdad
- **Capturas de pantalla** en formato PNG o SVG en la carpeta `assets/` de cada módulo
- **Diagramas** en SVG cuando posible (versionables como texto)
- **Comandos** en bloques con lenguaje declarado (` ```powershell `, ` ```bash `, ` ```kql `)
- **Capacidades en preview** marcadas explícitamente con badge `🟡 Preview` o `🔴 Frontier preview`
- **Capacidades GA** marcadas con `🟢 GA mayo 2026`

### Citas a fuentes oficiales

Cada afirmación técnica relevante se cita con el formato:

```markdown
> Fuente: [Microsoft Learn — Agent overview in Microsoft 365 admin center](https://learn.microsoft.com/es-es/microsoft-365/admin/manage/agent-365-overview)
```

### Estructura estándar de cada módulo

#### `teoria.md`
1. Objetivos de aprendizaje
2. Conceptos clave
3. Desarrollo (con diagramas y capturas)
4. Resumen
5. Próximos pasos

#### `laboratorios.md`
1. Prerrequisitos del laboratorio (tenant, licencias, roles)
2. Lista de laboratorios del módulo
3. Por cada lab: objetivo, pasos numerados, capturas, validación, troubleshooting

#### `evaluacion.md`
1. Preguntas de comprobación (10-15 por módulo)
2. Caso de estudio (1 por módulo)
3. Respuestas con justificación

#### `recursos.md`
1. Documentación oficial Microsoft Learn (URLs en español cuando existan, inglés cuando sea más completo)
2. Blogs oficiales relevantes
3. Lecturas adicionales

---

## Cómo trabajamos con Claude

Cada sesión sigue este patrón:

1. Claude lee `CLAUDE.md` y `PLAN.md` para tener contexto
2. Identificamos el módulo y la sección a trabajar
3. Claude consulta `investigacion/deep-research-mayo-2026.md` y la documentación oficial cuando sea necesario
4. Claude produce los archivos en la ruta correspondiente (`modulos/modulo-XX/...`)
5. Tú los descargas y haces commit + push al repo
6. Actualizamos `docs/changelog.md` con la entrada de la sesión

Para sesiones de Claude Code (en local con el repo clonado):
- Claude Code lee automáticamente `CLAUDE.md`
- Puede editar archivos directamente y hacer commit con tu autorización
