import React from 'react';
import { motion } from 'motion/react';
import { Laptop, Bot, TrendingUp, ArrowRight, Code, Activity, Database, RefreshCw, Cloud } from 'lucide-react';
import { CAPABILITIES } from '../data/content';
import { useNavigation } from '../context/NavigationContext';
import { Reveal, SectionShell, Blob, Eyebrow } from '../components/OpalKit';

export const Capabilities: React.FC = () => {
  const { navigate } = useNavigation();
  const buildCap = CAPABILITIES.find((c) => c.category === 'BUILD')!;
  const growCap = CAPABILITIES.find((c) => c.category === 'GROW')!;
  const automateCap = CAPABILITIES.find((c) => c.category === 'AUTOMATE')!;

  const cardBase =
    'rounded-[2rem] bg-skyz-bg border border-skyz-border p-6 sm:p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col justify-between';

  return (
    <SectionShell id="services">
      <div className="bg-skyz-surface border border-skyz-border rounded-[inherit] px-5 sm:px-12 py-16 sm:py-24 relative overflow-hidden">
        <Blob className="w-[360px] h-[330px] -top-24 left-1/3 opacity-60" color="rgba(124, 58, 237, 0.06)" duration={13} />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Section Header */}
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-14 gap-6">
              <div className="max-w-2xl space-y-4">
                <Eyebrow>Core Capabilities</Eyebrow>
                <h2 className="font-display text-3xl sm:text-5xl text-skyz-text tracking-tight font-bold">
                  Build. Grow. Automate.
                </h2>
                <p className="text-base sm:text-lg text-skyz-text-muted leading-relaxed">
                  Three pillars, one connected system — resilient products, market reach, and autonomous workflows.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('services')}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-skyz-text hover:text-skyz-accent transition-colors self-start md:self-auto cursor-pointer"
              >
                <span>Explore All Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </Reveal>

          {/* 3-Pillar Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-7">
            {/* Card 1: BUILD */}
            <Reveal className="h-full">
              <div className={`${cardBase} h-full`}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-skyz-surface-subtle shadow-sm flex items-center justify-center border border-skyz-border group-hover:scale-105 transition-transform">
                      <Laptop className="w-6 h-6 text-skyz-accent" />
                    </div>
                    <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-skyz-surface-subtle border border-skyz-border text-skyz-text-muted font-bold tracking-wider">
                      01 // BUILD
                    </span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl text-skyz-text font-bold">
                    {buildCap.title}
                  </h3>
                  <p className="text-sm sm:text-base text-skyz-text-muted mt-2">
                    {buildCap.description}
                  </p>
                </div>

                {/* Interactive Visual Widget */}
                <div className="my-6 p-3 sm:p-4 rounded-2xl bg-skyz-surface-subtle shadow-sm border border-skyz-border">
                  <div className="flex items-center justify-between relative overflow-hidden">
                    <div className="flex flex-col items-center gap-1 z-10 flex-shrink-0">
                      <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-skyz-surface border border-skyz-border flex items-center justify-center text-skyz-text font-semibold text-[11px] sm:text-xs shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-skyz-accent absolute top-1 right-1 animate-pulse" />
                        UI/UX
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-skyz-text-muted whitespace-nowrap">Architecture</span>
                    </div>

                    <div className="flex-1 h-1.5 sm:h-2 bg-skyz-border mx-1.5 sm:mx-2.5 relative rounded-full overflow-hidden">
                      <motion.div
                        className="absolute top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-transparent via-skyz-accent to-skyz-accent-secondary rounded-full shadow-[0_0_8px_rgba(124,58,237,0.7)]"
                        animate={{ x: ['-100%', '300%'] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    </div>

                    <div className="flex flex-col items-center gap-1 z-10 flex-shrink-0">
                      <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-skyz-text dark:bg-skyz-accent text-skyz-bg dark:text-[#080B10] flex items-center justify-center shadow-md">
                        <Code className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-skyz-text dark:text-skyz-accent font-bold whitespace-nowrap">Engineering</span>
                    </div>

                    <div className="flex-1 h-1.5 sm:h-2 bg-skyz-border mx-1.5 sm:mx-2.5 relative rounded-full overflow-hidden">
                      <motion.div
                        className="absolute top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-transparent via-skyz-accent-secondary to-skyz-accent rounded-full shadow-[0_0_8px_rgba(96,165,250,0.7)]"
                        animate={{ x: ['-100%', '300%'] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
                      />
                    </div>

                    <div className="flex flex-col items-center gap-1 z-10 flex-shrink-0">
                      <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-skyz-surface border border-skyz-border flex items-center justify-center text-skyz-accent font-semibold text-[11px] sm:text-xs shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute top-1 right-1 animate-pulse" />
                        PROD
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-skyz-text-muted whitespace-nowrap">Deployment</span>
                    </div>
                  </div>
                </div>

                {/* Services List */}
                <div className="pt-4 border-t border-skyz-border">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {buildCap.services.map((service) => (
                      <span key={service} className="text-xs px-2.5 py-1 rounded-full bg-skyz-surface-subtle text-skyz-text border border-skyz-border">
                        {service}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('contact', { serviceCategory: 'BUILD' })}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-skyz-text hover:text-skyz-accent cursor-pointer"
                  >
                    <span>Inquire about Build services</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </Reveal>

            {/* Card 2: GROW */}
            <Reveal delay={0.07} className="h-full">
              <div className={`${cardBase} h-full`}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-skyz-surface-subtle shadow-sm flex items-center justify-center border border-skyz-border group-hover:scale-105 transition-transform">
                      <TrendingUp className="w-6 h-6 text-skyz-accent" />
                    </div>
                    <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-skyz-surface-subtle border border-skyz-border text-skyz-text-muted font-bold tracking-wider">
                      02 // GROW
                    </span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl text-skyz-text font-bold">
                    {growCap.title}
                  </h3>
                  <p className="text-sm sm:text-base text-skyz-text-muted mt-2">
                    {growCap.description}
                  </p>
                </div>

                {/* Growth Architecture Widget */}
                <div className="my-6 p-4 rounded-2xl bg-skyz-surface-subtle shadow-sm flex items-center justify-center gap-4 border border-skyz-border">
                  <div className="w-36 h-28 rounded-2xl bg-skyz-bg p-3 flex flex-col justify-between border border-skyz-border">
                    <div className="flex items-center justify-between text-[10px] text-skyz-text-muted font-mono">
                      <span>SEARCH AUDIT</span>
                      <span className="text-skyz-accent font-bold">100%</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 rounded-full bg-skyz-border w-full" />
                      <div className="h-2 rounded-full bg-skyz-accent/40 w-3/4" />
                      <div className="h-2 rounded-full bg-skyz-accent w-5/6" />
                    </div>
                    <div className="text-[10px] text-skyz-text-muted font-mono">Core Web Vitals</div>
                  </div>
                  <div className="w-36 h-28 rounded-2xl bg-skyz-text dark:bg-[#1E293B] text-skyz-bg dark:text-white p-3 flex flex-col justify-between shadow-md group-hover:scale-105 transition-transform">
                    <span className="text-[11px] font-semibold text-skyz-bg/90 dark:text-white/90">Organic Growth</span>
                    <div className="flex items-center justify-center my-auto text-skyz-accent">
                      <Activity className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] text-center text-skyz-bg/70 dark:text-white/70">Audience Discovery</span>
                  </div>
                </div>

                {/* Services List */}
                <div className="pt-4 border-t border-skyz-border">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {growCap.services.map((service) => (
                      <span key={service} className="text-xs px-2.5 py-1 rounded-full bg-skyz-surface-subtle text-skyz-text border border-skyz-border">
                        {service}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('contact', { serviceCategory: 'GROW' })}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-skyz-text hover:text-skyz-accent cursor-pointer"
                  >
                    <span>Inquire about Grow services</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </Reveal>

            {/* Card 3: AUTOMATE — full width */}
            <Reveal delay={0.1} className="lg:col-span-2">
              <div className={cardBase}>
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-skyz-surface-subtle shadow-sm flex items-center justify-center border border-skyz-border group-hover:scale-105 transition-transform">
                        <Bot className="w-6 h-6 text-skyz-accent" />
                      </div>
                      <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-skyz-surface-subtle border border-skyz-border text-skyz-text-muted font-bold tracking-wider">
                        03 // AUTOMATE
                      </span>
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl text-skyz-text font-bold">
                      {automateCap.title}
                    </h3>
                    <p className="text-sm sm:text-base text-skyz-text-muted mt-2 max-w-2xl">
                      {automateCap.description}
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => navigate('contact', { serviceCategory: 'AUTOMATE' })}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] text-xs sm:text-sm font-semibold hover:bg-skyz-accent dark:hover:bg-skyz-accent-secondary transition-all cursor-pointer"
                    >
                      <span>Scope Automation</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Interactive API Integrations Module */}
                <div className="my-6 p-4 sm:p-5 rounded-2xl bg-skyz-surface-subtle shadow-sm flex items-center justify-around border border-skyz-border">
                  <div className="flex items-center gap-2 sm:gap-6 w-full max-w-2xl justify-around">
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-xl bg-skyz-bg border border-skyz-border flex items-center justify-center text-skyz-text shadow-sm">
                        <Database className="w-4 h-4 text-skyz-accent" />
                      </div>
                      <span className="text-[10px] text-skyz-text-muted mt-1 font-medium">CRM / DB</span>
                    </div>
                    <div className="flex-1 max-w-[80px] h-0.5 bg-skyz-border relative">
                      <div className="w-2 h-2 rounded-full bg-skyz-accent absolute -top-[3px] animate-ping" />
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-xl bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] flex items-center justify-center shadow-md">
                        <RefreshCw className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] text-skyz-text dark:text-skyz-accent font-bold mt-1">API Workflow</span>
                    </div>
                    <div className="flex-1 max-w-[80px] h-0.5 bg-skyz-border relative">
                      <div className="w-2 h-2 rounded-full bg-skyz-accent-secondary absolute -top-[3px] animate-ping" style={{ animationDelay: '0.8s' }} />
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-xl bg-skyz-bg border border-skyz-border flex items-center justify-center text-skyz-text shadow-sm">
                        <Cloud className="w-4 h-4 text-skyz-accent" />
                      </div>
                      <span className="text-[10px] text-skyz-text-muted mt-1 font-medium">Cloud Webhooks</span>
                    </div>
                  </div>
                </div>

                {/* Automate Services List */}
                <div className="pt-4 border-t border-skyz-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {automateCap.services.map((service) => (
                      <span key={service} className="text-xs px-2.5 py-1 rounded-full bg-skyz-surface-subtle text-skyz-text border border-skyz-border">
                        {service}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('services', { serviceCategory: 'AUTOMATE' })}
                    className="text-xs font-semibold text-skyz-accent hover:underline whitespace-nowrap cursor-pointer"
                  >
                    Explore all automation specs →
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </SectionShell>
  );
};
