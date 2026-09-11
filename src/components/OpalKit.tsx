import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Youtube, ExternalLink } from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Reveal — soft motion-driven scroll reveal (Opal/Labs feel)          */
/* ------------------------------------------------------------------ */
export const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}> = ({ children, delay = 0, y = 28, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-70px' }}
    transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

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
/* ------------------------------------------------------------------ */
export const Blob: React.FC<{
  className?: string;
  color?: string;
  animate?: boolean;
  duration?: number;
}> = ({ className = '', color = 'rgba(124, 58, 237, 0.10)', animate = true, duration = 10 }) => (
  <motion.div
    aria-hidden
    className={`pointer-events-none absolute ${className}`}
    style={{
      backgroundColor: color,
      borderRadius: '38% 62% 63% 37% / 41% 44% 56% 59%',
    }}
    animate={animate ? { y: [0, -16, 0], rotate: [0, 3, 0] } : undefined}
    transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
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
  videoId = 'QEJhjQSdG-M',
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
/* (Putty hero playful badges)                                         */
/* ------------------------------------------------------------------ */
export const FloatingTag: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => (
  <motion.span
    aria-hidden
    className={`absolute hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold shadow-md ${className}`}
    initial={{ opacity: 0, scale: 0.6 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, type: 'spring', stiffness: 260, damping: 18 }}
  >
    <motion.span
      className="inline-flex items-center gap-1.5"
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.span>
  </motion.span>
);

export { ExternalLink };
