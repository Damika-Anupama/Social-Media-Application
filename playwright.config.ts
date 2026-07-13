import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E configuration for the Pulse social-media demo.
 *
 * The app is a frontend-only Next.js demo (mocked data, client-side auth), so
 * the suite is fully self-contained and also valid against the Vercel preview.
 * Set E2E_BASE_URL to run against a deployed preview instead of a local server.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  // Three engines over ~130 tests will saturate a laptop, and a starved browser
  // misses a keystroke and looks exactly like a bug. Cap it so a red result
  // means something.
  workers: process.env.CI ? 1 : 4,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  /**
   * Everything ran in Chromium only. WebKit is Safari — every iPhone in the
   * world, and a rendering engine with genuinely different behaviour, not a
   * skin. Firefox is the third engine. A guarantee proven in one engine is a
   * guarantee about one engine.
   *
   * The axe/reflow sweeps are heavy, so the cross-browser projects run the
   * behavioural suites — the ones where an engine difference actually bites.
   */
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      testIgnore: /a11y\.spec\.ts/,
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      testIgnore: /a11y\.spec\.ts/,
    },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "npm run start",
        url: "http://localhost:3000",
        timeout: 120_000,
        reuseExistingServer: !process.env.CI,
      },
});
