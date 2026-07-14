/**
 * Where this app actually lives.
 *
 * `metadataBase` was hardcoded to https://pulse-demo.vercel.app — a domain we
 * do not own. It resolves, but to a stranger's default "Create Next App". Every
 * canonical URL, OpenGraph tag and Twitter card the app emitted pointed at
 * someone else's website: share a post and the preview belongs to them.
 *
 * A build should not have to be told where it is. Vercel already says so:
 *   VERCEL_PROJECT_PRODUCTION_URL — the project's stable production domain
 *   VERCEL_URL                    — this specific deployment (previews included)
 *
 * Pure, so the precedence can be tested without a deployment.
 */

export type SiteEnv = {
  NEXT_PUBLIC_SITE_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
  VERCEL_URL?: string;
};

/** Localhost, not a guessed domain: being obviously local beats being wrong. */
export const LOCAL_SITE_URL = 'http://localhost:3000';

function withScheme(host: string): string {
  return /^https?:\/\//.test(host) ? host : `https://${host}`;
}

/**
 * Resolve the site's public origin.
 *
 * An explicit NEXT_PUBLIC_SITE_URL wins (a custom domain). Then the project's
 * production domain, so preview builds still advertise the canonical site
 * rather than their own throwaway URL. Then this deployment. Then localhost.
 */
export function resolveSiteUrl(env: SiteEnv = process.env as SiteEnv): string {
  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return withScheme(explicit).replace(/\/$/, '');

  const production = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return withScheme(production);

  const deployment = env.VERCEL_URL?.trim();
  if (deployment) return withScheme(deployment);

  return LOCAL_SITE_URL;
}
