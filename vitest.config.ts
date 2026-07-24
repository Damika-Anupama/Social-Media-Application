import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * Vitest config for fast unit tests of pure logic (e.g. form validation).
 * Uses tsconfig path aliases (@/…) so tests import the same modules the app does.
 */
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
    globals: true,
  },
});
