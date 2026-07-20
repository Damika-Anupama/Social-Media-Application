import { describe, expect, it } from 'vitest';
import type { Post, User } from '@/lib/mock-data';
import { posts } from '@/lib/mock-data';
import { allTags, normalizeTag, postsForTag, relatedTags, tagCount } from '@/lib/hashtagFeed';

const user: User = { id: 'u', handle: 'u', name: 'U', avatar: '' };

function post(id: string, tags: string[], likes: number): Post {
  return {
    id,
    author: user,
    postedAt: 'now',
    body: '',
    metrics: { likes, comments: 0, shares: 0, bookmarks: 0 },
    tags,
  };
}

// Deterministic fixtures: engagement order is likes desc, then original order.
const fixtures: Post[] = [
  post('a', ['Design', 'type'], 10),
  post('b', ['design', 'ai'], 30),
  post('c', ['ai'], 20),
  post('d', [], 99),
];

describe('normalizeTag', () => {
  it('lower-cases, strips leading #, and trims', () => {
    expect(normalizeTag('  #Design ')).toBe('design');
    expect(normalizeTag('##AI')).toBe('ai');
    expect(normalizeTag('studio-notes')).toBe('studio-notes');
  });
});

describe('allTags', () => {
  it('returns distinct, normalized, sorted tags', () => {
    expect(allTags(fixtures)).toEqual(['ai', 'design', 'type']);
  });

  it('covers the real seed posts (e.g. includes design)', () => {
    expect(allTags(posts)).toContain('design');
  });
});

describe('postsForTag', () => {
  it('matches case-insensitively and orders by engagement then original order', () => {
    // 'design' is on a (10) and b (30) → b first.
    expect(postsForTag(fixtures, 'Design').map((p) => p.id)).toEqual(['b', 'a']);
  });

  it('is empty for an unknown or blank tag', () => {
    expect(postsForTag(fixtures, 'nope')).toEqual([]);
    expect(postsForTag(fixtures, '   ')).toEqual([]);
  });

  it('every returned post really carries the tag', () => {
    for (const p of postsForTag(posts, 'climate')) {
      expect((p.tags ?? []).map(normalizeTag)).toContain('climate');
    }
  });
});

describe('tagCount', () => {
  it('counts matching posts', () => {
    expect(tagCount(fixtures, 'ai')).toBe(2);
    expect(tagCount(fixtures, 'type')).toBe(1);
  });
});

describe('relatedTags', () => {
  it('ranks co-occurring tags and excludes the tag itself', () => {
    // Posts tagged 'design': a (type) and b (ai) → each co-occurs once, tie
    // broken alphabetically.
    expect(relatedTags(fixtures, 'design')).toEqual(['ai', 'type']);
    expect(relatedTags(fixtures, 'design')).not.toContain('design');
  });

  it('respects the limit', () => {
    expect(relatedTags(fixtures, 'design', 1)).toEqual(['ai']);
  });
});
