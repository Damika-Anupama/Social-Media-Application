'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In a real app this would report to an error-tracking service.
    console.error(error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-aurora opacity-70" />
      <div className="noise-overlay absolute inset-0" />
      <div className="relative z-10 mx-auto max-w-xl text-center">
        <span className="badge mx-auto mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-coral animate-pulse" />
          Something went wrong
        </span>
        <h1 className="font-display text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
          A hiccup on <span className="gradient-text">Pulse</span>.
        </h1>
        <p className="mt-5 text-base text-ink-muted">
          This part of the app ran into an unexpected error. You can try again — your data is
          stored locally, so nothing you saved is lost.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-xs text-ink-dim">Reference: {error.digest}</p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="btn-primary">
            <RotateCcw className="h-4 w-4" /> Try again
          </button>
          <Link href="/dashboard" className="btn-ghost">
            <Home className="h-4 w-4" /> Take me home
          </Link>
        </div>
      </div>
    </div>
  );
}
