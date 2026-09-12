/**
 * Team — profiles list with role management (admin-only writes; RLS enforces).
 */
import React, { useEffect, useState } from 'react';
import { RefreshCw, ShieldCheck, UserCog, Copy, Check } from 'lucide-react';
import { team, Role } from '../../lib/adminApi';
import { GhostButton } from '../AdminKit';

export const TeamSection: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
  const [people, setPeople] = useState<Array<{ id: string; email: string; role: Role; fullName: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const load = () => {
    setLoading(true); setError(null);
    team.list()
      .then(setPeople)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const setRole = async (id: string, role: Role) => {
    setPeople((rows) => rows.map((p) => (p.id === id ? { ...p, role } : p)));
    try { await team.setRole(id, role); } catch { load(); }
  };

  const inviteUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/admin`
    : '/admin';

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true); setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Team</h1>
          <p className="text-xs text-skyz-text-muted mt-0.5">Everyone with dashboard access. Roles apply instantly.</p>
        </div>
        <GhostButton onClick={load}><RefreshCw className="w-3.5 h-3.5" /> Refresh</GhostButton>
      </div>

      {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-sm text-red-500 dark:text-red-400 mb-4">{error}</div>}

      {/* invite hint */}
      <div className="mb-5 rounded-2xl border border-skyz-border bg-skyz-surface p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display font-bold text-sm flex items-center gap-2"><UserCog className="w-4 h-4 text-skyz-accent" /> Adding a teammate</h2>
            <p className="text-xs text-skyz-text-muted mt-1 leading-relaxed">
              Invite them in Supabase → Authentication → Users → <span className="font-mono">Send invitation</span>. They set a
              password on first login (as <span className="font-mono">editor</span> by default), then appear here. The first
              account you created is the <span className="font-mono">admin</span>.
            </p>
          </div>
          <button
            type="button"
            onClick={copyInvite}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-skyz-border text-xs font-semibold text-skyz-text hover:border-skyz-accent/50 transition-all cursor-pointer flex-shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy dashboard URL'}
          </button>
        </div>
      </div>

      {/* people */}
      <div className="rounded-2xl border border-skyz-border bg-skyz-surface overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-skyz-text-muted">Loading…</div>
        ) : people.length === 0 ? (
          <div className="p-8 text-center text-sm text-skyz-text-muted">No profiles yet.</div>
        ) : (
          <ul className="divide-y divide-skyz-border-subtle">
            {people.map((p) => (
              <li key={p.id} className="px-4 sm:px-5 py-4 flex flex-wrap items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold truncate flex items-center gap-2">
                    {p.fullName || p.email.split('@')[0]}
                    {p.role === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-skyz-accent flex-shrink-0" title="Admin" />}
                  </div>
                  <div className="text-xs text-skyz-text-muted truncate">{p.email}</div>
                </div>
                <div className="flex items-center gap-1 p-1 rounded-full bg-skyz-surface-subtle border border-skyz-border">
                  {(['editor', 'admin'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      disabled={!isAdmin}
                      onClick={() => setRole(p.id, r)}
                      title={isAdmin ? undefined : 'Only admins can change roles'}
                      className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wide transition-all cursor-pointer disabled:cursor-not-allowed ${
                        p.role === r
                          ? 'bg-skyz-text text-skyz-bg dark:bg-skyz-accent dark:text-[#080B10]'
                          : 'text-skyz-text-muted hover:text-skyz-text'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};
