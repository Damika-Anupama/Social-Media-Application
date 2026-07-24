import { test, expect } from "@playwright/test";

/**
 * Guards that images actually go through the Next optimizer and reserve their
 * space. Both were true of next.config.js already and false of every call site.
 */

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill("ada@studio.com");
  await page.locator('input[type="password"]').fill("Lovelace1");
  await page.getByRole("button", { name: /continue to pulse/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe("Pulse — images", () => {
  test("explore feed images are optimized and sized", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/explore");

    const tile = page.locator("button[aria-label='Open image 1 full size'] img").first();
    await expect(tile).toBeVisible();

    // Served through /_next/image, not hot-linked from unsplash.
    const src = await tile.getAttribute("src");
    expect(src).toContain("/_next/image");

    // Responsive candidates, so a phone does not download a desktop image.
    expect(await tile.getAttribute("srcset")).toBeTruthy();

    // Space reserved before load — this is the layout-shift fix.
    expect(await tile.getAttribute("width")).toBeTruthy();
    expect(await tile.getAttribute("height")).toBeTruthy();
  });

  test("post media is optimized", async ({ page }) => {
    await signIn(page);
    const media = page.locator("article img[src*='/_next/image']").first();
    await expect(media).toBeVisible();
  });
});
