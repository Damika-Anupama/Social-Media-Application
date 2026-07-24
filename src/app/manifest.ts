import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pulse',
    short_name: 'Pulse',
    description: 'A next-level social network for creators and curious minds.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#07070b',
    theme_color: '#07070b',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
