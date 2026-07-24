import { describe, expect, it } from 'vitest';
import { communities, exploreImages, posts, users } from './mock-data';
import { parseImageSize } from './images';

/**
 * Two dead Unsplash ids shipped in this file for months, rendering as broken
 * images. A raw <img> fails silently; nothing was watching. These are cheap
 * structural guards — they cannot catch a 404, but they catch the shapes that
 * let one hide.
 */

const imageUrls = (): string[] => {
  const urls: string[] = [];
  for (const p of posts) {
    if (!p.media) continue;
    urls.push(...(Array.isArray(p.media.src) ? p.media.src : [p.media.src]));
  }
  for (const c of communities) if (c.cover) urls.push(c.cover);
  urls.push(...exploreImages);
  return urls;
};

describe('mock image data', () => {
  it('every image URL is a well-formed unsplash URL', () => {
    for (const url of imageUrls()) {
      expect(url).toMatch(/^https:\/\/images\.unsplash\.com\/photo-[\w-]+\?/);
    }
  });

  it('every image carries an intrinsic size, so nothing renders unsized', () => {
    for (const url of imageUrls()) {
      const { width, height } = parseImageSize(url);
      expect(width).toBeGreaterThan(0);
      expect(height).toBeGreaterThan(0);
    }
  });

  it('no image references a photo id known to be dead', () => {
    // Removed 2026-07: both 404ed from Unsplash.
    const dead = ['1561070791-2526d30994b8', '1473655087683-fe7e0a8c4e09'];
    for (const url of imageUrls()) {
      for (const id of dead) expect(url).not.toContain(id);
    }
  });

  it('every user has an avatar', () => {
    for (const u of users) expect(u.avatar).toMatch(/^https:\/\//);
  });
});
