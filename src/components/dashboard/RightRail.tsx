'use client';

import Link from 'next/link';
import { Sparkles, TrendingUp, Calendar, Plus } from 'lucide-react';
import { trending, suggestions, formatCount } from '@/lib/mock-data';
import { Avatar } from '@/components/Avatar';

const events = [
  { title: 'Lina x Coastline studio tour', date: 'Sat, Jun 8 · 6:00 PM', city: 'Lagos' },
  { title: 'Designing for slow time — live room', date: 'Tonight · 9:30 PM', city: 'Online' },
  { title: 'Open Climate Lab AMA', date: 'Wed, Jun 12 · 12:00 PM', city: 'Online' },
];

export function RightRail() {
  return (
    <aside className="hidden w-[320px] shrink-0 flex-col gap-4 xl:flex">
      <div className="sticky top-4 flex flex-col gap-4">
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line/60 px-5 py-3.5">
            <TrendingUp className="h-4 w-4 text-brand-300" />
            <h2 className="text-sm font-semibold text-ink">Trending</h2>
            <span className="badge ml-auto text-[10px]">Curated</span>
          </div>
          <ul className="divide-y divide-line/40">
            {trending.map((t) => (
              <li key={t.title} className="cursor-pointer px-5 py-3 transition-colors hover:bg-bg-elevated/40">
                <div className="text-[11px] uppercase tracking-wider text-ink-dim">{t.category}</div>
                <div className="mt-0.5 text-sm font-semibold text-ink">{t.title}</div>
                <div className="mt-0.5 text-xs text-ink-dim">{t.posts}</div>
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard/explore"
            className="block border-t border-line/60 px-5 py-3 text-xs font-medium text-brand-300 hover:text-brand-200"
          >
            Show more →
          </Link>
        </div>

        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line/60 px-5 py-3.5">
            <Sparkles className="h-4 w-4 text-accent-sun" />
            <h2 className="text-sm font-semibold text-ink">People worth following</h2>
          </div>
          <ul className="divide-y divide-line/40">
            {suggestions.map((u) => (
              <li key={u.id} className="flex items-center gap-3 px-5 py-3">
                <Link href={`/dashboard/u/${u.handle}`} aria-label={`${u.name}'s profile`}>
                  <Avatar user={u} size={40} />
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
                <button className="inline-flex items-center gap-1 rounded-full border border-brand-400/40 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-200 transition-colors hover:bg-brand-500/20">
                  <Plus className="h-3 w-3" /> Follow
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line/60 px-5 py-3.5">
            <Calendar className="h-4 w-4 text-accent-mint" />
            <h2 className="text-sm font-semibold text-ink">Happening soon</h2>
          </div>
          <ul className="divide-y divide-line/40">
            {events.map((ev) => (
              <li key={ev.title} className="px-5 py-3">
                <div className="text-sm font-semibold text-ink">{ev.title}</div>
                <div className="mt-0.5 text-xs text-ink-dim">{ev.date}</div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-brand-300">{ev.city}</div>
              </li>
            ))}
          </ul>
        </div>

        <p className="px-2 text-[11px] leading-relaxed text-ink-dim">
          Pulse is a frontend demonstration. All data, photography, and accounts shown here are fictional.
        </p>
      </div>
    </aside>
  );
}
