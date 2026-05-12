/**
 * Registry de cursos de PV-Learn.
 *
 * Descubre dinámicamente todos los cursos del repo via `import.meta.glob`
 * sobre `cursos/*\/course.yaml` y construye un mapa
 * `Map<slug, CourseData>`. Cada `CourseData` contiene metadatos del
 * curso (título, idioma, branding) y la lista de módulos derivada de
 * los `module.yaml` de cada paquete.
 *
 * Sin dependencia de React. Pensado para alimentar:
 *
 *   - `contexts/CourseContext.tsx` (curso activo según URL `:slug`).
 *   - `pages/CatalogPage.tsx` (si en el futuro se muestra un catálogo).
 *   - `lib/storage.ts` (storage keys prefijadas por slug).
 *
 * Limitación de Vite: los globs exigen literales, así que el patrón es
 * `../../../cursos/*\/...`. Cualquier curso nuevo bajo `cursos/<slug>/`
 * que cumpla la spec se incorpora automáticamente al registry — eso es
 * lo que hace "plug-and-play real".
 */

import yaml from 'js-yaml'

/* ------------------------------- Tipos ------------------------------- */

export type ModuleStatus = 'producido' | 'en_revision' | 'pendiente'

export interface CourseArea {
  id: number
  nombre: string
  nombreEs: string
  pesoExamen: number
  modulos: number[]
}

export interface CourseModule {
  id: number
  slug: string
  titulo: string
  duracionMin: number
  areaExamen: number
  estado: ModuleStatus
  faseProduccion: number
  /** Preguntas declaradas para el examen final (solo informativo). */
  preguntas: number
}

export interface CourseBranding {
  colorPrimario: string
  colorAcento: string
  logoClaro?: string
  favicon?: string
}

export interface CourseData {
  slug: string
  title: string
  shortTitle: string
  description: string
  language: string
  editor: string
  totalMinutes: number
  examMinutes: number
  examPassPct: number
  examTotalQuestions: number
  branding: CourseBranding
  areas: CourseArea[]
  modules: CourseModule[]
  /**
   * Slug del módulo que contiene el examen final. Puede no existir si el
   * curso no tiene examen (cursos formativos sin certificación).
   */
  examModuleSlug: string | null
  certificateTitle: string
  certificateLegalName: string
  certificateEnabled: boolean
}

/* ----------------------------- Discovery ----------------------------- */

interface CourseYaml {
  spec_version: string
  id: string
  slug: string
  nombre: string
  nombre_corto: string
  descripcion_corta: string
  idioma: string
  editor: string
  duracion_total_min: number
  branding?: {
    color_primario?: string
    color_acento?: string
    logo_claro?: string
    favicon?: string
  }
  areas_examen?: Array<{
    id: number
    nombre_es: string
    nombre_en: string
    peso_pct: number
    modulos: number[]
  }>
  examen_final?: {
    duracion_min: number
    numero_preguntas: number
    puntaje_aprobado_pct: number
  }
  certificado?: {
    habilitado: boolean
    nombre_otorgado?: string
  }
  modulos: string[]
}

interface ModuleYaml {
  id: number
  slug: string
  titulo: string
  duracion_min: number
  area_examen: number
  estado: ModuleStatus
  fase_produccion: number
  preguntas_aporta_examen_final?: number
}

// `import.meta.glob` solo existe en runtime Vite. Cuando este módulo se
// importa desde un script de tests con Node puro (ej. `test:exam`),
// caemos a un objeto vacío para no romper la importación.
const HAS_GLOB =
  typeof (import.meta as ImportMeta & { glob?: unknown }).glob === 'function'

const courseFiles: Record<string, string> = HAS_GLOB
  ? (import.meta.glob<string>('../../../cursos/*/course.yaml', {
      query: '?raw',
      import: 'default',
      eager: true,
    }) as Record<string, string>)
  : {}

const moduleFiles: Record<string, string> = HAS_GLOB
  ? (import.meta.glob<string>('../../../cursos/*/modulos/*/module.yaml', {
      query: '?raw',
      import: 'default',
      eager: true,
    }) as Record<string, string>)
  : {}

/* ---------------------------- Construcción ---------------------------- */

function safeParse<T>(raw: string, path: string): T | null {
  try {
    return yaml.load(raw) as T
  } catch (err) {
    console.warn('[coursesRegistry] YAML inválido:', path, err)
    return null
  }
}

function buildRegistry(): Map<string, CourseData> {
  const registry = new Map<string, CourseData>()

  // 1) Cargar course.yaml de cada curso.
  for (const [path, raw] of Object.entries(courseFiles)) {
    const match = path.match(/cursos\/([^/]+)\/course\.yaml$/)
    if (!match) continue
    const slug = match[1]
    const cy = safeParse<CourseYaml>(raw, path)
    if (!cy) continue

    const areas: CourseArea[] = (cy.areas_examen ?? []).map(a => ({
      id: a.id,
      nombre: a.nombre_en,
      nombreEs: a.nombre_es,
      pesoExamen: a.peso_pct,
      modulos: a.modulos,
    }))

    const examTotal = cy.examen_final?.numero_preguntas ?? 0
    const examMinutes = cy.examen_final?.duracion_min ?? 90
    const examPassPct = cy.examen_final?.puntaje_aprobado_pct ?? 70

    const courseData: CourseData = {
      slug,
      title: cy.nombre,
      shortTitle: cy.nombre_corto,
      description: cy.descripcion_corta,
      language: cy.idioma,
      editor: cy.editor,
      totalMinutes: cy.duracion_total_min,
      examMinutes,
      examPassPct,
      examTotalQuestions: examTotal,
      branding: {
        colorPrimario: cy.branding?.color_primario ?? '#9A44E5',
        colorAcento: cy.branding?.color_acento ?? '#F68DAC',
        logoClaro: cy.branding?.logo_claro,
        favicon: cy.branding?.favicon,
      },
      areas,
      modules: [], // se rellena en el segundo paso
      examModuleSlug: null,
      certificateTitle: cy.certificado?.nombre_otorgado ?? cy.nombre,
      certificateLegalName: cy.nombre,
      certificateEnabled: cy.certificado?.habilitado ?? false,
    }
    registry.set(slug, courseData)
  }

  // 2) Cargar module.yaml de cada módulo y asignarlo al curso correspondiente.
  for (const [path, raw] of Object.entries(moduleFiles)) {
    const match = path.match(/cursos\/([^/]+)\/modulos\/([^/]+)\/module\.yaml$/)
    if (!match) continue
    const courseSlug = match[1]
    const my = safeParse<ModuleYaml>(raw, path)
    if (!my) continue
    const course = registry.get(courseSlug)
    if (!course) continue

    course.modules.push({
      id: my.id,
      slug: my.slug,
      titulo: my.titulo,
      duracionMin: my.duracion_min,
      areaExamen: my.area_examen,
      estado: my.estado,
      faseProduccion: my.fase_produccion,
      preguntas: my.preguntas_aporta_examen_final ?? 0,
    })
  }

  // 3) Ordenar módulos por id y derivar el examModuleSlug si existe
  //    (areaExamen === 0). En el modelo actual el examen es un módulo
  //    "virtual" final; si el yaml no lo marca, se busca el último.
  for (const course of registry.values()) {
    course.modules.sort((a, b) => a.id - b.id)
    const exam = course.modules.find(m => m.areaExamen === 0)
    if (exam) course.examModuleSlug = exam.slug
  }

  return registry
}

const REGISTRY = buildRegistry()

/* ------------------------------- API ------------------------------- */

export function listCourses(): CourseData[] {
  return [...REGISTRY.values()]
}

export function getCourse(slug: string): CourseData | undefined {
  return REGISTRY.get(slug)
}

/** Devuelve el primer curso disponible. Útil como redirect default. */
export function defaultCourseSlug(): string {
  const first = REGISTRY.keys().next().value
  return first ?? 'agent365-cert'
}

/* ------------------------- helpers derivados ------------------------- */

/** Módulos de contenido del curso (excluye el examen final). */
export function contentModules(course: CourseData): CourseModule[] {
  return course.modules.filter(m => m.areaExamen !== 0)
}

/** Módulo del examen final (puede no existir). */
export function examModule(course: CourseData): CourseModule | null {
  return course.modules.find(m => m.areaExamen === 0) ?? null
}

export function findModule(course: CourseData, id: number | string): CourseModule | undefined {
  const numId = typeof id === 'string' ? parseInt(id, 10) : id
  return course.modules.find(m => m.id === numId)
}

export function getAreaForModule(course: CourseData, moduleId: number): CourseArea | undefined {
  return course.areas.find(a => a.modulos.includes(moduleId))
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}h` : `${h}h ${m}min`
}
