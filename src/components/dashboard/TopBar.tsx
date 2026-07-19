'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { Search, Bell, MessageCircle, Sparkles } from 'lucide-react';
import { Avatar } from '@/components/Avatar';
import { DemoButton } from '@/components/DemoButton';
import { currentUser, notifications } from '@/lib/mock-data';
import { useCommandPalette } from '@/components/dashboard/CommandPalette';
import { useReadNotifications, countUnread } from '@/lib/useReadNotifications';

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const router = useRouter();
  const { setOpen } = useCommandPalette();
  const [search, setSearch] = useState('');
  // Same store as the sidebar badge and the notifications page, so all three
  // agree — and the bell clears the moment "mark all read" lands.
  const { readIds } = useReadNotifications();
  const unread = countUnread(notifications, readIds);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    if (!q) return;
    router.push(`/dashboard/explore?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="sticky top-0 z-30 -mx-4 mb-5 border-b border-line/60 bg-bg/85 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
          {subtitle && <p className="mt-0.5 text-xs text-ink-dim">{subtitle}</p>}
        </div>

        <form onSubmit={submitSearch} className="hidden flex-1 max-w-md md:block">
          <div className="flex items-center gap-2 rounded-full border border-line/60 bg-bg-subtle px-4 py-2 focus-within:border-brand-400/50">
            <Search className="h-4 w-4 text-ink-dim" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts, people, communities…"
              className="w-full bg-transparent text-sm text-ink placeholder:text-ink-dim focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open command palette"
              title="Command palette"
              className="badge text-[10px] transition-colors hover:text-ink"
            >
              ⌘ K
            </button>
          </div>
        </form>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/explore" className="btn-icon md:hidden" aria-label="Search">
            <Search className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard/notifications"
            className="btn-icon relative"
            aria-label={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
          >
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span
                aria-hidden="true"
                className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[9px] font-semibold leading-none text-white"
              >
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </Link>
          <Link href="/dashboard/messages" className="btn-icon" aria-label="Messages">
            <MessageCircle className="h-4 w-4" />
          </Link>
          <DemoButton
            notice="The changelog isn't part of this demo."
            className="btn-icon hidden sm:inline-flex"
            aria-label="What's new"
          >
            <Sparkles aria-hidden="true" className="h-4 w-4 text-accent-sun-fg" />
          </DemoButton>
          <Link href="/dashboard/profile" aria-label="Profile" className="ml-1">
            <Avatar user={currentUser} size={36} />
          </Link>
        </div>
      </div>
    </div>
  );
}
