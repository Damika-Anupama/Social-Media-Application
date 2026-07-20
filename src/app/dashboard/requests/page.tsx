'use client';

import Link from 'next/link';
import { UserCheck, UserX, Lock, Inbox } from 'lucide-react';
import { TopBar } from '@/components/dashboard/TopBar';
import { Avatar } from '@/components/Avatar';
import { useSettings } from '@/lib/useSettings';
import { useFollowRequests } from '@/lib/useFollowRequests';
import { useToast } from '@/components/Toast';

export default function RequestsPage() {
  const { settings } = useSettings();
  const { ready, pending, approve, decline, restore } = useFollowRequests();
  const { toast } = useToast();

  return (
    <div className="px-4 pt-1 sm:px-6">
      <TopBar title="Follow requests" subtitle="Approve or decline who gets to follow you." />

      {!settings.privateAccount ? (
        <EmptyState
          icon={Lock}
          title="Your account is public"
          body="Anyone can follow you, so there's nothing to approve. Turn on a private account to review each request."
          action={{ href: '/dashboard/settings', label: 'Open privacy settings' }}
        />
      ) : !ready ? null : pending.length === 0 ? (
        <EmptyState icon={Inbox} title="You're all caught up" body="No one is waiting for a decision right now." />
      ) : (
        <ul className="space-y-2">
          {pending.map((u) => (
            <li key={u.id} className="card flex items-center gap-3 p-3 sm:p-4">
              <Link href={`/dashboard/u/${u.handle}`} className="flex min-w-0 flex-1 items-center gap-3">
                <Avatar user={u} size={44} />
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-ink">{u.name}</span>
                  <span className="block truncate text-sm text-ink-dim">@{u.handle} · wants to follow you</span>
                </span>
              </Link>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    approve(u.id);
                    toast(`Approved @${u.handle}`, { action: { label: 'Undo', onClick: () => restore(u.id) } });
                  }}
                  aria-label={`Approve @${u.handle}`}
                  className="btn-primary px-3 py-2 text-sm"
                >
                  <UserCheck aria-hidden="true" className="h-4 w-4" /> Approve
                </button>
                <button
                  type="button"
                  onClick={() => {
                    decline(u.id);
                    toast(`Declined @${u.handle}`, { action: { label: 'Undo', onClick: () => restore(u.id) } });
                  }}
                  aria-label={`Decline @${u.handle}`}
                  className="btn-ghost px-3 py-2 text-sm"
                >
                  <UserX aria-hidden="true" className="h-4 w-4" /> Decline
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-300">
        <Icon className="h-5 w-5" />
      </span>
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <p className="max-w-sm text-sm leading-relaxed text-ink-muted">{body}</p>
      {action && (
        <Link href={action.href} className="btn-primary mt-1 px-4 py-2 text-sm">
          {action.label}
        </Link>
      )}
    </div>
  );
}
