import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Pencil, Trash2, RefreshCw, ArrowUp, ArrowDown, Save } from 'lucide-react';
import { Field, TextInput, TextArea, Select, MediaSlot, PublishToggle, PrimaryButton, GhostButton } from '../AdminKit';

/* ------------------------------------------------------------------ */
/* Field schema                                                        */
/* ------------------------------------------------------------------ */
export interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'color' | 'order' | 'media';
  options?: string[];
  slot?: string;          // media slot key (SLOTS)
  half?: boolean;         // half-width in the form grid
}

export interface ManagerConfig {
  title: string;
  description: string;
  fields: FieldDef[];
  titleKey: string;       // row field shown as list title
  subKey: string;         // row field shown as list subtitle
  newTemplate: () => Record<string, unknown>;
  canDelete?: boolean;
}

interface Row {
  id: string;
  published?: boolean;
  [k: string]: unknown;
}

/* ------------------------------------------------------------------ */
/* Generic manager                                                     */
/* ------------------------------------------------------------------ */
export const ContentManager: React.FC<{
  config: ManagerConfig;
  list: () => Promise<Row[]>;
  save: (row: Record<string, unknown>) => Promise<void>;
  remove?: (id: string) => Promise<void>;
  isAdmin: boolean;
}> = ({ config, list, save, remove, isAdmin }) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  const load = () => {
    setLoading(true); setError(null);
    list().then(setRows).catch((e) => setError(e.message)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => { setDraft(config.newTemplate()); setIsNew(true); };
  const openRow = (r: Row) => { setDraft({ ...r }); setIsNew(false); };

  const commit = async () => {
    if (!draft) return;
    setBusy(true); setError(null);
    try {
      await save(draft);
      setSavedFlash(true); setTimeout(() => setSavedFlash(false), 1600);
      setDraft(null);
      load();
    } catch (e) {
      setError((e as Error).message);
    }
    setBusy(false);
  };

  const togglePublish = async (r: Row) => {
    if (!isAdmin) return;
    const next = { ...r, published: !r.published };
    setRows((rs) => rs.map((x) => (x.id === r.id ? next : x)));
    try { await save(next); } catch { load(); }
  };

  const shift = async (idx: number, dir: -1 | 1) => {
    const a = rows[idx], b = rows[idx + dir];
    if (!a || !b) return;
    const na = { ...a, order_index: Number(b.order_index ?? idx) };
    const nb = { ...b, order_index: Number(a.order_index ?? idx + dir) };
    setRows((rs) => { const c = [...rs]; c[idx] = na; c[idx + dir] = nb; return c; });
    try { await save(na); await save(nb); } catch { load(); }
  };

  const sorted = useMemo(() => [...rows].sort((x, y) => Number(x.order_index ?? 0) - Number(y.order_index ?? 0)), [rows]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">{config.title}</h1>
          <p className="text-xs text-skyz-text-muted mt-0.5">{config.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <GhostButton onClick={load}><RefreshCw className="w-3.5 h-3.5" /> Refresh</GhostButton>
          <PrimaryButton onClick={openNew}><Plus className="w-4 h-4" /> New</PrimaryButton>
        </div>
      </div>

      {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-sm text-red-500 dark:text-red-400 mb-4">{error}</div>}

      {/* editor overlay-style panel */}
      <AnimatePresence>
        {draft && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
            className="mb-6 rounded-2xl border border-skyz-border bg-skyz-surface p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold">{isNew ? 'New entry' : 'Edit entry'}</h2>
              <div className="flex items-center gap-2">
                {savedFlash && <span className="text-xs text-emerald-500 font-mono">SAVED ✓</span>}
                {!isAdmin && <span className="text-[10px] font-mono text-amber-500">EDITOR: SAVES STAY DRAFTS</span>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {config.fields.map((f) => {
                const v = draft[f.key];
                const set = (val: unknown) => setDraft((d) => ({ ...d!, [f.key]: val }));
                const wide = f.type === 'textarea' || f.type === 'media' || !f.half;
                return (
                  <div key={f.key} className={wide ? 'sm:col-span-2' : ''}>
                    {f.type === 'media' ? (
                      <MediaSlot slotKey={f.slot || f.key} value={(v as string) || null} onChange={set} label={f.label} />
                    ) : (
                      <Field label={f.label}>
                        {f.type === 'textarea' && <TextArea value={String(v ?? '')} onChange={set} />}
                        {f.type === 'text' && <TextInput value={String(v ?? '')} onChange={set} />}
                        {f.type === 'select' && <Select value={String(v ?? '')} onChange={set} options={f.options || []} />}
                        {f.type === 'color' && (
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={String(v ?? '#3B82F6')}
                              onChange={(e) => set(e.target.value)}
                              className="w-10 h-10 rounded-lg border border-skyz-border cursor-pointer bg-transparent"
                            />
                            <TextInput value={String(v ?? '')} onChange={set} />
                          </div>
                        )}
                        {f.type === 'order' && (
                          <TextInput value={String(v ?? 0)} onChange={(s) => set(parseInt(s, 10) || 0)} />
                        )}
                      </Field>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 mt-6">
              <PrimaryButton onClick={commit} disabled={busy}>
                <Save className="w-4 h-4" /> {busy ? 'Saving…' : 'Save'}
              </PrimaryButton>
              <GhostButton onClick={() => setDraft(null)}>Cancel</GhostButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* list */}
      <div className="rounded-2xl border border-skyz-border bg-skyz-surface overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-skyz-text-muted">Loading…</div>
        ) : sorted.length === 0 ? (
          <div className="p-8 text-center text-sm text-skyz-text-muted">Nothing here yet — create the first entry.</div>
        ) : (
          <ul className="divide-y divide-skyz-border-subtle">
            {sorted.map((r, idx) => (
              <li key={r.id} className="px-4 sm:px-5 py-3.5 flex items-center gap-3 hover:bg-skyz-surface-subtle/50 transition-colors">
                <span className="font-mono text-xs text-skyz-text-muted w-7">{String(r.order_index ?? idx + 1).padStart(2, '0')}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-display font-bold text-sm truncate">{String(r[config.titleKey] ?? r.id)}</div>
                  <div className="text-xs text-skyz-text-muted truncate">{String(r[config.subKey] ?? '')}</div>
                </div>
                <PublishToggle published={!!r.published} onChange={() => togglePublish(r)} disabled={!isAdmin} />
                <div className="hidden sm:flex items-center">
                  <button type="button" onClick={() => shift(idx, -1)} disabled={idx === 0} title="Move up"
                    className="p-1.5 text-skyz-text-muted hover:text-skyz-text cursor-pointer disabled:opacity-30">
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => shift(idx, 1)} disabled={idx === sorted.length - 1} title="Move down"
                    className="p-1.5 text-skyz-text-muted hover:text-skyz-text cursor-pointer disabled:opacity-30">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button type="button" onClick={() => openRow(r)} title="Edit"
                  className="p-1.5 text-skyz-text-muted hover:text-skyz-accent cursor-pointer">
                  <Pencil className="w-4 h-4" />
                </button>
                {remove && isAdmin && (
                  <button type="button" onClick={async () => { setRows((rs) => rs.filter((x) => x.id !== r.id)); try { await remove(r.id); } catch { load(); } }} title="Delete"
                    className="p-1.5 text-skyz-text-muted hover:text-red-500 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
