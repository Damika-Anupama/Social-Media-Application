'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'pulse.readNotifications.v1';

/** Minimal shape we need to reason about read state. */
type Readable = { id: string; unread?: boolean };

/** Parse the persisted read-id set from a raw JSON string (array of ids). */
export function parseReadIds(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return Array.from(new Set(parsed.filter((x): x is string => typeof x === 'string')));
  } catch {
    return [];
  }
}

/** Serialize a read-id set to the canonical persisted form (sorted). */
export function serializeReadIds(ids: Iterable<string>): string {
  return JSON.stringify(Array.from(new Set(ids)).sort());
}

/**
 * Count notifications still unread: seeded as unread AND not since marked read.
 * Pure, so the sidebar badge and the page can share — and unit-test — the rule.
 */
export function countUnread(items: Readable[], readIds: Set<string>): number {
  return items.filter((n) => n.unread && !readIds.has(n.id)).length;
}

function read(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  return new Set(parseReadIds(window.localStorage.getItem(STORAGE_KEY)));
}

function write(ids: Set<string>): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, serializeReadIds(ids));
  } catch {
    // storage full / disabled — fail silently, in-memory state still works.
  }
}

/**
 * Client-side persistent store of notifications the viewer has read.
 *
 * Read state lives in localStorage so marking a notification read (or "mark all
 * read") survives reloads and stays in sync across tabs and surfaces — the
 * Notifications page and the sidebar unread badge both read the same store.
 */
export function useReadNotifications() {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setReadIds(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setReadIds(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isRead = useCallback((id: string) => readIds.has(id), [readIds]);

  const markRead = useCallback((id: string) => {
    setReadIds((current) => {
      if (current.has(id)) return current;
      const next = new Set(current);
      next.add(id);
      write(next);
      return next;
    });
  }, []);

  const markUnread = useCallback((id: string) => {
    setReadIds((current) => {
      if (!current.has(id)) return current;
      const next = new Set(current);
      next.delete(id);
      write(next);
      return next;
    });
  }, []);

  const markManyRead = useCallback((ids: string[]) => {
    setReadIds((current) => {
      const next = new Set(current);
      ids.forEach((id) => next.add(id));
      write(next);
      return next;
    });
  }, []);

  return { readIds, isRead, markRead, markUnread, markManyRead };
}
