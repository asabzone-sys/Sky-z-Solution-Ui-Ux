/**
 * AdminAPI — authenticated write layer for the dashboard.
 * Every call requires a signed-in user; RLS is the real security boundary.
 * Roles come from public.profiles ('admin' | 'editor').
 */
import { getClient } from './supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import { PortfolioProject } from '../data/portfolio';
import { StudioWork } from '../data/studio';
import { Testimonial } from '../data/testimonials';

export type Role = 'admin' | 'editor';

export interface AdminUser {
  id: string;
  email: string;
  role: Role;
  fullName: string;
}

export class NotConfiguredError extends Error {
  constructor() { super('Supabase is not configured (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).'); }
}

const need = async (): Promise<SupabaseClient> => {
  const sb = await getClient();
  if (!sb) throw new NotConfiguredError();
  return sb;
};

/* ------------------------------------------------------------------ */
/* Auth + profile                                                      */
/* ------------------------------------------------------------------ */
export const auth = {
  async signIn(email: string, password: string): Promise<AdminUser> {
    const sb = await need();
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const { data: profile } = await sb.from('profiles').select('*').eq('id', data.user.id).single();
    return {
      id: data.user.id,
      email: data.user.email || email,
      role: (profile?.role as Role) || 'editor',
      fullName: profile?.full_name || '',
    };
  },
  async signOut() { await (await need()).auth.signOut(); },
  async onUser(cb: (u: AdminUser | null) => void): Promise<() => void> {
    const sb = await getClient();
    if (!sb) { cb(null); return () => {}; }
    const { data: sub } = sb.auth.onAuthStateChange(async () => {
      const u = await auth.currentUser();
      cb(u);
    });
    const u = await auth.currentUser();
    cb(u);
    return () => sub.subscription.unsubscribe();
  },
  async currentUser(): Promise<AdminUser | null> {
    const sb = await getClient();
    if (!sb) return null;
    const { data } = await sb.auth.getUser();
    if (!data.user) return null;
    const { data: profile } = await sb.from('profiles').select('*').eq('id', data.user.id).single();
    return {
      id: data.user.id,
      email: data.user.email || '',
      role: (profile?.role as Role) || 'editor',
      fullName: profile?.full_name || '',
    };
  },
};

/* ------------------------------------------------------------------ */
/* Team (admin-only operations; RLS enforces server-side)              */
/* ------------------------------------------------------------------ */
export const team = {
  async list(): Promise<Array<{ id: string; email: string; role: Role; fullName: string }>> {
    const { data, error } = await (await need()).from('profiles').select('*').order('created_at');
    if (error) throw error;
    return (data || []).map((p) => ({ id: p.id, email: p.email, role: p.role, fullName: p.full_name || '' }));
  },
  async setRole(id: string, role: Role): Promise<void> {
    const { error } = await (await need()).from('profiles').update({ role }).eq('id', id);
    if (error) throw error;
  },
};

/* ------------------------------------------------------------------ */
/* Generic table CRUD                                                  */
/* ------------------------------------------------------------------ */
function crud<T extends { id: string }>(table: string, orderCol = 'order_index') {
  return {
    async list(): Promise<T[]> {
      const { data, error } = await (await need()).from(table).select('*').order(orderCol);
      if (error) throw error;
      return (data || []) as T[];
    },
    async save(row: Partial<T> & { id: string }): Promise<void> {
      const { error } = await (await need()).from(table).upsert({ ...row, updated_at: new Date().toISOString() });
      if (error) throw error;
    },
    async remove(id: string): Promise<void> {
      const { error } = await (await need()).from(table).delete().eq('id', id);
      if (error) throw error;
    },
  };
}

export const projectsApi = crud<PortfolioProject & { order_index: number; published: boolean; image_path?: string | null; image_wide_path?: string | null }>('projects');
export const studioApi = crud<StudioWork & { order_index: number; published: boolean; image_path?: string | null; poster_path?: string | null; video_path?: string | null }>('studio_works');
export const testimonialsApi = crud<Testimonial & { order_index: number; published: boolean; avatar_path?: string | null }>('testimonials');

/* ------------------------------------------------------------------ */
/* Leads inbox                                                         */
/* ------------------------------------------------------------------ */
export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  service: string | null;
  project_type: string | null;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
}

export const leadsApi = {
  async list(): Promise<Lead[]> {
    const { data, error } = await (await need()).from('leads').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as Lead[];
  },
  async setStatus(id: string, status: Lead['status']): Promise<void> {
    const { error } = await (await need()).from('leads').update({ status }).eq('id', id);
    if (error) throw error;
  },
  async remove(id: string): Promise<void> {
    const { error } = await (await need()).from('leads').delete().eq('id', id);
    if (error) throw error;
  },
};

/* ------------------------------------------------------------------ */
/* Meetings (Calendly bookings, written by the calendly-webhook fn)     */
/* ------------------------------------------------------------------ */
export interface Meeting {
  id: string;
  invitee_uri: string;
  event_uri: string;
  event_type: string;
  invitee_name: string;
  invitee_email: string;
  start_time: string | null;
  timezone: string | null;
  status: 'scheduled' | 'rescheduled' | 'canceled';
  question_answers: Array<{ question: string; answer: string }> | null;
  created_at: string;
}

export const meetingsApi = {
  async list(): Promise<Meeting[]> {
    const { data, error } = await (await need()).from('meetings').select('*').order('start_time', { ascending: false, nullsFirst: false });
    if (error) throw error;
    return (data || []) as Meeting[];
  },
  async setStatus(id: string, status: Meeting['status']): Promise<void> {
    const { error } = await (await need()).from('meetings').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
  },
  async remove(id: string): Promise<void> {
    const { error } = await (await need()).from('meetings').delete().eq('id', id);
    if (error) throw error;
  },
};

/* ------------------------------------------------------------------ */
/* Site content                                                        */
/* ------------------------------------------------------------------ */
export interface ContentEntry { key: string; value: unknown; group_name: string; label: string; }

export const contentApi = {
  async list(): Promise<ContentEntry[]> {
    const { data, error } = await (await need()).from('site_content').select('*').order('group_name');
    if (error) throw error;
    return (data || []) as ContentEntry[];
  },
  async save(key: string, value: unknown): Promise<void> {
    const { error } = await (await need()).from('site_content').upsert({ key, value, updated_at: new Date().toISOString() });
    if (error) throw error;
  },
};

/* ------------------------------------------------------------------ */
/* Media uploads with aspect-ratio guidance                            */
/* ------------------------------------------------------------------ */
export interface RatioSpec {
  ratio: number;            // width / height
  label: string;            // "4:3"
  recommend: string;        // "1600×1200"
}

export interface UploadResult { path: string; width: number; height: number; ratioOk: boolean; }

/**
 * Uploads to the `media` bucket. Reads the image dimensions in-browser and
 * reports whether it matches the slot's aspect spec (soft warning, never a
 * hard block). `folder` is the content area: work | studio | testimonials | site.
 */
export const uploadMedia = async (
  file: File,
  folder: 'work' | 'studio' | 'testimonials' | 'site',
  spec: RatioSpec,
): Promise<UploadResult> => {
  const sb = await need();

  // Read dimensions in-browser via an object URL. This must NEVER reject the
  // upload: dimension probing is guidance (ratio hints in the admin UI), not
  // validation. Wrap the Image promise in an inner try/catch so a decoding
  // failure falls through to the upload instead of aborting it — previously
  // storage errors surfaced here as the misleading "Not a readable image".
  let dims = { width: 0, height: 0 };
  try {
    dims = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      const cleanup = () => URL.revokeObjectURL(objectUrl);
      img.onload = () => { cleanup(); resolve({ width: img.naturalWidth, height: img.naturalHeight }); };
      img.onerror = () => { cleanup(); reject(new Error('Not a readable image'));; };
      img.src = objectUrl;
    });
  } catch {
    dims = { width: 0, height: 0 };   // dimensions unknown — still upload
  }

  const actualRatio = dims.width / dims.height;
  const ratioOk = Math.abs(actualRatio - spec.ratio) / spec.ratio < 0.05;   // 5% tolerance

  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
  const safeBase = file.name.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9-_]+/g, '-').slice(0, 40) || 'asset';
  const path = `${folder}/${Date.now()}-${safeBase}.${ext}`;

  const { error } = await sb.storage.from('media').upload(path, file, { upsert: false, cacheControl: '3600' });
  if (error) {
    // Surface the real storage error with remediation context — 403 RLS
    // violations were previously swallowed or mislabeled upstream.
    const msg = error.message || 'Upload failed';
    const hint = /row-level security|AccessDenied|403/i.test(msg)
      ? ' — Storage RLS rejected this upload. Run supabase/migrations/20260913000000_storage_policies_fix.sql, sign out and back in, then retry.'
      : '';
    throw new Error(`${msg}${hint}`);
  }

  return { path, width: dims.width, height: dims.height, ratioOk };
};

export const deleteMedia = async (path: string): Promise<void> => {
  const { error } = await (await need()).storage.from('media').remove([path]);
  if (error) throw error;
};

/** Canonical ratio specs per upload slot — shown in the admin UI. */
export const SLOTS: Record<string, RatioSpec & { hint: string }> = {
  'work.card':       { ratio: 4 / 3, label: '4:3',  recommend: '1600×1200', hint: 'Work card visual' },
  'work.wide':       { ratio: 16 / 9, label: '16:9', recommend: '1920×1080', hint: 'Work wide/grid feature' },
  'studio.scene':    { ratio: 16 / 10, label: '16:10', recommend: '1920×1200', hint: 'Studio editorial scene' },
  'studio.card':     { ratio: 4 / 5, label: '4:5',  recommend: '1200×1500', hint: 'Studio belt card' },
  'studio.poster':   { ratio: 16 / 9, label: '16:9', recommend: '1920×1080', hint: 'Video poster frame' },
  'testimonial.avatar': { ratio: 1, label: '1:1', recommend: '256×256', hint: 'Client avatar (square)' },
  'site.logo':       { ratio: 1, label: '1:1', recommend: '512×512 (SVG/PNG/WebP)', hint: 'Logo mark' },
};
