/**
 * Portfolio data + shared project visuals.
 * Imported by both the Home page (featured preview) and the Work page
 * (full case-study grid), so both surfaces always show the same projects
 * and the same card visual language.
 */
import React from 'react';
import {
  Laptop,
  ShoppingCart,
  Search,
  TrendingUp,
  Palette,
  Bot,
} from 'lucide-react';

export type ServiceCategory =
  | 'WEB DEVELOPMENT'
  | 'E-COMMERCE'
  | 'SEO'
  | 'DIGITAL MARKETING'
  | 'GRAPHIC DESIGN'
  | 'AI AUTOMATION';

export interface PortfolioProject {
  id: string;
  title: string;
  serviceCategory: ServiceCategory;
  pillar: 'BUILD' | 'GROW' | 'AUTOMATE';
  description: string;
  accentColor: string;
  tags: string[];
  clientSector: string;
  visualType: 'video' | 'interactive' | 'visual';
  deliverables: string[];
  // Optional real image. If not provided, a generated gradient visual is used instead —
  // drop a project photo/mockup path here (e.g. '/assets/work/apex-storefront.jpg') to
  // replace the placeholder the moment real assets are ready.
  image?: string;
  mockupDetails: {
    heroMetricLabel?: string;
    sublabel?: string;
    actionText?: string;
  };
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'apex-storefront',
    title: 'Apex Living Storefront',
    serviceCategory: 'E-COMMERCE',
    pillar: 'BUILD',
    description: 'A modern online shopping experience designed around the brand with fluid browsing and high-speed checkout.',
    accentColor: '#3B82F6',
    tags: ['Custom Storefront', 'Checkout Flow', 'Mobile Commerce'],
    clientSector: 'Modern Retail & Lifestyle',
    visualType: 'interactive',
    deliverables: ['Responsive Store Design', 'Payment Gateway Integration', 'Catalog Architecture', 'Cart Optimization'],
    mockupDetails: {
      heroMetricLabel: 'Store Experience',
      sublabel: 'Custom Catalog & Checkout',
      actionText: 'Explore Storefront'
    }
  },
  {
    id: 'horizon-platform',
    title: 'Horizon Studio Web Experience',
    serviceCategory: 'WEB DEVELOPMENT',
    pillar: 'BUILD',
    description: 'A responsive corporate web experience built for clarity, speed, and real business utility across all screen sizes.',
    accentColor: '#0EA5E9',
    tags: ['Corporate Website', 'Fast Loading', 'Responsive UI'],
    clientSector: 'Architecture & Design Consultancy',
    visualType: 'video',
    deliverables: ['Clean Front-end Architecture', 'CMS Content Modeling', 'Dynamic Portfolios', 'Accessibility AA'],
    mockupDetails: {
      heroMetricLabel: 'Web System',
      sublabel: 'Responsive Canvas & Layouts',
      actionText: 'Launch Preview'
    }
  },
  {
    id: 'meridian-search',
    title: 'Meridian Search & Discovery',
    serviceCategory: 'SEO',
    pillar: 'GROW',
    description: 'Search-focused improvements and structured content architecture designed to strengthen long-term online visibility.',
    accentColor: '#10B981',
    tags: ['Technical SEO', 'Structured Content', 'Organic Discovery'],
    clientSector: 'B2B Professional Services',
    deliverables: ['Semantic Schema Markup', 'Content Hierarchy Audit', 'Search Console Optimization', 'Core Web Architecture'],
    visualType: 'interactive',
    mockupDetails: {
      heroMetricLabel: 'Search Visibility',
      sublabel: 'High-intent Organic Strategy',
      actionText: 'Inspect Snippet'
    }
  },
  {
    id: 'lumina-pulse',
    title: 'Lumina Digital Reach',
    serviceCategory: 'DIGITAL MARKETING',
    pillar: 'GROW',
    description: 'Targeted digital campaign design and media creative reaching high-intent customers with clear value messaging.',
    accentColor: '#8B5CF6',
    tags: ['Campaign Creative', 'Audience Strategy', 'Multi-Channel'],
    clientSector: 'Consumer Brand & Wellness',
    visualType: 'video',
    deliverables: ['Ad Creative Design', 'Multi-Channel Campaign Strategy', 'Audience Segmentation', 'Funnel Optimization'],
    mockupDetails: {
      heroMetricLabel: 'Campaign System',
      sublabel: 'Targeted Customer Acquisition',
      actionText: 'View Campaign'
    }
  },
  {
    id: 'nova-identity',
    title: 'Nova Studio Brand Identity',
    serviceCategory: 'GRAPHIC DESIGN',
    pillar: 'GROW',
    description: 'Distinct visual identity, custom typography system, and digital brand assets that make the business recognizable.',
    accentColor: '#EC4899',
    tags: ['Brand Identity', 'Typography System', 'Design Tokens'],
    clientSector: 'Creative Agency & Media',
    visualType: 'interactive',
    deliverables: ['Logo & Mark System', 'Typography Scale', 'Palette System', 'Digital Marketing Assets'],
    mockupDetails: {
      heroMetricLabel: 'Brand Identity',
      sublabel: 'Vector Marks & Specimen',
      actionText: 'Inspect Identity'
    }
  },
  {
    id: 'flowops-assistant',
    title: 'FlowOps Smart Assistant',
    serviceCategory: 'AI AUTOMATION',
    pillar: 'AUTOMATE',
    description: 'AI-powered customer inquiry routing and automated scheduling that reduces repetitive administrative work.',
    accentColor: '#F59E0B',
    tags: ['AI Agent', 'Workflow Automation', 'Calendar Routing'],
    clientSector: 'Logistics & Client Operations',
    visualType: 'interactive',
    deliverables: ['Inquiry Triage Pipeline', 'Automated CRM Routing', 'Calendar Scheduling Bot', 'Staff Notification Webhooks'],
    mockupDetails: {
      heroMetricLabel: 'Automated Pipeline',
      sublabel: 'Smart Request Routing',
      actionText: 'Run Workflow'
    }
  }
];

export const SERVICE_CATEGORY_ICON: Record<ServiceCategory, React.ReactNode> = {
  'WEB DEVELOPMENT': <Laptop className="w-full h-full" />,
  'E-COMMERCE': <ShoppingCart className="w-full h-full" />,
  'SEO': <Search className="w-full h-full" />,
  'DIGITAL MARKETING': <TrendingUp className="w-full h-full" />,
  'GRAPHIC DESIGN': <Palette className="w-full h-full" />,
  'AI AUTOMATION': <Bot className="w-full h-full" />,
};

/** Badge tint per service category — shared across Home and Work. */
export const getServiceBadgeStyle = (category: string): string => {
  switch (category) {
    case 'WEB DEVELOPMENT': return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30';
    case 'E-COMMERCE': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
    case 'SEO': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    case 'DIGITAL MARKETING': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30';
    case 'GRAPHIC DESIGN': return 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/30';
    case 'AI AUTOMATION': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
    default: return 'bg-skyz-surface-subtle text-skyz-text-muted border-skyz-border';
  }
};

/**
 * Generated placeholder "visual" — a soft gradient + icon standing in for a real
 * project photo/mockup. Swap for a real <img src={project.image} /> the moment
 * actual project screenshots are ready; the `image` field is already wired.
 */
export const ProjectVisual: React.FC<{
  project: PortfolioProject;
  className?: string;
}> = ({ project, className = '' }) => {
  if (project.image) {
    return (
      <img
        src={project.image}
        alt={project.title}
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }
  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(155deg, ${project.accentColor}22 0%, transparent 55%), radial-gradient(circle at 30% 20%, ${project.accentColor}33, transparent 60%)`
      }}
    >
      <div className="absolute inset-0 bg-dots-pattern opacity-40" />
      <div
        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white shadow-lg p-3.5 sm:p-4"
        style={{ backgroundColor: project.accentColor }}
      >
        {SERVICE_CATEGORY_ICON[project.serviceCategory]}
      </div>
    </div>
  );
};
