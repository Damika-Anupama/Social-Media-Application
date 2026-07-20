/**
 * Pure helpers behind the follow-requests inbox.
 *
 * The "Private account" setting used to be inert. With it on, a real account
 * approves each follower — so there needs to be something to approve. These
 * helpers derive a small, stable set of pending requesters from the seed users
 * (deterministic djb2 seed, no Date/Math.random) and track which have been
 * decided, so a decision survives reloads and never re-appears. React-free so
 * the parsing is unit-testable and hardened against corrupt storage.
 */

import { users as allUsers, type User } from '@/lib/mock-data';

const REQUEST_SEED = 'follow-requests';

function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i += 1) h = (Math.imul(h, 33) ^ s.charCodeAt(i)) >>> 0;
  return h >>> 0;
}

/** A small, stable set of accounts requesting to follow you. */
export function seedRequesters(users: User[] = allUsers, size = 5): User[] {
  return users
    .map((user, index) => ({ user, index, key: hashString(user.id + REQUEST_SEED) >>> 0 }))
    .sort((a, b) => a.key - b.key || a.index - b.index)
    .slice(0, size)
    .map((x) => x.user);
}

/** Which requesters have been approved / declined (user ids). */
export type RequestState = { approved: string[]; declined: string[] };

const EMPTY: RequestState = { approved: [], declined: [] };

function cleanIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.filter((x): x is string => typeof x === 'string')));
}

/** Parse persisted decisions; any corruption degrades to "nothing decided". */
export function parseRequestState(raw: string | null): RequestState {
  if (!raw) return { ...EMPTY };
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return { ...EMPTY };
    return { approved: cleanIds(parsed.approved), declined: cleanIds(parsed.declined) };
  } catch {
    return { ...EMPTY };
  }
}

/** Serialize decisions in a canonical (sorted, de-duped) form for stable diffs. */
export function serializeRequestState(state: RequestState): string {
  return JSON.stringify({
    approved: Array.from(new Set(state.approved)).sort(),
    declined: Array.from(new Set(state.declined)).sort(),
  });
}

/** The requesters still awaiting a decision. */
export function pendingRequesters(state: RequestState, users: User[] = allUsers): User[] {
  const decided = new Set([...state.approved, ...state.declined]);
  return seedRequesters(users).filter((u) => !decided.has(u.id));
}
