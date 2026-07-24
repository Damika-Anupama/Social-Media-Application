'use client';

import { useState } from 'react';
import Image from 'next/image';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { normalizeTag } from '@/lib/hashtagFeed';
import { Avatar } from '@/components/Avatar';
import { DemoButton } from '@/components/DemoButton';
import { useReactions } from '@/lib/useReactions';
import { useToast } from '@/components/Toast';
import { buildShareUrl, shareLink } from '@/lib/share';

export function PostCard({ post }: { post: Post }) {
  const { isLiked, isBookmarked, isReshared, toggleLike, toggleBookmark, toggleReshare } =
    useReactions();
  const { toast } = useToast();
  const router = useRouter();
  // Animates the heart only on the press that likes — not on every card that
  // renders already-liked.
  const [likePopped, setLikePopped] = useState(false);

  const onToggleReshare = () => {
    const wasReshared = isReshared(post.id);
    toggleReshare(post.id);
    toast(wasReshared ? 'Removed re-share' : 'Re-shared to your feed', {
      action: { label: 'Undo', onClick: () => toggleReshare(post.id) },
    });
  };

  const onShare = async () => {
    const result = await shareLink({
      url: buildShareUrl(`/dashboard/p/${post.id}`),
      title: `${post.author.name} on Pulse`,
      text: post.body.slice(0, 120),
    });
    if (result === 'copied') toast('Link copied to clipboard');
    else if (result === 'failed') toast('Could not share this post', { tone: 'info' });
  };

  const onToggleBookmark = () => {
    const wasBookmarked = isBookmarked(post.id);
    toggleBookmark(post.id);
    toast(wasBookmarked ? 'Removed from bookmarks' : 'Saved to bookmarks', {
      action: { label: 'Undo', onClick: () => toggleBookmark(post.id) },
    });
  };

  // The persisted reactions store is the single source of truth for the viewer's
  // own like/bookmark state, so it survives navigation and reloads.
  const liked = isLiked(post.id);
  const bookmarked = isBookmarked(post.id);
  const reshared = isReshared(post.id);

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
              className="inline-flex min-h-[24px] items-center font-semibold text-ink hover:underline"
            >
              {post.author.name}
            </Link>
            {post.author.verified && <BadgeCheck className="h-4 w-4 text-brand-300" aria-label="Verified" />}
            <Link
              href={`/dashboard/u/${post.author.handle}`}
              className="inline-flex min-h-[24px] items-center text-sm text-ink-dim hover:text-ink"
            >
              @{post.author.handle}
            </Link>
            <span className="text-sm text-ink-dim">·</span>
            {/* "12m" is a 27x20 target — under the 24px minimum, and the one
                thing in the header people actually tap to open the post. */}
            <Link
              href={`/dashboard/p/${post.id}`}
              className="inline-flex min-h-[24px] min-w-[24px] items-center justify-center text-sm text-ink-dim hover:text-ink"
            >
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
        <DemoButton notice="The post menu isn't part of this demo — sharing and bookmarking are." className="btn-icon h-8 w-8" aria-label="More options for this post">
          <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
        </DemoButton>
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
            <Link
              key={t}
              href={`/dashboard/tag/${normalizeTag(t)}`}
              className="chip transition-colors hover:text-ink"
            >
              #{t}
            </Link>
          ))}
        </div>
      )}

      {post.media && <PostMedia media={post.media} />}

      <footer className="mt-4 flex items-center justify-between gap-2">
        {/* The four reaction buttons could not shrink, so a post card had a
            min-content width wider than a 320px phone. */}
        <div className="-ml-2 flex min-w-0 flex-1 items-center gap-0.5 text-ink-muted sm:gap-1">
          <ReactionButton
            icon={
              <span
                className={clsx('inline-flex', likePopped && 'motion-safe:animate-pop')}
                onAnimationEnd={() => setLikePopped(false)}
              >
                <Heart className={clsx('h-[18px] w-[18px]', liked && 'fill-accent-coral text-accent-coral-fg')} />
              </span>
            }
            count={likeCount}
            active={liked}
            tone="coral"
            onClick={() => {
              if (!liked) setLikePopped(true);
              toggleLike(post.id);
            }}
            label="Like"
          />
          <ReactionButton
            icon={<MessageCircle className="h-[18px] w-[18px]" />}
            count={post.metrics.comments}
            tone="brand"
            onClick={() => router.push(`/dashboard/p/${post.id}#replies`)}
            label="Comment"
          />
          <ReactionButton
            icon={<Repeat2 className={clsx('h-[18px] w-[18px]', reshared && 'text-accent-mint-fg')} />}
            count={post.metrics.shares + (reshared ? 1 : 0)}
            active={reshared}
            tone="mint"
            onClick={onToggleReshare}
            label="Re-share"
          />
          <ReactionButton
            icon={<Bookmark className={clsx('h-[18px] w-[18px]', bookmarked && 'fill-brand-300 text-brand-300')} />}
            count={post.metrics.bookmarks + (bookmarked ? 1 : 0)}
            active={bookmarked}
            tone="brand"
            onClick={onToggleBookmark}
            label="Bookmark"
          />
        </div>
        <button type="button" onClick={onShare} className="btn-icon h-8 w-8" aria-label="Share post">
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
  // Required on purpose: the dead-controls guard sees `onClick={onClick}` and
  // is satisfied, so an optional prop here is how the Comment button shipped
  // doing nothing at all.
  onClick: () => void;
  label: string;
}) {
  const hover = {
    coral: 'hover:text-accent-coral-fg hover:bg-accent-coral/10',
    mint: 'hover:text-accent-mint-fg hover:bg-accent-mint/10',
    brand: 'hover:text-brand-300 hover:bg-brand-500/10',
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={clsx(
        'inline-flex min-w-0 shrink items-center gap-1 rounded-full px-2 py-1.5 text-xs font-medium transition-colors sm:gap-1.5 sm:px-3',
        active && tone === 'coral' && 'text-accent-coral-fg',
        active && tone === 'mint' && 'text-accent-mint-fg',
        active && tone === 'brand' && 'text-brand-300',
        hover,
      )}
    >
      {icon}
      {formatCount(count)}
    </button>
  );
}

/**
 * Post media, served through next/image.
 *
 * The aspect box already reserved the space; what was missing was the
 * optimizer — every one of these was a full-size original, hand-fetched.
 */
function PostMedia({ media }: { media: NonNullable<Post['media']> }) {
  if (media.type === 'gallery' && Array.isArray(media.src)) {
    return (
      <div className="mt-4 grid grid-cols-3 gap-2 overflow-hidden rounded-2xl border border-line/60">
        {media.src.map((src, i) => (
          <div key={i} className="relative aspect-square w-full">
            <Image
              src={src}
              alt=""
              fill
              sizes="(min-width: 640px) 200px, 33vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    );
  }

  const aspect =
    media.aspect === 'wide' ? 'aspect-[16/10]' : media.aspect === 'portrait' ? 'aspect-[3/4]' : 'aspect-square';

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-line/60">
      <div className={clsx('relative w-full', aspect)}>
        <Image
          src={media.src as string}
          alt=""
          fill
          sizes="(min-width: 1024px) 600px, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
