-- ============================================================================
-- SkyZ Solutions — Supabase schema + RLS + storage + seed
-- Run ONCE in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- The FIRST user to sign up (or be invited) automatically becomes 'admin'.
-- ============================================================================

-- ---------------------------------------------------------------- profiles --
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text default '',
  role text not null default 'editor' check (role in ('admin','editor')),
  created_at timestamptz not null default now()
);

-- First user becomes admin, everyone else editor
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    case when not exists (select 1 from public.profiles) then 'admin' else 'editor' end
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper: current user's role (used by every policy below)
create or replace function public.my_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

-- --------------------------------------------------------------- projects --
create table if not exists public.projects (
  id text primary key,
  order_index integer not null default 0,
  title text not null,
  service_category text not null,
  pillar text not null check (pillar in ('BUILD','GROW','AUTOMATE')),
  description text not null default '',
  accent_color text not null default '#3B82F6',
  tags text[] not null default '{}',
  client_sector text not null default '',
  visual_type text not null default 'visual',
  deliverables text[] not null default '{}',
  image_path text,                       -- storage path in `media` bucket (card, 4:3)
  image_wide_path text,                  -- wide variant (16:9, used in wide grid slots)
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------- studio_works --
create table if not exists public.studio_works (
  id text primary key,
  order_index integer not null default 0,
  title text not null,
  caption text not null default '',
  description text not null default '',
  category text not null,
  year text not null default '',
  client text not null default '',
  accent text not null default '#8B5CF6',
  image_path text,                       -- 16:10 scene visual
  poster_path text,                      -- 16:9 video poster
  video_path text,                       -- 16:9 mp4/webm (optional)
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------ testimonials --
create table if not exists public.testimonials (
  id text primary key,
  order_index integer not null default 0,
  quote text not null,
  name text not null,
  role text not null default '',
  initials text not null default '',
  accent text not null default '#3B82F6',
  service text not null default '',
  avatar_path text,                      -- 1:1, 256x256 recommended
  published boolean not null default true,
  updated_at timestamptz not null default now()
-- ----------------------------------------------------------- site_content --
);
create table if not exists public.site_content (
  key text primary key,                  -- e.g. 'home.creed.heading'
  value jsonb not null,
  group_name text not null default 'general',
  label text not null default '',
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id)
);

-- ------------------------------------------------------------------ leads --
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text default '',
  service text default '',
  project_type text default '',
  message text not null,
  status text not null default 'new' check (status in ('new','read','replied','archived')),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------- RLS --
alter table public.profiles      enable row level security;
alter table public.projects      enable row level security;
alter table public.studio_works  enable row level security;
alter table public.testimonials  enable row level security;
alter table public.site_content  enable row level security;
alter table public.leads         enable row level security;

-- Profiles: users read their own; admins read all + manage roles
create policy "read own profile" on public.profiles
  for select using (id = auth.uid() or public.my_role() = 'admin');
create policy "admin manages profiles" on public.profiles
  for all using (public.my_role() = 'admin');

-- Content tables: anyone reads published; editor writes unpublished;
-- only admin publishes/unpublishes or deletes
do $$
declare t text;
begin
  foreach t in array array['projects','studio_works','testimonials'] loop
    execute format($f$
      create policy "public read published %1$s" on public.%1$I
        for select using (published = true or public.my_role() is not null);
      create policy "staff write %1$s" on public.%1$I
        for all using (public.my_role() in ('admin','editor'))
        with check (
          public.my_role() = 'admin'
          or published = false
        );
    $f$, t);
  end loop;
end $$;

-- Site content: anyone reads; staff writes
create policy "public read site_content" on public.site_content
  for select using (true);
create policy "staff write site_content" on public.site_content
  for all using (public.my_role() in ('admin','editor'))
  with check (public.my_role() in ('admin','editor'));

-- Leads: anyone can submit; only staff can read/manage
create policy "anyone can submit leads" on public.leads
  for insert with check (true);
create policy "staff read leads" on public.leads
  for select using (public.my_role() is not null);
create policy "staff manage leads" on public.leads
  for update using (public.my_role() is not null);
create policy "admin delete leads" on public.leads
  for delete using (public.my_role() = 'admin');

-- --------------------------------------------------------------- storage --
insert into storage.buckets (id, name, public) values ('media','media', true)
on conflict (id) do nothing;

-- Public read of media; staff upload/replace; admin deletes
create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');
create policy "staff upload media" on storage.objects
  for insert with check (bucket_id = 'media' and public.my_role() in ('admin','editor'));
create policy "staff replace media" on storage.objects
  for update using (bucket_id = 'media' and public.my_role() in ('admin','editor'));
create policy "admin delete media" on storage.objects
  for delete using (bucket_id = 'media' and public.my_role() = 'admin');

-- ------------------------------------------------------------------ seed --
insert into public.projects (id, order_index, title, service_category, pillar, description, accent_color, tags, client_sector, visual_type, deliverables, image_wide_path)
values
  ('apex-storefront', 1, 'Apex Living Storefront', 'E-COMMERCE', 'BUILD',
   'A modern online shopping experience designed around the brand with fluid browsing and high-speed checkout.',
   '#3B82F6', array['Custom Storefront','Checkout Flow','Mobile Commerce'],
   'Modern Retail & Lifestyle', 'interactive',
   array['Responsive Store Design','Payment Gateway Integration','Catalog Architecture','Cart Optimization'], null),
  ('horizon-platform', 2, 'Horizon Studio Web Experience', 'WEB DEVELOPMENT', 'BUILD',
   'A responsive corporate web experience built for clarity, speed, and real business utility across all screen sizes.',
   '#0EA5E9', array['Corporate Website','Fast Loading','Responsive UI'],
   'Architecture & Design Consultancy', 'video',
   array['Clean Front-end Architecture','CMS Content Modeling','Dynamic Portfolios','Accessibility AA'], null),
  ('meridian-search', 3, 'Meridian Search & Discovery', 'SEO', 'GROW',
   'Search-focused improvements and structured content architecture designed to strengthen long-term online visibility.',
   '#10B981', array['Technical SEO','Structured Content','Organic Discovery'],
   'B2B Professional Services', 'interactive',
   array['Semantic Schema Markup','Content Hierarchy Audit','Search Console Optimization','Core Web Architecture'], null),
  ('lumina-pulse', 4, 'Lumina Digital Reach', 'DIGITAL MARKETING', 'GROW',
   'Targeted digital campaign design and media creative reaching high-intent customers with clear value messaging.',
   '#8B5CF6', array['Campaign Creative','Audience Strategy','Multi-Channel'],
   'Consumer Brand & Wellness', 'video',
   array['Ad Creative Design','Multi-Channel Campaign Strategy','Audience Segmentation','Funnel Optimization'], null),
  ('nova-identity', 5, 'Nova Studio Brand Identity', 'GRAPHIC DESIGN', 'GROW',
   'Distinct visual identity, custom typography system, and digital brand assets that make the business recognizable.',
   '#EC4899', array['Brand Identity','Typography System','Design Tokens'],
   'Creative Agency & Media', 'interactive',
   array['Logo & Mark System','Typography Scale','Palette System','Digital Marketing Assets'], null),
  ('flowops-assistant', 6, 'FlowOps Smart Assistant', 'AI AUTOMATION', 'AUTOMATE',
   'AI-powered customer inquiry routing and automated scheduling that reduces repetitive administrative work.',
   '#F59E0B', array['AI Agent','Workflow Automation','Calendar Routing'],
   'Logistics & Client Operations', 'interactive',
   array['Inquiry Triage Pipeline','Automated CRM Routing','Calendar Scheduling Bot','Staff Notification Webhooks'], null)
on conflict (id) do nothing;

insert into public.studio_works (id, order_index, title, caption, description, category, year, client, accent, video_path)
values
  ('atlas', 1, 'Atlas Identity System', 'A mark that moves like it means it.',
   'Full identity system — logo architecture, type scale, and a living brand book.',
   'BRAND IDENTITY', '2026', 'Atlas Ventures', '#8B5CF6', null),
  ('kiln', 2, 'Kiln Editorial Series', 'Print logic, screen physics.',
   'Editorial layouts and poster series translated from print to digital canvases.',
   'GRAPHIC DESIGN', '2025', 'Kiln Ceramics', '#EC4899', null),
  ('northbeam', 3, 'Northbeam Campaign', 'One idea, carried across every channel.',
   'Launch campaign creative — key visual, ad system, and social kits.',
   'CAMPAIGN CREATIVE', '2025', 'Northbeam Outdoor', '#0EA5E9', null),
  ('pulse', 4, 'Pulse Motion Reel', 'Frames that breathe between moments.',
   'Motion identity and launch film — kinetic type, liquid transitions, sound design.',
   'MOTION / VIDEO', '2026', 'Pulse Audio', '#F59E0B', 'dYISWlAxUVs'),
  ('meridian-rebrand', 5, 'Meridian Rebrand', 'Old authority, new gravity.',
   'Rebrand of a 20-year consultancy — heritage kept, weight redistributed.',
   'BRAND IDENTITY', '2024', 'Meridian Advisory', '#3B82F6', null),
  ('lumen', 6, 'Lumen Packaging World', 'A shelf is a stage.',
   'Packaging system and shelf-presence design across a 12-SKU range.',
   'GRAPHIC DESIGN', '2024', 'Lumen Skincare', '#10B981', null)
on conflict (id) do nothing;

insert into public.testimonials (id, order_index, quote, name, role, initials, accent, service)
values
  ('sana-mir', 1, 'They treated our store like a product, not a project. Every decision had a reason behind it — and the results followed.',
   'Sana Mir', 'Founder, Apex Living', 'SM', '#3B82F6', 'E-COMMERCE'),
  ('daniel-cole', 2, 'Clear scoping, honest timelines, zero drama. The site shipped faster than agencies that quoted us double.',
   'Daniel Cole', 'Director, Horizon Studio', 'DC', '#0EA5E9', 'WEB DEVELOPMENT'),
  ('amira-hassan', 3, 'Our organic traffic finally compounds instead of resetting. It feels like infrastructure, not marketing.',
   'Amira Hassan', 'Managing Partner, Meridian Advisory', 'AH', '#10B981', 'SEO'),
  ('yusuf-rahman', 4, 'The brand system they built makes every asset we produce look intentional. Our team designs faster because of it.',
   'Yusuf Rahman', 'CMO, Lumina Wellness', 'YR', '#8B5CF6', 'DIGITAL MARKETING'),
  ('lena-fischer', 5, 'The automation quietly does the work of two coordinators. Nobody touches a spreadsheet anymore.',
   'Lena Fischer', 'Ops Lead, FlowOps Logistics', 'LF', '#F59E0B', 'AI AUTOMATION')
on conflict (id) do nothing;

insert into public.site_content (key, value, group_name, label) values
  ('site.logo.path',        '"site/logo"'::jsonb,              'branding', 'Logo mark (1:1, min 512×512, SVG/PNG/WebP)'),
  ('home.creed.heading',    '"Focused on outcomes."'::jsonb,   'home',     'Creed heading'),
  ('home.creed.subheading', '"Every engagement is anchored around our three operational pillars."'::jsonb, 'home', 'Creed subheading'),
  ('home.testimonials.heading', '"In their words."'::jsonb,    'home',     'Testimonials heading'),
  ('home.cta.heading',      '"Have an idea? Let''s build it."'::jsonb, 'home', 'CTA heading'),
  ('contact.heading',       '"Let''s build something."'::jsonb,'contact',  'Contact page heading'),
  ('work.stories.heading',  '"The stories behind it."'::jsonb, 'work',     'Work stories heading'),
  ('studio.intro.heading',  '"Design is the way it works."'::jsonb, 'studio', 'Studio hero heading'),
  ('footer.tagline',        '"Build • Grow • Automate"'::jsonb,'general',  'Footer tagline')
on conflict (key) do nothing;
