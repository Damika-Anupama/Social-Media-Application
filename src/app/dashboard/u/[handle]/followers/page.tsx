import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { TopBar } from '@/components/dashboard/TopBar';
import { ConnectionsView } from '@/components/dashboard/ConnectionsView';
import { allHandles, findUser, formatCount } from '@/lib/mock-data';
import { deriveConnections } from '@/lib/socialGraph';

type Params = { params: Promise<{ handle: string }> };

export function generateStaticParams() {
  return allHandles().map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { handle } = await params;
  const user = findUser(handle);
  if (!user) return { title: `@${handle} not found` };
  return { title: `People following ${user.name}`, description: `Accounts that follow @${user.handle} on Pulse.` };
}

export default async function FollowersPage({ params }: Params) {
  const { handle } = await params;
  const user = findUser(handle);
  if (!user) notFound();

  return (
    <div className="px-4 pt-1 sm:px-6">
      <TopBar title={user.name} subtitle={`${formatCount(user.followers ?? 0)} followers`} />
      <Link
        href={`/dashboard/u/${user.handle}`}
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Back to @{user.handle}
      </Link>
      <ConnectionsView owner={user} relation="followers" users={deriveConnections(user.handle).followers} />
    </div>
  );
}
