# AGENTS.md — Operational Guide for Lemmo Studio App (`/app`)

> **Package Root:** `lemmo/app` (Standalone Git Repository: `lemmo-lab/app.git`)  
> **Role:** Active Workspace Studio Frontend (`lemmo-lab/app.git`)  
> **Status:** `Approved (راهنمای عملیاتی مصوب حاکمیتی)`  
> **Last Updated:** October 2026  
> **Binding Governance:** [`RULES.md`](./RULES.md), [`../RULES.md`](../RULES.md) (Section 10), [`../AGENTS.md`](../AGENTS.md) (Section 9), and [`DOC-FE-005`](../dotdive/docs/lemmo/02-frontend/style-guide.md)

---

## ۱. زمینه و پکیج‌های وابسته (Workspace Context)
این ریپوزیتوری فرانت‌اند استودیو پلتفرم Lemmo است که بر پایه Next.js 16 App Router، React 19، Zustand، `@tanstack/react-query` و توکن‌های طراحی `@lemmo-lab/tokens` توسعه می‌یابد.

### پکیج‌های برادر در فضای کاری چتری (Umbrella Workspace):
| مسیر نسبی | مخزن / پکیج | نقش و کاربرد |
|---|---|---|
| `../tokens/` | `lemmo-lab/tokens.git` | منبع توکن‌های طراحی دیزاین سیستم (`@lemmo-lab/tokens`). ویرایش مستقیم پوشه `dist/` آن ممنوع است. |
| `../fonts/` | `lemmo-lab/fonts.git` | فونت‌های وب محلی (IRANSansX, Morabba, Satoshi). لود از طریق `next/font/local`. |
| `../dotdive/` | `itstalentnet/dotdive.git` | **منبع موثق مستندات (SSOT)** پلتفرم در `dotdive/docs/lemmo/`. |
| `../api/` | `lemmo-lab/api.git` | میکروسرویس‌های بک‌اند، درگاه Kong و فایل قرارداد `api/infra/gateway/docs/openapi.yaml`. |
| `../auth/` | `lemmo-lab/auth.git` | سرویس میکروفرانت‌اند احراز هویت. |
| `../ui/` | — | **غیرفعال.** از آن ایمپورت نکنید. |

---

## ۲. دستورات عملیاتی خط فرمان (Developer Commands)

### حالت الف: اجرا از ریشه فضای کاری چتری (Umbrella Workspace Root)
```bash
# اجرای سرور توسعه
cd app && pnpm dev          # استارت سرور توسعه Next.js (پورت ۳۰۰۰)

# ارزیابی کیفیت و بیلد
cd app && pnpm build        # بیلد استندالون پروداکشن
cd app && pnpm lint         # اجرای ESLint و بررسی رول‌های معماری
cd app && pnpm test         # اجرای تست‌های واحد با Vitest

# تولید خودکار کلاینت قراردادها (Orval)
cd app && pnpm codegen      # بازتولید کلاینت در src/sdk/live/generated/ از روی openapi.yaml
```

### حالت ب: اجرا از داخل پوشه مخزن مستقل فرانت‌اند (`app/`)
```bash
# اجرای سرور توسعه
pnpm dev                    # استارت سرور توسعه Next.js (پورت ۳۰۰۰)

# ارزیابی کیفیت و بیلد
pnpm build                  # بیلد استندالون پروداکشن
pnpm lint                   # اجرای ESLint و بررسی رول‌های معماری
pnpm test                   # اجرای تست‌های واحد با Vitest

# تولید خودکار کلاینت قراردادها (Orval)
pnpm codegen                # بازتولید کلاینت در src/sdk/live/generated/ از روی openapi.yaml
```

---

## ۳. مرزهای معماری و قوانین بدون استثنا

### ۳.۱. کپسوله‌سازی شبکه و گلوگاه SDK (Zero-Endpoint Awareness)
- کامپوننت‌ها و ویوهای UI تحت هیچ شرایطی نباید آدرس‌های شبکه (`/api/v1/*`)، متدهای ترانسپورت یا کدهای تولیدی Orval را بشناسند.
- تمام واکشی‌ها و تعاملات سرور منحصراً از مرز پایدار و تایپ‌شده `@/sdk` عبور می‌کنند.
- مدیریت داده‌های دارای وضعیت، استریم‌ها و کش سرور به عنوان یک الگوی معماری استاندارد و توصیه‌شده درون **هوک‌های دامنه (Domain Hooks)** با TanStack Query سازماندهی می‌شود؛ بااین‌حال، فراخوانی مستقیم متدهای `@/sdk` برای اکشن‌های ساده و رویدادمحور مجاز است.

### ۳.۲. ممنوعیت داده‌های ماک در کلاینت (Zero-Client-Mock per ADR-016)
- وجود هرگونه پوشه `mock/`، آداپتور شبیه‌سازی محلی یا فلگ `API_MODE` در کلاینت منقرض و ممنوع است.
- کلاینت استودیو به عنوان یک Single Network Client عمل کرده و تمام ترافیک را از طریق پروکسی Next.js به درگاه Kong (پورت ۸۰۰۰) ارسال می‌کند.

### ۳.۳. استایل‌های منطقی و طراحی دوجهته (RTL/LTR)
- تگ ریشه به صورت `<html lang="fa" dir="rtl" data-theme="default">` تنظیم شده است.
- استفاده از `left` و `right` فیزیکی در CSS به کلی ممنوع است؛ همواره از خواص منطقی (`margin-inline-*`, `inset-inline-*`) استفاده کنید.
- سیستم مختصات آزاد دکارتی در کانواس با `transform: translate(x, y)` مدیریت شده و وضعیت قطعی استثنای آن در OQ-061 در دست بررسی است.

### ۳.۴. جهت وابستگی یک‌طرفه (One-Way Dependency)
```
app/ (مسیرها) → modules/ (ویوها و هوک‌ها) → tool-engine/ → sdk/ → backend
shared/ فاقد دانش دامنه است
stores/ فاقد ایمپورت ماژول‌های بیزینس است
```

---

## ۴. اقدامات پیش از توسعه و پروتکل رفع تعارض
1. **بررسی قراردادها:** پیش از نوشتن کدهای جدید در فرانت‌اند، مطمئن شوید که اندپوینت و فیلدهای مورد نظر در `openapi.yaml` ثبت شده و `pnpm codegen` اجرا شده باشد.
2. **پروتکل تعارض:** در صورت وجود ابهام میان دستور تسک و چک‌لیست انطباق، توسعه‌دهنده مجاز به اعمال تفسیر شخصی نیست و موظف است طبق بند ۸ در `AGENTS.md` مادر، سوال باز (Open Question) ثبت کند.
3. **پایان تسک:** هر تغییر باید با اجرای سبز `pnpm lint` و `pnpm build` همراه بوده و چک‌لیست انطباق تسک با ارائه شواهد پر شود.
