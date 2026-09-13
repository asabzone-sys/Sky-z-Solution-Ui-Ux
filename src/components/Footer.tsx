import React from 'react';
import { useNavigation, PageType } from '../context/NavigationContext';
import { useMotionPreference, MotionPreference } from '../context/MotionPreferenceContext';

export const Footer: React.FC = () => {
  const { navigate } = useNavigation();

  const handleNav = (page: PageType) => {
    navigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-skyz-surface border-t border-skyz-border transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => handleNav('home')} 
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-skyz-surface-subtle border border-skyz-border flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-skyz-accent" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M26 30H74L34 70H74" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-display font-bold text-skyz-text tracking-tight group-hover:text-skyz-accent transition-colors">
              SKY Z Solutions
            </span>
          </button>
          <span className="text-xs text-skyz-text-muted font-normal">
            — © {new Date().getFullYear()} SKY Z Solutions. All rights reserved.
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-skyz-text-muted">
          <button type="button" onClick={() => handleNav('home')} className="hover:text-skyz-text transition-colors cursor-pointer">
            Home
          </button>
          <button type="button" onClick={() => handleNav('about')} className="hover:text-skyz-text transition-colors cursor-pointer">
            About
          </button>
          <button type="button" onClick={() => handleNav('services')} className="hover:text-skyz-text transition-colors cursor-pointer">
            Services
          </button>
          <button type="button" onClick={() => handleNav('work')} className="hover:text-skyz-text transition-colors cursor-pointer">
            Work
          </button>
          <button type="button" onClick={() => handleNav('studio')} className="hover:text-skyz-text transition-colors cursor-pointer">
            Studio
          </button>
          <button type="button" onClick={() => handleNav('contact')} className="hover:text-skyz-text transition-colors cursor-pointer">
            Contact
          </button>
          <span className="text-skyz-border">•</span>
          <span className="text-skyz-accent font-medium">Build • Grow • Automate</span>
          <MotionToggle />
        </div>
      </div>
    </footer>
  );
};

/**
 * Visitor-facing motion preference control. 'Auto' respects the device's
 * Reduce Motion setting — the accessible default. Phones whose system
 * setting (or in-app webview) reports reduce-motion unintentionally can
 * force the full experience here; the choice persists.
 */
const MotionToggle: React.FC = () => {
  const { preference, setPreference } = useMotionPreference();
  const opts: { key: MotionPreference; label: string }[] = [
    { key: 'off', label: 'Off' },
    { key: 'auto', label: 'Auto' },
    { key: 'on', label: 'On' },
  ];
  return (
    <span
      className="inline-flex items-center gap-2"
      title="Motion effects: Auto follows your device's Reduce Motion setting"
    >
      <span className="text-skyz-border">•</span>
      <span className="uppercase tracking-widest">Motion</span>
      <span className="inline-flex rounded-full border border-skyz-border overflow-hidden">
        {opts.map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => setPreference(o.key)}
            aria-pressed={preference === o.key}
            className={`px-2 py-0.5 text-[10px] font-semibold transition-colors cursor-pointer ${
              preference === o.key
                ? 'bg-skyz-accent text-white'
                : 'text-skyz-text-muted hover:text-skyz-text'
            }`}
          >
            {o.label}
          </button>
        ))}
      </span>
    </span>
  );
};
