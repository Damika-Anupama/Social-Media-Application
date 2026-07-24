'use client';

import { useCallback, useEffect, useState } from 'react';
import { writeJson } from '@/lib/storage';

const STORAGE_KEY = 'pulse.settings.v1';

/**
 * Every persisted switch on the Settings page, with its shipped default.
 *
 * Appearance lives in PreferencesContext (it has to apply before paint); this
 * covers the rest, which were previously pure theatre — they reset on reload.
 */
export const SETTING_DEFAULTS = {
  notifyMentions: true,
  notifyReplies: true,
  notifyFollowers: false,
  notifyLiveRooms: true,
  notifyTrending: false,
  privateAccount: false,
  hideReadReceipts: false,
  discoverByContact: false,
} as const;

export type SettingKey = keyof typeof SETTING_DEFAULTS;
export type Settings = Record<SettingKey, boolean>;

const KEYS = Object.keys(SETTING_DEFAULTS) as SettingKey[];

/**
 * Parse persisted settings, falling back per-key. A newly added setting must
 * take its default rather than `undefined`, so an old payload stays valid.
 */
export function parseSettings(raw: string | null): Settings {
  const out = { ...SETTING_DEFAULTS } as Settings;
  if (!raw) return out;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return out;
    for (const key of KEYS) {
      const value = (parsed as Record<string, unknown>)[key];
      if (typeof value === 'boolean') out[key] = value;
    }
    return out;
  } catch {
    return out;
  }
}

/** True when the viewer has changed anything away from the shipped defaults. */
export function isDefault(settings: Settings): boolean {
  return KEYS.every((k) => settings[k] === SETTING_DEFAULTS[k]);
}

function read(): Settings {
  if (typeof window === 'undefined') return { ...SETTING_DEFAULTS };
  return parseSettings(window.localStorage.getItem(STORAGE_KEY));
}

function write(settings: Settings): void {
  writeJson(STORAGE_KEY, settings);
}

/**
 * Persistent notification & privacy settings.
 *
 * Hydrates after mount (so SSR and the client agree) and syncs across tabs,
 * matching the pattern used by preferences, follows, and read state.
 */
export function useSettings() {
  const [settings, setSettings] = useState<Settings>({ ...SETTING_DEFAULTS });

  useEffect(() => {
    setSettings(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setSettings(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setSetting = useCallback((key: SettingKey, value: boolean) => {
    setSettings((current) => {
      const next = { ...current, [key]: value };
      write(next);
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    const next = { ...SETTING_DEFAULTS } as Settings;
    write(next);
    setSettings(next);
  }, []);

  return { settings, setSetting, resetSettings };
}
