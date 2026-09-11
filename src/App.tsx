/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeProvider } from './context/ThemeContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { LiquidPortalLoader } from './components/LiquidPortalLoader';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { WorkPage } from './pages/WorkPage';
import { ContactPage } from './pages/ContactPage';

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
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="w-full"
          >
            {currentPage === 'home' && <HomePage />}
            {currentPage === 'about' && <AboutPage />}
            {currentPage === 'services' && <ServicesPage />}
            {currentPage === 'work' && <WorkPage />}
            {currentPage === 'contact' && <ContactPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  // One-time cinematic entry — session-scoped so normal navigation within the
  // session never replays it, but a fresh visit/refresh does.
  const [loaderDone, setLoaderDone] = useState(
    () => sessionStorage.getItem('skyz_portal_seen') === '1'
  );
  const handleLoaderDone = useCallback(() => {
    try { sessionStorage.setItem('skyz_portal_seen', '1'); } catch { /* private mode */ }
    setLoaderDone(true);
  }, []);

  return (
    <ThemeProvider>
      <NavigationProvider>
        {!loaderDone && <LiquidPortalLoader onDone={handleLoaderDone} />}
        <AppContent />
      </NavigationProvider>
    </ThemeProvider>
  );
}
