import { test, expect } from "@playwright/test";

/**
 * WCAG 1.4.12 — Text Spacing.
 *
 * A user may apply their own stylesheet loosening text, and no content may be
 * lost or cut off. The exact values are set by the criterion:
 *
 *   line-height   >= 1.5x font size
 *   spacing after paragraphs >= 2x font size
 *   letter-spacing >= 0.12x font size
 *   word-spacing   >= 0.16x font size
 *
 * Dyslexia and low-vision users really do run these. This app is full of
 * `truncate`, `line-clamp` and fixed heights — precisely the things that clip
 * when text grows — and nothing had ever checked.
 */

const TEXT_SPACING_CSS = `
  * {
    line-height: 1.5 !important;
    letter-spacing: 0.12em !important;
    word-spacing: 0.16em !important;
  }
  p, li, h1, h2, h3, h4 {
    margin-bottom: 2em !important;
  }
`;

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
 * Elements whose text overflows its own box and is therefore unreadable.
 *
 * Deliberate single-line truncation (`truncate`, `line-clamp`) is NOT a
 * failure: the text is shortened by design and the full value is available
 * elsewhere. What fails 1.4.12 is content clipped by a *fixed height* — a box
 * that cannot grow, silently cutting off words the user needs.
 */
async function clippedContent(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const bad: string[] = [];

    for (const el of Array.from(document.body.querySelectorAll<HTMLElement>("*"))) {
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") continue;

      // sr-only IS a clipped 1px box — that is the whole technique. It is not
      // visible content being lost; it is invisible content being hidden.
      if (el.classList.contains("sr-only")) continue;

      // Only boxes that hide their overflow can clip.
      if (style.overflowY !== "hidden") continue;
      // Ellipsis truncation and line clamping are intentional, not clipping.
      // (A scrollable box is fine too, but the overflow-hidden filter above has
      // already excluded those — the content there is reachable by scrolling.)
      if (style.textOverflow === "ellipsis") continue;
      if (style.webkitLineClamp && style.webkitLineClamp !== "none") continue;

      const hasOwnText = Array.from(el.childNodes).some(
        (n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? "").trim().length > 0,
      );
      if (!hasOwnText) continue;

      // 2px of tolerance for sub-pixel rounding.
      if (el.scrollHeight > el.clientHeight + 2) {
        bad.push(
          `${el.tagName.toLowerCase()}.${el.className.toString().slice(0, 40)} clips: ` +
            `${el.scrollHeight}px of text in a ${el.clientHeight}px box — ` +
            `"${(el.textContent ?? "").trim().slice(0, 30)}"`,
        );
      }
    }
    return Array.from(new Set(bad)).slice(0, 6);
  });
}

/** How far the page can be scrolled sideways — loosened text must not force it. */
async function horizontalOverflow(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const el = document.documentElement;
    return el.scrollWidth - el.clientWidth;
  });
}

test.describe("Pulse — text spacing (WCAG 1.4.12)", () => {
  for (const route of ROUTES) {
    test(`${route} loses no content with loosened text`, async ({ page }) => {
      if (route.startsWith("/dashboard")) await signIn(page);
      await page.goto(route);
      await page.addStyleTag({ content: TEXT_SPACING_CSS });
      await page.waitForLoadState("load");
      await page.waitForTimeout(300);

      expect(await clippedContent(page)).toEqual([]);
    });
  }
});

/**
 * The case that actually squeezes: loosened text on the narrowest phone, where
 * every box is already as tight as it gets. Wider letters plus taller lines is
 * exactly the combination that overflows a layout which was only ever checked
 * with default text.
 */
test.describe("Pulse — text spacing on a 320px phone", () => {
  test.use({ viewport: { width: 320, height: 640 } });

  for (const route of ROUTES) {
    test(`${route} survives loosened text at 320px`, async ({ page }) => {
      if (route.startsWith("/dashboard")) await signIn(page);
      await page.goto(route);
      await page.addStyleTag({ content: TEXT_SPACING_CSS });
      await page.waitForLoadState("load");
      await page.waitForTimeout(300);

      expect(await clippedContent(page)).toEqual([]);
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(2);
    });
  }
});
