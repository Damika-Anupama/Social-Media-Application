import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Hash } from 'lucide-react';
import type { Metadata } from 'next';
import { TopBar } from '@/components/dashboard/TopBar';
import { PostCard } from '@/components/dashboard/PostCard';
import { posts } from '@/lib/mock-data';
import { allTags, normalizeTag, postsForTag, relatedTags } from '@/lib/hashtagFeed';

type Params = { params: Promise<{ tag: string }> };

export function generateStaticParams() {
  return allTags(posts).map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { tag } = await params;
  const t = normalizeTag(decodeURIComponent(tag));
  if (!t || postsForTag(posts, t).length === 0) return { title: 'Tag not found' };
  return { title: `#${t}`, description: `Posts tagged #${t} on Pulse.` };
}

export default async function TagPage({ params }: Params) {
  const { tag } = await params;
  const t = normalizeTag(decodeURIComponent(tag));
  const feed = postsForTag(posts, t);
  if (!t || feed.length === 0) notFound();
  const related = relatedTags(posts, t);
  const count = `${feed.length} post${feed.length === 1 ? '' : 's'}`;

  return (
    <div className="px-4 pt-1 sm:px-6">
      <TopBar title={`#${t}`} subtitle={`${count} tagged #${t}`} />

      <Link
        href="/dashboard/explore"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Explore
      </Link>

      <div className="card flex items-center gap-4 p-6">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-300">
          <Hash className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">#{t}</h2>
          <p className="text-xs text-ink-dim">{count} · sorted by engagement</p>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-ink-dim">Related</span>
          {related.map((r) => (
            <Link key={r} href={`/dashboard/tag/${r}`} className="chip transition-colors hover:text-ink">
              #{r}
            </Link>
          ))}
        </div>
      )}

      <section className="mt-6 space-y-5">
        {feed.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </section>
    </div>
  );
}
