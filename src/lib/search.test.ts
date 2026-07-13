import { describe, expect, it } from 'vitest';
import { buildSearchQuery, describeResults, isEmptySearch, normalizeQuery } from './search';

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
