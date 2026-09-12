import React, { useState } from 'react';
import { ArrowRight, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigation, PageType } from '../context/NavigationContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { currentPage, navigate } = useNavigation();

  const navLinks: { name: string; page: PageType; href: string }[] = [
    { name: 'Home', page: 'home', href: '/' },
    { name: 'About', page: 'about', href: '#about' },
    { name: 'Services', page: 'services', href: '#services' },
    { name: 'Work', page: 'work', href: '#work' },
    { name: 'Studio', page: 'studio', href: '#studio' },
    { name: 'Contact', page: 'contact', href: '#contact' },
  ];

  const handleNavClick = (page: PageType) => {
    navigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-skyz-bg/90 backdrop-blur-xl border-b border-skyz-border shadow-[0_1px_8px_rgba(0,0,0,0.02)] transition-colors duration-200">
      <div className="h-16 md:h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Structure Badge */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button 
            type="button"
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-2.5 group flex-shrink-0 text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center shadow-sm bg-skyz-surface border border-skyz-border">
              <svg className="w-full h-full p-1" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="skyz-brand-grad" x1="10" y1="10" x2="90" y2="90">
                    <stop offset="0%" stopColor="var(--accent)" />
                    <stop offset="100%" stopColor="var(--accent-secondary)" />
                  </linearGradient>
                </defs>
                <path d="M26 30H74L34 70H74" stroke="url(#skyz-brand-grad)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="76" cy="28" r="5" fill="var(--accent)" />
                <circle cx="24" cy="72" r="4.5" fill="var(--accent-secondary)" />
              </svg>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-lg sm:text-xl tracking-tight text-skyz-text font-bold">SKY Z</span>
              <span className="font-display text-lg sm:text-xl tracking-tight text-skyz-accent font-bold">Solutions</span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Pill */}
        <nav className="hidden lg:flex items-center p-1 rounded-full bg-skyz-surface/90 backdrop-blur-md shadow-[0_1px_6px_rgba(0,0,0,0.03)] border border-skyz-border">
          {navLinks.map((link) => {
            const isActive = currentPage === link.page;
            return (
              <button
                key={link.page}
                type="button"
                onClick={() => handleNavClick(link.page)}
                className={`px-4 py-1.5 rounded-full transition-colors font-medium text-sm cursor-pointer ${
                  isActive
                    ? 'bg-skyz-text text-skyz-bg shadow-sm'
                    : 'text-skyz-text-muted hover:text-skyz-text hover:bg-skyz-surface-subtle'
                }`}
              >
                {link.name}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            aria-pressed={theme === 'dark'}
            className="w-9 h-9 rounded-full bg-skyz-surface border border-skyz-border flex items-center justify-center text-skyz-text-muted hover:text-skyz-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-skyz-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#080B10] cursor-pointer"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-skyz-accent" />}
          </button>

          {/* Desktop Only: Start a Project CTA */}
          <button
            type="button"
            onClick={() => handleNavClick('contact')}
            className="hidden lg:inline-flex items-center gap-1.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] text-xs sm:text-sm font-semibold shadow-sm hover:bg-skyz-accent dark:hover:bg-skyz-accent-secondary transition-all duration-200 cursor-pointer"
          >
            <span>Start a Project</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            aria-label="Toggle Navigation Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-full bg-skyz-surface border border-skyz-border flex items-center justify-center text-skyz-text hover:bg-skyz-surface-subtle transition-colors focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-skyz-bg border-b border-skyz-border px-4 py-4 shadow-xl transition-all">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  type="button"
                  onClick={() => handleNavClick(link.page)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-colors text-left cursor-pointer ${
                    isActive
                      ? 'bg-skyz-surface text-skyz-text font-bold border border-skyz-border shadow-xs'
                      : 'text-skyz-text-muted hover:bg-skyz-surface hover:text-skyz-text'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-skyz-accent" />}
                </button>
              );
            })}

            {/* Mobile Start a Project CTA */}
            <div className="pt-3 mt-1 border-t border-skyz-border">
              <button
                type="button"
                onClick={() => handleNavClick('contact')}
                className="w-full py-3 px-4 rounded-xl bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] font-bold text-sm tracking-wide shadow-sm hover:bg-skyz-accent dark:hover:bg-skyz-accent-secondary flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>START A PROJECT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
