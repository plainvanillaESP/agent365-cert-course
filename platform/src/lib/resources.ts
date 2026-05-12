/**
 * API de los recursos editoriales por módulo del curso.
 *
 * Cada recurso lleva tipado el formato (docs, blog, whitepaper, github,
 * commercial, external) y la URL. El componente Resources usa el tipo
 * para elegir el icono y el hostname visible.
 *
 * **Fuente de los datos**: archivos `recursos.yaml` dentro de cada
 * módulo del curso (`cursos/<slug>/modulos/<modulo>/recursos.yaml`).
 * El glob vive en `course-paths.ts` para que solo haya UN sitio donde
 * el slug del curso aparezca hardcoded. Si un módulo no tiene
 * `recursos.yaml`, la sección Recursos cae al fallback markdown.
 *
 * Antes: los datos vivían como objetos TypeScript inline en este
 * archivo (1.711 líneas), lo que rompía el principio plug-and-play
 * (cambiar de curso obligaba a editar este archivo). Ver fase H.1
 * del changelog.
 */

import yaml from 'js-yaml'
import { loadResourcesGlob } from './course-paths'

export type ResourceType =
  | 'docs'         // learn.microsoft.com
  | 'blog'         // techcommunity, security blog, M365 blog
  | 'whitepaper'   // PDFs en adoption.microsoft.com
  | 'github'       // repositorios
  | 'commercial'   // microsoft.com/en-us/...
  | 'external'     // analistas, prensa, lecturas externas

export interface Resource {
  type: ResourceType
  title: string
  url: string
  description?: string
  /** Solo blogs: fecha publicación visible. */
  date?: string
  /** Marca cuando el contenido está en inglés y el módulo es ES. */
  lang?: 'en' | 'es'
}

export interface ResourceCategory {
  id: string
  title: string
  description?: string
  resources: Resource[]
}

export interface CrossReference {
  topic: string
  /** Módulo destino. Si moduleId no existe en MODULES, se renderiza inerte. */
  moduleId: number
  moduleTitle: string
}

export interface ModuleResources {
  moduleId: number
  intro: string
  categories: ResourceCategory[]
  crossReferences: CrossReference[]
  /** Disclaimer opcional para fuentes externas. */
  externalNote?: string
}

/* ------------------------- Carga desde YAML ------------------------- */

/**
 * Mapa moduleId → recursos parseados, calculado una vez al cargar el
 * bundle. Vite empaqueta los YAML eager desde `course-paths.ts`.
 */
const RESOURCES_BY_MODULE: Map<number, ModuleResources> = (() => {
  const out = new Map<number, ModuleResources>()
  const files = loadResourcesGlob()

  for (const [path, raw] of Object.entries(files)) {
    try {
      const data = yaml.load(raw) as Partial<ModuleResources> | null
      if (!data || typeof data.moduleId !== 'number') {
        console.warn('[resources] YAML sin moduleId válido:', path)
        continue
      }

      if (!data.intro || !Array.isArray(data.categories) || !Array.isArray(data.crossReferences)) {
        console.warn('[resources] YAML con shape incompleto:', path)
        continue
      }

      out.set(data.moduleId, data as ModuleResources)
    } catch (err) {
      console.warn('[resources] Error parseando YAML:', path, err)
    }
  }

  return out
})()

/* --------------------------- API pública --------------------------- */

export function getResourcesForModule(moduleId: number): ModuleResources | null {
  return RESOURCES_BY_MODULE.get(moduleId) ?? null
}

export function getAllResources(): ModuleResources[] {
  return [...RESOURCES_BY_MODULE.values()].sort((a, b) => a.moduleId - b.moduleId)
}

/**
 * Devuelve el hostname limpio (sin "www.") de una URL.
 * Útil para mostrar la fuente de un recurso debajo del título.
 */
export function hostnameOf(url: string): string {
  try {
    const u = new URL(url)
    return u.hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}
