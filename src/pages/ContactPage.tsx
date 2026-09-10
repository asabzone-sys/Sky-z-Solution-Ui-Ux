import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Send, 
  Check, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

export const ContactPage: React.FC = () => {
  const { selectedServiceCategory } = useNavigation();

  // Form State with exactly the approved fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: selectedServiceCategory || 'BUILD',
    projectDescription: '',
    budget: '$5,000 - $15,000',
    additionalRequirements: ''
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const budgetOptions = [
    '< $5,000',
    '$5,000 - $15,000',
    '$15,000 - $30,000',
    '$30,000+'
  ];

  const serviceOptions = [
    { value: 'BUILD', label: 'BUILD — Web Development, Web Apps & Custom Software' },
    { value: 'GROW', label: 'GROW — SEO, Digital Marketing & Creative Assets' },
    { value: 'AUTOMATE', label: 'AUTOMATE — AI Agents, Workflows & API Integrations' }
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Valid email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email format';
    }
    if (!formData.company.trim()) {
      newErrors.company = 'Company or organization is required';
    }
    if (!formData.projectDescription.trim()) {
      newErrors.projectDescription = 'Please provide a brief description of your project scope';
    } else if (formData.projectDescription.trim().length < 15) {
      newErrors.projectDescription = 'Project description must be at least 15 characters';
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
      projectDescription: true,
      budget: true,
      additionalRequirements: true
    });

    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate prompt verification and brief dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({
      name: '',
      email: '',
      company: '',
      service: 'BUILD',
      projectDescription: '',
      budget: '$5,000 - $15,000',
      additionalRequirements: ''
    });
    setTouched({});
    setErrors({});
  };

  return (
    <div className="w-full bg-skyz-bg text-skyz-text transition-colors duration-200">
      {/* HERO SECTION WITH EDITORIAL STATEMENT */}
      <section className="w-full pt-12 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b border-skyz-border bg-dots-pattern relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Tag */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-skyz-surface border border-skyz-border shadow-sm">
              <span className="w-2 h-2 rounded-full bg-skyz-accent animate-pulse" />
              <span className="text-xs text-skyz-text-muted uppercase tracking-wider font-semibold">
                Direct Technical Scoping
              </span>
            </div>
            <span className="hidden sm:inline-block font-mono text-xs text-skyz-text-muted">
              AUTHENTIC INQUIRY // CONFIDENTIALITY GUARANTEED
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Editorial Statement */}
            <div className="lg:col-span-5 space-y-6">
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-skyz-text leading-[1.08]">
                HAVE AN IDEA?{' '}
                <span className="text-skyz-accent block">
                  LET’S BUILD IT.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-skyz-text-muted leading-relaxed">
                Connect directly with our engineering team to scope your web application, growth engine, or AI agent workflow.
              </p>

              <div className="p-6 rounded-3xl bg-skyz-surface border border-skyz-border shadow-sm space-y-4">
                <h2 className="font-display text-base font-bold text-skyz-text">
                  What Happens Next?
                </h2>
                <ul className="space-y-3 text-xs sm:text-sm text-skyz-text-muted">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-skyz-accent flex-shrink-0 mt-0.5" />
                    <span>Technical feasibility & architecture assessment</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-skyz-accent flex-shrink-0 mt-0.5" />
                    <span>Direct roadmap and transparent budget milestones</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-skyz-accent flex-shrink-0 mt-0.5" />
                    <span>Confidential NDA assurance before code discussion</span>
                  </li>
                </ul>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-2 flex flex-wrap gap-4 text-xs text-skyz-text-muted">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-skyz-accent" />
                  <span>Confidentiality Assured</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-skyz-accent" />
                  <span>Direct Engineering Review</span>
                </div>
              </div>
            </div>

            {/* Right Contact Form (Approved Fields) */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-skyz-surface border border-skyz-border p-6 sm:p-10 shadow-xl">
                {isSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center flex flex-col items-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
                      <Check className="w-8 h-8" />
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-skyz-text">
                      Project Brief Transmitted
                    </h2>
                    <p className="text-sm sm:text-base text-skyz-text-muted max-w-md">
                      Thank you, <span className="font-semibold text-skyz-text">{formData.name}</span>. Your brief for <span className="font-semibold text-skyz-text">{formData.company}</span> has been logged into our technical triage pipeline.
                    </p>
                    <div className="p-4 rounded-2xl bg-skyz-surface-subtle border border-skyz-border text-xs font-mono text-skyz-text-muted text-left w-full max-w-md mt-4">
                      <div><span className="text-skyz-text font-bold">Category:</span> {formData.service}</div>
                      <div><span className="text-skyz-text font-bold">Budget Tier:</span> {formData.budget}</div>
                      <div><span className="text-skyz-text font-bold">Inquiry Status:</span> Received &amp; Queued for Technical Review</div>
                    </div>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="mt-6 px-6 py-2.5 rounded-full bg-skyz-surface border border-skyz-border text-skyz-text text-xs font-semibold hover:bg-skyz-surface-subtle transition-all cursor-pointer"
                    >
                      Submit Another Inquiry
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    <div className="border-b border-skyz-border pb-4 mb-6">
                      <h2 className="font-display text-xl font-bold text-skyz-text">
                        Project Brief Submission
                      </h2>
                      <p className="text-xs text-skyz-text-muted mt-1">
                        Please fill in the approved technical scoping parameters below.
                      </p>
                    </div>

                    {/* Field 1 & 2: Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label 
                          htmlFor="name" 
                          className="block text-xs font-semibold uppercase tracking-wider text-skyz-text mb-1.5"
                        >
                          Full Name <span className="text-skyz-accent">*</span>
                        </label>
                        <input
                          id="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          onBlur={() => handleBlur('name')}
                          placeholder="Jane Doe"
                          className={`w-full px-4 py-3 rounded-2xl bg-skyz-surface-subtle border text-sm text-skyz-text focus:outline-none transition-colors ${
                            touched.name && errors.name 
                              ? 'border-red-500 ring-1 ring-red-500' 
                              : 'border-skyz-border focus:border-skyz-accent focus:ring-1 focus:ring-skyz-accent'
                          }`}
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
                          className="block text-xs font-semibold uppercase tracking-wider text-skyz-text mb-1.5"
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
                          placeholder="jane@company.com"
                          className={`w-full px-4 py-3 rounded-2xl bg-skyz-surface-subtle border text-sm text-skyz-text focus:outline-none transition-colors ${
                            touched.email && errors.email 
                              ? 'border-red-500 ring-1 ring-red-500' 
                              : 'border-skyz-border focus:border-skyz-accent focus:ring-1 focus:ring-skyz-accent'
                          }`}
                        />
                        {touched.email && errors.email && (
                          <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.email}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Field 3: Company */}
                    <div>
                      <label 
                        htmlFor="company" 
                        className="block text-xs font-semibold uppercase tracking-wider text-skyz-text mb-1.5"
                      >
                        Company / Organization <span className="text-skyz-accent">*</span>
                      </label>
                      <input
                        id="company"
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        onBlur={() => handleBlur('company')}
                        placeholder="Acme Technologies Ltd."
                        className={`w-full px-4 py-3 rounded-2xl bg-skyz-surface-subtle border text-sm text-skyz-text focus:outline-none transition-colors ${
                          touched.company && errors.company 
                            ? 'border-red-500 ring-1 ring-red-500' 
                            : 'border-skyz-border focus:border-skyz-accent focus:ring-1 focus:ring-skyz-accent'
                        }`}
                      />
                      {touched.company && errors.company && (
                        <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.company}
                        </span>
                      )}
                    </div>

                    {/* Field 4: Service (BUILD, GROW, AUTOMATE) */}
                    <div>
                      <label 
                        htmlFor="service" 
                        className="block text-xs font-semibold uppercase tracking-wider text-skyz-text mb-1.5"
                      >
                        Service Pillar <span className="text-skyz-accent">*</span>
                      </label>
                      <select
                        id="service"
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl bg-skyz-surface-subtle border border-skyz-border text-sm text-skyz-text focus:outline-none focus:border-skyz-accent cursor-pointer"
                      >
                        {serviceOptions.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-skyz-surface text-skyz-text">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Field 5: Project Description */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label 
                          htmlFor="projectDescription" 
                          className="block text-xs font-semibold uppercase tracking-wider text-skyz-text"
                        >
                          Project Description <span className="text-skyz-accent">*</span>
                        </label>
                        <span className="text-[11px] font-mono text-skyz-text-muted">
                          {formData.projectDescription.length} chars
                        </span>
                      </div>
                      <textarea
                        id="projectDescription"
                        required
                        rows={4}
                        value={formData.projectDescription}
                        onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                        onBlur={() => handleBlur('projectDescription')}
                        placeholder="Describe your current challenge, target deliverables, user volumes, and technical expectations..."
                        className={`w-full px-4 py-3 rounded-2xl bg-skyz-surface-subtle border text-sm text-skyz-text focus:outline-none transition-colors ${
                          touched.projectDescription && errors.projectDescription 
                            ? 'border-red-500 ring-1 ring-red-500' 
                            : 'border-skyz-border focus:border-skyz-accent focus:ring-1 focus:ring-skyz-accent'
                        }`}
                      />
                      {touched.projectDescription && errors.projectDescription && (
                        <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.projectDescription}
                        </span>
                      )}
                    </div>

                    {/* Field 6: Budget */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-skyz-text mb-2">
                        Target Budget Allocation
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {budgetOptions.map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setFormData({ ...formData, budget: b })}
                            className={`py-2.5 px-3 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                              formData.budget === b
                                ? 'bg-skyz-text text-skyz-bg border-skyz-text shadow-sm'
                                : 'bg-skyz-surface-subtle text-skyz-text-muted border-skyz-border hover:border-skyz-accent/40'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Field 7: Additional Requirements */}
                    <div>
                      <label 
                        htmlFor="additionalRequirements" 
                        className="block text-xs font-semibold uppercase tracking-wider text-skyz-text mb-1.5"
                      >
                        Additional Requirements (Optional)
                      </label>
                      <input
                        id="additionalRequirements"
                        type="text"
                        value={formData.additionalRequirements}
                        onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                        placeholder="Security compliance, target completion date, integration endpoints..."
                        className="w-full px-4 py-3 rounded-2xl bg-skyz-surface-subtle border border-skyz-border text-sm text-skyz-text focus:outline-none focus:border-skyz-accent"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] font-bold text-sm sm:text-base shadow-lg hover:bg-skyz-accent dark:hover:bg-skyz-accent-secondary hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                          <span>Transmitting Brief...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Project Brief</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
