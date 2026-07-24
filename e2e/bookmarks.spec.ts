import { test, expect } from "@playwright/test";

/**
 * E2E for bookmark collections.
 *
 * "New collection" used to be a dead button. These cover creating one, filing
 * a saved post into it, filtering by it, and it all surviving a reload.
 */

const NAME = `Weekend ${Date.now()}`;

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill("ada@studio.com");
  await page.locator('input[type="password"]').fill("Lovelace1");
  await page.getByRole("button", { name: /continue to pulse/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

/** Save two posts so the bookmarks page has something to file. */
async function saveTwoPosts(page: import("@playwright/test").Page) {
  const bookmark = page.getByRole("button", { name: /^bookmark$/i });
  await bookmark.nth(0).click();
  await bookmark.nth(1).click();
  await page.goto("/dashboard/bookmarks");
  await expect(page.getByRole("article").first()).toBeVisible();
}

test.describe("Pulse — bookmark collections", () => {
  test("creating a collection, filing a post, and filtering by it persists", async ({
    page,
  }) => {
    await signIn(page);
    await saveTwoPosts(page);

    // Create — this button used to do nothing at all.
    await page.getByRole("button", { name: /new collection/i }).click();
    const dialog = page.getByRole("dialog", { name: /new collection/i });
    await expect(dialog).toBeVisible();
    await expect
      .poll(() => dialog.evaluate((el) => el.contains(document.activeElement)))
      .toBe(true);
    await dialog.getByLabel("Name").fill(NAME);
    await dialog.getByRole("button", { name: /^create$/i }).click();
    await expect(dialog).toBeHidden();

    // A brand-new collection is empty, so filtering to it shows the empty state.
    await expect(page.getByText(/nothing saved in/i)).toBeVisible();

    // File one post into it.
    await page.getByRole("tab", { name: /^all$/i }).click();
    await page.getByRole("button", { name: `Add to ${NAME}` }).first().click();

    // Filter to the collection: exactly the filed post.
    await page.getByRole("tab", { name: new RegExp(NAME, "i") }).click();
    await expect(page.getByRole("article")).toHaveCount(1);

    // Everything survives a reload.
    await page.reload();
    await page.getByRole("tab", { name: new RegExp(NAME, "i") }).click();
    await expect(page.getByRole("article")).toHaveCount(1);
  });

  test("a duplicate collection name is rejected", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/bookmarks");

    await page.getByRole("button", { name: /new collection/i }).click();
    const dialog = page.getByRole("dialog", { name: /new collection/i });

    // "Climate" is a built-in filter — a second chip with that name would be a lie.
    await dialog.getByLabel("Name").fill("Climate");
    await dialog.getByRole("button", { name: /^create$/i }).click();

    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("alert")).toContainText(/already have/i);
  });

  test("deleting the active collection falls back to All", async ({ page }) => {
    await signIn(page);
    await saveTwoPosts(page);

    await page.getByRole("button", { name: /new collection/i }).click();
    const dialog = page.getByRole("dialog", { name: /new collection/i });
    await dialog.getByLabel("Name").fill(NAME);
    await dialog.getByRole("button", { name: /^create$/i }).click();

    // Creating selects the new collection. Deleting it must not strand the
    // viewer on a filter that no longer exists.
    await page.getByRole("button", { name: `Delete collection ${NAME}` }).click();
    await expect(page.getByRole("tab", { name: /^all$/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.getByRole("article").first()).toBeVisible();
  });
});
