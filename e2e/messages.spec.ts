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
  // .first(): during hydration the server tree and the client tree can both be
  // in the DOM for a moment, so this briefly matches two identical composers on
  // a slow machine. Only CI was slow enough to land inside that window.
  const composer = page.getByPlaceholder(/^Message /).first();
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

  test("reading a conversation clears its unread everywhere, durably", async ({ page }, testInfo) => {
    // The sidebar badge is lg-only; the point here is the shared store, so
    // assert where the badge exists.
    test.skip(testInfo.project.name === "mobile-safari", "the sidebar does not exist on a phone");
    await signIn(page);

    // Regression: unread chips were cleared in component state — the sidebar
    // badge never moved, and a reload resurrected every chip.
    const badge = page
      .getByRole("navigation")
      .getByRole("link", { name: /messages/i })
      .getByLabel(/\d+ unread/);
    await expect(badge).toHaveText("3");

    // Landing on Messages opens the first thread (nadia, 2 unread) → 1 left.
    await page.goto("/dashboard/messages");
    await expect(badge).toHaveText("1");

    // Opening sasha's thread reads the last one → badge gone.
    await page.getByRole("button", { name: /sasha/i }).first().click();
    await expect(badge).toHaveCount(0);

    // And it stays read across a reload.
    await page.reload();
    await expect(badge).toHaveCount(0);
    await expect(page.getByRole("button", { name: /nadia/i }).first().getByLabel(/unread/)).toHaveCount(0);
  });

  test("desktop shows both panes at once", async ({ page }, testInfo) => {
    // A phone deliberately does not: that is the master/detail split.
    test.skip(testInfo.project.name === "mobile-safari", "phones show one pane");
    await signIn(page);
    await page.goto("/dashboard/messages");

    // No back button, and the composer is available without selecting anything.
    await expect(page.getByPlaceholder(/^Message /).first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: /back to conversations/i })
    ).toBeHidden();
  });
});
