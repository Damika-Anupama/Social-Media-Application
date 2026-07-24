'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Home, Compass, PenSquare, Bell, User } from 'lucide-react';
import { useComposeOpener } from '@/components/dashboard/ComposeContext';
import { notifications } from '@/lib/mock-data';
import { useReadNotifications, countUnread } from '@/lib/useReadNotifications';

const items = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/dashboard/explore', label: 'Explore', icon: Compass },
  // "Post" collided with the composer's own submit button: two controls, same
  // name, different meanings, on the same screen. A screen-reader user hears
  // "Post, button" twice and has no way to tell which one sends their post.
  { href: '__compose', label: 'New post', icon: PenSquare, primary: true },
  { href: '/dashboard/notifications', label: 'Inbox', icon: Bell },
  { href: '/dashboard/profile', label: 'Me', icon: User },
];

export function MobileTabBar() {
  const pathname = usePathname();
  const openCompose = useComposeOpener();
  // The sidebar carries the unread badge on desktop, but the sidebar is
  // lg-only — on a phone this bar is the navigation, and it said nothing.
  const { readIds } = useReadNotifications();
  const unread = countUnread(notifications, readIds);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line/70 bg-bg/95 backdrop-blur-md lg:hidden">
      <ul className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {items.map((item) => {
          const Icon = item.icon;

          if (item.primary) {
            return (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={openCompose}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-accent-mint text-white shadow-lg shadow-brand-500/30"
                  aria-label={item.label}
                >
                  <Icon className="h-5 w-5" />
                </button>
              </li>
            );
          }

          const active =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);

          const showBadge = item.href === '/dashboard/notifications' && unread > 0;

          return (
            <li key={item.label}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                aria-label={showBadge ? `${item.label}, ${unread} unread` : undefined}
                className={clsx(
                  'flex flex-col items-center gap-1 px-3 py-1.5 text-[10px] font-medium',
                  active ? 'text-ink' : 'text-ink-dim',
                )}
              >
                <span className="relative">
                  <Icon className={clsx('h-5 w-5', active && 'text-brand-300')} />
                  {showBadge && (
                    <span
                      aria-hidden="true"
                      className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[9px] font-semibold leading-none text-white"
                    >
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
