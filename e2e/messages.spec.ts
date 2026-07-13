import { test, expect } from "@playwright/test";

/**
 * E2E for the direct-messages surface.
 *
 * Covers persistence of sent messages across a reload and the mobile
 * master/detail flow, where the conversation list and the thread are separate
 * screens rather than a squashed two-column grid.
 */

const UNIQUE = `Pulse e2e message ${Date.now()}`;

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill("ada@studio.com");
  await page.locator('input[type="password"]').fill("Lovelace1");
  await page.getByRole("button", { name: /continue to pulse/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}


/**
 * On a phone the list and the thread are separate screens (by design), so the
 * composer does not exist until a conversation is open. Desktop shows both.
 */
async function openThread(page: import("@playwright/test").Page) {
  const composer = page.getByPlaceholder(/^Message /);
  if (!(await composer.isVisible())) {
    await page.getByRole("button", { name: /nadia/i }).first().click();
    await expect(composer).toBeVisible();
  }
  return composer;
}

test.describe("Pulse — messages", () => {
  test("a sent message persists across a reload", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/messages");

    const composer = await openThread(page);
    await composer.fill(UNIQUE);
    await page.getByRole("button", { name: /^send$/i }).click();

    // Appears immediately in the thread.
    const mine = page.getByTestId("chat-message").filter({ hasText: UNIQUE });
    await expect(mine).toBeVisible();

    // The other side replies, so the thread grows on its own.
    await expect(page.getByTestId("typing-indicator")).toBeVisible();
    await expect(page.getByTestId("typing-indicator")).toBeHidden({ timeout: 10_000 });

    // Reload — the conversation is restored from storage, not reset to the seed.
    // A reload on a phone lands back on the list, so re-open the thread: that is
    // the master/detail split doing its job, not the message being lost.
    await page.reload();
    await openThread(page);
    await expect(
      page.getByTestId("chat-message").filter({ hasText: UNIQUE })
    ).toBeVisible();
  });

  test("mobile shows the list and thread as separate screens", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await signIn(page);
    await page.goto("/dashboard/messages");

    // The thread pane (and its composer) is not on screen until a chat is picked.
    const composer = page.getByPlaceholder(/^Message /);
    await expect(composer).toBeHidden();

    // Opening a conversation swaps the list out for the thread.
    await page.getByRole("button", { name: /nadia/i }).first().click();
    await expect(composer).toBeVisible();

    // Back returns to the list.
    const back = page.getByRole("button", { name: /back to conversations/i });
    await expect(back).toBeVisible();
    await back.click();
    await expect(composer).toBeHidden();
  });

  test("desktop shows both panes at once", async ({ page }, testInfo) => {
    // A phone deliberately does not: that is the master/detail split.
    test.skip(testInfo.project.name === "mobile-safari", "phones show one pane");
    await signIn(page);
    await page.goto("/dashboard/messages");

    // No back button, and the composer is available without selecting anything.
    await expect(page.getByPlaceholder(/^Message /)).toBeVisible();
    await expect(
      page.getByRole("button", { name: /back to conversations/i })
    ).toBeHidden();
  });
});
