import type { MetadataRoute } from 'next';
import { resolveSiteUrl } from '@/lib/site';

/**
 * Only the genuinely public routes belong here — everything under /dashboard is
 * gated behind a simulated session. The landing page is the priority entry
 * point; the auth and policy pages round out what a crawler should know about.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = resolveSiteUrl();
  const paths: { path: string; priority: number }[] = [
    { path: '/', priority: 1 },
    { path: '/login', priority: 0.5 },
    { path: '/register', priority: 0.5 },
    { path: '/legal/terms', priority: 0.3 },
    { path: '/legal/privacy', priority: 0.3 },
    { path: '/help', priority: 0.3 },
  ];
  return paths.map(({ path, priority }) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: 'monthly',
    priority,
  }));
}
