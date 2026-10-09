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
    ignores: ["src/**/__tests__/**", "src/**/*.test.ts", "src/**/*.test.tsx"],
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
                "**/mock-adapter*",
                "**/mock-data*",
              ],
              message:
                "Client-side mock adapters or simulated data paths are strictly forbidden by ADR-016. All requests must route through standard network transport via Kong to live services or backend Prism containers.",
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
                "@/sdk/live/generated*",
                "**/sdk/live/generated*",
                "**/data/*",
                "**/data/**",
                "*Data*",
              ],
              message:
                "Importing module data files or internal SDK implementations inside src/modules or src/app is strictly prohibited. All runtime entity data must flow through '@/sdk' (ADR-016, DOC-FE-002).",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
