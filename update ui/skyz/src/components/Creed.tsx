import React from 'react';
import { motion } from 'motion/react';
import { CREED_ITEMS } from '../data/content';
import { Reveal, SectionShell, Blob, Eyebrow } from '../components/OpalKit';

export const Creed: React.FC = () => {
  return (
    <SectionShell id="principles">
      <div className="bg-skyz-surface border border-skyz-border rounded-[inherit] px-5 sm:px-12 py-16 sm:py-24 relative overflow-hidden">
        <Blob className="w-[340px] h-[310px] -bottom-24 -right-24 opacity-70" color="rgba(124, 58, 237, 0.06)" duration={12} />

        <div className="relative z-10 max-w-7xl mx-auto">
          <Reveal>
            <div className="max-w-xl space-y-4 mb-12">
              <Eyebrow>Operating Principles</Eyebrow>
              <h2 className="font-display text-3xl sm:text-5xl text-skyz-text tracking-tight font-bold">
                Focused on outcomes.
              </h2>
              <p className="text-base text-skyz-text-muted">
                Every engagement is anchored around our three operational pillars.
              </p>
            </div>
          </Reveal>

          <div className="space-y-5">
            {CREED_ITEMS.map((item, idx) => (
              <Reveal key={item.word} delay={idx * 0.07}>
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="p-6 sm:p-8 rounded-[2rem] bg-skyz-bg hover:border-skyz-accent/40 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-skyz-border"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-skyz-accent font-bold">0{idx + 1}</span>
                    <span className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-skyz-text tracking-tight">
                      {item.word}
                    </span>
                    <span className="hidden sm:inline text-[10px] font-mono px-2.5 py-1 rounded-full bg-skyz-surface-subtle text-skyz-text-muted border border-skyz-border">
                      {item.pillar}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-skyz-text-muted max-w-xl md:text-right leading-relaxed font-normal">
                    {item.description}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
};
