/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { PopupModal } from 'react-calendly';
import { Calendar, ArrowUpRight } from 'lucide-react';
import { Reveal, Blob, FloatingTag } from './OpalKit';
import { CALENDLY_URL } from '../lib/calendly';

/**
 * BookingStrip — the compact home-page booking band.
 *
 * Deliberately one beat tall: a display line, a live clock (proof someone is
 * home), and one action. The calendar itself opens in the Calendly popup so
 * the strip never grows — the full scheduling surface lives on /contact.
 */

/** Ticking local time — isolated so only this chip re-renders each second. */
const LiveClock: React.FC = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const time = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  let tz = '';
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').pop() ?? ''; } catch { /* ignore */ }
  return (
    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-skyz-surface-subtle border border-skyz-border text-[11px] font-mono text-skyz-text-muted tracking-wider">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
      LOCAL TIME — {time} {tz && <span className="opacity-60">({tz})</span>}
    </span>
  );
};

export const BookingStrip: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative w-full px-2 sm:px-4 lg:px-6 py-6 sm:py-10" aria-label="Book a call">
      <div className="relative bg-skyz-surface border border-skyz-border rounded-[2rem] px-6 sm:px-12 py-12 sm:py-16 overflow-hidden">
        <Blob className="w-[320px] h-[280px] -top-20 -left-24 opacity-60" color="rgba(124, 58, 237, 0.08)" duration={11} />
        <Blob className="w-[260px] h-[240px] -bottom-16 right-[12%] opacity-50" color="rgba(56, 189, 248, 0.07)" duration={13} />
        {/* hairline shimmer along the top edge — the strip feels powered-on */}
        <div
          aria-hidden
          className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-skyz-accent/50 to-transparent"
        />

        <FloatingTag
          className="top-6 right-[6%] hidden lg:block bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
          delay={0.6}
        >
          ✦ NO COMMITMENT
        </FloatingTag>

        <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-[1.2fr_auto] gap-8 md:gap-12 items-center">
          {/* pitch */}
          <div className="text-center md:text-left">
            <Reveal>
              <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-skyz-text leading-[1.05]">
                Skip the inbox.
                <span className="text-skyz-accent"> Talk soon.</span>
              </h3>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-3 text-sm sm:text-base text-skyz-text-muted max-w-md mx-auto md:mx-0 leading-relaxed">
                One free 30-minute call — pick a slot, get the link instantly.
                The full scheduler lives on the <span className="font-semibold text-skyz-text">contact page</span>.
              </p>
            </Reveal>
          </div>

          {/* action column */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <Reveal delay={0.12}>
              <LiveClock />
            </Reveal>
            <Reveal delay={0.16}>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-skyz-text dark:bg-skyz-accent text-white dark:text-[#080B10] font-semibold text-sm shadow-lg hover:bg-skyz-accent dark:hover:bg-skyz-accent-secondary hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a 30-min call</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </Reveal>
          </div>
        </div>
      </div>

      <PopupModal
        url={CALENDLY_URL}
        rootElement={document.getElementById('root') as HTMLElement}
        onModalClose={() => setOpen(false)}
        open={open}
      />
    </section>
  );
};
