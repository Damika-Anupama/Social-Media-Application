'use client';

import { useCallback, useEffect, useState } from 'react';
import { writeRaw } from '@/lib/storage';
import {
  parseRequestState,
  pendingRequesters,
  serializeRequestState,
  type RequestState,
} from '@/lib/followRequests';
import type { User } from '@/lib/mock-data';

const STORAGE_KEY = 'pulse.followRequests.v1';

function read(): RequestState {
  if (typeof window === 'undefined') return { approved: [], declined: [] };
  return parseRequestState(window.localStorage.getItem(STORAGE_KEY));
}

function write(state: RequestState): void {
  writeRaw(STORAGE_KEY, serializeRequestState(state));
}

/**
 * Persistent store for follow-request decisions.
 *
 * Follows the same shape as the other stores: empty on first render, hydrate
 * after mount (so SSR and client agree), sync across tabs. `pending` derives
 * from the seed requesters minus everything decided. `restore` clears a
 * decision — it's what Undo calls.
 */
export function useFollowRequests() {
  const [state, setState] = useState<RequestState>({ approved: [], declined: [] });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(read());
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setState(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const decide = useCallback((id: string, bucket: 'approved' | 'declined') => {
    setState((current) => {
      const next: RequestState = {
        approved: current.approved.filter((x) => x !== id),
        declined: current.declined.filter((x) => x !== id),
      };
      next[bucket] = [...next[bucket], id];
      write(next);
      return next;
    });
  }, []);

  const approve = useCallback((id: string) => decide(id, 'approved'), [decide]);
  const decline = useCallback((id: string) => decide(id, 'declined'), [decide]);

  const restore = useCallback((id: string) => {
    setState((current) => {
      const next: RequestState = {
        approved: current.approved.filter((x) => x !== id),
        declined: current.declined.filter((x) => x !== id),
      };
      write(next);
      return next;
    });
  }, []);

  const pending: User[] = pendingRequesters(state);
  return { ready, pending, approve, decline, restore, count: pending.length };
}
