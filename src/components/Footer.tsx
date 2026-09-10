import React from 'react';
import { useNavigation, PageType } from '../context/NavigationContext';

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
          <button type="button" onClick={() => handleNav('contact')} className="hover:text-skyz-text transition-colors cursor-pointer">
            Contact
          </button>
          <span className="text-skyz-border">•</span>
          <span className="text-skyz-accent font-medium">Build • Grow • Automate</span>
        </div>
      </div>
    </footer>
  );
};
