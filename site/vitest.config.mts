import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const COVERAGE_THRESHOLDS = {
  lib: 95,
  components: 85,
} as const;

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next", "tests/e2e/**"],
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      include: ["lib/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
      // These only wrap tested code in Next's "use cache"; the e2e suite exercises them.
      exclude: ["**/*.test.{ts,tsx}", "**/test-utils/**", "lib/skills/data.ts", "components/cached-readme.tsx"],
      reporter: ["text", "html", "json-summary"],
      thresholds: {
        "lib/**": {
          statements: COVERAGE_THRESHOLDS.lib,
          branches: COVERAGE_THRESHOLDS.lib,
          functions: COVERAGE_THRESHOLDS.lib,
          lines: COVERAGE_THRESHOLDS.lib,
        },
        "components/**": {
          statements: COVERAGE_THRESHOLDS.components,
          branches: COVERAGE_THRESHOLDS.components,
          functions: COVERAGE_THRESHOLDS.components,
          lines: COVERAGE_THRESHOLDS.components,
        },
      },
    },
  },
});
