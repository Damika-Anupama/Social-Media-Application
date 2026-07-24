'use client';

import clsx from 'clsx';
import { Check, UserPlus } from 'lucide-react';
import { useFollowing } from '@/lib/useFollowing';
import { useToast } from '@/components/Toast';
import type { User } from '@/lib/mock-data';

/**
 * A Follow button that follows.
 *
 * The post-detail page had a Follow button with no onClick at all — styled,
 * focusable, and wired to nothing. Following is already a real, persisted,
 * cross-surface feature; that button just never joined in.
 */
export function FollowButton({
  user,
  className,
}: {
  user: Pick<User, 'id' | 'handle'>;
  className?: string;
}) {
  const { isFollowing, toggleFollow } = useFollowing();
  const { toast } = useToast();
  const following = isFollowing(user.id);

  const onToggle = () => {
    toggleFollow(user.id);
    toast(following ? `Unfollowed @${user.handle}` : `Following @${user.handle}`, {
      action: { label: 'Undo', onClick: () => toggleFollow(user.id) },
    });
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={following}
      aria-label={following ? `Unfollow @${user.handle}` : `Follow @${user.handle}`}
      className={clsx(
        'inline-flex shrink-0 items-center gap-1.5 px-4 py-2 text-sm font-semibold transition-colors',
        following
          ? 'rounded-full border border-accent-mint/40 bg-accent-mint/10 text-accent-mint-fg'
          : 'btn-primary',
        className,
      )}
    >
      {following ? (
        <>
          <Check aria-hidden="true" className="h-4 w-4" /> Following
        </>
      ) : (
        <>
          <UserPlus aria-hidden="true" className="h-4 w-4" /> Follow
        </>
      )}
    </button>
  );
}
