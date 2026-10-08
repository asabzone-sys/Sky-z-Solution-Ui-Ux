/**
 * Flat, minimal vector illustrations for the SkyZ lavender identity.
 *
 * Rules baked into every drawing:
 *  - Flat 2D vectors only — no 3D, no gradients-on-shapes, no photos.
 *  - All fills flow through theme CSS variables, so every illustration is
 *    correct in light AND dark themes with zero extra classes.
 *  - `accent`  = the one saturated lavender (var(--accent)).
 *  - `soft`    = the pale lavender field (var(--accent-muted)).
 *  - `line`    = hairline stroke (var(--border)).
 *  - `ink`     = near-silhouette detail (var(--muted)).
 */

import React from 'react';

/* Motion — tiny, quiet loops that make the art feel alive without noise.
   All respect prefers-reduced-motion via the shared .skz-ill class. */
const IllStyle: React.FC = () => (
  <style>{`
    .skz-ill [data-anim="float"]  { animation: ill-float 6s ease-in-out infinite; }
    .skz-ill [data-anim="float2"] { animation: ill-float 7.5s ease-in-out 1.2s infinite; }
    .skz-ill [data-anim="pulse"]  { animation: ill-pulse 3.2s ease-in-out infinite; }
    .skz-ill [data-anim="dash"]   { stroke-dasharray: 3 7; animation: ill-dash 14s linear infinite; }
    .skz-ill [data-anim="draw"]   { stroke-dasharray: 120; stroke-dashoffset: 120; animation: ill-draw 2.6s ease-out .4s forwards; }
    .skz-ill [data-anim="spin"]   { animation: ill-spin 26s linear infinite; transform-origin: center; }
    @keyframes ill-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
    @keyframes ill-pulse { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
    @keyframes ill-dash  { to { stroke-dashoffset: -100; } }
    @keyframes ill-draw  { to { stroke-dashoffset: 0; } }
    @keyframes ill-spin  { to { transform: rotate(360deg); } }
    @media (prefers-reduced-motion: reduce) {
      .skz-ill [data-anim] { animation: none !important; }
      .skz-ill [data-anim="draw"] { stroke-dashoffset: 0; }
    }
  `}</style>
);

type SvgProps = { className?: string };

/* Base wrapper — shared sizing + focusable=false for a11y */
const Svg: React.FC<SvgProps & { children: React.ReactNode; viewBox: string; label: string }> = ({
  className = '',
  children,
  viewBox,
  label,
}) => (
  <svg
    viewBox={viewBox}
    className={`skz-ill ${className}`}
    role="img"
    aria-label={label}
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
  >
    <IllStyle />
    {children}
  </svg>
);

/* ------------------------------------------------------------------ */
/* HeroArt — minimal desk setup: browser window + chart + plant.        */
/* Reads as "we build digital tools" in one glance.                     */
/* ------------------------------------------------------------------ */
export const HeroArt: React.FC<SvgProps> = ({ className = '' }) => (
  <Svg viewBox="0 0 560 200" className={className} label="Minimal illustration of a website and analytics being built">
    {/* soft field blobs */}
    <ellipse cx="90" cy="170" rx="70" ry="12" fill="var(--accent-muted)" />
    <ellipse cx="470" cy="170" rx="60" ry="10" fill="var(--accent-muted)" />

    {/* browser window */}
    <rect x="150" y="30" width="260" height="150" rx="14" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5" />
    <rect x="150" y="30" width="260" height="30" rx="14" fill="var(--accent-muted)" />
    <rect x="150" y="46" width="260" height="14" fill="var(--accent-muted)" />
    <circle cx="170" cy="45" r="4" fill="var(--accent)" />
    <circle cx="184" cy="45" r="4" fill="var(--accent-secondary)" opacity="0.55" />
    <circle cx="198" cy="45" r="4" fill="var(--border)" />

    {/* hero blocks inside window */}
    <rect x="170" y="74" width="120" height="12" rx="6" fill="var(--muted)" opacity="0.5" />
    <rect x="170" y="94" width="88" height="8" rx="4" fill="var(--border)" />
    <rect x="170" y="112" width="104" height="8" rx="4" fill="var(--border)" />

    {/* mini chart card */}
    <rect x="300" y="74" width="90" height="70" rx="10" fill="var(--accent-muted)" />
    <polyline
      points="312,132 330,112 346,120 364,96 380,104"
      fill="none"
      stroke="var(--accent)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      data-anim="draw"
    />
    <circle cx="364" cy="96" r="4" fill="var(--accent)" />

    {/* CTA block */}
    <rect x="170" y="136" width="64" height="22" rx="11" fill="var(--accent)" />
    <rect x="180" y="145" width="44" height="4" rx="2" fill="var(--surface)" opacity="0.85" />

    {/* plant */}
    <path d="M452 140c0-18 10-30 26-34-2 16-10 28-26 34z" fill="var(--accent-secondary)" opacity="0.7" data-anim="float2" />
    <path d="M452 140c0-14-8-24-22-28 2 14 8 24 22 28z" fill="var(--accent)" opacity="0.45" />
    <path d="M444 140h16l-3 22h-10z" fill="var(--muted)" opacity="0.55" />
    <rect x="438" y="160" width="28" height="10" rx="4" fill="var(--muted)" opacity="0.35" />

    {/* orbit accents — quiet life */}
    <circle cx="120" cy="60" r="5" fill="none" stroke="var(--accent)" strokeWidth="2" data-anim="pulse" />
    <circle cx="508" cy="44" r="3.5" fill="var(--accent)" opacity="0.6" data-anim="float" />
    <path d="M420 22l4 8 8 4-8 4-4 8-4-8-8-4 8-4z" fill="var(--accent-secondary)" opacity="0.6" data-anim="float2" />
  </Svg>
);

/* ------------------------------------------------------------------ */
/* BuildArt — for the BUILD pillar: code editor + blocks.               */
/* ------------------------------------------------------------------ */
export const BuildArt: React.FC<SvgProps> = ({ className = '' }) => (
  <Svg viewBox="0 0 220 160" className={className} label="Minimal illustration of code and building blocks">
    <rect x="20" y="24" width="130" height="96" rx="12" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5" />
    <rect x="20" y="24" width="130" height="22" rx="12" fill="var(--accent-muted)" />
    <rect x="20" y="34" width="130" height="12" fill="var(--accent-muted)" />
    <circle cx="34" cy="35" r="3.5" fill="var(--accent)" />

    {/* code lines */}
    <rect x="34" y="58" width="42" height="7" rx="3.5" fill="var(--accent)" opacity="0.75" />
    <rect x="82" y="58" width="30" height="7" rx="3.5" fill="var(--border)" />
    <rect x="46" y="72" width="56" height="7" rx="3.5" fill="var(--border)" />
    <rect x="34" y="86" width="34" height="7" rx="3.5" fill="var(--accent-secondary)" opacity="0.6" />
    <rect x="74" y="86" width="42" height="7" rx="3.5" fill="var(--border)" />

    {/* stacked blocks */}
    <rect x="160" y="88" width="40" height="16" rx="8" fill="var(--accent)" />
    <rect x="168" y="68" width="40" height="16" rx="8" fill="var(--accent-secondary)" opacity="0.55" />
    <rect x="176" y="48" width="40" height="16" rx="8" fill="var(--accent-muted)" />
    <circle cx="180" cy="30" r="4" fill="var(--accent)" opacity="0.6" />
  </Svg>
);

/* ------------------------------------------------------------------ */
/* GrowArt — for GROW: ascending bars + orbit arrow.                    */
/* ------------------------------------------------------------------ */
export const GrowArt: React.FC<SvgProps> = ({ className = '' }) => (
  <Svg viewBox="0 0 220 160" className={className} label="Minimal illustration of growth rising upward">
    <ellipse cx="110" cy="146" rx="86" ry="8" fill="var(--accent-muted)" />

    {/* bars */}
    <rect x="48" y="96" width="22" height="44" rx="8" fill="var(--accent-muted)" />
    <rect x="82" y="76" width="22" height="64" rx="8" fill="var(--accent-secondary)" opacity="0.5" />
    <rect x="116" y="54" width="22" height="86" rx="8" fill="var(--accent)" />

    {/* trend line + arrow */}
    <polyline
      points="42,104 84,80 120,58 168,34"
      fill="none"
      stroke="var(--muted)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeDasharray="1 8"
      data-anim="dash"
    />
    <path d="M168 34l-12 2m12-2l-2 12" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />

    {/* sparkles */}
    <path d="M186 88l3.5 7 7 3.5-7 3.5-3.5 7-3.5-7-7-3.5 7-3.5z" fill="var(--accent-secondary)" opacity="0.6" data-anim="float2" />
    <circle cx="36" cy="48" r="4.5" fill="none" stroke="var(--accent)" strokeWidth="2" data-anim="pulse" />
  </Svg>
);

/* ------------------------------------------------------------------ */
/* AutomateArt — for AUTOMATE: orbiting nodes around a core.            */
/* ------------------------------------------------------------------ */
export const AutomateArt: React.FC<SvgProps> = ({ className = '' }) => (
  <Svg viewBox="0 0 220 160" className={className} label="Minimal illustration of automation nodes orbiting a core">
    <circle cx="110" cy="80" r="52" fill="none" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="3 7" data-anim="spin" />

    {/* core */}
    <circle cx="110" cy="80" r="20" fill="var(--accent)" />
    <circle cx="103" cy="80" r="4" fill="var(--surface)" opacity="0.9" />
    <circle cx="117" cy="80" r="4" fill="var(--surface)" opacity="0.9" />
    <rect x="105" y="88" width="10" height="3" rx="1.5" fill="var(--surface)" opacity="0.7" />

    {/* orbit nodes */}
    <circle cx="110" cy="28" r="9" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2" />
    <rect x="105" y="23" width="10" height="10" rx="3" fill="var(--accent)" opacity="0.5" />
    <circle cx="162" cy="80" r="9" fill="var(--surface)" stroke="var(--accent-secondary)" strokeWidth="2" />
    <circle cx="162" cy="80" r="3.5" fill="var(--accent-secondary)" />
    <circle cx="58" cy="80" r="9" fill="var(--surface)" stroke="var(--border)" strokeWidth="2" />
    <path d="M55 80h6m-3-3v6" stroke="var(--muted)" strokeWidth="1.8" strokeLinecap="round" />

    {/* connection ticks */}
    <path d="M110 40v12" stroke="var(--accent)" strokeWidth="2" strokeDasharray="2 4" strokeLinecap="round" />
    <path d="M150 80h-12" stroke="var(--accent-secondary)" strokeWidth="2" strokeDasharray="2 4" strokeLinecap="round" />
  </Svg>
);

/* ------------------------------------------------------------------ */
/* SupportArt — for contact/CTA: chat bubble + envelope + calendar.     */
/* ------------------------------------------------------------------ */
export const SupportArt: React.FC<SvgProps> = ({ className = '' }) => (
  <Svg viewBox="0 0 220 160" className={className} label="Minimal illustration of chat and meeting scheduling">
    <ellipse cx="110" cy="146" rx="84" ry="8" fill="var(--accent-muted)" />

    {/* chat bubble */}
    <rect x="34" y="34" width="88" height="62" rx="16" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5" />
    <path d="M58 96l-4 16 18-16z" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5" strokeLinejoin="round" />
    <rect x="50" y="52" width="56" height="7" rx="3.5" fill="var(--border)" />
    <rect x="50" y="66" width="40" height="7" rx="3.5" fill="var(--accent)" opacity="0.7" />
    <rect x="50" y="80" width="48" height="7" rx="3.5" fill="var(--accent-muted)" />

    {/* calendar card */}
    <rect x="132" y="52" width="66" height="72" rx="14" fill="var(--accent-muted)" />
    <rect x="132" y="52" width="66" height="20" rx="14" fill="var(--accent)" />
    <rect x="132" y="62" width="66" height="10" fill="var(--accent)" />
    <rect x="144" y="84" width="10" height="10" rx="3" fill="var(--surface)" opacity="0.9" />
    <rect x="160" y="84" width="10" height="10" rx="3" fill="var(--surface)" opacity="0.55" />
    <rect x="176" y="84" width="10" height="10" rx="3" fill="var(--surface)" opacity="0.35" />
    <rect x="144" y="100" width="10" height="10" rx="3" fill="var(--surface)" opacity="0.55" />
    <rect x="160" y="100" width="10" height="10" rx="3" fill="var(--accent)" />

    {/* sparkle */}
    <path d="M124 24l3.5 7 7 3.5-7 3.5-3.5 7-3.5-7-7-3.5 7-3.5z" fill="var(--accent-secondary)" opacity="0.55" data-anim="float2" />
  </Svg>
);

/* ------------------------------------------------------------------ */
/* PricingArt — for the pricing hero: tag + coins, one-line style.      */
/* ------------------------------------------------------------------ */
export const PricingArt: React.FC<SvgProps> = ({ className = '' }) => (
  <Svg viewBox="0 0 260 170" className={className} label="Minimal illustration of simple pricing">
    {/* price tag */}
    <g transform="rotate(-12 110 80)">
      <rect x="62" y="52" width="96" height="58" rx="14" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5" />
      <circle cx="80" cy="70" r="6" fill="var(--accent-muted)" stroke="var(--accent)" strokeWidth="2" />
      <rect x="96" y="64" width="46" height="9" rx="4.5" fill="var(--accent)" opacity="0.75" />
      <rect x="96" y="80" width="34" height="7" rx="3.5" fill="var(--border)" />
    </g>

    {/* coins */}
    <ellipse cx="196" cy="118" rx="26" ry="8" fill="var(--accent-muted)" />
    <ellipse cx="196" cy="110" rx="26" ry="8" fill="var(--accent)" opacity="0.85" />
    <ellipse cx="196" cy="100" rx="26" ry="8" fill="var(--accent-secondary)" opacity="0.7" />
    <text x="191" y="105" fontSize="11" fontWeight="700" fill="var(--surface)">$</text>

    {/* check chips */}
    <rect x="36" y="122" width="52" height="18" rx="9" fill="var(--accent-muted)" />
    <circle cx="48" cy="131" r="6" fill="var(--accent)" />
    <path d="M45.5 131l2 2 3.5-4" stroke="var(--surface)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="30" y="96" width="44" height="18" rx="9" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5" />
    <circle cx="42" cy="105" r="6" fill="var(--accent-secondary)" opacity="0.7" />

    {/* sparkle */}
    <path d="M232 44l4 8 8 4-8 4-4 8-4-8-8-4 8-4z" fill="var(--accent-secondary)" opacity="0.55" data-anim="float2" />
    <circle cx="40" cy="40" r="4" fill="none" stroke="var(--accent)" strokeWidth="2" data-anim="pulse" />
  </Svg>
);
