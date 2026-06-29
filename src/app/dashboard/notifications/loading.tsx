import { SkeletonTopBar } from '@/components/dashboard/Skeleton';

export default function NotificationsLoading() {
  return (
    <div className="px-4 pt-1 sm:px-6">
      <SkeletonTopBar />
      <div className="card overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 border-b border-line/40 px-5 py-4">
            <div className="shimmer-block h-9 w-9 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="shimmer-block h-3.5 w-48 rounded-lg" />
              <div className="shimmer-block h-3 w-24 rounded-lg" />
            </div>
            <div className="shimmer-block h-2 w-2 rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
