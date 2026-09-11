import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Compass,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import {
  Reveal,
  SectionShell,
  Blob,
  VideoSection,
  Eyebrow,
  FloatingTag,
} from '../components/OpalKit';

export const AboutPage: React.FC = () => {
  const { navigate } = useNavigation();

  const principles = [
    {
      num: '01',
      title: 'Build for Real Utility',
      desc: 'We write software to solve practical business challenges, not to chase temporary tech trends.',
      tag: 'PURPOSE',
      blobColor: 'rgba(14, 165, 233, 0.16)',
    },
    {
      num: '02',
      title: 'Designed for People',
      desc: 'Clean layouts and intuitive interfaces that customers and team members love using from day one.',
      tag: 'CLARITY',
      blobColor: 'rgba(236, 72, 153, 0.14)',
    },
    {
      num: '03',
      title: 'Connected Together',
      desc: 'Your website, marketing reach, and automated workflows are built to support one another seamlessly.',
      tag: 'HARMONY',
      blobColor: 'rgba(168, 85, 247, 0.14)',
    },
    {
      num: '04',
      title: 'Built to Last',
      desc: 'Reliable, well-structured foundations that scale effortlessly as your business expands.',
      tag: 'LONGEVITY',
      blobColor: 'rgba(245, 158, 11, 0.16)',
    },
  ];

  return (
    <div className="w-full bg-skyz-bg text-skyz-text transition-colors duration-200 overflow-x-hidden">

      {/* ================================================================ */}
      {/* 1. HERO — Labs-style kinetic typography on breathing space        */}
      {/* ================================================================ */}
      <section className="w-full pt-14 pb-20 sm:pt-24 sm:pb-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Organic color blobs behind the type — Labs playfulness */}
        <Blob className="w-[420px] h-[380px] -top-24 -left-32 opacity-80" color="rgba(124, 58, 237, 0.10)" duration={11} />
        <Blob className="w-[360px] h-[320px] top-10 right-[-120px] opacity-70" color="rgba(236, 72, 153, 0.09)" duration={13} />
        <Blob className="w-[300px] h-[280px] bottom-[-100px] left-1/3 opacity-60" color="rgba(56, 189, 248, 0.10)" duration={9} />

        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10 sm:mb-14">
              <Eyebrow>
                <span className="w-2 h-2 rounded-full bg-skyz-accent animate-pulse" />
                Studio Story // SkyZ Solutions
              </Eyebrow>
              <div className="flex items-center gap-2 font-mono text-[11px] text-skyz-text-muted">
                <span className="px-2.5 py-1 rounded-full bg-skyz-surface border border-skyz-border">EST. 2024</span>
                <span className="text-skyz-accent font-bold">DIGITAL CRAFT</span>
              </div>
            </div>
          </Reveal>

          {/* Kinetic display type — hover each word for playful motion */}
          <Reveal delay={0.08}>
            <h1 className="font-display font-black text-[13vw] sm:text-6xl md:text-8xl lg:text-[7.5rem] tracking-tight leading-[0.95] select-none">
              <span className="inline-flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6">
                {['WE', 'BUILD', 'DIGITAL'].map((word, i) => (
                  <motion.span
                    key={word}
                    whileHover={{ scale: 1.06, rotate: i % 2 === 0 ? -2 : 2 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 14 }}
                    className="inline-block cursor-default"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
              <span className="inline-flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6 mt-1 sm:mt-3">
                <motion.span
                  whileHover={{ scale: 1.06, rotate: 2 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 14 }}
                  className="inline-block cursor-default"
                >
                  TOOLS
                </motion.span>
                <motion.span
                  whileHover={{ scale: 1.06, rotate: -2 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 14 }}
                  className="inline-flex items-center px-4 py-1.5 sm:px-6 sm:py-2 rounded-2xl sm:rounded-3xl border-2 border-dashed border-purple-400 bg-purple-500/10 text-purple-500 cursor-default"
                >
                  THAT
                </motion.span>
                <motion.span
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 14 }}
                  className="inline-block text-skyz-accent cursor-default"
                >
                  WORK.
                </motion.span>
              </span>
            </h1>

            {/* Floating cursor-tag badges — Putty hero flavor */}
            <FloatingTag className="top-2 right-[8%] bg-green-400 text-black -rotate-6" delay={0.5}>
              ✦ FAST
            </FloatingTag>
            <FloatingTag className="top-24 right-[22%] bg-pink-400 text-white rotate-3" delay={0.8}>
              ✦ CLEAN
            </FloatingTag>
            <FloatingTag className="top-44 right-[4%] bg-blue-400 text-white rotate-6" delay={1.1}>
              ✦ CONNECTED
            </FloatingTag>
          </Reveal>

          {/* Human statement + actions */}
          <Reveal delay={0.16}>
            <p className="max-w-2xl mt-10 text-lg sm:text-xl md:text-2xl text-skyz-text-muted leading-relaxed">
              We make technology work for your business. Fast websites, targeted customer growth, and smart automations built without unnecessary complexity.
            </p>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('services')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] font-semibold text-sm shadow-md hover:bg-skyz-accent transition-all cursor-pointer"
              >
                <span>Explore Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('contact')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-skyz-surface text-skyz-text font-medium text-sm border border-skyz-border hover:border-skyz-accent/40 transition-all cursor-pointer"
              >
                <span>Talk to Our Team</span>
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 2. WHO WE ARE — floating Opal shell, editorial split              */}
      {/* ================================================================ */}
      <SectionShell>
        <div className="bg-skyz-surface border border-skyz-border rounded-[inherit] px-6 py-16 sm:px-14 sm:py-24">
          <Blob className="w-[380px] h-[340px] -top-28 -right-24 opacity-70" color="rgba(124, 58, 237, 0.07)" duration={12} />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <Reveal className="lg:col-span-5 space-y-5">
              <Eyebrow>
                <Compass className="w-3.5 h-3.5 text-skyz-accent" />
                Who We Are
              </Eyebrow>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-skyz-text leading-tight">
                A creative digital technology studio.
              </h2>
            </Reveal>

            <div className="lg:col-span-7 space-y-6">
              <Reveal delay={0.08}>
                <p className="text-lg sm:text-xl text-skyz-text-muted leading-relaxed">
                  SkyZ Solutions is a creative digital technology studio. We build modern websites, expand digital audiences, and automate everyday business workflows. No fluff, no complicated handoffs—just clean software and direct results.
                </p>
              </Reveal>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {[
                  { label: 'BUILD', sub: 'Web & Commerce', color: 'text-sky-500' },
                  { label: 'GROW', sub: 'Search & Design', color: 'text-purple-500' },
                  { label: 'AUTOMATE', sub: 'Workflows & AI', color: 'text-amber-500' },
                ].map((item, i) => (
                  <Reveal key={item.label} delay={0.1 + i * 0.07}>
                    <motion.div
                      whileHover={{ y: -4, rotate: i % 2 === 0 ? -1 : 1 }}
                      className="p-4 sm:p-5 rounded-2xl bg-skyz-surface-subtle border border-skyz-border font-mono text-xs h-full"
                    >
                      <span className={`${item.color} font-bold block text-sm mb-1`}>{item.label}</span>
                      <span className="text-skyz-text text-[11px]">{item.sub}</span>
                    </motion.div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionShell>

      {/* ================================================================ */}
      {/* 3. VIDEO — Putty-style embed card ("The Demo" position)           */}
      {/* ================================================================ */}
      <SectionShell>
        <div className="relative rounded-[inherit] px-2 py-14 sm:py-20 bg-gradient-to-b from-skyz-surface-subtle/60 to-transparent overflow-hidden">
          <Blob className="w-[420px] h-[380px] top-6 -left-32 opacity-60" color="rgba(56, 189, 248, 0.08)" duration={12} />
          <Blob className="w-[360px] h-[340px] bottom-0 -right-24 opacity-60" color="rgba(168, 85, 247, 0.08)" duration={10} />
          <div className="relative z-10">
            <VideoSection
              heading="See how we work"
              caption="A two-minute tour of how SkyZ designs, builds, and ships digital tools for real businesses."
              title="Inside SkyZ Solutions — Build • Grow • Automate"
              videoId="QEJhjQSdG-M"
            />
          </div>
        </div>
      </SectionShell>

      {/* ================================================================ */}
      {/* 4. HOW WE THINK — 4 principle cards with per-card color blobs     */}
      {/* ================================================================ */}
      <SectionShell>
        <div className="bg-skyz-surface border border-skyz-border rounded-[inherit] px-6 py-16 sm:px-14 sm:py-24 relative overflow-hidden">
          <Blob className="w-[420px] h-[380px] -top-32 left-1/4 opacity-60" color="rgba(236, 72, 153, 0.06)" duration={14} />
          <div className="relative z-10">
            <Reveal>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4">
                <div className="space-y-4">
                  <Eyebrow>
                    <Sparkles className="w-3.5 h-3.5 text-skyz-accent" />
                    Our Standards
                  </Eyebrow>
                  <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-skyz-text">
                    How we think.
                  </h2>
                </div>
                <span className="font-mono text-[11px] text-skyz-text-muted tracking-wider">
                  CLARITY // DIRECT WORK // NO FLUFF
                </span>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {principles.map((item, i) => (
                <Reveal key={item.num} delay={i * 0.08} className="h-full">
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="relative p-6 sm:p-7 rounded-3xl bg-skyz-bg border border-skyz-border shadow-sm h-full flex flex-col justify-between overflow-hidden group"
                  >
                    {/* per-card soft blob */}
                    <Blob className="w-40 h-40 -top-12 -right-12 opacity-90" color={item.blobColor} duration={8 + i} animate={false} />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-5">
                        <span className="text-xs font-mono font-bold text-skyz-accent">{item.num}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-skyz-surface-subtle text-skyz-text-muted border border-skyz-border">
                          {item.tag}
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-bold text-skyz-text">{item.title}</h3>
                      <p className="text-sm text-skyz-text-muted mt-2.5 leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="relative z-10 mt-6 pt-4 border-t border-skyz-border text-[11px] font-mono text-skyz-text-muted flex items-center justify-between">
                      <span>STANDARD // VERIFIED</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </SectionShell>

      {/* ================================================================ */}
      {/* 5. VISION — big breathing-type closer, Labs "Stay connected" vibe */}
      {/* ================================================================ */}
      <SectionShell>
        <div className="relative rounded-[inherit] px-6 py-20 sm:py-28 text-center overflow-hidden bg-skyz-surface border border-skyz-border">
          <Blob className="w-[300px] h-[280px] -top-20 -left-16 opacity-80" color="rgba(56, 189, 248, 0.10)" duration={10} />
          <Blob className="w-[320px] h-[300px] -bottom-24 -right-20 opacity-80" color="rgba(168, 85, 247, 0.10)" duration={12} />
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <Reveal>
              <Eyebrow>
                <span className="w-2 h-2 rounded-full bg-skyz-accent animate-pulse" />
                Our Vision
              </Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-skyz-text leading-tight">
                Digital technology should make your business{' '}
                <span className="text-skyz-accent">faster</span>,{' '}
                <span className="text-pink-500">simpler</span>, and more{' '}
                <span className="text-emerald-500">recognizable</span>.
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="text-base sm:text-lg text-skyz-text-muted max-w-xl mx-auto">
                Ready to build a modern website, grow your customer audience, or automate everyday workflows?
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <button
                type="button"
                onClick={() => navigate('contact')}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] font-semibold text-sm shadow-md hover:bg-skyz-accent transition-all cursor-pointer"
              >
                <span>Start a Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Reveal>
          </div>
        </div>
      </SectionShell>

    </div>
  );
};
