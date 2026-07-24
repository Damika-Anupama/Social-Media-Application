import { describe, expect, it } from 'vitest';
import {
  EMPTY_STATE,
  NAME_LIMIT,
  allCommunities,
  isJoined,
  parseCommunityState,
  slugify,
  toggleMembership,
  validateCommunityName,
  type CommunityState,
} from './communities';
import type { Community } from '@/lib/mock-data';

const community = (over: Partial<Community> = {}): Community => ({
  id: 'c1',
  name: 'Design Systems',
  slug: 'design-systems',
  members: 10,
  online: 2,
  cover: '',
  description: 'd',
  topic: 'design',
  ...over,
});

describe('slugify', () => {
  it('makes a URL-safe slug', () => {
    expect(slugify('  Climate & Code  ')).toBe('climate-code');
    expect(slugify('Rust!!!')).toBe('rust');
  });

  it('returns empty when there is nothing sluggable', () => {
    expect(slugify('!!!')).toBe('');
  });
});

describe('validateCommunityName', () => {
  it('accepts a fresh name', () => {
    expect(validateCommunityName('Rust Nerds', [])).toBeUndefined();
  });

  it('requires a name', () => {
    expect(validateCommunityName('  ', [])).toMatch(/name/i);
  });

  it('bounds the length', () => {
    expect(validateCommunityName('a'.repeat(NAME_LIMIT + 1), [])).toMatch(/under/i);
  });

  it('rejects a name with no letters or numbers', () => {
    expect(validateCommunityName('!!!', [])).toMatch(/letter or number/i);
  });

  it('rejects a duplicate, case- and space-insensitively', () => {
    const existing = [{ name: 'Design Systems' }];
    expect(validateCommunityName('  design systems ', existing)).toMatch(/already exists/i);
  });
});

describe('parseCommunityState', () => {
  it('returns empty state for absent or corrupt storage', () => {
    expect(parseCommunityState(null)).toEqual(EMPTY_STATE);
    expect(parseCommunityState('nope')).toEqual(EMPTY_STATE);
    expect(parseCommunityState('[]')).toEqual(EMPTY_STATE);
  });

  it('drops malformed entries but keeps the valid ones', () => {
    const raw = JSON.stringify({
      joined: ['c1', 42, 'c1'],
      left: ['c2'],
      created: [community({ id: 'x' }), { id: 'broken' }],
    });
    const state = parseCommunityState(raw);
    expect(state.joined).toEqual(['c1']);
    expect(state.left).toEqual(['c2']);
    expect(state.created).toHaveLength(1);
  });
});

describe('isJoined', () => {
  it('falls back to the seeded default', () => {
    expect(isJoined(community({ joined: true }), EMPTY_STATE)).toBe(true);
    expect(isJoined(community({ joined: false }), EMPTY_STATE)).toBe(false);
  });

  it('honours an explicit join', () => {
    const state: CommunityState = { ...EMPTY_STATE, joined: ['c1'] };
    expect(isJoined(community(), state)).toBe(true);
  });

  it('honours leaving a community that seeds as joined', () => {
    // The bug this guards: a seeded `joined: true` must not override an
    // explicit leave, or the room re-joins itself on every reload.
    const state: CommunityState = { ...EMPTY_STATE, left: ['c1'] };
    expect(isJoined(community({ joined: true }), state)).toBe(false);
  });
});

describe('toggleMembership', () => {
  it('joins, and clears any prior leave', () => {
    const state = toggleMembership(community(), { ...EMPTY_STATE, left: ['c1'] });
    expect(state.joined).toContain('c1');
    expect(state.left).not.toContain('c1');
    expect(isJoined(community(), state)).toBe(true);
  });

  it('leaves a seeded-joined community, and clears any prior join', () => {
    const seeded = community({ joined: true });
    const state = toggleMembership(seeded, { ...EMPTY_STATE, joined: ['c1'] });
    expect(state.left).toContain('c1');
    expect(state.joined).not.toContain('c1');
    expect(isJoined(seeded, state)).toBe(false);
  });

  it('round-trips back to the seeded default', () => {
    const seeded = community({ joined: true });
    const once = toggleMembership(seeded, EMPTY_STATE);
    const twice = toggleMembership(seeded, once);
    expect(isJoined(seeded, twice)).toBe(true);
  });
});

describe('allCommunities', () => {
  it('appends created communities after the seeds', () => {
    const created = community({ id: 'new', name: 'Rust' });
    const list = allCommunities([community()], { ...EMPTY_STATE, created: [created] });
    expect(list).toHaveLength(2);
    expect(list[1].name).toBe('Rust');
  });
});
