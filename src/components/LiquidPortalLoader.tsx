import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * LiquidPortalLoader — premium cinematic one-time entry experience.
 *
 * Timeline (single clock, all phases continuous — no cuts):
 *   0.0–1.2s  logo fades in (staggered mark → wordmark)
 *   1.6–2.7s  the liquid portal ring forms around the logo
 *   2.7–3.6s  camera pushes through the portal (scale + parallax + streaks)
 *   3.4–4.3s  liquid recedes backward while the homepage fades in behind
 *   ~4.6s     overlay fully transparent → unmounted, scroll unlocked
 *
 * Premium layer system (all Canvas 2D, GPU-friendly, no new deps):
 *   - drifting aurora fields behind everything
 *   - slow parallax starfield (subtle depth, recedes with the veil)
 *   - 3D-tilted elliptical portal ring (perspective, not a flat circle)
 *   - rotating specular highlight arcs on the ring rim
 *   - inner glass rim + outer soft aura
 *   - motion-blur streak field through the tunnel
 *   - fine animated film grain over the whole scene
 *
 * Mobile: fewer stars/streaks, capped DPR, capped zoom, softer blur.
 * prefers-reduced-motion (or missing canvas) → short logo fade instead.
 */

/* ---------- easing helpers ---------- */
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (a: number, b: number, t: number) => {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};
/** 0→1→0 envelope between a..b (rise) and b..c (fall) */
const bell = (t: number, a: number, b: number, c: number, d: number) =>
  smooth(a, b, t) * (1 - smooth(c, d, t));
const easeInCubic = (x: number) => x * x * x;
const easeOutQuart = (x: number) => 1 - Math.pow(1 - x, 4);

/* deterministic pseudo-random — stable star field across frames */
const hash01 = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

export const LiquidPortalLoader: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  // Debug affordance: ?portal=slow stretches the whole timeline ~3x so the
  // choreography can be inspected frame by frame. ?portal=2.5 freezes the
  // timeline at t=2.5s for still inspection. No effect in normal use.
  const { TS, freeze } = useState(() => {
    const q = new URLSearchParams(window.location.search).get('portal');
    const frozen = q !== null && q !== 'slow' ? parseFloat(q) : NaN;
    return { TS: q === 'slow' ? 0.35 : 1, freeze: Number.isFinite(frozen) ? frozen : -1 };
  })[0];
  const [simple, setSimple] = useState(false);       // reduced-motion / no-canvas path
  const [gone, setGone] = useState(false);           // triggers AnimatePresence exit
  const doneRef = useRef(onDone);                    // stable callback → effect never restarts
  useEffect(() => { doneRef.current = onDone; }, [onDone]);
  const backRef = useRef<HTMLCanvasElement | null>(null);
  const frontRef = useRef<HTMLCanvasElement | null>(null);
  const sizeRef = useRef({ w: 1440, h: 900, dpr: 1, mobile: false });

  /* ---------- scroll lock while active ---------- */
  useEffect(() => {
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = prevOverflow; };
  }, []);

  /* ---------- capability check ---------- */
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const test = document.createElement('canvas');
    const okCanvas = !!(test.getContext && test.getContext('2d'));
    if (reduce || !okCanvas) setSimple(true);
  }, []);

  /* ---------- the show ---------- */
  useEffect(() => {
    if (simple) {
      const t = setTimeout(() => { setGone(true); setTimeout(() => doneRef.current(), 350); }, 1700);
      return () => clearTimeout(t);
    }

    const back = backRef.current, front = frontRef.current;
    if (!back || !front) return;
    const bctx = back.getContext('2d');
    const fctx = front.getContext('2d');
    if (!bctx || !fctx) { setSimple(true); return; }

    /* ----- sizing (mobile-aware, DPR capped) ----- */
    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      const mobile = w < 640;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
      sizeRef.current = { w, h, dpr, mobile };
      for (const c of [back, front]) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
        c.style.width = w + 'px';
        c.style.height = h + 'px';
      }
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    /* ----- palette ----- */
    const CYAN = '56,189,248';    // brand accent
    const BLUE = '59,130,246';
    const VIOLET = '167,139,250'; // brand secondary
    const WHITE = '255,255,255';

    let raf = 0;
    const t0 = performance.now();

    /* completion guard — rAF can be suspended indefinitely (hidden tab),
     * so a wall-clock failsafe guarantees the page is never locked out */
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setGone(true);
      setTimeout(() => doneRef.current(), 420);
    };
    const failsafe = setTimeout(finish, 12000);

    const frame = (now: number) => {
      const t = freeze >= 0 ? freeze : ((now - t0) / 1000) * TS;   // seconds
      const { w, h, mobile } = sizeRef.current;
      const cx = w / 2, cy = h / 2;
      const minDim = Math.min(w, h);

      const portal = smooth(1.6, 2.7, t);          // ring forms
      const enter = smooth(2.7, 3.6, t);           // camera passes through
      const recede = smooth(3.4, 4.3, t);          // liquid recedes
      const bgFade = 1 - smooth(3.7, 4.8, t);      // overlay lets go

      /* ---------- back canvas: bg + aurora + stars + portal ---------- */
      bctx.clearRect(0, 0, w, h);
      const bg = bctx.createRadialGradient(cx, cy * 0.92, minDim * 0.1, cx, cy, Math.max(w, h) * 0.75);
      bg.addColorStop(0, `rgba(10,30,60,${0.98 * bgFade})`);
      bg.addColorStop(0.55, `rgba(6,18,36,${0.99 * bgFade})`);
      bg.addColorStop(1, `rgba(3,8,18,${bgFade})`);
      bctx.fillStyle = bg;
      bctx.fillRect(0, 0, w, h);

      /* drifting aurora fields — huge, slow, barely-there color washes */
      if (bgFade > 0.02) {
        bctx.save();
        bctx.globalCompositeOperation = 'lighter';
        const auras: Array<[number, number, number, string, number]> = [
          // cx-fraction, cy-fraction, radius fraction, color, alpha
          [0.24 + Math.sin(t * 0.16) * 0.05, 0.26 + Math.cos(t * 0.13) * 0.04, 0.5, BLUE, 0.10],
          [0.78 + Math.cos(t * 0.11) * 0.05, 0.72 + Math.sin(t * 0.15) * 0.04, 0.55, CYAN, 0.07],
          [0.62 + Math.sin(t * 0.09 + 2) * 0.06, 0.18 + Math.cos(t * 0.12 + 1) * 0.05, 0.4, VIOLET, 0.05],
        ];
        for (const [ax, ay, ar, col, al] of auras) {
          const g = bctx.createRadialGradient(ax * w, ay * h, 0, ax * w, ay * h, ar * Math.max(w, h));
          g.addColorStop(0, `rgba(${col},${al * bgFade})`);
          g.addColorStop(1, 'rgba(0,0,0,0)');
          bctx.fillStyle = g;
          bctx.fillRect(0, 0, w, h);
        }
        bctx.restore();
      }

      /* parallax starfield — tiny points, slow drift, depth on recede */
      if (bgFade > 0.02) {
        const nStars = mobile ? 40 : 90;
        bctx.save();
        for (let i = 0; i < nStars; i++) {
          const depth = 0.25 + hash01(i * 3.7) * 0.75;          // far → near
          const sx = ((hash01(i) + t * 0.006 * depth) % 1) * w;
          const sy = ((hash01(i + 99) + t * 0.003 * depth) % 1) * h;
          const r = 0.4 + depth * 1.1;
          const tw = 0.35 + 0.3 * Math.sin(t * (0.6 + depth) + i); // twinkle
          bctx.fillStyle = `rgba(${i % 7 === 0 ? CYAN : WHITE},${0.28 * tw * bgFade * depth})`;
          bctx.beginPath();
          bctx.arc(sx, sy, r, 0, Math.PI * 2);
          bctx.fill();
        }
        bctx.restore();
      }

      /* ---------- PORTAL — 3D-tilted liquid glass ring ---------- */
      if (portal > 0.01) {
        // Zoom far enough to swallow the viewport diagonal, but no more —
        // keeps the tunnel visible through the whole pass-through on mobile.
        const zoom = 1 + easeInCubic(enter) * (mobile ? 4.2 : 5.2);
        const ringR = minDim * (mobile ? 0.30 : 0.27) * zoom;
        const ringW = minDim * (mobile ? 0.075 : 0.085) * (1 + enter * 0.6);
        const ringA = (1 - smooth(3.6, 4.3, t)) * portal;

        // 3D tilt: as the camera approaches, the ring opens from a shallow
        // ellipse toward face-on — real perspective, not a flat circle.
        const tilt = (0.62 - enter * 0.5) * (1 - smooth(3.0, 3.6, t) * 0.4); // squash factor
        const yaw = 0.35 - smooth(2.7, 3.6, t) * 0.35;                        // radians
        const cosYaw = Math.cos(yaw);

        bctx.save();
        bctx.translate(cx, cy);
        bctx.transform(1, 0, cosYaw * tilt * 0.35, tilt, 0, 0);   // x-shear + y-squash = 3D tilt
        bctx.globalCompositeOperation = 'lighter';

        // outer soft aura (drawn in ring space, offset slightly for depth)
        const aura = bctx.createRadialGradient(0, ringR * 0.06, ringR * 0.55, 0, ringR * 0.06, ringR * 1.6);
        aura.addColorStop(0, `rgba(${CYAN},${0.16 * ringA})`);
        aura.addColorStop(0.6, `rgba(${BLUE},${0.10 * ringA})`);
        aura.addColorStop(1, 'rgba(0,0,0,0)');
        bctx.fillStyle = aura;
        bctx.beginPath();
        bctx.arc(0, ringR * 0.06, ringR * 1.6, 0, Math.PI * 2);
        bctx.fill();

        // depth fill — liquid glass disc behind the rim, brighter near center
        const depthFill = bctx.createRadialGradient(0, 0, ringR * 0.1, 0, 0, ringR);
        depthFill.addColorStop(0, `rgba(${BLUE},${0.05 * ringA})`);
        depthFill.addColorStop(0.75, `rgba(${CYAN},${0.03 * ringA})`);
        depthFill.addColorStop(1, `rgba(${BLUE},${0.08 * ringA})`);
        bctx.fillStyle = depthFill;
        bctx.beginPath();
        bctx.arc(0, 0, ringR, 0, Math.PI * 2);
        bctx.fill();

        // torus body — liquid glass
        const body = bctx.createRadialGradient(0, 0, ringR - ringW, 0, 0, ringR + ringW);
        body.addColorStop(0, `rgba(${CYAN},0)`);
        body.addColorStop(0.32, `rgba(${CYAN},${0.34 * ringA})`);
        body.addColorStop(0.55, `rgba(${WHITE},${0.16 * ringA})`);
        body.addColorStop(0.8, `rgba(${BLUE},${0.30 * ringA})`);
        body.addColorStop(1, `rgba(${BLUE},0)`);
        bctx.fillStyle = body;
        bctx.beginPath();
        bctx.arc(0, 0, ringR + ringW, 0, Math.PI * 2);
        bctx.arc(0, 0, Math.max(1, ringR - ringW), 0, Math.PI * 2, true);
        bctx.fill();

        // inner glass rim — crisp bright edge on the inside of the torus
        const rim = bctx.createRadialGradient(0, 0, Math.max(1, ringR - ringW * 0.9), 0, 0, Math.max(2, ringR - ringW * 0.45));
        rim.addColorStop(0, `rgba(${WHITE},0)`);
        rim.addColorStop(0.7, `rgba(${WHITE},${0.10 * ringA})`);
        rim.addColorStop(1, `rgba(${CYAN},0)`);
        bctx.fillStyle = rim;
        bctx.beginPath();
        bctx.arc(0, 0, Math.max(2, ringR - ringW * 0.45), 0, Math.PI * 2);
        bctx.fill();

        // rotating specular highlight arcs — glossy light playing on the rim
        const nArcs = mobile ? 2 : 3;
        for (let i = 0; i < nArcs; i++) {
          const a0 = t * (0.35 + i * 0.21) + (i * Math.PI * 2) / 3;
          const span = 0.9 + i * 0.25;                       // arc length (rad)
          bctx.strokeStyle = `rgba(${WHITE},${0.16 * ringA})`;
          bctx.lineWidth = ringW * (0.5 - i * 0.1);
          bctx.lineCap = 'round';
          bctx.beginPath();
          bctx.arc(0, 0, ringR + ringW * (0.1 - i * 0.22), a0, a0 + span);
          bctx.stroke();
          // violet companion arc
          bctx.strokeStyle = `rgba(${VIOLET},${0.12 * ringA})`;
          bctx.lineWidth = ringW * 0.3;
          bctx.beginPath();
          bctx.arc(0, 0, ringR - ringW * 0.35, a0 + Math.PI, a0 + Math.PI + span * 0.7);
          bctx.stroke();
        }

        // moving liquid surface — soft internal glows traveling the rim
        for (let i = 0; i < (mobile ? 3 : 5); i++) {
          const a0 = t * (0.5 + i * 0.23) + (i * Math.PI * 2) / 5;
          const hx = Math.cos(a0) * ringR;
          const hy = Math.sin(a0) * ringR;
          const hl = fctx.createRadialGradient(hx, hy, 0, hx, hy, ringW * 1.4);
          const col = i % 3 === 2 ? VIOLET : WHITE;
          hl.addColorStop(0, `rgba(${col},${0.20 * ringA})`);
          hl.addColorStop(1, 'rgba(0,0,0,0)');
          bctx.fillStyle = hl;
          bctx.beginPath();
          bctx.arc(hx, hy, ringW * 1.4, 0, Math.PI * 2);
          bctx.fill();
        }
        bctx.restore();

        /* ---------- camera streaks (motion blur through the tunnel) ---------- */
        if (enter > 0.05) {
          const streakA = bell(t, 2.75, 3.2, 3.55, 3.95);
          if (streakA > 0.01) {
            fctx.save();
            fctx.globalCompositeOperation = 'lighter';
            const nS = mobile ? 14 : 26;
            for (let i = 0; i < nS; i++) {
              const a = (i / nS) * Math.PI * 2 + t * 0.4;
              // radii relative to the viewport, not the (exploding) ring
              const r1 = minDim * (0.14 + (i % 4) * 0.08) * (0.5 + enter * 0.6);
              const r2 = r1 + minDim * (0.18 + (i % 5) * 0.06) * enter;
              fctx.strokeStyle = `rgba(${i % 4 === 3 ? VIOLET : CYAN},${0.26 * streakA})`;
              fctx.lineWidth = 1.5 + (i % 3);
              fctx.beginPath();
              fctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
              fctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
              fctx.stroke();
            }
            fctx.restore();
          }
        }
      }

      /* ---------- front canvas: receding veil + bloom ---------- */
      fctx.clearRect(0, 0, w, h);

      /* receding liquid veil — passes the camera, shrinks into the distance */
      if (recede > 0.001 && recede < 0.999) {
        const vr = minDim * (2.2 - easeOutQuart(recede) * 2.05);
        const vA = 0.85 * (1 - recede);
        const veil = fctx.createRadialGradient(cx, cy, vr * 0.2, cx, cy, vr);
        veil.addColorStop(0, `rgba(${CYAN},0)`);
        veil.addColorStop(0.7, `rgba(${BLUE},${0.14 * vA})`);
        veil.addColorStop(1, `rgba(${CYAN},${0.30 * vA})`);
        fctx.fillStyle = veil;
        fctx.fillRect(0, 0, w, h);
      }

      /* gentle bloom on the whole scene while the portal is alive */
      const bloom = bell(t, 1.7, 2.4, 3.3, 3.9);
      if (bloom > 0.01) {
        const bl = fctx.createRadialGradient(cx, cy, 0, cx, cy, minDim * 0.6);
        bl.addColorStop(0, `rgba(${CYAN},${0.10 * bloom})`);
        bl.addColorStop(1, 'rgba(0,0,0,0)');
        fctx.fillStyle = bl;
        fctx.fillRect(0, 0, w, h);
      }

      /* fine film grain — animated, very subtle, sells the cinematic look */
      if (bgFade > 0.02 && !mobile) {
        fctx.save();
        fctx.globalAlpha = 0.05 * bgFade;
        const gsize = 90;
        const gx0 = Math.floor((t * 137) % gsize), gy0 = Math.floor((t * 211) % gsize);
        for (let gy = -gy0; gy < h; gy += gsize) {
          for (let gx = -gx0; gx < w; gx += gsize) {
            const n = hash01(Math.floor(gx + t * 137) * 0.37 + Math.floor(gy + t * 211) * 1.13);
            fctx.fillStyle = n > 0.5 ? `rgba(${WHITE},${(n - 0.5) * 0.5})` : `rgba(0,0,0,${(0.5 - n) * 0.5})`;
            fctx.fillRect(gx, gy, 1, 1);
          }
        }
        fctx.restore();
      }

      if (freeze >= 0 || t < 5.1) {   // frozen frames never complete
        raf = requestAnimationFrame(frame);
      } else {
        finish();
      }
    };
    raf = requestAnimationFrame(frame);

    // Debug affordance (freeze mode only): synchronous repaint of the pinned
    // frame, so inspection tools don't depend on rAF being scheduled.
    if (freeze >= 0) {
      (window as unknown as { __portalPaint?: () => void }).__portalPaint = () => frame(performance.now());
    }

    return () => {
      clearTimeout(failsafe);
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      delete (window as unknown as { __portalPaint?: () => void }).__portalPaint;
    };
  }, [simple, TS, freeze]);

  /* ---------- logo envelope (Motion handles the entrance above) ---------- */

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden"
          style={{ background: 'transparent' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: 'easeInOut' } }}
          aria-hidden="true"
        >
          {/* back canvas (aurora, stars, portal) */}
          <canvas ref={backRef} className="absolute inset-0" />

          {/* logo block — staggered entrance, sinks into the portal via PortalSink */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <PortalSink simple={simple} timeScale={TS} freeze={freeze} />
            </motion.div>
          </div>

          {/* front canvas (streaks + veil + bloom + grain) */}
          <canvas ref={frontRef} className="absolute inset-0" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * PortalSink — the logo mark + wordmark with a staggered, premium entrance:
 * mark first, then hairline divider, then wordmark. As the portal forms the
 * whole block gently sinks into the ring (scale down + fade) and is gone
 * before the camera flies through. A slow "breathing" glow keeps it alive.
 */
const PortalSink: React.FC<{ simple: boolean; timeScale: number; freeze: number }> = ({ simple, timeScale: TS, freeze }) => {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (simple) return;
    if (freeze >= 0) { setT(freeze); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const dilated = ((now - t0) / 1000) * TS;
      setT(dilated);
      if (dilated < 4.2) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [simple, TS, freeze]);

  const sink = simple ? 0 : smooth(2.1, 2.9, t);       // into the portal
  const opacity = simple ? 1 : 1 - sink;
  const scale = simple ? 1 : 1 - 0.28 * sink;
  const breathe = 0.5 + 0.5 * Math.sin((simple ? 0 : t) * 1.6);   // 0..1 glow pulse

  return (
    <motion.div
      className="flex flex-col items-center will-change-transform"
      style={{ transform: `scale(${scale})`, opacity }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="relative"
      >
        {/* breathing halo behind the mark */}
        <div
          className="absolute -inset-10 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, rgba(56,189,248,${0.16 + breathe * 0.10}) 0%, rgba(59,130,246,${0.06 + breathe * 0.05}) 45%, rgba(0,0,0,0) 72%)`,
            filter: 'blur(6px)',
          }}
        />
        <picture>
          <source srcSet="/skyz-mark.webp" type="image/webp" />
          <img
            src="/skyz-mark.png"
            alt=""
            draggable={false}
            className="relative w-28 h-28 sm:w-36 sm:h-36 object-contain"
            style={{ filter: `drop-shadow(0 0 ${28 + breathe * 16}px rgba(56,189,248,${0.30 + breathe * 0.15}))` }}
          />
        </picture>
      </motion.div>

      {/* hairline divider — draws outward from center */}
      <motion.div
        className="my-4 h-px rounded-full"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 120, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.55 }}
        style={{
          background: 'linear-gradient(90deg, rgba(56,189,248,0), rgba(56,189,248,0.7) 50%, rgba(167,139,250,0.7) 60%, rgba(167,139,250,0))',
          boxShadow: '0 0 12px rgba(56,189,248,0.35)',
        }}
      />

      <div className="text-center select-none">
        <motion.div
          className="font-display font-extrabold tracking-tight text-[#F5F7FA]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
          style={{
            fontSize: 'clamp(1.6rem, 5vw, 2.6rem)',
            textShadow: `0 2px 24px rgba(56,189,248,${0.22 + breathe * 0.10}), 0 0 60px rgba(59,130,246,0.12)`,
          }}
        >
          SKY-Z
        </motion.div>
        <motion.div
          className="font-display font-medium text-[#9AA4B2]"
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          animate={{ opacity: 1, letterSpacing: '0.42em' }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.85 }}
          style={{ fontSize: 'clamp(0.65rem, 2.2vw, 0.95rem)', marginTop: 2 }}
        >
          SOLUTIONS
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LiquidPortalLoader;
