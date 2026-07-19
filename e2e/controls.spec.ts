import { test, expect } from "@playwright/test";

/**
 * Every control does something.
 *
 * Twenty buttons in this app had no handler at all. These cover the ones that
 * should genuinely work — and the ones that are deliberately out of scope,
 * which now say so instead of silently doing nothing.
 */

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill("ada@studio.com");
  await page.locator('input[type="password"]').fill("Lovelace1");
  await page.getByRole("button", { name: /continue to pulse/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe("Pulse — controls that do something", () => {
  test("Follow on a post page follows, and it persists", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/p/p1");

    // Regression: this button had no onClick whatsoever.
    const follow = page.getByRole("button", { name: /^follow @/i });
    const who = (await follow.getAttribute("aria-label"))!.replace(/^Follow /, "");
    await follow.click();

    await expect(page.getByRole("button", { name: `Unfollow ${who}` })).toBeVisible();

    await page.reload();
    await expect(page.getByRole("button", { name: `Unfollow ${who}` })).toBeVisible();
  });

  test("Join on a community page joins, and it persists", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/c/slow-web");

    // Regression: the button said "Following" whether you were or not, and
    // clicking it did nothing.
    const join = page.getByRole("button", { name: /^(join|leave) /i }).first();
    const before = (await join.getAttribute("aria-pressed")) === "true";
    await join.click();

    const after = page.getByRole("button", { name: /^(join|leave) /i }).first();
    await expect(after).toHaveAttribute("aria-pressed", String(!before));

    await page.reload();
    await expect(
      page.getByRole("button", { name: /^(join|leave) /i }).first(),
    ).toHaveAttribute("aria-pressed", String(!before));
  });

  test("out-of-scope controls say so instead of doing nothing", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/messages");

    // On a phone the thread (and its call buttons) is a separate screen.
    const call = page.getByLabel("Call", { exact: true });
    if (!(await call.isVisible())) {
      await page.getByRole("button", { name: /nadia/i }).first().click();
    }

    await page.getByLabel("Call", { exact: true }).click();
    await expect(page.getByText(/voice calls aren't part of this demo/i)).toBeVisible();
  });

  test("the post menu explains itself rather than staying silent", async ({ page }) => {
    await signIn(page);

    await page
      .getByRole("button", { name: /more options for this post/i })
      .first()
      .click();

    await expect(page.getByText(/post menu isn't part of this demo/i)).toBeVisible();
  });
});

test.describe("Pulse — controls that only looked like they worked", () => {
  test("Explore chips actually filter, not just highlight", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/explore");

    // Wait for hydration before counting: the chips are server-rendered, so a
    // count taken too early is a count of the pre-interactive page.
    await expect(
      page.getByRole("button", { name: "For you", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");

    const trends = page.locator('a[href*="/dashboard/explore?q="]');
    const before = await trends.count();
    expect(before).toBeGreaterThan(1);

    // Regression: clicking a chip moved the highlight and filtered nothing.
    await page.getByRole("button", { name: "Design", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Design", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");

    await expect.poll(() => trends.count()).toBeLessThan(before);

    // "For you" restores everything.
    await page.getByRole("button", { name: "For you", exact: true }).click();
    await expect.poll(() => trends.count()).toBe(before);
  });

  test("Comment on a post card opens that post's reply thread", async ({ page }) => {
    await signIn(page);

    // Regression: ReactionButton renders onClick={onClick} whether or not a
    // handler was passed, so the dead-controls guard was satisfied while the
    // Comment button did nothing at all.
    await page.getByRole("button", { name: "Comment", exact: true }).first().click();

    await expect(page).toHaveURL(/\/dashboard\/p\/[^/]+#replies$/);
    await expect(page.getByRole("heading", { name: /replies|reply/i })).toBeVisible();
  });

  test("typing a story reply types spaces — and holds the story still", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/stories");
    await page.getByRole("button", { name: /view .+'s story/i }).first().click();

    const reply = page.getByLabel(/^reply to /i);
    const placeholder = await reply.getAttribute("placeholder");

    // Regression: the viewer's global key handler ate keys typed into the
    // reply box — Space toggled pause instead of typing a space, and arrows
    // switched stories out from under the caret.
    await reply.click();
    await reply.pressSequentially("Loved it a lot");
    await expect(reply).toHaveValue("Loved it a lot");

    // And the story must not advance underneath a half-typed reply: past the
    // 5s auto-advance window, it is still the same story.
    await page.waitForTimeout(5600);
    await expect(reply).toHaveAttribute("placeholder", placeholder!);
    await expect(reply).toHaveValue("Loved it a lot");
  });

  test("a story reply is sent as a message, not swallowed", async ({ page }) => {
    await signIn(page);
    await page.goto("/dashboard/stories");
    await page.getByRole("button", { name: /view .+'s story/i }).first().click();

    const unique = `Loved this ${Date.now()}`;
    const reply = page.getByLabel(/^reply to /i);
    await reply.fill(unique);

    // Regression: submit called preventDefault and stopped. Whatever you typed
    // went nowhere at all.
    await page.getByRole("button", { name: "Send reply" }).click();
    await expect(page.getByText(/find it in messages/i)).toBeVisible();

    // And it really is in Messages.
    await page.goto("/dashboard/messages");
    const composer = page.getByPlaceholder(/^Message /).first();
    if (!(await composer.isVisible())) {
      await page.getByRole("button", { name: /nadia/i }).first().click();
    }
    await expect(
      page.getByTestId("chat-message").filter({ hasText: unique }),
    ).toBeVisible();
  });
});
