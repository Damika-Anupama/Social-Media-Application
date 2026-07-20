import type { MetadataRoute } from 'next';
import { resolveSiteUrl } from '@/lib/site';

/**
 * Crawlers are welcome on the public surface (landing + auth) but the whole
 * dashboard sits behind a simulated session and has no stable public content
 * worth indexing, so it's disallowed. The sitemap is advertised absolutely so
 * it resolves regardless of where the app is deployed (see `resolveSiteUrl`).
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = resolveSiteUrl();
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/dashboard/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
