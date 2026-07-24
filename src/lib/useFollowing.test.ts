import { describe, it, expect } from "vitest";
import { parseFollowing, serializeFollowing } from "@/lib/useFollowing";

describe("parseFollowing", () => {
  it("returns an empty array for null / empty input", () => {
    expect(parseFollowing(null)).toEqual([]);
    expect(parseFollowing("")).toEqual([]);
  });

  it("parses a valid JSON array of ids", () => {
    expect(parseFollowing('["u1","u2","u3"]')).toEqual(["u1", "u2", "u3"]);
  });

  it("de-dupes repeated ids", () => {
    expect(parseFollowing('["u1","u1","u2"]')).toEqual(["u1", "u2"]);
  });

  it("ignores non-string entries from a corrupted store", () => {
    expect(parseFollowing('["u1",42,null,{"x":1},"u2"]')).toEqual(["u1", "u2"]);
  });

  it("returns an empty array for malformed JSON", () => {
    expect(parseFollowing("{not json")).toEqual([]);
    expect(parseFollowing("undefined")).toEqual([]);
  });

  it("returns an empty array when the JSON is not an array", () => {
    expect(parseFollowing('{"u1":true}')).toEqual([]);
    expect(parseFollowing('"u1"')).toEqual([]);
  });
});

describe("serializeFollowing", () => {
  it("serializes to a sorted JSON array for stable diffs", () => {
    expect(serializeFollowing(["u3", "u1", "u2"])).toBe('["u1","u2","u3"]');
  });

  it("de-dupes before serializing", () => {
    expect(serializeFollowing(["u1", "u1", "u2"])).toBe('["u1","u2"]');
  });

  it("round-trips with parseFollowing", () => {
    const ids = ["alpha", "bravo", "charlie"];
    expect(parseFollowing(serializeFollowing(ids)).sort()).toEqual([...ids].sort());
  });

  it("serializes an empty set to an empty array", () => {
    expect(serializeFollowing([])).toBe("[]");
  });
});
