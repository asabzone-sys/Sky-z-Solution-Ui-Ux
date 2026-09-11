import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * LiquidPortalLoader — cinematic one-time entry experience.
 *
 * Timeline (single clock, all phases continuous — no cuts):
 *   0.0–1.2s  logo fades in
 *   1.6–2.7s  the liquid portal ring forms around the logo
 *   2.7–3.6s  camera pushes through the portal (scale + parallax + streaks)
 *   3.4–4.3s  liquid recedes backward while the homepage fades in behind
 *   ~4.6s     overlay fully transparent → unmounted, scroll unlocked
 *
 * Tech: Canvas 2D (no WebGL dependency, universal support), transform/opacity
 * only in DOM. Mobile gets a capped DPR and lighter blur.
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
    const CYAN = '56,189,248';    // brand accent (dark)
    const BLUE = '59,130,246';
    const VIOLET = '167,139,250'; // brand secondary
    const WHITE = '255,255,255';

    let raf = 0;
    const t0 = performance.now();

    const frame = (now: number) => {
      const t = freeze >= 0 ? freeze : ((now - t0) / 1000) * TS;   // seconds
      const { w, h, mobile } = sizeRef.current;
      const cx = w / 2, cy = h / 2;
      const minDim = Math.min(w, h);

      const portal = smooth(1.6, 2.7, t);          // ring forms
      const enter = smooth(2.7, 3.6, t);           // camera passes through
      const recede = smooth(3.4, 4.3, t);          // liquid recedes
      const bgFade = 1 - smooth(3.7, 4.8, t);      // overlay lets go

      /* ---------- back canvas: bg + portal ---------- */
      bctx.clearRect(0, 0, w, h);
      const bg = bctx.createRadialGradient(cx, cy * 0.92, minDim * 0.1, cx, cy, Math.max(w, h) * 0.75);
      bg.addColorStop(0, `rgba(10,30,60,${0.98 * bgFade})`);
      bg.addColorStop(0.55, `rgba(6,18,36,${0.99 * bgFade})`);
      bg.addColorStop(1, `rgba(3,8,18,${bgFade})`);
      bctx.fillStyle = bg;
      bctx.fillRect(0, 0, w, h);

      /* ---------- PORTAL (liquid glass ring with depth) ---------- */
      if (portal > 0.01) {
        // Zoom far enough to swallow the viewport diagonal, but no more —
        // keeps the tunnel visible through the whole pass-through on mobile.
        const zoom = 1 + easeInCubic(enter) * (mobile ? 4.2 : 5.2);
        const ringR = minDim * (mobile ? 0.30 : 0.27) * zoom;
        const ringW = minDim * (mobile ? 0.075 : 0.085) * (1 + enter * 0.6);
        const ringA = (1 - smooth(3.6, 4.3, t)) * portal;

        bctx.save();
        bctx.globalCompositeOperation = 'lighter';

        // outer soft aura
        const aura = bctx.createRadialGradient(cx, cy, ringR * 0.55, cx, cy, ringR * 1.6);
        aura.addColorStop(0, `rgba(${CYAN},${0.16 * ringA})`);
        aura.addColorStop(0.6, `rgba(${BLUE},${0.10 * ringA})`);
        aura.addColorStop(1, 'rgba(0,0,0,0)');
        bctx.fillStyle = aura;
        bctx.beginPath();
        bctx.arc(cx, cy, ringR * 1.6, 0, Math.PI * 2);
        bctx.fill();

        // torus body — liquid glass
        const body = bctx.createRadialGradient(cx, cy, ringR - ringW, cx, cy, ringR + ringW);
        body.addColorStop(0, `rgba(${CYAN},0)`);
        body.addColorStop(0.32, `rgba(${CYAN},${0.34 * ringA})`);
        body.addColorStop(0.55, `rgba(${WHITE},${0.16 * ringA})`);
        body.addColorStop(0.8, `rgba(${BLUE},${0.30 * ringA})`);
        body.addColorStop(1, `rgba(${BLUE},0)`);
        bctx.fillStyle = body;
        bctx.beginPath();
        bctx.arc(cx, cy, ringR + ringW, 0, Math.PI * 2);
        bctx.arc(cx, cy, Math.max(1, ringR - ringW), 0, Math.PI * 2, true);
        bctx.fill();

        // moving liquid surface — rotating internal highlights
        for (let i = 0; i < (mobile ? 3 : 5); i++) {
          const a0 = t * (0.5 + i * 0.23) + (i * Math.PI * 2) / 5;
          const hx = cx + Math.cos(a0) * ringR;
          const hy = cy + Math.sin(a0) * ringR;
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

      if (freeze >= 0 || t < 5.1) {   // frozen frames never complete
        raf = requestAnimationFrame(frame);
      } else {
        setGone(true);
        setTimeout(() => doneRef.current(), 420);
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
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
          {/* back canvas (bubbles behind logo + portal) */}
          <canvas ref={backRef} className="absolute inset-0" />

          {/* logo block — fades in via Motion, sinks into the portal via PortalSink */}
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

          {/* front canvas (bubbles in front + streaks + veil) */}
          <canvas ref={frontRef} className="absolute inset-0" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * PortalSink — the logo mark + wordmark. As the portal forms it gently
 * sinks into the ring (scale down + fade) and is gone before the
 * camera flies through.
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

  return (
    <motion.div
      className="flex flex-col items-center will-change-transform"
      style={{ transform: `scale(${scale})`, opacity }}
    >
      <picture>
        <source srcSet="/skyz-mark.webp" type="image/webp" />
        <img
          src="/skyz-mark.png"
          alt=""
          draggable={false}
          className="w-28 h-28 sm:w-36 sm:h-36 object-contain drop-shadow-[0_0_32px_rgba(56,189,248,0.35)]"
        />
      </picture>
      <div className="mt-5 text-center select-none">
        <div
          className="font-display font-extrabold tracking-tight text-[#F5F7FA]"
          style={{ fontSize: 'clamp(1.6rem, 5vw, 2.6rem)', textShadow: '0 2px 24px rgba(56,189,248,0.25)' }}
        >
          SKY-Z
        </div>
        <div
          className="font-display font-medium text-[#9AA4B2]"
          style={{ fontSize: 'clamp(0.65rem, 2.2vw, 0.95rem)', letterSpacing: '0.42em', marginTop: 2 }}
        >
          SOLUTIONS
        </div>
      </div>
    </motion.div>
  );
};

export default LiquidPortalLoader;
