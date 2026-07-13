import { test, expect } from "@playwright/test";

/**
 * E2E for communities.
 *
 * Covers membership surviving a reload (it used to be local state) and the
 * "Create community" button, which used to do nothing at all.
 */

const NEW_NAME = `Rust Nerds ${Date.now()}`;

async function gotoCommunities(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill("ada@studio.com");
  await page.locator('input[type="password"]').fill("Lovelace1");
  await page.getByRole("button", { name: /continue to pulse/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await page.goto("/dashboard/communities");
}

test.describe("Pulse — communities", () => {
  test("joining persists across a reload", async ({ page }) => {
    await gotoCommunities(page);

    const join = page.getByRole("button", { name: /^join /i }).first();
    const name = (await join.getAttribute("aria-label"))!.replace(/^Join /, "");

    await join.click();
    await expect(
      page.getByRole("button", { name: `Leave ${name}` })
    ).toBeVisible();

    // Regression: membership was useState and reset to the seed on reload.
    await page.reload();
    await expect(
      page.getByRole("button", { name: `Leave ${name}` })
    ).toBeVisible();
  });

  test("leaving a seeded community sticks", async ({ page }) => {
    await gotoCommunities(page);

    // Seeded-joined rooms must stay left — otherwise the seed re-joins them
    // on every reload.
    const leave = page.getByRole("button", { name: /^leave /i }).first();
    const name = (await leave.getAttribute("aria-label"))!.replace(/^Leave /, "");
    await leave.click();

    await page.reload();
    await expect(page.getByRole("button", { name: `Join ${name}` })).toBeVisible();
  });

  test("create community actually creates one, and it persists", async ({
    page,
  }) => {
    await gotoCommunities(page);

    await page.getByRole("button", { name: /create community/i }).click();
    const dialog = page.getByRole("dialog", { name: /create community/i });
    await expect(dialog).toBeVisible();
    // Focus lands inside the dialog. Not necessarily *on the input*: iOS Safari
    // refuses programmatic focus of a text field outside a user gesture, and
    // fighting that would only force a keyboard up that nobody asked for.
    await expect
      .poll(() => dialog.evaluate((el) => el.contains(document.activeElement)))
      .toBe(true);

    await dialog.getByLabel("Name").fill(NEW_NAME);
    await dialog.getByRole("button", { name: /^create$/i }).click();

    await expect(dialog).toBeHidden();
    // You are a member of the room you opened.
    await expect(
      page.getByRole("button", { name: `Leave ${NEW_NAME}` })
    ).toBeVisible();

    await page.reload();
    await expect(page.getByText(NEW_NAME).first()).toBeVisible();
  });

  test("a blank community name is rejected", async ({ page }) => {
    await gotoCommunities(page);

    await page.getByRole("button", { name: /create community/i }).click();
    const dialog = page.getByRole("dialog", { name: /create community/i });

    await dialog.getByRole("button", { name: /^create$/i }).click();

    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("alert")).toBeVisible();
  });
});
