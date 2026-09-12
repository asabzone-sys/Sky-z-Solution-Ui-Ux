import React from 'react';
import { Hero } from '../components/Hero';
import { WorkCarousel } from '../components/WorkCarousel';
import { Capabilities } from '../components/Capabilities';
import { Creed } from '../components/Creed';
import { Testimonials } from '../components/Testimonials';
import { ContactCTA } from '../components/ContactCTA';

export const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <WorkCarousel />
      <Capabilities />
      <Creed />
      <Testimonials />
      <ContactCTA />
    </>
  );
};
