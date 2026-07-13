'use client';

import { useCallback, useEffect, useState } from 'react';
import { writeJson } from '@/lib/storage';
import { currentUser } from '@/lib/mock-data';
import { normalizeProfile, parseProfileEdits, type ProfileEdits } from '@/lib/profile';
import type { User } from '@/lib/mock-data';

const STORAGE_KEY = 'pulse.profile.v1';

function read(): Partial<ProfileEdits> {
  if (typeof window === 'undefined') return {};
  return parseProfileEdits(window.localStorage.getItem(STORAGE_KEY));
}

function write(edits: ProfileEdits): void {
  writeJson(STORAGE_KEY, edits);
}

/**
 * The viewer's profile: the seeded user, overlaid with whatever they have
 * edited. Persisted, because a profile edit that vanishes on reload is not an
 * edit. Mirrors the storage pattern used by settings, follows, and posts.
 */
export function useProfile() {
  const [edits, setEdits] = useState<Partial<ProfileEdits>>({});

  useEffect(() => {
    setEdits(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setEdits(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const user: User = {
    ...currentUser,
    ...(edits.name ? { name: edits.name } : {}),
    ...(edits.bio !== undefined ? { bio: edits.bio } : {}),
    ...(edits.location !== undefined ? { location: edits.location } : {}),
    ...(edits.link !== undefined ? { link: edits.link } : {}),
  };

  const saveProfile = useCallback((next: ProfileEdits) => {
    const normalized = normalizeProfile(next);
    write(normalized);
    setEdits(normalized);
  }, []);

  return { user, saveProfile };
}
