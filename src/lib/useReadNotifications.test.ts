import { describe, it, expect } from "vitest";
import {
  parseReadIds,
  serializeReadIds,
  countUnread,
} from "@/lib/useReadNotifications";

describe("parseReadIds", () => {
  it("returns an empty array for null / empty / malformed input", () => {
    expect(parseReadIds(null)).toEqual([]);
    expect(parseReadIds("")).toEqual([]);
    expect(parseReadIds("{nope")).toEqual([]);
    expect(parseReadIds('{"n1":true}')).toEqual([]);
  });

  it("parses and de-dupes a valid id array, dropping non-strings", () => {
    expect(parseReadIds('["n1","n1",2,null,"n2"]')).toEqual(["n1", "n2"]);
  });
});

describe("serializeReadIds", () => {
  it("serializes to a sorted, de-duped JSON array", () => {
    expect(serializeReadIds(["n3", "n1", "n1"])).toBe('["n1","n3"]');
  });

  it("round-trips with parseReadIds", () => {
    const ids = ["a", "b", "c"];
    expect(parseReadIds(serializeReadIds(ids)).sort()).toEqual([...ids].sort());
  });
});

describe("countUnread", () => {
  const items = [
    { id: "n1", unread: true },
    { id: "n2", unread: true },
    { id: "n3", unread: false },
    { id: "n4" }, // no flag → treated as read
  ];

  it("counts only seeded-unread items not yet marked read", () => {
    expect(countUnread(items, new Set())).toBe(2);
    expect(countUnread(items, new Set(["n1"]))).toBe(1);
    expect(countUnread(items, new Set(["n1", "n2"]))).toBe(0);
  });

  it("ignores read-ids for items that were never unread", () => {
    expect(countUnread(items, new Set(["n3", "n4"]))).toBe(2);
  });
});
