/**
 * Catálogo del curso: las 5 áreas de competencia y los 17 módulos.
 *
 * Esta es la "tabla de contenidos" que el shell usa para construir la home
 * y la navegación. Sincronizada con docs/arquitectura-curso.md v1.2.
 */

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
  preguntas: number
}

export const AREAS: CourseArea[] = [
  {
    id: 1,
    nombre: 'Plan and configure Microsoft Agent 365',
    nombreEs: 'Planificación y configuración',
    pesoExamen: 15,
    modulos: [1, 2, 3, 4, 5],
  },
  {
    id: 2,
    nombre: 'Manage agent identities with Microsoft Entra Agent ID',
    nombreEs: 'Identidades de agentes con Entra Agent ID',
    pesoExamen: 30,
    modulos: [6, 9],
  },
  {
    id: 3,
    nombre: 'Manage the agent registry and lifecycle',
    nombreEs: 'Registry y ciclo de vida',
    pesoExamen: 15,
    modulos: [7, 8],
  },
  {
    id: 4,
    nombre: 'Implement data protection with Microsoft Purview',
    nombreEs: 'Protección de datos con Purview',
    pesoExamen: 20,
    modulos: [10, 11],
  },
  {
    id: 5,
    nombre: 'Monitor, investigate and govern',
    nombreEs: 'Monitorización, investigación y gobernanza',
    pesoExamen: 20,
    modulos: [12, 13, 14, 15, 16],
  },
]

export const MODULES: CourseModule[] = [
  { id: 1,  slug: 'modulo-01-fundamentos',                  titulo: 'Fundamentos: ¿Qué es Microsoft Agent 365?',         duracionMin: 60,  areaExamen: 1, estado: 'producido', faseProduccion: 2, preguntas: 3  },
  { id: 2,  slug: 'modulo-02-arquitectura',                  titulo: 'Arquitectura y componentes',                         duracionMin: 75,  areaExamen: 1, estado: 'producido', faseProduccion: 3, preguntas: 3  },
  { id: 3,  slug: 'modulo-03-licenciamiento',                titulo: 'Licenciamiento, prerrequisitos y planificación',    duracionMin: 60,  areaExamen: 1, estado: 'producido', faseProduccion: 3, preguntas: 1  },
  { id: 4,  slug: 'modulo-04-roles-administrativos',         titulo: 'Roles administrativos y delegación',                duracionMin: 45,  areaExamen: 1, estado: 'pendiente', faseProduccion: 3, preguntas: 1  },
  { id: 5,  slug: 'modulo-05-configuracion-inicial',         titulo: 'Configuración inicial del tenant',                  duracionMin: 75,  areaExamen: 1, estado: 'pendiente', faseProduccion: 3, preguntas: 1  },
  { id: 6,  slug: 'modulo-06-entra-agent-id',                titulo: 'Microsoft Entra Agent ID e identidades',            duracionMin: 105, areaExamen: 2, estado: 'pendiente', faseProduccion: 4, preguntas: 11 },
  { id: 7,  slug: 'modulo-07-agent-registry-map',            titulo: 'Agent Registry y Agent Map',                         duracionMin: 75,  areaExamen: 3, estado: 'pendiente', faseProduccion: 4, preguntas: 4  },
  { id: 8,  slug: 'modulo-08-ciclo-vida-agentes',            titulo: 'Despliegue, distribución y ciclo de vida',          duracionMin: 90,  areaExamen: 3, estado: 'pendiente', faseProduccion: 4, preguntas: 5  },
  { id: 9,  slug: 'modulo-09-permisos-conditional-access',   titulo: 'Permisos, accesos y Conditional Access',            duracionMin: 75,  areaExamen: 2, estado: 'pendiente', faseProduccion: 4, preguntas: 7  },
  { id: 10, slug: 'modulo-10-purview-proteccion-datos',      titulo: 'Microsoft Purview y protección de datos',           duracionMin: 75,  areaExamen: 4, estado: 'pendiente', faseProduccion: 5, preguntas: 5  },
  { id: 11, slug: 'modulo-11-dlp-sensitivity-compliance',    titulo: 'DLP, sensitivity labels y compliance',              duracionMin: 75,  areaExamen: 4, estado: 'pendiente', faseProduccion: 5, preguntas: 7  },
  { id: 12, slug: 'modulo-12-monitorizacion-defender',       titulo: 'Monitorización, auditoría y reporting con Defender', duracionMin: 75,  areaExamen: 5, estado: 'pendiente', faseProduccion: 5, preguntas: 7  },
  { id: 13, slug: 'modulo-13-copilot-control-system',        titulo: 'Copilot Control System integrado con Agent 365',     duracionMin: 45,  areaExamen: 5, estado: 'pendiente', faseProduccion: 5, preguntas: 1  },
  { id: 14, slug: 'modulo-14-gobernanza-avanzada',           titulo: 'Gobernanza avanzada y multi-tenant',                duracionMin: 60,  areaExamen: 5, estado: 'pendiente', faseProduccion: 6, preguntas: 2  },
  { id: 15, slug: 'modulo-15-troubleshooting',               titulo: 'Troubleshooting y operación',                       duracionMin: 45,  areaExamen: 5, estado: 'pendiente', faseProduccion: 6, preguntas: 1  },
  { id: 16, slug: 'modulo-16-costes-optimizacion',           titulo: 'Costes, optimización y mejores prácticas',          duracionMin: 45,  areaExamen: 5, estado: 'pendiente', faseProduccion: 6, preguntas: 1  },
  { id: 17, slug: 'modulo-17-examen-certificacion',          titulo: 'Examen de certificación',                           duracionMin: 90,  areaExamen: 0, estado: 'pendiente', faseProduccion: 7, preguntas: 60 },
]

export const COURSE_TOTAL_MIN = MODULES.slice(0, 16).reduce((sum, m) => sum + m.duracionMin, 0)
export const COURSE_EXAM_MIN = 90

export function findModule(id: number | string): CourseModule | undefined {
  const numId = typeof id === 'string' ? parseInt(id, 10) : id
  return MODULES.find(m => m.id === numId)
}

export function getAreaForModule(moduleId: number): CourseArea | undefined {
  return AREAS.find(a => a.modulos.includes(moduleId))
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}h` : `${h}h ${m}min`
}
