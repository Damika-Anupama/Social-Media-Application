'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { Sparkles, Radio, BookOpen, Loader2 } from 'lucide-react';
import { PostCard } from './PostCard';
import { useInfiniteList } from '@/lib/useInfiniteList';
import { generatePost, postsForCategory, type Post, type PostCategory } from '@/lib/mock-data';

const tabs: { id: PostCategory; label: string; accent?: boolean; icon?: React.ComponentType<{ className?: string }> }[] = [
  { id: 'foryou', label: 'For you' },
  { id: 'following', label: 'Following' },
  { id: 'longform', label: 'Long-form', icon: BookOpen },
  { id: 'live', label: 'Live now', accent: true, icon: Radio },
];

export function HomeFeed({
  userPosts = [],
  onRemoveUserPost,
}: {
  userPosts?: Post[];
  onRemoveUserPost?: (id: string) => void;
} = {}) {
  const [category, setCategory] = useState<PostCategory>('foryou');

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

  return (
    <>
      <div className="card flex flex-wrap items-center gap-1 p-1">
        {tabs.map((t) => {
          const active = t.id === category;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setCategory(t.id)}
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
        <Link
          href="/dashboard/explore"
          className="ml-auto mr-2 inline-flex items-center gap-1.5 text-xs text-ink-dim hover:text-ink"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent-sun" />
          Ranking is transparent — view signals
        </Link>
      </div>

      <div className="space-y-5">
        {category === 'foryou' &&
          userPosts.map((p) => (
            <div key={p.id} className="relative" data-testid="user-post">
              <PostCard post={p} />
              {onRemoveUserPost && (
                <button
                  type="button"
                  onClick={() => onRemoveUserPost(p.id)}
                  aria-label="Delete your post"
                  className="absolute right-4 top-4 rounded-full border border-line bg-bg-subtle px-2 py-1 text-xs text-ink-muted hover:text-accent-coral"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        {items.length === 0 && userPosts.length === 0 ? (
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
