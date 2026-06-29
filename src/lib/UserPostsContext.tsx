'use client';

import { createContext, useContext } from 'react';
import { useUserPosts } from './useUserPosts';
import type { Post } from './mock-data';

type UserPostsContextValue = {
  posts: Post[];
  addPost: (body: string) => Post;
  removePost: (id: string) => void;
  clearPosts: () => void;
};

const Ctx = createContext<UserPostsContextValue | null>(null);

export function UserPostsProvider({ children }: { children: React.ReactNode }) {
  const store = useUserPosts();
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useUserPostsContext() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useUserPostsContext must be used within UserPostsProvider');
  return ctx;
}
