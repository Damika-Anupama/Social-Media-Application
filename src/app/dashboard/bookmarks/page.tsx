'use client';

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Bookmark, Search, FolderPlus } from 'lucide-react';
import { TopBar } from '@/components/dashboard/TopBar';
import { PostCard } from '@/components/dashboard/PostCard';
import { posts } from '@/lib/mock-data';

const collections = [
  { id: 'all', label: 'All', tag: null },
  { id: 'reading', label: 'Reading list', tag: 'longform' },
  { id: 'studio', label: 'Studio inspiration', tag: 'design' },
  { id: 'climate', label: 'Climate', tag: 'climate' },
  { id: 'infra', label: 'Infra & systems', tag: 'postgres' },
];

export default function BookmarksPage() {
  const [active, setActive] = useState('all');
  const [query, setQuery] = useState('');

  const saved = useMemo(() => posts.map((p) => ({ ...p, bookmarked: true })), []);

  const collection = collections.find((c) => c.id === active)!;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return saved.filter((p) => {
      if (collection.tag && !(p.tags ?? []).some((t) => t.includes(collection.tag!))) return false;
      if (q && !p.body.toLowerCase().includes(q) && !p.author.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [saved, collection, query]);

  return (
    <div className="px-4 pt-1 sm:px-6">
      <TopBar title="Bookmarks" subtitle="Posts you saved for later. Only visible to you." />

      <div className="card mb-5 flex items-center gap-3 p-4">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/10 text-brand-300">
          <Bookmark className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <div className="text-sm font-semibold text-ink">{filtered.length} saved {filtered.length === 1 ? 'post' : 'posts'}</div>
          <div className="text-xs text-ink-dim">Bookmarks sync across your devices and are never shown to other accounts.</div>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-full border border-brand-400/40 bg-brand-500/10 px-3 py-2 text-xs font-semibold text-brand-200 hover:bg-brand-500/20">
          <FolderPlus className="h-3.5 w-3.5" /> New collection
        </button>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="-mx-1 flex flex-1 gap-2 overflow-x-auto px-1 pb-1">
          {collections.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActive(c.id)}
              className={clsx(
                'shrink-0 rounded-full px-4 py-1.5 text-xs transition-colors',
                active === c.id
                  ? 'bg-brand-500/15 font-semibold text-brand-200'
                  : 'border border-line bg-bg-subtle font-medium text-ink-muted hover:text-ink',
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-full border border-line/60 bg-bg-subtle px-3 py-1.5">
          <Search className="h-3.5 w-3.5 text-ink-dim" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter saved"
            className="w-40 bg-transparent text-xs text-ink placeholder:text-ink-dim focus:outline-none"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-sm text-ink-muted">
          Nothing saved in <span className="text-ink">{collection.label}</span> yet.
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
