import { describe, it, expect } from "vitest";
import {
  validateEmail,
  validatePassword,
  validateName,
  validateHandle,
  validateConfirm,
  passwordScore,
} from "@/lib/validation";

describe("validateEmail", () => {
  it("requires a value", () => {
    expect(validateEmail("")).toBe("Email is required.");
  });
  it("rejects malformed addresses", () => {
    expect(validateEmail("not-an-email")).toBe("Enter a valid email address.");
    expect(validateEmail("a@b")).toBe("Enter a valid email address.");
  });
  it("accepts a well-formed address", () => {
    expect(validateEmail("ada@studio.com")).toBeNull();
  });
});

describe("validatePassword", () => {
  it("enforces length and character classes", () => {
    expect(validatePassword("")).toBe("Password is required.");
    expect(validatePassword("short")).toBe("Password must be at least 8 characters.");
    expect(validatePassword("alllowercase1")).toBe("Include at least one uppercase letter.");
    expect(validatePassword("ALLUPPERCASE1")).toBe("Include at least one lowercase letter.");
    expect(validatePassword("NoNumbersHere")).toBe("Include at least one number.");
  });
  it("accepts a strong password", () => {
    expect(validatePassword("Lovelace1")).toBeNull();
  });
});

describe("validateName", () => {
  it("requires a reasonable name", () => {
    expect(validateName("")).toBe("Full name is required.");
    expect(validateName("A")).toBe("Name looks too short.");
    expect(validateName("123$$")).toMatch(/letters, spaces/i);
  });
  it("accepts names with apostrophes and hyphens", () => {
    expect(validateName("Ada Lovelace")).toBeNull();
    expect(validateName("O'Brien-Smith")).toBeNull();
  });
});

describe("validateHandle", () => {
  it("enforces length and charset", () => {
    expect(validateHandle("")).toBe("Choose a username.");
    expect(validateHandle("ab")).toBe("At least 3 characters.");
    expect(validateHandle("a".repeat(21))).toBe("At most 20 characters.");
    expect(validateHandle("bad handle")).toMatch(/letters, numbers/i);
  });
  it("strips a leading @ and accepts valid handles", () => {
    expect(validateHandle("@ada_lovelace")).toBeNull();
    expect(validateHandle("ada_99")).toBeNull();
  });
});

describe("validateConfirm", () => {
  it("requires confirmation and a match", () => {
    expect(validateConfirm("Lovelace1", "")).toBe("Please confirm your password.");
    expect(validateConfirm("Lovelace1", "Different1")).toBe("Passwords don't match.");
    expect(validateConfirm("Lovelace1", "Lovelace1")).toBeNull();
  });
});

describe("passwordScore", () => {
  it("scores empty input as 0", () => {
    expect(passwordScore("").score).toBe(0);
  });
  it("scores stronger passwords higher", () => {
    const weak = passwordScore("abcdefg");
    const strong = passwordScore("Lovelace1!");
    const excellent = passwordScore("Lovelace1!extra-long-passphrase");
    expect(strong.score).toBeGreaterThan(weak.score);
    expect(excellent.score).toBe(4);
    expect(excellent.label).toBe("Excellent");
  });
});
