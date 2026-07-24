'use client';

import { PostComposer } from '@/components/dashboard/PostComposer';
import { HomeFeed } from '@/components/dashboard/HomeFeed';

/**
 * Client column for the home page. Both the inline composer and the modal
 * composer publish into the shared, persistent user-post store
 * (UserPostsProvider), and the feed reads from it — so a composed post appears
 * at the top of the "For you" feed immediately and survives a reload.
 */
export function HomeColumn() {
  return (
    <>
      <PostComposer />
      <HomeFeed />
    </>
  );
}
