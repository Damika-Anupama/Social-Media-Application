import { describe, expect, it } from 'vitest';
import { DEFAULT_SIZE, aspectRatio, parseImageSize } from './images';

describe('parseImageSize', () => {
  it('reads both dimensions from the query string', () => {
    expect(
      parseImageSize('https://images.unsplash.com/photo-abc?auto=format&w=800&h=1100&q=80'),
    ).toEqual({ width: 800, height: 1100 });
  });

  it('derives a 4:3 height when only a width is given', () => {
    expect(parseImageSize('https://x.test/a?w=800')).toEqual({ width: 800, height: 600 });
  });

  it('falls back when there is no size at all', () => {
    expect(parseImageSize('https://x.test/a')).toEqual(DEFAULT_SIZE);
  });

  it('falls back rather than throwing on a malformed URL', () => {
    expect(parseImageSize('not a url')).toEqual(DEFAULT_SIZE);
    expect(parseImageSize('')).toEqual(DEFAULT_SIZE);
  });

  it('rejects junk dimensions instead of reserving zero or negative space', () => {
    // A zero-height container is exactly the layout shift we are removing.
    expect(parseImageSize('https://x.test/a?w=0&h=0')).toEqual(DEFAULT_SIZE);
    expect(parseImageSize('https://x.test/a?w=-5&h=10')).toEqual(DEFAULT_SIZE);
    expect(parseImageSize('https://x.test/a?w=abc&h=def')).toEqual(DEFAULT_SIZE);
    expect(parseImageSize('https://x.test/a?w=1.5&h=2.5')).toEqual(DEFAULT_SIZE);
  });
});

describe('aspectRatio', () => {
  it('produces a CSS aspect-ratio', () => {
    expect(aspectRatio('https://x.test/a?w=800&h=1000')).toBe('800 / 1000');
  });

  it('falls back to the default ratio', () => {
    expect(aspectRatio('https://x.test/a')).toBe('800 / 600');
  });
});
