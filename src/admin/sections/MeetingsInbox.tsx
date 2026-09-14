import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, RefreshCw, Trash2, ExternalLink, Copy, Check } from 'lucide-react';
import { meetingsApi, Meeting } from '../../lib/adminApi';
import { GhostButton } from '../AdminKit';

/**
 * Meetings — Calendly bookings streamed in by the calendly-webhook edge
 * function. Same inbox interaction language as LeadsInbox: filter pills,
 * animated rows, detail pane. Read-mostly: status changes only mark a
 * booking canceled manually (Calendly remains the source of truth).
 */

const fmtDate = (iso: string | null, tz: string | null) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString(undefined, {
      weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
      ...(tz ? { timeZone: tz } : {}),
    });
  } catch {
    return iso;
  }
};

export const MeetingsInbox: React.FC<{ onData?: () => void }> = ({ onData }) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selected, setSelected] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'canceled'>('all');
  const [copied, setCopied] = useState(false);

  const load = () => {
    setLoading(true); setError(null);
    meetingsApi.list()
      .then((rows) => { setMeetings(rows); setSelected((s) => (s ? rows.find((r) => r.id === s.id) ?? null : null)); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    onData?.();
  };
  useEffect(load, []);

  const counts = useMemo(() => {
    const now = Date.now();
    return {
      all: meetings.length,
      upcoming: meetings.filter((m) => m.status !== 'canceled' && m.start_time && +new Date(m.start_time) >= now).length,
      past: meetings.filter((m) => m.status !== 'canceled' && (!m.start_time || +new Date(m.start_time) < now)).length,
      canceled: meetings.filter((m) => m.status === 'canceled').length,
    };
  }, [meetings]);

  const visible = useMemo(() => {
    const now = Date.now();
    return meetings.filter((m) => {
      if (filter === 'canceled') return m.status === 'canceled';
      if (filter === 'upcoming') return m.status !== 'canceled' && m.start_time && +new Date(m.start_time) >= now;
      if (filter === 'past') return m.status !== 'canceled' && (!m.start_time || +new Date(m.start_time) < now);
      return true;
    });
  }, [meetings, filter]);

  const remove = async (m: Meeting) => {
    setMeetings((rows) => rows.filter((r) => r.id !== m.id));
    setSelected(null);
    try { await meetingsApi.remove(m.id); } catch { load(); }
  };

  const copyEmail = (m: Meeting) => {
    navigator.clipboard?.writeText(m.invitee_email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Meetings</h1>
          <p className="text-xs text-skyz-text-muted mt-0.5">
            Calendly bookings, streamed in by the <span className="font-mono">calendly-webhook</span> function.
          </p>
        </div>
        <GhostButton onClick={load}><RefreshCw className="w-3.5 h-3.5" /> Refresh</GhostButton>
      </div>

      {/* filter pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {(['all', 'upcoming', 'past', 'canceled'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-mono font-semibold border transition-all cursor-pointer ${
              filter === f
                ? 'bg-skyz-text text-skyz-bg border-skyz-text dark:bg-skyz-accent dark:text-[#080B10] dark:border-skyz-accent'
                : 'bg-skyz-surface text-skyz-text-muted border-skyz-border hover:text-skyz-text'
            }`}
          >
            {f.toUpperCase()} · {counts[f]}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5 text-sm text-red-500 mb-5">
          {error} — if this says the table is missing, run the latest file from{' '}
          <span className="font-mono">supabase/migrations/</span> in the SQL editor first.
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-skyz-surface border border-skyz-border animate-pulse" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-skyz-border bg-skyz-surface p-10 text-center">
          <Calendar className="w-8 h-8 text-skyz-text-muted mx-auto mb-3" />
          <p className="text-sm font-semibold">No meetings here yet</p>
          <p className="text-xs text-skyz-text-muted mt-1 max-w-md mx-auto leading-relaxed">
            Bookings appear automatically once the Calendly webhook is connected
            (see <span className="font-mono">supabase/functions/calendly-webhook/</span> for the one-time setup).
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {visible.map((m) => {
              const canceled = m.status === 'canceled';
              const upcoming = !canceled && m.start_time && +new Date(m.start_time) >= Date.now();
              return (
                <motion.div
                  key={m.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setSelected(m)}
                  className={`rounded-2xl border p-4 cursor-pointer transition-colors ${
                    selected?.id === m.id
                      ? 'border-skyz-accent/60 bg-skyz-accent/5'
                      : 'border-skyz-border bg-skyz-surface hover:border-skyz-text/25'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-semibold text-sm truncate">{m.invitee_name || m.invitee_email}</span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                          canceled
                            ? 'text-red-500 border-red-500/30 bg-red-500/5'
                            : upcoming
                              ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5'
                              : 'text-skyz-text-muted border-skyz-border'
                        }`}>
                          {canceled ? 'CANCELED' : upcoming ? 'UPCOMING' : 'DONE'}
                        </span>
                      </div>
                      <div className="text-xs text-skyz-text-muted mt-1">
                        {fmtDate(m.start_time, m.timezone)} {m.timezone ? `· ${m.timezone}` : ''}
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-skyz-text-muted flex-shrink-0 hidden sm:block">
                      {new Date(m.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* detail pane */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 14 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-3xl bg-skyz-surface border border-skyz-border shadow-2xl overflow-hidden"
            >
              <div className="p-6 sm:p-8 space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl font-bold tracking-tight">{selected.invitee_name || 'Meeting'}</h3>
                    <p className="text-xs font-mono text-skyz-text-muted mt-1">{fmtDate(selected.start_time, selected.timezone)}</p>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    selected.status === 'canceled' ? 'text-red-500 border-red-500/30' : 'text-emerald-500 border-emerald-500/30'
                  }`}>
                    {selected.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-skyz-text-muted">{selected.invitee_email}</span>
                  <button type="button" onClick={() => copyEmail(selected)} aria-label="Copy email" className="p-1.5 rounded-lg hover:bg-skyz-surface-subtle text-skyz-text-muted hover:text-skyz-text transition-colors cursor-pointer">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {selected.question_answers?.length ? (
                  <div className="space-y-2.5 rounded-2xl border border-skyz-border bg-skyz-surface-subtle p-4">
                    {selected.question_answers.map((qa, i) => (
                      <div key={i}>
                        <div className="text-[10px] font-mono uppercase tracking-wider text-skyz-text-muted">{qa.question}</div>
                        <div className="text-sm mt-0.5">{qa.answer || '—'}</div>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-2 pt-1">
                  <a
                    href={selected.event_uri || undefined}
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-skyz-border text-xs font-semibold hover:bg-skyz-surface-subtle transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Open in Calendly
                  </a>
                  <button
                    type="button"
                    onClick={() => remove(selected)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-red-500/30 text-red-500 text-xs font-semibold hover:bg-red-500/5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
