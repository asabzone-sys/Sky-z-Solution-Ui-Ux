import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type MotionPreference = 'auto' | 'on' | 'off';

const STORAGE_KEY = 'skyz_motion_preference';

interface MotionPreferenceContextType {
  /** 'auto' follows the OS Reduce Motion setting; 'on' forces motion; 'off' forces static. */
  preference: MotionPreference;
  /** The effective result used by every animation gate in the app. */
  motionEnabled: boolean;
  setPreference: (p: MotionPreference) => void;
}

const MotionPreferenceContext = createContext<MotionPreferenceContextType>({
  preference: 'auto',
  motionEnabled: true,
  setPreference: () => {},
});

const readStored = (): MotionPreference => {
  if (typeof window === 'undefined') return 'auto';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'on' || saved === 'off' ? saved : 'auto';
  } catch {
    return 'auto';
  }
};

const readSystem = (): boolean => {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Resolves the effective motion flag:
 * - 'auto': follow the OS Reduce Motion setting live (the accessible default)
 * - 'on'  : force motion even if the OS asks for reduce (visitor override —
 *           the marketing-site escape hatch for phones whose system setting
 *           or in-app webview reports reduce-motion unintentionally)
 * - 'off' : force static even if the OS allows motion
 */
export const MotionPreferenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preference, setPreferenceState] = useState<MotionPreference>(readStored);
  const [systemAllows, setSystemAllows] = useState<boolean>(readSystem);

  // Live-track the OS setting while in 'auto' mode
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setSystemAllows(!mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const motionEnabled = preference === 'on' ? true : preference === 'off' ? false : systemAllows;

  // Mirror the effective value onto <body> so plain-CSS animations
  // (keyframes, CSS transitions) can gate without hooking into React.
  useEffect(() => {
    document.body.classList.toggle('motion-off', !motionEnabled);
    return () => document.body.classList.remove('motion-off');
  }, [motionEnabled]);

  const setPreference = useCallback((p: MotionPreference) => {
    setPreferenceState(p);
    try {
      if (p === 'auto') localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, p);
    } catch {
      // storage restricted — session-only preference
    }
  }, []);

  return (
    <MotionPreferenceContext.Provider value={{ preference, motionEnabled, setPreference }}>
      {children}
    </MotionPreferenceContext.Provider>
  );
};

export const useMotionPreference = () => useContext(MotionPreferenceContext);
