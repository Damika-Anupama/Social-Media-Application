'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { Flame, Globe2, MapPin, Search, Plus, Check, Loader2, SearchX, X } from 'lucide-react';
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
import {
  EXPLORE_CHIPS,
  buildSearchQuery,
  describeResults,
  isEmptySearch,
  matchesChip,
  normalizeQuery,
  type ExploreChip,
} from '@/lib/search';
import { parseImageSize } from '@/lib/images';
import { useDialog } from '@/lib/useDialog';
import { Portal } from '@/components/Portal';
import type { User } from '@/lib/mock-data';


/** Debounce before rewriting the URL, so typing does not spam history. */
const URL_SYNC_MS = 250;

export function ExploreClient() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const urlQuery = normalizeQuery(searchParams.get('q'));

  const [query, setQuery] = useState(urlQuery);
  const [activeChip, setActiveChip] = useState<ExploreChip>('For you');
  const [lightbox, setLightbox] = useState<string | null>(null);
  const { isFollowing, toggleFollow } = useFollowing();
  const { toast } = useToast();

  /**
   * The URL is the source of truth. Adopt it whenever it changes underneath us
   * — the command palette pushes ?q=… even when Explore is already open, and
   * Back/Forward move between searches. Without this the input silently
   * ignored both.
   */
  useEffect(() => {
    setQuery((current) => (normalizeQuery(current) === urlQuery ? current : urlQuery));
  }, [urlQuery]);

  /**
   * Reflect typing back into the URL (debounced) so a search is shareable.
   *
   * Uses the native History API rather than router.replace: the App Router
   * treats a replace to the same route as a no-op, so clearing the search
   * would leave a stale ?q= behind forever. Next syncs useSearchParams with
   * native history updates, so this stays the source of truth.
   */
  const syncTimer = useRef<number | null>(null);
  useEffect(() => {
    if (normalizeQuery(query) === urlQuery) return;
    syncTimer.current = window.setTimeout(() => {
      window.history.replaceState(null, '', `${pathname}${buildSearchQuery(query)}`);
    }, URL_SYNC_MS);
    return () => {
      if (syncTimer.current !== null) window.clearTimeout(syncTimer.current);
    };
  }, [query, urlQuery, pathname]);

  const onFollow = (u: User) => {
    const wasFollowing = isFollowing(u.id);
    toggleFollow(u.id);
    toast(wasFollowing ? `Unfollowed @${u.handle}` : `Following @${u.handle}`, {
      action: { label: 'Undo', onClick: () => toggleFollow(u.id) },
    });
  };

  const q = query.trim().toLowerCase();

  // The chip used to be decoration: it moved the highlight and filtered nothing.
  const filteredTrending = useMemo(
    () =>
      trending
        .filter((t) => matchesChip(t.category, activeChip))
        .filter(
          (t) =>
            !q || t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q),
        ),
    [q, activeChip],
  );

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

  const counts = { trends: filteredTrending.length, people: filteredUsers.length };
  const resultSummary = describeResults(query, counts);
  const nothingMatched = isEmptySearch(query, counts);

  return (
    <div className="px-4 pt-1 sm:px-6">
      <TopBar title="Explore" subtitle="What the rest of Pulse is paying attention to right now." />

      <div className="card mb-5 flex items-center gap-3 px-5 py-3 focus-within:border-brand-400/50 focus-within:ring-2 focus-within:ring-brand-500/20">
        <Search aria-hidden="true" className="h-4 w-4 text-ink-dim" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics, people, communities…"
          aria-label="Search Pulse"
          className="w-full bg-transparent py-1 text-sm text-ink placeholder:text-ink-dim focus:outline-none"
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

      {/* Search is instant, so results change with no navigation to announce.
          This is the only signal a screen-reader user gets. */}
      <p aria-live="polite" className="sr-only">
        {resultSummary}
      </p>

      <div className="mb-5 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {EXPLORE_CHIPS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActiveChip(c)}
            aria-pressed={activeChip === c}
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

      {nothingMatched ? (
        <section className="card mb-6 flex flex-col items-center px-6 py-14 text-center">
          <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-bg-subtle text-ink-dim">
            <SearchX aria-hidden="true" className="h-5 w-5" />
          </span>
          <h2 className="text-base font-semibold text-ink">
            No results for &ldquo;{query.trim()}&rdquo;
          </h2>
          <p className="mt-1.5 max-w-sm text-sm text-ink-muted">
            No trends or people match that. Try a shorter phrase, or pick up one of the
            conversations already running.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <button type="button" onClick={() => setQuery('')} className="btn-primary px-4 py-2 text-xs">
              Clear search
            </button>
            {trending.slice(0, 3).map((t) => (
              <button
                key={t.title}
                type="button"
                onClick={() => setQuery(t.title)}
                className="rounded-full border border-line bg-bg-subtle px-3 py-2 text-xs font-medium text-ink-muted transition-colors hover:text-ink"
              >
                {t.title}
              </button>
            ))}
          </div>
        </section>
      ) : (
        <>
      <section className="card mb-6 p-5">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-accent-coral-fg" />
          <h2 className="text-sm font-semibold text-ink">Headline trends</h2>
        </div>
        {filteredTrending.length === 0 ? (
          // With a chip selected and no search, "matches ''" reads like a bug.
          <p className="mt-4 text-sm text-ink-muted">
            {query.trim()
              ? `Nothing trending in ${activeChip} matches “${query.trim()}”.`
              : `Nothing trending in ${activeChip} right now.`}
          </p>
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
          <Globe2 className="h-4 w-4 text-accent-mint-fg" />
          <h2 className="text-sm font-semibold text-ink">People to discover</h2>
        </div>
        {filteredUsers.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted">No people match &ldquo;{query}&rdquo;.</p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((u) => {
              const followed = isFollowing(u.id);
              return (
                <div key={u.id} className="flex min-w-0 items-center gap-3 rounded-xl border border-line/60 bg-bg-subtle/60 p-3">
                  <Link href={`/dashboard/u/${u.handle}`} aria-label={`${u.name}'s profile`} className="shrink-0">
                    <Avatar user={u} size={44} />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/dashboard/u/${u.handle}`}
                      className="inline-flex min-h-[24px] w-full items-center truncate text-sm font-semibold text-ink hover:underline"
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
                      'inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors sm:px-3',
                      followed
                        ? 'border-accent-mint/40 bg-accent-mint/10 text-accent-mint-fg'
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
        </>
      )}

      <section className="card p-5">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-accent-sun-fg" />
          <h2 className="text-sm font-semibold text-ink">Visual feed</h2>
        </div>
        <div className="mt-4 columns-2 gap-3 sm:columns-3 lg:columns-4">
          {feedImages.map((src, i) => {
            const { width, height } = parseImageSize(src);
            return (
              <button
                key={i}
                type="button"
                onClick={() => setLightbox(src)}
                aria-label={`Open image ${i + 1} full size`}
                className="mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-line/60 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60"
              >
                {/* width/height reserve the box before the bytes land, so the
                    masonry stops reflowing as images stream in. */}
                <Image
                  src={src}
                  alt=""
                  width={width}
                  height={height}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="h-auto w-full"
                />
              </button>
            );
          })}
        </div>
        <div ref={sentinelRef} className="flex items-center justify-center pt-6">
          {loading && (
            <span className="inline-flex items-center gap-2 text-xs text-ink-muted">
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> Loading more
            </span>
          )}
        </div>
      </section>

      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
    </div>
  );
}

/** Full-size view of a visual-feed image. Closes on Escape or backdrop click. */
function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  const dialogRef = useDialog<HTMLDivElement>({ onClose });

  return (
    <Portal>
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      data-testid="lightbox"
      tabIndex={-1}
      className="fixed inset-0 z-[75] flex items-center justify-center px-4 py-10 focus:outline-none"
    >
      <button
        type="button"
        aria-label="Close image preview"
        onClick={onClose}
        className="absolute inset-0 bg-bg/85 backdrop-blur-sm"
      />
      <div className="motion-safe:animate-fade-up relative max-h-full w-full max-w-3xl overflow-hidden rounded-2xl border border-line bg-bg-raised shadow-2xl shadow-black/40">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="btn-icon absolute right-3 top-3 z-10 h-9 w-9 bg-bg/60 backdrop-blur"
        >
          <X className="h-4 w-4" />
        </button>
        <Image
          src={src}
          alt=""
          width={parseImageSize(src).width}
          height={parseImageSize(src).height}
          sizes="(min-width: 768px) 768px, 100vw"
          className="max-h-[80vh] w-full object-contain"
        />
      </div>
    </div>
    </Portal>
  );
}
