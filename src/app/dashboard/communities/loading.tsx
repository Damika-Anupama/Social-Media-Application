import { SkeletonTopBar } from '@/components/dashboard/Skeleton';

export default function CommunitiesLoading() {
  return (
    <div className="px-4 pt-1 sm:px-6">
      <SkeletonTopBar />
      <div className="shimmer-block mb-5 h-10 rounded-full" />
      <div className="mb-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="shimmer-block h-28" />
            <div className="space-y-2 p-4">
              <div className="shimmer-block h-4 w-32 rounded-lg" />
              <div className="shimmer-block h-3 w-full rounded-lg" />
              <div className="shimmer-block h-3 w-3/4 rounded-lg" />
              <div className="shimmer-block mt-3 h-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
      <div className="shimmer-block h-40 rounded-2xl" />
    </div>
  );
}
