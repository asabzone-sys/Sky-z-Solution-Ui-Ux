import React, { useCallback, useEffect, useState } from 'react';
import { useAdmin } from './AdminContext';
import { AdminShell, AdminSection } from './AdminShell';
import { AdminLogin } from './AdminLogin';
import { leadsApi, projectsApi, studioApi, testimonialsApi } from '../lib/adminApi';
import { hasBackend } from '../lib/supabase';
import { LeadsInbox } from './sections/LeadsInbox';
import { ContentManager } from './sections/ContentManager';
import { TeamSection } from './sections/TeamSection';
import { SiteContentSection } from './sections/SiteContentSection';
import { SERVICE_CATEGORY_ICON, ServiceCategory } from '../data/portfolio';
import { STUDIO_CATEGORIES } from '../data/studio';

/* ------------------------------------------------------------------ */
/* Field configs for the three schema-driven managers                  */
/* ------------------------------------------------------------------ */

const PILLARS = ['BUILD', 'GROW', 'AUTOMATE'];

const SERVICE_CATEGORIES: ServiceCategory[] = Object.keys(SERVICE_CATEGORY_ICON) as ServiceCategory[];

const WORK_CONFIG = {
  title: 'Work Projects',
  description: 'Portfolio projects shown on the Work page and homepage carousel.',
  titleKey: 'title',
  subKey: 'client_sector',
  fields: [
    { key: 'title', label: 'Title', type: 'text' as const, half: true },
    { key: 'service_category', label: 'Service Category', type: 'select' as const, options: [...SERVICE_CATEGORIES], half: true },
    { key: 'pillar', label: 'Pillar', type: 'select' as const, options: PILLARS, half: true },
    { key: 'client_sector', label: 'Client / Sector', type: 'text' as const, half: true },
    { key: 'accent_color', label: 'Accent Color', type: 'color' as const, half: true },
    { key: 'visual_type', label: 'Visual Type', type: 'select' as const, options: ['visual', 'video', 'interactive'], half: true },
    { key: 'description', label: 'Description', type: 'textarea' as const },
    { key: 'image_path', label: 'Card Visual', type: 'media' as const, slot: 'work.card' },
    { key: 'image_wide_path', label: 'Wide Visual', type: 'media' as const, slot: 'work.wide' },
  ],
  // Field keys match the DB columns exactly; tags/deliverables stay server-managed
  // defaults so the public site always receives arrays (mapper fills the rest).
  newTemplate: () => ({
    id: `project-${Date.now()}`,
    order_index: 99,
    title: '',
    service_category: SERVICE_CATEGORIES[0],
    pillar: 'BUILD',
    description: '',
    accent_color: '#3B82F6',
    tags: [] as string[],
    client_sector: '',
    visual_type: 'visual',
    deliverables: [] as string[],
    image_path: null,
    image_wide_path: null,
    published: false,
  }),
};

const STUDIO_CONFIG = {
  title: 'Studio Works',
  description: 'Design & Graphics Studio pieces — editorial scenes and the pinned belt.',
  titleKey: 'title',
  subKey: 'category',
  fields: [
    { key: 'title', label: 'Title', type: 'text' as const, half: true },
    { key: 'category', label: 'Category', type: 'select' as const, options: [...STUDIO_CATEGORIES], half: true },
    { key: 'year', label: 'Year', type: 'text' as const, half: true },
    { key: 'client', label: 'Client', type: 'text' as const, half: true },
    { key: 'accent', label: 'Accent Color', type: 'color' as const, half: true },
    { key: 'description', label: 'Description', type: 'textarea' as const },
    { key: 'caption', label: 'Caption (one poetic line)', type: 'textarea' as const },
    { key: 'image_path', label: 'Scene Visual', type: 'media' as const, slot: 'studio.scene' },
    { key: 'poster_path', label: 'Video Poster', type: 'media' as const, slot: 'studio.poster' },
    { key: 'video_path', label: 'Video (YouTube ID or uploaded file path)', type: 'text' as const },
  ],
  newTemplate: () => ({
    id: `studio-${Date.now()}`,
    order_index: 99,
    title: '',
    caption: '',
    description: '',
    category: 'GRAPHIC DESIGN',
    year: String(new Date().getFullYear()),
    client: '',
    accent: '#8B5CF6',
    image_path: null,
    poster_path: null,
    video_path: null,
    published: false,
  }),
};

const TESTIMONIALS_CONFIG = {
  title: 'Testimonials',
  description: 'Client quotes for the homepage carousel.',
  titleKey: 'name',
  subKey: 'role',
  fields: [
    { key: 'name', label: 'Client Name', type: 'text' as const, half: true },
    { key: 'role', label: 'Role / Company', type: 'text' as const, half: true },
    { key: 'service', label: 'Service', type: 'text' as const, half: true },
    { key: 'initials', label: 'Initials (if no avatar)', type: 'text' as const, half: true },
    { key: 'accent', label: 'Accent Color', type: 'color' as const, half: true },
    { key: 'avatar_path', label: 'Avatar', type: 'media' as const, slot: 'testimonial.avatar' },
    { key: 'quote', label: 'Quote', type: 'textarea' as const },
  ],
  newTemplate: () => ({
    id: `quote-${Date.now()}`,
    order_index: 99,
    quote: '',
    name: '',
    role: '',
    initials: '',
    accent: '#3B82F6',
    service: '',
    avatar_path: null,
    published: false,
  }),
};

/* ------------------------------------------------------------------ */
/* Guards                                                              */
/* ------------------------------------------------------------------ */

const NeedsBackend: React.FC<{ feature: string }> = ({ feature }) => (
  <div className="max-w-md mx-auto mt-16 text-center rounded-2xl border border-skyz-border bg-skyz-surface p-8">
    <h2 className="font-display font-bold text-lg">{feature} needs the backend</h2>
    <p className="text-sm text-skyz-text-muted mt-2 leading-relaxed">
      Add your Supabase URL and anon key as <span className="font-mono">VITE_SUPABASE_URL</span> /{' '}
      <span className="font-mono">VITE_SUPABASE_ANON_KEY</span>, run{' '}
      <span className="font-mono">supabase/schema.sql</span> once, and this section comes alive.
    </p>
  </div>
);

/* ------------------------------------------------------------------ */
/* AdminApp — auth gate, section router, unread-lead count             */
/* ------------------------------------------------------------------ */

export const AdminApp: React.FC = () => {
  const { user, loading, configured } = useAdmin();
  const [section, setSection] = useState<AdminSection>('leads');
  const [unread, setUnread] = useState(0);

  const role = user?.role ?? 'editor';

  const refreshUnread = useCallback(() => {
    if (!user) { setUnread(0); return; }
    leadsApi.list()
      .then((rows) => setUnread(rows.filter((r) => r.status === 'new').length))
      .catch(() => setUnread(0));
  }, [user]);

  // Refresh the badge when the inbox section opens.
  useEffect(() => {
    if (section === 'leads') refreshUnread();
  }, [section, refreshUnread]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-skyz-bg">
        <div className="w-8 h-8 border-2 border-skyz-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  const isAdmin = role === 'admin';

  return (
    <AdminShell section={section} onSection={setSection} unreadCount={unread}>
      <div className="max-w-5xl mx-auto">
        {section === 'leads' && (
          configured ? <LeadsInbox onData={refreshUnread} /> : <NeedsBackend feature="Leads Inbox" />
        )}
        {section === 'work' && (
          <ContentManager
            config={WORK_CONFIG}
            list={() => projectsApi.list()}
            save={(row) => projectsApi.save(row)}
            remove={isAdmin ? ((id) => projectsApi.remove(id)) : undefined}
            isAdmin={isAdmin}
          />
        )}
        {section === 'studio' && (
          <ContentManager
            config={STUDIO_CONFIG}
            list={() => studioApi.list()}
            save={(row) => studioApi.save(row)}
            remove={isAdmin ? ((id) => studioApi.remove(id)) : undefined}
            isAdmin={isAdmin}
          />
        )}
        {section === 'testimonials' && (
          <ContentManager
            config={TESTIMONIALS_CONFIG}
            list={() => testimonialsApi.list()}
            save={(row) => testimonialsApi.save(row)}
            remove={isAdmin ? ((id) => testimonialsApi.remove(id)) : undefined}
            isAdmin={isAdmin}
          />
        )}
        {section === 'content' && (configured ? <SiteContentSection isAdmin={isAdmin} /> : <NeedsBackend feature="Page Text & Settings" />)}
        {section === 'team' && <TeamSection isAdmin={isAdmin} />}
      </div>
    </AdminShell>
  );
};
