import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type PageType = 'home' | 'about' | 'services' | 'work' | 'contact' | 'studio';

interface NavigationContextType {
  currentPage: PageType;
  selectedServiceCategory: 'BUILD' | 'GROW' | 'AUTOMATE' | null;
  navigate: (page: PageType, options?: { serviceCategory?: 'BUILD' | 'GROW' | 'AUTOMATE'; hash?: string; scrollToTop?: boolean }) => void;
}

const NavigationContext = createContext<NavigationContextType>({
  currentPage: 'home',
  selectedServiceCategory: null,
  navigate: () => {},
});

function getPageFromLocation(): PageType {
  if (typeof window === 'undefined') return 'home';

  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  // Check path
  if (path.includes('about')) return 'about';
  if (path.includes('services')) return 'services';
  if (path.includes('work') || path.includes('project')) return 'work';
  if (path.includes('contact')) return 'contact';
  if (path.includes('studio')) return 'studio';

  // Check hash
  if (hash.startsWith('#/about') || hash === '#about') return 'about';
  if (hash.startsWith('#/services') || hash === '#services') return 'services';
  if (hash.startsWith('#/work') || hash === '#work' || hash.startsWith('#/projects') || hash === '#projects') return 'work';
  if (hash.startsWith('#/contact') || hash === '#contact') return 'contact';
  if (hash.startsWith('#/studio') || hash === '#studio') return 'studio';

  return 'home';
}

const PAGE_TITLES: Record<PageType, string> = {
  home: 'SkyZ Solutions | Autonomous Digital Systems',
  about: 'About Us | SkyZ Solutions — Purpose, Vision & System Architecture',
  services: 'Services | SkyZ Solutions — BUILD • GROW • AUTOMATE',
  work: 'Projects & Work | SkyZ Solutions — Systems Portfolio',
  contact: 'Contact & Project Scoping | SkyZ Solutions',
  studio: 'Design & Graphics Studio | SkyZ Solutions',
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageType>(getPageFromLocation);
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<'BUILD' | 'GROW' | 'AUTOMATE' | null>(null);

  // Sync document title and history
  useEffect(() => {
    document.title = PAGE_TITLES[currentPage] || 'SkyZ Solutions';
  }, [currentPage]);

  // Listen to popstate / hashchange for browser back/forward
  useEffect(() => {
    const handleLocationChange = () => {
      const detected = getPageFromLocation();
      setCurrentPage(detected);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = useCallback((page: PageType, options?: { serviceCategory?: 'BUILD' | 'GROW' | 'AUTOMATE'; hash?: string; scrollToTop?: boolean }) => {
    setCurrentPage(page);
    if (options?.serviceCategory) {
      setSelectedServiceCategory(options.serviceCategory);
    }

    const targetHash = options?.hash ? `#${options.hash.replace(/^#/, '')}` : (page === 'home' ? '' : `#${page}`);
    try {
      if (page === 'home') {
        window.history.pushState({ page }, '', window.location.pathname);
      } else {
        window.history.pushState({ page }, '', targetHash);
      }
    } catch {
      // Fallback in sandboxed environment
      window.location.hash = targetHash;
    }

    if (options?.scrollToTop !== false) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <NavigationContext.Provider value={{ currentPage, selectedServiceCategory, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
