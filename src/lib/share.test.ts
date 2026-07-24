import { describe, it, expect } from "vitest";
import { buildShareUrl } from "@/lib/share";

describe("buildShareUrl", () => {
  it("joins an origin with a root-relative path", () => {
    expect(buildShareUrl("/dashboard/p/p1", "https://pulse.app")).toBe(
      "https://pulse.app/dashboard/p/p1",
    );
  });

  it("adds a leading slash when the path lacks one", () => {
    expect(buildShareUrl("dashboard/p/p1", "https://pulse.app")).toBe(
      "https://pulse.app/dashboard/p/p1",
    );
  });

  it("returns an already-absolute URL unchanged", () => {
    expect(buildShareUrl("https://x.com/p/1", "https://pulse.app")).toBe(
      "https://x.com/p/1",
    );
    expect(buildShareUrl("http://x.com/p/1", "https://pulse.app")).toBe(
      "http://x.com/p/1",
    );
  });

  it("works with an empty origin (e.g. SSR with no window)", () => {
    expect(buildShareUrl("/dashboard/p/p1", "")).toBe("/dashboard/p/p1");
  });
});
