/* eslint-disable @next/next/no-img-element */
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { Users2, Plus, Search, Check } from 'lucide-react';
import { TopBar } from '@/components/dashboard/TopBar';
import { communities, formatCount } from '@/lib/mock-data';

export default function CommunitiesPage() {
  const [joined, setJoined] = useState<Set<string>>(
    new Set(communities.filter((c) => c.joined).map((c) => c.id)),
  );
  const [query, setQuery] = useState('');

  const toggleJoin = (id: string) =>
    setJoined((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const q = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      communities.filter(
        (c) =>
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.topic.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q),
      ),
    [q],
  );

  const myList = visible.filter((c) => joined.has(c.id));
  const discoverList = visible.filter((c) => !joined.has(c.id));

  return (
    <div className="px-4 pt-1 sm:px-6">
      <TopBar title="Communities" subtitle="Small, opinionated rooms where the conversation goes deeper." />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-line/60 bg-bg-subtle px-4 py-2">
          <Search className="h-4 w-4 text-ink-dim" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search communities by name or topic"
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink-dim focus:outline-none"
          />
        </div>
        <button className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brand-400/40 bg-brand-500/10 px-4 py-2 text-xs font-semibold text-brand-200 hover:bg-brand-500/20">
          <Plus className="h-3.5 w-3.5" /> Create community
        </button>
      </div>

      <section className="mb-7">
        <h2 className="mb-3 text-sm font-semibold text-ink">Your communities ({myList.length})</h2>
        {myList.length === 0 ? (
          <div className="card p-6 text-sm text-ink-muted">You haven&apos;t joined any communities yet. Browse below.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myList.map((c) => (
              <CommunityCard
                key={c.id}
                community={c}
                joined
                onToggle={() => toggleJoin(c.id)}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-ink">Discover more</h2>
        <div className="card divide-y divide-line/40">
          {discoverList.length === 0 ? (
            <p className="p-6 text-sm text-ink-muted">Nothing new matching &quot;{query}&quot;.</p>
          ) : (
            discoverList.map((c) => {
              const isJoined = joined.has(c.id);
              return (
                <div key={c.id} className="flex items-center gap-3 p-4">
                  <Link
                    href={`/dashboard/c/${c.slug}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-300"
                    aria-label={c.name}
                  >
                    <Users2 className="h-4 w-4" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link href={`/dashboard/c/${c.slug}`} className="block text-sm font-semibold text-ink hover:underline">
                      {c.name}
                    </Link>
                    <div className="truncate text-xs text-ink-dim">
                      {formatCount(c.members)} members · {c.topic}
                    </div>
                  </div>
                  <Link href={`/dashboard/c/${c.slug}`} className="btn-ghost px-4 py-2 text-xs">
                    Preview
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleJoin(c.id)}
                    aria-pressed={isJoined}
                    className={clsx(
                      'rounded-full px-4 py-2 text-xs font-semibold transition-colors',
                      isJoined
                        ? 'border border-accent-mint/40 bg-accent-mint/10 text-accent-mint'
                        : 'btn-primary',
                    )}
                  >
                    {isJoined ? 'Joined' : 'Join'}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

function CommunityCard({
  community,
  joined,
  onToggle,
}: {
  community: (typeof communities)[number];
  joined: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="card overflow-hidden">
      <Link href={`/dashboard/c/${community.slug}`} className="block">
        <div className="relative h-28">
          <img src={community.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-raised to-transparent" />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/dashboard/c/${community.slug}`} className="text-base font-semibold text-ink hover:underline">
          {community.name}
        </Link>
        <p className="mt-1 text-xs leading-relaxed text-ink-muted">{community.description}</p>
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-ink-dim">{formatCount(community.members)} members</span>
          <span className="inline-flex items-center gap-1 text-accent-mint">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-mint animate-pulse" />
            {community.online} online
          </span>
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={joined}
          className={clsx(
            'mt-4 w-full rounded-full py-2 text-xs font-semibold transition-colors',
            joined
              ? 'border border-accent-mint/40 bg-accent-mint/10 text-accent-mint'
              : 'btn-primary',
          )}
        >
          {joined ? (
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3 w-3" /> Joined
            </span>
          ) : (
            'Join community'
          )}
        </button>
      </div>
    </div>
  );
}
