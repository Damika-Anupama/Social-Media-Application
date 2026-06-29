'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'pulse.preferences.v1';

export type Preferences = {
  /** User-forced reduced motion, independent of the OS-level setting. */
  reduceMotion: boolean;
  /** Slightly larger base type for readability. */
  largerType: boolean;
};

export const DEFAULT_PREFERENCES: Preferences = {
  reduceMotion: false,
  largerType: false,
};

/** Parse persisted preferences, tolerating absent keys and corrupt JSON. */
export function parsePreferences(raw: string | null): Preferences {
  if (!raw) return { ...DEFAULT_PREFERENCES };
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { ...DEFAULT_PREFERENCES };
    return {
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

  // Reflect preferences as classes on the document root.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('reduce-motion', preferences.reduceMotion);
    root.classList.toggle('text-larger', preferences.largerType);
  }, [preferences]);

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
