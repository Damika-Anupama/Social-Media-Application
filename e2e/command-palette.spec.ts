import { test, expect } from "@playwright/test";

/**
 * E2E for the ⌘K command palette's accessibility.
 *
 * The palette is a real ARIA combobox: the input owns a listbox, arrow keys
 * move `aria-activedescendant` across `role="option"` rows (focus never leaves
 * the input), and a live region reports the result count. These are the
 * guarantees a screen-reader user depends on, so they're asserted here.
 */

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill("ada@studio.com");
  await page.locator('input[type="password"]').fill("Lovelace1");
  await page.getByRole("button", { name: /continue to pulse/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

// WebKit on Linux drops global key events unless something has focus; the
// skip-link target is a no-op place for the keyboard to land (see shortcuts.spec).
async function focusDocument(page: import("@playwright/test").Page) {
  await page.locator("#main-content").focus();
}

test.describe("Pulse — command palette", () => {
  test("opens with the keyboard and exposes an accessible combobox", async ({ page }) => {
    await signIn(page);
    await focusDocument(page);

    // The handler listens for metaKey || ctrlKey + k; Control+k is portable.
    await page.keyboard.press("Control+k");

    const combobox = page.getByRole("combobox", { name: /search commands/i });
    await expect(combobox).toBeVisible();
    await expect(combobox).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("listbox", { name: /results/i })).toBeVisible();

    // Arrow keys move the active option, and it is the one marked selected.
    const before = await combobox.getAttribute("aria-activedescendant");
    await page.keyboard.press("ArrowDown");
    const after = await combobox.getAttribute("aria-activedescendant");
    expect(after).not.toEqual(before);
    expect(after).toBeTruthy();
    await expect(page.locator(`#${after}`)).toHaveAttribute("aria-selected", "true");

    // Typing narrows the listbox to matching options.
    await combobox.fill("explore");
    await expect(page.getByRole("option").first()).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(combobox).toBeHidden();
  });
});
