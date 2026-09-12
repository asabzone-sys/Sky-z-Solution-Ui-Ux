/**
 * Client testimonials — shown one at a time in the homepage carousel.
 * Minimal by design: quote, person, role, and the service pillar that
 * connects the story back to the SkyZ system.
 */
export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  initials: string;
  accent: string;
  service: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'sana-mir',
    quote: 'They treated our store like a product, not a project. Every decision had a reason behind it — and the results followed.',
    name: 'Sana Mir',
    role: 'Founder, Apex Living',
    initials: 'SM',
    accent: '#3B82F6',
    service: 'E-COMMERCE',
  },
  {
    id: 'daniel-cole',
    quote: 'Clear scoping, honest timelines, zero drama. The site shipped faster than agencies that quoted us double.',
    name: 'Daniel Cole',
    role: 'Director, Horizon Studio',
    initials: 'DC',
    accent: '#0EA5E9',
    service: 'WEB DEVELOPMENT',
  },
  {
    id: 'amira-hassan',
    quote: 'Our organic traffic finally compounds instead of resetting. It feels like infrastructure, not marketing.',
    name: 'Amira Hassan',
    role: 'Managing Partner, Meridian Advisory',
    initials: 'AH',
    accent: '#10B981',
    service: 'SEO',
  },
  {
    id: 'yusuf-rahman',
    quote: 'The brand system they built makes every asset we produce look intentional. Our team designs faster because of it.',
    name: 'Yusuf Rahman',
    role: 'CMO, Lumina Wellness',
    initials: 'YR',
    accent: '#8B5CF6',
    service: 'DIGITAL MARKETING',
  },
  {
    id: 'lena-fischer',
    quote: 'The automation quietly does the work of two coordinators. Nobody touches a spreadsheet anymore.',
    name: 'Lena Fischer',
    role: 'Ops Lead, FlowOps Logistics',
    initials: 'LF',
    accent: '#F59E0B',
    service: 'AI AUTOMATION',
  },
];
