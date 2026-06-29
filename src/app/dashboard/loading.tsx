import { SkeletonPostCard, SkeletonTopBar } from '@/components/dashboard/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="flex gap-6 px-4 pt-1 sm:px-6">
      <div className="min-w-0 flex-1 space-y-5">
        <SkeletonTopBar />
        <div className="card overflow-hidden p-4">
          <div className="h-5 w-14 shimmer-block rounded-lg" />
          <div className="mt-3 flex gap-3 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="shimmer-block h-40 w-28 shrink-0 rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="shimmer-block h-36 rounded-2xl" />
        <SkeletonPostCard />
        <SkeletonPostCard />
        <SkeletonPostCard />
      </div>
    </div>
  );
}
