'use client';

import { useEffect, useState } from 'react';

export type ConnectionState = 'online' | 'offline' | 'reconnected';

/**
 * Connection state, for telling the viewer the truth about it.
 *
 * Pulse stores everything the viewer does in localStorage, so it keeps working
 * with no network at all — which is precisely why the silence was a problem:
 * a page that behaves identically online and offline gives you no way to know
 * which one you are in, and no reason to trust that your post survived.
 */
export function useOnlineStatus() {
  /**
   * Starts optimistic and is corrected after mount. `navigator` does not exist
   * during SSR, and rendering an offline banner into static HTML that then
   * hydrates online would be its own lie.
   */
  const [online, setOnline] = useState(true);
  /** True briefly after coming back, so we can confirm rather than just vanish. */
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    setOnline(navigator.onLine);

    let timer: number | null = null;

    const goOffline = () => {
      setOnline(false);
      setJustReconnected(false);
      if (timer !== null) window.clearTimeout(timer);
    };

    const goOnline = () => {
      setOnline(true);
      setJustReconnected(true);
      if (timer !== null) window.clearTimeout(timer);
      timer = window.setTimeout(() => setJustReconnected(false), 4000);
    };

    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
      if (timer !== null) window.clearTimeout(timer);
    };
  }, []);

  const state: ConnectionState = !online ? 'offline' : justReconnected ? 'reconnected' : 'online';
  return { online, state };
}
