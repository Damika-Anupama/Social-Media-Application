/* eslint-disable @next/next/no-img-element */
import { notFound } from 'next/navigation';
import { ArrowLeft, Pin, Users2, Sparkles, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { TopBar } from '@/components/dashboard/TopBar';
import { PostCard } from '@/components/dashboard/PostCard';
import { communities, findCommunity, posts, formatCount } from '@/lib/mock-data';
import type { Metadata } from 'next';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return communities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const community = findCommunity(slug);
  if (!community) return { title: 'Community not found' };
  return { title: community.name, description: community.description };
}

export default async function CommunityPage({ params }: Params) {
  const { slug } = await params;
  const community = findCommunity(slug);
  if (!community) notFound();

  const feed = posts.slice(0, 4);
  const pinned = posts[0];

  return (
    <div className="px-4 pt-1 sm:px-6">
      <TopBar title={community.name} subtitle={community.description} />

      <Link
        href="/dashboard/communities"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> All communities
      </Link>

      <div className="card overflow-hidden">
        <div className="relative h-40 sm:h-56">
          <img src={community.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-raised via-bg-raised/30 to-transparent" />
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-300">
                <Users2 className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight">{community.name}</h2>
                <p className="text-xs text-ink-dim">
                  {formatCount(community.members)} members · {community.online} online · {community.topic}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-ghost px-4 py-2 text-sm">
                <MessageCircle className="h-4 w-4" /> Post in community
              </button>
              <button className="btn-primary px-4 py-2 text-sm">
                <Sparkles className="h-4 w-4" /> Following
              </button>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-muted">{community.description}</p>
        </div>
      </div>

      <section className="mt-6">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
          <Pin className="h-3.5 w-3.5 text-accent-sun" /> Pinned by moderators
        </h3>
        <PostCard post={pinned} />
      </section>

      <section className="mt-6">
        <h3 className="mb-3 text-sm font-semibold text-ink">Recent in {community.name}</h3>
        <div className="space-y-5">
          {feed.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
