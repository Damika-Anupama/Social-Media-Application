import { test, expect } from "@playwright/test";

/**
 * E2E for the Explore search surface.
 *
 * Covers URL-synced search (shareable, Back/Forward, and the command palette
 * searching into an already-open Explore), the unified empty state, and the
 * visual-feed lightbox.
 */

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill("ada@studio.com");
  await page.locator('input[type="password"]').fill("Lovelace1");
  await page.getByRole("button", { name: /continue to pulse/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe("Pulse — explore", () => {
  test("typing a search is reflected in the URL and survives a reload", async ({
    page,
  }) => {
    await signIn(page);
    await page.goto("/dashboard/explore");

    await page.getByRole("searchbox", { name: /search pulse/i }).fill("design");
    await expect(page).toHaveURL(/\?q=design/);

    // The URL is the source of truth: a reload restores the same search.
    await page.reload();
    await expect(page.getByRole("searchbox", { name: /search pulse/i })).toHaveValue(
      "design"
    );
  });

  test("the command palette searches into an already-open Explore", async ({
    page,
  }) => {
    await signIn(page);
    await page.goto("/dashboard/explore");

    // Give the global "/" shortcut somewhere to land (see shortcuts.spec) so
    // opening the palette isn't racy.
    await page.locator("#main-content").focus();

    // Regression: q was only read on mount, so this used to change the URL
    // while the input and results sat there ignoring it.
    await page.keyboard.press("/");
    await page.getByLabel("Search commands").fill("climate");
    // The palette is now an ARIA combobox: results are options, not buttons.
    await page.getByRole("option", { name: /search “climate”/i }).click();

    await expect(page).toHaveURL(/\?q=climate/);
    await expect(page.getByRole("searchbox", { name: /search pulse/i })).toHaveValue(
      "climate"
    );
  });

  test("a search matching nothing shows one empty state with a way out", async ({
    page,
  }) => {
    await signIn(page);
    await page.goto("/dashboard/explore?q=zzzznothing");

    await expect(
      page.getByRole("heading", { name: /no results for “zzzznothing”/i })
    ).toBeVisible();

    // Clearing recovers the browse state.
    await page.getByRole("button", { name: /clear search/i }).click();
    await expect(
      page.getByRole("heading", { name: /headline trends/i })
    ).toBeVisible();
    await expect(page).not.toHaveURL(/\?q=/);
  });

  test("visual-feed tiles open a closable lightbox", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/explore");

    // The masonry images reflow as they load, so wait for the tile to settle
    // before clicking — otherwise the click can land on moving layout.
    const tile = page.getByRole("button", { name: /open image 1 full size/i });
    await expect(tile).toBeVisible();
    await tile.click();

    const lightbox = page.getByTestId("lightbox");
    await expect(lightbox).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(lightbox).toBeHidden();
  });
});
