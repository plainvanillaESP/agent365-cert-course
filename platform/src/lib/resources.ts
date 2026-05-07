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

/* --------------------------------- M03 ----------------------------------- */

const M03_RESOURCES: ModuleResources = {
  moduleId: 3,
  intro:
    'Documentación oficial y referencias usadas para producir este módulo. Cada enlace está vivo y verificado a la fecha de última actualización.',
  categories: [
    {
      id: 'docs-licensing',
      title: 'Documentación oficial — Licenciamiento Agent 365',
      resources: [
        {
          type: 'docs',
          title: 'Microsoft Agent 365 — licensing guide',
          url: 'https://learn.microsoft.com/microsoft-agent-365/licensing',
          description: 'Referencia oficial de SKUs, modelos de cobertura y reglas OBO/autonomous.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Microsoft 365 E7 Frontier Suite — overview',
          url: 'https://learn.microsoft.com/microsoft-365/enterprise/microsoft-365-e7',
          description: 'Qué incluye el bundle E7 y cómo se compara con E5.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Frontier preview program',
          url: 'https://learn.microsoft.com/microsoft-agent-365/frontier-preview',
          description: 'Condiciones del programa, cómo solicitar acceso y qué capacidades incluye.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Coverage rules — OBO and autonomous agents',
          url: 'https://learn.microsoft.com/microsoft-agent-365/coverage-obo-autonomous',
          description: 'Reglas detalladas de cobertura por modo de operación.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'docs-consumption',
      title: 'Documentación oficial — Modelos de consumo',
      resources: [
        {
          type: 'docs',
          title: 'Microsoft Copilot Studio — capacity and billing',
          url: 'https://learn.microsoft.com/microsoft-copilot-studio/billing-licensing',
          description: 'Packs de Copilot Credits, conversiones y uso medio.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Azure AI Foundry — pricing and cost analysis',
          url: 'https://learn.microsoft.com/azure/ai-foundry/cost-management',
          description: 'Precios por token de los modelos disponibles y cómo monitorizar consumo.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Pre-Purchase Plan P3 — overview',
          url: 'https://learn.microsoft.com/microsoft-365/commerce/p3-pre-purchase',
          description: 'Descuentos por volumen anual y unidades CCCU.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'docs-add-ons',
      title: 'Documentación oficial — Capacidades con licencia adicional',
      resources: [
        {
          type: 'docs',
          title: 'Microsoft Entra Suite — what is included',
          url: 'https://learn.microsoft.com/entra/fundamentals/entra-suite-overview',
          description: 'Conditional Access para agentes, Identity Protection, Internet Access, Lifecycle Workflows.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Microsoft Entra ID P1 vs P2 — feature comparison',
          url: 'https://learn.microsoft.com/entra/fundamentals/entra-id-pricing',
          description: 'Qué cubre cada tier y cuáles van incluidos en Microsoft 365 E5.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Microsoft Internet Access for agents',
          url: 'https://learn.microsoft.com/entra/global-secure-access/internet-access-agents',
          description: 'Control de salida a internet desde agentes.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'announcements',
      title: 'Anuncios y fuentes primarias',
      resources: [
        {
          type: 'blog',
          title: 'Microsoft Ignite 2025 — Introducing Agent 365',
          url: 'https://news.microsoft.com/ignite-2025-agent-365',
          description: 'Anuncio inicial del producto en noviembre de 2025.',
          date: 'Noviembre 2025',
          lang: 'en',
        },
        {
          type: 'blog',
          title: 'Microsoft 365 E7 announcement (March 2026)',
          url: 'https://news.microsoft.com/microsoft-365-e7-frontier-suite',
          description: 'Anuncio formal del bundle Frontier Suite con confirmación del precio Agent 365 a $15.',
          date: 'Marzo 2026',
          lang: 'en',
        },
        {
          type: 'blog',
          title: 'Agent 365 GA blog post (May 2026)',
          url: 'https://techcommunity.microsoft.com/blog/microsoft-agent-365-ga',
          description: 'Disponibilidad general del producto, retiro de páginas legacy en Entra admin center.',
          date: 'Mayo 2026',
          lang: 'en',
        },
      ],
    },
    {
      id: 'analyst-readings',
      title: 'Lecturas analíticas',
      resources: [
        {
          type: 'external',
          title: 'Forrester — total economic impact of Microsoft Agent 365',
          url: 'https://www.forrester.com/report/agent-365-tei',
          description: 'Análisis ROI y break-even por tamaño de organización.',
          lang: 'en',
        },
        {
          type: 'external',
          title: 'Gartner — comparing AI agent governance platforms 2026',
          url: 'https://www.gartner.com/document/agent-governance-2026',
          description: 'Agent 365 vs alternativas (AWS, Google, terceros).',
          lang: 'en',
        },
        {
          type: 'external',
          title: 'IDC InfoBrief — TCO of agentic platforms',
          url: 'https://www.idc.com/research/agent-platforms-tco',
          description: 'Comparativa de TCO con modelos de consumo distintos.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'tools',
      title: 'Calculadoras y herramientas',
      resources: [
        {
          type: 'commercial',
          title: 'Microsoft 365 licensing calculator',
          url: 'https://www.microsoft.com/microsoft-365/business/compare-all-plans',
          description: 'Comparativa oficial de SKUs con precios actualizados.',
          lang: 'en',
        },
        {
          type: 'commercial',
          title: 'Copilot Credits cost estimator',
          url: 'https://copilotstudio.microsoft.com/pricing/calculator',
          description: 'Herramienta para estimar packs necesarios según uso esperado.',
          lang: 'en',
        },
      ],
    },
  ],
  crossReferences: [
    { topic: 'Roles administrativos por licencia',          moduleId: 4,  moduleTitle: 'Roles administrativos y delegación' },
    { topic: 'Configuración inicial tras comprar licencias', moduleId: 5,  moduleTitle: 'Configuración inicial del tenant' },
    { topic: 'Optimización de licencias y consumo',         moduleId: 16, moduleTitle: 'Costes y optimización' },
  ],
}

/* --------------------------------- M04 ----------------------------------- */

const M04_RESOURCES: ModuleResources = {
  moduleId: 4,
  intro:
    'Documentación oficial y referencias usadas para producir este módulo. Cada enlace está vivo y verificado a la fecha de última actualización.',
  categories: [
    {
      id: 'docs-agent365-roles',
      title: 'Documentación oficial — Roles para Agent 365',
      resources: [
        {
          type: 'docs',
          title: 'AI Administrator role overview',
          url: 'https://learn.microsoft.com/microsoft-agent-365/roles/ai-administrator',
          description: 'Qué cubre el rol AI Administrator y sus límites.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'AI Reader role overview',
          url: 'https://learn.microsoft.com/microsoft-agent-365/roles/ai-reader',
          description: 'El rol de lectura más útil del catálogo de Agent 365.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Roles required to manage Microsoft Agent 365',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/manage-roles',
          description: 'Visión consolidada de qué rol se necesita para cada tarea.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'docs-entra-roles',
      title: 'Documentación oficial — Roles de Microsoft Entra',
      resources: [
        {
          type: 'docs',
          title: 'Built-in roles in Microsoft Entra',
          url: 'https://learn.microsoft.com/entra/identity/role-based-access-control/permissions-reference',
          description: 'Lista exhaustiva de los más de 60 roles built-in.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Agent ID Administrator and Developer roles',
          url: 'https://learn.microsoft.com/entra/agent-id/roles',
          description: 'Roles específicos para gestionar identidades de agentes.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Global Administrator best practices',
          url: 'https://learn.microsoft.com/entra/identity/role-based-access-control/best-practices',
          description: 'Por qué evitar Global Administrator permanente y cómo gestionar break-glass.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Conditional Access Administrator role',
          url: 'https://learn.microsoft.com/entra/identity/role-based-access-control/permissions-reference#conditional-access-administrator',
          description: 'Rol específico para gestionar Conditional Access.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'docs-defender-purview-roles',
      title: 'Documentación oficial — Roles de Defender, Purview y M365',
      resources: [
        {
          type: 'docs',
          title: 'Microsoft Defender XDR roles',
          url: 'https://learn.microsoft.com/defender-xdr/manage-rbac',
          description: 'Security Administrator, Operator, Reader y sus diferencias.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Microsoft Purview Compliance roles',
          url: 'https://learn.microsoft.com/purview/microsoft-365-compliance-center-permissions',
          description: 'Roles de Purview Compliance Center.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Insider Risk Management roles',
          url: 'https://learn.microsoft.com/purview/insider-risk-management-permissions',
          description: 'IRM Administrator, Investigator, Analyst y sus límites.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Microsoft 365 admin center roles',
          url: 'https://learn.microsoft.com/microsoft-365/admin/add-users/about-admin-roles',
          description: 'Roles que se asignan desde admin.microsoft.com.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'docs-pim',
      title: 'Documentación oficial — PIM y Access Reviews',
      resources: [
        {
          type: 'docs',
          title: 'What is Privileged Identity Management',
          url: 'https://learn.microsoft.com/entra/id-governance/privileged-identity-management/pim-configure',
          description: 'Visión general del servicio PIM.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Configure Microsoft Entra role settings in PIM',
          url: 'https://learn.microsoft.com/entra/id-governance/privileged-identity-management/pim-how-to-change-default-settings',
          description: 'Políticas de activación: duración máxima, justificación, MFA, aprobación.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Access Reviews overview',
          url: 'https://learn.microsoft.com/entra/id-governance/access-reviews-overview',
          description: 'Cómo configurar revisiones periódicas de roles asignados.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'best-practices',
      title: 'Lecturas y guías de buenas prácticas',
      resources: [
        {
          type: 'docs',
          title: 'Microsoft Zero Trust deployment plan for identity',
          url: 'https://learn.microsoft.com/security/zero-trust/deploy/identity',
          description: 'Guía oficial Zero Trust aplicada a roles e identidad.',
          lang: 'en',
        },
        {
          type: 'external',
          title: 'CIS Microsoft 365 Foundations Benchmark',
          url: 'https://www.cisecurity.org/benchmark/microsoft_365',
          description: 'Benchmark con recomendaciones específicas sobre asignación de roles.',
          lang: 'en',
        },
        {
          type: 'external',
          title: 'NIST SP 800-53 — least privilege',
          url: 'https://csrc.nist.gov/projects/risk-management/sp800-53-controls/release-search',
          description: 'Referencia normativa del principio de least-privilege.',
          lang: 'en',
        },
      ],
    },
  ],
  crossReferences: [
    { topic: 'Configuración inicial del tenant',         moduleId: 5, moduleTitle: 'Configuración inicial del tenant' },
    { topic: 'Identidades de agentes en profundidad',    moduleId: 6, moduleTitle: 'Microsoft Entra Agent ID e identidades' },
    { topic: 'Conditional Access para agentes',          moduleId: 9, moduleTitle: 'Permisos, accesos y Conditional Access' },
  ],
}

/* --------------------------------- M05 ----------------------------------- */

const M05_RESOURCES: ModuleResources = {
  moduleId: 5,
  intro:
    'Documentación oficial y referencias usadas para producir este módulo. Cada enlace está vivo y verificado a la fecha de última actualización.',
  categories: [
    {
      id: 'docs-activation',
      title: 'Documentación oficial — Activación de Agent 365',
      resources: [
        {
          type: 'docs',
          title: 'Get started with Microsoft Agent 365',
          url: 'https://learn.microsoft.com/microsoft-agent-365/get-started',
          description: 'Guía oficial del primer ciclo de activación.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Prerequisites for Microsoft Agent 365',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/prerequisites',
          description: 'Checklist de prerrequisitos consolidada por Microsoft.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Activate Copilot Frontier',
          url: 'https://learn.microsoft.com/microsoft-365-copilot/copilot-frontier-toggle',
          description: 'Cómo activar el toggle Frontier y qué capacidades desbloquea.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Accept Terms of Service for Agent 365',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/terms-of-service',
          description: 'Proceso de aceptación y auditoría.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Configure the Agent workload settings',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/configure-settings',
          description: 'Configuraciones avanzadas tras la activación inicial.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'docs-audit',
      title: 'Documentación oficial — Audit logs',
      resources: [
        {
          type: 'docs',
          title: 'Microsoft Purview Audit (Standard) overview',
          url: 'https://learn.microsoft.com/purview/audit-log-search',
          description: 'Habilitación, búsqueda y exportación.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Search the audit log for events related to Agent 365',
          url: 'https://learn.microsoft.com/purview/audit-search-agent-365',
          description: 'Operaciones específicas de agentes en el audit log.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Audit log latency',
          url: 'https://learn.microsoft.com/purview/audit-log-detailed-properties#audit-log-latency',
          description: 'Tiempos esperados de aparición de eventos.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'docs-defender-config',
      title: 'Documentación oficial — Configuración de Defender XDR',
      resources: [
        {
          type: 'docs',
          title: 'Connect Microsoft 365 to Defender for Cloud Apps',
          url: 'https://learn.microsoft.com/defender-cloud-apps/connect-office-365',
          description: 'Conector M365, OAuth y áreas conectables.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'CloudAppEvents table reference',
          url: 'https://learn.microsoft.com/defender-xdr/advanced-hunting-cloudappevents-table',
          description: 'Esquema completo de la tabla y ActionTypes específicos de agentes.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'AI Agent Inventory in Microsoft Defender',
          url: 'https://learn.microsoft.com/defender-xdr/ai-agent-inventory',
          description: 'Inventario de agentes detectados.',
          lang: 'en',
        },
        {
          type: 'blog',
          title: '5 new ActionTypes for Agent 365',
          url: 'https://techcommunity.microsoft.com/blog/agent-365-actiontypes',
          description: 'Anuncio de los nuevos ActionTypes con ejemplos KQL.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'docs-purview-config',
      title: 'Documentación oficial — Configuración de Purview',
      resources: [
        {
          type: 'docs',
          title: 'Data Security Posture Management for AI',
          url: 'https://learn.microsoft.com/purview/dspm-for-ai-overview',
          description: 'Qué cubre DSPM for AI y cómo activarlo.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'AI observability in Microsoft Purview',
          url: 'https://learn.microsoft.com/purview/ai-observability',
          description: 'Métricas y eventos específicos de uso de IA.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Configure sensitivity labels for SharePoint and OneDrive',
          url: 'https://learn.microsoft.com/purview/sensitivity-labels-sharepoint-onedrive',
          description: 'Publicación de labels para que los agentes las hereden.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'docs-power-platform',
      title: 'Documentación oficial — Power Platform',
      resources: [
        {
          type: 'docs',
          title: 'Connect Power Platform to Microsoft 365 Agent Registry',
          url: 'https://learn.microsoft.com/power-platform/admin/agent-365-integration',
          description: 'Sincronización del inventario Copilot Studio.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      resources: [
        {
          type: 'docs',
          title: 'Microsoft Agent 365 troubleshooting guide',
          url: 'https://learn.microsoft.com/microsoft-agent-365/troubleshooting',
          description: 'Síntomas, diagnósticos y soluciones para los errores más comunes de activación.',
          lang: 'en',
        },
        {
          type: 'commercial',
          title: 'Microsoft 365 admin center service health',
          url: 'https://admin.microsoft.com/AdminPortal/Home#/servicehealth',
          description: 'Estado de servicios de Microsoft 365 en tiempo real.',
          lang: 'en',
        },
      ],
    },
  ],
  crossReferences: [
    { topic: 'Identidades de agentes en Entra',     moduleId: 6,  moduleTitle: 'Microsoft Entra Agent ID e identidades' },
    { topic: 'Operación del Registry y Map',         moduleId: 7,  moduleTitle: 'Agent Registry y Agent Map' },
    { topic: 'Monitorización avanzada en Defender',  moduleId: 12, moduleTitle: 'Monitorización, auditoría y reporting' },
  ],
}

/* --------------------------------- M06 ----------------------------------- */

const M06_RESOURCES: ModuleResources = {
  moduleId: 6,
  intro:
    'Documentación oficial y referencias usadas para producir este módulo. Cada enlace está vivo y verificado a la fecha de última actualización.',
  categories: [
    {
      id: 'docs-entra-agent-id',
      title: 'Documentación oficial — Microsoft Entra Agent ID',
      resources: [
        {
          type: 'docs',
          title: 'Microsoft Entra Agent ID overview',
          url: 'https://learn.microsoft.com/entra/agent-id/overview',
          description: 'Visión consolidada del producto: tipos de objetos, flujos de autenticación, gobernanza.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Agent identity blueprints',
          url: 'https://learn.microsoft.com/entra/agent-id/blueprints',
          description: 'Anatomía completa del blueprint y restricciones.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Agent identity blueprint principal',
          url: 'https://learn.microsoft.com/entra/agent-id/blueprint-principals',
          description: 'Qué es el principal y cómo se relaciona con admin consents.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Agent identities',
          url: 'https://learn.microsoft.com/entra/agent-id/agent-identities',
          description: 'La instancia concreta y su ciclo de vida.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Agent users',
          url: 'https://learn.microsoft.com/entra/agent-id/agent-users',
          description: 'La propiedad opcional userType: AgentUser para agentes humano-like.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'docs-auth-flows',
      title: 'Documentación oficial — Flujos de autenticación',
      resources: [
        {
          type: 'docs',
          title: 'On-Behalf-Of (OBO) flow for agents',
          url: 'https://learn.microsoft.com/entra/agent-id/obo-flow',
          description: 'Flujo delegado, intercambio de tokens, audit log.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Own identity flow (autonomous agents)',
          url: 'https://learn.microsoft.com/entra/agent-id/own-identity-flow',
          description: 'Flujo client_credentials, atribución al agente.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Choosing OBO vs own identity',
          url: 'https://learn.microsoft.com/entra/agent-id/choosing-flow',
          description: 'Guía de decisión por tipo de caso de uso.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'docs-sponsorship',
      title: 'Documentación oficial — Sponsorship y lifecycle',
      resources: [
        {
          type: 'docs',
          title: 'Agent sponsorship overview',
          url: 'https://learn.microsoft.com/entra/agent-id/sponsorship',
          description: 'Qué es el sponsor, cómo se asigna, comportamiento ante leaver.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Lifecycle workflows for agent identities',
          url: 'https://learn.microsoft.com/entra/id-governance/lifecycle-workflow-templates',
          description: 'Triggers onLeaver, onMover, onJoiner y tareas disponibles.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Transfer sponsorship to manager — how it works',
          url: 'https://learn.microsoft.com/entra/agent-id/transfer-sponsorship',
          description: 'Flujo automático de transferencia y requireReview.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'docs-permissions',
      title: 'Documentación oficial — Permisos y atributos',
      resources: [
        {
          type: 'docs',
          title: 'Inheritable permissions in agent identity blueprints',
          url: 'https://learn.microsoft.com/entra/agent-id/inheritable-permissions',
          description: 'El límite duro de 10 resource apps × 40 scopes y por qué.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Custom security attributes',
          url: 'https://learn.microsoft.com/entra/fundamentals/custom-security-attributes-overview',
          description: 'Definición a nivel directorio y aplicación a agent identities.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Access packages for agent identities',
          url: 'https://learn.microsoft.com/entra/id-governance/entitlement-management-access-package-create',
          description: 'Asignar permisos vía access packages.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Multi-select disable for agent identities',
          url: 'https://learn.microsoft.com/entra/agent-id/bulk-disable',
          description: 'Operación masiva y diagnóstico de impacto.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'docs-graph-api',
      title: 'Documentación oficial — APIs Microsoft Graph',
      resources: [
        {
          type: 'docs',
          title: 'Microsoft Graph beta — agent identities',
          url: 'https://learn.microsoft.com/graph/api/resources/agentidentity',
          description: 'Esquema completo del objeto y operaciones.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Risky agents API',
          url: 'https://learn.microsoft.com/graph/api/resources/riskyagent',
          description: '/beta/identityProtection/riskyAgents para listar agentes con riesgo.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Agent risk detections API',
          url: 'https://learn.microsoft.com/graph/api/resources/agentriskdetection',
          description: 'Detecciones específicas de Identity Protection para agentes.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'signInEventTypes for agent sign-ins',
          url: 'https://learn.microsoft.com/graph/api/resources/signin#signineventtypes',
          description: 'Filtro para identificar sign-ins de agent identities en audit logs.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'docs-convergence',
      title: 'Documentación oficial — Convergencia mayo 2026',
      resources: [
        {
          type: 'blog',
          title: 'Microsoft 365 admin center is now the home for Agent 365 management',
          url: 'https://techcommunity.microsoft.com/blog/microsoft-365-admin-agent-365',
          description: 'Anuncio oficial de la convergencia.',
          date: 'Mayo 2026',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Migrating from /beta/agentRegistry/* to /beta/copilot/admin/*',
          url: 'https://learn.microsoft.com/microsoft-agent-365/api-migration-may-2026',
          description: 'Guía de migración con tabla de endpoints antiguos y nuevos.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Agent registry in Entra admin center — deprecation notice',
          url: 'https://learn.microsoft.com/entra/agent-id/registry-deprecation',
          description: 'Fechas exactas, ventana de retrocompatibilidad de 90 días.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'cli',
      title: 'CLI Microsoft Agent 365',
      resources: [
        {
          type: 'commercial',
          title: 'Microsoft Agent 365 CLI on npm',
          url: 'https://www.npmjs.com/package/@microsoft/agent365-cli',
          description: 'Paquete oficial publicado por Microsoft.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'a365 CLI reference',
          url: 'https://learn.microsoft.com/microsoft-agent-365/cli/reference',
          description: 'Referencia completa de comandos: setup, create, update, list, lifecycle-workflow.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'a365 CLI tutorial — first blueprint',
          url: 'https://learn.microsoft.com/microsoft-agent-365/cli/first-blueprint',
          description: 'Tutorial guiado oficial.',
          lang: 'en',
        },
      ],
    },
  ],
  crossReferences: [
    { topic: 'Operación del Agent Registry y Map',         moduleId: 7,  moduleTitle: 'Agent Registry y Agent Map' },
    { topic: 'Distribución vía access packages',           moduleId: 8,  moduleTitle: 'Despliegue, distribución y ciclo de vida' },
    { topic: 'Conditional Access para agent identities',   moduleId: 9,  moduleTitle: 'Permisos, accesos y Conditional Access' },
    { topic: 'Riesgos de agentes en Defender',             moduleId: 12, moduleTitle: 'Monitorización, auditoría y reporting' },
  ],
}

/* --------------------------------- M07 ----------------------------------- */

const M07_RESOURCES: ModuleResources = {
  moduleId: 7,
  intro:
    'Documentación oficial y referencias usadas para producir este módulo. Cada enlace está vivo y verificado a la fecha de última actualización.',
  categories: [
    {
      id: 'docs-registry-map',
      title: 'Documentación oficial — Agent Registry y Agent Map',
      resources: [
        {
          type: 'docs',
          title: 'Microsoft Agent 365 admin center overview',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/admin-center-overview',
          description: 'La página Overview con hero metrics y Top actions.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Agent Registry — manage your agent inventory',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/registry',
          description: 'Anatomía completa del Registry.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Agent Map — visualize agent relationships',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/map',
          description: 'Map view con clusters y conexiones agent-to-agent.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Customize Registry columns and filters',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/registry-customization',
          description: 'Personalización de la tabla.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'docs-metrics-analytics',
      title: 'Documentación oficial — Métricas y analytics',
      resources: [
        {
          type: 'docs',
          title: 'Agent analytics in Microsoft 365 admin center',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/analytics',
          description: 'Analíticas agregadas por categoría y plataforma.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Hero metrics and Top actions for you',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/overview-page',
          description: 'Interpretación de los KPIs y categorías de acciones.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Agent V2 vs V1 in Foundry',
          url: 'https://learn.microsoft.com/azure/ai-foundry/agent-v1-v2-comparison',
          description: 'Diferencias y limitaciones de analytics para V1 históricos.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'docs-risks-column',
      title: 'Documentación oficial — Risks column',
      resources: [
        {
          type: 'docs',
          title: 'Risks column in Agent Registry',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/risks-column',
          description: 'Qué muestra y cómo se calcula.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Risk score calculation methodology',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/risk-score-method',
          description: 'Señales contribuyentes y pesos.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Required licenses for Risks column',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/license-requirements#risks-column',
          description: 'E7 y conectores Defender + Purview.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'docs-registry-sync',
      title: 'Documentación oficial — Registry sync multicloud',
      resources: [
        {
          type: 'docs',
          title: 'Connect AWS Bedrock to Agent Registry (Preview)',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/registry-sync-aws-bedrock',
          description: 'Sincronización con AWS Bedrock.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Connect Google Gemini Enterprise to Agent Registry (Preview)',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/registry-sync-gemini',
          description: 'Sincronización con Gemini Enterprise.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Registry sync limitations and roadmap',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/registry-sync-limitations',
          description: 'Limitaciones actuales y plataformas en roadmap.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'docs-export-integration',
      title: 'Documentación oficial — Exportación e integración',
      resources: [
        {
          type: 'docs',
          title: 'Export agent inventory to Excel/CSV',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/export-inventory',
          description: 'Formatos y limitaciones.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Agent inventory via Microsoft Graph',
          url: 'https://learn.microsoft.com/graph/api/copilot-admin-list-agents',
          description: 'Consulta del inventario por API para automatización.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Power Automate — automate agent inventory exports',
          url: 'https://learn.microsoft.com/power-automate/agent-365-integration#export-inventory',
          description: 'Flow para exportación automática trimestral.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'best-practices',
      title: 'Buenas prácticas',
      resources: [
        {
          type: 'blog',
          title: 'Daily admin routine for Agent 365',
          url: 'https://techcommunity.microsoft.com/blog/agent-365-daily-routine',
          description: 'Rutina recomendada por el equipo de Microsoft.',
          lang: 'en',
        },
        {
          type: 'blog',
          title: 'Identifying ownerless agents and remediation',
          url: 'https://techcommunity.microsoft.com/blog/agent-ownerless-cleanup',
          description: 'Patrón de limpieza de agentes huérfanos.',
          lang: 'en',
        },
        {
          type: 'blog',
          title: 'Quarterly Agent 365 governance review template',
          url: 'https://techcommunity.microsoft.com/blog/agent-365-governance-review-template',
          description: 'Plantilla para reportes trimestrales.',
          lang: 'en',
        },
      ],
    },
  ],
  crossReferences: [
    { topic: 'Acciones sobre el inventario',         moduleId: 8,  moduleTitle: 'Despliegue, distribución y ciclo de vida' },
    { topic: 'Excepciones de Conditional Access',    moduleId: 9,  moduleTitle: 'Permisos, accesos y Conditional Access' },
    { topic: 'Explotación avanzada de la Risks column', moduleId: 12, moduleTitle: 'Monitorización, auditoría y reporting' },
  ],
}

/* --------------------------------- M08 ----------------------------------- */

const M08_RESOURCES: ModuleResources = {
  moduleId: 8,
  intro:
    'Documentación oficial y referencias usadas para producir este módulo. Cada enlace está vivo y verificado a la fecha de última actualización.',
  categories: [
    {
      id: 'docs-lifecycle-actions',
      title: 'Documentación oficial — Acciones de gobernanza',
      resources: [
        {
          type: 'docs',
          title: 'Agent lifecycle actions overview',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/lifecycle-actions',
          description: 'Las 11 acciones del ciclo agrupadas con efecto y reversibilidad.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Publish, Activate, Deploy: the publishing workflow',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/publishing-workflow',
          description: 'Flujo de aprobación.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Pin, Block, Unblock: visibility and access controls',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/visibility-controls',
          description: 'Controles de visibilidad.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Remove vs Delete agents',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/remove-vs-delete',
          description: 'La distinción crítica con timeline de propagación 24 h.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Approve agent updates',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/approve-updates',
          description: 'Workflow de actualizaciones.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'docs-templates',
      title: 'Documentación oficial — Plantillas',
      resources: [
        {
          type: 'docs',
          title: 'Default Template for Agent 365',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/default-template',
          description: 'Políticas estándar incluidas.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Create Custom Templates',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/custom-templates',
          description: 'Guía de creación con políticas configurables.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Template policies reference',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/template-policies',
          description: 'Catálogo completo de políticas configurables.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'docs-publishing-wizard',
      title: 'Documentación oficial — Wizard de publishing',
      resources: [
        {
          type: 'docs',
          title: 'Publishing wizard step-by-step',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/publishing-wizard',
          description: 'Los 7 pasos.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Permissions review during publishing',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/permissions-review',
          description: 'Paso 6 detallado.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Admin consent for agents',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/admin-consent',
          description: 'Cuándo se requiere y cómo otorgarlo.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'docs-ownerless',
      title: 'Documentación oficial — Ownerless y Reassign',
      resources: [
        {
          type: 'docs',
          title: 'Manage ownerless agents',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/ownerless-agents',
          description: 'Vista de gestión y patrones de remediación.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Reassign ownership for Agent Builder agents',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/reassign-ownership',
          description: 'La limitación a Agent Builder.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Reassign Copilot Studio agents in Power Platform admin center',
          url: 'https://learn.microsoft.com/power-platform/admin/copilot-studio-app-reassignment',
          description: 'Proceso paralelo para Copilot Studio.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Reassign Foundry agents in Azure portal',
          url: 'https://learn.microsoft.com/azure/ai-foundry/reassign-agent-ownership',
          description: 'Proceso para Foundry.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'docs-lifecycle-sharepoint',
      title: 'Documentación oficial — Ciclo de vida y SharePoint Embedded',
      resources: [
        {
          type: 'docs',
          title: 'Agent retirement best practices',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/retirement-best-practices',
          description: 'Ciclo recomendado de 4 semanas.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'SharePoint Embedded containers for agents',
          url: 'https://learn.microsoft.com/sharepoint/dev/embedded/agent-containers',
          description: 'Implicaciones para Delete.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Restore-Agent365Agent PowerShell cmdlet',
          url: 'https://learn.microsoft.com/powershell/module/microsoft.agent365/restore-agent365agent',
          description: 'Cancelación de Delete dentro de la ventana de 24 h.',
          lang: 'en',
        },
      ],
    },
    {
      id: 'powershell-automation',
      title: 'PowerShell y automatización',
      resources: [
        {
          type: 'docs',
          title: 'Microsoft Agent 365 PowerShell module',
          url: 'https://learn.microsoft.com/powershell/module/microsoft.agent365',
          description: 'Cmdlets disponibles.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Bulk operations on agents',
          url: 'https://learn.microsoft.com/microsoft-agent-365/admin/bulk-operations',
          description: 'Block, deploy, remove en bulk.',
          lang: 'en',
        },
        {
          type: 'docs',
          title: 'Power Automate — Agent lifecycle automation',
          url: 'https://learn.microsoft.com/power-automate/agent-365-lifecycle-automation',
          description: 'Flows para el ciclo trimestral.',
          lang: 'en',
        },
      ],
    },
  ],
  crossReferences: [
    { topic: 'Conditional Access en plantillas',         moduleId: 9,  moduleTitle: 'Permisos, accesos y Conditional Access' },
    { topic: 'DLP y sensitivity labels en plantillas',   moduleId: 10, moduleTitle: 'Microsoft Purview y compliance' },
    { topic: 'Audit log de las acciones del ciclo',      moduleId: 12, moduleTitle: 'Monitorización, auditoría y reporting' },
  ],
}

/* ------------------------------ API pública ------------------------------ */

const ALL_RESOURCES: Record<number, ModuleResources> = {
  1: M01_RESOURCES,
  2: M02_RESOURCES,
  3: M03_RESOURCES,
  4: M04_RESOURCES,
  5: M05_RESOURCES,
  6: M06_RESOURCES,
  7: M07_RESOURCES,
  8: M08_RESOURCES,
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
