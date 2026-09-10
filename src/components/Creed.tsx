import React from 'react';
import { CREED_ITEMS } from '../data/content';

export const Creed: React.FC = () => {
  return (
    <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-skyz-bg border-t border-skyz-border transition-colors duration-200" id="principles">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-skyz-surface mb-3 border border-skyz-border shadow-sm">
            <span className="text-xs text-skyz-text-muted uppercase tracking-wider font-semibold">
              04 // Operating Principles
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-skyz-text tracking-tight font-bold">
            Focused on Outcomes.
          </h2>
          <p className="text-base text-skyz-text-muted mt-2">
            Every client engagement is anchored around our three core operational pillars.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {CREED_ITEMS.map((item, idx) => (
            <div
              key={item.word}
              className="p-6 sm:p-8 rounded-3xl bg-skyz-surface hover:border-skyz-accent/40 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-skyz-border"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-skyz-accent font-bold">0{idx + 1}</span>
                <span className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-skyz-text tracking-tight">
                  {item.word}
                </span>
                <span className="hidden sm:inline text-xs font-mono px-2 py-0.5 rounded-full bg-skyz-surface-subtle text-skyz-text-muted border border-skyz-border">
                  {item.pillar}
                </span>
              </div>
              <p className="text-sm sm:text-base text-skyz-text-muted max-w-xl md:text-right leading-relaxed font-normal">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
