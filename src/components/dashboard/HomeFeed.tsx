'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { Sparkles, Radio, BookOpen, Loader2 } from 'lucide-react';
import { PostCard } from './PostCard';
import { useTabs } from '@/components/Tabs';
import { useInfiniteList } from '@/lib/useInfiniteList';
import { generatePost, postsForCategory, type Post, type PostCategory } from '@/lib/mock-data';
import { useUserPostsContext } from '@/lib/UserPostsContext';
import { useToast } from '@/components/Toast';

const tabs: { id: PostCategory; label: string; accent?: boolean; icon?: React.ComponentType<{ className?: string }> }[] = [
  { id: 'foryou', label: 'For you' },
  { id: 'following', label: 'Following' },
  { id: 'longform', label: 'Long-form', icon: BookOpen },
  { id: 'live', label: 'Live now', accent: true, icon: Radio },
];

export function HomeFeed() {
  const [category, setCategory] = useState<PostCategory>('foryou');
  const { posts: userPosts, removePost } = useUserPostsContext();
  const { toast } = useToast();
  // The feed switcher is a tablist, not a row of independent buttons: one Tab
  // stop, arrows to move, and aria-selected so the active feed is announced.
  const { tabListProps, getTabProps } = useTabs({
    items: tabs,
    selected: tabs.findIndex((t) => t.id === category),
    onSelect: (i) => setCategory(tabs[i].id),
  });

  const initialFor = useCallback((cat: PostCategory) => {
    const base = postsForCategory(cat);
    if (cat === 'live') {
      return [...base, generatePost('live', 0), generatePost('live', 1)];
    }
    return base.length ? base : [generatePost(cat, 0), generatePost(cat, 1), generatePost(cat, 2)];
  }, []);

  const initial = useMemo(() => initialFor(category), [category, initialFor]);

  const loadMore = useCallback(
    (startIndex: number) => Array.from({ length: 4 }, (_, i) => generatePost(category, startIndex + i)),
    [category],
  );

  const { items, loading, sentinelRef, reset } = useInfiniteList<Post>(initial, loadMore, 4);

  useEffect(() => {
    reset(initial);
  }, [initial, reset]);

  const pinnedPosts = category === 'foryou' || category === 'following' ? userPosts : [];
  const isEmpty = pinnedPosts.length === 0 && items.length === 0;

  return (
    <>
      <div className="card flex flex-wrap items-center gap-1 p-1">
        {/* The tablist wraps only the tabs — the "view signals" link is a
            sibling, because a link inside a tablist is not a tab. */}
        <div {...tabListProps} aria-label="Feed" className="flex flex-wrap items-center gap-1">
          {tabs.map((t, i) => {
            const active = t.id === category;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                {...getTabProps(i)}
                className={clsx(
                  'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-colors',
                  active
                    ? 'bg-brand-500/15 font-semibold text-brand-200'
                    : 'font-medium text-ink-muted hover:bg-bg-elevated hover:text-ink',
                )}
              >
                {t.accent && <span className="h-1.5 w-1.5 rounded-full bg-accent-coral animate-pulse" />}
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {t.label}
              </button>
            );
          })}
        </div>
        <Link
          href="/dashboard/explore"
          className="ml-auto mr-2 inline-flex min-h-[24px] items-center gap-1.5 text-xs text-ink-dim hover:text-ink"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent-sun-fg" />
          Ranking is transparent — view signals
        </Link>
      </div>

      <div className="space-y-5">
        {pinnedPosts.map((p) => (
          <div key={p.id} className="relative" data-testid="user-post">
            <PostCard post={p} />
            <button
              type="button"
              onClick={() => {
                removePost(p.id);
                toast('Post deleted');
              }}
              aria-label="Delete your post"
              className="absolute right-4 top-4 rounded-full border border-line bg-bg-subtle/80 px-2.5 py-1 text-xs text-ink-muted backdrop-blur transition-colors hover:border-accent-coral/40 hover:text-accent-coral-fg"
            >
              Delete
            </button>
          </div>
        ))}
        {isEmpty ? (
          <EmptyState category={category} />
        ) : (
          items.map((p) => <PostCard key={p.id} post={p} />)
        )}
      </div>

      <div ref={sentinelRef} className="flex items-center justify-center py-8">
        {loading ? (
          <span className="inline-flex items-center gap-2 text-xs text-ink-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading more posts
          </span>
        ) : items.length > 0 ? (
          <span className="text-xs text-ink-dim">Scroll for more</span>
        ) : null}
      </div>
    </>
  );
}

function EmptyState({ category }: { category: PostCategory }) {
  const messages: Record<PostCategory, { title: string; body: string }> = {
    foryou: { title: 'Quiet feed', body: 'No one has posted recently. Try Following or Long-form.' },
    following: { title: 'Nothing from your follows yet', body: 'Follow a few more people from Explore to fill this up.' },
    longform: { title: 'No long-form today', body: 'Essays and reporting will show up here when they are ready.' },
    live: { title: 'No live rooms right now', body: 'When someone you follow goes live, it will appear here.' },
  };
  const m = messages[category];
  return (
    <div className="card flex flex-col items-center gap-2 p-10 text-center">
      <span className="badge">{m.title}</span>
      <p className="text-sm text-ink-muted">{m.body}</p>
    </div>
  );
}
