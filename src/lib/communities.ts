/**
 * Community membership and creation rules.
 *
 * Pure — no React, no DOM — so the merge semantics and validation are
 * unit-testable on their own.
 */

import type { Community } from '@/lib/mock-data';

/** What we persist: membership overrides, plus anything the viewer created. */
export type CommunityState = {
  /** Seeded communities the viewer has joined. */
  joined: string[];
  /** Seeded communities the viewer has explicitly left (they seed as joined). */
  left: string[];
  /** Communities the viewer created. */
  created: Community[];
};

export const EMPTY_STATE: CommunityState = { joined: [], left: [], created: [] };

export const NAME_LIMIT = 40;
export const TOPIC_LIMIT = 30;

/** URL-safe slug for a created community. */
export function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function validateCommunityName(
  name: string,
  existing: { name: string }[],
): string | undefined {
  const trimmed = name.trim();
  if (!trimmed) return 'Give the community a name.';
  if (trimmed.length > NAME_LIMIT) return `Keep it under ${NAME_LIMIT} characters.`;
  if (!slugify(trimmed)) return 'Use at least one letter or number.';
  if (existing.some((c) => c.name.trim().toLowerCase() === trimmed.toLowerCase())) {
    return 'A community with that name already exists.';
  }
  return undefined;
}

function isCommunity(value: unknown): value is Community {
  if (!value || typeof value !== 'object') return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.id === 'string' &&
    typeof c.name === 'string' &&
    typeof c.slug === 'string' &&
    typeof c.topic === 'string' &&
    typeof c.description === 'string'
  );
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.filter((x): x is string => typeof x === 'string')));
}

/** Parse persisted state, discarding anything malformed rather than throwing. */
export function parseCommunityState(raw: string | null): CommunityState {
  if (!raw) return { ...EMPTY_STATE };
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return { ...EMPTY_STATE };
    const p = parsed as Record<string, unknown>;
    return {
      joined: stringArray(p.joined),
      left: stringArray(p.left),
      created: Array.isArray(p.created) ? p.created.filter(isCommunity) : [],
    };
  } catch {
    return { ...EMPTY_STATE };
  }
}

/**
 * The full community list: seeds first, then anything the viewer created.
 * Created communities are always joined — you are in the room you opened.
 */
export function allCommunities(seed: Community[], state: CommunityState): Community[] {
  return [...seed, ...state.created];
}

/**
 * Resolve membership for one community: an explicit join or leave always wins
 * over the seeded default, so leaving a seeded-joined room actually sticks.
 */
export function isJoined(community: Community, state: CommunityState): boolean {
  if (state.left.includes(community.id)) return false;
  if (state.joined.includes(community.id)) return true;
  return !!community.joined;
}

/** Apply a join/leave, keeping `joined` and `left` mutually exclusive. */
export function toggleMembership(
  community: Community,
  state: CommunityState,
): CommunityState {
  const nowJoined = !isJoined(community, state);
  return {
    ...state,
    joined: nowJoined
      ? Array.from(new Set([...state.joined, community.id]))
      : state.joined.filter((id) => id !== community.id),
    left: nowJoined
      ? state.left.filter((id) => id !== community.id)
      : Array.from(new Set([...state.left, community.id])),
  };
}
