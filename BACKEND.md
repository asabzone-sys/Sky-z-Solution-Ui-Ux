# SkyZ Backend — Setup Guide (Supabase + Admin Dashboard)

The whole site's content is now backend-managed. The public site reads through
hooks with **graceful fallback**: if Supabase isn't configured (or is paused /
offline), the site renders identically from the bundled local data.

## 1. Create the Supabase project (one time, free)

1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Choose a name (e.g. `skyz`), a region near your users, and a strong DB password.
3. Wait for provisioning, then open **Project Settings → API** and copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

## 2. Add the keys to Vercel + local

- **Vercel:** Project → Settings → Environment Variables → add both keys for
  Production / Preview / Development → **Redeploy**.
- **Local:** create `.env.local` in the project root:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key...
```

## 3. Run the schema (one time)

Supabase Dashboard → **SQL Editor** → **New query** → paste the whole contents
of `supabase/schema.sql` → **Run**.

This creates: profiles + roles (first sign-up becomes **admin**), the
`projects` / `studio_works` / `testimonials` / `leads` / `site_content` tables,
Row Level Security policies, the public `media` storage bucket, and seed rows
copied from the site's current local content.

## 4. Create your admin account

1. Visit `/admin` on the site (e.g. `https://your-site.vercel.app/admin`).
2. Sign up **once** with your email — the first user automatically becomes
   admin (handled by a DB trigger in the schema). If you already signed up a
   user before running the schema, promote yourself manually:
   `update public.profiles set role='admin' where email='you@example.com';`
3. Teammates: invite them in **Supabase → Authentication → Users → Send
   invitation**; they land as `editor` and can be promoted in **Admin → Team**.

## 5. Using the dashboard (`/admin`)

| Section | What it manages |
|---|---|
| **Leads Inbox** | Real contact-form submissions with NEW / READ / REPLIED / ARCHIVED states and a live unread badge |
| **Work Projects** | Work-page chapters + homepage carousel: title, category, pillar, sector, accent color, card + wide visuals |
| **Studio Works** | Studio scenes: caption, category, year, client, accent, scene visual, video + poster |
| **Testimonials** | Homepage quotes: name, role, service, avatar (1:1), accent |
| **Page Text & Settings** | Editable site strings (creed/CTA/contact/studio headings, footer tagline, logo path) |
| **Team** | Roles (admin can promote editors); admins manage everything, editors save drafts that wait for approval |

Every image/video upload slot shows its **required aspect ratio** (e.g.
`4:3 · 1600×1200`) and warns on mismatch — no more guessing sizes.

Rows you mark **DRAFT** stay hidden from the public site; flip to PUBLISHED to
go live. Ordering arrows control the display sequence everywhere.

## 6. Notes

- Media uploads go to the public `media` bucket under `work/`, `studio/`,
  `testimonials/`, `site/`.
- Content edits go live on the next page load — no redeploy needed.
- The admin route renders standalone (no cinematic loader, no site chrome) and
  is SPA-rewritten via `vercel.json`.
- To disable the backend at any time (e.g. pause Supabase), just remove the
  env vars and redeploy — the site falls back to the bundled content.
