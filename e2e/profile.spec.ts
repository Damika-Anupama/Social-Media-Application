import { test, expect } from "@playwright/test";

/**
 * E2E for the profile surface.
 *
 * Covers persistence of an edit, the validation that stops you wiping your own
 * display name, and the edit modal behaving like a real dialog.
 */

const NEW_NAME = `Ada L ${Date.now()}`;

async function gotoProfile(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill("ada@studio.com");
  await page.locator('input[type="password"]').fill("Lovelace1");
  await page.getByRole("button", { name: /continue to pulse/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await page.goto("/dashboard/profile");
}

test.describe("Pulse — profile", () => {
  test("an edit persists across a reload", async ({ page }) => {
    await gotoProfile(page);

    await page.getByRole("button", { name: /edit profile/i }).click();
    const dialog = page.getByRole("dialog", { name: /edit profile/i });
    await expect(dialog).toBeVisible();

    await dialog.getByLabel("Display name").fill(NEW_NAME);
    await dialog.getByLabel("Bio").fill("Notes on the Analytical Engine.");
    await dialog.getByRole("button", { name: /save changes/i }).click();

    await expect(dialog).toBeHidden();
    await expect(page.getByRole("heading", { name: NEW_NAME })).toBeVisible();

    // Regression: this was local state and reverted to the seed on reload.
    await page.reload();
    await expect(page.getByRole("heading", { name: NEW_NAME })).toBeVisible();
    // The bio also renders on each post card's author line, so scope to the header.
    await expect(
      page.getByText("Notes on the Analytical Engine.").first()
    ).toBeVisible();
  });

  test("an empty display name is rejected rather than saved", async ({ page }) => {
    await gotoProfile(page);

    await page.getByRole("button", { name: /edit profile/i }).click();
    const dialog = page.getByRole("dialog", { name: /edit profile/i });

    await dialog.getByLabel("Display name").fill("   ");
    await dialog.getByRole("button", { name: /save changes/i }).click();

    // The dialog stays open and says why.
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("alert")).toContainText(/required/i);
    await expect(dialog.getByLabel("Display name")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });

  test("the edit modal is a real dialog that closes on Escape", async ({
    page,
  }, testInfo) => {
    // An iPhone keyboard has no Escape key. Skipping is honest; asserting it
    // would be testing a key the platform does not have.
    test.skip(testInfo.project.name === "mobile-safari", "no Escape key on iOS");
    await gotoProfile(page);

    await page.getByRole("button", { name: /edit profile/i }).click();
    const dialog = page.getByRole("dialog", { name: /edit profile/i });
    await expect(dialog).toBeVisible();

    // Focus lands inside the dialog rather than nowhere.
    await expect
      .poll(() => dialog.evaluate((el) => el.contains(document.activeElement)))
      .toBe(true);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });
});
