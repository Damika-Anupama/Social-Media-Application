import { test, expect } from "@playwright/test";

/**
 * The WAI-ARIA tabs keyboard contract.
 *
 * Four surfaces declared role="tablist" and implemented none of the behaviour
 * it promises: arrows did nothing, and every tab was its own Tab stop. These
 * fail against that.
 */

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill("ada@studio.com");
  await page.locator('input[type="password"]').fill("Lovelace1");
  await page.getByRole("button", { name: /continue to pulse/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe("Pulse — tabs keyboard support", () => {
  test("arrow keys move between notification filters, and wrap", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/notifications");

    const all = page.getByRole("tab", { name: "All" });
    const mentions = page.getByRole("tab", { name: "Mentions" });
    const follows = page.getByRole("tab", { name: "Follows" });

    await all.focus();
    await expect(all).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("ArrowRight");
    await expect(mentions).toHaveAttribute("aria-selected", "true");
    await expect(mentions).toBeFocused();

    // Left off the first wraps to the last.
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await expect(follows).toHaveAttribute("aria-selected", "true");

    // Home and End jump to the ends.
    await page.keyboard.press("Home");
    await expect(all).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("End");
    await expect(follows).toHaveAttribute("aria-selected", "true");
  });

  test("only the selected tab is in the page tab order", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/notifications");

    // Roving tabindex: the strip is one Tab stop, not five.
    await expect(page.getByRole("tab", { name: "All" })).toHaveAttribute("tabindex", "0");
    await expect(page.getByRole("tab", { name: "Mentions" })).toHaveAttribute(
      "tabindex",
      "-1"
    );

    await page.getByRole("tab", { name: "Mentions" }).click();
    await expect(page.getByRole("tab", { name: "Mentions" })).toHaveAttribute("tabindex", "0");
    await expect(page.getByRole("tab", { name: "All" })).toHaveAttribute("tabindex", "-1");
  });

  test("the settings strip is vertical, so it arrows with Up/Down", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/settings");

    const account = page.getByRole("tab", { name: /account/i });
    const notifications = page.getByRole("tab", { name: /notifications/i });

    await account.focus();
    await page.keyboard.press("ArrowDown");
    await expect(notifications).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("heading", { name: "Notifications" })).toBeVisible();

    // Left/Right are not this strip's axis and must not hijack them.
    await page.keyboard.press("ArrowRight");
    await expect(notifications).toHaveAttribute("aria-selected", "true");
  });

  test("the home feed switcher is a tablist, and arrows change the feed", async ({ page }) => {
    await signIn(page);

    // Regression: the feed switcher was four independent buttons — no
    // aria-selected, five Tab stops, and nothing announced which feed you
    // were reading. It also meant a button named "Following" sat on the
    // dashboard, shadowing the right-rail follow buttons in tests.
    const forYou = page.getByRole("tab", { name: "For you" });
    const following = page.getByRole("tab", { name: "Following" });

    await expect(forYou).toHaveAttribute("aria-selected", "true");
    await expect(following).toHaveAttribute("tabindex", "-1");

    await forYou.focus();
    await page.keyboard.press("ArrowRight");
    await expect(following).toHaveAttribute("aria-selected", "true");
    await expect(following).toBeFocused();
  });

  test("profile tabs arrow horizontally", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/profile");

    await page.getByRole("tab", { name: "Posts" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { name: "Replies" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });
});
