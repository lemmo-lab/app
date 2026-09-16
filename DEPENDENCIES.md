# App Dependencies & Shared Resources Guide

> **Official reference for monorepo shared assets, peripheral packages, and external integrations for the Lemmo Workspace Studio (`app`).**

---

## 1. Summary of Dependencies & Shared Resources

| Resource / Package | Path / URL | Role & Description | Integration / Consumption in `app` |
| :--- | :--- | :--- | :--- |
| **Icon Package** | [github.com/itstalentnet/synthline](https://github.com/itstalentnet/synthline) | Exclusive official line icon library (`strokeWidth={1.5}`) | `pnpm add synthline` <br> `import { IconSparkles } from 'synthline/react'` |
| **Design Tokens System** | `@lemmo-lab/tokens` <br> `../tokens/` | Dedicated design tokens package with CLI and official **Default Dark Theme** (`#131517`) | `pnpm add @lemmo-lab/tokens` <br> `@import "@lemmo-lab/tokens/css/variables.css"` |
| **Official Fonts** | `../fonts/fonts/` | WOFF2 web fonts (IRANSansX, Morabba, Oddval, Satoshi) | Copied to `public/fonts/` and loaded via `next/font/local` |
| **Reference Docs** | `../docs/` | Single Source of Truth (SSOT) for system architecture and rules | Governed by [DOC-FE-001](../docs/frontend/workspace-architecture.md) & [AGENTS.md](../docs/AGENTS.md) |
| **Landing Project** | `../landing/` | Public marketing showcase website | Visual and brand parity reference |
| **Component Archive (`ui/`)** | `../ui/` | **INACTIVE in current phase** (archive only; to be packaged later) | Zero imports or dependencies allowed |

---

## 2. In-Code Language & Comment Standards (Mandatory)

> 🚨 **STRICT CODING STANDARD: ENGLISH-ONLY IN-CODE COMMENTS & CAPTIONS**  
> - **All code comments, JSDoc/TSDoc annotations, function docstrings, component captions, and commit messages MUST be written strictly in clear, professional English.**
> - Non-English comments (e.g., Persian comments) inside `.ts`, `.tsx`, `.js`, `.css`, or code files are **strictly prohibited**.
> - While UI text displayed to users supports Persian via i18n, the underlying code implementation, variable naming, logic explanation, and engineering notes must remain 100% English.

---

## 3. Font Assets & Typography Rules (`../fonts/fonts/`)

The workspace utilizes 4 designated typefaces:

1. **`iransans/IRANSansXV.woff2` (Persian Body):**
   - Body copy, form labels, tool descriptions, and paragraphs in Persian.
   - Variable weight `100 1000`, exposed via CSS variable `--lemmo-font-sans-fa`.
2. **`morabba/Morabba-*.woff2` (Persian Display):**
   - Display headings, hero text, and primary titles in Persian.
   - Static weights: Regular (400), Medium (500), SemiBold (600), Bold (700).
3. **`oddval/Oddval-SemiBold.woff2` (English Display):**
   - High-impact headings, studio branding, and uppercase badges in Latin script.
   - Fixed weight: SemiBold 600 only.
4. **`satoshi/Satoshi-Variable*.woff2` (English Body & Numerals):**
   - Latin body text, numerical readouts, parameter values, and code snippets.
   - Variable weight 300 to 900.

### Next.js Font Loading Pattern (`src/app/layout.tsx`):
```typescript
import localFont from 'next/font/local';

export const fontIransans = localFont({
  src: '../../../public/fonts/iransans/IRANSansXV.woff2',
  variable: '--lemmo-font-sans-fa',
  display: 'swap',
});

export const fontSatoshi = localFont({
  src: '../../../public/fonts/satoshi/Satoshi-Variable.woff2',
  variable: '--lemmo-font-sans-en',
  display: 'swap',
});
```

---

## 4. Synthline Iconography Standard (`synthline/react`)

```bash
pnpm add synthline
```

### Component Implementation Rules:
- **`strokeWidth={1.5}`**: Mandatory across all icon instances (override default 2).
- **`color="currentColor"`**: Mandatory for automatic theme and text color inheritance.
- **Size Ladder**: Strictly restricted to `--lemmo-size-icon-*` ladder: `12px`, `16px`, `20px`, `24px`, `28px`.

```tsx
import { IconSparkles, IconLayers, IconChevronLeft } from 'synthline/react';

export function StudioButton() {
  return (
    <button className="btn-primary">
      {/* Icon size 20px, stroke width 1.5, currentColor */}
      <IconSparkles size={20} strokeWidth={1.5} color="currentColor" />
      <span>Generate</span>
    </button>
  );
}
```

---

## 5. Design Tokens System: `@lemmo-lab/tokens`

The workspace is styled exclusively using the `@lemmo-lab/tokens` package with the official **Default Dark Theme**:
- **Primary Canvas Background:** `#131517`
- **Elevated Surfaces & Cards:** `#1c1e20` / `#23262a`
- **Brand Accent & Primary Interactive:** Lime `#d1fe17`
- **WCAG Contrast Compliance:** 14.02:1 (AAA)

### Setup in `src/app/globals.css`:
```css
/* Core primitives, spacing scale, radius, and default dark theme variables */
@import "@lemmo-lab/tokens/css/variables.css";

/* Explicit default dark theme */
@import "@lemmo-lab/tokens/css/themes/default.css";
```

Root declaration in `src/app/layout.tsx`:
```html
<html lang="fa" dir="rtl" data-theme="default">
```

---

## 6. Status of Component Archive (`ui/`)

The root `ui/` directory (`lemmoUI`) serves as an inactive component archive. **No files or modules should be imported from `ui/` during the current frontend development phase.** Once components are fully finalized, tested, and published as a package, they will be cleanly integrated via package manager.
