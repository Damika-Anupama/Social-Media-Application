import { test, expect } from "@playwright/test";

/**
 * E2E for the global keyboard shortcuts layer.
 *
 * Covers the `?` help overlay, `g`-prefixed navigation chords, the `n` compose
 * shortcut, and the guarantee that shortcuts never fire while the user is typing.
 */

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill("ada@studio.com");
  await page.locator('input[type="password"]').fill("Lovelace1");
  await page.getByRole("button", { name: /continue to pulse/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}


/**
 * WebKit on Linux drops global key events unless something in the document has
 * focus. #main-content carries tabIndex={-1} for the skip link, so focusing it
 * is a no-op visually and gives the keyboard somewhere to land. Locally (macOS
 * WebKit) it was never needed; CI is where this showed up.
 */
async function focusDocument(page: import("@playwright/test").Page) {
  await page.locator("#main-content").focus();
}

test.describe("Pulse — keyboard shortcuts", () => {
  test("? opens the shortcuts overlay and Escape closes it", async ({ page }) => {
    await signIn(page);
    await focusDocument(page);

    const dialog = page.getByRole("dialog", { name: /keyboard shortcuts/i });
    await expect(dialog).toBeHidden();

    await page.keyboard.press("?");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/go to explore/i)).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("g-chords navigate", async ({ page }) => {
    await signIn(page);
    await focusDocument(page);

    await page.keyboard.press("g");
    await page.keyboard.press("e");
    await expect(page).toHaveURL(/\/dashboard\/explore/);

    await page.keyboard.press("g");
    await page.keyboard.press("b");
    await expect(page).toHaveURL(/\/dashboard\/bookmarks/);

    await page.keyboard.press("g");
    await page.keyboard.press("h");
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test("n opens the composer, and shortcuts stay quiet while typing", async ({
    page,
  }) => {
    await signIn(page);
    await focusDocument(page);

    // Typing into the inline composer must not trigger navigation or the overlay.
    const composer = page.getByPlaceholder(/what are you noticing today/i);
    await composer.fill("going nowhere? n");
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(
      page.getByRole("dialog", { name: /keyboard shortcuts/i })
    ).toBeHidden();

    // With focus outside a text field, `n` opens the compose modal.
    await composer.clear();
    await composer.blur();
    await page.keyboard.press("n");
    await expect(page.getByRole("dialog", { name: /new post/i })).toBeVisible();
  });
});
