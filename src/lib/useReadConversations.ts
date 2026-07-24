'use client';

import { useCallback, useEffect, useState } from 'react';
import { writeRaw } from '@/lib/storage';
import { parseReadIds, serializeReadIds } from '@/lib/useReadNotifications';

const STORAGE_KEY = 'pulse.readConversations.v1';

/** Same-tab sync — the `storage` event only fires in other tabs. */
const SYNC_EVENT = 'pulse:read-conversations';

/** Minimal shape we need: a conversation and its seeded unread count. */
type Countable = { id: string; unread?: number };

/**
 * Sum the unread counts of conversations the viewer has not opened yet.
 * Pure, so the sidebar badge and the messages page share — and unit-test —
 * the rule.
 */
export function countUnreadMessages(conversations: Countable[], readIds: Set<string>): number {
  return conversations.reduce((n, c) => n + (readIds.has(c.id) ? 0 : (c.unread ?? 0)), 0);
}

function read(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  return new Set(parseReadIds(window.localStorage.getItem(STORAGE_KEY)));
}

function write(ids: Set<string>): void {
  writeRaw(STORAGE_KEY, serializeReadIds(ids));
  window.dispatchEvent(new Event(SYNC_EVENT));
}

/**
 * Client-side persistent store of conversations the viewer has opened.
 *
 * The messages page used to clear unread chips in component state: the
 * sidebar badge never moved, and a reload resurrected every chip as if the
 * conversations had never been read. Same store discipline as read
 * notifications: persisted, shared across surfaces, synced in-tab.
 */
export function useReadConversations() {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const refresh = () => setReadIds(read());
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

  const markRead = useCallback((id: string) => {
    setReadIds((current) => {
      if (current.has(id)) return current;
      const next = new Set(current);
      next.add(id);
      write(next);
      return next;
    });
  }, []);

  return { readIds, markRead };
}
