import { notFound } from 'next/navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import {
  allHandles,
  findUser,
  formatCount,
  posts,
  postsByUser,
  users,
} from '@/lib/mock-data';
import { PublicProfileClient } from './PublicProfileClient';
import type { Metadata } from 'next';

type Params = { params: Promise<{ handle: string }> };

export function generateStaticParams() {
  return allHandles().map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { handle } = await params;
  const user = findUser(handle);
  if (!user) return { title: '@' + handle + ' not found' };
  return {
    title: `${user.name} (@${user.handle})`,
    description: user.bio,
  };
}

const covers: Record<string, string> = {
  nadia: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80',
  kenji: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
  sasha: 'https://images.unsplash.com/photo-1499678329028-101435549a4e?auto=format&fit=crop&w=1600&q=80',
  amaru: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
  lina: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
  theo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80',
  priya: 'https://images.unsplash.com/photo-1517242027094-631f8c218a0f?auto=format&fit=crop&w=1600&q=80',
  marcos: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80',
  demo: 'https://images.unsplash.com/photo-1502691876148-a84978e59af8?auto=format&fit=crop&w=1600&q=80',
};

export default async function PublicProfilePage({ params }: Params) {
  const { handle } = await params;
  const user = findUser(handle);
  if (!user) notFound();

  const userPosts = postsByUser(user.id);
  const basePosts = userPosts.length > 0 ? userPosts : posts.slice(0, 3);
  const cover = covers[user.handle] ?? covers.nadia;
  const followsBack = users.slice(0, 4).filter((u) => u.id !== user.id);

  return (
    <div className="px-4 pt-1 sm:px-6">
      <TopBar
        title={user.name}
        subtitle={`@${user.handle} · ${formatCount(user.followers ?? 0)} followers`}
      />
      <PublicProfileClient
        user={user}
        cover={cover}
        followsBack={followsBack}
        basePosts={basePosts}
      />
    </div>
  );
}
