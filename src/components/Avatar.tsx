/* eslint-disable @next/next/no-img-element -- Avatars are remote SVGs (dicebear).
   next/image refuses SVG unless dangerouslyAllowSVG is set, which would let any
   remote SVG ship script through the optimizer — not worth it for an asset that
   raster optimization cannot shrink anyway. Width/height are set below, so this
   causes no layout shift. */
import clsx from 'clsx';
import type { User } from '@/lib/mock-data';

export function Avatar({
  user,
  size = 40,
  ring,
  online,
  className,
}: {
  user: User;
  size?: number;
  ring?: 'brand' | 'story' | 'live';
  online?: boolean;
  className?: string;
}) {
  const ringClasses = {
    brand: 'ring-2 ring-brand-400/50 ring-offset-2 ring-offset-bg',
    story: 'ring-2 ring-accent-mint/70 ring-offset-2 ring-offset-bg',
    live: 'ring-2 ring-accent-coral ring-offset-2 ring-offset-bg',
  };

  return (
    <span className={clsx('relative inline-flex shrink-0', className)}>
      <img
        src={user.avatar}
        alt={user.name}
        width={size}
        height={size}
        className={clsx(
          'rounded-full bg-bg-elevated object-cover',
          ring && ringClasses[ring],
        )}
        style={{ width: size, height: size }}
      />
      {online && (
        // aria-label is prohibited on a bare span — it has no role to name, so
        // assistive tech is free to ignore it (and axe flags it). Say it in text.
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-accent-mint ring-2 ring-bg">
          <span className="sr-only">Online</span>
        </span>
      )}
    </span>
  );
}
