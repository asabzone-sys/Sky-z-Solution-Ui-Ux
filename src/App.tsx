/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useEffect, useState, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { MotionPreferenceProvider, useMotionPreference } from './context/MotionPreferenceContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { LiquidPortalLoader } from './components/LiquidPortalLoader';

// Admin dashboard is code-split: public visitors never download the admin
// bundle (Supabase CRUD UI, upload widgets, etc.) — it loads only on /admin.
const AdminApp = lazy(() => import('./admin/AdminApp').then((m) => ({ default: m.AdminApp })));
const AdminProvider = lazy(() => import('./admin/AdminContext').then((m) => ({ default: m.AdminProvider })));
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';

// Non-home pages are code-split: the home page (the LCP path) loads eagerly,
// every other page downloads only when the visitor navigates to it.
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ServicesPage = lazy(() => import('./pages/ServicesPage').then((m) => ({ default: m.ServicesPage })));
const WorkPage = lazy(() => import('./pages/WorkPage').then((m) => ({ default: m.WorkPage })));
const StudioPage = lazy(() => import('./pages/StudioPage').then((m) => ({ default: m.StudioPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));

const AppContent: React.FC = () => {
  const { currentPage } = useNavigation();

  // Scroll to top on page transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-skyz-bg text-skyz-text flex flex-col selection:bg-skyz-accent/25 selection:text-skyz-text relative transition-colors duration-200">
      {/* Subtle Ambient Background Nodes */}
      <div className="fixed top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-skyz-accent/5 blur-[130px] pointer-events-none -z-10 animate-float-slow" />
      <div className="fixed top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-skyz-accent-secondary/5 blur-[150px] pointer-events-none -z-10 animate-float-rev" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[550px] h-[550px] rounded-full bg-skyz-accent/5 blur-[140px] pointer-events-none -z-10 animate-pulse-glow" />

      {/* Main Structural Layout */}
      <Navbar />
      
      <main className="flex-1 w-full pt-16 md:pt-20">
        {/* CSS keyframe entrance per page — keeps motion/react out of the
            eager bundle; the visual is identical to the old AnimatePresence. */}
        <div key={currentPage} className="w-full skz-page-in">
          <Suspense fallback={<div className="min-h-[60vh]" />}>
            {currentPage === 'home' && <HomePage />}
            {currentPage === 'about' && <AboutPage />}
            {currentPage === 'services' && <ServicesPage />}
            {currentPage === 'work' && <WorkPage />}
            {currentPage === 'studio' && <StudioPage />}
            {currentPage === 'contact' && <ContactPage />}
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
};

/**
 * Bridges the visitor's motion preference into Motion's global config.
 * reducedMotion 'never' forces animations even under OS Reduce Motion;
 * 'always' forces the reduced variants — the escape hatch for phones whose
 * system setting or in-app webview reports reduce-motion unintentionally.
 *
 * MotionConfig lives inside the lazy shell so motion/react itself is only
 * downloaded when a page that actually uses Motion is displayed.
 */
const MotionGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { motionEnabled } = useMotionPreference();
  return <MotionConfigProvider enabled={motionEnabled}>{children}</MotionConfigProvider>;
};

const MotionConfigProvider = lazy(() =>
  import('motion/react').then(({ MotionConfig }) => {
    const C: React.FC<{ enabled: boolean; children: React.ReactNode }> = ({ enabled, children }) => (
      <MotionConfig reducedMotion={enabled ? 'never' : 'always'}>{children}</MotionConfig>
    );
    return { default: C };
  }),
);

export default function App() {
  // The admin dashboard renders standalone: no site chrome, no cinematic loader.
  const isAdminRoute =
    typeof window !== 'undefined' && window.location.pathname.replace(/\/+$/, '') === '/admin';

  // One-time cinematic entry — session-scoped so normal navigation within the
  // session never replays it, but a fresh visit/refresh does.
  const [loaderDone, setLoaderDone] = useState(
    () => sessionStorage.getItem('skyz_portal_seen') === '1'
  );
  const handleLoaderDone = useCallback(() => {
    try { sessionStorage.setItem('skyz_portal_seen', '1'); } catch { /* private mode */ }
    setLoaderDone(true);
  }, []);

  if (isAdminRoute) {
    return (
      <ThemeProvider>
        <Suspense fallback={<div className="min-h-screen bg-skyz-bg" />}>
          <AdminProvider>
            <AdminApp />
          </AdminProvider>
        </Suspense>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <MotionPreferenceProvider>
        <MotionGate>
          <NavigationProvider>
            {!loaderDone && <LiquidPortalLoader onDone={handleLoaderDone} />}
            <AppContent />
          </NavigationProvider>
        </MotionGate>
      </MotionPreferenceProvider>
    </ThemeProvider>
  );
}
