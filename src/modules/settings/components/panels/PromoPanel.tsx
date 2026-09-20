'use client';

import React, { useState } from 'react';
import { Ticket01, Check01 } from 'synthline/react';
import { useUiStore } from '@/stores/uiStore';
import SettingsHeader from '../SettingsHeader';
import SettingsSection from '../SettingsSection';
import SettingsRow from '../SettingsRow';
import LemmoInput from '../LemmoInput';
import LemmoButton from '../LemmoButton';
import type { PromoCodeItem } from '../../types';

export interface PromoPanelProps {
  onShowToast: (msg: string) => void;
}

export default function PromoPanel({ onShowToast }: PromoPanelProps) {
  const { locale } = useUiStore();
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promosList, setPromosList] = useState<PromoCodeItem[]>([
    {
      code: 'STUDIO-PRO-2026',
      title: locale === 'fa' ? 'بسته ۵۰۰ توکن هدیه افتتاحیه' : 'Launch Bonus 500 Credits',
      discount: '500 Credits',
      status: 'active',
      expiresAt: '2026-12-31',
    },
    {
      code: 'EARLY-CREATOR-50',
      title: locale === 'fa' ? 'تخفیف ۵۰٪ اشتراک ماه اول' : '50% First Month Discount',
      discount: '50% OFF',
      status: 'used',
      expiresAt: '2026-08-15',
    },
  ]);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;

    const newCode = promoCodeInput.trim().toUpperCase();
    const newPromo: PromoCodeItem = {
      code: newCode,
      title: locale === 'fa' ? 'اعتبار اختصاصی هدیه' : 'Creator Gift Credits',
      discount: '250 Credits',
      status: 'active',
      expiresAt: '2026-11-30',
    };

    setPromosList([newPromo, ...promosList]);
    setPromoCodeInput('');
    onShowToast(locale === 'fa' ? 'کد تخفیف با موفقیت اعمال شد' : 'Promo code redeemed');
  };

  return (
    <div className="panel-container">
      <SettingsHeader
        title={locale === 'fa' ? 'کد تخفیف و جوایز' : 'Promo Codes & Credits'}
        description={
          locale === 'fa'
            ? 'کدهای هدیه، بن‌های تخفیف و بسته‌های اعتباری استودیو لیمو را فعال کنید.'
            : 'Redeem coupons, gift codes, and seasonal compute credits.'
        }
      />

      <SettingsSection title={locale === 'fa' ? 'ثبت کد جدید' : 'Redeem Code'}>
        <form onSubmit={handleApplyPromo} className="promo-form">
          <SettingsRow
            label={locale === 'fa' ? 'کد هدیه یا تخفیف' : 'Enter promo code'}
            htmlFor="promo-input"
          >
            <div className="promo-input-row">
              <LemmoInput
                id="promo-input"
                placeholder="PROMO-CODE-XXXX"
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
              />
              <LemmoButton
                type="submit"
                variant="primary"
                size="md"
                disabled={!promoCodeInput.trim()}
              >
                {locale === 'fa' ? 'اعمال کد' : 'Apply'}
              </LemmoButton>
            </div>
          </SettingsRow>
        </form>
      </SettingsSection>

      <SettingsSection title={locale === 'fa' ? 'کدهای فعال و سوابق' : 'Active & Past Promos'}>
        {promosList.map((item) => (
          <div key={item.code} className="promo-card-row">
            <div className="promo-meta-side">
              <div className="promo-icon-wrapper">
                <Ticket01 size={18} strokeWidth={1.5} />
              </div>
              <div>
                <div className="promo-code-title">
                  <code>{item.code}</code>
                  <span className="promo-discount-badge">{item.discount}</span>
                </div>
                <p className="promo-desc-line">{item.title}</p>
              </div>
            </div>

            <div className="promo-status-side">
              {item.status === 'active' ? (
                <span className="status-badge-active">
                  <Check01 size={12} strokeWidth={2.4} />
                  <span>{locale === 'fa' ? 'فعال' : 'Active'}</span>
                </span>
              ) : (
                <span className="status-badge-used">
                  {locale === 'fa' ? 'مصرف‌شده' : 'Redeemed'}
                </span>
              )}
            </div>
          </div>
        ))}
      </SettingsSection>

      <style jsx>{`
        .panel-container {
          width: 100%;
        }

        .promo-input-row {
          display: flex;
          align-items: center;
          gap: var(--lemmo-gap-2, 8px);
          width: 100%;
        }

        .promo-card-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--lemmo-space-400, 16px) 0;
          border-bottom: 1px dotted var(--lemmo-border-subtle, rgba(255, 255, 255, 0.08));
          gap: var(--lemmo-gap-4, 16px);
        }

        .promo-meta-side {
          display: flex;
          align-items: center;
          gap: var(--lemmo-gap-3, 12px);
        }

        .promo-icon-wrapper {
          width: 36px;
          height: 36px;
          border-radius: var(--lemmo-radius-200, 8px);
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border: var(--lemmo-stroke-thin, 1px) solid var(--lemmo-border-default, rgba(255, 255, 255, 0.12));
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--lemmo-surface-brand-background, #d1fe17);
          flex-shrink: 0;
        }

        .promo-code-title {
          display: flex;
          align-items: center;
          gap: var(--lemmo-gap-2, 8px);
        }

        .promo-code-title code {
          font-family: var(--lemmo-font-mono, monospace);
          font-weight: var(--lemmo-font-weight-bold, 700);
          font-size: var(--lemmo-type-size-100, 0.8125rem);
          color: var(--lemmo-text-primary, #ffffff);
        }

        .promo-discount-badge {
          display: inline-block;
          padding: 1px 6px;
          font-size: var(--lemmo-type-size-050, 0.6875rem);
          font-weight: var(--lemmo-font-weight-semi-bold, 600);
          border-radius: var(--lemmo-radius-pill, 9999px);
          background: color-mix(in srgb, var(--lemmo-surface-brand-background, #d1fe17) 12%, transparent);
          color: var(--lemmo-surface-brand-background, #d1fe17);
        }

        .promo-desc-line {
          margin: 2px 0 0;
          font-size: var(--lemmo-type-size-050, 0.75rem);
          color: var(--lemmo-text-muted, #898a8b);
        }

        .promo-status-side {
          flex-shrink: 0;
        }

        .status-badge-active {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          font-size: var(--lemmo-type-size-050, 0.75rem);
          font-weight: var(--lemmo-font-weight-medium, 500);
          border-radius: var(--lemmo-radius-pill, 9999px);
          background: color-mix(in srgb, var(--lemmo-border-success, #2eb844) 15%, transparent);
          color: var(--lemmo-border-success, #2eb844);
        }

        .status-badge-used {
          display: inline-block;
          padding: 2px 8px;
          font-size: var(--lemmo-type-size-050, 0.75rem);
          border-radius: var(--lemmo-radius-pill, 9999px);
          background: var(--lemmo-surface-secondary-background, #23262a);
          color: var(--lemmo-text-muted, #898a8b);
        }
      `}</style>
    </div>
  );
}
