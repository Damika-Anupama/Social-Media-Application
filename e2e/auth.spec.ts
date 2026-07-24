import { test, expect } from "@playwright/test";

/**
 * End-to-end coverage for the Pulse social-media demo.
 *
 * Covers the public marketing + auth surface and the client-side "sign in"
 * flow that redirects into the dashboard. All data is mocked, so these run
 * without a backend and stay valid against the Vercel preview.
 */

test.describe("Pulse — landing & auth", () => {
  test("landing page renders the hero and primary CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /respects your time/i })
    ).toBeVisible();
    // Header "Sign in" and hero "Get started" both link to /login.
    await expect(page.getByRole("link", { name: /sign in/i }).first()).toBeVisible();
    await expect(
      page.getByRole("link", { name: /get started/i }).first()
    ).toBeVisible();
    // "Create an account" links to /register.
    await expect(
      page.getByRole("link", { name: /create an account/i }).first()
    ).toBeVisible();
  });

  test("login rejects an invalid email and weak password", async ({ page }) => {
    await page.goto("/login");

    await page.getByRole("button", { name: /continue to pulse/i }).click();
    // Empty submit surfaces required-field validation.
    await expect(page.getByText(/email is required|enter a valid email/i)).toBeVisible();

    await page.locator('input[type="email"]').fill("not-an-email");
    await page.locator('input[type="password"]').fill("weak");
    await page.getByRole("button", { name: /continue to pulse/i }).click();
    await expect(page.getByText(/enter a valid email address/i)).toBeVisible();
    await expect(
      page.getByText(/password must be at least 8 characters|include at least one/i)
    ).toBeVisible();
  });

  test("valid credentials sign in and redirect to the dashboard", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill("ada@studio.com");
    await page.locator('input[type="password"]').fill("Lovelace1");
    await page.getByRole("button", { name: /continue to pulse/i }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    // The dashboard composer / feed tabs confirm we landed inside the app.
    await expect(page.getByText(/For you/i).first()).toBeVisible();
  });

  test("register page renders the sign-up form", async ({ page }) => {
    await page.goto("/register");
    await expect(
      page.getByRole("button", { name: /create my pulse/i })
    ).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});
