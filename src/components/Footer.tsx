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
            className="flex items-center text-left cursor-pointer group"
            aria-label="SKY Z Solutions — home"
          >
            {/* Light theme: the complete dark-plate logo — the white SOLUTIONS
                ink needs its native black plate to stay readable. Dark theme:
                the transparent full-color version of the same artwork. */}
            <img
              src="/brand/lockup-light.webp"
              alt="SKY Z Solutions"
              width={1573}
              height={480}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="dark:hidden h-8 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <img
              src="/brand/lockup-transparent.webp"
              alt="SKY Z Solutions"
              width={1568}
              height={478}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="hidden dark:block h-8 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
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
          <button type="button" onClick={() => handleNav('pricing')} className="hover:text-skyz-text transition-colors cursor-pointer">
            Pricing
          </button>
          <button type="button" onClick={() => handleNav('contact')} className="hover:text-skyz-text transition-colors cursor-pointer">
            Contact
          </button>          <span className="text-skyz-border">•</span>
          <span className="text-skyz-accent font-medium">Build • Grow • Automate</span>
        </div>
      </div>
    </footer>
  );
};
