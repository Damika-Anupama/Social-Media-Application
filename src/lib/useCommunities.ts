'use client';

import { useCallback, useEffect, useState } from 'react';
import { writeJson } from '@/lib/storage';
import { communities as seed, type Community } from '@/lib/mock-data';
import {
  EMPTY_STATE,
  allCommunities,
  isJoined,
  parseCommunityState,
  slugify,
  toggleMembership,
  type CommunityState,
} from '@/lib/communities';

const STORAGE_KEY = 'pulse.communities.v1';

function read(): CommunityState {
  if (typeof window === 'undefined') return { ...EMPTY_STATE };
  return parseCommunityState(window.localStorage.getItem(STORAGE_KEY));
}

function write(state: CommunityState): void {
  writeJson(STORAGE_KEY, state);
}

/**
 * Community membership and creation, persisted.
 *
 * Joining used to be local component state: every join and every leave was
 * forgotten on reload. Membership now survives, and a community the viewer
 * creates is a real room they are a member of.
 */
export function useCommunities() {
  const [state, setState] = useState<CommunityState>({ ...EMPTY_STATE });

  useEffect(() => {
    setState(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setState(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const list = allCommunities(seed, state);

  const toggleJoin = useCallback((community: Community) => {
    setState((current) => {
      const next = toggleMembership(community, current);
      write(next);
      return next;
    });
  }, []);

  const createCommunity = useCallback((name: string, topic: string) => {
    const trimmed = name.trim();
    const community: Community = {
      id: `own-${slugify(trimmed)}`,
      name: trimmed,
      slug: slugify(trimmed),
      members: 1,
      online: 1,
      cover: '',
      description: topic.trim()
        ? `A new room for ${topic.trim()}.`
        : 'A new room, freshly opened.',
      topic: topic.trim() || 'general',
      joined: true,
    };
    setState((current) => {
      const next = { ...current, created: [...current.created, community] };
      write(next);
      return next;
    });
    return community;
  }, []);

  return {
    communities: list,
    isJoined: (c: Community) => isJoined(c, state),
    toggleJoin,
    createCommunity,
  };
}
