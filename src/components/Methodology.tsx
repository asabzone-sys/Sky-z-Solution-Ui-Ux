import React from 'react';
import { motion } from 'motion/react';
import { Search, Palette, Terminal, CheckCircle2 } from 'lucide-react';
import { METHODOLOGY_STEPS } from '../data/content';
import { Reveal, SectionShell, Eyebrow } from '../components/OpalKit';

export const Methodology: React.FC = () => {
  const stepIcons = [
    <Search key="discover" className="w-5 h-5 text-skyz-accent" />,
    <Palette key="design" className="w-5 h-5 text-skyz-accent" />,
    <Terminal key="engineer" className="w-5 h-5 text-skyz-accent" />,
    <CheckCircle2 key="deploy" className="w-5 h-5 text-skyz-accent" />
  ];

  return (
    <SectionShell id="methodology">
      <div className="bg-skyz-bg border border-skyz-border rounded-[inherit] px-5 sm:px-12 py-16 sm:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="max-w-2xl space-y-4 mb-12 sm:mb-16">
              <Eyebrow>Development Lifecycle</Eyebrow>
              <h2 className="font-display text-3xl sm:text-5xl text-skyz-text tracking-tight font-bold">
                Disciplined delivery.
              </h2>
              <p className="text-base sm:text-lg text-skyz-text-muted leading-relaxed">
                A structured engineering framework guiding each project from requirements through launch.
              </p>
            </div>
          </Reveal>

          {/* 4 Methodology Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {METHODOLOGY_STEPS.map((step, idx) => (
              <Reveal key={step.number} delay={idx * 0.07} className="h-full">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="p-6 rounded-[1.75rem] bg-skyz-surface shadow-sm border border-skyz-border hover:border-skyz-accent/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full"
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
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
};
