/**
 * Carga del contenido del curso desde los archivos .md del repositorio.
 *
 * Usa import.meta.glob de Vite para descubrir y cargar todos los .md
 * de modulos/, separa el frontmatter YAML del body markdown y entrega
 * el body listo para pasar a react-markdown.
 *
 * Nota técnica: NO usamos gray-matter aquí. gray-matter depende de
 * `Buffer` (API de Node) que no existe en el navegador y rompe el
 * bundle con `ReferenceError: Buffer is not defined`. Como solo
 * necesitamos el body (el frontmatter por ahora es metadata para CMS,
 * no se consume en runtime del shell), un strip por regex es suficiente
 * y elimina ~50 kB de dependencias.
 */

export type ContentType = 'readme' | 'teoria' | 'laboratorios' | 'evaluacion' | 'recursos'

export interface ParsedContent {
  /**
   * Frontmatter como string sin parsear. La parte amarilla entre los `---`.
   * Si en el futuro hace falta consumirlo, parsearlo con `js-yaml`
   * (browser-safe) en el lugar puntual donde se necesite.
   */
  frontmatterRaw: string
  body: string
  raw: string
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

/**
 * Separa frontmatter y body de un .md. Si no hay frontmatter, devuelve
 * el contenido íntegro como body.
 */
function splitFrontmatter(raw: string): { frontmatterRaw: string; body: string } {
  const m = raw.match(FRONTMATTER_RE)
  if (!m) return { frontmatterRaw: '', body: raw }
  return {
    frontmatterRaw: m[1],
    body: raw.slice(m[0].length),
  }
}

/**
 * Slug del curso activo. Mientras la plataforma sirva un único curso (Agent 365)
 * vive aquí como constante. Cuando lleguen los segundos cursos (Fase 8 / multi-curso)
 * esto se parametriza por la URL `/curso/{slug}/...` y el loader pasa a leer el
 * manifest del curso correspondiente desde `cursos/{slug}/course.yaml`.
 *
 * Ver `docs/course-package-spec.md` para el formato canónico del paquete.
 */
const ACTIVE_COURSE_SLUG = 'agent365-cert'

/**
 * Carga eager de todos los .md del directorio cursos/<slug-curso>/modulos/.
 * Eager para que no haya flash de carga; el contenido es estático en build.
 */
const moduleFiles = import.meta.glob('../../../cursos/agent365-cert/modulos/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

/**
 * Mapa interno: clave normalizada → contenido raw.
 * La clave es del estilo 'modulo-01-fundamentos/teoria'.
 */
const contentMap = new Map<string, string>()

for (const [path, raw] of Object.entries(moduleFiles)) {
  // path tiene formato '../../../cursos/agent365-cert/modulos/modulo-01-fundamentos/teoria.md'
  const match = path.match(/cursos\/[^/]+\/modulos\/([^/]+)\/([^/.]+)\.md$/)
  if (match) {
    const [, slug, file] = match
    contentMap.set(`${slug}/${file}`, raw)
  }
}

/**
 * Carga eager de todos los assets (SVG, PNG, JPG) en cursos/<slug-curso>/modulos/<slug-modulo>/assets/.
 * Vite los procesa, hashea y los incluye en dist/.
 */
const assetFiles = import.meta.glob('../../../cursos/agent365-cert/modulos/**/assets/*', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>

const assetMap = new Map<string, string>()
for (const [path, url] of Object.entries(assetFiles)) {
  const match = path.match(/cursos\/[^/]+\/modulos\/([^/]+)\/assets\/([^/]+)$/)
  if (match) {
    const [, slug, file] = match
    assetMap.set(`${slug}/${file}`, url)
  }
}

void ACTIVE_COURSE_SLUG  // referenced in comments; reserved for multi-course (Fase 8)

/**
 * Carga un archivo de contenido del módulo dado.
 *
 * @param slug - slug del módulo (ej: 'modulo-01-fundamentos')
 * @param type - tipo de contenido (teoria, laboratorios, evaluacion, recursos)
 * @returns frontmatter parseado y body markdown, o null si el archivo no existe
 */
export function loadContent(slug: string, type: ContentType): ParsedContent | null {
  const key = `${slug}/${type === 'readme' ? 'README' : type}`
  const raw = contentMap.get(key)
  if (!raw) return null

  const { frontmatterRaw, body } = splitFrontmatter(raw)
  return {
    frontmatterRaw,
    body,
    raw,
  }
}

/**
 * Devuelve la lista de módulos que tienen contenido producido (al menos teoria.md).
 */
export function getProducedModules(): string[] {
  const slugs = new Set<string>()
  for (const key of contentMap.keys()) {
    if (key.endsWith('/teoria')) {
      slugs.add(key.replace('/teoria', ''))
    }
  }
  return Array.from(slugs).sort()
}

/**
 * Devuelve la URL procesada por Vite para un asset de módulo.
 * Vite ya lo ha hasheado y copiado a dist/, esta función solo busca la URL final.
 */
export function assetUrl(slug: string, asset: string): string | undefined {
  return assetMap.get(`${slug}/${asset}`)
}

/**
 * Resuelve una URL relativa de un markdown (típicamente `./assets/foo.svg`)
 * a la URL absoluta procesada por Vite.
 */
export function resolveContentUrl(slug: string, url: string): string {
  // URL absoluta o externa: pasar tal cual
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
    return url
  }
  // URL relativa con assets/
  const assetMatch = url.match(/(?:^\.\/)?assets\/(.+)$/)
  if (assetMatch) {
    const resolved = assetUrl(slug, assetMatch[1])
    if (resolved) return resolved
  }
  return url
}
