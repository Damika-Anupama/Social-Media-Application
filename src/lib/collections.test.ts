import { describe, expect, it } from 'vitest';
import {
  NAME_LIMIT,
  collectionCount,
  parseCollections,
  pruneCollections,
  togglePostInCollection,
  validateCollectionName,
  type Collection,
} from './collections';

const coll = (over: Partial<Collection> = {}): Collection => ({
  id: 'c1',
  name: 'Later',
  postIds: [],
  ...over,
});

describe('validateCollectionName', () => {
  it('accepts a fresh name', () => {
    expect(validateCollectionName('Weekend reads', [])).toBeUndefined();
  });

  it('requires a name', () => {
    expect(validateCollectionName('   ', [])).toMatch(/name/i);
  });

  it('bounds the length', () => {
    expect(validateCollectionName('a'.repeat(NAME_LIMIT + 1), [])).toMatch(/under/i);
  });

  it('rejects a duplicate of an existing collection, case-insensitively', () => {
    expect(validateCollectionName(' later ', [coll()])).toMatch(/already have/i);
  });

  it('rejects a clash with a built-in filter', () => {
    // Otherwise two chips read "Climate" and neither means what it says.
    expect(validateCollectionName('Climate', [])).toMatch(/already have/i);
  });
});

describe('parseCollections', () => {
  it('returns nothing for absent or corrupt storage', () => {
    expect(parseCollections(null)).toEqual([]);
    expect(parseCollections('nope')).toEqual([]);
    expect(parseCollections('{}')).toEqual([]);
  });

  it('keeps valid entries and drops malformed ones', () => {
    const raw = JSON.stringify([coll({ postIds: ['p1'] }), { id: 'bad' }, { name: 'no id' }]);
    const parsed = parseCollections(raw);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].postIds).toEqual(['p1']);
  });

  it('de-dupes post ids', () => {
    const raw = JSON.stringify([coll({ postIds: ['p1', 'p1', 'p2'] })]);
    expect(parseCollections(raw)[0].postIds).toEqual(['p1', 'p2']);
  });
});

describe('togglePostInCollection', () => {
  it('files a post in', () => {
    const next = togglePostInCollection([coll()], 'c1', 'p1');
    expect(next[0].postIds).toEqual(['p1']);
  });

  it('takes it back out', () => {
    const next = togglePostInCollection([coll({ postIds: ['p1'] })], 'c1', 'p1');
    expect(next[0].postIds).toEqual([]);
  });

  it('leaves other collections alone', () => {
    const next = togglePostInCollection([coll(), coll({ id: 'c2' })], 'c1', 'p1');
    expect(next[1].postIds).toEqual([]);
  });
});

describe('pruneCollections', () => {
  it('drops posts that are no longer bookmarked', () => {
    // Un-saving a post must not leave collections pointing at it.
    const pruned = pruneCollections([coll({ postIds: ['p1', 'p2'] })], new Set(['p2']));
    expect(pruned[0].postIds).toEqual(['p2']);
  });

  it('is a no-op when everything is still saved', () => {
    const pruned = pruneCollections([coll({ postIds: ['p1'] })], new Set(['p1']));
    expect(pruned[0].postIds).toEqual(['p1']);
  });
});

describe('collectionCount', () => {
  it('counts only posts still bookmarked', () => {
    expect(collectionCount(coll({ postIds: ['p1', 'p2'] }), new Set(['p1']))).toBe(1);
  });
});
