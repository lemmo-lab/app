/**
 * Chat Page — صفحه استودیوی چت
 * M1: صفحه تست برای اعتبارسنجی توکن‌ها، فونت‌ها و i18n
 * M6: پیاده‌سازی کامل ChatWindow, CommandAutocomplete, InlineToolForm
 */

import { LanguageSwitcher } from '@/shared/ui/primitives/LanguageSwitcher';

export default function ChatPage() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--lemmo-canvas-bg, #131517)',
        color: 'var(--lemmo-text-primary, #f0f0f0)',
        padding: '2rem',
        fontFamily: 'inherit',
      }}
    >
      {/* هدر ساده تست */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '3rem',
          padding: '1rem 1.5rem',
          background: 'var(--lemmo-surface-primary, #1a1d20)',
          borderRadius: 'var(--lemmo-radius-card, 0.75rem)',
          border: '1px solid var(--lemmo-border-default, #2a2d30)',
        }}
      >
        {/* لوگوی لیمو — ترایاد ۳ نقطه */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              display: 'inline-flex',
              gap: '4px',
              alignItems: 'center',
            }}
            aria-label="Lemmo Triad Logo"
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: 'var(--lemmo-interactive-primary, #d1fe17)',
                display: 'inline-block',
              }}
            />
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: 'var(--lemmo-interactive-primary, #d1fe17)',
                display: 'inline-block',
                opacity: 0.6,
              }}
            />
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: 'var(--lemmo-interactive-primary, #d1fe17)',
                display: 'inline-block',
                opacity: 0.3,
              }}
            />
          </span>
          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'var(--lemmo-text-primary, #f0f0f0)',
              margin: 0,
            }}
          >
            Lemmo Studio
          </h1>
        </div>

        <LanguageSwitcher />
      </header>

      {/* بخش تست M1 */}
      <section
        style={{
          maxWidth: '48rem',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {/* تست توکن‌های رنگی */}
        <div
          style={{
            padding: '1.5rem',
            background: 'var(--lemmo-surface-primary, #1a1d20)',
            borderRadius: 'var(--lemmo-radius-card, 0.75rem)',
            border: '1px solid var(--lemmo-border-default, #2a2d30)',
          }}
        >
          <h2
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '1rem',
              color: 'var(--lemmo-interactive-primary, #d1fe17)',
            }}
          >
            ✅ M1 Foundation — مایلستون ۱ آماده است
          </h2>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              color: 'var(--lemmo-text-secondary, #8a8f96)',
              fontSize: '0.875rem',
            }}
          >
            <li>✓ Next.js App Router + React 19.3.0 + TypeScript strict</li>
            <li>✓ ساختار استاندارد لایه‌ها (modules/sdk/shared/stores)</li>
            <li>✓ توکن‌های دیزاین سیستم @lemmo-lab/tokens (Dark Default)</li>
            <li>✓ تایپوگرافی ۴گانه: Morabba, IRANSansX, Oddval, Satoshi</li>
            <li>✓ موتور i18n دوزبانه + سوئیچ RTL/LTR (دکمه بالا را امتحان کنید)</li>
            <li>✓ گلوگاه @/sdk با Mock Adapter آماده</li>
            <li>✓ Zustand uiStore + React Query</li>
            <li>✓ Synthline icon pack نصب شده</li>
          </ul>
        </div>

        {/* تست فونت‌ها */}
        <div
          style={{
            padding: '1.5rem',
            background: 'var(--lemmo-surface-primary, #1a1d20)',
            borderRadius: 'var(--lemmo-radius-card, 0.75rem)',
            border: '1px solid var(--lemmo-border-default, #2a2d30)',
          }}
        >
          <h2
            style={{
              fontFamily: 'Morabba, sans-serif',
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
              color: 'var(--lemmo-text-primary, #f0f0f0)',
            }}
          >
            نمونه عنوان با فونت موربا
          </h2>
          <p
            style={{
              fontFamily: 'IRANSansX, sans-serif',
              fontSize: '1rem',
              lineHeight: 1.8,
              color: 'var(--lemmo-text-secondary, #8a8f96)',
              marginBottom: '1rem',
            }}
          >
            این یک نمونه متن فارسی با فونت IRANSansX است. متن بدنه باید با این فونت نمایش داده شود.
          </p>
          <h3
            style={{
              fontFamily: 'Oddval, sans-serif',
              fontSize: '1.25rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
              color: 'var(--lemmo-text-primary, #f0f0f0)',
            }}
          >
            Oddval SemiBold Display
          </h3>
          <p
            style={{
              fontFamily: 'Satoshi, sans-serif',
              fontSize: '0.9375rem',
              color: 'var(--lemmo-text-secondary, #8a8f96)',
            }}
          >
            Satoshi Variable body text — 300 to 900 weight range.
            The quick brown fox jumps over the lazy dog.
          </p>
        </div>

        {/* مرحله بعد */}
        <div
          style={{
            padding: '1rem 1.5rem',
            background: 'transparent',
            border: '1px dashed var(--lemmo-border-default, #2a2d30)',
            borderRadius: 'var(--lemmo-radius-card, 0.75rem)',
            color: 'var(--lemmo-text-tertiary, #5a5f66)',
            fontSize: '0.875rem',
            textAlign: 'center',
          }}
        >
          M2: وایرفریمینگ هندسی ساده — نقطه بعدی توسعه
        </div>
      </section>
    </div>
  );
}
