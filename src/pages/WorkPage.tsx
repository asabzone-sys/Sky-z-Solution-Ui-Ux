import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useMotionPreference } from '../context/MotionPreferenceContext';
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
import { useProjects } from '../lib/supabase';
import { ModalPortal } from '../components/ModalPortal';

const EASE = [0.16, 1, 0.3, 1] as const;

const HERO_TILES_COUNT = 5;

/** word-by-word masked rise for chapter titles — editorial, not a fade-up */
const TitleRise: React.FC<{ text: string }> = ({ text }) => {
  const words = text.split(' ');
  return (
    <h3 className="mt-3 font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-skyz-text leading-[1.05]">
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-top">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </h3>
  );
};

/* Floating project tiles behind the hero — the labs.google hero treatment,
   built from SkyZ's real projects instead of stock imagery. */
const TILE_LAYOUT = [
  { position: 'top-[3%] sm:top-[5%] left-[2%] xl:left-[6%]', rotate: '-rotate-6', anim: 'animate-float-slow', delay: '0s' },
  { position: 'top-[12%] sm:top-[16%] left-[10%] sm:left-[20%]', rotate: 'rotate-3', anim: 'animate-float-rev', delay: '0.6s' },
  { position: 'top-[3%] sm:top-[4%] right-[8%] sm:right-[19%]', rotate: '-rotate-2', anim: 'animate-float-rev', delay: '1.1s' },
  { position: 'top-[12%] sm:top-[14%] right-[2%] xl:right-[6%]', rotate: 'rotate-6', anim: 'animate-float-slow', delay: '0.3s' },
  { position: 'bottom-[4%] sm:bottom-[6%] left-[6%] sm:left-[12%]', rotate: 'rotate-2', anim: 'animate-float-slow', delay: '0.9s' },
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

/* ------------------------------------------------------------------ */
/* ProjectChapter — one project as a scroll-driven scene.              */
/* Identity vs Studio: Studio alternates side-by-side scenes; here the */
/* visual is sticky on desktop while the story column scrolls past it, */
/* with a progress hairline tying the chapter together. Mobile stacks  */
/* naturally — visual first, story below — with local parallax.        */
/* ------------------------------------------------------------------ */
const ProjectChapter: React.FC<{
  project: PortfolioProject;
  index: number;
  onOpen: (p: PortfolioProject) => void;
}> = ({ project, index, onOpen }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = !useMotionPreference().motionEnabled;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const imgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1, 1.015]);
  const textY = useTransform(scrollYProgress, [0, 1], [34, -34]);
  // progress hairline — draws across the chapter as you move through it
  const progressScale = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  return (
    <div ref={ref} className="relative py-10 sm:py-16">
      {/* ghost numeral — the chapter's quiet editorial signature */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 1.1, ease: EASE }}
        className={`absolute top-2 font-display font-extrabold leading-none select-none pointer-events-none ${
          index % 2 === 0 ? 'right-0 md:right-4' : 'left-0 md:left-4'
        }`}
        style={{ fontSize: 'clamp(9rem, 30vw, 22rem)', color: `${project.accentColor}12` }}
      >
        {String(index + 1).padStart(2, '0')}
      </motion.span>

      {/* chapter hairline — the scroll-progress detail */}
      <div className="absolute top-0 left-4 right-4 sm:left-10 sm:right-10 h-px bg-skyz-border-subtle" aria-hidden>
        <motion.div
          style={reduced ? { scaleX: 1 } : { scaleX: progressScale }}
          className="h-full origin-left"
        >
          <div className="h-full w-full bg-skyz-accent/50" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-8 md:gap-12">
        {/* sticky media column (desktop) / natural block (mobile) */}
        <div className="md:col-span-7">
          <motion.div
            style={reduced ? undefined : { y: imgY }}
            className="md:sticky md:top-24"
          >
            <motion.button
              type="button"
              onClick={() => onOpen(project)}
              aria-label={`Open case study: ${project.title}`}
              className="group relative block w-full text-left cursor-pointer"
            >
              <motion.div
                style={reduced ? undefined : { scale: imgScale }}
                className={`relative overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] border border-skyz-border card-shadow-flank ${
                  index % 3 === 0 ? 'aspect-[16/10]' : 'aspect-[4/3]'
                }`}
              >
                <motion.div
                  initial={reduced ? undefined : { clipPath: 'inset(0 0 100% 0)' }}
                  whileInView={reduced ? undefined : { clipPath: 'inset(0 0 0% 0)' }}
                  viewport={{ once: true, margin: '-18%' }}
                  transition={{ duration: 1.05, ease: EASE }}
                  className="w-full h-full"
                >
                  <ProjectVisual project={project} />
                </motion.div>
                <div className="hidden md:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/20">
                  <span className="px-5 py-2.5 rounded-full bg-white/95 text-black text-sm font-semibold shadow-xl">
                    Open case study
                  </span>
                </div>
              </motion.div>
              {/* meta strip under the visual */}
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${getServiceBadgeStyle(project.serviceCategory)}`}>
                  {project.serviceCategory}
                </span>
                <span className="font-mono text-[10px] text-skyz-text-muted tracking-widest">
                  {String(index + 1).padStart(2, '0')} / {String(PORTFOLIO_PROJECTS.length).padStart(2, '0')}
                </span>
              </div>
            </motion.button>
          </motion.div>
        </div>

        {/* story column */}
        <motion.div style={reduced ? undefined : { y: textY }} className="md:col-span-5 flex flex-col justify-center">
          <span className="font-mono text-[10px] tracking-[0.25em] text-skyz-accent font-bold">
            {project.pillar} — {project.clientSector.toUpperCase()}
          </span>
          <TitleRise text={project.title} />
          <p className="mt-5 text-sm sm:text-base text-skyz-text-muted leading-relaxed max-w-md">
            {project.description}
          </p>

          {/* deliverables — quiet list, not chips */}
          <ul className="mt-6 space-y-2">
            {project.deliverables.slice(0, 3).map((d) => (
              <li key={d} className="flex items-center gap-2.5 text-xs sm:text-sm text-skyz-text-muted">
                <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: project.accentColor }} />
                {d}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => onOpen(project)}
            className="group mt-7 inline-flex items-center gap-2 self-start px-5 py-2.5 rounded-full border border-skyz-border text-sm font-semibold text-skyz-text hover:border-skyz-accent/50 transition-all cursor-pointer"
          >
            Read the story
            <ArrowRight className="w-4 h-4 text-skyz-accent transition-transform group-hover:translate-x-0.5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export const WorkPage: React.FC = () => {
  const { navigate } = useNavigation();
  const PORTFOLIO_PROJECTS = useProjects();
  const HERO_TILES = PORTFOLIO_PROJECTS.slice(0, HERO_TILES_COUNT);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | ServiceCategory>('ALL');
  const [activeModalProject, setActiveModalProject] = useState<PortfolioProject | null>(null);
  const reduced = !useMotionPreference().motionEnabled;

  const chaptersRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: chaptersRef, offset: ['start end', 'end start'] });
  // inline-text drift (smaller on phones) — never widens the block box
  const [drift, setDrift] = useState(18);
  useEffect(() => {
    const f = () => setDrift(window.innerWidth < 640 ? 18 : 40);
    f();
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  const headingX = useTransform(scrollYProgress, [0, 1], [drift, -drift]);

  const filteredProjects = selectedFilter === 'ALL'
    ? PORTFOLIO_PROJECTS
    : PORTFOLIO_PROJECTS.filter(p => p.serviceCategory === selectedFilter);

  const scrollToChapters = () => {
    document.getElementById('portfolio-stories')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-skyz-bg text-skyz-text transition-colors duration-200">

      {/* ============================================================ */}
      {/* 1. HERO — kept as approved (floating tiles + display type)    */}
      {/* ============================================================ */}
      <section className="relative w-full min-h-[86vh] sm:min-h-[82vh] flex items-center justify-center px-4 sm:px-6 py-28 sm:py-24 overflow-hidden">
        {HERO_TILES.map((project, i) => (
          <div
            key={project.id}
            style={{ animationDelay: TILE_LAYOUT[i].delay }}
            className={`block absolute ${TILE_LAYOUT[i].position} ${TILE_LAYOUT[i].rotate} ${TILE_LAYOUT[i].anim} pointer-events-none select-none z-0`}
          >
            <div className="w-24 sm:w-36 md:w-44 lg:w-56 aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden border border-skyz-border shadow-md sm:shadow-xl opacity-70 sm:opacity-80">
              <ProjectVisual project={project} />
            </div>
          </div>
        ))}

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
              onClick={scrollToChapters}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] font-semibold text-sm shadow-md hover:bg-skyz-accent transition-all cursor-pointer"
            >
              <span>Explore the work</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. STORY CHAPTERS — each project is a scene, not a card       */}
      {/* ============================================================ */}
      <div id="portfolio-stories" ref={chaptersRef} className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-4">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-skyz-text">
              <motion.span
                style={reduced ? undefined : { x: headingX }}
                className="inline-block will-change-transform"
              >
                The stories <span className="text-skyz-text-muted">behind it.</span>
              </motion.span>
            </h2>

            {/* Filters — quiet pills, kept from the approved design */}
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
        </div>

        {/* keyed remount → instant swap, new chapters fade in (no exit wait) */}
        <motion.div
          key={selectedFilter}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0.12 : 0.45, ease: EASE }}
        >
          {filteredProjects.map((project, idx) => (
            <ProjectChapter
              key={project.id}
              project={project}
              index={idx}
              onOpen={setActiveModalProject}
            />
          ))}
        </motion.div>
      </div>

      {/* ============================================================ */}
      {/* 3. VIDEO — shared Putty-style treatment, kept                 */}
      {/* ============================================================ */}
      <SectionShell>
        <div className="relative rounded-[inherit] px-2 py-14 sm:py-20 bg-gradient-to-b from-skyz-surface-subtle/60 to-transparent overflow-hidden">
          <Blob className="w-[380px] h-[340px] top-6 -right-28 opacity-60" color="rgba(124, 58, 237, 0.07)" duration={11} />
          <div className="relative z-10">
            <VideoSection
              heading="See the work in motion"
              caption="A short tour through how these projects move from first sketch to a running, measurable system."
              title="SkyZ Solutions — Selected work showcase"
              videoId="dYISWlAxUVs"
            />
          </div>
        </div>
      </SectionShell>

      {/* ============================================================ */}
      {/* 4. CLOSING CTA — kept                                         */}
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
      {/* 5. MODAL — kept from the approved design                      */}
      {/* ============================================================ */}
      <AnimatePresence>
        {activeModalProject && (
          <ModalPortal>
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
          </ModalPortal>
        )}
      </AnimatePresence>

    </div>
  );
};
