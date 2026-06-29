/* eslint-disable @next/next/no-img-element */
'use client';

import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';
import { Flame, Globe2, MapPin, Search, Plus, Check, Loader2 } from 'lucide-react';
import { TopBar } from '@/components/dashboard/TopBar';
import { Avatar } from '@/components/Avatar';
import {
  exploreImages,
  generateExploreImage,
  trending,
  users,
  formatCount,
} from '@/lib/mock-data';
import { useInfiniteList } from '@/lib/useInfiniteList';
import { useFollowing } from '@/lib/useFollowing';
import { useToast } from '@/components/Toast';
import type { User } from '@/lib/mock-data';

const chips = ['For you', 'Trending', 'News', 'Design', 'Climate', 'Tech', 'Sports', 'Film', 'Music', 'Books'];

export function ExploreClient() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQ);
  const [activeChip, setActiveChip] = useState('For you');
  const { isFollowing, toggleFollow } = useFollowing();
  const { toast } = useToast();

  const onFollow = (u: User) => {
    const wasFollowing = isFollowing(u.id);
    toggleFollow(u.id);
    toast(wasFollowing ? `Unfollowed @${u.handle}` : `Following @${u.handle}`, {
      action: { label: 'Undo', onClick: () => toggleFollow(u.id) },
    });
  };

  const q = query.trim().toLowerCase();

  const filteredTrending = useMemo(() => {
    if (!q) return trending;
    return trending.filter((t) => t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
  }, [q]);

  const filteredUsers = useMemo(() => {
    if (!q) return users.slice(0, 8);
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.handle.toLowerCase().includes(q) ||
        (u.bio?.toLowerCase().includes(q) ?? false),
    );
  }, [q]);

  const loadMoreImages = useCallback(
    (startIndex: number) => Array.from({ length: 6 }, (_, i) => generateExploreImage(startIndex + i)),
    [],
  );
  const { items: feedImages, loading, sentinelRef } = useInfiniteList<string>(exploreImages, loadMoreImages, 6);

  return (
    <div className="px-4 pt-1 sm:px-6">
      <TopBar title="Explore" subtitle="What the rest of Pulse is paying attention to right now." />

      <div className="card mb-5 flex items-center gap-3 px-5 py-3">
        <Search className="h-4 w-4 text-ink-dim" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics, people, communities…"
          className="w-full bg-transparent text-sm text-ink placeholder:text-ink-dim focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="text-xs text-ink-muted hover:text-ink"
          >
            Clear
          </button>
        )}
      </div>

      <div className="mb-5 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {chips.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActiveChip(c)}
            className={clsx(
              'shrink-0 rounded-full px-4 py-1.5 text-xs transition-colors',
              activeChip === c
                ? 'bg-brand-500/15 font-semibold text-brand-200'
                : 'border border-line bg-bg-subtle font-medium text-ink-muted hover:text-ink',
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <section className="card mb-6 p-5">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-accent-coral" />
          <h2 className="text-sm font-semibold text-ink">Headline trends</h2>
        </div>
        {filteredTrending.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted">Nothing trending matches &ldquo;{query}&rdquo;.</p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTrending.map((t) => (
              <Link
                key={t.title}
                href={`/dashboard/explore?q=${encodeURIComponent(t.title)}`}
                onClick={() => setQuery(t.title)}
                className="group flex flex-col gap-1.5 rounded-2xl border border-line/60 bg-bg-subtle/60 p-4 text-left transition-colors hover:border-brand-400/40"
              >
                <span className="text-[11px] uppercase tracking-wider text-brand-300">{t.category}</span>
                <span className="text-base font-semibold text-ink">{t.title}</span>
                <span className="text-xs text-ink-dim">{t.posts}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="card mb-6 p-5">
        <div className="flex items-center gap-2">
          <Globe2 className="h-4 w-4 text-accent-mint" />
          <h2 className="text-sm font-semibold text-ink">People to discover</h2>
        </div>
        {filteredUsers.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted">No people match &ldquo;{query}&rdquo;.</p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((u) => {
              const followed = isFollowing(u.id);
              return (
                <div key={u.id} className="flex items-center gap-3 rounded-xl border border-line/60 bg-bg-subtle/60 p-3">
                  <Link href={`/dashboard/u/${u.handle}`} aria-label={`${u.name}'s profile`}>
                    <Avatar user={u} size={44} />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/dashboard/u/${u.handle}`}
                      className="block truncate text-sm font-semibold text-ink hover:underline"
                    >
                      {u.name}
                    </Link>
                    <div className="truncate text-xs text-ink-dim">
                      @{u.handle} · {formatCount(u.followers ?? 0)} followers
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onFollow(u)}
                    aria-pressed={followed}
                    className={clsx(
                      'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                      followed
                        ? 'border-accent-mint/40 bg-accent-mint/10 text-accent-mint'
                        : 'border-line bg-bg-raised text-ink-muted hover:border-brand-400/40 hover:text-ink',
                    )}
                  >
                    {followed ? (
                      <>
                        <Check className="h-3 w-3" /> Following
                      </>
                    ) : (
                      <>
                        <Plus className="h-3 w-3" /> Follow
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="card p-5">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-accent-sun" />
          <h2 className="text-sm font-semibold text-ink">Visual feed</h2>
        </div>
        <div className="mt-4 columns-2 gap-3 sm:columns-3 lg:columns-4">
          {feedImages.map((src, i) => (
            <button
              key={i}
              type="button"
              className="mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-line/60 transition-transform hover:-translate-y-0.5"
            >
              <img src={src} alt="" className="w-full" />
            </button>
          ))}
        </div>
        <div ref={sentinelRef} className="flex items-center justify-center pt-6">
          {loading && (
            <span className="inline-flex items-center gap-2 text-xs text-ink-muted">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading more
            </span>
          )}
        </div>
      </section>
    </div>
  );
}
