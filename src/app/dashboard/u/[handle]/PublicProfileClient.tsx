/* eslint-disable @next/next/no-img-element -- avatars are remote SVGs; see components/Avatar.tsx */
'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import {
  Calendar,
  MapPin,
  Link as LinkIcon,
  BadgeCheck,
  MessageCircle,
  UserPlus,
  Share2,
  Check,
} from 'lucide-react';
import { Avatar } from '@/components/Avatar';
import { PostCard } from '@/components/dashboard/PostCard';
import { formatCount, posts, type Post, type User } from '@/lib/mock-data';
import { useToast } from '@/components/Toast';
import { useFollowing } from '@/lib/useFollowing';
import { buildShareUrl, shareLink } from '@/lib/share';

const tabs = ['Posts', 'Replies', 'Media', 'Long-form', 'Likes'] as const;
type Tab = (typeof tabs)[number];

export function PublicProfileClient({
  user,
  cover,
  followsBack,
  basePosts,
}: {
  user: User;
  cover: string;
  followsBack: User[];
  basePosts: Post[];
}) {
  const [tab, setTab] = useState<Tab>('Posts');
  const { toast } = useToast();
  const { isFollowing, toggleFollow } = useFollowing();

  // Follow state lives in the shared, persistent store so it stays in sync with
  // Explore and the right-rail suggestions and survives reloads.
  const following = isFollowing(user.id);

  const onToggleFollow = () => {
    const wasFollowing = following;
    toggleFollow(user.id);
    toast(wasFollowing ? `Unfollowed @${user.handle}` : `Following @${user.handle}`, {
      action: { label: 'Undo', onClick: () => toggleFollow(user.id) },
    });
  };

  const onShare = async () => {
    const result = await shareLink({
      url: buildShareUrl(`/dashboard/u/${user.handle}`),
      title: `${user.name} (@${user.handle}) on Pulse`,
      text: user.bio,
    });
    if (result === 'copied') toast('Profile link copied to clipboard');
    else if (result === 'failed') toast('Could not share this profile', { tone: 'info' });
  };

  const tabPosts = useMemo(() => {
    const decorated = basePosts.map((p) => ({ ...p, author: user }));
    switch (tab) {
      case 'Posts':
        return decorated;
      case 'Replies':
        return decorated.slice(1);
      case 'Media':
        return decorated.filter((p) => p.media);
      case 'Long-form':
        return decorated.filter((p) => p.category === 'longform');
      case 'Likes':
        return posts.slice(0, 2);
    }
  }, [tab, user, basePosts]);

  return (
    <>
      <div className="card overflow-hidden">
        <div className="relative h-48 sm:h-60">
          <Image
            src={cover}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 900px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-raised via-bg-raised/40 to-transparent" />
        </div>
        <div className="px-6 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <span className="relative inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 via-brand-500 to-accent-mint p-1 shadow-xl">
                <img src={user.avatar} alt="" className="h-full w-full rounded-full bg-bg object-cover" />
              </span>
              <div className="pb-2">
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-2xl font-semibold tracking-tight">{user.name}</h2>
                  {user.verified && <BadgeCheck className="h-5 w-5 text-brand-300" aria-label="Verified" />}
                </div>
                <p className="text-sm text-ink-dim">@{user.handle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pb-2">
              <button type="button" onClick={onShare} className="btn-icon" aria-label="Share profile">
                <Share2 className="h-4 w-4" />
              </button>
              <Link href="/dashboard/messages" className="btn-ghost px-4 py-2 text-sm">
                <MessageCircle className="h-4 w-4" /> Message
              </Link>
              <button
                type="button"
                onClick={onToggleFollow}
                aria-pressed={following}
                className={clsx(
                  'px-4 py-2 text-sm font-semibold transition-colors',
                  following
                    ? 'inline-flex items-center gap-2 rounded-full border border-accent-mint/40 bg-accent-mint/10 text-accent-mint-fg'
                    : 'btn-primary',
                )}
              >
                {following ? (
                  <>
                    <Check className="h-4 w-4" /> Following
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" /> Follow
                  </>
                )}
              </button>
            </div>
          </div>

          {user.bio && (
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-muted">{user.bio}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-ink-dim">
            {user.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {user.location}
              </span>
            )}
            {user.link && (
              <a
                className="inline-flex min-h-[24px] items-center gap-1 text-brand-300 hover:text-brand-200"
                href={`https://${user.link}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkIcon className="h-3.5 w-3.5" /> {user.link}
              </a>
            )}
            {user.joined && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Joined {user.joined}
              </span>
            )}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <Stat label="Posts" value={basePosts.length.toString()} />
            <Stat
              label="Following"
              value={formatCount(user.following ?? 0)}
              href={`/dashboard/u/${user.handle}/following`}
            />
            <Stat
              label="Followers"
              value={formatCount((user.followers ?? 0) + (following ? 1 : 0))}
              href={`/dashboard/u/${user.handle}/followers`}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0 space-y-5">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {tabs.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={clsx(
                  'rounded-full px-4 py-1.5 text-xs transition-colors',
                  tab === t
                    ? 'bg-brand-500/15 font-semibold text-brand-200'
                    : 'border border-line bg-bg-subtle font-medium text-ink-muted hover:text-ink',
                )}
              >
                {t}
              </button>
            ))}
          </div>
          {tabPosts.length === 0 ? (
            <div className="card p-10 text-center text-sm text-ink-muted">Nothing in {tab.toLowerCase()} yet.</div>
          ) : (
            tabPosts.map((p) => <PostCard key={p.id} post={p} />)
          )}
        </div>

        <aside className="hidden flex-col gap-4 lg:flex">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-ink">Followed by people you know</h3>
            <ul className="mt-4 space-y-3">
              {followsBack.slice(0, 3).map((u) => (
                <li key={u.id}>
                  <Link href={`/dashboard/u/${u.handle}`} className="flex items-center gap-3 hover:opacity-80">
                    <Avatar user={u} size={32} />
                    <span className="text-sm">
                      <span className="font-semibold text-ink">{u.name}</span>
                      <span className="block text-xs text-ink-dim">@{u.handle}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-ink-dim">
              And {Math.max((user.followers ?? 0) - followsBack.length, 0).toLocaleString()} others you don&apos;t.
            </p>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-ink">Pinned link</h3>
            <a
              href={`https://${user.link ?? `${user.handle}.studio`}`}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3 block rounded-xl border border-line/60 bg-bg-subtle/60 p-4 transition-colors hover:border-brand-400/40"
            >
              <div className="text-[11px] uppercase tracking-wider text-brand-300">Studio</div>
              <div className="mt-1 text-sm font-semibold text-ink">{user.link ?? `${user.handle}.studio`}</div>
              <div className="text-xs text-ink-dim">Updated this week</div>
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}

function Stat({ label, value, href }: { label: string; value: string; href?: string }) {
  const body = (
    <>
      <div className="text-lg font-semibold text-ink">{value}</div>
      <div className="text-[11px] uppercase tracking-wider text-ink-dim">{label}</div>
    </>
  );
  const base = 'rounded-2xl border border-line/60 bg-bg-subtle/60 p-3';
  return href ? (
    <Link href={href} className={clsx(base, 'block text-left transition-colors hover:border-brand-400/40')}>
      {body}
    </Link>
  ) : (
    <div className={base}>{body}</div>
  );
}
