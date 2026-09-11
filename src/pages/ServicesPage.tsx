import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  Globe,
  ShoppingCart,
  Search,
  TrendingUp,
  Palette,
  Bot,
  Code2,
  Send,
  Wrench,
  Megaphone,
  Workflow,
  Sparkles,
} from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { OFFICIAL_SERVICES, OfficialService } from '../data/content';
import {
  Reveal,
  SectionShell,
  Blob,
  VideoSection,
  Eyebrow,
  FloatingTag,
} from '../components/OpalKit';

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  'web-development': <Globe className="w-7 h-7 text-sky-500" />,
  'ecommerce': <ShoppingCart className="w-7 h-7 text-blue-500" />,
  'seo': <Search className="w-7 h-7 text-emerald-500" />,
  'digital-marketing': <TrendingUp className="w-7 h-7 text-purple-500" />,
  'graphic-design': <Palette className="w-7 h-7 text-pink-500" />,
  'ai-automation': <Bot className="w-7 h-7 text-amber-500" />,
};

const TILTS = ['-rotate-3', 'rotate-2', '-rotate-1', 'rotate-3', '-rotate-2', 'rotate-1'];
const TINTS: Record<string, string> = {
  'web-development': 'bg-sky-100 dark:bg-sky-500/15',
  'ecommerce': 'bg-blue-100 dark:bg-blue-500/15',
  'seo': 'bg-emerald-100 dark:bg-emerald-500/15',
  'digital-marketing': 'bg-purple-100 dark:bg-purple-500/15',
  'graphic-design': 'bg-pink-100 dark:bg-pink-500/15',
  'ai-automation': 'bg-amber-100 dark:bg-amber-500/15',
};

const PILLARS = [
  {
    id: 'BUILD',
    icon: <Code2 className="w-6 h-6 text-skyz-accent" />,
    title: 'Foundations',
    desc: 'Modern websites and online storefronts designed to perform smoothly and convert visitors into customers.',
    items: ['Web Development', 'E-commerce'],
  },
  {
    id: 'GROW',
    icon: <Megaphone className="w-6 h-6 text-skyz-accent" />,
    title: 'Visibility & Reach',
    desc: 'Targeted organic search, conversion campaigns, and distinct visual design that make your business recognizable.',
    items: ['SEO', 'Digital Marketing', 'Graphic Design'],
  },
  {
    id: 'AUTOMATE',
    icon: <Workflow className="w-6 h-6 text-skyz-accent" />,
    title: 'Scale & Efficiency',
    desc: 'Practical AI automation and system integrations that handle repetitive tasks and save valuable hours.',
    items: ['AI Automation'],
  },
];

const SERVICE_QUERIES = [
  'Build a custom high-performance web application',
  'Scale an online store with modern headless e-commerce',
  'Audit and accelerate organic search rankings (SEO)',
  'Launch high-converting digital marketing campaigns',
  'Design a distinct brand identity and design system',
  'Deploy autonomous AI agents to automate workflows',
];

const SUGGESTION_CHIPS = [
  { label: 'Web Apps', query: 'Custom Web Application' },
  { label: 'E-Commerce', query: 'Headless E-Commerce Store' },
  { label: 'SEO Audit', query: 'SEO Optimization' },
  { label: 'Digital Ads', query: 'Digital Marketing Campaign' },
  { label: 'Brand UI', query: 'Graphic & Brand Identity' },
  { label: 'AI Agents', query: 'Autonomous AI Automation' },
];

export const ServicesPage: React.FC = () => {
  const { navigate, setServiceCategory } = useNavigation();
  const [selected, setSelected] = useState<OfficialService>(OFFICIAL_SERVICES[0]);
  const [queryIdx, setQueryIdx] = useState(0);
  const [placeholderText, setPlaceholderText] = useState(SERVICE_QUERIES[0]);
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const charIdxRef = useRef(0);
  const isDeletingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth typewriter animation running continuously on desktop and mobile
  useEffect(() => {
    if (inputValue.trim().length > 0) return;

    const runTypewriter = () => {
      const currentQuery = SERVICE_QUERIES[queryIdx];
      const typingSpeed = isDeletingRef.current ? 22 : 45;

      if (!isDeletingRef.current) {
        charIdxRef.current++;
        setPlaceholderText(currentQuery.substring(0, charIdxRef.current));

        if (charIdxRef.current === currentQuery.length) {
          timeoutRef.current = setTimeout(() => {
            isDeletingRef.current = true;
            runTypewriter();
          }, 2400);
          return;
        }
      } else {
        charIdxRef.current--;
        setPlaceholderText(currentQuery.substring(0, charIdxRef.current));

        if (charIdxRef.current === 0) {
          isDeletingRef.current = false;
          setQueryIdx((prev) => (prev + 1) % SERVICE_QUERIES.length);
          timeoutRef.current = setTimeout(runTypewriter, 350);
          return;
        }
      }

      timeoutRef.current = setTimeout(runTypewriter, typingSpeed);
    };

    timeoutRef.current = setTimeout(runTypewriter, 150);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [queryIdx, inputValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputValue.trim() || placeholderText;
    setIsSubmitting(true);
    setFeedbackMessage(`Scoping: "${query.slice(0, 28)}..."`);

    setTimeout(() => {
      setIsSubmitting(false);
      setFeedbackMessage(null);
      setInputValue('');
      setIsFocused(false);
      navigate('contact');
    }, 600);
  };

  const handleStart = (service: OfficialService) => {
    setServiceCategory(service.pillar);
    navigate('contact');
  };

  return (
    <div className="w-full bg-skyz-bg text-skyz-text transition-colors duration-200 overflow-x-hidden">

      {/* ================================================================ */}
      {/* 1. HERO — Opal-style centered statement + animated search bar     */}
      {/* ================================================================ */}
      <section className="w-full pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 sm:px-6 relative overflow-hidden">
        <Blob className="w-[380px] h-[340px] top-0 left-[-140px] opacity-70" color="rgba(124, 58, 237, 0.08)" duration={11} />
        <Blob className="w-[340px] h-[320px] top-16 right-[-120px] opacity-60" color="rgba(56, 189, 248, 0.08)" duration={13} />

        {/* Floating elements responsive across mobile & desktop */}
        <FloatingTag className="top-12 sm:top-16 left-[2%] sm:left-[8%] bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/20 -rotate-6" delay={0.4}>
          ✦ 6 CAPABILITIES
        </FloatingTag>
        <FloatingTag className="top-16 sm:top-20 right-[2%] sm:right-[8%] bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 rotate-3" delay={0.8}>
          ✦ END-TO-END
        </FloatingTag>

        <div className="max-w-3xl mx-auto text-center relative z-10 space-y-8">
          <Reveal>
            <Eyebrow>
              <span className="w-2 h-2 rounded-full bg-skyz-accent animate-pulse" />
              Services // SkyZ Solutions
            </Eyebrow>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.02] text-skyz-text">
              Build, grow, and automate —{' '}
              <span className="text-skyz-accent">one connected studio.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="text-base sm:text-lg text-skyz-text-muted max-w-xl mx-auto leading-relaxed">
              Six essential capabilities, engineered as one system. Pick a single service or combine all six into the operating engine of your business.
            </p>
          </Reveal>

          {/* Interactive Animated Search Bar */}
          <Reveal delay={0.2} className="w-full max-w-2xl mx-auto px-1 sm:px-0">
            <div className="p-1 sm:p-1.5 rounded-full bg-skyz-surface shadow-[0_12px_36px_-6px_rgba(124,58,237,0.14)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.6)] transition-all duration-300 hover:shadow-[0_16px_44px_-4px_rgba(124,58,237,0.22)]">
              <form onSubmit={handleSubmit} className="relative flex items-center bg-skyz-surface-subtle rounded-full px-3 py-2 sm:px-4 sm:py-2.5">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-skyz-accent mr-1 flex-shrink-0">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                </div>

                <div className="flex-1 text-left min-w-0 pr-2">
                  <input
                    type="text"
                    value={feedbackMessage || inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                      if (!inputValue.trim()) setIsFocused(false);
                    }}
                    disabled={isSubmitting}
                    placeholder={placeholderText}
                    className="w-full bg-transparent py-1 font-sans text-xs sm:text-base text-skyz-text placeholder:text-skyz-text-muted/70 focus:outline-none min-w-0"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-skyz-text dark:bg-skyz-accent flex items-center justify-center flex-shrink-0 cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-all text-white dark:text-[#080B10]"
                  title="Search Services"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Quick interactive service filter tags */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-4">
              <span className="text-[11px] font-mono text-skyz-text-muted uppercase tracking-wider mr-1">
                Explore:
              </span>
              {SUGGESTION_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => {
                    setInputValue(chip.query);
                    setIsFocused(true);
                  }}
                  className="text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-full bg-skyz-surface hover:bg-skyz-surface-subtle border border-skyz-border hover:border-skyz-accent/40 text-skyz-text-muted hover:text-skyz-text transition-all cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 2. SERVICE GALLERY — Opal "explore the gallery" tilted cards      */}
      {/* ================================================================ */}
      <SectionShell>
        <div className="bg-skyz-surface border border-skyz-border rounded-[inherit] px-5 sm:px-12 py-16 sm:py-24 relative overflow-hidden">
          <Blob className="w-[400px] h-[360px] -top-28 right-1/4 opacity-60" color="rgba(236, 72, 153, 0.06)" duration={12} />

          <div className="relative z-10">
            <Reveal className="text-center max-w-2xl mx-auto space-y-4 mb-14">
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-skyz-text">
                Start with one, or combine all six
              </h2>
              <p className="text-sm sm:text-base text-skyz-text-muted">
                Tap any capability to see how it works — every card connects into the same engine.
              </p>
            </Reveal>

            {/* Tilted gallery grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
              {OFFICIAL_SERVICES.map((service, i) => {
                const isSelected = selected.id === service.id;
                return (
                  <Reveal key={service.id} delay={i * 0.06} className="h-full">
                    <motion.button
                      type="button"
                      onClick={() => setSelected(service)}
                      whileHover={{ rotate: 0, scale: 1.04, y: -4 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                      className={`w-full h-full text-left rounded-3xl p-4 sm:p-5 border transition-shadow cursor-pointer ${TILTS[i % TILTS.length]} ${
                        isSelected
                          ? 'border-skyz-accent shadow-xl shadow-skyz-accent/10 bg-skyz-bg'
                          : 'border-skyz-border bg-skyz-bg hover:shadow-lg'
                      }`}
                    >
                      {/* Accent visual tile */}
                      <div className={`aspect-[4/3] rounded-2xl ${TINTS[service.id]} flex items-center justify-center mb-4 relative overflow-hidden`}>
                        <motion.div
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 4 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                          className="w-16 h-16 rounded-2xl bg-white/80 dark:bg-white/10 shadow-sm border border-black/5 dark:border-white/10 flex items-center justify-center"
                        >
                          {SERVICE_ICONS[service.id]}
                        </motion.div>
                        <span className="absolute top-2.5 left-3 text-[10px] font-mono font-bold text-skyz-text-muted">
                          {service.pillarNumber} // {service.pillar}
                        </span>
                      </div>

                      <h3 className="font-display text-base sm:text-lg font-bold text-skyz-text">
                        {service.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-skyz-text-muted mt-1 leading-relaxed line-clamp-2">
                        {service.sentence}
                      </p>
                    </motion.button>
                  </Reveal>
                );
              })}
            </div>

            {/* Selected service detail panel */}
            <div className="max-w-5xl mx-auto mt-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="p-6 sm:p-9 rounded-[2rem] bg-skyz-bg border border-skyz-border shadow-sm relative overflow-hidden"
                >
                  <div
                    className="absolute -top-16 -right-16 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
                    style={{ backgroundColor: selected.accent }}
                  />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: `${selected.accent}1A`, color: selected.accent }}
                        >
                          {selected.badge}
                        </span>
                        <span className="text-[11px] font-mono text-skyz-text-muted">{selected.tagline}</span>
                      </div>
                      <h3 className="font-display text-2xl sm:text-3xl font-bold text-skyz-text">
                        {selected.name}
                      </h3>
                      <p className="text-sm sm:text-base text-skyz-text-muted leading-relaxed">
                        {selected.sentence}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selected.microLabels.map((label) => (
                          <span
                            key={label}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-skyz-surface-subtle text-skyz-text-muted border border-skyz-border"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleStart(selected)}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] font-semibold text-sm shadow-md hover:bg-skyz-accent transition-all cursor-pointer"
                      >
                        <span>Scope {selected.name}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <span className="text-[11px] font-mono text-skyz-text-muted">
                        Direct 24hr response
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </SectionShell>

      {/* ================================================================ */}
      {/* 3. VIDEO — Putty-style embed ("Unleash your creativity" slot)     */}
      {/* ================================================================ */}
      <SectionShell>
        <div className="relative rounded-[inherit] px-2 py-14 sm:py-20 bg-gradient-to-b from-skyz-surface-subtle/60 to-transparent overflow-hidden">
          <Blob className="w-[400px] h-[360px] top-4 -right-32 opacity-60" color="rgba(124, 58, 237, 0.07)" duration={11} />
          <div className="relative z-10">
            <VideoSection
              heading="See the system in motion"
              caption="Watch how a project moves through Build → Grow → Automate, from first scoping call to a running, measurable system."
              title="SkyZ Solutions — Six services, one connected system"
              videoId="QEJhjQSdG-M"
            />
          </div>
        </div>
      </SectionShell>

      {/* ================================================================ */}
      {/* 4. PILLARS — Opal three outlined feature cards                    */}
      {/* ================================================================ */}
      <SectionShell>
        <div className="bg-skyz-surface border border-skyz-border rounded-[inherit] px-5 sm:px-12 py-16 sm:py-24 relative overflow-hidden">
          <div className="relative z-10">
            <Reveal className="text-center max-w-2xl mx-auto space-y-4 mb-14">
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-skyz-text">
                Bring your business to life with SkyZ
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {PILLARS.map((pillar, i) => (
                <Reveal key={pillar.id} delay={i * 0.08} className="h-full">
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="h-full p-7 sm:p-8 rounded-[2rem] border border-skyz-border bg-skyz-bg text-center flex flex-col items-center gap-4"
                  >
                    <span className="w-14 h-14 rounded-full bg-skyz-accent-muted flex items-center justify-center">
                      {pillar.icon}
                    </span>
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-mono font-bold text-skyz-text-muted tracking-widest">
                        {pillar.id}
                      </span>
                      <h3 className="font-display text-xl font-bold text-skyz-text">{pillar.title}</h3>
                      <p className="text-sm text-skyz-text-muted leading-relaxed">{pillar.desc}</p>
                    </div>
                    <div className="mt-auto pt-4 flex flex-wrap justify-center gap-1.5">
                      {pillar.items.map((item) => (
                        <span
                          key={item}
                          className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-skyz-surface-subtle text-skyz-text-muted border border-skyz-border"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </SectionShell>

      {/* ================================================================ */}
      {/* 5. CTA — Opal "Join our Discord" style soft panel + input pill    */}
      {/* ================================================================ */}
      <SectionShell>
        <div className="relative rounded-[inherit] bg-skyz-accent-muted border border-skyz-accent/20 px-5 sm:px-12 py-20 sm:py-28 text-center overflow-hidden">
          <Blob className="w-[320px] h-[300px] -top-24 -left-20 opacity-80" color="rgba(124, 58, 237, 0.12)" duration={10} />
          <Blob className="w-[340px] h-[320px] -bottom-28 -right-24 opacity-80" color="rgba(56, 189, 248, 0.12)" duration={12} />

          <div className="relative z-10 max-w-2xl mx-auto space-y-9">
            <Reveal>
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-skyz-text leading-tight">
                Ready to scope your project?
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <button
                type="button"
                onClick={() => navigate('contact')}
                className="group w-full max-w-xl mx-auto flex items-center justify-between gap-3 pl-6 pr-3 py-3 rounded-full bg-skyz-surface border border-skyz-border shadow-lg transition-all cursor-pointer text-left hover:border-skyz-accent/40"
              >
                <span className="flex items-center gap-3 text-xs sm:text-sm text-skyz-text font-medium truncate">
                  <Wrench className="w-4 h-4 text-skyz-accent flex-shrink-0" />
                  Tell us what you want to build
                </span>
                <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] text-xs sm:text-sm font-semibold flex-shrink-0 transition-transform group-hover:translate-x-0.5">
                  Start
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </button>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="text-xs font-mono text-skyz-text-muted">
                BUILD • GROW • AUTOMATE — ONE CONNECTED STUDIO
              </p>
            </Reveal>
          </div>
        </div>
      </SectionShell>

    </div>
  );
};
