import { test, expect } from "@playwright/test";

/**
 * WCAG 2.5.8 — Target Size (Minimum).
 *
 * Every interactive control must be at least 24x24 CSS px, or be spaced so a
 * 24px circle centred on it hits nothing else. axe does not check this, and I
 * have only ever fixed one tap target by hand, after tripping over it. Nobody
 * has ever measured the rest.
 *
 * This runs on a phone, where a miss actually costs you something.
 */

const MIN = 24;

const ROUTES = [
  "/",
  "/login",
  "/register",
  "/dashboard",
  "/dashboard/explore",
  "/dashboard/notifications",
  "/dashboard/messages",
  "/dashboard/bookmarks",
  "/dashboard/communities",
  "/dashboard/profile",
  "/dashboard/settings",
  "/dashboard/stories",
];

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill("ada@studio.com");
  await page.locator('input[type="password"]').fill("Lovelace1");
  await page.getByRole("button", { name: /continue to pulse/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

/**
 * Controls smaller than 24px in either dimension.
 *
 * Inline links in a paragraph are exempt under 2.5.8 ("inline" exception) — a
 * link inside a sentence cannot be padded without wrecking the text. Everything
 * a thumb is meant to hit is not exempt.
 */
async function undersizedTargets(page: import("@playwright/test").Page) {
  return page.evaluate((min) => {
    const selector = 'button, a[href], input:not([type="hidden"]), select, textarea, [role="switch"], [role="tab"]';
    const bad: string[] = [];

    for (const el of Array.from(document.querySelectorAll<HTMLElement>(selector))) {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue; // not rendered
      const style = getComputedStyle(el);
      if (style.visibility === "hidden" || style.display === "none") continue;

      // The skip link is sr-only until focused — it is not something a thumb
      // can hit, so it is not a tap target. It becomes full-size when focused,
      // which is the only state in which it exists for anyone.
      if (el.classList.contains("sr-only")) continue;

      // The inline exception: a link sitting inside a run of text.
      const isInlineLink =
        el.tagName === "A" && (style.display === "inline" || style.display === "inline-block");
      const parentText = el.parentElement?.textContent?.trim() ?? "";
      const ownText = el.textContent?.trim() ?? "";
      // Surrounding text at all means the link sits in a sentence.
      if (isInlineLink && parentText.length > ownText.length) continue;

      if (rect.width < min || rect.height < min) {
        const label =
          el.getAttribute("aria-label") ??
          el.textContent?.trim().slice(0, 30) ??
          el.className.toString().slice(0, 30);
        bad.push(
          `${el.tagName.toLowerCase()} "${label}" is ${Math.round(rect.width)}x${Math.round(rect.height)}`,
        );
      }
    }
    return Array.from(new Set(bad));
  }, MIN);
}

test.describe("Pulse — tap targets (WCAG 2.5.8)", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  for (const route of ROUTES) {
    test(`${route} has no targets under 24px`, async ({ page }) => {
      if (route.startsWith("/dashboard")) await signIn(page);
      await page.goto(route);
      await page.waitForLoadState("load");
      await page.waitForTimeout(300);

      expect(await undersizedTargets(page)).toEqual([]);
    });
  }
});
