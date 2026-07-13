'use client';

import { useEffect, useState } from 'react';
import { usePreferences } from '@/lib/PreferencesContext';

/**
 * Whether motion should be suppressed.
 *
 * globals.css already neutralises CSS animations for both the OS setting and
 * the in-app toggle. It cannot touch motion driven from JavaScript — a
 * `scrollIntoView({ behavior: 'smooth' })` overrides `scroll-behavior: auto`
 * per spec, so the messages thread kept smooth-scrolling at people who had
 * explicitly asked it not to. This is the JS-side half of the same rule, and
 * it honours both signals: the OS preference and the app's own switch.
 */
export function useReducedMotion(): boolean {
  const { preferences } = usePreferences();
  const [osPrefersReduced, setOsPrefersReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setOsPrefersReduced(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setOsPrefersReduced(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return osPrefersReduced || preferences.reduceMotion;
}

/** ScrollIntoView options that respect the preference. */
export function scrollBehavior(reduced: boolean): ScrollBehavior {
  return reduced ? 'auto' : 'smooth';
}
