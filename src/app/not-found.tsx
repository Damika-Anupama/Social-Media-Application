import Link from 'next/link';
import { ArrowLeft, Compass, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-aurora opacity-70" />
      <div className="noise-overlay absolute inset-0" />
      <div className="relative z-10 mx-auto max-w-xl text-center">
        <span className="badge mx-auto mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-coral animate-pulse" />
          404 · Page not found
        </span>
        <h1 className="font-display text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
          That corner of <span className="gradient-text">Pulse</span> doesn't exist.
        </h1>
        <p className="mt-5 text-base text-ink-muted">
          The link may be broken, the post may have been deleted, or you may have a typo in the URL. Either way, the
          feed is one click away.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard" className="btn-primary">
            <Home className="h-4 w-4" /> Take me home
          </Link>
          <Link href="/dashboard/explore" className="btn-ghost">
            <Compass className="h-4 w-4" /> Open Explore
          </Link>
          <Link href="/" className="btn-ghost">
            <ArrowLeft className="h-4 w-4" /> Back to landing
          </Link>
        </div>
      </div>
    </div>
  );
}
