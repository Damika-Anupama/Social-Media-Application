'use client';

import { useEffect, useRef } from 'react';
import { onStorageFailure } from '@/lib/storage';
import { useToast } from '@/components/Toast';

/**
 * Surfaces a failed save.
 *
 * Storage failing is not a rare exotic: private-browsing modes and locked-down
 * profiles disable localStorage outright, and quota is finite. The old
 * behaviour was to shrug — the UI showed the post, the post was gone on reload,
 * and nothing in between admitted it. One honest sentence beats that.
 */
export function StorageNotice() {
  const { toast } = useToast();
  /** Warn once per session; a failing store fails on every keystroke. */
  const warned = useRef(false);

  useEffect(
    () =>
      onStorageFailure((failure) => {
        if (warned.current) return;
        warned.current = true;
        // Sticky, not a 3.2s flash: losing your data is exactly the kind of
        // warning that must not vanish before it is read. It carries its own
        // dismiss button, and warning once per session means it never stacks.
        toast(
          failure.quotaExceeded
            ? "Storage is full — this won't be saved after you leave."
            : "Can't save to this browser — changes will be lost when you leave.",
          { tone: 'info', duration: 0 },
        );
      }),
    [toast],
  );

  return null;
}
