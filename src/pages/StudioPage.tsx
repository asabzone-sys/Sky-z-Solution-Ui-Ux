import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, MotionValue, useSpring, useMotionValue, animate, AnimatePresence } from 'motion/react';
import { useMotionPreference } from '../context/MotionPreferenceContext';
import { ArrowUpRight, ArrowRight, Play, X } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { STUDIO_CATEGORIES, StudioVisual, StudioWork, videoThumb, youTubeId } from '../data/studio';
import { useStudioWorks } from '../lib/supabase';
import { Eyebrow } from '../components/OpalKit';
import { HeroArt } from '../components/Illustrations';

/**
 * StudioPage — the Design & Graphics Studio.
 *
 * Scroll-driven editorial storytelling.
 *
 * PIN RULE (regression note): no ancestor of a `position: sticky` element may
 * carry `overflow` other than `visible` — any hidden/auto ancestor disables
 * the pin. Horizontal safety is handled inside each section instead, so the
 * desktop pin works exactly like the original build: the section locks to the
 * viewport while scroll drives the belt, then releases to the next section.
 *
 * Desktop: pinned 100svh stage + scroll-driven belt with a measured travel
 * distance (never a hardcoded %). Mobile: the SAME storytelling — vertical
 * scroll drives the belt through the same stage — plus manual swipe-drag on
 * the belt for direct control.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* DEV-ONLY demo entry — shows how an uploaded MP4 renders on the belt. */
/* Lives in git-ignored public/demo/, so it never ships with the repo,  */
/* and is stripped from production builds via import.meta.env.DEV.      */
/* ------------------------------------------------------------------ */
const LOCAL_DEMO_WORK: StudioWork = {
  id: 'demo-cinematic',
  order: 99,
  title: 'Cinematic Motion Reel',
  caption: 'Frames that breathe between moments.',
  description: 'Local demo of an uploaded MP4 motion-graphics piece on the belt.',
  category: 'MOTION / VIDEO',
  year: '2026',
  client: 'SkyZ Demo',
  accent: '#8B5CF6',
  video: '/demo/cinematic.mp4',
};

const isLocalDemoVideo = (w: StudioWork) => w.id === LOCAL_DEMO_WORK.id;

/* ------------------------------------------------------------------ */
/* Intro — unique hero: drifting split lines, registration ticks,      */
/* dashed orbit ring, live scroll rail. Same type scale as the system. */
/* ------------------------------------------------------------------ */
const StudioIntro: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const reduced = !useMotionPreference().motionEnabled;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yGlow = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const ySub = useTransform(scrollYProgress, [0, 1], [0, 48]);
  const opacitySub = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  // the dashed ring slow-rotates forever and drifts up slightly on scroll
  const ringY = useTransform(scrollYProgress, [0, 1], [0, -70]);

  return (
    <section
      ref={ref}
      className="relative min-h-[560px] flex items-center overflow-hidden"
      style={{ minHeight: '92svh' }}
    >
      <motion.div
        aria-hidden
        style={reduced ? undefined : { y: yGlow }}
        className="absolute top-[-20%] right-[-10%] w-[720px] h-[720px] rounded-full bg-skyz-accent/10 blur-[160px] pointer-events-none"
      />
      <div className="absolute inset-0 bg-dots-pattern opacity-30 pointer-events-none" aria-hidden />

      {/* dashed orbit ring — the hero's unique signature, right-anchored */}
      {!reduced && (
        <motion.div aria-hidden style={{ y: ringY }} className="absolute right-[-18%] sm:right-[-8%] top-1/2 -translate-y-1/2 w-[78vw] sm:w-[46vw] max-w-[620px] aspect-square pointer-events-none">
          <motion.div
            className="w-full h-full rounded-full border-2 border-dashed border-skyz-accent/25"
            animate={{ rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-[14%] rounded-full border border-skyz-accent/15"
            animate={{ rotate: -360 }}
            transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          />
          {/* satellite dot riding the ring */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          >
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-skyz-accent" />
          </motion.div>
        </motion.div>
      )}

      {/* registration ticks — print-production flavor, pure CSS */}
      <div aria-hidden className="hidden md:flex absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 flex-col gap-1.5 pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.span
            key={i}
            className="block h-px bg-skyz-border"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5 + i * 0.12, duration: 0.5, ease: EASE }}
            style={{ width: 28 - i * 4, transformOrigin: 'left' }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 pb-16 sm:pt-24">
        <motion.div style={reduced ? undefined : { opacity: opacitySub }} className="mb-8 sm:mb-10">
          <Eyebrow>
            <span className="w-2 h-2 rounded-full bg-skyz-accent animate-pulse" />
            The Studio
          </Eyebrow>
        </motion.div>

        {/* display type — same weight/scale relationship as the other page heroes */}
        <h1 className="font-display font-black text-[13vw] sm:text-6xl md:text-8xl tracking-tight leading-[0.95] text-skyz-text select-none">
          {/* line 1 drifts left as you scroll; line 2 holds — a quiet split */}
          <motion.span
            style={reduced ? undefined : { x: useTransform(scrollYProgress, [0, 1], [0, -26]) }}
            className="block"
          >
            <LineReveal text="Design is the" delay={0.05} />
          </motion.span>
          <span className="block">
            <LineReveal text="way it works." delay={0.18} accent="way it works." />
          </span>
        </h1>

        <motion.p
          style={reduced ? undefined : { y: ySub, opacity: opacitySub }}
          className="mt-8 sm:mt-10 max-w-2xl text-lg sm:text-xl md:text-2xl text-skyz-text-muted leading-relaxed"
        >
          SkyZ's design and graphics practice. Identity, print logic, campaign
          creative, and motion — crafted as one continuous visual system.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-10 flex flex-wrap items-center gap-2.5"
        >
          {STUDIO_CATEGORIES.map((c) => (
            <span
              key={c}
              className="font-mono text-[10px] sm:text-xs px-3 py-1.5 rounded-full bg-skyz-surface-subtle text-skyz-text-muted border border-skyz-border"
            >
              {c}
            </span>
          ))}
        </motion.div>

        {/* quiet vignette — design-in-progress desk, floating to the right.
            Desktop only: the sticky stage below owns small screens. */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:block absolute right-4 xl:right-10 top-1/2 -translate-y-1/2 w-[340px] xl:w-[400px] pointer-events-none"
          aria-hidden
        >
          <HeroArt className="w-full h-auto" />
        </motion.div>

        {/* scroll rail — vertical progress line instead of a bouncing arrow */}
        <div className="mt-14 sm:mt-16 flex items-center gap-4 font-mono text-xs text-skyz-text-muted">
          <div className="relative w-px h-12 bg-skyz-border overflow-hidden" aria-hidden>
            {!reduced && (
              <motion.span
                className="absolute left-0 top-0 w-full h-4 bg-skyz-accent"
                animate={{ y: [-16, 48] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </div>
          Scroll to enter the studio
        </div>
      </div>
    </section>
  );
};

/** word-by-word masked rise — editorial, not a generic fade-up */
const LineReveal: React.FC<{ text: string; delay?: number; accent?: string }> = ({ text, delay = 0, accent }) => {
  const words = text.split(' ');
  return (
    <span className="block">
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-top">
          <motion.span
            className={`inline-block ${accent?.includes(w) ? 'text-skyz-accent' : ''}`}
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: delay + i * 0.06, ease: EASE }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* Creative World — the marquee belt: continuous horizontal motion     */
/* Measured rAF loop instead of a CSS % keyframe: the old animation    */
/* translated -50% of a belt that carries trailing padding, so "half"  */
/* never equalled one content set — the loop jumped at the seam        */
/* (most visible on mobile) and its speed drifted with content width.  */
/* Now one set's width is measured and the offset loops exactly over   */
/* it, with viewport-tuned speed and an off-screen pause.              */
/* ------------------------------------------------------------------ */
const MarqueeSet: React.FC<{ works: StudioWork[]; ariaHidden?: boolean }> = ({ works, ariaHidden }) => (
  <div className="flex items-center gap-6 sm:gap-10 pr-6 sm:pr-10" aria-hidden={ariaHidden || undefined}>
    {works.map((w) => (
      <React.Fragment key={w.id}>
        <span className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight whitespace-nowrap text-skyz-text/90">
          {w.title}
        </span>
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: w.accent }}
          aria-hidden
        />
      </React.Fragment>
    ))}
  </div>
);

const CreativeMarquee: React.FC = () => {
  const STUDIO_WORKS = useStudioWorks();
  const sectionRef = useRef<HTMLElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = !useMotionPreference().motionEnabled;
  const [speed, setSpeed] = useState(72);   // px per second
  const pausedRef = useRef(false);

  // viewport-tuned speed (slower on small screens so titles stay readable)
  useEffect(() => {
    const f = () => setSpeed(window.innerWidth < 640 ? 44 : 72);
    f();
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);

  useEffect(() => {
    if (reduced) return;   // reduced motion: belt stays static, fully visible
    let raf = 0;
    let last: number | null = null;
    let visible = true;
    let offset = 0;

    const io = typeof IntersectionObserver !== 'undefined' && sectionRef.current
      ? new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.05 })
      : null;
    if (io && sectionRef.current) io.observe(sectionRef.current);

    const frame = (t: number) => {
      if (last == null) last = t;
      const dt = Math.min(48, t - last);
      last = t;
      const setW = setRef.current?.offsetWidth ?? 0;
      if (visible && !pausedRef.current && setW > 0 && trackRef.current) {
        offset = (offset + (speed * dt) / 1000) % setW;   // loop exactly one set
        trackRef.current.style.transform = `translate3d(${-offset}px, 0, 0)`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); io?.disconnect(); };
  }, [reduced, speed]);

  return (
    <section
      ref={sectionRef}
      className="relative py-12 sm:py-20 overflow-hidden"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      <div className="text-center mb-8 sm:mb-10 px-4">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-skyz-text-muted">
          The Creative World
        </p>
      </div>
      <div className="relative">
        <div
          ref={trackRef}
          className="flex w-max will-change-transform"
        >
          <div ref={setRef} className="flex w-max">
            <MarqueeSet works={STUDIO_WORKS} />
          </div>
          <MarqueeSet works={STUDIO_WORKS} ariaHidden />
        </div>
        {/* edge fade — keeps the belt airy as it exits the viewport */}
        <div className="absolute inset-y-0 left-0 w-16 sm:w-40 bg-gradient-to-r from-skyz-bg to-transparent pointer-events-none" aria-hidden />
        <div className="absolute inset-y-0 right-0 w-16 sm:w-40 bg-gradient-to-l from-skyz-bg to-transparent pointer-events-none" aria-hidden />
      </div>
      <div className="mt-8 sm:mt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="max-w-2xl text-sm sm:text-base text-skyz-text-muted leading-relaxed">
          Six worlds, one system. Every piece below was built inside the same
          design language — typography first, color as structure, motion as
          meaning.
        </p>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Graphic Work — alternating editorial scenes, section-local motion   */
/* ------------------------------------------------------------------ */
const EditorialScene: React.FC<{ work: StudioWork; index: number }> = ({ work, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = !useMotionPreference().motionEnabled;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const imgY = useTransform(scrollYProgress, [0, 1], ['-7%', '7%']);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.07, 1, 1.02]);
  const capY = useTransform(scrollYProgress, [0, 1], [26, -26]);
  const even = index % 2 === 0;

  return (
    <div ref={ref} className="relative py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-7 md:gap-10 items-center">
        <motion.div
          style={reduced ? undefined : { y: imgY }}
          className={`md:col-span-7 ${even ? '' : 'md:order-2'}`}
        >
          <div className="relative">
            <motion.div
              style={reduced ? undefined : { scale: imgScale }}
              className="relative aspect-[4/3] sm:aspect-[16/10] rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden border border-skyz-border card-shadow-flank group"
            >
              <StudioVisual work={work} />
              <div className="hidden md:block absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" aria-hidden />
            </motion.div>
            <span className="absolute -top-3 right-5 sm:right-9 font-mono text-[10px] px-3 py-1.5 rounded-full bg-skyz-surface border border-skyz-border shadow-sm text-skyz-text-muted">
              {work.year}
            </span>
          </div>
        </motion.div>

        <motion.div
          style={reduced ? undefined : { y: capY }}
          className={`md:col-span-5 ${even ? '' : 'md:order-1 md:text-right'}`}
        >
          <span className="font-mono text-[10px] tracking-[0.25em] text-skyz-accent font-bold">
            {String(index + 1).padStart(2, '0')} — {work.category}
          </span>
          <h3 className="mt-3 font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-skyz-text leading-[1.05]">
            {work.title}
          </h3>
          <p className={`mt-4 font-display text-lg sm:text-xl text-skyz-text-muted italic ${even ? '' : 'md:ml-auto'}`}>
            “{work.caption}”
          </p>
          <p className={`mt-4 max-w-md text-sm text-skyz-text-muted leading-relaxed ${even ? '' : 'md:ml-auto'}`}>
            {work.description}
          </p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-skyz-text">
            {work.client}
            <ArrowUpRight className="w-4 h-4 text-skyz-accent" />
          </span>
        </motion.div>
      </div>
    </div>
  );
};

const GraphicWork: React.FC = () => {
  const STUDIO_WORKS = useStudioWorks();
  const ref = useRef<HTMLElement>(null);
  const reduced = !useMotionPreference().motionEnabled;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  // drift only the inline text (not the full-width block box) so the heading
  // can never push the page wider than the viewport on small screens
  const [drift, setDrift] = useState(18);
  useEffect(() => {
    const f = () => setDrift(window.innerWidth < 640 ? 18 : 48);
    f();
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  const xHeading = useTransform(scrollYProgress, [0, 1], [drift, -drift]);

  return (
    <section ref={ref} className="relative py-8 sm:py-12">
      <h2 className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-skyz-text/95 mb-6 sm:mb-10">
        <motion.span style={reduced ? undefined : { x: xHeading }} className="inline-block will-change-transform">
          Graphic <span className="text-skyz-text-muted">Work</span>
        </motion.span>
      </h2>
      {STUDIO_WORKS.slice(0, 3).map((w, i) => (
        <EditorialScene key={w.id} work={w} index={i} />
      ))}
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Visual / Motion Work — the pinned storytelling stage.               */
/* Desktop: section pins at top, vertical scroll drives the belt.      */
/* Mobile: same stage behavior (shorter runway) + manual swipe-drag.   */
/* ------------------------------------------------------------------ */
const MotionStrip: React.FC = () => {
  const STUDIO_WORKS = useStudioWorks();
  // DEV-ONLY demo: shows how an uploaded MP4 motion-graphics piece renders on
  // the belt before real entries exist in Supabase. import.meta.env guard in
  // production would ship nothing extra — this hook simply returns [] there,
  // so the demo entry never appears in a production build.
  const STUDIO_WORKS_FULL = React.useMemo(() => (
    import.meta.env.DEV && STUDIO_WORKS.every((w) => !isLocalDemoVideo(w))
      ? [...STUDIO_WORKS, LOCAL_DEMO_WORK]
      : STUDIO_WORKS
  ), [STUDIO_WORKS]);

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = !useMotionPreference().motionEnabled;
  const [dist, setDist] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [playing, setPlaying] = useState<StudioWork | null>(null);

  // measured travel — never a hardcoded percentage.
  // Re-measures when the belt CONTENT changes (demo entry added on dev,
  // or Supabase rows hydrate late) — previously content-length changes
  // arrived after mount and the travel distance went stale.
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const endPad = Math.round(window.innerWidth * 0.12);   // matches pr-[12vw]
      setDist(Math.max(0, track.scrollWidth - window.innerWidth + endPad));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener('resize', measure);
    const t = setTimeout(measure, 400);   // after webfont swap
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); clearTimeout(t); };
  }, [STUDIO_WORKS_FULL]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  // spring-smoothed scroll mapping — kills wheel/scrollbar jitter.
  // Reduced motion drops only the smoothing, never the position: a
  // scroll-driven belt is user-controlled motion and must stay reachable.
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const source = reduced ? scrollYProgress : smooth;
  const x = useTransform(source, [0, 1], [0, -dist]);

  /* manual drag (touch + mouse) composes WITH the scroll-driven position */
  const dragX = useMotionValue(0);
  // movedRef: how far the pointer travelled during the active drag — the belt
  // itself doesn't swallow clicks, so MotionCard uses this to ignore the
  // click that fires after a drag release ( accidental video-open fix).
  const movedRef = useRef(0);
  const dragRef = useRef({ active: false, startX: 0, base: 0 });
  const onPointerDown = (e: React.PointerEvent) => {
    dragRef.current = { active: true, startX: e.clientX, base: dragX.get() };
    movedRef.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    movedRef.current = Math.max(movedRef.current, Math.abs(e.clientX - dragRef.current.startX));
    dragX.set(dragRef.current.base + (e.clientX - dragRef.current.startX));
  };
  const endDrag = () => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    // glide the drag offset back — vertical scroll remains the master clock
    animate(dragX, 0, { type: 'spring', stiffness: 170, damping: 30 });
  };
  const xFinal = useTransform([x, dragX], (vals: number[]) => vals[0] + vals[1]);

  // runway: generous on desktop, compact on mobile (svh-safe)
  const [runway, setRunway] = useState('280vh');
  useEffect(() => {
    const set = () => setRunway(window.innerWidth < 768 ? '220vh' : '280vh');
    set();
    window.addEventListener('resize', set);
    return () => window.removeEventListener('resize', set);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: runway }}
      aria-label="Visual and motion work"
    >
      {/* h-screen everywhere; svh only where supported (mobile URL bars) */}
      <div className="sticky top-0 h-screen supports-[height:100svh]:h-[100svh] flex flex-col justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mb-7 sm:mb-10">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-skyz-text/95">
              Visual <span className="text-skyz-text-muted">& Motion</span>
            </h2>
            <span className="font-mono text-xs text-skyz-text-muted flex-shrink-0">SCROLL →</span>
          </div>
        </div>

        {/* the belt: scroll-driven everywhere, drag-assisted on touch */}
        <motion.div
          ref={trackRef}
          style={{ x: xFinal }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="flex items-stretch gap-5 sm:gap-8 w-max pl-4 sm:pl-8 pr-[12vw] cursor-grab active:cursor-grabbing touch-pan-y"
        >
          {STUDIO_WORKS_FULL.map((w) => (
            <MotionCard
              key={w.id}
              work={w}
              hovered={hovered}
              setHovered={setHovered}
              onPlay={setPlaying}
              dragMovedRef={movedRef}
              previewsMuted={reduced || playing !== null}
            />
          ))}
        </motion.div>

        {/* progress rail for the strip */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10">
          <div className="h-px w-full bg-skyz-border-subtle" aria-hidden>
            <motion.div
              style={{ scaleX: source }}
              className="h-full origin-left bg-skyz-accent/60"
            />
          </div>
        </div>
      </div>

      {/* click-to-play video lightbox — YouTube embed or uploaded MP4 */}
      <AnimatePresence>
        {playing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
            onClick={() => setPlaying(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`Play video: ${playing.title}`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="relative w-full max-w-4xl aspect-video rounded-[1.5rem] overflow-hidden bg-black border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {youTubeId(playing.video)
                ? (
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${youTubeId(playing.video)}?autoplay=1&rel=0`}
                    title={playing.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={playing.video}
                    poster={playing.poster || undefined}
                    controls
                    autoPlay
                    playsInline
                    className="absolute inset-0 w-full h-full"
                  />
                )}
              <button
                type="button"
                aria-label="Close video"
                onClick={() => setPlaying(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur border border-white/20 text-white flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

/**
 * LoopedCanvas — for uploaded MP4/WebM motion work the card IS the video:
 * muted, looping, autoplay — COSMOS-style living cards. YouTube entries stay
 * click-to-play (embeds can't be sensibly muted-looped inline).
 *
 * Performance rules baked in:
 * - the element only MOUNTS when the card is near the viewport (no<br>
 *   off-screen network/battery cost — crucial when the belt holds many videos)
 * - plays/pauses with the viewport via IntersectionObserver<br>
 * - pauses when the lightbox is open and plays/prerolls again on resume<br>
 * - `preload="metadata"` so we never download full files for parked cards<br>
 * - honours reduced-motion: static poster frame only, click still opens
 */
const LoopedVideo: React.FC<{
  src: string;
  poster?: string;
  paused: boolean;       // shared pause state: lightbox open or reduced motion
  thumb: string | null;
  alt: string;
  hovered: boolean;      // drives the smooth slow-motion on hover
}> = ({ src, poster, paused, thumb, alt, hovered }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [nearViewport, setNearViewport] = useState(false);
  const userPaused = paused;

  // Mount the tag only once the card approaches the viewport. The belt moves
  // cards HORIZONTALLY via a parent transform, and IntersectionObserver
  // rootMargin is axis-symmetric — '25% 0px' only extends vertically, so
  // horizontally-translated cards never entered the (0-width horizontal)
  // interaction zone. A generous symmetric ROOT-px margin covers one card
  // width of travel on both axes; vertical budget stays generous on mobile.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const margin = () => `${Math.round(Math.max(innerWidth * 0.5, 320))}px`;   // ~2 cards of lead-in
    let io: IntersectionObserver | null = null;
    const attach = () => {
      io?.disconnect();
      io = new IntersectionObserver(
        ([entry]) => setNearViewport(entry.isIntersecting),
        { rootMargin: `${margin()} ${margin()} ${margin()} ${margin()}` },
      );
      io.observe(el);
    };
    attach();
    window.addEventListener('resize', attach);
    return () => { io?.disconnect(); window.removeEventListener('resize', attach); };
  }, []);

  useEffect(() => {
    if (nearViewport) setMounted(true);
  }, [nearViewport]);

  // play/pause follows viewport + shared pause state
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (userPaused || !nearViewport) {
      if (!v.paused) v.pause();
    } else {
      v.play().catch(() => {/* autoplay can reject pre-interaction; poster covers it */});
    }
  }, [userPaused, nearViewport, mounted]);

  // Smooth hover slow-motion: playbackRate glides 1 ⇄ 0.45 with a lerped
  // rAF loop instead of snapping — a hard rate change stutters the decode
  // pipeline for a beat. The loop self-terminates once the target is close
  // and restarts only on direction change, so idle cards cost zero frames.
  const rateRef = useRef(1);
  const targetRate = hovered ? 0.45 : 1;
  useEffect(() => {
    const v = videoRef.current;
    if (!v || userPaused || !nearViewport) { rateRef.current = targetRate; return; }
    let raf = 0;
    const tick = () => {
      const diff = targetRate - rateRef.current;
      if (Math.abs(diff) < 0.01) {
        v.playbackRate = targetRate;
        rateRef.current = targetRate;
        return;   // settled — stop the loop
      }
      rateRef.current += diff * 0.14;   // lerp factor: ~200ms to settle
      v.playbackRate = Math.max(0.05, rateRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [targetRate, userPaused, nearViewport, mounted]);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      {mounted ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster || thumb || undefined}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          aria-label={alt}
        />
      ) : (
        thumb && <img src={thumb} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
      )}
    </div>
  );
};

const MotionCard: React.FC<{
  work: StudioWork;
  hovered: string | null;
  setHovered: (id: string | null) => void;
  onPlay: (w: StudioWork) => void;
  /** shared with the belt: px distance moved while dragging (0 = a true click) */
  dragMovedRef: React.MutableRefObject<number>;
  /** true while the video lightbox (or reduced-motion) mutes live previews */
  previewsMuted: boolean;
}> = ({ work, hovered, setHovered, onPlay, dragMovedRef, previewsMuted }) => {
  const dim = hovered !== null && hovered !== work.id;
  const thumb = videoThumb(work.video, work.poster ?? work.image);
  // Uploaded file → inline muted loop; YouTube → click-to-play only.
  const isUploadedVideo = !!work.video && !youTubeId(work.video);
  const handleActivate = () => {
    // a click that follows a belt drag pixels-wise is a panning gesture, not
    // an intent to open the video — ignore anything beyond a small slop
    if (dragMovedRef.current > 6) return;
    if (work.video) onPlay(work);
  };
  return (
    <motion.div
      onHoverStart={() => setHovered(work.id)}
      onHoverEnd={() => setHovered(null)}
      animate={{ scale: dim ? 0.96 : 1, opacity: dim ? 0.55 : 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      className="relative w-[76vw] max-w-[340px] sm:w-[400px] lg:w-[420px] flex-shrink-0 cursor-pointer group select-none"
    >
      <div
        className="relative aspect-[4/5] rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden border border-skyz-border card-shadow-flank"
        onClick={handleActivate}
        role={work.video ? 'button' : undefined}
        aria-label={work.video ? `Play video: ${work.title}` : undefined}
      >
        <StudioVisual work={work} glyph={work.title.split(' ')[0].charAt(0)} />
        {isUploadedVideo && work.video && (
          <LoopedVideo
            src={work.video}
            poster={work.poster || work.image || undefined}
            paused={previewsMuted}
            thumb={thumb}
            alt={`${work.title} — motion preview`}
            hovered={hovered === work.id}
          />
        )}
        {!isUploadedVideo && work.video && thumb && (
          <img
            src={thumb}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {work.video && (
          <span
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/45 backdrop-blur flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 ${
              isUploadedVideo && !previewsMuted ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <Play className="w-5 h-5 ml-0.5" />
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 bg-gradient-to-t from-black/60 via-black/25 to-transparent">
          <span className="font-mono text-[10px] tracking-[0.25em] text-white/70">{work.category}</span>
          <h3 className="mt-1.5 font-display text-lg sm:text-2xl font-bold text-white tracking-tight">{work.title}</h3>
          <p className="mt-1 text-xs sm:text-sm text-white/70">{work.client} — {work.year}</p>
        </div>
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Final CTA — quiet SkyZ close                                        */
/* ------------------------------------------------------------------ */
const StudioCTA: React.FC = () => {
  const { navigate } = useNavigation();
  return (
    <section className="relative py-14 sm:py-24 px-2 sm:px-4 lg:px-6">
      <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.75rem] bg-skyz-accent-muted border border-skyz-accent/20 px-5 sm:px-12 py-16 sm:py-24 text-center transition-colors duration-200">
        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-skyz-text max-w-2xl mx-auto leading-tight">
          Have something <span className="text-skyz-accent">visual</span> in mind?
        </h2>
        <p className="mt-5 text-sm sm:text-base text-skyz-text-muted max-w-md mx-auto">
          Identities, campaigns, motion — scoped directly with the people who make them.
        </p>
        <button
          type="button"
          onClick={() => navigate('contact')}
          className="mt-9 sm:mt-10 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#160F26] font-semibold text-sm shadow-lg hover:bg-skyz-accent dark:hover:bg-skyz-accent-secondary transition-all cursor-pointer"
        >
          Start a Design Project
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Page assembly — NO overflow on ancestors of the sticky stage        */
/* ------------------------------------------------------------------ */
export const StudioPage: React.FC = () => {
  return (
    <div className="w-full">
      <StudioIntro />
      <CreativeMarquee />
      <GraphicWork />
      <MotionStrip />
      <StudioCTA />
    </div>
  );
};

export default StudioPage;
