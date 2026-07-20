'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { BadgeCheck } from 'lucide-react';
import { Avatar } from '@/components/Avatar';
import { FollowButton } from '@/components/dashboard/FollowButton';
import { useFollowing } from '@/lib/useFollowing';
import type { User } from '@/lib/mock-data';

/**
 * The follower / following list for a profile.
 *
 * Rows are a derived, deterministic sample of the community (see socialGraph),
 * but the ordering is live: accounts the viewer already follows bubble to the
 * top, so the shared follow store shows through here the way it does on Explore
 * and the right rail. Each row's Follow button is the same persisted control.
 */
export function ConnectionsView({
  owner,
  relation,
  users,
}: {
  owner: User;
  relation: 'followers' | 'following';
  users: User[];
}) {
  const { isFollowing } = useFollowing();
  const ordered = [...users.filter((u) => isFollowing(u.id)), ...users.filter((u) => !isFollowing(u.id))];

  return (
    <div className="mt-2">
      <nav aria-label="Connections" className="flex gap-2">
        <SegLink href={`/dashboard/u/${owner.handle}/followers`} active={relation === 'followers'}>
          Followers
        </SegLink>
        <SegLink href={`/dashboard/u/${owner.handle}/following`} active={relation === 'following'}>
          Following
        </SegLink>
      </nav>

      <ul className="mt-5 space-y-2">
        {ordered.map((u) => (
          <li key={u.id} className="card flex items-center gap-3 p-3 sm:p-4">
            <Link href={`/dashboard/u/${u.handle}`} className="flex min-w-0 flex-1 items-center gap-3">
              <Avatar user={u} size={44} />
              <span className="min-w-0">
                <span className="flex items-center gap-1 font-semibold text-ink">
                  <span className="truncate">{u.name}</span>
                  {u.verified && <BadgeCheck aria-label="Verified account" className="h-4 w-4 shrink-0 text-brand-300" />}
                </span>
                <span className="block truncate text-sm text-ink-dim">@{u.handle}</span>
                {u.bio && <span className="mt-0.5 block truncate text-sm text-ink-muted">{u.bio}</span>}
              </span>
            </Link>
            <FollowButton user={u} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function SegLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'rounded-full px-4 py-1.5 text-xs transition-colors',
        active
          ? 'bg-brand-500/15 font-semibold text-brand-200'
          : 'border border-line bg-bg-subtle font-medium text-ink-muted hover:text-ink',
      )}
    >
      {children}
    </Link>
  );
}
