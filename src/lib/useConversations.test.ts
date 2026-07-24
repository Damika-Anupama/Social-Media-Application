import { describe, expect, it } from 'vitest';
import { mergeThreads, parseThreads, type SentThreads } from './useConversations';

describe('parseThreads', () => {
  it('returns an empty map for absent or corrupt storage', () => {
    expect(parseThreads(null)).toEqual({});
    expect(parseThreads('not json')).toEqual({});
    expect(parseThreads('[]')).toEqual({});
    expect(parseThreads('"a string"')).toEqual({});
  });

  it('parses well-formed threads', () => {
    const raw = JSON.stringify({ c1: [{ from: 'me', text: 'hi', time: 'now' }] });
    expect(parseThreads(raw)).toEqual({ c1: [{ from: 'me', text: 'hi', time: 'now' }] });
  });

  it('drops malformed messages but keeps the valid ones alongside them', () => {
    const raw = JSON.stringify({
      c1: [
        { from: 'me', text: 'keep', time: 'now' },
        { from: 'nobody', text: 'bad sender', time: 'now' },
        { from: 'them', text: 42, time: 'now' },
        null,
      ],
    });
    expect(parseThreads(raw)).toEqual({ c1: [{ from: 'me', text: 'keep', time: 'now' }] });
  });

  it('omits conversations left with no valid messages', () => {
    const raw = JSON.stringify({ c1: [{ from: 'ghost' }], c2: 'nope' });
    expect(parseThreads(raw)).toEqual({});
  });
});

describe('mergeThreads', () => {
  const seed: SentThreads = {
    c1: [{ from: 'them', text: 'seeded', time: '2h' }],
    c2: [{ from: 'them', text: 'other', time: '1d' }],
  };

  it('appends persisted messages after the seeded history', () => {
    const merged = mergeThreads(seed, { c1: [{ from: 'me', text: 'later', time: 'now' }] });
    expect(merged.c1).toEqual([
      { from: 'them', text: 'seeded', time: '2h' },
      { from: 'me', text: 'later', time: 'now' },
    ]);
  });

  it('leaves untouched conversations exactly as seeded', () => {
    const merged = mergeThreads(seed, { c1: [{ from: 'me', text: 'later', time: 'now' }] });
    expect(merged.c2).toEqual(seed.c2);
  });

  it('supports a conversation that exists only in storage', () => {
    const merged = mergeThreads(seed, { c9: [{ from: 'me', text: 'new', time: 'now' }] });
    expect(merged.c9).toEqual([{ from: 'me', text: 'new', time: 'now' }]);
  });

  it('does not mutate the seed', () => {
    const before = JSON.stringify(seed);
    mergeThreads(seed, { c1: [{ from: 'me', text: 'later', time: 'now' }] });
    expect(JSON.stringify(seed)).toBe(before);
  });

  it('returns the seed unchanged when nothing is persisted', () => {
    expect(mergeThreads(seed, {})).toEqual(seed);
  });
});
