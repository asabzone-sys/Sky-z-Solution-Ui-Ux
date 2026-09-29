import React from 'react';
import { useNavigation, PageType } from '../context/NavigationContext';

export const Footer: React.FC = () => {
  const { navigate } = useNavigation();

  const handleNav = (page: PageType) => {
    navigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const links: { name: string; page: PageType }[] = [
    { name: 'Home', page: 'home' },
    { name: 'About', page: 'about' },
    { name: 'Services', page: 'services' },
    { name: 'Work', page: 'work' },
    { name: 'Studio', page: 'studio' },
    { name: 'Contact', page: 'contact' },
  ];

  return (
    <footer className="w-full bg-skyz-surface border-t border-skyz-border transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
          {/* Brand block — real lockup, transparent artwork sits naturally on both themes */}
          <div className="max-w-sm space-y-5">
            <button
              type="button"
              onClick={() => handleNav('home')}
              className="block cursor-pointer group"
              aria-label="SkyZ Solutions — home"
            >
              <img
                src="/brand/lockup-transparent.webp"
                alt="SkyZ Solutions"
                width={1600}
                height={1065}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="h-20 sm:h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </button>
            <p className="text-sm text-skyz-text-muted leading-relaxed">
              A connected studio for web systems, growth engines and autonomous AI
              automation — designed, built and shipped as one.
            </p>
          </div>

          {/* Explore */}
          <nav aria-label="Footer" className="flex flex-col gap-4">
            <span className="text-[11px] font-mono uppercase tracking-widest text-skyz-text-muted font-semibold">
              Explore
            </span>
            <div className="flex flex-wrap gap-x-8 gap-y-2.5 max-w-xs">
              {links.map((link) => (
                <button
                  key={link.page}
                  type="button"
                  onClick={() => handleNav(link.page)}
                  className="text-sm text-skyz-text-muted hover:text-skyz-accent transition-colors cursor-pointer text-left"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </nav>
        </div>

        <div className="mt-12 pt-6 border-t border-skyz-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-skyz-text-muted">
            © {new Date().getFullYear()} SKY Z Solutions. All rights reserved.
          </p>
          <p className="text-[11px] font-mono tracking-widest text-skyz-accent font-medium">
            BUILD • GROW • AUTOMATE
          </p>
        </div>
      </div>
    </footer>
  );
};
