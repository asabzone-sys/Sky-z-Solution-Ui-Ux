import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useMotionTemplate,
  useSpring,
  useVelocity,
  MotionValue,
} from 'motion/react';
import { useMotionPreference } from '../context/MotionPreferenceContext';
import {
  Laptop,
  TrendingUp,
  Bot,
  ArrowRight,
  Code,
  Activity,
  Database,
  RefreshCw,
  Cloud,
} from 'lucide-react';
import { CAPABILITIES } from '../data/content';
import { useNavigation } from '../context/NavigationContext';
import { Eyebrow } from '../components/OpalKit';

/**
 * Capabilities — "Build. Grow. Automate." as a scroll-driven story.
 *
 * The section pins to the viewport and vertical scroll walks the visitor
 * through three acts — BUILD the foundation, GROW the reach, AUTOMATE the
 * operation — each with its own living motion widget, giant ghost word, and
 * a progress rail. One connected system, told as one continuous scene.
 *
 * The pacing model is a film cut, not a slide: every act DISSOLVES IN,
 * HOLDS on a long still plateau (one deliberate beat per scroll gesture),
 * then DISSOLVES OUT completely before the next act begins. Transitions
 * pass through a brief rack-focus blur dip — like a lens pull on a film
 * rig — and fast scroll flings soften the whole stage with depth-of-field
 * blur, so the story always feels deliberate and premium.
 *
 * Motion discipline (same as the rest of the site): transform/opacity/filter
 * only, springs for state changes, prefers-reduced-motion falls back to a
 * static stacked story. The sticky stage has NO overflow-hidden ancestor
 * (the pin rule from StudioPage) — the stage carries its own overflow clip.
 */

const EASE = [0.16, 1, 0.3, 1] as const;
const N_ACTS = 3;

type ActDef = {
  key: 'BUILD' | 'GROW' | 'AUTOMATE';
  label: string;
  title: string;
  story: string;
  Widget: React.FC<{ on: boolean }>;
};

const ACTS: ActDef[] = [
  {
    key: 'BUILD',
    label: '01 // BUILD',
    title: 'First, we build the foundation.',
    story: 'Every system starts as architecture — resilient, fast, and accessible from the first wireframe to the last deploy.',
    Widget: BuildWidget,
  },
  {
    key: 'GROW',
    label: '02 // GROW',
    title: 'Then, we make it impossible to miss.',
    story: 'Search, campaigns, and brand creative compound on top of that foundation — reach that keeps working after we stop pushing.',
    Widget: GrowWidget,
  },
  {
    key: 'AUTOMATE',
    label: '03 // AUTOMATE',
    title: 'Finally, it runs itself.',
    story: 'AI agents and integrations take over the repetitive work, so the system keeps producing while your team sleeps.',
    Widget: AutomateWidget,
  },
];

/* ------------------------------------------------------------------ */
/* Act widgets — living motion graphics, transform/opacity only         */
/* ------------------------------------------------------------------ */

/**
 * Typing text hook — reveals a string character by character with human-feel
 * cadence. Three modes: 'run' types from empty; 'hold' waits empty (the act
 * is off-screen — its moment must not be spent before the visitor arrives);
 * 'static' shows the full string (reduced-motion / stacked render).
 */
type TypeMode = 'run' | 'hold' | 'static';
function useTypewriter(text: string, mode: TypeMode, speed = 55, startDelay = 0) {
  const [count, setCount] = useState(mode === 'static' ? text.length : 0);
  useEffect(() => {
    if (mode === 'static') { setCount(text.length); return; }
    if (mode === 'hold') { setCount(0); return; }
    setCount(0);
    let raf = 0;
    let stop = false;
    let elapsed = -startDelay;
    let last = performance.now();
    const step = (t: number) => {
      if (stop) return;
      elapsed += t - last;
      last = t;
      // steady per-char cadence with a start beat — reads as typing
      const target = Math.min(text.length, Math.max(0, Math.floor(elapsed / speed)));
      setCount((c) => (target > c ? target : c));
      if (target < text.length) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => { stop = true; cancelAnimationFrame(raf); };
  }, [text, mode, speed, startDelay]);
  return { shown: text.slice(0, count), done: count >= text.length };
}

/** BUILD — a browser skeleton assembling itself while the pipeline pulses. */
function BuildWidget({ on }: { on: boolean }) {
  const blocks = [
    'col-span-2 h-14',
    'col-span-1 h-14',
    'col-span-1 h-10',
    'col-span-2 h-10',
  ];
  // The typewriter must run when the STORY reaches the visitor, not on page
  // load — the act sits far down the page and its moment would be over
  // before anyone arrives. An IO gate starts typing on first sight.
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setInView(true); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const live = on && inView;
  const typeMode: TypeMode = !on ? 'static' : inView ? 'run' : 'hold';
  const url = useTypewriter('skyz.dev/build', typeMode, 90, 600);
  const cmd = useTypewriter('npm run build', typeMode, 48, 2100);
  const deployed = live && url.done && cmd.done;
  return (
    <div ref={rootRef} className="relative rounded-[2rem] border border-skyz-border bg-skyz-bg p-4 sm:p-7 overflow-hidden w-full max-w-md mx-auto">
      <div className="rounded-2xl border border-skyz-border bg-skyz-surface overflow-hidden shadow-sm">
        {/* browser chrome — the URL types itself in */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-skyz-border">
          <span className="w-2 h-2 rounded-full bg-skyz-border" />
          <span className="w-2 h-2 rounded-full bg-skyz-border" />
          <span className="w-2 h-2 rounded-full bg-skyz-border" />
          <span className="ml-3 h-5 flex-1 max-w-[160px] rounded-full bg-skyz-surface-subtle border border-skyz-border flex items-center px-3">
            <span className="text-[9px] font-mono text-skyz-text-muted">
              {url.shown}
              {!url.done && <span className="type-caret">▌</span>}
            </span>
          </span>
        </div>
        {/* build terminal — the command types, then the deploy check lands */}
        <div className="px-4 pt-3 pb-1 font-mono text-[9px] sm:text-[10px]">
          <div className="text-skyz-text-muted">
            <span className="text-emerald-500">$</span> {cmd.shown}
            {!cmd.done && <span className="type-caret">▌</span>}
          </div>
          <motion.div
            initial={false}
            animate={deployed && on ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="mt-1 text-emerald-500"
          >
            ✓ built — deploying to edge
          </motion.div>
        </div>
        {/* skeleton blocks assembling */}
        <div className="p-4 sm:p-5 grid grid-cols-3 gap-2.5 sm:gap-3">
          {blocks.map((cls, i) => (
            <motion.div
              key={i}
              className={`rounded-xl bg-skyz-surface-subtle border border-skyz-border ${cls}`}
              initial={false}
              animate={on ? { opacity: [0.35, 1, 0.35], scale: [0.97, 1, 0.97] } : { opacity: 0.85 }}
              transition={on ? { duration: 3.2, repeat: Infinity, delay: i * 0.45, ease: 'easeInOut' } : undefined}
            />
          ))}
        </div>
      </div>
      {/* pipeline pulse — a dot traveling the delivery line */}
      <div className="mt-5 relative">
        <div className="h-px bg-skyz-border relative overflow-hidden" aria-hidden>
          <motion.div
            className="absolute inset-0 flex items-center"
            initial={false}
            animate={on ? { x: ['-100%', '100%'] } : { x: '40%' }}
            transition={on ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } : undefined}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-skyz-accent shadow-[0_0_10px_rgba(124,58,237,0.8)]" />
          </motion.div>
        </div>
        <div className="mt-2.5 flex items-center justify-between font-mono text-[9px] sm:text-[10px] text-skyz-text-muted tracking-widest">
          <span className="flex items-center gap-1.5"><Code className="w-3 h-3 text-skyz-accent" /> ARCHITECT</span>
          <span className="flex items-center gap-1.5"><Laptop className="w-3 h-3 text-skyz-accent" /> ENGINEER</span>
          <span className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-emerald-500" /> DEPLOY</span>
        </div>
      </div>
    </div>
  );
}

/** GROW — radar rings + audience nodes lighting up + compounding bars. */
function GrowWidget({ on }: { on: boolean }) {
  const nodes = [
    { top: '8%', left: '18%' }, { top: '14%', right: '16%' },
    { top: '42%', left: '4%' }, { top: '46%', right: '4%' },
    { bottom: '10%', left: '26%' }, { bottom: '6%', right: '28%' },
  ];
  return (
    <div className="relative rounded-[2rem] border border-skyz-border bg-skyz-bg p-4 sm:p-7 overflow-hidden w-full max-w-md mx-auto">
      {/* radar */}
      <div className="relative h-36 sm:h-44" aria-hidden>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-skyz-accent/40"
            initial={false}
            animate={on ? { scale: [0.35, 1.6], opacity: [0.55, 0] } : { scale: 0.8 + i * 0.35, opacity: 0.25 }}
            transition={on ? { duration: 2.8, repeat: Infinity, delay: i * 0.9, ease: 'easeOut' } : undefined}
          />
        ))}
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-skyz-accent shadow-[0_0_14px_rgba(124,58,237,0.7)]" />
        {nodes.map((pos, i) => (
          <motion.span
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{ ...pos, backgroundColor: i % 2 ? 'var(--accent-secondary)' : 'var(--accent)' }}
            initial={false}
            animate={on ? { opacity: [0.15, 1, 0.15], scale: [0.8, 1.25, 0.8] } : { opacity: 0.6 }}
            transition={on ? { duration: 2.2, repeat: Infinity, delay: i * 0.35, ease: 'easeInOut' } : undefined}
          />
        ))}
      </div>
      {/* compounding bars */}
      <div className="mt-4 flex items-end justify-center gap-2 sm:gap-2.5 h-14 sm:h-16" aria-hidden>
        {[0.45, 0.65, 0.8, 1].map((h, i) => (
          <motion.div
            key={i}
            className="w-5 sm:w-7 rounded-t-lg bg-gradient-to-t from-skyz-accent/25 to-skyz-accent origin-bottom"
            style={{ height: `${h * 100}%` }}
            initial={false}
            animate={on ? { scaleY: [0.35, 1, 0.35] } : { scaleY: 1 }}
            transition={on ? { duration: 2.6, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' } : undefined}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-center gap-2 font-mono text-[9px] sm:text-[10px] text-skyz-text-muted tracking-widest">
        <Activity className="w-3 h-3 text-skyz-accent" /> ORGANIC REACH — COMPOUNDING
      </div>
    </div>
  );
}

/** AUTOMATE — an orbit of integrations around a working core. */
function AutomateWidget({ on }: { on: boolean }) {
  const orbitNodes = [
    { pos: 'left-1/2 top-0 -translate-x-1/2 -translate-y-1/2', icon: <Database className="w-3.5 h-3.5" /> },
    { pos: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2', icon: <Cloud className="w-3.5 h-3.5" /> },
    { pos: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2', icon: <Activity className="w-3.5 h-3.5" /> },
  ];
  return (
    <div className="relative rounded-[2rem] border border-skyz-border bg-skyz-bg p-4 sm:p-7 overflow-hidden w-full max-w-md mx-auto">
      <div className="relative h-40 sm:h-48" aria-hidden>
        {/* dashed orbit ring */}
        <div className="absolute inset-5 sm:inset-7 rounded-full border border-dashed border-skyz-border" />
        {/* rotating orbit with upright nodes */}
        <motion.div
          className="absolute inset-5 sm:inset-7"
          initial={false}
          animate={on ? { rotate: 360 } : undefined}
          transition={on ? { duration: 16, repeat: Infinity, ease: 'linear' } : undefined}
        >
          {orbitNodes.map((n, i) => (
            <span key={i} className={`absolute ${n.pos}`}>
              <motion.span
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-skyz-surface border border-skyz-border shadow-sm flex items-center justify-center text-skyz-accent"
                initial={false}
                animate={on ? { rotate: -360 } : undefined}
                transition={on ? { duration: 16, repeat: Infinity, ease: 'linear' } : undefined}
              >
                {n.icon}
              </motion.span>
            </span>
          ))}
        </motion.div>
        {/* the core — always working */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] flex items-center justify-center shadow-lg">
            <motion.span
              initial={false}
              animate={on ? { rotate: 360 } : undefined}
              transition={on ? { duration: 7, repeat: Infinity, ease: 'linear' } : undefined}
            >
              <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-center gap-2 font-mono text-[9px] sm:text-[10px] text-skyz-text-muted tracking-widest">
        <Bot className="w-3 h-3 text-skyz-accent" /> CRM · API · WEBHOOKS — ALWAYS ON
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ActLayer — film-cut scroll window for one act                        */
/* ------------------------------------------------------------------ */

const ActLayer: React.FC<{
  index: number;
  progress: MotionValue<number>;   // JS-driven progress (never accelerated)
  flingBlur: MotionValue<number>;  // depth-of-field while the page flings
  active: boolean;
  closing: boolean;
  reduced: boolean;
}> = ({ index, progress, flingBlur, active, closing, reduced }) => {
  const act = ACTS[index];
  const { navigate } = useNavigation();
  const start = index / N_ACTS;
  const end = (index + 1) / N_ACTS;
  const drift = index % 2 === 0 ? -40 : 40;

  /*
   * CINEMA CUT, not a cross-dissolve. Windows are intentionally
   * NON-overlapping: an act finishes dissolving OUT exactly at the seam
   * before the next act begins dissolving IN. Headlines are never legible
   * twice — the seam passes through a brief, intentional rack-focus dip
   * (everything blurred + dim for a moment), like a lens pull between
   * shots. Every act then holds a long still plateau, so one scroll
   * gesture delivers exactly one beat.
   *
   * All input ranges stay clamped within [0, 1]: Motion's accelerated
   * scroll path passes ranges straight through as WAAPI keyframe offsets.
   * (These derived values run on the JS-driven mirror anyway.)
   */
  const FIN = 0.045; // dissolve duration, in runway fraction (~90vh of scroll)
  const CLAMP = (v: number) => Math.min(1, Math.max(0, v));

  const oStops: number[] = [];
  const oVals: number[] = [];
  const yStops: number[] = [];
  const yVals: number[] = [];
  const gStops: number[] = [];
  const gVals: number[] = [];
  const bStops: number[] = [];
  const bVals: number[] = [];

  if (index === 0) {
    // settled from the start; dissolves out fully by the first seam
    oStops.push(0, CLAMP(end - FIN), CLAMP(end)); oVals.push(1, 1, 0);
    yStops.push(0, CLAMP(end - FIN), CLAMP(end)); yVals.push(0, 0, -72);
    gStops.push(0, CLAMP(end - FIN - 0.01), CLAMP(end - 0.01)); gVals.push(1, 1, 0);
    bStops.push(0, CLAMP(end - FIN), CLAMP(end)); bVals.push(0, 0, 7);
  } else if (index === N_ACTS - 1) {
    // dissolves in after the last seam; never out (the closing beat overlays it)
    oStops.push(CLAMP(start), CLAMP(start + FIN), 1); oVals.push(0, 1, 1);
    yStops.push(CLAMP(start), CLAMP(start + FIN), 1); yVals.push(72, 0, 0);
    gStops.push(CLAMP(start + 0.01), CLAMP(start + FIN + 0.01), 1); gVals.push(0, 1, 1);
    bStops.push(CLAMP(start), CLAMP(start + FIN), 1); bVals.push(7, 0, 0);
  } else {
    oStops.push(CLAMP(start), CLAMP(start + FIN), CLAMP(end - FIN), CLAMP(end)); oVals.push(0, 1, 1, 0);
    yStops.push(CLAMP(start), CLAMP(start + FIN), CLAMP(end - FIN), CLAMP(end)); yVals.push(72, 0, 0, -72);
    gStops.push(CLAMP(start + 0.01), CLAMP(start + FIN + 0.01), CLAMP(end - FIN - 0.01), CLAMP(end - 0.01)); gVals.push(0, 1, 1, 0);
    bStops.push(CLAMP(start), CLAMP(start + FIN), CLAMP(end - FIN), CLAMP(end)); bVals.push(7, 0, 0, 7);
  }

  const opacity = useTransform(progress, oStops, oVals);
  const y = useTransform(progress, yStops, yVals);
  const ghostOpacity = useTransform(progress, gStops, gVals);
  const ghostX = useTransform(progress, [Math.max(0, start), Math.min(1, end)], [drift, -drift]);
  const actBlur = useTransform(progress, bStops, bVals);
  const filter = useMotionTemplate`blur(${actBlur}px) blur(${flingBlur}px)`;

  const cap = CAPABILITIES.find((c) => c.category === act.key);

  return (
    <motion.div
      style={{ opacity, y, filter, pointerEvents: active && !closing ? 'auto' : 'none' }}
      className="absolute inset-0 flex items-center will-change-transform"
    >
      {/* ghost word — the act's quiet backdrop signature */}
      <motion.div
        aria-hidden
        style={{ opacity: reduced ? 0.05 : ghostOpacity, x: reduced ? 0 : ghostX }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span
          className="font-display font-black tracking-tight text-skyz-text"
          style={{ fontSize: 'clamp(5rem, 20vw, 18rem)', color: 'currentColor', opacity: 0.045 }}
        >
          {act.key}
        </span>
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto w-full px-5 sm:px-8 grid md:grid-cols-2 gap-8 md:gap-14 items-center">
        {/* story column */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-skyz-accent animate-pulse" />
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-skyz-accent font-bold">
              {act.label}
            </span>
          </div>
          <h3 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-skyz-text leading-[1.05]">
            {act.title}
          </h3>
          <p className="mt-4 sm:mt-5 text-sm sm:text-lg text-skyz-text-muted leading-relaxed max-w-lg mx-auto md:mx-0">
            {act.story}
          </p>

          {/* services chips — same content contract as before */}
          <div className="mt-5 sm:mt-6 flex flex-wrap justify-center md:justify-start gap-1.5">
            {(cap?.services ?? []).map((s) => (
              <span
                key={s}
                className="text-xs px-2.5 py-1 rounded-full bg-skyz-surface-subtle text-skyz-text border border-skyz-border"
              >
                {s}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => navigate('contact', { serviceCategory: act.key })}
            className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-skyz-text hover:text-skyz-accent transition-colors cursor-pointer"
          >
            <span>Inquire about {act.key.charAt(0) + act.key.slice(1).toLowerCase()} services</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* widget column — compact on phones, full on desktop */}
        <div className="w-full scale-90 sm:scale-100 origin-top">
          <act.Widget on={!reduced} />
        </div>
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Capabilities — the pinned story                                      */
/* ------------------------------------------------------------------ */

export const Capabilities: React.FC = () => {
  const { navigate } = useNavigation();
  const runwayRef = useRef<HTMLDivElement>(null);
  const reduced = !useMotionPreference().motionEnabled;

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ['start start', 'end end'],
  });

  /*
   * JS-driven mirror of scrollYProgress. The accelerated native
   * scroll-timeline path only honors identity [0,1] input ranges reliably;
   * partial per-act ranges drift under it. A function transformer opts this
   * value out of acceleration, so every derived range below computes
   * exactly on the JS path.
   */
  const jsProgress = useTransform(scrollYProgress, (v: number) => v);

  /*
   * Depth-of-field on fling: when the visitor flicks through the runway,
   * the stage softens (velocity → blur, spring-smoothed) instead of
   * hard-snapping between acts. Slow, deliberate scrolls stay tack sharp —
   * the blur is a consequence of speed, never a constant haze.
   */
  const scrollVelocity = useVelocity(scrollYProgress);
  const flingBlurRaw = useTransform(
    scrollVelocity,
    [-1.4, -0.16, 0, 0.16, 1.4],
    [10, 0, 0, 0, 10],
    { clamp: true },
  );
  const flingBlur = useSpring(flingBlurRaw, { stiffness: 130, damping: 28, mass: 0.55 });

  const [activeAct, setActiveAct] = useState(0);
  const [closing, setClosing] = useState(false);
  const activeRef = useRef(0);
  const closingRef = useRef(false);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const a = Math.min(N_ACTS - 1, Math.max(0, Math.floor(v * N_ACTS)));
    const c = v > 0.9;
    if (a !== activeRef.current) { activeRef.current = a; setActiveAct(a); }
    if (c !== closingRef.current) { closingRef.current = c; setClosing(c); }
  });

  const closingDim = useTransform(jsProgress, [0.88, 0.97], [1, 0.12]);
  const closingOpacity = useTransform(jsProgress, [0.9, 0.975], [0, 1]);
  const closingY = useTransform(jsProgress, [0.9, 0.975], [28, 0]);
  const railFill = useTransform(jsProgress, [0.03, 0.9], [0, 1]);

  /* Graceful release: instead of a hard unpin, the stage eases back a
     touch in the last stretch of the runway — depth cue, then drift out. */
  const releaseY = useTransform(jsProgress, [0.965, 1], [0, 30]);
  const releaseScale = useTransform(jsProgress, [0.965, 1], [1, 0.975]);

  /* Reduced motion: the same story, stacked statically — no pin, no scroll driving. */
  if (reduced) {
    return (
      <section id="services" className="relative w-full px-2 sm:px-4 lg:px-6 py-6 sm:py-8">
        <StoryHeader navigate={navigate} />
        <div className="max-w-7xl mx-auto space-y-5 mt-10">
          {ACTS.map((act, i) => (
            <ActStatic key={act.key} index={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="relative w-full">
      <StoryHeader navigate={navigate} />

      {/* story runway — the pin lives here; no overflow-hidden ancestors.
          480vh + long hold plateaus = one deliberate beat per scroll gesture. */}
      <div ref={runwayRef} className="relative" style={{ height: '480vh' }}>
        <motion.div
          style={{ y: releaseY, scale: releaseScale }}
          className="sticky top-0 h-screen supports-[height:100svh]:h-[100svh] overflow-hidden flex items-center"
        >
          {/* ambient field — lives INSIDE the stage clip, not an ancestor of it */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute top-[-10%] left-[15%] w-[480px] h-[480px] rounded-full bg-skyz-accent/5 blur-[130px]" />
            <div className="absolute bottom-[-12%] right-[-8%] w-[520px] h-[520px] rounded-full bg-skyz-accent-secondary/5 blur-[150px]" />
            <div className="absolute inset-0 bg-dots-pattern opacity-25" />
          </div>

          {/* mobile progress bar */}
          <div className="absolute top-0 inset-x-0 h-0.5 bg-skyz-border-subtle md:hidden" aria-hidden>
            <motion.div style={{ scaleX: scrollYProgress }} className="h-full origin-left bg-skyz-accent/70" />
          </div>

          {/* desktop progress rail */}
          <div className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col items-center gap-3" aria-hidden>
            <span className="font-mono text-[9px] text-skyz-text-muted tracking-widest [writing-mode:vertical-lr]">
              THE STORY
            </span>
            <div className="relative w-px h-44 bg-skyz-border">
              <motion.div
                style={{ scaleY: railFill }}
                className="absolute inset-0 origin-top bg-skyz-accent"
              />
              {ACTS.map((a, i) => (
                <span
                  key={a.key}
                  className={`absolute -left-[3.5px] w-2 h-2 rounded-full border transition-colors duration-500 ${
                    i <= activeAct
                      ? 'bg-skyz-accent border-skyz-accent'
                      : 'bg-skyz-bg border-skyz-border'
                  }`}
                  style={{ top: `${(i / (N_ACTS - 1)) * 100}%`, transform: 'translateY(-50%)' }}
                />
              ))}
            </div>
            <span className="font-mono text-[9px] text-skyz-text-muted">03</span>
          </div>

          {/* the three acts, film-cutting under scroll control */}
          <motion.div style={{ opacity: closingDim }} className="absolute inset-0">
            {ACTS.map((_, i) => (
              <ActLayer
                key={ACTS[i].key}
                index={i}
                progress={jsProgress}
                flingBlur={flingBlur}
                active={i === activeAct}
                closing={closing}
                reduced={!!reduced}
              />
            ))}
          </motion.div>

          {/* scroll hint */}
          <div className="absolute bottom-6 right-6 hidden md:flex items-center gap-2 font-mono text-[10px] text-skyz-text-muted" aria-hidden>
            SCROLL <span className="inline-block">↓</span>
          </div>

          {/* closing beat — one connected studio */}
          <motion.div
            style={{ opacity: closingOpacity, y: closingY, pointerEvents: closing ? 'auto' : 'none' }}
            className="absolute bottom-10 sm:bottom-14 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-xl z-20"
          >
            <div className="rounded-[2rem] bg-skyz-surface border border-skyz-border shadow-xl px-6 sm:px-8 py-6 text-center">
              <p className="font-display text-lg sm:text-2xl font-bold tracking-tight text-skyz-text">
                One connected studio — <span className="text-skyz-accent">every pillar feeds the next.</span>
              </p>
              <button
                type="button"
                onClick={() => navigate('services')}
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] text-xs sm:text-sm font-semibold shadow-md hover:bg-skyz-accent dark:hover:bg-skyz-accent-secondary transition-all cursor-pointer"
              >
                Explore all services
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* breathing spacer — the story exhales before the next section arrives */}
      <div aria-hidden className="h-[16vh] md:h-[22vh]" />
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Header + reduced-motion static acts                                  */
/* ------------------------------------------------------------------ */

const StoryHeader: React.FC<{ navigate: (p: 'services') => void }> = ({ navigate }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-6 sm:pb-10">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="max-w-2xl space-y-4">
        <Eyebrow>Core Capabilities</Eyebrow>
        <h2 className="font-display text-3xl sm:text-5xl text-skyz-text tracking-tight font-bold">
          Build. Grow. Automate.
        </h2>
        <p className="text-base sm:text-lg text-skyz-text-muted leading-relaxed">
          Three pillars, one connected system — told as a story. Keep scrolling.
        </p>
      </div>
      <button
        type="button"
        onClick={() => navigate('services')}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-skyz-text hover:text-skyz-accent transition-colors self-start md:self-auto cursor-pointer"
      >
        <span>Explore All Services</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const ActStatic: React.FC<{ index: number }> = ({ index }) => {
  const act = ACTS[index];
  const { navigate } = useNavigation();
  const cap = CAPABILITIES.find((c) => c.category === act.key);
  return (
    <div className="rounded-[2rem] bg-skyz-surface border border-skyz-border p-6 sm:p-10 grid md:grid-cols-2 gap-8 items-center">
      <div>
        <span className="font-mono text-[10px] tracking-[0.3em] text-skyz-accent font-bold">{act.label}</span>
        <h3 className="mt-3 font-display text-2xl sm:text-4xl font-bold tracking-tight text-skyz-text">
          {act.title}
        </h3>
        <p className="mt-3 text-sm sm:text-base text-skyz-text-muted leading-relaxed">{act.story}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {(cap?.services ?? []).map((s) => (
            <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-skyz-surface-subtle text-skyz-text border border-skyz-border">
              {s}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={() => navigate('contact', { serviceCategory: act.key })}
          className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-skyz-text hover:text-skyz-accent transition-colors cursor-pointer"
        >
          Inquire about {act.key.charAt(0) + act.key.slice(1).toLowerCase()} services
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
      <act.Widget on={false} />
    </div>
  );
};
