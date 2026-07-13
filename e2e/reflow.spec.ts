import { test, expect } from "@playwright/test";

/**
 * WCAG 1.4.10 (Reflow) and 1.4.4 (Resize Text).
 *
 * axe cannot check either of these — they are about layout under pressure, not
 * about markup. 1.4.10 says content must work at 320px CSS width without
 * horizontal scrolling; 1.4.4 says text must survive being scaled up. The app
 * ships a "larger type" setting that scales the root font and, until now, was
 * never exercised by anything.
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
  "/dashboard/stories",
];

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill("ada@studio.com");
  await page.locator('input[type="password"]').fill("Lovelace1");
  await page.getByRole("button", { name: /continue to pulse/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

/** Turn on the app's own "larger type" preference before it boots. */
async function useLargerType(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "pulse.preferences.v1",
      JSON.stringify({ theme: "dark", reduceMotion: false, largerType: true }),
    );
  });
}

/**
 * How far the page can be scrolled sideways. Anything above a rounding wobble
 * means content is off-screen: on a 320px phone, part of the app is simply
 * unreachable.
 */
async function horizontalOverflow(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const el = document.documentElement;
    return el.scrollWidth - el.clientWidth;
  });
}

/** Elements poking out past the right edge — the usual cause of the above. */
async function offscreenElements(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const bad: string[] = [];
    for (const el of Array.from(document.body.querySelectorAll<HTMLElement>("*"))) {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      // 2px of tolerance for sub-pixel layout.
      if (rect.right > width + 2) {
        const style = getComputedStyle(el);
        // A horizontally scrollable strip (the chip rails) is allowed to be
        // wider than the viewport — that is a deliberate, reachable scroller.
        if (style.overflowX === "auto" || style.overflowX === "scroll") continue;
        let parent = el.parentElement;
        let insideScroller = false;
        while (parent) {
          const ps = getComputedStyle(parent);
          if (ps.overflowX === "auto" || ps.overflowX === "scroll") {
            insideScroller = true;
            break;
          }
          parent = parent.parentElement;
        }
        if (insideScroller) continue;
        bad.push(`${el.tagName.toLowerCase()}.${el.className?.toString().slice(0, 60)}`);
      }
    }
    return bad.slice(0, 5);
  });
}

test.describe("Pulse — reflow at 320px (WCAG 1.4.10)", () => {
  test.use({ viewport: { width: 320, height: 640 } });

  for (const route of ROUTES) {
    test(`${route} does not scroll sideways at 320px`, async ({ page }) => {
      if (route.startsWith("/dashboard")) await signIn(page);
      await page.goto(route);
      await page.waitForLoadState("load");
      await page.waitForTimeout(300);

      expect(
        await offscreenElements(page),
        "elements extend past the right edge",
      ).toEqual([]);
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(2);
    });
  }
});

/**
 * The harshest case, and the one that earns its keep: narrowest viewport AND
 * scaled-up text at once.
 *
 * Settings passed at 320px on my machine and failed on CI, because Linux
 * renders the font wider than macOS and a row like "Indian Standard Time
 * (UTC+05:30)" tipped over the edge. Layout that only survives on one
 * platform's font metrics is not layout that survives. Larger type widens
 * text further than that difference ever could, so this catches the whole
 * class locally instead of at the end of a CI run.
 */
test.describe("Pulse — 320px with larger type", () => {
  test.use({ viewport: { width: 320, height: 640 } });

  for (const route of ROUTES) {
    test(`${route} survives 320px + larger type`, async ({ page }) => {
      await useLargerType(page);
      if (route.startsWith("/dashboard")) await signIn(page);
      await page.goto(route);
      await page.waitForLoadState("load");
      await page.waitForTimeout(300);

      expect(await offscreenElements(page)).toEqual([]);
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(2);
    });
  }
});

test.describe("Pulse — larger type (WCAG 1.4.4)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const route of ROUTES) {
    test(`${route} survives larger type on a phone`, async ({ page }) => {
      await useLargerType(page);
      if (route.startsWith("/dashboard")) await signIn(page);
      await page.goto(route);
      await expect(page.locator("html")).toHaveClass(/text-larger/);
      await page.waitForLoadState("load");
      await page.waitForTimeout(300);

      expect(
        await offscreenElements(page),
        "elements extend past the right edge with larger type",
      ).toEqual([]);
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(2);
    });
  }
});
