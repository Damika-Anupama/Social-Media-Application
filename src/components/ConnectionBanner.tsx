'use client';

import clsx from 'clsx';
import { CloudOff, Check } from 'lucide-react';
import { useOnlineStatus } from '@/lib/useOnlineStatus';

/**
 * Tells the viewer when they are offline — and, just as importantly, that it
 * does not matter much.
 *
 * The copy is deliberately not "we'll sync when you're back": Pulse has no
 * server to sync to. Everything lives on this device, which is the true and
 * more reassuring thing to say.
 */
export function ConnectionBanner() {
  const { state } = useOnlineStatus();

  if (state === 'online') return null;

  const offline = state === 'offline';

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="connection-banner"
      className={clsx(
        'motion-safe:animate-fade-up fixed inset-x-0 bottom-20 z-[65] mx-auto flex w-fit max-w-[calc(100vw-2rem)] items-center gap-2.5 rounded-full border px-4 py-2 text-xs shadow-lg backdrop-blur lg:bottom-6',
        offline
          ? 'border-accent-sun/40 bg-accent-sun/10 text-accent-sun-fg'
          : 'border-accent-mint/40 bg-accent-mint/10 text-accent-mint-fg',
      )}
    >
      {offline ? (
        <>
          <CloudOff aria-hidden="true" className="h-4 w-4 shrink-0" />
          <span>
            <span className="font-semibold">You&apos;re offline.</span> Pulse still works —
            everything you do is saved on this device.
          </span>
        </>
      ) : (
        <>
          <Check aria-hidden="true" className="h-4 w-4 shrink-0" />
          <span className="font-semibold">Back online.</span>
        </>
      )}
    </div>
  );
}
