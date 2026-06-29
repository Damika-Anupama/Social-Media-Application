'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  Home,
  Compass,
  Bell,
  MessageCircle,
  Bookmark,
  Users2,
  User,
  Settings,
  PenSquare,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { Avatar } from '@/components/Avatar';
import { currentUser, notifications } from '@/lib/mock-data';
import { useComposeOpener } from '@/components/dashboard/ComposeContext';
import { useReadNotifications, countUnread } from '@/lib/useReadNotifications';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home, badge: null as number | null },
  { href: '/dashboard/explore', label: 'Explore', icon: Compass, badge: null as number | null },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell, badge: null as number | null },
  { href: '/dashboard/messages', label: 'Messages', icon: MessageCircle, badge: 5 as number | null },
  { href: '/dashboard/bookmarks', label: 'Bookmarks', icon: Bookmark, badge: null },
  { href: '/dashboard/communities', label: 'Communities', icon: Users2, badge: null },
  { href: '/dashboard/profile', label: 'Profile', icon: User, badge: null },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings, badge: null },
];

export function Sidebar() {
  const pathname = usePathname();
  const openCompose = useComposeOpener();
  const { readIds } = useReadNotifications();
  const unreadNotifications = countUnread(notifications, readIds);

  return (
    <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col border-r border-line/70 bg-bg/80 backdrop-blur-sm lg:flex">
      <div className="flex h-full flex-col gap-5 overflow-y-auto px-4 py-5">
        <Link href="/" className="flex items-center gap-2 px-3 py-1">
          <Logo />
          <span className="text-lg font-semibold tracking-tight">Pulse</span>
        </Link>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            const badge =
              item.href === '/dashboard/notifications'
                ? unreadNotifications || null
                : item.badge;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all',
                  active
                    ? 'bg-bg-raised text-ink border border-line/70'
                    : 'text-ink-muted hover:bg-bg-raised/60 hover:text-ink border border-transparent',
                )}
              >
                <Icon className={clsx('h-[18px] w-[18px]', active ? 'text-brand-300' : '')} />
                <span className="flex-1 font-medium">{item.label}</span>
                {badge && (
                  <span
                    className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1.5 text-[11px] font-semibold text-white"
                    aria-label={`${badge} unread`}
                  >
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={openCompose}
          className="btn-primary mx-auto mt-1 w-full justify-center py-3 text-sm"
        >
          <PenSquare className="h-4 w-4" /> Compose
          <kbd className="ml-auto rounded border border-white/20 bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">N</kbd>
        </button>

        <div className="card mt-2 p-4">
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <Sparkles className="h-4 w-4 text-accent-sun" />
            Pulse Pro
          </div>
          <p className="mt-2 text-sm leading-snug text-ink">
            Long-form essays, scheduled posts, and analytics. Try free for 30 days.
          </p>
          <button className="btn-ghost mt-3 w-full justify-center py-2 text-xs">Start trial</button>
        </div>

        <div className="mt-auto flex items-center gap-3 rounded-xl border border-line/60 bg-bg-raised/70 p-2.5">
          <Avatar user={currentUser} size={36} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-ink">{currentUser.name}</div>
            <div className="truncate text-xs text-ink-dim">@{currentUser.handle}</div>
          </div>
          <Link href="/login" className="btn-icon h-8 w-8" aria-label="Sign out">
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

function Logo() {
  return (
    <span
      className="relative inline-flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 via-brand-500 to-accent-mint shadow-lg shadow-brand-500/30"
      aria-hidden
    >
      <span className="absolute inset-1 rounded-lg bg-bg" />
      <span className="relative h-1.5 w-1.5 rounded-full bg-accent-mint shadow-[0_0_12px_4px_rgba(61,219,179,0.6)]" />
    </span>
  );
}
