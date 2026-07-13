import { test, expect } from "@playwright/test";

/**
 * Keyboard focus management for modal dialogs.
 *
 * Every dialog said aria-modal="true" while letting Tab walk straight out into
 * the page behind it, and none gave focus back to whatever opened them. These
 * tests fail against that.
 */

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill("ada@studio.com");
  await page.locator('input[type="password"]').fill("Lovelace1");
  await page.getByRole("button", { name: /continue to pulse/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe("Pulse — dialog focus management", () => {
  test("Tab cannot escape the compose dialog", async ({ page }) => {
    await signIn(page);
    await page.keyboard.press("n");

    const dialog = page.getByRole("dialog", { name: /new post/i });
    await expect(dialog).toBeVisible();

    // Tab a lot further than the dialog has focusable elements. If the trap
    // leaks, focus ends up in the page behind and this fails.
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press("Tab");
      const inside = await dialog.evaluate((el) => el.contains(document.activeElement));
      expect(inside).toBe(true);
    }
  });

  test("Shift+Tab cannot escape backwards either", async ({ page }) => {
    await signIn(page);
    await page.keyboard.press("n");

    const dialog = page.getByRole("dialog", { name: /new post/i });
    await expect(dialog).toBeVisible();

    for (let i = 0; i < 15; i++) {
      await page.keyboard.press("Shift+Tab");
      const inside = await dialog.evaluate((el) => el.contains(document.activeElement));
      expect(inside).toBe(true);
    }
  });

  test("closing a dialog returns focus to the control that opened it", async ({
    page,
  }) => {
    await signIn(page);
    await page.goto("/dashboard/profile");

    const trigger = page.getByRole("button", { name: /edit profile/i });
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: /edit profile/i });
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    // Regression: focus used to land back on <body>, dumping keyboard users at
    // the top of the document.
    await expect(trigger).toBeFocused();
  });

  test("the lightbox traps focus and restores it to its tile", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/explore");

    const tile = page.getByRole("button", { name: /open image 1 full size/i });
    await expect(tile).toBeVisible();
    await tile.click();

    const lightbox = page.getByTestId("lightbox");
    await expect(lightbox).toBeVisible();

    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("Tab");
      const inside = await lightbox.evaluate((el) => el.contains(document.activeElement));
      expect(inside).toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(lightbox).toBeHidden();
    await expect(tile).toBeFocused();
  });

  test("the shortcuts overlay traps focus", async ({ page }) => {
    await signIn(page);
    await page.keyboard.press("?");

    const dialog = page.getByRole("dialog", { name: /keyboard shortcuts/i });
    await expect(dialog).toBeVisible();

    for (let i = 0; i < 8; i++) {
      await page.keyboard.press("Tab");
      const inside = await dialog.evaluate((el) => el.contains(document.activeElement));
      expect(inside).toBe(true);
    }
  });
});
