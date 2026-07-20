/**
 * Pure helpers deriving a profile's follower / following lists.
 *
 * The seed users carry follower/following *counts* but no actual lists. These
 * helpers turn any profile into a plausible, stable connection list drawn from
 * the other seed users — deterministically (a djb2 hash, no Date/Math.random),
 * so the pages prerender and the ordering is unit-testable. Followers and
 * following get different seeds so a profile's two lists aren't identical.
 */

import { users as allUsers, type User } from '@/lib/mock-data';

/** Deterministic string hash (djb2). */
function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i += 1) h = (Math.imul(h, 33) ^ s.charCodeAt(i)) >>> 0;
  return h >>> 0;
}

/**
 * The other seed users, ordered deterministically for a given profile+relation.
 * Every other user appears (so there's always someone to follow), but the order
 * is seeded by the handle and relation so no two lists look the same.
 */
export function orderConnections(handle: string, relation: string, users: User[] = allUsers): User[] {
  const seed = hashString(`${handle}:${relation}`);
  return users
    .filter((u) => u.handle !== handle)
    .map((user, index) => ({ user, index, key: (hashString(user.id) ^ seed) >>> 0 }))
    .sort((a, b) => a.key - b.key || a.index - b.index)
    .map((x) => x.user);
}

/** A profile's derived followers and following lists. */
export function deriveConnections(
  handle: string,
  users: User[] = allUsers,
): { followers: User[]; following: User[] } {
  return {
    followers: orderConnections(handle, 'followers', users),
    following: orderConnections(handle, 'following', users),
  };
}
