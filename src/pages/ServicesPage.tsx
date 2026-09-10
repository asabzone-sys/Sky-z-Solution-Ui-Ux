import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Globe, 
  ShoppingCart, 
  Search, 
  TrendingUp, 
  Palette, 
  Bot, 
  Layers, 
  Sparkles, 
  Check, 
  ChevronRight,
  Sliders,
  Workflow,
  Code2,
  Cpu,
  Zap,
  Eye,
  Terminal,
  Activity,
  Maximize2
} from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

export interface ServiceItem {
  id: string;
  pillar: 'BUILD' | 'GROW' | 'AUTOMATE';
  pillarNumber: string;
  name: string;
  headline: string;
  description: string;
  tags: string[];
  microLanguage: string[];
  accentColor: string;
  icon: React.ReactNode;
}

export const PRIMARY_SERVICES: ServiceItem[] = [
  {
    id: 'web-development',
    pillar: 'BUILD',
    pillarNumber: '01',
    name: 'Web Development',
    headline: 'Websites and web applications built around real business needs.',
    description: 'High-performance web applications and digital interfaces built with TypeScript, React, and resilient cloud architecture.',
    tags: ['Next-Gen Web', 'Accessible UI', 'Component Systems'],
    microLanguage: ['BUILD', 'LAYOUT', 'INTERFACE', 'DEPLOY'],
    accentColor: '#38BDF8',
    icon: <Globe className="w-5 h-5 text-sky-500" />
  },
  {
    id: 'ecommerce',
    pillar: 'BUILD',
    pillarNumber: '01',
    name: 'E-commerce',
    headline: 'Commerce experiences designed to sell, scale, and operate.',
    description: 'Bespoke storefronts engineered for friction-free checkout, inventory management, and fast mobile conversion.',
    tags: ['Custom Storefronts', 'Stripe & Payments', 'Cart Architecture'],
    microLanguage: ['TRANSACT', 'FLOW', 'CATALOG', 'SCALE'],
    accentColor: '#60A5FA',
    icon: <ShoppingCart className="w-5 h-5 text-blue-500" />
  },
  {
    id: 'seo',
    pillar: 'GROW',
    pillarNumber: '02',
    name: 'SEO',
    headline: 'Search visibility built around useful content and technical foundations.',
    description: 'Structured data schemas, crawl optimization, and technical performance that help search engines discover and rank your business.',
    tags: ['Schema Markup', 'Core Web Vitals', 'Search Indexing'],
    microLanguage: ['OPTIMIZE', 'INDEX', 'RANK', 'DISCOVER'],
    accentColor: '#34D399',
    icon: <Search className="w-5 h-5 text-emerald-500" />
  },
  {
    id: 'digital-marketing',
    pillar: 'GROW',
    pillarNumber: '02',
    name: 'Digital Marketing',
    headline: 'Campaigns and digital growth systems designed around your audience.',
    description: 'Data-guided acquisition funnels, conversion optimization, and strategic distribution that turn traffic into qualified relationships.',
    tags: ['Conversion Funnels', 'Attribution Tracking', 'Audience Growth'],
    microLanguage: ['GROW', 'ACQUIRE', 'CONVERT', 'ATTRACT'],
    accentColor: '#A78BFA',
    icon: <TrendingUp className="w-5 h-5 text-purple-500" />
  },
  {
    id: 'graphic-design',
    pillar: 'GROW',
    pillarNumber: '02',
    name: 'Graphic Design',
    headline: 'Visual systems and marketing assets that make the brand recognizable.',
    description: 'Cohesive brand identity systems, typography guidelines, vector assets, and digital design collateral that build distinct brand presence.',
    tags: ['Brand Identity', 'Vector Systems', 'Design Collateral'],
    microLanguage: ['DESIGN', 'SHAPE', 'COMPOSE', 'CRAFT'],
    accentColor: '#F472B6',
    icon: <Palette className="w-5 h-5 text-pink-500" />
  },
  {
    id: 'ai-automation',
    pillar: 'AUTOMATE',
    pillarNumber: '03',
    name: 'AI Automation',
    headline: 'AI-powered workflows and agents that reduce repetitive business work.',
    description: 'Custom AI agents, webhook event orchestration, and cross-platform integrations that automate operations and support 24/7.',
    tags: ['Autonomous Agents', 'Webhook Pipelines', 'API Orchestration'],
    microLanguage: ['AUTOMATE', 'WORKFLOW', 'PROCESS', 'LOGIC'],
    accentColor: '#F59E0B',
    icon: <Bot className="w-5 h-5 text-amber-500" />
  }
];

export const ServicesPage: React.FC = () => {
  const { navigate, setServiceCategory } = useNavigation();
  const [activePillarFilter, setActivePillarFilter] = useState<'ALL' | 'BUILD' | 'GROW' | 'AUTOMATE'>('ALL');
  const [activeServiceId, setActiveServiceId] = useState<string>('web-development');

  // Interactive Card Simulation states
  const [webDeviceView, setWebDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [ecomCheckoutStep, setEcomCheckoutStep] = useState<number>(1);
  const [marketingFunnelVisitors, setMarketingFunnelVisitors] = useState<number>(5000);
  const [aiWorkflowRunState, setAiWorkflowRunState] = useState<'IDLE' | 'PARSING' | 'ROUTING' | 'DONE'>('IDLE');
  const [graphicDesignTheme, setGraphicDesignTheme] = useState<'Geometric' | 'Modernist' | 'Minimal'>('Geometric');

  const filteredServices = activePillarFilter === 'ALL'
    ? PRIMARY_SERVICES
    : PRIMARY_SERVICES.filter(s => s.pillar === activePillarFilter);

  const selectedService = PRIMARY_SERVICES.find(s => s.id === activeServiceId) || PRIMARY_SERVICES[0];

  const handleStartWithService = (serviceName: string) => {
    navigate('contact');
  };

  const runAiSimulation = () => {
    setAiWorkflowRunState('PARSING');
    setTimeout(() => setAiWorkflowRunState('ROUTING'), 600);
    setTimeout(() => setAiWorkflowRunState('DONE'), 1200);
    setTimeout(() => setAiWorkflowRunState('IDLE'), 3000);
  };

  return (
    <div className="w-full bg-skyz-bg text-skyz-text transition-colors duration-200 overflow-x-hidden">
      
      {/* 1. HERO WITH CREATIVE CODING MICRO-LABELS */}
      <section className="w-full pt-12 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b border-skyz-border relative overflow-hidden bg-dots-pattern">
        {/* Organic curved glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-skyz-accent/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Micro-language top ribbon */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-skyz-surface border border-skyz-border shadow-sm">
              <span className="w-2 h-2 rounded-full bg-skyz-accent animate-pulse" />
              <span className="text-xs text-skyz-text-muted uppercase tracking-wider font-semibold">
                SkyZ Core Services
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-3 font-mono text-xs text-skyz-text-muted">
              <span className="px-2 py-0.5 rounded bg-skyz-surface-subtle border border-skyz-border">BUILD</span>
              <span className="text-skyz-accent font-bold">→</span>
              <span className="px-2 py-0.5 rounded bg-skyz-surface-subtle border border-skyz-border">GROW</span>
              <span className="text-skyz-accent font-bold">→</span>
              <span className="px-2 py-0.5 rounded bg-skyz-surface-subtle border border-skyz-border">AUTOMATE</span>
            </div>
          </div>

          <div className="max-w-4xl">
            <motion.h1 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-skyz-text leading-[1.05]"
            >
              SIX CAPABILITIES.{' '}
              <span className="text-skyz-accent block">
                ONE CONTINUOUS SYSTEM.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-lg sm:text-xl md:text-2xl text-skyz-text-muted mt-5 max-w-3xl leading-relaxed"
            >
              We craft modern websites, expand digital market presence, and automate business processes with software built for lasting utility.
            </motion.p>
          </div>

          {/* Interactive Pillar Filter Bar */}
          <div className="mt-10 flex flex-wrap items-center gap-2.5 p-1.5 rounded-2xl bg-skyz-surface border border-skyz-border shadow-sm max-w-xl">
            {(['ALL', 'BUILD', 'GROW', 'AUTOMATE'] as const).map((filter) => {
              const count = filter === 'ALL' 
                ? 6 
                : filter === 'BUILD' ? 2 : filter === 'GROW' ? 3 : 1;
              const isActive = activePillarFilter === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActivePillarFilter(filter)}
                  className={`relative flex-1 min-w-[100px] px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isActive 
                      ? 'text-white dark:text-[#080B10]' 
                      : 'text-skyz-text-muted hover:text-skyz-text'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="pillarFilterPill"
                      className="absolute inset-0 bg-skyz-text dark:bg-skyz-accent rounded-xl -z-10 shadow-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span>{filter}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive 
                      ? 'bg-white/25 text-white dark:text-[#080B10]' 
                      : 'bg-skyz-surface-subtle text-skyz-text-muted'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. ORGANIC SHAPE CONNECTOR / DIP */}
      <div className="w-full relative h-12 overflow-hidden pointer-events-none -mt-px">
        <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full preserve-3d">
          <path 
            d="M0 0C320 38 720 48 1440 0V48H0V0Z" 
            className="fill-skyz-surface-subtle opacity-40 dark:opacity-20"
          />
        </svg>
      </div>

      {/* 3. INTERACTIVE BUILD → GROW → AUTOMATE STORYTELLING CANVAS */}
      <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-skyz-border bg-skyz-surface-subtle/40 relative">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-skyz-surface border border-skyz-border mb-3">
                <Workflow className="w-3.5 h-3.5 text-skyz-accent" />
                <span className="text-xs font-mono uppercase text-skyz-text-muted font-semibold">
                  Evolutionary Journey // 3 Stages
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-skyz-text">
                How our services connect into one engine.
              </h2>
            </div>
            <p className="text-sm text-skyz-text-muted max-w-md font-mono">
              [INPUT: Business Need] → [BUILD Architecture] → [GROW Audience] → [AUTOMATE Workflow]
            </p>
          </div>

          {/* Interactive Tri-Stage Pipeline Canvas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
            
            {/* Stage 1: BUILD */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="p-6 sm:p-8 rounded-3xl bg-skyz-surface border border-skyz-border shadow-sm relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-500 border border-sky-500/20">
                    STAGE 01 // BUILD
                  </span>
                  <span className="text-xs font-mono text-skyz-text-muted">2 SERVICES</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-skyz-text">
                  Foundation &amp; Commerce
                </h3>
                <p className="text-sm text-skyz-text-muted mt-2 leading-relaxed">
                  Engineering high-velocity websites and scalable e-commerce systems tailored to real commercial objectives.
                </p>

                {/* Sub-services pills */}
                <div className="mt-6 space-y-2">
                  <div 
                    onClick={() => setActiveServiceId('web-development')}
                    className="p-3 rounded-2xl bg-skyz-surface-subtle border border-skyz-border hover:border-skyz-accent/40 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-sky-500" />
                      <span className="text-xs font-bold text-skyz-text">Web Development</span>
                    </div>
                    <span className="text-[10px] font-mono text-skyz-text-muted">LAYOUT &amp; DEPLOY</span>
                  </div>
                  <div 
                    onClick={() => setActiveServiceId('ecommerce')}
                    className="p-3 rounded-2xl bg-skyz-surface-subtle border border-skyz-border hover:border-skyz-accent/40 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShoppingCart className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-bold text-skyz-text">E-commerce</span>
                    </div>
                    <span className="text-[10px] font-mono text-skyz-text-muted">CART &amp; SCALE</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-skyz-border flex items-center justify-between text-xs font-mono text-skyz-text-muted">
                <span>STAGE OUTPUT:</span>
                <span className="text-sky-500 font-semibold">Resilient Codebase</span>
              </div>
            </motion.div>

            {/* Stage 2: GROW */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="p-6 sm:p-8 rounded-3xl bg-skyz-surface border border-skyz-border shadow-sm relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">
                    STAGE 02 // GROW
                  </span>
                  <span className="text-xs font-mono text-skyz-text-muted">3 SERVICES</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-skyz-text">
                  Visibility &amp; Brand
                </h3>
                <p className="text-sm text-skyz-text-muted mt-2 leading-relaxed">
                  Attracting high-intent buyers through technical organic search, structured marketing funnels, and recognizable design systems.
                </p>

                {/* Sub-services pills */}
                <div className="mt-6 space-y-2">
                  <div 
                    onClick={() => setActiveServiceId('seo')}
                    className="p-3 rounded-2xl bg-skyz-surface-subtle border border-skyz-border hover:border-skyz-accent/40 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <Search className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-bold text-skyz-text">SEO</span>
                    </div>
                    <span className="text-[10px] font-mono text-skyz-text-muted">INDEX &amp; RANK</span>
                  </div>
                  <div 
                    onClick={() => setActiveServiceId('digital-marketing')}
                    className="p-3 rounded-2xl bg-skyz-surface-subtle border border-skyz-border hover:border-skyz-accent/40 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <TrendingUp className="w-4 h-4 text-purple-500" />
                      <span className="text-xs font-bold text-skyz-text">Digital Marketing</span>
                    </div>
                    <span className="text-[10px] font-mono text-skyz-text-muted">ACQUIRE &amp; CONVERT</span>
                  </div>
                  <div 
                    onClick={() => setActiveServiceId('graphic-design')}
                    className="p-3 rounded-2xl bg-skyz-surface-subtle border border-skyz-border hover:border-skyz-accent/40 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <Palette className="w-4 h-4 text-pink-500" />
                      <span className="text-xs font-bold text-skyz-text">Graphic Design</span>
                    </div>
                    <span className="text-[10px] font-mono text-skyz-text-muted">IDENTITY &amp; CRAFT</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-skyz-border flex items-center justify-between text-xs font-mono text-skyz-text-muted">
                <span>STAGE OUTPUT:</span>
                <span className="text-purple-500 font-semibold">Active Audience</span>
              </div>
            </motion.div>

            {/* Stage 3: AUTOMATE */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="p-6 sm:p-8 rounded-3xl bg-skyz-surface border border-skyz-border shadow-sm relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    STAGE 03 // AUTOMATE
                  </span>
                  <span className="text-xs font-mono text-skyz-text-muted">1 SERVICE</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-skyz-text">
                  Workflows &amp; Agents
                </h3>
                <p className="text-sm text-skyz-text-muted mt-2 leading-relaxed">
                  Deploying intelligent AI agents and API integrations that resolve customer questions and execute business processes autonomously.
                </p>

                {/* Sub-services pills */}
                <div className="mt-6 space-y-2">
                  <div 
                    onClick={() => setActiveServiceId('ai-automation')}
                    className="p-3 rounded-2xl bg-skyz-surface-subtle border border-skyz-border hover:border-skyz-accent/40 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <Bot className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-bold text-skyz-text">AI Automation</span>
                    </div>
                    <span className="text-[10px] font-mono text-skyz-text-muted">WORKFLOW &amp; LOGIC</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-skyz-border flex items-center justify-between text-xs font-mono text-skyz-text-muted">
                <span>STAGE OUTPUT:</span>
                <span className="text-amber-500 font-semibold">24/7 Autonomy</span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 4. THE 6 PRIMARY SERVICES: INTERACTIVE CANVAS WITH LIVE EXPERIMENTAL PREVIEWS */}
      <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-skyz-border">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-skyz-surface border border-skyz-border mb-3">
                <Cpu className="w-3.5 h-3.5 text-skyz-accent" />
                <span className="text-xs font-mono uppercase text-skyz-text-muted font-semibold">
                  Service Exploration Canvas
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-skyz-text">
                Detailed Service Blueprints.
              </h2>
            </div>
            <span className="text-xs font-mono text-skyz-text-muted">
              CLICK ANY SERVICE TO PREVIEW INTERACTIVE SYSTEM
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: 6 Service Selectors */}
            <div className="lg:col-span-5 space-y-3">
              {filteredServices.map((service) => {
                const isSelected = activeServiceId === service.id;

                return (
                  <motion.div
                    key={service.id}
                    onClick={() => setActiveServiceId(service.id)}
                    whileHover={{ x: 4 }}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-skyz-surface border-skyz-accent shadow-md'
                        : 'bg-skyz-surface/60 hover:bg-skyz-surface border-skyz-border'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-skyz-surface-subtle border border-skyz-border flex items-center justify-center">
                          {service.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-skyz-text-muted">
                              [{service.pillar} // {service.pillarNumber}]
                            </span>
                          </div>
                          <h4 className="font-display text-base font-bold text-skyz-text">
                            {service.name}
                          </h4>
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-skyz-accent rotate-90' : 'text-skyz-text-muted'}`} />
                    </div>

                    <p className="text-xs text-skyz-text-muted mt-2.5 line-clamp-2">
                      {service.headline}
                    </p>

                    {/* Creative micro-language tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {service.microLanguage.map((token, idx) => (
                        <span 
                          key={idx} 
                          className="text-[9px] font-mono px-2 py-0.5 rounded bg-skyz-surface-subtle text-skyz-text-muted border border-skyz-border"
                        >
                          {token}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Right: Live Interactive Architectural Visualizer */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedService.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="p-6 sm:p-8 rounded-3xl bg-skyz-surface border border-skyz-border shadow-xl relative overflow-hidden"
                >
                  {/* Decorative background aura */}
                  <div 
                    className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
                    style={{ backgroundColor: selectedService.accentColor }}
                  />

                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-skyz-border mb-6">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-mono text-xs font-bold text-skyz-text uppercase tracking-wider">
                        {selectedService.name} // SPECIFICATION
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-skyz-accent font-bold px-2 py-0.5 rounded bg-skyz-surface-subtle">
                      PILLAR: {selectedService.pillar}
                    </span>
                  </div>

                  {/* Headline & Description */}
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-skyz-text">
                    {selectedService.headline}
                  </h3>
                  <p className="text-sm sm:text-base text-skyz-text-muted mt-3 leading-relaxed">
                    {selectedService.description}
                  </p>

                  {/* Interactive Micro-Playground specific to the active service */}
                  <div className="my-6 p-5 rounded-2xl bg-skyz-surface-subtle border border-skyz-border">
                    <div className="flex items-center justify-between text-xs font-mono text-skyz-text-muted mb-3">
                      <span>INTERACTIVE PROTOTYPE PREVIEW</span>
                      <span className="text-skyz-accent font-bold">LIVE STATE</span>
                    </div>

                    {/* 1. Web Development Preview */}
                    {selectedService.id === 'web-development' && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setWebDeviceView('desktop')}
                            className={`px-3 py-1 rounded-lg text-xs font-mono ${webDeviceView === 'desktop' ? 'bg-skyz-text text-white dark:text-black font-bold' : 'bg-skyz-surface text-skyz-text-muted'}`}
                          >
                            Desktop
                          </button>
                          <button
                            type="button"
                            onClick={() => setWebDeviceView('tablet')}
                            className={`px-3 py-1 rounded-lg text-xs font-mono ${webDeviceView === 'tablet' ? 'bg-skyz-text text-white dark:text-black font-bold' : 'bg-skyz-surface text-skyz-text-muted'}`}
                          >
                            Tablet
                          </button>
                          <button
                            type="button"
                            onClick={() => setWebDeviceView('mobile')}
                            className={`px-3 py-1 rounded-lg text-xs font-mono ${webDeviceView === 'mobile' ? 'bg-skyz-text text-white dark:text-black font-bold' : 'bg-skyz-surface text-skyz-text-muted'}`}
                          >
                            Mobile
                          </button>
                        </div>
                        {/* Wireframe Canvas */}
                        <div className="p-4 rounded-xl bg-skyz-surface border border-skyz-border flex flex-col gap-2 transition-all">
                          <div className="h-4 bg-skyz-accent/20 rounded w-1/3" />
                          <div className="grid grid-cols-3 gap-2">
                            <div className="h-12 bg-skyz-surface-subtle rounded border border-skyz-border" />
                            <div className="h-12 bg-skyz-surface-subtle rounded border border-skyz-border" />
                            <div className="h-12 bg-skyz-surface-subtle rounded border border-skyz-border" />
                          </div>
                          <div className="text-[11px] font-mono text-skyz-text-muted flex justify-between pt-2">
                            <span>Viewport: {webDeviceView.toUpperCase()}</span>
                            <span className="text-emerald-500 font-bold">RESPONSIVE 60FPS</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 2. E-commerce Preview */}
                    {selectedService.id === 'ecommerce' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className={ecomCheckoutStep >= 1 ? 'text-skyz-accent font-bold' : 'text-skyz-text-muted'}>01. Cart</span>
                          <span>→</span>
                          <span className={ecomCheckoutStep >= 2 ? 'text-skyz-accent font-bold' : 'text-skyz-text-muted'}>02. Checkout</span>
                          <span>→</span>
                          <span className={ecomCheckoutStep === 3 ? 'text-emerald-500 font-bold' : 'text-skyz-text-muted'}>03. Confirmed</span>
                        </div>
                        <div className="p-4 rounded-xl bg-skyz-surface border border-skyz-border flex items-center justify-between">
                          <div className="text-xs">
                            <span className="font-bold text-skyz-text block">Enterprise Cart Engine</span>
                            <span className="text-skyz-text-muted text-[11px] font-mono">Stripe Webhook Sync</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEcomCheckoutStep(prev => prev < 3 ? prev + 1 : 1)}
                            className="px-3 py-1.5 rounded-lg bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] text-xs font-mono font-bold cursor-pointer"
                          >
                            Advance Step ({ecomCheckoutStep}/3)
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 3. SEO Preview */}
                    {selectedService.id === 'seo' && (
                      <div className="p-4 rounded-xl bg-skyz-surface border border-skyz-border space-y-2">
                        <div className="text-xs font-mono text-emerald-500 flex items-center gap-1.5">
                          <span>https://yourbusiness.com</span>
                          <span className="text-skyz-text-muted">› services › solution</span>
                        </div>
                        <div className="text-sm font-display font-bold text-skyz-text">
                          High-Ranking Business Presence | Engineered by SkyZ
                        </div>
                        <p className="text-xs text-skyz-text-muted">
                          Structured JSON-LD schemas and sub-second load times verified for optimal search crawler indexing.
                        </p>
                        <div className="pt-2 flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">
                            Schema: Organization
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-500 font-bold">
                            Lighthouse: 98/100
                          </span>
                        </div>
                      </div>
                    )}

                    {/* 4. Digital Marketing Preview */}
                    {selectedService.id === 'digital-marketing' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-skyz-text-muted">Target Audience Reach</span>
                          <span className="text-skyz-accent font-bold">{marketingFunnelVisitors.toLocaleString()} Visitors</span>
                        </div>
                        <input
                          type="range"
                          min="1000"
                          max="25000"
                          step="1000"
                          value={marketingFunnelVisitors}
                          onChange={(e) => setMarketingFunnelVisitors(Number(e.target.value))}
                          className="w-full accent-skyz-accent cursor-pointer"
                        />
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                          <div className="p-2.5 rounded-lg bg-skyz-surface border border-skyz-border">
                            <span className="text-skyz-text-muted block text-[10px]">Estimated Qualified Leads</span>
                            <span className="text-skyz-text font-bold">{Math.round(marketingFunnelVisitors * 0.04)} leads (4.0%)</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-skyz-surface border border-skyz-border">
                            <span className="text-skyz-text-muted block text-[10px]">Attribution Channel</span>
                            <span className="text-skyz-text font-bold">Organic + Targeted</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 5. Graphic Design Preview */}
                    {selectedService.id === 'graphic-design' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          {(['Geometric', 'Modernist', 'Minimal'] as const).map((style) => (
                            <button
                              key={style}
                              type="button"
                              onClick={() => setGraphicDesignTheme(style)}
                              className={`px-3 py-1 rounded-lg text-xs font-mono ${graphicDesignTheme === style ? 'bg-pink-500 text-white font-bold' : 'bg-skyz-surface text-skyz-text-muted'}`}
                            >
                              {style}
                            </button>
                          ))}
                        </div>
                        <div className="p-4 rounded-xl bg-skyz-surface border border-skyz-border flex items-center justify-around">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center text-white font-display font-bold text-lg shadow-sm">
                            SZ
                          </div>
                          <div className="text-xs space-y-1">
                            <div className="font-bold text-skyz-text">Typographic System: {graphicDesignTheme}</div>
                            <div className="text-skyz-text-muted font-mono text-[11px]">Vector Geometry &amp; Brand Tokens</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 6. AI Automation Preview */}
                    {selectedService.id === 'ai-automation' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-mono">
                            <span className="text-skyz-text-muted">Workflow Engine: </span>
                            <span className="text-amber-500 font-bold">{aiWorkflowRunState}</span>
                          </div>
                          <button
                            type="button"
                            onClick={runAiSimulation}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 text-black text-xs font-mono font-bold cursor-pointer hover:bg-amber-400 transition-colors"
                          >
                            Trigger Agent Run
                          </button>
                        </div>

                        <div className="p-3 rounded-xl bg-skyz-surface border border-skyz-border flex items-center justify-between text-xs font-mono">
                          <span className={aiWorkflowRunState === 'PARSING' ? 'text-amber-500 font-bold' : 'text-skyz-text-muted'}>
                            01. Webhook Ingest
                          </span>
                          <span>→</span>
                          <span className={aiWorkflowRunState === 'ROUTING' ? 'text-amber-500 font-bold' : 'text-skyz-text-muted'}>
                            02. Agent Reasoner
                          </span>
                          <span>→</span>
                          <span className={aiWorkflowRunState === 'DONE' ? 'text-emerald-500 font-bold' : 'text-skyz-text-muted'}>
                            03. CRM Update
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Core Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedService.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-mono px-3 py-1 rounded-full bg-skyz-surface-subtle text-skyz-text border border-skyz-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Call to Action */}
                  <div className="pt-4 border-t border-skyz-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <span className="text-xs font-mono text-skyz-text-muted">
                      FRAMEWORK: {selectedService.pillar} // READY FOR DEPLOYMENT
                    </span>
                    <button
                      type="button"
                      onClick={() => handleStartWithService(selectedService.name)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] font-semibold text-xs sm:text-sm shadow-md hover:bg-skyz-accent dark:hover:bg-skyz-accent-secondary transition-all cursor-pointer"
                    >
                      <span>Scope {selectedService.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

        </div>
      </section>

      {/* 5. CLOSING CTA BANNER */}
      <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-skyz-surface text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-skyz-surface-subtle border border-skyz-border">
            <Sparkles className="w-3.5 h-3.5 text-skyz-accent" />
            <span className="text-xs font-mono text-skyz-text font-bold uppercase tracking-wider">
              Integrated Technical Partnership
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-skyz-text">
            Ready to build, grow, or automate?
          </h2>
          <p className="text-base sm:text-lg text-skyz-text-muted max-w-xl mx-auto">
            Tell us about your project requirements and let's craft a targeted technical roadmap.
          </p>

          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={() => navigate('contact')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] font-semibold text-sm shadow-md hover:bg-skyz-accent transition-all cursor-pointer"
            >
              <span>Start Scoping Your Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
