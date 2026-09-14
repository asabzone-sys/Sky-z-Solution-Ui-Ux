// @license SPDX-License-Identifier: Apache-2.0
// Calendly webhook receiver — writes bookings into the public.meetings table.
//
// Deploy (from the project root):
//   npx supabase functions deploy calendly-webhook --no-verify-jwt
//   npx supabase secrets set CALENDLY_WEBHOOK_SECRET=<random-string>
//
// Calendly setup (one-time, needs a Personal Access Token from
// calendly.com/integrations → API & Webhooks):
//   curl -X POST https://api.calendly.com/webhook_subscriptions \
//     -H "Authorization: Bearer <YOUR_TOKEN>" \
//     -H "Content-Type: application/json" \
//     -d '{
//       "url": "https://<PROJECT_REF>.supabase.co/functions/v1/calendly-webhook",
//       "events": ["invitee.created", "invitee.canceled"],
//       "organization": "https://calendly.com/organizations/<ORG_UUID>",
//       "scope": "organization"
//     }'

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const WEBHOOK_SECRET = Deno.env.get('CALENDLY_WEBHOOK_SECRET') ?? '';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  const payload = await req.text();

  // Signature check (HMAC-SHA256 of the raw body with the shared secret).
  if (WEBHOOK_SECRET) {
    const header = req.headers.get('calendly-webhook-signature') ?? '';
    const ts = header.match(/t=([^;]+)/)?.[1] ?? '';
    const sig = header.match(/v1=([0-9a-f]+)/i)?.[1] ?? '';
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(WEBHOOK_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${ts}.${payload}`));
    const expected = Array.from(new Uint8Array(mac)).map((b) => b.toString(16).padStart(2, '0')).join('');
    if (expected !== sig) return json({ error: 'bad signature' }, 401);
  }

  let event: any;
  try {
    event = JSON.parse(payload);
  } catch {
    return json({ error: 'invalid json' }, 400);
  }

  const type = event?.event as string | undefined;
  if (type !== 'invitee.created' && type !== 'invitee.canceled') {
    return json({ ok: true, ignored: type });
  }

  const invitee = event.payload ?? {};
  const sb = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, // bypasses RLS by design
  );

  const row = {
    invitee_uri: invitee.uri,
    event_uri: invitee.event ?? '',
    event_type: invitee.event_type ?? '',
    invitee_name: invitee.name ?? '',
    invitee_email: invitee.email ?? '',
    start_time: invitee.start_time ?? null,
    timezone: invitee.timezone ?? '',
    status: type === 'invitee.canceled' ? 'canceled' : (invitee.rescheduled ? 'rescheduled' : 'scheduled'),
    question_answers: (invitee.questions_and_answers ?? []).map((qa: any) => ({
      question: qa.question,
      answer: qa.answer,
    })),
    raw: invitee,
  };

  const { error } = await sb.from('meetings').upsert(row, { onConflict: 'invitee_uri' });
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true });
});
