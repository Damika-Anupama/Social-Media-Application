import { test, expect } from "@playwright/test";

/**
 * Connection awareness.
 *
 * Pulse stores everything locally, so it keeps working with no network — which
 * is exactly why saying nothing was wrong: the viewer had no way to tell which
 * state they were in.
 */

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill("ada@studio.com");
  await page.locator('input[type="password"]').fill("Lovelace1");
  await page.getByRole("button", { name: /continue to pulse/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe("Pulse — offline", () => {
  test("going offline is announced, and coming back is confirmed", async ({
    page,
    context,
  }) => {
    await signIn(page);

    const banner = page.getByTestId("connection-banner");
    await expect(banner).toBeHidden();

    await context.setOffline(true);
    await expect(banner).toBeVisible();
    await expect(banner).toContainText(/you're offline/i);
    // It is a live region, so a screen reader hears it too.
    await expect(banner).toHaveAttribute("aria-live", "polite");

    await context.setOffline(false);
    await expect(banner).toContainText(/back online/i);

    // The confirmation is transient — it should not sit there forever.
    await expect(banner).toBeHidden({ timeout: 8000 });
  });

  test("the app still works offline — a post is composed and persists", async ({
    page,
    context,
  }) => {
    await signIn(page);
    await context.setOffline(true);
    await expect(page.getByTestId("connection-banner")).toBeVisible();

    // The banner claims Pulse still works offline. Hold it to that.
    const unique = `Offline post ${Date.now()}`;
    await page.getByPlaceholder(/what are you noticing today/i).fill(unique);
    await page.getByRole("button", { name: /^Post$/ }).click();

    await expect(
      page.getByTestId("user-post").filter({ hasText: unique })
    ).toBeVisible();

    // And it is genuinely saved on this device, not just on screen.
    await context.setOffline(false);
    await page.reload();
    await expect(
      page.getByTestId("user-post").filter({ hasText: unique })
    ).toBeVisible();
  });
});
