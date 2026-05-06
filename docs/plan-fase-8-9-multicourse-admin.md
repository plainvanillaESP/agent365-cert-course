# Plan ampliado: Fases 8 y 9 — De curso único a plataforma de cursos

> **Estado:** Diseño · No iniciado · Planificación dependiente de cerrar antes Fases 3 a 7.

## Contexto y justificación

El plan original tenía una sola Fase 8 que englobaba "shell completo + auth + certificación + PDFs". A medida que la dirección de Plain Vanilla decide convertir el curso de Microsoft Agent 365 IT Admin en el primero de una serie de cursos, esa fase se queda corta: hace falta separar dos esfuerzos que tienen alcance, riesgo y dependencias muy distintos.

La nueva división es:

- **Fase 8** — Convierte el shell de un curso a una plataforma multi-curso con backend real, autenticación y persistencia.
- **Fase 9** — Construye el panel de administración para que el equipo PMO pueda crear nuevos cursos, módulos y preguntas sin tocar código, además de la generación de certificados y PDFs descargables.

## Fase 8 — Plataforma multi-curso, autenticación y backend

### Objetivo

Que un alumno pueda iniciar sesión, ver una lista de cursos disponibles y abrir el que le corresponda. Que cada curso tenga su propio branding (logo, paleta, nombre) y su contenido aislado del resto. Que el progreso de cada alumno se guarde de forma persistente entre sesiones y dispositivos.

### Cambios clave

| Hoy | Fase 8 |
|---|---|
| Un único curso hardcoded | Plataforma multi-curso |
| URL `/modulo/N/seccion` | URL `/curso/<slug>/modulo/N/seccion` |
| Branding fijo de Plain Vanilla en el header | Header con branding del curso (logo, nombre) sobre el branding de la plataforma |
| `lib/course.ts` con array de módulos | Cursos como filas en backend |
| `lib/quiz.ts`, `lib/labs.ts`, `lib/resources.ts` con datos hardcoded | Datos cargados desde backend |
| Progreso de lectura en localStorage | Progreso por alumno en backend, sincronizado entre dispositivos |
| Sin login | Login con Microsoft, Google y email magic link |

### Decisiones técnicas a tomar al arrancar la fase

1. **Backend:** Supabase es el candidato natural. Da auth con OAuth de Microsoft y Google sin código, base Postgres, almacenamiento de archivos y row-level security suficiente para multi-tenant.
2. **Repositorio:** mismo monorepo, los cursos como filas en una tabla. Alternativa descartada: un repo por curso, mucho más caro de operar.
3. **Migración de contenido:** los `.md` actuales se migran a una tabla `module_sections (course_id, module_id, section, body, frontmatter_json)`. Los SVGs en almacenamiento de Supabase. Los componentes React se mantienen idénticos: solo cambia la fuente de datos.

### Entregables

- Multi-tenancy de cursos completamente operativo.
- Login con Microsoft, Google y magic link.
- Migración del curso de Microsoft Agent 365 IT Admin a la nueva arquitectura sin pérdida de funcionalidad ni cambios visibles para el alumno.
- Branding configurable por curso: logo claro y oscuro, color primario, nombre, descripción.
- Progreso de lectura, evaluación y laboratorios persistido por alumno.

## Fase 9 — Panel admin de cursos, certificación y PDFs

### Objetivo

Que el equipo PMO de Plain Vanilla pueda crear y mantener cursos sin necesidad de un desarrollador. Que el alumno reciba un certificado al aprobar el examen final y pueda descargar cada módulo en PDF para consulta offline.

### Áreas funcionales

#### Panel admin

Ruta `/admin`, accesible sólo para usuarios con rol `editor` o superior.

- **Catálogo de cursos.** Lista, alta, edición de metadatos (slug, nombre, descripción, logo, paleta, áreas de examen y pesos).
- **Editor de módulos.** Reordenación drag-and-drop, edición de metadatos por módulo, duración, área asignada.
- **Editor de teoría.** Markdown con preview en vivo, subida de SVGs e imágenes anotadas, validación contra reglas anti-IA documentadas en `convenciones-redaccion.md` (linter automático que avisa si detecta `OA-XX.N`, `(Bloom)`, em-dashes, frases prohibidas).
- **Banco de preguntas.** CRUD de preguntas con los tres tipos soportados (`multiple-choice`, `scenario`, `drag-and-drop`). Asignación de OA, área, Bloom, dificultad. Variantes para cohortes.
- **Banco de laboratorios.** Editor de laboratorios interactivos para los módulos que lo necesiten (escenarios y chips, recorridos guiados, etc.).
- **Recursos.** CRUD de recursos por módulo y categoría, con tipo, URL, descripción, idioma.
- **Cross-references entre módulos.** Editor visual del grafo "este tema se profundiza en M07".

#### Certificación

- Generación de certificado al aprobar el examen final con la nota mínima requerida del curso.
- Plantilla de certificado configurable por curso, con marca compartida Plain Vanilla + curso.
- ID único de certificado verificable en una URL pública del tipo `/verify/<id>`.
- Histórico de certificados emitidos por alumno y por curso, exportable.

#### PDFs descargables

- Generación de PDF por módulo con la teoría más los recursos, listo para imprimir o consultar offline.
- Generación del libro completo del curso en PDF.
- Branding consistente con el curso (logo, paleta, header y footer).

### Decisiones a tomar al arrancar la fase

1. **Generación de PDF.** Probable: Puppeteer renderizando el shell con un layout de impresión específico. Alternativa más barata: `react-pdf`, perdiendo fidelidad visual.
2. **Plantilla de certificado.** ¿Diseño específico por curso o plantilla común con nombre y logo intercambiables? Recomendación: plantilla común para garantizar coherencia, slot para logo del curso y nombre.
3. **Roles y permisos.** Mínimo viable: `student`, `editor`, `admin`. `editor` puede tocar contenido pero no usuarios; `admin` puede tocar todo, incluida la lista de editores.

### Entregables

- Panel `/admin` completo con CRUD de cursos, módulos, preguntas, laboratorios y recursos.
- Linter anti-IA automático integrado en el editor de markdown.
- Sistema de certificación operativo con verificación pública.
- Exportación a PDF por módulo y por curso completo.

## Lo que no cambia

Mientras avanzan Fases 3 a 7 (producción del resto de módulos del curso de Agent 365), el shell sigue funcionando como ahora: TypeScript hardcoded, despliegue por GitHub Pages, sin login. El trabajo de producción del contenido (markdown, SVGs, capturas anotadas) **no se desperdicia**: cuando llegue Fase 8, el contenido se migra tal cual del repo al backend; los componentes React se mantienen idénticos y solo cambia la fuente de datos. Es la misma diferencia entre tener un libro escrito a mano y tenerlo cargado en una biblioteca digital: el libro no cambia, cambia cómo se accede a él.

## Hitos en orden

1. Cerrar Fases 3 a 7 (todos los módulos producidos en el formato actual).
2. Arrancar Fase 8: backend Supabase, auth, multi-curso, migración del curso actual.
3. Arrancar Fase 9: panel admin, certificación, PDFs.
4. **Validación de la plataforma con un segundo curso real.** Sin un segundo curso, el multi-tenancy es teoría. Recomendación: producir el primer curso adicional usando el panel admin desde cero, sin tocar código. Si esto funciona sin desarrollo, la plataforma está lista para escalar.
