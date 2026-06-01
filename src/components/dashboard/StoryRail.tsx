/* eslint-disable @next/next/no-img-element */
'use client';

import clsx from 'clsx';
import { Plus, Radio } from 'lucide-react';
import { stories, currentUser } from '@/lib/mock-data';

export function StoryRail() {
  return (
    <div className="card relative overflow-hidden p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">Stories</h2>
        <button className="text-xs text-ink-muted hover:text-ink">See all</button>
      </div>
      <div className="-mx-1 mt-3 flex gap-3 overflow-x-auto px-1 pb-1">
        <button
          type="button"
          className="group relative flex h-40 w-28 shrink-0 flex-col items-center justify-end overflow-hidden rounded-2xl border border-dashed border-line bg-bg-subtle/60 p-3 text-left transition-all hover:border-brand-400/50 hover:bg-bg-subtle"
        >
          <img
            src={currentUser.avatar}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-40 transition-opacity group-hover:opacity-60"
          />
          <span className="absolute inset-x-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/30">
            <Plus className="h-3.5 w-3.5" />
          </span>
          <span className="relative text-xs font-medium text-ink">Your story</span>
        </button>

        {stories.slice(1).map((s) => (
          <button
            key={s.id}
            type="button"
            className={clsx(
              'group relative flex h-40 w-28 shrink-0 flex-col justify-end overflow-hidden rounded-2xl border p-3 text-left transition-transform hover:-translate-y-0.5',
              s.viewed ? 'border-line/60 opacity-70' : 'border-transparent',
            )}
          >
            <img src={s.thumbnail} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/95 via-bg/30 to-bg/10" />
            {s.isLive && (
              <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-accent-coral px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                <Radio className="h-3 w-3" /> Live
              </span>
            )}
            <span
              className={clsx(
                'absolute left-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full p-0.5',
                !s.isLive && (s.viewed ? 'bg-line' : 'bg-gradient-to-br from-brand-400 via-accent-coral to-accent-sun'),
              )}
              style={{ display: s.isLive ? 'none' : undefined }}
            >
              <img src={s.user.avatar} alt={s.user.name} className="h-full w-full rounded-full bg-bg" />
            </span>
            <span className="relative text-xs font-medium text-ink line-clamp-1">{s.user.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
