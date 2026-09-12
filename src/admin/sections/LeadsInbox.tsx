import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, MailOpen, Archive, ArchiveRestore, Reply, Trash2, RefreshCw } from 'lucide-react';
import { leadsApi, Lead } from '../../lib/adminApi';
import { StatusPill, GhostButton } from '../AdminKit';

export const LeadsInbox: React.FC<{ onData?: () => void }> = ({ onData }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied' | 'archived'>('all');

  const load = () => {
    setLoading(true); setError(null);
    leadsApi.list()
      .then((rows) => { setLeads(rows); setSelected((s) => s ? rows.find((r) => r.id === s.id) || null : null); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    onData?.();
  };
  useEffect(load, []);

  const counts = useMemo(() => ({
    all: leads.length,
    new: leads.filter((l) => l.status === 'new').length,
    read: leads.filter((l) => l.status === 'read').length,
    replied: leads.filter((l) => l.status === 'replied').length,
    archived: leads.filter((l) => l.status === 'archived').length,
  }), [leads]);

  const visible = filter === 'all' ? leads : leads.filter((l) => l.status === filter);

  const setStatus = async (lead: Lead, status: Lead['status']) => {
    setLeads((rows) => rows.map((r) => (r.id === lead.id ? { ...r, status } : r)));
    setSelected((s) => (s?.id === lead.id ? { ...s, status } : s));
    try { await leadsApi.setStatus(lead.id, status); } catch { load(); }
  };

  const remove = async (lead: Lead) => {
    setLeads((rows) => rows.filter((r) => r.id !== lead.id));
    setSelected(null);
    try { await leadsApi.remove(lead.id); } catch { load(); }
  };

  const open = async (lead: Lead) => {
    setSelected(lead);
    if (lead.status === 'new') setStatus(lead, 'read');
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Leads Inbox</h1>
          <p className="text-xs text-skyz-text-muted mt-0.5">Contact-form submissions, stored in the <span className="font-mono">leads</span> table.</p>
        </div>
        <GhostButton onClick={load}><RefreshCw className="w-3.5 h-3.5" /> Refresh</GhostButton>
      </div>

      {/* filter pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {(['all', 'new', 'read', 'replied', 'archived'] as const).map((f) => (
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
            {f.toUpperCase()}{f !== 'all' && ` · ${counts[f]}`}
            {f === 'new' && counts.new > 0 && filter !== 'new' && (
              <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-skyz-accent align-middle" />
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-sm text-red-500 dark:text-red-400 mb-4">{error}</div>
      )}

      <div className="grid lg:grid-cols-[minmax(280px,380px)_1fr] gap-4">
        {/* list */}
        <div className={`rounded-2xl border border-skyz-border bg-skyz-surface overflow-hidden ${selected ? 'hidden lg:block' : ''}`}>
          {loading ? (
            <div className="p-8 text-center text-sm text-skyz-text-muted">Loading…</div>
          ) : visible.length === 0 ? (
            <div className="p-8 text-center text-sm text-skyz-text-muted">No leads here yet.</div>
          ) : (
            <ul className="divide-y divide-skyz-border-subtle max-h-[62vh] overflow-y-auto">
              {visible.map((lead) => (
                <li key={lead.id}>
                  <button
                    type="button"
                    onClick={() => open(lead)}
                    className={`w-full text-left px-4 py-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                      selected?.id === lead.id ? 'bg-skyz-surface-subtle' : 'hover:bg-skyz-surface-subtle/60'
                    }`}
                  >
                    {lead.status === 'new'
                      ? <Mail className="w-4 h-4 text-skyz-accent flex-shrink-0 mt-0.5" />
                      : <MailOpen className="w-4 h-4 text-skyz-text-muted/60 flex-shrink-0 mt-0.5" />}
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className={`text-sm truncate ${lead.status === 'new' ? 'font-bold text-skyz-text' : 'font-medium text-skyz-text'}`}>
                          {lead.name}
                        </span>
                        {lead.service && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-skyz-surface-subtle text-skyz-text-muted border border-skyz-border flex-shrink-0">{lead.service}</span>}
                      </span>
                      <span className="block text-xs text-skyz-text-muted truncate mt-0.5">{lead.message}</span>
                      <span className="block text-[10px] font-mono text-skyz-text-muted/70 mt-1">
                        {new Date(lead.created_at).toLocaleString()}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* detail */}
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-skyz-border bg-skyz-surface p-5 sm:p-6"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="font-display text-lg font-bold">{selected.name}</h2>
                    <StatusPill status={selected.status} />
                  </div>
                  <p className="text-xs text-skyz-text-muted mt-0.5">
                    {selected.email}{selected.company ? ` · ${selected.company}` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="lg:hidden text-xs font-mono text-skyz-text-muted cursor-pointer"
                >
                  ← BACK
                </button>
              </div>

              <div className="rounded-xl bg-skyz-surface-subtle border border-skyz-border p-4 text-sm text-skyz-text leading-relaxed whitespace-pre-wrap">
                {selected.message}
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-5">
                <a
                  href={`mailto:${selected.email}?subject=Re: your SkyZ project inquiry${selected.service ? ` (${selected.service})` : ''}`}
                  onClick={() => setStatus(selected, 'replied')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] text-sm font-semibold shadow-md hover:bg-skyz-accent dark:hover:bg-skyz-accent-secondary transition-all cursor-pointer"
                >
                  <Reply className="w-4 h-4" /> Reply
                </a>
                {selected.status !== 'archived' ? (
                  <GhostButton onClick={() => setStatus(selected, 'archived')}>
                    <Archive className="w-3.5 h-3.5" /> Archive
                  </GhostButton>
                ) : (
                  <GhostButton onClick={() => setStatus(selected, 'read')}>
                    <ArchiveRestore className="w-3.5 h-3.5" /> Unarchive
                  </GhostButton>
                )}
                {selected.status === 'replied' && (
                  <GhostButton onClick={() => setStatus(selected, 'read')}>
                    Mark unread
                  </GhostButton>
                )}
                <GhostButton onClick={() => remove(selected)}>
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </GhostButton>
              </div>

              <p className="mt-4 text-[10px] font-mono text-skyz-text-muted/70">
                RECEIVED {new Date(selected.created_at).toLocaleString()}
                {selected.project_type ? ` · TYPE ${selected.project_type}` : ''}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden lg:flex rounded-2xl border border-dashed border-skyz-border items-center justify-center p-10 text-sm text-skyz-text-muted"
            >
              Select a lead to read it.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
