import { describe, it, expect } from "vitest";
import {
  parsePreferences,
  resolveTheme,
  DEFAULT_PREFERENCES,
} from "@/lib/PreferencesContext";

describe("parsePreferences", () => {
  it("returns defaults for null / empty / malformed input", () => {
    expect(parsePreferences(null)).toEqual(DEFAULT_PREFERENCES);
    expect(parsePreferences("")).toEqual(DEFAULT_PREFERENCES);
    expect(parsePreferences("{not json")).toEqual(DEFAULT_PREFERENCES);
    expect(parsePreferences('"string"')).toEqual(DEFAULT_PREFERENCES);
    expect(parsePreferences("null")).toEqual(DEFAULT_PREFERENCES);
  });

  it("parses valid preferences", () => {
    expect(
      parsePreferences('{"theme":"light","reduceMotion":true,"largerType":true}'),
    ).toEqual({ theme: "light", reduceMotion: true, largerType: true });
  });

  it("falls back to defaults for missing or invalid values", () => {
    expect(parsePreferences('{"reduceMotion":true}')).toEqual({
      theme: "dark",
      reduceMotion: true,
      largerType: false,
    });
    expect(
      parsePreferences('{"theme":"neon","reduceMotion":"yes","largerType":1}'),
    ).toEqual(DEFAULT_PREFERENCES);
  });

  it("accepts every valid theme value", () => {
    for (const theme of ["system", "dark", "light"]) {
      expect(parsePreferences(JSON.stringify({ theme })).theme).toBe(theme);
    }
  });

  it("ignores unknown keys", () => {
    expect(parsePreferences('{"largerType":true,"hacker":"x"}')).toEqual({
      theme: "dark",
      reduceMotion: false,
      largerType: true,
    });
  });
});

describe("resolveTheme", () => {
  it("returns the explicit choice for dark/light", () => {
    expect(resolveTheme("dark", true)).toBe("dark");
    expect(resolveTheme("light", false)).toBe("light");
  });

  it("follows the OS preference when set to system", () => {
    expect(resolveTheme("system", true)).toBe("light");
    expect(resolveTheme("system", false)).toBe("dark");
  });
});
