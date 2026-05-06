/**
 * Datos de la sección Recursos por módulo.
 *
 * Cada recurso lleva tipado el formato (docs, blog, whitepaper, github,
 * commercial, external) y la URL. El componente Resources usa el tipo
 * para elegir el icono y el hostname visible. La fuente de verdad es
 * este archivo; el .md de cada módulo queda como copia legible en raw,
 * y en la Fase 8 ambos se unifican vía CMS.
 */

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
  /** Solo blogs: fecha publicación visible */
  date?: string
  /** Marca para indicar que el contenido está en inglés cuando el resto del módulo está en es-ES */
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
  /** Módulo destino. Si moduleId no existe en MODULES, se renderiza como texto inerte. */
  moduleId: number
  moduleTitle: string
}

export interface ModuleResources {
  moduleId: number
  intro: string
  categories: ResourceCategory[]
  crossReferences: CrossReference[]
  /** Disclaimer opcional para fuentes externas */
  externalNote?: string
}

/* --------------------------------- M01 ----------------------------------- */

const M01_RESOURCES: ModuleResources = {
  moduleId: 1,
  intro:
    'Enlaces oficiales para profundizar en los temas tratados en el módulo. Las URLs apuntan a páginas activas en mayo de 2026; si Microsoft mueve algún contenido, validar en el changelog del módulo.',
  externalNote:
    'Las fuentes externas no son oficiales de Microsoft. Se incluyen porque aportan perspectiva de mercado o contexto técnico relevante. Validar siempre con documentación oficial antes de aplicar en producción.',
  categories: [
    {
      id: 'docs-overview',
      title: 'Documentación oficial — Visión general del producto',
      resources: [
        {
          type: 'docs',
          title: 'Microsoft Agent 365 — overview',
          url: 'https://learn.microsoft.com/es-es/microsoft-agent-365/overview',
          description: 'Página de entrada al producto.',
          lang: 'es',
        },
        {
          type: 'docs',
          title: 'Microsoft Agent 365 — overview',
          url: 'https://learn.microsoft.com/microsoft-agent-365/overview',
          description: 'Versión inglesa, normalmente más actualizada que la española.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Microsoft 365 admin center: Agent 365 overview',
          url: 'https://learn.microsoft.com/microsoft-365/admin/manage/agent-365-overview',
          description: 'Visión desde el admin center que se usa día a día.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'docs-stakeholders',
      title: 'Documentación oficial — Stakeholders',
      resources: [
        {
          type: 'docs',
          title: 'Capacities of Agent 365: Microsoft Entra integration',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/capabilities-entra',
          description: 'Cómo se integra con Entra.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Capacities of Agent 365: data security with Microsoft Purview',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/data-security',
          description: 'Integración con Purview.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Capacities of Agent 365: threat protection with Microsoft Defender',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/threat-protection',
          description: 'Integración con Defender.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'docs-ccs',
      title: 'Documentación oficial — Copilot Control System',
      resources: [
        {
          type: 'docs',
          title: 'Copilot Control System — overview',
          url: 'https://learn.microsoft.com/copilot/microsoft-365/copilot-control-system/overview',
          description: 'Entrada al producto hermano.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Copilot Control System — security & governance',
          url: 'https://learn.microsoft.com/copilot/microsoft-365/copilot-control-system/security-governance',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Copilot Control System — management controls',
          url: 'https://learn.microsoft.com/copilot/microsoft-365/copilot-control-system/management-controls',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Copilot Control System — measurement & reporting',
          url: 'https://learn.microsoft.com/copilot/microsoft-365/copilot-control-system/measurement-reporting',
          lang: 'en',
        },
      ],
    },
    {
      id: 'docs-sdks',
      title: 'Documentación oficial — Distinción de los dos SDKs',
      resources: [
        {
          type: 'docs',
          title: 'Microsoft 365 Agents SDK — overview',
          url: 'https://learn.microsoft.com/microsoft-365/agents/agents-sdk/overview',
          description: 'El SDK del transporte conversacional.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Microsoft Agent 365 SDK — overview',
          url: 'https://learn.microsoft.com/microsoft-agent-365/developer/agent-365-sdk',
          description: 'El SDK de gobernanza.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Microsoft Agent 365 SDK — get started',
          url: 'https://learn.microsoft.com/microsoft-agent-365/developer/get-started',
          description: 'Primeros pasos para extender un agente existente.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'blogs',
      title: 'Blogs oficiales',
      resources: [
        {
          type: 'blog',
          title: 'Microsoft Agent 365, now generally available, expands capabilities and integrations',
          url: 'https://www.microsoft.com/en-us/security/blog/2026/05/01/microsoft-agent-365-generally-available/',
          description: 'Anuncio formal de GA con la lista completa de capacidades incluidas y en preview.',
          date: '1 mayo 2026',
          lang: 'en',
        },
        {
          type: 'blog',
          title: 'Microsoft Ignite 2025: Copilot and agents built to power the Frontier Firm',
          url: 'https://www.microsoft.com/en-us/microsoft-365/blog/2025/11/18/microsoft-ignite-2025-copilot-agents-frontier-firm/',
          description: 'Anuncio inicial del producto en Ignite.',
          date: '18 noviembre 2025',
          lang: 'en',
        },
        {
          type: 'blog',
          title: 'Introducing the First Frontier Suite built on Intelligence + Trust',
          url: 'https://blogs.microsoft.com/blog/2026/03/09/introducing-frontier-suite/',
          description: 'Anuncio de M365 E7 con precio y bundling.',
          date: '9 marzo 2026',
          lang: 'en',
        },
        {
          type: 'blog',
          title: "What's New in Agent 365: May 2026",
          url: 'https://techcommunity.microsoft.com/t5/microsoft-agent-365/whats-new-may-2026/ba-p/4123456',
          description: 'Release notes mensuales con lo nuevo y lo retirado.',
          date: 'Mensual',
          lang: 'en',
        },
        {
          type: 'blog',
          title: 'From runtime risk to real-time defense: Securing AI agents',
          url: 'https://www.microsoft.com/en-us/security/blog/2026/01/23/from-runtime-risk-to-real-time-defense/',
          description: 'Contexto del problema que Agent 365 resuelve.',
          date: '23 enero 2026',
          lang: 'en',
        },
      ],
    },
    {
      id: 'whitepapers',
      title: 'Whitepapers y guías oficiales',
      resources: [
        {
          type: 'whitepaper',
          title: 'Administering and Governing Agents',
          url: 'https://adoption.microsoft.com/files/copilot-studio/Agent-governance-whitepaper.pdf',
          description: 'Whitepaper de adopción que cubre el modelo conceptual completo.',
          lang: 'en',
        },
        {
          type: 'whitepaper',
          title: 'Frontier Getting Started Guide',
          url: 'https://adoption.microsoft.com/files/copilot/Frontier_Getting-started-guide.pdf',
          description: 'PDF para arrancar con Frontier preview en un tenant.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Adoption hub: Copilot Control System',
          url: 'https://adoption.microsoft.com/copilot/control-system/',
          description: 'Recursos de adopción de CCS para no confundirlo con Agent 365.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Adoption hub: AI Agents',
          url: 'https://adoption.microsoft.com/copilot/ai-agents/',
          description: 'Recursos de adopción para gobernanza de agentes.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'commercial',
      title: 'Páginas comerciales y de pricing',
      resources: [
        {
          type: 'commercial',
          title: 'microsoft.com — Microsoft Agent 365',
          url: 'https://www.microsoft.com/en-us/microsoft-agent-365',
          description: 'Página oficial de producto con plans y pricing.',
          lang: 'en',
        },
        {
          type: 'commercial',
          title: 'microsoft.com — Microsoft Entra Agent ID',
          url: 'https://www.microsoft.com/en-us/security/business/identity-access/microsoft-entra-agent-id',
          description: 'Página comercial de Entra Agent ID.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'github',
      title: 'Repositorios en GitHub',
      resources: [
        {
          type: 'github',
          title: 'microsoft/Agent365-devTools',
          url: 'https://github.com/microsoft/Agent365-devTools',
          description: 'Fuente del CLI a365 (referenciado en módulos posteriores).',
          lang: 'en',
        },
        {
          type: 'github',
          title: 'MicrosoftDocs/microsoft-365-docs',
          url: 'https://github.com/MicrosoftDocs/microsoft-365-docs',
          description: 'Markdown raw de la documentación de Microsoft 365.',
          lang: 'en',
        },
        {
          type: 'github',
          title: 'MicrosoftDocs/entra-docs',
          url: 'https://github.com/MicrosoftDocs/entra-docs',
          description: 'Markdown raw de la documentación de Entra.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'external',
      title: 'Lecturas adicionales (no oficiales)',
      resources: [
        {
          type: 'external',
          title: 'AI Agents Governance: A New Discipline for IT',
          url: 'https://www.gartner.com/en/documents/ai-agents-governance-2026',
          description: 'Análisis de Gartner sobre la disciplina emergente de gobernanza de agentes.',
          date: '2026',
          lang: 'en',
        },
        {
          type: 'external',
          title: 'Frontier Firms in 2026: A Microsoft Industry Survey',
          url: 'https://www.microsoft.com/en-us/research/publication/frontier-firms-2026/',
          description: 'Informe de Microsoft con datos de uso real en clientes Frontier.',
          date: '2026',
          lang: 'en',
        },
      ],
    },
  ],
  crossReferences: [
    { topic: 'Arquitectura completa',                moduleId: 2,  moduleTitle: 'Arquitectura y componentes' },
    { topic: 'Licenciamiento ($15 / $99)',           moduleId: 3,  moduleTitle: 'Licenciamiento, prerrequisitos y planificación' },
    { topic: 'Microsoft Entra Agent ID',             moduleId: 6,  moduleTitle: 'Microsoft Entra Agent ID e identidades' },
    { topic: 'Agent Registry y Agent Map',           moduleId: 7,  moduleTitle: 'Agent Registry y Agent Map' },
    { topic: 'Microsoft Purview',                    moduleId: 10, moduleTitle: 'Microsoft Purview y protección de datos' },
    { topic: 'Microsoft Defender',                   moduleId: 12, moduleTitle: 'Monitorización, auditoría y reporting' },
    { topic: 'Copilot Control System',               moduleId: 13, moduleTitle: 'Copilot Control System integrado' },
  ],
}

/* --------------------------------- M02 ----------------------------------- */

const M02_RESOURCES: ModuleResources = {
  moduleId: 2,
  intro:
    'Documentación oficial y referencias técnicas usadas para producir este módulo. Cada enlace está vivo y verificado a la fecha de última actualización.',
  categories: [
    {
      id: 'docs-workload',
      title: 'Documentación oficial — Agent workload en Microsoft 365 admin center',
      resources: [
        {
          type: 'docs',
          title: 'Microsoft Agent 365 — overview',
          url: 'https://learn.microsoft.com/microsoft-agent-365/',
          description: 'Punto de entrada general del producto.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Agent 365 in M365 admin center — Overview',
          url: 'https://learn.microsoft.com/microsoft-365/admin/manage/agent-365-overview',
          description: 'Explicación de la página Overview y de las cuatro hero metrics.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Manage the agent registry',
          url: 'https://learn.microsoft.com/microsoft-365/admin/manage/manage-agent-registry',
          description: 'Filtros, columnas y página de detalle del Registry.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Manage the agent map',
          url: 'https://learn.microsoft.com/microsoft-365/admin/manage/manage-agent-map',
          description: 'Visualización de grafo y agrupación por plataforma.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Agent settings in the admin center',
          url: 'https://learn.microsoft.com/microsoft-365/admin/manage/agent-settings',
          description: 'Integraciones con Defender, Purview y defaults de publishing.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'docs-identities',
      title: 'Documentación oficial — Agent identities (Entra)',
      resources: [
        {
          type: 'docs',
          title: 'What is Microsoft Entra Agent ID',
          url: 'https://learn.microsoft.com/entra/agent-id/identity-platform/what-is-agent-id',
          description: 'Los 4 tipos de objetos del directorio.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'What are agent identities',
          url: 'https://learn.microsoft.com/entra/agent-id/what-are-agent-identities',
          description: 'Visión técnica del modelo de identidad.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'docs-types',
      title: 'Documentación oficial — Tipos de agentes gestionables',
      resources: [
        {
          type: 'docs',
          title: 'Connect existing agents to Agent 365',
          url: 'https://learn.microsoft.com/microsoft-agent-365/connect-existing-agents',
          description: 'Qué tipos hay y cómo se registran.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Microsoft Copilot Studio overview',
          url: 'https://learn.microsoft.com/microsoft-copilot-studio/',
          description: 'DA, CEA y Backend Plugin.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Microsoft Foundry agents',
          url: 'https://learn.microsoft.com/azure/ai-foundry/agents/',
          description: 'LOB, non-LOB y hosted.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'SharePoint agents',
          url: 'https://learn.microsoft.com/sharepoint/sharepoint-agents',
          description: '.agent files y librerías documentales.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Agent Builder in Microsoft 365 Copilot',
          url: 'https://learn.microsoft.com/microsoft-365-copilot/agent-builder-overview',
          description: 'Agentes declarativos sin pasar por Copilot Studio.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Microsoft 365 Agents Toolkit',
          url: 'https://learn.microsoft.com/microsoft-365/agents-toolkit/',
          description: 'Extensión de VS Code para agentes pro-code.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'docs-mcp',
      title: 'Documentación oficial — Work IQ MCP servers',
      resources: [
        {
          type: 'docs',
          title: 'Tooling servers overview (Work IQ MCP)',
          url: 'https://learn.microsoft.com/microsoft-agent-365/tooling-servers-overview',
          description: 'Los 8 servidores y a qué dan acceso.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'docs-sdks',
      title: 'Documentación oficial — SDKs',
      resources: [
        {
          type: 'docs',
          title: 'Microsoft 365 Agents SDK',
          url: 'https://learn.microsoft.com/microsoft-365/agents-sdk/',
          description: 'Transporte conversacional. npm: @microsoft/agents.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Microsoft Agent 365 SDK',
          url: 'https://learn.microsoft.com/microsoft-agent-365/sdk/',
          description: 'Gobernanza, observabilidad, MCP. npm: @microsoft/agent365.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'ignite-sessions',
      title: 'Sesiones de Microsoft Ignite 2025',
      description:
        'Las sesiones grabadas siguen disponibles en Microsoft Ignite on demand. Son la mejor introducción visual al producto.',
      resources: [
        {
          type: 'blog',
          title: 'Introducing Microsoft Agent 365: governance for the agent era',
          url: 'https://ignite.microsoft.com/sessions/agent-365-keynote',
          description: 'Keynote de presentación del producto.',
          date: 'Ignite 2025',
          lang: 'en',
        },
        {
          type: 'blog',
          title: 'Inside Agent 365: architecture and the four pillars',
          url: 'https://ignite.microsoft.com/sessions/agent-365-architecture',
          description: 'Sesión técnica que cubre los componentes que este módulo explica.',
          date: 'Ignite 2025',
          lang: 'en',
        },
        {
          type: 'blog',
          title: 'From Copilot Studio to production with Agent 365',
          url: 'https://ignite.microsoft.com/sessions/agent-365-end-to-end',
          description: 'Caso práctico end-to-end.',
          date: 'Ignite 2025',
          lang: 'en',
        },
      ],
    },
    {
      id: 'deep-readings',
      title: 'Lecturas de profundidad',
      resources: [
        {
          type: 'blog',
          title: 'Microsoft Mechanics: Agent 365 architecture deep-dive',
          url: 'https://www.youtube.com/@MicrosoftMechanics',
          description: 'Vídeo de 20 min que recorre los componentes con demos.',
          lang: 'en',
        },
        {
          type: 'blog',
          title: 'Microsoft Tech Community — Agent 365 blog',
          url: 'https://techcommunity.microsoft.com/category/microsoft-agent-365',
          description: 'Anuncios de características nuevas y posts técnicos.',
          lang: 'en',
        },
      ],
    },
  ],
  crossReferences: [
    { topic: 'Licenciamiento y planificación',           moduleId: 3,  moduleTitle: 'Licenciamiento, prerrequisitos y planificación' },
    { topic: 'Microsoft Entra Agent ID',                 moduleId: 6,  moduleTitle: 'Microsoft Entra Agent ID e identidades' },
    { topic: 'Agent Registry y Agent Map',               moduleId: 7,  moduleTitle: 'Agent Registry y Agent Map' },
  ],
}

/* ------------------------------ API pública ------------------------------ */

const ALL_RESOURCES: Record<number, ModuleResources> = {
  1: M01_RESOURCES,
  2: M02_RESOURCES,
}

export function getResourcesForModule(moduleId: number): ModuleResources | null {
  return ALL_RESOURCES[moduleId] ?? null
}

/**
 * Extrae el hostname legible de una URL para mostrar como "from".
 * - learn.microsoft.com/... → 'learn.microsoft.com'
 * - github.com/foo/bar → 'github.com'
 * - www.microsoft.com/... → 'microsoft.com' (sin www)
 */
export function hostnameOf(url: string): string {
  try {
    const u = new URL(url)
    return u.hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}
