import { describe, it, expect } from 'vitest';
import { parseSession } from '@/lib/session';

describe('parseSession', () => {
  it('reads not-signed-in for null, empty, or malformed input', () => {
    expect(parseSession(null)).toBe(false);
    expect(parseSession('')).toBe(false);
    expect(parseSession('{nope')).toBe(false);
  });

  it('accepts a bare true or a { signedIn: true } payload', () => {
    expect(parseSession('true')).toBe(true);
    expect(parseSession('{"signedIn":true}')).toBe(true);
  });

  it('reads signed out when the flag is false or missing', () => {
    expect(parseSession('false')).toBe(false);
    expect(parseSession('{"signedIn":false}')).toBe(false);
    expect(parseSession('{}')).toBe(false);
  });

  it('does not treat a truthy-but-wrong shape as signed in', () => {
    expect(parseSession('{"signedIn":"yes"}')).toBe(false);
    expect(parseSession('1')).toBe(false);
    expect(parseSession('"true"')).toBe(false);
  });
});
