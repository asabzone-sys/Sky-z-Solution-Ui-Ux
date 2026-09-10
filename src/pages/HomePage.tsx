import React from 'react';
import { Hero } from '../components/Hero';
import { WorkCarousel } from '../components/WorkCarousel';
import { Capabilities } from '../components/Capabilities';
import { Methodology } from '../components/Methodology';
import { Creed } from '../components/Creed';
import { ContactCTA } from '../components/ContactCTA';

export const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <WorkCarousel />
      <Capabilities />
      <Methodology />
      <Creed />
      <ContactCTA />
    </>
  );
};
