import { describe, it, expect } from "vitest";
import {
  parseSeenIds,
  serializeSeenIds,
  isStoryWatched,
  partitionStories,
} from "@/lib/useSeenStories";
import type { Story } from "@/lib/mock-data";

const user = { id: "u", handle: "u", name: "U", avatar: "" } as Story["user"];
const story = (over: Partial<Story>): Story => ({
  id: "s",
  user,
  thumbnail: "",
  ...over,
});

describe("parseSeenIds", () => {
  it("returns an empty array for null / empty / malformed input", () => {
    expect(parseSeenIds(null)).toEqual([]);
    expect(parseSeenIds("")).toEqual([]);
    expect(parseSeenIds("{nope")).toEqual([]);
    expect(parseSeenIds('{"s1":true}')).toEqual([]);
  });

  it("parses and de-dupes a valid id array, dropping non-strings", () => {
    expect(parseSeenIds('["s1","s1",2,null,"s2"]')).toEqual(["s1", "s2"]);
  });
});

describe("serializeSeenIds", () => {
  it("serializes to a sorted, de-duped JSON array", () => {
    expect(serializeSeenIds(["s3", "s1", "s1"])).toBe('["s1","s3"]');
  });

  it("round-trips with parseSeenIds", () => {
    const ids = ["a", "b", "c"];
    expect(parseSeenIds(serializeSeenIds(ids)).sort()).toEqual([...ids].sort());
  });
});

describe("isStoryWatched", () => {
  it("is true when seeded viewed, regardless of the seen set", () => {
    expect(isStoryWatched(story({ id: "s4", viewed: true }), new Set())).toBe(true);
  });

  it("is true when the viewer has since watched it", () => {
    expect(isStoryWatched(story({ id: "s2" }), new Set(["s2"]))).toBe(true);
  });

  it("is false for an unseen, never-viewed story", () => {
    expect(isStoryWatched(story({ id: "s2" }), new Set(["s9"]))).toBe(false);
  });
});

describe("partitionStories", () => {
  const stories = [
    story({ id: "s1", isLive: true }),
    story({ id: "s2" }),
    story({ id: "s4", viewed: true }),
  ];

  it("groups by live / fresh / watched from seed state", () => {
    const { live, fresh, watched } = partitionStories(stories, new Set());
    expect(live.map((s) => s.id)).toEqual(["s1"]);
    expect(fresh.map((s) => s.id)).toEqual(["s2"]);
    expect(watched.map((s) => s.id)).toEqual(["s4"]);
  });

  it("moves a just-watched story out of fresh and into watched", () => {
    const { fresh, watched } = partitionStories(stories, new Set(["s2"]));
    expect(fresh.map((s) => s.id)).toEqual([]);
    expect(watched.map((s) => s.id)).toEqual(["s2", "s4"]);
  });

  it("keeps a live story out of watched even once seen (mutually exclusive)", () => {
    const { live, watched } = partitionStories(stories, new Set(["s1"]));
    expect(live.map((s) => s.id)).toEqual(["s1"]);
    expect(watched.map((s) => s.id)).toEqual(["s4"]);
  });
});
