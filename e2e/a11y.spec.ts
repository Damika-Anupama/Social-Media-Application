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
 * Seed the light theme before the app boots.
 *
 * The audit only ever ran in dark, at desktop width. Half the themed surfaces
 * in the app had therefore never been checked by anything — and a token that
 * passes on a near-black background says nothing about how it reads on white.
 */
async function useLightTheme(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "pulse.preferences.v1",
      JSON.stringify({ theme: "light", reduceMotion: false, largerType: false }),
    );
  });
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
  // NOT networkidle: Explore lazy-loads an endless image feed, so it never goes
  // idle by design. Waiting for that is waiting forever — it timed out in CI.
  await page.waitForLoadState("load");
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

  // The four dialogs the first sweep never opened.
  test("the edit-profile dialog has no violations", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/profile");
    await page.getByRole("button", { name: /edit profile/i }).click();
    await expect(page.getByRole("dialog", { name: /edit profile/i })).toBeVisible();

    const { violations } = await (await audit(page)).analyze();
    expect(describeViolations(violations)).toBe("");
  });

  test("the create-community dialog has no violations", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/communities");
    await page.getByRole("button", { name: /create community/i }).click();
    await expect(page.getByRole("dialog", { name: /create community/i })).toBeVisible();

    const { violations } = await (await audit(page)).analyze();
    expect(describeViolations(violations)).toBe("");
  });

  test("the new-collection dialog has no violations", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/bookmarks");
    await page.getByRole("button", { name: /new collection/i }).click();
    await expect(page.getByRole("dialog", { name: /new collection/i })).toBeVisible();

    const { violations } = await (await audit(page)).analyze();
    expect(describeViolations(violations)).toBe("");
  });

  test("the explore lightbox has no violations", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/explore");
    const tile = page.getByRole("button", { name: /open image 1 full size/i });
    await expect(tile).toBeVisible();
    await tile.click();
    await expect(page.getByTestId("lightbox")).toBeVisible();

    const { violations } = await (await audit(page)).analyze();
    expect(describeViolations(violations)).toBe("");
  });

  test("the story viewer has no violations", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/stories");
    await page.getByRole("button", { name: /view .+'s story/i }).first().click();

    // Regression: this covered the whole screen and was not a dialog at all —
    // no role, no aria-modal, no name, and Tab escaped it.
    const story = page.getByRole("dialog", { name: /'s story/i });
    await expect(story).toBeVisible();

    const { violations } = await (await audit(page)).analyze();
    expect(describeViolations(violations)).toBe("");
  });
});

/**
 * The light theme is a whole second palette. It shipped audited by nobody.
 */
test.describe("Pulse — accessibility audit (light theme)", () => {
  for (const route of ROUTES) {
    test(`${route} has no WCAG violations in light theme`, async ({ page }) => {
      await useLightTheme(page);
      if (route.startsWith("/dashboard")) await signIn(page);
      await page.goto(route);
      await expect(page.locator("html")).toHaveClass(/theme-light/);

      const { violations } = await (await audit(page)).analyze();
      expect(describeViolations(violations)).toBe("");
    });
  }
});

/**
 * Mobile is a different layout, not a narrower one — the messages pane, the tab
 * bar, and the sidebar all swap out below md. None of it had been audited.
 */
test.describe("Pulse — accessibility audit (mobile)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const route of ROUTES) {
    test(`${route} has no WCAG violations on mobile`, async ({ page }) => {
      if (route.startsWith("/dashboard")) await signIn(page);
      await page.goto(route);

      const { violations } = await (await audit(page)).analyze();
      expect(describeViolations(violations)).toBe("");
    });
  }
});
