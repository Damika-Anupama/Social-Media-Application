export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`shimmer-block ${className ?? ''}`} />;
}

/**
 * Header placeholder for a route's loading screen.
 *
 * Rendered by every loading.tsx and nowhere else, so it is where the pending
 * state gets announced: shimmer blocks are invisible to a screen reader, which
 * otherwise sits in silence until the page swaps in.
 */
export function SkeletonTopBar() {
  return (
    <div className="mb-5 space-y-2 pt-4">
      <p role="status" aria-live="polite" className="sr-only">
        Loading…
      </p>
      <div aria-hidden="true" className="shimmer-block h-7 w-24 rounded-lg" />
      <div aria-hidden="true" className="shimmer-block h-3.5 w-56 rounded-lg" />
    </div>
  );
}

export function SkeletonPostCard() {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3">
        <div className="shimmer-block h-11 w-11 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="shimmer-block h-3.5 w-32 rounded-lg" />
          <div className="shimmer-block h-3 w-20 rounded-lg" />
        </div>
      </div>
      <div className="mt-4 space-y-2.5">
        <div className="shimmer-block h-3.5 w-full rounded-lg" />
        <div className="shimmer-block h-3.5 w-4/5 rounded-lg" />
        <div className="shimmer-block h-3.5 w-3/5 rounded-lg" />
      </div>
      <div className="mt-5 flex gap-3">
        <div className="shimmer-block h-7 w-16 rounded-full" />
        <div className="shimmer-block h-7 w-16 rounded-full" />
        <div className="shimmer-block h-7 w-16 rounded-full" />
      </div>
    </div>
  );
}
