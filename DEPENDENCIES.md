# راهنمای منابع مشترک، پروژه‌های جانبی و وابستگی‌ها (App Dependencies & Integrations)

این سند مرجع آدرس‌ها، کارکرد و نحوه ایمپورت دارایی‌های مشترک مونو‌ریپو و پکیج‌های اختصاصی برای توسعه فرانت‌اند استودیو (`app`) است.

---

## ۱. جدول مرجع آدرس‌ها و کارکردها

| منبع / پروژه | مسیر / URL | نقش و کارکرد | نحوه ایمپورت / اتصال به `app` |
| :--- | :--- | :--- | :--- |
| **پکیج آیکون** | [https://github.com/itstalentnet/synthline](https://github.com/itstalentnet/synthline) | تنها کتابخانه رسمی آیکون‌های خطی با ضخامت `1.5` | `pnpm add synthline` <br> `import { IconSparkles } from 'synthline/react'` |
| **سیستم دیزاین توکن‌ها** | `@lemmo-lab/tokens` <br> `../tokens/` | پکیج اختصاصی دیزاین توکن‌ها با CLI و تم رسمی **پیش‌فرض دارک** (`default` — پس‌زمینه بوم `#131517`، رنگ شاخص لیمویی `#d1fe17`) | `pnpm add @lemmo-lab/tokens` <br> `@import "@lemmo-lab/tokens/css/variables.css"` |
| **فونت‌های رسمی** | `../fonts/fonts/` | وب‌فونت‌های اختصاصی WOFF2 فارسی و انگلیسی | کپی به `public/fonts/` و لود با `next/font/local` |
| **مستندات مرجع** | `../docs/` | منبع یگانه حقیقت (SSOT) قوانین معماری و فرانت | ارجاع در `README.md` و تطبیق با [DOC-FE-001](../docs/frontend/workspace-architecture.md) |
| **لندینگ پیج** | `../landing/` | وب‌سایت معرفی و مرجع نمایش عمومی | مرجع بصری و تطبیق برندینگ |
| **آرشیو کامپوننت‌ها (ui/)** | `../ui/` | **غیرفعال در فاز فعلی** (صرفاً آرشیو؛ در آینده با پکیج مجزا نصب می‌شود) | فعلاً هیچ ارتباط یا ایمپورتی وجود ندارد |

---

## ۲. مشخصات و قوانین فونت‌ها (`../fonts/fonts/`)

1. **`iransans/IRANSansXV.woff2` (فارسی):**
   - برای متون بدنه، فیلدها و توضیحات فارسی.
   - وزن متغیر `100 1000` با کلاس یا متغیر `--lemmo-font-sans-fa`.
2. **`morabba/Morabba-*.woff2` (فارسی):**
   - برای عناوین اصلی، هدرهای ابزار و تیترهای فارسی.
   - وزن‌های Regular (400), Medium (500), SemiBold (600), Bold (700).
3. **`oddval/Oddval-SemiBold.woff2` (انگلیسی):**
   - برای تیترهای انگلیسی بزرگ و لوگوتایپ (منحصراً وزن 600).
4. **`satoshi/Satoshi-Variable*.woff2` (انگلیسی):**
   - برای متون بدنه انگلیسی، اعداد و کدها (وزن متغیر ۳۰۰ تا ۹۰۰).

---

## ۳. پکیج آیکون Synthline (`synthline/react`)

```bash
pnpm add synthline
```

### استانداردهای پیاده‌سازی در کامپوننت‌ها:
- **`strokeWidth={1.5}`** (الزامی در همه جا).
- **`color="currentColor"`** (الزامی جهت ارث‌بری رنگ متن و تم).
- **مقیاس اندازه:** فقط `12`, `16`, `20`, `24`, `28` پیکسل.

```tsx
import { IconSparkles, IconLayers, IconChevronLeft } from 'synthline/react';

export function StudioButton() {
  return (
    <button className="btn-primary">
      <IconSparkles size={20} strokeWidth={1.5} color="currentColor" />
      <span>تولید محتوا</span>
    </button>
  );
}
```

---

## ۴. پکیج اختصاصی دیزاین سیستم: `@lemmo-lab/tokens`

پکیج رسمی توکن‌های دیزاین پروژه دارای CLI اختصاصی (`@lemmo-lab/tokens-cli`) بوده و با تم رسمی **پیش‌فرض دارک (`default`)** در استودیو بارگذاری می‌شود:

```bash
pnpm add @lemmo-lab/tokens
```

در فایل `src/app/globals.css`:
```css
/* متغیرهای پایه، فواصل ۴ پیکسلی و ریست دیزاین سیستم همراه با تم پیش‌فرض دارک (#131517 canvas) */
@import "@lemmo-lab/tokens/css/variables.css";

/* یا لود صریح استایل تم پیش‌فرض */
@import "@lemmo-lab/tokens/css/themes/default.css";
```

تنظیم در تگ ریشه (`src/app/layout.tsx`):
```html
<html lang="fa" dir="rtl" data-theme="default">
```

---

## ۵. وضعیت پروژه آرشیو کامپوننت‌ها (`ui/`)

پوشه `ui/` در ریشه مخزن حاوی آرشیو اولیه‌ی کامپوننت‌هاست. در فاز فعلی توسعه استودیو، **هیچ فایلی از این پوشه ایمپورت نخواهد شد** تا از هرگونه پیچیدگی و سردرگمی جلوگیری شود. پس از توسعه کامل کامپوننت‌ها، دسترسی به آن‌ها از طریق پکیج NPM مستقل فراهم خواهد شد.
