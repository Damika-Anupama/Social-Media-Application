import { describe, expect, it } from 'vitest';
import {
  LIMITS,
  isValidProfile,
  normalizeProfile,
  parseProfileEdits,
  profilePostCount,
  validateProfile,
  type ProfileEdits,
} from './profile';

const valid: ProfileEdits = {
  name: 'Ada Lovelace',
  bio: 'Writing notes on the Analytical Engine.',
  location: 'London',
  link: 'ada.example',
};

describe('validateProfile', () => {
  it('accepts a well-formed profile', () => {
    expect(validateProfile(valid)).toEqual({});
    expect(isValidProfile(valid)).toBe(true);
  });

  it('requires a display name', () => {
    expect(validateProfile({ ...valid, name: '' }).name).toMatch(/required/i);
    // Whitespace is not a name.
    expect(validateProfile({ ...valid, name: '   ' }).name).toMatch(/required/i);
    expect(isValidProfile({ ...valid, name: '  ' })).toBe(false);
  });

  it('bounds every field', () => {
    expect(validateProfile({ ...valid, name: 'a'.repeat(LIMITS.name + 1) }).name).toBeDefined();
    expect(validateProfile({ ...valid, bio: 'a'.repeat(LIMITS.bio + 1) }).bio).toBeDefined();
    expect(
      validateProfile({ ...valid, location: 'a'.repeat(LIMITS.location + 1) }).location,
    ).toBeDefined();
    expect(validateProfile({ ...valid, link: 'a'.repeat(LIMITS.link + 1) }).link).toBeDefined();
  });

  it('accepts a field exactly at the limit', () => {
    expect(validateProfile({ ...valid, bio: 'a'.repeat(LIMITS.bio) }).bio).toBeUndefined();
  });

  it('allows the optional fields to be empty', () => {
    expect(isValidProfile({ name: 'Ada', bio: '', location: '', link: '' })).toBe(true);
  });
});

describe('normalizeProfile', () => {
  it('trims every field', () => {
    expect(normalizeProfile({ name: ' Ada ', bio: ' hi ', location: ' UK ', link: ' a.com ' })).toEqual(
      { name: 'Ada', bio: 'hi', location: 'UK', link: 'a.com' },
    );
  });
});

describe('parseProfileEdits', () => {
  it('returns nothing for absent or corrupt storage', () => {
    expect(parseProfileEdits(null)).toEqual({});
    expect(parseProfileEdits('nope')).toEqual({});
    expect(parseProfileEdits('[]')).toEqual({});
  });

  it('reads a partial payload, leaving the rest to the seed', () => {
    expect(parseProfileEdits(JSON.stringify({ name: 'Ada' }))).toEqual({ name: 'Ada' });
  });

  it('keeps an intentionally cleared optional field', () => {
    // Clearing a bio is a real edit, not a missing value.
    expect(parseProfileEdits(JSON.stringify({ bio: '' }))).toEqual({ bio: '' });
  });

  it('drops a stored blank name rather than blanking the profile', () => {
    expect(parseProfileEdits(JSON.stringify({ name: '  ', bio: 'hi' }))).toEqual({ bio: 'hi' });
  });

  it('ignores non-string values', () => {
    expect(parseProfileEdits(JSON.stringify({ name: 42, bio: null }))).toEqual({});
  });
});

describe('profilePostCount', () => {
  it('sums seeded and composed posts', () => {
    expect(profilePostCount(0, 0)).toBe(0);
    expect(profilePostCount(2, 3)).toBe(5);
  });

  it('grows as the user composes', () => {
    // No seed posts for the current user in this demo: the count IS the store.
    expect(profilePostCount(0, 1)).toBe(1);
    expect(profilePostCount(0, 4)).toBe(4);
  });

  it('never goes negative on malformed input', () => {
    expect(profilePostCount(-5, -2)).toBe(0);
    expect(profilePostCount(-1, 3)).toBe(3);
  });
});
