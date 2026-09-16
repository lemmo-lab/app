# AGENTS.md — Lemmo Workspace App (`/app`)

> This project is in the **planning/pre-initialization phase**. No source code exists yet. All docs here define what to build. Read this file before writing any code.

---

## 1. Repo context

This is one package inside the `lemu` monorepo at `/home/behroz/Documents/Git/lemu/`. Sibling packages you need to know:

| Path | Role |
|---|---|
| `../tokens/` | `@lemmo-lab/tokens` — design token source. NEVER edit generated `dist/`. Rebuild with `pnpm build` inside that repo. |
| `../fonts/fonts/` | Local WOFF2 webfonts. Copy into `public/fonts/` and load with `next/font/local`. |
| `../landing/` | Marketing site (Vite + React 19, port 3000). Reference only for brand alignment. |
| `../docs/` | Architecture SSOT. If prose conflicts with config, trust config. |
| `../ui/` | **Inactive.** Do NOT import from it. |

The root `opencode.json` (at `/home/behroz/Documents/Git/lemu/opencode.json`) configures Playwright and Chrome DevTools MCP servers for browser-based tasks.

---

## 2. What to build

**Stack (mandated by BLUEPRINT.md):**
- **Next.js App Router** (not Vite/Pages Router) — React 19.3.0, TypeScript `strict: true`
- **State:** Zustand (`uiStore`, `jobStore`) for client state; `@tanstack/react-query` for server cache
- **Icons:** `synthline/react` **only** — always `strokeWidth={1.5}`, `color="currentColor"`, sizes: `12|16|20|24|28`px
- **Design tokens:** `@lemmo-lab/tokens` — import `@lemmo-lab/tokens/css/variables.css` in `globals.css`
- **Package manager:** `pnpm`

**Root HTML tag convention (non-negotiable):**
```html
<html lang="fa" dir="rtl" data-theme="default">
```
Switch to `lang="en" dir="ltr"` via a client store — never hardcode direction per page.

---

## 3. Architecture rules that differ from defaults

### SDK gateway (Zero-Leakage rule)
All data fetching goes through `@/sdk`. No component, hook, or page may import from a path containing the word `mock`. The SDK picks the adapter via env var:

```typescript
// src/sdk/index.ts
const isLiveMode = process.env.NEXT_PUBLIC_API_MODE === 'live';
export const sdk: SdkClient = isLiveMode ? liveHttpSdkAdapter : mockSdkAdapter;
```

Default dev mode: `NEXT_PUBLIC_API_MODE` is unset → mock adapter. To connect real backend: set `NEXT_PUBLIC_API_MODE=live` in `.env`.

### CSS: use logical properties everywhere
Never use `left`/`right` CSS properties. Always use `margin-inline-start`, `padding-inline-end`, `inset-inline-start`, etc. — required for RTL/LTR flip to work without any CSS changes.

### Dependency direction (one-way, never reversed)
```
app/ → modules/ → tool-engine/ → sdk/ → backend
shared/ has no domain knowledge
stores/ has no module imports
```

---

## 4. Directory layout to initialize

```
src/
├── app/
│   ├── (workspace)/layout.tsx        # Studio shell: sidebar + header + job monitor
│   ├── (workspace)/chat/[[...threadId]]/page.tsx
│   ├── (workspace)/canvas/[[...boardId]]/page.tsx
│   ├── (workspace)/gallery/page.tsx
│   ├── (workspace)/assets/page.tsx
│   ├── (workspace)/settings/billing/page.tsx
│   ├── (auth)/login/page.tsx
│   ├── layout.tsx                    # Root layout: sets <html dir= lang= data-theme=>
│   └── globals.css                   # @import token CSS here
├── modules/
│   ├── tool-engine/
│   │   ├── registry/                 # Manifest loader + cache
│   │   ├── schema-renderer/          # FieldRenderer.tsx + field components
│   │   └── job-manager/              # Zustand jobStore
│   ├── chat/
│   ├── canvas/
│   ├── assets/
│   └── billing/
├── sdk/
│   ├── index.ts                      # Single export: sdk object + adapter switch
│   ├── types.ts                      # SdkClient interface
│   ├── mock/
│   │   ├── mock-adapter.ts
│   │   ├── mock-tools.ts             # 4 tool manifests (flux-dev, remove-bg, upscale, face-swap)
│   │   ├── mock-jobs.ts              # Job lifecycle simulator with timers
│   │   └── mock-user.ts
│   └── interceptors/                 # INSUFFICIENT_TOKENS → redirect /settings/billing
├── shared/
│   ├── ui/
│   │   ├── primitives/               # Button, Input, Slider, Modal, Badge (forwardRef + asChild)
│   │   └── wireframes/               # WireframeBox, WireframePill, etc. (dashed border skeletons)
│   ├── hooks/                        # useDirection, useMediaQuery, useDebounce
│   └── lib/                          # Pure utility functions
└── stores/                           # uiStore, themeStore (Zustand)
```

---

## 5. Milestone order (do not skip)

1. **M1 — Foundation:** Next.js init, token CSS import, 4 local fonts via `next/font/local`, RTL/LTR store, synthline install
2. **M2 — Wireframes:** Geometric skeleton components in `shared/ui/wireframes/` — dashed grey boxes only, no real components yet. Test all 4 breakpoints: 320px / 768px / 1280px / 1920px
3. **M3 — Studio shell:** Replace wireframes with real sidebar, header (`ActiveJobIndicator`, language toggle, token balance), surface switcher
4. **M4 — Mock SDK:** `@/sdk` gateway + `jobStore` with simulated latency (300–800ms) and progress: `Pending → 45% → 100% → inject into assets`
5. **M5 — Tool engine:** Schema-driven `FieldRenderer` mapping manifest field types to form controls
6. **M6 — Chat + Canvas surfaces**
7. **M7 — Assets, Gallery, Billing**
8. **M8 — Integration gate:** All flows validated with mock data
9. **M9 — Flip `NEXT_PUBLIC_API_MODE=live`**

---

## 6. Tool manifest shape (reference for schema-renderer)

```json
{
  "id": "flux-dev",
  "command": "/flux",
  "surfaces": ["chat", "canvas"],
  "inputs": [
    { "name": "prompt", "type": "string", "required": true },
    { "name": "aspect_ratio", "type": "select", "options": ["1:1", "16:9", "9:16"] },
    { "name": "steps", "type": "slider", "min": 20, "max": 50, "default": 28 }
  ],
  "outputs": [{ "name": "generated_image", "type": "image" }],
  "endpoint": "tools.fluxGenerate"
}
```

Field type → component mapping: `string→TextField`, `select→SelectField`, `slider→SliderField`, `image→ImageUploadField`, `boolean→ToggleField`

---

## 7. Typography (fonts to copy from `../fonts/fonts/`)

| File | Language | Usage |
|---|---|---|
| `iransans/IRANSansXV.woff2` | FA | Body text (variable 100–1000) |
| `morabba/Morabba-*.woff2` | FA | Headings (400/500/600/700) |
| `oddval/Oddval-SemiBold.woff2` | EN | Large headings, logotype (600 only) |
| `satoshi/Satoshi-Variable*.woff2` | EN | Body, numbers, code (300–900) |

Load via `next/font/local` in `src/app/layout.tsx` — do NOT use Google Fonts or CDN.

---

## 8. Design token naming rules

- All CSS custom properties: `--lemmo-*` — **the brand is spelled `lemmo` (two m's), never `lemu`**
- Token CSS sourced from `@lemmo-lab/tokens` — never write raw hex values in component CSS
- Default theme: dark (`#131517` canvas background, `#d1fe17` lime accent)

---

## 9. What NOT to do

- Do **not** scaffold with Vite — this project must be **Next.js App Router**
- Do **not** import from `../ui/` (inactive sibling package)
- Do **not** use any icon library other than `synthline/react`
- Do **not** use `left`/`right` in CSS — breaks RTL/LTR support
- Do **not** let any file outside `src/sdk/` import from a path containing `mock`
- Do **not** hard-code API endpoints in components — all calls go through `sdk.*` methods
- Do **not** add raw hex/px values to component CSS — use `--lemmo-*` tokens
