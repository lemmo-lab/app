'use client';

import React from 'react';
import { Ticket01, InfoCircle } from 'synthline/react';
import { useUiStore } from '@/stores/uiStore';
import SettingsHeader from '../SettingsHeader';
import SettingsSection from '../SettingsSection';

export interface PromoPanelProps {
  onShowToast: (msg: string) => void;
}

/**
 * Beta invite codes are not redeemable from the studio client.
 *
 * Invite validation, beta capacity, and one-time gift issuance are owned by the
 * responsible backend service through the Quota Claim engine. No such contract is
 * exposed yet (tracked as P06-BETA-ACCESS integration), so this panel must not
 * simulate redemption: a client-side "apply" that invents a credit amount would
 * fabricate financial state (ADR-016 Zero-Client-Mock, F-06).
 *
 * The panel therefore states the current status truthfully and performs no call.
 */
export default function PromoPanel({ onShowToast }: PromoPanelProps) {
  const { locale } = useUiStore();

  return (
    <div className="panel-container">
      <SettingsHeader
        title={locale === 'fa' ? 'کد دعوت بتا' : 'Beta Invite Code'}
        description={
          locale === 'fa'
            ? 'اعتبار دسترسی بتا فقط توسط سرویس مسئول و از طریق موتور Claim در Quota اعطا می‌شود.'
            : 'Beta access is granted exclusively by the responsible service via the Quota Claim engine.'
        }
      />

      <SettingsSection title={locale === 'fa' ? 'وضعیت' : 'Status'}>
        <div className="promo-status-card">
          <div className="promo-icon-wrapper" aria-hidden="true">
            <Ticket01 size={18} strokeWidth={1.5} />
          </div>
          <div className="promo-status-copy">
            <span className="promo-status-title">
              {locale === 'fa' ? 'قابلیت فعال‌سازی کد دعوت هنوز در دسترس نیست' : 'Invite redemption is not available yet'}
            </span>
            <p className="promo-status-detail">
              {locale === 'fa'
                ? 'در حال حاضر هیچ کد دعوتی از سمت این کلاینت پردازش نمی‌شود. اعتبارسنجی کد، سقف ظرفیت بتا و اعطای یک‌باره هدیه در بک‌اند و از مسیر Claim انجام می‌شود؛ تا زمانی که این قرارداد منتشر شود، این بخش عمداً هیچ اعتباری نمایش یا اعطا نمی‌کند.'
                : 'No invite code is processed from this client. Code validation, beta capacity limits, and one-time gift issuance happen server-side through the Claim flow; until that contract is published this section intentionally grants and displays nothing.'}
            </p>
          </div>
        </div>

        <div className="promo-notice" role="note">
          <InfoCircle size={14} strokeWidth={1.5} color="currentColor" />
          <span>
            {locale === 'fa'
              ? 'موجودی و اعتبار شما از سرویس Context و Quota خوانده می‌شود و هیچ مقدار محلی در این صفحه محاسبه یا نگهداری نمی‌شود.'
              : 'Your balance and entitlements are read from the Context and Quota services; no value is computed or stored locally on this page.'}
          </span>
        </div>

        <SettingsSection>
          <div className="promo-noop">
            <button
              type="button"
              className="promo-noop-btn"
              onClick={() =>
                onShowToast(
                  locale === 'fa'
                    ? 'فعال‌سازی کد دعوت هنوز در این نسخه در دسترس نیست'
                    : 'Invite activation is not available in this release'
                )
              }
            >
              {locale === 'fa' ? 'فعال‌سازی کد' : 'Activate code'}
            </button>
          </div>
        </SettingsSection>
      </SettingsSection>

      <style jsx>{`
        .panel-container {
          width: 100%;
        }

        .promo-status-card {
          display: flex;
          align-items: flex-start;
          gap: var(--lemmo-space-300, 12px);
          padding: var(--lemmo-space-400, 16px);
          border: 1px solid var(--lemmo-border-default, rgba(255, 255, 255, 0.12));
          border-radius: var(--lemmo-radius-200, 8px);
          background: var(--lemmo-surface-secondary-background, #23262a);
        }

        .promo-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: var(--lemmo-radius-200, 8px);
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border: 1px solid var(--lemmo-stroke-thin, 1px) solid var(--lemmo-border-default, rgba(255, 255, 255, 0.12));
          flex-shrink: 0;
          color: var(--lemmo-surface-brand-background, #d1fe17);
        }

        .promo-status-copy {
          display: flex;
          flex-direction: column;
          gap: var(--lemmo-space-200, 8px);
        }

        .promo-status-title {
          font-size: var(--lemmo-type-size-100, 0.8125rem);
          font-weight: var(--lemmo-font-weight-semibold, 600);
          color: var(--lemmo-text-primary, #ffffff);
        }

        .promo-status-detail {
          margin: 0;
          font-size: var(--lemmo-type-size-050, 0.75rem);
          line-height: 1.6;
          color: var(--lemmo-text-muted, #898a8b);
        }

        .promo-notice {
          display: flex;
          align-items: center;
          gap: var(--lemmo-space-200, 8px);
          margin-block-start: var(--lemmo-space-300, 12px);
          font-size: var(--lemmo-type-size-050, 0.75rem);
          color: var(--lemmo-text-muted, #898a8b);
        }

        .promo-noop {
          margin-block-start: var(--lemmo-space-400, 16px);
        }

        .promo-noop-btn {
          padding: var(--lemmo-space-200, 8px) var(--lemmo-space-400, 16px);
          border: 1px solid var(--lemmo-border-default, rgba(255, 255, 255, 0.12));
          border-radius: var(--lemmo-radius-pill, 9999px);
          background: transparent;
          color: var(--lemmo-text-muted, #898a8b);
          font-size: var(--lemmo-type-size-050, 0.75rem);
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}