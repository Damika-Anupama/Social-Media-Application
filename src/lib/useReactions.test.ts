import { describe, it, expect } from "vitest";
import { parseIdSet, serializeIdSet } from "@/lib/useReactions";

describe("parseIdSet", () => {
  it("returns an empty array for null / empty input", () => {
    expect(parseIdSet(null)).toEqual([]);
    expect(parseIdSet("")).toEqual([]);
  });

  it("parses a valid JSON array of ids", () => {
    expect(parseIdSet('["p1","p2","p3"]')).toEqual(["p1", "p2", "p3"]);
  });

  it("de-dupes repeated ids", () => {
    expect(parseIdSet('["p1","p1","p2"]')).toEqual(["p1", "p2"]);
  });

  it("ignores non-string entries from a corrupted store", () => {
    expect(parseIdSet('["p1",42,null,{"x":1},"p2"]')).toEqual(["p1", "p2"]);
  });

  it("returns an empty array for malformed JSON", () => {
    expect(parseIdSet("{not json")).toEqual([]);
    expect(parseIdSet("undefined")).toEqual([]);
  });

  it("returns an empty array when the JSON is not an array", () => {
    expect(parseIdSet('{"p1":true}')).toEqual([]);
    expect(parseIdSet('"p1"')).toEqual([]);
  });
});

describe("serializeIdSet", () => {
  it("serializes to a sorted JSON array for stable diffs", () => {
    expect(serializeIdSet(["p3", "p1", "p2"])).toBe('["p1","p2","p3"]');
  });

  it("de-dupes before serializing", () => {
    expect(serializeIdSet(["p1", "p1", "p2"])).toBe('["p1","p2"]');
  });

  it("round-trips with parseIdSet", () => {
    const ids = ["alpha", "bravo", "charlie"];
    expect(parseIdSet(serializeIdSet(ids)).sort()).toEqual([...ids].sort());
  });

  it("serializes an empty set to an empty array", () => {
    expect(serializeIdSet([])).toBe("[]");
  });
});
