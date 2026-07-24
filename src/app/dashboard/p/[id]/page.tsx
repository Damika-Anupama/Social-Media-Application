import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { commentsFor, findPost, posts } from '@/lib/mock-data';
import { parseImageSize } from '@/lib/images';
import { TopBar } from '@/components/dashboard/TopBar';
import { PostCard } from '@/components/dashboard/PostCard';
import { CommentThread } from '@/components/dashboard/CommentThread';
import { FollowButton } from '@/components/dashboard/FollowButton';
import { Avatar } from '@/components/Avatar';
import { ArrowLeft, BadgeCheck, MapPin } from 'lucide-react';
import type { Metadata } from 'next';

type Params = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const post = findPost(id);
  if (!post) return { title: 'Post not found' };
  return {
    title: `${post.author.name} on Pulse`,
    description: post.body.slice(0, 160),
  };
}

export default async function PostDetailPage({ params }: Params) {
  const { id } = await params;
  const post = findPost(id);
  if (!post) notFound();

  const comments = commentsFor(post.id);
  const related = posts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <div className="px-4 pt-1 sm:px-6">
      <TopBar
        title="Post"
        subtitle={`A reply thread by ${post.author.name} and ${comments.length} others.`}
      />

      <Link
        href="/dashboard"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Back to feed
      </Link>

      <article className="card mb-6 p-6 sm:p-8">
        <header className="flex items-start gap-4">
          <Link href={`/dashboard/u/${post.author.handle}`}>
            <Avatar user={post.author} size={56} />
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <Link
                href={`/dashboard/u/${post.author.handle}`}
                className="text-base font-semibold text-ink hover:underline"
              >
                {post.author.name}
              </Link>
              {post.author.verified && <BadgeCheck className="h-4 w-4 text-brand-300" aria-label="Verified" />}
              <span className="text-sm text-ink-dim">@{post.author.handle}</span>
            </div>
            <p className="mt-0.5 text-xs text-ink-dim">{post.author.bio}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-ink-dim">
              <span>{post.postedAt} ago</span>
              {post.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {post.location}
                </span>
              )}
              <span className="badge text-[10px]">Pulse · public</span>
            </div>
          </div>
          <FollowButton user={post.author} />
        </header>

        <div className="mt-5 whitespace-pre-line text-base leading-relaxed text-ink">{post.body}</div>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <span key={t} className="chip">#{t}</span>
            ))}
          </div>
        )}

        {post.media && (
          <div className="mt-5 overflow-hidden rounded-2xl border border-line/60">
            {post.media.type === 'gallery' && Array.isArray(post.media.src) ? (
              <div className="grid grid-cols-3 gap-1">
                {post.media.src.map((src, i) => (
                  <div key={i} className="relative aspect-square w-full">
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 220px, 33vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              // This one had no aspect box at all — the page jumped when it landed.
              <Image
                src={post.media.src as string}
                alt=""
                width={parseImageSize(post.media.src as string).width}
                height={parseImageSize(post.media.src as string).height}
                sizes="(min-width: 1024px) 680px, 100vw"
                priority
                className="h-auto w-full"
              />
            )}
          </div>
        )}

        <dl className="mt-6 grid grid-cols-4 gap-3 border-t border-line/40 pt-5 text-center sm:text-left">
          <Stat label="Reactions" value={post.metrics.likes} />
          <Stat label="Replies" value={post.metrics.comments} />
          <Stat label="Re-shares" value={post.metrics.shares} />
          <Stat label="Bookmarks" value={post.metrics.bookmarks} />
        </dl>
      </article>

      {/* The anchor target for a post card's Comment button; scroll-mt keeps
          the heading clear of the sticky top bar when the hash lands here. */}
      <section id="replies" className="card mb-6 scroll-mt-20 p-6 sm:p-8">
        <h2 className="mb-5 text-base font-semibold text-ink">
          {comments.length} {comments.length === 1 ? 'reply' : 'replies'}
        </h2>
        <CommentThread postId={post.id} comments={comments} />
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-ink">More from your follows</h2>
        <div className="space-y-5">
          {related.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-lg font-semibold text-ink tabular-nums">{value.toLocaleString()}</div>
      <div className="text-[11px] uppercase tracking-wider text-ink-dim">{label}</div>
    </div>
  );
}
