import { test, expect } from "@playwright/test";

/**
 * E2E for the persistent post composer feature.
 *
 * Composing a post adds it optimistically to the "For you" feed and persists it
 * to localStorage, so it survives a reload. Posts can be deleted. All client-side
 * (no backend), so this is valid against the Vercel preview too.
 */

const UNIQUE = `Pulse e2e post ${Date.now()}`;

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill("ada@studio.com");
  await page.locator('input[type="password"]').fill("Lovelace1");
  await page.getByRole("button", { name: /continue to pulse/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe("Pulse — persistent composer", () => {
  test("composed post appears in the feed and survives a reload", async ({
    page,
  }) => {
    await signIn(page);

    // Compose a post.
    await page.getByPlaceholder(/what are you noticing today/i).fill(UNIQUE);
    await page.getByRole("button", { name: /^Post$/ }).click();

    // It appears optimistically at the top of the feed.
    const post = page.getByTestId("user-post").filter({ hasText: UNIQUE });
    await expect(post).toBeVisible();

    // Reload — it persists from localStorage.
    await page.reload();
    await expect(
      page.getByTestId("user-post").filter({ hasText: UNIQUE })
    ).toBeVisible();
  });

  test("a composed post can be deleted", async ({ page }) => {
    await signIn(page);

    const text = `${UNIQUE} delete-me`;
    await page.getByPlaceholder(/what are you noticing today/i).fill(text);
    await page.getByRole("button", { name: /^Post$/ }).click();

    const post = page.getByTestId("user-post").filter({ hasText: text });
    await expect(post).toBeVisible();

    await post.getByRole("button", { name: /delete your post/i }).click();
    await expect(
      page.getByTestId("user-post").filter({ hasText: text })
    ).toHaveCount(0);
  });

  test("empty or whitespace text does not post", async ({ page }) => {
    await signIn(page);
    const postButton = page.getByRole("button", { name: /^Post$/ });
    // Button is disabled with no text.
    await expect(postButton).toBeDisabled();
    // Whitespace only keeps it disabled.
    await page.getByPlaceholder(/what are you noticing today/i).fill("   ");
    await expect(postButton).toBeDisabled();
  });
});
