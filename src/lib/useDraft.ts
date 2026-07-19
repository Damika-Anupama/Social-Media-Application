'use client';

import { useCallback, useEffect, useState } from 'react';
import { readRaw, writeRaw } from '@/lib/storage';

const DRAFT_KEY = 'pulse.draft.v1';

export type Draft = { text: string; tone: string };

export const EMPTY_DRAFT: Draft = { text: '', tone: 'thought' };

/** Parse a persisted draft; anything corrupted degrades to the empty draft. */
export function parseDraft(raw: string | null): Draft {
  if (!raw) return EMPTY_DRAFT;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return EMPTY_DRAFT;
    const record = parsed as Record<string, unknown>;
    return {
      text: typeof record.text === 'string' ? record.text : EMPTY_DRAFT.text,
      tone: typeof record.tone === 'string' ? record.tone : EMPTY_DRAFT.tone,
    };
  } catch {
    return EMPTY_DRAFT;
  }
}

export function serializeDraft(draft: Draft): string {
  return JSON.stringify({ text: draft.text, tone: draft.tone });
}

/**
 * The composer's unsent draft, persisted.
 *
 * The compose modal unmounts when it closes: before this, Esc — the key the
 * modal itself tells you to press — silently destroyed everything typed. In an
 * app where a like, a follow, and a read notification all survive a reload,
 * half-written words were the one thing that did not.
 *
 * One draft, one key: the inline composer and the modal are the same box in
 * two places, so a draft started in one is waiting in the other.
 */
export function useDraft() {
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);

  // Hydrate after mount to avoid an SSR/client markup mismatch.
  useEffect(() => {
    setDraft(parseDraft(readRaw(DRAFT_KEY)));
  }, []);

  const save = useCallback((next: Draft) => {
    setDraft(next);
    writeRaw(DRAFT_KEY, serializeDraft(next));
  }, []);

  const clear = useCallback(() => {
    setDraft(EMPTY_DRAFT);
    writeRaw(DRAFT_KEY, serializeDraft(EMPTY_DRAFT));
  }, []);

  return { draft, save, clear };
}
