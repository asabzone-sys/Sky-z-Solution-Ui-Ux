import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAdmin } from './AdminContext';

export const AdminLogin: React.FC = () => {
  const { signIn, error, clearError } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try { await signIn(email, password); } catch { /* shown via context error */ }
    setBusy(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-skyz-bg px-4 transition-colors duration-200">
      <div className="absolute inset-0 bg-dots-pattern opacity-30 pointer-events-none" aria-hidden />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm bg-skyz-surface border border-skyz-border rounded-[1.75rem] p-8 shadow-xl"
      >
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-lg bg-skyz-surface border border-skyz-border flex items-center justify-center">
            <svg className="w-5 h-5" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="adm-grad" x1="10" y1="10" x2="90" y2="90">
                  <stop offset="0%" stopColor="var(--accent)" />
                  <stop offset="100%" stopColor="var(--accent-secondary)" />
                </linearGradient>
              </defs>
              <path d="M26 30H74L34 70H74" stroke="url(#adm-grad)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="font-display font-bold text-skyz-text tracking-tight leading-none">SkyZ Admin</div>
            <div className="text-[10px] font-mono text-skyz-text-muted mt-0.5">CONTENT CONTROL</div>
          </div>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-red-500 dark:text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-xs font-semibold uppercase tracking-wider text-skyz-text-muted mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-skyz-text-muted pointer-events-none" />
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError(); }}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-skyz-border bg-skyz-surface-subtle text-skyz-text text-sm focus:outline-none focus:border-skyz-accent transition-colors"
                placeholder="you@skyz.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="admin-pass" className="block text-xs font-semibold uppercase tracking-wider text-skyz-text-muted mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-skyz-text-muted pointer-events-none" />
              <input
                id="admin-pass"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError(); }}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-skyz-border bg-skyz-surface-subtle text-skyz-text text-sm focus:outline-none focus:border-skyz-accent transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] font-semibold text-sm shadow-md hover:bg-skyz-accent dark:hover:bg-skyz-accent-secondary transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
          >
            {busy ? 'Signing in…' : 'Sign in'}
            {!busy && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="mt-6 text-[11px] font-mono text-skyz-text-muted text-center leading-relaxed">
          Accounts are created via team invite.<br />Access is enforced by Row Level Security.
        </p>
      </motion.div>
    </div>
  );
};
