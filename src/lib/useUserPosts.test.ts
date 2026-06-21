import { describe, it, expect } from "vitest";
import { buildUserPost } from "@/lib/useUserPosts";
import { currentUser } from "@/lib/mock-data";

describe("buildUserPost", () => {
  it("builds a well-formed post attributed to the current user", () => {
    const post = buildUserPost("  Hello Pulse  ");
    expect(post.body).toBe("Hello Pulse"); // trimmed
    expect(post.author).toBe(currentUser);
    expect(post.postedAt).toBe("Just now");
    expect(post.category).toBe("foryou");
    expect(post.metrics).toEqual({ likes: 0, comments: 0, shares: 0, bookmarks: 0 });
    expect(post.id).toMatch(/^local_/);
  });

  it("generates unique ids", () => {
    const a = buildUserPost("a");
    const b = buildUserPost("b");
    expect(a.id).not.toBe(b.id);
  });
});
