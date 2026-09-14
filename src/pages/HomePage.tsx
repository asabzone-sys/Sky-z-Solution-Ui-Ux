import React, { Suspense, lazy } from 'react';
import { Hero } from '../components/Hero';

// Below-the-fold sections are code-split. Hero (the first viewport, and the
// LCP element) loads eagerly; everything else hydrates as the visitor
// scrolls — the smallest possible eager bundle for the fastest LCP/TBT.
const WorkCarousel = lazy(() => import('../components/WorkCarousel').then((m) => ({ default: m.WorkCarousel })));
const Capabilities = lazy(() => import('../components/Capabilities').then((m) => ({ default: m.Capabilities })));
const Testimonials = lazy(() => import('../components/Testimonials').then((m) => ({ default: m.Testimonials })));
const ContactCTA = lazy(() => import('../components/ContactCTA').then((m) => ({ default: m.ContactCTA })));
const BookingStrip = lazy(() => import('../components/BookingStrip').then((m) => ({ default: m.BookingStrip })));

export const HomePage: React.FC = () => (
  <>
    <Hero />
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <WorkCarousel />
      <Capabilities />
      <Testimonials />
      <BookingStrip />
      <ContactCTA />
    </Suspense>
  </>
);
