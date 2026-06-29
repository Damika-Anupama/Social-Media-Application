'use client';

import { useCallback, useEffect, useState } from 'react';

const LIKES_KEY = 'pulse.likes.v1';
const BOOKMARKS_KEY = 'pulse.bookmarks.v1';

/** Parse a persisted id set from a raw JSON string (array of post ids). */
export function parseIdSet(raw: string | null): string[] {
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

/** Serialize an id set to the canonical persisted form (sorted for stable diffs). */
export function serializeIdSet(ids: Iterable<string>): string {
  return JSON.stringify(Array.from(new Set(ids)).sort());
}

function read(key: string): Set<string> {
  if (typeof window === 'undefined') return new Set();
  return new Set(parseIdSet(window.localStorage.getItem(key)));
}

function write(key: string, ids: Set<string>): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, serializeIdSet(ids));
  } catch {
    // storage full / disabled — fail silently, in-memory state still works.
  }
}

/**
 * Client-side persistent store for the viewer's reactions (likes + bookmarks).
 *
 * Both sets live in localStorage so a like or a saved post survives reloads and
 * stays in sync across tabs and surfaces — the feed, a post's detail page, and
 * the Bookmarks page all read the same store. This is a real, working feature
 * layered on top of otherwise mock data: before this, each PostCard held its own
 * in-memory state that reset the moment you navigated away.
 */
export function useReactions() {
  const [likes, setLikes] = useState<Set<string>>(new Set());
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  // Hydrate after mount to avoid an SSR/client markup mismatch.
  useEffect(() => {
    setLikes(read(LIKES_KEY));
    setBookmarks(read(BOOKMARKS_KEY));
    const onStorage = (e: StorageEvent) => {
      if (e.key === LIKES_KEY) setLikes(read(LIKES_KEY));
      if (e.key === BOOKMARKS_KEY) setBookmarks(read(BOOKMARKS_KEY));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isLiked = useCallback((id: string) => likes.has(id), [likes]);
  const isBookmarked = useCallback((id: string) => bookmarks.has(id), [bookmarks]);

  const toggleLike = useCallback((id: string) => {
    setLikes((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      write(LIKES_KEY, next);
      return next;
    });
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      write(BOOKMARKS_KEY, next);
      return next;
    });
  }, []);

  return {
    likes,
    bookmarks,
    isLiked,
    isBookmarked,
    toggleLike,
    toggleBookmark,
    bookmarkCount: bookmarks.size,
    likeCount: likes.size,
  };
}
