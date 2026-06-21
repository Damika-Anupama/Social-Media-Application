'use client';

import { PostComposer } from '@/components/dashboard/PostComposer';
import { HomeFeed } from '@/components/dashboard/HomeFeed';
import { useUserPosts } from '@/lib/useUserPosts';

/**
 * Client wrapper that wires the composer to the feed through the persistent
 * user-post store. Composing a post adds it (optimistically + persisted to
 * localStorage) and it appears at the top of the "For you" feed immediately.
 */
export function HomeColumn() {
  const { posts, addPost, removePost } = useUserPosts();

  return (
    <>
      <PostComposer onSubmitText={(text) => addPost(text)} />
      <HomeFeed userPosts={posts} onRemoveUserPost={removePost} />
    </>
  );
}
