'use client';

import clsx from 'clsx';
import { Check, MessageCircle, Sparkles } from 'lucide-react';
import { useCommunities } from '@/lib/useCommunities';
import { useToast } from '@/components/Toast';
import { DemoButton } from '@/components/DemoButton';
import type { Community } from '@/lib/mock-data';

/**
 * The community page's action row.
 *
 * Its "Following" button was hardcoded — it said Following whether you were or
 * not, and clicking it did nothing. Membership is a real, persisted feature
 * everywhere else in the app; this page just never asked.
 */
export function CommunityActions({ community }: { community: Community }) {
  const { isJoined, toggleJoin } = useCommunities();
  const { toast } = useToast();
  const joined = isJoined(community);

  const onToggle = () => {
    toggleJoin(community);
    toast(joined ? `Left ${community.name}` : `Joined ${community.name}`, {
      action: { label: 'Undo', onClick: () => toggleJoin(community) },
    });
  };

  return (
    <>
      <DemoButton
        notice="Posting into a community isn't part of this demo — the composer on the feed is."
        className="btn-ghost px-4 py-2 text-sm"
      >
        <MessageCircle aria-hidden="true" className="h-4 w-4" /> Post in community
      </DemoButton>

      <button
        type="button"
        onClick={onToggle}
        aria-pressed={joined}
        aria-label={joined ? `Leave ${community.name}` : `Join ${community.name}`}
        className={clsx(
          'inline-flex shrink-0 items-center gap-1.5 px-4 py-2 text-sm font-semibold transition-colors',
          joined
            ? 'rounded-full border border-accent-mint/40 bg-accent-mint/10 text-accent-mint-fg'
            : 'btn-primary',
        )}
      >
        {joined ? (
          <>
            <Check aria-hidden="true" className="h-4 w-4" /> Joined
          </>
        ) : (
          <>
            <Sparkles aria-hidden="true" className="h-4 w-4" /> Join
          </>
        )}
      </button>
    </>
  );
}
