import { PortfolioCard, CapabilityItem, MethodologyStep, CreedItem } from '../types';

export const HERO_QUERIES = [
  "Build a modern business website",
  "Launch my online store",
  "Create an AI agent for my business",
  "Automate my customer support",
  "Improve my website SEO",
  "Build a custom web application",
  "Automate my business workflow",
  "Connect my business systems"
];

export const PORTFOLIO_CARDS: PortfolioCard[] = [
  {
    id: 'media-pipeline',
    index: 0,
    title: 'Media Pipeline',
    subtitle: 'High-throughput asset processing & responsive video delivery system',
    category: 'Media Architecture',
    bgColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    textColor: '#1E3A8A',
    subtextColor: '#3B82F6',
    tags: ['Web Video', 'Asset CDN', 'Realtime Processing']
  },
  {
    id: 'editorial-engine',
    index: 1,
    title: 'Editorial Engine',
    subtitle: 'Dynamic content publishing platform & structured layout architecture',
    category: 'Publishing Platform',
    bgColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    textColor: '#14532D',
    subtextColor: '#16A34A',
    tags: ['Next-Gen CMS', 'SEO Optimization', 'Dynamic Routing']
  },
  {
    id: 'knowledge-retrieval',
    index: 2,
    title: 'Knowledge Base',
    subtitle: 'Vector-indexed search architecture & reference catalog interface',
    category: 'Information Architecture',
    bgColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    textColor: '#0F172A',
    subtextColor: '#64748B',
    tags: ['Semantic Search', 'Indexed Storage', 'Interactive Graph']
  },
  {
    id: 'intelligence-suite',
    index: 3,
    title: 'Market Intelligence',
    subtitle: 'Data aggregation framework & competitive dashboard architecture',
    category: 'Analytics Platform',
    bgColor: '#FEF2F2',
    borderColor: '#FECACA',
    textColor: '#7F1D1D',
    subtextColor: '#DC2626',
    tags: ['Realtime Telemetry', 'Multi-Source Aggregation', 'Visual Analytics']
  },
  {
    id: 'topology-interface',
    index: 4,
    title: 'Spatial Topology',
    subtitle: 'Infrastructure mapping platform & hierarchical systems visualization',
    category: 'Spatial Systems',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    textColor: '#78350F',
    subtextColor: '#D97706',
    tags: ['Interactive Map', 'Node Clustering', 'Performance Metrics']
  }
];

export const CAPABILITIES: CapabilityItem[] = [
  {
    number: '01',
    category: 'BUILD',
    title: 'Websites & Custom Software',
    description: 'Bespoke web development, enterprise web applications, and custom digital software engineered for high performance, accessibility, and modern scale.',
    services: [
      'Web Development',
      'Business Websites',
      'Web Applications',
      'E-commerce',
      'Custom Software',
      'Digital Products',
      'AI-powered Web Solutions'
    ]
  },
  {
    number: '02',
    category: 'GROW',
    title: 'Growth & Digital Presence',
    description: 'Organic search optimization, strategic digital marketing, high-impact multimedia, and cohesive brand design systems to expand market reach.',
    services: [
      'SEO',
      'Digital Marketing',
      'Graphic Design',
      'Content Creation',
      'Video Editing',
      'Brand and Marketing Assets'
    ]
  },
  {
    number: '03',
    category: 'AUTOMATE',
    title: 'AI Agents & Workflow Automation',
    description: 'Autonomous conversational AI agents, multi-system workflow automation, continuous business process orchestration, and bidirectional API integrations.',
    services: [
      'AI Agents',
      'AI Automation',
      'Workflow Automation',
      'Business Process Automation',
      'AI Customer Support',
      'Lead Automation',
      'API Integrations',
      'Custom Business Automation'
    ]
  }
];

export const METHODOLOGY_STEPS: MethodologyStep[] = [
  {
    number: '01',
    title: 'Discover',
    description: 'Requirements analysis, technical feasibility audit, system architecture planning, and scope definition.',
    deliverable: 'Scope & Architecture Audit'
  },
  {
    number: '02',
    title: 'Design',
    description: 'Interface design, information architecture, interaction prototypes, and ergonomic user experience.',
    deliverable: 'Design System & Interactive Prototypes'
  },
  {
    number: '03',
    title: 'Engineer',
    description: 'Full-stack development, API connections, workflow automation, and rigorous testing.',
    deliverable: 'Production-Ready Codebase'
  },
  {
    number: '04',
    title: 'Deploy',
    description: 'Secure production deployment, performance optimization, monitoring, and ongoing support.',
    deliverable: 'Deployment & Continuous Optimization'
  }
];

export const CREED_ITEMS: CreedItem[] = [
  {
    word: 'Build.',
    pillar: 'BUILD',
    description: 'Engineering resilient, fast, and accessible digital products, websites, and custom software architectures from first principles.'
  },
  {
    word: 'Grow.',
    pillar: 'GROW',
    description: 'Expanding reach and audience engagement through technical search optimization, digital strategy, and high-impact brand creative.'
  },
  {
    word: 'Automate.',
    pillar: 'AUTOMATE',
    description: 'Streamlining operational bottlenecks through intelligent AI agents, API integrations, and continuous business workflow execution.'
  }
];
