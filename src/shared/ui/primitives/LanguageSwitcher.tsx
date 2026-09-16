/**
 * LanguageSwitcher — FA/EN locale toggle button.
 *
 * Calls toggleLocale() from the uiStore, which updates the html dir/lang
 * attributes in-place — no page refresh required.
 *
 * Standards:
 * - Icons: synthline/react with strokeWidth={1.5}
 * - Color: currentColor (inherits from theme)
 */

'use client';

import { useUiStore } from '@/stores/uiStore';

export function LanguageSwitcher() {
  const { locale, toggleLocale } = useUiStore();

  return (
    <button
      onClick={toggleLocale}
      aria-label={locale === 'fa' ? 'Switch to English' : 'Switch to Persian'}
      title={locale === 'fa' ? 'Switch to English' : 'Switch to Persian'}
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
      {/* Globe icon placeholder — replace with <IconGlobe> from synthline in M3 */}
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
      {/* Show the target locale label, not the current one */}
      <span>{locale === 'fa' ? 'EN' : 'FA'}</span>
    </button>
  );
}
