'use client';

import { useEffect } from 'react';

/**
 * Registers the service worker that makes the installed PWA load offline.
 *
 * Production only: a service worker in development fights hot-reload and caches
 * stale bundles. Registration failing is non-fatal — the app still works, it
 * just won't open without a network.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* offline caching is a progressive enhancement — ignore failures */
      });
    };

    if (document.readyState === 'complete') {
      register();
      return;
    }
    window.addEventListener('load', register);
    return () => window.removeEventListener('load', register);
  }, []);

  return null;
}
