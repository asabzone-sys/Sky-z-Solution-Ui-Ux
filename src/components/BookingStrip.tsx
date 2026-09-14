/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { PopupModal } from 'react-calendly';
import { Calendar, ArrowUpRight } from 'lucide-react';
import { Reveal } from './OpalKit';
import { usePageScrollLock } from './ModalPortal';
import { CALENDLY_URL } from '../lib/calendly';

/**
 * BookingStrip — the compact home-page booking band.
 *
 * One beat tall: a display line, an "appointment ticket" (clock + call
 * action inside one rounded tile so the column never looks stacked or
 * accidental), and nothing else. The calendar itself opens in the Calendly
 * popup — the full scheduler lives on /contact.
 *
 * Design notes: the glow is a radial-gradient on the shell (no Blob divs —
 * hard circle edges were bleeding past the card corners and reading as a
 * stray scrollbar). Everything stays inside the theme's rounded language.
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
    <span className="inline-flex items-center gap-2 text-[11px] font-mono text-skyz-text-muted tracking-wider">
      <span className="relative flex h-2 w-2" aria-hidden>
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-40 animate-ping" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      LOCAL TIME — {time}
      {tz && <span className="opacity-60 hidden sm:inline">({tz})</span>}
    </span>
  );
};

export const BookingStrip: React.FC = () => {
  const [open, setOpen] = useState(false);
  // The Calendly popup never locks the page beneath itself — do it here so
  // the site scrollbar doesn't sit beside the modal.
  usePageScrollLock(open);

  return (
    <section className="relative w-full px-2 sm:px-4 lg:px-6 py-6 sm:py-10" aria-label="Book a call">
      <div
        className="relative bg-skyz-surface border border-skyz-border rounded-[2.5rem] px-6 sm:px-12 py-14 sm:py-20 overflow-hidden"
        style={{
          backgroundImage:
            'radial-gradient(560px 320px at 12% 0%, rgba(124, 58, 237, 0.07), transparent 65%), radial-gradient(480px 300px at 92% 100%, rgba(56, 189, 248, 0.06), transparent 65%)',
        }}
      >
        {/* powered-on hairline along the top edge */}
        <div
          aria-hidden
          className="absolute top-0 inset-x-12 h-px bg-gradient-to-r from-transparent via-skyz-accent/50 to-transparent"
        />
        {/* corner ticks — quiet machine-plate detail, matches the mono labels */}
        <span aria-hidden className="absolute top-5 left-6 w-3 h-3 border-t border-l border-skyz-border rounded-tl-lg" />
        <span aria-hidden className="absolute top-5 right-6 w-3 h-3 border-t border-r border-skyz-border rounded-tr-lg" />
        <span aria-hidden className="absolute bottom-5 left-6 w-3 h-3 border-b border-l border-skyz-border rounded-bl-lg" />
        <span aria-hidden className="absolute bottom-5 right-6 w-3 h-3 border-b border-r border-skyz-border rounded-br-lg" />

        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-7">
          <Reveal>
            <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-skyz-text leading-[1.08]">
              Skip the inbox.
              <span className="text-skyz-accent"> Talk soon.</span>
            </h3>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="text-sm sm:text-base text-skyz-text-muted max-w-md mx-auto leading-relaxed">
              One free 30-minute call — pick a slot, get the link instantly.
              The full scheduler lives on the{' '}
              <span className="font-semibold text-skyz-text">contact page</span>.
            </p>
          </Reveal>

          {/* appointment ticket — clock and action live in one rounded tile */}
          <Reveal delay={0.14}>
            <div className="inline-flex flex-col items-stretch rounded-[1.75rem] border border-skyz-border bg-skyz-bg/70 backdrop-blur-sm shadow-lg overflow-hidden">
              <div className="flex items-center justify-center px-7 py-3.5 border-b border-skyz-border/70">
                <LiveClock />
              </div>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="group inline-flex items-center justify-center gap-3 px-7 py-4 bg-linear-to-r from-skyz-accent to-skyz-accent-secondary text-white font-semibold text-sm sm:text-[15px] hover:brightness-110 transition-all cursor-pointer"
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/15 border border-white/20 transition-transform group-hover:scale-105" aria-hidden>
                  <Calendar className="w-3.5 h-3.5" />
                </span>
                <span>Book a 30-min call</span>
                <ArrowUpRight className="w-4 h-4 opacity-80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-[11px] font-mono tracking-widest text-skyz-text-muted">
              FREE · NO COMMITMENT · REPLY WITHIN 24H
            </p>
          </Reveal>
        </div>
      </div>

      <PopupModal
        url={CALENDLY_URL}
        rootElement={document.getElementById('root') as HTMLElement}
        onModalClose={() => setOpen(false)}
        open={open}
        pageSettings={{
          // calendar-only layout: no details panel → no internal scrollbar,
          // and the accents pick up the brand purple
          hideEventTypeDetails: true,
          primaryColor: '7c3aed',
        }}
      />
    </section>
  );
};
