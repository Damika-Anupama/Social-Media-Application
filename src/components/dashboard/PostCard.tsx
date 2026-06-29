/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  Share2,
  MoreHorizontal,
  MapPin,
  BadgeCheck,
} from 'lucide-react';
import type { Post } from '@/lib/mock-data';
import { formatCount } from '@/lib/mock-data';
import { Avatar } from '@/components/Avatar';
import { useReactions } from '@/lib/useReactions';

export function PostCard({ post }: { post: Post }) {
  const { isLiked, isBookmarked, toggleLike, toggleBookmark } = useReactions();
  const [reshared, setReshared] = useState(false);

  // The persisted reactions store is the single source of truth for the viewer's
  // own like/bookmark state, so it survives navigation and reloads.
  const liked = isLiked(post.id);
  const bookmarked = isBookmarked(post.id);

  const likeCount = post.metrics.likes + (liked ? 1 : 0);

  return (
    <article className="card group p-5 transition-colors hover:border-line">
      <header className="flex items-start gap-3">
        <Link href={`/dashboard/u/${post.author.handle}`} aria-label={`${post.author.name}'s profile`}>
          <Avatar user={post.author} size={44} />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <Link
              href={`/dashboard/u/${post.author.handle}`}
              className="font-semibold text-ink hover:underline"
            >
              {post.author.name}
            </Link>
            {post.author.verified && <BadgeCheck className="h-4 w-4 text-brand-300" aria-label="Verified" />}
            <Link
              href={`/dashboard/u/${post.author.handle}`}
              className="text-sm text-ink-dim hover:text-ink"
            >
              @{post.author.handle}
            </Link>
            <span className="text-sm text-ink-dim">·</span>
            <Link href={`/dashboard/p/${post.id}`} className="text-sm text-ink-dim hover:text-ink">
              {post.postedAt}
            </Link>
            {post.location && (
              <span className="inline-flex items-center gap-1 text-xs text-ink-dim">
                <MapPin className="h-3 w-3" /> {post.location}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-ink-dim line-clamp-1">{post.author.bio}</p>
        </div>
        <button className="btn-icon h-8 w-8" aria-label="More">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </header>

      <Link
        href={`/dashboard/p/${post.id}`}
        className="mt-4 block whitespace-pre-line text-[15px] leading-relaxed text-ink"
      >
        {post.body}
      </Link>

      {post.tags && post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.map((t) => (
            <span key={t} className="chip">#{t}</span>
          ))}
        </div>
      )}

      {post.media && <PostMedia media={post.media} />}

      <footer className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1 -ml-2 text-ink-muted">
          <ReactionButton
            icon={<Heart className={clsx('h-[18px] w-[18px]', liked && 'fill-accent-coral text-accent-coral')} />}
            count={likeCount}
            active={liked}
            tone="coral"
            onClick={() => toggleLike(post.id)}
            label="Like"
          />
          <ReactionButton
            icon={<MessageCircle className="h-[18px] w-[18px]" />}
            count={post.metrics.comments}
            tone="brand"
            label="Comment"
          />
          <ReactionButton
            icon={<Repeat2 className={clsx('h-[18px] w-[18px]', reshared && 'text-accent-mint')} />}
            count={post.metrics.shares + (reshared ? 1 : 0)}
            active={reshared}
            tone="mint"
            onClick={() => setReshared((v) => !v)}
            label="Re-share"
          />
          <ReactionButton
            icon={<Bookmark className={clsx('h-[18px] w-[18px]', bookmarked && 'fill-brand-300 text-brand-300')} />}
            count={post.metrics.bookmarks + (bookmarked ? 1 : 0)}
            active={bookmarked}
            tone="brand"
            onClick={() => toggleBookmark(post.id)}
            label="Bookmark"
          />
        </div>
        <button className="btn-icon h-8 w-8" aria-label="Share">
          <Share2 className="h-4 w-4" />
        </button>
      </footer>

      {post.topComment && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-line/60 bg-bg-subtle/50 p-3">
          <Avatar user={post.topComment.user} size={32} />
          <div className="flex-1 text-sm">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-ink">{post.topComment.user.name}</span>
              <span className="text-xs text-ink-dim">@{post.topComment.user.handle}</span>
            </div>
            <p className="mt-0.5 text-ink-muted">{post.topComment.text}</p>
          </div>
        </div>
      )}
    </article>
  );
}

function ReactionButton({
  icon,
  count,
  active,
  tone,
  onClick,
  label,
}: {
  icon: React.ReactNode;
  count: number;
  active?: boolean;
  tone: 'coral' | 'mint' | 'brand';
  onClick?: () => void;
  label: string;
}) {
  const hover = {
    coral: 'hover:text-accent-coral hover:bg-accent-coral/10',
    mint: 'hover:text-accent-mint hover:bg-accent-mint/10',
    brand: 'hover:text-brand-300 hover:bg-brand-500/10',
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
        active && tone === 'coral' && 'text-accent-coral',
        active && tone === 'mint' && 'text-accent-mint',
        active && tone === 'brand' && 'text-brand-300',
        hover,
      )}
    >
      {icon}
      {formatCount(count)}
    </button>
  );
}

function PostMedia({ media }: { media: NonNullable<Post['media']> }) {
  if (media.type === 'gallery' && Array.isArray(media.src)) {
    return (
      <div className="mt-4 grid grid-cols-3 gap-2 overflow-hidden rounded-2xl border border-line/60">
        {media.src.map((src, i) => (
          <img key={i} src={src} alt="" className="aspect-square w-full object-cover" />
        ))}
      </div>
    );
  }

  const aspect =
    media.aspect === 'wide' ? 'aspect-[16/10]' : media.aspect === 'portrait' ? 'aspect-[3/4]' : 'aspect-square';

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-line/60">
      <img src={media.src as string} alt="" className={clsx('w-full object-cover', aspect)} />
    </div>
  );
}
