import { describe, it, expect } from "vitest";
import { parsePreferences, DEFAULT_PREFERENCES } from "@/lib/PreferencesContext";

describe("parsePreferences", () => {
  it("returns defaults for null / empty / malformed input", () => {
    expect(parsePreferences(null)).toEqual(DEFAULT_PREFERENCES);
    expect(parsePreferences("")).toEqual(DEFAULT_PREFERENCES);
    expect(parsePreferences("{not json")).toEqual(DEFAULT_PREFERENCES);
    expect(parsePreferences('"string"')).toEqual(DEFAULT_PREFERENCES);
    expect(parsePreferences("null")).toEqual(DEFAULT_PREFERENCES);
  });

  it("parses valid boolean preferences", () => {
    expect(parsePreferences('{"reduceMotion":true,"largerType":true}')).toEqual({
      reduceMotion: true,
      largerType: true,
    });
  });

  it("falls back to defaults for missing or non-boolean keys", () => {
    expect(parsePreferences('{"reduceMotion":true}')).toEqual({
      reduceMotion: true,
      largerType: false,
    });
    expect(parsePreferences('{"reduceMotion":"yes","largerType":1}')).toEqual(
      DEFAULT_PREFERENCES,
    );
  });

  it("ignores unknown keys", () => {
    expect(parsePreferences('{"largerType":true,"hacker":"x"}')).toEqual({
      reduceMotion: false,
      largerType: true,
    });
  });
});
