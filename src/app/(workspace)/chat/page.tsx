/**
 * Chat Page — Lemmo Chat Studio surface.
 * M1: Foundation test page — validates design tokens, fonts, and i18n switching.
 * TODO M6: Implement ChatWindow, CommandAutocomplete, InlineToolForm.
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
      {/* Minimal test header */}
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
        {/* Lemmo triad logo — 3-dot mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}
            aria-label="Lemmo Triad Logo"
          >
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--lemmo-interactive-primary, #d1fe17)', display: 'inline-block' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--lemmo-interactive-primary, #d1fe17)', display: 'inline-block', opacity: 0.6 }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--lemmo-interactive-primary, #d1fe17)', display: 'inline-block', opacity: 0.3 }} />
          </span>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--lemmo-text-primary, #f0f0f0)', margin: 0 }}>
            Lemmo Studio
          </h1>
        </div>

        <LanguageSwitcher />
      </header>

      {/* M1 validation section */}
      <section
        style={{
          maxWidth: '48rem',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {/* Checklist */}
        <div
          style={{
            padding: '1.5rem',
            background: 'var(--lemmo-surface-primary, #1a1d20)',
            borderRadius: 'var(--lemmo-radius-card, 0.75rem)',
            border: '1px solid var(--lemmo-border-default, #2a2d30)',
          }}
        >
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--lemmo-interactive-primary, #d1fe17)' }}>
            ✅ M1 Foundation — Complete
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--lemmo-text-secondary, #8a8f96)', fontSize: '0.875rem' }}>
            <li>✓ Next.js App Router + React 19.3.0 + TypeScript strict</li>
            <li>✓ Standard layer structure (modules / sdk / shared / stores)</li>
            <li>✓ @lemmo-lab/tokens design tokens (Dark Default theme)</li>
            <li>✓ 4-font stack: Morabba, IRANSansX, Oddval, Satoshi</li>
            <li>✓ Bilingual i18n engine + RTL/LTR switch (try the button above)</li>
            <li>✓ @/sdk bottleneck with Mock Adapter</li>
            <li>✓ Zustand uiStore + TanStack Query</li>
            <li>✓ synthline icon pack installed</li>
          </ul>
        </div>

        {/* Font showcase */}
        <div
          style={{
            padding: '1.5rem',
            background: 'var(--lemmo-surface-primary, #1a1d20)',
            borderRadius: 'var(--lemmo-radius-card, 0.75rem)',
            border: '1px solid var(--lemmo-border-default, #2a2d30)',
          }}
        >
          <h2 style={{ fontFamily: 'Morabba, sans-serif', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--lemmo-text-primary, #f0f0f0)' }}>
            نمونه عنوان — Morabba Bold
          </h2>
          <p style={{ fontFamily: 'IRANSansX, sans-serif', fontSize: '1rem', lineHeight: 1.8, color: 'var(--lemmo-text-secondary, #8a8f96)', marginBottom: '1rem' }}>
            متن بدنه فارسی با فونت IRANSansX — Persian body text sample.
          </p>
          <h3 style={{ fontFamily: 'Oddval, sans-serif', fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--lemmo-text-primary, #f0f0f0)' }}>
            Oddval SemiBold — Display Heading
          </h3>
          <p style={{ fontFamily: 'Satoshi, sans-serif', fontSize: '0.9375rem', color: 'var(--lemmo-text-secondary, #8a8f96)' }}>
            Satoshi Variable body text — 300 to 900 weight range.
            The quick brown fox jumps over the lazy dog.
          </p>
        </div>

        {/* Next milestone hint */}
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
          Next: M2 — Figma-aligned geometric wireframing
        </div>
      </section>
    </div>
  );
}
