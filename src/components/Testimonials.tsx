import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { SectionShell, Eyebrow } from '../components/OpalKit';
import { useTestimonials } from '../lib/supabase';

/**
 * Testimonials — premium single-story carousel.
 *
 * One testimonial on stage at a time, with its siblings faintly present at
 * the edges (depth, not a grid). Drag/swipe/keys/arrows all move through the
 * same spring. The signature detail: the giant background numeral — the
 * section's quiet graphic identity — crossfades + drifts as stories change.
 *
 * Motion: transform/opacity only; springs for drag physics; prefers-reduced-
 * motion shortens transitions instead of removing the section.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Directional story transition. Motion resolves these per-side via `custom`,
 * which is the only supported way to pass dynamic values — inline function
 * `initial`/`exit` props produce NaN keyframes (broken fades).
 */
const storyVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: (dir >= 0 ? 1 : -1) * 90,
    scale: 0.985,
    rotate: (dir >= 0 ? -1 : 1) * 0.5,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.7, ease: EASE },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: (dir >= 0 ? -1 : 1) * 90,
    scale: 0.985,
    rotate: (dir >= 0 ? 1 : -1) * 0.5,
    transition: { duration: 0.45, ease: EASE },
  }),
};
/** shortest signed distance around the ring (for the faint edge siblings) */
const wrapDelta = (d: number, n: number) => {
  const half = n / 2;
  if (d > half) return d - n;
  if (d < -half) return d + n;
  return d;
};

export const Testimonials: React.FC = () => {
  const TESTIMONIALS = useTestimonials();
  const n = TESTIMONIALS.length;
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(0);              // -1 | 0 | 1 — story direction
  const [[dragX, dragging], setDrag] = useState<[number, boolean]>([0, false]);
  const pointerIdRef = useRef<number | null>(null);
  const startXRef = useRef(0);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const go = useCallback((next: number) => {
    setDir(next > index || (index === n - 1 && next === 0) ? 1 : -1);
    setIndex(((next % n) + n) % n);
  }, [index]);

  const step = useCallback((d: number) => {
    setDir(d);
    setIndex((i) => ((i + d) % n + n) % n);
  }, []);

  /* keyboard navigation */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
  };

  /* pointer drag (touch + mouse) */
  const onPointerDown = (e: React.PointerEvent) => {
    pointerIdRef.current = e.pointerId;
    startXRef.current = e.clientX;
    setDrag([0, true]);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (pointerIdRef.current !== e.pointerId) return;
    const dx = e.clientX - startXRef.current;
    if (Math.abs(dx) > 4) setDrag([dx, true]);
  };
  const endDrag = (e?: React.PointerEvent) => {
    if (e && pointerIdRef.current !== e.pointerId) return;
    pointerIdRef.current = null;
    setDrag(([dx]) => {
      if (Math.abs(dx) > 56) step(dx < 0 ? 1 : -1);
      else setDir(0);
      return [0, false];
    });
  };

  const t = TESTIMONIALS[index];
  const dist = (i: number) => wrapDelta(i - index, n);
  const dragProgress = Math.max(-1, Math.min(1, dragX / (typeof window !== 'undefined' ? window.innerWidth * 0.5 : 400)));

  return (
    <SectionShell id="testimonials" className="testimonials-section">
      <div className="relative rounded-[inherit] bg-skyz-surface border border-skyz-border overflow-hidden transition-colors duration-200">
        {/* giant background numeral — the section's graphic signature */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={index}
              initial={{ opacity: 0, x: dir >= 0 ? 120 : -120, scale: 0.98 }}
              animate={{ opacity: 0.07, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: dir >= 0 ? -120 : 120, scale: 1.02 }}
              transition={{ duration: reducedRef.current ? 0.15 : 0.85, ease: EASE }}
              className="absolute -right-6 -top-10 sm:right-2 sm:top-0 font-display font-extrabold leading-none text-skyz-text"
              style={{ fontSize: 'clamp(12rem, 34vw, 30rem)' }}
            >
              0{index + 1}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-12 py-16 sm:py-24">
          {/* header */}
          <div className="flex items-end justify-between gap-6 mb-12 sm:mb-16">
            <div className="space-y-4">
              <Eyebrow>Client Stories</Eyebrow>
              <h2 className="font-display text-3xl sm:text-5xl text-skyz-text tracking-tight font-bold">
                In their words.
              </h2>
            </div>
            <div className="hidden sm:flex font-mono text-xs text-skyz-text-muted items-center gap-2 pb-1">
              <span className="text-skyz-text font-bold">{String(index + 1).padStart(2, '0')}</span>
              <span className="w-8 h-px bg-skyz-border" />
              <span>0{n}</span>
            </div>
          </div>

          {/* stage */}
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Client testimonials"
            tabIndex={0}
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={endDrag}
            className={`relative outline-none touch-pan-y select-none cursor-grab ${dragging ? 'cursor-grabbing' : ''}`}
          >
            {/* faint edge siblings — depth without a grid */}
            <div className="absolute inset-y-0 left-0 right-0 pointer-events-none" aria-hidden>
              {TESTIMONIALS.map((sib, i) => {
                const d = dist(i);
                if (Math.abs(d) !== 1) return null;
                const side = d > 0 ? 1 : -1;
                return (
                  <motion.div
                    key={sib.id}
                    animate={{
                      opacity: 0.35 - Math.abs(dragProgress) * 0.25,
                      x: `calc(${side * 100}% + ${side * 40 - dragX * 0.35}px)`,
                    }}
                    transition={{ type: 'spring', stiffness: 210, damping: 30 }}
                    className="absolute top-6 bottom-6 w-[42vw] max-w-[380px]"
                    style={{ [side > 0 ? 'right' : 'left']: '-44%' } as React.CSSProperties}
                  >
                    <div className="h-full rounded-[2rem] border border-skyz-border-subtle bg-skyz-bg p-8 sm:p-10 flex flex-col justify-between">
                      <Quote className="w-7 h-7 text-skyz-accent/40" />
                      <p className="text-sm text-skyz-text-muted leading-relaxed line-clamp-3">{sib.quote}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* the active story */}
            <div className="relative z-10 min-h-[380px] sm:min-h-[360px] flex items-center py-2">
              <AnimatePresence mode="popLayout" custom={dir} initial={false}>
                <motion.div
                  key="drag-follow"
                  style={{ x: dragging ? dragX : 0 }}
                  className="w-full"
                >
                <motion.figure
                  key={t.id}
                  custom={dir}
                  variants={storyVariants}
                  initial={reducedRef.current ? 'center' : 'enter'}
                  animate="center"
                  exit={reducedRef.current ? 'center' : 'exit'}
                  className="w-full max-w-2xl mx-auto text-center px-2 sm:px-6"
                >
                  <blockquote className="relative">
                    <Quote className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-8 text-skyz-accent/50" fill="currentColor" strokeWidth={0} />
                    <p className="font-display text-2xl sm:text-4xl leading-snug tracking-tight text-skyz-text font-medium">
                      “{t.quote}”
                    </p>
                  </blockquote>

                  <figcaption className="mt-10 flex items-center justify-center gap-4">
                    <span
                      className="w-11 h-11 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-md"
                      style={{ backgroundColor: t.accent }}
                    >
                      {t.initials}
                    </span>
                    <span className="text-left">
                      <span className="block font-display font-bold text-skyz-text text-sm sm:text-base">{t.name}</span>
                      <span className="block text-xs sm:text-sm text-skyz-text-muted">{t.role}</span>
                    </span>
                    <span className="hidden sm:inline-block font-mono text-[10px] px-2.5 py-1 rounded-full bg-skyz-surface-subtle text-skyz-text-muted border border-skyz-border ml-2">
                      {t.service}
                    </span>
                  </figcaption>
                </motion.figure>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* controls */}
          <div className="mt-10 sm:mt-12 flex items-center justify-between">
            {/* progress rail */}
            <div className="flex items-center gap-2" role="tablist" aria-label="Choose testimonial">
              {TESTIMONIALS.map((tm, i) => (
                <button
                  key={tm.id}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Testimonial ${i + 1}: ${tm.name}`}
                  onClick={() => go(i)}
                  className="group p-1.5 cursor-pointer"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-500 ${
                      i === index
                        ? 'w-10 bg-skyz-accent'
                        : 'w-3 bg-skyz-border group-hover:bg-skyz-text-muted'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* arrows */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous testimonial"
                className="w-11 h-11 rounded-full border border-skyz-border bg-skyz-bg flex items-center justify-center text-skyz-text-muted hover:text-skyz-text hover:border-skyz-accent/40 hover:shadow-md transition-all cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-4.5 h-4.5" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next testimonial"
                className="w-11 h-11 rounded-full border border-skyz-border bg-skyz-bg flex items-center justify-center text-skyz-text-muted hover:text-skyz-text hover:border-skyz-accent/40 hover:shadow-md transition-all cursor-pointer active:scale-95"
              >
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
};

export default Testimonials;
