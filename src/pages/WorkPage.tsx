import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ExternalLink, 
  Eye, 
  Layers, 
  Sparkles, 
  X, 
  Compass, 
  Cpu, 
  Globe, 
  Play, 
  Pause,
  Sliders, 
  Maximize2,
  Code2,
  Workflow,
  Search,
  Monitor,
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

interface ShowcaseProject {
  id: string;
  badge: 'CONCEPT' | 'PROTOTYPE' | 'EXPERIMENT' | 'ARCHITECTURE SHOWCASE';
  title: string;
  subtitle: string;
  category: string;
  urlPreview: string;
  accentColor: string;
  tags: string[];
  microLanguage: string[];
  description: string;
  features: string[];
}

export const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: 'media-pipeline',
    badge: 'CONCEPT',
    title: 'Media Pipeline',
    subtitle: 'High-throughput asset processing & responsive video delivery system',
    category: 'Media Architecture',
    urlPreview: 'skyz.systems/prototypes/media-pipeline',
    accentColor: '#38BDF8',
    tags: ['Web Video', 'Asset CDN', 'Responsive Canvas'],
    microLanguage: ['STREAM', 'LAYOUT', 'DECODE', 'RENDER'],
    description: 'A conceptual exploration of low-latency video streaming interfaces with dynamic bitrate adaptation and interactive timeline scrubbing.',
    features: ['Adaptive viewport framing', 'Multi-resolution canvas', 'Ergonomic scrub controls', 'Zero-buffer player ui']
  },
  {
    id: 'editorial-engine',
    badge: 'PROTOTYPE',
    title: 'Editorial Engine',
    subtitle: 'Dynamic content publishing platform & structured layout architecture',
    category: 'Publishing Platform',
    urlPreview: 'skyz.systems/prototypes/editorial-engine',
    accentColor: '#34D399',
    tags: ['Next-Gen CMS', 'Typography System', 'Dynamic Routing'],
    microLanguage: ['COMPOSE', 'SCHEMA', 'ROUTE', 'PUBLISH'],
    description: 'A working prototype for high-contrast digital publications featuring live markdown compilation, fluid typographic scales, and responsive split view.',
    features: ['Dual-pane markdown editor', 'High-contrast typography', 'Instant visual diffs', 'Responsive preview panes']
  },
  {
    id: 'knowledge-retrieval',
    badge: 'EXPERIMENT',
    title: 'Knowledge Base',
    subtitle: 'Vector-indexed search architecture & reference catalog interface',
    category: 'Information Architecture',
    urlPreview: 'skyz.systems/prototypes/knowledge-base',
    accentColor: '#A78BFA',
    tags: ['Semantic Search', 'Indexed Storage', 'Interactive Graph'],
    microLanguage: ['INDEX', 'VECTOR', 'QUERY', 'RESOLVE'],
    description: 'An interactive exploration of hierarchical knowledge graphs, natural query clustering, and instant faceted search filtering.',
    features: ['Vector semantic search UI', 'Clustered topic nodes', 'Instant query filters', 'Keyboard-first navigation']
  },
  {
    id: 'market-intelligence',
    badge: 'ARCHITECTURE SHOWCASE',
    title: 'Market Intelligence',
    subtitle: 'Data aggregation framework & competitive dashboard architecture',
    category: 'Analytics Platform',
    urlPreview: 'skyz.systems/prototypes/market-intel',
    accentColor: '#F59E0B',
    tags: ['Visual Analytics', 'Multi-Source Data', 'Responsive Charts'],
    microLanguage: ['AGGREGATE', 'PROCESS', 'PLOT', 'MONITOR'],
    description: 'A showcase of high-density dashboard layouts designed for rapid visual scanning, accessible chart colors, and real-time filter reactivity.',
    features: ['High-contrast data charts', 'Time-range scrubbers', 'Custom KPI metrics', 'Fluid mobile layouts']
  },
  {
    id: 'spatial-topology',
    badge: 'PROTOTYPE',
    title: 'Spatial Topology',
    subtitle: 'Infrastructure mapping platform & hierarchical systems visualization',
    category: 'Spatial Systems',
    urlPreview: 'skyz.systems/prototypes/spatial-nodes',
    accentColor: '#EC4899',
    tags: ['Interactive Map', 'Node Clustering', 'Systems UI'],
    microLanguage: ['MAP', 'CONNECT', 'TOPOLOGY', 'FLOW'],
    description: 'A visual systems map prototype rendering multi-region cloud services as interactive node clusters with live state connectors.',
    features: ['Interactive node drag', 'Animated connection lines', 'Zoom and pan canvas', 'Component isolation view']
  }
];

export const WorkPage: React.FC = () => {
  const { navigate } = useNavigation();
  const [activeBadgeFilter, setActiveBadgeFilter] = useState<string>('ALL');
  const [activeProjectModal, setActiveProjectModal] = useState<ShowcaseProject | null>(null);

  // Interactive mockup preview states
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState<'4K' | '1080p' | '720p'>('1080p');
  const [activeEditorTab, setActiveEditorTab] = useState<'preview' | 'code'>('preview');

  const filters = ['ALL', 'CONCEPT', 'PROTOTYPE', 'EXPERIMENT', 'ARCHITECTURE SHOWCASE'];

  const filteredProjects = activeBadgeFilter === 'ALL'
    ? SHOWCASE_PROJECTS
    : SHOWCASE_PROJECTS.filter(p => p.badge === activeBadgeFilter);

  return (
    <div className="w-full bg-skyz-bg text-skyz-text transition-colors duration-200 overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="w-full pt-12 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b border-skyz-border relative overflow-hidden bg-dots-pattern">
        {/* Organic curved glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-skyz-accent/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header Tag */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-skyz-surface border border-skyz-border shadow-sm">
              <span className="w-2 h-2 rounded-full bg-skyz-accent animate-pulse" />
              <span className="text-xs text-skyz-text-muted uppercase tracking-wider font-semibold">
                Design &amp; Architecture Showcase
              </span>
            </div>
            <span className="hidden sm:inline-block font-mono text-xs text-skyz-text-muted">
              PROTOTYPES // CONCEPTS // ZERO FAKE CLIENTS
            </span>
          </div>

          <div className="max-w-4xl">
            <motion.h1 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-skyz-text leading-[1.06]"
            >
              PROTOTYPES &amp;{' '}
              <span className="text-skyz-accent block">
                CONCEPT ARCHITECTURES.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-lg sm:text-xl md:text-2xl text-skyz-text-muted mt-5 max-w-3xl leading-relaxed"
            >
              A visual exhibition of interface experiments, component systems, and modular digital architectures created by SkyZ Solutions.
            </motion.p>
          </div>

          {/* Filter Pills */}
          <div className="mt-10 flex flex-wrap items-center gap-2">
            {filters.map((filter) => {
              const isSelected = activeBadgeFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveBadgeFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] shadow-sm'
                      : 'bg-skyz-surface hover:bg-skyz-surface-subtle text-skyz-text-muted hover:text-skyz-text border border-skyz-border'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* 2. ORGANIC WAVE DIVIDER */}
      <div className="w-full relative h-10 overflow-hidden pointer-events-none -mt-px">
        <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path 
            d="M0 0C480 30 960 30 1440 0V40H0V0Z" 
            className="fill-skyz-surface-subtle opacity-30 dark:opacity-15"
          />
        </svg>
      </div>

      {/* 3. VISUAL PROJECT GRID WITH BROWSER DEVICE FRAMES */}
      <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-skyz-border">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono text-skyz-text-muted">
              SHOWING {filteredProjects.length} INTERACTIVE PROTOTYPES
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-skyz-text-muted">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>INTERACTIVE VISUAL PREVIEWS</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
                className="rounded-3xl bg-skyz-surface border border-skyz-border shadow-lg overflow-hidden flex flex-col justify-between group"
              >
                {/* Browser Device Chrome */}
                <div className="px-5 py-3.5 bg-skyz-surface-subtle border-b border-skyz-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 inline-block" />
                    <div className="ml-2 px-2.5 py-1 rounded-md bg-skyz-surface text-[10px] font-mono text-skyz-text-muted border border-skyz-border max-w-[180px] sm:max-w-[240px] truncate">
                      {project.urlPreview}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-skyz-surface text-skyz-accent border border-skyz-border">
                    {project.badge}
                  </span>
                </div>

                {/* Visual Canvas Area */}
                <div className="p-6 sm:p-8 bg-skyz-surface relative overflow-hidden flex-1 flex flex-col justify-between">
                  
                  {/* Subtle Accent Radial */}
                  <div 
                    className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-15 pointer-events-none"
                    style={{ backgroundColor: project.accentColor }}
                  />

                  {/* Project Titles & Category */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-mono font-bold text-skyz-accent">
                        {project.category}
                      </span>
                      <div className="flex gap-1">
                        {project.microLanguage.map((token, i) => (
                          <span key={i} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-skyz-surface-subtle text-skyz-text-muted border border-skyz-border">
                            {token}
                          </span>
                        ))}
                      </div>
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-skyz-text group-hover:text-skyz-accent transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-sm text-skyz-text-muted mt-2 leading-relaxed">
                      {project.subtitle}
                    </p>
                  </div>

                  {/* Visual Interface Mockup Preview Container */}
                  <div className="my-6 p-4 rounded-2xl bg-skyz-surface-subtle border border-skyz-border">
                    
                    {/* Media Pipeline Mockup */}
                    {project.id === 'media-pipeline' && (
                      <div className="space-y-3">
                        <div className="aspect-video w-full rounded-xl bg-skyz-surface border border-skyz-border flex flex-col items-center justify-center relative overflow-hidden group/player">
                          <div className="flex items-center gap-2 text-xs font-mono text-skyz-text-muted">
                            <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                            <span>DYNAMIC BITRATE ENGINE</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                            className="mt-2 w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer"
                          >
                            {isPlayingVideo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                          </button>
                          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2 py-1 rounded bg-black/40 text-[10px] font-mono text-white">
                            <span>01:42 / 04:00</span>
                            <div className="flex gap-1">
                              {(['720p', '1080p', '4K'] as const).map(res => (
                                <span 
                                  key={res} 
                                  onClick={() => setSelectedResolution(res)} 
                                  className={`px-1.5 py-0.5 rounded cursor-pointer ${selectedResolution === res ? 'bg-sky-500 text-white' : 'text-gray-300'}`}
                                >
                                  {res}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Editorial Engine Mockup */}
                    {project.id === 'editorial-engine' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono text-skyz-text-muted pb-1 border-b border-skyz-border">
                          <span>MARKDOWN // DUAL CANVAS</span>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => setActiveEditorTab('preview')}
                              className={`px-2 py-0.5 rounded ${activeEditorTab === 'preview' ? 'bg-emerald-500 text-white font-bold' : 'text-skyz-text-muted'}`}
                            >
                              PREVIEW
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveEditorTab('code')}
                              className={`px-2 py-0.5 rounded ${activeEditorTab === 'code' ? 'bg-emerald-500 text-white font-bold' : 'text-skyz-text-muted'}`}
                            >
                              MD
                            </button>
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-skyz-surface border border-skyz-border text-xs">
                          {activeEditorTab === 'preview' ? (
                            <div>
                              <h4 className="font-display font-bold text-skyz-text text-sm">Autonomous Engineering Paradigm</h4>
                              <p className="text-skyz-text-muted mt-1 text-[11px] leading-relaxed">
                                Continuous deployment cycles paired with typed schemas yield predictable scale.
                              </p>
                            </div>
                          ) : (
                            <pre className="font-mono text-[10px] text-emerald-500">
                              # Autonomous Engineering{'\n'}&gt; Continuous deployment cycles...
                            </pre>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Knowledge Base Mockup */}
                    {project.id === 'knowledge-retrieval' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 rounded-xl bg-skyz-surface border border-skyz-border text-xs text-skyz-text-muted">
                          <Search className="w-3.5 h-3.5 text-purple-500" />
                          <span className="font-mono text-[11px]">Semantic vector search: &quot;API Contracts&quot;</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                          <div className="p-2 rounded-lg bg-skyz-surface border border-skyz-border text-skyz-text">
                            <span className="text-purple-500 block font-bold">Node 01</span>
                            REST &amp; Webhook Schemas
                          </div>
                          <div className="p-2 rounded-lg bg-skyz-surface border border-skyz-border text-skyz-text">
                            <span className="text-purple-500 block font-bold">Node 02</span>
                            Vector Embedding Cluster
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Market Intelligence Mockup */}
                    {project.id === 'market-intelligence' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono text-skyz-text-muted">
                          <span>AGGREGATED ANALYTICS</span>
                          <span className="text-amber-500 font-bold">ACTIVE STREAM</span>
                        </div>
                        <div className="p-3 rounded-xl bg-skyz-surface border border-skyz-border flex items-end gap-2 h-16">
                          <div className="flex-1 bg-amber-500/20 rounded-t h-[40%]" />
                          <div className="flex-1 bg-amber-500/40 rounded-t h-[65%]" />
                          <div className="flex-1 bg-amber-500/30 rounded-t h-[50%]" />
                          <div className="flex-1 bg-amber-500/80 rounded-t h-[90%]" />
                          <div className="flex-1 bg-amber-500 rounded-t h-[100%]" />
                        </div>
                      </div>
                    )}

                    {/* Spatial Topology Mockup */}
                    {project.id === 'spatial-topology' && (
                      <div className="p-3 rounded-xl bg-skyz-surface border border-skyz-border flex items-center justify-around text-xs font-mono">
                        <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-500 font-bold">
                          Ingress Node
                        </div>
                        <span className="text-skyz-text-muted">──────►</span>
                        <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-500 font-bold">
                          Worker Mesh
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-skyz-surface-subtle text-skyz-text-muted border border-skyz-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Card Action */}
                  <div className="pt-4 border-t border-skyz-border flex items-center justify-between">
                    <span className="text-xs font-mono text-skyz-text-muted">
                      STATUS: {project.badge}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveProjectModal(project)}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-skyz-accent hover:underline cursor-pointer"
                    >
                      <span>Explore Specification</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. MODAL INSPECTOR FOR ARCHITECTURAL SPECIFICATIONS */}
      <AnimatePresence>
        {activeProjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-skyz-surface border border-skyz-border p-6 sm:p-8 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setActiveProjectModal(null)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-skyz-surface-subtle border border-skyz-border flex items-center justify-center text-skyz-text-muted hover:text-skyz-text cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-skyz-surface-subtle text-skyz-accent border border-skyz-border">
                  {activeProjectModal.badge}
                </span>
                <span className="text-xs font-mono text-skyz-text-muted">
                  {activeProjectModal.category}
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-skyz-text">
                {activeProjectModal.title}
              </h3>
              <p className="text-sm text-skyz-text-muted mt-2 leading-relaxed">
                {activeProjectModal.description}
              </p>

              <div className="mt-6 space-y-4">
                <div className="p-4 rounded-2xl bg-skyz-surface-subtle border border-skyz-border">
                  <span className="text-xs font-mono font-bold text-skyz-text-muted uppercase block mb-3">
                    Architectural Features
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeProjectModal.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-skyz-text font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-skyz-surface-subtle border border-skyz-border text-xs text-skyz-text-muted leading-relaxed font-mono">
                  [NOTE] This project is an internal architecture showcase developed by SkyZ Solutions to validate component isolation, responsive performance, and user interaction mechanics.
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-skyz-border flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setActiveProjectModal(null);
                    navigate('contact');
                  }}
                  className="px-6 py-2.5 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] font-semibold text-xs font-mono cursor-pointer hover:bg-skyz-accent"
                >
                  Scope A Similar Architecture →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. CLOSING CTA BANNER */}
      <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-skyz-surface text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-skyz-surface-subtle border border-skyz-border">
            <Sparkles className="w-3.5 h-3.5 text-skyz-accent" />
            <span className="text-xs font-mono text-skyz-text font-bold uppercase tracking-wider">
              Have A Complex Concept?
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-skyz-text">
            Let's engineer your digital solution.
          </h2>

          <p className="text-base sm:text-lg text-skyz-text-muted max-w-xl mx-auto">
            From bespoke web development to autonomous AI pipelines, we turn ambitious ideas into working software.
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
