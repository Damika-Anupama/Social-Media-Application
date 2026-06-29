'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'pulse.preferences.v1';

export type Theme = 'system' | 'dark' | 'light';

export type Preferences = {
  /** Color theme; 'system' follows the OS preference. */
  theme: Theme;
  /** User-forced reduced motion, independent of the OS-level setting. */
  reduceMotion: boolean;
  /** Slightly larger base type for readability. */
  largerType: boolean;
};

export const DEFAULT_PREFERENCES: Preferences = {
  theme: 'dark',
  reduceMotion: false,
  largerType: false,
};

const THEMES: Theme[] = ['system', 'dark', 'light'];

/** Parse persisted preferences, tolerating absent keys and corrupt JSON. */
export function parsePreferences(raw: string | null): Preferences {
  if (!raw) return { ...DEFAULT_PREFERENCES };
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { ...DEFAULT_PREFERENCES };
    return {
      theme: THEMES.includes(parsed.theme) ? parsed.theme : DEFAULT_PREFERENCES.theme,
      reduceMotion:
        typeof parsed.reduceMotion === 'boolean'
          ? parsed.reduceMotion
          : DEFAULT_PREFERENCES.reduceMotion,
      largerType:
        typeof parsed.largerType === 'boolean' ? parsed.largerType : DEFAULT_PREFERENCES.largerType,
    };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

/** Resolve a theme choice to the concrete light/dark to apply. */
export function resolveTheme(theme: Theme, prefersLight: boolean): 'light' | 'dark' {
  if (theme === 'system') return prefersLight ? 'light' : 'dark';
  return theme;
}

type PreferencesContextValue = {
  preferences: Preferences;
  setPreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
};

const Ctx = createContext<PreferencesContextValue | null>(null);

/**
 * App-wide display preferences (Settings → Appearance), persisted to
 * localStorage and applied as classes on <html> so they take effect everywhere
 * immediately and survive reloads. A single provider owns the state so the
 * Settings toggles and the live UI stay in sync within the tab.
 */
export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);

  // Hydrate after mount (avoids SSR/client mismatch), and sync across tabs.
  useEffect(() => {
    setPreferences(parsePreferences(window.localStorage.getItem(STORAGE_KEY)));
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setPreferences(parsePreferences(window.localStorage.getItem(STORAGE_KEY)));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Reflect motion / type preferences as classes on the document root.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('reduce-motion', preferences.reduceMotion);
    root.classList.toggle('text-larger', preferences.largerType);
  }, [preferences.reduceMotion, preferences.largerType]);

  // Apply the theme, and (when set to 'system') react live to OS changes.
  useEffect(() => {
    const root = document.documentElement;
    const mql = window.matchMedia('(prefers-color-scheme: light)');
    const apply = () => {
      const resolved = resolveTheme(preferences.theme, mql.matches);
      root.classList.toggle('theme-light', resolved === 'light');
    };
    apply();
    if (preferences.theme === 'system') {
      mql.addEventListener('change', apply);
      return () => mql.removeEventListener('change', apply);
    }
  }, [preferences.theme]);

  const setPreference = useCallback<PreferencesContextValue['setPreference']>((key, value) => {
    setPreferences((prev) => {
      const next = { ...prev, [key]: value };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage full / disabled — keep the in-memory value.
      }
      return next;
    });
  }, []);

  return <Ctx.Provider value={{ preferences, setPreference }}>{children}</Ctx.Provider>;
}

export function usePreferences() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    return {
      preferences: DEFAULT_PREFERENCES,
      setPreference: () => {},
    } as PreferencesContextValue;
  }
  return ctx;
}
