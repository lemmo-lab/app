/**
 * LanguageSwitcher — کلید تعویض زبان فارسی/انگلیسی
 *
 * این کامپوننت در StudioHeader (M3) جاسازی می‌شود.
 * در M1 به عنوان یک primitive مستقل پیاده‌سازی می‌شود.
 *
 * استانداردها:
 * - آیکون: synthline/react با strokeWidth={1.5}
 * - رنگ: currentColor (ارث‌بری از تم)
 * - بدون re-render کامل صفحه — فقط از-روزنه‌ی‌store
 */

'use client';

import { useUiStore } from '@/stores/uiStore';

export function LanguageSwitcher() {
  const { locale, toggleLocale } = useUiStore();

  return (
    <button
      onClick={toggleLocale}
      aria-label={locale === 'fa' ? 'Switch to English' : 'تغییر به فارسی'}
      title={locale === 'fa' ? 'Switch to English' : 'تغییر به فارسی'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        padding: '0.375rem 0.75rem',
        background: 'var(--lemmo-surface-secondary, #22262a)',
        border: '1px solid var(--lemmo-border-default, #2a2d30)',
        borderRadius: 'var(--lemmo-radius-base, 0.5rem)',
        color: 'var(--lemmo-text-primary, #f0f0f0)',
        fontSize: '0.875rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'background 0.15s, border-color 0.15s',
        fontFamily: 'inherit',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background =
          'var(--lemmo-surface-hover, #2a2e33)';
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          'var(--lemmo-border-strong, #404448)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background =
          'var(--lemmo-surface-secondary, #22262a)';
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          'var(--lemmo-border-default, #2a2d30)';
      }}
    >
      {/* نمایش وضعیت فعلی */}
      <span
        style={{
          width: '1.25rem',
          height: '1.25rem',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.875rem',
        }}
      >
        🌐
      </span>
      <span>{locale === 'fa' ? 'EN' : 'FA'}</span>
    </button>
  );
}
