/**
 * Page Text & Settings — schema-driven editor over `site_content`.
 * Grouped cards, save-per-field, no layout shift on save (inline flash).
 */
import React, { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Save, Check } from 'lucide-react';
import { contentApi, ContentEntry } from '../../lib/adminApi';
import { GhostButton } from '../AdminKit';

const ContentField: React.FC<{
  entry: ContentEntry;
  onChange: (v: unknown) => void;
}> = ({ entry, onChange }) => {
  const raw = entry.value;
  const isText = typeof raw === 'string';
  const [text, setText] = useState(isText ? raw : JSON.stringify(raw, null, 2));

  useEffect(() => { setText(isText ? raw : JSON.stringify(raw, null, 2)); }, [raw, isText]);

  return (
    <div>
      <label className="block text-[11px] font-mono text-skyz-text-muted mb-1.5">{entry.key}</label>
      {isText && raw.length <= 80 ? (
        <input
          type="text"
          value={text}
          onChange={(e) => { setText(e.target.value); onChange(e.target.value); }}
          className="w-full px-3.5 py-2.5 rounded-xl border border-skyz-border bg-skyz-surface-subtle text-skyz-text text-sm focus:outline-none focus:border-skyz-accent transition-colors"
        />
      ) : (
        <textarea
          rows={isText ? 3 : 4}
          value={text}
          onChange={(e) => { setText(e.target.value); onChange(isText ? e.target.value : safeParse(e.target.value, raw)); }}
          className={`w-full px-3.5 py-2.5 rounded-xl border border-skyz-border bg-skyz-surface-subtle text-skyz-text text-sm focus:outline-none focus:border-skyz-accent transition-colors resize-y font-mono ${isText ? '' : 'text-xs'}`}
        />
      )}
    </div>
  );
};

const safeParse = (s: string, fallback: unknown): unknown => {
  try { return JSON.parse(s); } catch { return fallback; }
};

export const SiteContentSection: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
  const [entries, setEntries] = useState<ContentEntry[]>([]);
  const [drafts, setDrafts] = useState<Record<string, unknown>>({});
  const [dirty, setDirty] = useState<Record<string, boolean>>({});
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true); setError(null);
    contentApi.list()
      .then((rows) => { setEntries(rows); setDirty({}); setDrafts({}); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const groups = useMemo(() => {
    const g = new Map<string, ContentEntry[]>();
    for (const e of entries) {
      if (!g.has(e.group_name)) g.set(e.group_name, []);
      g.get(e.group_name)!.push(e);
    }
    return [...g.entries()];
  }, [entries]);

  const save = async (key: string) => {
    setBusy(key); setError(null);
    try {
      await contentApi.save(key, drafts[key] !== undefined ? drafts[key] : (entries.find((e) => e.key === key)?.value ?? null));
      setSavedKey(key); setDirty((d) => ({ ...d, [key]: false }));
      setTimeout(() => setSavedKey((k) => (k === key ? null : k)), 1600);
    } catch (e) {
      setError((e as Error).message);
    }
    setBusy(null);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Page Text &amp; Settings</h1>
          <p className="text-xs text-skyz-text-muted mt-0.5">
            Editable strings across the site. Changes go live on the next visit — no deploy needed.
          </p>
        </div>
        <GhostButton onClick={load}><RefreshCw className="w-3.5 h-3.5" /> Refresh</GhostButton>
      </div>

      {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-sm text-red-500 dark:text-red-400 mb-4">{error}</div>}

      {loading ? (
        <div className="p-8 rounded-2xl border border-skyz-border bg-skyz-surface text-center text-sm text-skyz-text-muted">Loading…</div>
      ) : groups.length === 0 ? (
        <div className="p-8 rounded-2xl border border-dashed border-skyz-border text-center text-sm text-skyz-text-muted">
          No editable content keys yet. They are seeded by <span className="font-mono">supabase/schema.sql</span>.
        </div>
      ) : (
        <div className="space-y-5">
          {groups.map(([group, items]) => (
            <section key={group} className="rounded-2xl border border-skyz-border bg-skyz-surface p-5 sm:p-6">
              <h2 className="font-display font-bold text-sm uppercase tracking-widest text-skyz-text-muted mb-4">{group}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {items.map((entry) => (
                  <div key={entry.key} className={isWide(entry)}>
                    <ContentField
                      entry={entry}
                      onChange={(v) => { setDrafts((d) => ({ ...d, [entry.key]: v })); setDirty((d) => ({ ...d, [entry.key]: true })); }}
                    />
                    <div className="flex items-center gap-2 mt-2.5">
                      <button
                        type="button"
                        disabled={!dirty[entry.key] || busy === entry.key || !isAdmin}
                        onClick={() => save(entry.key)}
                        title={isAdmin ? undefined : 'Only admins can publish changes'}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] text-[11px] font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-skyz-accent dark:hover:bg-skyz-accent-secondary transition-all"
                      >
                        {savedKey === entry.key ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                        {savedKey === entry.key ? 'Saved' : busy === entry.key ? 'Saving…' : 'Save'}
                      </button>
                      {entry.label && <span className="text-[10px] text-skyz-text-muted truncate">{entry.label}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

const isWide = (entry: ContentEntry): string =>
  (typeof entry.value === 'string' && entry.value.length > 80) || typeof entry.value !== 'string'
    ? 'sm:col-span-2'
    : '';
