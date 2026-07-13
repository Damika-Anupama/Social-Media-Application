'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { Heart, MessageCircle, UserPlus, AtSign, Award, Sparkles, CheckCheck } from 'lucide-react';
import { TopBar } from '@/components/dashboard/TopBar';
import { useTabs } from '@/components/Tabs';
import { Avatar } from '@/components/Avatar';
import { notifications as seed, type Notification } from '@/lib/mock-data';
import { useReadNotifications } from '@/lib/useReadNotifications';
import { useToast } from '@/components/Toast';

const iconMap = {
  like: { icon: Heart, tint: 'text-accent-coral-fg bg-accent-coral/10' },
  comment: { icon: MessageCircle, tint: 'text-brand-300 bg-brand-500/10' },
  follow: { icon: UserPlus, tint: 'text-accent-mint-fg bg-accent-mint/10' },
  mention: { icon: AtSign, tint: 'text-accent-sky-fg bg-accent-sky/10' },
  milestone: { icon: Award, tint: 'text-accent-sun-fg bg-accent-sun/10' },
} as const;

const filters: { id: string; label: string; types?: Notification['type'][] }[] = [
  { id: 'all', label: 'All' },
  { id: 'mentions', label: 'Mentions', types: ['mention'] },
  { id: 'likes', label: 'Likes', types: ['like'] },
  { id: 'replies', label: 'Replies', types: ['comment'] },
  { id: 'follows', label: 'Follows', types: ['follow'] },
];

export default function NotificationsPage() {
  const [active, setActive] = useState('all');
  const { tabListProps, getTabProps } = useTabs({
    items: filters,
    selected: filters.findIndex((f) => f.id === active),
    onSelect: (i) => setActive(filters[i].id),
  });
  const { readIds, markRead, markUnread, markManyRead, markManyUnread } = useReadNotifications();
  const { toast } = useToast();

  const filter = filters.find((f) => f.id === active)!;

  // Read state comes from the persistent store, so it survives navigation and
  // reloads and stays in sync with the sidebar unread badge.
  const decorated = useMemo(
    () => seed.map((n) => ({ ...n, unread: !!n.unread && !readIds.has(n.id) })),
    [readIds],
  );
  const view = useMemo(() => {
    if (!filter.types) return decorated;
    return decorated.filter((n) => filter.types!.includes(n.type));
  }, [decorated, filter]);

  const unreadCount = decorated.filter((n) => n.unread).length;

  const markAllRead = () => {
    // Snapshot exactly what *this* action read, so undo restores that set and
    // not anything the viewer had already read before.
    const affected = decorated.filter((n) => n.unread).map((n) => n.id);
    if (!affected.length) return;
    markManyRead(affected);
    toast('All caught up', {
      action: { label: 'Undo', onClick: () => markManyUnread(affected) },
    });
  };

  return (
    <div className="px-4 pt-1 sm:px-6">
      <TopBar title="Notifications" subtitle="Only what matters. Everything else stays in the activity log." />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <div {...tabListProps} aria-label="Filter notifications" className="flex flex-wrap items-center gap-2">
          {filters.map((f, i) => (
            <button
              key={f.id}
              {...getTabProps(i)}
              className={clsx(
                'rounded-full px-4 py-1.5 text-xs transition-colors',
                active === f.id
                  ? 'bg-brand-500/15 font-semibold text-brand-200'
                  : 'border border-line bg-bg-subtle font-medium text-ink-muted hover:text-ink',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-line bg-bg-subtle px-3 py-1.5 text-xs font-medium text-ink-muted hover:text-ink disabled:opacity-50"
        >
          <CheckCheck className="h-3.5 w-3.5" />
          Mark all read {unreadCount > 0 && `(${unreadCount})`}
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-line/60 bg-bg-elevated/40 px-5 py-3 text-xs text-ink-dim">
          <Sparkles className="h-3.5 w-3.5 text-accent-sun-fg" />
          <span>Pulse groups quiet activity for you — open it once a day, not seventeen times.</span>
        </div>
        {view.length === 0 ? (
          <p className="p-10 text-center text-sm text-ink-muted">No {filter.label.toLowerCase()} to show right now.</p>
        ) : (
          <ul className="divide-y divide-line/40">
            {view.map((n) => {
              const meta = iconMap[n.type];
              const Icon = meta.icon;
              return (
                <li
                  key={n.id}
                  data-testid="notification"
                  className={clsx(
                    'relative flex items-start gap-3 px-5 py-4 transition-colors hover:bg-bg-elevated/30',
                    n.unread && 'bg-brand-500/5',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={clsx(
                      'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                      meta.tint,
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      {n.user && (
                        <>
                          <Avatar user={n.user} size={20} />
                          <span className="text-sm font-semibold text-ink">{n.user.name}</span>
                        </>
                      )}
                      {/* The link stretches over the whole row, so the row stays
                          one click target without nesting the toggle inside it. */}
                      {n.postId ? (
                        <Link
                          href={`/dashboard/p/${n.postId}`}
                          className="text-sm text-ink-muted after:absolute after:inset-0 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60"
                        >
                          {n.text}
                        </Link>
                      ) : (
                        <span className="text-sm text-ink-muted">{n.text}</span>
                      )}
                    </div>
                    <div className="mt-0.5 text-xs text-ink-dim">{n.time}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => (n.unread ? markRead(n.id) : markUnread(n.id))}
                    // z-10 keeps the toggle above the stretched link's ::after.
                    className="relative z-10 -mr-2 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-bg-elevated/60"
                    aria-label={
                      n.unread
                        ? `Mark "${n.text}" as read`
                        : `Mark "${n.text}" as unread`
                    }
                    aria-pressed={!n.unread}
                  >
                    <span
                      className={clsx(
                        'h-2 w-2 rounded-full transition-colors',
                        n.unread ? 'bg-brand-400' : 'bg-line',
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
