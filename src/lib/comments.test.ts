import { describe, expect, it } from 'vitest';
import {
  COMMENT_LIMIT,
  createComment,
  mergeComments,
  parseComments,
  validateComment,
} from './comments';
import type { Comment, User } from '@/lib/mock-data';

const user = { id: 'u', handle: 'demo', name: 'Demo', avatar: 'https://x/y' } as User;
const seeded: Comment[] = [
  { id: 's1', user, body: 'seeded', time: '2h', likes: 3 },
];

describe('validateComment', () => {
  it('rejects empty and whitespace-only comments', () => {
    expect(validateComment('')).toMatch(/something/i);
    expect(validateComment('   \n ')).toMatch(/something/i);
  });

  it('bounds the length', () => {
    expect(validateComment('a'.repeat(COMMENT_LIMIT + 1))).toMatch(/under/i);
    expect(validateComment('a'.repeat(COMMENT_LIMIT))).toBeUndefined();
  });

  it('accepts a normal comment', () => {
    expect(validateComment('Nice post')).toBeUndefined();
  });
});

describe('parseComments', () => {
  it('returns nothing for absent or corrupt storage', () => {
    expect(parseComments(null)).toEqual({});
    expect(parseComments('nope')).toEqual({});
    expect(parseComments('[]')).toEqual({});
  });

  it('keeps valid comments and drops malformed ones', () => {
    const raw = JSON.stringify({
      p1: [
        { id: 'c1', user, body: 'keep', time: 'now', likes: 0 },
        { id: 'c2', body: 'no user', time: 'now', likes: 0 },
        { id: 'c3', user, body: 'bad likes', time: 'now', likes: 'lots' },
      ],
    });
    const parsed = parseComments(raw);
    expect(parsed.p1).toHaveLength(1);
    expect(parsed.p1[0].body).toBe('keep');
  });

  it('omits a post left with no valid comments', () => {
    expect(parseComments(JSON.stringify({ p1: [{ id: 'broken' }] }))).toEqual({});
  });
});

describe('mergeComments', () => {
  it('puts the viewer’s own comments above the seeded thread', () => {
    const own = createComment('mine', user, 1_000);
    const merged = mergeComments(seeded, [own]);
    expect(merged[0].body).toBe('mine');
    expect(merged[1].id).toBe('s1');
  });

  it('leaves the seed alone when nothing is stored', () => {
    expect(mergeComments(seeded, [])).toEqual(seeded);
  });

  it('does not mutate the seed', () => {
    const before = JSON.stringify(seeded);
    mergeComments(seeded, [createComment('x', user, 1)]);
    expect(JSON.stringify(seeded)).toBe(before);
  });
});

describe('createComment', () => {
  it('trims the body and starts with no likes', () => {
    const c = createComment('  hello  ', user, 42);
    expect(c.body).toBe('hello');
    expect(c.likes).toBe(0);
    expect(c.user.handle).toBe('demo');
  });

  it('derives a stable id from the timestamp', () => {
    expect(createComment('a', user, 42).id).toBe(createComment('b', user, 42).id);
    expect(createComment('a', user, 1).id).not.toBe(createComment('a', user, 2).id);
  });
});
