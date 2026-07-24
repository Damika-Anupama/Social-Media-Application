import { describe, expect, it } from 'vitest';
import { LOCAL_SITE_URL, resolveSiteUrl } from './site';

describe('resolveSiteUrl', () => {
  it('falls back to localhost, never to a domain we do not own', () => {
    // The bug: this used to be a hardcoded vercel.app address that belongs to
    // someone else. Being obviously local beats being confidently wrong.
    expect(resolveSiteUrl({})).toBe(LOCAL_SITE_URL);
    expect(resolveSiteUrl({})).not.toContain('pulse-demo');
  });

  it('prefers an explicit custom domain above everything', () => {
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: 'https://pulse.example',
        VERCEL_PROJECT_PRODUCTION_URL: 'proj.vercel.app',
        VERCEL_URL: 'deploy-abc.vercel.app',
      }),
    ).toBe('https://pulse.example');
  });

  it("prefers the project's production domain over this deployment's URL", () => {
    // A preview build should advertise the canonical site, not its own
    // throwaway hostname — otherwise every preview competes for the same
    // content in search results.
    expect(
      resolveSiteUrl({
        VERCEL_PROJECT_PRODUCTION_URL: 'proj.vercel.app',
        VERCEL_URL: 'deploy-abc.vercel.app',
      }),
    ).toBe('https://proj.vercel.app');
  });

  it('uses the deployment URL when that is all there is', () => {
    expect(resolveSiteUrl({ VERCEL_URL: 'deploy-abc.vercel.app' })).toBe(
      'https://deploy-abc.vercel.app',
    );
  });

  it('adds the scheme Vercel omits', () => {
    expect(resolveSiteUrl({ VERCEL_URL: 'x.vercel.app' })).toMatch(/^https:\/\//);
  });

  it('keeps a scheme that is already there, including http for local overrides', () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: 'http://localhost:4000' })).toBe(
      'http://localhost:4000',
    );
  });

  it('trims a trailing slash, so URLs do not end up doubled', () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: 'https://pulse.example/' })).toBe(
      'https://pulse.example',
    );
  });

  it('ignores blank values rather than treating them as a domain', () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: '   ', VERCEL_URL: 'x.vercel.app' })).toBe(
      'https://x.vercel.app',
    );
  });
});
