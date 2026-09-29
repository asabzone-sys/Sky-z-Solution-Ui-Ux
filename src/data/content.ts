import { CapabilityItem, MethodologyStep, CreedItem } from '../types';

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

export const CAPABILITIES: CapabilityItem[] = [
  {
    number: '01',
    category: 'BUILD',
    title: 'Websites & Digital Stores',
    description: 'Modern websites and online storefronts designed to perform smoothly and convert visitors into customers.',
    services: [
      'Web Development',
      'E-commerce'
    ]
  },
  {
    number: '02',
    category: 'GROW',
    title: 'Search, Marketing & Design',
    description: 'Targeted organic search, conversion campaigns, and distinct visual design that make your business recognizable.',
    services: [
      'SEO',
      'Digital Marketing',
      'Graphic Design'
    ]
  },
  {
    number: '03',
    category: 'AUTOMATE',
    title: 'AI Workflows & Smart Systems',
    description: 'Practical AI automation and system integrations that handle repetitive tasks and save valuable hours.',
    services: [
      'AI Automation'
    ]
  }
];

export interface OfficialService {
  id: string;
  name: string;
  pillar: 'BUILD' | 'GROW' | 'AUTOMATE';
  pillarNumber: string;
  tagline: string;
  sentence: string;
  accent: string;
  bgClass: string;
  borderClass: string;
  badge: string;
  microLabels: string[];
}

export const OFFICIAL_SERVICES: OfficialService[] = [
  {
    id: 'web-development',
    name: 'Web Development',
    pillar: 'BUILD',
    pillarNumber: '01',
    tagline: 'Fast, responsive web solutions',
    sentence: 'Websites and web applications built around real business needs.',
    accent: '#7C4DE0',
    bgClass: 'bg-violet-500/10 text-violet-600 dark:text-violet-300',
    borderClass: 'border-violet-500/20',
    badge: 'WEB // INTERFACE',
    microLabels: ['BUILD', 'LAYOUT', 'CODE', 'DEPLOY']
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    pillar: 'BUILD',
    pillarNumber: '01',
    tagline: 'Digital storefronts built to convert',
    sentence: 'Digital storefronts designed to sell and scale.',
    accent: '#6D3FD4',
    bgClass: 'bg-violet-600/10 text-violet-700 dark:text-violet-300',
    borderClass: 'border-violet-600/20',
    badge: 'STORE // CHECKOUT',
    microLabels: ['STORE', 'TRANSACT', 'FLOW', 'SCALE']
  },
  {
    id: 'seo',
    name: 'SEO',
    pillar: 'GROW',
    pillarNumber: '02',
    tagline: 'High-ranking search visibility',
    sentence: 'Search visibility built around useful content and strong foundations.',
    accent: '#9F7AEA',
    bgClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-300',
    borderClass: 'border-purple-500/20',
    badge: 'SEARCH // VISIBILITY',
    microLabels: ['SEARCH', 'OPTIMIZE', 'INDEX', 'DISCOVER']
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    pillar: 'GROW',
    pillarNumber: '02',
    tagline: 'Targeted customer acquisition',
    sentence: 'Digital campaigns designed to reach the right audience.',
    accent: '#8B5CF6',
    bgClass: 'bg-purple-600/10 text-purple-700 dark:text-purple-300',
    borderClass: 'border-purple-600/20',
    badge: 'CAMPAIGN // AUDIENCE',
    microLabels: ['CAMPAIGN', 'AUDIENCE', 'ENGAGE', 'REACH']
  },
  {
    id: 'graphic-design',
    name: 'Graphic Design',
    pillar: 'GROW',
    pillarNumber: '02',
    tagline: 'Recognizable visual identity',
    sentence: 'Visual assets and brand design that make businesses recognizable.',
    accent: '#A78BFA',
    bgClass: 'bg-violet-400/10 text-violet-600 dark:text-violet-300',
    borderClass: 'border-violet-400/20',
    badge: 'BRAND // VECTOR',
    microLabels: ['DESIGN', 'SHAPE', 'BRAND', 'CREATE']
  },
  {
    id: 'ai-automation',
    name: 'AI Automation',
    pillar: 'AUTOMATE',
    pillarNumber: '03',
    tagline: 'Autonomous smart workflows',
    sentence: 'AI-powered workflows that reduce repetitive business work.',
    accent: '#6D28D9',
    bgClass: 'bg-violet-700/10 text-violet-700 dark:text-violet-300',
    borderClass: 'border-violet-700/20',
    badge: 'AI // AUTONOMOUS',
    microLabels: ['AI', 'WORKFLOW', 'INPUT', 'OUTPUT']
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
