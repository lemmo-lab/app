import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/sdk/live/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/sdk/live/generated*", "**/sdk/live/generated*"],
              message:
                "Direct imports from generated API client outside sdk/live are strictly prohibited (OQ-027, OQ-035).",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/sdk/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/sdk/mock*", "**/sdk/mock*"],
              message: "Direct imports from sdk/mock outside sdk are strictly prohibited.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/modules/**/*.{ts,tsx}", "src/app/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "*mock*",
                "*mockData*",
                "**/*mock*",
                "**/*mockData*",
                "@/*mock*",
                "@/*mockData*",
                "@/sdk/mock*",
                "**/sdk/mock*",
                "@/sdk/live/generated*",
                "**/sdk/live/generated*",
              ],
              message:
                "Importing in-memory mocks, mock files, or internal SDK implementations inside src/modules or src/app is strictly prohibited. All data fetching must route through '@/sdk' (ADR-016).",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
