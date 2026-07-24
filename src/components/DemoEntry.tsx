'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { signIn } from '@/lib/session';

/**
 * The fast path into the demo.
 *
 * This is a frontend demo with no real credential check — asking a visitor to
 * invent an email and a password that passes the strength rules just to look
 * around is friction for nothing. This button signs them in and drops them
 * straight on the dashboard, while the form below stays for anyone who wants to
 * walk the real sign-in / sign-up flow.
 */
export function DemoEntry({ label, dividerLabel }: { label: string; dividerLabel: string }) {
  const router = useRouter();
  const [entering, setEntering] = useState(false);

  const enter = () => {
    if (entering) return;
    setEntering(true);
    signIn();
    router.push('/dashboard');
  };

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={enter}
        disabled={entering}
        className="group flex w-full items-center justify-center gap-2 rounded-xl border border-brand-400/40 bg-brand-500/10 py-3 text-base font-semibold text-ink transition-all hover:border-brand-400/60 hover:bg-brand-500/15 disabled:opacity-60"
      >
        {entering ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Entering the demo
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 text-brand-300" />
            {label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>

      <div className="relative flex items-center gap-3 text-xs text-ink-dim">
        <span className="h-px flex-1 bg-line" />
        {dividerLabel}
        <span className="h-px flex-1 bg-line" />
      </div>
    </div>
  );
}
