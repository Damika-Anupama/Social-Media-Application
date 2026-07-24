import { SkeletonPostCard, SkeletonTopBar } from '@/components/dashboard/Skeleton';

export default function BookmarksLoading() {
  return (
    <div className="px-4 pt-1 sm:px-6">
      <SkeletonTopBar />
      <div className="shimmer-block mb-5 h-16 rounded-2xl" />
      <div className="shimmer-block mb-5 h-9 rounded-full" />
      <div className="space-y-5">
        <SkeletonPostCard />
        <SkeletonPostCard />
        <SkeletonPostCard />
      </div>
    </div>
  );
}
