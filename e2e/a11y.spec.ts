import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Automated accessibility audit.
 *
 * My own eye missed a broken ARIA contract on four surfaces for four
 * iterations, because I kept checking that roles *existed* rather than that
 * they *worked*. axe checks the things a human reviewer reliably does not.
 *
 * It is not a substitute for the hand-written keyboard tests — axe cannot press
 * ArrowRight — so it runs alongside them, not instead.
 */

const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];



const ROUTES = [
  "/",
  "/login",
  "/register",
  "/dashboard",
  "/dashboard/explore",
  "/dashboard/notifications",
  "/dashboard/messages",
  "/dashboard/bookmarks",
  "/dashboard/communities",
  "/dashboard/profile",
  "/dashboard/settings",
  "/dashboard/stories",
];

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill("ada@studio.com");
  await page.locator('input[type="password"]').fill("Lovelace1");
  await page.getByRole("button", { name: /continue to pulse/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

/**
 * Audit the settled page.
 *
 * Elements fade in, and axe sampling mid-fade reports contrast failures that
 * are pure artefact — it measures the element at 25% opacity against a
 * half-blended background. Verified: the compose dialog reports six contrast
 * violations mid-animation and zero once it lands. Auditing an intermediate
 * frame is auditing something no user ever sees.
 */
async function audit(page: import("@playwright/test").Page) {
  // Neutralise fade-ins and let the page settle, so axe measures what a user
  // actually sees rather than an intermediate frame.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(400);
  return new AxeBuilder({ page }).withTags(WCAG);
}

/** Report every violation, not just the first — a list of one is a slow bisect. */
function describeViolations(violations: import("axe-core").Result[]) {
  return violations
    .map(
      (v) =>
        `${v.id} (${v.impact}): ${v.help}\n  ${v.nodes
          .map((n) => n.target.join(" "))
          .join("\n  ")}`,
    )
    .join("\n\n");
}

test.describe("Pulse — accessibility audit", () => {
  for (const route of ROUTES) {
    test(`${route} has no WCAG violations`, async ({ page }) => {
      if (route.startsWith("/dashboard")) await signIn(page);
      await page.goto(route);

      const { violations } = await (await audit(page)).analyze();
      expect(describeViolations(violations)).toBe("");
    });
  }

  // Dialogs only exist while open, so a static route sweep never sees them.
  test("the compose dialog has no violations", async ({ page }) => {
    await signIn(page);
    await page.keyboard.press("n");
    await expect(page.getByRole("dialog", { name: /new post/i })).toBeVisible();

    const { violations } = await (await audit(page)).analyze();
    expect(describeViolations(violations)).toBe("");
  });

  test("the command palette has no violations", async ({ page }) => {
    await signIn(page);
    await page.keyboard.press("/");
    await expect(page.getByRole("dialog", { name: /command palette/i })).toBeVisible();

    const { violations } = await (await audit(page)).analyze();
    expect(describeViolations(violations)).toBe("");
  });

  test("the shortcuts overlay has no violations", async ({ page }) => {
    await signIn(page);
    await page.keyboard.press("?");
    await expect(page.getByRole("dialog", { name: /keyboard shortcuts/i })).toBeVisible();

    const { violations } = await (await audit(page)).analyze();
    expect(describeViolations(violations)).toBe("");
  });
});
