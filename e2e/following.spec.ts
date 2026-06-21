import { test, expect } from "@playwright/test";

/**
 * E2E for the persistent following feature.
 *
 * Following an account on Explore writes to localStorage (`pulse.following.v1`),
 * so the "Following" state survives a reload and is shared across surfaces
 * (the Explore grid and the right-rail "People worth following" widget read the
 * same store). All client-side (no backend), so this is valid against the
 * Vercel preview too.
 */

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill("ada@studio.com");
  await page.locator('input[type="password"]').fill("Lovelace1");
  await page.getByRole("button", { name: /continue to pulse/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe("Pulse — persistent following", () => {
  test("following an account persists across a reload", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/explore", { waitUntil: "domcontentloaded" });

    // Grab the first "Follow" button in the People-to-discover grid.
    const followBtn = page.getByRole("button", { name: /^Follow$/ }).first();
    await expect(followBtn).toBeVisible();
    await followBtn.click();

    // It flips to "Following" with the correct pressed state.
    const followingBtn = page.getByRole("button", { name: /^Following$/ }).first();
    await expect(followingBtn).toBeVisible();
    await expect(followingBtn).toHaveAttribute("aria-pressed", "true");

    // Reload — the state is restored from localStorage.
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("button", { name: /^Following$/ }).first()
    ).toBeVisible();

    // And it really is in the persisted store.
    const stored = await page.evaluate(() =>
      window.localStorage.getItem("pulse.following.v1")
    );
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored as string).length).toBeGreaterThan(0);
  });

  test("unfollowing clears the persisted entry", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/explore", { waitUntil: "domcontentloaded" });

    const followBtn = page.getByRole("button", { name: /^Follow$/ }).first();
    await followBtn.click();
    const followingBtn = page.getByRole("button", { name: /^Following$/ }).first();
    await expect(followingBtn).toBeVisible();

    // Toggle back off.
    await followingBtn.click();
    await expect(
      page.getByRole("button", { name: /^Follow$/ }).first()
    ).toBeVisible();

    const stored = await page.evaluate(() =>
      window.localStorage.getItem("pulse.following.v1")
    );
    // Either the key is empty array or absent — both mean "nothing followed".
    const parsed = stored ? JSON.parse(stored) : [];
    expect(parsed.length).toBe(0);
  });

  test("follow state is shared between Explore and the right rail", async ({
    page,
  }) => {
    await signIn(page);

    // Seed the shared store directly with real suggestion ids, then assert the
    // right rail honors it. (priya/marcos/theo/aiko = u_7/u_8/u_6/u_9.)
    await page.evaluate(() => {
      window.localStorage.setItem(
        "pulse.following.v1",
        JSON.stringify(["u_6", "u_7", "u_8", "u_9"])
      );
    });
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });

    // The right-rail "People worth following" widget is xl-only; widen first.
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.reload({ waitUntil: "domcontentloaded" });

    // At least one suggestion should render as already-followed from the store.
    await expect(
      page.getByRole("button", { name: /^Following$/ }).first()
    ).toBeVisible();
  });
});
