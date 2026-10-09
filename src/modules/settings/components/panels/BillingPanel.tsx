'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard01, Check01, Coins01 } from 'synthline/react';
import { useUiStore } from '@/stores/uiStore';
import { useStudioContext } from '@/shared/providers/StudioContextProvider';
import { sdk } from '@/sdk';
import SettingsHeader from '../SettingsHeader';
import SettingsSection from '../SettingsSection';
import LemmoButton from '../LemmoButton';

export interface BillingPanelProps {
  onShowToast: (msg: string) => void;
}

export default function BillingPanel({ onShowToast }: BillingPanelProps) {
  const { locale } = useUiStore();
  const { context } = useStudioContext();

  const tier = context?.entitlements?.tier || 'FREE';
  const walletBalance = context?.entitlements?.wallet_balance ?? 0;

  const [rateCard, setRateCard] = useState<import('@/sdk').PricingRateCard | null>(null);

  useEffect(() => {
    sdk.quota?.getPricing()
      .then((pricing) => setRateCard(pricing))
      .catch((err) => console.error('Failed to load quota pricing:', err));
  }, []);

  const planName = tier === 'ENTERPRISE' ? 'Studio Enterprise' : tier === 'PRO' ? 'Studio Pro' : 'Studio Free';
  const planPrice = tier === 'ENTERPRISE' ? '$99' : tier === 'PRO' ? '$29' : '$0';

  return (
    <div className="panel-container">
      <SettingsHeader
        title={locale === 'fa' ? 'صورت‌حساب و اشتراک' : 'Billing & Subscription'}
        description={
          locale === 'fa'
            ? 'مدیریت پلن فعال، سهمیه توکن‌ها و تعرفه مصرف ابزارهای استودیو لیمو.'
            : 'Manage your active subscription plan, token balances, and tool rate cards.'
        }
      />

      <SettingsSection title={locale === 'fa' ? 'موجودی کیف‌پول و سهمیه' : 'Wallet & Quota'}>
        <div className="wallet-card">
          <div className="wallet-header">
            <div className="wallet-icon">
              <Coins01 size={20} strokeWidth={1.5} />
            </div>
            <div className="wallet-info">
              <span className="wallet-label">
                {locale === 'fa' ? 'موجودی توکن / کردیت' : 'Available Token Balance'}
              </span>
              <span className="wallet-amount">{walletBalance.toLocaleString()} {rateCard?.currency || 'IRR'}</span>
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title={locale === 'fa' ? 'پلن جاری' : 'Active Plan'}>
        <div className="plan-card">
          <div className="plan-badge-row">
            <span className="plan-name">{planName}</span>
            <span className="plan-active-tag">
              <Check01 size={12} strokeWidth={2.4} />
              <span>{locale === 'fa' ? 'فعال' : 'Active'}</span>
            </span>
          </div>

          <p className="plan-description">
            {tier === 'ENTERPRISE'
              ? locale === 'fa'
                ? 'دسترسی سازمانی نامحدود، پردازش اختصاصی H100 و قرارداد SLA.'
                : 'Enterprise cluster access, dedicated H100 capacity, and custom SLA.'
              : tier === 'PRO'
              ? locale === 'fa'
                ? 'دسترسی کامل به بوم بی‌نهایت، ایجنت استودیو، ۴ مدل تولید تصویر و ۱۰ گیگابایت حافظه ابری.'
                : 'Unlimited infinite canvas, agent studio, 4 AI model integrations, and 10GB cloud asset storage.'
              : locale === 'fa'
              ? 'پلن پایه رایگان با دسترسی محدود به ابزارهای استاندارد.'
              : 'Free starter tier with standard tool access.'}
          </p>

          <div className="plan-price-row">
            <span className="plan-price">{planPrice}</span>
            <span className="plan-period">/ {locale === 'fa' ? 'ماهانه' : 'month'}</span>
          </div>

          <div className="plan-actions">
            <LemmoButton
              type="button"
              variant="primary"
              size="sm"
              onClick={() => onShowToast(locale === 'fa' ? 'به صفحه ارتقا هدایت می‌شوید' : 'Navigating to upgrade')}
            >
              {tier === 'ENTERPRISE'
                ? locale === 'fa' ? 'مدیریت اشتراک سازمانی' : 'Manage Enterprise Subscription'
                : locale === 'fa' ? 'ارتقا به پلن بالاتر' : 'Upgrade Plan'}
            </LemmoButton>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title={locale === 'fa' ? 'روش پرداخت پیش‌فرض' : 'Payment Method'}>
        <div className="payment-method-row">
          <div className="card-brand-icon">
            <CreditCard01 size={20} strokeWidth={1.5} />
          </div>
          <div className="card-meta">
            <span className="card-digits">•••• •••• •••• 4242</span>
            <span className="card-exp">
              {locale === 'fa' ? 'انقضا: ۱۲/۲۸' : 'Expires: 12/28'}
            </span>
          </div>
          <div className="card-actions">
            <LemmoButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onShowToast(locale === 'fa' ? 'فرم کارت باز شد' : 'Card modal opened')}
            >
              {locale === 'fa' ? 'ویرایش کارت' : 'Edit Card'}
            </LemmoButton>
          </div>
        </div>
      </SettingsSection>

      <style jsx>{`
        .panel-container {
          width: 100%;
        }

        .wallet-card {
          padding: var(--lemmo-space-400, 16px) var(--lemmo-space-500, 20px);
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border: var(--lemmo-stroke-thin, 1px) solid var(--lemmo-border-default, rgba(255, 255, 255, 0.15));
          border-radius: var(--lemmo-radius-card, 12px);
          margin-bottom: var(--lemmo-space-400, 16px);
        }

        .wallet-header {
          display: flex;
          align-items: center;
          gap: var(--lemmo-gap-3, 12px);
        }

        .wallet-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--lemmo-radius-200, 8px);
          background: color-mix(in srgb, var(--lemmo-surface-brand-background, #d1fe17) 12%, transparent);
          color: var(--lemmo-surface-brand-background, #d1fe17);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .wallet-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .wallet-label {
          font-size: var(--lemmo-type-size-050, 0.75rem);
          color: var(--lemmo-text-muted, #898a8b);
        }

        .wallet-amount {
          font-family: var(--lemmo-font-heading, inherit);
          font-size: var(--lemmo-type-size-400, 1.125rem);
          font-weight: var(--lemmo-font-weight-bold, 700);
          color: var(--lemmo-surface-brand-background, #d1fe17);
        }

        .plan-card {
          padding: var(--lemmo-space-500, 20px);
          background: var(--lemmo-surface-primary-background, #1c1e20);
          border: var(--lemmo-stroke-thin, 1px) solid var(--lemmo-border-default, rgba(255, 255, 255, 0.15));
          border-radius: var(--lemmo-radius-card, 12px);
          display: flex;
          flex-direction: column;
          gap: var(--lemmo-gap-3, 12px);
        }

        .plan-badge-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .plan-name {
          font-family: var(--lemmo-font-heading, inherit);
          font-size: var(--lemmo-type-size-400, 1.125rem);
          font-weight: var(--lemmo-font-weight-bold, 700);
          color: var(--lemmo-text-primary, #ffffff);
        }

        .plan-active-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: var(--lemmo-radius-pill, 9999px);
          background: color-mix(in srgb, var(--lemmo-surface-brand-background, #d1fe17) 12%, transparent);
          color: var(--lemmo-surface-brand-background, #d1fe17);
          font-size: var(--lemmo-type-size-050, 0.75rem);
          font-weight: var(--lemmo-font-weight-semi-bold, 600);
        }

        .plan-description {
          margin: 0;
          font-size: var(--lemmo-type-size-100, 0.8125rem);
          color: var(--lemmo-text-muted, #898a8b);
          line-height: var(--lemmo-type-leading-600, 1.5);
        }

        .plan-price-row {
          display: flex;
          align-items: baseline;
          gap: var(--lemmo-space-100, 4px);
        }

        .plan-price {
          font-family: var(--lemmo-font-heading, inherit);
          font-size: var(--lemmo-type-size-700, 1.75rem);
          font-weight: var(--lemmo-font-weight-bold, 700);
          color: var(--lemmo-surface-brand-background, #d1fe17);
        }

        .plan-period {
          font-size: var(--lemmo-type-size-050, 0.75rem);
          color: var(--lemmo-text-muted, #898a8b);
        }

        .plan-actions {
          margin-top: var(--lemmo-space-200, 8px);
          display: flex;
        }

        .payment-method-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--lemmo-space-400, 16px) 0;
          border-bottom: 1px dotted var(--lemmo-border-subtle, rgba(255, 255, 255, 0.08));
          gap: var(--lemmo-gap-3, 12px);
        }

        .card-brand-icon {
          width: 40px;
          height: 32px;
          border-radius: var(--lemmo-radius-150, 6px);
          background: var(--lemmo-surface-tertiary-background, #0a0c0e);
          border: var(--lemmo-stroke-thin, 1px) solid var(--lemmo-border-mid, rgba(255, 255, 255, 0.1));
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--lemmo-text-primary, #ffffff);
          flex-shrink: 0;
        }

        .card-meta {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .card-digits {
          font-family: var(--lemmo-font-mono, monospace);
          font-size: var(--lemmo-type-size-100, 0.8125rem);
          color: var(--lemmo-text-primary, #ffffff);
        }

        .card-exp {
          font-size: var(--lemmo-type-size-050, 0.75rem);
          color: var(--lemmo-text-muted, #898a8b);
          margin-top: 2px;
        }

        .card-actions {
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}
