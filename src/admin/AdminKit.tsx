import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Upload, X, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { SLOTS, RatioSpec, UploadResult, uploadMedia } from '../lib/adminApi';
import { mediaUrl } from '../lib/supabase';

/* ------------------------------------------------------------------ */
/* Fields                                                              */
/* ------------------------------------------------------------------ */
export const Field: React.FC<{
  label: string;
  children: React.ReactNode;
  hint?: string;
}> = ({ label, children, hint }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wider text-skyz-text-muted mb-1.5">{label}</label>
    {children}
    {hint && <p className="mt-1 text-[11px] text-skyz-text-muted">{hint}</p>}
  </div>
);

export const TextInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}> = ({ value, onChange, placeholder, type = 'text' }) => (
  <input
    type={type}
    value={value}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-3.5 py-2.5 rounded-xl border border-skyz-border bg-skyz-surface-subtle text-skyz-text text-sm focus:outline-none focus:border-skyz-accent transition-colors"
  />
);

export const TextArea: React.FC<{
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}> = ({ value, onChange, rows = 3, placeholder }) => (
  <textarea
    rows={rows}
    value={value}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-3.5 py-2.5 rounded-xl border border-skyz-border bg-skyz-surface-subtle text-skyz-text text-sm focus:outline-none focus:border-skyz-accent transition-colors resize-y"
  />
);

export const Select: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: string[];
}> = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-3.5 py-2.5 rounded-xl border border-skyz-border bg-skyz-surface-subtle text-skyz-text text-sm focus:outline-none focus:border-skyz-accent transition-colors"
  >
    {options.map((o) => <option key={o} value={o}>{o}</option>)}
  </select>
);

/* ------------------------------------------------------------------ */
/* Publish toggle (editor: only unpublished rows are editable)         */
/* ------------------------------------------------------------------ */
export const PublishToggle: React.FC<{
  published: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}> = ({ published, onChange, disabled }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={() => onChange(!published)}
    title={disabled ? 'Only admins can publish' : undefined}
    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono font-bold border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
      published
        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
    }`}
  >
    <span className={`w-1.5 h-1.5 rounded-full ${published ? 'bg-emerald-500' : 'bg-amber-500'}`} />
    {published ? 'PUBLISHED' : 'DRAFT'}
  </button>
);

export const StatusPill: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    new: 'bg-skyz-accent/10 text-skyz-accent border-skyz-accent/30',
    read: 'bg-skyz-surface-subtle text-skyz-text-muted border-skyz-border',
    replied: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    archived: 'bg-skyz-surface-subtle text-skyz-text-muted/60 border-skyz-border',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${styles[status] || styles.read}`}>
      {status.toUpperCase()}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* Media uploader — shows the slot's ratio, previews, warns on mismatch */
/* ------------------------------------------------------------------ */
export const MediaSlot: React.FC<{
  slotKey: keyof typeof SLOTS | string;
  value?: string | null;              // storage path
  onChange: (path: string | null) => void;
  label?: string;
}> = ({ slotKey, value, onChange, label }) => {
  const spec: RatioSpec & { hint?: string } = SLOTS[slotKey as string] || { ratio: 1, label: '—', recommend: '', hint: '' };
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [warn, setWarn] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);
  const preview = mediaUrl(value);

  const pick = async (file: File) => {
    setBusy(true); setWarn(null); setResult(null);
    try {
      const folder = slotKey.split('.')[0] as 'work' | 'studio' | 'testimonials' | 'site';
      const up = await uploadMedia(file, folder, spec);
      setResult(up);
      if (!up.ratioOk) {
        setWarn(`Image is not ${spec.label} — it will still upload, but may crop oddly. Recommended: ${spec.recommend}.`);
      }
      onChange(up.path);
    } catch (e) {
      setWarn((e as Error).message || 'Upload failed');
    }
    setBusy(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-skyz-text-muted">{label || spec.hint || 'Media'}</label>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-skyz-accent-muted text-skyz-accent text-[10px] font-mono font-bold border border-skyz-accent/25">
          {spec.label} · {spec.recommend}
        </span>
      </div>

      <div
        className="relative rounded-xl border border-dashed border-skyz-border bg-skyz-surface-subtle overflow-hidden transition-colors hover:border-skyz-accent/50 cursor-pointer group"
        style={{ aspectRatio: String(spec.ratio), maxHeight: 220 }}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <>
            <img src={preview} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <span className="text-white text-xs font-semibold">Replace</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(null); }}
                className="w-7 h-7 rounded-full bg-white/90 text-black flex items-center justify-center cursor-pointer"
                title="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-skyz-text-muted">
            {busy ? (
              <div className="w-6 h-6 border-2 border-skyz-accent border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ImageIcon className="w-6 h-6" />
                <span className="text-xs font-medium">Click to upload · {spec.label}</span>
              </>
            )}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) pick(f); e.target.value = ''; }}
        />
      </div>

      {result?.ratioOk && (
        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-emerald-500">
          <Check className="w-3 h-3" /> {result.width}×{result.height} — matches {spec.label}
        </p>
      )}
      {warn && (
        <p className="mt-1.5 flex items-start gap-1 text-[11px] text-amber-500">
          <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" /> {warn}
        </p>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */
export const PrimaryButton: React.FC<{
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit';
}> = ({ onClick, children, disabled, type = 'button' }) => (
  <motion.button
    whileTap={{ scale: 0.97 }}
    type={type}
    onClick={onClick}
    disabled={disabled}
    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] font-semibold text-sm shadow-md hover:bg-skyz-accent dark:hover:bg-skyz-accent-secondary transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait"
  >
    {children}
  </motion.button>
);

export const GhostButton: React.FC<{
  onClick?: () => void;
  children: React.ReactNode;
}> = ({ onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-skyz-border text-xs font-semibold text-skyz-text hover:border-skyz-accent/50 transition-all cursor-pointer"
  >
    {children}
  </button>
);
