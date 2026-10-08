import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Check,
  ArrowRight,
  Zap,
  ShieldCheck,
  Clock,
  Headset,
  ChevronDown,
  Rocket,
  TrendingUp,
  Crown,
} from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { Reveal, SectionShell, Blob, Eyebrow } from '../components/OpalKit';

/* ------------------------------------------------------------------ */
/* Package data                                                        */
/* ------------------------------------------------------------------ */

type Tier = {
  id: 'basic' | 'standard' | 'premium';
  name: string;
  tagline: string;
  icon: React.ReactNode;
  price: string;
  period: string;
  blurb: string;
  features: string[];
  cta: string;
  popular?: boolean;
};

const TIERS: Tier[] = [
  {
    id: 'basic',
    name: 'Basic',
    tagline: 'Launch',
    icon: <Rocket className="w-5 h-5" />,
    price: '$499',
    period: 'one-time',
    blurb: 'For new businesses that need a clean, fast presence online.',
    features: [
      'Up to 5 page modern website',
      'Mobile-first responsive design',
      'Basic on-page SEO setup',
      'Contact form & WhatsApp integration',
      '1 revision round',
      'Delivery in 1 week',
    ],
    cta: 'Start with Basic',
  },
  {
    id: 'standard',
    name: 'Standard',
    tagline: 'Grow',
    icon: <TrendingUp className="w-5 h-5" />,
    price: '$999',
    period: 'one-time',
    blurb: 'For growing brands that want to rank, convert and sell.',
    features: [
      'Everything in Basic',
      'Up to 10 pages or e-commerce store',
      'Advanced SEO & analytics setup',
      'Brand polish & custom graphics',
      'Blog / CMS integration',
      '3 revision rounds',
      'Delivery in 2–3 weeks',
    ],
    cta: 'Choose Standard',
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'Scale',
    icon: <Crown className="w-5 h-5" />,
    price: '$1,999',
    period: 'one-time',
    blurb: 'The full system — build, grow and automate in one package.',
    features: [
      'Everything in Standard',
      'AI automation & workflow integrations',
      'Digital marketing launch kit',
      'Performance & conversion optimization',
      'Priority support channel',
      'Unlimited revisions (within scope)',
      '30 days post-launch support',
    ],
    cta: 'Go Premium',
  },
];

const ASSURANCES = [
  { icon: <ShieldCheck className="w-4 h-4 text-skyz-accent" />, label: 'Fixed scope, no hidden costs' },
  { icon: <Clock className="w-4 h-4 text-skyz-accent" />, label: 'Milestone-based payments' },
  { icon: <Headset className="w-4 h-4 text-skyz-accent" />, label: 'Direct access to the build team' },
];

const FAQS = [
  {
    q: 'Can I upgrade my package later?',
    a: 'Yes — you only pay the difference. Every Basic or Standard project is built so it can grow into the next tier without starting over.',
  },
  {
    q: 'Do you offer monthly plans?',
    a: 'For ongoing marketing, SEO and AI automation we offer monthly retainers. Tell us what you need on the Contact page and we will scope a plan.',
  },
  {
    q: 'What about hosting and domain?',
    a: 'We set everything up on your own accounts, so you always own your domain, hosting and data. Setup is included in every package.',
  },
  {
    q: 'How do payments work?',
    a: '50% to start, the rest on delivery. Larger Premium builds are split into milestones so you only pay for approved progress.',
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export const PricingPage: React.FC = () => {
  const { navigate } = useNavigation();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="w-full transition-colors duration-200">
      {/* ================================================================ */}
      {/* 1. HERO                                                          */}
      {/* ================================================================ */}
      <section className="w-full pt-14 pb-14 sm:pt-24 sm:pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <Blob className="w-[420px] h-[380px] -top-24 -left-32 opacity-80" color="rgba(124, 77, 224, 0.10)" duration={11} />
        <Blob className="w-[360px] h-[320px] top-10 right-[-120px] opacity-70" color="rgba(159, 122, 234, 0.10)" duration={13} />

        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10 sm:mb-14">
              <Eyebrow>
                <span className="w-2 h-2 rounded-full bg-skyz-accent animate-pulse" />
                Packages &amp; Pricing // SKY Z Solutions
              </Eyebrow>
              <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-skyz-text-muted">
                <span className="px-2.5 py-1 rounded-full bg-skyz-surface border border-skyz-border">BASIC</span>
                <span className="text-skyz-border">→</span>
                <span className="px-2.5 py-1 rounded-full bg-skyz-surface border border-skyz-border">STANDARD</span>
                <span className="text-skyz-border">→</span>
                <span className="px-2.5 py-1 rounded-full bg-skyz-accent-muted border border-skyz-accent/30 text-skyz-accent font-bold">PREMIUM</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="font-display font-black text-[13vw] sm:text-6xl md:text-8xl lg:text-[4.75rem] tracking-tight leading-[0.95] select-none text-skyz-text">
              SIMPLE PRICES,
              <br />
              <span className="inline-flex flex-wrap items-center gap-x-4 sm:gap-x-6">
                <span>SERIOUS</span>
                <motion.span
                  whileHover={{ scale: 1.06, rotate: -2 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 14 }}
                  className="inline-flex items-center px-4 py-1.5 sm:px-6 sm:py-2 rounded-2xl sm:rounded-3xl border-2 border-dashed border-skyz-accent/60 bg-skyz-accent-muted text-skyz-accent cursor-default"
                >
                  RESULTS.
                </motion.span>
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="mt-6 max-w-2xl text-base sm:text-lg text-skyz-text-muted leading-relaxed">
              Pick the package that matches where your business is today — every one
              is a complete system, built by the same team, with the same attention
              to detail. No lock-ins, you own everything.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 2. PACKAGE CARDS                                                 */}
      {/* ================================================================ */}
      <SectionShell className="!py-2 sm:!py-3">
        <div className="bg-skyz-surface/40 rounded-[inherit]">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16 relative z-10">
            <div className="grid gap-6 lg:gap-8 md:grid-cols-3 items-stretch max-w-6xl mx-auto">

              {TIERS.map((tier, i) => (
                <Reveal key={tier.id} delay={0.06 * i} className="h-full">
                  <div
                    className={`relative h-full flex flex-col rounded-[1.75rem] p-6 sm:p-8 transition-all duration-300 ${
                      tier.popular
                        ? 'bg-skyz-bg border-2 border-skyz-accent shadow-[0_12px_50px_-12px_var(--glow)] lg:-translate-y-3'
                        : 'bg-skyz-surface border border-skyz-border hover:border-skyz-accent/40 hover:shadow-lg'
                    }`}
                  >
                    {/* Popular badge */}
                    {tier.popular && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full skz-cta text-[11px] font-bold tracking-widest uppercase whitespace-nowrap shadow-md">
                          <Zap className="w-3 h-3" /> Most Popular
                        </span>
                      </div>
                    )}

                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          tier.popular
                            ? 'bg-skyz-accent text-white shadow-md'
                            : 'bg-skyz-accent-muted text-skyz-accent'
                        }`}
                      >
                        {tier.icon}
                      </span>
                      <div>
                        <h2 className="font-display font-bold text-xl text-skyz-text leading-tight">{tier.name}</h2>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-skyz-accent font-bold">{tier.tagline}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mt-6 flex items-baseline gap-2">
                      <span className="font-display font-black text-4xl sm:text-5xl tracking-tight text-skyz-text">{tier.price}</span>
                      <span className="text-xs text-skyz-text-muted font-medium">{tier.period}</span>
                    </div>
                    <p className="mt-2 text-sm text-skyz-text-muted leading-relaxed">{tier.blurb}</p>

                    {/* Features */}
                    <ul className="mt-6 space-y-3 flex-1">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-skyz-text">
                          <span
                            className={`mt-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center flex-shrink-0 ${
                              tier.popular ? 'bg-skyz-accent/15 text-skyz-accent' : 'bg-skyz-accent-muted text-skyz-accent'
                            }`}
                          >
                            <Check className="w-3 h-3" strokeWidth={3} />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <button
                      type="button"
                      onClick={() => navigate('contact', { hash: 'contact' })}
                      className={`group mt-8 w-full inline-flex items-center justify-center gap-2 py-3 rounded-full text-sm font-bold transition-all cursor-pointer ${
                        tier.popular
                          ? 'skz-cta hover:-translate-y-px active:translate-y-0'
                          : 'bg-skyz-bg border border-skyz-border text-skyz-text hover:border-skyz-accent/50 hover:text-skyz-accent'
                      }`}
                    >
                      {tier.cta}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Assurances */}
            <Reveal delay={0.2}>
              <div className="mt-10 max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                {ASSURANCES.map((a) => (
                  <span key={a.label} className="inline-flex items-center gap-2 text-xs font-medium text-skyz-text-muted">
                    {a.icon}
                    {a.label}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </SectionShell>

      {/* ================================================================ */}
      {/* 3. FAQ                                                           */}
      {/* ================================================================ */}
      <SectionShell className="!py-2 sm:!py-3">
        <div className="bg-skyz-accent-muted border border-skyz-accent/20 rounded-[inherit]">
          <div className="max-w-3xl mx-auto px-5 sm:px-10 py-12 sm:py-16 relative z-10">
            <Reveal>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-skyz-text tracking-tight text-center">
                Questions, answered.
              </h2>
            </Reveal>

            <div className="mt-8 space-y-3">
              {FAQS.map((faq, i) => {
                const open = openFaq === i;
                return (
                  <Reveal key={faq.q} delay={0.05 * i}>
                    <div
                      className={`rounded-2xl border transition-colors cursor-pointer ${
                        open ? 'bg-skyz-surface border-skyz-accent/40 shadow-sm' : 'bg-skyz-surface/60 border-skyz-border hover:border-skyz-accent/30'
                      }`}
                      onClick={() => setOpenFaq(open ? null : i)}
                    >
                      <button
                        type="button"
                        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
                        aria-expanded={open}
                      >
                        <span className="text-sm sm:text-base font-semibold text-skyz-text">{faq.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-skyz-accent flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                        />
                      </button>
                      <div
                        className={`grid transition-all duration-300 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                      >
                        <div className="overflow-hidden">
                          <p className="px-5 pb-5 text-sm text-skyz-text-muted leading-relaxed">{faq.a}</p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </SectionShell>

      {/* ================================================================ */}
      {/* 4. FINAL CTA                                                     */}
      {/* ================================================================ */}
      <SectionShell className="!py-2 sm:!py-3">
        <div className="relative rounded-[inherit] bg-skyz-surface border border-skyz-border px-5 sm:px-12 py-16 sm:py-20 text-center overflow-hidden">
          <Blob className="w-[300px] h-[280px] -top-20 -right-20 opacity-70" color="rgba(124, 77, 224, 0.10)" duration={12} />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <Reveal>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-skyz-text leading-tight">
                Not sure which package?{' '}
                <span className="text-skyz-accent">Let's scope it together.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="text-skyz-text-muted text-sm sm:text-base">
                Book a free 20-minute call — we'll map your goals to the right package,
                or build a custom quote if your needs sit outside the boxes.
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <button
                type="button"
                onClick={() => navigate('contact', { hash: 'contact' })}
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full skz-cta text-sm font-bold hover:-translate-y-px active:translate-y-0 transition-all cursor-pointer"
              >
                Get a free consultation
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </Reveal>
          </div>
        </div>
      </SectionShell>
    </div>
  );
};

export default PricingPage;
