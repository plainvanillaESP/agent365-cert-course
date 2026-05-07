# Plan de producción

> Roadmap detallado de producción del curso de certificación Microsoft Agent 365 para administradores IT.

---

## Estado actual

**Fase activa:** Fase 2.A — Prototipo del shell de e-learning con M01
**Última actualización:** 6 de mayo de 2026

---

## Decisión arquitectónica clave (mayo 2026)

Originalmente la producción del shell de e-learning estaba al final del plan (Fase 8), tras producir los 17 módulos. La decisión revisada es **construir un prototipo del shell con sólo el Módulo 01 dentro antes de seguir produciendo módulos**.

**Por qué se cambió:** si el diseño del shell falla, mejor descubrirlo con 1 módulo de contenido producido y no con 17. El shell define cómo se renderiza la teoría, cómo funciona la evaluación interactiva, cómo navega el alumno, cómo se ve el branding. Validar todo eso con M01 ahorra retrabajo. De paso queda algo demoable a clientes desde temprano.

**Resultado:** las fases 3-7 (producción de módulos 2-17 + examen final) avanzan sobre un shell ya validado, no sobre un shell hipotético.

---

## Fases

### Fase 0 — Investigación base (completada)

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

Output: [`investigacion/deep-research-mayo-2026.md`](./investigacion/deep-research-mayo-2026.md)

---

### Fase 1 — Diseño maestro y blueprint (completada)

Antes de redactar contenido, se produjo el blueprint completo del curso con todos los detalles que aseguran consistencia entre los 17 módulos.

**Entregables completados:**

1. **`docs/arquitectura-curso.md`** v1.2 — blueprint maestro: 17 módulos detallados (1080 min = 18h), 5 áreas de competencia con pesos fijos (15/30/15/20/20), 87 objetivos de aprendizaje en formato OA-XX.N, distribución de 60 preguntas en 7 tipos.
2. **`docs/auditoria-fase-1.md`** — verificación sistemática contra los 96 temas del research: 86 cubiertos explícitos, 7 indirectos, 0 gaps. 3 fixes aplicados.
3. **`docs/banco-preguntas-modelo.md`** — 12 preguntas reales completas (todos los 7 tipos, los 5 niveles de Bloom, las 3 dificultades, las 5 áreas) que establecen el estándar de calidad de la evaluación.
4. **`docs/convenciones-redaccion.md`** — tono, estilo, formato, cómo citar fuentes, regla absoluta de cero emojis.

Output mergeado en `main` vía PR #1.

---

### Fase 2 — Módulo 01 prototipo de contenido (completada)

Producción del Módulo 01 completo al 100%: establece el estándar de calidad de contenido para los 16 módulos restantes.

**Entregables completados:**

- `teoria.md` (60 min, ~7.500 palabras, 6 sub-secciones temporizadas, glosario de 10 términos, mapa de capas, distinción crítica de los 6 productos del ecosistema)
- `laboratorios.md` (ejercicio de mapeo de 10 escenarios)
- `evaluacion.md` (3 preguntas oficiales del banco con variantes anti-repetición)
- `recursos.md` (enlaces a documentación oficial)
- `assets/01-control-plane.svg` y `assets/02-stakeholders.svg`

Output mergeado en `main` vía PR #2.

---

### Fase 2.A — Prototipo del shell de e-learning con M01 (en curso)

**Objetivo:** construir el shell React funcional del curso, con el Módulo 01 dentro como contenido único, para validar el UX/UI antes de producir el resto de módulos. Si el diseño no convence, se itera con M01 (no con los 17 módulos).

**Stack técnico:**

- **Frontend:** Vite + React 18 + TypeScript
- **Estilos:** Tailwind CSS con tokens Plain Vanilla (gradient `#9A44E5 → #F68DAC`, fondos claros)
- **Tipografía:** Bricolage Grotesque (titulares) + Instrument Sans (cuerpo)
- **Iconos:** Lucide React (default), Material UI Icons sólo si Lucide no tiene el icono concreto
- **Routing:** React Router v6 (rutas `/modulo/:id/teoria`, `/modulo/:id/evaluacion`, `/modulo/:id/laboratorios`, `/modulo/:id/recursos`, `/progreso`)
- **Renderizado de markdown:** `react-markdown` + `remark-gfm` + `rehype-raw` para SVG inline + `rehype-highlight` para code blocks
- **Estado del alumno:** localStorage en el prototipo (Fase 8 lo migra a Supabase con auth)
- **Evaluación interactiva:** componentes custom para multiple-choice, multiple-response, drag-and-drop (con `@dnd-kit`), ordering y scenario
- **Hosting:** Vercel (preview deploys por branch + producción en main)

**Funcionalidades del prototipo:**

1. **Landing del curso** — overview de los 17 módulos, estructura de las 5 áreas, CTA «Empezar Módulo 01». Branding Plain Vanilla completo.
2. **Layout del módulo** — sidebar con las 4 secciones (Teoría / Laboratorios / Evaluación / Recursos), barra de progreso del módulo, navegación entre secciones.
3. **Renderizado de teoría** — markdown a HTML con tipografía cuidada, SVG inline, tablas responsivas, code blocks con sintaxis, badges `[GA]` `[Preview]` `[Frontier]` con estilo visual diferenciado, citas a fuentes con icono Lucide `ExternalLink`.
4. **Evaluación interactiva** — las 3 preguntas reales de M01 funcionando: clic en respuesta, validación con feedback (correcta/incorrecta + justificación), drag-and-drop para EX-01-003, scoring del módulo, intentos guardados en localStorage.
5. **Laboratorio interactivo** — el ejercicio de mapeo de 10 escenarios renderizado como ejercicio drag-and-drop o selector, con validación inmediata.
6. **Recursos** — lista de enlaces oficiales con favicon de Microsoft Learn, copy-to-clipboard de URLs, etiquetado de tipo (docs / blog / whitepaper / repo).
7. **Tracking de progreso** — qué secciones se han leído (scroll-based), qué preguntas se han respondido bien, % de avance del módulo. Persistente en localStorage entre sesiones.
8. **Vista mobile** — diseño responsive desde 360px. Sidebar colapsable, fuente legible, evaluación táctil.
9. **Modo oscuro** — toggle accesible desde el header. Tokens de color preparados para ambos modos.

**Fuera del scope del prototipo (irá a Fase 8):**

- Auth real (login/registro). En Fase 2.A: estado anónimo en localStorage.
- Generación del certificado de finalización en PDF.
- Examen final cronometrado de 90 minutos (M17 todavía no se ha producido).
- Sincronización entre dispositivos.
- Bloqueo de módulos hasta completar el anterior.

**Estructura del repo tras esta fase:**

```
pv-learn/
├── platform/                    ← NUEVO: app React (era shell/, renombrado en Fase A)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── content/         ← markdown del curso importado vía vite-plugin-md
│   │   └── App.tsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
├── cursos/                  ← paquetes de curso (Fase A)
│   └── agent365-cert/
│       ├── course.yaml
│       └── modulos/         ← contenido fuente (single source of truth)
├── docs/
└── ...
```

**Criterio de salida de fase:** validación visual del shell con M01 desplegado en URL pública. Si hay feedback estructural se itera antes de pasar a Fase 3.

**Output esperado:** prototipo desplegado en URL Vercel + PR mergeado al repo con la app shell.

---

### Fase A — Reestructuración a plataforma multi-curso (en curso)

**Contexto.** A medida que se consolida la decisión de convertir el primer curso (Microsoft Agent 365) en el primero de una serie ampliable de cursos, se introduce esta fase de reestructuración. Su objetivo es separar el **motor genérico** (lo que será PV-Learn como plataforma) del **paquete de curso** concreto (Agent 365), de forma que cualquier curso futuro que cumpla la spec sea ejecutable sin tocar código del motor.

**Objetivo.** Que la arquitectura del repositorio refleje claramente la separación motor/paquete, con un course-package format formal documentado, y que el primer curso siga funcionando idéntico tras la migración.

**Alcance:**

1. Renombrar `shell/` → `platform/` (motor genérico).
2. Mover `modulos/` → `cursos/agent365-cert/modulos/` (primer paquete de curso).
3. Generar `cursos/agent365-cert/course.yaml` con metadatos canónicos del curso.
4. Generar `cursos/agent365-cert/modulos/{slug}/module.yaml` para cada módulo extraído de los frontmatters actuales.
5. Definir el course-package format en `docs/course-package-spec.md` v1.0.
6. Adaptar `platform/src/lib/content.ts` para cargar contenido desde `cursos/{slug}/modulos/...` (preparado para multi-curso).
7. Validador `scripts/validate-course.py` que comprueba conformidad de un paquete contra la spec.
8. Renombrar repo a `pv-learn` en GitHub (manual, lo hace el editor).
9. Smoke test: `npm run build` desde `platform/` produce el mismo bundle funcional que antes.

**Reglas pedagógicas adicionales que se documentan en esta fase** (a propagar en Bloques siguientes):

- **Quiz de práctica del módulo ≠ banco del examen final.** Identificadores `Q-NN-M` (quiz) y `EX-NN-MMM` (banco). Mínimo 3 preguntas de práctica por módulo, distintas a las del banco final.
- **Banco final consolidado** en `cursos/{slug}/banco-examen.md`.
- **Criterios de finalización de módulo.** AND lógico de los criterios aplicables: teoría leída ≥ 80% scroll + quiz aprobado ≥ 70% + labs intentados ≥ 1 + (si hay vídeo) ≥ 80% visto. Se omite cualquier criterio cuya sección no exista.
- **Modo de navegación por defecto:** secuencial con override (toggle "Modo exploración libre" en perfil del alumno).

**Bloques de trabajo de la Fase A:**

- **A.1 (este PR):** estructura nueva + manifests + spec + validador + smoke test. **No produce contenido nuevo** ni refactoriza módulos existentes.
- **A.2:** refactor de M01 al formato nuevo (separar `evaluacion.md` legacy en `quiz-practica.md` con preguntas Q-01-N + mover EX-01-NNN al banco final).
- **A.3:** validación contigo del refactor de M01 antes de propagar.

**Entregables de A.1:**

- `cursos/agent365-cert/` como paquete completo (course.yaml + 16 module.yaml).
- `platform/` operativo cargando contenido desde la nueva ubicación.
- `docs/course-package-spec.md` v1.0.
- `scripts/validate-course.py` con 5 validaciones canónicas.
- README raíz reescrito describiendo PV-Learn como plataforma.
- Workflow de deploy renombrado a `deploy-platform.yml`.

**Criterio de salida de la fase A.1:**

- Validador pasa sin errores (warnings aceptables si M17 todavía no produce banco final).
- `npm run build` desde `platform/` produce dist con todos los assets resueltos.
- PR revisado y mergeado a `main`.

---

### Fases 3-6 — Producción de los módulos 2-16

Una vez validado el shell, producción en bloques de ~4 módulos por fase para mantener la calidad y permitir validación intermedia. Cada módulo nuevo se publica en el shell automáticamente.

| Fase | Módulos | Foco temático | Duración total |
|---|---|---|---|
| Fase 3 | M02, M03, M04, M05 | Arquitectura, licenciamiento, roles, configuración inicial | 4h 15min |
| Fase 4 | M06, M07, M08, M09 | Identidad Entra, registry, ciclo de vida, accesos | 5h 45min |
| Fase 5 | M10, M11, M12, M13 | Purview, DLP, monitorización Defender, CCS | 5h |
| Fase 6 | M14, M15, M16 | Gobernanza avanzada, troubleshooting, costes | 2h 30min |

Tras cada fase, validación contigo y deploy automático del nuevo contenido al shell.

---

### Fase 7 — Examen final + revisión integral

Producción del Módulo 17 completo:

- Banco de preguntas final con las 60 preguntas distribuidas según los pesos del examen (15/30/15/20/20)
- Rúbrica de evaluación
- Componente del shell para examen cronometrado (90 min, single-page con timer visible, autoguardado, navegación entre preguntas, marca de "revisar después", entrega final con scoring inmediato)
- Revisión integral del curso entero: consistencia de terminología, enlaces internos, cobertura del banco, ajustes de tono entre módulos producidos en momentos distintos
- Validación final del mapeo competencias → preguntas

---

### Fase 8 — Shell completo + auth + certificación + PDFs

Producción final del shell sobre la base del prototipo de Fase 2.A. Diferencias respecto al prototipo:

- **Migración a Supabase**: auth real (email + magic link), perfil del alumno, progreso persistente entre dispositivos.
- **Bloqueo de módulos** según orden recomendado (configurable por el admin).
- **Generación del certificado** en PDF cuando el alumno cumple los criterios de finalización (todos los módulos vistos + 80% labs + ≥70% en examen final). PDF con `@react-pdf/renderer`, branding Plain Vanilla, nombre del alumno, fecha, código verificable.
- **PDFs descargables por módulo**: build estático de cada módulo en PDF para uso offline.
- **Manual completo en PDF**: los 17 módulos en un único PDF maquetado para imprimir.
- **Dashboard del admin**: ver alumnos inscritos, progreso, cohorts, exportar datos.
- **Deploy a producción**: dominio definitivo (subdominio en plainvanilla.ai o similar).
- **Analytics**: PostHog o similar para entender cómo navega la gente.

---

## Convenciones de trabajo

### Formato del contenido fuente

- **Markdown** como única fuente de verdad. El shell consume markdown vía `vite-plugin-md` o equivalente; nunca se duplica contenido en `.tsx` y `.md`.
- **Capturas de pantalla**: PNG en `assets/` de cada módulo. Anotaciones con caja roja `#D7263D`.
- **Diagramas**: SVG cuando sea posible (versionables como texto).
- **Comandos**: bloques con lenguaje declarado (` ```powershell `, ` ```bash `, ` ```kql `).
- **Capacidades en preview** marcadas con `[Preview]` o `[Frontier preview]`.
- **Capacidades GA** marcadas con `[GA]`.
- **Cero emojis** en cualquier archivo. Iconos sólo en el shell vía Lucide o Material UI.

### Citas a fuentes oficiales

```markdown
La activación inicial requiere navegar a Microsoft 365 admin center → **Copilot** → **Settings** ([Microsoft Learn](https://learn.microsoft.com/...)).
```

### Estructura estándar de cada módulo

#### `teoria.md`
1. Objetivos de aprendizaje en formato OA-XX.N con verbo Bloom.
2. Conceptos clave (glosario inicial).
3. Sub-secciones temporizadas que suman la duración total del módulo.
4. Resumen.
5. Próximo módulo.
6. Fuentes oficiales.

#### `laboratorios.md`
1. Prerrequisitos (tenant, licencias, roles, tiempo).
2. Lista de laboratorios numerados.
3. Por cada lab: objetivo, duración, dificultad, pasos numerados, validación, troubleshooting.

#### `evaluacion.md`
1. Las preguntas oficiales del módulo en el banco final (entre 1 y 11 según el módulo).
2. Cada una con: enunciado, opciones, respuesta correcta, justificación, variantes anti-repetición.
3. Caso de estudio integrado (no evaluable, refuerzo).

#### `recursos.md`
1. Documentación oficial Microsoft Learn (URLs en español cuando existan, inglés cuando sea más completo).
2. Blogs oficiales relevantes con fecha.
3. Whitepapers y repos GitHub.
4. Lecturas adicionales con caveat de "no oficial".

---

## Cómo trabajamos

Cada sesión sigue este patrón:

1. Claude lee `CLAUDE.md` y `PLAN.md` para tener contexto.
2. Identificamos la fase activa y el siguiente entregable.
3. Claude consulta `investigacion/deep-research-mayo-2026.md` y la documentación oficial cuando sea necesario.
4. Claude produce los archivos en la ruta correspondiente.
5. Commit + push a una rama de fase + PR para revisión.
6. Tras validación, merge a `main` y actualización del changelog.
7. El sitio MkDocs (revisión interna) y el shell React (producto) se reconstruyen automáticamente desde `main`.
