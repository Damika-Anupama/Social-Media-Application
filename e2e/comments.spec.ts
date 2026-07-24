import { test, expect } from "@playwright/test";

/**
 * E2E for the reply thread on a post.
 *
 * The last surface in the app where a control looked real and was not: replies
 * were component state (gone on reload), comment likes were the same, and
 * "Reply" on a comment was wired to nothing at all.
 */

const UNIQUE = `A considered reply ${Date.now()}`;

async function gotoPost(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill("ada@studio.com");
  await page.locator('input[type="password"]').fill("Lovelace1");
  await page.getByRole("button", { name: /continue to pulse/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await page.goto("/dashboard/p/p1");
}

test.describe("Pulse — comments", () => {
  test("a reply persists across a reload", async ({ page }) => {
    await gotoPost(page);

    await page.getByLabel("Add a reply").fill(UNIQUE);
    await page.getByRole("button", { name: /^reply$/i }).click();

    await expect(page.getByText(UNIQUE)).toBeVisible();

    // Regression: this was useState, so the reply vanished on reload with
    // nothing to say it had never been saved.
    await page.reload();
    await expect(page.getByText(UNIQUE)).toBeVisible();
  });

  test("your own reply can be deleted", async ({ page }) => {
    await gotoPost(page);

    const body = `Deletable ${Date.now()}`;
    await page.getByLabel("Add a reply").fill(body);
    await page.getByRole("button", { name: /^reply$/i }).click();
    await expect(page.getByText(body)).toBeVisible();

    await page.getByRole("button", { name: /delete your reply/i }).first().click();
    await expect(page.getByText(body)).toBeHidden();

    await page.reload();
    await expect(page.getByText(body)).toBeHidden();
  });

  test("Reply on a comment addresses that person and focuses the composer", async ({
    page,
  }) => {
    await gotoPost(page);

    // Regression: this button had no onClick whatsoever.
    const reply = page.getByRole("button", { name: /^reply to /i }).first();
    const who = (await reply.getAttribute("aria-label"))!.replace(/^Reply to /, "");
    await reply.click();

    const composer = page.getByLabel("Add a reply");
    await expect(composer).toBeFocused();
    await expect(composer).toHaveValue(/^@\w+/);

    // It addresses the person whose Reply you pressed.
    const value = await composer.inputValue();
    expect(who.toLowerCase()).toContain(
      value.trim().replace(/^@/, "").split(" ")[0].toLowerCase().slice(0, 3),
    );
  });

  test("liking a comment persists, and is not shared with its replies", async ({
    page,
  }) => {
    await gotoPost(page);

    // The button renames itself to "Unlike …" once pressed, so hold onto who it
    // belongs to rather than re-resolving a locator that no longer matches.
    const like = page.getByRole("button", { name: /^like .+'s reply$/i }).first();
    const who = (await like.getAttribute("aria-label"))!.replace(/^Like /, "");
    await like.click();

    const unlike = page.getByRole("button", { name: `Unlike ${who}` });
    await expect(unlike).toHaveAttribute("aria-pressed", "true");

    // Nested replies used to be handed the parent's like state, so liking one
    // lit up the other. Exactly one control should be pressed.
    await expect(
      page.getByRole("button", { name: /^unlike .+'s reply$/i }),
    ).toHaveCount(1);

    await page.reload();
    await expect(page.getByRole("button", { name: `Unlike ${who}` })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("an over-long reply is rejected rather than posted", async ({ page }) => {
    await gotoPost(page);

    // The counter counted down past zero and nothing stopped you.
    await page.getByLabel("Add a reply").fill("a".repeat(301));
    await page.getByRole("button", { name: /^reply$/i }).click();

    // Scoped: Next's route announcer is also role="alert".
    await expect(page.locator("#comment-error")).toContainText(/under 300/i);
  });
});
