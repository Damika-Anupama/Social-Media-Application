/**
 * Pure helpers for a hashtag's post feed.
 *
 * Tags used to render as inert chips. These helpers turn any tag into a real
 * page: the posts that carry it, most-engaged first (a deterministic order,
 * since seed metrics are fixed), plus the tags that most often travel with it.
 * Kept free of React so it can be unit-tested.
 */

import type { Post } from '@/lib/mock-data';

/** Canonical form of a tag: lower-cased, without a leading '#', trimmed. */
export function normalizeTag(tag: string): string {
  return tag.trim().replace(/^#+/, '').toLowerCase();
}

/** Total engagement on a post — the deterministic ranking signal for a tag feed. */
function engagement(p: Post): number {
  const m = p.metrics;
  return m.likes + m.comments + m.shares + m.bookmarks;
}

/** Every distinct tag across the given posts, sorted for stable static params. */
export function allTags(posts: Post[]): string[] {
  const set = new Set<string>();
  for (const p of posts) for (const t of p.tags ?? []) set.add(normalizeTag(t));
  return Array.from(set).sort();
}

/**
 * Posts carrying a tag, most-engaged first with the original order as a stable
 * tie-break — deterministic, so the page is prerenderable and unit-testable.
 */
export function postsForTag(posts: Post[], tag: string): Post[] {
  const want = normalizeTag(tag);
  if (!want) return [];
  return posts
    .map((post, index) => ({ post, index }))
    .filter(({ post }) => (post.tags ?? []).some((t) => normalizeTag(t) === want))
    .sort((a, b) => engagement(b.post) - engagement(a.post) || a.index - b.index)
    .map((x) => x.post);
}

/** How many of the given posts carry a tag. */
export function tagCount(posts: Post[], tag: string): number {
  return postsForTag(posts, tag).length;
}

/**
 * Tags that most often appear alongside a tag, ranked by co-occurrence with the
 * tag name breaking ties. Excludes the tag itself.
 */
export function relatedTags(posts: Post[], tag: string, limit = 6): string[] {
  const want = normalizeTag(tag);
  const counts = new Map<string, number>();
  for (const post of postsForTag(posts, tag)) {
    for (const raw of post.tags ?? []) {
      const t = normalizeTag(raw);
      if (t === want) continue;
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([t]) => t);
}
