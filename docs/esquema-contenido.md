# Esquema de contenido del curso

> Define las entidades del curso, sus campos y sus relaciones. Sirve como spec para el shell React (Fase 2.A en adelante) y como configuración base para un CMS git-backed si se decide añadir uno en Fase 8.

---

## Principio

El **markdown en el repositorio es la única fuente de verdad** del contenido. Cualquier CMS futuro lee y escribe sobre estos archivos vía la API de GitHub. Nunca hay una base de datos propia del contenido fuera del repo.

---

## Entidades

### Módulo

Un módulo del curso. Carpeta `modulos/modulo-XX-nombre/`.

Archivos que contiene:
- `README.md` — overview del módulo
- `teoria.md` — contenido teórico
- `laboratorios.md` — laboratorios prácticos
- `evaluacion.md` — preguntas oficiales del módulo
- `recursos.md` — referencias externas
- `assets/` — diagramas SVG, capturas PNG

Frontmatter común a todos los archivos del módulo:

```yaml
---
modulo: 01                          # número del módulo, dos dígitos
tipo: teoria                        # teoria | laboratorios | evaluacion | recursos | readme
titulo: "Fundamentos: ¿Qué es..."   # título del archivo (no del módulo)
duracion_min: 60                    # duración estimada en minutos
area_examen: 1                      # área de competencia (1-5)
estado: producido                   # producido | en_revision | pendiente
fase_produccion: 2                  # fase del plan en la que se produjo
ultima_actualizacion: 2026-05-06    # ISO date
---
```

Frontmatter específico de `teoria.md`:

```yaml
prerrequisitos:                     # IDs de módulos previos requeridos
  - ninguno                         # o: ["modulo-01", "modulo-03"]
objetivos_aprendizaje:              # IDs de OAs cubiertos
  - OA-01.1
  - OA-01.2
sub_secciones:                      # estructura interna temporizada
  - id: "1.1"
    titulo: "El problema que resuelve Agent 365"
    duracion_min: 10
  - id: "1.2"
    titulo: "Posicionamiento: control plane, no builder"
    duracion_min: 15
```

Frontmatter específico de `evaluacion.md`:

```yaml
preguntas_oficiales:                # IDs de preguntas que aporta este módulo al banco
  - EX-01-001
  - EX-01-002
  - EX-01-003
caso_estudio: "Plain Coffee SL"     # nombre del caso de estudio integrado
```

Frontmatter específico de `laboratorios.md`:

```yaml
laboratorios:
  - id: "01.1"
    titulo: "Mapeo de escenarios al producto correcto"
    duracion_min: 15
    dificultad: basico
    requiere_tenant: false          # algunos labs son ejercicios sin tenant
    licencias_requeridas: []
    roles_requeridos: []
```

---

### Objetivo de aprendizaje (OA)

Identificador único en formato `OA-XX.N` donde `XX` es el número del módulo y `N` es el orden dentro del módulo.

Definidos en `docs/arquitectura-curso.md` (sección de detalle por módulo). Cada OA tiene:

- ID (`OA-01.1`)
- Texto del objetivo
- Verbo Bloom (Recordar / Comprender / Aplicar / Analizar / Evaluar / Crear)
- Módulo al que pertenece
- Pregunta del banco que lo evalúa (relación con la siguiente entidad)

---

### Pregunta del banco

Identificador único en formato `EX-XX-NNN` donde `XX` es el módulo de origen y `NNN` es un secuencial.

Definidas en `modulos/modulo-XX-nombre/evaluacion.md` con la siguiente estructura:

```yaml
- id: EX-01-001
  oa_mapeado: OA-01.1
  area: 1
  bloom: comprender
  dificultad: facil               # facil | media | dificil
  tipo: multiple_choice           # multiple_choice | multiple_response | drag_and_drop | ordering | kql_completion | scenario | troubleshooting_tree
  enunciado: "..."
  opciones:
    - texto: "..."
      correcta: true
    - texto: "..."
      correcta: false
  justificacion: "..."
  variantes:
    - "..."
    - "..."
```

En el markdown actual la información está en prosa. La extracción al formato YAML estructurado se hará en Fase 7 (revisión integral) o cuando el CMS se configure.

---

### Área de competencia

Las cinco áreas oficiales del examen, con pesos fijos:

| ID | Nombre | Peso |
|---|---|---|
| 1 | Plan and configure Microsoft Agent 365 | 15% |
| 2 | Manage agent identities with Microsoft Entra Agent ID | 30% |
| 3 | Manage the agent registry and lifecycle | 15% |
| 4 | Implement data protection with Microsoft Purview | 20% |
| 5 | Monitor, investigate and govern | 20% |

Definidas en `docs/arquitectura-curso.md`. No tienen archivo propio: son una constante del curso.

---

### Recurso externo

Enlace a documentación oficial, blog o whitepaper. Definidos dentro de `recursos.md` de cada módulo.

Cuando el CMS se añada, los recursos pueden migrarse a una colección propia con campos:

```yaml
- id: rec-microsoft-learn-agent-overview
  titulo: "Microsoft Agent 365 — overview (es-ES)"
  tipo: documentacion_oficial      # documentacion_oficial | blog | whitepaper | repo_github | tercero
  url: "https://learn.microsoft.com/..."
  descripcion: "..."
  modulos_relacionados: ["01", "02"]
```

Por ahora viven como bullets en markdown.

---

## Compatibilidad CMS

### Sveltia CMS / Decap CMS (git-backed)

El frontmatter YAML se mapea directamente a campos editables en la UI del CMS. Configuración típica:

```yaml
collections:
  - name: modulos
    folder: modulos
    nested: { depth: 2 }
    fields:
      - { name: modulo, widget: number }
      - { name: tipo, widget: select, options: [teoria, laboratorios, evaluacion, recursos] }
      - { name: titulo, widget: string }
      - { name: duracion_min, widget: number }
      - { name: estado, widget: select, options: [producido, en_revision, pendiente] }
      - { name: body, widget: markdown }
```

### TinaCMS

Schema más sofisticado pero misma idea. Los archivos `.md` quedan intactos.

### Esquema documentado aquí

Cualquiera de los dos lee este documento como spec. La implementación real se hace en Fase 8.

---

## Lo que NO está en este esquema

- **Datos del alumno**: progreso, intentos, scores. No son contenido del curso. Viven en una base de datos separada (Supabase en Fase 8) y no en markdown.
- **Configuración del shell React**: rutas, estilos, layout. Se versiona como código en `shell/`, no como contenido.
- **Branding y assets globales**: logos, colores, fuentes. Viven en `shell/src/` o en `assets/` raíz, no en cada módulo.
