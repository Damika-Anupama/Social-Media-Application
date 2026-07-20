import { describe, it, expect } from 'vitest';
import {
  communityKeywords,
  relevance,
  orderPostsForCommunity,
  postsForCommunity,
} from '@/lib/communityFeed';
import type { Post } from '@/lib/mock-data';

const author = { id: 'a', handle: 'a', name: 'Ana Dev', avatar: '' } as Post['author'];
const post = (id: string, over: Partial<Post> = {}): Post => ({
  id,
  author,
  postedAt: 'now',
  body: '',
  metrics: { likes: 0, comments: 0, shares: 0, bookmarks: 0 },
  ...over,
});

describe('communityKeywords', () => {
  it('tokenizes name + topic, lowercased and de-duped, dropping short/stop words', () => {
    expect(communityKeywords('Open Climate Lab', 'Science')).toEqual([
      'open',
      'climate',
      'science',
    ]);
  });

  it('drops stop words like "society" and "the"', () => {
    expect(communityKeywords('Slow Web Society', 'Calm tech')).toEqual([
      'slow',
      'web',
      'calm',
      'tech',
    ]);
  });
});

describe('relevance', () => {
  const keywords = ['climate', 'science'];
  it('scores matches across tags, body and author name', () => {
    expect(relevance(post('p', { tags: ['climate', 'ai'] }), keywords)).toBe(1);
    expect(relevance(post('p', { body: 'notes on climate science' }), keywords)).toBe(2);
    expect(relevance(post('p', { tags: ['design'] }), keywords)).toBe(0);
  });
});

describe('orderPostsForCommunity', () => {
  const posts = [
    post('p0', { tags: ['design'] }),
    post('p1', { tags: ['climate', 'opendata'] }),
    post('p2', { tags: ['gamedev'] }),
    post('p3', { body: 'a climate field report' }),
  ];

  it('puts keyword-relevant posts first', () => {
    const ordered = orderPostsForCommunity(posts, 'open-climate', ['climate']);
    expect(ordered.slice(0, 2).map((p) => p.id).sort()).toEqual(['p1', 'p3']);
  });

  it('is deterministic per slug', () => {
    const a = orderPostsForCommunity(posts, 'slow-web', []).map((p) => p.id);
    const again = orderPostsForCommunity(posts, 'slow-web', []).map((p) => p.id);
    expect(a).toEqual(again);
  });

  it('does not give every community the same order', () => {
    const slugs = ['a', 'b', 'c', 'd', 'e', 'slow-web', 'gamedev', 'open-climate'];
    const orders = new Set(
      slugs.map((s) => orderPostsForCommunity(posts, s, []).map((p) => p.id).join(',')),
    );
    // The old bug was one identical order for all; any spread proves it's fixed.
    expect(orders.size).toBeGreaterThan(1);
  });

  it('returns every post exactly once', () => {
    const ordered = orderPostsForCommunity(posts, 'x', ['climate']);
    expect(ordered.map((p) => p.id).sort()).toEqual(['p0', 'p1', 'p2', 'p3']);
  });
});

describe('postsForCommunity', () => {
  const posts = [
    post('p0', { tags: ['climate'] }),
    post('p1'),
    post('p2'),
    post('p3'),
    post('p4'),
  ];

  it('splits into a pinned post and a non-overlapping feed', () => {
    const { pinned, feed } = postsForCommunity(posts, 'open-climate', ['climate'], 3);
    expect(pinned?.id).toBe('p0'); // the only keyword match leads
    expect(feed).toHaveLength(3);
    expect(feed.map((p) => p.id)).not.toContain('p0');
  });

  it('returns a null pinned and empty feed for no posts', () => {
    expect(postsForCommunity([], 'x', ['y'])).toEqual({ pinned: null, feed: [] });
  });
});
