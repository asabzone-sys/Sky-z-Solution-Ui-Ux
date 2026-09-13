/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Play, Youtube, ExternalLink } from 'lucide-react';

/* Performance note: this module is intentionally free of `motion/react`.
 * It is imported by the eager home-page shell (Navbar, Hero, WorkCarousel,
 * ContactCTA), so keeping it Motion-free keeps the animation library out of
 * the initial bundle. Reveal/Blob/FloatingTag reproduce the exact same visual
 * behavior with IntersectionObserver + CSS keyframes (compositor-driven and
 * immune to library-level issues). */

/* ------------------------------------------------------------------ */
/* Reveal — soft scroll reveal (Opal/Labs feel), once per element      */
/* ------------------------------------------------------------------ */
export const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}> = ({ children, delay = 0, y = 28, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setShown(true); return; }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '-70px 0px -70px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translateY(${y}px)`,
        transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* SectionShell — Opal-style floating rounded section with breathing   */
/* space around it (the big card look from opal.google)                */
/* ------------------------------------------------------------------ */
export const SectionShell: React.FC<{
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  id?: string;
}> = ({ children, className = '', innerClassName = '', id }) => (
  <section id={id} className={`w-full px-2 sm:px-4 lg:px-6 py-6 sm:py-8 ${className}`}>
    <div className={`relative overflow-hidden rounded-[2rem] sm:rounded-[2.75rem] ${innerClassName}`}>
      {children}
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Blob — soft organic color shape (labs.google playful background)    */
/* Now pure CSS: compositor bob + gentle rotate, GPU-cheap.            */
/* ------------------------------------------------------------------ */
export const Blob: React.FC<{
  className?: string;
  color?: string;
  animate?: boolean;
  duration?: number;
}> = ({ className = '', color = 'rgba(124, 58, 237, 0.10)', animate = true, duration = 10 }) => (
  <div
    aria-hidden
    className={`pointer-events-none absolute ${animate ? 'skz-blob-float' : ''} ${className}`}
    style={{
      backgroundColor: color,
      borderRadius: '38% 62% 63% 37% / 41% 44% 56% 59%',
      animationDuration: `${duration}s`,
    }}
  />
);

/* ------------------------------------------------------------------ */
/* VideoSection — the labs.google/playwithputty YouTube embed card:    */
/* dark rounded frame, thumbnail with play button, watch-on-YouTube    */
/* ------------------------------------------------------------------ */
export const VideoSection: React.FC<{
  videoId?: string;
  heading?: string;
  caption?: string;
  title: string;
}> = ({
  videoId = 'dYISWlAxUVs',
  heading,
  caption,
  title,
}) => {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-6">
      {(heading || caption) && (
        <Reveal className="text-center mb-10 sm:mb-14 space-y-3">
          {heading && (
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-skyz-text">
              {heading}
            </h2>
          )}
          {caption && (
            <p className="text-sm sm:text-base text-skyz-text-muted max-w-xl mx-auto leading-relaxed">
              {caption}
            </p>
          )}
        </Reveal>
      )}

      <Reveal delay={0.1}>
        <div className="rounded-[1.5rem] sm:rounded-[2rem] bg-[#14161B] dark:bg-black p-2 sm:p-3 shadow-2xl shadow-skyz-accent/10 border border-skyz-border">
          {/* Header row — Putty style */}
          <div className="flex items-center gap-2.5 px-2 pt-1.5 pb-2.5">
            <span className="w-6 h-6 rounded-full bg-skyz-accent flex items-center justify-center flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-white/90" />
            </span>
            <div className="min-w-0">
              <div className="text-white text-xs sm:text-sm font-semibold truncate">{title}</div>
              <div className="text-white/40 text-[10px] sm:text-xs">SkyZ Solutions</div>
            </div>
          </div>

          {/* Video frame */}
          <div className="relative rounded-[1rem] sm:rounded-[1.4rem] overflow-hidden bg-black aspect-video group">
            {playing ? (
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="absolute inset-0 w-full h-full cursor-pointer"
                aria-label={`Play video: ${title}`}
              >
                <img
                  src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
                  alt={title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
                  }}
                />
                <span className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-11 sm:w-20 sm:h-14 rounded-xl bg-red-600 flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-110">
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-white ml-0.5" />
                </span>
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur text-white/80 text-[10px] sm:text-xs font-medium">
                  Watch on <Youtube className="w-4 h-4" /> YouTube
                </span>
              </button>
            )}
          </div>
        </div>
      </Reveal>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Eyebrow — small caps section label pill (shared micro-language)     */
/* ------------------------------------------------------------------ */
export const Eyebrow: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <span
    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-skyz-surface border border-skyz-border shadow-sm text-[11px] font-mono uppercase tracking-widest text-skyz-text-muted font-semibold ${className}`}
  >
    {children}
  </span>
);

/* ------------------------------------------------------------------ */
/* FloatingTag — tiny cursor-tag chips that float around hero type     */
/* (Putty hero playful badges) — CSS pop-in + bob loop                 */
/* ------------------------------------------------------------------ */
export const FloatingTag: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => (
  <span
    aria-hidden
    className={`absolute skz-tag-pop inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-bold shadow-sm sm:shadow-md pointer-events-none select-none z-10 ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    <span
      className="inline-flex items-center gap-1.5 skz-tag-bob"
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </span>
  </span>
);

export { ExternalLink };
