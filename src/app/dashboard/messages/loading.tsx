import { SkeletonTopBar } from '@/components/dashboard/Skeleton';

export default function MessagesLoading() {
  return (
    <div className="px-4 pt-1 sm:px-6">
      <SkeletonTopBar />
      <div className="card grid h-[calc(100vh-200px)] grid-cols-1 overflow-hidden md:grid-cols-[320px_1fr]">
        <div className="border-r border-line/60">
          <div className="shimmer-block m-3 h-9 rounded-full" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 border-b border-line/40 px-4 py-3">
              <div className="shimmer-block h-10 w-10 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="shimmer-block h-3.5 w-28 rounded-lg" />
                <div className="shimmer-block h-3 w-36 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
        <div className="hidden items-center justify-center md:flex">
          <div className="shimmer-block h-12 w-52 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
