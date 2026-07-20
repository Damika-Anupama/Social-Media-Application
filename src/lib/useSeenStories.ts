'use client';

import { useCallback, useEffect, useState } from 'react';
import { writeRaw } from '@/lib/storage';
import type { Story } from '@/lib/mock-data';

const STORAGE_KEY = 'pulse.seenStories.v1';

/** Parse the persisted seen-id set from a raw JSON string (array of ids). */
export function parseSeenIds(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return Array.from(new Set(parsed.filter((x): x is string => typeof x === 'string')));
  } catch {
    return [];
  }
}

/** Serialize a seen-id set to the canonical persisted form (sorted). */
export function serializeSeenIds(ids: Iterable<string>): string {
  return JSON.stringify(Array.from(new Set(ids)).sort());
}

/** A story counts as watched if it was seeded that way OR the viewer has since watched it. */
export function isStoryWatched(story: Story, seenIds: Set<string>): boolean {
  return Boolean(story.viewed) || seenIds.has(story.id);
}

/**
 * Split stories into the three rows the page renders. Kept pure and mutually
 * exclusive so the "Already watched" row reflects persisted state and can be
 * unit-tested without a DOM: a live story never doubles into "watched", and a
 * story the viewer just watched moves out of "Fresh".
 */
export function partitionStories(
  stories: Story[],
  seenIds: Set<string>,
): { live: Story[]; fresh: Story[]; watched: Story[] } {
  const live: Story[] = [];
  const fresh: Story[] = [];
  const watched: Story[] = [];
  for (const s of stories) {
    if (s.isLive) live.push(s);
    else if (isStoryWatched(s, seenIds)) watched.push(s);
    else fresh.push(s);
  }
  return { live, fresh, watched };
}

function read(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  return new Set(parseSeenIds(window.localStorage.getItem(STORAGE_KEY)));
}

/**
 * The `storage` event only fires in *other* tabs. The stories grid and the
 * viewer overlay each hold their own copy of this store, so without a same-tab
 * signal, watching a story would leave the grid's rows stale until a reload.
 */
const SYNC_EVENT = 'pulse:seen-stories';

function write(ids: Set<string>): void {
  writeRaw(STORAGE_KEY, serializeSeenIds(ids));
  window.dispatchEvent(new Event(SYNC_EVENT));
}

/**
 * Client-side persistent store of stories the viewer has watched.
 *
 * Watched state lives in localStorage so opening a story in the viewer moves it
 * to "Already watched" and keeps it there across reloads and tabs — the seed
 * `viewed` flag is only the starting point.
 */
export function useSeenStories() {
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const refresh = () => setSeenIds(read());
    refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) refresh();
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener(SYNC_EVENT, refresh);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(SYNC_EVENT, refresh);
    };
  }, []);

  const isSeen = useCallback((id: string) => seenIds.has(id), [seenIds]);

  const markSeen = useCallback((id: string) => {
    setSeenIds((current) => {
      if (current.has(id)) return current;
      const next = new Set(current);
      next.add(id);
      write(next);
      return next;
    });
  }, []);

  return { seenIds, isSeen, markSeen };
}
