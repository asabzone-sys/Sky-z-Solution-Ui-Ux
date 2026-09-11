import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, ArrowDown, Laptop, ShoppingCart, Search, TrendingUp, Palette, Bot } from 'lucide-react';
import { HERO_QUERIES, OFFICIAL_SERVICES } from '../data/content';
import { useNavigation } from '../context/NavigationContext';
import { Reveal, Blob, FloatingTag } from '../components/OpalKit';

const SERVICE_ICON: Record<string, React.ReactNode> = {
  'web-development': <Laptop className="w-full h-full" />,
  'ecommerce': <ShoppingCart className="w-full h-full" />,
  'seo': <Search className="w-full h-full" />,
  'digital-marketing': <TrendingUp className="w-full h-full" />,
  'graphic-design': <Palette className="w-full h-full" />,
  'ai-automation': <Bot className="w-full h-full" />
};

// Living background: four real services float around the hero as soft chips
// (the labs.google treatment, built from SkyZ's actual services).
const FLOATING_CHIPS: { serviceId: string; position: string; rotate: string; anim: string; delay: string }[] = [
  { serviceId: 'web-development', position: 'top-[9%] left-[4%] lg:left-[9%]', rotate: '-rotate-6', anim: 'animate-float-slow', delay: '0s' },
  { serviceId: 'ai-automation', position: 'top-[12%] right-[4%] lg:right-[9%]', rotate: 'rotate-6', anim: 'animate-float-rev', delay: '0.4s' },
  { serviceId: 'graphic-design', position: 'bottom-[12%] left-[6%] lg:left-[11%]', rotate: 'rotate-3', anim: 'animate-float-rev', delay: '0.8s' },
  { serviceId: 'seo', position: 'bottom-[10%] right-[5%] lg:right-[10%]', rotate: '-rotate-3', anim: 'animate-float-slow', delay: '1.2s' },
];

export const Hero: React.FC = () => {
  const { navigate } = useNavigation();
  const [queryIdx, setQueryIdx] = useState(0);
  const [placeholderText, setPlaceholderText] = useState(HERO_QUERIES[0]);
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const charIdxRef = useRef(0);
  const isDeletingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Typewriter effect respecting prefers-reduced-motion
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || isFocused) {
      setPlaceholderText(HERO_QUERIES[queryIdx]);
      return;
    }

    const runTypewriter = () => {
      const currentQuery = HERO_QUERIES[queryIdx];
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
          setQueryIdx((prev) => (prev + 1) % HERO_QUERIES.length);
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
  }, [queryIdx, isFocused]);

  const handleChipClick = (query: string) => {
    setIsFocused(true);
    setInputValue(query);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputValue.trim() || placeholderText;
    setIsSubmitting(true);
    setFeedbackMessage(`Routing: "${query.slice(0, 32)}..."`);

    setTimeout(() => {
      setFeedbackMessage('Connecting your request to project scoping...');
      setTimeout(() => {
        setIsSubmitting(false);
        setFeedbackMessage(null);
        setInputValue('');
        setIsFocused(false);
        navigate('contact');
      }, 700);
    }, 600);
  };

  return (
    <section className="relative w-full min-h-[780px] sm:min-h-[840px] flex flex-col items-center justify-between px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12 bg-skyz-bg transition-colors duration-200 overflow-hidden">
      {/* Organic Labs-style color field */}
      <Blob className="w-[460px] h-[420px] -top-32 -left-36 opacity-80" color="rgba(124, 58, 237, 0.09)" duration={11} />
      <Blob className="w-[400px] h-[380px] top-24 right-[-140px] opacity-70" color="rgba(56, 189, 248, 0.08)" duration={13} />
      <Blob className="w-[340px] h-[320px] bottom-[-120px] left-1/3 opacity-60" color="rgba(236, 72, 153, 0.07)" duration={10} />

      {/* Floating Service Chips — desktop/tablet only so mobile breathes */}
      {FLOATING_CHIPS.map((chip) => {
        const service = OFFICIAL_SERVICES.find((s) => s.id === chip.serviceId);
        if (!service) return null;
        return (
          <div
            key={chip.serviceId}
            style={{ animationDelay: chip.delay }}
            className={`hidden md:flex absolute ${chip.position} ${chip.anim} ${chip.rotate} items-center gap-2.5 pl-2 pr-4 py-2 rounded-2xl bg-skyz-surface/80 backdrop-blur-sm border border-skyz-border shadow-lg opacity-70 hover:opacity-100 transition-opacity pointer-events-none select-none z-0`}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white p-1.5 flex-shrink-0"
              style={{ backgroundColor: service.accent }}
            >
              {SERVICE_ICON[service.id]}
            </div>
            <span className="text-xs font-semibold text-skyz-text whitespace-nowrap">
              {service.name}
            </span>
          </div>
        );
      })}

      {/* Top Meta Chip */}
      <Reveal>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-skyz-surface shadow-sm border border-skyz-border">
          <span className="w-2 h-2 rounded-full bg-skyz-accent animate-pulse" />
          <span className="text-[11px] sm:text-xs text-skyz-text-muted tracking-wider uppercase font-semibold">
            Digital Architecture &amp; AI Systems
          </span>
        </div>
      </Reveal>

      {/* Main Center Content */}
      <div className="w-full max-w-4xl mx-auto text-center flex flex-col items-center justify-center my-auto py-8 relative z-10">
        <Reveal>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] lg:leading-[5.5rem] text-skyz-text tracking-tighter max-w-4xl mx-auto font-black leading-tight">
            We build{' '}
            <span className="text-skyz-accent">what comes next.</span>
          </h1>
        </Reveal>

        {/* Playful cursor-tags — Putty hero flavor, desktop only */}
        <div className="relative w-full">
          <FloatingTag className="top-[-14px] left-[8%] bg-green-400 text-black -rotate-6" delay={0.6}>
            ✦ FAST
          </FloatingTag>
          <FloatingTag className="top-[-26px] right-[9%] bg-pink-400 text-white rotate-3" delay={0.9}>
            ✦ CONNECTED
          </FloatingTag>
        </div>

        <Reveal delay={0.08}>
          <p className="text-base sm:text-lg md:text-xl text-skyz-text-muted max-w-2xl mx-auto mt-5 text-center font-normal px-2 leading-relaxed">
            Web systems, growth engines, and autonomous AI automation — built as one connected studio.
          </p>
        </Reveal>

        {/* HERO SEARCH PILL */}
        <Reveal delay={0.14} className="w-full max-w-2xl mt-9 sm:mt-12 px-2 sm:px-0">
          <div className="p-1 sm:p-1.5 rounded-full bg-skyz-surface shadow-[0_12px_36px_-6px_rgba(124,58,237,0.14)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.6)] transition-all duration-300 hover:shadow-[0_16px_44px_-4px_rgba(124,58,237,0.22)] dark:hover:shadow-[0_16px_44px_-4px_rgba(56,189,248,0.26)]">
            <form onSubmit={handleSubmit} className="relative flex items-center bg-skyz-surface-subtle rounded-full px-3 py-2 sm:px-4 sm:py-2.5">
              {/* Sparkle Icon */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-skyz-accent mr-1 flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>

              {/* Input Area */}
              <div className="relative flex-1 flex items-center min-w-0 px-2 overflow-hidden">
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
                  className="w-full bg-transparent py-1 font-sans text-sm sm:text-base text-skyz-text placeholder:text-skyz-text-muted/70 focus:outline-none min-w-0"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                aria-label="Send inquiry query"
                disabled={isSubmitting}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-skyz-text dark:bg-skyz-accent hover:bg-skyz-accent dark:hover:bg-skyz-accent-secondary text-white dark:text-[#080B10] flex items-center justify-center shadow-md transition-all duration-300 hover:scale-105 active:scale-95 flex-shrink-0 cursor-pointer disabled:opacity-50"
              >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </form>
          </div>

          {/* Suggestion Prompt Pills — Approved Queries */}
          <div className="flex items-center sm:justify-center gap-2 mt-4 overflow-x-auto no-scrollbar py-1 px-1">
            <span className="text-xs text-skyz-text-muted uppercase tracking-wider font-semibold whitespace-nowrap pl-1">
              Try:
            </span>
            <button
              type="button"
              onClick={() => handleChipClick('Build a modern business website')}
              className="text-xs px-3.5 py-1.5 rounded-full bg-skyz-surface hover:bg-skyz-surface-subtle text-skyz-text-muted hover:text-skyz-text border border-skyz-border transition-all whitespace-nowrap flex-shrink-0 cursor-pointer"
            >
              Business Websites
            </button>
            <button
              type="button"
              onClick={() => handleChipClick('Create an AI agent for my business')}
              className="text-xs px-3.5 py-1.5 rounded-full bg-skyz-surface hover:bg-skyz-surface-subtle text-skyz-text-muted hover:text-skyz-text border border-skyz-border transition-all whitespace-nowrap flex-shrink-0 cursor-pointer"
            >
              AI Agents
            </button>
            <button
              type="button"
              onClick={() => handleChipClick('Automate my business workflow')}
              className="text-xs px-3.5 py-1.5 rounded-full bg-skyz-surface hover:bg-skyz-surface-subtle text-skyz-text-muted hover:text-skyz-text border border-skyz-border transition-all whitespace-nowrap flex-shrink-0 cursor-pointer"
            >
              Workflow Automation
            </button>
            <button
              type="button"
              onClick={() => handleChipClick('Improve my website SEO')}
              className="text-xs px-3.5 py-1.5 rounded-full bg-skyz-surface hover:bg-skyz-surface-subtle text-skyz-text-muted hover:text-skyz-text border border-skyz-border transition-all whitespace-nowrap flex-shrink-0 cursor-pointer"
            >
              Website SEO
            </button>
          </div>
        </Reveal>
      </div>

      {/* Hero Bottom Anchor to #work */}
      <Reveal delay={0.2}>
        <button
          type="button"
          onClick={() => {
            const workSection = document.getElementById('work');
            if (workSection) {
              workSection.scrollIntoView({ behavior: 'smooth' });
            } else {
              navigate('work');
            }
          }}
          className="flex flex-col items-center gap-1 text-skyz-text-muted hover:text-skyz-text transition-colors group mt-2 cursor-pointer"
        >
          <span className="text-xs uppercase tracking-widest font-semibold">
            Explore Showcase
          </span>
          <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
        </button>
      </Reveal>
    </section>
  );
};
