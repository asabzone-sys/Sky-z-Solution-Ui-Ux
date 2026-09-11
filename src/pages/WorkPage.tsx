import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  X,
  CheckCircle2,
  Send,
  Wrench,
} from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import {
  PORTFOLIO_PROJECTS,
  PortfolioProject,
  ProjectVisual,
  getServiceBadgeStyle,
  ServiceCategory,
} from '../data/portfolio';
import {
  Reveal,
  SectionShell,
  Blob,
  VideoSection,
  Eyebrow,
} from '../components/OpalKit';

/* Floating project tiles behind the hero — the labs.google hero treatment,
   built from SkyZ's real projects instead of stock imagery. */
const HERO_TILES = PORTFOLIO_PROJECTS.slice(0, 5);
const TILE_LAYOUT = [
  { position: 'top-[5%] left-[3%] xl:left-[6%]', rotate: '-rotate-6', anim: 'animate-float-slow', delay: '0s' },
  { position: 'top-[16%] left-[20%]', rotate: 'rotate-3', anim: 'animate-float-rev', delay: '0.6s' },
  { position: 'top-[4%] right-[19%]', rotate: '-rotate-2', anim: 'animate-float-rev', delay: '1.1s' },
  { position: 'top-[14%] right-[3%] xl:right-[6%]', rotate: 'rotate-6', anim: 'animate-float-slow', delay: '0.3s' },
  { position: 'bottom-[6%] left-[12%]', rotate: 'rotate-2', anim: 'animate-float-slow', delay: '0.9s' },
];

/* Editorial grid rhythm:
   Row 1: Card 1 (Big, 2 cols) + Card 2 (Small, 1 col)
   Row 2: Card 3 (Small, 1 col) + Card 4 (Big, 2 cols)
   Row 3: Card 5 (Big, 2 cols) + Card 6 (Small, 1 col) */
const GRID_SPANS = [
  'lg:col-span-2', // Row 1: Big
  '',              // Row 1: Small
  '',              // Row 2: Small
  'lg:col-span-2', // Row 2: Big
  'lg:col-span-2', // Row 3: Big
  '',              // Row 3: Small
];

const FILTER_OPTIONS: Array<'ALL' | ServiceCategory> = [
  'ALL',
  'WEB DEVELOPMENT',
  'E-COMMERCE',
  'SEO',
  'DIGITAL MARKETING',
  'GRAPHIC DESIGN',
  'AI AUTOMATION',
];

export const WorkPage: React.FC = () => {
  const { navigate } = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | ServiceCategory>('ALL');
  const [activeModalProject, setActiveModalProject] = useState<PortfolioProject | null>(null);

  const filteredProjects = selectedFilter === 'ALL'
    ? PORTFOLIO_PROJECTS
    : PORTFOLIO_PROJECTS.filter(p => p.serviceCategory === selectedFilter);

  const scrollToGrid = () => {
    document.getElementById('portfolio-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-skyz-bg text-skyz-text transition-colors duration-200 overflow-x-hidden">

      {/* ============================================================ */}
      {/* 1. HERO — Labs-style: floating project tiles around centered  */}
      {/*    display type, very little copy, generous air               */}
      {/* ============================================================ */}
      <section className="relative w-full min-h-[86vh] sm:min-h-[82vh] flex items-center justify-center px-4 sm:px-6 py-28 sm:py-24 overflow-hidden">
        {/* Floating project tiles — desktop/tablet only so mobile breathes */}
        {HERO_TILES.map((project, i) => (
          <div
            key={project.id}
            style={{ animationDelay: TILE_LAYOUT[i].delay }}
            className={`hidden md:block absolute ${TILE_LAYOUT[i].position} ${TILE_LAYOUT[i].rotate} ${TILE_LAYOUT[i].anim} pointer-events-none select-none z-0`}
          >
            <div className="w-44 lg:w-56 aspect-[4/3] rounded-3xl overflow-hidden border border-skyz-border shadow-xl opacity-80">
              <ProjectVisual project={project} />
            </div>
          </div>
        ))}

        {/* Organic soft blobs */}
        <Blob className="w-[360px] h-[330px] -top-20 -left-28 opacity-70" color="rgba(124, 58, 237, 0.09)" duration={12} />
        <Blob className="w-[320px] h-[300px] bottom-[-80px] right-[-100px] opacity-70" color="rgba(56, 189, 248, 0.09)" duration={10} />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
          <Reveal>
            <Eyebrow>
              <span className="w-2 h-2 rounded-full bg-skyz-accent animate-pulse" />
              Selected Work
            </Eyebrow>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[0.98] text-skyz-text">
              Work that{' '}
              <span className="text-skyz-accent">ships.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="text-sm sm:text-base text-skyz-text-muted max-w-md mx-auto leading-relaxed">
              Real systems, storefronts, and brands — designed, built, and shipped end to end.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <button
              type="button"
              onClick={scrollToGrid}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] font-semibold text-sm shadow-md hover:bg-skyz-accent transition-all cursor-pointer"
            >
              <span>Explore the work</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. EDITORIAL PORTFOLIO GRID — asymmetric case-study cards     */}
      {/* ============================================================ */}
      <SectionShell id="portfolio-grid">
        <div className="bg-skyz-surface border border-skyz-border rounded-[inherit] px-5 sm:px-12 py-16 sm:py-24 relative overflow-hidden">
          <Blob className="w-[380px] h-[340px] -top-28 right-1/3 opacity-60" color="rgba(236, 72, 153, 0.06)" duration={13} />

          <div className="relative z-10">
            <Reveal>
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16">
                <div className="space-y-4">
                  <Eyebrow>The Portfolio</Eyebrow>
                  <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-skyz-text">
                    Selected projects.
                  </h2>
                </div>

                {/* Filters — quiet pills */}
                <div className="flex flex-wrap items-center gap-2">
                  {FILTER_OPTIONS.map((filter) => {
                    const isSelected = selectedFilter === filter;
                    return (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setSelectedFilter(filter)}
                        className={`px-3.5 py-1.5 rounded-full text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] shadow-sm'
                            : 'bg-skyz-bg border border-skyz-border text-skyz-text-muted hover:text-skyz-text hover:border-skyz-accent/40'
                        }`}
                      >
                        {filter}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Reveal>

            {/* Asymmetric editorial grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
              {filteredProjects.map((project, idx) => {
                const isWide = selectedFilter === 'ALL' && GRID_SPANS[idx % GRID_SPANS.length] !== '';
                const spanClass = selectedFilter === 'ALL' ? GRID_SPANS[idx % GRID_SPANS.length] : '';
                return (
                  <Reveal
                    key={project.id}
                    delay={(idx % 3) * 0.07}
                    className={`${spanClass} h-full`}
                  >
                    <motion.button
                      type="button"
                      onClick={() => setActiveModalProject(project)}
                      whileHover={{ y: -6 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                      className="group w-full h-full text-left rounded-[1.75rem] overflow-hidden border border-skyz-border bg-skyz-bg shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col"
                    >
                      {/* Visual */}
                      <div className={`relative w-full overflow-hidden ${isWide ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
                        <div className="w-full h-full transition-transform duration-700 group-hover:scale-[1.05]">
                          <ProjectVisual project={project} />
                        </div>
                        <span
                          className={`absolute top-3.5 left-3.5 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm ${getServiceBadgeStyle(project.serviceCategory)}`}
                        >
                          {project.serviceCategory}
                        </span>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-11 h-11 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                            <ArrowUpRight className="w-5 h-5 text-black" />
                          </span>
                        </div>
                      </div>

                      {/* Minimal caption */}
                      <div className="p-5 sm:p-6 flex flex-col gap-1.5 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="font-display text-lg sm:text-xl font-bold text-skyz-text group-hover:text-skyz-accent transition-colors leading-snug">
                            {project.title}
                          </h3>
                          <ArrowUpRight className="w-4 h-4 text-skyz-text-muted group-hover:text-skyz-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
                        </div>
                        <p className="text-xs sm:text-sm text-skyz-text-muted">
                          {project.clientSector} · {project.tags[0]}
                        </p>
                        {isWide && (
                          <p className="text-sm text-skyz-text-muted mt-1.5 leading-relaxed line-clamp-2">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </motion.button>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </SectionShell>

      {/* ============================================================ */}
      {/* 3. VIDEO — shared Putty-style treatment, used once            */}
      {/* ============================================================ */}
      <SectionShell>
        <div className="relative rounded-[inherit] px-2 py-14 sm:py-20 bg-gradient-to-b from-skyz-surface-subtle/60 to-transparent overflow-hidden">
          <Blob className="w-[380px] h-[340px] top-6 -right-28 opacity-60" color="rgba(124, 58, 237, 0.07)" duration={11} />
          <div className="relative z-10">
            <VideoSection
              heading="See the work in motion"
              caption="A short tour through how these projects move from first sketch to a running, measurable system."
              title="SkyZ Solutions — Selected work showcase"
              videoId="QEJhjQSdG-M"
            />
          </div>
        </div>
      </SectionShell>

      {/* ============================================================ */}
      {/* 4. CLOSING CTA — Opal-style soft panel + input pill           */}
      {/* ============================================================ */}
      <SectionShell>
        <div className="relative rounded-[inherit] bg-skyz-accent-muted border border-skyz-accent/20 px-5 sm:px-12 py-20 sm:py-28 text-center overflow-hidden">
          <Blob className="w-[320px] h-[300px] -top-24 -left-20 opacity-80" color="rgba(124, 58, 237, 0.12)" duration={10} />
          <Blob className="w-[340px] h-[320px] -bottom-28 -right-24 opacity-80" color="rgba(56, 189, 248, 0.12)" duration={12} />

          <div className="relative z-10 max-w-2xl mx-auto space-y-9">
            <Reveal>
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-skyz-text leading-tight">
                Got an idea like these?
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <button
                type="button"
                onClick={() => navigate('contact')}
                className="group w-full max-w-xl mx-auto flex items-center justify-between gap-3 pl-6 pr-3 py-3 rounded-full bg-skyz-surface border border-skyz-border shadow-lg transition-all cursor-pointer text-left hover:border-skyz-accent/40"
              >
                <span className="flex items-center gap-3 text-xs sm:text-sm text-skyz-text font-medium truncate">
                  <Wrench className="w-4 h-4 text-skyz-accent flex-shrink-0" />
                  Tell us what you want to build
                </span>
                <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] text-xs sm:text-sm font-semibold flex-shrink-0 transition-transform group-hover:translate-x-0.5">
                  Start
                  <Send className="w-3.5 h-3.5" />
                </span>
              </button>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="text-xs font-mono text-skyz-text-muted">
                BUILD • GROW • AUTOMATE — ONE CONNECTED STUDIO
              </p>
            </Reveal>
          </div>
        </div>
      </SectionShell>

      {/* ============================================================ */}
      {/* 5. MODAL — the full case-study detail lives off the grid      */}
      {/* ============================================================ */}
      <AnimatePresence>
        {activeModalProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-3xl rounded-[2rem] bg-skyz-surface border border-skyz-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="relative aspect-[16/9] sm:aspect-[21/9]">
                <ProjectVisual project={activeModalProject} />
                <button
                  type="button"
                  aria-label="Close Project Preview"
                  onClick={() => setActiveModalProject(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border backdrop-blur-sm ${getServiceBadgeStyle(activeModalProject.serviceCategory)}`}>
                    {activeModalProject.serviceCategory}
                  </span>
                  <span className="text-xs font-mono text-white/80">
                    [{activeModalProject.pillar}]
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-skyz-text">
                    {activeModalProject.title}
                  </h3>
                  <div className="text-xs font-mono text-skyz-text-muted mt-1">
                    {activeModalProject.clientSector}
                  </div>
                </div>

                <p className="text-sm text-skyz-text leading-relaxed">
                  {activeModalProject.description}
                </p>

                <div className="space-y-2">
                  <h4 className="font-display text-sm font-bold uppercase tracking-wider text-skyz-text-muted">
                    Key Scope Deliverables
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-skyz-text">
                    {activeModalProject.deliverables.map((item) => (
                      <div key={item} className="flex items-center gap-2 p-2 rounded-lg bg-skyz-surface-subtle border border-skyz-border">
                        <CheckCircle2 className="w-3.5 h-3.5 text-skyz-accent flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeModalProject.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded bg-skyz-surface-subtle border border-skyz-border text-[11px] font-mono text-skyz-text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-skyz-border bg-skyz-surface-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs font-mono text-skyz-text-muted">
                  Ready to scope a similar project?
                </span>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setActiveModalProject(null)}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-full border border-skyz-border text-xs font-semibold text-skyz-text hover:bg-skyz-surface cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModalProject(null);
                      navigate('contact', { serviceCategory: activeModalProject.pillar });
                    }}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] font-semibold text-xs shadow-sm hover:bg-skyz-accent cursor-pointer"
                  >
                    <span>Start Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
