/**
 * Supabase client + content data layer.
 *
 * The public site reads through `useContent*` hooks which try Supabase first
 * and FALL BACK to the bundled local data, so the site renders identically
 * even when env vars are missing, the project is paused, or the network fails.
 * The admin app writes through `AdminAPI`, which requires real credentials.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { PORTFOLIO_PROJECTS, PortfolioProject } from '../data/portfolio';
import { STUDIO_WORKS, StudioWork } from '../data/studio';
import { TESTIMONIALS, Testimonial } from '../data/testimonials';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Shared client. Null when env vars are absent — everything degrades gracefully. */
export const supabase: SupabaseClient | null = url && anon ? createClient(url, anon) : null;
export const hasBackend = !!supabase;

/** Public URL for a storage path (works even without the client for SSR-ish contexts). */
export const mediaUrl = (path?: string | null): string | null => {
  if (!path) return null;
  if (!url) return null;
  return `${url}/storage/v1/object/public/media/${path.replace(/^\/+/, '')}`;
};

/* ------------------------------------------------------------------ */
/* Generic read-with-fallback hook                                     */
/* ------------------------------------------------------------------ */
type Fetcher<T> = () => Promise<{ data: T | null; error: unknown }>;

function useBackendContent<T>(fetcher: Fetcher<T> | null, fallback: T, deps: unknown[] = []): T {
  const [value, setValue] = useState<T>(fallback);
  useEffect(() => {
    let alive = true;
    if (!supabase || !fetcher) return;
    fetcher().then(({ data }) => {
      if (alive && data && (Array.isArray(data) ? data.length > 0 : true)) setValue(data);
    });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return value;
}

/* ------------------------------------------------------------------ */
/* DB row → site type mappers                                          */
/* ------------------------------------------------------------------ */
type ProjectRow = {
  id: string;
  order_index: number;
  title: string;
  service_category: string;
  pillar: string;
  description: string;
  accent_color: string;
  tags: string[];
  client_sector: string;
  visual_type: string;
  deliverables: string[];
  image_path?: string | null;
  image_wide_path?: string | null;
};

const mapProject = (r: ProjectRow): PortfolioProject => ({
  id: r.id,
  title: r.title ?? '',
  serviceCategory: (r.service_category ?? 'WEB DEVELOPMENT') as PortfolioProject['serviceCategory'],
  pillar: (r.pillar ?? 'BUILD') as PortfolioProject['pillar'],
  description: r.description ?? '',
  accentColor: r.accent_color ?? '#3B82F6',
  tags: r.tags ?? [],
  clientSector: r.client_sector ?? '',
  visualType: (r.visual_type ?? 'visual') as PortfolioProject['visualType'],
  deliverables: r.deliverables ?? [],
  mockupDetails: {},
  image: mediaUrl(r.image_path || r.image_wide_path) || undefined,
});

type StudioRow = {
  id: string;
  order_index: number;
  title: string;
  caption: string;
  description: string;
  category: string;
  year: string;
  client: string;
  accent: string;
  image_path?: string | null;
  poster_path?: string | null;
  video_path?: string | null;
};

const mapStudio = (r: StudioRow): StudioWork => ({
  id: r.id,
  order: r.order_index ?? 0,
  title: r.title ?? '',
  caption: r.caption ?? '',
  description: r.description ?? '',
  category: (r.category ?? 'GRAPHIC DESIGN') as StudioWork['category'],
  year: r.year ?? '',
  client: r.client ?? '',
  accent: r.accent ?? '#8B5CF6',
  image: mediaUrl(r.image_path) || undefined,
  poster: mediaUrl(r.poster_path) || undefined,
  video: r.video_path?.includes('/') ? mediaUrl(r.video_path) || undefined : r.video_path || undefined,
});

type TestimonialRow = {
  id: string;
  order_index: number;
  quote: string;
  name: string;
  role: string;
  initials: string;
  accent: string;
  service: string;
  avatar_path?: string | null;
};

const mapTestimonial = (r: TestimonialRow): Testimonial => ({
  id: r.id,
  quote: r.quote ?? '',
  name: r.name ?? '',
  role: r.role ?? '',
  initials: r.initials ?? '',
  accent: r.accent ?? '#3B82F6',
  service: r.service ?? '',
});

/* ------------------------------------------------------------------ */
/* Public content hooks (used by the site)                             */
/* ------------------------------------------------------------------ */
export const useProjects = (): PortfolioProject[] =>
  useBackendContent(
    supabase ? async () => {
      const { data, error } = await supabase.from('projects')
        .select('*').eq('published', true).order('order_index', { ascending: true });
      return { data: (data || []).map(mapProject), error };
    } : null,
    PORTFOLIO_PROJECTS,
  );

export const useStudioWorks = (): StudioWork[] =>
  useBackendContent(
    supabase ? async () => {
      const { data, error } = await supabase.from('studio_works')
        .select('*').eq('published', true).order('order_index', { ascending: true });
      return { data: (data || []).map(mapStudio), error };
    } : null,
    STUDIO_WORKS,
  );

export const useTestimonials = (): Testimonial[] =>
  useBackendContent(
    supabase ? async () => {
      const { data, error } = await supabase.from('testimonials')
        .select('*').eq('published', true).order('order_index', { ascending: true });
      return { data: (data || []).map(mapTestimonial), error };
    } : null,
    TESTIMONIALS,
  );

/**
 * Site text value with fallback.
 * Usage: const heading = useText('home.creed.heading', 'Focused on outcomes.');
 */
export const useText = (key: string, fallback: string): string => {
  const [value, setValue] = useState(fallback);
  useEffect(() => {
    let alive = true;
    if (!supabase) return;
    supabase.from('site_content').select('value').eq('key', key).single()
      .then(({ data }) => {
        if (alive && data?.value != null) {
          const v = typeof data.value === 'string' ? data.value : String(data.value);
          if (v) setValue(v);
        }
      });
    return () => { alive = false; };
  }, [key]);
  return value;
};

/* ------------------------------------------------------------------ */
/* Lead submission — used by the contact forms                         */
/* ------------------------------------------------------------------ */
export interface LeadInput {
  name: string;
  email: string;
  company?: string;
  service?: string;
  project_type?: string;
  message: string;
}

export const submitLead = async (lead: LeadInput): Promise<{ ok: boolean; stored: boolean }> => {
  if (!supabase) return { ok: true, stored: false };   // graceful no-backend mode
  const { error } = await supabase.from('leads').insert(lead);
  return { ok: !error, stored: !error };
};
