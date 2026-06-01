'use client';

import { Search, Bell, MessageCircle, Sparkles } from 'lucide-react';
import { Avatar } from '@/components/Avatar';
import { currentUser } from '@/lib/mock-data';

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="sticky top-0 z-30 -mx-4 mb-5 border-b border-line/60 bg-bg/85 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
          {subtitle && <p className="mt-0.5 text-xs text-ink-dim">{subtitle}</p>}
        </div>

        <div className="hidden flex-1 max-w-md md:block">
          <div className="flex items-center gap-2 rounded-full border border-line/60 bg-bg-subtle px-4 py-2 focus-within:border-brand-400/50">
            <Search className="h-4 w-4 text-ink-dim" />
            <input
              type="search"
              placeholder="Search posts, people, communities…"
              className="w-full bg-transparent text-sm text-ink placeholder:text-ink-dim focus:outline-none"
            />
            <span className="badge text-[10px]">⌘ K</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn-icon md:hidden" aria-label="Search">
            <Search className="h-4 w-4" />
          </button>
          <button className="btn-icon" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </button>
          <button className="btn-icon" aria-label="Messages">
            <MessageCircle className="h-4 w-4" />
          </button>
          <button className="btn-icon hidden sm:inline-flex" aria-label="What's new">
            <Sparkles className="h-4 w-4 text-accent-sun" />
          </button>
          <Avatar user={currentUser} size={36} className="ml-1" />
        </div>
      </div>
    </div>
  );
}
