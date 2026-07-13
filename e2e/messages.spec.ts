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

test.describe("Pulse — messages", () => {
  test("a sent message persists across a reload", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/messages");

    const composer = page.getByPlaceholder(/^Message /);
    await composer.fill(UNIQUE);
    await page.getByRole("button", { name: /^send$/i }).click();

    // Appears immediately in the thread.
    const mine = page.getByTestId("chat-message").filter({ hasText: UNIQUE });
    await expect(mine).toBeVisible();

    // The other side replies, so the thread grows on its own.
    await expect(page.getByTestId("typing-indicator")).toBeVisible();
    await expect(page.getByTestId("typing-indicator")).toBeHidden({ timeout: 10_000 });

    // Reload — the conversation is restored from storage, not reset to the seed.
    await page.reload();
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

  test("desktop shows both panes at once", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/messages");

    // No back button, and the composer is available without selecting anything.
    await expect(page.getByPlaceholder(/^Message /)).toBeVisible();
    await expect(
      page.getByRole("button", { name: /back to conversations/i })
    ).toBeHidden();
  });
});
