'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { readSession, SESSION_EVENT } from '@/lib/session';

/**
 * Client-side gate for the dashboard.
 *
 * The whole dashboard is prerendered and there is no server session, so the
 * check has to run after mount. Until it resolves we render a neutral screen —
 * identical on the server and the first client render, so there is no hydration
 * mismatch and, crucially, no flash of dashboard content to someone who is not
 * signed in. If they are not, we replace (not push) to /login so Back doesn't
 * bounce them right back into the gate.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<'checking' | 'authed'>('checking');

  useEffect(() => {
    const check = () => {
      if (readSession()) {
        setStatus('authed');
      } else {
        setStatus('checking');
        router.replace('/login');
      }
    };
    check();
    // React to sign-out from the sidebar (same tab) and other tabs.
    window.addEventListener(SESSION_EVENT, check);
    window.addEventListener('storage', check);
    return () => {
      window.removeEventListener(SESSION_EVENT, check);
      window.removeEventListener('storage', check);
    };
  }, [router]);

  if (status !== 'authed') {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        role="status"
        aria-label="Checking your session"
      >
        <Loader2 className="h-6 w-6 animate-spin text-ink-dim" />
      </div>
    );
  }

  return <>{children}</>;
}
