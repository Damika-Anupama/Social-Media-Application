import { SkeletonTopBar } from '@/components/dashboard/Skeleton';

export default function ExploreLoading() {
  return (
    <div className="px-4 pt-1 sm:px-6">
      <SkeletonTopBar />
      <div className="shimmer-block mb-5 h-10 rounded-2xl" />
      <div className="mb-5 flex gap-2 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="shimmer-block h-8 w-20 shrink-0 rounded-full" />
        ))}
      </div>
      <div className="shimmer-block mb-6 h-52 rounded-2xl" />
      <div className="shimmer-block mb-6 h-48 rounded-2xl" />
    </div>
  );
}
