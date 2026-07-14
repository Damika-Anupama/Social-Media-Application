import { test, expect } from "@playwright/test";

/**
 * Production smoke test.
 *
 * Every other suite runs against a locally built app. This one is meant to be
 * pointed at whatever users actually reach:
 *
 *   E2E_BASE_URL=https://your-deployment npm run test:smoke
 *
 * A build passing on a laptop says nothing about the deployment — a wrong
 * environment variable, a missing image host, a stale build and the live site
 * is broken while every test on earth is green. Twenty-three iterations of this
 * project shipped without anyone ever loading the deployed URL.
 *
 * Deliberately small: the critical journeys, nothing that depends on seeded
 * fixtures. It should stay fast enough to run against production after a deploy.
 */

test.describe("Pulse — production smoke", () => {
  test("the site is reachable by the public", async ({ page }) => {
    await page.goto("/");

    // The deployment was live and behind Vercel's Deployment Protection: every
    // visitor got a Vercel login wall instead of the app. A "live demo" nobody
    // but the account owner can open is not a live demo, and nothing in the
    // build, the tests or CI could ever have noticed — they all run locally.
    const url = page.url();
    const title = await page.title();
    expect(
      url.includes("vercel.com/login") || /login\s*[–-]\s*vercel/i.test(title),
      `The deployment is behind an auth wall (landed on ${url}). ` +
        `Disable Vercel → Project → Settings → Deployment Protection.`,
    ).toBe(false);
  });

  test("the landing page renders", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status(), "landing page did not return 200").toBeLessThan(400);

    await expect(
      page.getByRole("heading", { name: /respects your time/i }),
    ).toBeVisible();
  });

  test("the metadata points at this site, not somebody else's", async ({ page }) => {
    await page.goto("/");

    // The bug this exists to catch: metadataBase was a hardcoded vercel.app
    // domain owned by a stranger, so every share preview advertised their site.
    const ogUrl = await page
      .locator('meta[property="og:image"]')
      .first()
      .getAttribute("content");

    if (ogUrl) {
      const origin = new URL(page.url()).origin;
      expect(new URL(ogUrl, origin).origin, "OG image points off-site").toBe(origin);
    }
  });

  test("a user can sign in and reach the feed", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill("ada@studio.com");
    await page.locator('input[type="password"]').fill("Lovelace1");
    await page.getByRole("button", { name: /continue to pulse/i }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole("article").first()).toBeVisible();
  });

  test("post images actually load in production", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill("ada@studio.com");
    await page.locator('input[type="password"]').fill("Lovelace1");
    await page.getByRole("button", { name: /continue to pulse/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    // The image optimizer is a server route: it can be configured correctly
    // locally and still 500 in production if a remote host is not allow-listed.
    const broken = await page.evaluate(() =>
      Array.from(document.querySelectorAll("img"))
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.currentSrc || img.src)
        .slice(0, 5),
    );
    expect(broken, "images failed to load").toEqual([]);
  });
});
