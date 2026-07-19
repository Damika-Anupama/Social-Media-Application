import { test, expect } from "@playwright/test";

/**
 * E2E for the notifications surface.
 *
 * Covers the read/unread toggle (a real button, not a decorative dot nested
 * inside a link), the undoable "mark all read", and persistence of read state.
 */

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill("ada@studio.com");
  await page.locator('input[type="password"]').fill("Lovelace1");
  await page.getByRole("button", { name: /continue to pulse/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

async function gotoNotifications(page: import("@playwright/test").Page) {
  await signIn(page);
  await page.goto("/dashboard/notifications");
  await expect(page.getByTestId("notification").first()).toBeVisible();
}

test.describe("Pulse — notifications", () => {
  test("mark all read can be undone from the toast", async ({ page }) => {
    await gotoNotifications(page);

    const markAll = page.getByRole("button", { name: /mark all read/i });
    await expect(markAll).toBeEnabled();

    await markAll.click();
    // Everything is read, so the action disables itself.
    await expect(markAll).toBeDisabled();

    // Undo restores exactly what that click marked read.
    await page.getByRole("button", { name: /^undo$/i }).click();
    await expect(markAll).toBeEnabled();
  });

  test("the unread toggle is an independent control, not nested in the row link", async ({
    page,
  }) => {
    await gotoNotifications(page);

    const toggle = page
      .getByRole("button", { name: /^mark ".*" as read$/i })
      .first();
    await expect(toggle).toBeVisible();

    // A comfortable tap target — the old dot was 8x8px.
    const box = await toggle.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(24);
    expect(box!.height).toBeGreaterThanOrEqual(24);

    // Toggling must not navigate, even though the row is a link.
    await toggle.click();
    await expect(page).toHaveURL(/\/dashboard\/notifications/);
    await expect(
      page.getByRole("button", { name: /^mark ".*" as unread$/i }).first()
    ).toBeVisible();
  });

  test("the top bar bell counts unread, and mark-all-read clears it", async ({ page }) => {
    await gotoNotifications(page);

    // The bell, the sidebar, and the page all read the same store.
    await expect(
      page.getByRole("link", { name: /^notifications, \d+ unread$/i })
    ).toBeVisible();

    await page.getByRole("button", { name: /mark all read/i }).click();
    // The bell's label drops the count the moment the store updates — the
    // same-tab sync event, not a reload, is what clears it.
    await expect(page.getByLabel("Notifications", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("link", { name: /^notifications, \d+ unread$/i })
    ).toHaveCount(0);
  });

  test("on a phone, the tab bar carries the unread badge the sidebar can't", async ({ page }) => {
    await signIn(page);

    // Below lg the sidebar — and its badge — does not exist. The tab bar is
    // the navigation there, and it used to say nothing about unread.
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(
      page.getByRole("link", { name: /^inbox, \d+ unread$/i })
    ).toBeVisible();
  });

  test("read state survives a reload", async ({ page }) => {
    await gotoNotifications(page);

    await page.getByRole("button", { name: /mark all read/i }).click();
    await page.reload();

    await expect(page.getByRole("button", { name: /mark all read/i })).toBeDisabled();
  });
});
