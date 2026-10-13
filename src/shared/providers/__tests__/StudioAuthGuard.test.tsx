import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { PlatformApiError } from '@/sdk/errors';

const fixture = vi.hoisted(() => ({ locale: 'en', error: null as Error | null }));
vi.mock('next/navigation', () => ({ usePathname: () => '/app' }));
vi.mock('@/sdk', async () => ({ PlatformApiError: (await import('@/sdk/errors')).PlatformApiError }));
vi.mock('@/stores/uiStore', () => ({ useUiStore: (selector: (value: { locale: string }) => unknown) => selector(fixture) }));
vi.mock('../StudioContextProvider', () => ({ useStudioContext: () => ({ state: 'error', error: fixture.error, retry: vi.fn() }) }));
import { StudioAuthGuard } from '../StudioAuthGuard';

describe('Context service availability feedback', () => {
  it.each(['en', 'fa'])('renders actionable localized 503 feedback in %s', (locale) => {
    fixture.locale = locale;
    fixture.error = new PlatformApiError(503, { reason: 'ERROR_REASON_SERVICE_UNAVAILABLE', error: 'private downstream diagnostic' });
    const html = renderToStaticMarkup(<StudioAuthGuard><div>Protected studio</div></StudioAuthGuard>);
    expect(html).toContain(locale === 'fa' ? 'سرویس موقتاً در دسترس نیست' : 'Service temporarily unavailable');
    expect(html).toContain(locale === 'fa' ? 'تلاش مجدد' : 'Retry connection');
    expect(html).not.toContain('private downstream diagnostic');
    expect(html).not.toContain('Protected studio');
    expect(html).not.toContain('Redirecting');
  });
  it('distinguishes incomplete accounts from a network outage', () => {
    fixture.locale = 'en';
    fixture.error = new PlatformApiError(503, { reason: 'ERROR_REASON_USER_RECORD_NOT_FOUND' });
    expect(renderToStaticMarkup(<StudioAuthGuard><div /></StudioAuthGuard>)).toContain('Your account is not ready yet');
  });
});
