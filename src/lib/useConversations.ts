'use client';

import { useCallback, useEffect, useState } from 'react';
import { writeJson } from '@/lib/storage';
import type { ChatMessage } from '@/lib/mock-data';

const STORAGE_KEY = 'pulse.conversations.v1';

/** Messages the viewer has exchanged, keyed by conversation id. */
export type SentThreads = Record<string, ChatMessage[]>;

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== 'object') return false;
  const m = value as Record<string, unknown>;
  return (
    (m.from === 'me' || m.from === 'them') &&
    typeof m.text === 'string' &&
    typeof m.time === 'string'
  );
}

/**
 * Parse persisted threads, discarding anything malformed. A single corrupt
 * message must not take the whole inbox down with it.
 */
export function parseThreads(raw: string | null): SentThreads {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const out: SentThreads = {};
    for (const [id, messages] of Object.entries(parsed)) {
      if (!Array.isArray(messages)) continue;
      const valid = messages.filter(isChatMessage);
      if (valid.length) out[id] = valid;
    }
    return out;
  } catch {
    return {};
  }
}

/**
 * Overlay the viewer's persisted messages onto the seeded threads.
 *
 * The seed is the historical conversation; persisted messages are everything
 * said since, so they always append after it.
 */
export function mergeThreads(seed: SentThreads, persisted: SentThreads): SentThreads {
  const merged: SentThreads = { ...seed };
  for (const [id, messages] of Object.entries(persisted)) {
    merged[id] = [...(seed[id] ?? []), ...messages];
  }
  return merged;
}

function read(): SentThreads {
  if (typeof window === 'undefined') return {};
  return parseThreads(window.localStorage.getItem(STORAGE_KEY));
}

function write(threads: SentThreads): void {
  writeJson(STORAGE_KEY, threads);
}

/**
 * Persistent message store for the demo inbox.
 *
 * Only messages exchanged *since* the seed are persisted; the seeded history
 * stays in mock-data. That keeps the payload small and lets the seed evolve
 * without invalidating what the viewer has already said. Mirrors the storage
 * pattern used by posts, follows, and reactions.
 */
export function useConversations() {
  const [sent, setSent] = useState<SentThreads>({});
  /** False until localStorage has been read, so the UI can avoid a flash. */
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSent(read());
    setHydrated(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setSent(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const append = useCallback((conversationId: string, message: ChatMessage) => {
    setSent((current) => {
      const next = {
        ...current,
        [conversationId]: [...(current[conversationId] ?? []), message],
      };
      write(next);
      return next;
    });
  }, []);

  const clear = useCallback((conversationId: string) => {
    setSent((current) => {
      if (!current[conversationId]) return current;
      const next = { ...current };
      delete next[conversationId];
      write(next);
      return next;
    });
  }, []);

  return { sent, hydrated, append, clear };
}
