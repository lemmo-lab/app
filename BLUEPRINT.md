# Lemmo Workspace Studio Frontend Blueprint

> **Executive Blueprint, Front-First Development Strategy & Engineering Standards**  
> **Version:** 1.0.0 — September 2026  
> **Target Project:** `/home/behroz/Documents/Git/lemu/app`  
> **Core Methodology:** Standalone Front-First development powered by Zero-Leakage Mock data, geometric Figma wireframing with simple shapes, and single-switch live backend migration.

---

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                       FRONT-FIRST STUDIO DEVELOPMENT LIFECYCLE                    │
├───────────────────────────────────────────────────────────────────────────────────┤
│ 1. Foundations (Next.js App Router + Bilingual RTL/LTR + Lemmo Tokens)            │
│                                    ▼                                              │
│ 2. Geometric Wireframing (Simple Shapes aligned with Figma Layouts)               │
│                                    ▼                                              │
│ 3. Design System & Studio Shell Assembly (Sidebar, Header, Surface Switcher)      │
│                                    ▼                                              │
│ 4. Schema-Driven Tool Rendering Engine (Manifests -> Dynamic Controls)           │
│                                    ▼                                              │
│ 5. Full Simulation of AI Job Lifecycles via Zero-Leakage Mock SDK                 │
│                                    ▼                                              │
│ 6. End-to-End Usability, Responsiveness & Accessibility Testing                   │
│                                    ▼                                              │
│ 7. Integration-Ready Handover: Single-switch connection to live backend           │
└───────────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Technical Foundations & Initialization

### 1.1. Core Tech Stack
- **Framework:** **Next.js (App Router)** matching UI standard (`React 19.3.0` & `React-DOM 19.3.0`).
- **Language:** TypeScript with strict enforcement (`strict: true`).
- **State Management:**
  - **Client & Real-time State:** `Zustand` (isolated stores: `uiStore`, `jobStore`).
  - **Server Data Caching:** `@tanstack/react-query`.
- **Iconography:** Exclusive official **`synthline/react`** library (uniform `strokeWidth={1.5}`, dynamic `currentColor`).

### 1.2. In-Code Language & Comment Standards (Strict Policy)
> 🚨 **MANDATORY CODING RULE: ENGLISH-ONLY IN CODE, COMMENTS & CAPTIONS**  
> - **All in-code comments, JSDoc/TSDoc type annotations, docstrings, variable names, and commit messages MUST be written strictly in clear, professional English.**
> - Non-English comments (e.g. Persian script) inside `.ts`, `.tsx`, `.js`, `.css`, or code blocks are **strictly banned**.
> - While the user-facing UI supports Persian via i18n, the underlying code implementation, architectural rationale, and engineering comments must remain 100% English.

### 1.3. Bilingual i18n & Logical CSS Directionality
- **Bilingual Support:** Persian (FA) and English (EN).
- **Design System Directionality & Layout Guidelines ([DOC-DS-005](../docs/design-system/interaction-and-layout.md)):** Strict adherence to the 24 interaction & layout principles: define relationships not coordinates (`Start / End`, `Leading / Trailing`), directional vs non-directional icon mirroring, semantic action hierarchy, and dropdown adaptive positioning.
- **Logical CSS Properties:** Modern logical CSS declarations (e.g., `margin-inline-start`, `padding-inline-end`, `inset-inline-start`) are enforced across all components, enabling seamless RTL/LTR layout mirroring without maintaining parallel stylesheets.
- Root layout dynamically reflects language and direction: `<html lang="fa" dir="rtl" data-theme="default">`.

### 1.4. Design Tokens & Official Dark Theme
All visual styles strictly consume the `@lemmo-lab/tokens` package:
- **Default Dark Theme:** Primary canvas `#131517`, elevated cards `#1c1e20` / `#23262a`, primary interactive accent `#d1fe17` (WCAG AAA compliant 14.02:1).
- **Typography:**
  - Persian: **Morabba** for display titles; **IRANSansX** (variable `100 1000`) for body.
  - English: **Oddval 600** for high-impact headings; **Satoshi Variable** (300–900) for body and numerals.

---

## 2. Zero-Leakage Mock Strategy

> **Core Principle:** The frontend is engineered and tested to 100% completion without any dependency on a live backend.

### 2.1. The Zero-Leakage Architectural Rule
- **Absolute Mock Isolation:** No component, hook, or page in `src/app/`, `src/modules/`, or `src/shared/` may ever import from a `mock` directory or have awareness that data is simulated.
- **Sole Import Bottleneck:** All data operations are invoked strictly via `@/sdk`:
  ```typescript
  // The only permitted data consumption pattern across the frontend:
  import { sdk } from '@/sdk';
  
  // Clean invocation without knowledge of whether it's mock or live:
  const result = await sdk.tools.generateImage(payload);
  const thread = await sdk.chat.getThread(threadId);
  ```

```mermaid
flowchart TD
    subgraph ClientCode["Frontend Components & Modules (src/app, src/modules)"]
        Chat["Chat Window"]
        Canvas["Canvas Board"]
        Assets["Asset Library"]
    end
    
    subgraph SingleBottleneck["Sole Bottleneck Gateway: src/sdk/index.ts"]
        TypeContract["Shared Interface: interface SdkClient"]
        Switch{"process.env.NEXT_PUBLIC_API_MODE === 'live'"}
    end
    
    subgraph Implementations["SDK Internal Implementations"]
        MockAdapter["MockAdapter (Simulated latency + AI Job Simulator)"]
        LiveAdapter["LiveAdapter (Real Fetch / WebSocket HTTP Client)"]
    end
    
    Chat -->|import { sdk } from '@/sdk'| TypeContract
    Canvas -->|import { sdk } from '@/sdk'| TypeContract
    Assets -->|import { sdk } from '@/sdk'| TypeContract
    
    TypeContract --> Switch
    Switch -->|false (Default Development)| MockAdapter
    Switch -->|true (Production Integration)| LiveAdapter
```

### 2.2. Single-Switch Migration Mechanism
The bottleneck file `src/sdk/index.ts` enforces the interface contract:

```typescript
// src/sdk/index.ts
import type { SdkClient } from './types';
import { mockSdkAdapter } from './mock/mock-adapter';
import { liveHttpSdkAdapter } from './live/live-adapter';

// Single environment switch:
const isLiveMode = process.env.NEXT_PUBLIC_API_MODE === 'live';

export const sdk: SdkClient = isLiveMode ? liveHttpSdkAdapter : mockSdkAdapter;
```

**Architectural Benefit:**  
Migrating from local mock development to the live production server requires **changing a single environment variable (`NEXT_PUBLIC_API_MODE="live"`)**, with zero lines of component, hook, or schema code needing alteration.

### 2.3. Mock SDK Simulation Capabilities (`src/sdk/mock/`):
1. **Network Latency Simulation:** Configurable latency (300ms to 800ms) to thoroughly test skeleton loading states.
2. **Asynchronous AI Job Simulator:**
   - Model execution returns an immediate `jobId`.
   - A background timer advances the simulated job lifecycle:
     $$\text{Pending } (0\%) \longrightarrow \text{Processing } (45\%) \longrightarrow \text{Done } (100\%)$$
   - Upon completion, a sample high-resolution output is added to the user's asset repository.
3. **Edge Case & Error Handling:**
   - Simulated `INSUFFICIENT_TOKENS` error triggers automatic redirection to `/settings/billing`.
   - Field validation error responses test form error state presentations.

---

## 3. Geometric Wireframing Phase (Simple Shapes — Figma Aligned)

Prior to writing rich visual styles or finalized CSS decorations, all layouts are built as **simple geometric wireframes (simple shapes)** strictly matching the Figma auto-layout grids.

### 3.1. Goals of Simple Shape Wireframing:
- Validate visual hierarchy, container queries, and spacing scales.
- Verify layout integrity across all 4 target breakpoints:
  - Mobile: `20rem` (320px)
  - Tablet: `48rem` (768px)
  - Desktop: `80rem` (1280px)
  - Wide: `120rem` (1920px)

### 3.2. Visual Language of Wireframes:
- Minimal gray containers with dashed borders (`border: 1px dashed var(--lemmo-border-default)`).
- Neutral skeleton boxes with fixed aspect ratios (`aspect-ratio: 16/9` for media placeholders).
- Pill shapes for action buttons without final icons or glow effects.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 [Top Header Rail]                               │
├──────────────┬───────────────────────────────────────────────────┬──────────────┤
│              │                                                   │ [Inspector]  │
│ [Left Rail]  │                 [Main Viewport]                   │              │
│ ┌──────────┐ │ ┌───────────────────────────────────────────────┐ │ ┌──────────┐ │
│ │  NavIcon │ │ │                                               │ │ │ PropBox  │ │
│ │  NavIcon │ │ │          (Canvas Board / Chat Stream)         │ │ │ PropBox  │ │
│ │  NavIcon │ │ │                                               │ │ └──────────┘ │
│ └──────────┘ │ └───────────────────────────────────────────────┘ │              │
│              │                                                   │              │
├──────────────┴───────────────────────────────────────────────────┴──────────────┤
│                         [Bottom Execution / Prompt Rail]                         │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Component Assembly & Progressive Replacement

Once geometric wireframe layouts are validated, they are progressively swapped with finalized components across three distinct layers:

### Layer 1: Design System Primitives (`src/shared/ui/primitives/`)
- Domain-agnostic components: `Button`, `Input`, `Textarea`, `Slider`, `Select`, `Modal`, `Tooltip`, `Badge`.
- Native attribute inheritance, mandatory `forwardRef`, and `asChild` Radix polymorphic pattern.

### Layer 2: Studio Shell Composites (`src/app/(workspace)/components/`)
- **`AppSidebar`**: Collapsible floating navigation rail with mini-rail mode for screens `< 48rem`.
- **`StudioHeader`**: Workspace status bar displaying brand triad, language switcher, live token balance, and `ActiveJobIndicator`.
- **`SurfaceSwitcher`**: Seamless switcher between linear Chat (`/chat`) and 2D Canvas (`/canvas`).

### Layer 3: Domain Modules (`src/modules/`)
- **Chat (`modules/chat`)**: Thread window, dual-sided message bubbles, slash-command popover (`CommandAutocomplete`).
- **Canvas (`modules/canvas`)**: Interactive graph board with Pan & Zoom, schema-rendered tool nodes, typed socket validation (`image` connects strictly to `image`).
- **Assets (`modules/assets`)**: Responsive media grid with file filtering and output viewer modal.

---

## 5. Schema-Driven Tool Rendering Engine

All dynamic surfaces with variable inputs (AI model parameters in chat, tool nodes in canvas) are **rendered entirely via JSON Tool Manifests** through `modules/tool-engine/schema-renderer`:

- **`FieldRenderer.tsx`**: Dynamic field mapper inspecting manifest types.
- **Form Controls:**
  - `TextField`: Text prompts and system instructions.
  - `ImageUploadField`: Drag-and-drop image upload or selection from local assets.
  - `SliderField`: Numerical range controls (Steps, CFG Scale, Denoising strength).
  - `SelectField`: Aspect ratio selectors (`1:1`, `16:9`, `9:16`) and style presets.
  - `ToggleField`: Boolean switches for advanced settings.

### Standard Mock Manifests:
1. `flux-dev`: Text-to-image with multi-field prompt, aspect ratio, and step slider.
2. `remove-background`: Single image input with transparent PNG output.
3. `upscale-ultra`: Image input with 2x/4x scale factor selection.
4. `face-swap`: Dual-image input (target image + source face) with type validation.

---

## 6. Directory Structure (`/app`)

```
app/
├── public/
│   ├── fonts/                            # Local WOFF2 fonts (Satoshi, Oddval, Morabba, IRANSansX)
│   └── mock-assets/                      # Sample images & videos for simulated AI outputs
│
├── src/
│   ├── app/                              # Next.js App Router layer
│   │   ├── (workspace)/                  # Authenticated studio shell
│   │   │   ├── layout.tsx                # Studio layout: sidebar, topbar, active job tracker
│   │   │   ├── chat/
│   │   │   │   ├── page.tsx              # Default new conversation
│   │   │   │   └── [threadId]/page.tsx   # Existing thread
│   │   │   ├── canvas/
│   │   │   │   ├── page.tsx              # Default board
│   │   │   │   └── [boardId]/page.tsx    # Targeted board
│   │   │   ├── gallery/page.tsx          # Community templates & prompts
│   │   │   ├── assets/page.tsx           # User generated media archive
│   │   │   └── settings/
│   │   │       └── billing/page.tsx      # Token balance, plan tiers, usage logs
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── layout.tsx
│   │   ├── layout.tsx                    # Root HTML layout with dir & theme injection
│   │   └── globals.css                   # Token imports & typographic definitions
│   │
│   ├── modules/                          # Domain logic layer
│   │   ├── tool-engine/                  # Tool engine core (registry, schema-renderer, job-manager)
│   │   ├── chat/                         # Chat components, command parser, hooks
│   │   ├── canvas/                       # Canvas graph board, tool nodes, connection rules
│   │   ├── assets/                       # Asset grid, filter logic, media previews
│   │   └── billing/                      # Billing cards, token purchase hooks
│   │
│   ├── sdk/                              # Single network gateway (Mock-first)
│   │   ├── client.ts                     # SDK entry point
│   │   ├── types.ts                      # Shared SdkClient interface
│   │   ├── mock/                         # Zero-leakage mock adapter & job simulator
│   │   ├── live/                         # Live backend HTTP/WS client (activated later)
│   │   └── interceptors/                 # Token exhaustion interceptor
│   │
│   ├── shared/                           # Domain-agnostic reusable primitives
│   │   ├── ui/
│   │   │   ├── primitives/               # Button, Input, Slider, Modal, Badge
│   │   │   └── wireframes/               # Initial simple geometric shape primitives
│   │   ├── hooks/                        # useDirection, useMediaQuery, useDebounce
│   │   └── lib/                          # Pure utilities
│   │
│   └── stores/                           # Global UI state (uiStore, themeStore)
│
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```
