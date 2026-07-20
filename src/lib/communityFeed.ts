/**
 * Pure helpers for a community's post feed.
 *
 * The community detail page used to show the same first four seed posts for
 * every community. These helpers give each community a distinct, deterministic
 * ordering — posts that actually mention the community's keywords come first,
 * and a stable slug-based rotation fills the rest so no two communities look
 * identical and none is empty. Kept free of React so it can be unit-tested.
 */

import type { Post } from '@/lib/mock-data';

const STOP = new Set(['the', 'and', 'for', 'lab', 'society', 'club', 'group', 'studio']);

/** Deterministic string hash (djb2). No Date/Math.random, so SSG output is stable. */
function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i += 1) h = (Math.imul(h, 33) ^ s.charCodeAt(i)) >>> 0;
  return h >>> 0;
}

/** The words worth matching a community on: its name plus its topic. */
export function communityKeywords(name: string, topic: string): string[] {
  return Array.from(
    new Set(
      `${name} ${topic}`
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((w) => w.length >= 3 && !STOP.has(w)),
    ),
  );
}

/** How strongly a post relates to the keywords — matches in tags, body or author. */
export function relevance(post: Post, keywords: string[]): number {
  const hay = `${(post.tags ?? []).join(' ')} ${post.body} ${post.author.name}`.toLowerCase();
  return keywords.reduce((score, k) => (hay.includes(k) ? score + 1 : score), 0);
}

/**
 * Order the shared seed feed for one community: most-relevant first, then a
 * deterministic slug-based rotation of the rest (distinct per community).
 */
export function orderPostsForCommunity(posts: Post[], slug: string, keywords: string[]): Post[] {
  const offset = posts.length ? hashString(slug) % posts.length : 0;
  return posts
    .map((post, index) => ({
      post,
      score: relevance(post, keywords),
      rotation: (index - offset + posts.length) % posts.length,
    }))
    .sort((a, b) => b.score - a.score || a.rotation - b.rotation)
    .map((x) => x.post);
}

/** The pinned post and recent feed for a community, drawn from the ordering above. */
export function postsForCommunity(
  posts: Post[],
  slug: string,
  keywords: string[],
  count = 4,
): { pinned: Post | null; feed: Post[] } {
  const ordered = orderPostsForCommunity(posts, slug, keywords);
  return { pinned: ordered[0] ?? null, feed: ordered.slice(1, 1 + count) };
}
