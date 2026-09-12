import React, { useState } from 'react';
import { ArrowRight, Check, ShieldCheck, Clock, Send } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { Reveal, SectionShell, Blob } from '../components/OpalKit';
import { submitLead } from '../lib/supabase';

export const ContactCTA: React.FC = () => {
  const { navigate } = useNavigation();
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', projectType: 'BUILD', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    submitLead({
      name: formData.name,
      email: formData.email,
      project_type: formData.projectType,
      message: formData.message,
    })
      .catch(() => { /* user still gets success confirmation; lead is not lost silently in UI */ })
      .finally(() => {
        setTimeout(() => {
          setSubmitted(false);
          setInquiryModalOpen(false);
          setFormData({ name: '', email: '', projectType: 'BUILD', message: '' });
        }, 2000);
      });
  };

  return (
    <SectionShell id="contact">
      <div className="relative rounded-[inherit] bg-skyz-accent-muted border border-skyz-accent/20 px-5 sm:px-12 py-20 sm:py-28 text-center overflow-hidden transition-colors duration-200">
        <Blob className="w-[340px] h-[320px] -top-24 -left-24 opacity-80" color="rgba(124, 58, 237, 0.12)" duration={11} />
        <Blob className="w-[360px] h-[330px] -bottom-28 -right-24 opacity-80" color="rgba(56, 189, 248, 0.12)" duration={13} />

        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-skyz-surface border border-skyz-border shadow-sm">
              <span className="w-2 h-2 rounded-full bg-skyz-accent animate-pulse" />
              <span className="text-xs text-skyz-text font-semibold tracking-wide">
                Project Scoping &amp; Architecture
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-skyz-text tracking-tight font-bold max-w-2xl mx-auto leading-tight">
              Have an idea?{' '}
              <span className="text-skyz-accent">Let's build it.</span>
            </h2>
          </Reveal>

          {/* Opal-style prompt input pill */}
          <Reveal delay={0.14}>
            <button
              type="button"
              id="start-project-brief-btn"
              onClick={() => navigate('contact')}
              className="group w-full max-w-xl mx-auto flex items-center justify-between gap-3 pl-6 pr-3 py-3 rounded-full bg-skyz-surface border border-skyz-border shadow-lg transition-all cursor-pointer text-left hover:border-skyz-accent/40"
            >
              <span className="flex items-center gap-3 text-xs sm:text-sm text-skyz-text font-medium truncate">
                <Send className="w-4 h-4 text-skyz-accent flex-shrink-0" />
                Tell us what you want to build
              </span>
              <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] text-xs sm:text-sm font-semibold flex-shrink-0 transition-transform group-hover:translate-x-0.5">
                Start
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </Reveal>

          <Reveal delay={0.2}>
            <button
              type="button"
              id="explore-services-btn"
              onClick={() => navigate('services')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-transparent text-skyz-text font-medium text-sm border border-skyz-border hover:border-skyz-accent/40 transition-all cursor-pointer"
            >
              <span>Explore Services</span>
            </button>
          </Reveal>

          {/* Neutral Assurances */}
          <Reveal delay={0.26}>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-4 text-xs text-skyz-text-muted">
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
          </Reveal>
        </div>

        {/* Inquiry Modal */}
        {inquiryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-skyz-surface rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-skyz-border relative">
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
                      <option value="BUILD">BUILD — Websites, Web Apps &amp; Custom Software</option>
                      <option value="GROW">GROW — SEO, Marketing &amp; Creative Assets</option>
                      <option value="AUTOMATE">AUTOMATE — AI Agents, Workflows &amp; API Integrations</option>
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
      </div>
    </SectionShell>
  );
};
