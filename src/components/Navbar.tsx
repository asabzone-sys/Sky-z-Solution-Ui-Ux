import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigation, PageType } from '../context/NavigationContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { currentPage, navigate } = useNavigation();

  // Header elevation: hairline + soft shadow once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    <header
      className={`fixed top-0 inset-x-0 z-50 bg-skyz-bg/90 backdrop-blur-xl border-b transition-colors duration-200 ${
        scrolled ? 'border-skyz-border skz-nav-scrolled' : 'border-transparent'
      }`}
    >
      <div className="h-16 md:h-[4.5rem] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand: the original complete logo. Light theme uses the dark-plate
            version (white ink needs the native black background for contrast);
            dark theme uses the transparent full-color version. Same artwork,
            original aspect ratio, no redesign. */}
        <div className="flex items-center min-w-0">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="group flex-shrink-0 cursor-pointer"
            aria-label="SKY Z Solutions — home"
          >
            <img
              src="/brand/lockup-plate.webp"
              alt="SKY Z Solutions"
              width={1200}
              height={358}
              className="dark:hidden h-9 sm:h-10 w-auto object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
              draggable={false}
            />
            <img
              src="/brand/lockup-transparent.webp"
              alt="SKY Z Solutions"
              width={1568}
              height={478}
              className="hidden dark:block h-9 sm:h-10 w-auto object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
              draggable={false}
            />
          </button>
        </div>

        {/* Desktop Navigation Pill */}
        <nav
          aria-label="Primary"
          className="hidden lg:flex items-center p-1 rounded-full bg-skyz-surface/90 backdrop-blur-md shadow-[0_1px_6px_rgba(0,0,0,0.03)] border border-skyz-border"
        >
          {navLinks.map((link) => {
            const isActive = currentPage === link.page;
            return (
              <button
                key={link.page}
                type="button"
                onClick={() => handleNavClick(link.page)}
                aria-current={isActive ? 'page' : undefined}
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
            className="w-9 h-9 rounded-full bg-skyz-surface border border-skyz-border flex items-center justify-center text-skyz-text-muted hover:text-skyz-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-skyz-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0B0813] cursor-pointer"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-skyz-accent" />}
          </button>

          {/* Desktop Only: Start a Project CTA */}
          <button
            type="button"
            onClick={() => handleNavClick('contact')}
            className="hidden lg:inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full skz-cta text-xs sm:text-sm font-semibold hover:-translate-y-px active:translate-y-0 cursor-pointer"
          >
            <span>Start a Project</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
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
                className="w-full py-3 px-4 rounded-xl skz-cta font-bold text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all"
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
