import React, { useState } from 'react';
import { ArrowRight, Check, ShieldCheck, Clock, Send } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

export const ContactCTA: React.FC = () => {
  const { navigate } = useNavigation();
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', projectType: 'BUILD', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setInquiryModalOpen(false);
      setFormData({ name: '', email: '', projectType: 'BUILD', message: '' });
    }, 2000);
  };

  return (
    <section className="w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-skyz-bg border-t border-skyz-border relative overflow-hidden transition-colors duration-200" id="contact">
      {/* Subtle SkyZ Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-skyz-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-skyz-surface mb-6 border border-skyz-border shadow-sm">
          <span className="w-2 h-2 rounded-full bg-skyz-accent animate-pulse" />
          <span className="text-xs text-skyz-text font-semibold tracking-wide">
            Project Scoping & Architecture
          </span>
        </div>

        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-skyz-text tracking-tight font-bold max-w-2xl mx-auto">
          Have an idea?{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-skyz-text via-skyz-accent to-skyz-accent-secondary">
            Let’s build it.
          </span>
        </h2>

        <p className="text-base sm:text-lg text-skyz-text-muted max-w-xl mx-auto mt-4 leading-relaxed">
          Partner with our team to prototype, engineer, and deploy high-performance web applications, targeted digital growth engines, and autonomous AI automation.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <button
            type="button"
            id="start-project-brief-btn"
            onClick={() => navigate('contact')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] font-semibold text-sm sm:text-base shadow-md hover:bg-skyz-accent dark:hover:bg-skyz-accent-secondary hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Start a Project Brief</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            id="explore-services-btn"
            onClick={() => navigate('services')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-skyz-surface text-skyz-text font-medium text-sm sm:text-base border border-skyz-border hover:border-skyz-accent/40 shadow-sm transition-all cursor-pointer"
          >
            <span>Explore Services</span>
          </button>
        </div>

        {/* Neutral Assurances (No fabricated certifications) */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-12 text-xs text-skyz-text-muted">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-skyz-accent" />
            <span>Confidentiality Assured</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-skyz-accent" />
            <span>Direct Technical Scoping</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-skyz-accent" />
            <span>Transparent Milestones</span>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-skyz-surface rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-skyz-border relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setInquiryModalOpen(false)}
              className="absolute top-4 right-4 text-skyz-text-muted hover:text-skyz-text p-2 rounded-full hover:bg-skyz-surface-subtle"
            >
              ✕
            </button>
            <h3 className="font-display text-2xl font-bold text-skyz-text mb-2">Project Brief</h3>
            <p className="text-sm text-skyz-text-muted mb-6">
              Tell us about your upcoming web application, digital growth goals, or AI automation needs.
            </p>

            {submitted ? (
              <div className="py-10 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-display text-lg font-bold text-skyz-text">Brief Received</h4>
                <p className="text-sm text-skyz-text-muted">Our team will review your specifications and be in touch promptly.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-skyz-text-muted mb-1">
                    Your Name / Company
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-skyz-border bg-skyz-surface-subtle text-skyz-text text-sm focus:outline-none focus:border-skyz-accent"
                    placeholder="Alex Rivera, Acme Corp"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-skyz-text-muted mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-skyz-border bg-skyz-surface-subtle text-skyz-text text-sm focus:outline-none focus:border-skyz-accent"
                    placeholder="alex@company.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-skyz-text-muted mb-1">
                    Core Focus Area
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-skyz-border bg-skyz-surface-subtle text-skyz-text text-sm focus:outline-none focus:border-skyz-accent"
                  >
                    <option value="BUILD">BUILD — Websites, Web Apps & Custom Software</option>
                    <option value="GROW">GROW — SEO, Marketing & Creative Assets</option>
                    <option value="AUTOMATE">AUTOMATE — AI Agents, Workflows & API Integrations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-skyz-text-muted mb-1">
                    Project Scope Summary
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-skyz-border bg-skyz-surface-subtle text-skyz-text text-sm focus:outline-none focus:border-skyz-accent"
                    placeholder="Briefly describe your objectives, existing systems, and target timeline..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] font-semibold text-sm shadow-md hover:bg-skyz-accent dark:hover:bg-skyz-accent-secondary transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Submit Project Brief</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
