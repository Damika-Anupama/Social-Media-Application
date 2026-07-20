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
  // A CI runner is slower than a laptop, and a starved browser dropping a
  // keystroke looks exactly like a bug. Give it room rather than letting the
  // environment write the test results.
  timeout: process.env.CI ? 60_000 : 30_000,
  expect: { timeout: process.env.CI ? 10_000 : 5_000 },
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
    /**
     * An iPhone. Three engines is not three environments: everything above is a
     * desktop with a mouse. This is a real social app's most common client —
     * touch input, a 390px viewport, mobile Safari's own quirks (dvh, 100vh,
     * tap behaviour) — and nothing had ever run there.
     *
     * Desktop-only suites (keyboard chords, focus traps, reflow sweeps) are
     * excluded: they test things a phone does not have or already cover.
     */
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 13"] },
      testIgnore: [
        /a11y\.spec\.ts/,
        /reflow\.spec\.ts/,
        /focus\.spec\.ts/,
        /shortcuts\.spec\.ts/,
        /command-palette\.spec\.ts/,
        /tabs\.spec\.ts/,
      ],
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
