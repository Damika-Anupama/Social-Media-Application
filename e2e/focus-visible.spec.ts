import { test, expect } from "@playwright/test";

/**
 * WCAG 2.4.7 — Focus Visible.
 *
 * Every keyboard-focusable control must show *something* when it has focus.
 * `focus:outline-none` removes the browser's ring, and if nothing replaces it
 * the control is still focusable and completely invisible — a keyboard user
 * tabs into a void and has no idea where they are.
 *
 * Measured rather than eyeballed: focus each control, and require its computed
 * style to actually change. Anything that looks identical focused and unfocused
 * fails, whatever the CSS claims.
 */

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
];

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill("ada@studio.com");
  await page.locator('input[type="password"]').fill("Lovelace1");
  await page.getByRole("button", { name: /continue to pulse/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

/**
 * Controls that look exactly the same focused as unfocused.
 *
 * The properties checked are the ones any focus indicator has to move: an
 * outline, a ring (box-shadow), a border, or a background.
 */
async function invisibleFocus(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const selector =
      'button:not([disabled]), a[href], input:not([type="hidden"]), select, textarea, [tabindex="0"]';
    const bad: string[] = [];

    /** True when a colour is fully transparent, so it shows nothing. */
    const invisible = (color: string) =>
      color === "transparent" || /rgba\([^)]*,\s*0\s*\)$/.test(color);

    /**
     * A *visible* indicator, not merely a changed property.
     *
     * Tailwind's `outline-none` is not "no outline" — it applies a transparent
     * 2px outline. A naive before/after diff sees the outline-style flip from
     * none to solid and calls that an indicator, while the user sees absolutely
     * nothing. Normalising transparent to nothing is the whole point.
     */
    const snapshot = (el: HTMLElement) => {
      const s = getComputedStyle(el);
      const outline =
        s.outlineStyle === "none" || parseFloat(s.outlineWidth) === 0 || invisible(s.outlineColor)
          ? "none"
          : `${s.outlineStyle}:${s.outlineWidth}:${s.outlineColor}`;
      const shadow = s.boxShadow === "none" ? "none" : s.boxShadow;
      return [outline, shadow, s.borderColor, s.borderWidth, s.backgroundColor].join("|");
    };

    const previouslyFocused = document.activeElement as HTMLElement | null;

    for (const el of Array.from(document.querySelectorAll<HTMLElement>(selector))) {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      const style = getComputedStyle(el);
      if (style.visibility === "hidden" || style.display === "none") continue;
      // sr-only controls become visible on focus; that IS their indicator.
      if (el.classList.contains("sr-only")) continue;

      /**
       * The indicator may live on an ancestor: a bare input inside a styled box
       * is perfectly fine if the box lights up via focus-within. So look at the
       * element and its nearest few ancestors together.
       */
      const chain = (start: HTMLElement) => {
        const parts: string[] = [];
        let node: HTMLElement | null = start;
        for (let i = 0; node && i < 3; i++) {
          parts.push(snapshot(node));
          node = node.parentElement;
        }
        return parts.join("//");
      };

      const before = chain(el);
      el.focus();
      const after = chain(el);
      el.blur();

      if (before === after) {
        const label =
          el.getAttribute("aria-label") ??
          el.textContent?.trim().slice(0, 25) ??
          el.className.toString().slice(0, 25);
        bad.push(`${el.tagName.toLowerCase()} "${label}" (${el.className.toString().slice(0, 45)})`);
      }
    }

    previouslyFocused?.focus();
    return Array.from(new Set(bad)).slice(0, 8);
  });
}

test.describe("Pulse — focus visible (WCAG 2.4.7)", () => {
  for (const route of ROUTES) {
    test(`${route} shows focus on every control`, async ({ page }) => {
      if (route.startsWith("/dashboard")) await signIn(page);
      await page.goto(route);
      await page.waitForLoadState("load");
      await page.waitForTimeout(300);

      expect(await invisibleFocus(page)).toEqual([]);
    });
  }
});
