'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'pulse.following.v1';

/** Parse the persisted follow set from a raw JSON string (array of user ids). */
export function parseFollowing(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // De-dupe + keep only strings so a corrupted store can't poison the UI.
    return Array.from(new Set(parsed.filter((x): x is string => typeof x === 'string')));
  } catch {
    return [];
  }
}

/** Serialize a follow set to the canonical persisted form (sorted for stable diffs). */
export function serializeFollowing(ids: Iterable<string>): string {
  return JSON.stringify(Array.from(new Set(ids)).sort());
}

function read(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  return new Set(parseFollowing(window.localStorage.getItem(STORAGE_KEY)));
}

function write(ids: Set<string>): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, serializeFollowing(ids));
  } catch {
    // storage full / disabled — fail silently, in-memory state still works.
  }
}

/**
 * Client-side persistent store for accounts the user follows.
 *
 * The follow set is kept in localStorage so it survives reloads and stays in
 * sync across tabs and across surfaces (the Explore "People to discover" grid
 * and the right-rail "Who to follow" widget both read the same store). This is
 * a real, working feature layered on top of the otherwise mock data: before
 * this, each surface held its own in-memory `Set` that reset on navigation.
 */
export function useFollowing() {
  const [following, setFollowing] = useState<Set<string>>(new Set());

  // Hydrate after mount to avoid an SSR/client markup mismatch.
  useEffect(() => {
    setFollowing(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setFollowing(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isFollowing = useCallback((id: string) => following.has(id), [following]);

  const toggleFollow = useCallback((id: string) => {
    setFollowing((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      write(next);
      return next;
    });
  }, []);

  const clearFollowing = useCallback(() => {
    setFollowing(new Set());
    write(new Set());
  }, []);

  return { following, isFollowing, toggleFollow, clearFollowing, count: following.size };
}
