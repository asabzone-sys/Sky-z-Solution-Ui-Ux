/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * Locks page scroll while `locked` is true (html + body, restored on release).
 * Used by surfaces that embed third-party overlays (e.g. the Calendly
 * popup), whose own chrome never locks the page underneath.
 */
export const usePageScrollLock = (locked: boolean) => {
  useEffect(() => {
    if (!locked) return;
    const restore: Array<[HTMLElement, string]> = [];
    for (const target of [document.documentElement, document.body] as HTMLElement[]) {
      restore.push([target, target.style.overflow]);
      target.style.overflow = 'hidden';
    }
    return () => {
      for (const [target, prev] of restore) target.style.overflow = prev;
    };
  }, [locked]);
};

/**
 * Renders children into a portal attached directly to <body>.
 *
 * Why this exists: any ancestor with a CSS `transform`, `filter`,
 * `perspective`, or `will-change: transform` becomes the *containing block*
 * for `position: fixed` descendants (CSS spec) — those "fixed" elements then
 * position against that ancestor instead of the viewport. This app animates
 * page transitions and scroll-story sections with exactly such properties,
 * which anchored the Work-page modal to an off-screen transformed ancestor:
 * it only "appeared" after scrolling dragged that ancestor into view.
 *
 * Portaling to <body> (which carries no transform) restores true viewport
 * positioning. Mounting also locks background scroll while open.
 */
export const ModalPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const el = useRef<HTMLDivElement | null>(null);
  if (!el.current && typeof document !== 'undefined') {
    el.current = document.createElement('div');
  }

  useEffect(() => {
    const host = el.current;
    if (!host) return;
    document.body.appendChild(host);
    const restore: Array<[HTMLElement, string]> = [];
    for (const target of [document.documentElement, document.body] as HTMLElement[]) {
      restore.push([target, target.style.overflow]);
      target.style.overflow = 'hidden';
    }
    return () => {
      document.body.removeChild(host);
      for (const [target, prev] of restore) target.style.overflow = prev;
    };
  }, []);

  if (!el.current || typeof document === 'undefined') return null;
  return createPortal(children, el.current);
};
