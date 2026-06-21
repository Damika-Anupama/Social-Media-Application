import { TopBar } from '@/components/dashboard/TopBar';
import { StoryRail } from '@/components/dashboard/StoryRail';
import { RightRail } from '@/components/dashboard/RightRail';
import { HomeColumn } from '@/components/dashboard/HomeColumn';

export default function HomePage() {
  return (
    <div className="flex gap-6 px-4 pt-1 sm:px-6">
      <div className="min-w-0 flex-1 space-y-5">
        <TopBar title="Home" subtitle="A quieter feed, ranked by what you actually engage with." />
        <StoryRail />
        <HomeColumn />
      </div>
      <RightRail />
    </div>
  );
}
