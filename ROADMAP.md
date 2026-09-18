# Lemmo Workspace Studio Frontend Roadmap

> **Comprehensive Milestone Execution Plan, Front-First Development Strategy & Delivery Gates**  
> **Version:** 1.0.0 — September 2026  
> **Project Directory:** `/home/behroz/Documents/Git/lemu/app`  
> **Core Strategy:** 100% independent frontend execution with zero-leakage mock data, progressing through geometric Figma wireframing to a fully functional interactive studio, unlocking the Integration-Ready Gate (M8) before connecting to live backend endpoints.

---

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                            LEMMO WORKSPACE FRONTEND EXECUTION PHASES                             │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ M1: Foundations, Bilingual i18n (RTL/LTR), and Design Token Integration                          │
│                                           ▼                                                      │
│ M2: Simple Geometric Wireframing (Figma Layout Alignment)                                        │
│                                           ▼                                                      │
│ M3: Design System Primitives & Studio Shell Assembly (Sidebar, Header, Surface Switcher)         │
│                                           ▼                                                      │
│ M4: Central @/sdk Bottleneck & Simulated AI Job Manager (Mock-Driven)                            │
│                                           ▼                                                      │
│ M5: Schema-Driven Tool Rendering Engine (Manifests -> Dynamic Controls)                          │
│                                           ▼                                                      │
│ M6: Dual Parallel Surfaces: Conversational Chat Studio & 2D Graph Canvas                         │
│                                           ▼                                                      │
│ M7: Supporting Feature Modules: Asset Library, Template Gallery & Billing                        │
│                                           ▼                                                      │
│ 🎯 M8: INTEGRATION-READY GATE ──> Fully interactive, usable standalone creative studio             │
│                                           ▼                                                      │
│ M9: Single-Switch Live Backend Connection via LiveAdapter                                         │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Code Comment & In-Code Caption Policy (Strict Standard)

> 🚨 **MANDATORY CODING RULE: ENGLISH-ONLY IN CODE, COMMENTS & CAPTIONS**  
> - **All code comments, JSDoc/TSDoc type annotations, docstrings, variable names, and commit messages MUST be written strictly in clear, professional English.**
> - Non-English comments (such as Persian comments) inside `.ts`, `.tsx`, `.js`, `.css`, or code blocks are **strictly banned**.
> - User-facing UI copy supports both Persian and English via the i18n subsystem, but all underlying engineering artifacts, logic documentation, and codebase comments remain 100% English.

---

## Milestone 1: Foundations, Infrastructure & Brand Setup (Completed)
> **Goal:** Establish a clean Next.js App Router environment aligned with design tokens, bilingual i18n, and strict typography without business logic.  
> **Status:** ✅ Completed

- [x] **Next.js Project Initialization:**
  - Configured with **React 19.3.0**, TypeScript (`strict: true`), and Next.js App Router.
  - Standardized layered structure (`src/app/`, `src/modules/`, `src/sdk/`, `src/shared/`, `src/stores/`).
- [x] **Brand Identity & Design Tokens:**
  - Integrated `@lemmo-lab/tokens` CSS custom properties (`--lemmo-*`).
  - Default Dark Theme enabled (`#131517` primary canvas, Lime `#d1fe17` accent, WCAG AAA 14.02:1).
- [x] **4 Dedicated Font Stacks:**
  - Configured local WOFF2 font loading:
    - Persian: **Morabba** (headings) and **IRANSansX** (body).
    - English: **Oddval 600** (headings) and **Satoshi Variable** (body & numerals).
- [x] **Bilingual Engine & Directionality (i18n & RTL/LTR):**
  - Dynamic `dir="rtl"` / `dir="ltr"` and `lang="fa"` / `lang="en"` on `<html>`.
  - Modern logical CSS properties (`margin-inline`, `padding-inline`, `inset-inline`).
- [x] **Iconography:**
  - Configured official **`synthline/react`** package (`strokeWidth={1.5}`, `currentColor`).

---

## Milestone 2: Geometric Wireframing (Figma Alignment)
> **Goal:** Validate structural geometry, grids, container queries, and responsive hierarchy using simple neutral shape blocks prior to finalized visual styling.  
> **Status:** ⏳ In Progress (Core 'app' Wireframe Frame Complete)

- [x] **Wireframe Primitive Kit (`src/shared/ui/wireframes/`):**
  - Skeleton blocks: `WireframeBox`, `WireframePill`, `WireframeGrid`, `WireframePlaceholder`.
  - Minimal clean neutral geometry conforming to Lemmo design tokens.
- [x] **Figma-Aligned 'app' Surface Wireframe (`/chat`):**
  - Left navigation rail with Lemmo triad mark & tool docks.
  - Top Hero stage banner (`#d9d9d9`).
  - Sub-hero control bar with dual indicators.
  - 4-card rounded horizontal row with underline indicators.
  - Filter & search action rail.
  - 5-column x 2-row uniform card grid (10 items).
  - Right vertical utility rail with 7 docking items.
- [ ] **Remaining Core Surface Wireframes:**
  - Canvas layout: infinite board + sample nodes + right-hand inspector.
  - Asset gallery layout: card grid with standard media aspect ratios (`1:1`, `16:9`).


---

## Milestone 3: Design System Primitives & Studio Shell Assembly
> **Goal:** Replace simple geometric wireframes with interactive, production-ready design system primitives and studio chrome.  
> **Execution Specification:** [`TASK-1-WIREFRAME-TO-PRODUCTION.md`](./TASK-1-WIREFRAME-TO-PRODUCTION.md) (Developer Implementation)  
> **Quality Gate & Sign-Off:** [`TASK-2-TEAM-VALIDATION-AND-AUDIT.md`](./TASK-2-TEAM-VALIDATION-AND-AUDIT.md) (Supervisory Team Audit)

- [ ] **Base Primitives (`src/shared/ui/primitives/`):**
  - Reusable components: `Button`, `Input`, `Textarea`, `Slider`, `Select`, `Modal`, `Tooltip`, `Badge`.
  - Native element attribute inheritance, mandatory `forwardRef`, and Radix `asChild` polymorphism.
- [ ] **Shared Studio Shell (`src/app/(workspace)/layout.tsx`):**
  - **`AppSidebar`**: Collapsible floating navigation rail with mini-rail mode for mobile/tablet.
  - **`StudioHeader`**: Lemmo 3-dot triad, language toggle, live token counter, and `ActiveJobIndicator`.
  - **`SurfaceSwitcher`**: Smooth interactive switcher between Chat (`/chat`) and Canvas (`/canvas`).

---

## Milestone 4: Central SDK Bottleneck & AI Job Simulator (Mock SDK)
> **Goal:** Implement the central network gateway adhering strictly to the Zero-Leakage Mock Rule so all mock data is distributed through a single bottleneck.

- [ ] **Central `@/sdk` Gateway (`src/sdk/index.ts`):**
  - Strict `interface SdkClient` contract.
  - Single-switch toggle via `process.env.NEXT_PUBLIC_API_MODE`.
  - Ban on external imports from `src/sdk/mock/`.
- [ ] **Mock Adapter Implementation (`src/sdk/mock/`):**
  - Simulated latency (300ms to 800ms) for skeleton states.
  - Mocked endpoints:
    - `sdk.tools.list()`: returns tool manifests.
    - `sdk.tools.execute(toolId, inputs)`: returns immediate `jobId`.
    - `sdk.chat.sendMessage()`, `sdk.chat.getThreads()`.
    - `sdk.assets.list()`, `sdk.billing.getBalance()`.
- [ ] **Simulated Real-time AI Job Manager:**
  - Global `jobStore` with Zustand.
  - Realistic lifecycle timer:  
    $$\text{Pending } (0\%) \longrightarrow \text{Processing } (45\%) \longrightarrow \text{Done } (100\%)$$
  - Auto-injects completed media into user assets upon 100% completion.
- [ ] **Token Exhaustion Interceptor:**
  - Simulates `INSUFFICIENT_TOKENS` error and redirects to `/settings/billing`.

---

## Milestone 5: Schema-Driven Tool Rendering Engine
> **Goal:** Enable dynamic generation of model parameter forms and node bodies from standard JSON manifests without hardcoded form components.

- [ ] **Manifest Registry (`src/modules/tool-engine/registry/`):**
  - Manifest loader, caching, schema validation.
- [ ] **Dynamic Field Renderer (`src/modules/tool-engine/schema-renderer/`):**
  - Core `FieldRenderer.tsx` dispatcher.
  - Field controls: `TextField`, `ImageUploadField`, `SliderField`, `SelectField`, `ToggleField`.
- [ ] **Standard Mock Tool Manifests:**
  - `flux-dev`: Text-to-image with multi-field prompt, aspect ratio, steps.
  - `remove-background`: Single-image input with transparent PNG output.
  - `upscale-ultra`: Image input with 2x/4x resolution multiplier.
  - `face-swap`: Dual-image input with input validation.

---

## Milestone 6: Dual Parallel Surfaces (Chat & Canvas)
> **Goal:** Bring both creative interaction spaces to life, consuming the shared tool engine.

### 6.1. Conversational Chat Studio (`modules/chat` & `app/(workspace)/chat`)
- [ ] **`ChatWindow`**: Auto-scrolling feed, bidirectional message bubbles, history.
- [ ] **`CommandAutocomplete`**: Triggers on `/` input to offer active tools (`/flux`, `/remove-bg`).
- [ ] **Inline Tool Form**: Expands dynamically via `schema-renderer` directly within chat bubbles.
- [ ] **Job Progress Bubbles**: Displays percentage completion and renders final output upon completion.

### 6.2. Visual Graph Canvas (`modules/canvas` & `app/(workspace)/canvas`)
- [ ] **`CanvasBoard`**: 2D infinite graph board with Pan & Zoom and background grid.
- [ ] **Dynamic `ToolNode`**: Schema-rendered node bodies with colored sockets by data type.
- [ ] **Wire Connections (`typedConnection`):** Strict socket validation (`image` to `image`, `mask` to `mask`).
- [ ] **`NodeDiscoveryMenu`**: Right-click menu or toolbar to spawn new nodes onto the board.

---

## Milestone 7: Supporting Feature Modules (Assets, Gallery & Billing)
> **Goal:** Complete the full creative lifecycle: asset archiving, community templates, and token purchasing.

- [ ] **Asset Library (`modules/assets` & `/assets`):**
  - Responsive media grid with image/video filters.
  - Preview modal, download action, and "Send to Canvas" / "Send to Chat" actions.
- [ ] **Public Showcase & Gallery (`modules/gallery` & `/gallery`):**
  - Community prompt inspirations with "Remix in Studio" action.
- [ ] **Billing & Tokens (`modules/billing` & `/settings/billing`):**
  - Tier cards, token top-up packs, usage history.
  - Simulated token exhaustion toggle for end-to-end testing.

---

## 🎯 Milestone 8: INTEGRATION-READY GATE (Strategic Delivery Gate)
> **Strategic Checkpoint:** The frontend studio is **100% interactive, clickable, testable, and completely usable without a live backend.** Creators can log in, run tools, watch progress bars, save outputs to assets, and toggle language.

### Integration-Ready Verification Checklist:
- [ ] **End-to-End Functional Usability:**
  - Zero console errors during complete generation flows in Chat.
  - Zero errors when creating, wiring, and executing nodes in Canvas.
- [ ] **Responsive Audit:**
  - Verified across Mobile, Tablet, Desktop, and Wide screens without horizontal overflow.
- [ ] **Bilingual & RTL Audit:**
  - Flawless runtime switching between Persian and English without page reload or visual breaks.
- [ ] **Zero-Leakage Compliance Audit:**
  - Source search: Zero imports from `mock/` across `src/app/`, `src/modules/`, and `src/shared/`.
- [ ] **Backend Contract Handover:**
  - Precise API specification for all functions exposed in `src/sdk/types.ts` handed to backend engineers.

---

## Milestone 9: Single-Switch Live Backend Integration
> **Goal:** Connect the finalized frontend to the real backend without modifying a single UI component.

- [ ] Implement live network calls in `src/sdk/live/live-adapter.ts` using typed Fetch or generated OpenAPI/tRPC clients.
- [ ] Connect real WebSocket / SSE streams to `jobStore`.
- [ ] Toggle environment variable in `.env`:
  ```bash
  NEXT_PUBLIC_API_MODE="live"
  NEXT_PUBLIC_API_BASE_URL="https://api.lemmo.ai"
  ```
- [ ] Validate end-to-end live execution with zero frontend component modifications!
