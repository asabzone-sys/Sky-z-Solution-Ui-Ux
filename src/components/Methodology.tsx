import React from 'react';
import { Search, Palette, Terminal, CheckCircle2 } from 'lucide-react';
import { METHODOLOGY_STEPS } from '../data/content';

export const Methodology: React.FC = () => {
  const stepIcons = [
    <Search key="discover" className="w-5 h-5 text-skyz-accent" />,
    <Palette key="design" className="w-5 h-5 text-skyz-accent" />,
    <Terminal key="engineer" className="w-5 h-5 text-skyz-accent" />,
    <CheckCircle2 key="deploy" className="w-5 h-5 text-skyz-accent" />
  ];

  return (
    <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-skyz-bg border-t border-skyz-border transition-colors duration-200" id="methodology">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-skyz-surface mb-3 border border-skyz-border shadow-sm">
            <span className="text-xs text-skyz-text-muted uppercase tracking-wider font-semibold">
              03 // Development Lifecycle
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-skyz-text tracking-tight font-bold">
            Disciplined Delivery.
          </h2>
          <p className="text-base sm:text-lg text-skyz-text-muted mt-3 leading-relaxed">
            A structured engineering framework guiding each project from initial requirements and architecture through rigorous design, implementation, and launch.
          </p>
        </div>

        {/* 4 Methodology Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {METHODOLOGY_STEPS.map((step, idx) => (
            <div
              key={step.number}
              className="p-6 rounded-3xl bg-skyz-surface shadow-sm border border-skyz-border hover:border-skyz-accent/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-skyz-surface-subtle border border-skyz-border flex items-center justify-center">
                    {stepIcons[idx]}
                  </div>
                  <span className="font-display text-2xl font-bold text-skyz-text-muted/30">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-skyz-text">
                  {step.title}
                </h3>
                <p className="text-sm text-skyz-text-muted mt-2 leading-relaxed">
                  {step.description}
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-skyz-border">
                <span className="text-xs font-semibold text-skyz-accent">
                  {step.deliverable}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
