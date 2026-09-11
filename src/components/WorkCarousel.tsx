import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { PORTFOLIO_PROJECTS, ProjectVisual, getServiceBadgeStyle } from '../data/portfolio';
import { useNavigation } from '../context/NavigationContext';
import { Reveal, SectionShell, Blob, Eyebrow } from '../components/OpalKit';

const PILLAR_FILTERS = ['ALL', 'BUILD', 'GROW', 'AUTOMATE'] as const;

/**
 * Home portfolio preview — Labs-style tilted card showcase.
 * Shows the real case studies (shared with the Work page) as three
 * editorial cards; the center one is featured. No 3D arc, no heavy motion.
 */
export const WorkCarousel: React.FC = () => {
  const { navigate } = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const total = PORTFOLIO_PROJECTS.length;

  const orbitNext = useCallback(() => setActiveIndex((p) => (p + 1) % total), [total]);
  const orbitPrev = useCallback(() => setActiveIndex((p) => (p - 1 + total) % total), [total]);

  // Gentle autoplay, disabled for reduced motion
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const timer = setInterval(orbitNext, 4600);
    return () => clearInterval(timer);
  }, [orbitNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowLeft') orbitPrev();
      if (e.key === 'ArrowRight') orbitNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [orbitPrev, orbitNext]);

  const leftProject = PORTFOLIO_PROJECTS[(activeIndex - 1 + total) % total];
  const centerProject = PORTFOLIO_PROJECTS[activeIndex];
  const rightProject = PORTFOLIO_PROJECTS[(activeIndex + 1) % total];

  const jumpToPillar = (pillar: (typeof PILLAR_FILTERS)[number]) => {
    const idx = PORTFOLIO_PROJECTS.findIndex((p) => (pillar === 'ALL' ? true : p.pillar === pillar));
    if (idx !== -1) setActiveIndex(idx);
  };

  const Card: React.FC<{
    project: (typeof PORTFOLIO_PROJECTS)[number];
    variant: 'flank' | 'center';
  }> = ({ project, variant }) => (
    <button
      type="button"
      onClick={() => navigate('work')}
      className={`text-left rounded-[2rem] bg-skyz-bg border p-3 sm:p-4 flex flex-col cursor-pointer transition-all duration-500 ${
        variant === 'center'
          ? 'w-[300px] sm:w-[380px] border-skyz-accent/60 shadow-xl card-shadow-active'
          : 'hidden md:flex w-[300px] sm:w-[330px] border-skyz-border shadow-sm card-shadow-flank opacity-75 hover:opacity-100'
      }`}
    >
      <div className={`relative w-full rounded-[1.4rem] overflow-hidden ${variant === 'center' ? 'aspect-[16/11]' : 'aspect-[4/3]'}`}>
        <ProjectVisual project={project} />
        <span
          className={`absolute top-3 left-3 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm ${getServiceBadgeStyle(project.serviceCategory)}`}
        >
          {project.serviceCategory}
        </span>
      </div>
      <div className="p-3 sm:p-4 space-y-1.5">
        <h3 className="font-display text-lg font-bold text-skyz-text leading-snug">
          {project.title}
        </h3>
        <p className="text-xs sm:text-sm text-skyz-text-muted line-clamp-2 leading-relaxed">
          {project.description}
        </p>
        <span className="inline-flex items-center gap-1.5 pt-1 text-xs font-semibold text-skyz-accent">
          View case study
          <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </button>
  );

  return (
    <SectionShell id="work">
      <div className="bg-skyz-surface border border-skyz-border rounded-[inherit] px-4 sm:px-12 py-16 sm:py-24 relative overflow-hidden">
        <Blob className="w-[380px] h-[340px] top-1/3 -left-32 opacity-70" color="rgba(59, 130, 246, 0.10)" duration={12} />
        <Blob className="w-[360px] h-[330px] -top-20 right-[-110px] opacity-70" color="rgba(16, 185, 129, 0.09)" duration={10} />

        <div className="relative z-10 flex flex-col items-center">
          <Reveal className="text-center space-y-4 mb-12">
            <Eyebrow>Selected Work</Eyebrow>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-skyz-text">
              Made in the studio.
            </h2>
          </Reveal>

          {/* Tilted card row — center featured, flanks gently rotated */}
          <Reveal delay={0.08} className="w-full">
            <div
              className="flex items-center justify-center gap-4 sm:gap-6 select-none"
              onTouchStart={(e) => setTouchStartX(e.changedTouches[0].screenX)}
              onTouchEnd={(e) => {
                const diff = e.changedTouches[0].screenX - touchStartX;
                if (Math.abs(diff) > 40) {
                  if (diff > 0) orbitPrev();
                  else orbitNext();
                }
              }}
            >
              <motion.div
                key={`left-${leftProject.id}`}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="-rotate-3 translate-y-3 hidden md:block"
              >
                <Card project={leftProject} variant="flank" />
              </motion.div>

              <motion.div
                key={`center-${centerProject.id}`}
                initial={{ opacity: 0, scale: 0.96, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Card project={centerProject} variant="center" />
              </motion.div>

              <motion.div
                key={`right-${rightProject.id}`}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="rotate-3 translate-y-3 hidden md:block"
              >
                <Card project={rightProject} variant="flank" />
              </motion.div>
            </div>
          </Reveal>

          {/* Controls — arrows + progress dots, Labs-style */}
          <div className="flex items-center gap-4 mt-8">
            <button
              type="button"
              aria-label="Previous project"
              onClick={orbitPrev}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-skyz-bg border border-skyz-border shadow-sm flex items-center justify-center text-skyz-text hover:text-skyz-accent hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5">
              {PORTFOLIO_PROJECTS.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  aria-label={`Show ${p.title}`}
                  onClick={() => setActiveIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === activeIndex ? 'w-6 bg-skyz-accent' : 'w-1.5 bg-skyz-border hover:bg-skyz-text-muted'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              aria-label="Next project"
              onClick={orbitNext}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-skyz-bg border border-skyz-border shadow-sm flex items-center justify-center text-skyz-text hover:text-skyz-accent hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Quick-jump pillar chips — Labs-style quiet filters */}
          <Reveal delay={0.14} className="w-full">
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              {PILLAR_FILTERS.map((pillar) => (
                <button
                  key={pillar}
                  type="button"
                  onClick={() => jumpToPillar(pillar)}
                  className="px-4 py-1.5 rounded-full bg-skyz-bg border border-skyz-border text-xs font-mono font-semibold text-skyz-text-muted hover:text-skyz-text hover:border-skyz-accent/40 transition-all cursor-pointer"
                >
                  {pillar}
                </button>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="button"
                id="view-all-projects-btn"
                onClick={() => navigate('work')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] font-semibold text-xs sm:text-sm shadow-md hover:bg-skyz-accent transition-all cursor-pointer"
              >
                <span>See the Work</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
};
