import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Layers, 
  TrendingUp, 
  Bot, 
  Sparkles, 
  Compass, 
  Code2, 
  CheckCircle2, 
  Workflow, 
  Zap, 
  Cpu, 
  Eye, 
  Sliders,
  ChevronRight
} from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

export const AboutPage: React.FC = () => {
  const { navigate } = useNavigation();
  const [activeLetterHover, setActiveLetterHover] = useState<number | null>(null);
  const [activeEcosystemStage, setActiveEcosystemStage] = useState<'BUILD' | 'GROW' | 'AUTOMATE'>('BUILD');

  const interactiveLetters = "AUTONOMOUS".split("");

  const ecosystemStages = {
    BUILD: {
      number: '01',
      title: 'Foundations & Architecture',
      services: ['Web Development', 'E-commerce'],
      description: 'We engineer high-performance web applications, responsive digital storefronts, and modular design systems from first principles.',
      microLanguage: ['BUILD', 'LAYOUT', 'INTERFACE', 'DEPLOY'],
      output: 'Production-ready web platform with zero bloat.',
      accent: 'text-sky-500',
      bgLight: 'bg-sky-500/10 border-sky-500/20'
    },
    GROW: {
      number: '02',
      title: 'Visibility & Authority',
      services: ['SEO', 'Digital Marketing', 'Graphic Design'],
      description: 'We align technical search indexing, targeted customer acquisition funnels, and recognizable brand identity systems.',
      microLanguage: ['GROW', 'OPTIMIZE', 'INDEX', 'CRAFT'],
      output: 'High-intent audience conversion and brand presence.',
      accent: 'text-purple-500',
      bgLight: 'bg-purple-500/10 border-purple-500/20'
    },
    AUTOMATE: {
      number: '03',
      title: 'Intelligent Workflows',
      services: ['AI Automation'],
      description: 'We orchestrate autonomous AI agents and bidirectional API integrations that run repetitive customer and operational tasks 24/7.',
      microLanguage: ['AUTOMATE', 'WORKFLOW', 'PROCESS', 'LOGIC'],
      output: 'Continuous operational leverage without manual overhead.',
      accent: 'text-amber-500',
      bgLight: 'bg-amber-500/10 border-amber-500/20'
    }
  };

  const principles = [
    {
      number: '01',
      token: 'PURPOSE',
      title: 'Purpose Over Novelty',
      description: 'We select technologies strictly for their business utility, speed, and durability—never temporary hype or unneeded complexity.'
    },
    {
      number: '02',
      token: 'ERGONOMICS',
      title: 'Interfaces for Humans',
      description: 'Software is an instrument. We design ergonomic interfaces with high typographic contrast, fast feedback, and fluid interaction.'
    },
    {
      number: '03',
      token: 'CONTINUITY',
      title: 'Continuous Pipeline',
      description: 'What we build is designed to be found, and what is found is designed to operate autonomously. Code, growth, and automation in unison.'
    },
    {
      number: '04',
      token: 'MODULARITY',
      title: 'Built to Scale',
      description: 'Clean data contracts, modular components, and accessible patterns that adapt effortlessly as organizational demands expand.'
    }
  ];

  return (
    <div className="w-full bg-skyz-bg text-skyz-text transition-colors duration-200 overflow-x-hidden">
      
      {/* 1. HERO WITH PLAYFUL KINETIC TYPOGRAPHY & MICRO-ANNOTATIONS */}
      <section className="w-full pt-12 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b border-skyz-border relative overflow-hidden bg-dots-pattern">
        {/* Organic curved glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-skyz-accent/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Editorial Ribbon */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-skyz-surface border border-skyz-border shadow-sm">
              <span className="w-2 h-2 rounded-full bg-skyz-accent animate-pulse" />
              <span className="text-xs text-skyz-text-muted uppercase tracking-wider font-semibold">
                Studio Manifesto // SkyZ Solutions
              </span>
            </div>
            <span className="hidden sm:inline-block font-mono text-xs text-skyz-text-muted">
              EST. STUDIO // CREATIVE TECH
            </span>
          </div>

          {/* Kinetic Interactive Letters */}
          <div className="relative my-8 select-none">
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-display font-extrabold tracking-tight leading-none text-skyz-text">
              {interactiveLetters.map((char, i) => (
                <motion.span
                  key={i}
                  className="inline-block cursor-pointer transition-colors relative"
                  whileHover={{ 
                    scale: 1.15, 
                    rotate: i % 2 === 0 ? 5 : -5,
                    color: 'var(--accent)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setActiveLetterHover(i)}
                  onHoverEnd={() => setActiveLetterHover(null)}
                >
                  {char}
                  {activeLetterHover === i && (
                    <motion.span 
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: -20, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-skyz-accent text-white shadow-md pointer-events-none z-20"
                    >
                      {['SYSTEM', 'LAYOUT', 'INTERFACE', 'DEPLOY', 'DESIGN', 'GROW', 'OPTIMIZE', 'AUTOMATE', 'WORKFLOW', 'SCALE'][i]}
                    </motion.span>
                  )}
                </motion.span>
              ))}
            </div>

            <div className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight text-skyz-accent mt-2 sm:mt-4">
              SYSTEMS &amp; SOFTWARE.
            </div>
          </div>

          {/* High-Impact Statement */}
          <div className="max-w-3xl mt-8">
            <p className="text-lg sm:text-xl md:text-2xl text-skyz-text-muted leading-relaxed">
              We engineer what matters and eliminate what doesn’t. Crafting bespoke digital foundations through{' '}
              <span className="inline-block px-3 py-0.5 rounded-full bg-skyz-surface border border-skyz-border font-semibold text-skyz-text shadow-sm">
                clean code
              </span>
              , targeted growth, and autonomous workflows.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('contact')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] font-semibold text-sm shadow-md hover:bg-skyz-accent transition-all cursor-pointer"
            >
              <span>Start a Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('work')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-skyz-surface text-skyz-text font-medium text-sm border border-skyz-border hover:border-skyz-accent/40 transition-all cursor-pointer"
            >
              <span>Explore Prototypes</span>
            </button>
          </div>

        </div>
      </section>

      {/* 2. WHO WE ARE: SHORT EDITORIAL STATEMENT */}
      <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-skyz-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-skyz-surface border border-skyz-border">
                <Compass className="w-3.5 h-3.5 text-skyz-accent" />
                <span className="text-xs font-mono uppercase text-skyz-text-muted font-semibold">
                  01 // WHO WE ARE
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-skyz-text">
                A creative technology studio with technical discipline.
              </h2>
            </div>

            <div className="lg:col-span-7 space-y-5 text-base sm:text-lg text-skyz-text-muted leading-relaxed">
              <p>
                SkyZ Solutions is an integrated digital studio built around solving concrete business problems. We don't believe in vanity features or fragmented agency handoffs.
              </p>
              <p>
                We unite bespoke web development, search &amp; audience growth, and autonomous AI pipelines into a single continuous discipline. Every website we launch is architected to perform, scale, and work autonomously.
              </p>
              
              {/* Creative technical annotation cards */}
              <div className="pt-2 grid grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-skyz-surface border border-skyz-border">
                  <span className="text-skyz-accent font-bold block">01 // BUILD</span>
                  <span className="text-skyz-text">Code &amp; Commerce</span>
                </div>
                <div className="p-3 rounded-xl bg-skyz-surface border border-skyz-border">
                  <span className="text-purple-500 font-bold block">02 // GROW</span>
                  <span className="text-skyz-text">Search &amp; Design</span>
                </div>
                <div className="p-3 rounded-xl bg-skyz-surface border border-skyz-border">
                  <span className="text-amber-500 font-bold block">03 // AUTOMATE</span>
                  <span className="text-skyz-text">Agents &amp; API Logic</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. ORGANIC SECTION DIVIDER */}
      <div className="w-full relative h-10 overflow-hidden pointer-events-none -mt-px">
        <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path 
            d="M0 0C400 32 800 32 1440 0V40H0V0Z" 
            className="fill-skyz-surface-subtle opacity-30 dark:opacity-15"
          />
        </svg>
      </div>

      {/* 4. BUILD → GROW → AUTOMATE INTERACTIVE VISUAL JOURNEY */}
      <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-skyz-border bg-skyz-surface-subtle/30">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-skyz-surface border border-skyz-border">
              <Workflow className="w-3.5 h-3.5 text-skyz-accent" />
              <span className="text-xs font-mono uppercase text-skyz-text-muted font-semibold">
                02 // THE CONTINUOUS SYSTEM
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-skyz-text">
              BUILD → GROW → AUTOMATE
            </h2>
            <p className="text-sm sm:text-base text-skyz-text-muted">
              Explore how each pillar connects directly into the next to form an autonomous digital operating loop.
            </p>
          </div>

          {/* Interactive Stage Navigator */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1.5 rounded-2xl bg-skyz-surface border border-skyz-border shadow-sm">
              {(['BUILD', 'GROW', 'AUTOMATE'] as const).map((stage) => {
                const isSelected = activeEcosystemStage === stage;
                return (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => setActiveEcosystemStage(stage)}
                    className={`relative px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      isSelected ? 'text-white dark:text-[#080B10]' : 'text-skyz-text-muted hover:text-skyz-text'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="aboutPillarPill"
                        className="absolute inset-0 bg-skyz-text dark:bg-skyz-accent rounded-xl -z-10 shadow-sm"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span>{stage}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Stage Canvas */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeEcosystemStage}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.25 }}
              className="max-w-4xl mx-auto p-6 sm:p-10 rounded-3xl bg-skyz-surface border border-skyz-border shadow-xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-skyz-border mb-6">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${ecosystemStages[activeEcosystemStage].bgLight} ${ecosystemStages[activeEcosystemStage].accent}`}>
                    STAGE {ecosystemStages[activeEcosystemStage].number} // {activeEcosystemStage}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {ecosystemStages[activeEcosystemStage].microLanguage.map((token, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-skyz-surface-subtle text-skyz-text-muted border border-skyz-border">
                      {token}
                    </span>
                  ))}
                </div>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-skyz-text">
                {ecosystemStages[activeEcosystemStage].title}
              </h3>
              <p className="text-base sm:text-lg text-skyz-text-muted mt-3 leading-relaxed">
                {ecosystemStages[activeEcosystemStage].description}
              </p>

              {/* Service Capabilities in this Stage */}
              <div className="mt-6 pt-6 border-t border-skyz-border grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-mono text-skyz-text-muted block mb-2 font-bold uppercase">
                    Primary Services
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {ecosystemStages[activeEcosystemStage].services.map((svc, i) => (
                      <span 
                        key={i} 
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-skyz-surface-subtle text-skyz-text border border-skyz-border"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-mono text-skyz-text-muted block mb-2 font-bold uppercase">
                    Stage Outcome
                  </span>
                  <div className="text-xs font-mono text-skyz-text p-2.5 rounded-xl bg-skyz-surface-subtle border border-skyz-border">
                    {ecosystemStages[activeEcosystemStage].output}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </section>

      {/* 5. HOW WE THINK: 4 SHORT PRINCIPLES */}
      <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-skyz-border">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-skyz-surface border border-skyz-border mb-3">
                <Sparkles className="w-3.5 h-3.5 text-skyz-accent" />
                <span className="text-xs font-mono uppercase text-skyz-text-muted font-semibold">
                  03 // HOW WE THINK
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-skyz-text">
                Core Principles.
              </h2>
            </div>
            <span className="text-xs font-mono text-skyz-text-muted">
              ENGINEERING INTEGRITY // ZERO VANITY
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((principle) => (
              <motion.div
                key={principle.number}
                whileHover={{ y: -4 }}
                className="p-6 rounded-3xl bg-skyz-surface border border-skyz-border shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-skyz-accent">
                      {principle.number}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-skyz-surface-subtle text-skyz-text-muted border border-skyz-border">
                      {principle.token}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-skyz-text">
                    {principle.title}
                  </h3>
                  <p className="text-sm text-skyz-text-muted mt-3 leading-relaxed">
                    {principle.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-skyz-border text-[11px] font-mono text-skyz-text-muted">
                  DISCIPLINE // VERIFIED
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. VISION STATEMENT & FINAL CTA */}
      <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-skyz-surface text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-skyz-surface-subtle border border-skyz-border">
            <span className="w-2 h-2 rounded-full bg-skyz-accent animate-pulse" />
            <span className="text-xs font-mono text-skyz-text font-bold uppercase tracking-wider">
              04 // VISION
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-skyz-text leading-tight">
            Replacing fragmented agency handoffs with unified digital systems.
          </h2>

          <p className="text-base sm:text-lg text-skyz-text-muted max-w-xl mx-auto">
            Ready to experience an integrated technical partnership that delivers real software, real growth, and autonomous operations?
          </p>

          <div className="pt-4 flex justify-center">
            <button
              type="button"
              onClick={() => navigate('contact')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] font-semibold text-sm shadow-md hover:bg-skyz-accent transition-all cursor-pointer"
            >
              <span>Work With SkyZ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
