import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ExploreClient } from './ExploreClient';

export const metadata: Metadata = {
  title: 'Explore',
  description: 'Discover trending topics, people, and communities on Pulse.',
};

export default function ExplorePage() {
  return (
    <Suspense fallback={null}>
      <ExploreClient />
    </Suspense>
  );
}
