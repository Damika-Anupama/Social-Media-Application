import { test, expect } from "@playwright/test";

/**
 * E2E for Settings.
 *
 * The page promises "every setting on this screen is reversible" — these tests
 * hold it to that: switches are real, named, keyboard-operable, and they stick.
 */

async function gotoSettings(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill("ada@studio.com");
  await page.locator('input[type="password"]').fill("Lovelace1");
  await page.getByRole("button", { name: /continue to pulse/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await page.goto("/dashboard/settings");
}

test.describe("Pulse — settings", () => {
  test("privacy switches persist across a reload", async ({ page }) => {
    await gotoSettings(page);
    await page.getByRole("tab", { name: /privacy/i }).click();

    const privateAccount = page.getByRole("switch", { name: /private account/i });
    await expect(privateAccount).toHaveAttribute("aria-checked", "false");

    await privateAccount.click();
    await expect(privateAccount).toHaveAttribute("aria-checked", "true");

    // Regression: these used to be local component state and reset on reload.
    await page.reload();
    await page.getByRole("tab", { name: /privacy/i }).click();
    await expect(
      page.getByRole("switch", { name: /private account/i })
    ).toHaveAttribute("aria-checked", "true");
  });

  test("notification switches persist and survive leaving the page", async ({
    page,
  }) => {
    await gotoSettings(page);
    await page.getByRole("tab", { name: /notifications/i }).click();

    const mentions = page.getByRole("switch", { name: /mentions/i });
    await expect(mentions).toHaveAttribute("aria-checked", "true");
    await mentions.click();
    await expect(mentions).toHaveAttribute("aria-checked", "false");

    // Navigate away and back — not just a reload.
    await page.goto("/dashboard");
    await page.goto("/dashboard/settings");
    await page.getByRole("tab", { name: /notifications/i }).click();
    await expect(page.getByRole("switch", { name: /mentions/i })).toHaveAttribute(
      "aria-checked",
      "false"
    );
  });

  test("switches are named and keyboard-operable", async ({ page }) => {
    await gotoSettings(page);
    await page.getByRole("tab", { name: /privacy/i }).click();

    // Regression: the toggle used to be a nameless <button aria-pressed>, so
    // this by-name lookup would have found nothing.
    const receipts = page.getByRole("switch", { name: /hide read receipts in dms/i });
    await expect(receipts).toHaveAttribute("aria-checked", "false");

    await receipts.focus();
    await page.keyboard.press("Space");
    await expect(receipts).toHaveAttribute("aria-checked", "true");
  });

  test("a disabled setting cannot be flipped", async ({ page }) => {
    await gotoSettings(page);
    await page.getByRole("tab", { name: /privacy/i }).click();

    const ads = page.getByRole("switch", { name: /personalised ads/i });
    await expect(ads).toBeDisabled();
    await expect(ads).toHaveAttribute("aria-checked", "false");
  });
});
