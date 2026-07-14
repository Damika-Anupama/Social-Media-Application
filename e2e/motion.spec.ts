import { test, expect } from "@playwright/test";

/**
 * Motion preferences and auto-advancing content.
 *
 * CSS already neutralises animations for prefers-reduced-motion. These cover
 * what CSS cannot: JS-driven scrolling, and content that moves on its own.
 */

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill("ada@studio.com");
  await page.locator('input[type="password"]').fill("Lovelace1");
  await page.getByRole("button", { name: /continue to pulse/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe("Pulse — motion", () => {
  test("stories can be paused and resumed from a visible control", async ({
    page,
  }) => {
    await signIn(page);
    await page.goto("/dashboard/stories");

    // Open the first story.
    await page.getByRole("button", { name: /view .+'s story/i }).first().click();

    const pause = page.getByRole("button", { name: /pause stories/i });
    await expect(pause).toBeVisible();

    await pause.click();
    const resume = page.getByRole("button", { name: /resume stories/i });
    await expect(resume).toBeVisible();
    await expect(resume).toHaveAttribute("aria-pressed", "true");

    // Paused means paused: the story does not advance out from under you.
    const before = await page.getByRole("dialog").count();
    await page.waitForTimeout(6000); // longer than the 5s auto-advance
    await expect(resume).toBeVisible();
    expect(await page.getByRole("dialog").count()).toBe(before);

    await resume.click();
    await expect(page.getByRole("button", { name: /pause stories/i })).toBeVisible();
  });

  test("messages scroll instantly when reduced motion is requested", async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await signIn(page);
    await page.goto("/dashboard/messages");

    // The thread still lands on the newest message — it just does not glide.
    // On a phone the thread is a separate screen, so open it first.
    const composer = page.getByPlaceholder(/^Message /).first();
    if (!(await composer.isVisible())) {
      await page.getByRole("button", { name: /nadia/i }).first().click();
      await expect(composer).toBeVisible();
    }
    await composer.fill("reduced motion check");
    await page.getByRole("button", { name: /^send$/i }).click();

    await expect(
      page.getByTestId("chat-message").filter({ hasText: "reduced motion check" })
    ).toBeInViewport();

    await context.close();
  });
});
