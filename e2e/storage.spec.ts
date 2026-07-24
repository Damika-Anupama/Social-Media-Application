import { test, expect } from "@playwright/test";

/**
 * Failed saves must be admitted, not swallowed.
 *
 * Simulates the real thing — storage that throws on write, as in Safari private
 * browsing or a full quota — by breaking setItem before the app boots.
 */

/**
 * setItem lives on Storage.prototype, not on the localStorage instance.
 * Patching the instance happens to work in Chromium and silently does nothing
 * in Firefox and WebKit — so this test was passing there while verifying
 * nothing at all. Patch the prototype, which is where the method actually is.
 */
async function breakStorage(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("full", "QuotaExceededError");
    };
  });
}

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill("ada@studio.com");
  await page.locator('input[type="password"]').fill("Lovelace1");
  await page.getByRole("button", { name: /continue to pulse/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe("Pulse — storage failures", () => {
  test("a post that cannot be saved says so instead of pretending", async ({
    page,
  }) => {
    await breakStorage(page);
    await signIn(page);

    await page
      .getByPlaceholder(/what are you noticing today/i)
      .fill("This will not survive");
    await page.getByRole("button", { name: /^Post$/ }).click();

    // Regression: the post appeared, the write failed, and nothing said a word.
    // It was gone on reload and the viewer never knew why.
    await expect(page.getByText(/storage is full/i)).toBeVisible();
  });

  test("the app keeps working when storage is unavailable", async ({ page }) => {
    await breakStorage(page);
    await signIn(page);

    // Degraded, not broken: the post still appears for this session.
    const unique = "Ephemeral but visible";
    await page.getByPlaceholder(/what are you noticing today/i).fill(unique);
    await page.getByRole("button", { name: /^Post$/ }).click();

    await expect(
      page.getByTestId("user-post").filter({ hasText: unique })
    ).toBeVisible();
  });

  test("the warning appears once, not once per keystroke", async ({ page }) => {
    await breakStorage(page);
    await signIn(page);

    // First failing write warns.
    const like = page.getByRole("button", { name: /^like$/i });
    await like.nth(0).click();
    const warning = page.getByText(/storage is full/i);
    await expect(warning).toHaveCount(1);

    // Two more failing writes must not stack up a second and third warning.
    // (Asserting only at the end raced the toast's own dismissal on a slow
    // engine — a disappeared toast is not the same as a deduplicated one.)
    await like.nth(1).click();
    await like.nth(2).click();
    await expect(warning).toHaveCount(1);
  });
});
