import { describe, expect, it } from 'vitest';
import {
  EXPLORE_CHIPS,
  buildSearchQuery,
  describeResults,
  isEmptySearch,
  matchesChip,
  normalizeQuery,
} from './search';
import { trending } from './mock-data';

describe('matchesChip', () => {
  it('"For you" keeps everything', () => {
    for (const t of trending) expect(matchesChip(t.category, 'For you')).toBe(true);
  });

  it('matches the categories the data actually uses', () => {
    // The real strings, not invented ones: "Technology · Trending", "Music · Now".
    expect(matchesChip('Technology · Trending', 'Tech')).toBe(true);
    expect(matchesChip('Technology · Trending', 'Trending')).toBe(true);
    expect(matchesChip('Music · Now', 'Music')).toBe(true);
    expect(matchesChip('Politics', 'News')).toBe(true);
    expect(matchesChip('Climate', 'Climate')).toBe(true);
  });

  it('excludes what does not belong', () => {
    expect(matchesChip('Sports', 'Design')).toBe(false);
    expect(matchesChip('Books', 'Climate')).toBe(false);
  });

  it('is case-insensitive', () => {
    expect(matchesChip('DESIGN', 'Design')).toBe(true);
  });

  it('every chip except "For you" narrows the list', () => {
    // The bug: the chips changed the highlight and filtered nothing at all.
    for (const chip of EXPLORE_CHIPS.filter((c) => c !== 'For you')) {
      const kept = trending.filter((t) => matchesChip(t.category, chip));
      expect(kept.length, `${chip} kept everything`).toBeLessThan(trending.length);
    }
  });
});

describe('buildSearchQuery', () => {
  it('encodes the term', () => {
    expect(buildSearchQuery('climate tech')).toBe('?q=climate%20tech');
    expect(buildSearchQuery('a&b')).toBe('?q=a%26b');
  });

  it('drops q entirely when the term is empty or blank', () => {
    expect(buildSearchQuery('')).toBe('');
    expect(buildSearchQuery('   ')).toBe('');
  });

  it('trims before encoding, so the URL never carries padding', () => {
    expect(buildSearchQuery('  design  ')).toBe('?q=design');
  });
});

describe('normalizeQuery', () => {
  it('treats absent and blank as the same thing', () => {
    expect(normalizeQuery(null)).toBe('');
    expect(normalizeQuery(undefined)).toBe('');
    expect(normalizeQuery('  ')).toBe('');
  });

  it('trims a real term', () => {
    expect(normalizeQuery('  design ')).toBe('design');
  });
});

describe('isEmptySearch', () => {
  it('is true only when a real search matched nothing anywhere', () => {
    expect(isEmptySearch('zzz', { trends: 0, people: 0 })).toBe(true);
  });

  it('is false when any section has results', () => {
    expect(isEmptySearch('zzz', { trends: 1, people: 0 })).toBe(false);
    expect(isEmptySearch('zzz', { trends: 0, people: 2 })).toBe(false);
  });

  it('is false when there is no search at all — that is the browse state', () => {
    expect(isEmptySearch('', { trends: 0, people: 0 })).toBe(false);
    expect(isEmptySearch('   ', { trends: 0, people: 0 })).toBe(false);
  });
});

describe('describeResults', () => {
  it('says nothing when there is no search', () => {
    expect(describeResults('', { trends: 3, people: 2 })).toBe('');
  });

  it('reports an empty search', () => {
    expect(describeResults('zzz', { trends: 0, people: 0 })).toBe('No results for zzz.');
  });

  it('reports both sections', () => {
    expect(describeResults('design', { trends: 2, people: 3 })).toBe(
      '2 trends and 3 people for design.',
    );
  });

  it('omits empty sections', () => {
    expect(describeResults('design', { trends: 0, people: 3 })).toBe('3 people for design.');
    expect(describeResults('design', { trends: 2, people: 0 })).toBe('2 trends for design.');
  });

  it('singularizes', () => {
    expect(describeResults('design', { trends: 1, people: 1 })).toBe(
      '1 trend and 1 person for design.',
    );
  });
});
