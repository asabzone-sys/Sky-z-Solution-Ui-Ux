import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import {
  PORTFOLIO_PROJECTS,
  ProjectVisual,
  getServiceBadgeStyle,
  PortfolioProject,
} from '../data/portfolio';
import { useNavigation } from '../context/NavigationContext';
import { Reveal, SectionShell, Blob, Eyebrow } from '../components/OpalKit';

const PILLAR_FILTERS = ['ALL', 'BUILD', 'GROW', 'AUTOMATE'] as const;
const N = PORTFOLIO_PROJECTS.length;

/** Signed shortest distance in slot units from a to b, wrapped on the ring. */
const wrapDelta = (d: number) => {
  const w = ((d % N) + N) % N;
  return w > N / 2 ? w - N : w;
};

/**
 * Home portfolio preview — continuous conveyor showcase.
 *
 * Motion model: `S.pos` is a float position in "slot units" on a ring of N
 * cards. Every frame, each card's pixel offset is `wrapDelta(i - pos) * STEP`
 * and its scale / opacity / y / rotation are continuous functions of that
 * signed distance — so emphasis emerges as a card glides through the center
 * and dissolves as it leaves. Auto-advance just nudges a spring target; the
 * spring interpolates everything, so there are no snaps, resets or mounts.
 * All motion is transform/opacity only (GPU-composited, no reflow), React
 * re-renders only when the centered slot index changes.
 */
export const WorkCarousel: React.FC = () => {
  const { navigate } = useNavigation();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Mutable motion state — deliberately outside React state (no re-renders).
  const S = useRef({
    pos: 0,        // current belt position, in slot units
    target: 0,     // spring target, in slot units
    vel: 0,        // slots per frame (~16.7ms)
    x0: 0, y0: 0,  // pointer-down origin
    pos0: 0,       // belt position at pointer-down
    lastMove: 0,
    locked: false,     // horizontal drag intent confirmed
    suppress: false,   // suppress the click after a drag
    dragging: false,
    pause: false,      // hover / focus pause for auto-advance
    visible: true,     // IntersectionObserver gate
    vw: 1440,
    autoT: 0,          // ms accumulated toward the next auto-advance
  }).current;

  const [activeSlot, setActiveSlot] = useState(0);
  const activeSlotRef = useRef(0);
  const [dragging, setDragging] = useState(false);

  // Responsive card geometry (content size only — emphasis comes from scale)
  const [dims, setDims] = useState({ baseW: 420, gap: 48 });
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      S.vw = vw;
      const baseW = vw < 640 ? Math.min(300, vw - 88) : vw < 1024 ? 360 : 420;
      const gap = vw < 640 ? 14 : vw < 1024 ? 32 : 48;
      setDims((d) => (d.baseW === baseW && d.gap === gap ? d : { baseW, gap }));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [S]);
  const STEP = dims.baseW + dims.gap;

  // ── The animation loop ────────────────────────────────────────────────
  useEffect(() => {
    // Motion is always on (product decision): the carousel auto-advances and
    // springs with the same cinematic feel for every visitor. The old
    // prefers-reduced-motion special case here silently killed auto-advance
    // on devices whose OS reports reduce-motion — the belt looked broken.
    let raf = 0;
    let last = 0;

    const frame = (t: number) => {
      const dt = Math.min(48, t - (last || t));
      last = t;
      const n = dt / 16.7; // normalize to ~60fps frames

      if (!S.dragging) {
        // Auto-advance: nudge the target one slot forward on a cadence.
        if (S.visible && !S.pause) {
          S.autoT += dt;
          if (S.autoT > 2800) {
            S.autoT = 0;
            S.target += 1;
          }
        }
        // Spring integration (soft, near-critically-damped)
        const k = 0.045;
        const c = 0.32;
        S.vel += (-k * (S.pos - S.target) - c * S.vel) * n;
        S.pos += S.vel * n;
        if (Math.abs(S.vel) < 0.0004 && Math.abs(S.pos - S.target) < 0.0004) {
          S.pos = S.target;
          S.vel = 0;
        }
      }

      // Which slot is centered? (React state only when it changes)
      const nearest = ((Math.round(S.pos) % N) + N) % N;
      if (nearest !== activeSlotRef.current) {
        activeSlotRef.current = nearest;
        setActiveSlot(nearest);
        S.autoT = 0;
      }

      // Paint every card from continuous functions of its ring distance.
      for (let i = 0; i < N; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        const d = wrapDelta(i - S.pos);          // signed slots from center
        const dx = d * STEP;                     // signed px from center
        const ad = Math.abs(d);
        const a = Math.min(1, ad / 2);           // 0 center → 1 two slots away
        const scale = 1 - 0.28 * Math.pow(a, 1.6);
        const opacity = 1 - 0.5 * Math.pow(a, 1.5);
        const y = 14 * a;
        const rot = d * 2.4;
        el.style.transform =
          `translate3d(${dx.toFixed(1)}px, ${y.toFixed(1)}px, 0) ` +
          `scale(${scale.toFixed(4)}) rotate(${rot.toFixed(2)}deg)`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = String(60 - Math.round(a * 50));
        el.style.pointerEvents = a > 0.92 ? 'none' : 'auto';
        el.style.visibility =
          Math.abs(dx) > S.vw / 2 + STEP ? 'hidden' : 'visible';
      }
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [STEP, S]);

  // Pause auto-advance while the belt is off-screen.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => { S.visible = entries[0].isIntersecting; },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [S]);

  // ── Drag / swipe (pointer events, vertical-scroll friendly) ──────────
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    S.dragging = true;
    S.locked = false;
    S.suppress = false;
    S.x0 = e.clientX;
    S.y0 = e.clientY;
    S.pos0 = S.pos;
    S.vel = 0;
    S.lastMove = performance.now();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!S.dragging) return;
    const dx = e.clientX - S.x0;
    const dy = e.clientY - S.y0;
    if (!S.locked) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      if (Math.abs(dy) > Math.abs(dx)) { // vertical intent → let page scroll
        S.dragging = false;
        return;
      }
      S.locked = true;
      S.suppress = true;
      setDragging(true);
      wrapRef.current?.setPointerCapture?.(e.pointerId);
    }
    const now = performance.now();
    const dtm = Math.max(1, now - S.lastMove);
    S.lastMove = now;
    const np = S.pos0 + dx / STEP;
    S.vel = ((np - S.pos) / dtm) * 16.7; // → slots per frame
    S.pos = np;
    S.target = np;
  };

  const onPointerUp = () => {
    if (!S.dragging) return;
    S.dragging = false;
    setDragging(false);
    if (!S.locked) return;
    // Momentum: project where the fling decays, then settle on that slot.
    const proj = S.pos + S.vel * 12;
    S.target = Math.round(proj);
    S.vel *= 0.4;
    S.autoT = 0;
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (S.suppress) {
      e.preventDefault();
      e.stopPropagation();
      S.suppress = false;
    }
  };

  // ── Animated navigation (the spring covers the distance) ─────────────
  const go = (delta: number) => { S.target += delta; S.autoT = 0; };
  const goTo = (i: number) => { S.target += wrapDelta(i - Math.round(S.target)); S.autoT = 0; };
  const jumpToPillar = (pillar: (typeof PILLAR_FILTERS)[number]) => {
    const idx = PORTFOLIO_PROJECTS.findIndex((p) => (pillar === 'ALL' ? true : p.pillar === pillar));
    if (idx !== -1) goTo(idx);
  };

  // ── Card (content + markup unchanged from the original design) ───────
  const CardBody: React.FC<{ project: PortfolioProject }> = ({ project }) => (
    <>
      <div className="relative w-full rounded-[1.4rem] overflow-hidden aspect-[16/11]">
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
    </>
  );

  const Card: React.FC<{ project: PortfolioProject }> = ({ project }) => (
    <button
      type="button"
      onClick={() => navigate('work')}
      className="block w-full text-left rounded-[2rem] bg-skyz-bg border border-skyz-border shadow-sm card-shadow-flank hover:border-skyz-accent/40 transition-colors duration-300 p-3 sm:p-4 cursor-pointer"
    >
      <CardBody project={project} />
    </button>
  );

  return (
    <SectionShell id="work">
      <div className="bg-skyz-surface border border-skyz-border rounded-[inherit] px-0 py-16 sm:py-24 relative overflow-hidden">
        <Blob className="w-[380px] h-[340px] top-1/3 -left-32 opacity-70" color="rgba(59, 130, 246, 0.10)" duration={12} />
        <Blob className="w-[360px] h-[330px] -top-20 right-[-110px] opacity-70" color="rgba(16, 185, 129, 0.09)" duration={10} />

        <div className="relative z-10 flex flex-col items-center">
          <Reveal className="text-center space-y-4 mb-12 px-4">
            <Eyebrow>Selected Work</Eyebrow>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-skyz-text">
              Made in the studio.
            </h2>
          </Reveal>

          {/* Continuous belt viewport */}
          <Reveal delay={0.08} className="w-full">
            <div
              ref={wrapRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onClickCapture={onClickCapture}
              onMouseEnter={() => { if (!S.dragging) S.pause = true; }}
              onMouseLeave={() => { S.pause = false; }}
              onFocus={() => { S.pause = true; }}
              onBlur={() => { S.pause = false; }}
              className={`relative w-full py-5 select-none touch-pan-y ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            >
              {/* Invisible spacer defines the belt height (no layout thrash) */}
              <div aria-hidden className="invisible mx-auto" style={{ width: dims.baseW }}>
                <div className="rounded-[2rem] border border-transparent p-3 sm:p-4">
                  <CardBody project={PORTFOLIO_PROJECTS[0]} />
                </div>
              </div>

              {/* The belt — every card painted every frame via transforms */}
              <div className="absolute inset-0">
                {PORTFOLIO_PROJECTS.map((project, i) => (
                  <div
                    key={project.id}
                    ref={(el) => { itemRefs.current[i] = el; }}
                    className="absolute top-5 left-1/2 will-change-transform"
                    style={{
                      width: dims.baseW,
                      marginLeft: -dims.baseW / 2,
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <Card project={project} />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Controls — arrows + progress dots */}
          <div className="flex items-center gap-4 mt-8 px-4">
            <button
              type="button"
              aria-label="Previous project"
              onClick={() => go(-1)}
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
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 cursor-pointer w-12 h-12 flex items-center justify-center group`}
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      i === activeSlot ? 'w-6 bg-skyz-accent' : 'w-1.5 bg-skyz-border group-hover:bg-skyz-text-muted'
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              aria-label="Next project"
              onClick={() => go(1)}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-skyz-bg border border-skyz-border shadow-sm flex items-center justify-center text-skyz-text hover:text-skyz-accent hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Quick-jump pillar chips — Labs-style quiet filters */}
          <Reveal delay={0.14} className="w-full">
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8 px-4">
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
