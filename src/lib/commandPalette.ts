/**
 * Pure helpers for the command palette (⌘K).
 *
 * The palette already jumps between the eight fixed sections; these helpers add
 * the part that makes it a real search tool — typing a query surfaces the actual
 * people and communities in the app to jump straight to — and keep the matching
 * rules free of React so they can be unit-tested directly.
 */

import type { User, Community } from '@/lib/mock-data';

/** Case-insensitive substring match. An empty query matches everything. */
export function commandMatches(query: string, haystacks: (string | undefined)[]): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return haystacks.some((h) => (h ?? '').toLowerCase().includes(q));
}

export type DirectoryResult = {
  type: 'user' | 'community';
  id: string;
  label: string;
  /** @handle for people, member count for communities — the secondary line. */
  sublabel: string;
  keywords: string;
  href: string;
};

export type DirectoryResults = {
  people: DirectoryResult[];
  communities: DirectoryResult[];
};

/**
 * Search people and communities for the palette. People match on name/handle,
 * communities on name/topic/slug. Results are capped per group so the palette
 * stays a jump list rather than turning into a feed. An empty query returns
 * nothing — the palette shows its fixed navigation instead.
 */
export function searchDirectory(
  query: string,
  users: User[],
  communities: Community[],
  limitPer = 5,
): DirectoryResults {
  const q = query.trim();
  if (!q) return { people: [], communities: [] };

  const people: DirectoryResult[] = users
    .filter((u) => commandMatches(q, [u.name, u.handle]))
    .slice(0, limitPer)
    .map((u) => ({
      type: 'user',
      id: u.id,
      label: u.name,
      sublabel: `@${u.handle}`,
      keywords: `@${u.handle}`,
      href: `/dashboard/u/${u.handle}`,
    }));

  const communityResults: DirectoryResult[] = communities
    .filter((c) => commandMatches(q, [c.name, c.slug, c.topic]))
    .slice(0, limitPer)
    .map((c) => ({
      type: 'community',
      id: c.id,
      label: c.name,
      sublabel: c.topic,
      keywords: `${c.slug} ${c.topic}`,
      href: `/dashboard/c/${c.slug}`,
    }));

  return { people, communities: communityResults };
}
