import { TopBar } from '@/components/dashboard/TopBar';
import { PostCard } from '@/components/dashboard/PostCard';
import { posts } from '@/lib/mock-data';
import { Bookmark } from 'lucide-react';

export default function BookmarksPage() {
  const saved = posts.filter((p) => p.bookmarked).concat(posts.slice(0, 2));

  return (
    <div className="px-4 pt-1 sm:px-6">
      <TopBar title="Bookmarks" subtitle="Posts you saved for later. Only visible to you." />

      <div className="card mb-5 flex items-center gap-3 p-4">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/10 text-brand-300">
          <Bookmark className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <div className="text-sm font-semibold text-ink">{saved.length} saved posts</div>
          <div className="text-xs text-ink-dim">Bookmarks sync across your devices and are never shown to other accounts.</div>
        </div>
        <button className="btn-ghost px-4 py-2 text-sm">New collection</button>
      </div>

      <div className="space-y-5">
        {saved.map((p, i) => (
          <PostCard key={`${p.id}-${i}`} post={{ ...p, bookmarked: true }} />
        ))}
      </div>
    </div>
  );
}
