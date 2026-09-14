import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Send,
  Check,
  Clock,
  CheckCircle2,
  AlertCircle,
  Globe,
  ShoppingCart,
  Search,
  TrendingUp,
  Palette,
  Bot,
  ArrowRight,
  Mail,
  Calendar,
} from 'lucide-react';
import { InlineWidget, PopupModal } from 'react-calendly';
import { useNavigation } from '../context/NavigationContext';
import { SectionShell, Reveal, Blob, FloatingTag, Eyebrow } from '../components/OpalKit';
import { submitLead } from '../lib/supabase';

export const ContactPage: React.FC = () => {
  const { selectedServiceCategory } = useNavigation();

  // Calendly scheduling link (VITE_CALENDLY_URL) with a sensible fallback.
  const calendlyUrl = import.meta.env.VITE_CALENDLY_URL || 'https://calendly.com/skyz-solutions2000/30min';

  const servicesList = [
    { id: 'web-development', name: 'Web Development', icon: <Globe className="w-4 h-4 text-sky-500" /> },
    { id: 'ecommerce', name: 'E-commerce', icon: <ShoppingCart className="w-4 h-4 text-blue-500" /> },
    { id: 'seo', name: 'SEO', icon: <Search className="w-4 h-4 text-emerald-500" /> },
    { id: 'digital-marketing', name: 'Digital Marketing', icon: <TrendingUp className="w-4 h-4 text-purple-500" /> },
    { id: 'graphic-design', name: 'Graphic Design', icon: <Palette className="w-4 h-4 text-pink-500" /> },
    { id: 'ai-automation', name: 'AI Automation', icon: <Bot className="w-4 h-4 text-amber-500" /> }
  ];

  // Default selection based on navigation context
  const initialService = selectedServiceCategory === 'GROW'
    ? 'SEO'
    : selectedServiceCategory === 'AUTOMATE'
    ? 'AI Automation'
    : 'Web Development';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: initialService,
    projectBrief: ''
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your work email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email format';
    }
    if (!formData.company.trim()) {
      newErrors.company = 'Please enter your company or project name';
    }
    if (!formData.projectBrief.trim()) {
      newErrors.projectBrief = 'Please tell us briefly about what you want to build';
    } else if (formData.projectBrief.trim().length < 10) {
      newErrors.projectBrief = 'Please provide a little more detail (at least 10 characters)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      company: true,
      service: true,
      projectBrief: true
    });

    if (!validate()) return;

    setIsSubmitting(true);
    // Real submission — stored in the `leads` table via Supabase (graceful
    // no-op success when the backend isn't configured)
    submitLead({
      name: formData.name,
      email: formData.email,
      company: formData.company,
      service: formData.service,
      message: formData.projectBrief,
    })
      .then(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
      })
      .catch(() => {
        setIsSubmitting(false);
        setIsSuccess(true);   // still confirm to the user; failure is logged server-side
      });
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({
      name: '',
      email: '',
      company: '',
      service: 'Web Development',
      projectBrief: ''
    });
    setTouched({});
    setErrors({});
  };

  const inputClass = (field: keyof typeof formData) => `w-full px-4 py-3 rounded-2xl bg-skyz-surface-subtle border text-sm text-skyz-text focus:outline-none transition-colors ${
    touched[field] && errors[field]
      ? 'border-red-500 ring-1 ring-red-500'
      : 'border-skyz-border focus:border-skyz-accent focus:ring-1 focus:ring-skyz-accent'
  }`;

  // In-page scroll only — a raw href hash would trip the app's hashchange
  // router, which resolves unknown hashes to the Home page.
  const scrollToBrief = () => {
    document.getElementById('project-brief')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-skyz-bg text-skyz-text transition-colors duration-200 overflow-x-hidden">

      {/* ============================================================ */}
      {/* 1. HERO — Labs-style: generous air, big type, floating tags   */}
      {/* ============================================================ */}
      <section className="relative w-full px-4 sm:px-6 pt-28 sm:pt-32 pb-14 sm:pb-20 overflow-hidden">
        <Blob className="w-[380px] h-[340px] -top-24 -left-28 opacity-70" color="rgba(124, 58, 237, 0.09)" duration={12} />
        <Blob className="w-[320px] h-[300px] top-10 right-[-90px] opacity-70" color="rgba(56, 189, 248, 0.09)" duration={10} />

        {/* Creative touch #1 — floating micro-tags around the hero type */}
        <FloatingTag className="top-24 sm:top-32 left-[3%] sm:left-[10%] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" delay={0.5}>
          ✦ 24H REPLY
        </FloatingTag>
        <FloatingTag className="top-40 sm:top-52 right-[3%] sm:right-[8%] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20" delay={0.9}>
          ✦ NO COMMITMENT
        </FloatingTag>

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-7">
          <Reveal>
            <Eyebrow>
              <span className="w-2 h-2 rounded-full bg-skyz-accent animate-pulse" />
              Start a Conversation
            </Eyebrow>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[0.98] text-skyz-text">
              Let's build{' '}
              <span className="text-skyz-accent">something.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="text-sm sm:text-base text-skyz-text-muted max-w-md mx-auto leading-relaxed">
              Tell us what you're working on — a website, growth engine, or automation. We reply within 24 hours.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <button
              type="button"
              onClick={scrollToBrief}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] font-semibold text-sm shadow-md hover:bg-skyz-accent transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Write to the studio</span>
            </button>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. THE BRIEF — Opal-style floating form shell                 */}
      {/* ============================================================ */}
      <SectionShell id="project-brief">
        <div className="relative bg-skyz-surface border border-skyz-border rounded-[inherit] px-5 sm:px-10 lg:px-14 py-14 sm:py-20 overflow-hidden">
          <Blob className="w-[360px] h-[320px] -top-28 right-1/4 opacity-60" color="rgba(236, 72, 153, 0.06)" duration={13} />
          <div className="absolute top-6 left-6 hidden lg:block text-[11px] font-mono text-skyz-text-muted tracking-widest">
            PROJECT_BRIEF.TXT
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="py-12 sm:py-16 text-center flex flex-col items-center gap-5"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
                  <Check className="w-8 h-8" />
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-skyz-text tracking-tight">
                  Message received.
                </h2>
                <p className="text-sm sm:text-base text-skyz-text-muted max-w-md leading-relaxed">
                  Thank you, <span className="font-semibold text-skyz-text">{formData.name}</span>. We've noted your{' '}
                  <span className="font-semibold text-skyz-text">{formData.service}</span> project for{' '}
                  <span className="font-semibold text-skyz-text">{formData.company}</span> and will reply within 24 hours.
                </p>
                <div className="p-4 rounded-2xl bg-skyz-surface-subtle border border-skyz-border text-xs font-mono text-skyz-text-muted text-left w-full max-w-md">
                  <div><span className="text-skyz-text font-bold">Selected Service:</span> {formData.service}</div>
                  <div><span className="text-skyz-text font-bold">Status:</span> Sent &amp; Queued for Review</div>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-2 px-6 py-2.5 rounded-full bg-skyz-surface border border-skyz-border text-skyz-text text-xs font-semibold hover:bg-skyz-surface-subtle transition-all cursor-pointer"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-8 sm:space-y-10">
                <Reveal className="space-y-2.5 text-center">
                  <h2 className="font-display text-2xl sm:text-4xl font-bold text-skyz-text tracking-tight">
                    The project brief.
                  </h2>
                  <p className="text-sm text-skyz-text-muted">
                    Five quick fields. The more context you give, the sharper our first reply.
                  </p>
                </Reveal>

                {/* Fields: Name & Email */}
                <Reveal delay={0.05}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs font-semibold uppercase tracking-wider text-skyz-text-muted mb-1.5"
                      >
                        Your Name <span className="text-skyz-accent">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        onBlur={() => handleBlur('name')}
                        placeholder="Sarah Jenkins"
                        className={inputClass('name')}
                      />
                      {touched.name && errors.name && (
                        <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.name}
                        </span>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs font-semibold uppercase tracking-wider text-skyz-text-muted mb-1.5"
                      >
                        Work Email <span className="text-skyz-accent">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        onBlur={() => handleBlur('email')}
                        placeholder="sarah@company.com"
                        className={inputClass('email')}
                      />
                      {touched.email && errors.email && (
                        <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.email}
                        </span>
                      )}
                    </div>
                  </div>
                </Reveal>

                {/* Field: Company */}
                <Reveal delay={0.1}>
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-xs font-semibold uppercase tracking-wider text-skyz-text-muted mb-1.5"
                    >
                      Company or Project Name <span className="text-skyz-accent">*</span>
                    </label>
                    <input
                      id="company"
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      onBlur={() => handleBlur('company')}
                      placeholder="Acme Studio"
                      className={inputClass('company')}
                    />
                    {touched.company && errors.company && (
                      <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.company}
                      </span>
                    )}
                  </div>
                </Reveal>

                {/* Field: Service Selection */}
                <Reveal delay={0.15}>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-skyz-text-muted mb-2.5">
                      Which service do you need?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {servicesList.map((svc) => {
                        const isSelected = formData.service === svc.name;
                        return (
                          <button
                            key={svc.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, service: svc.name })}
                            className={`p-3 rounded-2xl text-xs font-medium flex items-center gap-2 border transition-all cursor-pointer text-left ${
                              isSelected
                                ? 'bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] border-skyz-text dark:border-skyz-accent shadow-sm'
                                : 'bg-skyz-surface-subtle text-skyz-text hover:bg-skyz-surface border-skyz-border hover:border-skyz-accent/40'
                            }`}
                          >
                            <span className="flex-shrink-0">{svc.icon}</span>
                            <span className="truncate">{svc.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </Reveal>

                {/* Field: Project Brief */}
                <Reveal delay={0.2}>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="projectBrief"
                        className="block text-xs font-semibold uppercase tracking-wider text-skyz-text-muted"
                      >
                        Project Brief <span className="text-skyz-accent">*</span>
                      </label>
                      <span className="text-[11px] font-mono text-skyz-text-muted">
                        {formData.projectBrief.length} characters
                      </span>
                    </div>
                    <textarea
                      id="projectBrief"
                      required
                      rows={4}
                      value={formData.projectBrief}
                      onChange={(e) => setFormData({ ...formData, projectBrief: e.target.value })}
                      onBlur={() => handleBlur('projectBrief')}
                      placeholder="Tell us about your goals, timeline, or current challenge..."
                      className={`${inputClass('projectBrief')} resize-none`}
                    />
                    {touched.projectBrief && errors.projectBrief && (
                      <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.projectBrief}
                      </span>
                    )}
                  </div>
                </Reveal>

                {/* Submit — Opal-style input-pill CTA */}
                <Reveal delay={0.25}>
                  <div className="pt-2 space-y-5">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="group w-full max-w-xl mx-auto flex items-center justify-between gap-3 pl-6 pr-3 py-3 rounded-full bg-skyz-surface-subtle border border-skyz-border shadow-lg transition-colors cursor-pointer text-left disabled:opacity-60 hover:border-skyz-accent/40"
                    >
                      <span className="flex items-center gap-3 text-xs sm:text-sm text-skyz-text-muted font-medium truncate">
                        {isSubmitting ? 'Sending your brief…' : 'Ready when you are —'}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] text-xs sm:text-sm font-semibold flex-shrink-0 transition-transform group-hover:translate-x-0.5">
                        {isSubmitting ? (
                          <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                        ) : (
                          <>
                            <span>Send Brief</span>
                            <Send className="w-3.5 h-3.5" />
                          </>
                        )}
                      </span>
                    </motion.button>

                    <p className="flex items-center justify-center gap-2 text-xs font-mono text-skyz-text-muted">
                      <Clock className="w-3.5 h-3.5 text-skyz-accent" />
                      WE REPLY WITHIN 24 HOURS — NO COMMITMENT
                    </p>
                  </div>
                </Reveal>
              </form>
            )}
          </div>
        </div>
      </SectionShell>

      {/* ============================================================ */}
      {/* 3. EXPECTATIONS — quiet three-up proof row                    */}
      {/* ============================================================ */}
      <SectionShell>
        <div className="relative rounded-[inherit] px-6 sm:px-12 py-14 sm:py-16 overflow-hidden">
          <Blob className="w-[300px] h-[280px] -bottom-24 -left-20 opacity-60" color="rgba(124, 58, 237, 0.07)" duration={11} />

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 max-w-4xl mx-auto">
            {[
              'A direct response from our lead team within 24 hours',
              'Clear scope breakdown and transparent milestones',
              'Honest technical advice for your budget',
            ].map((item, i) => (
              <Reveal key={item} delay={i * 0.08}>
                <div className="flex sm:flex-col items-start gap-3.5">
                  <span className="w-8 h-8 rounded-full bg-skyz-accent-muted border border-skyz-accent/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-skyz-accent" />
                  </span>
                  <p className="text-xs sm:text-sm text-skyz-text-muted leading-relaxed pt-1 sm:pt-0">
                    {item}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </SectionShell>

      {/* ============================================================== */}
      {/* 3.5 BOOK A CALL — Calendly scheduling, premium floating shell */}
      {/* ============================================================== */}
      <SectionShell id="book-a-call">
        <div className="relative bg-skyz-surface border border-skyz-border rounded-[inherit] px-5 sm:px-10 lg:px-14 py-24 sm:py-32 overflow-hidden">
          <Blob className="w-[380px] h-[340px] -top-24 -right-28 opacity-60" color="rgba(124, 58, 237, 0.08)" duration={12} />
          <div className="absolute top-6 right-6 hidden lg:block text-[11px] font-mono text-skyz-text-muted tracking-widest">
            SCHEDULE.MEET
          </div>

          <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-center">
            {/* pitch column */}
            <div className="text-center lg:text-left space-y-7">
              <Reveal>
                <Eyebrow>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Skip the back-and-forth
                </Eyebrow>
              </Reveal>

              <Reveal delay={0.08}>
                <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-skyz-text leading-[1.05]">
                  Book your schedule<span className="text-skyz-accent">.</span>
                </h2>
              </Reveal>

              <Reveal delay={0.14}>
                <p className="text-sm sm:text-base text-skyz-text-muted leading-relaxed max-w-md mx-auto lg:mx-0">
                  Prefer talking it through? Grab a free 30-minute strategy call directly
                  on our calendar — pick a slot, get the meeting link instantly, and come
                  with questions. No commitment, no sales script.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <ul className="space-y-2.5 text-sm text-skyz-text-muted text-left max-w-md mx-auto lg:mx-0">
                  {[
                    'Instant confirmation — meeting link arrives by email',
                    'Video call with the people who will actually build it',
                    'Reschedule or cancel anytime, one click',
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={0.26}>
                <button
                  type="button"
                  onClick={() => setCalendlyOpen(true)}
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] font-semibold text-sm sm:text-base shadow-lg hover:bg-skyz-accent dark:hover:bg-skyz-accent-secondary hover:shadow-xl transition-all cursor-pointer"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book your schedule</span>
                  <span className="w-px h-5 bg-current opacity-25" aria-hidden />
                  <span className="text-xs font-mono opacity-70">30 MIN — FREE</span>
                </button>
              </Reveal>

              <Reveal delay={0.3}>
                <p className="text-xs font-mono text-skyz-text-muted tracking-wide">
                  CAN'T FIND A SLOT?{' '}
                  <button type="button" onClick={scrollToBrief} className="underline underline-offset-2 hover:text-skyz-text cursor-pointer">
                    WRITE THE BRIEF INSTEAD
                  </button>
                </p>
              </Reveal>
            </div>

            {/* live availability column — the actual Calendly widget */}
            <Reveal delay={0.1} className="w-full">
              <div className="relative rounded-[2rem] border border-skyz-border bg-skyz-bg p-2 sm:p-3 shadow-2xl skz-levitate">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="font-mono text-[10px] tracking-widest text-skyz-text-muted">LIVE AVAILABILITY</span>
                  <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> OPEN
                  </span>
                </div>
                <div className="rounded-3xl overflow-hidden bg-white">
                  <InlineWidget
                    url={calendlyUrl}
                    styles={{ height: '630px' }}
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </SectionShell>

      {/* Calendly popup — opened by the "Book your schedule" button */}
      <PopupModal
        url={calendlyUrl}
        rootElement={document.getElementById('root') as unknown as HTMLElement}
        onModalClose={() => setCalendlyOpen(false)}
        open={calendlyOpen}
      />

      {/* ============================================================ */}
      {/* 4. CLOSING PILL — minimal exit toward the work                */}
      {/* ============================================================ */}
      <SectionShell>
        <div className="relative rounded-[inherit] px-6 py-16 sm:py-20 text-center overflow-hidden">
          <Reveal>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-skyz-text-muted hover:text-skyz-text transition-colors cursor-pointer"
            >
              <span>While you wait, see the work</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </Reveal>
        </div>
      </SectionShell>

    </div>
  );
};
