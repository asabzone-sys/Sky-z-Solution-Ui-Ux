import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Inbox, FolderKanban, Sparkles, Quote, Type, Users, LogOut, Menu, X, Sun, Moon, ExternalLink,
} from 'lucide-react';
import { useAdmin } from './AdminContext';
import { useTheme } from '../context/ThemeContext';

export type AdminSection = 'leads' | 'work' | 'studio' | 'testimonials' | 'content' | 'team';

export const ADMIN_NAV: Array<{ id: AdminSection; label: string; icon: React.ReactNode; adminOnly?: boolean }> = [
  { id: 'leads', label: 'Leads Inbox', icon: <Inbox className="w-4.5 h-4.5" /> },
  { id: 'work', label: 'Work Projects', icon: <FolderKanban className="w-4.5 h-4.5" /> },
  { id: 'studio', label: 'Studio Works', icon: <Sparkles className="w-4.5 h-4.5" /> },
  { id: 'testimonials', label: 'Testimonials', icon: <Quote className="w-4.5 h-4.5" /> },
  { id: 'content', label: 'Page Text & Settings', icon: <Type className="w-4.5 h-4.5" /> },
  { id: 'team', label: 'Team', icon: <Users className="w-4.5 h-4.5" />, adminOnly: true },
];

export const AdminShell: React.FC<{
  section: AdminSection;
  onSection: (s: AdminSection) => void;
  children: React.ReactNode;
  unreadCount?: number;
}> = ({ section, onSection, children, unreadCount = 0 }) => {
  const { user, signOut } = useAdmin();
  const { theme, toggleTheme } = useTheme();
  const [drawer, setDrawer] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-1">
      {ADMIN_NAV.filter((n) => !n.adminOnly || user?.role === 'admin').map((n) => {
        const active = section === n.id;
        return (
          <button
            key={n.id}
            type="button"
            onClick={() => { onSection(n.id); setDrawer(false); }}
            className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer text-left ${
              active
                ? 'bg-skyz-text text-skyz-bg dark:bg-skyz-accent dark:text-[#080B10] font-semibold'
                : 'text-skyz-text-muted hover:text-skyz-text hover:bg-skyz-surface-subtle'
            }`}
          >
            <span className="flex items-center gap-3">
              {n.icon}
              {n.label}
            </span>
            {n.id === 'leads' && unreadCount > 0 && (
              <span className={`min-w-5 h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                active ? 'bg-skyz-bg/20 text-skyz-bg dark:bg-[#080B10]/20 dark:text-[#080B10]' : 'bg-skyz-accent text-white'
              }`}>
                {unreadCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-skyz-bg text-skyz-text transition-colors duration-200">
      {/* top bar */}
      <header className="sticky top-0 z-40 h-16 bg-skyz-bg/90 backdrop-blur-xl border-b border-skyz-border flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Toggle admin menu"
            onClick={() => setDrawer(!drawer)}
            className="lg:hidden w-9 h-9 rounded-full bg-skyz-surface border border-skyz-border flex items-center justify-center text-skyz-text cursor-pointer"
          >
            {drawer ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-bold tracking-tight">SKY Z</span>
            <span className="font-display font-bold tracking-tight text-skyz-accent">Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-xs font-mono text-skyz-text-muted mr-1">
            {user?.email} · {user?.role?.toUpperCase()}
          </span>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-full bg-skyz-surface border border-skyz-border flex items-center justify-center text-skyz-text-muted hover:text-skyz-text transition-colors"
            title="View site"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-full bg-skyz-surface border border-skyz-border flex items-center justify-center text-skyz-text-muted hover:text-skyz-text transition-colors cursor-pointer"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-skyz-accent" />}
          </button>
          <button
            type="button"
            onClick={signOut}
            className="h-9 px-4 rounded-full bg-skyz-surface border border-skyz-border flex items-center gap-2 text-xs font-semibold text-skyz-text-muted hover:text-skyz-text transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      <div className="flex">
        {/* desktop sidebar */}
        <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 border-r border-skyz-border p-4 gap-4 min-h-[calc(100vh-4rem)]">
          {nav}
          <div className="mt-auto p-3 rounded-xl bg-skyz-surface-subtle border border-skyz-border text-[10px] font-mono text-skyz-text-muted leading-relaxed">
            FIRST SIGN-UP = ADMIN.<br />TEAM INVITES via Supabase<br />Authentication → Users.
          </div>
        </aside>

        {/* mobile drawer */}
        <AnimatePresence>
          {drawer && (
            <motion.aside
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed top-16 bottom-0 left-0 z-30 w-64 bg-skyz-bg border-r border-skyz-border p-4 overflow-y-auto"
            >
              {nav}
            </motion.aside>
          )}
        </AnimatePresence>

        {/* content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};
