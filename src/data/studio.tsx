/**
 * Studio works — Design & Graphics Studio content.
 *
 * Built as a content schema first: a future Admin/Backend can produce this
 * array (API → same shape) without touching the page. Fields are intentionally
 * generous (images, video, posters, categories, ordering) so media can be
 * dropped in later; until then `StudioVisual` renders premium generated
 * placeholders from `accent` + `category`.
 */

import React from 'react';

export type StudioCategory =
  | 'BRAND IDENTITY'
  | 'GRAPHIC DESIGN'
  | 'CAMPAIGN CREATIVE'
  | 'MOTION / VIDEO';

export interface StudioWork {
  id: string;
  /** display order — a future backend can reorder without touching the page */
  order: number;
  title: string;
  /** one-line poetic caption used in the editorial scenes */
  caption: string;
  /** short description for the index list */
  description: string;
  category: StudioCategory;
  year: string;
  client: string;
  accent: string;
  /** future media slots — real assets drop in here without code changes */
  image?: string;
  poster?: string;
  video?: string;
  /** storage paths (managed by the admin dashboard; URLs are derived) */
  image_path?: string | null;
  poster_path?: string | null;
  video_path?: string | null;
  published?: boolean;
  order_index?: number;
}

export const STUDIO_WORKS: StudioWork[] = [
  {
    id: 'atlas',
    order: 1,
    title: 'Atlas Identity System',
    caption: 'A mark that moves like it means it.',
    description: 'Full identity system — logo architecture, type scale, and a living brand book.',
    category: 'BRAND IDENTITY',
    year: '2026',
    client: 'Atlas Ventures',
    accent: '#8B5CF6',
  },
  {
    id: 'kiln',
    order: 2,
    title: 'Kiln Editorial Series',
    caption: 'Print logic, screen physics.',
    description: 'Editorial layouts and poster series translated from print to digital canvases.',
    category: 'GRAPHIC DESIGN',
    year: '2025',
    client: 'Kiln Ceramics',
    accent: '#EC4899',
  },
  {
    id: 'northbeam',
    order: 3,
    title: 'Northbeam Campaign',
    caption: 'One idea, carried across every channel.',
    description: 'Launch campaign creative — key visual, ad system, and social kits.',
    category: 'CAMPAIGN CREATIVE',
    year: '2025',
    client: 'Northbeam Outdoor',
    accent: '#0EA5E9',
  },
  {
    id: 'pulse',
    order: 4,
    title: 'Pulse Motion Reel',
    caption: 'Frames that breathe between moments.',
    description: 'Motion identity and launch film — kinetic type, liquid transitions, sound design.',
    category: 'MOTION / VIDEO',
    year: '2026',
    client: 'Pulse Audio',
    accent: '#F59E0B',
    video: 'dYISWlAxUVs',
  },
  {
    id: 'meridian-rebrand',
    order: 5,
    title: 'Meridian Rebrand',
    caption: 'Old authority, new gravity.',
    description: 'Rebrand of a 20-year consultancy — heritage kept, weight redistributed.',
    category: 'BRAND IDENTITY',
    year: '2024',
    client: 'Meridian Advisory',
    accent: '#3B82F6',
  },
  {
    id: 'lumen',
    order: 6,
    title: 'Lumen Packaging World',
    caption: 'A shelf is a stage.',
    description: 'Packaging system and shelf-presence design across a 12-SKU range.',
    category: 'GRAPHIC DESIGN',
    year: '2024',
    client: 'Lumen Skincare',
    accent: '#10B981',
  },
];

export const STUDIO_CATEGORIES: StudioCategory[] = [
  'BRAND IDENTITY',
  'GRAPHIC DESIGN',
  'CAMPAIGN CREATIVE',
  'MOTION / VIDEO',
];

/**
 * StudioVisual — premium generated placeholder until real media arrives.
 * Renders `image`/`poster` when provided (future backend), otherwise a
 * layered composition (diagonal wash + dot matrix + oversized glyph) built
 * from the work's accent — consistent with the SkyZ placeholder language
 * used on the Work page.
 */
export const StudioVisual: React.FC<{
  work: StudioWork;
  className?: string;
  glyph?: string;
}> = ({ work, className = '', glyph }) => {
  if (work.image || work.poster) {
    return (
      <img
        src={work.image || work.poster}
        alt={work.title}
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }
  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(155deg, ${work.accent}26 0%, transparent 55%), radial-gradient(circle at 72% 24%, ${work.accent}38, transparent 62%)`,
      }}
      aria-hidden
    >
      <div className="absolute inset-0 bg-dots-pattern opacity-40" />
      <div
        className="absolute -bottom-6 -right-4 font-display font-extrabold leading-none select-none"
        style={{ fontSize: 'clamp(6rem, 16vw, 13rem)', color: `${work.accent}22` }}
      >
        {glyph || work.title.charAt(0)}
      </div>
      <div
        className="absolute top-5 left-5 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
        style={{ backgroundColor: work.accent }}
      >
        <span className="font-display font-bold text-sm">{work.client.charAt(0)}</span>
      </div>
    </div>
  );
};
