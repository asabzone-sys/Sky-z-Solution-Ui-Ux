import React, { useEffect, useRef, useState } from 'react';

/**
 * LoopedVideo — for uploaded MP4/WebM motion work a card IS the video:
 * muted, looping, autoplay — COSMOS-style living cards. YouTube entries stay
 * click-to-play (embeds can't be sensibly muted-looped inline).
 *
 * Performance rules baked in:
 * - the element only MOUNTS when the card is near the viewport (no
 *   off-screen network/battery cost — crucial when a surface holds many videos)
 * - plays/pauses with the viewport via IntersectionObserver
 * - pauses when a sibling lightbox/modal is open (`paused`) and resumes after
 * - `preload="metadata"` so we never download full files for parked cards
 * - honours reduced-motion via `paused`: static poster frame only, click
 *   handlers above it still open the full player
 * - smooth hover slow-motion: playbackRate glides 1 ⇄ 0.45 with a lerped
 *   rAF loop instead of snapping — a hard rate change stutters the decode
 *   pipeline for a beat. The loop self-terminates once settled.
 *
 * Needs a positioned (relative) ancestor; it paints itself absolute inset-0.
 */
const LoopedVideo: React.FC<{
  src: string;
  poster?: string;
  paused: boolean;       // shared pause state: lightbox open / modal / reduced motion
  thumb?: string | null; // poster shown before the video mounts
  alt: string;
  hovered: boolean;      // drives the smooth slow-motion on hover
}> = ({ src, poster, paused, thumb, alt, hovered }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [nearViewport, setNearViewport] = useState(false);
  const userPaused = paused;

  // Mount the tag only once the card approaches the viewport. Horizontal
  // belts move cards via a parent transform, and IntersectionObserver
  // rootMargin is axis-symmetric — '%' margins only extend the box, they
  // don't cover a later parent translation. A generous symmetric ROOT-px
  // margin covers ~2 cards of travel on both axes.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const margin = () => `${Math.round(Math.max(window.innerWidth * 0.5, 320))}px`;
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

  // smooth hover slow-motion
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

export default LoopedVideo;
